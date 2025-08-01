export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  role: 'admin' | 'viewer';
  department: string;
  status: 'active' | 'inactive';
}

export interface Device {
  id: string;
  name: string;
  type: 'iPhone' | 'iPad' | 'Android Phone' | 'Android Tablet' | 'Laptop' | 'Desktop';
  serialNumber: string;
  osVersion: string;
  status: 'Available' | 'Checked Out' | 'Under Maintenance' | 'Retired';
  assignedTo?: string;
  assignedUser?: string;
  lastCheckout?: string;
  lastCheckin?: string;
  location: string;
  purchaseDate: string;
  notes?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export interface DeviceState {
  devices: Device[];
  users: User[];
  loading: boolean;
  error: string | null;
  addDevice: (device: Omit<Device, 'id'>) => Promise<void>;
  updateDevice: (id: string, updates: Partial<Device>) => Promise<void>;
  deleteDevice: (id: string) => void;
  checkoutDevice: (deviceId: string, userId: string) => Promise<void>;
  checkinDevice: (deviceId: string) => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
}