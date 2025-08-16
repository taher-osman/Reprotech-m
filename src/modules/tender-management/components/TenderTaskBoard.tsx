import React, { useState, useEffect } from 'react';
import { 
  Plus,
  Search,
  Filter,
  Clock,
  User,
  Building,
  AlertTriangle,
  CheckCircle,
  Circle,
  Pause,
  X,
  Calendar,
  MessageSquare,
  Paperclip,
  MoreVertical,
  Edit3,
  Trash2,
  Eye
} from 'lucide-react';
import { 
  TenderTask, 
  TaskStatus, 
  TaskPriority, 
  TenderRole,
  TaskComment 
} from '../types/tenderTypes';

interface TenderTaskBoardProps {
  tenderId: string;
  tasks: TenderTask[];
  teamMembers: { user_id: string; user_name: string; role_in_tender: TenderRole; department: string }[];
  onTaskUpdate: (task: TenderTask) => Promise<void>;
  onTaskCreate: (task: Partial<TenderTask>) => Promise<void>;
  onTaskDelete: (taskId: string) => Promise<void>;
  className?: string;
}

interface TaskFilters {
  assignee: string;
  department: string;
  priority: TaskPriority | 'all';
  search: string;
}

// Mock data for demonstration
const mockTasks: TenderTask[] = [
  {
    task_id: 'task-001',
    tender_id: 'tender-001',
    title: 'Technical Specification Review',
    description: 'Review and validate technical requirements document',
    assigned_to_user_id: 'emp-001',
    assigned_to_name: 'Dr. Ahmed Hassan',
    department: 'Medical Devices',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    due_date: '2025-07-15',
    attachment_refs: ['spec-doc-v1.pdf'],
    created_by: 'emp-001',
    created_by_name: 'Dr. Ahmed Hassan',
    created_at: '2025-07-01T09:00:00Z',
    updated_at: '2025-07-02T14:30:00Z',
    estimated_hours: 16,
    actual_hours: 8,
    dependencies: [],
    comments: [
      {
        comment_id: 'comment-001',
        task_id: 'task-001',
        user_id: 'emp-001',
        user_name: 'Dr. Ahmed Hassan',
        content: 'Started initial review, found some inconsistencies in power requirements',
        created_at: '2025-07-02T10:15:00Z'
      }
    ]
  },
  {
    task_id: 'task-002',
    tender_id: 'tender-001',
    title: 'Budget Analysis',
    description: 'Prepare detailed cost breakdown and pricing strategy',
    assigned_to_user_id: 'emp-002',
    assigned_to_name: 'Sarah Wilson',
    department: 'Finance',
    status: TaskStatus.PENDING,
    priority: TaskPriority.HIGH,
    due_date: '2025-07-18',
    attachment_refs: [],
    created_by: 'emp-001',
    created_by_name: 'Dr. Ahmed Hassan',
    created_at: '2025-07-01T09:15:00Z',
    updated_at: '2025-07-01T09:15:00Z',
    estimated_hours: 24,
    dependencies: ['task-001'],
    comments: []
  },
  {
    task_id: 'task-003',
    tender_id: 'tender-001',
    title: 'Legal Compliance Check',
    description: 'Verify all legal requirements and regulatory compliance',
    assigned_to_user_id: 'emp-003',
    assigned_to_name: 'Michael Chen',
    department: 'Legal',
    status: TaskStatus.REVIEW,
    priority: TaskPriority.MEDIUM,
    due_date: '2025-07-20',
    attachment_refs: ['legal-checklist.pdf', 'compliance-matrix.xlsx'],
    created_by: 'emp-001',
    created_by_name: 'Dr. Ahmed Hassan',
    created_at: '2025-06-28T14:00:00Z',
    updated_at: '2025-07-02T16:45:00Z',
    estimated_hours: 12,
    actual_hours: 10,
    dependencies: [],
    comments: [
      {
        comment_id: 'comment-002',
        task_id: 'task-003',
        user_id: 'emp-003',
        user_name: 'Michael Chen',
        content: 'Compliance check completed, ready for final review',
        created_at: '2025-07-02T16:45:00Z'
      }
    ]
  },
  {
    task_id: 'task-004',
    tender_id: 'tender-001',
    title: 'Quality Assurance Plan',
    description: 'Develop comprehensive QA plan for project execution',
    assigned_to_user_id: 'emp-006',
    assigned_to_name: 'Anna Kowalski',
    department: 'Quality Assurance',
    status: TaskStatus.DONE,
    priority: TaskPriority.MEDIUM,
    due_date: '2025-07-10',
    completed_date: '2025-07-08',
    attachment_refs: ['qa-plan-v2.pdf'],
    created_by: 'emp-001',
    created_by_name: 'Dr. Ahmed Hassan',
    created_at: '2025-06-25T11:00:00Z',
    updated_at: '2025-07-08T17:30:00Z',
    estimated_hours: 20,
    actual_hours: 18,
    dependencies: [],
    comments: []
  },
  {
    task_id: 'task-005',
    tender_id: 'tender-001',
    title: 'Supplier Evaluation',
    description: 'Evaluate potential suppliers and create vendor matrix',
    assigned_to_user_id: 'emp-004',
    assigned_to_name: 'Lisa Rodriguez',
    department: 'Procurement',
    status: TaskStatus.BLOCKED,
    priority: TaskPriority.URGENT,
    due_date: '2025-07-12',
    attachment_refs: [],
    created_by: 'emp-001',
    created_by_name: 'Dr. Ahmed Hassan',
    created_at: '2025-07-01T13:30:00Z',
    updated_at: '2025-07-02T11:00:00Z',
    estimated_hours: 16,
    actual_hours: 4,
    dependencies: ['task-001'],
    comments: [
      {
        comment_id: 'comment-003',
        task_id: 'task-005',
        user_id: 'emp-004',
        user_name: 'Lisa Rodriguez',
        content: 'Blocked waiting for technical specifications from task-001',
        created_at: '2025-07-02T11:00:00Z'
      }
    ]
  }
];

