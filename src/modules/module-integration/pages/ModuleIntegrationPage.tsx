import React, { useState } from 'react';
import { Workflow, Settings, CheckCircle, AlertCircle, Package, DollarSign, TrendingUp, Users } from 'lucide-react';
import { ProcedureKitManager } from '../../inventory/components/ProcedureKitManager';

export const ModuleIntegrationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const integrationStats = {
    connectedModules: 6,
    totalProcedures: 47,
    totalCost: 2847.25,
    autoDeductions: 89
  };

  const moduleStatus = [
    { module: 'IVF Laboratory', status: 'Connected', lastSync: '2 min ago', procedures: 12 },
    { module: 'Embryo Transfer', status: 'Connected', lastSync: '5 min ago', procedures: 8 },
    { module: 'OPU (Ovum Pick-up)', status: 'Connected', lastSync: '1 min ago', procedures: 15 },
    { module: 'Ultrasound', status: 'Pending', lastSync: '1 hour ago', procedures: 6 },
    { module: 'Breeding Program', status: 'Connected', lastSync: '3 min ago', procedures: 4 },
    { module: 'Clinical Management', status: 'Connected', lastSync: '7 min ago', procedures: 2 }
  ];

  const tabs = [
    { id: 'overview', name: 'Integration Overview', icon: Workflow },
    { id: 'kit-manager', name: 'Procedure Kit Manager', icon: Package }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Module Integration Hub</h1>
            <p className="text-blue-100 mt-1">Cross-module integration and procedure kit management</p>
          </div>
          <div className="flex space-x-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">PHASE 3</span>
            <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Settings className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Connected Modules</p>
              <p className="text-2xl font-bold text-gray-900">{integrationStats.connectedModules}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Procedures</p>
              <p className="text-2xl font-bold text-gray-900">{integrationStats.totalProcedures}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Cost Tracked</p>
              <p className="text-2xl font-bold text-gray-900">${integrationStats.totalCost}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Auto Deductions</p>
              <p className="text-2xl font-bold text-gray-900">{integrationStats.autoDeductions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Module Status */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Module Integration Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {moduleStatus.map((module, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{module.module}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  module.status === 'Connected' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {module.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-1">Last sync: {module.lastSync}</p>
              <p className="text-sm text-gray-600">{module.procedures} procedures configured</p>
            </div>
          ))}
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
                    ? 'border-blue-500 text-blue-600'
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
      {activeTab === 'kit-manager' && <ProcedureKitManager />}
    </div>
  );
}; 