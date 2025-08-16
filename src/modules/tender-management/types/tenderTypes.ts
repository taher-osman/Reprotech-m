export enum TenderStatus {
  OPEN = 'Open',
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  AWARDED = 'Awarded',
  CANCELLED = 'Cancelled',
  EVALUATING = 'Evaluating',
  NEGOTIATING = 'Negotiating',
  REJECTED = 'Rejected'
}

export enum TenderSource {
  GOVERNMENT = 'Government',
  PRIVATE = 'Private',
  DIRECT = 'Direct',
  INTERNATIONAL = 'International'
}

export enum TenderCategory {
  MEDICAL = 'Medical',
  VETERINARY = 'Veterinary',
  RESEARCH = 'Research',
  LABORATORY = 'Laboratory',
  EQUIPMENT = 'Equipment',
  SERVICES = 'Services',
  CONSULTING = 'Consulting',
  MAINTENANCE = 'Maintenance',
  SUPPLY = 'Supply'
}

export enum TenderType {
  SUPPLY = 'Supply',
  SERVICE = 'Service',
  MAINTENANCE = 'Maintenance',
  CONSULTING = 'Consulting',
  CONSTRUCTION = 'Construction',
  RESEARCH = 'Research'
}

export enum TenderMode {
  OPEN = 'Open',
  LIMITED = 'Limited',
  DIRECT = 'Direct',
  SELECTIVE = 'Selective'
}

export enum TenderLanguage {
  ARABIC = 'Arabic',
  ENGLISH = 'English',
  BOTH = 'Both'
}

export enum AttachmentType {
  TECHNICAL_DOCS = 'Technical Docs',
  FINANCIAL_PROPOSAL = 'Financial Proposal',
  CONTRACT = 'Contract',
  SPECIFICATIONS = 'Specifications',
  DRAWINGS = 'Drawings',
  CERTIFICATES = 'Certificates',
  OTHER = 'Other'
}

// Phase 2: Team Management Enums
export enum TenderRole {
  PROJECT_LEAD = 'Project Lead',
  FINANCIAL_ANALYST = 'Financial Analyst',
  TECHNICAL_LEAD = 'Technical Lead',
  HR_COORDINATOR = 'HR Coordinator',
  LEGAL_ADVISOR = 'Legal Advisor',
  LOGISTICS_MANAGER = 'Logistics Manager',
  QUALITY_ASSURANCE = 'Quality Assurance',
  PROCUREMENT_SPECIALIST = 'Procurement Specialist'
}

export enum TaskStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  DONE = 'Done',
  BLOCKED = 'Blocked'
}

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent'
}

export enum IntegrationType {
  HR = 'HR',
  INVENTORY = 'Inventory',
  FINANCE = 'Finance',
  PROJECT = 'Project'
}

export enum RequestStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  IN_REVIEW = 'In Review'
}

// Phase 2: Extended Interfaces
export interface TenderTeamMember {
  user_id: string;
  user_name: string;
  email: string;
  role_in_tender: TenderRole;
  department: string;
  job_title: string;
  availability_status: 'Available' | 'Busy' | 'On Leave' | 'Unavailable';
  workload_percentage: number;
  assigned_by: string;
  assigned_at: string;
  is_lead: boolean;
}

export interface TenderTask {
  task_id: string;
  tender_id: string;
  title: string;
  description: string;
  assigned_to_user_id: string;
  assigned_to_name: string;
  department: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
  completed_date?: string;
  attachment_refs: string[];
  created_by: string;
  created_by_name: string;
  created_at: string;
  updated_at: string;
  estimated_hours: number;
  actual_hours?: number;
  dependencies: string[];
  comments: TaskComment[];
}

