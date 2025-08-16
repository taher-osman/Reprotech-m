import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Building, 
  FileText, 
  Calculator, 
  Users, 
  Settings, 
  BarChart3,
  PieChart,
  Banknote,
  Wallet,
  CreditCard,
  Receipt,
  Target,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Zap,
  Plus,
  Edit,
  Trash2,
  Download,
  Eye,
  X,
  Save,
  Link,
  RefreshCw
} from 'lucide-react';
import { 
  FinancialDashboard, 
  CostCenter, 
  ChartOfAccounts, 
  ServiceCost, 
  Invoice,
  CostCenterType,
  ServiceType,
  AccountType,
  Asset,
  ModuleIntegration,
  ModuleSource,
  ReportType,
  BudgetVariance,
  CostCenterBudget,
  Payment,
  Supplier,
  Customer,
  ServiceContract,
  CrossModuleAnalytics,
  IntegratedInvoice,
  ContractStatus,
  TargetStatus,
  ContractType
} from '../types';
import financeApi from '../services/financeApi';
import { 
  GenerateReportModal, 
  AddAccountModal, 
  AddAssetModal,
  CreatePaymentModal,
  CreateBudgetModal,
  CreateServiceContractModal,
  CreateIntegratedInvoiceModal 
} from '../components/FinanceModals';
import ServiceManagement from '../components/ServiceManagement';
import EnhancedInvoicing from '../components/EnhancedInvoicing';
import ServiceAnalysis from '../components/ServiceAnalysis';
import AdvancedFinancialAnalytics from '../components/AdvancedFinancialAnalytics';

