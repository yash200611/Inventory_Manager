import React, { useMemo } from 'react';
import { useDevices } from '../contexts/DeviceContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Smartphone,
  Clock,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon
} from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const { devices, users } = useDevices();

  const analytics = useMemo(() => {
    // Device status distribution
    const statusData = [
      { name: 'Available', value: devices.filter(d => d.status === 'Available').length, color: '#10B981' },
      { name: 'Checked Out', value: devices.filter(d => d.status === 'Checked Out').length, color: '#8B5CF6' },
      { name: 'Under Maintenance', value: devices.filter(d => d.status === 'Under Maintenance').length, color: '#F59E0B' },
      { name: 'Retired', value: devices.filter(d => d.status === 'Retired').length, color: '#6B7280' },
    ];

    // Device types
    const typeData = devices.reduce((acc, device) => {
      const existing = acc.find(item => item.name === device.type);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ name: device.type, count: 1 });
      }
      return acc;
    }, [] as Array<{ name: string; count: number }>);

    // Department usage
    const departmentData = users.reduce((acc, user) => {
      const userDevices = devices.filter(d => d.assignedTo === user.id);
      const existing = acc.find(item => item.department === user.department);
      if (existing) {
        existing.devices += userDevices.length;
        existing.users += 1;
      } else {
        acc.push({
          department: user.department,
          devices: userDevices.length,
          users: 1
        });
      }
      return acc;
    }, [] as Array<{ department: string; devices: number; users: number }>);

    // Usage over time (mock data for demonstration)
    const usageOverTime = [
      { date: '2024-01-15', checkouts: 5, checkins: 3 },
      { date: '2024-01-16', checkouts: 8, checkins: 6 },
      { date: '2024-01-17', checkouts: 12, checkins: 10 },
      { date: '2024-01-18', checkouts: 15, checkins: 13 },
      { date: '2024-01-19', checkouts: 10, checkins: 12 },
      { date: '2024-01-20', checkouts: 7, checkins: 9 },
      { date: '2024-01-21', checkouts: 6, checkins: 8 },
    ];

    // Most used devices
    const mostUsedDevices = devices
      .filter(d => d.lastCheckout)
      .sort((a, b) => new Date(b.lastCheckout!).getTime() - new Date(a.lastCheckout!).getTime())
      .slice(0, 5);

    return {
      statusData,
      typeData,
      departmentData,
      usageOverTime,
      mostUsedDevices
    };
  }, [devices, users]);

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: string;
    color: string;
  }> = ({ title, value, icon, trend, color }) => (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <p className="text-cyan-400 text-sm mt-2">{trend}</p>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const ChartCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
  }> = ({ title, icon, children }) => (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <div className="flex items-center space-x-2 mb-6">
        {icon}
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Insights into your device usage and trends</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
          <span className="text-cyan-400 text-sm font-medium">Live Data</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Devices"
          value={devices.length}
          icon={<Smartphone className="w-6 h-6 text-white" />}
          trend="All platforms"
          color="bg-gradient-to-r from-blue-500/20 to-cyan-500/20"
        />
        <StatCard
          title="Active Checkouts"
          value={devices.filter(d => d.status === 'Checked Out').length}
          icon={<Activity className="w-6 h-6 text-white" />}
          trend={`${Math.round((devices.filter(d => d.status === 'Checked Out').length / devices.length) * 100)}% utilization`}
          color="bg-gradient-to-r from-purple-500/20 to-pink-500/20"
        />
        <StatCard
          title="Avg. Usage Time"
          value="5.2 days"
          icon={<Clock className="w-6 h-6 text-white" />}
          trend="Per checkout"
          color="bg-gradient-to-r from-green-500/20 to-emerald-500/20"
        />
        <StatCard
          title="Efficiency Score"
          value="87%"
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          trend="+5% this month"
          color="bg-gradient-to-r from-orange-500/20 to-red-500/20"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Status Distribution */}
        <ChartCard
          title="Device Status Distribution"
          icon={<PieChartIcon className="w-5 h-5 text-cyan-400" />}
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Device Types */}
        <ChartCard
          title="Devices by Type"
          icon={<BarChart3 className="w-5 h-5 text-cyan-400" />}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.typeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis
                dataKey="name"
                stroke="#9CA3AF"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Full Width Charts */}
      <div className="space-y-6">
        {/* Usage Over Time */}
        <ChartCard
          title="Device Activity Over Time"
          icon={<LineChartIcon className="w-5 h-5 text-cyan-400" />}
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.usageOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: 'white'
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="checkouts"
                stroke="#06B6D4"
                strokeWidth={3}
                dot={{ fill: '#06B6D4', strokeWidth: 2, r: 6 }}
                name="Check-outs"
              />
              <Line
                type="monotone"
                dataKey="checkins"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                name="Check-ins"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Department Usage */}
        <ChartCard
          title="Usage by Department"
          icon={<BarChart3 className="w-5 h-5 text-cyan-400" />}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis dataKey="department" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
              <Legend />
              <Bar dataKey="devices" fill="#8B5CF6" name="Devices Assigned" radius={[4, 4, 0, 0]} />
              <Bar dataKey="users" fill="#06B6D4" name="Team Members" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Most Used Devices */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <span>Most Recently Used Devices</span>
        </h2>
        <div className="space-y-3">
          {analytics.mostUsedDevices.map((device, index) => (
            <div key={device.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-cyan-400 font-bold text-sm">
                  #{index + 1}
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{device.name}</p>
                    <p className="text-gray-400 text-sm">{device.type} • {device.serialNumber}</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">
                  {device.assignedUser || 'Available'}
                </p>
                <p className="text-gray-400 text-sm">
                  Last used: {device.lastCheckout ? new Date(device.lastCheckout).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;