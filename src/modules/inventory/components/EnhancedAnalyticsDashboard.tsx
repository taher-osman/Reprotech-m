import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Clock,
  AlertTriangle,
  Target,
  Activity,
  PieChart,
  LineChart,
  Users,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Settings,
  Eye,
  Maximize,
  Brain,
  Zap,
  Bell,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  BarChart2,
  Layers,
  ShoppingCart,
  Truck,
  Factory,
  Gauge
} from 'lucide-react';

// Enhanced Types for Advanced Analytics
interface ForecastData {
  item: string;
  category: string;
  currentStock: number;
  predictedDemand: number;
  confidence: number;
  reorderPoint: number;
  leadTime: number;
  safetyStock: number;
  forecastHorizon: 'WEEK' | 'MONTH' | 'QUARTER';
  seasonalityFactor: number;
  trends: TrendPoint[];
}

interface TrendPoint {
  date: string;
  actual: number;
  predicted: number;
  confidence: number;
}

interface CostOptimization {
  category: string;
  currentCost: number;
  optimizedCost: number;
  potentialSavings: number;
  recommendations: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  implementationTime: number;
}

interface SupplyChainRisk {
  supplier: string;
  riskScore: number;
  factors: RiskFactor[];
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  mitigation: string[];
  alternatives: string[];
}

interface RiskFactor {
  factor: string;
  weight: number;
  description: string;
}

interface InventoryKPI {
  metric: string;
  current: number;
  target: number;
  trend: number;
  status: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL';
  benchmark: number;
}

interface AIInsight {
  type: 'OPPORTUNITY' | 'RISK' | 'OPTIMIZATION' | 'ALERT';
  title: string;
  description: string;
  confidence: number;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  actions: string[];
  priority: number;
}

