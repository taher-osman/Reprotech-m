import React, { useState, useEffect } from 'react';
import { 
  Settings, 
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
  Database,
  Layers,
  Activity,
  PieChart,
  LineChart,
  Calendar,
  Users,
  Building2,
  TestTube,
  Stethoscope,
  Microscope,
  FileText,
  GraduationCap,
  Wrench,
  HeadphonesIcon
} from 'lucide-react';
import {
  ServiceConfiguration,
  ServiceCategory,
  ServiceOutputType,
  ServiceCostBreakdown,
  ServicePricing,
  ServiceContractTemplate,
  ServiceAnalysis,
  ModuleSource,
  ServiceType,
  PerformanceStatus,
  CostType,
  PricingModel,
  TargetType,
  MeasurementFrequency,
  EstimateStatus,
  RiskLevel,
  AnalysisType
} from '../types';

interface ServiceManagementProps {
  onServiceSelect?: (service: ServiceConfiguration) => void;
  onAnalysisRequest?: (analysis: ServiceAnalysis) => void;
}

const ServiceManagement: React.FC<ServiceManagementProps> = ({
  onServiceSelect,
  onAnalysisRequest
}) => {
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState<ServiceConfiguration[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceConfiguration | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<ServiceCategory | 'ALL'>('ALL');
  const [filterModule, setFilterModule] = useState<ModuleSource | 'ALL'>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showConfigurationModal, setShowConfigurationModal] = useState(false);

  // Mock data for services
  useEffect(() => {
    const mockServices: ServiceConfiguration[] = [
      {
        id: '1',
        serviceName: 'Embryo Transfer Protocol',
        serviceCode: 'ET-001',
        serviceType: ServiceType.REPRODUCTION,
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
        serviceType: ServiceType.LABORATORY,
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
        serviceType: ServiceType.DIAGNOSTIC,
        description: 'Comprehensive ultrasound examination for reproductive health assessment',
        category: ServiceCategory.DIAGNOSTIC,
        moduleSource: ModuleSource.ULTRASOUND,
        isActive: true,
        isConfigurable: true,
        version: '1.5',
        lastUpdated: new Date(),
        createdBy: 'Dr. Johnson'
      },
      {
        id: '4',
        serviceName: 'Semen Analysis & Processing',
        serviceCode: 'SA-001',
        serviceType: ServiceType.LABORATORY,
        description: 'Complete semen analysis with CASA technology and processing for AI/ET',
        category: ServiceCategory.LABORATORY,
        moduleSource: ModuleSource.SEMEN_MANAGEMENT,
        isActive: true,
        isConfigurable: true,
        version: '2.0',
        lastUpdated: new Date(),
        createdBy: 'Lab Tech'
      },
      {
        id: '5',
        serviceName: 'Genetic Testing & Analysis',
        serviceCode: 'GT-001',
        serviceType: ServiceType.LABORATORY,
        description: 'Advanced genetic testing including SNP analysis and genomic prediction',
        category: ServiceCategory.LABORATORY,
        moduleSource: ModuleSource.GENOMIC_INTELLIGENCE,
        isActive: true,
        isConfigurable: true,
        version: '4.0',
        lastUpdated: new Date(),
        createdBy: 'Geneticist'
      },
      {
        id: '6',
        serviceName: 'Clinical Consultation',
        serviceCode: 'CC-001',
        serviceType: ServiceType.CONSULTATION,
        description: 'Expert veterinary consultation for reproductive health and breeding programs',
        category: ServiceCategory.CONSULTATION,
        moduleSource: ModuleSource.CLINICAL_HUB,
        isActive: true,
        isConfigurable: true,
        version: '1.0',
        lastUpdated: new Date(),
        createdBy: 'Dr. Williams'
      }
    ];
    setServices(mockServices);
  }, []);

  const filteredServices = services.filter(service => {
    const matchesSearch = service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.serviceCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || service.category === filterCategory;
    const matchesModule = filterModule === 'ALL' || service.moduleSource === filterModule;
    return matchesSearch && matchesCategory && matchesModule;
  });

  const getCategoryIcon = (category: ServiceCategory) => {
    switch (category) {
      case ServiceCategory.REPRODUCTION:
        return <Activity className="w-4 h-4 text-purple-500" />;
      case ServiceCategory.CLINICAL:
        return <Stethoscope className="w-4 h-4 text-blue-500" />;
      case ServiceCategory.LABORATORY:
        return <TestTube className="w-4 h-4 text-green-500" />;
      case ServiceCategory.DIAGNOSTIC:
        return <Microscope className="w-4 h-4 text-orange-500" />;
      case ServiceCategory.CONSULTATION:
        return <Users className="w-4 h-4 text-indigo-500" />;
      case ServiceCategory.TRAINING:
        return <GraduationCap className="w-4 h-4 text-teal-500" />;
      case ServiceCategory.MAINTENANCE:
        return <Wrench className="w-4 h-4 text-gray-500" />;
      case ServiceCategory.SUPPORT:
        return <HeadphonesIcon className="w-4 h-4 text-pink-500" />;
      default:
        return <Settings className="w-4 h-4 text-gray-500" />;
    }
  };

  const getModuleIcon = (module: ModuleSource) => {
    switch (module) {
      case ModuleSource.EMBRYO_TRANSFER:
        return <Activity className="w-4 h-4 text-purple-500" />;
      case ModuleSource.FERTILIZATION:
        return <TestTube className="w-4 h-4 text-green-500" />;
      case ModuleSource.ULTRASOUND:
        return <Microscope className="w-4 h-4 text-orange-500" />;
      case ModuleSource.SEMEN_MANAGEMENT:
        return <Database className="w-4 h-4 text-blue-500" />;
      case ModuleSource.GENOMIC_INTELLIGENCE:
        return <Layers className="w-4 h-4 text-indigo-500" />;
      case ModuleSource.CLINICAL_HUB:
        return <Stethoscope className="w-4 h-4 text-teal-500" />;
      default:
        return <Settings className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleServiceSelect = (service: ServiceConfiguration) => {
    setSelectedService(service);
    onServiceSelect?.(service);
  };

  const handleCreateService = () => {
    setShowCreateModal(true);
  };

  const handleAnalyzeService = (service: ServiceConfiguration) => {
    setSelectedService(service);
    setShowAnalysisModal(true);
  };

  const handleConfigureService = (service: ServiceConfiguration) => {
    setSelectedService(service);
    setShowConfigurationModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Service Management</h2>
          <p className="text-gray-600">Configure and manage all system services with module integration</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleCreateService}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Service
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
            { id: 'services', name: 'Services', icon: Settings },
            { id: 'templates', name: 'Contract Templates', icon: FileText },
            { id: 'analysis', name: 'Performance Analysis', icon: BarChart3 },
            { id: 'integration', name: 'Module Integration', icon: Layers }
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
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as ServiceCategory | 'ALL')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Categories</option>
            {Object.values(ServiceCategory).map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value as ModuleSource | 'ALL')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ALL">All Modules</option>
            {Object.values(ModuleSource).map((module) => (
              <option key={module} value={module}>{module}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Grid */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleServiceSelect(service)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(service.category)}
                  <span className="text-sm font-medium text-gray-500">{service.category}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {getModuleIcon(service.moduleSource)}
                  <span className="text-xs text-gray-400">{service.moduleSource}</span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.serviceName}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-mono text-gray-500">{service.serviceCode}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">v{service.version}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Created by {service.createdBy}</span>
                <span>{new Date(service.lastUpdated).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${service.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm text-gray-600">{service.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfigureService(service);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAnalyzeService(service);
                    }}
                    className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle copy
                    }}
                    className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contract Templates Tab */}
      {activeTab === 'templates' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Contract Templates</h3>
            <p className="text-gray-600 mb-4">Create and manage service contract templates with performance targets</p>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </button>
          </div>
        </div>
      )}

      {/* Performance Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Analysis</h3>
            <p className="text-gray-600 mb-4">Analyze service performance, costs, and profitability metrics</p>
            <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <TrendingUp className="w-4 h-4 mr-2" />
              Generate Analysis
            </button>
          </div>
        </div>
      )}

      {/* Module Integration Tab */}
      {activeTab === 'integration' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center py-12">
            <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Module Integration</h3>
            <p className="text-gray-600 mb-4">Configure service outputs and integration with system modules</p>
            <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              <Zap className="w-4 h-4 mr-2" />
              Configure Integration
            </button>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Services</p>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Services</p>
              <p className="text-2xl font-bold text-gray-900">{services.filter(s => s.isActive).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Contract Templates</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Performance</p>
              <p className="text-2xl font-bold text-gray-900">87.5%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals would be implemented here */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Create New Service</h3>
            {/* Service creation form would go here */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement; 