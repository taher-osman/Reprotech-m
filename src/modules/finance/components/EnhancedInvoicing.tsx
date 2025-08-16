import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  BarChart3, 
  Target, 
  TrendingUp, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  Copy,
  Zap,
  Calculator,
  Receipt,
  CreditCard,
  Send,
  Calendar,
  Users,
  Building2,
  Package,
  Settings,
  PieChart,
  LineChart,
  Activity,
  Target as TargetIcon,
  Award,
  TrendingDown,
  AlertTriangle,
  Info
} from 'lucide-react';
import {
  Invoice,
  InvoiceItem,
  ServiceConfiguration,
  ServiceCostBreakdown,
  ServicePricing,
  ServiceEstimate,
  ServiceEstimateItem,
  ServicePerformanceEstimate,
  Customer,
  CurrencyCode,
  InvoiceStatus,
  PaymentMethod,
  EstimateStatus,
  RiskLevel,
  ServiceCategory,
  ModuleSource
} from '../types';
import ServiceAnalysis from './ServiceAnalysis';

interface EnhancedInvoicingProps {
  onInvoiceCreate?: (invoice: Invoice) => void;
  onEstimateCreate?: (estimate: ServiceEstimate) => void;
  onAnalysisRequest?: (analysis: any) => void;
}

