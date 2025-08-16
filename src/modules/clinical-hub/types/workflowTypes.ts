// Comprehensive Workflow Management Types for Clinical Hub

export interface WorkflowCondition {
  id: string;
  field: string; // e.g., 'follicle_count', 'pregnancy_status', 'cl_presence'
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=' | 'contains' | 'not_contains';
  value: string | number | boolean;
  logicalOperator?: 'AND' | 'OR'; // For chaining multiple conditions
}

export interface WorkflowAction {
  id: string;
  type: 'SCHEDULE_EXAM' | 'SCHEDULE_INJECTION' | 'SCHEDULE_PROCEDURE' | 'UPDATE_STATUS' | 'NOTIFY' | 'WAIT_DAYS';
  targetModule: 'CALENDAR' | 'INJECTION' | 'ET' | 'OPU' | 'ULTRASOUND' | 'INTERNAL';
  parameters: {
    [key: string]: any;
    days?: number;
    medication?: string;
    dosage?: string;
    examType?: string;
    procedureType?: string;
    assignedVet?: string;
    room?: string;
    notes?: string;
  };
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  stepType: 'EXAM' | 'INJECTION' | 'PROCEDURE' | 'WAIT' | 'DECISION' | 'NOTIFICATION';
  order: number;
  
  // Conditions for this step to execute
  entryConditions?: WorkflowCondition[];
  
  // Actions to perform when step starts
  onStartActions: WorkflowAction[];
  
  // Conditions to check when step completes
  exitConditions?: WorkflowCondition[];
  
  // Actions based on exit conditions
  onSuccessActions: WorkflowAction[];
  onFailureActions: WorkflowAction[];
  
  // Alternative paths
  successNextStep?: string; // Step ID for success path
  failureNextStep?: string; // Step ID for failure path
  defaultNextStep?: string; // Default next step
  
  // Timing
  estimatedDuration: number; // in days
  maxWaitDays?: number; // Maximum days to wait for completion
  
  // Requirements
  requiredRole?: 'DONOR' | 'RECIPIENT' | 'BREEDING';
  requiredSpecies?: string[];
  
  // UI Configuration
  isManualStep: boolean; // Requires manual intervention
  displayInDashboard: boolean;
  notificationRequired: boolean;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'DONOR_COMPLETE' | 'RECIPIENT_SYNC' | 'BREEDING_CYCLE' | 'CUSTOM';
  
  // Template Configuration
  applicableRoles: ('DONOR' | 'RECIPIENT' | 'BREEDING' | 'ALL')[];
  applicableSpecies: string[]; // ['CAMEL', 'BOVINE', 'EQUINE', 'ALL']
  
  // Workflow Structure
  steps: WorkflowStep[];
  startingStep: string; // Step ID
  
  // Global Settings
  maxDuration: number; // Maximum days for entire workflow
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  autoStart: boolean;
  
  // Success Metrics
  expectedSuccessRate: number;
  averageDuration: number;
  
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: string;
  isActive: boolean;
  usageCount: number;
  successCount: number;
}

export interface ActiveWorkflow {
  id: string;
  templateId: string;
  templateName: string;
  animalId: string;
  animalName: string;
  
  // Current Status
  currentStepId: string;
  currentStepName: string;
  stepNumber: number;
  totalSteps: number;
  progressPercentage: number;
  
  // Timeline
  startedAt: string;
  expectedCompletionAt: string;
  actualCompletionAt?: string;
  lastActivityAt: string;
  
  // Status
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  currentPhase: 'PREPARATION' | 'EXECUTION' | 'MONITORING' | 'COMPLETION';
  
  // Next Actions
  nextScheduledAction?: {
    type: string;
    scheduledFor: string;
    description: string;
    module: string;
  };
  
  // Performance
  completedSteps: string[];
  failedSteps: string[];
  skippedSteps: string[];
  
  // Conditions
  lastConditionCheck?: {
    stepId: string;
    conditions: WorkflowCondition[];
    results: boolean[];
    evaluatedAt: string;
    nextAction: string;
  };
  
  // Metadata
  assignedVet: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  notes: string[];
}

export interface DailyInjection {
  id: string;
  animalId: string;
  animalName: string;
  internalNumber: string;
  species: string;
  
