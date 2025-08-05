import React, { useState } from 'react';
import { Device } from '../types';
import { 
  Edit, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  User,
  Smartphone,
  Laptop,
  Monitor,
  Tablet,
  Save,
  XCircle
} from 'lucide-react';

interface DeviceTableProps {
  devices: Device[];
  onCheckout: (deviceId: string) => void;
  onCheckin: (deviceId: string) => void;
  onEdit: (deviceId: string) => void;
  onDelete: (deviceId: string) => void;
}

const DeviceTable: React.FC<DeviceTableProps> = ({
  devices,
  onCheckout,
  onCheckin,
  onEdit,
  onDelete
}) => {
  const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});

  const startEditing = (device: Device) => {
    setEditingDeviceId(device.id);
    setEditFormData({
      name: device.name,
      osVersion: device.osVersion,
      location: device.location,
      notes: device.notes
    });
  };

  const cancelEditing = () => {
    setEditingDeviceId(null);
    setEditFormData({});
  };

  const saveDevice = () => {
    // In a real app, this would call an API to update the device
    alert(`Device ${editFormData.name} updated successfully!`);
    cancelEditing();
  };
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'iPhone':
      case 'Android Phone':
        return <Smartphone className="w-4 h-4" />;
      case 'iPad':
      case 'Android Tablet':
        return <Tablet className="w-4 h-4" />;
      case 'Laptop':
        return <Laptop className="w-4 h-4" />;
      case 'Desktop':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Smartphone className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Available':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Checked Out':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'Under Maintenance':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'Retired':
        return <Clock className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Checked Out':
        return 'bg-blue-100 text-blue-800';
      case 'Under Maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Retired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (devices.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No devices found</div>
        <div className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Device
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Serial Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                OS Version
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {devices.map((device) => (
              <tr key={device.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getDeviceIcon(device.type)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {device.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {device.purchaseDate}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{device.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white font-mono">
                    {device.serialNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{device.osVersion}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(device.status)}
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(device.status)}`}>
                      {device.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {device.assignedUser || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{device.location}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {device.status === 'Available' ? (
                      <button
                        onClick={() => onCheckout(device.id)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        Check Out
                      </button>
                    ) : (
                      <button
                        onClick={() => onCheckin(device.id)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                      >
                        Check In
                      </button>
                    )}
                    <button
                      onClick={() => onEdit(device.id)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(device.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeviceTable; 