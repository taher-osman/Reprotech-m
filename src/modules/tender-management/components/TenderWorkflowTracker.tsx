import React, { useState, useEffect } from 'react';
import { 
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  User,
  FileText,
  Upload,
  Award,
  Target,
  TrendingUp,
  Activity,
  Filter,
  Download,
  BarChart3,
  PieChart,
  Eye,
  MessageSquare
} from 'lucide-react';
import { 
  TenderWorkflowEvent, 
  TenderMilestone, 
  TenderProgress,
  TaskStatus,
  TaskPriority
} from '../types/tenderTypes';

interface TenderWorkflowTrackerProps {
  tenderId: string;
  workflowEvents: TenderWorkflowEvent[];
  milestones: TenderMilestone[];
  progress: TenderProgress;
  onExportTimeline?: () => void;
  className?: string;
}

// Mock data for demonstration
const mockWorkflowEvents: TenderWorkflowEvent[] = [
  {
    event_id: 'event-001',
    tender_id: 'tender-001',
    event_type: 'team_assigned',
    title: 'Team Formation Complete',
    description: 'All core team members have been assigned to the tender',
    user_id: 'emp-001',
    user_name: 'Dr. Ahmed Hassan',
    timestamp: '2025-07-01T09:00:00Z',
    related_id: 'team-001',
    metadata: { team_size: 6, roles_filled: 6 }
  },
  {
    event_id: 'event-002',
    tender_id: 'tender-001',
    event_type: 'task_created',
    title: 'Technical Specification Review Task Created',
    description: 'Task for reviewing technical requirements has been created and assigned',
    user_id: 'emp-001',
    user_name: 'Dr. Ahmed Hassan',
    timestamp: '2025-07-01T09:15:00Z',
    related_id: 'task-001',
    metadata: { priority: 'HIGH', estimated_hours: 16 }
  },
  {
    event_id: 'event-003',
    tender_id: 'tender-001',
    event_type: 'document_uploaded',
    title: 'Legal Compliance Checklist Uploaded',
    description: 'Legal team uploaded initial compliance documentation',
    user_id: 'emp-003',
    user_name: 'Michael Chen',
    timestamp: '2025-07-01T14:30:00Z',
    related_id: 'doc-001',
    metadata: { file_type: 'PDF', file_size: '2.4MB' }
  },
  {
    event_id: 'event-004',
    tender_id: 'tender-001',
    event_type: 'study_approved',
    title: 'Quality Assurance Plan Approved',
    description: 'QA study section has been reviewed and approved by project lead',
    user_id: 'emp-001',
    user_name: 'Dr. Ahmed Hassan',
    timestamp: '2025-07-08T17:30:00Z',
    related_id: 'study-qa',
    metadata: { approval_level: 'Project Lead', completion_percentage: 100 }
  },
  {
    event_id: 'event-005',
    tender_id: 'tender-001',
    event_type: 'milestone_reached',
    title: 'Initial Planning Phase Complete',
    description: 'All initial planning tasks and documentation have been completed',
    user_id: 'system',
    user_name: 'System',
    timestamp: '2025-07-10T18:00:00Z',
    related_id: 'milestone-001',
    metadata: { completion_percentage: 35, on_schedule: true }
  },
  {
    event_id: 'event-006',
    tender_id: 'tender-001',
    event_type: 'task_completed',
    title: 'Budget Analysis Completed',
    description: 'Financial analysis and cost breakdown have been finalized',
    user_id: 'emp-002',
    user_name: 'Sarah Wilson',
    timestamp: '2025-07-12T16:45:00Z',
    related_id: 'task-002',
    metadata: { actual_hours: 22, estimated_hours: 24, efficiency: 109 }
  }
];

const mockMilestones: TenderMilestone[] = [
  {
    milestone_id: 'milestone-001',
    tender_id: 'tender-001',
    title: 'Initial Planning Phase',
    description: 'Complete team formation, initial task assignment, and basic documentation',
    planned_date: '2025-07-10',
    actual_date: '2025-07-10',
    is_completed: true,
    completion_percentage: 100,
    required_tasks: ['task-001', 'task-003', 'task-004']
  },
  {
    milestone_id: 'milestone-002',
    tender_id: 'tender-001',
    title: 'Technical & Financial Analysis',
    description: 'Complete all technical specifications and financial analysis',
    planned_date: '2025-07-20',
    actual_date: undefined,
    is_completed: false,
    completion_percentage: 75,
    required_tasks: ['task-001', 'task-002', 'task-005']
  },
  {
    milestone_id: 'milestone-003',
    tender_id: 'tender-001',
    title: 'Final Review & Submission',
    description: 'Complete final review, quality check, and submit tender',
    planned_date: '2025-07-25',
    actual_date: undefined,
    is_completed: false,
    completion_percentage: 0,
    required_tasks: ['task-006', 'task-007', 'task-008']
  }
];

