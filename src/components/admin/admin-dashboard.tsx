'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

import { 
  Users, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Settings,
  UserPlus,
  UserMinus,
  Shield,
  Database,
  Globe,
  Bell,
  Mail,
  Phone,
  Calendar,
  FileText,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'banned' | 'pending';
  joinDate: string;
  lastActive: string;
  totalLogins: number;
  healthScore: number;
  achievements: number;
  streak: number;
}

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalMeals: number;
  totalWorkouts: number;
  totalCalculations: number;
  systemHealth: number;
  apiCalls: number;
  storageUsed: number;
  uptime: number;
}

interface RecentActivity {
  id: string;
  type: 'user_signup' | 'user_login' | 'meal_logged' | 'workout_completed' | 'calculation_used' | 'achievement_earned' | 'error_occurred';
  description: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  userId?: string;
  userName?: string;
}

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    status: 'active',
    joinDate: '2024-01-15',
    lastActive: '2024-01-20T10:30:00Z',
    totalLogins: 45,
    healthScore: 85,
    achievements: 12,
    streak: 7
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'moderator',
    status: 'active',
    joinDate: '2024-01-10',
    lastActive: '2024-01-20T09:15:00Z',
    totalLogins: 78,
    healthScore: 92,
    achievements: 18,
    streak: 14
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'user',
    status: 'inactive',
    joinDate: '2024-01-05',
    lastActive: '2024-01-18T14:20:00Z',
    totalLogins: 23,
    healthScore: 67,
    achievements: 5,
    streak: 0
  }
];

const MOCK_ACTIVITIES: RecentActivity[] = [
  {
    id: '1',
    type: 'user_signup',
    description: 'New user registered: Alice Wilson',
    timestamp: '2024-01-20T11:30:00Z',
    severity: 'success',
    userId: '4',
    userName: 'Alice Wilson'
  },
  {
    id: '2',
    type: 'meal_logged',
    description: 'User logged a meal: Grilled Chicken Salad',
    timestamp: '2024-01-20T11:25:00Z',
    severity: 'info',
    userId: '1',
    userName: 'John Doe'
  },
  {
    id: '3',
    type: 'achievement_earned',
    description: 'User earned achievement: 7-Day Streak',
    timestamp: '2024-01-20T11:20:00Z',
    severity: 'success',
    userId: '2',
    userName: 'Jane Smith'
  },
  {
    id: '4',
    type: 'error_occurred',
    description: 'API rate limit exceeded for user requests',
    timestamp: '2024-01-20T11:15:00Z',
    severity: 'warning'
  }
];

export default function AdminDashboard() {

  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [activities, setActivities] = useState<RecentActivity[]>(MOCK_ACTIVITIES);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'analytics' | 'system' | 'settings'>('overview');

  const systemStats: SystemStats = {
    totalUsers: 1250,
    activeUsers: 890,
    newUsersToday: 23,
    totalMeals: 15420,
    totalWorkouts: 8760,
    totalCalculations: 45600,
    systemHealth: 98,
    apiCalls: 125000,
    storageUsed: 2.4,
    uptime: 99.9
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'banned': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-600';
      case 'info': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'success': return CheckCircle;
      case 'info': return Activity;
      case 'warning': return AlertTriangle;
      case 'error': return AlertTriangle;
      default: return Activity;
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'analytics', name: 'Analytics', icon: TrendingUp },
    { id: 'system', name: 'System', icon: Settings },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage your VitaPulse application
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <Card className="p-6">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {systemStats.totalUsers.toLocaleString()}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +{systemStats.newUsersToday} today
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {systemStats.activeUsers.toLocaleString()}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
              <div className="mt-4">
                <Progress value={(systemStats.activeUsers / systemStats.totalUsers) * 100} className="h-2" />
                <p className="text-sm text-gray-600 mt-1">
                  {Math.round((systemStats.activeUsers / systemStats.totalUsers) * 100)}% of total users
                </p>
              </div>
            </Card>

            <Card className="p6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Health</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {systemStats.systemHealth}%
                  </p>
                </div>
                <Shield className="w-8 h-8 text-green-500" />
              </div>
              <div className="mt-4">
                <Progress value={systemStats.systemHealth} className="h-2" />
                <p className="text-sm text-gray-600 mt-1">All systems operational</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">API Calls</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {systemStats.apiCalls.toLocaleString()}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">Last 24 hours</p>
              </div>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {activities.map((activity) => {
                const SeverityIcon = getSeverityIcon(activity.severity);
                return (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <SeverityIcon className={`w-5 h-5 ${getSeverityColor(activity.severity)}`} />
                    <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      {activity.userName && (
                        <p className="text-xs text-gray-600">User: {activity.userName}</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {selectedTab === 'users' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Users</h2>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Health Score</th>
                    <th className="text-left py-3 px-4">Last Active</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Progress value={user.healthScore} className="w-16 h-2" />
                          <span className="text-sm">{user.healthScore}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-600">
                          {new Date(user.lastActive).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Analytics Tab */}
      {selectedTab === 'analytics' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Usage Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {systemStats.totalMeals.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Meals Logged</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {systemStats.totalWorkouts.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Workouts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {systemStats.totalCalculations.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Health Calculations</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* System Tab */}
      {selectedTab === 'system' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">System Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Storage Usage</h3>
                <div className="flex items-center space-x-2">
                  <Progress value={(systemStats.storageUsed / 10) * 100} className="flex-1" />
                  <span className="text-sm text-gray-600">{systemStats.storageUsed}GB / 10GB</span>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Uptime</h3>
                <div className="text-2xl font-bold text-green-600">
                  {systemStats.uptime}%
                </div>
                <p className="text-sm text-gray-600">Last 30 days</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Settings Tab */}
      {selectedTab === 'settings' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">System Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Maintenance Mode</h3>
                  <p className="text-sm text-gray-600">Enable maintenance mode to restrict access</p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Configure email notification settings</p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">API Rate Limiting</h3>
                  <p className="text-sm text-gray-600">Set API rate limits for different user types</p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
