import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Trash2, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { formatRelativeTime } from '../utils/helpers';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/notifications', {
        params: { unreadOnly: filter === 'unread' }
      });
      setNotifications(data.notifications);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      task_assigned: '📝',
      task_updated: '✏️',
      task_completed: '✅',
      deadline_reminder: '⏰',
      task_overdue: '🚨'
    };
    return icons[type] || '📌';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-8 h-8 border-4"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
        <p className="text-gray-600">Stay updated with your tasks and activities</p>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-black text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Unread
          </button>
        </div>

        {notifications.some(n => !n.isRead) && (
          <button
            onClick={markAllAsRead}
            className="btn btn-secondary btn-sm flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <motion.div 
            className="text-center py-12 bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-200 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="text-6xl mb-4"
            >
              🔔
            </motion.div>
            <p className="text-gray-900 text-lg font-semibold mb-2">No notifications</p>
            <p className="text-gray-500 text-sm">You're all caught up! Check back later for updates</p>
          </motion.div>
        ) : (
          notifications.map((notification) => (
            <motion.div
              key={notification._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`
                card flex items-start gap-4 
                ${!notification.isRead ? 'border-l-4 border-l-black' : ''}
              `}
            >
              {/* Icon */}
              <div className="text-3xl">
                {getNotificationIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-gray-900 mb-1 ${!notification.isRead ? 'font-bold' : ''}`}>
                  {notification.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                <p className="text-xs text-gray-500">
                  {formatRelativeTime(notification.createdAt)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Mark as read"
                  >
                    <Check className="w-4 h-4 text-gray-600" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notification._id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
