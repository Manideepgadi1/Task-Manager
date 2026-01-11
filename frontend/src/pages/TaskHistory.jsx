import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function TaskHistory() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    dateRange: 'all',
    search: ''
  });
  const [sortBy, setSortBy] = useState('completedAt'); // 'completedAt', 'createdAt', 'priority'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  useEffect(() => {
    fetchTasks();
  }, [user]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [filters, sortBy, sortOrder, tasks]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      
      // Filter tasks based on user role
      let userTasks = response.data;
      if (user.role === 'employee') {
        userTasks = userTasks.filter(task => task.assignedToId === user.id);
      }
      
      setTasks(userTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...tasks];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const startDate = new Date();
      
      switch (filters.dateRange) {
        case '7days':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(now.getDate() - 90);
          break;
        case '6months':
          startDate.setMonth(now.getMonth() - 6);
          break;
      }
      
      filtered = filtered.filter(task => {
        const taskDate = task.completedAt ? new Date(task.completedAt) : new Date(task.createdAt);
        return taskDate >= startDate;
      });
    }

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        task =>
          task.title.toLowerCase().includes(search) ||
          (task.description && task.description.toLowerCase().includes(search)) ||
          (task.tags && task.tags.some(tag => tag.toLowerCase().includes(search)))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'completedAt':
          aValue = a.completedAt ? new Date(a.completedAt).getTime() : 0;
          bValue = b.completedAt ? new Date(b.completedAt).getTime() : 0;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority] || 0;
          bValue = priorityOrder[b.priority] || 0;
          break;
        default:
          aValue = 0;
          bValue = 0;
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    setFilteredTasks(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Title', 'Status', 'Priority', 'Created', 'Completed', 'Due Date'],
      ...filteredTasks.map(task => [
        task.title,
        task.status,
        task.priority,
        new Date(task.createdAt).toLocaleDateString(),
        task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'N/A',
        task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'
      ])
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStats = () => {
    return {
      total: filteredTasks.length,
      completed: filteredTasks.filter(t => t.status === 'completed').length,
      cancelled: filteredTasks.filter(t => t.status === 'cancelled').length,
      inProgress: filteredTasks.filter(t => t.status === 'in-progress').length,
      pending: filteredTasks.filter(t => t.status === 'pending').length
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading task history...</div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Task History & Archive</h1>
        <motion.button
          onClick={exportToCSV}
          className="mt-4 md:mt-0 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          📥 Export to CSV
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <motion.div 
          className="bg-white rounded-lg shadow p-4"
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <div className="text-sm text-gray-600">Total Tasks</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
        </motion.div>
        <motion.div 
          className="bg-white rounded-lg shadow p-4"
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {stats.completed}
          </div>
        </motion.div>
        <motion.div 
          className="bg-white rounded-lg shadow p-4"
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <div className="text-sm text-gray-600">In Progress</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {stats.inProgress}
          </div>
        </motion.div>
        <motion.div 
          className="bg-white rounded-lg shadow p-4"
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <div className="text-sm text-gray-600">Pending</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {stats.pending}
          </div>
        </motion.div>
        <motion.div 
          className="bg-white rounded-lg shadow p-4"
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <div className="text-sm text-gray-600">Cancelled</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {stats.cancelled}
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="6months">Last 6 Months</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <div className="flex space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="completedAt">Completion Date</option>
                <option value="createdAt">Created Date</option>
                <option value="priority">Priority</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Tasks ({filteredTasks.length})
          </h2>

          {filteredTasks.length === 0 ? (
            <motion.div 
              className="text-center py-12 bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-200 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                className="text-6xl mb-4"
              >
                🔍
              </motion.div>
              <p className="text-gray-900 text-lg font-semibold mb-2">No tasks found</p>
              <p className="text-gray-500 text-sm">Try adjusting your filters or search criteria</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-5 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-2 ml-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status.toUpperCase()}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {task.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Dates */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span>
                      🕒 Created: {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                    {task.dueDate && (
                      <span>
                        📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    {task.completedAt && (
                      <span className="text-green-600 font-medium">
                        ✅ Completed: {new Date(task.completedAt).toLocaleDateString()}
                      </span>
                    )}
                    {task.status === 'completed' && task.dueDate && task.completedAt && (
                      <span
                        className={`font-medium ${
                          new Date(task.completedAt) <= new Date(task.dueDate)
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {new Date(task.completedAt) <= new Date(task.dueDate)
                          ? '⚡ On Time'
                          : '⚠️ Overdue'}
                      </span>
                    )}
                  </div>

                  {/* Attachments */}
                  {task.attachments && task.attachments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-2 text-xs text-gray-600">
                        <span>📎 Attachments:</span>
                        <span className="font-medium">
                          {task.attachments.length} file(s)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
