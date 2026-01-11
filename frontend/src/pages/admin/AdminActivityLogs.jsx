import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function AdminActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    actionType: 'all',
    dateRange: 'all'
  });

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, logs]);

  const fetchActivityLogs = async () => {
    try {
      setLoading(true);
      // Fetch tasks and users to construct activity logs
      const [tasksRes, usersRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/users')
      ]);

      const tasks = tasksRes.data;
      const users = usersRes.data;

      // Generate activity logs from tasks and users
      const activityLogs = [];

      // Task activities
      tasks.forEach(task => {
        const creator = users.find(u => u.id === task.createdById);
        const assignee = users.find(u => u.id === task.assignedToId);

        activityLogs.push({
          id: `task-created-${task.id}`,
          timestamp: task.createdAt,
          action: 'task_created',
          description: `Task "${task.title}" was created`,
          user: creator?.name || 'Unknown',
          userId: task.createdById,
          details: {
            taskId: task.id,
            taskTitle: task.title,
            priority: task.priority,
            status: task.status,
            assignedTo: assignee?.name
          }
        });

        if (task.status === 'completed' && task.completedAt) {
          activityLogs.push({
            id: `task-completed-${task.id}`,
            timestamp: task.completedAt,
            action: 'task_completed',
            description: `Task "${task.title}" was completed`,
            user: assignee?.name || 'Unknown',
            userId: task.assignedToId,
            details: {
              taskId: task.id,
              taskTitle: task.title
            }
          });
        }

        if (task.updatedAt !== task.createdAt) {
          activityLogs.push({
            id: `task-updated-${task.id}-${task.updatedAt}`,
            timestamp: task.updatedAt,
            action: 'task_updated',
            description: `Task "${task.title}" was updated`,
            user: assignee?.name || creator?.name || 'Unknown',
            userId: task.assignedToId || task.createdById,
            details: {
              taskId: task.id,
              taskTitle: task.title,
              status: task.status
            }
          });
        }
      });

      // User activities
      users.forEach(user => {
        activityLogs.push({
          id: `user-created-${user.id}`,
          timestamp: user.createdAt,
          action: 'user_created',
          description: `User "${user.name}" was created`,
          user: 'System',
          userId: null,
          details: {
            userId: user.id,
            userName: user.name,
            email: user.email,
            role: user.role
          }
        });
      });

      // Sort by timestamp (most recent first)
      activityLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setLogs(activityLogs);
      setFilteredLogs(activityLogs);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...logs];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(log =>
        log.description.toLowerCase().includes(searchLower) ||
        log.user.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower)
      );
    }

    // Action type filter
    if (filters.actionType !== 'all') {
      filtered = filtered.filter(log => log.action === filters.actionType);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const startDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case '7days':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(now.getDate() - 30);
          break;
      }
      
      filtered = filtered.filter(log => new Date(log.timestamp) >= startDate);
    }

    setFilteredLogs(filtered);
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'task_created':
        return '➕';
      case 'task_updated':
        return '✏️';
      case 'task_completed':
        return '✅';
      case 'task_deleted':
        return '🗑️';
      case 'user_created':
        return '👤';
      case 'user_updated':
        return '🔄';
      case 'user_deleted':
        return '❌';
      case 'login':
        return '🔐';
      case 'logout':
        return '🚪';
      default:
        return '📝';
    }
  };

  const getActionColor = (action) => {
    if (action.includes('created')) return 'bg-green-100 text-green-800';
    if (action.includes('updated')) return 'bg-blue-100 text-blue-800';
    if (action.includes('deleted')) return 'bg-red-100 text-red-800';
    if (action.includes('completed')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Action', 'User', 'Description'],
      ...filteredLogs.map(log => [
        new Date(log.timestamp).toLocaleString(),
        log.action,
        log.user,
        log.description
      ])
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading activity logs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
        <button
          onClick={exportLogs}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          📥 Export Logs
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search logs..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Type
            </label>
            <select
              value={filters.actionType}
              onChange={(e) => setFilters({ ...filters, actionType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Actions</option>
              <option value="task_created">Task Created</option>
              <option value="task_updated">Task Updated</option>
              <option value="task_completed">Task Completed</option>
              <option value="user_created">User Created</option>
              <option value="user_updated">User Updated</option>
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
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total Activities</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {filteredLogs.length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Tasks Created</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {filteredLogs.filter(l => l.action === 'task_created').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Tasks Completed</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">
            {filteredLogs.filter(l => l.action === 'task_completed').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Users Created</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {filteredLogs.filter(l => l.action === 'user_created').length}
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Activity Timeline</h2>
          
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No activities found matching your filters.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 text-2xl">
                    {getActionIcon(log.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionColor(
                            log.action
                          )}`}
                        >
                          {log.action.replace(/_/g, ' ').toUpperCase()}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {log.user}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{log.description}</p>
                    {log.details && (
                      <div className="mt-2 text-xs text-gray-500">
                        {Object.entries(log.details).map(([key, value]) => (
                          value && (
                            <span key={key} className="mr-3">
                              <span className="font-medium">{key}:</span> {value}
                            </span>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
