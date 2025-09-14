'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

import { 
  Apple, 
  Smartphone, 
  Watch, 
  Activity, 
  Heart, 
  Zap,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Settings
} from 'lucide-react';

interface WearableDevice {
  id: string;
  name: string;
  type: 'apple' | 'android' | 'fitbit' | 'garmin' | 'samsung';
  connected: boolean;
  lastSync: string | null;
  batteryLevel: number | null;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  dataTypes: string[];
}

interface SyncData {
  steps: number;
  calories: number;
  heartRate: number;
  sleep: {
    duration: number;
    quality: number;
  };
  workouts: Array<{
    type: string;
    duration: number;
    calories: number;
    timestamp: string;
  }>;
  waterIntake: number;
  weight: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  } | null;
}

const WEARABLE_DEVICES: WearableDevice[] = [
  {
    id: 'apple-health',
    name: 'Apple Health',
    type: 'apple',
    connected: false,
    lastSync: null,
    batteryLevel: null,
    status: 'disconnected',
    dataTypes: ['steps', 'calories', 'heartRate', 'sleep', 'workouts', 'waterIntake', 'weight', 'bloodPressure']
  },
  {
    id: 'google-fit',
    name: 'Google Fit',
    type: 'android',
    connected: false,
    lastSync: null,
    batteryLevel: null,
    status: 'disconnected',
    dataTypes: ['steps', 'calories', 'heartRate', 'sleep', 'workouts', 'waterIntake', 'weight']
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    type: 'fitbit',
    connected: false,
    lastSync: null,
    batteryLevel: 85,
    status: 'disconnected',
    dataTypes: ['steps', 'calories', 'heartRate', 'sleep', 'workouts', 'waterIntake', 'weight']
  },
  {
    id: 'garmin',
    name: 'Garmin Connect',
    type: 'garmin',
    connected: false,
    lastSync: null,
    batteryLevel: 72,
    status: 'disconnected',
    dataTypes: ['steps', 'calories', 'heartRate', 'sleep', 'workouts', 'weight']
  },
  {
    id: 'samsung-health',
    name: 'Samsung Health',
    type: 'samsung',
    connected: false,
    lastSync: null,
    batteryLevel: null,
    status: 'disconnected',
    dataTypes: ['steps', 'calories', 'heartRate', 'sleep', 'workouts', 'waterIntake', 'weight', 'bloodPressure']
  }
];

