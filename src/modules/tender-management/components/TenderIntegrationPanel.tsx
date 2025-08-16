import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  DollarSign, 
  FolderOpen,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Send,
  Eye,
  Calendar,
  User,
  Building,
  TrendingUp,
  FileText,
  Settings,
  Zap,
  ArrowRight,
  Download,
  Upload
} from 'lucide-react';
import { 
  HRIntegration,
  InventoryIntegration,
  FinanceIntegration,
  ProjectIntegration,
  RequestStatus,
  IntegrationType,
  TaskPriority
} from '../types/tenderTypes';

interface TenderIntegrationPanelProps {
  tenderId: string;
  integrations: {
    hr: HRIntegration[];
    inventory: InventoryIntegration[];
    finance: FinanceIntegration[];
    project: ProjectIntegration[];
  };
  onCreateRequest: (type: IntegrationType, request: any) => Promise<void>;
  onUpdateRequest: (type: IntegrationType, requestId: string, updates: any) => Promise<void>;
  className?: string;
}

type TabType = 'hr' | 'inventory' | 'finance' | 'project';

// Mock data for demonstration
const mockIntegrations = {
  hr: [
    {
      integration_id: 'hr-001',
      tender_id: 'tender-001',
      request_type: 'overtime_approval' as const,
      title: 'Overtime Authorization for Tender Team',
      description: 'Request overtime approval for final week before submission deadline',
      requested_for: ['emp-001', 'emp-002', 'emp-003'],
      amount: 2400,
      duration: '1 week',
      justification: 'Critical deadline requires extended hours for final review and submission preparation',
      status: 'APPROVED' as RequestStatus,
      requested_by: 'emp-001',
      requested_at: '2025-07-10T09:00:00Z',
      approved_by: 'hr-manager',
      approved_at: '2025-07-10T14:30:00Z',
      notes: 'Approved for essential team members only'
    },
    {
      integration_id: 'hr-002',
      tender_id: 'tender-001',
      request_type: 'bonus_request' as const,
      title: 'Performance Bonus Pool for Tender Success',
      description: 'Pre-approval for performance bonuses if tender is awarded',
      requested_for: ['emp-001', 'emp-002', 'emp-003', 'emp-004', 'emp-005', 'emp-006'],
      amount: 15000,
      justification: 'Incentivize team performance and retention for high-value tender',
      status: 'PENDING' as RequestStatus,
      requested_by: 'emp-001',
      requested_at: '2025-07-12T11:15:00Z'
    }
  ],
  inventory: [
    {
      integration_id: 'inv-001',
      tender_id: 'tender-001',
      request_type: 'stock_reservation' as const,
      items: [
        {
          item_id: 'itm-001',
          item_name: 'Medical Grade Ventilator',
          quantity: 50,
          unit: 'units',
          estimated_unit_cost: 4500,
          specifications: 'ICU-grade, dual-mode ventilation, FDA approved',
          urgency: 'HIGH' as TaskPriority
        },
        {
          item_id: 'itm-002',
          item_name: 'Patient Monitoring System',
          quantity: 100,
          unit: 'units',
          estimated_unit_cost: 1200,
          specifications: 'Multi-parameter, wireless connectivity, alarm system',
          urgency: 'MEDIUM' as TaskPriority
        }
      ],
      total_estimated_cost: 345000,
      supplier_preferences: ['MedTech Solutions', 'Healthcare Innovations', 'Global Medical Supply'],
      delivery_requirements: 'Phased delivery over 6 months, quality certification required',
      status: 'APPROVED' as RequestStatus,
      requested_by: 'emp-001',
      requested_at: '2025-07-08T16:20:00Z',
      approved_by: 'procurement-manager',
      approved_at: '2025-07-09T10:45:00Z'
    }
  ],
  finance: [
    {
      integration_id: 'fin-001',
      tender_id: 'tender-001',
      request_type: 'budget_allocation' as const,
      title: 'Tender Execution Budget Allocation',
      amount: 1250000,
      currency: 'USD',
      category: 'Project Budget',
      breakdown: [
        {
          category: 'Equipment Procurement',
          description: 'Medical devices and equipment',
          amount: 900000,
          percentage: 72
        },
        {
          category: 'Labor & Services',
          description: 'Installation, training, maintenance',
          amount: 200000,
          percentage: 16
        },
        {
          category: 'Project Management',
          description: 'Coordination, oversight, documentation',
          amount: 100000,
          percentage: 8
        },
        {
          category: 'Contingency',
          description: 'Risk mitigation and unforeseen costs',
          amount: 50000,
          percentage: 4
        }
      ],
      justification: 'Budget allocation for successful tender execution including equipment, services, and contingency',
      status: 'APPROVED' as RequestStatus,
      requested_by: 'emp-001',
      requested_at: '2025-07-05T13:30:00Z',
      approved_by: 'finance-director',
      approved_at: '2025-07-06T09:15:00Z'
    },
    {
      integration_id: 'fin-002',
      tender_id: 'tender-001',
      request_type: 'cost_estimation' as const,
      title: 'Detailed Cost Analysis Update',
      amount: 25000,
      currency: 'USD',
      category: 'Professional Services',
      breakdown: [
        {
          category: 'Market Research',
          description: 'Competitive analysis and pricing research',
          amount: 15000,
          percentage: 60
        },
        {
          category: 'Financial Modeling',
          description: 'ROI analysis and financial projections',
          amount: 10000,
          percentage: 40
        }
      ],
      justification: 'Enhanced cost analysis required for competitive positioning',
      status: 'IN_REVIEW' as RequestStatus,
      requested_by: 'emp-002',
      requested_at: '2025-07-11T14:45:00Z'
    }
  ],
  project: [
    {
      integration_id: 'proj-001',
      tender_id: 'tender-001',
      project_name: 'Medical Equipment Supply & Installation Project',
      project_description: 'Complete supply, installation, and commissioning of medical equipment for healthcare facility upgrade',
      phases: [
        {
          phase_id: 'phase-001',
          title: 'Procurement & Quality Assurance',
          description: 'Equipment procurement, quality testing, and certification',
          planned_start: '2025-08-01',
          planned_end: '2025-10-31',
          dependencies: [],
          deliverables: ['Equipment delivery', 'Quality certificates', 'Acceptance testing']
        },
        {
          phase_id: 'phase-002',
          title: 'Installation & Configuration',
          description: 'On-site installation, system integration, and configuration',
          planned_start: '2025-11-01',
          planned_end: '2025-12-15',
          dependencies: ['phase-001'],
          deliverables: ['Installation completion', 'System integration', 'Performance testing']
        },
        {
          phase_id: 'phase-003',
          title: 'Training & Handover',
          description: 'Staff training, documentation, and project handover',
          planned_start: '2025-12-16',
          planned_end: '2026-01-15',
          dependencies: ['phase-002'],
          deliverables: ['Training completion', 'Documentation package', 'Final handover']
        }
      ],
      estimated_duration: '5 months',
      budget_allocated: 1250000,
      project_manager_id: 'emp-001',
      team_members: ['emp-001', 'emp-002', 'emp-003', 'emp-004'],
      status: 'Draft' as const,
      created_at: '2025-07-08T12:00:00Z'
    }
  ]
};

