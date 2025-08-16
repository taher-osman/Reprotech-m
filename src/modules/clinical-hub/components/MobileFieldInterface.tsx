import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  QrCode, 
  Wifi, 
  WifiOff, 
  Camera, 
  MapPin, 
  Clock, 
  Battery,
  Signal,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  Zap,
  Eye,
  Edit,
  Plus
} from 'lucide-react';

interface FieldTask {
  id: string;
  type: 'INJECTION' | 'SCAN' | 'SAMPLE' | 'OBSERVATION';
  animalId: string;
  animalName: string;
  location: string;
  scheduledTime: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
  instructions: string;
  requiredEquipment: string[];
  estimatedDuration: number; // minutes
  assignedTechnician: string;
  notes?: string;
  gpsCoordinates?: { lat: number; lng: number };
  photoRequired: boolean;
  dataSync: 'SYNCED' | 'PENDING' | 'FAILED';
}

interface MobileDevice {
  id: string;
  name: string;
  type: 'TABLET' | 'PHONE' | 'SCANNER';
  batteryLevel: number;
  connectionStatus: 'ONLINE' | 'OFFLINE';
  lastSync: string;
  assignedUser: string;
  location: string;
  activeTasks: number;
  pendingUploads: number;
}

interface MobileFieldInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  fieldTasks: FieldTask[];
  mobileDevices: MobileDevice[];
  onTaskUpdate: (taskId: string, updates: Partial<FieldTask>) => void;
  onQRScan: (qrData: string) => void;
}

