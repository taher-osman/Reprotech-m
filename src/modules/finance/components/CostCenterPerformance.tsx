import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Calendar,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Building,
  Calculator,
  PieChart
} from 'lucide-react';
import { 
  CostCenter, 
  CostCenterStats, 
  CostCenterBudget,
  CostCenterKPI 
} from '../types';
import financeApi from '../services/financeApi';

interface CostCenterPerformanceProps {
  costCenter: CostCenter;
  onClose: () => void;
}

const CostCenterPerformance: React.FC<CostCenterPerformanceProps> = ({
  costCenter,
  onClose
}) => {
  const [stats, setStats] = useState<CostCenterStats | null>(null);
  const [budget, setBudget] = useState<CostCenterBudget | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('2025-01');

  useEffect(() => {
    loadCostCenterData();
  }, [costCenter.id, selectedPeriod]);

  const loadCostCenterData = async () => {
    try {
      setLoading(true);
      const [statsRes, budgetRes] = await Promise.all([
        financeApi.getCostCenterStats(costCenter.id, selectedPeriod),
        financeApi.getCostCenterBudget(costCenter.id, 2025)
      ]);

      if (statsRes.success) setStats(statsRes.data!);
      if (budgetRes.success) setBudget(budgetRes.data!);
    } catch (error) {
      console.error('Error loading cost center data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} SAR`;
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-green-600 bg-green-100';
    if (variance < -10) return 'text-red-600 bg-red-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getTrendIcon = (trend: 'UP' | 'DOWN' | 'STABLE') => {
    switch (trend) {
      case 'UP': return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'DOWN': return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getKPIStatus = (kpi: CostCenterKPI) => {
    const achievementRate = (kpi.value / kpi.target) * 100;
    if (achievementRate >= 95) return { color: 'text-green-600 bg-green-100', label: 'Excellent' };
    if (achievementRate >= 80) return { color: 'text-blue-600 bg-blue-100', label: 'Good' };
    if (achievementRate >= 60) return { color: 'text-yellow-600 bg-yellow-100', label: 'Fair' };
    return { color: 'text-red-600 bg-red-100', label: 'Needs Attention' };
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading cost center performance...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <Building className="h-6 w-6 mr-2" />
                {costCenter.name} Performance
              </h2>
              <p className="text-blue-100 mt-1">{costCenter.description}</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-blue-500 text-white rounded-lg px-3 py-2 border border-blue-400"
              >
                <option value="2025-01">January 2025</option>
                <option value="2024-12">December 2024</option>
                <option value="2024-11">November 2024</option>
              </select>
              <button
                onClick={onClose}
                className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Performance Overview */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-900">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="mt-3 flex items-center">
                  <span className="text-sm text-green-600">vs budget variance</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Gross Profit</p>
                    <p className="text-2xl font-bold text-blue-900">{formatCurrency(stats.grossProfit)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mt-3 flex items-center">
                  <span className="text-sm text-blue-600">{stats.profitMargin.toFixed(1)}% margin</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Services Delivered</p>
                    <p className="text-2xl font-bold text-purple-900">{stats.servicesDelivered}</p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-600" />
                </div>
                <div className="mt-3 flex items-center">
                  <span className="text-sm text-purple-600">{stats.utilizationRate.toFixed(1)}% utilization</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Cost per Service</p>
                    <p className="text-2xl font-bold text-orange-900">{formatCurrency(stats.costPerService)}</p>
                  </div>
                  <Calculator className="h-8 w-8 text-orange-600" />
                </div>
                <div className="mt-3 flex items-center">
                  <span className={`text-sm ${stats.budgetVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.budgetVariance >= 0 ? '+' : ''}{formatCurrency(stats.budgetVariance)} vs budget
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cost Breakdown */}
            {stats && (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                  Cost Breakdown
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-blue-500 rounded-full mr-3"></div>
                      <span className="font-medium">Staff Costs</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(stats.staffCosts)}</p>
                      <p className="text-sm text-gray-600">
                        {((stats.staffCosts / stats.totalExpenses) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="font-medium">Material Costs</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(stats.materialCosts)}</p>
                      <p className="text-sm text-gray-600">
                        {((stats.materialCosts / stats.totalExpenses) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-purple-500 rounded-full mr-3"></div>
                      <span className="font-medium">Equipment Costs</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(stats.equipmentCosts)}</p>
                      <p className="text-sm text-gray-600">
                        {((stats.equipmentCosts / stats.totalExpenses) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-orange-500 rounded-full mr-3"></div>
                      <span className="font-medium">Overhead Costs</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(stats.overheadCosts)}</p>
                      <p className="text-sm text-gray-600">
                        {((stats.overheadCosts / stats.totalExpenses) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* KPI Performance */}
            {stats && (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-green-600" />
                  Key Performance Indicators
                </h3>
                <div className="space-y-4">
                  {stats.kpiMetrics.map((kpi, index) => {
                    const status = getKPIStatus(kpi);
                    return (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-900">{kpi.name}</span>
                            {getTrendIcon(kpi.trend)}
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-semibold text-gray-900">
                              {kpi.value.toLocaleString()} {kpi.unit}
                            </p>
                            <p className="text-sm text-gray-600">
                              Target: {kpi.target.toLocaleString()} {kpi.unit}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm font-medium ${kpi.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {kpi.variance >= 0 ? '+' : ''}{kpi.variance.toLocaleString()} {kpi.unit}
                            </p>
                            <p className="text-xs text-gray-500">variance</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Budget Analysis */}
          {budget && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                Monthly Budget Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {budget.monthlyAllocations.slice(0, 6).map((month, index) => {
                  const variance = month.actualAmount - month.budgetAmount;
                  const variancePercentage = (variance / month.budgetAmount) * 100;
                  
                  return (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {new Date(2025, month.month - 1).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getVarianceColor(variancePercentage)}`}>
                          {variancePercentage > 0 ? '+' : ''}{variancePercentage.toFixed(1)}%
                        </div>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Budget:</span>
                          <span>{formatCurrency(month.budgetAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Actual:</span>
                          <span>{formatCurrency(month.actualAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Forecast:</span>
                          <span>{formatCurrency(month.forecastAmount)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Items */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Recommended Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                  <span className="font-medium text-gray-900">Opportunities</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Optimize staff utilization during peak hours</li>
                  <li>• Negotiate better rates with material suppliers</li>
                  <li>• Implement energy-saving measures</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                  <span className="font-medium text-gray-900">Attention Required</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Review equipment maintenance costs</li>
                  <li>• Monitor overtime expenses closely</li>
                  <li>• Update service pricing for Q2</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostCenterPerformance; 