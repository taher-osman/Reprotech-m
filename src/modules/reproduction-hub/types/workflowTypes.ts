// Comprehensive Workflow Management Types for Reproduction Hub

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

// Critical Reproductive Information Interfaces
export interface UltrasoundSummary {
  id: string;
  examDate: string;
  daysAgo: number;
  examType: 'ROUTINE' | 'PREGNANCY_CHECK' | 'FOLLICLE_MONITORING' | 'POST_PROCEDURE' | 'SUPEROVULATION';
  
  // Corpus Luteum Information
  leftCL: {
    present: boolean;
    size?: number; // mm
    quality?: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';
  };
  rightCL: {
    present: boolean;
    size?: number; // mm
    quality?: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';
  };
  
  // Follicle Information
  leftOvary: {
    follicleCount: number;
    follicles: number[]; // Individual follicle sizes in mm
    dominantFollicle?: number; // Largest follicle size
  };
  rightOvary: {
    follicleCount: number;
    follicles: number[]; // Individual follicle sizes in mm
    dominantFollicle?: number; // Largest follicle size
  };
  
  // Uterine Status
  uterineStatus: {
    endometritis: 'NONE' | 'MILD' | 'MODERATE' | 'SEVERE';
    endometrialThickness: number; // mm
    tone: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';
    fluid: boolean;
  };
  
  // Overall Assessment
  overallAssessment: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';
  breedingReadiness: 'NOT_READY' | 'MONITOR' | 'READY' | 'OPTIMAL';
  recommendations: string[];
  
  veterinarian: string;
  notes?: string;
}

export interface LastInjection {
  id: string;
  date: string;
  daysAgo: number;
  medication: string;
  dosage: string;
  route: 'IM' | 'IV' | 'SC';
  givenBy: string;
  workflowRelated: boolean;
  nextInjectionDue?: string;
  notes?: string;
}

export interface ReproductiveHistory {
  totalCycles: number;
  successfulCycles: number;
  totalTransfers: number;
  successfulTransfers: number;
  totalOPUProcedures: number;
  successfulOPUProcedures: number;
  totalFlushingProcedures: number;
  successfulFlushingProcedures: number;
  lastProcedureDate?: string;
  lastProcedureType?: string;
  successRate: number; // percentage
}

export interface WarningFlag {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  category: 'HEALTH' | 'SCHEDULING' | 'WORKFLOW' | 'BREEDING' | 'MEDICATION';
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  since: string;
  daysOverdue?: number;
  actionRequired: string;
}

// Enhanced Reproductive Animal with Complete Information
export interface EnhancedReproductiveAnimal {
  // Base Animal Data
  animalID: string;
  name: string;
  species: string;
  sex: string;
  breed?: string;
  age?: number;
  currentInternalNumber?: { internalNumber: string };
  roles: { role: string; isActive: boolean }[];
  yard?: string;
  assignedVet?: string;
  
  // Current Workflow Information - CRITICAL
  activeWorkflow?: {
    id: string;
    templateName: string;
    currentStep: string;
    stepNumber: number;
    totalSteps: number;
    progress: number;
    status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
    startedDate: string;
    daysInWorkflow: number;
    nextAction?: string;
    expectedNextDate?: string;
  };
  
  // Last Ultrasound - CRITICAL
  lastUltrasound?: UltrasoundSummary;
  
  // Last Injection - CRITICAL
  lastInjection?: LastInjection;
  
  // Reproductive History - CRITICAL
  reproductiveHistory: ReproductiveHistory;
  
  // Next Scheduled Examination - CRITICAL
  nextExamination?: {
    date: string;
    daysUntil: number;
    type: 'ROUTINE' | 'PREGNANCY_CHECK' | 'FOLLICLE_MONITORING' | 'POST_PROCEDURE';
    assignedVet: string;
    room?: string;
    isOverdue: boolean;
  };
  
  // Warning Flags - CRITICAL
  warningFlags: WarningFlag[];
  
  // Additional Status Information
  reproductiveStatus: 'ACTIVE' | 'MONITORING' | 'TREATMENT' | 'RECOVERY' | 'HOLD';
  breedingReadiness: 'NOT_READY' | 'MONITOR' | 'READY' | 'OPTIMAL';
  lastActivityDate: string;
  
