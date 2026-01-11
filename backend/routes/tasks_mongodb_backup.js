const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const Notification = require('../models/Notification');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Helper function to create notification
const createNotification = async (userId, type, title, message, taskId, io) => {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      taskId
    });
    await notification.save();

    // Emit real-time notification via Socket.io
    if (io) {
      io.to(userId.toString()).emit('notification', {
        id: notification._id,
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
    const { status, priority, search } = req.query;
    let query = {};

    // If employee, only show their tasks
    if (req.user.role === 'employee') {
      query.assignedTo = req.user._id;
    }

    // Apply filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email employeeId')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });

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
    let query = {};
    
    // If employee, only their tasks
    if (req.user.role === 'employee') {
      query.assignedTo = req.user._id;
    }

    const total = await Task.countDocuments(query);
    const completed = await Task.countDocuments({ ...query, status: 'Completed' });
    const pending = await Task.countDocuments({ ...query, status: 'Pending' });
    const inProgress = await Task.countDocuments({ ...query, status: 'In Progress' });
    const overdue = await Task.countDocuments({
      ...query,
      status: { $ne: 'Completed' },
      dueDate: { $lt: new Date() }
    });

    // Get employee-wise distribution (admin only)
    let employeeStats = [];
    if (req.user.role === 'admin') {
      employeeStats = await Task.aggregate([
        {
          $group: {
            _id: '$assignedTo',
            total: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
            },
            pending: {
              $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
            },
            inProgress: {
              $sum: { $cond: [{ $eq: ['$status', 'In Progress'] }, 1, 0] }
            }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'employee'
          }
        },
        {
          $unwind: '$employee'
        },
        {
          $project: {
            employeeId: '$employee._id',
            employeeName: '$employee.name',
            total: 1,
            completed: 1,
            pending: 1,
            inProgress: 1
          }
        }
      ]);
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
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email employeeId')
      .populate('assignedBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check access rights
    if (req.user.role === 'employee' && task.assignedTo._id.toString() !== req.user._id.toString()) {
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
  body('priority').isIn(['Low', 'Medium', 'High']),
  body('dueDate').isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, assignedTo, priority, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      priority,
      dueDate,
      status: 'Pending'
    });

    await task.save();
    await task.populate('assignedTo', 'name email employeeId');
    await task.populate('assignedBy', 'name email');

    // Create notification for assigned employee
    const io = req.app.get('io');
    await createNotification(
      assignedTo,
      'task_assigned',
      'New Task Assigned',
      `You have been assigned a new task: ${title}`,
      task._id,
      io
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
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const { title, description, assignedTo, priority, dueDate, status } = req.body;

    // Admin can update everything, employee can only update status
    if (req.user.role === 'admin') {
      if (title) task.title = title;
      if (description) task.description = description;
      if (assignedTo) task.assignedTo = assignedTo;
      if (priority) task.priority = priority;
      if (dueDate) task.dueDate = dueDate;
      if (status) task.status = status;
    } else if (req.user.role === 'employee') {
      // Employee can only update their own tasks' status
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
      if (status) task.status = status;
    }

    // Set completion date
    if (status === 'Completed' && !task.completedAt) {
      task.completedAt = new Date();
    } else if (status !== 'Completed') {
      task.completedAt = null;
    }

    await task.save();
    await task.populate('assignedTo', 'name email employeeId');
    await task.populate('assignedBy', 'name email');

    // Create notifications
    const io = req.app.get('io');

    if (status === 'Completed') {
      // Notify admin about completion
      await createNotification(
        task.assignedBy,
        'task_completed',
        'Task Completed',
        `${task.assignedTo.name} completed: ${task.title}`,
        task._id,
        io
      );
    } else if (req.user.role === 'admin') {
      // Notify employee about update
      await createNotification(
        task.assignedTo._id,
        'task_updated',
        'Task Updated',
        `Task "${task.title}" has been updated`,
        task._id,
        io
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
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
