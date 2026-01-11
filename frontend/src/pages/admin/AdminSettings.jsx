import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function AdminSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    systemName: 'Task Manager Pro',
    emailNotifications: true,
    pushNotifications: false,
    taskAutoAssignment: false,
    taskDueDateReminder: true,
    reminderDaysBefore: 1,
    workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    workingHoursStart: '09:00',
    workingHoursEnd: '17:00',
    defaultTaskPriority: 'medium',
    allowTaskSelfAssignment: true,
    requireTaskApproval: false,
    maxTasksPerEmployee: 20,
    sessionTimeout: 60,
    passwordMinLength: 8,
    passwordRequireSpecialChar: true,
    allowUserRegistration: false,
    maintenanceMode: false
  });

  const [adminProfile, setAdminProfile] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (user) {
      setAdminProfile({
        ...adminProfile,
        name: user.name,
        email: user.email
      });
    }
  }, [user]);

  const handleSettingChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleWorkingDayToggle = (day) => {
    const days = settings.workingDays.includes(day)
      ? settings.workingDays.filter(d => d !== day)
      : [...settings.workingDays, day];
    setSettings({ ...settings, workingDays: days });
  };

  const saveSettings = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // In a real app, this would save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('appSettings', JSON.stringify(settings));
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    
    if (adminProfile.newPassword && adminProfile.newPassword !== adminProfile.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match!' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const updateData = {
        name: adminProfile.name,
        email: adminProfile.email
      };

      if (adminProfile.newPassword) {
        updateData.currentPassword = adminProfile.currentPassword;
        updateData.newPassword = adminProfile.newPassword;
      }

      await api.put(`/users/${user.id}`, updateData);
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setAdminProfile({
        ...adminProfile,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to update profile. Please try again.' 
      });
    } finally {
      setSaving(false);
    }
  };

  const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>

      {message.text && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['general', 'notifications', 'tasks', 'security', 'profile'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              System Name
            </label>
            <input
              type="text"
              value={settings.systemName}
              onChange={(e) => handleSettingChange('systemName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Working Days
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {weekDays.map((day) => (
                <button
                  key={day}
                  onClick={() => handleWorkingDayToggle(day)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                    settings.workingDays.includes(day)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working Hours Start
              </label>
              <input
                type="time"
                value={settings.workingHoursStart}
                onChange={(e) => handleSettingChange('workingHoursStart', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working Hours End
              </label>
              <input
                type="time"
                value={settings.workingHoursEnd}
                onChange={(e) => handleSettingChange('workingHoursEnd', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Maintenance Mode</div>
              <div className="text-sm text-gray-600">
                Enable this to put the system in maintenance mode
              </div>
            </div>
            <button
              onClick={() => handleSettingChange('maintenanceMode', !settings.maintenanceMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Notifications Settings */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Email Notifications</div>
              <div className="text-sm text-gray-600">Send notifications via email</div>
            </div>
            <button
              onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Push Notifications</div>
              <div className="text-sm text-gray-600">Send browser push notifications</div>
            </div>
            <button
              onClick={() => handleSettingChange('pushNotifications', !settings.pushNotifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Task Due Date Reminders</div>
              <div className="text-sm text-gray-600">Remind users of upcoming due dates</div>
            </div>
            <button
              onClick={() => handleSettingChange('taskDueDateReminder', !settings.taskDueDateReminder)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.taskDueDateReminder ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.taskDueDateReminder ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {settings.taskDueDateReminder && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Days Before Due Date
              </label>
              <input
                type="number"
                min="1"
                max="7"
                value={settings.reminderDaysBefore}
                onChange={(e) => handleSettingChange('reminderDaysBefore', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>
      )}

      {/* Task Settings */}
      {activeTab === 'tasks' && (
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Task Priority
            </label>
            <select
              value={settings.defaultTaskPriority}
              onChange={(e) => handleSettingChange('defaultTaskPriority', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Tasks Per Employee
            </label>
            <input
              type="number"
              min="5"
              max="100"
              value={settings.maxTasksPerEmployee}
              onChange={(e) => handleSettingChange('maxTasksPerEmployee', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Task Auto-Assignment</div>
              <div className="text-sm text-gray-600">Automatically assign tasks to available employees</div>
            </div>
            <button
              onClick={() => handleSettingChange('taskAutoAssignment', !settings.taskAutoAssignment)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.taskAutoAssignment ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.taskAutoAssignment ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Allow Task Self-Assignment</div>
              <div className="text-sm text-gray-600">Let employees assign tasks to themselves</div>
            </div>
            <button
              onClick={() => handleSettingChange('allowTaskSelfAssignment', !settings.allowTaskSelfAssignment)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.allowTaskSelfAssignment ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.allowTaskSelfAssignment ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Require Task Approval</div>
              <div className="text-sm text-gray-600">Tasks must be approved by admin before assignment</div>
            </div>
            <button
              onClick={() => handleSettingChange('requireTaskApproval', !settings.requireTaskApproval)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.requireTaskApproval ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.requireTaskApproval ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              min="15"
              max="480"
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Minimum Length
            </label>
            <input
              type="number"
              min="6"
              max="32"
              value={settings.passwordMinLength}
              onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Require Special Characters in Password</div>
              <div className="text-sm text-gray-600">Passwords must include special characters</div>
            </div>
            <button
              onClick={() => handleSettingChange('passwordRequireSpecialChar', !settings.passwordRequireSpecialChar)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.passwordRequireSpecialChar ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.passwordRequireSpecialChar ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium text-gray-900">Allow User Registration</div>
              <div className="text-sm text-gray-600">Let new users register accounts</div>
            </div>
            <button
              onClick={() => handleSettingChange('allowUserRegistration', !settings.allowUserRegistration)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.allowUserRegistration ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.allowUserRegistration ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={updateProfile} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={adminProfile.name}
                onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={adminProfile.email}
                onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <hr className="my-6" />

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={adminProfile.currentPassword}
                onChange={(e) => setAdminProfile({ ...adminProfile, currentPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={adminProfile.newPassword}
                onChange={(e) => setAdminProfile({ ...adminProfile, newPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={adminProfile.confirmPassword}
                onChange={(e) => setAdminProfile({ ...adminProfile, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {saving ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      )}

      {/* Save Button (for non-profile tabs) */}
      {activeTab !== 'profile' && (
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      )}
    </div>
  );
}
