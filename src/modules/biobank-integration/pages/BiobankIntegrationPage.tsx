import React, { useState } from 'react';
import { Thermometer, FlaskConical, Activity, AlertTriangle, Gauge, Snowflake } from 'lucide-react';
import { BiobankIntegration } from '../../inventory/components/BiobankIntegration';

export const BiobankIntegrationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const biobankStats = {
    totalTanks: 4,
    totalSamples: 545,
    averageTemperature: -195.2,
    criticalAlerts: 1
  };

  const tankStatus = [
    { 
      id: 'LN2-001', 
      name: 'Tank Alpha',
      status: 'Operational', 
      temperature: -196.0,
      samples: 156,
      capacity: 200,
      lastMaintenance: '2025-01-01'
    },
    { 
      id: 'LN2-002', 
      name: 'Tank Beta',
      status: 'Operational', 
      temperature: -195.8,
      samples: 143,
      capacity: 200,
      lastMaintenance: '2024-12-28'
    },
    { 
      id: 'LN2-003', 
      name: 'Tank Gamma',
      status: 'Low Level', 
      temperature: -194.5,
      samples: 134,
      capacity: 200,
      lastMaintenance: '2024-12-25'
    },
    { 
      id: 'LN2-004', 
      name: 'Tank Delta',
      status: 'Critical', 
      temperature: -193.2,
      samples: 112,
      capacity: 200,
      lastMaintenance: '2024-12-20'
    }
  ];

  const tabs = [
    { id: 'overview', name: 'Biobank Overview', icon: FlaskConical },
    { id: 'integration', name: 'Full Integration Hub', icon: Activity }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-teal-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Biobank Integration Hub</h1>
            <p className="text-cyan-100 mt-1">LN₂ tank management and biological sample tracking</p>
          </div>
          <div className="flex space-x-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">PHASE 4</span>
            <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Thermometer className="h-8 w-8 text-cyan-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">LN₂ Tanks</p>
              <p className="text-2xl font-bold text-gray-900">{biobankStats.totalTanks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <FlaskConical className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Samples</p>
              <p className="text-2xl font-bold text-gray-900">{biobankStats.totalSamples}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Snowflake className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Avg Temperature</p>
              <p className="text-2xl font-bold text-gray-900">{biobankStats.averageTemperature}°C</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Critical Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{biobankStats.criticalAlerts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tank Status Grid */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">LN₂ Tank Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tankStatus.map((tank, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{tank.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tank.status === 'Operational' 
                    ? 'bg-green-100 text-green-800' 
                    : tank.status === 'Low Level'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {tank.status}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">ID:</span> {tank.id}</p>
                <p><span className="font-medium">Temperature:</span> {tank.temperature}°C</p>
                <p><span className="font-medium">Samples:</span> {tank.samples}/{tank.capacity}</p>
                <p><span className="font-medium">Last Maintenance:</span> {tank.lastMaintenance}</p>
              </div>
              
              {/* Capacity Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Capacity</span>
                  <span>{Math.round((tank.samples / tank.capacity) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      tank.samples / tank.capacity > 0.8 
                        ? 'bg-red-500' 
                        : tank.samples / tank.capacity > 0.6
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${(tank.samples / tank.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Thermometer className="h-8 w-8 text-cyan-500 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Temperature Monitoring</p>
            <p className="text-sm text-gray-500">Real-time tank monitoring</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <FlaskConical className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Sample Transfer</p>
            <p className="text-sm text-gray-500">Move samples to biobank</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Activity className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Maintenance Schedule</p>
            <p className="text-sm text-gray-500">Plan tank maintenance</p>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'integration' && <BiobankIntegration />}
    </div>
  );
}; 