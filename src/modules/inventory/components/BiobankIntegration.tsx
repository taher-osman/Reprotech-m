import React, { useState, useEffect } from 'react';
import {
  Snowflake,
  Thermometer,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  ArrowRight,
  Eye,
  RefreshCw,
  MapPin,
  Beaker,
  Activity,
  TrendingUp,
  Download,
  Send,
  Settings,
  Bell,
  Shield,
  Zap,
  BarChart3,
  Monitor
} from 'lucide-react';
import biobankIntegrationService, {
  LN2Tank,
  BiobankTransfer,
  TemperatureAlert,
  BiobankInventoryStats,
  TankSample
} from '../services/biobankIntegrationService';

export const BiobankIntegration: React.FC = () => {
  const [tanks, setTanks] = useState<LN2Tank[]>([]);
  const [transfers, setTransfers] = useState<BiobankTransfer[]>([]);
  const [alerts, setAlerts] = useState<TemperatureAlert[]>([]);
  const [stats, setStats] = useState<BiobankInventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'tanks' | 'transfers' | 'alerts'>('overview');
  const [selectedTank, setSelectedTank] = useState<LN2Tank | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);

  useEffect(() => {
    loadBiobankData();
  }, []);

  const loadBiobankData = async () => {
    setLoading(true);
    try {
      const [tanksData, transfersData, alertsData, statsData] = await Promise.all([
        biobankIntegrationService.getLN2Tanks(),
        biobankIntegrationService.getBiobankTransfers(),
        biobankIntegrationService.getTemperatureAlerts(),
        biobankIntegrationService.getBiobankStats()
      ]);
      
      setTanks(tanksData);
      setTransfers(transfersData);
      setAlerts(alertsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading biobank data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTankStatusColor = (status: string) => {
    switch (status) {
      case 'OPERATIONAL': return 'text-green-600 bg-green-100';
      case 'LOW_LEVEL': return 'text-yellow-600 bg-yellow-100';
      case 'CRITICAL': return 'text-red-600 bg-red-100';
      case 'MAINTENANCE': return 'text-blue-600 bg-blue-100';
      case 'OFFLINE': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlarmColor = (status: string) => {
    switch (status) {
      case 'NORMAL': return 'text-green-600';
      case 'WARNING': return 'text-yellow-600';
      case 'CRITICAL': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'INFO': return 'text-blue-600 bg-blue-100';
      case 'WARNING': return 'text-yellow-600 bg-yellow-100';
      case 'CRITICAL': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Phase 4 Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Biobank Integration Hub</h2>
            <p className="text-teal-100 mt-1">LN₂ Tank Management & Sample Traceability</p>
          </div>
          <div className="flex space-x-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">PHASE 4</span>
            <span className="bg-cyan-500 px-3 py-1 rounded-full text-sm font-medium">BIOBANK INTEGRATION</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center">
              <Snowflake className="h-8 w-8 text-cyan-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">LN₂ Tanks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.operationalTanks}/{stats.totalTanks}</p>
                <p className="text-xs text-gray-500">Operational</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Samples Stored</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSamplesStored.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{stats.capacityUtilization}% capacity</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center">
              <Thermometer className="h-8 w-8 text-indigo-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Avg Temperature</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageTemperature}°C</p>
                <p className="text-xs text-gray-500">System-wide</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Critical Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.criticalAlerts}</p>
                <p className="text-xs text-gray-500">{stats.pendingTransfers} pending transfers</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveView('tanks')}
          className="bg-white p-6 rounded-lg border border-gray-200 hover:bg-gray-50 text-left transition-colors"
        >
          <div className="flex items-center">
            <Monitor className="h-8 w-8 text-cyan-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Tank Monitoring</h3>
              <p className="text-sm text-gray-500">Real-time LN₂ tank status and controls</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveView('transfers')}
          className="bg-white p-6 rounded-lg border border-gray-200 hover:bg-gray-50 text-left transition-colors"
        >
          <div className="flex items-center">
            <Send className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Sample Transfers</h3>
              <p className="text-sm text-gray-500">Manage transfers to biobank storage</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setActiveView('alerts')}
          className="bg-white p-6 rounded-lg border border-gray-200 hover:bg-gray-50 text-left transition-colors"
        >
          <div className="flex items-center">
            <Bell className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Temperature Alerts</h3>
              <p className="text-sm text-gray-500">Monitor and respond to system alerts</p>
            </div>
          </div>
        </button>
      </div>

      {/* Sample Type Distribution */}
      {stats && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Distribution by Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(stats.samplesByType).map(([type, count]) => (
              <div key={type} className="text-center">
                <div className="bg-gray-100 rounded-lg p-3 mb-2">
                  <Beaker className="h-6 w-6 text-gray-600 mx-auto" />
                </div>
                <p className="text-sm font-medium text-gray-900 capitalize">{type}</p>
                <p className="text-lg font-bold text-teal-600">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTanks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">LN₂ Tank Management</h2>
        <button
          onClick={loadBiobankData}
          className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Status</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tanks.map(tank => (
          <div key={tank.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Snowflake className={`h-8 w-8 ${getAlarmColor(tank.alarmStatus)}`} />
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{tank.tankNumber}</h3>
                    <p className="text-sm text-gray-500">{tank.location}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTankStatusColor(tank.status)}`}>
                  {tank.status.replace('_', ' ')}
                </span>
              </div>

              {/* Tank Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Temperature</p>
                  <p className="text-lg font-bold text-gray-900">{tank.temperature}°C</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pressure</p>
                  <p className="text-lg font-bold text-gray-900">{tank.pressureReading} PSI</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Level</p>
                  <p className="text-lg font-bold text-gray-900">{tank.currentLevel}L / {tank.capacity}L</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Samples</p>
                  <p className="text-lg font-bold text-gray-900">{tank.samples.length}</p>
                </div>
              </div>

              {/* Level Indicator */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>LN₂ Level</span>
                  <span>{Math.round((tank.currentLevel / tank.capacity) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      tank.currentLevel / tank.capacity > 0.5 ? 'bg-green-500' :
                      tank.currentLevel / tank.capacity > 0.25 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(tank.currentLevel / tank.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Tank Notes */}
              {tank.notes && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700">{tank.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedTank(tank)}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Samples</span>
                </button>
                <button className="bg-teal-600 text-white px-3 py-2 rounded-lg hover:bg-teal-700 flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Manage</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTransfers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Sample Transfers</h2>
        <button
          onClick={() => setShowTransferModal(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center space-x-2"
        >
          <Send className="h-4 w-4" />
          <span>New Transfer</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transfer ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From → To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Samples
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transfers.map(transfer => (
                <tr key={transfer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transfer.transferId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <span className="truncate max-w-24">{transfer.fromLocation}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <span className="truncate max-w-24">{transfer.toTank}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transfer.samples.length} samples
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      transfer.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      transfer.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                      transfer.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {transfer.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transfer.transferDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-teal-600 hover:text-teal-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Temperature & System Alerts</h2>
        <div className="flex space-x-2">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
            Mark All Read
          </button>
          <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">
            Configure Alerts
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map(alert => (
          <div key={alert.id} className={`bg-white rounded-lg border-l-4 p-4 ${
            alert.severity === 'CRITICAL' ? 'border-red-500' :
            alert.severity === 'WARNING' ? 'border-yellow-500' :
            'border-blue-500'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`mt-1 ${
                  alert.severity === 'CRITICAL' ? 'text-red-500' :
                  alert.severity === 'WARNING' ? 'text-yellow-500' :
                  'text-blue-500'
                }`}>
                  {alert.alertType === 'TEMPERATURE_DEVIATION' ? <Thermometer className="h-5 w-5" /> :
                   alert.alertType === 'LOW_LEVEL' ? <Snowflake className="h-5 w-5" /> :
                   alert.alertType === 'PRESSURE_ALARM' ? <Activity className="h-5 w-5" /> :
                   <Clock className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-gray-900">{alert.tankNumber}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAlertSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(alert.timestamp).toLocaleString()}
                    {alert.acknowledged && alert.acknowledgedBy && (
                      <span className="ml-2">• Acknowledged by {alert.acknowledgedBy}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {!alert.acknowledged && (
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Acknowledge
                  </button>
                )}
                {!alert.resolved && (
                  <button className="text-sm text-green-600 hover:text-green-800">
                    Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTankSamples = () => {
    if (!selectedTank) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedTank.tankNumber} - Stored Samples
            </h3>
            <button
              onClick={() => setSelectedTank(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-96">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedTank.samples.slice(0, 12).map(sample => (
                <div key={sample.id} className="bg-gray-50 rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{sample.sampleId}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      sample.viabilityStatus === 'HIGH' ? 'bg-green-100 text-green-700' :
                      sample.viabilityStatus === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {sample.viabilityStatus}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 capitalize">{sample.sampleType}</p>
                  <p className="text-xs text-gray-500 mt-1">{sample.position}</p>
                  <p className="text-xs text-gray-500">Quality: {sample.quality}/10</p>
                  <p className="text-xs text-gray-500">Stored: {sample.storageDate}</p>
                </div>
              ))}
            </div>
            
            {selectedTank.samples.length > 12 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  Showing 12 of {selectedTank.samples.length} samples
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'overview', name: 'Overview', icon: BarChart3 },
          { id: 'tanks', name: 'LN₂ Tanks', icon: Snowflake },
          { id: 'transfers', name: 'Transfers', icon: Send },
          { id: 'alerts', name: 'Alerts', icon: Bell }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeView === tab.id 
                ? 'bg-white text-teal-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.name}</span>
            {tab.id === 'alerts' && alerts.filter(a => !a.resolved).length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {alerts.filter(a => !a.resolved).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeView === 'overview' && renderOverview()}
      {activeView === 'tanks' && renderTanks()}
      {activeView === 'transfers' && renderTransfers()}
      {activeView === 'alerts' && renderAlerts()}

      {/* Modals */}
      {selectedTank && renderTankSamples()}
    </div>
  );
}; 