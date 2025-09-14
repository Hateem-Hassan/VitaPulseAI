'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

import { 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Download,
  Upload,
  Database,
  Globe,
  Shield,
  Zap,
  Calendar,
  TrendingUp,
  Activity,
  BookOpen,
  FileText,
  ExternalLink,
  Settings,
  Bell,
  Info,
  Heart
} from 'lucide-react';

interface GuidelineUpdate {
  id: string;
  title: string;
  organization: string;
  version: string;
  lastUpdated: string;
  newVersion: string;
  updateAvailable: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  changes: string[];
  impact: string;
  downloadSize: string;
  estimatedTime: string;
  status: 'pending' | 'downloading' | 'installing' | 'completed' | 'failed';
  progress: number;
}

interface UpdateStatus {
  lastCheck: string;
  nextCheck: string;
  totalGuidelines: number;
  updatedGuidelines: number;
  pendingUpdates: number;
  failedUpdates: number;
  autoUpdate: boolean;
  checkInterval: number; // in hours
}

const MOCK_UPDATES: GuidelineUpdate[] = [
  {
    id: '1',
    title: '2024 Hypertension Management Guidelines',
    organization: 'AHA',
    version: '2.0',
    lastUpdated: '2024-01-15',
    newVersion: '2.1',
    updateAvailable: true,
    priority: 'high',
    changes: [
      'Updated blood pressure targets for elderly patients',
      'New recommendations for combination therapy',
      'Revised monitoring frequency guidelines',
      'Added new contraindications section'
    ],
    impact: 'High - Affects cardiovascular risk calculations and treatment recommendations',
    downloadSize: '2.3 MB',
    estimatedTime: '3 minutes',
    status: 'pending',
    progress: 0
  },
  {
    id: '2',
    title: 'Diabetes Care Standards 2024',
    organization: 'ADA',
    version: '2.9',
    lastUpdated: '2024-01-10',
    newVersion: '3.0',
    updateAvailable: true,
    priority: 'critical',
    changes: [
      'New HbA1c targets for different age groups',
      'Updated medication recommendations',
      'Revised screening guidelines',
      'New complications management protocols'
    ],
    impact: 'Critical - Major changes to diabetes management protocols',
    downloadSize: '4.1 MB',
    estimatedTime: '5 minutes',
    status: 'pending',
    progress: 0
  },
  {
    id: '3',
    title: 'COVID-19 Treatment Guidelines',
    organization: 'NIH',
    version: '4.1',
    lastUpdated: '2024-01-20',
    newVersion: '4.2',
    updateAvailable: true,
    priority: 'medium',
    changes: [
      'Updated antiviral treatment protocols',
      'New vaccination recommendations',
      'Revised isolation guidelines',
      'Updated risk stratification criteria'
    ],
    impact: 'Medium - Updates treatment protocols and risk assessment',
    downloadSize: '1.8 MB',
    estimatedTime: '2 minutes',
    status: 'pending',
    progress: 0
  }
];

