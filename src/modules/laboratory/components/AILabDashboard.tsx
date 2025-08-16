import React, { useState, useEffect } from 'react';
import {
  Activity,
  BarChart3,
  Brain,
  TrendingUp,
  Zap,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FlaskConical,
  TestTube,
  Thermometer,
  Database,
  Cpu,
  Gauge
} from 'lucide-react';

interface AILabDashboardProps {
  onRefresh: () => void;
}

interface AIInsight {
  id: string;
  type: 'prediction' | 'optimization' | 'anomaly' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'dismissed' | 'implemented';
  createdAt: Date;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  change: number;
  target: number;
  status: 'good' | 'warning' | 'critical';
}

const AILabDashboard: React.FC<AILabDashboardProps> = ({ onRefresh }) => {
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [realTimeStats, setRealTimeStats] = useState({
    activeSamples: 0,
    runningTests: 0,
    completedToday: 0,
    queueLength: 0,
    systemLoad: 0,
    efficiency: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAIData();
    const interval = setInterval(fetchAIData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAIData = async () => {
    try {
      setLoading(true);
      
      // Simulate API calls for AI insights
      const insights = generateMockInsights();
      setAiInsights(insights);
      
      const metrics = generateMockMetrics();
      setPerformanceMetrics(metrics);
      
      const stats = generateMockStats();
      setRealTimeStats(stats);
      
    } catch (error) {
      console.error('Error fetching AI dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockInsights = (): AIInsight[] => [
    {
      id: 'ai-001',
      type: 'prediction',
      title: 'Sample Processing Bottleneck Detected',
      description: 'AI predicts a 23% increase in processing time for blood samples in the next 2 hours based on current queue patterns.',
      confidence: 87,
      priority: 'high',
      status: 'active',
      createdAt: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
      id: 'ai-002',
      type: 'optimization',
      title: 'Equipment Utilization Optimization',
      description: 'Recommend redistributing PCR tests to machines #2 and #4 to achieve 15% faster completion times.',
      confidence: 92,
      priority: 'medium',
      status: 'active',
      createdAt: new Date(Date.now() - 45 * 60 * 1000)
    },
    {
      id: 'ai-003',
      type: 'anomaly',
      title: 'Unusual Temperature Pattern',
      description: 'Incubator #3 shows temperature fluctuations outside normal parameters. Maintenance recommended.',
      confidence: 94,
      priority: 'high',
      status: 'active',
      createdAt: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: 'ai-004',
      type: 'recommendation',
      title: 'Quality Control Enhancement',
      description: 'AI suggests implementing additional QC checks for genetic samples to improve accuracy by 8%.',
      confidence: 78,
      priority: 'low',
      status: 'active',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  ];

  const generateMockMetrics = (): PerformanceMetric[] => [
    {
      name: 'Throughput Rate',
      value: 142,
      unit: 'samples/hour',
      change: 8.3,
      target: 150,
      status: 'good'
    },
    {
      name: 'Accuracy Rate',
      value: 98.7,
      unit: '%',
      change: 0.2,
      target: 99,
      status: 'good'
    },
    {
      name: 'Queue Time',
      value: 23,
      unit: 'minutes',
      change: -12.5,
      target: 20,
      status: 'warning'
    },
    {
      name: 'Equipment Uptime',
      value: 94.2,
      unit: '%',
      change: -2.1,
      target: 95,
      status: 'warning'
    },
    {
      name: 'Cost per Test',
      value: 34.50,
      unit: 'SAR',
      change: -5.8,
      target: 32,
      status: 'good'
    },
    {
      name: 'Error Rate',
      value: 0.8,
      unit: '%',
      change: -0.3,
      target: 1,
      status: 'good'
    }
  ];

  const generateMockStats = () => ({
    activeSamples: 127,
    runningTests: 23,
    completedToday: 89,
    queueLength: 45,
    systemLoad: 73,
    efficiency: 87
  });

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction': return Brain;
      case 'optimization': return TrendingUp;
      case 'anomaly': return AlertTriangle;
      case 'recommendation': return Target;
      default: return Brain;
    }
  };

  const getInsightColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'low': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getMetricStatus = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Samples</p>
              <p className="text-2xl font-bold text-blue-600">{realTimeStats.activeSamples}</p>
            </div>
            <TestTube className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Running Tests</p>
              <p className="text-2xl font-bold text-green-600">{realTimeStats.runningTests}</p>
            </div>
            <FlaskConical className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-purple-600">{realTimeStats.completedToday}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Queue Length</p>
              <p className="text-2xl font-bold text-orange-600">{realTimeStats.queueLength}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">System Load</p>
              <p className="text-2xl font-bold text-red-600">{realTimeStats.systemLoad}%</p>
            </div>
            <Cpu className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Efficiency</p>
              <p className="text-2xl font-bold text-indigo-600">{realTimeStats.efficiency}%</p>
            </div>
            <Gauge className="h-8 w-8 text-indigo-500" />
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">🧠 AI Insights & Recommendations</h3>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">Live</span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {aiInsights.map((insight) => {
              const Icon = getInsightIcon(insight.type);
              return (
                <div
                  key={insight.id}
                  className={`p-4 rounded-lg border-2 ${getInsightColor(insight.priority)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium uppercase">{insight.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-white bg-opacity-80 px-2 py-1 rounded">
                        {insight.confidence}% confidence
                      </span>
                      <span className={`text-xs px-2 py-1 rounded uppercase font-medium ${
                        insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                        insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {insight.priority}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{insight.title}</h4>
                  <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {insight.createdAt.toLocaleTimeString()}
                    </span>
                    <div className="flex space-x-2">
                      <button className="text-xs bg-white bg-opacity-80 px-3 py-1 rounded hover:bg-opacity-100 transition-colors">
                        Implement
                      </button>
                      <button className="text-xs bg-white bg-opacity-80 px-3 py-1 rounded hover:bg-opacity-100 transition-colors">
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">📊 Performance Metrics</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{metric.name}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMetricStatus(metric.status)}`}>
                    {metric.status}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                    <span className="text-sm text-gray-600 ml-1">{metric.unit}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      metric.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </div>
                    <div className="text-xs text-gray-500">vs target: {metric.target}{metric.unit}</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      metric.status === 'good' ? 'bg-green-500' :
                      metric.status === 'warning' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">⚡ AI-Powered Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 text-left border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group">
              <Brain className="h-8 w-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium text-gray-900 mb-1">Auto-Optimize Workflows</h4>
              <p className="text-sm text-gray-600">Let AI reorganize your current queue for maximum efficiency</p>
            </button>
            
            <button className="p-4 text-left border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group">
              <TrendingUp className="h-8 w-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium text-gray-900 mb-1">Predict Bottlenecks</h4>
              <p className="text-sm text-gray-600">AI analysis of upcoming processing delays</p>
            </button>
            
            <button className="p-4 text-left border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group">
              <Target className="h-8 w-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium text-gray-900 mb-1">Quality Forecasting</h4>
              <p className="text-sm text-gray-600">Predict and prevent quality issues before they occur</p>
            </button>
            
            <button className="p-4 text-left border-2 border-dashed border-orange-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors group">
              <Zap className="h-8 w-8 text-orange-600 mb-3 group-hover:scale-110 transition-transform" />
              <h4 className="font-medium text-gray-900 mb-1">Emergency Protocol</h4>
              <p className="text-sm text-gray-600">AI-assisted emergency response and resource allocation</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILabDashboard; 