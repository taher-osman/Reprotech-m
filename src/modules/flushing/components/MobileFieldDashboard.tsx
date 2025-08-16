import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Battery, 
  MapPin, 
  Clock, 
  User,
  Plus,
  Camera,
  Mic,
  FileText,
  Upload,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  QrCode,
  Thermometer,
  Activity,
  Volume2,
  VolumeX
} from 'lucide-react';
import { FlushingSession } from '../pages/FlushingPage';

interface MobileFieldDashboardProps {
  sessions: FlushingSession[];
  onQuickStart: () => void;
  onSyncData: () => void;
}

interface FieldStatus {
  isOnline: boolean;
  batteryLevel: number;
  gpsAccuracy: number;
  lastSync: string;
  pendingUploads: number;
  activeSession: FlushingSession | null;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
  enabled: boolean;
}

export const MobileFieldDashboard: React.FC<MobileFieldDashboardProps> = ({ 
  sessions, 
  onQuickStart, 
  onSyncData 
}) => {
  const [fieldStatus, setFieldStatus] = useState<FieldStatus>({
    isOnline: true,
    batteryLevel: 85,
    gpsAccuracy: 3.2,
    lastSync: '2 minutes ago',
    pendingUploads: 2,
    activeSession: null
  });

  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState({
    temperature: 22,
    humidity: 65,
    windSpeed: 8
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate battery drain
      setFieldStatus(prev => ({
        ...prev,
        batteryLevel: Math.max(0, prev.batteryLevel - 0.1)
      }));
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const quickActions: QuickAction[] = [
    {
      id: 'new-session',
      label: 'New Flush',
      icon: <Plus className="h-6 w-6" />,
      color: 'bg-blue-500',
      action: onQuickStart,
      enabled: true
    },
    {
      id: 'voice-notes',
      label: 'Voice Notes',
      icon: isSpeechEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />,
      color: 'bg-green-500',
      action: () => setIsSpeechEnabled(!isSpeechEnabled),
      enabled: true
    },
    {
      id: 'photo-capture',
      label: 'Capture Photo',
      icon: <Camera className="h-6 w-6" />,
      color: 'bg-purple-500',
      action: () => {/* Photo capture */},
      enabled: true
    },
    {
      id: 'qr-scan',
      label: 'Scan QR',
      icon: <QrCode className="h-6 w-6" />,
      color: 'bg-orange-500',
      action: () => {/* QR scanner */},
      enabled: true
    },
    {
      id: 'emergency',
      label: 'Emergency',
      icon: <AlertCircle className="h-6 w-6" />,
      color: 'bg-red-500',
      action: () => {/* Emergency contact */},
      enabled: true
    },
    {
      id: 'sync-data',
      label: 'Sync Data',
      icon: <RefreshCw className="h-6 w-6" />,
      color: 'bg-teal-500',
      action: onSyncData,
      enabled: fieldStatus.isOnline
    }
  ];

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-500';
    if (level > 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSignalStrength = () => {
    return fieldStatus.isOnline ? 'Strong' : 'No Signal';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 max-w-md mx-auto">
      {/* Status Bar */}
      <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-gray-900">Field Mode</span>
          </div>
          <div className="flex items-center space-x-3">
            {fieldStatus.isOnline ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <div className="flex items-center space-x-1">
              <Battery className={`h-4 w-4 ${getBatteryColor(fieldStatus.batteryLevel)}`} />
              <span className={`text-sm ${getBatteryColor(fieldStatus.batteryLevel)}`}>
                {Math.round(fieldStatus.batteryLevel)}%
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">GPS: {fieldStatus.gpsAccuracy}m</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{currentTime.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Upload className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Pending: {fieldStatus.pendingUploads}</span>
          </div>
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{fieldStatus.lastSync}</span>
          </div>
        </div>
      </div>

      {/* Weather & Environment */}
      <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-3 flex items-center">
          <Thermometer className="h-5 w-5 text-orange-500 mr-2" />
          Field Conditions
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{weatherData.temperature}°C</div>
            <div className="text-xs text-gray-500">Temperature</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{weatherData.humidity}%</div>
            <div className="text-xs text-gray-500">Humidity</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{weatherData.windSpeed} km/h</div>
            <div className="text-xs text-gray-500">Wind Speed</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.action}
              disabled={!action.enabled}
              className={`${action.color} ${
                action.enabled 
                  ? 'hover:opacity-90 active:scale-95' 
                  : 'opacity-50 cursor-not-allowed'
              } text-white p-4 rounded-lg transition-all duration-200 transform`}
            >
              <div className="flex flex-col items-center space-y-2">
                {action.icon}
                <span className="text-sm font-medium">{action.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Session */}
      {fieldStatus.activeSession && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-blue-900">Active Session</h3>
            <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
          </div>
          <div className="text-sm text-blue-800">
            <div>Session: {fieldStatus.activeSession.session_id}</div>
            <div>Donor: {fieldStatus.activeSession.donor_name}</div>
            <div>Started: {new Date(fieldStatus.activeSession.created_at).toLocaleTimeString()}</div>
          </div>
          <button className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700">
            Continue Session
          </button>
        </div>
      )}

      {/* Recent Sessions */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-4">Recent Sessions</h3>
        <div className="space-y-3">
          {sessions.slice(0, 3).map((session) => (
            <div key={session.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{session.session_id}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  session.status === 'Completed' 
                    ? 'bg-green-100 text-green-800'
                    : session.status === 'In Progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {session.status}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <div>Donor: {session.donor_name}</div>
                <div>Embryos: {session.total_embryos} ({session.viable_embryos} viable)</div>
                <div>Date: {new Date(session.flush_date).toLocaleDateString()}</div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">
                  {session.technician}
                </span>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Offline Mode Banner */}
      {!fieldStatus.isOnline && (
        <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto bg-orange-500 text-white p-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <WifiOff className="h-5 w-5" />
            <span className="font-medium">Offline Mode</span>
          </div>
          <div className="text-sm mt-1">
            Data will sync when connection is restored
          </div>
        </div>
      )}

      {/* Voice Recording Indicator */}
      {isSpeechEnabled && (
        <div className="fixed top-4 left-4 right-4 max-w-md mx-auto bg-green-500 text-white p-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Mic className="h-5 w-5 animate-pulse" />
            <span className="font-medium">Voice Notes Active</span>
          </div>
          <div className="text-sm mt-1">
            Tap to record notes, swipe to stop
          </div>
        </div>
      )}
    </div>
  );
}; 