export interface TaskComment {
  comment_id: string;
  task_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface TenderWorkflowEvent {
  event_id: string;
  tender_id: string;
  event_type: 'task_created' | 'task_completed' | 'team_assigned' | 'document_uploaded' | 'study_approved' | 'milestone_reached';
  title: string;
  description: string;
  user_id: string;
  user_name: string;
  timestamp: string;
  related_id?: string; // task_id, team_member_id, etc.
  metadata?: any;
}

export interface TenderMilestone {
  milestone_id: string;
  tender_id: string;
  title: string;
  description: string;
  planned_date: string;
  actual_date?: string;
  is_completed: boolean;
  completion_percentage: number;
  required_tasks: string[];
}

// Integration Interfaces
export interface HRIntegration {
  integration_id: string;
  tender_id: string;
  request_type: 'temp_hire' | 'bonus_request' | 'overtime_approval' | 'team_allocation';
  title: string;
  description: string;
  requested_for: string[];
  amount?: number;
  duration?: string;
  justification: string;
  status: RequestStatus;
  requested_by: string;
  requested_at: string;
  approved_by?: string;
  approved_at?: string;
  notes?: string;
}

export interface InventoryIntegration {
  integration_id: string;
  tender_id: string;
  request_type: 'stock_reservation' | 'quotation_request' | 'procurement_order';
  items: InventoryRequestItem[];
  total_estimated_cost: number;
  supplier_preferences: string[];
  delivery_requirements: string;
  status: RequestStatus;
  requested_by: string;
  requested_at: string;
  approved_by?: string;
  approved_at?: string;
}

export interface InventoryRequestItem {
  item_id: string;
  item_name: string;
  quantity: number;
  unit: string;
  estimated_unit_cost: number;
  specifications: string;
  urgency: TaskPriority;
}

export interface FinanceIntegration {
  integration_id: string;
  tender_id: string;
  request_type: 'budget_allocation' | 'cost_estimation' | 'invoice_preparation' | 'expense_approval';
  title: string;
  amount: number;
  currency: string;
  category: string;
  breakdown: FinanceBreakdownItem[];
  justification: string;
  status: RequestStatus;
  requested_by: string;
  requested_at: string;
  approved_by?: string;
  approved_at?: string;
}

export interface FinanceBreakdownItem {
  category: string;
  description: string;
  amount: number;
  percentage: number;
}

export interface ProjectIntegration {
  integration_id: string;
  tender_id: string;
  project_name: string;
  project_description: string;
  phases: ProjectPhase[];
  estimated_duration: string;
  budget_allocated: number;
  project_manager_id: string;
  team_members: string[];
  start_date?: string;
  end_date?: string;
  status: 'Draft' | 'Active' | 'On Hold' | 'Completed' | 'Cancelled';
  created_at: string;
}

export interface ProjectPhase {
  phase_id: string;
  title: string;
  description: string;
  planned_start: string;
  planned_end: string;
  dependencies: string[];
  deliverables: string[];
}

export interface ProjectMilestone {
  milestone_id: string;
  title: string;
  description: string;
  planned_date: string;
  actual_date?: string;
  completion_percentage: number;
  is_completed: boolean;
  phase_id: string;
  dependencies: string[];
}

// Analytics and Reporting
export interface TenderProgress {
  tender_id: string;
  overall_completion: number;
  studies_completion: {
    technical: number;
    financial: number;
    hr: number;
    compliance: number;
  };
  tasks_completion: {
    total: number;
    completed: number;
    in_progress: number;
    pending: number;
    blocked: number;
  };
  team_utilization: {
    user_id: string;
    user_name: string;
    assigned_tasks: number;
    completed_tasks: number;
    utilization_percentage: number;
  }[];
  milestones_status: {
    total: number;
    completed: number;
    overdue: number;
  };
  risk_indicators: {
    overdue_tasks: number;
    team_conflicts: number;
    budget_concerns: number;
    deadline_risk: 'low' | 'medium' | 'high';
  };
}

export interface TenderAlert {
  alert_id: string;
  tender_id: string;
  type: 'deadline_warning' | 'task_overdue' | 'team_conflict' | 'budget_concern' | 'approval_pending';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  action_required: boolean;
  action_url?: string;
  related_user_ids: string[];
  created_at: string;
  acknowledged_by: string[];
  resolved_at?: string;
}

// Extended Original Interfaces
export interface TenderStudy {
  technical_study: string;
  financial_study: string;
  hr_study: string;
  compliance_study: string;
  created_at: string;
  updated_at: string;
}

export interface TenderAttachment {
  attachment_id: string;
  tender_id: string;
  name: string;
  type: AttachmentType;
  file_url: string;
  file_size: number;
  uploaded_at: string;
  uploaded_by: string;
}

export interface TenderComment {
  comment_id: string;
  tender_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
  is_internal: boolean;
}

export interface TenderHistory {
  history_id: string;
  tender_id: string;
  action: string;
  user_id: string;
  user_name: string;
  details: string;
  created_at: string;
}

export interface Tender {
  tender_id: string;
  title: string;
  reference_number: string;
  source: TenderSource;
  category: TenderCategory;
  owner_entity: string;
  submission_deadline: string;
  opening_date: string;
  award_date?: string;
  status: TenderStatus;
  type: TenderType;
  mode: TenderMode;
  summary: string;
  language: TenderLanguage;
  assigned_manager_id: string;
  assigned_manager_name: string;
  linked_departments: string[];
  created_at: string;
  updated_at: string;
  
