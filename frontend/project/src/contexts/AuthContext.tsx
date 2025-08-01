import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, User } from '../types';

const mockUsers: User[] = [
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
  }
];

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      const { user: savedUser } = JSON.parse(savedAuth);
      setUser(savedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const foundUser = mockUsers.find(u => u.username === username && u.password === password);
    if (foundUser && foundUser.status === 'active') {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('auth', JSON.stringify({ user: foundUser }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};