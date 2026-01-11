import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function SearchComponent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({
    tasks: [],
    users: []
  });
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        performSearch();
      } else {
        setSearchResults({ tasks: [], users: [] });
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const performSearch = async () => {
    setIsSearching(true);
    
    try {
      const [tasksRes, usersRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/users')
      ]);

      const search = searchTerm.toLowerCase();

      // Filter tasks
      let tasks = tasksRes.data.filter(task =>
        task.title.toLowerCase().includes(search) ||
        (task.description && task.description.toLowerCase().includes(search)) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(search)))
      );

      // Filter based on user role
      if (user.role === 'employee') {
        tasks = tasks.filter(task => task.assignedToId === user.id);
      }

      // Filter users (only for admin)
      let users = [];
      if (user.role === 'admin') {
        users = usersRes.data.filter(u =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          (u.employeeId && u.employeeId.toLowerCase().includes(search))
        );
      }

      setSearchResults({ tasks: tasks.slice(0, 10), users: users.slice(0, 5) });
      setShowResults(true);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTaskClick = (taskId) => {
    setShowResults(false);
    setSearchTerm('');
    
    if (user.role === 'admin') {
      navigate('/admin/tasks');
    } else {
      navigate('/employee/tasks');
    }
  };

  const handleUserClick = (userId) => {
    setShowResults(false);
    setSearchTerm('');
    navigate('/admin/employees');
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

  const highlightMatch = (text, term) => {
    if (!term || !text) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 font-semibold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative search-container">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
          placeholder="Search tasks, users..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          🔍
        </div>
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (searchResults.tasks.length > 0 || searchResults.users.length > 0) && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
          {/* Tasks Section */}
          {searchResults.tasks.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                Tasks ({searchResults.tasks.length})
              </div>
              <div className="space-y-1">
                {searchResults.tasks.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => handleTaskClick(task.id)}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 font-medium text-gray-900 text-sm">
                        {highlightMatch(task.title, searchTerm)}
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.status}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    {task.description && (
                      <div className="text-xs text-gray-600 line-clamp-1">
                        {highlightMatch(task.description, searchTerm)}
                      </div>
                    )}
                    {task.dueDate && (
                      <div className="text-xs text-gray-500 mt-1">
                        📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Users Section (Admin only) */}
          {user.role === 'admin' && searchResults.users.length > 0 && (
            <div className="p-2 border-t border-gray-200">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                Users ({searchResults.users.length})
              </div>
              <div className="space-y-1">
                {searchResults.users.map((searchUser) => (
                  <button
                    key={searchUser.id}
                    onClick={() => handleUserClick(searchUser.id)}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-3"
                  >
                    {searchUser.avatar ? (
                      <img
                        src={searchUser.avatar}
                        alt={searchUser.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600">
                          {searchUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {highlightMatch(searchUser.name, searchTerm)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {highlightMatch(searchUser.email, searchTerm)}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        searchUser.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {searchUser.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {searchResults.tasks.length === 0 && searchResults.users.length === 0 && searchTerm.length >= 2 && (
            <div className="p-8 text-center text-gray-500">
              <div className="text-4xl mb-2">🔍</div>
              <div className="text-sm">No results found for "{searchTerm}"</div>
            </div>
          )}
        </div>
      )}

      {/* Minimum characters notice */}
      {showResults && searchTerm.length > 0 && searchTerm.length < 2 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 text-center text-sm text-gray-500">
          Type at least 2 characters to search
        </div>
      )}
    </div>
  );
}
