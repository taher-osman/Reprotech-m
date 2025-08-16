import { 
  CostCenter, 
  CostCenterStats, 
  CostCenterBudget, 
  ServiceCost,
  ModuleIntegration,
  CrossModuleAnalytics,
  BudgetVariance
} from '../types';

// Enhanced Analytics Types
export interface AdvancedFinancialMetrics {
  performanceMetrics: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
    revenueGrowthRate: number;
    expenseGrowthRate: number;
    costPerService: number;
    revenuePerEmployee: number;
    operatingRatio: number;
    returnOnAssets: number;
  };

  costCenterAnalysis: {
    mostProfitable: CostCenter;
    leastProfitable: CostCenter;
    highestUtilization: CostCenter;
    lowestUtilization: CostCenter;
    budgetVarianceLeader: CostCenter;
    budgetVarianceLaggard: CostCenter;
  };

  trendAnalysis: {
    monthlyRevenueTrend: MonthlyMetric[];
    monthlyExpenseTrend: MonthlyMetric[];
    quarterlyProfitability: QuarterlyMetric[];
    yearOverYearComparison: YearOverYearMetric;
    forecastedMetrics: ForecastMetric[];
  };

  moduleIntegrationInsights: {
    revenueByModule: ModuleRevenueBreakdown[];
    costsByModule: ModuleCostBreakdown[];
    efficiencyByModule: ModuleEfficiencyMetric[];
    integrationHealth: IntegrationHealthStatus[];
  };

  advancedKPIs: {
    customerAcquisitionCost: number;
    customerLifetimeValue: number;
    averageServiceValue: number;
    serviceUtilizationRate: number;
    equipmentROI: number;
    staffProductivity: number;
    energyEfficiency: number;
    maintenanceCostRatio: number;
  };
}

export interface MonthlyMetric {
  month: string;
  value: number;
  variance: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  budget: number;
  forecast: number;
}

export interface QuarterlyMetric {
  quarter: string;
  revenue: number;
  expenses: number;
  profit: number;
  margin: number;
  budgetVariance: number;
}

export interface YearOverYearMetric {
  currentYear: number;
  previousYear: number;
  revenueGrowth: number;
  expenseGrowth: number;
  profitGrowth: number;
  marginImprovement: number;
}

export interface ForecastMetric {
  period: string;
  forecastedRevenue: number;
  forecastedExpenses: number;
  forecastedProfit: number;
  confidenceLevel: number;
  scenario: 'optimistic' | 'realistic' | 'pessimistic';
}

export interface ModuleRevenueBreakdown {
  moduleName: string;
  revenue: number;
  percentage: number;
  growthRate: number;
  averageServiceValue: number;
  serviceCount: number;
}

export interface ModuleCostBreakdown {
  moduleName: string;
  costs: number;
  percentage: number;
  costPerService: number;
  efficiencyRating: number;
  optimization: string[];
}

export interface ModuleEfficiencyMetric {
  moduleName: string;
  revenuePerEmployee: number;
  costPerService: number;
  utilizationRate: number;
  customerSatisfaction: number;
  errorRate: number;
  processingTime: number;
}

export interface IntegrationHealthStatus {
  moduleName: string;
  integrationScore: number;
  dataQuality: number;
  syncFrequency: string;
  lastSyncStatus: 'success' | 'failed' | 'partial';
  issuesCount: number;
  uptime: number;
}

export interface CostCenterBenchmarking {
  costCenterId: string;
  costCenterName: string;
  industryBenchmarks: {
    profitMarginBenchmark: number;
    utilizationBenchmark: number;
    costPerServiceBenchmark: number;
    revenueGrowthBenchmark: number;
  };
  currentPerformance: {
    profitMargin: number;
    utilization: number;
    costPerService: number;
    revenueGrowth: number;
  };
  benchmarkComparison: {
    profitMarginVsBenchmark: number;
    utilizationVsBenchmark: number;
    costPerServiceVsBenchmark: number;
    revenueGrowthVsBenchmark: number;
  };
  recommendations: string[];
  riskFactors: string[];
}

// Financial Analytics Service Class
class FinancialAnalyticsService {
  private baseUrl = '/api/finance/analytics';