export const TenderIntegrationPanel: React.FC<TenderIntegrationPanelProps> = ({
  tenderId,
  integrations: initialIntegrations,
  onCreateRequest,
  onUpdateRequest,
  className = ''
}) => {
  const [integrations] = useState(
    Object.keys(initialIntegrations).length > 0 ? initialIntegrations : mockIntegrations
  );
  const [activeTab, setActiveTab] = useState<TabType>('hr');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const tabs = [
    { id: 'hr' as TabType, label: 'HR Integration', icon: Users, color: 'blue' },
    { id: 'inventory' as TabType, label: 'Inventory', icon: Package, color: 'green' },
    { id: 'finance' as TabType, label: 'Finance', icon: DollarSign, color: 'yellow' },
    { id: 'project' as TabType, label: 'Project', icon: FolderOpen, color: 'purple' }
  ];

  const getStatusColor = (status: RequestStatus) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      APPROVED: 'bg-green-100 text-green-800 border-green-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200',
      IN_REVIEW: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status: RequestStatus) => {
    const icons = {
      PENDING: Clock,
      APPROVED: CheckCircle,
      REJECTED: X,
      IN_REVIEW: Eye
    };
    return icons[status] || Clock;
  };

  const renderHRIntegration = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">HR Integration</h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New HR Request</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">
            {integrations.hr.filter(r => r.status === 'PENDING').length}
          </div>
          <div className="text-sm text-blue-700">Pending Requests</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {integrations.hr.filter(r => r.status === 'APPROVED').length}
          </div>
          <div className="text-sm text-green-700">Approved</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-600">
            ${integrations.hr.reduce((sum, r) => sum + (r.amount || 0), 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-700">Total Budget</div>
        </div>
      </div>

      {/* HR Requests */}
      <div className="space-y-4">
        {integrations.hr.map(request => {
          const StatusIcon = getStatusIcon(request.status);
          return (
            <div
              key={request.integration_id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedRequest(request);
                setShowDetailModal(true);
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{request.title}</h4>
                  <p className="text-sm text-gray-600">{request.description}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                    {request.status.replace('_', ' ')}
                  </span>
                  <StatusIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <div className="font-medium capitalize">
                    {request.request_type.replace('_', ' ')}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Amount:</span>
                  <div className="font-medium">
                    {request.amount ? `$${request.amount.toLocaleString()}` : 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Duration:</span>
                  <div className="font-medium">{request.duration || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-gray-500">Requested:</span>
                  <div className="font-medium">
                    {new Date(request.requested_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {request.requested_for.length > 0 && (
                <div className="mt-4">
                  <span className="text-sm text-gray-500">Requested for:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {request.requested_for.slice(0, 3).map((userId, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                      >
                        {userId}
                      </span>
                    ))}
                    {request.requested_for.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                        +{request.requested_for.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {integrations.hr.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No HR requests</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first HR integration request for this tender
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderInventoryIntegration = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Inventory Integration</h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Inventory Request</span>
        </button>
      </div>

      {/* Inventory Requests */}
      <div className="space-y-4">
        {integrations.inventory.map(request => {
          const StatusIcon = getStatusIcon(request.status);
          return (
            <div
              key={request.integration_id}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1 capitalize">
                    {request.request_type.replace('_', ' ')}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {request.items.length} items • Total: ${request.total_estimated_cost.toLocaleString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                  {request.status.replace('_', ' ')}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {request.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <div className="font-medium text-gray-900">{item.item_name}</div>
                      <div className="text-sm text-gray-600">{item.specifications}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{item.quantity} {item.unit}</div>
                      <div className="text-sm text-gray-600">
                        ${(item.estimated_unit_cost * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
                {request.items.length > 2 && (
                  <div className="text-center py-2 text-sm text-gray-500">
                    +{request.items.length - 2} more items
                  </div>
                )}
              </div>

              {/* Delivery Requirements */}
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <div className="text-sm font-medium text-blue-900 mb-1">Delivery Requirements</div>
                <div className="text-sm text-blue-700">{request.delivery_requirements}</div>
              </div>

              {/* Preferred Suppliers */}
              <div className="mt-3">
                <div className="text-sm text-gray-500 mb-2">Preferred Suppliers:</div>
                <div className="flex flex-wrap gap-2">
                  {request.supplier_preferences.map((supplier, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm"
                    >
                      {supplier}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {integrations.inventory.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No inventory requests</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create inventory requests for stock reservation or procurement
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderFinanceIntegration = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Finance Integration</h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Finance Request</span>
        </button>
      </div>

      {/* Finance Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            ${integrations.finance.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-yellow-700">Total Requested</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            ${integrations.finance.filter(r => r.status === 'APPROVED').reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
          </div>
          <div className="text-sm text-green-700">Approved</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">
            {integrations.finance.filter(r => r.status === 'PENDING' || r.status === 'IN_REVIEW').length}
          </div>
          <div className="text-sm text-blue-700">Pending Review</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-600">
            {integrations.finance.length}
          </div>
          <div className="text-sm text-gray-700">Total Requests</div>
        </div>
      </div>

      {/* Finance Requests */}
      <div className="space-y-4">
        {integrations.finance.map(request => {
          const StatusIcon = getStatusIcon(request.status);
          return (
            <div
              key={request.integration_id}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{request.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{request.currency} {request.amount.toLocaleString()}</span>
                    <span>•</span>
                    <span className="capitalize">{request.request_type.replace('_', ' ')}</span>
                    <span>•</span>
                    <span>{request.category}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                    {request.status.replace('_', ' ')}
                  </span>
                  <StatusIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">Budget Breakdown:</div>
                <div className="space-y-2">
                  {request.breakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{item.category}</span>
                          <span className="text-sm font-medium text-gray-900">
                            ${item.amount.toLocaleString()} ({item.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded">
                <div className="text-sm font-medium text-gray-900 mb-1">Justification</div>
                <div className="text-sm text-gray-600">{request.justification}</div>
              </div>

              <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                <span>Requested by {request.requested_by}</span>
                <span>{new Date(request.requested_at).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}

        {integrations.finance.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No finance requests</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create budget allocations and cost estimation requests
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderProjectIntegration = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Project Integration</h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Project</span>
        </button>
      </div>

      {/* Project List */}
      <div className="space-y-4">
        {integrations.project.map(project => (
          <div
            key={project.integration_id}
            className="bg-white border border-gray-200 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">{project.project_name}</h4>
                <p className="text-sm text-gray-600">{project.project_description}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  project.status === 'Active' ? 'bg-green-100 text-green-800 border-green-200' :
                  project.status === 'Draft' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                  'bg-blue-100 text-blue-800 border-blue-200'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-500">Duration:</span>
                <div className="font-medium">{project.estimated_duration}</div>
              </div>
              <div>
                <span className="text-gray-500">Budget:</span>
                <div className="font-medium">${project.budget_allocated.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-gray-500">Team Size:</span>
                <div className="font-medium">{project.team_members.length} members</div>
              </div>
              <div>
                <span className="text-gray-500">Phases:</span>
                <div className="font-medium">{project.phases.length} phases</div>
              </div>
            </div>

            {/* Project Phases */}
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-900">Project Phases:</div>
              {project.phases.map((phase, index) => (
                <div key={phase.phase_id} className="border border-gray-200 rounded p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-medium text-gray-900">
                        Phase {index + 1}: {phase.title}
                      </div>
                      <div className="text-sm text-gray-600">{phase.description}</div>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <div>{new Date(phase.planned_start).toLocaleDateString()} - {new Date(phase.planned_end).toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {phase.deliverables.map((deliverable, delivIndex) => (
                      <span
                        key={delivIndex}
                        className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                      >
                        {deliverable}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
              <span>Created {new Date(project.created_at).toLocaleDateString()}</span>
              {project.status === 'Draft' && (
                <button className="text-purple-600 hover:text-purple-700 font-medium">
                  Activate Project
                </button>
              )}
            </div>
          </div>
        ))}

        {integrations.project.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects created</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create a project to be automatically generated when tender is awarded
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900">Module Integration</h2>
        <p className="text-gray-600">Connect with HR, Inventory, Finance, and Project modules</p>
      </div>

      {/* Integration Status Overview */}
      <div className="grid grid-cols-4 gap-4">
        {tabs.map(tab => {
          const TabIcon = tab.icon;
          const requests = integrations[tab.id] || [];
          const pendingCount = requests.filter((r: any) => 
            r.status === 'PENDING' || r.status === 'IN_REVIEW'
          ).length;
          
          return (
            <div key={tab.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-8 h-8 bg-${tab.color}-100 rounded flex items-center justify-center`}>
                  <TabIcon className={`h-4 w-4 text-${tab.color}-600`} />
                </div>
                <div className="text-sm font-medium text-gray-900">{tab.label}</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900">{requests.length}</div>
                <div className="text-sm text-gray-600">
                  {pendingCount > 0 ? `${pendingCount} pending` : 'All resolved'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          {tabs.map(tab => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <TabIcon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'hr' && renderHRIntegration()}
        {activeTab === 'inventory' && renderInventoryIntegration()}
        {activeTab === 'finance' && renderFinanceIntegration()}
        {activeTab === 'project' && renderProjectIntegration()}
      </div>

      {/* Modals would go here */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Create {tabs.find(t => t.id === activeTab)?.label} Request
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-500">Form implementation for {activeTab} requests</p>
              <button
                onClick={() => setShowCreateModal(false)}
                className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenderIntegrationPanel; 