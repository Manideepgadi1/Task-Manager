import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle,
  Target
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import StatCard from '../../components/StatCard';
import TaskCard from '../../components/TaskCard';
import TaskModal from '../../components/TaskModal';

const EmployeeOverview = () => {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, tasksRes] = await Promise.all([
        api.get('/tasks/stats'),
        api.get('/tasks')
      ]);
      
      setStats(statsRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map(t => (t.id || t._id) === (updatedTask.id || updatedTask._id) ? updatedTask : t));
    fetchData(); // Refresh stats
  };

  const pendingTasks = tasks.filter(t => t.status === 'Pending');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
        <p className="text-gray-600">Track your tasks and productivity</p>
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pending Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Pending Tasks</h2>
            <span className="badge badge-pending">{pendingTasks.length}</span>
          </div>
          
          {pendingTasks.length === 0 ? (
            <motion.div 
              className="card text-center py-8 bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                className="text-4xl mb-3"
              >
                🎯
              </motion.div>
              <p className="text-gray-900 font-semibold mb-1">All caught up!</p>
              <p className="text-gray-500 text-sm">No pending tasks. Great job!</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {pendingTasks.slice(0, 3).map((task) => (
                <TaskCard
                  key={task.id || task._id}
                  task={task}
                  onClick={() => {
                    setSelectedTask(task);
                    setShowTaskModal(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* In Progress Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">In Progress</h2>
            <span className="badge badge-inprogress">{inProgressTasks.length}</span>
          </div>
          
          {inProgressTasks.length === 0 ? (
            <motion.div 
              className="card text-center py-8 bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                className="text-4xl mb-3"
              >
                🚀
              </motion.div>
              <p className="text-gray-900 font-semibold mb-1">Ready to start?</p>
              <p className="text-gray-500 text-sm">No tasks in progress yet</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {inProgressTasks.slice(0, 3).map((task) => (
                <TaskCard
                  key={task.id || task._id}
                  task={task}
                  onClick={() => {
                    setSelectedTask(task);
                    setShowTaskModal(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Productivity Tips */}
      <motion.div 
        className="card bg-white border-l-4 border-l-black"
        whileHover={{ x: 4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <h3 className="font-semibold text-gray-900 mb-2">💡 Productivity Tip</h3>
        <p className="text-gray-700">
          Focus on completing high-priority tasks first. Break down large tasks into smaller, manageable steps to maintain momentum and track progress effectively.
        </p>
      </motion.div>

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
          isAdmin={false}
        />
      )}
    </div>
  );
};

export default EmployeeOverview;
