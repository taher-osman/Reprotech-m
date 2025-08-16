import React, { useState, useEffect } from 'react';
import { 
  FileText,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  ArrowRight,
  X,
  User,
  Calendar,
  MessageSquare,
  History
} from 'lucide-react';

interface ApprovalStep {
  step_id: string;
  step_name: string;
  approver_role: string;
  approver_id?: string;
  approver_name?: string;
  required_documents: string[];
  status: 'Pending' | 'Approved' | 'Rejected' | 'Skipped';
  approved_date?: string;
  comments?: string;
  order: number;
}

interface ContractTemplate {
  template_id: string;
  template_name: string;
  project_type: string;
  description: string;
  required_clauses: string[];
  approval_workflow: ApprovalStep[];
  document_requirements: string[];
  estimated_duration: number; // days
}

interface ApprovalHistory {
  action_id: string;
  step_id: string;
  action: 'approved' | 'rejected' | 'requested_changes';
  user_name: string;
  timestamp: string;
  comments: string;
  documents_attached: string[];
}

interface ContractApprovalFlowProps {
  tender_id: string;
  project_type: string;
  onApprovalComplete: (contractData: any) => void;
  className?: string;
}

// Mock data
const mockTemplates: ContractTemplate[] = [
  {
    template_id: 'template-001',
    template_name: 'Medical Equipment Supply Contract',
    project_type: 'Equipment Procurement',
    description: 'Standard contract for medical equipment procurement projects',
    required_clauses: ['Delivery Terms', 'Warranty', 'Technical Specifications', 'Payment Terms'],
    approval_workflow: [
      {
        step_id: 'step-001',
        step_name: 'Department Manager Review',
        approver_role: 'Department Manager',
        approver_name: 'Dr. Ahmed Hassan',
        required_documents: ['Technical Specifications', 'Budget Approval'],
        status: 'Approved',
        approved_date: '2025-07-01',
        order: 1
      },
      {
        step_id: 'step-002',
        step_name: 'HR Approval',
        approver_role: 'HR Manager',
        approver_name: 'Sarah Johnson',
        required_documents: ['Staff Assignment Plan'],
        status: 'Approved',
        approved_date: '2025-07-02',
        order: 2
      },
      {
        step_id: 'step-003',
        step_name: 'Finance Review',
        approver_role: 'Finance Director',
        approver_name: 'Mohammad Al-Rashid',
        required_documents: ['Budget Breakdown', 'Financial Guarantees'],
        status: 'Pending',
        order: 3
      },
      {
        step_id: 'step-004',
        step_name: 'CEO Final Approval',
        approver_role: 'CEO',
        approver_name: 'Dr. Abdullah Al-Mahmoud',
        required_documents: ['Complete Contract Package'],
        status: 'Pending',
        order: 4
      }
    ],
    document_requirements: ['Contract Draft', 'Technical Appendix', 'Financial Terms', 'Legal Review'],
    estimated_duration: 14
  },
  {
    template_id: 'template-002',
    template_name: 'Service Agreement Contract',
    project_type: 'Professional Services',
    description: 'Contract template for professional service providers',
    required_clauses: ['Service Scope', 'Performance Metrics', 'Confidentiality', 'Termination'],
    approval_workflow: [
      {
        step_id: 'step-005',
        step_name: 'Project Manager Review',
        approver_role: 'Project Manager',
        required_documents: ['Service Requirements', 'Scope Definition'],
        status: 'Pending',
        order: 1
      },
      {
        step_id: 'step-006',
        step_name: 'Legal Review',
        approver_role: 'Legal Counsel',
        required_documents: ['Legal Risk Assessment'],
        status: 'Pending',
        order: 2
      },
      {
        step_id: 'step-007',
        step_name: 'Finance Approval',
        approver_role: 'Finance Director',
        required_documents: ['Payment Schedule', 'Budget Allocation'],
        status: 'Pending',
        order: 3
      }
    ],
    document_requirements: ['Service Agreement', 'SLA Document', 'Payment Terms'],
    estimated_duration: 10
  }
];

