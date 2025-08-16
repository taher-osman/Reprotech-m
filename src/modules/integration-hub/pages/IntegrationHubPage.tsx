import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  GitBranch,
  Heart,
  LineChart,
  Monitor,
  Settings,
  Target,
  TrendingUp,
  Users,
  Workflow,
  Zap
} from 'lucide-react';
import api from './services/api';
import {
  WorkflowSession,
  CrossModuleAnalytics,
  IntegrationDashboard,
  ResourceManagement,
  QualityControlMetrics
} from '../types/hubTypes';

const IntegrationHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workflows' | 'analytics' | 'resources' | 'quality'>('dashboard');
  const [dashboardData, setDashboardData] = useState<IntegrationDashboard | null>(null);
  const [workflowSessions, setWorkflowSessions] = useState<WorkflowSession[]>([]);
  const [analytics, setAnalytics] = useState<CrossModuleAnalytics | null>(null);
  const [resources, setResources] = useState<ResourceManagement | null>(null);
  const [qualityMetrics, setQualityMetrics] = useState<QualityControlMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    loadHubData();
  }, []);

  const loadHubData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, workflowRes, analyticsRes, resourcesRes, qualityRes] = await Promise.all([
        api.getIntegrationDashboard(),
        api.getWorkflowSessions(),
        api.getCrossModuleAnalytics(),
        api.getResourceManagement(),
        api.getQualityControlMetrics()
      ]);
      
      setDashboardData(dashboardRes.data);
      setWorkflowSessions(workflowRes.data);
      setAnalytics(analyticsRes.data);
      setResources(resourcesRes.data);
      setQualityMetrics(qualityRes.data);
    } catch (error) {
      console.error('Error loading hub data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🔗 Integration Hub</h1>
            <p className="text-blue-100">
              <span className="bg-white/20 px-2 py-1 rounded text-sm font-medium mr-2">PHASE 4</span>
              Unified Workflow Management & Cross-Module Analytics
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{dashboardData?.activeWorkflows || 0}</div>
              <div className="text-sm text-blue-100">Active Workflows</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{dashboardData?.overallSuccessRate || 0}%</div>
              <div className="text-sm text-blue-100">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{dashboardData?.pregnanciesThisMonth || 0}</div>
              <div className="text-sm text-blue-100">Pregnancies This Month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'dashboard', label: 'Unified Dashboard', icon: Activity },
          { key: 'workflows', label: 'Workflow Management', icon: Workflow },
          { key: 'analytics', label: 'Cross-Module Analytics', icon: BarChart3 },
          { key: 'resources', label: 'Resource Management', icon: Settings },
          { key: 'quality', label: 'Quality Control', icon: Target }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <UnifiedDashboard 
          data={dashboardData} 
          onRefresh={loadHubData} 
        />
      )}

      {activeTab === 'workflows' && (
        <WorkflowManagement 
          sessions={workflowSessions} 
          onUpdate={loadHubData} 
        />
      )}

      {activeTab === 'analytics' && (
        <CrossModuleAnalyticsView 
          analytics={analytics} 
        />
      )}

      {activeTab === 'resources' && (
        <ResourceManagementView 
          resources={resources} 
          onUpdate={loadHubData} 
        />
      )}

      {activeTab === 'quality' && (
        <QualityControlView 
          metrics={qualityMetrics} 
        />
      )}
    </div>
  );
};