  // Workflow and scheduling data
  workflowHistory: ActiveWorkflow[];
  todayInjection?: DailyInjection;
  injectionHistory: DailyInjection[];
  nextDayExam?: NextDayExam;
  examHistory: NextDayExam[];
  
  // Performance Metrics
  workflowSuccessRate: number;
  totalProcedures: number;
  successfulProcedures: number;
  
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
}

// Enhanced Filter Types for Reproduction Hub
export interface ReproductiveAnimalFilter {
  search: string;
  
  // Basic filters
  species: string[];
  animalType: string[]; // DONOR, RECIPIENT, BREEDING
  yards: string[];
  veterinarians: string[];
  
  // Examination filters
  daysSinceLastExam: string; // '0-7', '7-14', '14-30', '30+', 'overdue'
  nextExamDays: string; // 'today', 'tomorrow', '2-7days', 'overdue'
  
  // Reproductive status filters
  clPresence: 'ANY' | 'LEFT' | 'RIGHT' | 'BOTH' | 'NONE';
  follicleSize: 'ANY' | '5-9MM' | '9-12MM' | '12-19MM' | '19-25MM' | 'ABOVE_25MM' | 'NO_FOLLICLE';
  uterineStatus: 'ANY' | 'NONE' | 'MILD' | 'MODERATE' | 'SEVERE';
  breedingReadiness: 'ANY' | 'NOT_READY' | 'MONITOR' | 'READY' | 'OPTIMAL';
  
  // Workflow filters
  workflowStatus: string[]; // ACTIVE, PAUSED, NO_WORKFLOW, etc.
  currentWorkflowType: string[]; // Template names
  currentStep: string[]; // Step names
  workflowProgress: string; // '0-25%', '25-50%', '50-75%', '75-100%'
  
  // Injection filters
  lastInjection: string; // 'today', 'yesterday', '2-7days', '7-14days', '14+days'
  injectionMedication: string[]; // FSH, LH, GnRH, etc.
  
  // Warning and status filters
  warningLevel: 'ANY' | 'INFO' | 'WARNING' | 'CRITICAL';
  reproductiveStatus: string[];
  
  // Quick filters
  hasActiveWorkflow: boolean;
  hasWarnings: boolean;
  hasInjectionToday: boolean;
  hasExamTomorrow: boolean;
  readyForBreeding: boolean;
  
  // Date range
  dateRange: { start: string; end: string } | null;
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

export interface BulkWorkflowAssignment {
  templateId: string;
  templateName: string;
  selectedAnimalIds: string[];
  startDate: string;
  batchDate: string;
  batchNotes: string;
  assignedVet: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  reasoning: string;
  customParameters?: { [key: string]: any };
}

// Mock API Data Types for Development
export interface MockReproductiveData {
  animals: EnhancedReproductiveAnimal[];
  workflowTemplates: WorkflowTemplate[];
  activeWorkflows: ActiveWorkflow[];
  dailyInjections: DailyInjection[];
  nextDayExams: NextDayExam[];
}

// TODO: Replace with real API service when backend is ready
export interface ReproductionHubApiService {
  // Animal Management
  getAnimals(): Promise<EnhancedReproductiveAnimal[]>;
  updateAnimal(id: string, data: Partial<EnhancedReproductiveAnimal>): Promise<EnhancedReproductiveAnimal>;
  bulkUpdateAnimals(ids: string[], data: Partial<EnhancedReproductiveAnimal>): Promise<EnhancedReproductiveAnimal[]>;
  
  // Workflow Management
  getWorkflowTemplates(): Promise<WorkflowTemplate[]>;
  createWorkflowTemplate(template: Omit<WorkflowTemplate, 'id'>): Promise<WorkflowTemplate>;
  updateWorkflowTemplate(id: string, template: Partial<WorkflowTemplate>): Promise<WorkflowTemplate>;
  deleteWorkflowTemplate(id: string): Promise<void>;
  
