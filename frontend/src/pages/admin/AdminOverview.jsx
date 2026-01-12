import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  Users,
  TrendingUp,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import StatCard from '../../components/StatCard';
import TaskCard from '../../components/TaskCard';
import TaskModal from '../../components/TaskModal';
import { isOverdue } from '../../utils/helpers';

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, tasksRes, employeesRes] = await Promise.all([
        api.get('/tasks/stats'),
        api.get('/tasks', { params: { limit: 5 } }),
        api.get('/users/employees')
      ]);
      
      setStats(statsRes.data);
      setRecentTasks(tasksRes.data.slice(0, 5));
      setEmployees(employeesRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (updatedTask, deleted = false) => {
    if (deleted) {
      setRecentTasks(recentTasks.filter(t => t._id !== selectedTask._id));
    } else {
      setRecentTasks(recentTasks.map(t => 
        t._id === updatedTask._id ? updatedTask : t
      ));
    }
    fetchData(); // Refresh stats
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-8 h-8 border-4"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Monitor and manage all tasks across your team</p>
        </div>
        <button
          onClick={() => {
            setSelectedTask(null);
            setShowTaskModal(true);
          }}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Task
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Tasks"
          value={stats?.total || 0}
          icon={CheckSquare}
          color="blue"
        />
        <StatCard
          title="Completed"
          value={stats?.completed || 0}
          icon={CheckSquare}
          color="green"
          subtitle={`${stats?.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% completion rate`}
        />
        <StatCard
          title="In Progress"
          value={stats?.inProgress || 0}
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Overdue"
          value={stats?.overdue || 0}
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* Employee Performance */}
      {stats?.employeeStats?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Employee Performance</h2>
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Employee</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Total</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Completed</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">In Progress</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Pending</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Completion %</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.employeeStats.map((emp) => {
                    const completionRate = emp.total > 0 
                      ? Math.round((emp.completed / emp.total) * 100) 
                      : 0;
                    
                    return (
                      <tr key={emp.employeeId} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {emp.employeeName}
                        </td>
                        <td className="text-center py-3 px-4 text-gray-700">{emp.total}</td>
                        <td className="text-center py-3 px-4">
                          <span className="badge badge-completed">{emp.completed}</span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className="badge badge-inprogress">{emp.inProgress}</span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className="badge badge-pending">{emp.pending}</span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 transition-all duration-300"
                                style={{ width: `${completionRate}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{completionRate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Tasks</h2>
        {recentTasks.length === 0 ? (
          <div className="card text-center py-12">
            <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">No tasks yet</p>
            <button
              onClick={() => {
                setSelectedTask(null);
                setShowTaskModal(true);
              }}
              className="btn btn-primary mx-auto"
            >
              Create Your First Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recentTasks.map((task) => (
              <TaskCard
                key={task.id || task._id}
                task={task}
                onClick={() => {
                  setSelectedTask(task);
                  setShowTaskModal(true);
                }}
                showAssignee={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          task={selectedTask}
          isOpen={showTaskModal}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
          onUpdate={handleTaskUpdate}
          employees={employees}
          isAdmin={true}
        />
      )}
    </div>
  );
};

export default AdminOverview;
