import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Thermometer, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BarChart3, 
  Settings, 
  Wifi, 
  WifiOff,
  Activity,
  TrendingUp,
  Microscope,
  FlaskConical,
  Brain,
  Sparkles
} from 'lucide-react';
import { Sample } from '../types/sampleTypes';

interface LabIntegrationHubProps {
  samples: Sample[];
  onEquipmentAction: (equipmentId: string, action: string) => void;
}

interface EquipmentStatus {
  id: string;
  name: string;
  type: 'freezer' | 'incubator' | 'microscope' | 'centrifuge' | 'analyzer';
  status: 'online' | 'offline' | 'maintenance' | 'error';
  temperature?: number;
  targetTemperature?: number;
  humidity?: number;
  lastMaintenance: string;
  samplesCount: number;
  alerts: Alert[];
}

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
}

interface WorkflowStep {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  equipment: string;
  duration: number;
  sample_id?: string;
}

export const LabIntegrationHub: React.FC<LabIntegrationHubProps> = ({
  samples,
  onEquipmentAction
}) => {
  const [equipment, setEquipment] = useState<EquipmentStatus[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowStep[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [realTimeData, setRealTimeData] = useState<boolean>(true);

  // Initialize equipment data
  useEffect(() => {
    const mockEquipment: EquipmentStatus[] = [
      {
        id: 'freezer-01',
        name: 'Cryogenic Freezer A1',
        type: 'freezer',
        status: 'online',
        temperature: -196,
        targetTemperature: -196,
        humidity: 15,
        lastMaintenance: '2025-01-15',
        samplesCount: samples.filter(s => s.status === 'Assigned to Biobank').length,
        alerts: [
          {
            id: 'alert-1',
            type: 'info',
            message: 'Temperature stable for 72 hours',
            timestamp: '2025-01-16T10:30:00Z'
          }
        ]
      },
      {
        id: 'incubator-01',
        name: 'CO2 Incubator B2',
        type: 'incubator',
        status: 'online',
        temperature: 37.2,
        targetTemperature: 37.0,
        humidity: 95,
        lastMaintenance: '2025-01-10',
        samplesCount: samples.filter(s => s.sample_type === 'embryo' && s.status === 'Fresh').length,
        alerts: [
          {
            id: 'alert-2',
            type: 'warning',
            message: 'Temperature slightly above target',
            timestamp: '2025-01-16T11:15:00Z'
          }
        ]
      },
      {
        id: 'microscope-01',
        name: 'Inverted Microscope C1',
        type: 'microscope',
        status: 'online',
        lastMaintenance: '2025-01-08',
        samplesCount: samples.filter(s => s.quality_score && s.quality_score > 0).length,
        alerts: []
      },
      {
        id: 'centrifuge-01',
        name: 'High-Speed Centrifuge D1',
        type: 'centrifuge',
        status: 'maintenance',
        lastMaintenance: '2025-01-16',
        samplesCount: 0,
        alerts: [
          {
            id: 'alert-3',
            type: 'info',
            message: 'Scheduled maintenance in progress',
            timestamp: '2025-01-16T09:00:00Z'
          }
        ]
      },
      {
        id: 'analyzer-01',
        name: 'Sample Quality Analyzer E1',
        type: 'analyzer',
        status: 'error',
        lastMaintenance: '2025-01-05',
        samplesCount: 0,
        alerts: [
          {
            id: 'alert-4',
            type: 'error',
            message: 'Calibration required - contact service',
            timestamp: '2025-01-16T08:45:00Z'
          }
        ]
      }
    ];

    const mockWorkflows: WorkflowStep[] = [
      {
        id: 'wf-1',
        name: 'Quality Assessment',
        status: 'in-progress',
        equipment: 'microscope-01',
        duration: 45,
        sample_id: samples[0]?.sample_id
      },
      {
        id: 'wf-2',
        name: 'Cryopreservation',
        status: 'pending',
        equipment: 'freezer-01',
        duration: 30,
        sample_id: samples[1]?.sample_id
      },
      {
        id: 'wf-3',
        name: 'Culture Incubation',
        status: 'completed',
        equipment: 'incubator-01',
        duration: 120,
        sample_id: samples[2]?.sample_id
      }
    ];

    setEquipment(mockEquipment);
    setWorkflows(mockWorkflows);
  }, [samples]);

  // Real-time data simulation
  useEffect(() => {
    if (!realTimeData) return;

    const interval = setInterval(() => {
      setEquipment(prev => prev.map(eq => {
        if (eq.type === 'freezer' || eq.type === 'incubator') {
          const variation = (Math.random() - 0.5) * 0.5;
          return {
            ...eq,
            temperature: eq.targetTemperature ? eq.targetTemperature + variation : eq.temperature
          };
        }
        return eq;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [realTimeData]);

  // Get equipment icon
  const getEquipmentIcon = (type: string) => {
    switch (type) {
      case 'freezer': return <Thermometer className="h-5 w-5" />;
      case 'incubator': return <Cpu className="h-5 w-5" />;
      case 'microscope': return <Microscope className="h-5 w-5" />;
      case 'centrifuge': return <Zap className="h-5 w-5" />;
      case 'analyzer': return <FlaskConical className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get alert icon
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  // Get workflow status icon
  const getWorkflowStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Activity className="h-6 w-6 text-teal-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Lab Integration Hub</h3>
            <p className="text-sm text-gray-600">Monitor equipment, workflows, and lab analytics</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {realTimeData ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-gray-400" />
            )}
            <span className="text-sm text-gray-600">Real-time</span>
            <button
              onClick={() => setRealTimeData(!realTimeData)}
              className={`w-8 h-4 rounded-full transition-colors ${
                realTimeData ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                realTimeData ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Equipment Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {equipment.map(eq => (
          <div
            key={eq.id}
            className={`bg-white p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedEquipment === eq.id 
                ? 'border-teal-300 bg-teal-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedEquipment(selectedEquipment === eq.id ? null : eq.id)}
          >
            {/* Equipment Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getEquipmentIcon(eq.type)}
                <span className="font-medium text-gray-900">{eq.name}</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(eq.status)}`}>
                {eq.status}
              </span>
            </div>

            {/* Temperature/Humidity Display */}
            {(eq.temperature !== undefined || eq.humidity !== undefined) && (
              <div className="grid grid-cols-2 gap-2 mb-3">
                {eq.temperature !== undefined && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-lg font-bold text-blue-600">
                      {eq.temperature.toFixed(1)}°C
                    </div>
                    <div className="text-xs text-gray-600">Temperature</div>
                    {eq.targetTemperature && (
                      <div className="text-xs text-gray-500">
                        Target: {eq.targetTemperature}°C
                      </div>
                    )}
                  </div>
                )}
                {eq.humidity !== undefined && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-lg font-bold text-green-600">
                      {eq.humidity}%
                    </div>
                    <div className="text-xs text-gray-600">Humidity</div>
                  </div>
                )}
              </div>
            )}

            {/* Sample Count */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">Active Samples:</span>
              <span className="font-medium text-gray-900">{eq.samplesCount}</span>
            </div>

            {/* Alerts */}
            {eq.alerts.length > 0 && (
              <div className="space-y-1">
                {eq.alerts.slice(0, 2).map(alert => (
                  <div key={alert.id} className="flex items-center space-x-2 text-xs">
                    {getAlertIcon(alert.type)}
                    <span className="truncate">{alert.message}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Expanded Details */}
            {selectedEquipment === eq.id && (
              <div className="mt-4 pt-4 border-t space-y-3">
                <div className="text-sm">
                  <span className="text-gray-600">Last Maintenance:</span>
                  <span className="ml-2 font-medium">
                    {new Date(eq.lastMaintenance).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEquipmentAction(eq.id, 'calibrate');
                    }}
                    className="flex-1 bg-teal-600 text-white px-3 py-1 rounded text-xs hover:bg-teal-700 transition-colors"
                  >
                    Calibrate
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEquipmentAction(eq.id, 'maintenance');
                    }}
                    className="flex-1 bg-gray-600 text-white px-3 py-1 rounded text-xs hover:bg-gray-700 transition-colors"
                  >
                    Maintenance
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Workflow Monitor */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-gray-900">Active Workflows</h4>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-teal-600" />
            <span className="text-sm text-gray-600">{workflows.length} workflows</span>
          </div>
        </div>

        <div className="space-y-3">
          {workflows.map(workflow => (
            <div key={workflow.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getWorkflowStatusIcon(workflow.status)}
                <div>
                  <div className="font-medium text-gray-900">{workflow.name}</div>
                  <div className="text-sm text-gray-600">
                    {workflow.sample_id && `Sample: ${workflow.sample_id} • `}
                    Equipment: {equipment.find(eq => eq.id === workflow.equipment)?.name}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {workflow.duration} min
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {workflow.status.replace('-', ' ')}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Laboratory Integration Panel */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium text-gray-900 flex items-center">
              <Brain className="w-4 h-4 mr-2 text-purple-600" />
              Laboratory Module Integration
            </h5>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-600 font-medium">Connected</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="text-center p-2 bg-white rounded border">
              <div className="text-lg font-bold text-purple-600">23</div>
              <div className="text-xs text-gray-600">Pending Tests</div>
            </div>
            <div className="text-center p-2 bg-white rounded border">
              <div className="text-lg font-bold text-blue-600">8</div>
              <div className="text-xs text-gray-600">In Progress</div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="flex-1 bg-purple-600 text-white px-3 py-2 rounded text-xs hover:bg-purple-700 transition-colors flex items-center justify-center">
              <Sparkles className="w-3 h-3 mr-1" />
              Smart Selection
            </button>
            <button className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded text-xs hover:bg-indigo-700 transition-colors">
              View Lab Module
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sample Processing Rate */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-3">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h5 className="font-medium text-gray-900">Processing Rate</h5>
          </div>
          <div className="text-2xl font-bold text-blue-600 mb-1">24</div>
          <div className="text-sm text-gray-600">samples/hour</div>
          <div className="flex items-center space-x-1 mt-2">
            <TrendingUp className="h-3 w-3 text-green-600" />
            <span className="text-xs text-green-600">+15% from yesterday</span>
          </div>
        </div>

        {/* Equipment Efficiency */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-3">
            <Activity className="h-5 w-5 text-green-600" />
            <h5 className="font-medium text-gray-900">Equipment Efficiency</h5>
          </div>
          <div className="text-2xl font-bold text-green-600 mb-1">94.2%</div>
          <div className="text-sm text-gray-600">average uptime</div>
          <div className="flex items-center space-x-1 mt-2">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <span className="text-xs text-green-600">All systems nominal</span>
          </div>
        </div>

        {/* Quality Score */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2 mb-3">
            <FlaskConical className="h-5 w-5 text-purple-600" />
            <h5 className="font-medium text-gray-900">Avg Quality Score</h5>
          </div>
          <div className="text-2xl font-bold text-purple-600 mb-1">8.7/10</div>
          <div className="text-sm text-gray-600">across all samples</div>
          <div className="flex items-center space-x-1 mt-2">
            <TrendingUp className="h-3 w-3 text-purple-600" />
            <span className="text-xs text-purple-600">+0.3 this week</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 