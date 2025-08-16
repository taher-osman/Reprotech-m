import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  TestTube,
  Cpu,
  BarChart3,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  QrCode,
  Sparkles,
  Zap,
  Target,
  Brain,
  Activity,
  ExternalLink,
  Link,
  TrendingUp,
  Users,
  FileText,
  Workflow
} from 'lucide-react';
import apiService from './services/api';

// Import components
import AILabDashboard from '../components/AILabDashboard';
import AdvancedSampleForm from '../components/AdvancedSampleForm';
import LabTestForm from '../components/LabTestForm';
import QualityControlForm from '../components/QualityControlForm';
import EquipmentMonitoringPanel from '../components/EquipmentMonitoringPanel';
import SmartSampleSelector from '../components/SmartSampleSelector';
import LabWorkflowPage from './LabWorkflowPage';

interface LabSample {
  id: string;
  sampleId: string;
  barcode?: string;
  sampleType: string;
  status: string;
  priority: string;
  collectionDate: string;
  animal: {
    animalID: string;
    name: string;
    species: string;
  };
  customer: {
    customerID: string;
    name: string;
  };
  labTests: Array<{
    id: string;
    testId: string;
    status: string;
    protocol: {
      protocolName: string;
    };
  }>;
  _count: {
    labTests: number;
    qualityControls: number;
  };
}

interface Protocol {
  id: string;
  protocolName: string;
  protocolCode: string;
  category: string;
  sampleTypes: string[];
  estimatedDuration: number;
  costPerTest: number;
}

