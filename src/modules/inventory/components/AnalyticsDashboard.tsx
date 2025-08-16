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
  Zap
} from 'lucide-react';

// Types for Analytics
interface AnalyticsData {
  overview: OverviewMetrics;
  spending: SpendingAnalytics;
  inventory: InventoryAnalytics;
  suppliers: SupplierAnalytics;
  predictive: PredictiveAnalytics;
  trends: TrendAnalytics;
}

interface OverviewMetrics {
  totalValue: number;
  monthlySpend: number;
  costSavings: number;
  turnoverRate: number;
  stockAccuracy: number;
  fillRate: number;
  growth: {
    value: number;
    spend: number;
    savings: number;
    turnover: number;
  };
}

interface SpendingAnalytics {
  totalSpend: number;
  categoryBreakdown: CategorySpend[];
  monthlyTrends: MonthlySpend[];
  budgetUtilization: number;
  costPerUnit: number;
  variance: number;
}

interface CategorySpend {
  category: string;
  amount: number;
  percentage: number;
  trend: number;
  orders: number;
}

interface MonthlySpend {
  month: string;
  amount: number;
  budget: number;
  variance: number;
  orders: number;
}

interface InventoryAnalytics {
  turnoverByCategory: CategoryTurnover[];
  abcAnalysis: ABCAnalysis[];
  stockLevels: StockLevel[];
  expiryAnalysis: ExpiryAnalysis;
  movementVelocity: MovementVelocity[];
}

interface CategoryTurnover {
  category: string;
  turnoverRate: number;
  averageDays: number;
  value: number;
  movement: string;
}

interface ABCAnalysis {
  category: 'A' | 'B' | 'C';
  itemCount: number;
  valuePercentage: number;
  description: string;
}

interface StockLevel {
  item: string;
  current: number;
  optimal: number;
  status: 'OPTIMAL' | 'EXCESS' | 'LOW' | 'CRITICAL';
  daysOfStock: number;
}

interface ExpiryAnalysis {
  expiring30Days: number;
  expiring90Days: number;
  expired: number;
  totalValue: number;
}

interface MovementVelocity {
  item: string;
  category: string;
  velocity: number;
  trend: 'INCREASING' | 'STABLE' | 'DECREASING';
  forecast: number;
}

interface SupplierAnalytics {
  performance: SupplierPerformance[];
  reliability: ReliabilityMetrics;
  costAnalysis: CostAnalysis[];
  deliveryMetrics: DeliveryMetrics;
}

interface SupplierPerformance {
  supplier: string;
  onTimeRate: number;
  qualityScore: number;
  costCompetitiveness: number;
  totalSpend: number;
  orders: number;
  issues: number;
}

interface ReliabilityMetrics {
  averageOnTime: number;
  averageQuality: number;
  totalIssues: number;
  criticalFailures: number;
}

interface CostAnalysis {
  supplier: string;
  averageCost: number;
  marketRate: number;
  savings: number;
  competitiveness: number;
}

interface DeliveryMetrics {
  averageDays: number;
  onTimePercentage: number;
  earlyDeliveries: number;
  lateDeliveries: number;
}

interface PredictiveAnalytics {
  demandForecast: DemandForecast[];
  reorderPredictions: ReorderPrediction[];
  costProjections: CostProjection[];
  riskAnalysis: RiskAnalysis[];
}

interface DemandForecast {
  item: string;
  currentConsumption: number;
  predictedConsumption: number;
  confidence: number;
  seasonality: number;
}