  // Workflow Assignment
  assignWorkflowToAnimals(assignment: BulkWorkflowAssignment): Promise<ActiveWorkflow[]>;
  getActiveWorkflows(): Promise<ActiveWorkflow[]>;
  updateWorkflowStatus(workflowId: string, status: ActiveWorkflow['status']): Promise<ActiveWorkflow>;
  
  // Daily Operations
    getDailyOverview(date: string): Promise<DailyOperationsOverview>;
  getDailyInjections(date: string): Promise<DailyInjection[]>;
  getNextDayExams(date: string): Promise<NextDayExam[]>;
} 

// Enhanced Conditional Logic for Complex Veterinary Workflows
export interface AdvancedWorkflowCondition extends WorkflowCondition {
  // Enhanced comparison capabilities
  tolerance?: number; // For numeric comparisons with tolerance
  units?: string; // 'mm', 'days', 'count', etc.
  
  // Conditional context
  dataSource: 'ULTRASOUND' | 'INJECTION' | 'EXAM' | 'LAB_RESULT' | 'MANUAL_INPUT' | 'ANIMAL_STATUS';
  fieldPath: string; // Nested field access like 'lastUltrasound.leftOvary.follicleCount'
  
  // Time-based conditions
  timeConstraint?: {
    withinDays?: number;
    exactDays?: number;
    sinceEvent?: string;
    beforeEvent?: string;
  };
  
  // Multi-value conditions
  allowedValues?: (string | number)[];
  requiredAll?: boolean; // For array fields, require all vs any
  
  // Validation
  errorMessage: string; // Message to show when condition fails
  warningMessage?: string; // Warning for borderline cases
  skipIfMissing?: boolean; // Skip condition if data is missing
}

// Enhanced Actions with Module Integration
export interface AdvancedWorkflowAction extends WorkflowAction {
  // Enhanced execution control
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  delay?: {
    days?: number;
    hours?: number;
    waitUntilTime?: string; // e.g., "08:00"
  };
  
  // Conditional execution
  executeIf?: AdvancedWorkflowCondition[];
  skipIf?: AdvancedWorkflowCondition[];
  
  // Module-specific parameters
  moduleIntegration: {
    createRecord?: {
      recordType: string;
      requiredFields: { [key: string]: any };
      optionalFields?: { [key: string]: any };
    };
    updateRecord?: {
      recordId: string;
      fieldsToUpdate: { [key: string]: any };
    };
    scheduleEvent?: {
      eventType: string;
      preferredTime?: string;
      room?: string;
      equipment?: string[];
      preparation?: string[];
    };
  };
  
  // Error handling
  onFailure: {
    retryAttempts: number;
    retryDelay: number; // hours
    fallbackAction?: AdvancedWorkflowAction;
    notifyVeterinarian: boolean;
    escalationMessage: string;
  };
  
  // Success tracking
  successCriteria?: AdvancedWorkflowCondition[];
  completionNotes?: string;
}

// Enhanced Decision Points with Alternative Workflows
export interface WorkflowDecisionPoint {
  id: string;
  name: string;
  description: string;
  
  // Decision criteria
  evaluationConditions: AdvancedWorkflowCondition[];
  decisionMatrix: {
    outcome: 'SUCCESS' | 'PARTIAL_SUCCESS' | 'FAILURE' | 'ALTERNATIVE_NEEDED';
    probability: number; // Expected probability (0-100)
    nextStepId?: string;
    alternativeWorkflowId?: string;
    requiredActions: AdvancedWorkflowAction[];
    notes?: string;
  }[];
  
  // Manual override options
  allowManualOverride: boolean;
  manualOptions?: {
    id: string;
    label: string;
    description: string;
    nextStepId?: string;
    alternativeWorkflowId?: string;
    requiresJustification: boolean;
  }[];
  
  // Escalation
  escalationRules: {
    condition: AdvancedWorkflowCondition;
    escalateTo: string; // Veterinarian ID or role
    urgency: 'ROUTINE' | 'URGENT' | 'EMERGENCY';
    message: string;
  }[];
  
  // Learning system
  historicalOutcomes: {
    outcome: string;
    frequency: number;
    successRate: number;
    averageTimeToDecision: number; // hours
  }[];
}

// Alternative Workflow Assignment
export interface AlternativeWorkflowAssignment {
  id: string;
  originalWorkflowId: string;
  originalStepId: string;
  
