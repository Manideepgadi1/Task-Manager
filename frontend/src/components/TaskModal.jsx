import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { createConfetti, showSuccessAnimation } from '../utils/confetti';

const TaskModal = ({ task, isOpen, onClose, onUpdate, employees = [], isAdmin = false }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    assignedTo: task?.assignedTo?.id || '',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    status: task?.status || 'pending',
    recurrence: task?.recurrence || 'once'
  });
  const [loading, setLoading] = useState(false);

  const handleStatusChange = (newStatus) => {
    const oldStatus = formData.status;
    setFormData({ ...formData, status: newStatus });
    
    // Celebrate when marking as completed
    if (newStatus === 'Completed' && oldStatus !== 'Completed') {
      setTimeout(() => {
        createConfetti();
        toast.success('🎉 Nice work! One step closer ✨', {
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: '#000',
            color: '#fff',
          },
        });
      }, 100);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (task?.id || task?._id) {
        // Update existing task
        const { data } = await api.put(`/tasks/${task.id || task._id}`, formData);
        showSuccessAnimation();
        toast.success('✨ Task updated! Looking good', {
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: '#000',
            color: '#fff',
          },
        });
        onUpdate(data.task);
      } else {
        // Create new task
        const { data } = await api.post('/tasks', formData);
        createConfetti();
        toast.success('🚀 Task launched! Let\'s get it done 💪', {
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: '#000',
            color: '#fff',
          },
        });
        onUpdate(data.task);
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    setLoading(true);
    try {
      await api.delete(`/tasks/${task.id || task._id}`);
      toast.success('Task deleted successfully');
      onUpdate(null, true);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-large w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {task?.id || task?._id ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
                placeholder="Enter task title"
                required
                disabled={!isAdmin && task?._id}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input min-h-[100px] resize-y"
                placeholder="Enter task description"
                required
                disabled={!isAdmin && task?._id}
              />
            </div>

            {/* Assign To (Admin only for create/edit) */}
            {isAdmin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign To *
                </label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="input"
                  required
                >
                  <option value="">Select employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.employeeId})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="input"
                  disabled={!isAdmin && task?._id}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              {/* Recurrence */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recurrence *
                </label>
                <select
                  value={formData.recurrence}
                  onChange={(e) => setFormData({ ...formData, recurrence: e.target.value })}
                  className="input"
                  disabled={!isAdmin && task?._id}
                >
                  <option value="once">One Time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="input"
                  required
                  disabled={!isAdmin && task?._id}
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="input"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              {(task?.id || task?._id) && isAdmin && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-danger"
                  disabled={loading}
                >
                  Delete Task
                </button>
              )}
              
              <div className="flex gap-3 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="spinner"></span>
                      Saving...
                    </span>
                  ) : (
                    task?._id ? 'Update Task' : 'Create Task'
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskModal;
