import React from 'react';
import { BarChart3, TrendingUp, Users, TestTube, Dna, Activity } from 'lucide-react';
import { ModuleTemplate } from './components/ui/ModuleTemplate';

export const AnalyticsDashboardPage: React.FC = () => {
  const features = [
    'Real-time performance metrics',
    'Breeding success rate analysis',
    'Laboratory efficiency tracking',
    'Genetic diversity monitoring',
    'Customer satisfaction insights',
    'Financial performance reports',
    'Predictive analytics',
    'Custom dashboard creation'
  ];

  const handleCreateReport = () => {
    console.log('Creating new report...');
  };

  const handleImportData = () => {
    console.log('Importing analytics data...');
  };

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Animals</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
              <p className="text-sm text-green-600">+12 this month</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">94.2%</p>
              <p className="text-sm text-green-600">+2.1% this month</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Lab Tests</p>
              <p className="text-2xl font-bold text-gray-900">3,456</p>
              <p className="text-sm text-blue-600">+156 this week</p>
            </div>
            <TestTube className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
              <p className="text-sm text-orange-600">+5 this week</p>
            </div>
            <Activity className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Breeding Success Trends</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">Chart will appear here</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Genetic Diversity</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Dna className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">Genetic analysis charts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ModuleTemplate
      title="Analytics Dashboard"
      description="Comprehensive analytics and reporting for biotechnology operations"
      icon={BarChart3}
      color="blue"
      badge="LIVE"
      features={features}
      actions={{
        primary: { label: 'Create Report', onClick: handleCreateReport },
        secondary: { label: 'Import Data', onClick: handleImportData }
      }}
    >
      <DashboardContent />
    </ModuleTemplate>
  );
}; 