export default function GuidelinesUpdater() {

  const [updates, setUpdates] = useState<GuidelineUpdate[]>(MOCK_UPDATES);
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({
    lastCheck: '2024-01-20T10:30:00Z',
    nextCheck: '2024-01-21T10:30:00Z',
    totalGuidelines: 156,
    updatedGuidelines: 142,
    pendingUpdates: 3,
    failedUpdates: 0,
    autoUpdate: true,
    checkInterval: 24
  });
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedUpdates, setSelectedUpdates] = useState<string[]>([]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'downloading': return 'bg-blue-100 text-blue-800';
      case 'installing': return 'bg-purple-100 text-purple-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'downloading': return Download;
      case 'installing': return Upload;
      case 'failed': return AlertTriangle;
      case 'pending': return Clock;
      default: return Clock;
    }
  };

  const checkForUpdates = async () => {
    setIsChecking(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setUpdateStatus(prev => ({
      ...prev,
      lastCheck: new Date().toISOString(),
      nextCheck: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }));
    
    setIsChecking(false);
  };

  const updateGuideline = async (updateId: string) => {
    setUpdates(prev => prev.map(update => 
      update.id === updateId 
        ? { ...update, status: 'downloading', progress: 0 }
        : update
    ));

    // Simulate download progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUpdates(prev => prev.map(update => 
        update.id === updateId 
          ? { 
              ...update, 
              status: i < 100 ? 'downloading' : 'installing',
              progress: i 
            }
          : update
      ));
    }

    // Simulate installation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUpdates(prev => prev.map(update => 
      update.id === updateId 
        ? { 
            ...update, 
            status: 'completed',
            progress: 100,
            updateAvailable: false,
            version: update.newVersion,
            lastUpdated: new Date().toISOString()
          }
        : update
    ));

    setUpdateStatus(prev => ({
      ...prev,
      updatedGuidelines: prev.updatedGuidelines + 1,
      pendingUpdates: prev.pendingUpdates - 1
    }));
  };

  const updateAllSelected = async () => {
    if (selectedUpdates.length === 0) return;
    
    setIsUpdating(true);
    
    for (const updateId of selectedUpdates) {
      await updateGuideline(updateId);
    }
    
    setSelectedUpdates([]);
    setIsUpdating(false);
  };

  const toggleUpdateSelection = (updateId: string) => {
    setSelectedUpdates(prev => 
      prev.includes(updateId) 
        ? prev.filter(id => id !== updateId)
        : [...prev, updateId]
    );
  };

  const selectAllUpdates = () => {
    const availableUpdates = updates.filter(update => update.updateAvailable && update.status === 'pending');
    setSelectedUpdates(availableUpdates.map(update => update.id));
  };

  const clearSelection = () => {
    setSelectedUpdates([]);
  };

  const toggleAutoUpdate = () => {
    setUpdateStatus(prev => ({
      ...prev,
      autoUpdate: !prev.autoUpdate
    }));
  };

  const getTimeUntilNextCheck = () => {
    const nextCheck = new Date(updateStatus.nextCheck);
    const now = new Date();
    const diff = nextCheck.getTime() - now.getTime();
    
    if (diff <= 0) return 'Now';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Medical Guidelines Updater
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Keep your clinical reference library up-to-date with the latest medical guidelines
        </p>
      </div>

      {/* Update Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <Database className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{updateStatus.totalGuidelines}</div>
          <div className="text-sm text-gray-600">Total Guidelines</div>
        </Card>
        <Card className="p-6 text-center">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{updateStatus.updatedGuidelines}</div>
          <div className="text-sm text-gray-600">Updated</div>
        </Card>
        <Card className="p-6 text-center">
          <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{updateStatus.pendingUpdates}</div>
          <div className="text-sm text-gray-600">Pending Updates</div>
        </Card>
        <Card className="p-6 text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{updateStatus.failedUpdates}</div>
          <div className="text-sm text-gray-600">Failed</div>
        </Card>
      </div>

      {/* Auto-Update Settings */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Auto-Update Settings</h2>
            <p className="text-gray-600">
              Last checked: {new Date(updateStatus.lastCheck).toLocaleString()}
            </p>
            <p className="text-gray-600">
              Next check: {getTimeUntilNextCheck()}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={updateStatus.autoUpdate}
                onChange={toggleAutoUpdate}
                className="rounded"
              />
              <label className="text-sm">Auto-update enabled</label>
            </div>
            <Button
              onClick={checkForUpdates}
              disabled={isChecking}
              variant="outline"
            >
              {isChecking ? <LoadingSpinner /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Check for Updates
            </Button>
          </div>
        </div>
      </Card>

      {/* Available Updates */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Available Updates</h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAllUpdates}
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearSelection}
            >
              Clear Selection
            </Button>
            <Button
              onClick={updateAllSelected}
              disabled={selectedUpdates.length === 0 || isUpdating}
            >
              {isUpdating ? <LoadingSpinner /> : <Download className="w-4 h-4 mr-2" />}
              Update Selected ({selectedUpdates.length})
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {updates.map((update) => {
            const StatusIcon = getStatusIcon(update.status);
            return (
              <div key={update.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{update.title}</h3>
                      <Badge className={getPriorityColor(update.priority)}>
                        {update.priority}
                      </Badge>
                      <Badge className={getStatusColor(update.status)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {update.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span>{update.organization}</span>
                      <span>•</span>
                      <span>v{update.version} → v{update.newVersion}</span>
                      <span>•</span>
                      <span>{update.downloadSize}</span>
                      <span>•</span>
                      <span>{update.estimatedTime}</span>
                    </div>

                    <p className="text-gray-700 mb-3">{update.impact}</p>

                    <div className="mb-3">
                      <h4 className="font-medium mb-2">Changes in this update:</h4>
                      <ul className="space-y-1">
                        {update.changes.map((change, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <span className="text-green-500 mt-1">•</span>
                            <span>{change}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {update.status === 'downloading' || update.status === 'installing' ? (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{update.progress}%</span>
                        </div>
                        <Progress value={update.progress} className="h-2" />
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <input
                      type="checkbox"
                      checked={selectedUpdates.includes(update.id)}
                      onChange={() => toggleUpdateSelection(update.id)}
                      disabled={!update.updateAvailable || update.status !== 'pending'}
                      className="rounded"
                    />
                    {update.updateAvailable && update.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => updateGuideline(update.id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Update
                      </Button>
                    )}
                    {update.status === 'completed' && (
                      <div className="flex items-center space-x-1 text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Updated</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Update Sources */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Update Sources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Globe className="w-6 h-6 text-blue-500" />
            <div>
              <div className="font-medium">WHO Guidelines</div>
              <div className="text-sm text-gray-600">World Health Organization</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Shield className="w-6 h-6 text-green-500" />
            <div>
              <div className="font-medium">CDC Recommendations</div>
              <div className="text-sm text-gray-600">Centers for Disease Control</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Activity className="w-6 h-6 text-purple-500" />
            <div>
              <div className="font-medium">NIH Guidelines</div>
              <div className="text-sm text-gray-600">National Institutes of Health</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Heart className="w-6 h-6 text-red-500" />
            <div>
              <div className="font-medium">AHA Standards</div>
              <div className="text-sm text-gray-600">American Heart Association</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <BookOpen className="w-6 h-6 text-orange-500" />
            <div>
              <div className="font-medium">Medical Journals</div>
              <div className="text-sm text-gray-600">Peer-reviewed publications</div>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <FileText className="w-6 h-6 text-indigo-500" />
            <div>
              <div className="font-medium">Clinical Trials</div>
              <div className="text-sm text-gray-600">Evidence-based research</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
