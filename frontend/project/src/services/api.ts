const API_BASE_URL = 'http://localhost:5002';

export interface ApiDevice {
  id: string;
  device_type: string;
  connectivity: string;
  serial_number: string;
  os_version: string;
  assigned_user: string;
  status: string;
  usage_count: number;
  check_out_date: string;
  created_at: string;
  last_updated: string;
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: string;
  join_date: string;
}

export interface ApiHistory {
  id: string;
  device_id: string;
  user: string;
  action: string;
  timestamp: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('🌐 API Request:', url);
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }));
        console.error('❌ API Error:', error);
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Success:', data.length || 'data received');
      return data;
    } catch (error) {
      console.error('🚨 Fetch Error:', error);
      throw error;
    }
  }

  // Device endpoints
  async getDevices(): Promise<ApiDevice[]> {
    return this.request<ApiDevice[]>('/devices');
  }

  async getDevice(id: string): Promise<ApiDevice> {
    return this.request<ApiDevice>(`/devices/${id}`);
  }

  async searchDevices(query: string): Promise<ApiDevice[]> {
    return this.request<ApiDevice[]>(`/devices/search?q=${encodeURIComponent(query)}`);
  }

  async addDevice(device: Omit<ApiDevice, 'id' | 'created_at' | 'last_updated'>): Promise<ApiDevice> {
    return this.request<ApiDevice>('/devices', {
      method: 'POST',
      body: JSON.stringify(device),
    });
  }

  async updateDevice(id: string, updates: Partial<ApiDevice>): Promise<ApiDevice> {
    return this.request<ApiDevice>(`/devices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async checkoutDevice(id: string, user: string): Promise<ApiDevice> {
    return this.request<ApiDevice>(`/devices/${id}/checkout`, {
      method: 'PUT',
      body: JSON.stringify({ user }),
    });
  }

  async checkinDevice(id: string): Promise<ApiDevice> {
    return this.request<ApiDevice>(`/devices/${id}/checkin`, {
      method: 'PUT',
    });
  }

  async getDeviceRecommendations(): Promise<ApiDevice[]> {
    return this.request<ApiDevice[]>('/devices/recommendations');
  }

  // User endpoints
  async getUsers(): Promise<ApiUser[]> {
    return this.request<ApiUser[]>('/users');
  }

  async addUser(user: Omit<ApiUser, 'id' | 'join_date'>): Promise<ApiUser> {
    return this.request<ApiUser>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  // History endpoints
  async getDeviceHistory(deviceId: string): Promise<ApiHistory[]> {
    return this.request<ApiHistory[]>(`/history/${deviceId}`);
  }
}

export const apiService = new ApiService();

// Utility functions to convert between frontend and API types
export const convertApiDeviceToDevice = (apiDevice: ApiDevice) => {
  // Intelligently map device types to categories
  const getDeviceCategory = (deviceType: string): string => {
    const lowerType = deviceType.toLowerCase();
    
    // Mobile devices
    if (lowerType.includes('iphone') || lowerType.includes('ipad')) {
      return lowerType.includes('ipad') ? 'iPad' : 'iPhone';
    }
    if (lowerType.includes('galaxy') || lowerType.includes('samsung') || 
        lowerType.includes('pixel') || lowerType.includes('google') ||
        lowerType.includes('motorola') || lowerType.includes('oneplus') ||
        lowerType.includes('nokia') || lowerType.includes('oppo') ||
        lowerType.includes('redmi') || lowerType.includes('tcl') ||
        lowerType.includes('fold') || lowerType.includes('flip')) {
      return 'Android Phone';
    }
    
    // Laptop/Desktop devices
    if (lowerType.includes('laptop') || lowerType.includes('macbook') ||
        lowerType.includes('desktop') || lowerType.includes('pc')) {
      return lowerType.includes('laptop') || lowerType.includes('macbook') ? 'Laptop' : 'Desktop';
    }
    
    // Default to mobile if it's a phone-like device
    return 'Android Phone';
  };

  return {
    id: apiDevice.id,
    name: `${apiDevice.device_type} - ${apiDevice.serial_number || 'No Serial'}`,
    type: getDeviceCategory(apiDevice.device_type),
    serialNumber: apiDevice.serial_number || 'No Serial',
    osVersion: apiDevice.os_version,
    status: apiDevice.status as any,
    assignedTo: apiDevice.assigned_user || undefined,
    assignedUser: apiDevice.assigned_user || undefined,
    lastCheckout: apiDevice.check_out_date || undefined,
    location: 'Building A - Floor 2', // Default location since API doesn't have this
    purchaseDate: apiDevice.created_at.split('T')[0],
    notes: `Usage count: ${apiDevice.usage_count}`,
  };
};

export const convertDeviceToApiDevice = (device: any): Omit<ApiDevice, 'id' | 'created_at' | 'last_updated'> => ({
  device_type: device.type,
  connectivity: 'WiFi', // Default connectivity
  serial_number: device.serialNumber,
  os_version: device.osVersion,
  assigned_user: device.assignedUser || '',
  status: device.status,
  usage_count: 0,
  check_out_date: device.lastCheckout || '',
});

export const convertApiUserToUser = (apiUser: ApiUser) => ({
  id: apiUser.id,
  username: apiUser.email.split('@')[0],
  password: '', // Not stored in API
  name: apiUser.name,
  email: apiUser.email,
  role: apiUser.role as 'admin' | 'viewer',
  department: apiUser.department,
  status: apiUser.status as 'active' | 'inactive',
});

export const convertUserToApiUser = (user: any): Omit<ApiUser, 'id' | 'join_date'> => ({
  name: user.name,
  email: user.email,
  department: user.department,
  role: user.role,
  status: user.status,
}); 