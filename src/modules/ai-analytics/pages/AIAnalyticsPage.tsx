import React, { useState, useEffect } from 'react';
import {
  Brain,
  TrendingUp,
  Zap,
  Target,
  AlertTriangle,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Download,
  Upload,
  Award,
  Lightbulb
} from 'lucide-react';
import api from './services/api';

const AIAnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'models' | 'predictions' | 'insights' | 'research' | 'optimization'>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAIData();
  }, []);

  const loadAIData = async () => {
    try {
      setLoading(true);
      // Load AI analytics data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    } catch (error) {
      console.error('Error loading AI data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🧠 AI Analytics & Intelligence</h1>
            <p className="text-purple-100">
              <span className="bg-white/20 px-2 py-1 rounded text-sm font-medium mr-2">PHASE 5</span>
              AI-Powered Predictive Analytics & Machine Learning Insights
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">8</div>
              <div className="text-sm text-purple-100">Active Models</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">94.7%</div>
              <div className="text-sm text-purple-100">Avg. Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-sm text-purple-100">Predictions Today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'dashboard', label: 'AI Dashboard', icon: Brain },
          { key: 'models', label: 'Model Management', icon: Settings },
          { key: 'predictions', label: 'Real-time Predictions', icon: Zap },
          { key: 'insights', label: 'AI Insights', icon: Lightbulb },
          { key: 'research', label: 'Research Analytics', icon: BarChart3 },
          { key: 'optimization', label: 'Optimization', icon: Target }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === key
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && <AIDashboard />}
      {activeTab === 'models' && <ModelManagement />}
      {activeTab === 'predictions' && <RealTimePredictions />}
      {activeTab === 'insights' && <AIInsights />}
      {activeTab === 'research' && <ResearchAnalytics />}
      {activeTab === 'optimization' && <OptimizationView />}
    </div>
  );
};

// AI Dashboard Component
const AIDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* AI Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active AI Models</p>
              <p className="text-2xl font-bold text-purple-600">8</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Model Accuracy</p>
              <p className="text-2xl font-bold text-green-600">94.7%</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Predictions Today</p>
              <p className="text-2xl font-bold text-blue-600">1,247</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AI Insights Generated</p>
              <p className="text-2xl font-bold text-orange-600">23</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Model Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Top Performing Models</h3>
          <div className="space-y-4">
            {[
              { name: 'Pregnancy Predictor v2.1', accuracy: 96.8, type: 'Classification', status: 'Active' },
              { name: 'Embryo Quality Assessor', accuracy: 94.2, type: 'Regression', status: 'Active' },
              { name: 'Protocol Optimizer', accuracy: 92.5, type: 'Recommendation', status: 'Active' },
              { name: 'Risk Assessment Model', accuracy: 89.7, type: 'Classification', status: 'Training' }
            ].map((model, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{model.name}</div>
                  <div className="text-sm text-gray-600">{model.type}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-600">{model.accuracy}%</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    model.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {model.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Recent AI Insights</h3>
          <div className="space-y-4">
            {[
              {
                title: 'Optimal Transfer Timing Identified',
                description: 'AI detected 15% improvement in success rates for transfers at Day 7.2',
                impact: 'High',
                type: 'Optimization'
              },
              {
                title: 'Donor Selection Pattern',
                description: 'Age and body condition correlate strongly with oocyte quality',
                impact: 'Medium',
                type: 'Pattern Discovery'
              },
              {
                title: 'Seasonal Success Variation',
                description: 'Spring transfers show 8% higher success rates',
                impact: 'Medium',
                type: 'Trend Analysis'
              },
              {
                title: 'Protocol Efficiency Alert',
                description: 'Current FSH protocol may be suboptimal for Holstein breed',
                impact: 'High',
                type: 'Alert'
              }
            ].map((insight, index) => (
              <div key={index} className="p-3 border-l-4 border-purple-500 bg-purple-50 rounded-r-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{insight.title}</div>
                    <div className="text-sm text-gray-600 mt-1">{insight.description}</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {insight.type}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        insight.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {insight.impact} Impact
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Model Management Component
const ModelManagement: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'TRAINING' | 'DEPRECATED'>('ALL');

  const models = [
    {
      id: 'model-001',
      name: 'Pregnancy Predictor v2.1',
      type: 'Classification',
      algorithm: 'Random Forest',
      accuracy: 96.8,
      status: 'ACTIVE',
      lastTrained: '2025-01-15',
      usageCount: 2847
    },
    {
      id: 'model-002',
      name: 'Embryo Quality Assessor',
      type: 'Regression',
      algorithm: 'Neural Network',
      accuracy: 94.2,
      status: 'ACTIVE',
      lastTrained: '2025-01-12',
      usageCount: 1523
    },
    {
      id: 'model-003',
      name: 'Protocol Optimizer',
      type: 'Recommendation',
      algorithm: 'Gradient Boosting',
      accuracy: 92.5,
      status: 'ACTIVE',
      lastTrained: '2025-01-10',
      usageCount: 789
    },
    {
      id: 'model-004',
      name: 'Risk Assessment Model',
      type: 'Classification',
      algorithm: 'SVM',
      accuracy: 89.7,
      status: 'TRAINING',
      lastTrained: '2025-01-18',
      usageCount: 0
    }
  ];

  return (
    <div className="space-y-6">
      {/* Model Actions */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {['ALL', 'ACTIVE', 'TRAINING', 'DEPRECATED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Upload size={16} />
            <span>Import Model</span>
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
            <Brain size={16} />
            <span>Train New Model</span>
          </button>
        </div>
      </div>

      {/* Models Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Algorithm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {models.map((model) => (
                <tr key={model.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{model.name}</div>
                      <div className="text-sm text-gray-500">ID: {model.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{model.type}</div>
                      <div className="text-sm text-gray-500">{model.algorithm}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{model.accuracy}%</div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${model.accuracy}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      model.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      model.status === 'TRAINING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {model.status}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      Last trained: {model.lastTrained}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {model.usageCount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">predictions</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-purple-600 hover:text-purple-900">
                      <Settings size={16} />
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                      <Play size={16} />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Download size={16} />
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
};

// Real-time Predictions Component
const RealTimePredictions: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Live Prediction Stream</h3>
        <div className="text-center py-8 text-gray-500">
          <Zap className="h-12 w-12 mx-auto mb-4 text-purple-600" />
          <p>Real-time predictions will appear here</p>
          <p className="text-sm">Connect to live data streams to see AI predictions in action</p>
        </div>
      </div>
    </div>
  );
};

// AI Insights Component
const AIInsights: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">AI-Generated Insights</h3>
        <div className="text-center py-8 text-gray-500">
          <Lightbulb className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
          <p>AI insights and recommendations</p>
          <p className="text-sm">Automated pattern discovery and optimization suggestions</p>
        </div>
      </div>
    </div>
  );
};

// Research Analytics Component
const ResearchAnalytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Research-Grade Analytics</h3>
        <div className="text-center py-8 text-gray-500">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-blue-600" />
          <p>Advanced statistical analysis and research tools</p>
          <p className="text-sm">Publication-ready analytics and study design tools</p>
        </div>
      </div>
    </div>
  );
};

// Optimization View Component
const OptimizationView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">AI-Powered Optimization</h3>
        <div className="text-center py-8 text-gray-500">
          <Target className="h-12 w-12 mx-auto mb-4 text-green-600" />
          <p>Protocol and workflow optimization recommendations</p>
          <p className="text-sm">AI-driven suggestions for improving success rates and efficiency</p>
        </div>
      </div>
    </div>
  );
};

export default AIAnalyticsPage; 