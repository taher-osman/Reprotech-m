import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  DollarSign,
  FileText,
  Send,
  ArrowRight,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
  Search,
  Bell,
  MessageSquare,
  Calendar,
  User,
  Building2,
  ShoppingCart,
  Workflow,
  GitBranch,
  Timer,
  Target,
  TrendingUp,
  BarChart3
} from 'lucide-react';

// Enhanced Procurement Workflow Types
export interface ProcurementWorkflow {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  triggerConditions: WorkflowTrigger[];
  approvalLevels: ApprovalLevel[];
  notifications: NotificationRule[];
  escalationRules: EscalationRule[];
  autoActions: AutoAction[];
  metadata: WorkflowMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowTrigger {
  type: 'AMOUNT_THRESHOLD' | 'CATEGORY' | 'SUPPLIER' | 'DEPARTMENT' | 'URGENCY';
  operator: 'EQUALS' | 'GREATER_THAN' | 'LESS_THAN' | 'CONTAINS' | 'IN';
  value: string | number;
  values?: string[];
}

export interface ApprovalLevel {
  id: string;
  order: number;
  name: string;
  description: string;
  approvers: Approver[];
  approvalType: 'ANY' | 'ALL' | 'MAJORITY' | 'SEQUENTIAL';
  timeLimit?: number; // minutes
  delegationRules?: DelegationRule[];
  conditions?: ApprovalCondition[];
}

export interface Approver {
  id: string;
  type: 'USER' | 'ROLE' | 'DEPARTMENT' | 'EXTERNAL';
  identifier: string;
  name: string;
  email: string;
  backupApprovers?: string[];
  maxAmount?: number;
  conditions?: string[];
}

export interface DelegationRule {
  fromUserId: string;
  toUserId: string;
  startDate: Date;
  endDate: Date;
  conditions?: string[];
}

export interface ApprovalCondition {
  field: string;
  operator: string;
  value: any;
}

export interface NotificationRule {
  id: string;
  event: NotificationEvent;
  recipients: NotificationRecipient[];
  channels: NotificationChannel[];
  template: string;
  delay?: number;
}

export interface EscalationRule {
  id: string;
  triggerAfter: number; // minutes
  action: 'NOTIFY' | 'AUTO_APPROVE' | 'ESCALATE_TO' | 'REJECT';
  target?: string;
  conditions?: string[];
}

export interface AutoAction {
  id: string;
  trigger: string;
  action: string;
  parameters: Record<string, any>;
  conditions?: string[];
}

export interface WorkflowMetadata {
  version: string;
  tags: string[];
  category: string;
  priority: number;
  usage: {
    totalExecutions: number;
    averageCompletionTime: number;
    successRate: number;
  };
}

export interface ProcurementRequest {
  id: string;
  requestNumber: string;
  workflowId: string;
  workflowInstance: WorkflowInstance;
  requester: UserInfo;
  department: string;
  items: RequestItem[];
  totalAmount: number;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  justification: string;
  attachments: Attachment[];
  status: RequestStatus;
  currentLevel: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
}

export interface WorkflowInstance {
  id: string;
  workflowId: string;
  currentStep: number;
  stepHistory: StepExecution[];
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
}

export interface StepExecution {
  stepId: string;
  stepName: string;
  approver?: UserInfo;
  action: 'APPROVED' | 'REJECTED' | 'DELEGATED' | 'ESCALATED' | 'AUTO_APPROVED';
  timestamp: Date;
  comments?: string;
  timeSpent?: number;
}

export interface RequestItem {
  id: string;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
  supplier?: string;
  specifications?: string;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
}

export interface Attachment {
  id: string;
  filename: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: Date;
}

export type RequestStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'COMPLETED';

export type NotificationEvent = 
  | 'REQUEST_SUBMITTED'
  | 'APPROVAL_REQUIRED'
  | 'APPROVED'
  | 'REJECTED'
  | 'ESCALATED'
  | 'COMPLETED'
  | 'OVERDUE';

export interface NotificationRecipient {
  type: 'REQUESTER' | 'APPROVER' | 'MANAGER' | 'DEPARTMENT' | 'CUSTOM';
  identifier?: string;
}

export interface NotificationChannel {
  type: 'EMAIL' | 'SMS' | 'PUSH' | 'SLACK' | 'TEAMS';
  enabled: boolean;
  configuration: Record<string, any>;
}

export const EnhancedProcurementWorkflow: React.FC = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [selectedWorkflow, setSelectedWorkflow] = useState<ProcurementWorkflow | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<ProcurementRequest | null>(null);
  const [showWorkflowDesigner, setShowWorkflowDesigner] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterUrgency, setFilterUrgency] = useState('ALL');

  // Mock Data
  const [workflows] = useState<ProcurementWorkflow[]>([
    {
      id: 'wf-standard',
      name: 'Standard Procurement Workflow',
      description: 'Default workflow for regular procurement requests',
      isActive: true,
      triggerConditions: [
        { type: 'AMOUNT_THRESHOLD', operator: 'LESS_THAN', value: 10000 }
      ],
      approvalLevels: [
        {
          id: 'level-1',
          order: 1,
          name: 'Department Manager',
          description: 'Initial department approval',
          approvers: [
            { id: 'mgr-001', type: 'ROLE', identifier: 'department_manager', name: 'Department Manager', email: 'manager@company.com' }
          ],
          approvalType: 'ANY',
          timeLimit: 1440 // 24 hours
        },
        {
          id: 'level-2',
          order: 2,
          name: 'Finance Review',
          description: 'Financial approval',
          approvers: [
            { id: 'fin-001', type: 'USER', identifier: 'finance_manager', name: 'Sarah Johnson', email: 'sarah.j@company.com' }
          ],
          approvalType: 'ANY',
          timeLimit: 2880 // 48 hours
        }
      ],
      notifications: [],
      escalationRules: [],
      autoActions: [],
      metadata: {
        version: '1.0',
        tags: ['standard', 'default'],
        category: 'General',
        priority: 1,
        usage: {
          totalExecutions: 156,
          averageCompletionTime: 3240, // minutes
          successRate: 94.2
        }
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-12-01')
    },
    {
      id: 'wf-high-value',
      name: 'High-Value Procurement Workflow',
      description: 'Enhanced workflow for high-value purchases above $10,000',
      isActive: true,
      triggerConditions: [
        { type: 'AMOUNT_THRESHOLD', operator: 'GREATER_THAN', value: 10000 }
      ],
      approvalLevels: [
        {
          id: 'level-1',
          order: 1,
          name: 'Department Head',
          description: 'Department head approval',
          approvers: [
            { id: 'head-001', type: 'ROLE', identifier: 'department_head', name: 'Department Head', email: 'head@company.com' }
          ],
          approvalType: 'ANY',
          timeLimit: 720 // 12 hours
        },
        {
          id: 'level-2',
          order: 2,
          name: 'Finance Director',
          description: 'Finance director review',
          approvers: [
            { id: 'dir-001', type: 'USER', identifier: 'finance_director', name: 'Michael Chen', email: 'michael.c@company.com' }
          ],
          approvalType: 'ANY',
          timeLimit: 1440 // 24 hours
        },
        {
          id: 'level-3',
          order: 3,
          name: 'Executive Approval',
          description: 'C-level approval required',
          approvers: [
            { id: 'ceo-001', type: 'USER', identifier: 'ceo', name: 'James Wilson', email: 'james.w@company.com' },
            { id: 'cfo-001', type: 'USER', identifier: 'cfo', name: 'Lisa Davis', email: 'lisa.d@company.com' }
          ],
          approvalType: 'ANY',
          timeLimit: 2880 // 48 hours
        }
      ],
      notifications: [],
      escalationRules: [],
      autoActions: [],
      metadata: {
        version: '2.1',
        tags: ['high-value', 'executive'],
        category: 'High-Value',
        priority: 2,
        usage: {
          totalExecutions: 23,
          averageCompletionTime: 5760, // minutes
          successRate: 87.0
        }
      },
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-11-15')
    },
    {
      id: 'wf-emergency',
      name: 'Emergency Procurement Workflow',
      description: 'Fast-track workflow for urgent procurement needs',
      isActive: true,
      triggerConditions: [
        { type: 'URGENCY', operator: 'EQUALS', value: 'URGENT' }
      ],
      approvalLevels: [
        {
          id: 'level-1',
          order: 1,
          name: 'Emergency Approver',
          description: 'Designated emergency approver',
          approvers: [
            { id: 'emg-001', type: 'USER', identifier: 'emergency_approver', name: 'Operations Manager', email: 'ops@company.com' }
          ],
          approvalType: 'ANY',
          timeLimit: 240 // 4 hours
        }
      ],
      notifications: [],
      escalationRules: [
        {
          id: 'esc-1',
          triggerAfter: 60,
          action: 'NOTIFY',
          target: 'director@company.com'
        }
      ],
      autoActions: [],
      metadata: {
        version: '1.5',
        tags: ['emergency', 'urgent'],
        category: 'Emergency',
        priority: 3,
        usage: {
          totalExecutions: 8,
          averageCompletionTime: 180, // minutes
          successRate: 100.0
        }
      },
      createdAt: new Date('2024-03-10'),
      updatedAt: new Date('2024-10-20')
    }
  ]);

  const [requests] = useState<ProcurementRequest[]>([
    {
      id: 'req-001',
      requestNumber: 'PR-2025-001',
      workflowId: 'wf-standard',
      workflowInstance: {
        id: 'wi-001',
        workflowId: 'wf-standard',
        currentStep: 1,
        stepHistory: [
          {
            stepId: 'level-1',
            stepName: 'Department Manager',
            approver: { id: 'mgr-001', name: 'John Smith', email: 'john.s@company.com', role: 'Manager', department: 'Lab' },
            action: 'APPROVED',
            timestamp: new Date('2025-01-02T10:30:00'),
            comments: 'Approved - necessary for operations',
            timeSpent: 45
          }
        ],
        status: 'IN_PROGRESS',
        startedAt: new Date('2025-01-02T09:15:00')
      },
      requester: {
        id: 'user-001',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.j@company.com',
        role: 'Lab Technician',
        department: 'Research'
      },
      department: 'Research',
      items: [
        {
          id: 'item-001',
          itemName: 'Culture Medium DMEM',
          description: 'High-quality cell culture medium',
          quantity: 10,
          unitPrice: 85.50,
          totalPrice: 855.00,
          category: 'MEDIA',
          supplier: 'Life Technologies'
        }
      ],
      totalAmount: 855.00,
      urgency: 'MEDIUM',
      justification: 'Required for ongoing research project. Current stock running low.',
      attachments: [],
      status: 'PENDING_APPROVAL',
      currentLevel: 2,
      createdAt: new Date('2025-01-02T09:15:00'),
      updatedAt: new Date('2025-01-02T10:30:00')
    },
    {
      id: 'req-002',
      requestNumber: 'PR-2025-002',
      workflowId: 'wf-high-value',
      workflowInstance: {
        id: 'wi-002',
        workflowId: 'wf-high-value',
        currentStep: 0,
        stepHistory: [],
        status: 'PENDING',
        startedAt: new Date('2025-01-02T14:20:00')
      },
      requester: {
        id: 'user-002',
        name: 'Dr. Michael Chen',
        email: 'michael.c@company.com',
        role: 'Research Director',
        department: 'Research'
      },
      department: 'Research',
      items: [
        {
          id: 'item-002',
          itemName: 'Advanced Microscope System',
          description: 'High-resolution research microscope',
          quantity: 1,
          unitPrice: 45000.00,
          totalPrice: 45000.00,
          category: 'EQUIPMENT',
          supplier: 'Zeiss Scientific'
        }
      ],
      totalAmount: 45000.00,
      urgency: 'HIGH',
      justification: 'Essential equipment upgrade for advanced research capabilities. Current microscope is outdated and limiting research quality.',
      attachments: [],
      status: 'SUBMITTED',
      currentLevel: 1,
      createdAt: new Date('2025-01-02T14:20:00'),
      updatedAt: new Date('2025-01-02T14:20:00')
    }
  ]);

  // Analytics Data
  const analyticsData = {
    totalRequests: requests.length,
    pendingApprovals: requests.filter(r => r.status === 'PENDING_APPROVAL').length,
    averageProcessingTime: 3240, // minutes
    approvalRate: 94.2,
    monthlyVolume: 156,
    costSavings: 18950.25,
    processingEfficiency: 87.5,
    escalationRate: 5.2
  };

  const tabs = [
    { id: 'requests', name: 'Procurement Requests', icon: ShoppingCart, count: requests.length },
    { id: 'workflows', name: 'Workflow Management', icon: Workflow, count: workflows.length },
    { id: 'approvals', name: 'Pending Approvals', icon: CheckCircle, count: analyticsData.pendingApprovals },
    { id: 'analytics', name: 'Workflow Analytics', icon: BarChart3 },
    { id: 'configuration', name: 'Configuration', icon: Settings }
  ];

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PENDING_APPROVAL': return 'bg-orange-100 text-orange-800';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'URGENT': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApproval = async (requestId: string, action: 'APPROVE' | 'REJECT', comments?: string) => {
    console.log(`${action} request ${requestId}:`, comments);
    // Implementation would update request status and workflow
  };

  const handleDelegation = async (requestId: string, delegateeTo: string) => {
    console.log(`Delegating request ${requestId} to:`, delegateeTo);
    // Implementation would delegate approval to another user
  };

  const renderRequestsList = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold">Procurement Requests</h2>
        <p className="text-blue-100 mt-1">Manage and track all procurement requests with automated workflows</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <select
              value={filterUrgency}
              onChange={(e) => setFilterUrgency(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Urgency</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.requestNumber}</div>
                      <div className="text-sm text-gray-500">{request.items[0]?.itemName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{request.requester.name}</div>
                        <div className="text-sm text-gray-500">{request.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${request.totalAmount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUrgencyColor(request.urgency)}`}>
                      {request.urgency}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(request.workflowInstance.currentStep / workflows.find(w => w.id === request.workflowId)?.approvalLevels.length!) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-500">
                        {request.workflowInstance.currentStep}/{workflows.find(w => w.id === request.workflowId)?.approvalLevels.length}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {request.status === 'PENDING_APPROVAL' && (
                        <>
                          <button
                            onClick={() => handleApproval(request.id, 'APPROVE')}
                            className="text-green-600 hover:text-green-900"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleApproval(request.id, 'REJECT')}
                            className="text-red-600 hover:text-red-900"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderWorkflowManagement = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold">Workflow Management</h2>
        <p className="text-purple-100 mt-1">Design and manage custom procurement approval workflows</p>
      </div>

      {/* Workflow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workflows.map((workflow) => (
          <div key={workflow.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  workflow.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {workflow.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Approval Levels:</span>
                <span className="font-medium">{workflow.approvalLevels.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Success Rate:</span>
                <span className="font-medium text-green-600">{workflow.metadata.usage.successRate}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Avg. Time:</span>
                <span className="font-medium">{Math.round(workflow.metadata.usage.averageCompletionTime / 60)}h</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Total Uses:</span>
                <span className="font-medium">{workflow.metadata.usage.totalExecutions}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedWorkflow(workflow)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 text-sm flex items-center justify-center"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 text-sm">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 text-sm">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Workflow Card */}
        <div 
          onClick={() => setShowWorkflowDesigner(true)}
          className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 cursor-pointer transition-colors flex flex-col items-center justify-center text-center"
        >
          <Plus className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Workflow</h3>
          <p className="text-sm text-gray-600">Design a custom approval workflow</p>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold">Workflow Analytics</h2>
        <p className="text-green-100 mt-1">Performance insights and optimization recommendations</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.totalRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Avg. Processing</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(analyticsData.averageProcessingTime / 60)}h</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Approval Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.approvalRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Cost Savings</p>
              <p className="text-2xl font-bold text-gray-900">${analyticsData.costSavings.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workflow Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Performance</h3>
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div key={workflow.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{workflow.name}</p>
                  <p className="text-sm text-gray-500">{workflow.metadata.usage.totalExecutions} executions</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{workflow.metadata.usage.successRate}%</p>
                  <p className="text-sm text-gray-500">{Math.round(workflow.metadata.usage.averageCompletionTime / 60)}h avg</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottleneck Analysis */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Process Bottlenecks</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Finance Review</p>
                <p className="text-sm text-gray-500">Average delay: 18 hours</p>
              </div>
              <div className="text-red-600">
                <AlertCircle className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Executive Approval</p>
                <p className="text-sm text-gray-500">Average delay: 12 hours</p>
              </div>
              <div className="text-yellow-600">
                <Clock className="h-6 w-6" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Department Manager</p>
                <p className="text-sm text-gray-500">Average delay: 2 hours</p>
              </div>
              <div className="text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComingSoon = (feature: string) => (
    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-gray-200">
      <div className="text-gray-400 mb-4">
        <Settings className="h-16 w-16" />
      </div>
      <h3 className="text-xl font-semibold text-gray-600 mb-2">{feature}</h3>
      <p className="text-gray-500">Advanced feature coming soon</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Enhanced Procurement Workflow</h1>
        <div className="flex items-center space-x-2">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </button>
          <button className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.name}
              {tab.count !== undefined && (
                <span className="ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'requests' && renderRequestsList()}
        {activeTab === 'workflows' && renderWorkflowManagement()}
        {activeTab === 'approvals' && renderComingSoon('Pending Approvals Dashboard')}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'configuration' && renderComingSoon('Workflow Configuration')}
      </div>
    </div>
  );
}; 