  // Injection Details
  medication?: string; // null for "No injection today"
  dosage?: string;
  route?: 'IM' | 'IV' | 'SC';
  scheduledTime?: string;
  
  // Status
  status: 'SCHEDULED' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED' | 'NO_INJECTION';
  isNullAssignment: boolean; // true when no injection needed today
  
  // Workflow Context
  workflowId?: string;
  workflowStep?: string;
  assignedBy: string;
  
  // Location & Logistics
  yard: string;
  assignedTechnician?: string;
  estimatedDuration: number; // minutes
  
  // Completion
  actualGivenTime?: string;
  actualDosage?: string;
  givenBy?: string;
  notes?: string;
  complications?: string[];
}

export interface NextDayExam {
  id: string;
  animalId: string;
  animalName: string;
  internalNumber: string;
  species: string;
  role: string;
  
  // Exam Details
  examType: 'ROUTINE' | 'PREGNANCY_CHECK' | 'FOLLICLE_MONITORING' | 'POST_PROCEDURE';
  scheduledTime: string;
  estimatedDuration: number; // minutes
  
  // Assignment
  assignedVet: string;
  room?: string;
  requiredEquipment: string[];
  
  // Workflow Context
  workflowId?: string;
  workflowStep?: string;
  isWorkflowDriven: boolean;
  
  // Preparation
  preparationNotes?: string;
  specialInstructions?: string[];
  
  // Expected Outcomes
  expectedFindings?: string[];
  decisionPoints?: string[];
  nextStepOptions?: string[];
}

export interface WorkflowDecision {
  id: string;
  workflowId: string;
  stepId: string;
  animalId: string;
  
  // Decision Context
  triggerEvent: 'EXAM_COMPLETED' | 'INJECTION_GIVEN' | 'PROCEDURE_DONE' | 'MANUAL_OVERRIDE';
  decisionPoint: string;
  
  // Evaluation
  conditions: WorkflowCondition[];
  evaluationResults: { [conditionId: string]: boolean };
  finalDecision: 'SUCCESS' | 'FAILURE' | 'ALTERNATIVE' | 'MANUAL_REVIEW';
  
  // Outcomes
  chosenPath: string;
  nextStepId: string;
  scheduledActions: WorkflowAction[];
  
  // Reasoning
  automaticReasoning?: string;
  manualReasoning?: string;
  veterinarianOverride?: boolean;
  
  // Metadata
  decidedAt: string;
  decidedBy: string; // 'SYSTEM' or vet ID
  confidence: number; // 0-100 for automatic decisions
}

export interface ModuleUpdate {
  id: string;
  sourceWorkflowId: string;
  sourceStepId: string;
  
  // Target
  targetModule: 'CALENDAR' | 'INJECTION' | 'ET' | 'OPU' | 'ULTRASOUND' | 'BREEDING';
  updateType: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESCHEDULE';
  
  // Update Data
  updateData: {
    [key: string]: any;
  };
  
  // Status
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'RETRY';
  attempts: number;
  maxAttempts: number;
  
  // Results
  result?: {
    success: boolean;
    moduleResponse?: any;
    errorMessage?: string;
    createdRecordId?: string;
  };
  
  // Timing
  scheduledFor: string;
  executedAt?: string;
  nextRetryAt?: string;
}

export interface DailyOperationsOverview {
  date: string;
  
  // Injection Summary
  injections: {
    total: number;
    scheduled: number;
    completed: number;
    overdue: number;
    cancelled: number;
    noInjectionToday: number;
    byMedication: { [medication: string]: number };
    byYard: { [yard: string]: number };
    byTechnician: { [technician: string]: number };
  };
  
  // Exam Summary
  nextDayExams: {
    total: number;
    byType: { [type: string]: number };
    byVet: { [vet: string]: number };
    byRoom: { [room: string]: number };
    estimatedTotalHours: number;
  };
  
  // Workflow Summary
  workflows: {
    active: number;
    completing: number;
    starting: number;
    blocked: number;
    byTemplate: { [templateName: string]: number };
    byPhase: { [phase: string]: number };
  };
  
