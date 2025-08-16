import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Info,
  Calculator,
  PieChart,
  LineChart,
  Activity,
  Users,
  Settings,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  Plus,
  Zap,
  Award,
  AlertCircle,
  Star,
  Calendar,
  Building2,
  TestTube,
  Stethoscope,
  Microscope,
  Database,
  Layers
} from 'lucide-react';
import {
  ServiceAnalysis as ServiceAnalysisType,
  ServiceConfiguration,
  ServiceCostBreakdown,
  ServicePerformanceMetric,
  ServiceEstimate,
  ServiceEstimateItem,
  ServicePerformanceEstimate,
  RevenueAnalysis,
  CostAnalysis,
  PerformanceAnalysis,
  ProfitabilityAnalysis,
  AnalysisType,
  ServiceCategory,
  ModuleSource,
  PerformanceStatus,
  RiskLevel,
  TargetType,
  MeasurementFrequency
} from '../types';

interface ServiceAnalysisProps {
  serviceId?: string;
  onAnalysisComplete?: (analysis: ServiceAnalysisType) => void;
  onExportRequest?: (analysis: ServiceAnalysisType) => void;
}

const ServiceAnalysis: React.FC<ServiceAnalysisProps> = ({
  serviceId,
  onAnalysisComplete,
  onExportRequest
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedService, setSelectedService] = useState<ServiceConfiguration | null>(null);
  const [analysisData, setAnalysisData] = useState<ServiceAnalysisType | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [comparisonMode, setComparisonMode] = useState(false);

  // Mock analysis data
  useEffect(() => {
    if (serviceId) {
      loadAnalysisData();
    }
  }, [serviceId, timeRange]);

  const loadAnalysisData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockAnalysis: ServiceAnalysisType = {
        id: '1',
        serviceId: serviceId || '1',
        analysisType: AnalysisType.COMPREHENSIVE,
        analysisPeriod: {
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-01-31')
        },
        revenueAnalysis: {
          totalRevenue: 125000,
          averageRevenue: 4167,
          revenueGrowth: 12.5,
          revenueByPeriod: [
            { period: 'Week 1', revenue: 28000, growth: 8.2 },
            { period: 'Week 2', revenue: 32000, growth: 14.3 },
            { period: 'Week 3', revenue: 35000, growth: 9.4 },
            { period: 'Week 4', revenue: 30000, growth: -14.3 }
          ],
          topCustomers: [
            { customerId: '1', customerName: 'Al-Rashid Farm', revenue: 45000, percentage: 36 },
            { customerId: '2', customerName: 'Saudi Genetics Center', revenue: 38000, percentage: 30.4 },
            { customerId: '3', customerName: 'Royal Veterinary Clinic', revenue: 22000, percentage: 17.6 },
            { customerId: '4', customerName: 'Desert Breeding Center', revenue: 20000, percentage: 16 }
          ],
          revenueTrends: [
            { period: 'Jan', trend: 8.2, forecast: 9.1 },
            { period: 'Feb', trend: 12.5, forecast: 11.8 },
            { period: 'Mar', trend: 15.3, forecast: 14.2 }
          ]
        },
        costAnalysis: {
          totalCost: 87500,
          averageCost: 2917,
          costBreakdown: [
            { costType: 'LABOR' as any, amount: 35000, percentage: 40 },
            { costType: 'MATERIAL' as any, amount: 26250, percentage: 30 },
            { costType: 'EQUIPMENT' as any, amount: 17500, percentage: 20 },
            { costType: 'OVERHEAD' as any, amount: 8750, percentage: 10 }
          ],
          costVariance: -5.2,
          costTrends: [
            { period: 'Week 1', cost: 21000, variance: -2.1 },
            { period: 'Week 2', cost: 24000, variance: 4.3 },
            { period: 'Week 3', cost: 26000, variance: 8.3 },
            { period: 'Week 4', cost: 16500, variance: -36.5 }
          ],
          efficiencyMetrics: [
            { metric: 'Labor Efficiency', value: 85, target: 90, efficiency: 94.4 },
            { metric: 'Material Utilization', value: 92, target: 95, efficiency: 96.8 },
            { metric: 'Equipment Uptime', value: 88, target: 85, efficiency: 103.5 },
            { metric: 'Process Efficiency', value: 78, target: 80, efficiency: 97.5 }
          ]
        },
        performanceAnalysis: {
          overallPerformance: 87.5,
          performanceByMetric: [
            { metric: 'Success Rate', value: 92, target: 90, performance: 102.2 },
            { metric: 'Quality Score', value: 8.7, target: 8.5, performance: 102.4 },
            { metric: 'Customer Satisfaction', value: 4.6, target: 4.5, performance: 102.2 },
            { metric: 'Delivery Time', value: 2.3, target: 2.5, performance: 108.7 },
            { metric: 'Cost Efficiency', value: 85, target: 80, performance: 106.3 }
          ],
          performanceTrends: [
            { period: 'Week 1', performance: 82, trend: 2.5 },
            { period: 'Week 2', performance: 85, trend: 3.7 },
            { period: 'Week 3', performance: 88, trend: 3.5 },
            { period: 'Week 4', performance: 87.5, trend: -0.6 }
          ],
          benchmarkComparison: [
            { metric: 'Success Rate', current: 92, benchmark: 88, difference: 4.5 },
            { metric: 'Quality Score', current: 8.7, benchmark: 8.2, difference: 6.1 },
            { metric: 'Cost Efficiency', current: 85, benchmark: 82, difference: 3.7 },
            { metric: 'Customer Satisfaction', current: 4.6, benchmark: 4.3, difference: 7.0 }
          ],
          improvementAreas: [
            { area: 'Process Standardization', currentValue: 75, targetValue: 85, improvement: 13.3, priority: 'HIGH' },
            { area: 'Staff Training', currentValue: 82, targetValue: 90, improvement: 9.8, priority: 'MEDIUM' },
            { area: 'Equipment Maintenance', currentValue: 88, targetValue: 95, improvement: 8.0, priority: 'LOW' },
            { area: 'Quality Control', currentValue: 90, targetValue: 95, improvement: 5.6, priority: 'LOW' }
          ]
        },
        profitabilityAnalysis: {
          grossProfit: 37500,
          netProfit: 31250,
          profitMargin: 30,
          profitTrends: [
            { period: 'Week 1', profit: 7000, margin: 25 },
            { period: 'Week 2', profit: 8000, margin: 25 },
            { period: 'Week 3', profit: 9000, margin: 25.7 },
            { period: 'Week 4', profit: 13500, margin: 45 }
          ],
          profitabilityByService: [
            { serviceId: '1', serviceName: 'Embryo Transfer', revenue: 45000, cost: 31500, profit: 13500, margin: 30 },
            { serviceId: '2', serviceName: 'IVF Services', revenue: 38000, cost: 26600, profit: 11400, margin: 30 },
            { serviceId: '3', serviceName: 'Ultrasound', revenue: 22000, cost: 15400, profit: 6600, margin: 30 },
            { serviceId: '4', serviceName: 'Consultation', revenue: 20000, cost: 14000, profit: 6000, margin: 30 }
          ],
          breakEvenAnalysis: {
            breakEvenPoint: 25,
            contributionMargin: 70,
            safetyMargin: 20,
            analysis: 'Service is operating well above break-even point with strong contribution margin'
          }
        },
        recommendations: [
          {
            category: 'Revenue Optimization',
            recommendation: 'Implement dynamic pricing based on demand patterns',
            impact: 'Potential 15% revenue increase',
            priority: 'HIGH',
            implementation: '3-6 months with pricing algorithm development'
          },
          {
            category: 'Cost Reduction',
            recommendation: 'Optimize material procurement through bulk purchasing',
            impact: '5-8% cost reduction',
            priority: 'MEDIUM',
            implementation: '2-3 months with supplier negotiations'
          },
          {
            category: 'Performance Enhancement',
            recommendation: 'Standardize processes to improve efficiency',
            impact: '10% performance improvement',
            priority: 'HIGH',
            implementation: '4-6 months with process mapping and training'
          },
          {
            category: 'Quality Improvement',
            recommendation: 'Implement advanced quality control measures',
            impact: '5% quality score improvement',
            priority: 'MEDIUM',
            implementation: '3-4 months with QC system implementation'
          }
        ],
        generatedAt: new Date()
      };
      setAnalysisData(mockAnalysis);
      setLoading(false);
    }, 2000);
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600';
    if (performance >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <div className="w-4 h-4" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing service performance...</p>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Service Analysis</h3>
        <p className="text-gray-600 mb-4">Select a service to analyze performance and profitability</p>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Select Service
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Service Performance Analysis</h2>
          <p className="text-gray-600">Comprehensive analysis of service performance, costs, and profitability</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button
            onClick={() => onExportRequest?.(analysisData)}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'revenue', name: 'Revenue Analysis', icon: DollarSign },
            { id: 'costs', name: 'Cost Analysis', icon: Calculator },
            { id: 'performance', name: 'Performance', icon: Target },
            { id: 'profitability', name: 'Profitability', icon: TrendingUp },
            { id: 'recommendations', name: 'Recommendations', icon: Award }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">SAR {analysisData.revenueAnalysis.totalRevenue.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    {getTrendIcon(analysisData.revenueAnalysis.revenueGrowth)}
                    <span className="text-sm text-green-600 ml-1">+{analysisData.revenueAnalysis.revenueGrowth}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calculator className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Costs</p>
                  <p className="text-2xl font-bold text-gray-900">SAR {analysisData.costAnalysis.totalCost.toLocaleString()}</p>
                  <div className="flex items-center mt-1">
                    {getTrendIcon(analysisData.costAnalysis.costVariance)}
                    <span className={`text-sm ml-1 ${analysisData.costAnalysis.costVariance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {analysisData.costAnalysis.costVariance > 0 ? '+' : ''}{analysisData.costAnalysis.costVariance}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Performance</p>
                  <p className={`text-2xl font-bold ${getPerformanceColor(analysisData.performanceAnalysis.overallPerformance)}`}>
                    {analysisData.performanceAnalysis.overallPerformance}%
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Overall Score</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                  <p className="text-2xl font-bold text-gray-900">{analysisData.profitabilityAnalysis.profitMargin}%</p>
                  <p className="text-sm text-gray-600 mt-1">SAR {analysisData.profitabilityAnalysis.netProfit.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Top Performing Metrics</h4>
                <div className="space-y-3">
                  {analysisData.performanceAnalysis.performanceByMetric
                    .sort((a, b) => b.performance - a.performance)
                    .slice(0, 3)
                    .map((metric, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{metric.metric}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-green-600">{metric.performance}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${Math.min(metric.performance, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Areas for Improvement</h4>
                <div className="space-y-3">
                  {analysisData.performanceAnalysis.improvementAreas
                    .sort((a, b) => a.priority === 'HIGH' ? 1 : b.priority === 'HIGH' ? -1 : 0)
                    .slice(0, 3)
                    .map((area, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{area.area}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(area.priority)}`}>
                            {area.priority}
                          </span>
                          <span className="text-sm font-medium text-blue-600">+{area.improvement}%</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Analysis Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysisData.revenueAnalysis.revenueByPeriod.map((period, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{period.period}</span>
                    {getTrendIcon(period.growth)}
                  </div>
                  <p className="text-lg font-bold text-gray-900">SAR {period.revenue.toLocaleString()}</p>
                  <p className={`text-sm ${period.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {period.growth >= 0 ? '+' : ''}{period.growth}% growth
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Customers</h3>
            <div className="space-y-3">
              {analysisData.revenueAnalysis.topCustomers.map((customer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{customer.customerName}</p>
                    <p className="text-sm text-gray-600">{customer.percentage}% of total revenue</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">SAR {customer.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cost Analysis Tab */}
      {activeTab === 'costs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
            <div className="space-y-4">
              {analysisData.costAnalysis.costBreakdown.map((cost, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-sm font-medium text-gray-900">{cost.costType}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">{cost.percentage}%</span>
                    <span className="font-medium text-gray-900">SAR {cost.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Efficiency Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisData.costAnalysis.efficiencyMetrics.map((metric, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{metric.metric}</span>
                    <span className={`text-sm font-medium ${metric.efficiency >= 100 ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.efficiency}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${metric.efficiency >= 100 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(metric.efficiency, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {metric.value}/{metric.target} target
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              {analysisData.performanceAnalysis.performanceByMetric.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{metric.metric}</p>
                    <p className="text-sm text-gray-600">Target: {metric.target}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-900">{metric.value}</span>
                    <span className={`text-sm font-medium ${metric.performance >= 100 ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.performance}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Benchmark Comparison</h3>
            <div className="space-y-3">
              {analysisData.performanceAnalysis.benchmarkComparison.map((benchmark, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm font-medium text-gray-900">{benchmark.metric}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Benchmark: {benchmark.benchmark}</span>
                    <span className="text-sm font-medium text-gray-900">Current: {benchmark.current}</span>
                    <span className={`text-sm font-medium ${benchmark.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {benchmark.difference >= 0 ? '+' : ''}{benchmark.difference}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Profitability Tab */}
      {activeTab === 'profitability' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profitability Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Gross Profit</p>
                <p className="text-2xl font-bold text-green-600">SAR {analysisData.profitabilityAnalysis.grossProfit.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Net Profit</p>
                <p className="text-2xl font-bold text-blue-600">SAR {analysisData.profitabilityAnalysis.netProfit.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Profit Margin</p>
                <p className="text-2xl font-bold text-purple-600">{analysisData.profitabilityAnalysis.profitMargin}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Break-Even Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Break-Even Point</span>
                <span className="font-medium text-gray-900">{analysisData.profitabilityAnalysis.breakEvenAnalysis.breakEvenPoint} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Contribution Margin</span>
                <span className="font-medium text-gray-900">{analysisData.profitabilityAnalysis.breakEvenAnalysis.contributionMargin}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Safety Margin</span>
                <span className="font-medium text-gray-900">{analysisData.profitabilityAnalysis.breakEvenAnalysis.safetyMargin}%</span>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">{analysisData.profitabilityAnalysis.breakEvenAnalysis.analysis}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategic Recommendations</h3>
            <div className="space-y-4">
              {analysisData.recommendations.map((rec, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{rec.category}</h4>
                      <p className="text-sm text-gray-600 mt-1">{rec.recommendation}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(rec.priority)}`}>
                      {rec.priority}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Impact:</span>
                      <p className="font-medium text-green-600">{rec.impact}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Implementation:</span>
                      <p className="font-medium text-blue-600">{rec.implementation}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Priority:</span>
                      <p className="font-medium">{rec.priority}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceAnalysis; 