  // Phase 2: Extended data
  team_members?: TenderTeamMember[];
  tasks?: TenderTask[];
  workflow_events?: TenderWorkflowEvent[];
  milestones?: TenderMilestone[];
  progress?: TenderProgress;
  alerts?: TenderAlert[];
  integrations?: {
    hr: HRIntegration[];
    inventory: InventoryIntegration[];
    finance: FinanceIntegration[];
    project: ProjectIntegration[];
  };
  
  // Original data
  studies?: TenderStudy;
  attachments?: TenderAttachment[];
  comments?: TenderComment[];
  history?: TenderHistory[];
}

export interface TenderFormData {
  // Step 1: Basic Info
  title: string;
  reference_number: string;
  source: TenderSource;
  category: TenderCategory;
  owner_entity: string;
  submission_deadline: string;
  opening_date: string;
  type: TenderType;
  mode: TenderMode;
  summary: string;
  language: TenderLanguage;
  assigned_manager_id: string;
  linked_departments: string[];
  
  // Step 2-5: Studies
  technical_study: string;
  financial_study: string;
  hr_study: string;
  compliance_study: string;
  
  // Step 6: Attachments
  attachments: File[];
}

export interface TenderFilter {
  status?: TenderStatus[];
  source?: TenderSource[];
  category?: TenderCategory[];
  assigned_manager?: string;
  team_member?: string;
  department?: string;
  date_range?: {
    start: string;
    end: string;
  };
  deadline_urgent?: boolean;
  has_overdue_tasks?: boolean;
  completion_range?: {
    min: number;
    max: number;
  };
}

export interface TenderStats {
  total_tenders: number;
  open_tenders: number;
  submitted_tenders: number;
  awarded_tenders: number;
  urgent_deadlines: number;
  total_value: number;
  success_rate: number;
  // Phase 2: Extended stats
  active_team_members: number;
  total_tasks: number;
  overdue_tasks: number;
  average_completion: number;
  pending_integrations: number;
}

export interface TenderDashboardData {
  stats: TenderStats;
  recent_tenders: Tender[];
  upcoming_deadlines: Tender[];
  urgent_tenders: Tender[];
  // Phase 2: Extended dashboard data
  team_workload: {
    user_id: string;
    user_name: string;
    department: string;
    active_tenders: number;
    workload_percentage: number;
  }[];
  recent_activities: TenderWorkflowEvent[];
  pending_approvals: {
    integration_type: IntegrationType;
    count: number;
  }[];
}

export interface TenderCalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'deadline' | 'opening' | 'award' | 'milestone' | 'task_due' | 'team_meeting';
  tender_id: string;
  status: TenderStatus;
  color: string;
  related_id?: string;
}

export interface DeadlineCountdown {
  days: number;
  hours: number;
  minutes: number;
  status: 'urgent' | 'warning' | 'normal';
  is_overdue: boolean;
}

// Utility Types for Phase 2
export interface TeamMemberAvailability {
  user_id: string;
  user_name: string;
  department: string;
  job_title: string;
  current_workload: number;
  available_hours_per_week: number;
  vacation_dates: string[];
  skills: string[];
  experience_level: 'Junior' | 'Mid' | 'Senior' | 'Expert';
  cost_per_hour: number;
}

export interface DepartmentWorkload {
  department: string;
  total_members: number;
  available_members: number;
  average_workload: number;
  active_tenders: number;
  capacity_status: 'Under Capacity' | 'At Capacity' | 'Over Capacity';
}

export interface TaskTemplate {
  template_id: string;
  title: string;
  description: string;
  estimated_hours: number;
  required_role: TenderRole;
  dependencies: string[];
  priority: TaskPriority;
  category: TenderCategory;
}

export interface WorkflowTemplate {
  template_id: string;
  name: string;
  description: string;
  applicable_categories: TenderCategory[];
  milestones: {
    title: string;
    description: string;
    days_from_start: number;
    required_completion_percentage: number;
  }[];
  task_templates: TaskTemplate[];
}

// Phase 3: Award Handling & Contract Types
export interface TenderAward {
  award_id: string;
  tender_id: string;
  awarded_to: string;
  award_value: number;
  award_currency: string;
  award_date: string;
  contract_start_date: string;
  contract_end_date: string;
  award_letter_url?: string;
  signed_contract_url?: string;
  project_conversion: ProjectConversion;
  contract_approval: ContractApprovalFlow;
  compliance_tracking: ComplianceTracking;
  notifications_sent: NotificationRecord[];
}