  // Trigger
  triggerReason: 'CONDITION_FAILED' | 'MANUAL_DECISION' | 'EMERGENCY' | 'OPTIMIZATION';
  triggerDescription: string;
  
  // New workflow
  newWorkflowTemplateId: string;
  newWorkflowName: string;
  assignmentReason: string;
  
  // Transition
  preserveData: boolean;
  dataMapping?: { [originalField: string]: string }; // Map data from old to new workflow
  startFromStep?: string; // Skip to specific step in new workflow
  
  // Approval
  requiresApproval: boolean;
  approvedBy?: string;
  approvedAt?: string;
  
  // Tracking
  assignedAt: string;
  assignedBy: string;
  expectedCompletion: string;
  notes: string[];
}

// Enhanced Step with Complex Logic
export interface AdvancedWorkflowStep extends WorkflowStep {
  // Enhanced decision making
  decisionPoint?: WorkflowDecisionPoint;
  
  // Multiple exit paths
  exitPaths: {
    id: string;
    name: string;
    conditions: AdvancedWorkflowCondition[];
    actions: AdvancedWorkflowAction[];
    nextStepId?: string;
    alternativeWorkflowId?: string;
    probability: number; // Expected probability of this path
  }[];
  
  // Module integration requirements
  moduleRequirements: {
    module: 'ULTRASOUND' | 'BREEDING' | 'FLUSHING' | 'INJECTION' | 'LAB' | 'CALENDAR';
    dataRequired: string[];
    functionsNeeded: string[];
    integrationPoints: {
      onStepStart?: string; // API endpoint to call
      onStepComplete?: string;
      onStepFail?: string;
    };
  }[];
  
  // Quality control
  qualityChecks: {
    id: string;
    name: string;
    condition: AdvancedWorkflowCondition;
    severity: 'WARNING' | 'ERROR' | 'CRITICAL';
    autoFix?: AdvancedWorkflowAction;
    requiresVerification: boolean;
  }[];
  
  // Learning and optimization
  adaptiveSettings: {
    learnFromOutcomes: boolean;
    optimizeBasedOnSuccess: boolean;
    adjustTimingAutomatically: boolean;
    suggestImprovements: boolean;
  };
  
  // Documentation
  clinicalProtocol?: {
    reference: string;
    version: string;
    modifications: string[];
    evidenceLevel: 'A' | 'B' | 'C' | 'D';
  };
}

// Enhanced Template with Protocol Intelligence
export interface AdvancedWorkflowTemplate extends WorkflowTemplate {
  // Clinical protocol information
  clinicalProtocol: {
    protocolName: string;
    species: string[];
    indication: string[];
    contraindications: string[];
    expectedOutcomes: {
      primary: string;
      secondary: string[];
      complications: string[];
    };
    references: {
      title: string;
      authors: string;
      journal: string;
      year: number;
      doi?: string;
    }[];
  };
  
  // Enhanced steps with decision logic
  advancedSteps: AdvancedWorkflowStep[];
  
  // Alternative workflow mappings
  alternativeWorkflows: {
    triggerId: string;
    triggerDescription: string;
    alternativeTemplateId: string;
    alternativeTemplateName: string;
    transitionRules: {
      preserveData: string[];
      resetData: string[];
      requiredApproval: boolean;
    };
  }[];
  
  // Success prediction
  predictionModel: {
    factorsConsidered: string[];
    weights: { [factor: string]: number };
    thresholds: {
      highSuccess: number; // > 80%
      moderateSuccess: number; // > 60%
      lowSuccess: number; // > 40%
    };
    lastUpdated: string;
    accuracy: number; // Model accuracy percentage
  };
  
  // Continuous improvement
  optimization: {
    suggestedImprovements: {
      id: string;
      description: string;
      impact: 'HIGH' | 'MEDIUM' | 'LOW';
      implementationEffort: 'HIGH' | 'MEDIUM' | 'LOW';
      evidenceSupport: number; // 0-100
    }[];
    performanceTrends: {
      month: string;
      successRate: number;
      averageDuration: number;
      satisfactionScore: number;
    }[];
  };
} 