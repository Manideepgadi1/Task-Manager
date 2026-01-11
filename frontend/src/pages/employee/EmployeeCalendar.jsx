import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function EmployeeCalendar() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState('month'); // 'month', 'week', 'day'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      const userTasks = response.data.filter(task => task.assignedToId === user.id);
      setTasks(userTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50';
      case 'pending':
        return 'text-gray-600 bg-gray-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const renderMonthView = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
    const days = [];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 bg-gray-50 border border-gray-200"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayTasks = getTasksForDate(date);
      const today = isToday(date);
      const selected = isSelected(date);

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-32 border border-gray-200 p-2 cursor-pointer transition-colors hover:bg-blue-50 ${
            today ? 'bg-blue-50 border-blue-300' : 'bg-white'
          } ${selected ? 'ring-2 ring-blue-500' : ''}`}
        >
          <div className={`text-sm font-semibold mb-1 ${today ? 'text-blue-600' : 'text-gray-700'}`}>
            {day}
          </div>
          <div className="space-y-1 overflow-y-auto max-h-20">
            {dayTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className={`text-xs px-2 py-1 rounded ${getPriorityColor(
                  task.priority
                )} text-white truncate`}
                title={task.title}
              >
                {task.title}
              </div>
            ))}
            {dayTasks.length > 3 && (
              <div className="text-xs text-gray-500 text-center">
                +{dayTasks.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-3 text-center text-sm font-semibold text-gray-700 bg-gray-50"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">{days}</div>
      </div>
    );
  };

  const renderSelectedDateDetails = () => {
    if (!selectedDate) return null;

    const dayTasks = getTasksForDate(selectedDate);

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tasks for {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h3>

        {dayTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No tasks scheduled for this day
          </div>
        ) : (
          <div className="space-y-3">
            {dayTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      task.status
                    )}`}
                  >
                    {task.status}
                  </span>
                </div>
                {task.description && (
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                )}
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span
                    className={`px-2 py-1 rounded ${getPriorityColor(
                      task.priority
                    )} text-white`}
                  >
                    {task.priority}
                  </span>
                  {task.dueDate && (
                    <span>⏰ {new Date(task.dueDate).toLocaleTimeString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return tasks
      .filter(task => {
        if (!task.dueDate || task.status === 'completed' || task.status === 'cancelled') {
          return false;
        }
        const dueDate = new Date(task.dueDate);
        return dueDate >= today;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Calendar</h1>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <button
            onClick={navigateToToday}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => navigateMonth(-1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ◀
          </button>
          <span className="px-4 py-2 font-semibold text-gray-900">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => navigateMonth(1)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total Tasks</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{tasks.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Due This Week</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {tasks.filter(t => {
              if (!t.dueDate) return false;
              const dueDate = new Date(t.dueDate);
              const today = new Date();
              const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
              return dueDate >= today && dueDate <= weekFromNow;
            }).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Overdue</div>
          <div className="text-2xl font-bold text-red-600 mt-1">
            {tasks.filter(t => {
              if (!t.dueDate || t.status === 'completed' || t.status === 'cancelled') {
                return false;
              }
              return new Date(t.dueDate) < new Date();
            }).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {tasks.filter(t => t.status === 'completed').length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          {renderMonthView()}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Details */}
          {selectedDate && renderSelectedDateDetails()}

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
            <div className="space-y-3">
              {getUpcomingTasks().map((task) => (
                <div
                  key={task.id}
                  className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 flex-1">
                      {task.title}
                    </h4>
                    <span
                      className={`ml-2 w-2 h-2 rounded-full ${getPriorityColor(
                        task.priority
                      )}`}
                      title={task.priority}
                    ></span>
                  </div>
                  <div className="text-xs text-gray-500">
                    📅 {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {getUpcomingTasks().length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No upcoming tasks
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Legend</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-700">Urgent</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-sm text-gray-700">High</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm text-gray-700">Medium</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-700">Low</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