export const EnhancedAnalyticsDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('overview');
  const [timeRange, setTimeRange] = useState('12M');
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Enhanced Analytics Data
  const [forecastData, setForecastData] = useState<ForecastData[]>([
    {
      item: 'Culture Medium DMEM',
      category: 'MEDIA',
      currentStock: 750,
      predictedDemand: 1200,
      confidence: 87.5,
      reorderPoint: 1000,
      leadTime: 3,
      safetyStock: 200,
      forecastHorizon: 'MONTH',
      seasonalityFactor: 1.15,
      trends: [
        { date: '2025-01-01', actual: 180, predicted: 175, confidence: 89 },
        { date: '2025-01-02', actual: 195, predicted: 190, confidence: 91 },
        { date: '2025-01-03', actual: 205, predicted: 200, confidence: 88 }
      ]
    },
    {
      item: 'FSH (Folltropin)',
      category: 'HORMONE',
      currentStock: 1600,
      predictedDemand: 850,
      confidence: 94.2,
      reorderPoint: 2000,
      leadTime: 2,
      safetyStock: 300,
      forecastHorizon: 'MONTH',
      seasonalityFactor: 0.92,
      trends: [
        { date: '2025-01-01', actual: 85, predicted: 82, confidence: 95 },
        { date: '2025-01-02', actual: 78, predicted: 80, confidence: 93 },
        { date: '2025-01-03', actual: 92, predicted: 88, confidence: 94 }
      ]
    },
    {
      item: 'Liquid Nitrogen',
      category: 'CRYO_MATERIAL',
      currentStock: 150,
      predictedDemand: 400,
      confidence: 96.8,
      reorderPoint: 200,
      leadTime: 1,
      safetyStock: 50,
      forecastHorizon: 'WEEK',
      seasonalityFactor: 1.28,
      trends: [
        { date: '2025-01-01', actual: 25, predicted: 28, confidence: 97 },
        { date: '2025-01-02', actual: 32, predicted: 30, confidence: 96 },
        { date: '2025-01-03', actual: 28, predicted: 29, confidence: 98 }
      ]
    }
  ]);

  const [costOptimizations, setCostOptimizations] = useState<CostOptimization[]>([
    {
      category: 'Culture Media',
      currentCost: 185000,
      optimizedCost: 168500,
      potentialSavings: 16500,
      recommendations: [
        'Negotiate bulk pricing with Life Technologies',
        'Consider alternative supplier for 20% of volume',
        'Optimize order frequencies to reduce carrying costs'
      ],
      riskLevel: 'LOW',
      implementationTime: 30
    },
    {
      category: 'Equipment',
      currentCost: 89000,
      optimizedCost: 76500,
      potentialSavings: 12500,
      recommendations: [
        'Lease high-value equipment instead of purchasing',
        'Consider refurbished equipment for non-critical items',
        'Implement predictive maintenance program'
      ],
      riskLevel: 'MEDIUM',
      implementationTime: 90
    }
  ]);

  const [supplyChainRisks, setSupplyChainRisks] = useState<SupplyChainRisk[]>([
    {
      supplier: 'Life Technologies Corp',
      riskScore: 25,
      factors: [
        { factor: 'Single source dependency', weight: 0.4, description: '80% of culture media from single supplier' },
        { factor: 'Geographic concentration', weight: 0.3, description: 'All facilities in same region' },
        { factor: 'Financial stability', weight: 0.3, description: 'Strong financial position' }
      ],
      impact: 'MEDIUM',
      mitigation: ['Identify backup suppliers', 'Increase safety stock', 'Diversify supplier base'],
      alternatives: ['Sigma-Aldrich', 'Thermo Fisher Scientific']
    },
    {
      supplier: 'CryoTech Industries',
      riskScore: 45,
      factors: [
        { factor: 'Delivery reliability', weight: 0.5, description: 'Recent delivery delays' },
        { factor: 'Quality issues', weight: 0.3, description: 'Minor quality concerns reported' },
        { factor: 'Market position', weight: 0.2, description: 'Smaller market player' }
      ],
      impact: 'HIGH',
      mitigation: ['Implement backup supplier', 'Increase lead times', 'Quality monitoring'],
      alternatives: ['Air Liquide', 'Praxair']
    }
  ]);

  const [inventoryKPIs, setInventoryKPIs] = useState<InventoryKPI[]>([
    { metric: 'Inventory Turnover', current: 6.2, target: 8.0, trend: 15.2, status: 'GOOD', benchmark: 7.5 },
    { metric: 'Stock Accuracy %', current: 98.5, target: 99.0, trend: 2.1, status: 'EXCELLENT', benchmark: 97.0 },
    { metric: 'Fill Rate %', current: 96.8, target: 98.0, trend: -1.2, status: 'GOOD', benchmark: 95.0 },
    { metric: 'Carrying Cost %', current: 18.5, target: 15.0, trend: -8.3, status: 'WARNING', benchmark: 20.0 },
    { metric: 'Stockout Frequency', current: 2.1, target: 1.0, trend: -25.4, status: 'GOOD', benchmark: 3.0 },
    { metric: 'Order Cycle Time', current: 3.2, target: 2.5, trend: -12.5, status: 'GOOD', benchmark: 4.0 }
  ]);

  const [aiInsights, setAiInsights] = useState<AIInsight[]>([
    {
      type: 'OPPORTUNITY',
      title: 'Bulk Ordering Opportunity',
      description: 'Analysis shows 15% cost savings potential by consolidating Culture Media orders',
      confidence: 92.3,
      impact: 'HIGH',
      actions: ['Negotiate volume discount', 'Adjust order frequency', 'Increase order quantity'],
      priority: 1
    },
    {
      type: 'RISK',
      title: 'Supply Chain Vulnerability',
      description: 'Single-source dependency for critical Liquid Nitrogen supply poses risk',
      confidence: 88.7,
      impact: 'HIGH',
      actions: ['Identify backup supplier', 'Increase safety stock', 'Diversify supply base'],
      priority: 2
    },
    {
      type: 'OPTIMIZATION',
      title: 'Inventory Level Optimization',
      description: 'AI models suggest reducing safety stock for low-variability items',
      confidence: 85.1,
      impact: 'MEDIUM',
      actions: ['Adjust safety stock levels', 'Implement dynamic reorder points', 'Monitor performance'],
      priority: 3
    }
  ]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(handleRefresh, 30000); // 30 second refresh
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call to refresh analytics data
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleExport = (format: 'PDF' | 'EXCEL' | 'CSV') => {
    console.log(`Exporting enhanced analytics as ${format}`);
    // Export implementation with comprehensive data
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EXCELLENT': return 'text-green-600 bg-green-100';
      case 'GOOD': return 'text-blue-600 bg-blue-100';
      case 'WARNING': return 'text-orange-600 bg-orange-100';
      case 'CRITICAL': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'HIGH': return 'text-red-600 bg-red-100';
      case 'MEDIUM': return 'text-orange-600 bg-orange-100';
      case 'LOW': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const views = [
    { id: 'overview', name: 'Overview Dashboard', icon: BarChart3 },
    { id: 'forecasting', name: 'Demand Forecasting', icon: TrendingUp, badge: 'AI' },
    { id: 'optimization', name: 'Cost Optimization', icon: DollarSign, badge: 'NEW' },
    { id: 'risk', name: 'Supply Chain Risk', icon: AlertTriangle },
    { id: 'kpis', name: 'Performance KPIs', icon: Target },
    { id: 'insights', name: 'AI Insights', icon: Brain, badge: 'AI' }
  ];

  const renderOverviewDashboard = () => (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Enhanced Inventory Analytics</h2>
            <p className="text-purple-100 mt-1">AI-powered forecasting, optimization, and risk analysis</p>
          </div>
          <div className="flex space-x-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <Brain className="h-4 w-4 mr-1" />
              AI POWERED
            </span>
            <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">ENHANCED</span>
          </div>
        </div>
      </div>

      {/* Real-time KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {inventoryKPIs.map((kpi, index) => (
          <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">{kpi.metric}</p>
                <p className="text-2xl font-bold text-gray-900">{kpi.current}{kpi.metric.includes('%') ? '%' : kpi.metric.includes('Time') ? 'd' : 'x'}</p>
                <p className="text-xs text-gray-400">Target: {kpi.target}</p>
              </div>
              <div className="text-right">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(kpi.status)}`}>
                  {kpi.status}
                </span>
                <div className="flex items-center mt-1">
                  {kpi.trend > 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={`text-xs ${kpi.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(kpi.trend)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Insights Panel */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Zap className="h-5 w-5 text-yellow-500 mr-2" />
            AI Quick Insights
          </h3>
          <span className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiInsights.slice(0, 3).map((insight, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  insight.type === 'OPPORTUNITY' ? 'bg-green-100 text-green-800' :
                  insight.type === 'RISK' ? 'bg-red-100 text-red-800' :
                  insight.type === 'OPTIMIZATION' ? 'bg-blue-100 text-blue-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {insight.type}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getImpactColor(insight.impact)}`}>
                  {insight.impact}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">{insight.title}</h4>
              <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
              <div className="text-xs text-gray-500">
                Confidence: {insight.confidence}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demand Forecast Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
            Demand Forecast Analysis
          </h3>
          <div className="space-y-4">
            {forecastData.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.item}</p>
                  <p className="text-sm text-gray-500">Current: {item.currentStock} | Predicted: {item.predictedDemand}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{item.confidence}% confidence</p>
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    item.currentStock < item.reorderPoint ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {item.currentStock < item.reorderPoint ? 'Reorder Soon' : 'Sufficient'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Optimization */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="h-5 w-5 text-green-500 mr-2" />
            Cost Optimization Opportunities
          </h3>
          <div className="space-y-4">
            {costOptimizations.map((opt, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{opt.category}</h4>
                  <span className="text-lg font-bold text-green-600">
                    ${opt.potentialSavings.toLocaleString()} savings
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Current: ${opt.currentCost.toLocaleString()}</span>
                  <span>Optimized: ${opt.optimizedCost.toLocaleString()}</span>
                </div>
                <div className="mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                    opt.riskLevel === 'LOW' ? 'bg-green-100 text-green-800' :
                    opt.riskLevel === 'MEDIUM' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {opt.riskLevel} Risk
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    Implementation: {opt.implementationTime} days
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDemandForecasting = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold">AI-Powered Demand Forecasting</h2>
        <p className="text-blue-100 mt-1">Advanced predictive analytics with 90%+ accuracy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {forecastData.map((item, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{item.item}</h3>
              <span className="text-lg font-bold text-blue-600">{item.confidence}%</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Current Stock:</span>
                <span className="font-medium">{item.currentStock}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Predicted Demand:</span>
                <span className="font-medium">{item.predictedDemand}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Reorder Point:</span>
                <span className="font-medium">{item.reorderPoint}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Seasonality Factor:</span>
                <span className="font-medium">{item.seasonalityFactor}x</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Recent Trends</h4>
              <div className="space-y-1">
                {item.trends.slice(0, 3).map((trend, tIndex) => (
                  <div key={tIndex} className="flex justify-between text-xs">
                    <span className="text-gray-600">{new Date(trend.date).toLocaleDateString()}</span>
                    <span>Actual: {trend.actual} | Predicted: {trend.predicted}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">
                View Detailed Analysis
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSupplyChainRisk = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold">Supply Chain Risk Analysis</h2>
        <p className="text-red-100 mt-1">Proactive risk identification and mitigation strategies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {supplyChainRisks.map((risk, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{risk.supplier}</h3>
              <div className="flex items-center">
                <Gauge className="h-5 w-5 text-gray-400 mr-2" />
                <span className={`text-lg font-bold ${
                  risk.riskScore < 30 ? 'text-green-600' :
                  risk.riskScore < 60 ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {risk.riskScore}
                </span>
              </div>
            </div>

            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getImpactColor(risk.impact)} mb-4`}>
              {risk.impact} Impact
            </span>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Risk Factors</h4>
                {risk.factors.map((factor, fIndex) => (
                  <div key={fIndex} className="text-sm text-gray-600 mb-1">
                    • {factor.factor} ({Math.round(factor.weight * 100)}% weight)
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Mitigation Actions</h4>
                {risk.mitigation.map((action, aIndex) => (
                  <div key={aIndex} className="text-sm text-gray-600 mb-1">
                    • {action}
                  </div>
                ))}
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Alternative Suppliers</h4>
                <div className="flex flex-wrap gap-1">
                  {risk.alternatives.map((alt, altIndex) => (
                    <span key={altIndex} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAIInsights = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center">
          <Brain className="h-8 w-8 mr-3" />
          AI-Generated Insights
        </h2>
        <p className="text-indigo-100 mt-1">Machine learning powered recommendations and alerts</p>
      </div>

      <div className="space-y-4">
        {aiInsights.map((insight, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full mr-3 ${
                    insight.type === 'OPPORTUNITY' ? 'bg-green-100 text-green-800' :
                    insight.type === 'RISK' ? 'bg-red-100 text-red-800' :
                    insight.type === 'OPTIMIZATION' ? 'bg-blue-100 text-blue-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {insight.type}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getImpactColor(insight.impact)}`}>
                    {insight.impact} Impact
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{insight.title}</h3>
                <p className="text-gray-600 mb-4">{insight.description}</p>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-900">Recommended Actions:</h4>
                  {insight.actions.map((action, aIndex) => (
                    <div key={aIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {action}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="ml-6 text-right">
                <div className="text-2xl font-bold text-gray-900">{insight.confidence}%</div>
                <div className="text-sm text-gray-500">Confidence</div>
                <div className="mt-2">
                  <span className="text-sm text-gray-500">Priority: </span>
                  <span className="font-semibold">{insight.priority}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderComingSoon = (feature: string) => (
    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
      <div className="text-gray-400 mb-4">
        <Settings className="h-16 w-16" />
      </div>
      <h3 className="text-xl font-semibold text-gray-600 mb-2">{feature}</h3>
      <p className="text-gray-500">Advanced analytics feature coming soon</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Enhanced Analytics Dashboard</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Auto-refresh</span>
            </label>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="1M">Last Month</option>
            <option value="3M">Last 3 Months</option>
            <option value="6M">Last 6 Months</option>
            <option value="12M">Last Year</option>
          </select>
          
          <button
            onClick={() => handleExport('PDF')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {views.map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeView === view.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <view.icon className="h-4 w-4 mr-2" />
              {view.name}
              {view.badge && (
                <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  view.badge === 'AI' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                }`}>
                  {view.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeView === 'overview' && renderOverviewDashboard()}
        {activeView === 'forecasting' && renderDemandForecasting()}
        {activeView === 'optimization' && renderComingSoon('Cost Optimization Analysis')}
        {activeView === 'risk' && renderSupplyChainRisk()}
        {activeView === 'kpis' && renderComingSoon('Performance KPIs Dashboard')}
        {activeView === 'insights' && renderAIInsights()}
      </div>
    </div>
  );
}; 