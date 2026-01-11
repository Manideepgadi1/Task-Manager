import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Bell, 
  LogOut,
  Menu,
  X,
  User,
  Calendar,
  Users,
  Archive
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EmployeeOverview from './employee/EmployeeOverview';
import EmployeeTasks from './employee/EmployeeTasks';
import Notifications from './Notifications';
import EmployeeProfile from './employee/EmployeeProfile';
import EmployeeCalendar from './employee/EmployeeCalendar';
import EmployeeTeam from './employee/EmployeeTeam';
import TaskHistory from './TaskHistory';
import SearchComponent from '../components/SearchComponent';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/employee', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/employee/tasks', icon: CheckSquare, label: 'My Tasks' },
    { path: '/employee/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/employee/team', icon: Users, label: 'Team' },
    { path: '/employee/history', icon: Archive, label: 'Task History' },
    { path: '/employee/profile', icon: User, label: 'Profile' },
    { path: '/employee/notifications', icon: Bell, label: 'Notifications' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white shadow-medium
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  VS Task Manager
                </h1>
                <p className="text-sm text-gray-500 mt-1">Employee Portal</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl
                    transition-all duration-200 font-medium
                    ${active 
                      ? 'bg-black text-white shadow-soft' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.employeeId}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary w-full flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-soft px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex-1 max-w-xl mx-4">
              <SearchComponent />
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-500">Welcome back,</p>
              <p className="font-semibold text-gray-900">{user?.name}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<EmployeeOverview />} />
            <Route path="/tasks" element={<EmployeeTasks />} />
            <Route path="/calendar" element={<EmployeeCalendar />} />
            <Route path="/team" element={<EmployeeTeam />} />
            <Route path="/history" element={<TaskHistory />} />
            <Route path="/profile" element={<EmployeeProfile />} />
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default EmployeeDashboard;
