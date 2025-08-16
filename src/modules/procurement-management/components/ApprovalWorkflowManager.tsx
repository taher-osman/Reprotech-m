import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  User, 
  Building, 
  DollarSign, 
  FileText, 
  Send, 
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  Calendar,
  TrendingUp,
  Shield,
  Zap,
  ShoppingCart
} from 'lucide-react';

interface ApprovalRequest {
  id: string;
  type: 'PURCHASE_ORDER' | 'SUPPLIER_REGISTRATION' | 'CONTRACT_RENEWAL' | 'BUDGET_OVERRIDE';
  title: string;
  description: string;
  requester: string;
  amount?: number;
  supplier?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'ESCALATED';
  currentApprover: string;
  approvalLevel: number;
  totalLevels: number;
  createdAt: string;
  dueDate: string;
  attachments: number;
  comments: number;
  purchaseOrderId?: string;
  department?: string;
  items?: {
    itemName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  type: 'PURCHASE_ORDER' | 'SUPPLIER_REGISTRATION' | 'CONTRACT_RENEWAL' | 'BUDGET_OVERRIDE';
  levels: number;
  isActive: boolean;
  approvalThresholds: {
    level: number;
    role: string;
    amountLimit?: number;
    autoApprove?: boolean;
  }[];
}

interface ProcurementManagerProps {
  purchaseOrders?: any[];
  onUpdatePurchaseOrder?: (orderId: string, updates: any) => void;
}

export const ApprovalWorkflowManager: React.FC<ProcurementManagerProps> = ({ 
  purchaseOrders = [], 
  onUpdatePurchaseOrder 
}) => {
  const [activeTab, setActiveTab] = useState('requests');
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkflowTemplate | null>(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);

  // Initialize data
  React.useEffect(() => {
    // Convert purchase orders to approval requests
    const poRequests = purchaseOrders
      .filter(po => po.status === 'PENDING_APPROVAL')
      .map(po => ({
        id: `AR-PO-${po.id}`,
        type: 'PURCHASE_ORDER' as const,
        title: `Purchase Order ${po.orderNumber}`,
        description: `Purchase order for ${po.items?.length || 0} items from ${po.supplierName}`,
        requester: po.requestedBy || 'Unknown',
        amount: po.totalAmount,
        supplier: po.supplierName,
        priority: po.priority === 'URGENT' ? 'CRITICAL' as const : 
                 po.priority === 'HIGH' ? 'HIGH' as const :
                 po.priority === 'MEDIUM' ? 'MEDIUM' as const : 'LOW' as const,
        status: 'PENDING' as const,
        currentApprover: po.currentApprover || 'Department Head',
        approvalLevel: po.approvalLevel || 1,
        totalLevels: po.totalApprovalLevels || 3,
        createdAt: po.orderDate,
        dueDate: po.expectedDelivery,
        attachments: 1,
        comments: 0,
        purchaseOrderId: po.id,
        department: po.department,
        items: po.items?.map((item: any) => ({
          itemName: item.itemName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice
        })) || []
      }));

    const otherRequests = approvalRequestsData.filter(req => req.type !== 'PURCHASE_ORDER');
    setRequests([...poRequests, ...otherRequests]);
    setTemplates(workflowTemplatesData);
  }, [purchaseOrders]);

  const approvalRequestsData: ApprovalRequest[] = [
    {
      id: 'AR-2025-002',
      type: 'SUPPLIER_REGISTRATION',
      title: 'New Supplier Registration',
      description: 'Registration request for Bio-Reagents Co. as new supplier',
      requester: 'Procurement Officer',
      priority: 'MEDIUM',
      status: 'PENDING',
      currentApprover: 'Procurement Manager',
      approvalLevel: 1,
      totalLevels: 2,
      createdAt: '2025-01-01',
      dueDate: '2025-01-08',
      attachments: 2,
      comments: 1
    },
    {
      id: 'AR-2025-003',
      type: 'BUDGET_OVERRIDE',
      title: 'Emergency Equipment Purchase',
      description: 'Budget override request for critical laboratory equipment',
      requester: 'Lab Director',
      amount: 125000.00,
      priority: 'CRITICAL',
      status: 'ESCALATED',
      currentApprover: 'CFO',
      approvalLevel: 3,
      totalLevels: 4,
      createdAt: '2024-12-31',
      dueDate: '2025-01-03',
      attachments: 5,
      comments: 8
    },
    {
      id: 'AR-2025-004',
      type: 'CONTRACT_RENEWAL',
      title: 'Vetoquinol Contract Renewal',
      description: 'Annual contract renewal for hormone supplies',
      requester: 'Supply Chain Manager',
      amount: 85000.00,
      supplier: 'Vetoquinol',
      priority: 'MEDIUM',
      status: 'APPROVED',
      currentApprover: 'Completed',
      approvalLevel: 3,
      totalLevels: 3,
      createdAt: '2024-12-28',
      dueDate: '2025-01-15',
      attachments: 4,
      comments: 3
    }
  ];

  const workflowTemplatesData: WorkflowTemplate[] = [
    {
      id: 'WT-001',
      name: 'Standard Purchase Order',
      description: 'Standard approval workflow for purchase orders under $50,000',
      type: 'PURCHASE_ORDER',
      levels: 3,
      isActive: true,
      approvalThresholds: [
        { level: 1, role: 'Department Head', amountLimit: 10000, autoApprove: true },
        { level: 2, role: 'Finance Manager', amountLimit: 50000 },
        { level: 3, role: 'CFO', amountLimit: undefined }
      ]
    },
    {
      id: 'WT-002',
      name: 'Supplier Registration',
      description: 'Workflow for new supplier registration and qualification',
      type: 'SUPPLIER_REGISTRATION',
      levels: 2,
      isActive: true,
      approvalThresholds: [
        { level: 1, role: 'Procurement Manager' },
        { level: 2, role: 'Legal Department' }
      ]
    },
    {
      id: 'WT-003',
      name: 'Budget Override',
      description: 'Emergency budget override workflow for critical purchases',
      type: 'BUDGET_OVERRIDE',
      levels: 4,
      isActive: true,
      approvalThresholds: [
        { level: 1, role: 'Department Head' },
        { level: 2, role: 'Finance Manager' },
        { level: 3, role: 'CFO' },
        { level: 4, role: 'CEO' }
      ]
    }
  ];

  const workflowStats = {
    totalRequests: requests.length,
    pendingApprovals: requests.filter(r => r.status === 'PENDING' || r.status === 'IN_REVIEW').length,
    approvedThisMonth: 15,
    averageApprovalTime: 2.3,
    escalationRate: 8.5
  };

  // Action handlers
  const handleApproveRequest = (requestId: string) => {
    const request = requests.find(req => req.id === requestId);
    
    if (request?.purchaseOrderId && onUpdatePurchaseOrder) {
      // Update the purchase order in the main system
      onUpdatePurchaseOrder(request.purchaseOrderId, {
        status: 'APPROVED',
        approvedBy: 'Current User',
        approvalLevel: request.totalLevels,
        currentApprover: 'Completed'
      });
    }
    
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'APPROVED' as const, currentApprover: 'Completed' }
        : req
    ));
    alert(`Request ${requestId} has been approved!`);
  };

  const handleRejectRequest = (requestId: string) => {
    const reason = prompt('Please provide a rejection reason:');
    if (reason) {
      const request = requests.find(req => req.id === requestId);
      
      if (request?.purchaseOrderId && onUpdatePurchaseOrder) {
        // Update the purchase order in the main system
        onUpdatePurchaseOrder(request.purchaseOrderId, {
          status: 'CANCELLED',
          notes: reason,
          currentApprover: 'Rejected'
        });
      }
      
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'REJECTED' as const, currentApprover: 'Rejected' }
          : req
      ));
      alert(`Request ${requestId} has been rejected. Reason: ${reason}`);
    }
  };

  const handleEscalateRequest = (requestId: string) => {
    const request = requests.find(req => req.id === requestId);
    
    if (request?.purchaseOrderId && onUpdatePurchaseOrder) {
      // Update the purchase order in the main system
      onUpdatePurchaseOrder(request.purchaseOrderId, {
        approvalLevel: (request.approvalLevel || 1) + 1,
        currentApprover: getNextApprover(request.approvalLevel + 1),
        status: 'PENDING_APPROVAL'
      });
    }
    
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'ESCALATED' as const, approvalLevel: req.approvalLevel + 1 }
        : req
    ));
    alert(`Request ${requestId} has been escalated to the next level!`);
  };

  const getNextApprover = (level: number): string => {
    switch (level) {
      case 1: return 'Department Head';
      case 2: return 'Finance Manager';
      case 3: return 'CFO';
      case 4: return 'CEO';
      default: return 'Department Head';
    }
  };

  const handleCreateRequest = () => {
    setShowCreateModal(true);
  };

  const handleCreateTemplate = () => {
    setShowTemplateModal(true);
    setEditingTemplate(null);
  };

  const handleEditTemplate = (template: WorkflowTemplate) => {
    setEditingTemplate(template);
    setShowTemplateModal(true);
  };

  const handleDuplicateTemplate = (template: WorkflowTemplate) => {
    const newTemplate: WorkflowTemplate = {
      ...template,
      id: `WT-${Date.now()}`,
      name: `${template.name} (Copy)`,
      isActive: false
    };
    setTemplates(prev => [...prev, newTemplate]);
    alert(`Template "${template.name}" has been duplicated!`);
  };

  const handleToggleTemplate = (templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, isActive: !template.isActive }
        : template
    ));
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(template => template.id !== templateId));
      alert('Template has been deleted!');
    }
  };

  const handleExportData = () => {
    const data = {
      requests: requests,
      templates: templates,
      stats: workflowStats,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    alert('Workflow data has been exported!');
  };

  const handlePrintReport = () => {
    window.print();
  };

  const clearFilters = () => {
    setFilterStatus('ALL');
    setFilterType('ALL');
    setSearchTerm('');
  };

  const tabs = [
    { id: 'requests', name: 'Approval Requests', icon: FileText },
    { id: 'templates', name: 'Workflow Templates', icon: Building },
    { id: 'analytics', name: 'Workflow Analytics', icon: TrendingUp }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_REVIEW': return 'bg-blue-100 text-blue-800';
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'ESCALATED': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PURCHASE_ORDER': return <ShoppingCart className="h-4 w-4" />;
      case 'SUPPLIER_REGISTRATION': return <Building className="h-4 w-4" />;
      case 'CONTRACT_RENEWAL': return <FileText className="h-4 w-4" />;
      case 'BUDGET_OVERRIDE': return <DollarSign className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesStatus = filterStatus === 'ALL' || request.status === filterStatus;
    const matchesType = filterType === 'ALL' || request.type === filterType;
    const matchesSearch = !searchTerm || 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  const renderApprovalRequests = () => (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Approval Workflow Management</h2>
            <p className="text-blue-100 mt-1">Advanced approval workflow system for procurement</p>
          </div>
          <div className="flex space-x-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">PHASE 5</span>
            <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">ADVANCED</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{workflowStats.totalRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{workflowStats.pendingApprovals}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Approved (Month)</p>
              <p className="text-2xl font-bold text-gray-900">{workflowStats.approvedThisMonth}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Avg Time (Days)</p>
              <p className="text-2xl font-bold text-gray-900">{workflowStats.averageApprovalTime}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Escalation Rate</p>
              <p className="text-2xl font-bold text-gray-900">{workflowStats.escalationRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="ESCALATED">Escalated</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Types</option>
              <option value="PURCHASE_ORDER">Purchase Order</option>
              <option value="SUPPLIER_REGISTRATION">Supplier Registration</option>
              <option value="CONTRACT_RENEWAL">Contract Renewal</option>
              <option value="BUDGET_OVERRIDE">Budget Override</option>
            </select>
            
            <button
              onClick={handleCreateRequest}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Request
            </button>
            
            <button
              onClick={handleExportData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Export
            </button>
            
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requester & Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount & Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status & Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approval Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.title}</div>
                      <div className="text-sm text-gray-500">{request.id}</div>
                      {request.purchaseOrderId && (
                        <div className="text-xs text-blue-600 font-mono">PO: {request.purchaseOrderId}</div>
                      )}
                      <div className="flex items-center mt-1">
                        {getTypeIcon(request.type)}
                        <span className="ml-1 text-xs text-gray-500">
                          {request.type.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{request.requester}</div>
                      {request.department && (
                        <div className="text-sm text-gray-500">{request.department}</div>
                      )}
                      {request.supplier && (
                        <div className="text-xs text-gray-500">Supplier: {request.supplier}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.amount ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          ${request.amount.toLocaleString()}
                        </div>
                        {request.items && (
                          <div className="text-xs text-gray-500">
                            {request.items.length} item{request.items.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">-</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status.replace('_', ' ')}
                      </span>
                      <div className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                          {request.priority}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(request.approvalLevel / request.totalLevels) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {request.approvalLevel}/{request.totalLevels}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {request.currentApprover}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(request.dueDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.ceil((new Date(request.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {(request.status === 'PENDING' || request.status === 'IN_REVIEW') && (
                        <>
                          <button 
                            onClick={() => handleApproveRequest(request.id)}
                            className="text-green-600 hover:text-green-900 p-1 rounded"
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleRejectRequest(request.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleEscalateRequest(request.id)}
                            className="text-orange-600 hover:text-orange-900 p-1 rounded"
                            title="Escalate"
                          >
                            <AlertTriangle className="h-4 w-4" />
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

  const renderWorkflowTemplates = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Workflow Templates</h2>
            <p className="text-green-100 mt-1">Configure and manage approval workflow templates</p>
          </div>
          <button 
            onClick={handleCreateTemplate}
            className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30"
          >
            <Plus className="h-4 w-4 inline mr-2" />
            New Template
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {template.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{template.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type:</span>
                <span className="font-medium">{template.type.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Levels:</span>
                <span className="font-medium">{template.levels}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Approval Levels:</h4>
              <div className="space-y-2">
                {template.approvalThresholds.map((threshold, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <span className="text-gray-500">Level {threshold.level}:</span>
                    <span className="font-medium">{threshold.role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <button 
                onClick={() => handleEditTemplate(template)}
                className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDuplicateTemplate(template)}
                className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Duplicate
              </button>
            </div>
            
            <div className="flex space-x-2 mt-2">
              <button 
                onClick={() => handleToggleTemplate(template.id)}
                className={`flex-1 px-3 py-2 text-sm rounded-lg ${
                  template.isActive 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {template.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button 
                onClick={() => handleDeleteTemplate(template.id)}
                className="flex-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWorkflowAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Workflow Analytics</h2>
            <p className="text-purple-100 mt-1">Advanced analytics and performance insights</p>
          </div>
          <div className="flex space-x-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">COMING SOON</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Approval Time</span>
              <span className="text-lg font-bold text-green-600">2.3 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Approval Rate</span>
              <span className="text-lg font-bold text-blue-600">94.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Escalation Rate</span>
              <span className="text-lg font-bold text-orange-600">8.5%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Efficiency</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Bottleneck Detection</span>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Auto-Escalation</span>
              <span className="text-sm font-medium text-green-600">Enabled</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Smart Routing</span>
              <span className="text-sm font-medium text-blue-600">Learning</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Features Coming Soon</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">AI-Powered Routing</h4>
            <p className="text-sm text-gray-500">Smart approver selection based on workload and expertise</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Risk Assessment</h4>
            <p className="text-sm text-gray-500">Automated risk scoring and compliance checking</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Predictive Analytics</h4>
            <p className="text-sm text-gray-500">Forecast approval times and identify bottlenecks</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Modal components
  const RequestDetailModal = ({ request, onClose }: { request: ApprovalRequest; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Request Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle className="h-6 w-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Request ID</label>
              <p className="mt-1 text-sm text-gray-900">{request.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <p className="mt-1 text-sm text-gray-900">{request.type.replace('_', ' ')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Requester</label>
              <p className="mt-1 text-sm text-gray-900">{request.requester}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                {request.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <p className="mt-1 text-sm text-gray-900">{request.title}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <p className="mt-1 text-sm text-gray-900">{request.description}</p>
          </div>
          
          {request.department && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <p className="mt-1 text-sm text-gray-900">{request.department}</p>
            </div>
          )}
          
          {request.amount && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <p className="mt-1 text-sm text-gray-900">${request.amount.toLocaleString()}</p>
            </div>
          )}
          
          {request.items && request.items.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="space-y-2">
                  {request.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-medium">{item.itemName}</span>
                        <span className="text-gray-500 ml-2">Qty: {item.quantity}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${item.totalPrice.toLocaleString()}</div>
                        <div className="text-gray-500">${item.unitPrice.toFixed(2)}/unit</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {request.purchaseOrderId && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Purchase Order Reference</label>
              <p className="mt-1 text-sm text-blue-600 font-mono">{request.purchaseOrderId}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Created</label>
              <p className="mt-1 text-sm text-gray-900">{request.createdAt}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <p className="mt-1 text-sm text-gray-900">{request.dueDate}</p>
            </div>
          </div>
          
          <div className="flex space-x-2 pt-4">
            {(request.status === 'PENDING' || request.status === 'IN_REVIEW') && (
              <>
                <button 
                  onClick={() => { handleApproveRequest(request.id); onClose(); }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
                <button 
                  onClick={() => { handleRejectRequest(request.id); onClose(); }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
                <button 
                  onClick={() => { handleEscalateRequest(request.id); onClose(); }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Escalate
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const CreateRequestModal = ({ onClose }: { onClose: () => void }) => {
    const [formData, setFormData] = useState({
      type: 'PURCHASE_ORDER' as const,
      title: '',
      description: '',
      amount: '',
      supplier: '',
      priority: 'MEDIUM' as const
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newRequest: ApprovalRequest = {
        id: `AR-2025-${String(requests.length + 1).padStart(3, '0')}`,
        type: formData.type,
        title: formData.title,
        description: formData.description,
        requester: 'Current User',
        amount: formData.amount ? parseFloat(formData.amount) : undefined,
        supplier: formData.supplier || undefined,
        priority: formData.priority,
        status: 'PENDING',
        currentApprover: 'Department Head',
        approvalLevel: 1,
        totalLevels: 3,
        createdAt: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        attachments: 0,
        comments: 0
      };
      
      setRequests(prev => [...prev, newRequest]);
      alert('Request created successfully!');
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Create New Request</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XCircle className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="PURCHASE_ORDER">Purchase Order</option>
                <option value="SUPPLIER_REGISTRATION">Supplier Registration</option>
                <option value="CONTRACT_RENEWAL">Contract Renewal</option>
                <option value="BUDGET_OVERRIDE">Budget Override</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (optional)</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            
            <div className="flex space-x-2 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Request
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Modals */}
      {selectedRequest && (
        <RequestDetailModal 
          request={selectedRequest} 
          onClose={() => setSelectedRequest(null)} 
        />
      )}
      
      {showCreateModal && (
        <CreateRequestModal onClose={() => setShowCreateModal(false)} />
      )}
      
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'requests' && renderApprovalRequests()}
      {activeTab === 'templates' && renderWorkflowTemplates()}
      {activeTab === 'analytics' && renderWorkflowAnalytics()}
    </div>
  );
}; 