const MobileFieldInterface: React.FC<MobileFieldInterfaceProps> = ({
  isOpen,
  onClose,
  fieldTasks,
  mobileDevices,
  onTaskUpdate,
  onQRScan
}) => {
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [activeView, setActiveView] = useState<'overview' | 'tasks' | 'devices' | 'sync'>('overview');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [qrScannerActive, setQrScannerActive] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  // Simulated field locations
  const fieldLocations = ['Yard A', 'Yard B', 'Yard C', 'Field 1', 'Field 2', 'Barn 1', 'Barn 2', 'Quarantine'];

  const filteredTasks = fieldTasks.filter(task => {
    const locationMatch = locationFilter === 'ALL' || task.location === locationFilter;
    const statusMatch = statusFilter === 'ALL' || task.status === statusFilter;
    return locationMatch && statusMatch;
  });

  const todaysTasks = filteredTasks.filter(task => 
    new Date(task.scheduledTime).toDateString() === new Date().toDateString()
  );

  const urgentTasks = filteredTasks.filter(task => 
    task.priority === 'URGENT' && task.status === 'PENDING'
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-500 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-600';
      case 'IN_PROGRESS': return 'text-blue-600';
      case 'PENDING': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'INJECTION': return '💉';
      case 'SCAN': return '🔍';
      case 'SAMPLE': return '🧪';
      default: return '📋';
    }
  };

  const handleQRScan = () => {
    setQrScannerActive(true);
    // Simulate QR scan
    setTimeout(() => {
      const mockQRData = 'ANIMAL_001_INJECTION_2024';
      onQRScan(mockQRData);
      setQrScannerActive(false);
    }, 2000);
  };

  const syncAllDevices = async () => {
    setSyncProgress(0);
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-screen overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Mobile Field Interface</h3>
                <p className="text-sm text-gray-600">Phase 2: Field Operations & Mobile Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm">
                {offlineMode ? (
                  <div className="flex items-center text-orange-600">
                    <WifiOff className="h-4 w-4 mr-1" />
                    <span>Offline Mode</span>
                  </div>
                ) : (
                  <div className="flex items-center text-green-600">
                    <Wifi className="h-4 w-4 mr-1" />
                    <span>Online</span>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <span className="text-lg">×</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-4 mt-4">
            {[
              { key: 'overview', label: 'Field Overview', icon: MapPin },
              { key: 'tasks', label: 'Today\'s Tasks', icon: Clock },
              { key: 'devices', label: 'Mobile Devices', icon: Smartphone },
              { key: 'sync', label: 'Data Sync', icon: Upload }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveView(tab.key as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
                  activeView === tab.key
                    ? 'bg-white text-green-700 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          {activeView === 'overview' && (
            <div className="space-y-6">
              {/* Field Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Today's Tasks</p>
                      <p className="text-2xl font-bold text-green-800">{todaysTasks.length}</p>
                    </div>
                    <Clock className="h-8 w-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-600 text-sm font-medium">Urgent Tasks</p>
                      <p className="text-2xl font-bold text-red-800">{urgentTasks.length}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Active Devices</p>
                      <p className="text-2xl font-bold text-blue-800">
                        {mobileDevices.filter(d => d.connectionStatus === 'ONLINE').length}
                      </p>
                    </div>
                    <Smartphone className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">Locations</p>
                      <p className="text-2xl font-bold text-purple-800">{fieldLocations.length}</p>
                    </div>
                    <MapPin className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Field Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={handleQRScan}
                    disabled={qrScannerActive}
                    className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <QrCode className="h-6 w-6 text-blue-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        {qrScannerActive ? 'Scanning...' : 'QR Code Scanner'}
                      </div>
                      <div className="text-sm text-gray-500">Scan animal or task QR codes</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setOfflineMode(!offlineMode)}
                    className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {offlineMode ? <WifiOff className="h-6 w-6 text-orange-600" /> : <Wifi className="h-6 w-6 text-green-600" />}
                    <div className="text-left">
                      <div className="font-medium text-gray-900">
                        {offlineMode ? 'Go Online' : 'Offline Mode'}
                      </div>
                      <div className="text-sm text-gray-500">Toggle offline capabilities</div>
                    </div>
                  </button>

                  <button
                    onClick={syncAllDevices}
                    className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="h-6 w-6 text-purple-600" />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">Sync All Data</div>
                      <div className="text-sm text-gray-500">Upload pending field data</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Location Overview */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Field Locations Overview</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {fieldLocations.map(location => {
                    const locationTasks = todaysTasks.filter(task => task.location === location);
                    const pendingTasks = locationTasks.filter(task => task.status === 'PENDING').length;
                    
                    return (
                      <div key={location} className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-medium text-gray-900">{location}</div>
                        <div className="text-sm text-gray-600">{locationTasks.length} tasks</div>
                        {pendingTasks > 0 && (
                          <div className="text-xs text-orange-600 font-medium">
                            {pendingTasks} pending
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeView === 'tasks' && (
            <div className="space-y-4">
              {/* Task Filters */}
              <div className="flex items-center space-x-4 mb-6">
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                >
                  <option value="ALL">All Locations</option>
                  {fieldLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                >
                  <option value="ALL">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {filteredTasks.map(task => (
                  <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="text-2xl">{getTaskIcon(task.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-medium text-gray-900">{task.animalName}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className={`text-sm font-medium ${getStatusColor(task.status)}`}>
                              {task.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Type:</span> {task.type}
                            </div>
                            <div>
                              <span className="text-gray-500">Location:</span> {task.location}
                            </div>
                            <div>
                              <span className="text-gray-500">Time:</span> {new Date(task.scheduledTime).toLocaleTimeString()}
                            </div>
                          </div>

                          <div className="mt-2 text-sm text-gray-600">
                            {task.instructions}
                          </div>

                          {task.requiredEquipment.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs text-gray-500">Equipment needed:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {task.requiredEquipment.map((equipment, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                    {equipment}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {task.dataSync === 'PENDING' && (
                          <Upload className="h-4 w-4 text-orange-500" title="Sync Pending" />
                        )}
                        {task.dataSync === 'SYNCED' && (
                          <CheckCircle className="h-4 w-4 text-green-500" title="Synced" />
                        )}
                        {task.photoRequired && (
                          <Camera className="h-4 w-4 text-blue-500" title="Photo Required" />
                        )}
                        
                        <button
                          onClick={() => onTaskUpdate(task.id, { status: 'IN_PROGRESS' })}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                          title="Start Task"
                        >
                          <Zap className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'devices' && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Mobile Device Management</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mobileDevices.map(device => (
                  <div key={device.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-6 w-6 text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-900">{device.name}</div>
                          <div className="text-sm text-gray-500">{device.type}</div>
                        </div>
                      </div>
                      
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        device.connectionStatus === 'ONLINE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {device.connectionStatus}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Battery:</span>
                        <div className="flex items-center space-x-2">
                          <Battery className={`h-4 w-4 ${
                            device.batteryLevel > 50 ? 'text-green-600' :
                            device.batteryLevel > 20 ? 'text-yellow-600' : 'text-red-600'
                          }`} />
                          <span className={`font-medium ${
                            device.batteryLevel > 50 ? 'text-green-600' :
                            device.batteryLevel > 20 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {device.batteryLevel}%
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">User:</span>
                        <span className="font-medium">{device.assignedUser}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">Location:</span>
                        <span className="font-medium">{device.location}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">Active Tasks:</span>
                        <span className="font-medium text-blue-600">{device.activeTasks}</span>
                      </div>

                      {device.pendingUploads > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Pending Uploads:</span>
                          <span className="font-medium text-orange-600">{device.pendingUploads}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-gray-500">Last Sync:</span>
                        <span className="text-xs text-gray-400">
                          {new Date(device.lastSync).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'sync' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Data Synchronization</h4>
                
                {syncProgress > 0 && syncProgress < 100 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Syncing field data...</span>
                      <span>{syncProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${syncProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-green-600 font-medium">Synced Data</div>
                    <div className="text-2xl font-bold text-green-800">
                      {fieldTasks.filter(t => t.dataSync === 'SYNCED').length}
                    </div>
                    <div className="text-sm text-green-600">tasks completed</div>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-orange-600 font-medium">Pending Sync</div>
                    <div className="text-2xl font-bold text-orange-800">
                      {fieldTasks.filter(t => t.dataSync === 'PENDING').length}
                    </div>
                    <div className="text-sm text-orange-600">tasks waiting</div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="text-red-600 font-medium">Failed Sync</div>
                    <div className="text-2xl font-bold text-red-800">
                      {fieldTasks.filter(t => t.dataSync === 'FAILED').length}
                    </div>
                    <div className="text-sm text-red-600">tasks failed</div>
                  </div>
                </div>

                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={syncAllDevices}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Sync All Devices</span>
                  </button>

                  <button
                    onClick={() => setOfflineMode(!offlineMode)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                      offlineMode 
                        ? 'bg-orange-600 text-white hover:bg-orange-700' 
                        : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                  >
                    {offlineMode ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                    <span>{offlineMode ? 'Go Online' : 'Enable Offline Mode'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileFieldInterface; 