  // Animal Summary
  animals: {
    total: number;
    inWorkflow: number;
    donors: number;
    recipients: number;
    breeding: number;
    scheduledToday: number;
    scheduledTomorrow: number;
  };
}

export interface WorkflowPerformanceMetrics {
  templateId: string;
  templateName: string;
  
  // Usage Statistics
  totalExecutions: number;
  successfulCompletions: number;
  failedExecutions: number;
  averageDuration: number;
  
  // Success Rates
  overallSuccessRate: number;
  successRateBySpecies: { [species: string]: number };
  successRateByVet: { [vet: string]: number };
  
  // Timing Analysis
  averageStepDuration: { [stepName: string]: number };
  bottleneckSteps: string[];
  fastestCompletion: number;
  slowestCompletion: number;
  
  // Common Decision Paths
  pathFrequency: { [path: string]: number };
  commonFailurePoints: string[];
  manualOverrideRate: number;
  
  // Recent Performance
  last30DaysExecutions: number;
  last30DaysSuccessRate: number;
  trendDirection: 'IMPROVING' | 'DECLINING' | 'STABLE';
}

// Enhanced Clinical Animal with Workflow Integration
export interface EnhancedClinicalAnimal {
  // Base Animal Data
  animalID: string;
  name: string;
  species: string;
  sex: string;
  currentInternalNumber?: { internalNumber: string };
  roles: { role: string; isActive: boolean }[];
  yard?: string;
  assignedVet?: string;
  
  // Workflow Data
  activeWorkflow?: ActiveWorkflow;
  workflowHistory: ActiveWorkflow[];
  
  // Today's Schedule
  todayInjection?: DailyInjection;
  injectionHistory: DailyInjection[];
  
  // Tomorrow's Schedule
  nextDayExam?: NextDayExam;
  examHistory: NextDayExam[];
  
  // Latest Activity
  latestActivity?: {
    type: 'EXAM' | 'INJECTION' | 'PROCEDURE' | 'WORKFLOW_START' | 'WORKFLOW_COMPLETE';
    date: string;
    description: string;
    outcome?: 'SUCCESS' | 'FAILED' | 'PARTIAL';
    performedBy: string;
    notes?: string;
  };
  
  // Suggested Actions
  suggestedAction?: {
    type: 'START_WORKFLOW' | 'CONTINUE_WORKFLOW' | 'SCHEDULE_EXAM' | 'SCHEDULE_INJECTION' | 'MANUAL_REVIEW';
    description: string;
    urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    deadline?: string;
  };
  
  // Status Indicators
  clinicalStatus: 'ACTIVE' | 'MONITORING' | 'TREATMENT' | 'RECOVERY' | 'HOLD';
  workflowStatus: 'NO_WORKFLOW' | 'IN_WORKFLOW' | 'WORKFLOW_COMPLETE' | 'WORKFLOW_FAILED' | 'WORKFLOW_PAUSED';
  schedulingStatus: 'UP_TO_DATE' | 'INJECTION_OVERDUE' | 'EXAM_OVERDUE' | 'NEEDS_SCHEDULING';
  
  // Performance Metrics
  workflowSuccessRate: number;
  totalProcedures: number;
  successfulProcedures: number;
  lastActivityDate: string;
  
  // Warning Flags
  warningFlags: {
    type: 'OVERDUE_INJECTION' | 'OVERDUE_EXAM' | 'WORKFLOW_BLOCKED' | 'HEALTH_CONCERN' | 'SCHEDULING_CONFLICT';
    message: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    since: string;
  }[];
}

// Filter and Search Types
export interface WorkflowFilter {
  search: string;
  species: string[];
  roles: string[];
  yards: string[];
  veterinarians: string[];
  workflowStatus: string[];
  schedulingStatus: string[];
  hasInjectionToday: boolean;
  hasExamTomorrow: boolean;
  hasActiveWorkflow: boolean;
  hasWarnings: boolean;
  dateRange: { start: string; end: string } | null;
}

export interface BulkWorkflowAssignment {
  templateId: string;
  templateName: string;
  selectedAnimalIds: string[];
  startDate: string;
  assignedVet: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  reasoning: string;
  customParameters?: { [key: string]: any };
} 