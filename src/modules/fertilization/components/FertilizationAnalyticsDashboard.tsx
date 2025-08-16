import React, { useState, useEffect } from 'react';
import { 
  TestTube, 
  Microscope,
  Brain,
  TrendingUp, 
  Calendar, 
  Award,
  Target,
  Users,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  LineChart,
  BarChart3,
  FlaskConical,
  Zap
} from 'lucide-react';
import { fertilizationApi } from '../services/fertilizationApi';
import { FertilizationType } from '../../sample-management/types/sampleTypes';

interface FertilizationMetrics {
  fertilizationType: FertilizationType;
  totalSessions: number;
  averageSuccessRate: number;
  averageQualityScore: number;
  averageEmbryoCount: number;
  trending: 'up' | 'down' | 'stable';
}

interface DevelopmentStage {
  stage: string;
  day: number;
  successRate: number;
  averageGrade: number;
  cellCount: number;
}

interface TechnicianPerformance {
  technician: string;
  sessionsCompleted: number;
  averageSuccessRate: number;
  averageQuality: number;
  specializations: FertilizationType[];
  efficiency: number;
}

interface SessionTimeline {
  sessionId: string;
  fertilizationType: FertilizationType;
  status: string;
  startDate: string;
  currentDay: number;
  targetEmbryoCount: number;
  actualEmbryoCount: number;
  qualityDistribution: { grade: string; count: number }[];
}

interface FertilizationAnalyticsData {
  fertilizationMetrics: FertilizationMetrics[];
  developmentStages: DevelopmentStage[];
  technicianPerformance: TechnicianPerformance[];
  sessionTimeline: SessionTimeline[];
  realTimeUpdates: any[];
}

const FertilizationAnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<FertilizationAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('3_months');
  const [activeView, setActiveView] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchAnalyticsData, 45000); // Refresh every 45 seconds
      return () => clearInterval(interval);
    }
  }, [selectedTimeRange, autoRefresh]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fertilizationApi.getAnalytics(selectedTimeRange);
      setAnalyticsData(response || generateMockAnalyticsData());
    } catch (error) {
      console.error('Error fetching fertilization analytics:', error);
      setAnalyticsData(generateMockAnalyticsData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalyticsData = (): FertilizationAnalyticsData => ({
    fertilizationMetrics: [
      {
        fertilizationType: 'IVF',
        totalSessions: 89,
        averageSuccessRate: 73.2,
        averageQualityScore: 8.1,
        averageEmbryoCount: 12.4,
        trending: 'up'
      },
      {
        fertilizationType: 'ICSI',
        totalSessions: 67,
        averageSuccessRate: 81.5,
        averageQualityScore: 8.7,
        averageEmbryoCount: 14.2,
        trending: 'up'
      },
      {
        fertilizationType: 'SCNT',
        totalSessions: 23,
        averageSuccessRate: 41.3,
        averageQualityScore: 7.2,
        averageEmbryoCount: 6.8,
        trending: 'stable'
      }
    ],
    developmentStages: [
      { stage: 'Cleavage', day: 2, successRate: 87.5, averageGrade: 8.3, cellCount: 4 },
      { stage: 'Morula', day: 5, successRate: 74.2, averageGrade: 8.1, cellCount: 16 },
      { stage: 'Early Blastocyst', day: 6, successRate: 68.7, averageGrade: 7.9, cellCount: 64 },
      { stage: 'Expanded Blastocyst', day: 7, successRate: 58.3, averageGrade: 8.2, cellCount: 128 },
      { stage: 'Hatched Blastocyst', day: 8, successRate: 45.6, averageGrade: 8.5, cellCount: 200 }
    ],
    technicianPerformance: [
      {
        technician: 'Dr. Ahmed Hassan',
        sessionsCompleted: 45,
        averageSuccessRate: 82.1,
        averageQuality: 8.6,
        specializations: ['IVF', 'ICSI'],
        efficiency: 94
      },
      {
        technician: 'Dr. Fatima Al-Rashid',
        sessionsCompleted: 38,
        averageSuccessRate: 79.4,
        averageQuality: 8.3,
        specializations: ['ICSI', 'SCNT'],
        efficiency: 91
      },
      {
        technician: 'Dr. Omar Abdullah',
        sessionsCompleted: 52,
        averageSuccessRate: 75.8,
        averageQuality: 8.1,
        specializations: ['IVF'],
        efficiency: 88
      }
    ],
    sessionTimeline: [
      {
        sessionId: 'FS-2025-001',
        fertilizationType: 'IVF',
        status: 'Development Tracking',
        startDate: '2025-01-15',
        currentDay: 5,
        targetEmbryoCount: 15,
        actualEmbryoCount: 12,
        qualityDistribution: [
          { grade: 'A', count: 7 },
          { grade: 'B', count: 4 },
          { grade: 'C', count: 1 }
        ]
      },
      {
        sessionId: 'FS-2025-002',
        fertilizationType: 'ICSI',
        status: 'Embryos Generated',
        startDate: '2025-01-12',
        currentDay: 8,
        targetEmbryoCount: 18,
        actualEmbryoCount: 16,
        qualityDistribution: [
          { grade: 'A', count: 10 },
          { grade: 'B', count: 5 },
          { grade: 'C', count: 1 }
        ]
      },
      {
        sessionId: 'FS-2025-003',
        fertilizationType: 'SCNT',
        status: 'In Progress',
        startDate: '2025-01-18',
        currentDay: 2,
        targetEmbryoCount: 8,
        actualEmbryoCount: 6,
        qualityDistribution: [
          { grade: 'A', count: 3 },
          { grade: 'B', count: 2 },
          { grade: 'C', count: 1 }
        ]
      }
    ],
    realTimeUpdates: [
      { id: '1', type: 'success', message: 'FS-2025-001: Day 5 blastocyst formation detected (12/15 embryos)', timestamp: new Date(), priority: 'low' },
      { id: '2', type: 'warning', message: 'FS-2025-003: Slower development rate observed in 2 embryos', timestamp: new Date(), priority: 'medium' },
      { id: '3', type: 'info', message: 'New IVF session FS-2025-004 scheduled for tomorrow', timestamp: new Date(), priority: 'low' }
    ]
  });

  const getFertilizationTypeIcon = (type: FertilizationType) => {
    switch (type) {
      case 'IVF': return TestTube;
      case 'ICSI': return Microscope;
      case 'SCNT': return Brain;
      default: return FlaskConical;
    }
  };

  const getFertilizationTypeColor = (type: FertilizationType) => {
    switch (type) {
      case 'IVF': return 'blue';
      case 'ICSI': return 'green';
      case 'SCNT': return 'purple';
      default: return 'gray';
    }
  };

  const renderFertilizationMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {analyticsData?.fertilizationMetrics.map((metric) => {
        const Icon = getFertilizationTypeIcon(metric.fertilizationType);
        const color = getFertilizationTypeColor(metric.fertilizationType);
        
        return (
          <div key={metric.fertilizationType} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-${color}-100 rounded-lg`}>
                <Icon className={`h-6 w-6 text-${color}-600`} />
              </div>
              <div className="flex items-center space-x-1">
                {metric.trending === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : metric.trending === 'down' ? (
                  <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-gray-400" />
                )}
                <span className={`text-xs ${
                  metric.trending === 'up' ? 'text-green-600' :
                  metric.trending === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.trending}
                </span>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{metric.fertilizationType}</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Sessions</span>
                <span className="font-medium text-gray-900">{metric.totalSessions}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className={`font-medium ${
                  metric.averageSuccessRate >= 70 ? 'text-green-600' :
                  metric.averageSuccessRate >= 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {metric.averageSuccessRate}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Quality</span>
                <span className="font-medium text-blue-600">{metric.averageQualityScore}/10</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Embryos</span>
                <span className="font-medium text-purple-600">{metric.averageEmbryoCount}</span>
              </div>
            </div>
            
            {/* Progress bar for success rate */}
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    metric.averageSuccessRate >= 70 ? 'bg-green-500' :
                    metric.averageSuccessRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${metric.averageSuccessRate}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderDevelopmentStages = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <LineChart className="h-5 w-5 text-blue-600 mr-2" />
          Development Stage Analysis
        </h3>
        <button 
          onClick={fetchAnalyticsData}
          className="text-blue-600 hover:text-blue-800 p-1 rounded"
          title="Refresh Data"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <div className="space-y-6">
        {analyticsData?.developmentStages.map((stage, index) => (
          <div key={stage.stage} className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                  <span className="text-sm font-bold text-blue-700">D{stage.day}</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{stage.stage}</h4>
                  <p className="text-sm text-gray-600">{stage.cellCount} cells average</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{stage.successRate}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-semibold text-green-600">{stage.successRate}%</div>
                <div className="text-xs text-gray-600">Formation Rate</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-semibold text-blue-600">{stage.averageGrade}/10</div>
                <div className="text-xs text-gray-600">Avg Grade</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-semibold text-purple-600">{stage.cellCount}</div>
                <div className="text-xs text-gray-600">Cell Count</div>
              </div>
            </div>
            
            <div className="bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stage.successRate}%` }}
              />
            </div>
            
            {/* Connection line to next stage */}
            {index < analyticsData.developmentStages.length - 1 && (
              <div className="flex justify-center py-3">
                <div className="w-px h-6 bg-gray-300" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSessionTimeline = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Clock className="h-5 w-5 text-orange-600 mr-2" />
          Active Session Timeline
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Live tracking</span>
          <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
        </div>
      </div>
      
      <div className="space-y-4">
        {analyticsData?.sessionTimeline.map((session) => {
          const Icon = getFertilizationTypeIcon(session.fertilizationType);
          const color = getFertilizationTypeColor(session.fertilizationType);
          const progressPercentage = (session.actualEmbryoCount / session.targetEmbryoCount) * 100;
          
          return (
            <div key={session.sessionId} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-${color}-100 rounded-lg`}>
                    <Icon className={`h-4 w-4 text-${color}-600`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{session.sessionId}</h4>
                    <p className="text-sm text-gray-600">{session.fertilizationType} • Day {session.currentDay}</p>
                  </div>
                </div>
                
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  session.status === 'Embryos Generated' ? 'bg-green-100 text-green-800' :
                  session.status === 'Development Tracking' ? 'bg-blue-100 text-blue-800' :
                  session.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {session.status}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{session.actualEmbryoCount}/{session.targetEmbryoCount}</div>
                  <div className="text-xs text-gray-600">Embryos</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">{progressPercentage.toFixed(0)}%</div>
                  <div className="text-xs text-gray-600">Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">{session.qualityDistribution[0]?.count || 0}</div>
                  <div className="text-xs text-gray-600">Grade A</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Embryo Progress</span>
                  <span className="text-gray-900">{session.actualEmbryoCount}/{session.targetEmbryoCount}</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-${color}-500 transition-all duration-500`}
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
                
                {/* Quality distribution */}
                <div className="flex space-x-2 mt-3">
                  {session.qualityDistribution.map((quality) => (
                    <div key={quality.grade} className="flex-1 text-center p-2 bg-gray-50 rounded">
                      <div className="text-sm font-medium text-gray-900">{quality.count}</div>
                      <div className="text-xs text-gray-600">Grade {quality.grade}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTechnicianPerformance = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Users className="h-5 w-5 text-purple-600 mr-2" />
        Technician Performance
      </h3>
      
      <div className="space-y-4">
        {analyticsData?.technicianPerformance.map((technician, index) => (
          <div key={technician.technician} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{technician.technician}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  {technician.specializations.map((spec) => {
                    const Icon = getFertilizationTypeIcon(spec);
                    const color = getFertilizationTypeColor(spec);
                    return (
                      <div key={spec} className={`px-2 py-1 bg-${color}-100 rounded text-xs text-${color}-700 flex items-center space-x-1`}>
                        <Icon className="h-3 w-3" />
                        <span>{spec}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">{technician.averageSuccessRate}%</div>
                <div className="text-xs text-gray-500">Success Rate</div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-3 mb-3">
              <div className="text-center">
                <div className="text-sm font-semibold text-blue-600">{technician.sessionsCompleted}</div>
                <div className="text-xs text-gray-600">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-green-600">{technician.averageSuccessRate}%</div>
                <div className="text-xs text-gray-600">Success</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-purple-600">{technician.averageQuality}/10</div>
                <div className="text-xs text-gray-600">Quality</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-semibold text-orange-600">{technician.efficiency}%</div>
                <div className="text-xs text-gray-600">Efficiency</div>
              </div>
            </div>
            
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${technician.efficiency}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRealTimeUpdates = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Activity className="h-5 w-5 text-red-600 mr-2" />
          Real-Time Updates
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
        {analyticsData?.realTimeUpdates.map((update) => (
          <div key={update.id} className={`p-3 rounded-lg border-l-4 ${
            update.priority === 'high' ? 'bg-red-50 border-red-500' :
            update.priority === 'medium' ? 'bg-yellow-50 border-yellow-500' :
            'bg-blue-50 border-blue-500'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                {update.type === 'success' ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                 update.type === 'warning' ? <AlertTriangle className="h-4 w-4 text-yellow-600" /> :
                 <Clock className="h-4 w-4 text-blue-600" />}
                <span className="text-sm font-medium text-gray-900">{update.message}</span>
              </div>
              <span className="text-xs text-gray-500">
                {update.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderViewContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <div className="space-y-6">
            {renderFertilizationMetrics()}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {renderSessionTimeline()}
              {renderRealTimeUpdates()}
            </div>
          </div>
        );
      case 'development':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {renderDevelopmentStages()}
            {renderSessionTimeline()}
          </div>
        );
      case 'performance':
        return (
          <div className="space-y-6">
            {renderTechnicianPerformance()}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {renderFertilizationMetrics()}
              {renderRealTimeUpdates()}
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
        <span className="ml-2 text-gray-600">Loading fertilization analytics...</span>
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
              Fertilization Analytics Dashboard
            </h2>
            <p className="text-gray-600">Real-time fertilization session monitoring and development tracking</p>
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
        
        {/* View Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'development', label: 'Development Tracking', icon: TrendingUp },
            { id: 'performance', label: 'Performance Analysis', icon: Award }
          ].map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === view.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {view.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* View Content */}
      {renderViewContent()}
    </div>
  );
};

export default FertilizationAnalyticsDashboard; 