interface ReorderPrediction {
  item: string;
  predictedReorderDate: string;
  suggestedQuantity: number;
  confidence: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface CostProjection {
  category: string;
  currentCost: number;
  projectedCost: number;
  variance: number;
  factors: string[];
}

interface RiskAnalysis {
  category: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  factors: string[];
  mitigation: string[];
  impact: number;
}

interface TrendAnalytics {
  quarterlyTrends: QuarterlyTrend[];
  seasonalPatterns: SeasonalPattern[];
  cyclicalAnalysis: CyclicalAnalysis[];
}

interface QuarterlyTrend {
  quarter: string;
  value: number;
  spending: number;
  orders: number;
  growth: number;
}

interface SeasonalPattern {
  period: string;
  pattern: 'HIGH' | 'MEDIUM' | 'LOW';
  variance: number;
  items: string[];
}

interface CyclicalAnalysis {
  cycle: string;
  duration: number;
  amplitude: number;
  phase: string;
}

export const AnalyticsDashboard: React.FC = () => {
  const [activeWidget, setActiveWidget] = useState('overview');
  const [timeRange, setTimeRange] = useState('12M');
  const [refreshing, setRefreshing] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);

  // Mock Analytics Data
  const mockAnalyticsData: AnalyticsData = {
    overview: {
      totalValue: 485750.50,
      monthlySpend: 45680.75,
      costSavings: 18950.25,
      turnoverRate: 6.2,
      stockAccuracy: 98.5,
      fillRate: 96.8,
      growth: {
        value: 12.5,
        spend: -8.3,
        savings: 25.4,
        turnover: 15.2
      }
    },
    spending: {
      totalSpend: 485750.50,
      categoryBreakdown: [
        { category: 'Culture Media', amount: 185000, percentage: 38.1, trend: 12.5, orders: 45 },
        { category: 'Hormones', amount: 125000, percentage: 25.7, trend: -5.2, orders: 32 },
        { category: 'Equipment', amount: 89000, percentage: 18.3, trend: 8.7, orders: 12 },
        { category: 'Cryo Materials', amount: 56750, percentage: 11.7, trend: 22.1, orders: 28 },
        { category: 'Pharmaceuticals', amount: 30000, percentage: 6.2, trend: -2.8, orders: 18 }
      ],
      monthlyTrends: [
        { month: '2024-07', amount: 42500, budget: 45000, variance: -5.6, orders: 15 },
        { month: '2024-08', amount: 48200, budget: 45000, variance: 7.1, orders: 18 },
        { month: '2024-09', amount: 43800, budget: 45000, variance: -2.7, orders: 16 },
        { month: '2024-10', amount: 46900, budget: 45000, variance: 4.2, orders: 19 },
        { month: '2024-11', amount: 41200, budget: 45000, variance: -8.4, orders: 14 },
        { month: '2024-12', amount: 52300, budget: 50000, variance: 4.6, orders: 22 }
      ],
      budgetUtilization: 89.5,
      costPerUnit: 12.85,
      variance: 4.2
    },
    inventory: {
      turnoverByCategory: [
        { category: 'Culture Media', turnoverRate: 8.5, averageDays: 43, value: 185000, movement: 'FAST' },
        { category: 'Hormones', turnoverRate: 6.2, averageDays: 59, value: 125000, movement: 'MEDIUM' },
        { category: 'Cryo Materials', turnoverRate: 12.1, averageDays: 30, value: 56750, movement: 'FAST' },
        { category: 'Equipment', turnoverRate: 2.3, averageDays: 158, value: 89000, movement: 'SLOW' }
      ],
      abcAnalysis: [
        { category: 'A', itemCount: 156, valuePercentage: 70, description: 'High value, frequent use' },
        { category: 'B', itemCount: 234, valuePercentage: 25, description: 'Medium value, moderate use' },
        { category: 'C', itemCount: 857, valuePercentage: 5, description: 'Low value, infrequent use' }
      ],
      stockLevels: [
        { item: 'Culture Medium DMEM', current: 750, optimal: 1200, status: 'LOW', daysOfStock: 8 },
        { item: 'FSH (Folltropin)', current: 1600, optimal: 1500, status: 'OPTIMAL', daysOfStock: 45 },
        { item: 'Liquid Nitrogen', current: 150, optimal: 400, status: 'CRITICAL', daysOfStock: 6 },
        { item: 'Pipette Tips', current: 8500, optimal: 5000, status: 'EXCESS', daysOfStock: 85 }
      ],
      expiryAnalysis: {
        expiring30Days: 23,
        expiring90Days: 67,
        expired: 8,
        totalValue: 12850.75
      },
      movementVelocity: [
        { item: 'Culture Medium', category: 'MEDIA', velocity: 8.5, trend: 'INCREASING', forecast: 9.2 },
        { item: 'FSH Hormone', category: 'HORMONE', velocity: 6.1, trend: 'STABLE', forecast: 6.0 },
        { item: 'Cryo Straws', category: 'CONSUMABLE', velocity: 12.3, trend: 'INCREASING', forecast: 13.1 }
      ]
    },
    suppliers: {
      performance: [
        { supplier: 'Life Technologies', onTimeRate: 94.5, qualityScore: 4.8, costCompetitiveness: 85.2, totalSpend: 185000, orders: 45, issues: 2 },
        { supplier: 'Vetoquinol', onTimeRate: 98.2, qualityScore: 4.6, costCompetitiveness: 92.1, totalSpend: 125000, orders: 32, issues: 1 },
        { supplier: 'CryoTech', onTimeRate: 88.7, qualityScore: 4.9, costCompetitiveness: 78.5, totalSpend: 89000, orders: 28, issues: 4 }
      ],
      reliability: {
        averageOnTime: 93.8,
        averageQuality: 4.7,
        totalIssues: 7,
        criticalFailures: 1
      },
      costAnalysis: [
        { supplier: 'Life Technologies', averageCost: 125.50, marketRate: 130.00, savings: 4.50, competitiveness: 96.5 },
        { supplier: 'Vetoquinol', averageCost: 89.25, marketRate: 85.00, savings: -4.25, competitiveness: 95.0 },
        { supplier: 'CryoTech', averageCost: 156.75, marketRate: 160.00, savings: 3.25, competitiveness: 98.0 }
      ],
      deliveryMetrics: {
        averageDays: 3.2,
        onTimePercentage: 93.8,
        earlyDeliveries: 12,
        lateDeliveries: 8
      }
    },
    predictive: {
      demandForecast: [
        { item: 'Culture Medium DMEM', currentConsumption: 180, predictedConsumption: 195, confidence: 87.5, seasonality: 1.08 },
        { item: 'FSH (Folltropin)', currentConsumption: 85, predictedConsumption: 78, confidence: 92.1, seasonality: 0.92 },
        { item: 'Liquid Nitrogen', currentConsumption: 25, predictedConsumption: 32, confidence: 89.3, seasonality: 1.28 }
      ],
      reorderPredictions: [
        { item: 'Culture Medium DMEM', predictedReorderDate: '2025-01-08', suggestedQuantity: 2000, confidence: 94.2, priority: 'HIGH' },
        { item: 'Liquid Nitrogen', predictedReorderDate: '2025-01-05', suggestedQuantity: 400, confidence: 96.8, priority: 'CRITICAL' },
        { item: 'Pipette Tips', predictedReorderDate: '2025-03-15', suggestedQuantity: 5000, confidence: 78.5, priority: 'LOW' }
      ],
      costProjections: [
        { category: 'Culture Media', currentCost: 185000, projectedCost: 195250, variance: 5.5, factors: ['Inflation', 'Demand Growth'] },
        { category: 'Hormones', currentCost: 125000, projectedCost: 118750, variance: -5.0, factors: ['New Supplier', 'Bulk Pricing'] }
      ],
      riskAnalysis: [
        { category: 'Critical Supplies', riskLevel: 'HIGH', factors: ['Single Supplier', 'Long Lead Time'], mitigation: ['Backup Supplier', 'Safety Stock'], impact: 85 },
        { category: 'Seasonal Items', riskLevel: 'MEDIUM', factors: ['Demand Fluctuation'], mitigation: ['Forecast Adjustment'], impact: 45 }
      ]
    },
    trends: {
      quarterlyTrends: [
        { quarter: 'Q1 2024', value: 421500, spending: 125000, orders: 45, growth: 8.5 },
        { quarter: 'Q2 2024', value: 445200, spending: 132500, orders: 52, growth: 5.6 },
        { quarter: 'Q3 2024', value: 468900, spending: 128750, orders: 48, growth: 5.3 },
        { quarter: 'Q4 2024', value: 485750, spending: 145200, orders: 58, growth: 3.6 }
      ],
      seasonalPatterns: [
        { period: 'Spring', pattern: 'HIGH', variance: 15.2, items: ['Culture Media', 'Hormones'] },
        { period: 'Summer', pattern: 'MEDIUM', variance: 8.7, items: ['Equipment', 'Consumables'] },
        { period: 'Fall', pattern: 'HIGH', variance: 12.8, items: ['Cryo Materials', 'Pharmaceuticals'] },
        { period: 'Winter', pattern: 'LOW', variance: -6.3, items: ['General Supplies'] }
      ],
      cyclicalAnalysis: [
        { cycle: 'Breeding Season', duration: 90, amplitude: 25.5, phase: 'Peak' },
        { cycle: 'Research Cycles', duration: 180, amplitude: 18.2, phase: 'Growth' }
      ]
    }
  };

