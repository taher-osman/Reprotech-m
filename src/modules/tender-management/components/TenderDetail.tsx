import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  MessageSquare, 
  History, 
  Paperclip, 
  Eye,
  Edit3,
  Trash2,
  User,
  Calendar,
  Building,
  Globe,
  DollarSign,
  Users,
  Shield,
  Clock,
  Award,
  AlertTriangle,
  Type,
  Languages,
  X,
  Download,
  Edit,
  Share,
  Bookmark,
  CheckCircle,
  BarChart3,
  Target,
  Zap,
  FolderOpen,
  FileCheck,
  Trophy
} from 'lucide-react';
import { Tender, TenderComment, TenderHistory, TenderAttachment, TenderStatus } from '../types/tenderTypes';
import TenderStatusBadge from './TenderStatusBadge';
import DeadlineCountdown from './DeadlineCountdown';
import TenderStudies from './TenderStudies';
import TenderAttachments from './TenderAttachments';
import TenderTeamAssignment from './TenderTeamAssignment';
import TenderTaskBoard from './TenderTaskBoard';
import TenderWorkflowTracker from './TenderWorkflowTracker';
import TenderIntegrationPanel from './TenderIntegrationPanel';
import TenderAwardHandler from './TenderAwardHandler';
import ContractApprovalFlow from './ContractApprovalFlow';
import TenderDocumentCenter from './TenderDocumentCenter';

interface TenderDetailProps {
  tender: Tender;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (status: string) => Promise<void>;
  onAddComment?: (comment: { content: string; is_internal: boolean }) => Promise<void>;
  onUploadAttachment?: (file: File, type: string) => Promise<void>;
  onDeleteAttachment?: (attachmentId: string) => Promise<void>;
  onClose: () => void;
  onUpdate?: (tender: Tender) => void;
  className?: string;
}

interface Tab {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  count?: number;
}

const tabs: Tab[] = [
  { id: 'overview', title: 'Overview', icon: Eye },
  { id: 'studies', title: 'Studies', icon: FileText },
  { id: 'attachments', title: 'Attachments', icon: Paperclip },
  { id: 'comments', title: 'Comments', icon: MessageSquare },
  { id: 'history', title: 'History', icon: History },
  // Phase 2 tabs
  { id: 'team', title: 'Team Assignment', icon: Users },
  { id: 'tasks', title: 'Task Board', icon: CheckCircle },
  { id: 'workflow', title: 'Workflow Tracker', icon: BarChart3 },
  { id: 'integrations', title: 'Module Integration', icon: Zap },
  // Phase 3 tabs
  { id: 'documents', title: 'Document Center', icon: FolderOpen },
  { id: 'contract', title: 'Contract Approval', icon: FileCheck },
  { id: 'award', title: 'Award Handler', icon: Trophy }
];