const statusColumns = [
  { 
    status: TaskStatus.PENDING, 
    title: 'To Do', 
    color: 'bg-gray-100',
    icon: Circle
  },
  { 
    status: TaskStatus.IN_PROGRESS, 
    title: 'In Progress', 
    color: 'bg-blue-100',
    icon: Clock
  },
  { 
    status: TaskStatus.REVIEW, 
    title: 'Review', 
    color: 'bg-yellow-100',
    icon: Eye
  },
  { 
    status: TaskStatus.DONE, 
    title: 'Done', 
    color: 'bg-green-100',
    icon: CheckCircle
  },
  { 
    status: TaskStatus.BLOCKED, 
    title: 'Blocked', 
    color: 'bg-red-100',
    icon: Pause
  }
];

export const TenderTaskBoard: React.FC<TenderTaskBoardProps> = ({
  tenderId,
  tasks: initialTasks,
  teamMembers,
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete,
  className = ''
}) => {
  const [tasks, setTasks] = useState<TenderTask[]>(initialTasks.length > 0 ? initialTasks : mockTasks);
  const [filters, setFilters] = useState<TaskFilters>({
    assignee: 'all',
    department: 'all',
    priority: 'all',
    search: ''
  });
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(TaskStatus.PENDING);
  const [selectedTask, setSelectedTask] = useState<TenderTask | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [draggedTask, setDraggedTask] = useState<TenderTask | null>(null);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         task.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesAssignee = filters.assignee === 'all' || task.assigned_to_user_id === filters.assignee;
    const matchesDepartment = filters.department === 'all' || task.department === filters.department;
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
    
    return matchesSearch && matchesAssignee && matchesDepartment && matchesPriority;
  });

  const getPriorityColor = (priority: TaskPriority) => {
    const colors = {
      [TaskPriority.LOW]: 'bg-green-100 text-green-800 border-green-200',
      [TaskPriority.MEDIUM]: 'bg-blue-100 text-blue-800 border-blue-200',
      [TaskPriority.HIGH]: 'bg-orange-100 text-orange-800 border-orange-200',
      [TaskPriority.URGENT]: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueDateColor = (dueDate: string, status: TaskStatus) => {
    if (status === TaskStatus.DONE) return 'text-green-600';
    
    const days = getDaysUntilDue(dueDate);
    if (days < 0) return 'text-red-600';
    if (days <= 1) return 'text-orange-600';
    if (days <= 3) return 'text-yellow-600';
    return 'text-gray-600';
  };

  const handleDragStart = (e: React.DragEvent, task: TenderTask) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.status === targetStatus) {
      setDraggedTask(null);
      return;
    }

    const updatedTask = {
      ...draggedTask,
      status: targetStatus,
      updated_at: new Date().toISOString(),
      ...(targetStatus === TaskStatus.DONE && !draggedTask.completed_date && {
        completed_date: new Date().toISOString()
      })
    };

    try {
      await onTaskUpdate(updatedTask);
      setTasks(prev => prev.map(task => 
        task.task_id === draggedTask.task_id ? updatedTask : task
      ));
    } catch (error) {
      console.error('Failed to update task status:', error);
    }

    setDraggedTask(null);
  };

  const handleAddTask = (status: TaskStatus) => {
    setSelectedStatus(status);
    setShowAddTask(true);
  };

  const renderTaskCard = (task: TenderTask) => {
    const priorityColor = getPriorityColor(task.priority);
    const dueDateColor = getDueDateColor(task.due_date, task.status);
    const daysUntilDue = getDaysUntilDue(task.due_date);
    const progress = task.actual_hours && task.estimated_hours 
      ? Math.round((task.actual_hours / task.estimated_hours) * 100) 
      : 0;

    return (
      <div
        key={task.task_id}
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
        className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move ${
          draggedTask?.task_id === task.task_id ? 'opacity-50' : ''
        }`}
        onClick={() => {
          setSelectedTask(task);
          setShowTaskDetail(true);
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-medium text-gray-900 text-sm leading-5 line-clamp-2">
            {task.title}
          </h4>
          <div className="flex items-center space-x-1 ml-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${priorityColor}`}>
              {task.priority}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>

        {/* Progress Bar */}
        {task.estimated_hours && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Assignee */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-3 w-3 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {task.assigned_to_name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {task.department}
            </p>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center space-x-2 mb-3">
          <Calendar className="h-4 w-4 text-gray-400" />
          <span className={`text-sm ${dueDateColor}`}>
            {new Date(task.due_date).toLocaleDateString()}
            {daysUntilDue < 0 && (
              <span className="ml-1 text-red-600 font-medium">
                (Overdue)
              </span>
            )}
            {daysUntilDue === 0 && (
              <span className="ml-1 text-orange-600 font-medium">
                (Due today)
              </span>
            )}
            {daysUntilDue === 1 && (
              <span className="ml-1 text-yellow-600 font-medium">
                (Due tomorrow)
              </span>
            )}
          </span>
        </div>

        {/* Dependencies Warning */}
        {task.dependencies.length > 0 && task.status === TaskStatus.BLOCKED && (
          <div className="flex items-center space-x-2 mb-3 p-2 bg-red-50 rounded">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-xs text-red-700">
              Blocked by {task.dependencies.length} task(s)
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            {task.comments.length > 0 && (
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-3 w-3" />
                <span>{task.comments.length}</span>
              </div>
            )}
            {task.attachment_refs.length > 0 && (
              <div className="flex items-center space-x-1">
                <Paperclip className="h-3 w-3" />
                <span>{task.attachment_refs.length}</span>
              </div>
            )}
          </div>
          <span>
            {task.estimated_hours}h est.
          </span>
        </div>
      </div>
    );
  };

  const renderColumn = (column: typeof statusColumns[0]) => {
    const columnTasks = filteredTasks.filter(task => task.status === column.status);
    const Icon = column.icon;

    return (
      <div
        key={column.status}
        className={`flex-1 min-w-80 ${column.color} rounded-lg p-4`}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, column.status)}
      >
        {/* Column Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">{column.title}</h3>
            <span className="px-2 py-0.5 bg-white rounded-full text-sm font-medium text-gray-600">
              {columnTasks.length}
            </span>
          </div>
          <button
            onClick={() => handleAddTask(column.status)}
            className="p-1 hover:bg-white hover:bg-opacity-50 rounded"
            title="Add task"
          >
            <Plus className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Tasks */}
        <div className="space-y-3">
          {columnTasks.map(renderTaskCard)}
          
          {columnTasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Circle className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm">No tasks</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header and Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Task Board</h2>
          <button
            onClick={() => setShowAddTask(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filters.assignee}
            onChange={(e) => setFilters(prev => ({ ...prev, assignee: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Assignees</option>
            {teamMembers.map(member => (
              <option key={member.user_id} value={member.user_id}>
                {member.user_name}
              </option>
            ))}
          </select>

          <select
            value={filters.department}
            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Departments</option>
            {Array.from(new Set(teamMembers.map(m => m.department))).map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value as TaskPriority | 'all' }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            {Object.values(TaskPriority).map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-5 gap-4">
          {statusColumns.map(column => {
            const count = filteredTasks.filter(task => task.status === column.status).length;
            return (
              <div key={column.status} className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600">{column.title}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {statusColumns.map(renderColumn)}
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <TaskFormModal
          tenderId={tenderId}
          teamMembers={teamMembers}
          initialStatus={selectedStatus}
          onSave={async (taskData) => {
            await onTaskCreate(taskData);
            setShowAddTask(false);
            // Refresh tasks or update local state
          }}
          onClose={() => setShowAddTask(false)}
        />
      )}

      {/* Task Detail Modal */}
      {showTaskDetail && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          teamMembers={teamMembers}
          onUpdate={onTaskUpdate}
          onDelete={onTaskDelete}
          onClose={() => {
            setShowTaskDetail(false);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};

// Task Form Modal Component
interface TaskFormModalProps {
  tenderId: string;
  teamMembers: { user_id: string; user_name: string; department: string }[];
  initialStatus?: TaskStatus;
  onSave: (task: Partial<TenderTask>) => Promise<void>;
  onClose: () => void;
}

const TaskFormModal: React.FC<TaskFormModalProps> = ({
  tenderId,
  teamMembers,
  initialStatus = TaskStatus.PENDING,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to_user_id: '',
    priority: TaskPriority.MEDIUM,
    due_date: '',
    estimated_hours: '',
    dependencies: [] as string[]
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.assigned_to_user_id) return;

    try {
      setSaving(true);
      const assignedMember = teamMembers.find(m => m.user_id === formData.assigned_to_user_id);
      
      const taskData: Partial<TenderTask> = {
        tender_id: tenderId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        assigned_to_user_id: formData.assigned_to_user_id,
        assigned_to_name: assignedMember?.user_name || '',
        department: assignedMember?.department || '',
        status: initialStatus,
        priority: formData.priority,
        due_date: formData.due_date,
        estimated_hours: parseInt(formData.estimated_hours) || 0,
        dependencies: formData.dependencies,
        attachment_refs: [],
        created_by: 'current_user',
        created_by_name: 'Current User',
        comments: []
      };

      await onSave(taskData);
      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Add New Task</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the task"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assign To *
              </label>
              <select
                value={formData.assigned_to_user_id}
                onChange={(e) => setFormData(prev => ({ ...prev, assigned_to_user_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select team member</option>
                {teamMembers.map(member => (
                  <option key={member.user_id} value={member.user_id}>
                    {member.user_name} ({member.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.values(TaskPriority).map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Hours
              </label>
              <input
                type="number"
                value={formData.estimated_hours}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_hours: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !formData.title.trim() || !formData.assigned_to_user_id}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Plus className="h-4 w-4" />
              )}
              <span>{saving ? 'Creating...' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Task Detail Modal Component (simplified)
interface TaskDetailModalProps {
  task: TenderTask;
  teamMembers: { user_id: string; user_name: string; department: string }[];
  onUpdate: (task: TenderTask) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onClose: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  teamMembers,
  onUpdate,
  onDelete,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-[700px] shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onDelete(task.task_id)}
              className="p-2 text-red-400 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-gray-600">{task.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Assigned To</h4>
              <p className="text-gray-600">{task.assigned_to_name}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Priority</h4>
              <span className={`px-2 py-1 rounded-full text-sm ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          </div>

          {task.comments.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Comments</h4>
              <div className="space-y-2">
                {task.comments.map(comment => (
                  <div key={comment.comment_id} className="p-3 bg-gray-50 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{comment.user_name}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-3 pt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TenderTaskBoard; 