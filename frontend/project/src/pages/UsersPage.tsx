import React, { useState, useMemo } from 'react';
import { useDevices } from '../contexts/DeviceContext';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Search,
  Users as UsersIcon,
  Plus,
  Download,
  User,
  Mail,
  Building,
  Smartphone,
  X,
  Trash2,
  Shield,
  Eye,
  Edit3,
  Save,
  XCircle
} from 'lucide-react';

const userSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'viewer']),
  department: z.string().min(1, 'Department is required'),
});

type UserFormData = z.infer<typeof userSchema>;

const UsersPage: React.FC = () => {
  const { users, devices, addUser, deleteUser } = useDevices();
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const getUserDevices = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return [];
    
    // Match devices by user name or email since backend stores assigned_user as name/email
    return devices.filter(device => 
      device.assignedUser === user.name || 
      device.assignedUser === user.email ||
      device.assignedTo === userId
    );
  };

  const getUserDeviceCount = (userId: string) => {
    return getUserDevices(userId).length;
  };

  const onSubmit = (data: UserFormData) => {
    addUser({
      ...data,
      status: 'active'
    });
    reset();
    setShowAddModal(false);
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Username,Email,Role,Department,Device Count,Status\n" +
      filteredUsers.map(u => 
        `"${u.name}","${u.username}","${u.email}","${u.role}","${u.department}","${getUserDeviceCount(u.id)}","${u.status}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startEditing = (user: any) => {
    setEditingUserId(user.id);
    setEditFormData({
      name: user.name,
      email: user.email,
      department: user.department,
      role: user.role,
      status: user.status
    });
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditFormData({});
  };

  const saveUser = async () => {
    // In a real app, this would call an API to update the user
    // For now, we'll just show a success message
    alert(`User ${editFormData.name} updated successfully!`);
    cancelEditing();
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' 
      ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      : 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  const getRoleIcon = (role: string) => {
    return role === 'admin' ? <Shield className="w-4 h-4" /> : <Eye className="w-4 h-4" />;
  };

  const departments = [...new Set(users.map(u => u.department))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-gray-400">Manage your QA team members and their access</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl transition-colors border border-green-500/30"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center">
              <UsersIcon className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-white">
                {users.filter(u => u.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Admins</p>
              <p className="text-2xl font-bold text-white">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center">
              <Building className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Departments</p>
              <p className="text-2xl font-bold text-white">{departments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">USER</th>
                <th className="text-left p-4 text-gray-300 font-medium">CONTACT</th>
                <th className="text-left p-4 text-gray-300 font-medium">ROLE</th>
                <th className="text-left p-4 text-gray-300 font-medium">DEPARTMENT</th>
                <th className="text-left p-4 text-gray-300 font-medium">DEVICES</th>
                <th className="text-left p-4 text-gray-300 font-medium">STATUS</th>
                <th className="text-left p-4 text-gray-300 font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const userDevices = getUserDevices(user.id);
                const deviceTypes = [...new Set(userDevices.map(d => d.type))];
                
                return (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                          <span className="text-sm font-bold text-cyan-400">
                            {(editingUserId === user.id ? editFormData.name : user.name).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          {editingUserId === user.id ? (
                            <input
                              value={editFormData.name}
                              onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                              className="text-white font-medium bg-white/10 border border-white/20 rounded px-2 py-1 text-sm w-32"
                            />
                          ) : (
                            <p className="text-white font-medium">{user.name}</p>
                          )}
                          <p className="text-gray-400 text-sm">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-gray-300 text-sm">
                          <Mail className="w-3 h-3" />
                          {editingUserId === user.id ? (
                            <input
                              value={editFormData.email}
                              onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                              className="text-gray-300 bg-white/10 border border-white/20 rounded px-2 py-1 text-sm w-40"
                            />
                          ) : (
                            <span className="truncate max-w-48">{user.email}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {editingUserId === user.id ? (
                        <select
                          value={editFormData.role}
                          onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                          className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white"
                        >
                          <option value="viewer">Viewer</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-medium ${getRoleColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          <span className="capitalize">{user.role}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2 text-gray-300 text-sm">
                        <Building className="w-3 h-3" />
                        {editingUserId === user.id ? (
                          <input
                            value={editFormData.department}
                            onChange={(e) => setEditFormData({...editFormData, department: e.target.value})}
                            className="text-gray-300 bg-white/10 border border-white/20 rounded px-2 py-1 text-sm w-24"
                          />
                        ) : (
                          <span>{user.department}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Smartphone className="w-4 h-4 text-cyan-400" />
                          <span className="text-white font-medium">{userDevices.length}</span>
                          <span className="text-gray-400 text-sm">devices</span>
                        </div>
                        {deviceTypes.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {deviceTypes.slice(0, 3).map((type, index) => (
                              <span key={index} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                                {type}
                              </span>
                            ))}
                            {deviceTypes.length > 3 && (
                              <span className="px-2 py-0.5 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                                +{deviceTypes.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          user.status === 'active' ? 'bg-green-400' : 'bg-gray-400'
                        }`}></div>
                        {user.status}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {editingUserId === user.id ? (
                          <>
                            <button
                              onClick={saveUser}
                              className="flex items-center space-x-1 px-2 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm rounded-lg transition-all duration-200"
                            >
                              <Save className="w-3 h-3" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="p-1 text-gray-400 hover:bg-gray-500/20 rounded-lg transition-colors"
                            >
                              <XCircle className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setShowDevicesModal(true);
                              }}
                              className="flex items-center space-x-1 px-2 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 text-cyan-400 text-sm rounded-lg transition-all duration-200"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View</span>
                            </button>
                            
                            {currentUser?.role === 'admin' && (
                              <>
                                <button
                                  onClick={() => startEditing(user)}
                                  className="p-1 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                
                                {user.id !== currentUser.id && (
                                  <button
                                    onClick={() => deleteUser(user.id)}
                                    className="p-1 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <UsersIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search</p>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add New User</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  reset();
                }}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Full Name</label>
                <input
                  {...register('name')}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="e.g., John Doe"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Username</label>
                <input
                  {...register('username')}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="e.g., john.doe"
                />
                {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="john.doe@company.com"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Password</label>
                <input
                  {...register('password')}
                  type="password"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="Minimum 6 characters"
                />
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Role</label>
                <select
                  {...register('role')}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && <p className="text-red-400 text-sm mt-1">{errors.role.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Department</label>
                <input
                  {...register('department')}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="e.g., QA, Development, IT"
                />
                {errors.department && <p className="text-red-400 text-sm mt-1">{errors.department.message}</p>}
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200"
                >
                  Add User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    reset();
                  }}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Devices Modal */}
      {showDevicesModal && selectedUserId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Devices for {users.find(u => u.id === selectedUserId)?.name}
              </h2>
              <button
                onClick={() => {
                  setShowDevicesModal(false);
                  setSelectedUserId(null);
                }}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {getUserDevices(selectedUserId).length > 0 ? (
              <div className="space-y-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-cyan-400">{getUserDevices(selectedUserId).length}</p>
                    <p className="text-gray-400 text-sm">Total Devices</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-green-400">
                      {getUserDevices(selectedUserId).filter(d => d.status === 'Checked Out').length}
                    </p>
                    <p className="text-gray-400 text-sm">Active</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-purple-400">
                      {[...new Set(getUserDevices(selectedUserId).map(d => d.type))].length}
                    </p>
                    <p className="text-gray-400 text-sm">Types</p>
                  </div>
                </div>

                {/* Device List */}
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {getUserDevices(selectedUserId).map((device) => (
                    <div key={device.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                            <Smartphone className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="text-white font-medium">{device.name}</p>
                              <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 text-xs rounded-full">
                                {device.type}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <p className="text-gray-400 text-sm">
                                <span className="font-medium">Serial:</span> {device.serialNumber}
                              </p>
                              <p className="text-gray-400 text-sm">
                                <span className="font-medium">OS:</span> {device.osVersion}
                              </p>
                              <p className="text-gray-400 text-sm">
                                <span className="font-medium">Location:</span> {device.location}
                              </p>
                              {device.lastCheckout && (
                                <p className="text-gray-400 text-sm">
                                  <span className="font-medium">Checked out:</span> {new Date(device.lastCheckout).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            device.status === 'Available' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : device.status === 'Checked Out'
                              ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                              : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                          }`}>
                            {device.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Smartphone className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No devices assigned to this user</p>
                <p className="text-gray-500 text-sm mt-2">Devices will appear here when assigned</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;