export const TenderDetail: React.FC<TenderDetailProps> = ({
  tender,
  onEdit,
  onDelete,
  onStatusChange,
  onAddComment,
  onUploadAttachment,
  onDeleteAttachment,
  onClose,
  onUpdate,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [newComment, setNewComment] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [comments, setComments] = useState<TenderComment[]>(tender.comments || []);
  const [history, setHistory] = useState<TenderHistory[]>(tender.history || []);
  const [showAwardHandler, setShowAwardHandler] = useState(false);
  const [currentUser] = useState({
    user_id: 'user-001',
    name: 'Current User',
    role: 'Project Manager',
    permissions: ['award_tender', 'edit_contract', 'view_documents']
  });

  const handleAddComment = async () => {
    if (!newComment.trim() || !onAddComment) return;

    try {
      setSubmittingComment(true);
      await onAddComment({ content: newComment, is_internal: isInternalComment });
      setNewComment('');
      setIsInternalComment(false);
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleAwardTender = async (awardData: any) => {
    try {
      // Process the award
      console.log('Processing tender award:', awardData);
      
      // Update tender status
      if (onStatusChange) {
        await onStatusChange(TenderStatus.AWARDED);
      }
      
      // Create project, update finance, etc.
      // This would integrate with the actual backend APIs
      
      // Update the tender with award information
      if (onUpdate) {
        const updatedTender = {
          ...tender,
          status: TenderStatus.AWARDED,
          award_date: awardData.award_date
        };
        onUpdate(updatedTender);
      }
      
      setShowAwardHandler(false);
      setActiveTab('overview');
    } catch (error) {
      console.error('Failed to award tender:', error);
      throw error;
    }
  };

  const handleContractApprovalComplete = async (contractData: any) => {
    try {
      console.log('Contract approval completed:', contractData);
      // Handle contract completion logic
    } catch (error) {
      console.error('Failed to complete contract approval:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{tender.title}</h1>
          <p className="text-gray-600 mb-4">{tender.summary}</p>
          <div className="flex items-center space-x-4">
            <TenderStatusBadge status={tender.status} size="lg" />
            <DeadlineCountdown deadline={tender.submission_deadline} size="lg" />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <Edit3 className="h-4 w-4" />
              <span>Edit</span>
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Key Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <FileText className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-900">Reference</h3>
          </div>
          <p className="text-gray-600">{tender.reference_number}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Building className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-900">Owner Entity</h3>
          </div>
          <p className="text-gray-600">{tender.owner_entity}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-900">Source</h3>
          </div>
          <p className="text-gray-600">{tender.source}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-900">Submission Deadline</h3>
          </div>
          <p className="text-gray-600">{formatDate(tender.submission_deadline)}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-900">Opening Date</h3>
          </div>
          <p className="text-gray-600">{formatDate(tender.opening_date)}</p>
        </div>

        {tender.award_date && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="h-5 w-5 text-gray-500" />
              <h3 className="font-medium text-gray-900">Award Date</h3>
            </div>
            <p className="text-gray-600">{formatDate(tender.award_date)}</p>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Type className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-900">Type</h3>
          </div>
          <p className="text-gray-600">{tender.type}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Eye className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-900">Mode</h3>
          </div>
          <p className="text-gray-600">{tender.mode}</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Languages className="h-5 w-5 text-gray-500" />
            <h3 className="font-medium text-gray-900">Language</h3>
          </div>
          <p className="text-gray-600">{tender.language}</p>
        </div>
      </div>

      {/* Assigned Team */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Assigned Team</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-500" />
            <span className="text-gray-600">Manager:</span>
            <span className="font-medium">{tender.assigned_manager_name}</span>
          </div>
        </div>
        
        {tender.linked_departments.length > 0 && (
          <div className="mt-4">
            <span className="text-gray-600">Departments:</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {tender.linked_departments.map((dept, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {dept}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <div>
              <p className="font-medium">Tender Created</p>
              <p className="text-sm text-gray-600">{formatDate(tender.created_at)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div>
              <p className="font-medium">Opening Date</p>
              <p className="text-sm text-gray-600">{formatDate(tender.opening_date)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div>
              <p className="font-medium">Submission Deadline</p>
              <p className="text-sm text-gray-600">{formatDate(tender.submission_deadline)}</p>
            </div>
          </div>
          
          {tender.award_date && (
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Award Date</p>
                <p className="text-sm text-gray-600">{formatDate(tender.award_date)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStudies = () => (
    <TenderStudies
      studies={tender.studies || {
        technical_study: '',
        financial_study: '',
        hr_study: '',
        compliance_study: '',
        created_at: '',
        updated_at: ''
      }}
      onUpdate={async (studies) => {
        // Handle studies update
        console.log('Updating studies:', studies);
      }}
      isEditable={false}
    />
  );

  const renderAttachments = () => (
    <TenderAttachments
      attachments={tender.attachments || []}
      onUpload={onUploadAttachment || (async () => {})}
      onDelete={onDeleteAttachment || (async () => {})}
    />
  );

  const renderComments = () => (
    <div className="space-y-6">
      {/* Add Comment */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add Comment</h3>
        <div className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your comment..."
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isInternalComment}
                onChange={(e) => setIsInternalComment(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">Internal comment</span>
            </label>
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim() || submittingComment}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {submittingComment ? 'Adding...' : 'Add Comment'}
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Comments</h3>
        {comments.map((comment) => (
          <div key={comment.comment_id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium text-gray-900">{comment.user_name}</span>
                {comment.is_internal && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Internal
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">{formatDate(comment.created_at)}</span>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Activity History</h3>
      {history.map((item) => (
        <div key={item.history_id} className="flex items-start space-x-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-gray-900">{item.user_name}</span>
              <span className="text-gray-500">•</span>
              <span className="text-sm text-gray-500">{formatDate(item.created_at)}</span>
            </div>
            <p className="text-gray-700">{item.action}</p>
            {item.details && (
              <p className="text-sm text-gray-600 mt-1">{item.details}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // Phase 2 Tab Renderers
  const renderTeamAssignment = () => (
    <TenderTeamAssignment 
      tenderId={tender.tender_id}
      currentTeam={tender.team_members || []}
      onTeamUpdate={async (team) => {
        console.log('Team updated:', team);
        if (onUpdate) {
          onUpdate({ ...tender, team_members: team });
        }
      }}
      onClose={() => {}}
    />
  );

  const renderTaskBoard = () => (
    <TenderTaskBoard
      tenderId={tender.tender_id}
      tasks={tender.tasks || []}
      teamMembers={tender.team_members || []}
      onTaskUpdate={async (task) => {
        console.log('Task updated:', task);
      }}
      onTaskCreate={async (task) => {
        console.log('Task created:', task);
      }}
      onTaskDelete={async (taskId) => {
        console.log('Task deleted:', taskId);
      }}
    />
  );

  const renderWorkflowTracker = () => (
    <TenderWorkflowTracker
      tenderId={tender.tender_id}
      workflowEvents={tender.workflow_events || []}
      milestones={tender.milestones || []}
      progress={tender.progress || {
        tender_id: tender.tender_id,
        overall_completion: 0,
        studies_completion: { technical: 0, financial: 0, hr: 0, compliance: 0 },
        tasks_completion: { total: 0, completed: 0, in_progress: 0, pending: 0, blocked: 0 },
        team_utilization: [],
        milestones_status: { total: 0, completed: 0, overdue: 0 },
        risk_indicators: { overdue_tasks: 0, team_conflicts: 0, budget_concerns: 0, deadline_risk: 'low' }
      }}
    />
  );

  const renderIntegrations = () => (
    <TenderIntegrationPanel
      tenderId={tender.tender_id}
      integrations={tender.integrations || { hr: [], inventory: [], finance: [], project: [] }}
      onCreateRequest={async (type, request) => {
        console.log('Integration request created:', type, request);
      }}
      onUpdateRequest={async (type, requestId, updates) => {
        console.log('Integration request updated:', type, requestId, updates);
      }}
    />
  );

  // Phase 3 Tab Renderers
  const renderDocumentCenter = () => (
    <TenderDocumentCenter 
      tender_id={tender.tender_id}
    />
  );

  const renderContractApproval = () => (
    <ContractApprovalFlow
      tender_id={tender.tender_id}
      project_type={tender.category}
      onApprovalComplete={handleContractApprovalComplete}
    />
  );

  const renderAwardTab = () => {
    const canAward = tender.status !== TenderStatus.AWARDED && 
                    currentUser.permissions.includes('award_tender');

    return (
      <div className="space-y-6">
        <div className="text-center">
          <Trophy className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Tender Award Management</h3>
          <p className="text-gray-600 mb-6">
            {tender.status === TenderStatus.AWARDED 
              ? 'This tender has been awarded and project initiation is complete.'
              : 'Award this tender to begin project conversion and contract workflows.'
            }
          </p>
        </div>

        {tender.status === TenderStatus.AWARDED ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Trophy className="h-6 w-6 text-green-600" />
              <h4 className="font-medium text-green-900">Tender Awarded</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {tender.award_date && (
                <div>
                  <span className="text-green-700">Award Date:</span>
                  <div className="font-medium text-green-900">
                    {formatDate(tender.award_date)}
                  </div>
                </div>
              )}
              <div>
                <span className="text-green-700">Status:</span>
                <div className="font-medium text-green-900">Project Initiated</div>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => setActiveTab('contract')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-3"
              >
                View Contract Approval
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
              >
                View Documents
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {canAward ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-medium text-blue-900 mb-2">Ready to Award</h4>
                <p className="text-blue-700 text-sm mb-4">
                  This action will initiate the project conversion process, create budget allocations, 
                  assign team members, and begin contract approval workflows.
                </p>
                <button
                  onClick={() => setShowAwardHandler(true)}
                  className="px-6 py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 font-medium flex items-center space-x-2"
                >
                  <Trophy className="h-5 w-5" />
                  <span>Award This Tender</span>
                </button>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-2">Award Pending</h4>
                <p className="text-gray-600 text-sm">
                  {!currentUser.permissions.includes('award_tender')
                    ? 'You do not have permission to award this tender.'
                    : 'Tender award is not available at this time.'
                  }
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'studies':
        return renderStudies();
      case 'attachments':
        return renderAttachments();
      case 'comments':
        return renderComments();
      case 'history':
        return renderHistory();
      // Phase 2 tabs
      case 'team':
        return renderTeamAssignment();
      case 'tasks':
        return renderTaskBoard();
      case 'workflow':
        return renderWorkflowTracker();
      case 'integrations':
        return renderIntegrations();
      // Phase 3 tabs
      case 'documents':
        return renderDocumentCenter();
      case 'contract':
        return renderContractApproval();
      case 'award':
        return renderAwardTab();
      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative min-h-full flex items-center justify-center p-4">
          <div className={`relative bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[90vh] flex flex-col ${className}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{tender.title}</h2>
              <p className="text-sm text-gray-600">Reference: {tender.reference_number}</p>
            </div>
            <div className="flex items-center space-x-3">
              <DeadlineCountdown deadline={tender.submission_deadline} />
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex-1 flex overflow-hidden">
            {/* Tab Navigation */}
            <div className="w-64 border-r border-gray-200 bg-gray-50">
              <div className="p-4">
                <div className="space-y-1">
                  {tabs.map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = activeTab === tab.id;
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <TabIcon className="h-4 w-4" />
                          <span>{tab.title}</span>
                        </div>
                        {tab.count !== undefined && tab.count > 0 && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                            {tab.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Award Handler Modal */}
      {showAwardHandler && (
        <TenderAwardHandler
          tender={tender}
          onAward={handleAwardTender}
          onClose={() => setShowAwardHandler(false)}
          currentUser={currentUser}
        />
      )}
    </>
  );
};

export default TenderDetail; 