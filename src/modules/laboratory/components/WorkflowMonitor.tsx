import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Eye,
  X,
  RefreshCw,
  Timer,
  TestTube,
  Beaker,
  Microscope,
  FileText,
  Target,
  Zap,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Bell,
  MessageCircle,
  Settings,
  Edit,
  BarChart3,
  TrendingUp,
  Calendar,
  User
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'collection' | 'preparation' | 'analysis' | 'qc' | 'review' | 'reporting' | 'approval';
  description: string;
  estimatedDuration: number;
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

interface WorkflowMonitorProps {
  executions: WorkflowExecution[];
  isModal?: boolean;
  onClose?: () => void;
  onRefresh: () => void;
}

export const WorkflowMonitor: React.FC<WorkflowMonitorProps> = ({
  executions,
  isModal = false,
  onClose,
  onRefresh
}) => {
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [expandedExecution, setExpandedExecution] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(10);
  const [showStepDetails, setShowStepDetails] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'priority' | 'progress' | 'eta'>('priority');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'timeline' | 'kanban'>('grid');
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (autoRefresh) {
      refreshIntervalRef.current = setInterval(() => {
        onRefresh();
      }, refreshInterval * 1000);
    } else {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [autoRefresh, refreshInterval, onRefresh]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'running': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'failed': return 'bg-red-100 text-red-800 border-red-300';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
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

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress': return <Activity className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'failed': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'skipped': return <ChevronRight className="w-5 h-5 text-gray-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const calculateTimeRemaining = (execution: WorkflowExecution): string => {
    const now = new Date();
    const eta = new Date(execution.estimatedCompletion);
    const diff = eta.getTime() - now.getTime();
    
    if (diff <= 0) return 'Overdue';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const sortedExecutions = [...executions].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'progress':
        return b.progress - a.progress;
      case 'eta':
        return new Date(a.estimatedCompletion).getTime() - new Date(b.estimatedCompletion).getTime();
      default:
        return 0;
    }
  });

  const filteredExecutions = sortedExecutions.filter(execution => {
    return filterStatus === 'all' || execution.status === filterStatus;
  });

  const renderStepTimeline = (execution: WorkflowExecution) => (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
        <Target className="w-4 h-4 mr-2" />
        Workflow Progress
      </h4>
      
      <div className="space-y-3">
        {execution.steps.map((step, index) => {
          const isCurrentStep = step.id === execution.currentStep;
          const isCompleted = step.status === 'completed';
          const isFailed = step.status === 'failed';
          const isInProgress = step.status === 'in_progress';
          
          return (
            <div key={step.id} className="flex items-start space-x-3">
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  isCompleted ? 'bg-green-100 border-green-500' :
                  isInProgress ? 'bg-blue-100 border-blue-500' :
                  isFailed ? 'bg-red-100 border-red-500' :
                  'bg-gray-100 border-gray-300'
                }`}>
                  {getStepStatusIcon(step.status)}
                </div>
                {index < execution.steps.length - 1 && (
                  <div className={`w-0.5 h-8 mt-2 ${
                    isCompleted ? 'bg-green-300' : 'bg-gray-300'
                  }`} />
                )}
              </div>
              
              {/* Step content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStepIcon(step.type)}
                    <span className={`text-sm font-medium ${
                      isCurrentStep ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {step.name}
                    </span>
                    {isCurrentStep && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{step.estimatedDuration}min</span>
                    {step.assignedTo && (
                      <>
                        <Users className="w-3 h-3 ml-2" />
                        <span>{step.assignedTo}</span>
                      </>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                
                {step.instructions && isCurrentStep && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <h5 className="text-xs font-semibold text-blue-800 mb-1">Instructions:</h5>
                    <p className="text-xs text-blue-700">{step.instructions}</p>
                  </div>
                )}
                
                {step.notes && (
                  <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-xs text-yellow-800">{step.notes}</p>
                  </div>
                )}
                
                {step.startTime && step.endTime && (
                  <div className="mt-1 text-xs text-gray-500">
                    Started: {new Date(step.startTime).toLocaleTimeString()} • 
                    Completed: {new Date(step.endTime).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderExecutionCard = (execution: WorkflowExecution) => {
    const currentStep = execution.steps.find(step => step.id === execution.currentStep);
    const isExpanded = expandedExecution === execution.id;
    const eta = new Date(execution.estimatedCompletion);
    const isDelayed = new Date() > eta && execution.status === 'running';
    
    return (
      <div key={execution.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{execution.workflowName}</h3>
                <p className="text-xs text-gray-500">{execution.sampleId} • {execution.testId}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(execution.priority)}`}>
                {execution.priority}
              </span>
              <button
                onClick={() => setExpandedExecution(isExpanded ? null : execution.id)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{execution.progress}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                execution.status === 'completed' ? 'bg-green-500' :
                execution.status === 'failed' ? 'bg-red-500' :
                execution.status === 'paused' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}
              style={{ width: `${execution.progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span className={`inline-flex px-2 py-1 rounded-full font-medium border ${getStatusColor(execution.status)}`}>
                {execution.status}
              </span>
              {currentStep && (
                <div className="flex items-center space-x-1">
                  {getStepIcon(currentStep.type)}
                  <span>{currentStep.name}</span>
                </div>
              )}
            </div>
            
            <div className={`flex items-center space-x-1 ${isDelayed ? 'text-red-600 font-medium' : ''}`}>
              <Timer className="w-3 h-3" />
              <span>{calculateTimeRemaining(execution)}</span>
              {isDelayed && <AlertTriangle className="w-3 h-3" />}
            </div>
          </div>

          {/* Technician and Customer */}
          <div className="mt-3 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1 text-gray-600">
              <Users className="w-3 h-3" />
              <span>{execution.assignedTechnician}</span>
            </div>
            <span className="text-gray-500">{execution.customer}</span>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && renderStepTimeline(execution)}

        {/* Actions */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {execution.status === 'running' && (
                <button className="flex items-center px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200">
                  <Pause className="w-3 h-3 mr-1" />
                  Pause
                </button>
              )}
              {execution.status === 'paused' && (
                <button className="flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200">
                  <Play className="w-3 h-3 mr-1" />
                  Resume
                </button>
              )}
              <button className="flex items-center px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200">
                <MessageCircle className="w-3 h-3 mr-1" />
                Notes
              </button>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setSelectedExecution(execution)}
                className="p-1 text-gray-400 hover:text-blue-600"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-400 hover:text-gray-600" title="Settings">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderKanbanView = () => {
    const statusColumns = [
      { status: 'pending', title: 'Pending', color: 'bg-gray-100' },
      { status: 'running', title: 'In Progress', color: 'bg-blue-100' },
      { status: 'paused', title: 'Paused', color: 'bg-yellow-100' },
      { status: 'completed', title: 'Completed', color: 'bg-green-100' },
      { status: 'failed', title: 'Failed', color: 'bg-red-100' }
    ];

    return (
      <div className="grid grid-cols-5 gap-4 h-full">
        {statusColumns.map(column => {
          const columnExecutions = filteredExecutions.filter(ex => ex.status === column.status);
          
          return (
            <div key={column.status} className="flex flex-col">
              <div className={`p-3 rounded-t-lg ${column.color} border-b`}>
                <h3 className="font-semibold text-gray-800">{column.title}</h3>
                <span className="text-sm text-gray-600">{columnExecutions.length} items</span>
              </div>
              
              <div className="flex-1 p-2 space-y-2 bg-gray-50 overflow-y-auto">
                {columnExecutions.map(execution => (
                  <div key={execution.id} className="p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">{execution.workflowName}</h4>
                    <p className="text-xs text-gray-500 mb-2">{execution.sampleId}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-2 py-1 rounded-full ${getPriorityColor(execution.priority)}`}>
                        {execution.priority}
                      </span>
                      <span className="text-gray-500">{execution.progress}%</span>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span>{execution.assignedTechnician}</span>
                      <span>{calculateTimeRemaining(execution)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const content = (
    <div className={`${isModal ? 'p-6' : ''} bg-gray-50 ${isModal ? 'rounded-xl' : 'min-h-screen'}`}>
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500 rounded-full">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">🔄 Live Workflow Monitor</h2>
              <p className="text-sm text-gray-600">Real-time workflow execution tracking</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="priority">Priority</option>
                <option value="progress">Progress</option>
                <option value="eta">ETA</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">Filter:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="running">Running</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600">View:</label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="grid">Grid</option>
                <option value="kanban">Kanban</option>
                <option value="timeline">Timeline</option>
              </select>
            </div>
            
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="mr-2 rounded focus:ring-blue-500"
              />
              Auto-refresh ({refreshInterval}s)
            </label>
            
            <button
              onClick={onRefresh}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            
            {isModal && onClose && (
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Executions</p>
              <p className="text-2xl font-bold text-gray-900">{executions.length}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Running</p>
              <p className="text-2xl font-bold text-blue-900">
                {executions.filter(e => e.status === 'running').length}
              </p>
            </div>
            <Activity className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Completed</p>
              <p className="text-2xl font-bold text-green-900">
                {executions.filter(e => e.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Delayed</p>
              <p className="text-2xl font-bold text-orange-900">
                {executions.filter(e => {
                  const eta = new Date(e.estimatedCompletion);
                  return new Date() > eta && e.status === 'running';
                }).length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'kanban' ? (
        renderKanbanView()
      ) : (
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredExecutions.map(renderExecutionCard)}
        </div>
      )}

      {filteredExecutions.length === 0 && (
        <div className="text-center py-12">
          <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workflow executions found</h3>
          <p className="text-gray-500">No executions match the current filter criteria.</p>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return content;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {content}
    </div>
  );
}; 