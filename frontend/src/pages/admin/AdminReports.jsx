import { useState, useEffect } from 'react';
import api from '../../utils/api';
import StatCard from '../../components/StatCard';

export default function AdminReports() {
  const [reportData, setReportData] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    totalEmployees: 0,
    activeEmployees: 0,
    tasksByPriority: { low: 0, medium: 0, high: 0, urgent: 0 },
    tasksByStatus: { pending: 0, 'in-progress': 0, completed: 0, cancelled: 0 },
    employeePerformance: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const [tasksRes, usersRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/users')
      ]);

      const tasks = tasksRes.data;
      const users = usersRes.data;

      // Calculate statistics
      const now = new Date();
      const filteredTasks = filterTasksByDate(tasks, dateRange);

      const stats = {
        totalTasks: filteredTasks.length,
        completedTasks: filteredTasks.filter(t => t.status === 'completed').length,
        pendingTasks: filteredTasks.filter(t => t.status === 'pending').length,
        overdueTasks: filteredTasks.filter(t => {
          return t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < now;
        }).length,
        totalEmployees: users.length,
        activeEmployees: users.filter(u => u.isActive).length,
        tasksByPriority: {
          low: filteredTasks.filter(t => t.priority === 'low').length,
          medium: filteredTasks.filter(t => t.priority === 'medium').length,
          high: filteredTasks.filter(t => t.priority === 'high').length,
          urgent: filteredTasks.filter(t => t.priority === 'urgent').length
        },
        tasksByStatus: {
          pending: filteredTasks.filter(t => t.status === 'pending').length,
          'in-progress': filteredTasks.filter(t => t.status === 'in-progress').length,
          completed: filteredTasks.filter(t => t.status === 'completed').length,
          cancelled: filteredTasks.filter(t => t.status === 'cancelled').length
        },
        employeePerformance: calculateEmployeePerformance(filteredTasks, users),
        recentActivity: getRecentActivity(tasks).slice(0, 10)
      };

      setReportData(stats);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTasksByDate = (tasks, range) => {
    if (range === 'all') return tasks;
    
    const now = new Date();
    const startDate = new Date();
    
    switch (range) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        return tasks;
    }
    
    return tasks.filter(task => new Date(task.createdAt) >= startDate);
  };

  const calculateEmployeePerformance = (tasks, users) => {
    return users
      .filter(user => user.role === 'employee')
      .map(user => {
        const userTasks = tasks.filter(t => t.assignedToId === user.id);
        const completed = userTasks.filter(t => t.status === 'completed').length;
        const total = userTasks.length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          totalTasks: total,
          completedTasks: completed,
          completionRate,
          avatar: user.avatar
        };
      })
      .sort((a, b) => b.completionRate - a.completionRate);
  };

  const getRecentActivity = (tasks) => {
    return tasks
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .map(task => ({
        id: task.id,
        title: task.title,
        status: task.status,
        updatedAt: task.updatedAt,
        priority: task.priority
      }));
  };

  const completionRate = reportData.totalTasks > 0 
    ? Math.round((reportData.completedTasks / reportData.totalTasks) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Time</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={reportData.totalTasks}
          icon="📊"
          color="blue"
        />
        <StatCard
          title="Completed Tasks"
          value={reportData.completedTasks}
          subtitle={`${completionRate}% completion rate`}
          icon="✅"
          color="green"
        />
        <StatCard
          title="Pending Tasks"
          value={reportData.pendingTasks}
          icon="⏳"
          color="yellow"
        />
        <StatCard
          title="Overdue Tasks"
          value={reportData.overdueTasks}
          icon="⚠️"
          color="red"
        />
      </div>

      {/* Employee Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Total Employees"
          value={reportData.totalEmployees}
          icon="👥"
          color="purple"
        />
        <StatCard
          title="Active Employees"
          value={reportData.activeEmployees}
          icon="✨"
          color="indigo"
        />
      </div>

      {/* Tasks by Priority */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Tasks by Priority</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
            <div className="text-3xl font-bold text-gray-900">
              {reportData.tasksByPriority.low}
            </div>
            <div className="text-sm text-gray-600 mt-1">Low Priority</div>
          </div>
          <div className="text-center p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
            <div className="text-3xl font-bold text-gray-900">
              {reportData.tasksByPriority.medium}
            </div>
            <div className="text-sm text-gray-600 mt-1">Medium Priority</div>
          </div>
          <div className="text-center p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
            <div className="text-3xl font-bold text-gray-900">
              {reportData.tasksByPriority.high}
            </div>
            <div className="text-sm text-gray-600 mt-1">High Priority</div>
          </div>
          <div className="text-center p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
            <div className="text-3xl font-bold text-gray-900">
              {reportData.tasksByPriority.urgent}
            </div>
            <div className="text-sm text-gray-600 mt-1">Urgent</div>
          </div>
        </div>
      </div>

      {/* Tasks by Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Tasks by Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
            <div className="text-3xl font-bold text-gray-900">
              {reportData.tasksByStatus.pending}
            </div>
            <div className="text-sm text-gray-600 mt-1">Pending</div>
          </div>
          <div className="text-center p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
            <div className="text-3xl font-bold text-gray-900">
              {reportData.tasksByStatus['in-progress']}
            </div>
            <div className="text-sm text-gray-600 mt-1">In Progress</div>
          </div>
          <div className="text-center p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
            <div className="text-3xl font-bold text-gray-900">
              {reportData.tasksByStatus.completed}
            </div>
            <div className="text-sm text-gray-600 mt-1">Completed</div>
          </div>
          <div className="text-center p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
            <div className="text-3xl font-bold text-gray-900">
              {reportData.tasksByStatus.cancelled}
            </div>
            <div className="text-sm text-gray-600 mt-1">Cancelled</div>
          </div>
        </div>
      </div>

      {/* Employee Performance */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Employee Performance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Tasks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportData.employeePerformance.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {employee.avatar ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={employee.avatar}
                            alt=""
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {employee.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {employee.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.totalTasks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.completedTasks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 mr-2">
                        {employee.completionRate}%
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${employee.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {reportData.recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {activity.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Updated {new Date(activity.updatedAt).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    activity.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : activity.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : activity.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {activity.status}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    activity.priority === 'urgent'
                      ? 'bg-red-100 text-red-800'
                      : activity.priority === 'high'
                      ? 'bg-orange-100 text-orange-800'
                      : activity.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {activity.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
