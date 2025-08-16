import React, { useState, useEffect } from 'react';
import {
  Workflow,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Copy,
  Trash2,
  Download,
  Upload,
  BarChart3,
  Users,
  Target,
  Zap,
  Activity,
  Settings,
  GitBranch,
  Timer,
  FileText,
  Microscope,
  TestTube,
  FlaskConical,
  Beaker,
  Cpu,
  Send,
  ArrowRight,
  ArrowDown,
  MoreVertical,
  RefreshCw,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

// Import components we'll create
import { WorkflowBuilder } from '../components/WorkflowBuilder';
import { WorkflowMonitor } from '../components/WorkflowMonitor';
import { WorkflowTemplates } from '../components/WorkflowTemplates';
import { WorkflowAnalytics } from '../components/WorkflowAnalytics';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'collection' | 'preparation' | 'analysis' | 'qc' | 'review' | 'reporting' | 'approval';
  description: string;
  estimatedDuration: number; // in minutes
  requiredRole: string;
  requiredEquipment?: string;
  qcRequired: boolean;
  dependencies: string[];
  instructions: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  startTime?: string;
  endTime?: string;
  assignedTo?: string;
  notes?: string;
  attachments?: string[];
}

interface LabWorkflow {
  id: string;
  name: string;
  testType: string;
  category: string;
  version: string;
  status: 'draft' | 'active' | 'archived';
  description: string;
  estimatedTotalTime: number;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  steps: WorkflowStep[];
  createdBy: string;
  createdAt: string;
  lastModified: string;
  tags: string[];
  sampleTypes: string[];
  equipmentRequired: string[];
  qualifications: string[];
  compliance: string[];
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  sampleId: string;
  testId: string;
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  currentStep: string;
  startTime: string;
  estimatedCompletion: string;
  actualCompletion?: string;
  assignedTechnician: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  customer: string;
  testType: string;
  delayReason?: string;
  notes?: string;
  steps: WorkflowStep[];
}

interface WorkflowStats {
  totalWorkflows: number;
  activeExecutions: number;
  completedToday: number;
  delayedExecutions: number;
  averageCompletionTime: number;
  onTimeDelivery: number;
  qualityIssues: number;
  resourceUtilization: number;
}

const LabWorkflowPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workflows, setWorkflows] = useState<LabWorkflow[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [stats, setStats] = useState<WorkflowStats>({
    totalWorkflows: 0,
    activeExecutions: 0,
    completedToday: 0,
    delayedExecutions: 0,
    averageCompletionTime: 0,
    onTimeDelivery: 0,
    qualityIssues: 0,
    resourceUtilization: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<LabWorkflow | null>(null);
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadWorkflowData();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadWorkflowData();
      }, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const loadWorkflowData = async () => {
    try {
      // Mock data - in real app, these would be API calls
      const mockWorkflows: LabWorkflow[] = [
        {
          id: 'wf-001',
          name: 'Complete Blood Count (CBC)',
          testType: 'Hematology',
          category: 'Routine',
          version: '2.1',
          status: 'active',
          description: 'Comprehensive blood analysis workflow with automated cell counting',
          estimatedTotalTime: 45,
          priority: 'normal',
          steps: [
            {
              id: 'step-001',
              name: 'Sample Collection',
              type: 'collection',
              description: 'Draw blood sample using EDTA tube',
              estimatedDuration: 5,
              requiredRole: 'Phlebotomist',
              qcRequired: false,
              dependencies: [],
              instructions: 'Draw 5ml blood in EDTA tube, label properly, mix gently 8-10 times',
              status: 'pending'
            },
            {
              id: 'step-002',
              name: 'Sample Processing',
              type: 'preparation',
              description: 'Prepare sample for analysis',
              estimatedDuration: 10,
              requiredRole: 'Lab Technician',
              requiredEquipment: 'Centrifuge',
              qcRequired: true,
              dependencies: ['step-001'],
              instructions: 'Check sample quality, centrifuge if needed, verify patient information',
              status: 'pending'
            },
            {
              id: 'step-003',
              name: 'Automated Analysis',
              type: 'analysis',
              description: 'Run sample on hematology analyzer',
              estimatedDuration: 15,
              requiredRole: 'Lab Technician',
              requiredEquipment: 'BC-6800 Hematology Analyzer',
              qcRequired: true,
              dependencies: ['step-002'],
              instructions: 'Load sample into analyzer, run QC controls, execute analysis',
              status: 'pending'
            },
            {
              id: 'step-004',
              name: 'Result Review',
              type: 'review',
              description: 'Review and validate results',
              estimatedDuration: 10,
              requiredRole: 'Medical Technologist',
              qcRequired: false,
              dependencies: ['step-003'],
              instructions: 'Review results for critical values, check flagged parameters, validate data',
              status: 'pending'
            },
            {
              id: 'step-005',
              name: 'Report Generation',
              type: 'reporting',
              description: 'Generate and send final report',
              estimatedDuration: 5,
              requiredRole: 'Lab Technician',
              qcRequired: false,
              dependencies: ['step-004'],
              instructions: 'Generate report, verify patient demographics, transmit to requesting physician',
              status: 'pending'
            }
          ],
          createdBy: 'Dr. Sarah Ahmed',
          createdAt: '2025-01-01T08:00:00Z',
          lastModified: '2025-01-02T10:30:00Z',
          tags: ['hematology', 'routine', 'automated'],
          sampleTypes: ['whole blood'],
          equipmentRequired: ['BC-6800', 'Centrifuge'],
          qualifications: ['Medical Technologist', 'Lab Technician'],
          compliance: ['CLIA', 'ISO 15189']
        },
        {
          id: 'wf-002',
          name: 'COVID-19 RT-PCR',
          testType: 'Molecular',
          category: 'Infectious Disease',
          version: '1.5',
          status: 'active',
          description: 'Real-time PCR workflow for SARS-CoV-2 detection',
          estimatedTotalTime: 240,
          priority: 'high',
          steps: [
            {
              id: 'step-001',
              name: 'Sample Collection',
              type: 'collection',
              description: 'Nasopharyngeal swab collection',
              estimatedDuration: 10,
              requiredRole: 'Healthcare Worker',
              qcRequired: false,
              dependencies: [],
              instructions: 'Collect nasopharyngeal swab, place in viral transport medium',
              status: 'pending'
            },
            {
              id: 'step-002',
              name: 'RNA Extraction',
              type: 'preparation',
              description: 'Extract viral RNA from sample',
              estimatedDuration: 60,
              requiredRole: 'Molecular Technologist',
              requiredEquipment: 'QIAcube Connect',
              qcRequired: true,
              dependencies: ['step-001'],
              instructions: 'Process sample through automated RNA extraction system',
              status: 'pending'
            },
            {
              id: 'step-003',
              name: 'PCR Setup',
              type: 'preparation',
              description: 'Prepare PCR reaction mixtures',
              estimatedDuration: 30,
              requiredRole: 'Molecular Technologist',
              qcRequired: true,
              dependencies: ['step-002'],
              instructions: 'Prepare master mix, add controls, aliquot samples',
              status: 'pending'
            },
            {
              id: 'step-004',
              name: 'RT-PCR Analysis',
              type: 'analysis',
              description: 'Run real-time PCR analysis',
              estimatedDuration: 120,
              requiredRole: 'Molecular Technologist',
              requiredEquipment: 'CFX96 Real-Time PCR',
              qcRequired: true,
              dependencies: ['step-003'],
              instructions: 'Load samples into PCR system, run amplification protocol',
              status: 'pending'
            },
            {
              id: 'step-005',
              name: 'Result Interpretation',
              type: 'review',
              description: 'Interpret PCR results',
              estimatedDuration: 15,
              requiredRole: 'Medical Technologist',
              qcRequired: false,
              dependencies: ['step-004'],
              instructions: 'Analyze amplification curves, determine positive/negative results',
              status: 'pending'
            },
            {
              id: 'step-006',
              name: 'Report Approval',
              type: 'approval',
              description: 'Final review and approval',
              estimatedDuration: 5,
              requiredRole: 'Pathologist',
              qcRequired: false,
              dependencies: ['step-005'],
              instructions: 'Review results, approve for release, notify clinician if positive',
              status: 'pending'
            }
          ],
          createdBy: 'Dr. Ahmad Ali',
          createdAt: '2024-12-15T09:00:00Z',
          lastModified: '2025-01-01T14:20:00Z',
          tags: ['covid-19', 'pcr', 'urgent', 'molecular'],
          sampleTypes: ['nasopharyngeal swab'],
          equipmentRequired: ['QIAcube Connect', 'CFX96 Real-Time PCR'],
          qualifications: ['Molecular Technologist', 'Pathologist'],
          compliance: ['FDA EUA', 'WHO', 'CDC']
        }
      ];

      const mockExecutions: WorkflowExecution[] = [
        {
          id: 'exec-001',
          workflowId: 'wf-001',
          workflowName: 'Complete Blood Count (CBC)',
          sampleId: 'LAB-2025-001',
          testId: 'TEST-2025-001',
          status: 'running',
          progress: 60,
          currentStep: 'step-003',
          startTime: '2025-01-02T08:30:00Z',
          estimatedCompletion: '2025-01-02T09:15:00Z',
          assignedTechnician: 'John Smith',
          priority: 'normal',
          customer: 'City Hospital',
          testType: 'Hematology',
          steps: mockWorkflows[0].steps.map((step, index) => ({
            ...step,
            status: index < 2 ? 'completed' : index === 2 ? 'in_progress' : 'pending'
          }))
        },
        {
          id: 'exec-002',
          workflowId: 'wf-002',
          workflowName: 'COVID-19 RT-PCR',
          sampleId: 'LAB-2025-002',
          testId: 'TEST-2025-002',
          status: 'running',
          progress: 83,
          currentStep: 'step-005',
          startTime: '2025-01-02T06:00:00Z',
          estimatedCompletion: '2025-01-02T10:00:00Z',
          assignedTechnician: 'Jane Doe',
          priority: 'high',
          customer: 'Emergency Clinic',
          testType: 'Molecular',
          steps: mockWorkflows[1].steps.map((step, index) => ({
            ...step,
            status: index < 4 ? 'completed' : index === 4 ? 'in_progress' : 'pending'
          }))
        },
        {
          id: 'exec-003',
          workflowId: 'wf-001',
          workflowName: 'Complete Blood Count (CBC)',
          sampleId: 'LAB-2025-003',
          testId: 'TEST-2025-003',
          status: 'pending',
          progress: 0,
          currentStep: 'step-001',
          startTime: '2025-01-02T09:00:00Z',
          estimatedCompletion: '2025-01-02T09:45:00Z',
          assignedTechnician: 'Mike Wilson',
          priority: 'normal',
          customer: 'Private Clinic',
          testType: 'Hematology',
          steps: mockWorkflows[0].steps
        }
      ];

      const mockStats: WorkflowStats = {
        totalWorkflows: mockWorkflows.length,
        activeExecutions: mockExecutions.filter(e => e.status === 'running').length,
        completedToday: 24,
        delayedExecutions: 2,
        averageCompletionTime: 38,
        onTimeDelivery: 94.5,
        qualityIssues: 1,
        resourceUtilization: 78.5
      };

      setWorkflows(mockWorkflows);
      setExecutions(mockExecutions);
      setStats(mockStats);
      setLoading(false);
    } catch (error) {
      console.error('Error loading workflow data:', error);
      setLoading(false);
    }
  };

  const filteredExecutions = executions.filter(execution => {
    const matchesSearch = execution.workflowName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         execution.sampleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         execution.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || execution.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || execution.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-600';
      case 'normal': return 'bg-blue-100 text-blue-600';
      case 'high': return 'bg-orange-100 text-orange-600';
      case 'urgent': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'collection': return <TestTube className="w-4 h-4" />;
      case 'preparation': return <Beaker className="w-4 h-4" />;
      case 'analysis': return <Microscope className="w-4 h-4" />;
      case 'qc': return <CheckCircle className="w-4 h-4" />;
      case 'review': return <Eye className="w-4 h-4" />;
      case 'reporting': return <FileText className="w-4 h-4" />;
      case 'approval': return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500 rounded-full">
              <Workflow className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">🔄 Lab Workflow Management</h2>
              <p className="text-gray-600">Visual workflow monitoring from sample to report</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <Activity className="w-3 h-3 mr-1" />
                  REAL-TIME TRACKING
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                  VISUAL WORKFLOWS
                </span>
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                  AUTO-MONITORING
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowWorkflowBuilder(true)}
              className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Workflow
            </button>
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="mr-2 rounded focus:ring-blue-500"
              />
              Auto-refresh ({refreshInterval}s)
            </label>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Active Executions</p>
              <p className="text-2xl font-bold text-blue-900">{stats.activeExecutions}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Play className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">Currently running</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Completed Today</p>
              <p className="text-2xl font-bold text-green-900">{stats.completedToday}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">Tests finished</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">On-Time Delivery</p>
              <p className="text-2xl font-bold text-orange-900">{stats.onTimeDelivery}%</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Timer className="h-8 w-8 text-orange-600" />
            </div>
          </div>
          <p className="text-xs text-orange-600 mt-2">Within target time</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Avg. Completion</p>
              <p className="text-2xl font-bold text-purple-900">{stats.averageCompletionTime}m</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-purple-600 mt-2">Average time</p>
        </div>
      </div>

      {/* Active Executions */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Active Workflow Executions
            </h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search executions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="running">Running</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
              <button
                onClick={() => loadWorkflowData()}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sample & Test
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Workflow
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Step
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Technician
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ETA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExecutions.map((execution) => {
                const currentStep = execution.steps.find(step => step.id === execution.currentStep);
                const eta = new Date(execution.estimatedCompletion);
                const isDelayed = new Date() > eta && execution.status === 'running';
                
                return (
                  <tr key={execution.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{execution.sampleId}</div>
                        <div className="text-sm text-gray-500">{execution.testId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{execution.workflowName}</div>
                        <div className="text-sm text-gray-500">{execution.testType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              execution.status === 'completed' ? 'bg-green-500' :
                              execution.status === 'failed' ? 'bg-red-500' :
                              execution.status === 'paused' ? 'bg-yellow-500' :
                              'bg-blue-500'
                            }`}
                            style={{ width: `${execution.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{execution.progress}%</span>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(execution.status)}`}>
                        {execution.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {currentStep && getStepIcon(currentStep.type)}
                        <div className="ml-2">
                          <div className="text-sm font-medium text-gray-900">{currentStep?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{currentStep?.type || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{execution.assignedTechnician}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(execution.priority)}`}>
                        {execution.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${isDelayed ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {eta.toLocaleTimeString()}
                      </div>
                      {isDelayed && (
                        <div className="flex items-center text-red-600 text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Delayed
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedExecution(execution)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {execution.status === 'running' && (
                          <button
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Pause"
                          >
                            <Pause className="w-4 h-4" />
                          </button>
                        )}
                        {execution.status === 'paused' && (
                          <button
                            className="text-green-600 hover:text-green-900"
                            title="Resume"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Workflow Templates Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows.map((workflow) => (
          <div key={workflow.id} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Workflow className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{workflow.name}</h4>
                  <p className="text-xs text-gray-500">v{workflow.version}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                workflow.status === 'active' ? 'bg-green-100 text-green-800' :
                workflow.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {workflow.status}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{workflow.description}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>{workflow.steps.length} steps</span>
              <span>{workflow.estimatedTotalTime}min</span>
              <span>{workflow.testType}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setSelectedWorkflow(workflow)}
                className="flex-1 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
              >
                <Eye className="w-3 h-3 inline mr-1" />
                View
              </button>
              <button className="flex-1 px-3 py-2 text-xs font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100">
                <Play className="w-3 h-3 inline mr-1" />
                Start
              </button>
              <button className="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100">
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Lab Workflow Management</h1>
      <p className="text-gray-600">Visual workflow monitoring from sample to report</p>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'builder'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <GitBranch className="h-4 w-4 inline mr-2" />
            Workflow Builder
          </button>
          <button
            onClick={() => setActiveTab('monitor')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'monitor'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Activity className="h-4 w-4 inline mr-2" />
            Live Monitor
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'templates'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Templates
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TrendingUp className="h-4 w-4 inline mr-2" />
            Analytics
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'builder' && <WorkflowBuilder workflows={workflows} onSave={(workflow) => {
            setWorkflows([...workflows, workflow]);
            setActiveTab('dashboard');
          }} />}
          {activeTab === 'monitor' && <WorkflowMonitor executions={executions} onRefresh={loadWorkflowData} />}
          {activeTab === 'templates' && <WorkflowTemplates workflows={workflows} onSelect={setSelectedWorkflow} />}
          {activeTab === 'analytics' && <WorkflowAnalytics executions={executions} stats={stats} />}
        </>
      )}

      {/* Modals */}
      {showWorkflowBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <WorkflowBuilder 
              workflows={workflows} 
              onSave={(workflow) => {
                setWorkflows([...workflows, workflow]);
                setShowWorkflowBuilder(false);
              }}
              onClose={() => setShowWorkflowBuilder(false)}
            />
          </div>
        </div>
      )}
      
      {selectedExecution && (
        <WorkflowMonitor 
          executions={[selectedExecution]} 
          isModal={true}
          onClose={() => setSelectedExecution(null)}
          onRefresh={loadWorkflowData}
        />
      )}
    </div>
  );
};

export default LabWorkflowPage; 