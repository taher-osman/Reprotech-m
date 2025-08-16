import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  CloudOff, 
  Download, 
  Upload, 
  HardDrive, 
  Wifi, 
  WifiOff,
  CheckCircle,
  AlertCircle,
  Clock,
  Database,
  RefreshCw
} from 'lucide-react';
import { FlushingSession } from '../pages/FlushingPage';

interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  pendingUploads: number;
  pendingDownloads: number;
  syncInProgress: boolean;
  conflictsDetected: number;
  localStorageUsed: number;
  autoSyncEnabled: boolean;
}

interface OfflineSyncProps {
  sessions: FlushingSession[];
  onSyncComplete: (sessions: FlushingSession[]) => void;
  onConflictDetected: (conflicts: any[]) => void;
}

export const OfflineSync: React.FC<OfflineSyncProps> = ({
  sessions,
  onSyncComplete,
  onConflictDetected
}) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    lastSync: null,
    pendingUploads: 0,
    pendingDownloads: 0,
    syncInProgress: false,
    conflictsDetected: 0,
    localStorageUsed: 0,
    autoSyncEnabled: true
  });

  const [syncHistory, setSyncHistory] = useState<{
    timestamp: Date;
    type: 'upload' | 'download' | 'conflict';
    status: 'success' | 'error';
    message: string;
  }[]>([]);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }));
      if (syncStatus.autoSyncEnabled) {
        performSync();
      }
    };

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Calculate local storage usage
    calculateStorageUsage();

    // Auto-sync every 5 minutes if online
    const autoSyncInterval = setInterval(() => {
      if (syncStatus.isOnline && syncStatus.autoSyncEnabled && !syncStatus.syncInProgress) {
        performSync();
      }
    }, 5 * 60 * 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(autoSyncInterval);
    };
  }, [syncStatus.isOnline, syncStatus.autoSyncEnabled, syncStatus.syncInProgress]);

  const calculateStorageUsage = () => {
    try {
      const data = localStorage.getItem('flushing-sessions-offline');
      const sizeInBytes = new Blob([data || '']).size;
      const sizeInMB = sizeInBytes / (1024 * 1024);
      setSyncStatus(prev => ({ ...prev, localStorageUsed: sizeInMB }));
    } catch (error) {
      console.error('Error calculating storage usage:', error);
    }
  };

  const saveToLocalStorage = (sessions: FlushingSession[]) => {
    try {
      const offlineData = {
        sessions,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem('flushing-sessions-offline', JSON.stringify(offlineData));
      calculateStorageUsage();
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  };

  const loadFromLocalStorage = (): FlushingSession[] => {
    try {
      const data = localStorage.getItem('flushing-sessions-offline');
      if (data) {
        const offlineData = JSON.parse(data);
        return offlineData.sessions || [];
      }
    } catch (error) {
      console.error('Error loading from local storage:', error);
    }
    return [];
  };

  const performSync = async () => {
    setSyncStatus(prev => ({ ...prev, syncInProgress: true }));

    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Upload pending changes
      const localSessions = loadFromLocalStorage();
      const pendingUploads = localSessions.filter(session => 
        !sessions.find(s => s.id === session.id)
      );

      // Download remote changes
      const mockRemoteChanges: FlushingSession[] = [];

      // Detect conflicts
      const conflicts: any[] = [];

      setSyncStatus(prev => ({
        ...prev,
        syncInProgress: false,
        lastSync: new Date(),
        pendingUploads: 0,
        pendingDownloads: 0,
        conflictsDetected: conflicts.length
      }));

      // Add to sync history
      setSyncHistory(prev => [...prev, {
        timestamp: new Date(),
        type: 'upload',
        status: 'success',
        message: `Synced ${pendingUploads.length} sessions`
      }].slice(-10));

      onSyncComplete([...sessions, ...mockRemoteChanges]);

      if (conflicts.length > 0) {
        onConflictDetected(conflicts);
      }

    } catch (error) {
      setSyncStatus(prev => ({ ...prev, syncInProgress: false }));
      setSyncHistory(prev => [...prev, {
        timestamp: new Date(),
        type: 'upload',
        status: 'error',
        message: 'Sync failed: Network error'
      }].slice(-10));
    }
  };

  const forceSync = () => {
    if (!syncStatus.syncInProgress) {
      performSync();
    }
  };

  const clearLocalData = () => {
    if (window.confirm('Are you sure you want to clear all local data? This action cannot be undone.')) {
      localStorage.removeItem('flushing-sessions-offline');
      calculateStorageUsage();
      setSyncHistory(prev => [...prev, {
        timestamp: new Date(),
        type: 'download',
        status: 'success',
        message: 'Local data cleared'
      }].slice(-10));
    }
  };

  const toggleAutoSync = () => {
    setSyncStatus(prev => ({ 
      ...prev, 
      autoSyncEnabled: !prev.autoSyncEnabled 
    }));
  };

  const exportOfflineData = () => {
    const localSessions = loadFromLocalStorage();
    const dataStr = JSON.stringify(localSessions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flushing-offline-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {syncStatus.isOnline ? (
              <Wifi className="h-6 w-6 text-green-500" />
            ) : (
              <WifiOff className="h-6 w-6 text-red-500" />
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Sync Status</h2>
              <p className="text-sm text-gray-600">
                {syncStatus.isOnline ? 'Connected' : 'Offline Mode'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={forceSync}
              disabled={!syncStatus.isOnline || syncStatus.syncInProgress}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${syncStatus.syncInProgress ? 'animate-spin' : ''}`} />
              <span>{syncStatus.syncInProgress ? 'Syncing...' : 'Sync Now'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Upload className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Pending Uploads</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{syncStatus.pendingUploads}</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Download className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">Pending Downloads</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{syncStatus.pendingDownloads}</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">Conflicts</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{syncStatus.conflictsDetected}</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <HardDrive className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-700">Local Storage</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {syncStatus.localStorageUsed.toFixed(1)}MB
            </div>
          </div>
        </div>

        {syncStatus.lastSync && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Last sync: {syncStatus.lastSync.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Sync Settings */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sync Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Auto Sync</div>
              <div className="text-sm text-gray-600">
                Automatically sync when connection is available
              </div>
            </div>
            <button
              onClick={toggleAutoSync}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                syncStatus.autoSyncEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  syncStatus.autoSyncEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={exportOfflineData}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              <span>Export Offline Data</span>
            </button>

            <button
              onClick={clearLocalData}
              className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
            >
              <Database className="h-4 w-4" />
              <span>Clear Local Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sync History */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        
        {syncHistory.length > 0 ? (
          <div className="space-y-3">
            {syncHistory.slice().reverse().map((entry, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {entry.status === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">{entry.message}</div>
                  <div className="text-xs text-gray-500">
                    {entry.timestamp.toLocaleString()} • {entry.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <RefreshCw className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No sync activity yet</p>
          </div>
        )}
      </div>

      {/* Offline Banner */}
      {!syncStatus.isOnline && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CloudOff className="h-5 w-5 text-orange-600" />
            <div>
              <div className="font-medium text-orange-900">Working Offline</div>
              <div className="text-sm text-orange-700">
                Changes are being saved locally and will sync when connection is restored.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sync In Progress */}
      {syncStatus.syncInProgress && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />
            <div>
              <div className="font-medium text-blue-900">Synchronizing Data</div>
              <div className="text-sm text-blue-700">
                Please wait while we sync your changes with the server.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 