export default function WearableSync() {
  const [devices, setDevices] = useState<WearableDevice[]>(WEARABLE_DEVICES);
  const [syncData, setSyncData] = useState<SyncData | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'apple': return Apple;
      case 'android': return Smartphone;
      case 'fitbit': return Watch;
      case 'garmin': return Watch;
      case 'samsung': return Smartphone;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-gray-100 text-gray-800';
      case 'syncing': return 'bg-blue-100 text-blue-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'disconnected': return AlertCircle;
      case 'syncing': return RefreshCw;
      case 'error': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const connectDevice = async (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    setIsSyncing(true);
    setSelectedDevice(deviceId);

    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000));

    setDevices(prev => prev.map(d => 
      d.id === deviceId 
        ? { 
            ...d, 
            connected: true, 
            status: 'connected',
            lastSync: new Date().toISOString()
          }
        : d
    ));

    setIsSyncing(false);
    setSelectedDevice(null);
  };

  const syncDevice = async (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device || !device.connected) return;

    setIsSyncing(true);
    setSelectedDevice(deviceId);

    // Update device status to syncing
    setDevices(prev => prev.map(d => 
      d.id === deviceId 
        ? { ...d, status: 'syncing' }
        : d
    ));

    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock sync data
    const mockData: SyncData = {
      steps: Math.floor(Math.random() * 5000) + 5000,
      calories: Math.floor(Math.random() * 500) + 2000,
      heartRate: Math.floor(Math.random() * 20) + 70,
      sleep: {
        duration: Math.floor(Math.random() * 2) + 7,
        quality: Math.floor(Math.random() * 30) + 70
      },
      workouts: [
        {
          type: 'Running',
          duration: 30,
          calories: 300,
          timestamp: new Date().toISOString()
        }
      ],
      waterIntake: Math.floor(Math.random() * 4) + 6,
      weight: 70 + Math.random() * 10,
      bloodPressure: Math.random() > 0.5 ? {
        systolic: 120 + Math.floor(Math.random() * 20),
        diastolic: 80 + Math.floor(Math.random() * 10)
      } : null
    };

    setSyncData(mockData);

    // Update device status
    setDevices(prev => prev.map(d => 
      d.id === deviceId 
        ? { 
            ...d, 
            status: 'connected',
            lastSync: new Date().toISOString()
          }
        : d
    ));

    setIsSyncing(false);
    setSelectedDevice(null);
  };

  const disconnectDevice = (deviceId: string) => {
    setDevices(prev => prev.map(d => 
      d.id === deviceId 
        ? { 
            ...d, 
            connected: false, 
            status: 'disconnected',
            lastSync: null
          }
        : d
    ));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Wearable Integration
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Connect your fitness devices and sync your health data automatically
        </p>
      </div>

      {/* Connected Devices Overview */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Connected Devices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => {
            const IconComponent = getDeviceIcon(device.type);
            const StatusIcon = getStatusIcon(device.status);
            
            return (
              <div key={device.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-8 h-8 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">{device.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">{device.type}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(device.status)}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {device.status}
                  </Badge>
                </div>

                {device.batteryLevel && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Battery</span>
                      <span>{device.batteryLevel}%</span>
                    </div>
                    <Progress value={device.batteryLevel} className="h-2" />
                  </div>
                )}

                {device.lastSync && (
                  <p className="text-sm text-gray-600 mb-3">
                    Last sync: {new Date(device.lastSync).toLocaleString()}
                  </p>
                )}

                <div className="flex space-x-2">
                  {!device.connected ? (
                    <Button
                      size="sm"
                      onClick={() => connectDevice(device.id)}
                      disabled={isSyncing && selectedDevice === device.id}
                      className="flex-1"
                    >
                      {isSyncing && selectedDevice === device.id ? (
                        <LoadingSpinner />
                      ) : (
                        'Connect'
                      )}
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => syncDevice(device.id)}
                        disabled={isSyncing && selectedDevice === device.id}
                        className="flex-1"
                      >
                        {isSyncing && selectedDevice === device.id ? (
                          <LoadingSpinner />
                        ) : (
                          'Sync'
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => disconnectDevice(device.id)}
                        className="px-3"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Sync Data Display */}
      {syncData && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Latest Sync Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {syncData.steps.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Steps</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {syncData.calories}
              </div>
              <div className="text-sm text-gray-600">Calories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {syncData.heartRate}
              </div>
              <div className="text-sm text-gray-600">Heart Rate (BPM)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {syncData.sleep.duration}h
              </div>
              <div className="text-sm text-gray-600">Sleep Duration</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Sleep Quality</h3>
              <div className="flex items-center space-x-2">
                <Progress value={syncData.sleep.quality} className="flex-1" />
                <span className="text-sm text-gray-600">{syncData.sleep.quality}%</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Water Intake</h3>
              <div className="flex items-center space-x-2">
                <Progress value={(syncData.waterIntake / 8) * 100} className="flex-1" />
                <span className="text-sm text-gray-600">{syncData.waterIntake}/8 glasses</span>
              </div>
            </div>
          </div>

          {syncData.bloodPressure && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Blood Pressure</h3>
              <div className="text-lg">
                <span className="text-red-600 font-bold">{syncData.bloodPressure.systolic}</span>
                <span className="text-gray-600">/</span>
                <span className="text-red-600 font-bold">{syncData.bloodPressure.diastolic}</span>
                <span className="text-gray-600 ml-2">mmHg</span>
              </div>
            </div>
          )}

          {syncData.workouts.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Recent Workouts</h3>
              <div className="space-y-2">
                {syncData.workouts.map((workout, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <span className="font-medium">{workout.type}</span>
                      <span className="text-sm text-gray-600 ml-2">{workout.duration} min</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {workout.calories} cal
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Integration Benefits */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Why Connect Your Devices?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Automatic Tracking</h3>
            <p className="text-sm text-gray-600">
              Your health data syncs automatically, so you never miss a beat.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Comprehensive Health</h3>
            <p className="text-sm text-gray-600">
              Get a complete picture of your health with data from all your devices.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">AI Insights</h3>
            <p className="text-sm text-gray-600">
              Our AI analyzes your data to provide personalized health recommendations.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