export const LaboratoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('ai-dashboard');
  const [samples, setSamples] = useState<LabSample[]>([]);
  const [labTests, setLabTests] = useState<any[]>([]);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdvancedSampleForm, setShowAdvancedSampleForm] = useState(false);
  const [showLabTestForm, setShowLabTestForm] = useState(false);
  const [showQualityControlForm, setShowQualityControlForm] = useState(false);
  const [showSmartSampleSelector, setShowSmartSampleSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [testFilters, setTestFilters] = useState({
    status: '',
    priority: '',
    assignedTo: '',
    protocol: ''
  });

  const [dashboardStats, setDashboardStats] = useState({
    samplesThisMonth: 156,
    pendingTests: 23,
    completedTestsToday: 8,
    avgTurnaroundHours: 18.5,
    sampleManagementConnected: true,
    totalSamplesAvailable: 347,
    activeTechnicians: 5,
    qcPassed: 94.2,
    equipmentOnline: 8
  });

  useEffect(() => {
    loadProtocols();
    loadLabTests();
    loadDashboardStats();
  }, []);

  const loadProtocols = async () => {
    try {
      // Mock protocols data
      const mockProtocols: Protocol[] = [
        {
          id: 'prot-001',
          protocolName: 'Basic Viability Assessment',
          protocolCode: 'VIA-001',
          category: 'quality-control',
          sampleTypes: ['embryo', 'oocyte', 'semen'],
          estimatedDuration: 45,
          costPerTest: 125.00
        },
        {
          id: 'prot-002',
          protocolName: 'Genetic Screening Panel',
          protocolCode: 'GEN-002',
          category: 'genetic-analysis',
          sampleTypes: ['DNA', 'blood'],
          estimatedDuration: 180,
          costPerTest: 450.00
        },
        {
          id: 'prot-003',
          protocolName: 'Morphology Analysis',
          protocolCode: 'MOR-003',
          category: 'morphological',
          sampleTypes: ['embryo', 'oocyte'],
          estimatedDuration: 30,
          costPerTest: 85.00
        },
        {
          id: 'prot-004',
          protocolName: 'Sperm Analysis Complete',
          protocolCode: 'SPA-004',
          category: 'reproductive',
          sampleTypes: ['semen'],
          estimatedDuration: 60,
          costPerTest: 200.00
        }
      ];
      setProtocols(mockProtocols);
    } catch (error) {
      console.error('Error loading protocols:', error);
    }
  };

  const loadLabTests = async () => {
    try {
      // Mock lab tests data
      const mockTests = [
        {
          id: 'LT-001',
          testId: 'TEST-240701-001',
          sampleId: 'SM-2025-001',
          protocolName: 'Complete Blood Count',
          protocolCode: 'CBC-001',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          assignedTo: 'John Doe',
          requestedDate: '2025-01-02',
          dueDate: '2025-01-03',
          progress: 65,
          animal: { name: 'Bella', animalID: 'RT-H-001' },
          customer: { name: 'Al-Rajhi Farms' },
          estimatedCompletion: '2025-01-03T14:30:00Z'
        },
        {
          id: 'LT-002',
          testId: 'TEST-240701-002',
          sampleId: 'SM-2025-002',
          protocolName: 'Genetic Marker Analysis',
          protocolCode: 'GMA-001',
          status: 'PENDING',
          priority: 'NORMAL',
          assignedTo: 'Jane Smith',
          requestedDate: '2025-01-02',
          dueDate: '2025-01-04',
          progress: 0,
          animal: { name: 'Thunder', animalID: 'RT-J-002' },
          customer: { name: 'Modern Dairy Co.' },
          estimatedCompletion: '2025-01-04T10:00:00Z'
        },
        {
          id: 'LT-003',
          testId: 'TEST-240701-003',
          sampleId: 'SM-2025-003',
          protocolName: 'Hormone Panel',
          protocolCode: 'HP-001',
          status: 'COMPLETED',
          priority: 'URGENT',
          assignedTo: 'Mike Wilson',
          requestedDate: '2025-01-01',
          dueDate: '2025-01-02',
          progress: 100,
          animal: { name: 'Jasmine', animalID: 'RT-A-003' },
          customer: { name: 'Elite Genetics' },
          estimatedCompletion: '2025-01-02T16:45:00Z'
        }
      ];
      setLabTests(mockTests);
    } catch (error) {
      console.error('Error loading lab tests:', error);
    }
  };

  const loadDashboardStats = async () => {
    try {
      // Mock dashboard stats
      setDashboardStats({
        samplesThisMonth: 156,
        pendingTests: 23,
        completedTestsToday: 8,
        avgTurnaroundHours: 18.5,
        sampleManagementConnected: true,
        totalSamplesAvailable: 347
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    }
  };

  const handleAdvancedSampleSubmit = async (sampleData: any) => {
    try {
      console.log('📝 Submitting advanced sample data:', sampleData);
      
      const newSample: LabSample = {
        id: `sample-${Date.now()}`,
        sampleId: sampleData.sampleId,
        barcode: sampleData.barcode,
        sampleType: sampleData.sampleType,
        status: sampleData.status,
        priority: sampleData.priority,
        collectionDate: sampleData.collectionDate,
        animal: {
          animalID: sampleData.animalId,
          name: sampleData.animalName || 'Unknown Animal',
          species: 'Bovine'
        },
        customer: {
          customerID: sampleData.customerId,
          name: sampleData.customerName || 'Unknown Customer'
        },
        labTests: [],
        _count: {
          labTests: sampleData.requestedTests?.length || 0,
          qualityControls: 0
        }
      };

      setSamples(prev => [newSample, ...prev]);
      setShowAdvancedSampleForm(false);
      
      console.log('✅ Sample created successfully');
    } catch (error) {
      console.error('❌ Error submitting sample:', error);
    }
  };

  const handleLabTestSubmit = async (testData: any) => {
    try {
      console.log('Creating lab test:', testData);
      
      const newTest = {
        id: `LT-${Date.now().toString().slice(-3)}`,
        testId: testData.testId,
        sampleId: testData.sampleId,
        protocolName: protocols.find(p => p.id === testData.protocolId)?.protocolName || 'Unknown Protocol',
        protocolCode: protocols.find(p => p.id === testData.protocolId)?.protocolCode || 'UNK',
        status: 'PENDING',
        priority: testData.priority,
        assignedTo: testData.assignedTo || 'Auto-assigned',
        requestedDate: testData.requestedDate,
        dueDate: testData.dueDate,
        progress: 0,
        animal: { name: 'Sample Animal', animalID: 'RT-XXX-XXX' },
        customer: { name: 'Sample Customer' },
        estimatedCompletion: testData.dueDate + 'T12:00:00Z'
      };

      setLabTests(prev => [newTest, ...prev]);
      setShowLabTestForm(false);
    } catch (error) {
      console.error('Error creating lab test:', error);
    }
  };

  const handleQualityControlSubmit = async (qcData: any) => {
    try {
      console.log('Creating quality control record:', qcData);
      setShowQualityControlForm(false);
    } catch (error) {
      console.error('Error creating QC record:', error);
    }
  };

  const handleSmartSampleSelect = (selectedSamples: any[], protocolId: string) => {
    console.log('Selected samples from Sample Management:', selectedSamples);
    console.log('Selected protocol:', protocolId);
    
    // Create lab tests for selected samples
    selectedSamples.forEach(sample => {
      const protocol = protocols.find(p => p.id === protocolId);
      console.log(`Creating lab test for sample ${sample.sample_id} with protocol ${protocol?.protocolName}`);
    });
    
    setShowSmartSampleSelector(false);
    // Optionally refresh data or show success message
  };

  const navigateToSampleManagement = () => {
    // Redirect to Sample Management module
    window.location.href = '/#/sample-management';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'IN_PROGRESS': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'FAILED': 'bg-red-100 text-red-800',
      'ON_HOLD': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'LOW': 'bg-gray-100 text-gray-800',
      'NORMAL': 'bg-blue-100 text-blue-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'URGENT': 'bg-red-100 text-red-800',
      'STAT': 'bg-red-200 text-red-900'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const filteredTests = labTests.filter(test => {
    const matchesSearch = !searchTerm || 
      test.testId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.sampleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.protocolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.animal.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !testFilters.status || test.status === testFilters.status;
    const matchesPriority = !testFilters.priority || test.priority === testFilters.priority;
    const matchesAssignee = !testFilters.assignedTo || test.assignedTo.toLowerCase().includes(testFilters.assignedTo.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Enhanced Header with Sample Management Integration */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500 rounded-full">
              <FlaskConical className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">🧪 Laboratory Intelligence Hub</h2>
              <p className="text-gray-600">AI-powered laboratory workflow management</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowSmartSampleSelector(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
            >
              <Brain className="h-4 w-4 mr-2" />
              Smart Sample Selection
            </button>
            <button 
              onClick={navigateToSampleManagement}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Manage Samples
            </button>
          </div>
        </div>
      </div>

      {/* Sample Management Integration Panel */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <ExternalLink className="w-5 h-5 mr-2 text-teal-600" />
            Sample Management Hub Integration
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600 font-medium">Connected</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-teal-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-teal-600 font-medium">Available Samples</p>
                <p className="text-2xl font-bold text-teal-900">{dashboardStats.totalSamplesAvailable}</p>
              </div>
              <TestTube className="w-8 h-8 text-teal-600" />
            </div>
            <p className="text-xs text-teal-600 mt-2">From Sample Management</p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">This Month</p>
                <p className="text-2xl font-bold text-blue-900">{dashboardStats.samplesThisMonth}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-xs text-blue-600 mt-2">Samples processed</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Pending Tests</p>
                <p className="text-2xl font-bold text-purple-900">{dashboardStats.pendingTests}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-xs text-purple-600 mt-2">Awaiting execution</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Completed Today</p>
                <p className="text-2xl font-bold text-green-900">{dashboardStats.completedTestsToday}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-green-600 mt-2">Tests finished</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Sample Creation Hub</span>
            </div>
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Centralized</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            All sample creation is handled through the <strong>Sample Management</strong> module to ensure data consistency and traceability.
          </p>
          <div className="mt-4 flex space-x-3">
            <button 
              onClick={() => setShowSmartSampleSelector(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-colors"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Sample Selection
            </button>
            <button 
              onClick={navigateToSampleManagement}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Sample Management
            </button>
            <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <QrCode className="w-4 h-4 mr-2" />
              QR Scanner
            </button>
          </div>
        </div>
      </div>

      {/* AI Dashboard Component */}
      <AILabDashboard />
    </div>
  );

  const renderLabTests = () => (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-500 rounded-full">
              <FlaskConical className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">⚗️ Laboratory Tests Management</h2>
              <p className="text-gray-600">Comprehensive test workflow and protocol management</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowSmartSampleSelector(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700"
            >
              <Brain className="h-4 w-4 mr-2" />
              Smart Selection
            </button>
            <button 
              onClick={() => setShowLabTestForm(true)}
              className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Lab Test
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{labTests.length}</p>
            </div>
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-xs text-gray-500 mt-2">All time</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">In Progress</p>
              <p className="text-2xl font-bold text-orange-900">
                {labTests.filter(t => t.status === 'IN_PROGRESS').length}
              </p>
            </div>
            <Activity className="h-8 w-8 text-orange-400" />
          </div>
          <p className="text-xs text-orange-500 mt-2">Active tests</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">
                {labTests.filter(t => t.status === 'PENDING').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
          <p className="text-xs text-yellow-500 mt-2">Awaiting start</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-900">
                {labTests.filter(t => t.status === 'COMPLETED').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <p className="text-xs text-green-500 mt-2">Finished tests</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search tests, samples, protocols, animals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex space-x-2">
            <select
              value={testFilters.status}
              onChange={(e) => setTestFilters({ ...testFilters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="FAILED">Failed</option>
            </select>
            
            <select
              value={testFilters.priority}
              onChange={(e) => setTestFilters({ ...testFilters, priority: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Priority</option>
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
              <option value="STAT">STAT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Laboratory Tests ({filteredTests.length})
          </h3>
        </div>
        
        {filteredTests.length === 0 ? (
          <div className="text-center py-12">
            <FlaskConical className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No lab tests found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || Object.values(testFilters).some(f => f) 
                ? 'Try adjusting your search criteria' 
                : 'Create your first lab test to get started'
              }
            </p>
            <div className="mt-6">
              <button 
                onClick={() => setShowLabTestForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Lab Test
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sample & Animal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Protocol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status & Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timeline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{test.testId}</div>
                        <div className="text-sm text-gray-500">ID: {test.id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{test.sampleId}</div>
                        <div className="text-sm text-gray-500">{test.animal.name} ({test.animal.animalID})</div>
                        <div className="text-xs text-gray-400">{test.customer.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{test.protocolName}</div>
                        <div className="text-sm text-gray-500">{test.protocolCode}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(test.status)}`}>
                          {test.status.replace('_', ' ')}
                        </span>
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(test.priority)}`}>
                            {test.priority}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{test.assignedTo}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        <div>Req: {test.requestedDate}</div>
                        <div>Due: {test.dueDate}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                test.progress === 100 ? 'bg-green-600' : 
                                test.progress > 50 ? 'bg-blue-600' : 'bg-yellow-600'
                              }`}
                              style={{ width: `${test.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{test.progress}%</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderQualityControl = () => (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-500 rounded-full">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">🔬 Quality Control Center</h2>
              <p className="text-gray-600">Statistical Process Control & Compliance Monitoring</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  ISO 15189 Compliant
                </span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  SPC ENABLED
                </span>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                  REAL-TIME
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowQualityControlForm(true)}
              className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New QC Record
            </button>
          </div>
        </div>
      </div>

      {/* QC Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600">In Control</p>
              <p className="text-2xl font-bold text-emerald-900">94.7%</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          <p className="text-xs text-emerald-600 mt-2">Process stability</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Out of Control</p>
              <p className="text-2xl font-bold text-orange-900">3</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-orange-600 mt-2">Require attention</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Control Tests</p>
              <p className="text-2xl font-bold text-blue-900">156</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <TestTube className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">This month</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">CAPA Actions</p>
              <p className="text-2xl font-bold text-purple-900">5</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-purple-600 mt-2">Open actions</p>
        </div>
      </div>

      {/* SPC Control Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Levey-Jennings Chart - CBC Control</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-600">In Control</span>
            </div>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-sm text-gray-500 mt-2">SPC Chart - Real-time Control Data</p>
              <p className="text-xs text-gray-400">Mean: 12.5 ± 2σ | CV: 3.2%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quality Trend Analysis</h3>
            <select className="text-sm border border-gray-300 rounded px-2 py-1">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last 6 months</option>
            </select>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-sm text-gray-500 mt-2">Quality Metrics Trend</p>
              <p className="text-xs text-gray-400">Precision: 97.8% | Accuracy: 99.1%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Materials & Equipment Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TestTube className="w-5 h-5 mr-2 text-blue-600" />
            Control Materials
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Normal Control Level 1', lot: 'LOT-N1-2025', expiry: '2025-12-31', status: 'IN_USE', level: 'NORMAL' },
              { name: 'Abnormal Control Level 2', lot: 'LOT-A2-2025', expiry: '2025-11-15', status: 'IN_USE', level: 'ABNORMAL' },
              { name: 'Pathological Control', lot: 'LOT-P3-2025', expiry: '2025-10-30', status: 'EXPIRED', level: 'PATHOLOGICAL' }
            ].map((control, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{control.name}</p>
                  <p className="text-xs text-gray-500">{control.lot} | Exp: {control.expiry}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  control.status === 'IN_USE' ? 'bg-green-100 text-green-800' :
                  control.status === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {control.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Cpu className="w-5 h-5 mr-2 text-purple-600" />
            Equipment Calibration
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Hematology Analyzer', model: 'BC-6800', lastCal: '2025-01-01', nextCal: '2025-02-01', status: 'CALIBRATED' },
              { name: 'Chemistry Analyzer', model: 'AU-5800', lastCal: '2024-12-28', nextCal: '2025-01-28', status: 'DUE' },
              { name: 'PCR Thermal Cycler', model: 'T100', lastCal: '2025-01-02', nextCal: '2025-07-02', status: 'CALIBRATED' }
            ].map((equipment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{equipment.name}</p>
                  <p className="text-xs text-gray-500">{equipment.model} | Next: {equipment.nextCal}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  equipment.status === 'CALIBRATED' ? 'bg-green-100 text-green-800' :
                  equipment.status === 'DUE' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {equipment.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
            CAPA Management
          </h3>
          <div className="space-y-3">
            {[
              { id: 'CAPA-001', description: 'CBC control out of range', priority: 'HIGH', assignee: 'Dr. Ahmed', dueDate: '2025-01-05' },
              { id: 'CAPA-002', description: 'Equipment calibration drift', priority: 'MEDIUM', assignee: 'J. Smith', dueDate: '2025-01-10' },
              { id: 'CAPA-003', description: 'Proficiency test deviation', priority: 'LOW', assignee: 'M. Wilson', dueDate: '2025-01-15' }
            ].map((capa, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">{capa.id}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    capa.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                    capa.priority === 'MEDIUM' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {capa.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-1">{capa.description}</p>
                <p className="text-xs text-gray-500">Assigned: {capa.assignee} | Due: {capa.dueDate}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent QC Activities */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent QC Activities</h3>
            <div className="flex items-center space-x-2">
              <button className="text-sm text-gray-500 hover:text-gray-700">
                <Filter className="w-4 h-4 inline mr-1" />
                Filter
              </button>
              <button className="text-sm text-gray-500 hover:text-gray-700">
                <Download className="w-4 h-4 inline mr-1" />
                Export
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  QC ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Protocol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Control Material
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Results
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performed By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                {
                  qcId: 'QC-2025-001',
                  type: 'NORMAL_CONTROL',
                  protocol: 'CBC Protocol',
                  control: 'Normal Level 1',
                  expectedValue: '12.5',
                  actualValue: '12.3',
                  status: 'PASSED',
                  performedBy: 'Dr. Ahmed',
                  date: '2025-01-02'
                },
                {
                  qcId: 'QC-2025-002',
                  type: 'CALIBRATION',
                  protocol: 'Equipment Cal.',
                  control: 'Cal Standard',
                  expectedValue: '100.0',
                  actualValue: '98.7',
                  status: 'WARNING',
                  performedBy: 'J. Smith',
                  date: '2025-01-02'
                },
                {
                  qcId: 'QC-2025-003',
                  type: 'BLANK_CONTROL',
                  protocol: 'Chemistry Panel',
                  control: 'Reagent Blank',
                  expectedValue: '0.0',
                  actualValue: '0.1',
                  status: 'PASSED',
                  performedBy: 'M. Wilson',
                  date: '2025-01-01'
                }
              ].map((qc, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{qc.qcId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{qc.type.replace('_', ' ')}</div>
                      <div className="text-sm text-gray-500">{qc.protocol}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{qc.control}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">Expected: {qc.expectedValue}</div>
                      <div className="text-sm text-gray-500">Actual: {qc.actualValue}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      qc.status === 'PASSED' ? 'bg-green-100 text-green-800' :
                      qc.status === 'WARNING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {qc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">{qc.performedBy}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {qc.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance & Documentation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-indigo-600" />
            Compliance Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">ISO 15189:2022</span>
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">COMPLIANT</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">CLIA Standards</span>
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">COMPLIANT</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                <span className="text-sm font-medium text-gray-900">Proficiency Testing</span>
              </div>
              <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">DUE</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Performance Metrics
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Process Capability (Cpk)</span>
                <span className="text-sm font-bold text-green-600">1.67</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '83%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Measurement Uncertainty</span>
                <span className="text-sm font-bold text-blue-600">±2.1%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Turnaround Time</span>
                <span className="text-sm font-bold text-purple-600">98.3%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🧪 Laboratory Management</h1>
          <p className="text-gray-600 mt-1">Advanced laboratory workflow and intelligence platform</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('ai-dashboard')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ai-dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Brain className="h-4 w-4 inline mr-2" />
            AI Dashboard
          </button>
          <button
            onClick={() => setActiveTab('lab-tests')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'lab-tests'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FlaskConical className="h-4 w-4 inline mr-2" />
            Lab Tests
          </button>
          <button
            onClick={() => setActiveTab('quality-control')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'quality-control'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CheckCircle className="h-4 w-4 inline mr-2" />
            Quality Control
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('lab-workflow')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'lab-workflow'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Workflow className="h-4 w-4 inline mr-2" />
            Lab Workflow
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'ai-dashboard' && renderDashboard()}
      {activeTab === 'lab-tests' && renderLabTests()}
      {activeTab === 'quality-control' && renderQualityControl()}
      {activeTab === 'analytics' && (
        <div className="text-center py-12">
          <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Analytics</h3>
          <p className="mt-1 text-sm text-gray-500">Laboratory analytics and reporting</p>
        </div>
      )}
      {activeTab === 'lab-workflow' && (
        <LabWorkflowPage />
      )}

      {/* Modals */}
      {showAdvancedSampleForm && (
        <AdvancedSampleForm
          onSubmit={handleAdvancedSampleSubmit}
          onClose={() => setShowAdvancedSampleForm(false)}
        />
      )}

      {showLabTestForm && (
        <LabTestForm
          onSubmit={handleLabTestSubmit}
          onClose={() => setShowLabTestForm(false)}
        />
      )}

      {showQualityControlForm && (
        <QualityControlForm
          onSubmit={handleQualityControlSubmit}
          onClose={() => setShowQualityControlForm(false)}
        />
      )}

      {showSmartSampleSelector && (
        <SmartSampleSelector
          isOpen={showSmartSampleSelector}
          onClose={() => setShowSmartSampleSelector(false)}
          onSampleSelect={handleSmartSampleSelect}
          availableProtocols={protocols}
        />
      )}
    </div>
  );
}; 