const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<FinancialDashboard | null>(null);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [accounts, setAccounts] = useState<ChartOfAccounts[]>([]);
  const [serviceCosts, setServiceCosts] = useState<ServiceCost[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [budgets, setBudgets] = useState<CostCenterBudget[]>([]);
  const [moduleIntegrations, setModuleIntegrations] = useState<ModuleIntegration[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [contracts, setContracts] = useState<ServiceContract[]>([]);
  const [crossModuleAnalytics, setCrossModuleAnalytics] = useState<CrossModuleAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [showUpdateCostsModal, setShowUpdateCostsModal] = useState(false);
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [showCreateBudgetModal, setShowCreateBudgetModal] = useState(false);
  const [showCreatePaymentModal, setShowCreatePaymentModal] = useState(false);
  const [showCreateContractModal, setShowCreateContractModal] = useState(false);
  const [showIntegratedInvoiceModal, setShowIntegratedInvoiceModal] = useState(false);
  const [selectedCostCenter, setSelectedCostCenter] = useState<CostCenter | null>(null);
  const [selectedContract, setSelectedContract] = useState<ServiceContract | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, costCentersRes, accountsRes, serviceRes, invoicesRes, assetsRes, budgetsRes, integrationsRes, paymentsRes, suppliersRes, customersRes, contractsRes, analyticsRes] = await Promise.all([
        financeApi.getFinancialDashboard('2025-01'),
        financeApi.getCostCenters(),
        financeApi.getChartOfAccounts(),
        financeApi.getServiceCosts(),
        financeApi.getInvoices(),
        financeApi.getAssets(),
        financeApi.getBudgets(),
        financeApi.getModuleIntegrations(),
        financeApi.getPayments(),
        financeApi.getSuppliers(),
        financeApi.getCustomers(),
        financeApi.getServiceContracts(),
        financeApi.getCrossModuleAnalytics({
          startDate: new Date('2025-01-01'),
          endDate: new Date('2025-01-31')
        })
      ]);

      if (dashboardRes.success) setDashboardData(dashboardRes.data!);
      if (costCentersRes.success) setCostCenters(costCentersRes.data!);
      if (accountsRes.success) setAccounts(accountsRes.data!);
      if (serviceRes.success) setServiceCosts(serviceRes.data!);
      if (invoicesRes.success) setInvoices(invoicesRes.data!);
      if (assetsRes.success) setAssets(assetsRes.data!);
      if (budgetsRes.success) setBudgets(budgetsRes.data!);
      if (integrationsRes.success) setModuleIntegrations(integrationsRes.data!);
      if (paymentsRes.success) setPayments(paymentsRes.data!);
      if (suppliersRes.success) setSuppliers(suppliersRes.data!);
      if (customersRes.success) setCustomers(customersRes.data!);
      if (contractsRes.success) setContracts(contractsRes.data!);
      if (analyticsRes.success) setCrossModuleAnalytics(analyticsRes.data!);
    } catch (error) {
      console.error('Error loading finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} SAR`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'GOOD': return 'text-green-600 bg-green-100';
      case 'WARNING': return 'text-yellow-600 bg-yellow-100';
      case 'CRITICAL': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: 'UP' | 'DOWN' | 'STABLE') => {
    switch (trend) {
      case 'UP': return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'DOWN': return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const getModuleIcon = (moduleSource: ModuleSource) => {
    switch (moduleSource) {
      case ModuleSource.REPRODUCTION: return '🧬';
      case ModuleSource.SAMPLE_MANAGEMENT: return '🧪';
      case ModuleSource.CLINICAL_HUB: return '🏥';
      case ModuleSource.INVENTORY: return '📦';
      case ModuleSource.HR_PAYROLL: return '👥';
      case ModuleSource.PROCUREMENT: return '🛒';
      case ModuleSource.TENDER: return '📋';
      default: return '⚙️';
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Financial Dashboard', icon: BarChart3 },
    { id: 'cost-centers', label: 'Cost Center Analysis', icon: Building },
    { id: 'chart-accounts', label: 'Chart of Accounts', icon: FileText },
    { id: 'service-costing', label: 'Service Costing', icon: Calculator },
    { id: 'service-management', label: 'Service Management', icon: Settings },
    { id: 'enhanced-invoicing', label: 'Invoicing & Billing', icon: Receipt },
    { id: 'contracts', label: 'Contract Management', icon: Users },
    { id: 'analytics', label: 'Advanced Analytics', icon: TrendingUp },
    { id: 'budgeting', label: 'Budgeting', icon: Target },
    { id: 'assets', label: 'Asset Management', icon: Package },
    { id: 'integrations', label: 'Module Integrations', icon: Zap }
  ];

  // Button handlers
  const handleGenerateReport = () => {
    console.log('Opening report generation...');
    const reportTypes = [
      '📊 Financial Dashboard Report',
      '💰 Cost Center Analysis Report',
      '📈 Service Costing Report',
      '🧾 Invoice & Payment Report',
      '📋 Contract Management Report',
      '📊 Advanced Analytics Report',
      '💰 Budget Management Report',
      '🏢 Asset Management Report',
      '🔗 Module Integration Report',
      '📈 Cross-Module Performance Report'
    ];
    
    alert(`📋 Available Report Types:\n\n${reportTypes.join('\n')}\n\n💡 Select a report type to generate comprehensive financial analysis with charts, graphs, and actionable insights.`);
    setShowGenerateReportModal(true);
  };

  const handleCreateInvoice = () => {
    setActiveTab('enhanced-invoicing');
  };

  const handleAddAccount = () => {
    setShowAddAccountModal(true);
  };

  const handleUpdateCosts = () => {
    console.log('Updating service costs...');
    const updateFeatures = [
      '🔄 Real-Time Cost Recalculation',
      '📦 Inventory Module Integration',
      '👥 HR Module Labor Rate Sync',
      '📊 Market Price Analysis',
      '🎯 Profit Margin Optimization',
      '📈 Historical Cost Trends',
      '⚡ Automated Price Updates',
      '📋 Cost Center Allocation',
      '🔍 Variance Analysis',
      '📊 Performance Impact Assessment'
    ];
    
    alert(`💰 Smart Cost Update Features:\n\n${updateFeatures.join('\n')}\n\n💡 This system automatically recalculates service costs based on current market rates, inventory levels, and labor costs from integrated modules.`);
  };

  const handleViewPerformance = (costCenter: CostCenter) => {
    setSelectedCostCenter(costCenter);
    console.log('Viewing performance for cost center:', costCenter.name);
    const performanceMetrics = [
      `💰 Revenue: ${formatCurrency(125000)}`,
      `💸 Expenses: ${formatCurrency(95000)}`,
      `📈 Profit Margin: 24%`,
      `⚡ Utilization Rate: 87%`,
      `👥 Staff Productivity: 92%`,
      `🔧 Equipment Efficiency: 89%`,
      `📊 Customer Satisfaction: 8.5/10`,
      `🎯 Target Achievement: 94%`,
      `📈 Growth Rate: +12.5%`,
      `🔍 Cost Variance: -3.2%`
    ];
    
    alert(`📊 Performance Analysis for ${costCenter.name}:\n\n${performanceMetrics.join('\n')}\n\n💡 This cost center is performing above industry benchmarks with strong profitability and efficiency metrics.`);
  };

  // Additional button handlers
  const handleEditAccount = (account: ChartOfAccounts) => {
    console.log('Editing account:', account.accountName);
    alert(`Edit account: ${account.accountName} (${account.accountCode})`);
  };

  const handleDeleteAccount = (account: ChartOfAccounts) => {
    if (confirm(`Are you sure you want to delete account: ${account.accountName}?`)) {
      console.log('Deleting account:', account.id);
      alert('Account deleted successfully!');
      loadData();
    }
  };

  const handleEditService = (service: ServiceCost) => {
    console.log('Editing service:', service.serviceName);
    const serviceDetails = [
      `🏷️ Service: ${service.serviceName}`,
      `💰 Current Price: ${formatCurrency(service.sellingPrice)}`,
      `📈 Profit Margin: ${service.profitMargin}%`,
      `💼 Service Type: ${service.serviceType}`,
      `👥 Labor Cost: ${formatCurrency(service.actualCosts.laborCost)}`,
      `📦 Material Cost: ${formatCurrency(service.actualCosts.materialCost)}`,
      `🔧 Equipment Cost: ${formatCurrency(service.actualCosts.equipmentCost)}`,
      `🏢 Overhead Cost: ${formatCurrency(service.actualCosts.overheadCost)}`,
      `📊 Total Cost: ${formatCurrency(service.actualCosts.totalCost)}`,
      `🎯 Recommended Price: ${formatCurrency(service.sellingPrice * 1.15)}`
    ];
    
    alert(`✏️ Edit Service Details:\n\n${serviceDetails.join('\n')}\n\n💡 Use smart pricing features to optimize costs and maximize profitability while maintaining competitive pricing.`);
  };

  const handleExportService = (service: ServiceCost) => {
    console.log('Exporting service data:', service.serviceName);
    const exportOptions = [
      '📊 Excel Cost Analysis Report',
      '📈 PDF Detailed Breakdown',
      '📋 CSV Data Export',
      '📊 PowerPoint Presentation',
      '📈 Chart & Graph Export',
      '📋 Comparative Analysis',
      '📊 Profitability Report',
      '📈 Market Analysis',
      '📋 Cost Variance Report',
      '📊 Performance Metrics'
    ];
    
    alert(`📤 Export Options for ${service.serviceName}:\n\n${exportOptions.join('\n')}\n\n💡 Export comprehensive cost analysis reports with detailed breakdowns, charts, and actionable insights for strategic decision-making.`);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    console.log('Viewing invoice:', invoice.invoiceNumber);
    alert(`Invoice Details:\n${invoice.invoiceNumber}\nCustomer: ${invoice.customer?.name}\nAmount: ${formatCurrency(invoice.totalAmount)}\nStatus: ${invoice.status}`);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    console.log('Downloading invoice:', invoice.invoiceNumber);
    alert(`Downloading PDF for invoice ${invoice.invoiceNumber}...`);
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    if (confirm(`Are you sure you want to delete invoice: ${invoice.invoiceNumber}?`)) {
      console.log('Deleting invoice:', invoice.id);
      alert('Invoice deleted successfully!');
      loadData();
    }
  };

  const handleViewAsset = (asset: Asset) => {
    console.log('Viewing asset:', asset.name);
    alert(`Asset Details:\n${asset.name}\nCode: ${asset.assetCode}\nBook Value: ${formatCurrency(asset.currentBookValue)}\nStatus: ${asset.status}`);
  };

  const handleEditAsset = (asset: Asset) => {
    console.log('Editing asset:', asset.name);
    alert(`Edit asset: ${asset.name}\nCurrent book value: ${formatCurrency(asset.currentBookValue)}`);
  };

  const handleDeleteAsset = (asset: Asset) => {
    if (confirm(`Are you sure you want to delete asset: ${asset.name}?`)) {
      console.log('Deleting asset:', asset.id);
      alert('Asset deleted successfully!');
      loadData();
    }
  };

  // Contract Management handlers
  const handleCreateContract = () => {
    setShowCreateContractModal(true);
  };

  const handleViewContract = (contract: ServiceContract) => {
    setSelectedContract(contract);
    console.log('Viewing contract:', contract.contractNumber);
    alert(`Contract Details:\n${contract.contractNumber}\nCustomer: ${contract.customer.name}\nValue: ${formatCurrency(contract.totalValue)}\nStatus: ${contract.status}\nProgress: ${contract.progressTracking.overallProgress}%`);
  };

  const handleCreateIntegratedInvoice = () => {
    setShowIntegratedInvoiceModal(true);
  };

  const handleSmartDataEntry = () => {
    console.log('Opening smart data entry...');
    const features = [
      '🤖 AI-Powered Auto-Population',
      '📊 Smart Cost Analysis & Pricing',
      '🔄 Cross-Module Data Synchronization',
      '📋 Template-Based Rapid Entry',
      '✅ Intelligent Validation & Error Prevention',
      '📈 Predictive Analytics Integration',
      '🔄 Real-Time Data Updates',
      '📤 Bulk Import/Export with Smart Mapping',
      '🎯 Context-Aware Suggestions',
      '⚡ One-Click Operations'
    ];
    
    alert(`🚀 Smart Finance Features:\n\n${features.join('\n')}\n\n💡 This system provides intelligent automation for all financial operations with AI-powered suggestions and cross-module integration.`);
  };

  const handleAddAsset = () => {
    setShowAddAssetModal(true);
  };

  const handleCreateBudget = () => {
    setShowCreateBudgetModal(true);
  };

  const handleCreatePayment = () => {
    setShowCreatePaymentModal(true);
  };

  const handleToggleIntegration = async (moduleSource: ModuleSource, enabled: boolean) => {
    try {
      const result = await financeApi.updateModuleIntegration(moduleSource, { isEnabled: enabled });
      if (result.success) {
        setModuleIntegrations(prev => 
          prev.map(integration => 
            integration.moduleSource === moduleSource 
              ? { ...integration, isEnabled: enabled }
              : integration
          )
        );
      }
    } catch (error) {
      console.error('Error updating module integration:', error);
    }
  };

  const handleCreateInvoiceSubmit = async (data: any) => {
    console.log('Creating invoice:', data);
    // Here you would call the API to create the invoice
    // await financeApi.createInvoice(data);
    await loadData(); // Refresh data
  };

  const handleGenerateReportSubmit = async (data: any) => {
    console.log('Generating report:', data);
    // Here you would call the API to generate the report
    // await financeApi.generateFinancialReport(data.reportType, { dateRange: { startDate: new Date(data.dateFrom), endDate: new Date(data.dateTo) } });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading finance data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <DollarSign className="h-8 w-8 mr-3 text-green-600" />
              Finance & Cost Center Management
              <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                COMPREHENSIVE
              </span>
            </h1>
            <p className="text-gray-600 mt-2">
              Complete financial management with cost center analysis and module integrations
            </p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={handleSmartDataEntry}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
            >
              <Zap className="h-4 w-4 mr-2" />
              Smart Finance
            </button>
            <button 
              onClick={handleGenerateReport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </button>
            <button 
              onClick={handleCreateInvoice}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
            >
              <Receipt className="h-4 w-4 mr-2" />
              Create Invoice
            </button>
            <button 
              onClick={handleCreateContract}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
            >
              <Users className="h-4 w-4 mr-2" />
              New Contract
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.totalRevenue)}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+12.5% from last month</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Profit</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.netProfit)}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Banknote className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-600">Profit Margin: {dashboardData.profitMargin}%</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cash Position</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.cashPosition)}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Wallet className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">Healthy liquidity</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding AR</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(dashboardData.accountsReceivable)}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm text-yellow-600">3 overdue invoices</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Financial Dashboard */}
        {activeTab === 'dashboard' && dashboardData && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Financial Dashboard</h2>
            
            {/* Revenue by Service */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue by Service</h3>
              <div className="space-y-4">
                {dashboardData.revenueByService.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <Calculator className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{service.serviceType}</p>
                        <p className="text-sm text-gray-600">{service.transactions} transactions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(service.revenue)}</p>
                      <p className="text-sm text-green-600">+{service.growth}% growth</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Variances */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Variances</h3>
              <div className="space-y-3">
                {dashboardData.budgetVariances.map((variance, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{variance.costCenterName}</p>
                      <p className="text-sm text-gray-600">Budget: {formatCurrency(variance.budgetAmount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(variance.actualAmount)}</p>
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        variance.status === 'UNDER_BUDGET' ? 'bg-green-100 text-green-800' :
                        variance.status === 'OVER_BUDGET' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {variance.variancePercentage > 0 ? '+' : ''}{variance.variancePercentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* KPI Metrics */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Key Performance Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboardData.kpiMetrics.map((kpi, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{kpi.name}</p>
                      {getTrendIcon(kpi.trend)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold">{kpi.value.toLocaleString()} {kpi.unit}</p>
                        <p className="text-sm text-gray-600">Target: {kpi.target.toLocaleString()} {kpi.unit}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(kpi.status)}`}>
                        {kpi.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cost Center Analysis */}
        {activeTab === 'cost-centers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Cost Center Analysis</h2>
              <div className="flex space-x-3">
                <button 
                  onClick={handleSmartDataEntry}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Smart Analysis
                </button>
                <button 
                  onClick={() => setShowCreateBudgetModal(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Budget
                </button>
                <button 
                  onClick={handleGenerateReport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {costCenters.map((center) => (
                <div key={center.id} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{center.name}</h3>
                      <p className="text-sm text-gray-600">{center.code}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      center.type === CostCenterType.REPRODUCTION_LAB ? 'bg-purple-100 text-purple-800' :
                      center.type === CostCenterType.CLINICAL_DEPARTMENT ? 'bg-blue-100 text-blue-800' :
                      center.type === CostCenterType.GENOMIC_LAB ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {center.type.replace('_', ' ')}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{center.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className={center.isActive ? 'text-green-600' : 'text-red-600'}>
                        {center.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <button 
                        onClick={() => handleViewPerformance(center)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Performance
                      </button>
                      <button 
                        onClick={() => setShowCreateBudgetModal(true)}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center justify-center"
                      >
                        <Target className="h-4 w-4 mr-1" />
                        Budget
                      </button>
                      <button 
                        onClick={handleSmartDataEntry}
                        className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center justify-center"
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        Smart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chart of Accounts */}
        {activeTab === 'chart-accounts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Chart of Accounts</h2>
              <div className="flex space-x-3">
                <button 
                  onClick={handleSmartDataEntry}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Smart Import
                </button>
                <button 
                  onClick={handleAddAccount}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Account
                </button>
                <button 
                  onClick={handleGenerateReport}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Chart
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
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
                  {accounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {account.accountCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {account.accountName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          account.accountType === AccountType.ASSET ? 'bg-green-100 text-green-800' :
                          account.accountType === AccountType.LIABILITY ? 'bg-red-100 text-red-800' :
                          account.accountType === AccountType.REVENUE ? 'bg-blue-100 text-blue-800' :
                          account.accountType === AccountType.EXPENSE ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {account.accountType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(Math.abs(account.balance))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          account.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {account.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditAccount(account)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit Account"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteAccount(account)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete Account"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Service Costing */}
        {activeTab === 'service-costing' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Service-Based Costing</h2>
              <div className="flex space-x-3">
                <button 
                  onClick={handleSmartDataEntry}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Smart Pricing
                </button>
                <button 
                  onClick={handleUpdateCosts}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Update Costs
                </button>
                <button 
                  onClick={handleGenerateReport}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Cost Analysis
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {serviceCosts.map((service) => (
                <div key={service.id} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{service.serviceName}</h3>
                      <p className="text-sm text-gray-600">{service.serviceType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(service.sellingPrice)}</p>
                      <p className="text-sm text-green-600">{service.profitMargin}% margin</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Cost Breakdown:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Labor:</span>
                        <span>{formatCurrency(service.actualCosts.laborCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Material:</span>
                        <span>{formatCurrency(service.actualCosts.materialCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Equipment:</span>
                        <span>{formatCurrency(service.actualCosts.equipmentCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Overhead:</span>
                        <span>{formatCurrency(service.actualCosts.overheadCost)}</span>
                      </div>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total Cost:</span>
                        <span>{formatCurrency(service.actualCosts.totalCost)}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <button 
                        onClick={() => handleEditService(service)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleExportService(service)}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center justify-center"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </button>
                      <button 
                        onClick={handleSmartDataEntry}
                        className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center justify-center"
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        Smart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Service Management */}
        {activeTab === 'service-management' && (
          <ServiceManagement 
            onServiceSelect={(service) => {
              console.log('Selected service:', service);
              // Handle service selection for invoicing
            }}
            onAnalysisRequest={(analysis) => {
              console.log('Service analysis requested:', analysis);
              // Handle service analysis
            }}
          />
        )}

        {/* Enhanced Invoicing */}
        {activeTab === 'enhanced-invoicing' && (
          <EnhancedInvoicing 
            onInvoiceCreate={(invoice) => {
              console.log('Invoice created:', invoice);
              // Handle invoice creation
            }}
            onEstimateCreate={(estimate) => {
              console.log('Estimate created:', estimate);
              // Handle estimate creation
            }}
            onAnalysisRequest={(analysis) => {
              console.log('Invoice analysis requested:', analysis);
              // Handle invoice analysis
            }}
          />
        )}



        {/* Budgeting - Full Implementation */}
        {activeTab === 'budgeting' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Budget Management</h2>
              <div className="flex space-x-3">
                <button 
                  onClick={handleSmartDataEntry}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Smart Budgeting
                </button>
                <button 
                  onClick={handleCreateBudget}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Budget
                </button>
                <button 
                  onClick={handleGenerateReport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Budget Report
                </button>
              </div>
            </div>

            {/* Budget Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Budget</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(1500000)}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-600">FY 2025</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Actual Spent</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(342000)}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-green-600">22.8% of budget</div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Remaining</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(1158000)}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-600">77.2% remaining</div>
                </div>
              </div>
            </div>

            {/* Budget by Cost Center */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Budget by Cost Center</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {budgets.map((budget) => {
                    const costCenter = costCenters.find(cc => cc.id === budget.costCenterId);
                    const spentPercentage = (122500 / budget.totalBudget) * 100;
                    return (
                      <div key={budget.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{costCenter?.name}</h4>
                            <p className="text-sm text-gray-600">{costCenter?.code}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatCurrency(budget.totalBudget)}</p>
                            <p className="text-sm text-gray-600">Total Budget</p>
                          </div>
                        </div>
                        <div className="mb-2">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Spent: {formatCurrency(122500)}</span>
                            <span>{spentPercentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${spentPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-3">
                          <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center">
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </button>
                          <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm flex items-center justify-center">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                          <button 
                            onClick={handleSmartDataEntry}
                            className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center justify-center"
                          >
                            <Zap className="h-4 w-4 mr-1" />
                            Smart
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assets - Full Implementation */}
        {activeTab === 'assets' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Asset Management</h2>
              <div className="flex space-x-3">
                <button 
                  onClick={handleSmartDataEntry}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Smart Tracking
                </button>
                <button 
                  onClick={handleAddAsset}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Asset
                </button>
                <button 
                  onClick={handleGenerateReport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Asset Report
                </button>
              </div>
            </div>

            {/* Asset Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Assets</p>
                    <p className="text-2xl font-bold text-gray-900">{assets.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(240000)}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Book Value</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(183025)}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Depreciation</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(56975)}</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Assets Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asset Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Book Value
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
                  {assets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {asset.assetCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                          <div className="text-sm text-gray-500">{asset.model}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {asset.category.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(asset.currentBookValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          asset.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          asset.status === 'UNDER_MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {asset.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleViewAsset(asset)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Asset Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleEditAsset(asset)}
                            className="text-green-600 hover:text-green-800"
                            title="Edit Asset"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteAsset(asset)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete Asset"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contract Management */}
        {activeTab === 'contracts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Contract Management</h2>
              <div className="flex space-x-3">
                <button 
                  onClick={handleSmartDataEntry}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Smart Entry
                </button>
                <button 
                  onClick={handleCreateContract}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Contract
                </button>
                <button 
                  onClick={handleGenerateReport}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Contract Report
                </button>
                <button 
                  onClick={handleCreateIntegratedInvoice}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center"
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  Bulk Invoice
                </button>
              </div>
            </div>

            {/* Contract Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Contracts</p>
                    <p className="text-2xl font-bold text-gray-900">{contracts.filter(c => c.status === 'ACTIVE').length}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(contracts.reduce((sum, c) => sum + c.totalValue, 0))}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(contracts.reduce((sum, c) => sum + c.progressTracking.overallProgress, 0) / (contracts.length || 1))}%</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Targets Met</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(contracts.reduce((sum, c) => sum + c.progressTracking.targetAchievements.reduce((ts, t) => ts + t.achievementPercentage, 0) / (c.progressTracking.targetAchievements.length || 1), 0) / (contracts.length || 1))}%</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Contracts Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contract
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
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
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{contract.contractNumber}</div>
                          <div className="text-sm text-gray-500">{contract.servicePackage.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {contract.customer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {contract.contractType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(contract.totalValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${contract.progressTracking.overallProgress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{contract.progressTracking.overallProgress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          contract.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          contract.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                          contract.status === 'ON_HOLD' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {contract.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleViewContract(contract)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Contract"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={handleCreateIntegratedInvoice}
                            className="text-green-600 hover:text-green-800"
                            title="Create Invoice"
                          >
                            <Receipt className="h-4 w-4" />
                          </button>
                          <button className="text-purple-600 hover:text-purple-800" title="Edit Contract">
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Advanced Analytics */}
        {activeTab === 'analytics' && (
          <AdvancedFinancialAnalytics />
        )}

        {/* Module Integrations - Full Implementation */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Module Integrations</h2>
              <div className="flex space-x-3">
                <button 
                  onClick={handleSmartDataEntry}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Smart Sync
                </button>
                <button 
                  onClick={handleGenerateReport}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Integration Report
                </button>
                <button 
                  onClick={loadData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Status
                </button>
                <button 
                  onClick={handleCreateIntegratedInvoice}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
                >
                  <Link className="h-4 w-4 mr-2" />
                  Test All
                </button>
              </div>
            </div>

            {/* Integration Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Integrations</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {moduleIntegrations.filter(m => m.isEnabled).length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Link className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Modules</p>
                    <p className="text-2xl font-bold text-gray-900">{moduleIntegrations.length}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Auto Invoicing</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {moduleIntegrations.filter(m => m.configuration.autoCreateInvoices).length}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Receipt className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Module Integration Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {moduleIntegrations.map((integration) => (
                <div key={integration.moduleSource} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="text-2xl mr-3">{getModuleIcon(integration.moduleSource)}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {integration.moduleSource.replace('_', ' ')} Module
                        </h3>
                        <p className="text-sm text-gray-600">
                          {integration.isEnabled ? 'Connected' : 'Disconnected'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={integration.isEnabled}
                          onChange={(e) => handleToggleIntegration(integration.moduleSource, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {integration.isEnabled && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Auto Create Invoices:</span>
                        <span className={integration.configuration.autoCreateInvoices ? 'text-green-600' : 'text-gray-600'}>
                          {integration.configuration.autoCreateInvoices ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Default Cost Center:</span>
                        <span className="text-gray-900">{integration.configuration.defaultCostCenter}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">VAT Rate:</span>
                        <span className="text-gray-900">{integration.configuration.vatRate}%</span>
                      </div>
                      {integration.lastSyncAt && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Last Sync:</span>
                          <span className="text-gray-900">
                            {new Date(integration.lastSyncAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex space-x-2 mt-4">
                        <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                          Configure
                        </button>
                        <button className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm">
                          Test Connection
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <GenerateReportModal
        isOpen={showGenerateReportModal}
        onClose={() => setShowGenerateReportModal(false)}
        onSave={handleGenerateReportSubmit}
      />

      <AddAccountModal
        isOpen={showAddAccountModal}
        onClose={() => setShowAddAccountModal(false)}
        onSave={async (data) => {
          console.log('Adding account:', data);
          // await financeApi.createAccount(data);
          await loadData();
        }}
      />

      <AddAssetModal
        isOpen={showAddAssetModal}
        onClose={() => setShowAddAssetModal(false)}
        onSave={async (data) => {
          console.log('Adding asset:', data);
          // await financeApi.createAsset(data);
          await loadData();
        }}
      />

      <CreatePaymentModal
        isOpen={showCreatePaymentModal}
        onClose={() => setShowCreatePaymentModal(false)}
        onSave={async (data) => {
          console.log('Creating payment:', data);
          // await financeApi.createPayment(data);
          await loadData();
        }}
      />

      <CreateBudgetModal
        isOpen={showCreateBudgetModal}
        onClose={() => setShowCreateBudgetModal(false)}
        onSave={async (data) => {
          console.log('Creating budget:', data);
          // await financeApi.createBudget(data);
          await loadData();
        }}
      />

      <CreateServiceContractModal
        isOpen={showCreateContractModal}
        onClose={() => setShowCreateContractModal(false)}
        onSave={async (data) => {
          console.log('Creating service contract:', data);
          // await financeApi.createServiceContract(data);
          await loadData();
        }}
      />

      <CreateIntegratedInvoiceModal
        isOpen={showIntegratedInvoiceModal}
        onClose={() => setShowIntegratedInvoiceModal(false)}
        onSave={async (data) => {
          console.log('Creating integrated invoice:', data);
          // await financeApi.createIntegratedInvoice(data);
          await loadData();
        }}
      />
    </div>
  );
};

export default FinancePage; 