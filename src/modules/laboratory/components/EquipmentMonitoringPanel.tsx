import React, { useState, useEffect } from 'react';
import { Monitor, Thermometer, Zap, AlertTriangle, CheckCircle, Clock, Wrench, Activity } from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
  type: string;
  model: string;
  serialNumber: string;
  location: string;
  status: 'OPERATIONAL' | 'MAINTENANCE' | 'OFFLINE' | 'CALIBRATION';
  lastMaintenance: string;
  nextMaintenance: string;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  voltage?: number;
  uptime: number;
  alerts: number;
  utilizationRate: number;
}

const EquipmentMonitoringPanel: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [filter, setFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEquipment();
    const interval = setInterval(loadEquipment, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadEquipment = async () => {
    try {
      // Mock equipment data with real-time monitoring
      const mockEquipment: Equipment[] = [
        {
          id: '1',
          name: 'PCR Thermocycler 1',
          type: 'PCR_MACHINE',
          model: 'Bio-Rad CFX96',
          serialNumber: 'BR-CFX96-001',
          location: 'Lab Room A',
          status: 'OPERATIONAL',
          lastMaintenance: '2024-12-15',
          nextMaintenance: '2025-03-15',
          temperature: 95.2,
          uptime: 98.5,
          alerts: 0,
          utilizationRate: 87.3
        },
        {
          id: '2',
          name: 'Centrifuge High-Speed',
          type: 'CENTRIFUGE',
          model: 'Eppendorf 5424R',
          serialNumber: 'EP-5424R-002',
          location: 'Lab Room B',
          status: 'OPERATIONAL',
          lastMaintenance: '2024-11-20',
          nextMaintenance: '2025-02-20',
          temperature: 4.1,
          uptime: 96.8,
          alerts: 1,
          utilizationRate: 73.2
        },
        {
          id: '3',
          name: 'Incubator CO2 1',
          type: 'INCUBATOR',
          model: 'Thermo Heracell 150i',
          serialNumber: 'TH-HC150-001',
          location: 'Culture Room',
          status: 'OPERATIONAL',
          lastMaintenance: '2024-12-01',
          nextMaintenance: '2025-06-01',
          temperature: 37.0,
          humidity: 95.0,
          uptime: 99.2,
          alerts: 0,
          utilizationRate: 92.1
        },
        {
          id: '4',
          name: 'Spectrophotometer UV-Vis',
          type: 'SPECTROPHOTOMETER',
          model: 'Agilent Cary 60',
          serialNumber: 'AG-C60-003',
          location: 'Analysis Room',
          status: 'MAINTENANCE',
          lastMaintenance: '2025-01-02',
          nextMaintenance: '2025-04-02',
          uptime: 94.7,
          alerts: 2,
          utilizationRate: 0
        },
        {
          id: '5',
          name: 'Microscope Fluorescence',
          type: 'MICROSCOPE',
          model: 'Olympus BX53',
          serialNumber: 'OL-BX53-001',
          location: 'Imaging Room',
          status: 'OPERATIONAL',
          lastMaintenance: '2024-10-15',
          nextMaintenance: '2025-01-15',
          uptime: 97.9,
          alerts: 0,
          utilizationRate: 64.8
        },
        {
          id: '6',
          name: 'Freezer -80°C',
          type: 'FREEZER',
          model: 'Thermo ULT1386',
          serialNumber: 'TH-ULT1386-001',
          location: 'Storage Room',
          status: 'OPERATIONAL',
          lastMaintenance: '2024-09-30',
          nextMaintenance: '2025-03-30',
          temperature: -79.8,
          uptime: 99.9,
          alerts: 0,
          utilizationRate: 85.6
        }
      ];

      setEquipment(mockEquipment);
      setLoading(false);
    } catch (error) {
      console.error('Error loading equipment:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPERATIONAL':
        return 'bg-green-100 text-green-800';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800';
      case 'OFFLINE':
        return 'bg-red-100 text-red-800';
      case 'CALIBRATION':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPERATIONAL':
        return <CheckCircle className="w-4 h-4" />;
      case 'MAINTENANCE':
        return <Wrench className="w-4 h-4" />;
      case 'OFFLINE':
        return <AlertTriangle className="w-4 h-4" />;
      case 'CALIBRATION':
        return <Activity className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 98) return 'text-green-600';
    if (uptime >= 95) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredEquipment = equipment.filter(eq => 
    filter === 'ALL' || eq.status === filter
  );

  const totalEquipment = equipment.length;
  const operationalEquipment = equipment.filter(eq => eq.status === 'OPERATIONAL').length;
  const totalAlerts = equipment.reduce((sum, eq) => sum + eq.alerts, 0);
  const averageUptime = equipment.reduce((sum, eq) => sum + eq.uptime, 0) / equipment.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Equipment Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Equipment</p>
              <p className="text-2xl font-bold text-blue-900">{totalEquipment}</p>
            </div>
            <Monitor className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Operational</p>
              <p className="text-2xl font-bold text-green-900">{operationalEquipment}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Active Alerts</p>
              <p className="text-2xl font-bold text-red-900">{totalAlerts}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg. Uptime</p>
              <p className="text-2xl font-bold text-purple-900">{averageUptime.toFixed(1)}%</p>
            </div>
            <Activity className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {['ALL', 'OPERATIONAL', 'MAINTENANCE', 'OFFLINE', 'CALIBRATION'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'ALL' ? 'All Equipment' : status.charAt(0) + status.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((eq) => (
          <div
            key={eq.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedEquipment(eq)}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{eq.name}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(eq.status)}`}>
                  {getStatusIcon(eq.status)}
                  <span className="ml-1">{eq.status}</span>
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Model:</span>
                  <span className="font-medium">{eq.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-medium">{eq.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Uptime:</span>
                  <span className={`font-medium ${getUptimeColor(eq.uptime)}`}>
                    {eq.uptime.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Utilization:</span>
                  <span className="font-medium">{eq.utilizationRate.toFixed(1)}%</span>
                </div>
              </div>

              {/* Temperature display for relevant equipment */}
              {eq.temperature !== undefined && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Thermometer className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-900">Temperature</span>
                    </div>
                    <span className="text-lg font-bold text-blue-900">
                      {eq.temperature}°C
                    </span>
                  </div>
                </div>
              )}

              {/* Humidity display for incubators */}
              {eq.humidity !== undefined && (
                <div className="mt-2 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-900">Humidity</span>
                    </div>
                    <span className="text-lg font-bold text-green-900">
                      {eq.humidity}%
                    </span>
                  </div>
                </div>
              )}

              {/* Alerts indicator */}
              {eq.alerts > 0 && (
                <div className="mt-4 p-2 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                    <span className="text-sm font-medium text-red-900">
                      {eq.alerts} active alert{eq.alerts > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}

              {/* Next maintenance */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    Next Maintenance
                  </div>
                  <span className="font-medium">{new Date(eq.nextMaintenance).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Equipment Detail Modal */}
      {selectedEquipment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Monitor className="w-8 h-8" />
                  <div>
                    <h2 className="text-xl font-bold">{selectedEquipment.name}</h2>
                    <p className="text-blue-100">{selectedEquipment.model}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEquipment(null)}
                  className="text-white hover:text-blue-200 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Equipment Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Equipment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Serial Number:</span>
                      <span className="font-medium">{selectedEquipment.serialNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-medium">{selectedEquipment.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location:</span>
                      <span className="font-medium">{selectedEquipment.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEquipment.status)}`}>
                        {getStatusIcon(selectedEquipment.status)}
                        <span className="ml-1">{selectedEquipment.status}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Performance Metrics</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Uptime:</span>
                      <span className={`font-medium ${getUptimeColor(selectedEquipment.uptime)}`}>
                        {selectedEquipment.uptime.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Utilization Rate:</span>
                      <span className="font-medium">{selectedEquipment.utilizationRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Active Alerts:</span>
                      <span className={`font-medium ${selectedEquipment.alerts > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {selectedEquipment.alerts}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Environmental Conditions */}
              {(selectedEquipment.temperature !== undefined || selectedEquipment.humidity !== undefined) && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Environmental Conditions</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedEquipment.temperature !== undefined && (
                      <div className="bg-white p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Thermometer className="w-5 h-5 text-blue-600 mr-2" />
                            <span className="text-sm font-medium">Temperature</span>
                          </div>
                          <span className="text-lg font-bold text-blue-900">
                            {selectedEquipment.temperature}°C
                          </span>
                        </div>
                      </div>
                    )}
                    {selectedEquipment.humidity !== undefined && (
                      <div className="bg-white p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Zap className="w-5 h-5 text-green-600 mr-2" />
                            <span className="text-sm font-medium">Humidity</span>
                          </div>
                          <span className="text-lg font-bold text-green-900">
                            {selectedEquipment.humidity}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Maintenance Information */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Maintenance Schedule</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-sm">
                      <span className="text-gray-500">Last Maintenance:</span>
                      <p className="font-medium">{new Date(selectedEquipment.lastMaintenance).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-sm">
                      <span className="text-gray-500">Next Maintenance:</span>
                      <p className="font-medium">{new Date(selectedEquipment.nextMaintenance).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                  View History
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
                  Schedule Maintenance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentMonitoringPanel; 