const mockProgress: TenderProgress = {
  tender_id: 'tender-001',
  overall_completion: 68,
  studies_completion: {
    technical: 85,
    financial: 70,
    hr: 45,
    compliance: 90
  },
  tasks_completion: {
    total: 8,
    completed: 3,
    in_progress: 3,
    pending: 1,
    blocked: 1
  },
  team_utilization: [
    {
      user_id: 'emp-001',
      user_name: 'Dr. Ahmed Hassan',
      assigned_tasks: 3,
      completed_tasks: 2,
      utilization_percentage: 85
    },
    {
      user_id: 'emp-002',
      user_name: 'Sarah Wilson',
      assigned_tasks: 2,
      completed_tasks: 1,
      utilization_percentage: 75
    },
    {
      user_id: 'emp-003',
      user_name: 'Michael Chen',
      assigned_tasks: 1,
      completed_tasks: 1,
      utilization_percentage: 60
    }
  ],
  milestones_status: {
    total: 3,
    completed: 1,
    overdue: 0
  },
  risk_indicators: {
    overdue_tasks: 1,
    team_conflicts: 0,
    budget_concerns: 0,
    deadline_risk: 'medium'
  }
};

type ViewMode = 'timeline' | 'milestones' | 'analytics';

export const TenderWorkflowTracker: React.FC<TenderWorkflowTrackerProps> = ({
  tenderId,
  workflowEvents: initialEvents,
  milestones: initialMilestones,
  progress: initialProgress,
  onExportTimeline,
  className = ''
}) => {
  const [workflowEvents] = useState<TenderWorkflowEvent[]>(
    initialEvents.length > 0 ? initialEvents : mockWorkflowEvents
  );
  const [milestones] = useState<TenderMilestone[]>(
    initialMilestones.length > 0 ? initialMilestones : mockMilestones
  );
  const [progress] = useState<TenderProgress>(
    initialProgress.tender_id ? initialProgress : mockProgress
  );
  
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('all');

  const filteredEvents = workflowEvents.filter(event => {
    if (eventFilter === 'all') return true;
    return event.event_type === eventFilter;
  });

  const getEventIcon = (eventType: string) => {
    const icons = {
      task_created: Clock,
      task_completed: CheckCircle,
      team_assigned: User,
      document_uploaded: Upload,
      study_approved: Award,
      milestone_reached: Target
    };
    return icons[eventType as keyof typeof icons] || Activity;
  };

  const getEventColor = (eventType: string) => {
    const colors = {
      task_created: 'bg-blue-100 text-blue-600 border-blue-200',
      task_completed: 'bg-green-100 text-green-600 border-green-200',
      team_assigned: 'bg-purple-100 text-purple-600 border-purple-200',
      document_uploaded: 'bg-orange-100 text-orange-600 border-orange-200',
      study_approved: 'bg-emerald-100 text-emerald-600 border-emerald-200',
      milestone_reached: 'bg-amber-100 text-amber-600 border-amber-200'
    };
    return colors[eventType as keyof typeof colors] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getRiskColor = (risk: string) => {
    const colors = {
      low: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      high: 'text-red-600 bg-red-100'
    };
    return colors[risk as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  const getMilestoneStatus = (milestone: TenderMilestone) => {
    if (milestone.is_completed) return 'completed';
    
    const today = new Date();
    const plannedDate = new Date(milestone.planned_date);
    
    if (plannedDate < today) return 'overdue';
    if (milestone.completion_percentage > 0) return 'in_progress';
    return 'pending';
  };

  const getMilestoneStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
      overdue: 'bg-red-100 text-red-800 border-red-200',
      pending: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const renderTimeline = () => (
    <div className="space-y-6">
      {/* Timeline Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Workflow Timeline ({filteredEvents.length} events)
        </h3>
        <div className="flex items-center space-x-3">
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Events</option>
            <option value="task_created">Tasks Created</option>
            <option value="task_completed">Tasks Completed</option>
            <option value="team_assigned">Team Changes</option>
            <option value="document_uploaded">Documents</option>
            <option value="study_approved">Approvals</option>
            <option value="milestone_reached">Milestones</option>
          </select>
          {onExportTimeline && (
            <button
              onClick={onExportTimeline}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {filteredEvents.map((event, index) => {
            const Icon = getEventIcon(event.event_type);
            const eventColor = getEventColor(event.event_type);
            
            return (
              <div key={event.event_id} className="relative flex items-start space-x-4">
                {/* Timeline dot */}
                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${eventColor}`}>
                  <Icon className="h-4 w-4" />
                </div>
                
                {/* Event content */}
                <div className="flex-1 min-w-0 pb-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{event.user_name}</span>
                      </div>
                      
                      {event.metadata && (
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          {event.metadata.priority && (
                            <span className={`px-2 py-0.5 rounded ${
                              event.metadata.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                              event.metadata.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {event.metadata.priority}
                            </span>
                          )}
                          {event.metadata.completion_percentage !== undefined && (
                            <span className="text-green-600">
                              {event.metadata.completion_percentage}% complete
                            </span>
                          )}
                          {event.metadata.efficiency && (
                            <span className={`${
                              event.metadata.efficiency > 100 ? 'text-green-600' : 'text-gray-600'
                            }`}>
                              {event.metadata.efficiency}% efficiency
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderMilestones = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">
        Project Milestones ({milestones.length})
      </h3>
      
      {/* Milestone Progress Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Overall Progress</h4>
          <span className="text-2xl font-bold text-blue-600">{progress.overall_completion}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress.overall_completion}%` }}
          ></div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{progress.milestones_status.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {progress.milestones_status.total - progress.milestones_status.completed - progress.milestones_status.overdue}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{progress.milestones_status.overdue}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </div>
        </div>
      </div>

      {/* Milestone List */}
      <div className="space-y-4">
        {milestones.map((milestone, index) => {
          const status = getMilestoneStatus(milestone);
          const statusColor = getMilestoneStatusColor(status);
          const daysUntilDue = Math.ceil((new Date(milestone.planned_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <div key={milestone.milestone_id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-lg font-medium text-gray-900">{index + 1}.</span>
                    <h4 className="text-lg font-medium text-gray-900">{milestone.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColor}`}>
                      {status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-600 ml-8">{milestone.description}</p>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {milestone.completion_percentage}%
                  </div>
                  <div className="text-sm text-gray-600">
                    Due: {new Date(milestone.planned_date).toLocaleDateString()}
                  </div>
                  {!milestone.is_completed && (
                    <div className={`text-sm mt-1 ${
                      daysUntilDue < 0 ? 'text-red-600' :
                      daysUntilDue <= 3 ? 'text-orange-600' :
                      'text-gray-600'
                    }`}>
                      {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` :
                       daysUntilDue === 0 ? 'Due today' :
                       `${daysUntilDue} days remaining`}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mb-4 ml-8">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      milestone.is_completed ? 'bg-green-500' :
                      milestone.completion_percentage > 75 ? 'bg-blue-500' :
                      milestone.completion_percentage > 50 ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`}
                    style={{ width: `${milestone.completion_percentage}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Required tasks */}
              <div className="ml-8">
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  Required Tasks ({milestone.required_tasks.length})
                </h5>
                <div className="flex flex-wrap gap-2">
                  {milestone.required_tasks.map((taskId, taskIndex) => (
                    <span 
                      key={taskIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                    >
                      Task {taskId.split('-')[1]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Progress Analytics</h3>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Overall Progress</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">{progress.overall_completion}%</div>
          <div className="text-sm text-gray-600">On track</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-900">Tasks Completed</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {progress.tasks_completion.completed}/{progress.tasks_completion.total}
          </div>
          <div className="text-sm text-gray-600">
            {Math.round((progress.tasks_completion.completed / progress.tasks_completion.total) * 100)}% complete
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-900">Risk Level</span>
          </div>
          <div className={`text-2xl font-bold capitalize ${getRiskColor(progress.risk_indicators.deadline_risk).split(' ')[0]}`}>
            {progress.risk_indicators.deadline_risk}
          </div>
          <div className="text-sm text-gray-600">
            {progress.risk_indicators.overdue_tasks} overdue tasks
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <User className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-900">Team Utilization</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(progress.team_utilization.reduce((acc, member) => acc + member.utilization_percentage, 0) / progress.team_utilization.length)}%
          </div>
          <div className="text-sm text-gray-600">Average</div>
        </div>
      </div>

      {/* Studies Progress */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Studies Completion</h4>
        <div className="space-y-4">
          {Object.entries(progress.studies_completion).map(([study, completion]) => (
            <div key={study}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {study.replace('_', ' ')} Study
                </span>
                <span className="text-sm font-medium text-gray-900">{completion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    completion >= 90 ? 'bg-green-500' :
                    completion >= 70 ? 'bg-blue-500' :
                    completion >= 50 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${completion}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Performance */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Team Performance</h4>
        <div className="space-y-4">
          {progress.team_utilization.map(member => (
            <div key={member.user_id} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{member.user_name}</div>
                <div className="text-sm text-gray-600">
                  {member.completed_tasks}/{member.assigned_tasks} tasks completed
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${member.utilization_percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {member.utilization_percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Indicators */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Risk Indicators</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-sm text-gray-700">Overdue Tasks</span>
            <span className={`font-medium ${progress.risk_indicators.overdue_tasks > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {progress.risk_indicators.overdue_tasks}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-sm text-gray-700">Team Conflicts</span>
            <span className={`font-medium ${progress.risk_indicators.team_conflicts > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {progress.risk_indicators.team_conflicts}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-sm text-gray-700">Budget Concerns</span>
            <span className={`font-medium ${progress.risk_indicators.budget_concerns > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {progress.risk_indicators.budget_concerns}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span className="text-sm text-gray-700">Deadline Risk</span>
            <span className={`font-medium capitalize ${getRiskColor(progress.risk_indicators.deadline_risk).split(' ')[0]}`}>
              {progress.risk_indicators.deadline_risk}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Workflow Tracker</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              viewMode === 'timeline' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setViewMode('milestones')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              viewMode === 'milestones' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Milestones
          </button>
          <button
            onClick={() => setViewMode('analytics')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${
              viewMode === 'analytics' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'timeline' && renderTimeline()}
      {viewMode === 'milestones' && renderMilestones()}
      {viewMode === 'analytics' && renderAnalytics()}
    </div>
  );
};

export default TenderWorkflowTracker; 