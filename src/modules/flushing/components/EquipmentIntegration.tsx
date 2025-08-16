import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Thermometer, 
  Droplets, 
  Gauge, 
  Wifi, 
  WifiOff, 
  Power, 
  PowerOff,
  AlertTriangle, 
  CheckCircle, 
  Settings, 
  Bluetooth,
  Radio,
  Monitor,
  Activity,
  Clock,
  TrendingUp,
  TrendingDown,
  Zap,
  Pause,
  Play,
  RotateCcw,
  Camera,
  Microscope
} from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'error';
  parameters: { [key: string]: any };
}

interface EquipmentAlert {
  id: string;
  equipmentId: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

interface EquipmentIntegrationProps {
  onParameterChange: (equipmentId: string, parameter: string, value: any) => void;
  onAlert: (alert: EquipmentAlert) => void;
}

export const EquipmentIntegration: React.FC<EquipmentIntegrationProps> = ({ 
  onParameterChange, 
  onAlert 
}) => {
  const [equipment] = useState<Equipment[]>([
    {
      id: 'incubator-01',
      name: 'Incubator Station A',
      type: 'incubator',
      status: 'online',
      parameters: { temperature: 38.5, humidity: 85 }
    },
    {
      id: 'microscope-01', 
      name: 'Digital Microscope',
      type: 'microscope',
      status: 'online',
      parameters: { magnification: 400, lightIntensity: 75 }
    }
  ]);

  const [alerts, setAlerts] = useState<EquipmentAlert[]>([
    {
      id: 'alert-001',
      equipmentId: 'aspirator-01',
      type: 'error',
      message: 'Vacuum pressure below threshold (-15.2 kPa)',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      acknowledged: false
    },
    {
      id: 'alert-002',
      equipmentId: 'centrifuge-01',
      type: 'warning',
      message: 'Device offline for 15 minutes',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      acknowledged: false
    },
    {
      id: 'alert-003',
      equipmentId: 'aspirator-01',
      type: 'warning',
      message: 'Filter replacement recommended',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      acknowledged: true
    }
  ]);

  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Simulate real-time parameter updates
    const interval = setInterval(() => {
      setEquipment(prev => prev.map(eq => {
        if (eq.status === 'online') {
          const updatedParams = { ...eq.parameters };
          
          // Simulate parameter variations
          switch (eq.type) {
            case 'incubator':
              updatedParams.temperature += (Math.random() - 0.5) * 0.2;
              updatedParams.humidity += (Math.random() - 0.5) * 2;
              break;
            case 'pump':
              updatedParams.pressure += (Math.random() - 0.5) * 0.5;
              updatedParams.flowRate += (Math.random() - 0.5) * 0.2;
              break;
            case 'cooler':
              updatedParams.temperature += (Math.random() - 0.5) * 0.3;
              break;
          }

          return {
            ...eq,
            parameters: updatedParams,
            lastUpdate: new Date()
          };
        }
        return eq;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Wifi className="h-5 w-5 text-gray-500" />;
    }
  };

  const getConnectionIcon = (type: string) => {
    switch (type) {
      case 'wifi':
        return <Wifi className="h-4 w-4 text-blue-500" />;
      case 'bluetooth':
        return <Bluetooth className="h-4 w-4 text-blue-500" />;
      case 'usb':
        return <Zap className="h-4 w-4 text-purple-500" />;
      case 'serial':
        return <Radio className="h-4 w-4 text-orange-500" />;
      default:
        return <Monitor className="h-4 w-4 text-gray-400" />;
    }
  };

  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case 'incubator':
        return <Thermometer className="h-6 w-6 text-orange-500" />;
      case 'microscope':
        return <Microscope className="h-6 w-6 text-purple-500" />;
      case 'centrifuge':
        return <RotateCcw className="h-6 w-6 text-blue-500" />;
      case 'aspirator':
        return <Droplets className="h-6 w-6 text-teal-500" />;
      case 'cooler':
        return <Thermometer className="h-6 w-6 text-blue-600" />;
      case 'pump':
        return <Gauge className="h-6 w-6 text-green-500" />;
      default:
        return <Cpu className="h-6 w-6 text-gray-500" />;
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const scanForDevices = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Simulate finding new device
      const newDevice: Equipment = {
        id: `device-${Date.now()}`,
        name: 'New Temperature Probe',
        type: 'incubator',
        status: 'online',
        parameters: {
          temperature: 37.8,
          targetTemp: 38.0
        }
      };
      setEquipment(prev => [...prev, newDevice]);
    }, 3000);
  };

  const renderEquipmentCard = (eq: Equipment) => (
    <div 
      key={eq.id} 
      className={`bg-white rounded-lg border p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
        selectedEquipment?.id === eq.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      }`}
      onClick={() => setSelectedEquipment(eq)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          {getEquipmentIcon(eq.type)}
          <div>
            <h3 className="font-medium text-gray-900">{eq.name}</h3>
            <p className="text-sm text-gray-500">{eq.type}</p>
          </div>
        </div>
        {getStatusIcon(eq.status)}
      </div>

      <div className="space-y-3">
        {Object.entries(eq.parameters).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-gray-600 capitalize">{key}:</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
          Configure
        </button>
      </div>
    </div>
  );

  const renderParameterControl = (eq: Equipment) => (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {getEquipmentIcon(eq.type)}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{eq.name}</h2>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
            <Settings className="h-4 w-4" />
          </button>
          <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
            <Activity className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(eq.parameters).map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="text-gray-600 capitalize">{key}:</span>
            <span className="font-medium">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              Save Settings
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Equipment Integration</h2>
        <p className="text-gray-600">Real-time monitoring of laboratory equipment</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {equipment.map((eq) => (
          <div key={eq.id} className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getEquipmentIcon(eq.type)}
                <div>
                  <h3 className="font-medium text-gray-900">{eq.name}</h3>
                  <p className="text-sm text-gray-500">{eq.type}</p>
                </div>
              </div>
              {getStatusIcon(eq.status)}
            </div>

            <div className="space-y-3">
              {Object.entries(eq.parameters).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-600 capitalize">{key}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {alerts.filter(alert => !alert.acknowledged).length > 0 && (
        <div className="bg-white rounded-lg border border-red-200 p-4">
          <h3 className="font-medium text-red-900 mb-3 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Active Alerts ({alerts.filter(alert => !alert.acknowledged).length})
          </h3>
          <div className="space-y-2">
            {alerts.filter(alert => !alert.acknowledged).map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <div className="font-medium text-red-900">{alert.message}</div>
                  <div className="text-sm text-red-600">
                    {alert.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Acknowledge
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment List */}
        <div className="lg:col-span-1">
          <h3 className="font-medium text-gray-900 mb-4">Connected Equipment</h3>
          <div className="space-y-3">
            {equipment.map(renderEquipmentCard)}
          </div>
        </div>

        {/* Equipment Control Panel */}
        <div className="lg:col-span-2">
          {selectedEquipment ? (
            renderParameterControl(selectedEquipment)
          ) : (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select Equipment</h3>
              <p className="text-gray-600">
                Click on any equipment from the list to view and control its parameters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 