const mockApprovalHistory: ApprovalHistory[] = [
  {
    action_id: 'action-001',
    step_id: 'step-001',
    action: 'approved',
    user_name: 'Dr. Ahmed Hassan',
    timestamp: '2025-07-01T10:30:00Z',
    comments: 'Technical specifications look good. Budget is within acceptable range.',
    documents_attached: ['Technical_Review_Report.pdf']
  },
  {
    action_id: 'action-002',
    step_id: 'step-002',
    action: 'approved',
    user_name: 'Sarah Johnson',
    timestamp: '2025-07-02T14:15:00Z',
    comments: 'Staff allocation plan approved. Team members are available for the project duration.',
    documents_attached: ['HR_Approval_Certificate.pdf']
  },
  {
    action_id: 'action-003',
    step_id: 'step-003',
    action: 'requested_changes',
    user_name: 'Mohammad Al-Rashid',
    timestamp: '2025-07-03T09:45:00Z',
    comments: 'Need clarification on payment terms. Please revise clause 4.2 regarding milestone payments.',
    documents_attached: ['Financial_Review_Notes.pdf']
  }
];

export const ContractApprovalFlow: React.FC<ContractApprovalFlowProps> = ({
  tender_id,
  project_type,
  onApprovalComplete,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState<'workflow' | 'documents' | 'builder' | 'history'>('workflow');
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(mockTemplates[0]);
  const [uploadedDocuments, setUploadedDocuments] = useState<{ [key: string]: File }>({});
  const [approvalComments, setApprovalComments] = useState<{ [key: string]: string }>({});

  const getStepStatusColor = (status: string) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Approved': 'bg-green-100 text-green-800 border-green-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200',
      'Skipped': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStepIcon = (status: string) => {
    const icons = {
      'Pending': Clock,
      'Approved': CheckCircle,
      'Rejected': X,
      'Skipped': ArrowRight
    };
    return icons[status as keyof typeof icons] || Clock;
  };

  const renderWorkflowTab = () => (
    <div className="space-y-6">
      {/* Template Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Contract Template
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockTemplates.map(template => (
            <div
              key={template.template_id}
              onClick={() => setSelectedTemplate(template)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedTemplate?.template_id === template.template_id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-medium text-gray-900 mb-2">{template.template_name}</h4>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{template.approval_workflow.length} approval steps</span>
                <span>{template.estimated_duration} days estimated</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approval Workflow */}
      {selectedTemplate && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Approval Workflow</h3>
          <div className="space-y-4">
            {selectedTemplate.approval_workflow.map((step, index) => {
              const StepIcon = getStepIcon(step.status);
              const isCurrentStep = step.status === 'Pending' && 
                selectedTemplate.approval_workflow.slice(0, index).every(s => s.status === 'Approved');
              
              return (
                <div
                  key={step.step_id}
                  className={`relative bg-white border rounded-lg p-6 ${
                    isCurrentStep ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                  }`}
                >
                  {/* Step Number and Status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === 'Approved' ? 'bg-green-600 text-white' :
                        step.status === 'Rejected' ? 'bg-red-600 text-white' :
                        isCurrentStep ? 'bg-blue-600 text-white' :
                        'bg-gray-300 text-gray-600'
                      }`}>
                        {step.status === 'Approved' || step.status === 'Rejected' ? (
                          <StepIcon className="h-4 w-4" />
                        ) : (
                          <span className="text-sm font-medium">{step.order}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{step.step_name}</h4>
                        <p className="text-sm text-gray-600">
                          {step.approver_name} ({step.approver_role})
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStepStatusColor(step.status)}`}>
                      {step.status}
                    </span>
                  </div>

                  {/* Required Documents */}
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-700">Required Documents:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {step.required_documents.map((doc, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Approval Actions (for current step) */}
                  {isCurrentStep && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Comments
                          </label>
                          <textarea
                            value={approvalComments[step.step_id] || ''}
                            onChange={(e) => setApprovalComments(prev => ({
                              ...prev,
                              [step.step_id]: e.target.value
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="Add comments for this approval step..."
                          />
                        </div>
                        <div className="flex space-x-3">
                          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-2">
                            <X className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                          <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 flex items-center space-x-2">
                            <MessageSquare className="h-4 w-4" />
                            <span>Request Changes</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Approval Details (for completed steps) */}
                  {step.status !== 'Pending' && step.approved_date && (
                    <div className="border-t border-gray-200 pt-4">
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Completed: {new Date(step.approved_date).toLocaleDateString()}</span>
                        </div>
                        {step.comments && (
                          <div className="mt-2">
                            <span className="font-medium">Comments:</span>
                            <p className="mt-1">{step.comments}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Connection Line */}
                  {index < selectedTemplate.approval_workflow.length - 1 && (
                    <div className="absolute left-9 -bottom-4 w-0.5 h-8 bg-gray-300"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Contract Documents</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
          <Upload className="h-4 w-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Required Documents */}
      {selectedTemplate && (
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Required Documents</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedTemplate.document_requirements.map((docType, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-medium text-gray-900">{docType}</h5>
                    <p className="text-sm text-gray-600">Required for contract approval</p>
                  </div>
                  {uploadedDocuments[docType] ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                
                {uploadedDocuments[docType] ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded p-3">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">{uploadedDocuments[docType].name}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-green-600 hover:text-green-800">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="mt-2">
                        <label className="cursor-pointer">
                          <span className="text-sm font-medium text-gray-900">Upload {docType}</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setUploadedDocuments(prev => ({ ...prev, [docType]: file }));
                              }
                            }}
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-1">PDF, DOC up to 10MB</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderBuilderTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Workflow Builder</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Step</span>
        </button>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Settings className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">Custom Workflow Builder</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Drag and drop to create custom approval workflows. Configure approvers, required documents, and conditions.
            </p>
          </div>
        </div>
      </div>

      {/* Drag and Drop Builder Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Components */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-4">Available Components</h4>
          <div className="space-y-3">
            {[
              { type: 'approval', label: 'Approval Step', icon: CheckCircle },
              { type: 'review', label: 'Review Step', icon: Eye },
              { type: 'document', label: 'Document Upload', icon: Upload },
              { type: 'condition', label: 'Conditional Logic', icon: Settings }
            ].map(component => (
              <div
                key={component.type}
                className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded cursor-move hover:border-blue-300"
              >
                <component.icon className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">{component.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Canvas */}
        <div className="lg:col-span-2 bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 min-h-96">
          <div className="text-center text-gray-500">
            <Settings className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4">Drag components here to build your workflow</p>
            <p className="text-sm">Coming soon: Visual workflow builder</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Approval History</h3>
      
      <div className="space-y-4">
        {mockApprovalHistory.map(history => (
          <div key={history.action_id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  history.action === 'approved' ? 'bg-green-100' :
                  history.action === 'rejected' ? 'bg-red-100' :
                  'bg-yellow-100'
                }`}>
                  {history.action === 'approved' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : history.action === 'rejected' ? (
                    <X className="h-4 w-4 text-red-600" />
                  ) : (
                    <MessageSquare className="h-4 w-4 text-yellow-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{history.user_name}</h4>
                  <p className="text-sm text-gray-600">
                    {history.action === 'approved' ? 'Approved' :
                     history.action === 'rejected' ? 'Rejected' :
                     'Requested Changes'}
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(history.timestamp).toLocaleDateString()} at {new Date(history.timestamp).toLocaleTimeString()}
              </span>
            </div>
            
            <div className="ml-11">
              <p className="text-sm text-gray-700 mb-3">{history.comments}</p>
              
              {history.documents_attached.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Attached Documents:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {history.documents_attached.map((doc, idx) => (
                      <div key={idx} className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded text-sm">
                        <FileText className="h-3 w-3 text-gray-600" />
                        <span>{doc}</span>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Download className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-bold text-gray-900">Contract Approval Flow</h2>
        <p className="text-sm text-gray-600">Tender ID: {tender_id}</p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6">
          {[
            { id: 'workflow', label: 'Workflow', icon: ArrowRight },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'builder', label: 'Builder', icon: Settings },
            { id: 'history', label: 'History', icon: History }
          ].map(tab => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <TabIcon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'workflow' && renderWorkflowTab()}
        {activeTab === 'documents' && renderDocumentsTab()}
        {activeTab === 'builder' && renderBuilderTab()}
        {activeTab === 'history' && renderHistoryTab()}
      </div>
    </div>
  );
};

export default ContractApprovalFlow; 