  async getAdvancedFinancialMetrics(period: string): Promise<AdvancedFinancialMetrics> {
    // Mock implementation - replace with actual API call
    return {
      performanceMetrics: {
        totalRevenue: 2450000,
        totalExpenses: 1850000,
        netProfit: 600000,
        profitMargin: 24.5,
        revenueGrowthRate: 12.3,
        expenseGrowthRate: 8.7,
        costPerService: 285,
        revenuePerEmployee: 125000,
        operatingRatio: 75.5,
        returnOnAssets: 18.2
      },
      costCenterAnalysis: {
        mostProfitable: mockCostCenters[0],
        leastProfitable: mockCostCenters[2],
        highestUtilization: mockCostCenters[1],
        lowestUtilization: mockCostCenters[3],
        budgetVarianceLeader: mockCostCenters[0],
        budgetVarianceLaggard: mockCostCenters[2]
      },
      trendAnalysis: {
        monthlyRevenueTrend: mockMonthlyMetrics,
        monthlyExpenseTrend: mockExpenseMetrics,
        quarterlyProfitability: mockQuarterlyMetrics,
        yearOverYearComparison: mockYearOverYear,
        forecastedMetrics: mockForecastMetrics
      },
      moduleIntegrationInsights: {
        revenueByModule: mockModuleRevenue,
        costsByModule: mockModuleCosts,
        efficiencyByModule: mockModuleEfficiency,
        integrationHealth: mockIntegrationHealth
      },
      advancedKPIs: {
        customerAcquisitionCost: 1250,
        customerLifetimeValue: 25000,
        averageServiceValue: 850,
        serviceUtilizationRate: 87.5,
        equipmentROI: 34.5,
        staffProductivity: 92.3,
        energyEfficiency: 78.9,
        maintenanceCostRatio: 12.5
      }
    };
  }

  async getCostCenterBenchmarking(costCenterId: string): Promise<CostCenterBenchmarking> {
    return {
      costCenterId,
      costCenterName: 'Reproductive Medicine',
      industryBenchmarks: {
        profitMarginBenchmark: 20.0,
        utilizationBenchmark: 80.0,
        costPerServiceBenchmark: 300,
        revenueGrowthBenchmark: 8.0
      },
      currentPerformance: {
        profitMargin: 24.5,
        utilization: 87.5,
        costPerService: 285,
        revenueGrowth: 12.3
      },
      benchmarkComparison: {
        profitMarginVsBenchmark: 4.5,
        utilizationVsBenchmark: 7.5,
        costPerServiceVsBenchmark: -15,
        revenueGrowthVsBenchmark: 4.3
      },
      recommendations: [
        'Maintain current performance levels as they exceed industry benchmarks',
        'Consider expanding capacity to capture additional market demand',
        'Implement cost optimization strategies to further improve margins',
        'Invest in staff training to maintain high utilization rates'
      ],
      riskFactors: [
        'Market saturation risk in reproductive medicine sector',
        'Regulatory changes affecting service delivery',
        'Competition from new market entrants'
      ]
    };
  }

  async getRealTimeMetrics(): Promise<any> {
    return {
      currentDayRevenue: 8500,
      currentDayExpenses: 6200,
      activeServices: 15,
      utilizationRate: 89.2,
      averageWaitTime: 12,
      customerSatisfaction: 4.7,
      alertsCount: 3,
      systemUptime: 99.8
    };
  }

  async getFinancialHealthScore(): Promise<any> {
    return {
      overallScore: 87,
      components: {
        profitability: 92,
        liquidity: 85,
        efficiency: 89,
        growth: 84,
        risk: 78
      },
      trend: 'improving',
      recommendations: [
        'Focus on improving cash flow management',
        'Consider diversifying revenue streams',
        'Implement stricter cost controls'
      ]
    };
  }
}

