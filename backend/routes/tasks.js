const express = require('express');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { User, Task, Notification } = require('../models');
const { authenticate, isAdmin } = require('../middleware/auth');
const { sendTaskAssignedEmail, sendTaskCompletedEmail, sendTaskUpdatedEmail } = require('../services/emailService');

const router = express.Router();

// Helper function to create notification
const createNotification = async (userId, type, title, message, taskId, io) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      taskId
    });

    // Emit real-time notification via Socket.io
    if (io) {
      io.to(userId.toString()).emit('notification', {
        id: notification.id,
        type,
        title,
        message,
        taskId,
        createdAt: notification.createdAt
      });
    }

    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
  }
};

// @route   GET /api/tasks
// @desc    Get all tasks (admin) or assigned tasks (employee)
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, priority, search, limit } = req.query;
    let where = {};

    // If employee, only show their tasks
    if (req.user.role === 'employee') {
      where.assignedToId = req.user.id;
    }

    // Apply filters
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const queryOptions = {
      where,
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email', 'employeeId'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    };

    if (limit) {
      queryOptions.limit = parseInt(limit);
    }

    const tasks = await Task.findAll(queryOptions);

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks/stats
// @desc    Get task statistics
// @access  Private
router.get('/stats', authenticate, async (req, res) => {
  try {
    let where = {};
    
    // If employee, only their tasks
    if (req.user.role === 'employee') {
      where.assignedToId = req.user.id;
    }

    const total = await Task.count({ where });
    const completed = await Task.count({ where: { ...where, status: 'completed' } });
    const pending = await Task.count({ where: { ...where, status: 'pending' } });
    const inProgress = await Task.count({ where: { ...where, status: 'in-progress' } });
    const overdue = await Task.count({
      where: {
        ...where,
        status: { [Op.ne]: 'completed' },
        dueDate: { [Op.lt]: new Date() }
      }
    });

    // Get employee-wise distribution (admin only)
    let employeeStats = [];
    if (req.user.role === 'admin') {
      const employees = await User.findAll({
        where: { role: 'employee', isActive: true },
        attributes: ['id', 'name'],
        include: [{
          model: Task,
          as: 'assignedTasks',
          attributes: ['id', 'status'],
          required: false
        }]
      });

      employeeStats = employees.map(emp => {
        const tasks = emp.assignedTasks || [];
        return {
          employeeId: emp.id,
          employeeName: emp.name,
          total: tasks.length,
          completed: tasks.filter(t => t.status === 'completed').length,
          pending: tasks.filter(t => t.status === 'pending').length,
          inProgress: tasks.filter(t => t.status === 'in-progress').length
        };
      });
    }

    res.json({
      total,
      completed,
      pending,
      inProgress,
      overdue,
      employeeStats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email', 'employeeId'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check access rights
    if (req.user.role === 'employee' && task.assignedToId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/tasks
// @desc    Create new task (admin only)
// @access  Private/Admin
router.post('/', [
  authenticate,
  isAdmin,
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('assignedTo').notEmpty(),
  body('priority').isIn(['low', 'medium', 'high', 'urgent']),
  body('dueDate').isISO8601()
], async (req, res) => {
  try {
    console.log('📝 Task creation request:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('❌ Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, assignedTo, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedToId: assignedTo,
      createdById: req.user.id,
      priority,
      dueDate,
      status: 'pending'
    });

    await task.reload({
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email', 'employeeId'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name', 'email'] }
      ]
    });

    // Create notification for assigned employee
    const io = req.app.get('io');
    await createNotification(
      assignedTo,
      'task_assigned',
      'New Task Assigned',
      `You have been assigned a new task: ${title}`,
      task.id,
      io
    );

    // Send email notification
    await sendTaskAssignedEmail(
      task.assignedTo.email,
      task.assignedTo.name,
      title,
      description,
      dueDate,
      priority,
      req.user.name
    );

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email', 'employeeId'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, assignedTo, priority, dueDate, status } = req.body;

    // Admin can update everything, employee can only update status
    if (req.user.role === 'admin') {
      if (title) task.title = title;
      if (description) task.description = description;
      if (assignedTo) task.assignedToId = assignedTo;
      if (priority) task.priority = priority;
      if (dueDate) task.dueDate = dueDate;
      if (status) task.status = status;
    } else if (req.user.role === 'employee') {
      // Employee can only update their own tasks' status
      if (task.assignedToId !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      if (status) task.status = status;
    }

    // Set completion date
    if (status === 'completed' && !task.completedAt) {
      task.completedAt = new Date();
    } else if (status !== 'completed') {
      task.completedAt = null;
    }

    await task.save();
    await task.reload({
      include: [
        { model: User, as: 'assignedTo', attributes: ['id', 'name', 'email', 'employeeId'] },
        { model: User, as: 'createdBy', attributes: ['id', 'name', 'email'] }
      ]
    });

    // Create notifications
    const io = req.app.get('io');

    if (status === 'completed') {
      // Notify admin about completion
      await createNotification(
        task.createdById,
        'task_completed',
        'Task Completed',
        `${task.assignedTo.name} completed: ${task.title}`,
        task.id,
        io
      );

      // Send email to admin
      await sendTaskCompletedEmail(
        task.createdBy.email,
        task.createdBy.name,
        task.assignedTo.name,
        task.title
      );
    } else if (req.user.role === 'admin') {
      // Notify employee about update
      await createNotification(
        task.assignedToId,
        'task_updated',
        'Task Updated',
        `Task "${task.title}" has been updated`,
        task.id,
        io
      );

      // Send email to employee
      await sendTaskUpdatedEmail(
        task.assignedTo.email,
        task.assignedTo.name,
        task.title
      );
    }

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task (admin only)
// @access  Private/Admin
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.destroy();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