export interface ProjectConversion {
  conversion_id: string;
  original_tender_id: string;
  new_project_id: string;
  project_manager_id: string;
  conversion_date: string;
  phases_created: ProjectPhase[];
  budget_transferred: BudgetTransfer[];
  team_assignments: ProjectTeamAssignment[];
  milestones_configured: ProjectMilestone[];
  integration_status: {
    project_module: 'completed' | 'pending' | 'failed';
    finance_module: 'completed' | 'pending' | 'failed';
    hr_module: 'completed' | 'pending' | 'failed';
    inventory_module: 'completed' | 'pending' | 'failed';
  };
}

export interface ContractApprovalFlow {
  flow_id: string;
  contract_template_id: string;
  approval_steps: ContractApprovalStep[];
  current_step: number;
  overall_status: 'Draft' | 'In Review' | 'Approved' | 'Rejected' | 'Completed';
  contract_documents: ContractDocument[];
  approval_history: ContractApprovalHistory[];
  estimated_completion: string;
  actual_completion?: string;
}

export interface ContractApprovalStep {
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
  conditions?: ApprovalCondition[];
}

export interface ContractDocument {
  document_id: string;
  document_type: 'contract_draft' | 'technical_appendix' | 'financial_terms' | 'legal_review' | 'signed_contract';
  file_url: string;
  file_name: string;
  version: number;
  upload_date: string;
  uploaded_by: string;
  approval_status: 'pending' | 'approved' | 'requires_changes';
}

export interface ContractApprovalHistory {
  action_id: string;
  step_id: string;
  action: 'approved' | 'rejected' | 'requested_changes' | 'uploaded_document';
  user_id: string;
  user_name: string;
  timestamp: string;
  comments: string;
  documents_attached: string[];
}

export interface ApprovalCondition {
  condition_id: string;
  condition_type: 'budget_limit' | 'document_required' | 'time_constraint' | 'role_requirement';
  description: string;
  value?: any;
  is_met: boolean;
}

export interface ComplianceTracking {
  tracking_id: string;
  requirements: ComplianceRequirement[];
  deadlines: ComplianceDeadline[];
  alerts: ComplianceAlert[];
  overall_status: 'Compliant' | 'Non-Compliant' | 'At Risk' | 'Pending Review';
  last_updated: string;
}

export interface ComplianceRequirement {
  requirement_id: string;
  requirement_name: string;
  description: string;
  responsible_department: string;
  due_date: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  evidence_required: string[];
  completion_date?: string;
}

export interface ComplianceDeadline {
  deadline_id: string;
  deadline_name: string;
  due_date: string;
  grace_period_days: number;
  automated_reminder_days: number[];
  escalation_chain: string[];
  status: 'Upcoming' | 'Due Today' | 'Overdue' | 'Completed';
}

export interface ComplianceAlert {
  alert_id: string;
  alert_type: 'deadline_approaching' | 'requirement_overdue' | 'document_missing' | 'approval_delayed';
  severity: 'Info' | 'Warning' | 'Critical';
  message: string;
  created_date: string;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_date?: string;
}

export interface BudgetTransfer {
  transfer_id: string;
  from_tender_id: string;
  to_project_id: string;
  amount: number;
  currency: string;
  category: string;
  approval_required: boolean;
  approval_status?: 'pending' | 'approved' | 'rejected';
  transfer_date: string;
}

export interface ProjectTeamAssignment {
  assignment_id: string;
  user_id: string;
  user_name: string;
  project_role: string;
  allocation_percentage: number;
  start_date: string;
  end_date?: string;
  rates: {
    hourly_rate?: number;
    daily_rate?: number;
    monthly_rate?: number;
  };
}

export interface NotificationRecord {
  notification_id: string;
  notification_type: 'email' | 'system' | 'sms';
  recipients: string[];
  subject: string;
  message: string;
  template_used: string;
  sent_date: string;
  delivery_status: 'sent' | 'delivered' | 'failed' | 'pending';
  read_by: { user_id: string; read_date: string }[];
}

// Document Management Types
export interface TenderDocument {
  document_id: string;
  tender_id: string;
  filename: string;
  original_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  folder: string;
  tags: string[];
  uploaded_by: string;
  uploaded_date: string;
  last_modified: string;
  access_permissions: DocumentAccessPermission[];
  version: number;
  is_starred: boolean;
  status: 'draft' | 'review' | 'approved' | 'archived';
  description?: string;
  checksum?: string;
}

export interface DocumentAccessPermission {
  permission_id: string;
  department: string;
  permission: 'view' | 'edit' | 'admin';
  granted_by: string;
  granted_date: string;
  expires_date?: string;
}

export interface DocumentFolder {
  folder_id: string;
  folder_name: string;
  description: string;
  parent_folder?: string;
  document_count: number;
  created_date: string;
  access_level: 'public' | 'restricted' | 'confidential';
  icon: string;
  color?: string;
} 