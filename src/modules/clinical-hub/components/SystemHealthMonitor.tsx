import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  Activity,
  Database,
  Server,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Monitor,
  Smartphone,
  Globe
} from 'lucide-react';
import realTimeService from '../../../services/realTimeService';
import { mainCache, reportCache, imageCache } from '../../../services/cacheService';

interface SystemMetrics {
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  apiLatency: number;
  cacheHitRate: number;
  memoryUsage: number;
  activeConnections: number;
  pendingOperations: number;
  lastUpdate: string;
  uptime: number;
}

interface AlertItem {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  message: string;
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  resolved: boolean;
  category: 'SYSTEM' | 'NETWORK' | 'DATA' | 'PERFORMANCE';
}

interface DeviceStatus {
  id: string;
  name: string;
  type: 'TABLET' | 'SCANNER' | 'ULTRASOUND' | 'WORKSTATION';
  status: 'ONLINE' | 'OFFLINE' | 'ERROR' | 'LOW_BATTERY';
  batteryLevel?: number;
  lastSync: string;
  location: string;
  activeTasks: number;
}

const SystemHealthMonitor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    connectionStatus: 'connecting',
    apiLatency: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
    activeConnections: 0,
    pendingOperations: 0,
    lastUpdate: new Date().toISOString(),
    uptime: 0
  });
  
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [devices, setDevices] = useState<DeviceStatus[]>([]);
  const [performanceHistory, setPerformanceHistory] = useState<Array<{
    timestamp: string;
    apiLatency: number;
    cacheHitRate: number;
    memoryUsage: number;
  }>>([]);

  const [isMonitoring, setIsMonitoring] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    startMonitoring();
    
    // Subscribe to real-time system updates
    const systemSubscription = realTimeService.subscribe('system_status', (data) => {
      updateSystemMetrics(data);
    });

    const alertSubscription = realTimeService.subscribe('alerts', (data) => {
      addAlert(data);
    });

    return () => {
      realTimeService.unsubscribe(systemSubscription);
      realTimeService.unsubscribe(alertSubscription);
    };
  }, []);

  useEffect(() => {
    if (autoRefresh && isMonitoring) {
      const interval = setInterval(updateMetrics, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, isMonitoring]);

  const startMonitoring = (): void => {
    setIsMonitoring(true);
    updateMetrics();
    loadDeviceStatuses();
    
    // Request notification permissions
    realTimeService.requestNotificationPermission();
  };

  const updateMetrics = async (): Promise<void> => {
    try {
      // Get real-time metrics
      const connectionStatus = realTimeService.getConnectionStatus();
      const cacheStats = mainCache.getStats();
      const memoryUsage = mainCache.getMemoryUsage();
      
      // Simulate API latency measurement
      const startTime = Date.now();
      // In real implementation, this would be an actual API ping
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 10));
      const apiLatency = Date.now() - startTime;

      const newMetrics: SystemMetrics = {
        connectionStatus,
        apiLatency,
        cacheHitRate: cacheStats.hitRate,
        memoryUsage: memoryUsage.percentage,
        activeConnections: getActiveConnectionsCount(),
        pendingOperations: getPendingOperationsCount(),
        lastUpdate: new Date().toISOString(),
        uptime: getUptimeMinutes()
      };

      setMetrics(newMetrics);
      
      // Add to performance history (keep last 20 entries)
      setPerformanceHistory(prev => {
        const newEntry = {
          timestamp: newMetrics.lastUpdate,
          apiLatency: newMetrics.apiLatency,
          cacheHitRate: newMetrics.cacheHitRate,
          memoryUsage: newMetrics.memoryUsage
        };
        
        const updated = [...prev, newEntry];
        return updated.slice(-20); // Keep only last 20 entries
      });

      // Check for performance issues and create alerts
      checkPerformanceThresholds(newMetrics);
      
    } catch (error) {
      console.error('Error updating system metrics:', error);
      addAlert({
        type: 'error',
        message: 'Failed to update system metrics',
        severity: 'MEDIUM',
        category: 'SYSTEM'
      });
    }
  };

  const updateSystemMetrics = (data: any): void => {
    if (data.metrics) {
      setMetrics(prev => ({
        ...prev,
        ...data.metrics,
        lastUpdate: new Date().toISOString()
      }));
    }
  };

  const addAlert = (alertData: Partial<AlertItem>): void => {
    const alert: AlertItem = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: alertData.type || 'info',
      message: alertData.message || 'System notification',
      timestamp: new Date().toISOString(),
      severity: alertData.severity || 'LOW',
      resolved: false,
      category: alertData.category || 'SYSTEM'
    };

    setAlerts(prev => [alert, ...prev.slice(0, 19)]); // Keep only 20 most recent alerts
  };

  const resolveAlert = (alertId: string): void => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const clearResolvedAlerts = (): void => {
    setAlerts(prev => prev.filter(alert => !alert.resolved));
  };

  const loadDeviceStatuses = (): void => {
    // In real implementation, this would fetch from API
    const mockDevices: DeviceStatus[] = [
      {
        id: 'tablet_001',
        name: 'Field Tablet 1',
        type: 'TABLET',
        status: 'ONLINE',
        batteryLevel: 85,
        lastSync: new Date().toISOString(),
        location: 'Yard A',
        activeTasks: 3
      },
      {
        id: 'scanner_001',
        name: 'QR Scanner 1',
        type: 'SCANNER',
        status: 'LOW_BATTERY',
        batteryLevel: 15,
        lastSync: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        location: 'Barn B',
        activeTasks: 1
      },
      {
        id: 'ultrasound_001',
        name: 'Ultrasound Unit 1',
        type: 'ULTRASOUND',
        status: 'OFFLINE',
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        location: 'Treatment Room',
        activeTasks: 0
      }
    ];

    setDevices(mockDevices);
  };

  const checkPerformanceThresholds = (metrics: SystemMetrics): void => {
    // API Latency alerts
    if (metrics.apiLatency > 1000) {
      addAlert({
        type: 'warning',
        message: `High API latency detected: ${metrics.apiLatency}ms`,
        severity: 'MEDIUM',
        category: 'PERFORMANCE'
      });
    }

    // Memory usage alerts
    if (metrics.memoryUsage > 90) {
      addAlert({
        type: 'error',
        message: `Critical memory usage: ${metrics.memoryUsage.toFixed(1)}%`,
        severity: 'HIGH',
        category: 'PERFORMANCE'
      });
    } else if (metrics.memoryUsage > 75) {
      addAlert({
        type: 'warning',
        message: `High memory usage: ${metrics.memoryUsage.toFixed(1)}%`,
        severity: 'MEDIUM',
        category: 'PERFORMANCE'
      });
    }

    // Cache hit rate alerts
    if (metrics.cacheHitRate < 50) {
      addAlert({
        type: 'warning',
        message: `Low cache hit rate: ${metrics.cacheHitRate.toFixed(1)}%`,
        severity: 'LOW',
        category: 'PERFORMANCE'
      });
    }

    // Connection status alerts
    if (metrics.connectionStatus === 'disconnected') {
      addAlert({
        type: 'error',
        message: 'Real-time connection lost',
        severity: 'HIGH',
        category: 'NETWORK'
      });
    }
  };

  const getActiveConnectionsCount = (): number => {
    // In real implementation, this would come from the server
    return Math.floor(Math.random() * 10) + 3;
  };

  const getPendingOperationsCount = (): number => {
    // In real implementation, this would track actual pending operations
    return Math.floor(Math.random() * 5);
  };

  const getUptimeMinutes = (): number => {
    // In real implementation, this would track actual uptime
    const startTime = Date.now() - (Math.random() * 24 * 60 * 60 * 1000); // Random uptime up to 24 hours
    return Math.floor((Date.now() - startTime) / (1000 * 60));
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'connected':
      case 'ONLINE':
        return 'text-green-600';
      case 'connecting':
        return 'text-yellow-600';
      case 'disconnected':
      case 'OFFLINE':
        return 'text-red-600';
      case 'LOW_BATTERY':
        return 'text-orange-600';
      case 'ERROR':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'ONLINE':
        return <CheckCircle className="h-4 w-4" />;
      case 'connecting':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'disconnected':
      case 'OFFLINE':
        return <WifiOff className="h-4 w-4" />;
      case 'ERROR':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const formatUptime = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours < 24) return `${hours}h ${remainingMinutes}m`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'TABLET':
        return <Smartphone className="h-4 w-4" />;
      case 'SCANNER':
        return <Monitor className="h-4 w-4" />;
      case 'ULTRASOUND':
        return <Activity className="h-4 w-4" />;
      case 'WORKSTATION':
        return <Server className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  // Mini status indicator for header
  const statusIndicator = (
    <div className="flex items-center space-x-2">
      <div className={`flex items-center space-x-1 ${getStatusColor(metrics.connectionStatus)}`}>
        {getStatusIcon(metrics.connectionStatus)}
        <span className="text-xs font-medium">
          {metrics.connectionStatus === 'connected' ? 'Live' : 
           metrics.connectionStatus === 'connecting' ? 'Connecting' : 'Offline'}
        </span>
      </div>
      
      {alerts.filter(a => !a.resolved && a.severity === 'CRITICAL').length > 0 && (
        <div className="flex items-center space-x-1 text-red-600">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs font-medium">
            {alerts.filter(a => !a.resolved && a.severity === 'CRITICAL').length}
          </span>
        </div>
      )}
    </div>
  );

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        title="System Health Monitor"
      >
        {statusIndicator}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Monitor className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">System Health Monitor</h2>
              <p className="text-sm text-gray-500">Real-time system performance and status</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm ${
                autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>Auto-refresh</span>
            </button>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <span className="text-xl">×</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* System Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Connection Status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Connection</span>
                <div className={getStatusColor(metrics.connectionStatus)}>
                  {getStatusIcon(metrics.connectionStatus)}
                </div>
              </div>
              <div className="text-lg font-semibold text-gray-900 capitalize">
                {metrics.connectionStatus}
              </div>
              <div className="text-xs text-gray-500">
                {metrics.activeConnections} active connections
              </div>
            </div>

            {/* API Latency */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">API Latency</span>
                <Zap className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {metrics.apiLatency}ms
              </div>
              <div className={`text-xs flex items-center space-x-1 ${
                metrics.apiLatency > 500 ? 'text-red-600' : 'text-green-600'
              }`}>
                {metrics.apiLatency > 500 ? 
                  <TrendingUp className="h-3 w-3" /> : 
                  <TrendingDown className="h-3 w-3" />
                }
                <span>{metrics.apiLatency > 500 ? 'High' : 'Good'}</span>
              </div>
            </div>

            {/* Cache Performance */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Cache Hit Rate</span>
                <Database className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {metrics.cacheHitRate.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-500">
                {mainCache.getStats().hits}/{mainCache.getStats().totalRequests} requests
              </div>
            </div>

            {/* Memory Usage */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Memory Usage</span>
                <Server className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {metrics.memoryUsage.toFixed(1)}%
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className={`h-2 rounded-full ${
                    metrics.memoryUsage > 75 ? 'bg-red-500' : 
                    metrics.memoryUsage > 50 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(metrics.memoryUsage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Uptime</span>
              </div>
              <div className="text-lg font-semibold text-blue-900">
                {formatUptime(metrics.uptime)}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Pending Operations</span>
              </div>
              <div className="text-lg font-semibold text-green-900">
                {metrics.pendingOperations}
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Last Update</span>
              </div>
              <div className="text-sm font-medium text-purple-900">
                {new Date(metrics.lastUpdate).toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Alerts Section */}
          {alerts.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
                <button
                  onClick={clearResolvedAlerts}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear Resolved
                </button>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {alerts.slice(0, 10).map(alert => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.resolved ? 'bg-gray-50 opacity-60' : 
                      alert.type === 'error' ? 'bg-red-50 border-red-400' :
                      alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                      alert.type === 'success' ? 'bg-green-50 border-green-400' :
                      'bg-blue-50 border-blue-400'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${
                            alert.type === 'error' ? 'text-red-800' :
                            alert.type === 'warning' ? 'text-yellow-800' :
                            alert.type === 'success' ? 'text-green-800' :
                            'text-blue-800'
                          }`}>
                            {alert.message}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                            alert.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                            alert.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {alert.severity}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {alert.category} • {new Date(alert.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      
                      {!alert.resolved && (
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="ml-2 text-xs text-gray-500 hover:text-gray-700"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Device Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Connected Devices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map(device => (
                <div key={device.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getDeviceIcon(device.type)}
                      <span className="text-sm font-medium text-gray-700">{device.name}</span>
                    </div>
                    <div className={getStatusColor(device.status)}>
                      {getStatusIcon(device.status)}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">
                      Status: <span className="font-medium">{device.status}</span>
                    </div>
                    {device.batteryLevel !== undefined && (
                      <div className="text-xs text-gray-500">
                        Battery: <span className="font-medium">{device.batteryLevel}%</span>
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Location: <span className="font-medium">{device.location}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Tasks: <span className="font-medium">{device.activeTasks}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthMonitor; 