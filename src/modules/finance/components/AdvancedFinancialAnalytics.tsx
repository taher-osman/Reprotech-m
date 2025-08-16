import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  Building,
  Users,
  Shield,
  Download,
  RefreshCw
} from 'lucide-react';
import { 
  AdvancedFinancialMetrics,
  CostCenterBenchmarking,
  financialAnalyticsService 
} from '../services/financialAnalyticsService';

interface AdvancedFinancialAnalyticsProps {
  className?: string;
}

export const AdvancedFinancialAnalytics: React.FC<AdvancedFinancialAnalyticsProps> = ({
  className = ''
}) => {
  const [metrics, setMetrics] = useState<AdvancedFinancialMetrics | null>(null);
  const [benchmarking, setBenchmarking] = useState<CostCenterBenchmarking | null>(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState<any>(null);
  const [healthScore, setHealthScore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('2025-01');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [metricsRes, benchmarkingRes, realTimeRes, healthRes] = await Promise.all([
        financialAnalyticsService.getAdvancedFinancialMetrics(selectedPeriod),
        financialAnalyticsService.getCostCenterBenchmarking('1'),
        financialAnalyticsService.getRealTimeMetrics(),
        financialAnalyticsService.getFinancialHealthScore()
      ]);

      setMetrics(metricsRes);
      setBenchmarking(benchmarkingRes);
      setRealTimeMetrics(realTimeRes);
      setHealthScore(healthRes);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} SAR`;
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'trends', label: 'Trends & Forecasting', icon: TrendingUp },
    { id: 'modules', label: 'Module Analytics', icon: Building },
    { id: 'benchmarking', label: 'Benchmarking', icon: Target },
    { id: 'realtime', label: 'Real-time Metrics', icon: Activity }
  ];

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Loading advanced analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Performance Metrics Grid */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(metrics.performanceMetrics.totalRevenue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-3 flex items-center">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">
                +{metrics.performanceMetrics.revenueGrowthRate}% growth
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Net Profit</p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(metrics.performanceMetrics.netProfit)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-3 flex items-center">
              <span className="text-sm text-blue-600">
                {metrics.performanceMetrics.profitMargin}% margin
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Cost per Service</p>
                <p className="text-2xl font-bold text-purple-900">
                  {formatCurrency(metrics.performanceMetrics.costPerService)}
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-3 flex items-center">
              <span className="text-sm text-purple-600">
                ROA: {metrics.performanceMetrics.returnOnAssets}%
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Revenue per Employee</p>
                <p className="text-2xl font-bold text-orange-900">
                  {formatCurrency(metrics.performanceMetrics.revenuePerEmployee)}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-3 flex items-center">
              <span className="text-sm text-orange-600">
                Productivity: {metrics.advancedKPIs.staffProductivity}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Financial Health Score */}
      {healthScore && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-600" />
            Financial Health Score
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-2xl font-bold ${getHealthScoreColor(healthScore.overallScore)}`}>
                {healthScore.overallScore}
              </div>
              <p className="mt-2 text-sm text-gray-600">Overall Score</p>
              <p className="text-xs text-gray-500">{healthScore.trend} trend</p>
            </div>
            <div className="space-y-3">
              {Object.entries(healthScore.components).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Advanced KPIs */}
      {metrics && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-600" />
            Advanced KPIs
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(metrics.advancedKPIs.customerAcquisitionCost)}
              </p>
              <p className="text-sm text-gray-600">Customer Acquisition Cost</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(metrics.advancedKPIs.customerLifetimeValue)}
              </p>
              <p className="text-sm text-gray-600">Customer Lifetime Value</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {metrics.advancedKPIs.serviceUtilizationRate}%
              </p>
              <p className="text-sm text-gray-600">Service Utilization</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">
                {metrics.advancedKPIs.equipmentROI}%
              </p>
              <p className="text-sm text-gray-600">Equipment ROI</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
              Advanced Financial Analytics
            </h2>
            <p className="text-gray-600 mt-1">
              Comprehensive financial insights and performance analytics
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="2025-01">January 2025</option>
              <option value="2024-12">December 2024</option>
              <option value="2024-11">November 2024</option>
            </select>
            <button
              onClick={loadAnalyticsData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <TabIcon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'trends' && (
            <div className="text-center py-12">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Trends & Forecasting</h3>
              <p className="mt-1 text-sm text-gray-500">Advanced trend analysis and forecasting coming soon.</p>
            </div>
          )}
          {activeTab === 'modules' && (
            <div className="text-center py-12">
              <Building className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Module Analytics</h3>
              <p className="mt-1 text-sm text-gray-500">Cross-module performance analytics coming soon.</p>
            </div>
          )}
          {activeTab === 'benchmarking' && (
            <div className="text-center py-12">
              <Target className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Benchmarking</h3>
              <p className="mt-1 text-sm text-gray-500">Industry benchmarking and performance comparison coming soon.</p>
            </div>
          )}
          {activeTab === 'realtime' && (
            <div className="text-center py-12">
              <Activity className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Real-time Metrics</h3>
              <p className="mt-1 text-sm text-gray-500">Live performance monitoring coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedFinancialAnalytics;
