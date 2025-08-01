import React, { createContext, useContext, useState, useEffect } from 'react';
import { DeviceState, Device, User } from '../types';
import { apiService, convertApiDeviceToDevice, convertDeviceToApiDevice, convertApiUserToUser, convertUserToApiUser } from '../services/api';

const mockDevices: Device[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    type: 'iPhone',
    serialNumber: 'A1B2C3D4E5',
    osVersion: 'iOS 17.2',
    status: 'Checked Out',
    assignedTo: '3',
    assignedUser: 'John Doe',
    lastCheckout: '2024-01-15T10:30:00Z',
    location: 'Building A - Floor 2',
    purchaseDate: '2023-09-15',
    notes: 'Primary testing device for iOS apps'
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24',
    type: 'Android Phone',
    serialNumber: 'S24-789XYZ',
    osVersion: 'Android 14',
    status: 'Available',
    location: 'Building A - Floor 2',
    purchaseDate: '2024-01-10',
    notes: 'Latest Android device for testing'
  },
  {
    id: '3',
    name: 'iPad Pro 12.9"',
    type: 'iPad',
    serialNumber: 'IPD-456ABC',
    osVersion: 'iPadOS 17.2',
    status: 'Under Maintenance',
    location: 'IT Department',
    purchaseDate: '2023-08-20',
    notes: 'Screen replacement in progress'
  },
  {
    id: '4',
    name: 'MacBook Pro M3',
    type: 'Laptop',
    serialNumber: 'MBP-M3-001',
    osVersion: 'macOS 14.2',
    status: 'Available',
    location: 'Building B - Floor 1',
    purchaseDate: '2023-11-01',
    notes: 'Development workstation'
  },
  {
    id: '5',
    name: 'Pixel 8 Pro',
    type: 'Android Phone',
    serialNumber: 'PX8-PRO-789',
    osVersion: 'Android 14',
    status: 'Checked Out',
    assignedTo: '2',
    assignedUser: 'Viewer User',
    lastCheckout: '2024-01-12T14:20:00Z',
    location: 'Building A - Floor 3',
    purchaseDate: '2023-10-15',
    notes: 'Google services testing'
  }
];

const mockUsersData: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'admin',
    department: 'IT',
    status: 'active'
  },
  {
    id: '2',
    username: 'viewer',
    password: 'viewer123',
    name: 'Viewer User',
    email: 'viewer@company.com',
    role: 'viewer',
    department: 'QA',
    status: 'active'
  },
  {
    id: '3',
    username: 'john.doe',
    password: 'password123',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'viewer',
    department: 'QA',
    status: 'active'
  },
  {
    id: '4',
    username: 'jane.smith',
    password: 'password123',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: 'viewer',
    department: 'Development',
    status: 'active'
  }
];

const DeviceContext = createContext<DeviceState | undefined>(undefined);

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [apiDevices, apiUsers] = await Promise.all([
          apiService.getDevices(),
          apiService.getUsers()
        ]);
        
        setDevices(apiDevices.map(convertApiDeviceToDevice));
        setUsers(apiUsers.map(convertApiUserToUser));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        // Fallback to mock data if API is not available
        setDevices(mockDevices);
        setUsers(mockUsersData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addDevice = async (deviceData: Omit<Device, 'id'>) => {
    try {
      const apiDevice = convertDeviceToApiDevice(deviceData);
      const newApiDevice = await apiService.addDevice(apiDevice);
      const newDevice = convertApiDeviceToDevice(newApiDevice);
      setDevices(prev => [...prev, newDevice]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add device');
      // Fallback to local state
      const newDevice: Device = {
        ...deviceData,
        id: Date.now().toString()
      };
      setDevices(prev => [...prev, newDevice]);
    }
  };

  const updateDevice = async (id: string, updates: Partial<Device>) => {
    try {
      const apiUpdates = convertDeviceToApiDevice(updates as any);
      const updatedApiDevice = await apiService.updateDevice(id, apiUpdates);
      const updatedDevice = convertApiDeviceToDevice(updatedApiDevice);
      setDevices(prev => prev.map(device => 
        device.id === id ? updatedDevice : device
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update device');
      // Fallback to local state
      setDevices(prev => prev.map(device => 
        device.id === id ? { ...device, ...updates } : device
      ));
    }
  };

  const deleteDevice = (id: string) => {
    setDevices(prev => prev.filter(device => device.id !== id));
  };

  const checkoutDevice = async (deviceId: string, userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      const updatedApiDevice = await apiService.checkoutDevice(deviceId, user?.email || userId);
      const updatedDevice = convertApiDeviceToDevice(updatedApiDevice);
      setDevices(prev => prev.map(device => 
        device.id === deviceId ? updatedDevice : device
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to checkout device');
      // Fallback to local state
      const user = users.find(u => u.id === userId);
      setDevices(prev => prev.map(device => 
        device.id === deviceId ? {
          ...device,
          status: 'Checked Out' as const,
          assignedTo: userId,
          assignedUser: user?.name,
          lastCheckout: new Date().toISOString()
        } : device
      ));
    }
  };

  const checkinDevice = async (deviceId: string) => {
    try {
      const updatedApiDevice = await apiService.checkinDevice(deviceId);
      const updatedDevice = convertApiDeviceToDevice(updatedApiDevice);
      setDevices(prev => prev.map(device => 
        device.id === deviceId ? updatedDevice : device
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to checkin device');
      // Fallback to local state
      setDevices(prev => prev.map(device => 
        device.id === deviceId ? {
          ...device,
          status: 'Available' as const,
          assignedTo: undefined,
          assignedUser: undefined,
          lastCheckin: new Date().toISOString()
        } : device
      ));
    }
  };

  const addUser = async (userData: Omit<User, 'id'>) => {
    try {
      const apiUser = convertUserToApiUser(userData);
      const newApiUser = await apiService.addUser(apiUser);
      const newUser = convertApiUserToUser(newApiUser);
      setUsers(prev => [...prev, newUser]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add user');
      // Fallback to local state
      const newUser: User = {
        ...userData,
        id: Date.now().toString()
      };
      setUsers(prev => [...prev, newUser]);
    }
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    // Also clear any device assignments
    setDevices(prev => prev.map(device => 
      device.assignedTo === id ? {
        ...device,
        status: 'Available' as const,
        assignedTo: undefined,
        assignedUser: undefined
      } : device
    ));
  };

  return (
    <DeviceContext.Provider value={{
      devices,
      users,
      loading,
      error,
      addDevice,
      updateDevice,
      deleteDevice,
      checkoutDevice,
      checkinDevice,
      addUser,
      updateUser,
      deleteUser
    }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevices must be used within a DeviceProvider');
  }
  return context;
};