// Unified Dashboard Component
const UnifiedDashboard: React.FC<{
  data: IntegrationDashboard | null;
  onRefresh: () => void;
}> = ({ data, onRefresh }) => {
  if (!data) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* Real-time Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Workflows</p>
              <p className="text-2xl font-bold text-blue-600">{data.activeWorkflows}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Workflow className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Transfers</p>
              <p className="text-2xl font-bold text-orange-600">{data.pendingTransfers}</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pregnancies This Month</p>
              <p className="text-2xl font-bold text-green-600">{data.pregnanciesThisMonth}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Activities</p>
              <p className="text-2xl font-bold text-purple-600">{data.todaysActivities}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Overall Success Rate</span>
                <span className="text-sm font-medium">{data.overallSuccessRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${data.overallSuccessRate}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Monthly Target Progress</span>
                <span className="text-sm font-medium">{data.monthlyTargetProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${data.monthlyTargetProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {data.qualityMetrics.oocyteQuality}%
                </div>
                <div className="text-xs text-gray-600">Oocyte Quality</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {data.qualityMetrics.embryoQuality}%
                </div>
                <div className="text-xs text-gray-600">Embryo Quality</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {data.qualityMetrics.transferSuccess}%
                </div>
                <div className="text-xs text-gray-600">Transfer Success</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Critical Alerts</h3>
          <div className="space-y-3">
            {data.criticalAlerts.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>No critical alerts</p>
              </div>
            ) : (
              data.criticalAlerts.map((alert, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  alert.priority === 'HIGH' ? 'bg-red-50 border-red-500' :
                  alert.priority === 'MEDIUM' ? 'bg-yellow-50 border-yellow-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                      alert.priority === 'HIGH' ? 'text-red-500' :
                      alert.priority === 'MEDIUM' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{alert.message}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Activities and Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {data.recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`h-2 w-2 rounded-full ${
                  activity.status === 'SUCCESS' ? 'bg-green-500' :
                  activity.status === 'WARNING' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.description}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {data.upcomingEvents.map((event, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{event.title}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(event.scheduledDate).toLocaleDateString()} • {event.participants.join(', ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Workflow Management Component
const WorkflowManagement: React.FC<{
  sessions: WorkflowSession[];
  onUpdate: () => void;
}> = ({ sessions, onUpdate }) => {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'FAILED'>('ALL');

  const filteredSessions = sessions.filter(session => 
    filter === 'ALL' || session.overallStatus === filter
  );

  return (
    <div className="space-y-6">
      {/* Workflow Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { status: 'ACTIVE', count: sessions.filter(s => s.overallStatus === 'ACTIVE').length, color: 'blue' },
          { status: 'COMPLETED', count: sessions.filter(s => s.overallStatus === 'COMPLETED').length, color: 'green' },
          { status: 'PAUSED', count: sessions.filter(s => s.overallStatus === 'PAUSED').length, color: 'yellow' },
          { status: 'FAILED', count: sessions.filter(s => s.overallStatus === 'FAILED').length, color: 'red' }
        ].map(({ status, count, color }) => (
          <div key={status} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="text-center">
              <div className={`text-2xl font-bold text-${color}-600`}>{count}</div>
              <div className="text-sm text-gray-600">{status} Workflows</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Actions */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {['ALL', 'ACTIVE', 'COMPLETED', 'FAILED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
        
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + New Workflow
        </button>
      </div>

      {/* Workflow Sessions Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Workflow
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor/Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Phase
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Success Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {session.sessionId}
                      </div>
                      <div className="text-sm text-gray-500">
                        {session.workflowType.replace('_', ' ')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {session.donorInfo.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {session.recipientInfo.length} recipients
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {session.currentPhase.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(session.milestones.length / 6) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {Math.round((session.milestones.length / 6) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {session.metrics.overallSuccessRate}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      session.overallStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      session.overallStatus === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                      session.overallStatus === 'PAUSED' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {session.overallStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      View
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      Edit
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

// Cross-Module Analytics Component
const CrossModuleAnalyticsView: React.FC<{
  analytics: CrossModuleAnalytics | null;
}> = ({ analytics }) => {
  if (!analytics) return <div>Loading analytics...</div>;

  return (
    <div className="space-y-6">
      {/* Module Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-purple-600" />
            OPU Performance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Sessions</span>
              <span className="font-medium">{analytics.modulePerformance.opu.totalSessions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Success Rate</span>
              <span className="font-medium">{analytics.modulePerformance.opu.successRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg. Oocytes</span>
              <span className="font-medium">{analytics.modulePerformance.opu.averageOocytes}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <GitBranch className="h-5 w-5 mr-2 text-blue-600" />
            Embryo Development
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Embryos</span>
              <span className="font-medium">{analytics.modulePerformance.embryoDetail.totalEmbryos}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Development Rate</span>
              <span className="font-medium">{analytics.modulePerformance.embryoDetail.developmentRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transfer Rate</span>
              <span className="font-medium">{analytics.modulePerformance.embryoDetail.transferRate}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-green-600" />
            Transfer Success
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Transfers</span>
              <span className="font-medium">{analytics.modulePerformance.embryoTransfer.totalTransfers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pregnancy Rate</span>
              <span className="font-medium">{analytics.modulePerformance.embryoTransfer.pregnancyRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Live Birth Rate</span>
              <span className="font-medium">{analytics.modulePerformance.embryoTransfer.livebirthRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-green-600" />
          Financial Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              ${analytics.financialMetrics.totalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              ${analytics.financialMetrics.totalCosts.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Costs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {analytics.financialMetrics.profitMargin}%
            </div>
            <div className="text-sm text-gray-600">Profit Margin</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              ${analytics.financialMetrics.costPerPregnancy.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Cost per Pregnancy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {analytics.financialMetrics.roi}%
            </div>
            <div className="text-sm text-gray-600">ROI</div>
          </div>
        </div>
      </div>

      {/* Quality Trends Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
          Quality Trends (Last 6 Months)
        </h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {analytics.qualityTrends.oocyteQuality.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-purple-500 rounded-t"
                style={{ height: `${(data.score / 100) * 200}px` }}
              ></div>
              <div className="text-xs text-gray-600 mt-2">{data.month}</div>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Oocyte Quality</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Embryo Quality</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            <span className="text-sm text-gray-600">Transfer Success</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Resource Management Component
const ResourceManagementView: React.FC<{
  resources: ResourceManagement | null;
  onUpdate: () => void;
}> = ({ resources, onUpdate }) => {
  if (!resources) return <div>Loading resources...</div>;

  return (
    <div className="space-y-6">
      {/* Equipment Status */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Monitor className="h-5 w-5 mr-2 text-blue-600" />
          Equipment Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.equipment.map((equipment) => (
            <div key={equipment.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{equipment.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  equipment.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                  equipment.status === 'IN_USE' ? 'bg-blue-100 text-blue-800' :
                  equipment.status === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {equipment.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{equipment.type}</p>
              <div className="flex justify-between text-sm">
                <span>Utilization: {equipment.utilizationRate}%</span>
                <span>Next Maintenance: {new Date(equipment.nextMaintenance).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Availability */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2 text-green-600" />
          Team Availability
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.team.map((member) => (
            <div key={member.id} className="border rounded-lg p-4">
              <h4 className="font-medium mb-1">{member.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{member.role}</p>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Workload</span>
                  <span>{member.workload}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      member.workload < 70 ? 'bg-green-500' :
                      member.workload < 90 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${member.workload}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {member.currentAssignments.length} active assignments
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Quality Control Component
const QualityControlView: React.FC<{
  metrics: QualityControlMetrics | null;
}> = ({ metrics }) => {
  if (!metrics) return <div>Loading quality metrics...</div>;

  return (
    <div className="space-y-6">
      {/* Module Quality Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">OPU Quality</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Recovery Rate</span>
                <span className="text-sm font-medium">{metrics.moduleQuality.opu.oocyteRecoveryRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${metrics.moduleQuality.opu.oocyteRecoveryRate}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Grade A %</span>
                <span className="text-sm font-medium">{metrics.moduleQuality.opu.gradeAPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${metrics.moduleQuality.opu.gradeAPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Embryo Culture Quality</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Development Rate</span>
                <span className="text-sm font-medium">{metrics.moduleQuality.embryoCulture.developmentRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${metrics.moduleQuality.embryoCulture.developmentRate}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Blastocyst Rate</span>
                <span className="text-sm font-medium">{metrics.moduleQuality.embryoCulture.blastocystRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${metrics.moduleQuality.embryoCulture.blastocystRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Transfer Quality</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Transfer Efficiency</span>
                <span className="text-sm font-medium">{metrics.moduleQuality.transfer.transferEfficiency}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${metrics.moduleQuality.transfer.transferEfficiency}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Pregnancy Rate</span>
                <span className="text-sm font-medium">{metrics.moduleQuality.transfer.pregnancyRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${metrics.moduleQuality.transfer.pregnancyRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Quality Overview */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Overall Workflow Quality</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {metrics.workflowQuality.dataIntegrity}%
            </div>
            <div className="text-sm text-gray-600">Data Integrity</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {metrics.workflowQuality.processConsistency}%
            </div>
            <div className="text-sm text-gray-600">Process Consistency</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {metrics.workflowQuality.outcomeReproducibility}%
            </div>
            <div className="text-sm text-gray-600">Outcome Reproducibility</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {metrics.workflowQuality.standardCompliance}%
            </div>
            <div className="text-sm text-gray-600">Standard Compliance</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationHubPage; 