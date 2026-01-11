import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, BadgeCheck, Search, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { createConfetti } from '../../utils/confetti';

const AdminEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    employeeId: '',
    department: '',
    location: ''
  });
  const [buttonHovered, setButtonHovered] = useState(false);
  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredEmployees(
        employees.filter(emp =>
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredEmployees(employees);
    }
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users');
      setEmployees(data.filter(u => u.role === 'employee'));
    } catch (error) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', {
        ...formData,
        role: 'employee'
      });
      createConfetti();
      toast.success('🎉 Employee added! Welcome to the team ✨', {
        duration: 3000,
        style: {
          borderRadius: '10px',
          background: '#000',
          color: '#fff',
        },
      });
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', employeeId: '', department: '', location: '' });
      fetchEmployees();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add employee');
    }
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employees</h1>
          <p className="text-gray-600">View and manage your team members</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          onMouseEnter={() => setButtonHovered(true)}
          onMouseLeave={() => setButtonHovered(false)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {buttonHovered ? 'Add ✨' : 'Add Employee'}
        </button>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
            placeholder="Search by name, email, or employee ID..."
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <BadgeCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {employees.filter(e => e.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gray-50 text-gray-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Max Capacity</p>
              <p className="text-2xl font-bold text-gray-900">10</p>
            </div>
          </div>
        </div>
      </div>

      {/* Employees Grid */}
      {filteredEmployees.length === 0 ? (
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
            {employees.length === 0 ? '👥' : '🔍'}
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {employees.length === 0 ? 'No team members yet. Add your first employee!' : 'No employees match your search'}
          </h3>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            {employees.length === 0 ? 'Build your dream team. Start by adding your first team member.' : 'Try adjusting your search or add a new employee'}
          </p>
          {employees.length === 0 && (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowModal(true)}
              className="btn btn-primary mx-auto inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Employee</span>
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <motion.div
              key={employee._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4, scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="card hover:shadow-large cursor-pointer"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                  {employee.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                    {employee.name}
                  </h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{employee.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BadgeCheck className="w-4 h-4 flex-shrink-0" />
                      <span>{employee.employeeId}</span>
                    </div>
                  </div>
                  
                  {/* Status */}
                  <div className="mt-3">
                    <span className={`badge ${employee.isActive ? 'badge-completed' : 'badge-pending'}`}>
                      {employee.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-large w-full max-w-md"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add New Employee</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input"
                  placeholder="john@company.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID *
                </label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="input"
                  placeholder="EMP003"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="input"
                  placeholder="Engineering, Marketing, etc."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input"
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input"
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminEmployees;
