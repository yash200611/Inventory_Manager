import React, { useState, useMemo } from 'react';
import { useDevices } from '../contexts/DeviceContext';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import DeviceTable from '../components/DeviceTable';
import {
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  X,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  User
} from 'lucide-react';

const deviceSchema = z.object({
  name: z.string().min(1, 'Device name is required'),
  type: z.enum(['iPhone', 'iPad', 'Android Phone', 'Android Tablet', 'Laptop', 'Desktop']),
  serialNumber: z.string().min(1, 'Serial number is required'),
  osVersion: z.string().min(1, 'OS version is required'),
  location: z.string().min(1, 'Location is required'),
  purchaseDate: z.string().min(1, 'Purchase date is required'),
  notes: z.string().optional(),
});

type DeviceFormData = z.infer<typeof deviceSchema>;

const DevicesPage: React.FC = () => {
  const { devices, users, loading, error, addDevice, updateDevice, deleteDevice, checkoutDevice, checkinDevice } = useDevices();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
  });

  const filteredDevices = useMemo(() => {
    const filtered = devices.filter(device => {
      const matchesSearch = 
        device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.osVersion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (device.assignedUser && device.assignedUser.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
      const matchesType = typeFilter === 'all' || device.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    // Sort by most recent first (last_updated or created_at)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.lastCheckout || a.purchaseDate).getTime();
      const dateB = new Date(b.lastCheckout || b.purchaseDate).getTime();
      return dateB - dateA;
    });
  }, [devices, searchTerm, statusFilter, typeFilter]);

  const onSubmit = (data: DeviceFormData) => {
    addDevice({
      ...data,
      status: 'Available'
    });
    reset();
    setShowAddModal(false);
  };

  const handleCheckout = () => {
    if (selectedDevice && selectedUserId) {
      checkoutDevice(selectedDevice, selectedUserId);
      setShowCheckoutModal(false);
      setSelectedDevice(null);
      setSelectedUserId('');
    }
  };

  const handleCheckin = (deviceId: string) => {
    checkinDevice(deviceId);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'iPhone':
      case 'Android Phone':
        return <Smartphone className="w-5 h-5" />;
      case 'iPad':
      case 'Android Tablet':
        return <Tablet className="w-5 h-5" />;
      case 'Laptop':
        return <Laptop className="w-5 h-5" />;
      case 'Desktop':
        return <Monitor className="w-5 h-5" />;
      default:
        return <Smartphone className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Checked Out':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Under Maintenance':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Retired':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Available':
        return <CheckCircle className="w-4 h-4" />;
      case 'Checked Out':
        return <User className="w-4 h-4" />;
      case 'Under Maintenance':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Retired':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Type,Serial Number,OS Version,Status,Assigned To,Location,Purchase Date,Notes\n" +
      filteredDevices.map(d => 
        `"${d.name}","${d.type}","${d.serialNumber}","${d.osVersion}","${d.status}","${d.assignedUser || ''}","${d.location}","${d.purchaseDate}","${d.notes || ''}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "devices.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Inventory Management</h1>
          <p className="text-gray-400">Manage and track all your testing devices</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl transition-colors border border-green-500/30"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Device</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-colors"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-colors appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Checked Out">Checked Out</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Retired">Retired</option>
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-colors appearance-none"
            >
              <option value="all">All Types</option>
              <option value="iPhone">iPhone</option>
              <option value="iPad">iPad</option>
              <option value="Android Phone">Android Phone</option>
              <option value="Android Tablet">Android Tablet</option>
              <option value="Laptop">Laptop</option>
              <option value="Desktop">Desktop</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          error={error} 
          onDismiss={() => {}} // TODO: Add error dismissal functionality
        />
      )}

      {/* Loading State */}
      {loading ? (
        <LoadingSpinner message="Loading devices..." />
      ) : (
        /* Devices Table */
        <DeviceTable
          devices={filteredDevices}
          onCheckout={(deviceId) => {
            setSelectedDevice(deviceId);
            setShowCheckoutModal(true);
          }}
          onCheckin={handleCheckin}
          onEdit={(deviceId) => {/* Handle edit */}}
          onDelete={deleteDevice}
        />
      )}

      {filteredDevices.length === 0 && !loading && (
        <div className="text-center py-12">
          <Smartphone className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-400 mb-2">No devices found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Add New Device</h2>
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
                <label className="block text-sm font-medium text-gray-200 mb-1">Device Name</label>
                <input
                  {...register('name')}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="e.g., iPhone 15 Pro"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Type</label>
                <select
                  {...register('type')}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  <option value="iPhone">iPhone</option>
                  <option value="iPad">iPad</option>
                  <option value="Android Phone">Android Phone</option>
                  <option value="Android Tablet">Android Tablet</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Desktop">Desktop</option>
                </select>
                {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Serial Number</label>
                <input
                  {...register('serialNumber')}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="e.g., A1B2C3D4E5"
                />
                {errors.serialNumber && <p className="text-red-400 text-sm mt-1">{errors.serialNumber.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">OS Version</label>
                <input
                  {...register('osVersion')}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="e.g., iOS 17.2"
                />
                {errors.osVersion && <p className="text-red-400 text-sm mt-1">{errors.osVersion.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Location</label>
                <input
                  {...register('location')}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="e.g., Building A - Floor 2"
                />
                {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Purchase Date</label>
                <input
                  {...register('purchaseDate')}
                  type="date"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
                {errors.purchaseDate && <p className="text-red-400 text-sm mt-1">{errors.purchaseDate.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Notes (Optional)</label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200"
                >
                  Add Device
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

      {/* Checkout Modal */}
      {showCheckoutModal && selectedDevice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Check Out Device</h2>
              <button
                onClick={() => {
                  setShowCheckoutModal(false);
                  setSelectedDevice(null);
                  setSelectedUserId('');
                }}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-400 mb-2">Device:</p>
              <p className="text-white font-medium">
                {devices.find(d => d.id === selectedDevice)?.name}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-200 mb-2">Assign to User</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                <option value="">Select a user...</option>
                {users.filter(u => u.status === 'active').map(user => (
                  <option key={user.id} value={user.id}>{user.name} ({user.department})</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCheckout}
                disabled={!selectedUserId}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Check Out
              </button>
              <button
                onClick={() => {
                  setShowCheckoutModal(false);
                  setSelectedDevice(null);
                  setSelectedUserId('');
                }}
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

export default DevicesPage;