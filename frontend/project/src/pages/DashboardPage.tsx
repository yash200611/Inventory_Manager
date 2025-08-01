import React from 'react';
import { useDevices } from '../contexts/DeviceContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Smartphone, 
  Users, 
  Activity, 
  Plus,
  Download,
  Upload,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { devices, users } = useDevices();
  const { user } = useAuth();

  const stats = {
    totalDevices: devices.length,
    availableDevices: devices.filter(d => d.status === 'Available').length,
    checkedOutDevices: devices.filter(d => d.status === 'Checked Out').length,
    maintenanceDevices: devices.filter(d => d.status === 'Under Maintenance').length,
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
  };

  const recentCheckouts = devices
    .filter(d => d.status === 'Checked Out' && d.lastCheckout)
    .sort((a, b) => new Date(b.lastCheckout!).getTime() - new Date(a.lastCheckout!).getTime())
    .slice(0, 5);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    trendUp?: boolean;
    color: string;
  }> = ({ title, value, icon, trend, trendUp, color }) => (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <div className={`flex items-center space-x-1 mt-2 ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
              <TrendingUp className={`w-4 h-4 ${!trendUp && 'rotate-180'}`} />
              <span className="text-sm">{trend}</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const QuickActionButton: React.FC<{
    title: string;
    icon: React.ReactNode;
    onClick?: () => void;
    to?: string;
    color: string;
  }> = ({ title, icon, onClick, to, color }) => {
    const buttonContent = (
      <div className={`${color} backdrop-blur-xl rounded-xl border border-white/10 p-4 hover:scale-105 transition-all duration-200 cursor-pointer group`}>
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 text-white group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <span className="text-white text-sm font-medium text-center">{title}</span>
        </div>
      </div>
    );

    if (to) {
      return <Link to={to}>{buttonContent}</Link>;
    }

    return <div onClick={onClick}>{buttonContent}</div>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your devices today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-medium">System Online</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Devices"
          value={stats.totalDevices}
          icon={<Smartphone className="w-6 h-6 text-white" />}
          trend="+12% from last month"
          trendUp={true}
          color="bg-gradient-to-r from-blue-500/20 to-cyan-500/20"
        />
        <StatCard
          title="Available"
          value={stats.availableDevices}
          icon={<CheckCircle className="w-6 h-6 text-white" />}
          trend={`${Math.round((stats.availableDevices / stats.totalDevices) * 100)}% available`}
          trendUp={stats.availableDevices > stats.checkedOutDevices}
          color="bg-gradient-to-r from-green-500/20 to-emerald-500/20"
        />
        <StatCard
          title="Checked Out"
          value={stats.checkedOutDevices}
          icon={<Activity className="w-6 h-6 text-white" />}
          trend={`${Math.round((stats.checkedOutDevices / stats.totalDevices) * 100)}% in use`}
          trendUp={false}
          color="bg-gradient-to-r from-purple-500/20 to-pink-500/20"
        />
        <StatCard
          title="Maintenance"
          value={stats.maintenanceDevices}
          icon={<AlertTriangle className="w-6 h-6 text-white" />}
          trend={stats.maintenanceDevices === 0 ? "All good!" : "Needs attention"}
          trendUp={stats.maintenanceDevices === 0}
          color="bg-gradient-to-r from-orange-500/20 to-red-500/20"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          <span>Quick Actions</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            title="Add Device"
            icon={<Plus className="w-full h-full" />}
            to="/devices"
            color="bg-gradient-to-r from-cyan-500/20 to-blue-500/20"
          />
          <QuickActionButton
            title="Export CSV"
            icon={<Download className="w-full h-full" />}
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," + 
                "Name,Type,Serial,Status,Assigned To\n" +
                devices.map(d => `${d.name},${d.type},${d.serialNumber},${d.status},${d.assignedUser || ''}`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "devices.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            color="bg-gradient-to-r from-green-500/20 to-emerald-500/20"
          />
          <QuickActionButton
            title="Check-In"
            icon={<Upload className="w-full h-full" />}
            to="/devices"
            color="bg-gradient-to-r from-purple-500/20 to-pink-500/20"
          />
          <QuickActionButton
            title="Analytics"
            icon={<TrendingUp className="w-full h-full" />}
            to="/analytics"
            color="bg-gradient-to-r from-orange-500/20 to-red-500/20"
          />
        </div>
      </div>

      {/* Recent Activity and Users Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Checkouts */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            <span>Recent Checkouts</span>
          </h2>
          <div className="space-y-3">
            {recentCheckouts.length > 0 ? (
              recentCheckouts.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{device.name}</p>
                      <p className="text-gray-400 text-sm">to {device.assignedUser}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">
                      {new Date(device.lastCheckout!).toLocaleDateString()}
                    </p>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No recent checkouts</p>
            )}
          </div>
        </div>

        {/* Team Overview */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>Team Overview</span>
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Users</span>
              <span className="text-white font-bold">{stats.totalUsers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Active Users</span>
              <span className="text-green-400 font-bold">{stats.activeUsers}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Devices per User</span>
              <span className="text-white font-bold">
                {(stats.checkedOutDevices / stats.activeUsers || 0).toFixed(1)}
              </span>
            </div>
            <div className="mt-4">
              <Link 
                to="/users" 
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 text-cyan-400 rounded-xl transition-all duration-200"
              >
                <Users className="w-4 h-4" />
                <span>Manage Users</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;