const EnhancedInvoicing: React.FC<EnhancedInvoicingProps> = ({
  onInvoiceCreate,
  onEstimateCreate,
  onAnalysisRequest
}) => {
  const [activeTab, setActiveTab] = useState('invoices');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [estimates, setEstimates] = useState<ServiceEstimate[]>([]);
  const [services, setServices] = useState<ServiceConfiguration[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedEstimate, setSelectedEstimate] = useState<ServiceEstimate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<InvoiceStatus | 'ALL'>('ALL');
  const [filterCustomer, setFilterCustomer] = useState<string>('ALL');
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [showCreateEstimateModal, setShowCreateEstimateModal] = useState(false);
  const [showServiceSelector, setShowServiceSelector] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  // Mock data
  useEffect(() => {
    const mockServices: ServiceConfiguration[] = [
      {
        id: '1',
        serviceName: 'Embryo Transfer Protocol',
        serviceCode: 'ET-001',
        serviceType: 'REPRODUCTION' as any,
        description: 'Complete embryo transfer service including synchronization, transfer, and pregnancy monitoring',
        category: ServiceCategory.REPRODUCTION,
        moduleSource: ModuleSource.EMBRYO_TRANSFER,
        isActive: true,
        isConfigurable: true,
        version: '3.2',
        lastUpdated: new Date(),
        createdBy: 'Dr. Smith'
      },
      {
        id: '2',
        serviceName: 'IVF Laboratory Services',
        serviceCode: 'IVF-001',
        serviceType: 'LABORATORY' as any,
        description: 'In-vitro fertilization laboratory procedures including oocyte collection, fertilization, and embryo culture',
        category: ServiceCategory.LABORATORY,
        moduleSource: ModuleSource.FERTILIZATION,
        isActive: true,
        isConfigurable: true,
        version: '2.1',
        lastUpdated: new Date(),
        createdBy: 'Lab Manager'
      },
      {
        id: '3',
        serviceName: 'Ultrasound Diagnostics',
        serviceCode: 'US-001',
        serviceType: 'DIAGNOSTIC' as any,
        description: 'Comprehensive ultrasound examination for reproductive health assessment',
        category: ServiceCategory.DIAGNOSTIC,
        moduleSource: ModuleSource.ULTRASOUND,
        isActive: true,
        isConfigurable: true,
        version: '1.5',
        lastUpdated: new Date(),
        createdBy: 'Dr. Johnson'
      }
    ];

    const mockCustomers: Customer[] = [
      {
        id: '1',
        customerName: 'Al-Rashid Farm',
        contactPerson: 'Ahmed Al-Rashid',
        email: 'ahmed@alrashidfarm.com',
        phone: '+966-50-123-4567',
        address: 'Riyadh, Saudi Arabia',
        taxNumber: 'SA123456789',
        creditLimit: 50000,
        paymentTerms: 30,
        isActive: true
      },
      {
        id: '2',
        customerName: 'Saudi Genetics Center',
        contactPerson: 'Dr. Fatima Al-Zahra',
        email: 'fatima@saudigenetics.com',
        phone: '+966-50-987-6543',
        address: 'Jeddah, Saudi Arabia',
        taxNumber: 'SA987654321',
        creditLimit: 100000,
        paymentTerms: 45,
        isActive: true
      }
    ];

    const mockInvoices: Invoice[] = [
      {
        id: '1',
        invoiceNumber: 'INV-2025-001',
        customerId: '1',
        customerName: 'Al-Rashid Farm',
        invoiceDate: new Date('2025-01-15'),
        dueDate: new Date('2025-02-15'),
        items: [
          {
            id: '1',
            serviceId: '1',
            serviceName: 'Embryo Transfer Protocol',
            description: 'Complete embryo transfer service for 5 animals',
            quantity: 5,
            unitPrice: 2500,
            totalPrice: 12500,
            costBreakdown: {
              labor: 5000,
              materials: 3000,
              equipment: 2000,
              overhead: 2500
            }
          }
        ],
        subtotal: 12500,
        taxAmount: 1875,
        discountAmount: 0,
        totalAmount: 14375,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        notes: 'Excellent service quality, customer very satisfied',
        createdBy: 'Dr. Smith',
        createdAt: new Date('2025-01-15')
      }
    ];

    const mockEstimates: ServiceEstimate[] = [
      {
        id: '1',
        estimateNumber: 'EST-2025-001',
        customerId: '2',
        customerName: 'Saudi Genetics Center',
        services: [
          {
            id: '1',
            serviceId: '2',
            serviceName: 'IVF Laboratory Services',
            quantity: 10,
            unitPrice: 3500,
            totalPrice: 35000,
            costBreakdown: {
              id: '1',
              serviceId: '2',
              costType: 'LABOR' as any,
              baseCost: 20000,
              variableCost: 8000,
              fixedCost: 4000,
              overheadAllocation: 3000,
              totalCost: 35000,
              costCenterId: '1',
              lastUpdated: new Date()
            },
            performanceEstimate: {
              id: '1',
              estimatedSuccessRate: 85,
              estimatedDuration: 45,
              estimatedQuality: 9.2,
              estimatedEfficiency: 88,
              confidenceLevel: 90,
              riskLevel: RiskLevel.LOW,
              assumptions: ['Optimal animal health', 'Standard protocols', 'Experienced staff']
            },
            deliveryTimeline: 60,
            riskFactors: [
              {
                factor: 'Animal health variations',
                probability: 0.15,
                impact: 0.3,
                mitigation: 'Pre-screening protocols'
              }
            ]
          }
        ],
        totalAmount: 35000,
        taxAmount: 5250,
        discountAmount: 1750,
        finalAmount: 38500,
        validityPeriod: 30,
        status: EstimateStatus.SENT,
        createdBy: 'Lab Manager',
        createdAt: new Date('2025-01-20'),
        expiresAt: new Date('2025-02-19')
      }
    ];

    setServices(mockServices);
    setCustomers(mockCustomers);
    setInvoices(mockInvoices);
    setEstimates(mockEstimates);
  }, []);

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || invoice.status === filterStatus;
    const matchesCustomer = filterCustomer === 'ALL' || invoice.customerId === filterCustomer;
    return matchesSearch && matchesStatus && matchesCustomer;
  });

  const filteredEstimates = estimates.filter(estimate => {
    const matchesSearch = estimate.estimateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         estimate.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusIcon = (status: InvoiceStatus | EstimateStatus) => {
    switch (status) {
      case InvoiceStatus.PAID:
      case EstimateStatus.ACCEPTED:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case InvoiceStatus.PENDING:
      case EstimateStatus.SENT:
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case InvoiceStatus.OVERDUE:
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case EstimateStatus.REJECTED:
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case EstimateStatus.EXPIRED:
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: InvoiceStatus | EstimateStatus) => {
    switch (status) {
      case InvoiceStatus.PAID:
      case EstimateStatus.ACCEPTED:
        return 'bg-green-100 text-green-800';
      case InvoiceStatus.PENDING:
      case EstimateStatus.SENT:
        return 'bg-yellow-100 text-yellow-800';
      case InvoiceStatus.OVERDUE:
        return 'bg-red-100 text-red-800';
      case EstimateStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      case EstimateStatus.EXPIRED:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateInvoice = () => {
    setShowCreateInvoiceModal(true);
  };

  const handleCreateEstimate = () => {
    setShowCreateEstimateModal(true);
  };

  const handleServiceSelection = () => {
    setShowServiceSelector(true);
  };

  const handleAnalyzeInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowAnalysisModal(true);
  };

  const calculateProfitability = (invoice: Invoice) => {
    const totalCost = invoice.items.reduce((sum, item) => {
      const costBreakdown = item.costBreakdown;
      return sum + (costBreakdown?.labor || 0) + (costBreakdown?.materials || 0) + 
             (costBreakdown?.equipment || 0) + (costBreakdown?.overhead || 0);
    }, 0);
    const profit = invoice.totalAmount - totalCost;
    const margin = (profit / invoice.totalAmount) * 100;
    return { profit, margin, totalCost };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enhanced Invoicing</h2>
          <p className="text-gray-600">Create invoices from service costing with performance analysis</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleCreateInvoice}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </button>
          <button
            onClick={handleCreateEstimate}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Target className="w-4 h-4 mr-2" />
            Create Estimate
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'invoices', name: 'Invoices', icon: Receipt },
            { id: 'estimates', name: 'Estimates', icon: Target },
            { id: 'service-selection', name: 'Service Selection', icon: Package },
            { id: 'analysis', name: 'Performance Analysis', icon: BarChart3 }
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

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search invoices or estimates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as InvoiceStatus | 'ALL')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Status</option>
            {Object.values(InvoiceStatus).map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select
            value={filterCustomer}
            onChange={(e) => setFilterCustomer(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Customers</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>{customer.customerName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => {
            const profitability = calculateProfitability(invoice);
            return (
              <div key={invoice.id} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{invoice.invoiceNumber}</h3>
                    <p className="text-sm text-gray-600">{invoice.customerName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(invoice.status)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Invoice Date</p>
                    <p className="font-medium">{new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-medium text-lg text-green-600">SAR {invoice.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Profit Margin</p>
                    <p className={`font-medium ${profitability.margin >= 20 ? 'text-green-600' : profitability.margin >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {profitability.margin.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Services</h4>
                  <div className="space-y-2">
                    {invoice.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 bg-gray-50 rounded px-3">
                        <div>
                          <p className="font-medium">{item.serviceName}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">SAR {item.totalPrice.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">{item.quantity} x SAR {item.unitPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAnalyzeInvoice(invoice)}
                      className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Analyze
                    </button>
                    <button className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </button>
                    <button className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                      <Download className="w-3 h-3 mr-1" />
                      PDF
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Created by {invoice.createdBy}</p>
                    <p className="text-xs text-gray-500">{new Date(invoice.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Estimates Tab */}
      {activeTab === 'estimates' && (
        <div className="space-y-4">
          {filteredEstimates.map((estimate) => (
            <div key={estimate.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{estimate.estimateNumber}</h3>
                  <p className="text-sm text-gray-600">{estimate.customerName}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(estimate.status)}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(estimate.status)}`}>
                    {estimate.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Created Date</p>
                  <p className="font-medium">{new Date(estimate.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expires</p>
                  <p className="font-medium">{new Date(estimate.expiresAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Final Amount</p>
                  <p className="font-medium text-lg text-green-600">SAR {estimate.finalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Validity</p>
                  <p className="font-medium">{estimate.validityPeriod} days</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Services with Performance Estimates</h4>
                <div className="space-y-3">
                  {estimate.services.map((service) => (
                    <div key={service.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{service.serviceName}</p>
                          <p className="text-sm text-gray-600">{service.quantity} units</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">SAR {service.totalPrice.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">SAR {service.unitPrice.toLocaleString()} each</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 pt-3 border-t">
                        <div>
                          <p className="text-xs text-gray-600">Success Rate</p>
                          <p className="font-medium text-green-600">{service.performanceEstimate.estimatedSuccessRate}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Duration</p>
                          <p className="font-medium">{service.performanceEstimate.estimatedDuration} days</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Quality Score</p>
                          <p className="font-medium text-blue-600">{service.performanceEstimate.estimatedQuality}/10</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Risk Level</p>
                          <p className={`font-medium ${
                            service.performanceEstimate.riskLevel === RiskLevel.LOW ? 'text-green-600' :
                            service.performanceEstimate.riskLevel === RiskLevel.MEDIUM ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {service.performanceEstimate.riskLevel}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                    <Send className="w-3 h-3 mr-1" />
                    Send
                  </button>
                  <button className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </button>
                  <button className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                    <Download className="w-3 h-3 mr-1" />
                    PDF
                  </button>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Created by {estimate.createdBy}</p>
                  <p className="text-xs text-gray-500">{new Date(estimate.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Selection Tab */}
      {activeTab === 'service-selection' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Service Selection</h3>
            <p className="text-gray-600 mb-4">Select services from configured service costing to create invoices and estimates</p>
            <button
              onClick={handleServiceSelection}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configure Services
            </button>
          </div>
        </div>
      )}

      {/* Performance Analysis Tab */}
      {activeTab === 'analysis' && (
        <ServiceAnalysis 
          onExportReport={(report) => {
            console.log('Exporting analysis report:', report);
            // Handle report export
          }}
          onOptimizationRequest={(optimization) => {
            console.log('Requesting optimization:', optimization);
            // Handle optimization request
          }}
        />
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Receipt className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Estimates</p>
              <p className="text-2xl font-bold text-gray-900">{estimates.filter(e => e.status === EstimateStatus.SENT).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">SAR {invoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Profit Margin</p>
              <p className="text-2xl font-bold text-gray-900">
                {invoices.length > 0 
                  ? (invoices.reduce((sum, inv) => sum + calculateProfitability(inv).margin, 0) / invoices.length).toFixed(1)
                  : '0'
                }%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals would be implemented here */}
    </div>
  );
};

export default EnhancedInvoicing; 