// Mock Data
const mockCostCenters: CostCenter[] = [
  {
    id: '1',
    name: 'Reproductive Medicine',
    description: 'Advanced reproductive services',
    type: 'REVENUE',
    isActive: true,
    managerName: 'Dr. Ahmed Hassan',
    departmentCode: 'RM001',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-15'
  },
  {
    id: '2', 
    name: 'Laboratory Services',
    description: 'Clinical laboratory and diagnostics',
    type: 'REVENUE',
    isActive: true,
    managerName: 'Dr. Sarah Wilson',
    departmentCode: 'LAB001',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-15'
  },
  {
    id: '3',
    name: 'Administrative Services',
    description: 'Administrative and support functions',
    type: 'COST',
    isActive: true,
    managerName: 'Michael Chen',
    departmentCode: 'ADM001',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-15'
  },
  {
    id: '4',
    name: 'Research & Development',
    description: 'R&D and innovation projects',
    type: 'COST',
    isActive: true,
    managerName: 'Prof. Lisa Rodriguez',
    departmentCode: 'RND001',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-15'
  }
];

const mockMonthlyMetrics: MonthlyMetric[] = [
  { month: 'Jan 2025', value: 245000, variance: 12.5, trend: 'UP', budget: 230000, forecast: 250000 },
  { month: 'Feb 2025', value: 268000, variance: 8.7, trend: 'UP', budget: 245000, forecast: 270000 },
  { month: 'Mar 2025', value: 252000, variance: -3.2, trend: 'DOWN', budget: 260000, forecast: 255000 },
  { month: 'Apr 2025', value: 289000, variance: 15.8, trend: 'UP', budget: 250000, forecast: 295000 },
  { month: 'May 2025', value: 301000, variance: 9.4, trend: 'UP', budget: 275000, forecast: 305000 },
  { month: 'Jun 2025', value: 285000, variance: -2.1, trend: 'DOWN', budget: 290000, forecast: 288000 }
];

const mockExpenseMetrics: MonthlyMetric[] = [
  { month: 'Jan 2025', value: 185000, variance: 8.2, trend: 'UP', budget: 175000, forecast: 188000 },
  { month: 'Feb 2025', value: 192000, variance: 6.1, trend: 'UP', budget: 180000, forecast: 195000 },
  { month: 'Mar 2025', value: 198000, variance: 4.5, trend: 'UP', budget: 190000, forecast: 200000 },
  { month: 'Apr 2025', value: 205000, variance: 7.8, trend: 'UP', budget: 195000, forecast: 208000 },
  { month: 'May 2025', value: 212000, variance: 5.2, trend: 'UP', budget: 205000, forecast: 215000 },
  { month: 'Jun 2025', value: 208000, variance: -1.9, trend: 'DOWN', budget: 210000, forecast: 210000 }
];

const mockQuarterlyMetrics: QuarterlyMetric[] = [
  { quarter: 'Q1 2025', revenue: 765000, expenses: 575000, profit: 190000, margin: 24.8, budgetVariance: 8.5 },
  { quarter: 'Q4 2024', revenue: 712000, expenses: 545000, profit: 167000, margin: 23.5, budgetVariance: 5.2 },
  { quarter: 'Q3 2024', revenue: 698000, expenses: 538000, profit: 160000, margin: 22.9, budgetVariance: 3.1 },
  { quarter: 'Q2 2024', revenue: 689000, expenses: 532000, profit: 157000, margin: 22.8, budgetVariance: 2.8 }
];

const mockYearOverYear: YearOverYearMetric = {
  currentYear: 2025,
  previousYear: 2024,
  revenueGrowth: 12.3,
  expenseGrowth: 8.7,
  profitGrowth: 18.5,
  marginImprovement: 2.1
};

const mockForecastMetrics: ForecastMetric[] = [
  { period: 'Jul 2025', forecastedRevenue: 295000, forecastedExpenses: 215000, forecastedProfit: 80000, confidenceLevel: 85, scenario: 'realistic' },
  { period: 'Aug 2025', forecastedRevenue: 305000, forecastedExpenses: 220000, forecastedProfit: 85000, confidenceLevel: 82, scenario: 'realistic' },
  { period: 'Sep 2025', forecastedRevenue: 315000, forecastedExpenses: 225000, forecastedProfit: 90000, confidenceLevel: 78, scenario: 'optimistic' }
];

