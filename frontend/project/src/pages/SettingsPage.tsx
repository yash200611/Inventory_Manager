import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDevices } from '../contexts/DeviceContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Settings as SettingsIcon,
  Shield,
  Moon,
  Sun,
  Building,
  Folder,
  RefreshCw,
  Trash2,
  Save,
  Plus,
  X,
  AlertTriangle
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { devices, users } = useDevices();
  const { theme, setTheme } = useTheme();
  const [departments, setDepartments] = useState(['IT', 'QA', 'Development', 'Marketing']);
  const [newDepartment, setNewDepartment] = useState('');
  const [exportPath, setExportPath] = useState('/shared/exports');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    checkoutReminders: true,
    maintenanceAlerts: true,
  });

  const isAdmin = user?.role === 'admin';

  const handleAddDepartment = () => {
    if (newDepartment.trim() && !departments.includes(newDepartment.trim())) {
      setDepartments([...departments, newDepartment.trim()]);
      setNewDepartment('');
    }
  };

  const handleRemoveDepartment = (dept: string) => {
    if (departments.length > 1) { // Keep at least one department
      setDepartments(departments.filter(d => d !== dept));
    }
  };

  const handleRefreshData = () => {
    // Simulate data refresh
    console.log('Refreshing system data...');
  };

  const handleDeleteAllData = () => {
    if (isAdmin) {
      // This would normally make API calls to delete all data
      console.log('Deleting all data...');
      setShowDeleteConfirm(false);
    }
  };

  const SettingCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    adminOnly?: boolean;
  }> = ({ title, icon, children, adminOnly = false }) => {
    if (adminOnly && !isAdmin) return null;

    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <div className="flex items-center space-x-2 mb-6">
          {icon}
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {adminOnly && (
            <div className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
              Admin Only
            </div>
          )}
        </div>
        {children}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your system configuration and preferences</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full border border-purple-500/30 capitalize">
            {user?.role}
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="space-y-6">
        {/* User Preferences */}
        <SettingCard
          title="User Preferences"
          icon={<SettingsIcon className="w-5 h-5 text-cyan-400" />}
        >
          <div className="space-y-6">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Theme</p>
                <p className="text-gray-400 text-sm">Choose your preferred color scheme</p>
              </div>
              <div className="flex items-center space-x-2 bg-white/5 rounded-xl p-1">
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    theme === 'dark' 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    theme === 'light' 
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span>Light</span>
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div>
              <p className="text-white font-medium mb-4">Notifications</p>
              <div className="space-y-3">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <p className="text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </p>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        value ? 'bg-gradient-to-r from-cyan-500 to-purple-600' : 'bg-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SettingCard>

        {/* System Configuration */}
        <SettingCard
          title="System Configuration"
          icon={<Shield className="w-5 h-5 text-cyan-400" />}
          adminOnly
        >
          <div className="space-y-6">
            {/* Export Settings */}
            <div>
              <p className="text-white font-medium mb-2">Export Location</p>
              <p className="text-gray-400 text-sm mb-3">Set the default path for CSV exports</p>
              <div className="flex items-center space-x-2">
                <Folder className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={exportPath}
                  onChange={(e) => setExportPath(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="/shared/exports"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 text-cyan-400 rounded-lg transition-colors">
                  <Save className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* System Actions */}
            <div>
              <p className="text-white font-medium mb-4">System Actions</p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleRefreshData}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors border border-blue-500/30"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh Data</span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete All Data</span>
                </button>
              </div>
            </div>
          </div>
        </SettingCard>

        {/* Department Management */}
        <SettingCard
          title="Department Management"
          icon={<Building className="w-5 h-5 text-cyan-400" />}
          adminOnly
        >
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">Manage organizational departments</p>
            
            {/* Add Department */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddDepartment()}
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="Add new department..."
              />
              <button
                onClick={handleAddDepartment}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 text-cyan-400 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Department List */}
            <div className="space-y-2">
              {departments.map((dept) => (
                <div key={dept} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white">{dept}</span>
                  <button
                    onClick={() => handleRemoveDepartment(dept)}
                    className="p-1 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                    disabled={departments.length <= 1}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </SettingCard>

        {/* System Statistics */}
        <SettingCard
          title="System Statistics"
          icon={<SettingsIcon className="w-5 h-5 text-cyan-400" />}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{devices.length}</p>
              <p className="text-gray-400 text-sm">Total Devices</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{users.length}</p>
              <p className="text-gray-400 text-sm">Total Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {devices.filter(d => d.status === 'Checked Out').length}
              </p>
              <p className="text-gray-400 text-sm">Active Checkouts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {Math.round((devices.filter(d => d.status === 'Available').length / devices.length) * 100)}%
              </p>
              <p className="text-gray-400 text-sm">Availability</p>
            </div>
          </div>
        </SettingCard>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-red-500/20 p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Delete All Data</h2>
                <p className="text-red-400 text-sm">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6">
              Are you sure you want to delete all devices, users, and system data? 
              This will permanently remove all information from the system.
            </p>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleDeleteAllData}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg transition-all duration-200"
              >
                Delete Everything
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;