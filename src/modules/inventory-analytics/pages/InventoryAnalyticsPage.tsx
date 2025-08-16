import React, { useState } from 'react';
import { BarChart3, TrendingUp, Brain, Zap, Target, Activity, PieChart, LineChart } from 'lucide-react';
import { AnalyticsDashboard } from '../../inventory/components/AnalyticsDashboard';

export const InventoryAnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const analyticsStats = {
    totalInsights: 24,
    predictionAccuracy: 87.3,
    costSavings: 15420.50,
    automatedDecisions: 156
  };

  const keyInsights = [
    {
      type: 'Predictive Alert',
      title: 'Culture Medium DMEM Stock Depletion Predicted',
      description: 'AI model predicts stock depletion in 12 days with 94% confidence',
      confidence: 94,
      impact: 'High',
      action: 'Automatic reorder triggered',
      date: '2025-01-02'
    },
    {
      type: 'Cost Optimization',
      title: 'Supplier Price Variance Detected',
      description: 'Life Technologies pricing 8.5% above market average for FSH products',
      confidence: 89,
      impact: 'Medium',
      action: 'Alternative suppliers suggested',
      date: '2025-01-01'
    },
    {
      type: 'Demand Forecast',
      title: 'Seasonal Pattern Identified',
      description: 'Liquid Nitrogen demand increases 23% during Q1 breeding season',
      confidence: 92,
      impact: 'Medium',
      action: 'Inventory planning adjusted',
      date: '2024-12-31'
    },
    {
      type: 'Quality Alert',
      title: 'Batch Quality Correlation Found',
      description: 'Temperature variations affecting batch quality scores in storage room RM-LAB-001',
      confidence: 88,
      impact: 'High',
      action: 'Environmental controls recommended',
      date: '2024-12-30'
    }
  ];

  const performanceMetrics = [
    { metric: 'Inventory Turnover', value: '8.2x', change: '+12.5%', trend: 'up' },
    { metric: 'Stock Accuracy', value: '98.7%', change: '+2.1%', trend: 'up' },
    { metric: 'Cost per Transaction', value: '$23.45', change: '-8.3%', trend: 'down' },
    { metric: 'Forecast Accuracy', value: '91.2%', change: '+5.7%', trend: 'up' },
    { metric: 'Waste Reduction', value: '15.4%', change: '+3.2%', trend: 'up' },
    { metric: 'Supplier Performance', value: '94.1%', change: '+1.8%', trend: 'up' }
  ];

  const tabs = [
    { id: 'overview', name: 'Analytics Overview', icon: BarChart3 },
    { id: 'dashboard', name: 'Full Analytics Dashboard', icon: Brain }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Inventory Analytics Hub</h1>
            <p className="text-purple-100 mt-1">AI-powered analytics and predictive insights</p>
          </div>
          <div className="flex space-x-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">PHASE 6</span>
            <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">AI ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">AI Insights</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsStats.totalInsights}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Target className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Prediction Accuracy</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsStats.predictionAccuracy}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Cost Savings</p>
              <p className="text-2xl font-bold text-gray-900">${analyticsStats.costSavings.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Auto Decisions</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsStats.automatedDecisions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics Grid */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-600">{metric.metric}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  metric.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {metric.change}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent AI Insights</h3>
        <div className="space-y-4">
          {keyInsights.map((insight, index) => (
            <div key={index} className="border border-gray-100 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    insight.type === 'Predictive Alert' ? 'bg-red-100 text-red-800' :
                    insight.type === 'Cost Optimization' ? 'bg-blue-100 text-blue-800' :
                    insight.type === 'Demand Forecast' ? 'bg-green-100 text-green-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {insight.type}
                  </span>
                  <span className="text-xs text-gray-500">{insight.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    insight.impact === 'High' ? 'bg-red-100 text-red-800' :
                    insight.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {insight.impact} Impact
                  </span>
                  <span className="text-xs text-gray-500">
                    {insight.confidence}% confidence
                  </span>
                </div>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-600 font-medium">Action: {insight.action}</span>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">Confidence:</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${insight.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Analytics Actions */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Analytics Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <PieChart className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Spending Analysis</p>
            <p className="text-sm text-gray-500">Category breakdowns</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <LineChart className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Trend Analysis</p>
            <p className="text-sm text-gray-500">Historical patterns</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Predictive Insights</p>
            <p className="text-sm text-gray-500">AI forecasting</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Activity className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <p className="font-medium text-gray-900">Performance Metrics</p>
            <p className="text-sm text-gray-500">KPI monitoring</p>
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
                    ? 'border-purple-500 text-purple-600'
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
      {activeTab === 'dashboard' && <AnalyticsDashboard />}
    </div>
  );
}; 