const mockModuleRevenue: ModuleRevenueBreakdown[] = [
  { moduleName: 'Reproductive Medicine', revenue: 850000, percentage: 34.7, growthRate: 15.2, averageServiceValue: 1250, serviceCount: 680 },
  { moduleName: 'Laboratory Services', revenue: 650000, percentage: 26.5, growthRate: 8.9, averageServiceValue: 425, serviceCount: 1530 },
  { moduleName: 'Biobank Services', revenue: 420000, percentage: 17.1, growthRate: 22.1, averageServiceValue: 850, serviceCount: 495 },
  { moduleName: 'Genomic Analysis', revenue: 380000, percentage: 15.5, growthRate: 18.7, averageServiceValue: 2200, serviceCount: 173 },
  { moduleName: 'Clinical Hub', revenue: 150000, percentage: 6.1, growthRate: 12.3, averageServiceValue: 300, serviceCount: 500 }
];

const mockModuleCosts: ModuleCostBreakdown[] = [
  { moduleName: 'Reproductive Medicine', costs: 620000, percentage: 33.5, costPerService: 912, efficiencyRating: 8.7, optimization: ['Staff scheduling optimization', 'Equipment utilization improvement'] },
  { moduleName: 'Laboratory Services', costs: 485000, percentage: 26.2, costPerService: 317, efficiencyRating: 9.1, optimization: ['Automation implementation', 'Batch processing optimization'] },
  { moduleName: 'Biobank Services', costs: 312000, percentage: 16.9, costPerService: 630, efficiencyRating: 8.4, optimization: ['Energy efficiency improvements', 'Storage optimization'] },
  { moduleName: 'Genomic Analysis', costs: 285000, percentage: 15.4, costPerService: 1647, efficiencyRating: 7.9, optimization: ['Technology upgrade', 'Process standardization'] },
  { moduleName: 'Clinical Hub', costs: 148000, percentage: 8.0, costPerService: 296, efficiencyRating: 8.8, optimization: ['Digital workflow implementation'] }
];

const mockModuleEfficiency: ModuleEfficiencyMetric[] = [
  { moduleName: 'Reproductive Medicine', revenuePerEmployee: 142000, costPerService: 912, utilizationRate: 87.5, customerSatisfaction: 4.8, errorRate: 0.5, processingTime: 45 },
  { moduleName: 'Laboratory Services', revenuePerEmployee: 108000, costPerService: 317, utilizationRate: 92.1, customerSatisfaction: 4.6, errorRate: 0.3, processingTime: 12 },
  { moduleName: 'Biobank Services', revenuePerEmployee: 105000, costPerService: 630, utilizationRate: 78.9, customerSatisfaction: 4.7, errorRate: 0.2, processingTime: 25 },
  { moduleName: 'Genomic Analysis', revenuePerEmployee: 95000, costPerService: 1647, utilizationRate: 68.5, customerSatisfaction: 4.9, errorRate: 0.1, processingTime: 120 },
  { moduleName: 'Clinical Hub', revenuePerEmployee: 75000, costPerService: 296, utilizationRate: 85.2, customerSatisfaction: 4.5, errorRate: 0.4, processingTime: 18 }
];

const mockIntegrationHealth: IntegrationHealthStatus[] = [
  { moduleName: 'Reproductive Medicine', integrationScore: 95, dataQuality: 98, syncFrequency: 'Real-time', lastSyncStatus: 'success', issuesCount: 0, uptime: 99.9 },
  { moduleName: 'Laboratory Services', integrationScore: 92, dataQuality: 94, syncFrequency: 'Every 5 minutes', lastSyncStatus: 'success', issuesCount: 1, uptime: 99.7 },
  { moduleName: 'Biobank Services', integrationScore: 88, dataQuality: 91, syncFrequency: 'Every 15 minutes', lastSyncStatus: 'success', issuesCount: 2, uptime: 99.5 },
  { moduleName: 'Genomic Analysis', integrationScore: 85, dataQuality: 89, syncFrequency: 'Hourly', lastSyncStatus: 'partial', issuesCount: 3, uptime: 98.8 },
  { moduleName: 'Clinical Hub', integrationScore: 90, dataQuality: 93, syncFrequency: 'Every 10 minutes', lastSyncStatus: 'success', issuesCount: 1, uptime: 99.6 }
];

export const financialAnalyticsService = new FinancialAnalyticsService();
export default financialAnalyticsService;
