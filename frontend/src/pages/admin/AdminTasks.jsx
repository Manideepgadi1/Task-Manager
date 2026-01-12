import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import TaskCard from '../../components/TaskCard';
import TaskModal from '../../components/TaskModal';

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [buttonHovered, setButtonHovered] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    assignedTo: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, employeesRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/users/employees')
      ]);
      setTasks(tasksRes.data);
      setEmployees(employeesRes.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Priority filter
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Assigned to filter
    if (filters.assignedTo) {
      filtered = filtered.filter(task => task.assignedTo._id === filters.assignedTo);
    }

    setFilteredTasks(filtered);
  };

  const handleTaskUpdate = (updatedTask, deleted = false) => {
    if (deleted) {
      setTasks(tasks.filter(t => (t.id || t._id) !== (selectedTask.id || selectedTask._id)));
    } else if (updatedTask) {
      const exists = tasks.find(t => (t.id || t._id) === (updatedTask.id || updatedTask._id));
      if (exists) {
        setTasks(tasks.map(t => (t.id || t._id) === (updatedTask.id || updatedTask._id) ? updatedTask : t));
      } else {
        setTasks([updatedTask, ...tasks]);
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      priority: '',
      assignedTo: ''
    });
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Tasks</h1>
          <p className="text-gray-600">Manage and track all tasks</p>
        </div>
        <motion.button
          onClick={() => {
            setSelectedTask(null);
            setShowTaskModal(true);
          }}
          onMouseEnter={() => setButtonHovered(true)}
          onMouseLeave={() => setButtonHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <motion.span
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {buttonHovered ? 'Create ✨' : 'Create Task'}
          </motion.span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="input pl-10"
                placeholder="Search tasks..."
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="input"
            >
              <option value="">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Assigned To */}
          <div>
            <select
              value={filters.assignedTo}
              onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
              className="input"
            >
              <option value="">All Employees</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(filters.search || filters.status || filters.priority || filters.assignedTo) && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </p>
            <button
              onClick={clearFilters}
              className="btn btn-sm btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center py-12 bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-gray-300"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-6xl mb-4"
          >
            {tasks.length === 0 ? '🌱' : '🔍'}
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {tasks.length === 0 ? 'No tasks yet. Create one and start your day strong!' : 'No tasks match your filters'}
          </h3>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            {tasks.length === 0 ? 'Small steps daily make big wins. Start by adding your first task.' : 'Try adjusting your filters or create a new task'}
          </p>
          {tasks.length === 0 && (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedTask(null);
                setShowTaskModal(true);
              }}
              className="btn btn-primary mx-auto inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Task</span>
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
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

export default AdminTasks;
