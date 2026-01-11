import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function EmployeeTeam() {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberTasks, setMemberTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      const [usersRes, tasksRes] = await Promise.all([
        api.get('/users'),
        api.get('/tasks')
      ]);

      // Filter out admins and current user
      const employees = usersRes.data.filter(
        u => u.role === 'employee' && u.id !== user.id
      );

      setTeamMembers(employees);
      setAllTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMemberStats = (memberId) => {
    const tasks = allTasks.filter(t => t.assignedToId === memberId);
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const total = tasks.length;

    return {
      total,
      completed,
      inProgress,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  const viewMemberDetails = async (member) => {
    setSelectedMember(member);
    const tasks = allTasks.filter(t => t.assignedToId === member.id);
    setMemberTasks(tasks);
  };

  const closeMemberDetails = () => {
    setSelectedMember(null);
    setMemberTasks([]);
  };

  const getFilteredTeamMembers = () => {
    let filtered = teamMembers;

    // Apply active/inactive filter
    if (filter === 'active') {
      filtered = filtered.filter(m => m.isActive);
    } else if (filter === 'inactive') {
      filtered = filtered.filter(m => !m.isActive);
    }

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        m =>
          m.name.toLowerCase().includes(search) ||
          m.email.toLowerCase().includes(search) ||
          (m.employeeId && m.employeeId.toLowerCase().includes(search))
      );
    }

    return filtered;
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading team members...</div>
      </div>
    );
  }

  const filteredMembers = getFilteredTeamMembers();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          className="bg-white rounded-lg shadow p-6"
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <div className="text-sm text-gray-600">Total Team Members</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {teamMembers.length}
          </div>
        </motion.div>
        <motion.div 
          className="bg-white rounded-lg shadow p-6"
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <div className="text-sm text-gray-600">Active Members</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {teamMembers.filter(m => m.isActive).length}
          </div>
        </motion.div>
        <motion.div 
          className="bg-white rounded-lg shadow p-6"
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <div className="text-sm text-gray-600">Total Tasks</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {allTasks.length}
          </div>
        </motion.div>
        <motion.div 
          className="bg-white rounded-lg shadow p-6"
          whileHover={{ y: -4, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <div className="text-sm text-gray-600">Avg Completion Rate</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">
            {teamMembers.length > 0
              ? Math.round(
                  teamMembers.reduce(
                    (sum, m) => sum + getMemberStats(m.id).completionRate,
                    0
                  ) / teamMembers.length
                )
              : 0}
            %
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'inactive'
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Team Members Grid */}
      {filteredMembers.length === 0 ? (
        <motion.div 
          className="bg-white rounded-lg shadow p-12 text-center border-2 border-dashed border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            className="text-6xl mb-4"
          >
            👥
          </motion.div>
          <p className="text-gray-900 text-lg font-semibold mb-2">No team members found</p>
          <p className="text-gray-500 text-sm">
            {teamMembers.length === 0 ? 'Your team list is empty' : 'Try adjusting your search or filters'}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => {
            const stats = getMemberStats(member.id);
            return (
              <div
                key={member.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => viewMemberDetails(member)}
              >
                {/* Member Header */}
                <div className="flex items-center space-x-4 mb-4">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.email}</p>
                    {member.employeeId && (
                      <p className="text-xs text-gray-400">ID: {member.employeeId}</p>
                    )}
                  </div>
                  <div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        member.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">
                      {stats.total}
                    </div>
                    <div className="text-xs text-gray-600">Total Tasks</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {stats.completed}
                    </div>
                    <div className="text-xs text-gray-600">Completed</div>
                  </div>
                </div>

                {/* Completion Rate */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Completion Rate</span>
                    <span className="text-xs font-semibold text-gray-900">
                      {stats.completionRate}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${stats.completionRate}%` }}
                    ></div>
                  </div>
                </div>

                {/* Task Breakdown */}
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-gray-600">
                    <span className="font-semibold text-yellow-600">
                      {stats.pending}
                    </span>{' '}
                    Pending
                  </span>
                  <span className="text-gray-600">
                    <span className="font-semibold text-blue-600">
                      {stats.inProgress}
                    </span>{' '}
                    In Progress
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {selectedMember.avatar ? (
                  <img
                    src={selectedMember.avatar}
                    alt={selectedMember.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {selectedMember.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedMember.name}
                  </h2>
                  <p className="text-gray-600">{selectedMember.email}</p>
                </div>
              </div>
              <button
                onClick={closeMemberDetails}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {memberTasks.length}
                  </div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {memberTasks.filter(t => t.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {memberTasks.filter(t => t.status === 'in-progress').length}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {memberTasks.filter(t => t.status === 'pending').length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>

              {/* Tasks List */}
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Tasks ({memberTasks.length})
              </h3>
              {memberTasks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No tasks assigned to this member
                </div>
              ) : (
                <div className="space-y-3">
                  {memberTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 flex-1">
                          {task.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              task.status
                            )}`}
                          >
                            {task.status}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        {task.dueDate && (
                          <span>
                            📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                        <span>
                          🕒 Created: {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
