import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  Award,
  Target,
  Heart,
  Users,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  PieChart,
  LineChart,
  Eye
} from 'lucide-react';
import api from './services/api';

interface DevelopmentMetrics {
  day: number;
  cleavageRate: number;
  morulationRate: number;
  blastocystRate: number;
  qualityGradeA: number;
  qualityGradeB: number;
  qualityGradeC: number;
}

interface PregnancyOutcome {
  transferId: string;
  day: number;
  result: 'POSITIVE' | 'NEGATIVE' | 'PENDING';
  pregnancyRate: number;
  lossRate: number;
}

interface PerformanceMetrics {
  veterinarian: string;
  totalTransfers: number;
  successRate: number;
  averageQuality: number;
  specializationScore: number;
}

interface EnhancedAnalyticsData {
  developmentMetrics: DevelopmentMetrics[];
  pregnancyOutcomes: PregnancyOutcome[];
  performanceMetrics: PerformanceMetrics[];
  monthlyTrends: any[];
  qualityDistribution: any[];
  realTimeAlerts: any[];
}

const EnhancedAnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<EnhancedAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('3_months');
  const [activeTab, setActiveTab] = useState('development');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchAnalyticsData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [selectedTimeRange, autoRefresh]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/enhanced-embryo-transfer?timeRange=${selectedTimeRange}`);
      setAnalyticsData(response.data || generateMockData());
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setAnalyticsData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (): EnhancedAnalyticsData => ({
    developmentMetrics: [
      { day: 1, cleavageRate: 85, morulationRate: 0, blastocystRate: 0, qualityGradeA: 45, qualityGradeB: 35, qualityGradeC: 20 },
      { day: 3, cleavageRate: 92, morulationRate: 15, blastocystRate: 0, qualityGradeA: 48, qualityGradeB: 38, qualityGradeC: 14 },
      { day: 5, cleavageRate: 88, morulationRate: 65, blastocystRate: 25, qualityGradeA: 52, qualityGradeB: 31, qualityGradeC: 17 },
      { day: 7, cleavageRate: 84, morulationRate: 75, blastocystRate: 58, qualityGradeA: 55, qualityGradeB: 28, qualityGradeC: 17 },
      { day: 14, cleavageRate: 81, morulationRate: 78, blastocystRate: 72, qualityGradeA: 58, qualityGradeB: 25, qualityGradeC: 17 }
    ],
    pregnancyOutcomes: [
      { transferId: 'ET-001', day: 15, result: 'POSITIVE', pregnancyRate: 74.2, lossRate: 8.5 },
      { transferId: 'ET-002', day: 30, result: 'POSITIVE', pregnancyRate: 72.8, lossRate: 12.1 },
      { transferId: 'ET-003', day: 45, result: 'POSITIVE', pregnancyRate: 69.5, lossRate: 15.8 },
      { transferId: 'ET-004', day: 60, result: 'POSITIVE', pregnancyRate: 67.2, lossRate: 18.3 }
    ],
    performanceMetrics: [
      { veterinarian: 'Dr. Sarah Ahmed', totalTransfers: 245, successRate: 76.3, averageQuality: 8.4, specializationScore: 94 },
      { veterinarian: 'Dr. Ahmad Ali', totalTransfers: 189, successRate: 72.1, averageQuality: 7.9, specializationScore: 89 },
      { veterinarian: 'Dr. Fatima Hassan', totalTransfers: 167, successRate: 78.9, averageQuality: 8.7, specializationScore: 96 },
      { veterinarian: 'Dr. Omar Abdullah', totalTransfers: 134, successRate: 71.6, averageQuality: 7.8, specializationScore: 87 }
    ],
    monthlyTrends: [
      { month: 'Jan', transfers: 89, success: 68, quality: 8.2 },
      { month: 'Feb', transfers: 95, success: 71, quality: 8.4 },
      { month: 'Mar', transfers: 103, success: 78, quality: 8.6 },
      { month: 'Apr', transfers: 87, success: 65, quality: 8.1 },
      { month: 'May', transfers: 112, success: 84, quality: 8.8 }
    ],
    qualityDistribution: [
      { grade: 'A', count: 187, percentage: 54.2 },
      { grade: 'B', count: 108, percentage: 31.3 },
      { grade: 'C', count: 50, percentage: 14.5 }
    ],
    realTimeAlerts: [
      { id: '1', type: 'warning', message: '3 embryos showing delayed development', timestamp: new Date(), severity: 'medium' },
      { id: '2', type: 'success', message: 'Pregnancy confirmed: ET-2025-089', timestamp: new Date(), severity: 'low' },
      { id: '3', type: 'critical', message: 'Temperature deviation in incubator #3', timestamp: new Date(), severity: 'high' }
    ]
  });

  const renderDevelopmentChart = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <LineChart className="h-5 w-5 text-blue-600 mr-2" />
          Embryo Development Progression
        </h3>
        <button 
          onClick={fetchAnalyticsData}
          className="text-blue-600 hover:text-blue-800 p-1 rounded"
          title="Refresh Data"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="space-y-4">
        {/* Development Stage Bars */}
        {analyticsData?.developmentMetrics.map((metric, index) => (
          <div key={metric.day} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Day {metric.day}</span>
              <div className="flex space-x-4 text-xs text-gray-600">
                <span>Cleavage: {metric.cleavageRate}%</span>
                <span>Morulation: {metric.morulationRate}%</span>
                <span>Blastocyst: {metric.blastocystRate}%</span>
              </div>
            </div>
            
            {/* Progress Bars */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-16 text-xs text-gray-500">Cleavage</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${metric.cleavageRate}%` }}
                  />
                </div>
                <span className="w-10 text-xs text-gray-600">{metric.cleavageRate}%</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="w-16 text-xs text-gray-500">Morulation</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${metric.morulationRate}%` }}
                  />
                </div>
                <span className="w-10 text-xs text-gray-600">{metric.morulationRate}%</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="w-16 text-xs text-gray-500">Blastocyst</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${metric.blastocystRate}%` }}
                  />
                </div>
                <span className="w-10 text-xs text-gray-600">{metric.blastocystRate}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPregnancyChart = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Heart className="h-5 w-5 text-pink-600 mr-2" />
          Pregnancy Outcome Timeline
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Real-time updates</span>
          <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
        </div>
      </div>
      
      <div className="space-y-4">
        {analyticsData?.pregnancyOutcomes.map((outcome, index) => (
          <div key={outcome.transferId} className="relative">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-pink-100 rounded-full">
                  <span className="text-sm font-bold text-pink-700">D{outcome.day}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Day {outcome.day} Check</p>
                  <p className="text-sm text-gray-600">Transfer ID: {outcome.transferId}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    outcome.result === 'POSITIVE' ? 'bg-green-100 text-green-800' :
                    outcome.result === 'NEGATIVE' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {outcome.result}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Success: {outcome.pregnancyRate}% | Loss: {outcome.lossRate}%
                </div>
              </div>
            </div>
            
            {/* Connection line to next item */}
            {index < analyticsData.pregnancyOutcomes.length - 1 && (
              <div className="flex justify-center py-2">
                <div className="w-px h-4 bg-gray-300" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPerformanceMetrics = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Award className="h-5 w-5 text-yellow-600 mr-2" />
        Veterinarian Performance
      </h3>
      
      <div className="space-y-4">
        {analyticsData?.performanceMetrics.map((metric, index) => (
          <div key={metric.veterinarian} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{metric.veterinarian}</h4>
                <p className="text-sm text-gray-600">{metric.totalTransfers} total transfers</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-green-600">{metric.successRate}%</span>
                  <div className={`w-2 h-2 rounded-full ${
                    metric.successRate >= 75 ? 'bg-green-500' :
                    metric.successRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                </div>
                <p className="text-xs text-gray-500">Success Rate</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-blue-600">{metric.averageQuality}/10</p>
                <p className="text-xs text-gray-500">Avg Quality</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-purple-600">{metric.specializationScore}/100</p>
                <p className="text-xs text-gray-500">Specialization</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-indigo-600">#{index + 1}</p>
                <p className="text-xs text-gray-500">Ranking</p>
              </div>
            </div>
            
            {/* Performance bar */}
            <div className="mt-3">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    metric.successRate >= 75 ? 'bg-green-500' :
                    metric.successRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${metric.successRate}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRealTimeAlerts = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Activity className="h-5 w-5 text-red-600 mr-2" />
          Real-Time Alerts
        </h3>
        <button 
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`px-3 py-1 text-xs rounded-full ${
            autoRefresh ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {autoRefresh ? 'Live' : 'Paused'}
        </button>
      </div>
      
      <div className="space-y-3">
        {analyticsData?.realTimeAlerts.map((alert) => (
          <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
            alert.severity === 'high' ? 'bg-red-50 border-red-500' :
            alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
            'bg-green-50 border-green-500'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                {alert.type === 'critical' ? <AlertTriangle className="h-4 w-4 text-red-600" /> :
                 alert.type === 'warning' ? <Clock className="h-4 w-4 text-yellow-600" /> :
                 <CheckCircle className="h-4 w-4 text-green-600" />}
                <span className="text-sm font-medium text-gray-900">{alert.message}</span>
              </div>
              <span className="text-xs text-gray-500">
                {alert.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'development':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderDevelopmentChart()}
            {renderRealTimeAlerts()}
          </div>
        );
      case 'pregnancy':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderPregnancyChart()}
            {renderPerformanceMetrics()}
          </div>
        );
      case 'performance':
        return (
          <div className="space-y-6">
            {renderPerformanceMetrics()}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {renderDevelopmentChart()}
              {renderRealTimeAlerts()}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading analytics data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
              Enhanced Analytics Dashboard
            </h2>
            <p className="text-gray-600">Real-time embryo development and pregnancy outcome analysis</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="1_month">Last Month</option>
              <option value="3_months">Last 3 Months</option>
              <option value="6_months">Last 6 Months</option>
              <option value="1_year">Last Year</option>
            </select>
            
            <button
              onClick={fetchAnalyticsData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'development', label: 'Development Metrics', icon: TrendingUp },
            { id: 'pregnancy', label: 'Pregnancy Outcomes', icon: Heart },
            { id: 'performance', label: 'Performance Analysis', icon: Award }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default EnhancedAnalyticsDashboard; 