  useEffect(() => {
    setAnalyticsData(mockAnalyticsData);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleExport = (format: string) => {
    console.log(`Exporting analytics data as ${format}`);
    // Implementation for export functionality
  };

  const renderOverviewDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${analyticsData?.overview.totalValue.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">
                +{analyticsData?.overview.growth.value}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Monthly Spend</p>
              <p className="text-2xl font-bold text-gray-900">
                ${analyticsData?.overview.monthlySpend.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center">
              <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">
                {analyticsData?.overview.growth.spend}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Cost Savings</p>
              <p className="text-2xl font-bold text-gray-900">
                ${analyticsData?.overview.costSavings.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">
                +{analyticsData?.overview.growth.savings}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Turnover Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData?.overview.turnoverRate}x
              </p>
            </div>
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-sm text-blue-600">
                +{analyticsData?.overview.growth.turnover}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Stock Accuracy</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData?.overview.stockAccuracy}%
              </p>
            </div>
            <div className="flex items-center">
              <Target className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">Excellent</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Fill Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData?.overview.fillRate}%
              </p>
            </div>
            <div className="flex items-center">
              <Target className="h-4 w-4 text-blue-500 mr-1" />
              <span className="text-sm text-blue-600">Good</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by Category */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
          <div className="space-y-3">
            {analyticsData?.spending.categoryBreakdown.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' :
                    index === 3 ? 'bg-orange-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">{category.category}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    ${category.amount.toLocaleString()}
                  </span>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">{category.percentage}%</span>
                    {category.trend > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500 ml-1" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Turnover */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Turnover</h3>
          <div className="space-y-4">
            {analyticsData?.inventory.turnoverByCategory.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.category}</p>
                  <p className="text-sm text-gray-500">{item.averageDays} days avg</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-gray-900">{item.turnoverRate}x</span>
                    <Activity className={`h-4 w-4 ml-2 ${
                      item.movement === 'FAST' ? 'text-green-500' :
                      item.movement === 'MEDIUM' ? 'text-yellow-500' : 'text-red-500'
                    }`} />
                  </div>
                  <span className={`text-xs font-medium ${
                    item.movement === 'FAST' ? 'text-green-600' :
                    item.movement === 'MEDIUM' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {item.movement}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPredictiveAnalytics = () => (
    <div className="space-y-6">
      {/* AI Insights Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <Brain className="h-6 w-6 mr-2" />
              AI-Powered Predictive Analytics
            </h2>
            <p className="text-purple-100 mt-1">Machine learning insights for optimal inventory management</p>
          </div>
          <div className="flex space-x-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">ML ENABLED</span>
            <span className="bg-yellow-500 px-3 py-1 rounded-full text-sm font-medium">87% ACCURACY</span>
          </div>
        </div>
      </div>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Demand Forecast */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
            Demand Forecast
          </h3>
          <div className="space-y-3">
            {analyticsData?.predictive.demandForecast.slice(0, 3).map((forecast, index) => (
              <div key={index} className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{forecast.item}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {forecast.confidence}% confident
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Current: {forecast.currentConsumption}</span>
                  <span className="text-blue-600 font-medium">Predicted: {forecast.predictedConsumption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reorder Predictions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Zap className="h-5 w-5 text-orange-500 mr-2" />
            Smart Reorder Alerts
          </h3>
          <div className="space-y-3">
            {analyticsData?.predictive.reorderPredictions.slice(0, 3).map((prediction, index) => (
              <div key={index} className={`p-3 rounded-lg ${
                prediction.priority === 'CRITICAL' ? 'bg-red-50' :
                prediction.priority === 'HIGH' ? 'bg-orange-50' : 'bg-yellow-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{prediction.item}</span>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    prediction.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                    prediction.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {prediction.priority}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Reorder by: {prediction.predictedReorderDate}</p>
                  <p>Suggested: {prediction.suggestedQuantity} units</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            Risk Analysis
          </h3>
          <div className="space-y-3">
            {analyticsData?.predictive.riskAnalysis.map((risk, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${
                risk.riskLevel === 'CRITICAL' ? 'bg-red-50 border-red-500' :
                risk.riskLevel === 'HIGH' ? 'bg-orange-50 border-orange-500' :
                risk.riskLevel === 'MEDIUM' ? 'bg-yellow-50 border-yellow-500' : 'bg-green-50 border-green-500'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{risk.category}</span>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    risk.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                    risk.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                    risk.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {risk.riskLevel}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  <p>Impact: {risk.impact}%</p>
                  <p>Factors: {risk.factors.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderComingSoon = (feature: string) => (
    <div className="text-center py-12">
      <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">{feature}</h3>
      <p className="mt-1 text-sm text-gray-500">Advanced analytics coming soon</p>
      <div className="mt-4">
        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
          Phase 6 Development
        </span>
      </div>
    </div>
  );

  const widgets = [
    { id: 'overview', name: 'Overview Dashboard', icon: BarChart3 },
    { id: 'spending', name: 'Spending Analysis', icon: DollarSign },
    { id: 'inventory', name: 'Inventory Analytics', icon: Package },
    { id: 'suppliers', name: 'Supplier Performance', icon: Users },
    { id: 'predictive', name: 'Predictive Analytics', icon: Brain },
    { id: 'trends', name: 'Trend Analysis', icon: TrendingUp }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Advanced Analytics Dashboard</h2>
            <p className="text-purple-100 mt-1">Comprehensive business intelligence and predictive insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 text-sm"
            >
              <option value="1M">Last Month</option>
              <option value="3M">Last 3 Months</option>
              <option value="6M">Last 6 Months</option>
              <option value="12M">Last 12 Months</option>
              <option value="YTD">Year to Date</option>
            </select>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Widget Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {widgets.map((widget) => {
            const Icon = widget.icon;
            const isActive = activeWidget === widget.id;
            
            return (
              <button
                key={widget.id}
                onClick={() => setActiveWidget(widget.id)}
                className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  isActive
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className={`-ml-0.5 mr-2 h-5 w-5 ${
                  isActive ? 'text-purple-500' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                {widget.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Widget Content */}
      <div>
        {activeWidget === 'overview' && renderOverviewDashboard()}
        {activeWidget === 'spending' && renderComingSoon('Detailed Spending Analysis')}
        {activeWidget === 'inventory' && renderComingSoon('Inventory Performance Analytics')}
        {activeWidget === 'suppliers' && renderComingSoon('Supplier Performance Dashboard')}
        {activeWidget === 'predictive' && renderPredictiveAnalytics()}
        {activeWidget === 'trends' && renderComingSoon('Advanced Trend Analysis')}
      </div>
    </div>
  );
}; 