// Research & Studies Management Types
export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  principalInvestigatorId: string;
  principalInvestigatorName: string;
  researchTeam: ResearchTeamMember[];
  fundingSource: string;
  budgetAllocated: number;
  budgetSpent: number;
  startDate: Date;
  endDate?: Date;
  status: ProjectStatus;
  species: string[];
  ethicalApprovalStatus: EthicalApprovalStatus;
  ethicalApprovalNumber?: string;
  ethicalApprovalDate?: Date;
  regulatoryCompliance: string[];
  milestones: ProjectMilestone[];
  associatedPublications: string[];
  intellectualProperty: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ResearchTeamMember {
  id: string;
  name: string;
  role: ResearchRole;
  institution: string;
  email: string;
  expertise: string[];
  contributionPercentage: number;
  isActive: boolean;
  joinDate: Date;
  endDate?: Date;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completionDate?: Date;
  status: MilestoneStatus;
  deliverables: string[];
  responsiblePersonId: string;
  dependencies: string[];
}

export interface ExperimentProtocol {
  id: string;
  title: string;
  version: string;
  description: string;
  methodology: string;
  procedureSteps: ProcedureStep[];
  requiredMaterials: RequiredMaterial[];
  requiredEquipment: RequiredEquipment[];
  sampleSizeCalculation: SampleSizeCalculation;
  dataCollectionTemplate: DataCollectionTemplate;
  qualityControlCheckpoints: QualityControlCheckpoint[];
  safetyProtocols: SafetyProtocol[];
  sopReferences: string[];
  species: string[];
  estimatedDuration: number; // in hours
  lastUpdated: Date;
  createdBy: string;
  approvedBy?: string;
  approvalDate?: Date;
}

export interface ProcedureStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  duration: number; // in minutes
  materials: string[];
  equipment: string[];
  criticalPoints: string[];
  safetyNotes: string[];
  expectedOutcome: string;
  troubleshooting: string[];
}

export interface RequiredMaterial {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  supplier: string;
  catalogNumber: string;
  storageConditions: string;
  expiryDate?: Date;
  costPerUnit: number;
  inventoryItemId?: string;
}

export interface RequiredEquipment {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  calibrationRequired: boolean;
  lastCalibrationDate?: Date;
  nextCalibrationDate?: Date;
  maintenanceSchedule: string;
  operatingConditions: string;
  inventoryItemId?: string;
}

export interface SampleSizeCalculation {
  powerAnalysis: PowerAnalysis;
  effectSize: number;
  significanceLevel: number;
  powerLevel: number;
  calculatedSampleSize: number;
  adjustedSampleSize: number;
  adjustmentReason: string;
  statisticalTest: string;
  assumptions: string[];
}

export interface PowerAnalysis {
  method: string;
  parameters: Record<string, any>;
  calculatedPower: number;
  confidence: number;
}

export interface DataCollectionTemplate {
  id: string;
  name: string;
  fields: DataField[];
  validationRules: ValidationRule[];
  measurementUnits: Record<string, string>;
  dataTypes: Record<string, DataType>;
  requiredFields: string[];
  calculatedFields: CalculatedField[];
}

export interface DataField {
  id: string;
  name: string;
  label: string;
  type: DataType;
  required: boolean;
  options?: string[];
  minValue?: number;
  maxValue?: number;
  unit?: string;
  description: string;
  defaultValue?: any;
}

export interface ValidationRule {
  fieldId: string;
  type: ValidationType;
  value: any;
  message: string;
  isWarning: boolean;
}

export interface CalculatedField {
  id: string;
  name: string;
  formula: string;
  dependencies: string[];
  unit: string;
  description: string;
}

export interface QualityControlCheckpoint {
  id: string;
  name: string;
  description: string;
  criteria: string[];
  acceptanceCriteria: string;
  rejectionCriteria: string;
  correctiveActions: string[];
  frequency: string;
  responsibleRole: string;
  documentation: string[];
}

export interface SafetyProtocol {
  id: string;
  title: string;
  description: string;
  hazardTypes: HazardType[];
  protectiveEquipment: string[];
  emergencyProcedures: string[];
  trainingRequirements: string[];
  riskLevel: RiskLevel;
  approvalRequired: boolean;
}

export interface ExperimentInstance {
  id: string;
  protocolId: string;
  projectId: string;
  title: string;
  description: string;
  assignedPersonnel: AssignedPersonnel[];
  startDate: Date;
  endDate?: Date;
  actualDuration?: number;
  status: ExperimentStatus;
  environmentalConditions: EnvironmentalCondition[];
  researchSubjects: ResearchSubject[];
  dataCollectionSessions: DataCollectionSession[];
  deviations: ExperimentDeviation[];
  costTracking: CostTracking;
  notes: string;
  completionRate: number;
  dataIntegrityScore: number;
  qualityScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssignedPersonnel {
  personId: string;
  name: string;
  role: string;
  responsibility: string;
  startDate: Date;
  endDate?: Date;
  hoursAllocated: number;
  hoursWorked: number;
  performance: number; // 1-10 scale
}

export interface EnvironmentalCondition {
  id: string;
  timestamp: Date;
  temperature: number;
  humidity: number;
  pressure: number;
  lightLevel: number;
  co2Level: number;
  phLevel?: number;
  oxygenLevel?: number;
  notes: string;
  recordedBy: string;
}

export interface ResearchSubject {
  id: string;
  animalId?: string;
  sampleId?: string;
  subjectType: SubjectType;
  treatmentGroup: string;
  randomizationCode: string;
  startDate: Date;
  endDate?: Date;
  status: SubjectStatus;
  measurements: SubjectMeasurement[];
  interventions: SubjectIntervention[];
  adverseEvents: AdverseEvent[];
  studyCompletionStatus: CompletionStatus;
  notes: string;
}

export interface SubjectMeasurement {
  id: string;
  timestamp: Date;
  measurementType: string;
  value: number;
  unit: string;
  method: string;
  equipmentUsed: string;
  operatorId: string;
  qualityScore: number;
  notes: string;
  isBaseline: boolean;
  isEndpoint: boolean;
}

export interface SubjectIntervention {
  id: string;
  timestamp: Date;
  type: InterventionType;
  description: string;
  dose?: number;
  route?: string;
  frequency?: string;
  duration?: number;
  responsiblePersonId: string;
  notes: string;
}

export interface AdverseEvent {
  id: string;
  timestamp: Date;
  description: string;
  severity: EventSeverity;
  relatedness: EventRelatedness;
  outcome: EventOutcome;
  reportedBy: string;
  investigatorAssessment: string;
  correctiveActions: string[];
  followUpRequired: boolean;
  reportedToAuthorities: boolean;
}

export interface DataCollectionSession {
  id: string;
  sessionNumber: number;
  date: Date;
  duration: number;
  dataCollector: string;
  supervisor: string;
  dataPoints: DataPoint[];
  qualityChecks: QualityCheck[];
  issues: string[];
  completionStatus: CompletionStatus;
  dataIntegrityScore: number;
  notes: string;
}

export interface DataPoint {
  id: string;
  fieldId: string;
  subjectId: string;
  value: any;
  timestamp: Date;
  operator: string;
  method: string;
  qualityScore: number;
  flags: DataFlag[];
  verified: boolean;
  notes: string;
}

export interface QualityCheck {
  id: string;
  checkpointId: string;
  timestamp: Date;
  result: CheckResult;
  values: Record<string, any>;
  passed: boolean;
  notes: string;
  correctiveActions: string[];
  checkedBy: string;
}

export interface ExperimentDeviation {
  id: string;
  timestamp: Date;
  type: DeviationType;
  description: string;
  severity: DeviationSeverity;
  impactAssessment: string;
  correctiveActions: string[];
  preventiveActions: string[];
  reportedBy: string;
  investigatedBy: string;
  approved: boolean;
  approvedBy?: string;
  approvalDate?: Date;
}

export interface CostTracking {
  budgetAllocated: number;
  actualCost: number;
  materialCosts: number;
  equipmentCosts: number;
  personnelCosts: number;
  overheadCosts: number;
  costBreakdown: CostBreakdownItem[];
  costVariance: number;
  lastUpdated: Date;
}

export interface CostBreakdownItem {
  category: string;
  description: string;
  plannedCost: number;
  actualCost: number;
  variance: number;
  notes: string;
}

// Publication Management Types
export interface ResearchDocument {
  id: string;
  title: string;
  abstract: string;
  keywords: string[];
  documentType: DocumentType;
  projectId: string;
  authors: DocumentAuthor[];
  status: DocumentStatus;
  content: string;
  references: Reference[];
  figures: Figure[];
  tables: Table[];
  supplementaryMaterials: SupplementaryMaterial[];
  journalTargets: JournalTarget[];
  templateId?: string;
  wordCount: number;
  pageCount: number;
  createdAt: Date;
  updatedAt: Date;
  lastEditedBy: string;
  version: number;
  versionHistory: DocumentVersion[];
}

export interface DocumentAuthor {
  id: string;
  name: string;
  affiliation: string;
  email: string;
  orcid?: string;
  isCorresponding: boolean;
  contributionTypes: ContributionType[];
  contributionPercentage: number;
  conflictOfInterest: string;
  order: number;
}

export interface DocumentVersion {
  version: number;
  timestamp: Date;
  authorId: string;
  changes: string;
  content: string;
  notes: string;
  approved: boolean;
  approvedBy?: string;
}

export interface Reference {
  id: string;
  type: ReferenceType;
  title: string;
  authors: string[];
  journal?: string;
  year: number;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  pmid?: string;
  isbn?: string;
  publisher?: string;
  citationStyle: string;
  notes: string;
}

export interface Figure {
  id: string;
  number: number;
  title: string;
  caption: string;
  filePath: string;
  fileType: string;
  resolution: string;
  size: number;
  generatedFrom: string;
  statisticalData?: any;
  permissions: string;
  notes: string;
}

export interface Table {
  id: string;
  number: number;
  title: string;
  caption: string;
  headers: string[];
  rows: string[][];
  footnotes: string[];
  generatedFrom: string;
  statisticalData?: any;
  formatting: TableFormatting;
  notes: string;
}

export interface TableFormatting {
  style: string;
  cellPadding: number;
  borderStyle: string;
  headerStyle: string;
  alternateRowColors: boolean;
  fontSize: number;
}

export interface SupplementaryMaterial {
  id: string;
  title: string;
  description: string;
  type: SupplementaryType;
  filePath: string;
  fileSize: number;
  permissions: string;
  notes: string;
}

export interface JournalTarget {
  id: string;
  journalName: string;
  issn: string;
  impactFactor: number;
  quartile: string;
  category: string;
  submissionGuidelines: string;
  submissionDeadline?: Date;
  fees: number;
  openAccess: boolean;
  reviewType: ReviewType;
  averageReviewTime: number;
  acceptanceRate: number;
  priority: number;
  notes: string;
}

export interface PublicationSubmission {
  id: string;
  documentId: string;
  journalId: string;
  submissionDate: Date;
  manuscriptId: string;
  status: SubmissionStatus;
  submissionType: SubmissionType;
  coverLetter: string;
  reviewerSuggestions: string[];
  excludedReviewers: string[];
  timeline: SubmissionTimeline[];
  peerReviewProcess: PeerReviewProcess;
  revisionHistory: RevisionHistory[];
  finalDecision?: PublicationDecision;
  decisionDate?: Date;
  publicationDate?: Date;
  articleMetrics: ArticleMetrics;
  notes: string;
}

export interface SubmissionTimeline {
  id: string;
  timestamp: Date;
  event: SubmissionEvent;
  description: string;
  documentPath?: string;
  automated: boolean;
  notes: string;
}

export interface PeerReviewProcess {
  reviewers: PeerReviewer[];
  reviewRounds: ReviewRound[];
  editorComments: EditorComment[];
  currentRound: number;
  reviewDeadline: Date;
  status: PeerReviewStatus;
}

export interface PeerReviewer {
  id: string;
  anonymousId: string;
  invitationDate: Date;
  responseDate?: Date;
  accepted: boolean;
  submissionDate?: Date;
  recommendation: ReviewRecommendation;
  comments: string;
  rating: number;
  expertise: number;
  timeliness: number;
}

export interface ReviewRound {
  round: number;
  startDate: Date;
  endDate?: Date;
  reviewersAssigned: number;
  reviewsReceived: number;
  averageRating: number;
  majorConcerns: string[];
  minorConcerns: string[];
  editorDecision: EditorDecision;
  authorResponse?: string;
  revisionDeadline?: Date;
}

export interface EditorComment {
  id: string;
  timestamp: Date;
  editorId: string;
  comment: string;
  type: CommentType;
  visibility: CommentVisibility;
  section?: string;
}

export interface RevisionHistory {
  id: string;
  revisionNumber: number;
  submissionDate: Date;
  description: string;
  changesDocument: string;
  responseToReviewers: string;
  newWordCount: number;
  majorChanges: string[];
  minorChanges: string[];
  authorId: string;
}

export interface PublicationDecision {
  decision: DecisionType;
  reason: string;
  editorComments: string;
  conditions: string[];
  appealDeadline?: Date;
  finalDecision: boolean;
}

export interface ArticleMetrics {
  views: number;
  downloads: number;
  citations: number;
  altmetricScore: number;
  socialMediaMentions: number;
  newsOutletMentions: number;
  researchHighlights: number;
  impactScore: number;
  lastUpdated: Date;
}

// Analytics Types
export interface ResearchAnalytics {
  projectAnalytics: ProjectAnalytics;
  experimentAnalytics: ExperimentAnalytics;
  publicationAnalytics: PublicationAnalytics;
  teamAnalytics: TeamAnalytics;
  financialAnalytics: FinancialAnalytics;
  performanceMetrics: PerformanceMetrics;
  generatedAt: Date;
}

export interface ProjectAnalytics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  projectsByStatus: Record<ProjectStatus, number>;
  projectsBySpecies: Record<string, number>;
  averageProjectDuration: number;
  budgetUtilization: number;
  milestoneCompletionRate: number;
  successRate: number;
  trendsOverTime: ProjectTrend[];
}

export interface ProjectTrend {
  month: string;
  projectsStarted: number;
  projectsCompleted: number;
  budgetAllocated: number;
  budgetSpent: number;
  successRate: number;
}

export interface ExperimentAnalytics {
  totalExperiments: number;
  activeExperiments: number;
  completedExperiments: number;
  experimentsByStatus: Record<ExperimentStatus, number>;
  averageExperimentDuration: number;
  dataQualityScore: number;
  protocolComplianceRate: number;
  costPerExperiment: number;
  efficiencyMetrics: EfficiencyMetrics;
  qualityMetrics: QualityMetrics;
}

export interface EfficiencyMetrics {
  averageSetupTime: number;
  averageDataCollectionTime: number;
  resourceUtilizationRate: number;
  personnelEfficiency: number;
  equipmentUptime: number;
  costEfficiency: number;
}

export interface QualityMetrics {
  dataIntegrityScore: number;
  protocolAdherenceScore: number;
  qualityControlPassRate: number;
  deviationRate: number;
  errorRate: number;
  reproducibilityScore: number;
}

export interface PublicationAnalytics {
  totalPublications: number;
  publicationsByStatus: Record<DocumentStatus, number>;
  publicationsByType: Record<DocumentType, number>;
  acceptanceRate: number;
  averageReviewTime: number;
  impactFactorDistribution: ImpactFactorDistribution;
  citationAnalytics: CitationAnalytics;
  collaborationNetwork: CollaborationNetwork;
}

export interface ImpactFactorDistribution {
  q1Journals: number;
  q2Journals: number;
  q3Journals: number;
  q4Journals: number;
  averageImpactFactor: number;
  totalImpactPoints: number;
}

export interface CitationAnalytics {
  totalCitations: number;
  hIndex: number;
  i10Index: number;
  averageCitationsPerPaper: number;
  citationTrends: CitationTrend[];
  topCitedPapers: TopCitedPaper[];
}

export interface CitationTrend {
  year: number;
  citations: number;
  cumulativeCitations: number;
  papers: number;
  hIndex: number;
}

export interface TopCitedPaper {
  id: string;
  title: string;
  citations: number;
  year: number;
  journal: string;
  impactFactor: number;
}

export interface CollaborationNetwork {
  totalCollaborators: number;
  institutionalCollaborations: InstitutionalCollaboration[];
  internationalCollaborations: InternationalCollaboration[];
  collaborationStrength: CollaborationStrength[];
}

export interface InstitutionalCollaboration {
  institution: string;
  collaborations: number;
  publications: number;
  strength: number;
}

export interface InternationalCollaboration {
  country: string;
  collaborations: number;
  publications: number;
  strength: number;
}

export interface CollaborationStrength {
  collaboratorId: string;
  name: string;
  jointPublications: number;
  citationImpact: number;
  collaborationScore: number;
}

export interface TeamAnalytics {
  totalMembers: number;
  membersByRole: Record<ResearchRole, number>;
  averageExperience: number;
  productivityMetrics: ProductivityMetrics;
  collaborationMetrics: CollaborationMetrics;
  performanceDistribution: PerformanceDistribution;
}

export interface ProductivityMetrics {
  averagePublicationsPerMember: number;
  averageExperimentsPerMember: number;
  averageDataPointsPerMember: number;
  qualityScore: number;
  efficiencyScore: number;
  innovationScore: number;
}

export interface CollaborationMetrics {
  crossFunctionalProjects: number;
  mentorshipRelationships: number;
  knowledgeTransferScore: number;
  teamCohesionScore: number;
  communicationScore: number;
}

export interface PerformanceDistribution {
  highPerformers: number;
  averagePerformers: number;
  developingPerformers: number;
  performanceGrowthRate: number;
  retentionRate: number;
}

export interface FinancialAnalytics {
  totalBudget: number;
  totalSpent: number;
  budgetUtilization: number;
  costPerProject: number;
  costPerExperiment: number;
  costPerPublication: number;
  roi: number;
  fundingSourceDistribution: FundingSourceDistribution;
  costTrends: CostTrend[];
}

export interface FundingSourceDistribution {
  government: number;
  private: number;
  institutional: number;
  international: number;
  collaborative: number;
}

export interface CostTrend {
  month: string;
  budgetAllocated: number;
  actualSpent: number;
  variance: number;
  efficiency: number;
}

export interface PerformanceMetrics {
  overallEfficiency: number;
  qualityScore: number;
  innovationIndex: number;
  impactScore: number;
  collaborationScore: number;
  sustainabilityScore: number;
  benchmarkComparisons: BenchmarkComparison[];
}

export interface BenchmarkComparison {
  metric: string;
  ourValue: number;
  industryAverage: number;
  bestInClass: number;
  percentile: number;
}

// Enums
export enum ProjectStatus {
  PLANNING = 'PLANNING',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ARCHIVED = 'ARCHIVED'
}

export enum EthicalApprovalStatus {
  NOT_REQUIRED = 'NOT_REQUIRED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  CONDITIONAL = 'CONDITIONAL',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export enum ResearchRole {
  PRINCIPAL_INVESTIGATOR = 'PRINCIPAL_INVESTIGATOR',
  CO_INVESTIGATOR = 'CO_INVESTIGATOR',
  RESEARCH_SCIENTIST = 'RESEARCH_SCIENTIST',
  POSTDOC = 'POSTDOC',
  PHD_STUDENT = 'PHD_STUDENT',
  RESEARCH_TECHNICIAN = 'RESEARCH_TECHNICIAN',
  DATA_ANALYST = 'DATA_ANALYST',
  STATISTICIAN = 'STATISTICIAN',
  LABORATORY_MANAGER = 'LABORATORY_MANAGER',
  RESEARCH_COORDINATOR = 'RESEARCH_COORDINATOR'
}

export enum MilestoneStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DELAYED = 'DELAYED',
  CANCELLED = 'CANCELLED'
}

export enum ExperimentStatus {
  PLANNING = 'PLANNING',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  DATA_COLLECTION = 'DATA_COLLECTION',
  DATA_ANALYSIS = 'DATA_ANALYSIS',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
  TERMINATED = 'TERMINATED',
  ARCHIVED = 'ARCHIVED'
}

export enum DataType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  INTEGER = 'INTEGER',
  DECIMAL = 'DECIMAL',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  TIME = 'TIME',
  SELECT = 'SELECT',
  MULTI_SELECT = 'MULTI_SELECT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  CALCULATED = 'CALCULATED'
}

export enum ValidationType {
  REQUIRED = 'REQUIRED',
  MIN_VALUE = 'MIN_VALUE',
  MAX_VALUE = 'MAX_VALUE',
  RANGE = 'RANGE',
  PATTERN = 'PATTERN',
  CUSTOM = 'CUSTOM'
}

export enum HazardType {
  BIOLOGICAL = 'BIOLOGICAL',
  CHEMICAL = 'CHEMICAL',
  PHYSICAL = 'PHYSICAL',
  RADIATION = 'RADIATION',
  PSYCHOLOGICAL = 'PSYCHOLOGICAL',
  ENVIRONMENTAL = 'ENVIRONMENTAL'
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum SubjectType {
  ANIMAL = 'ANIMAL',
  BIOLOGICAL_SAMPLE = 'BIOLOGICAL_SAMPLE',
  CELL_LINE = 'CELL_LINE',
  TISSUE = 'TISSUE',
  FLUID = 'FLUID',
  GENETIC_MATERIAL = 'GENETIC_MATERIAL'
}

export enum SubjectStatus {
  ENROLLED = 'ENROLLED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  WITHDRAWN = 'WITHDRAWN',
  EXCLUDED = 'EXCLUDED',
  TERMINATED = 'TERMINATED'
}

export enum InterventionType {
  DRUG_TREATMENT = 'DRUG_TREATMENT',
  SURGICAL_PROCEDURE = 'SURGICAL_PROCEDURE',
  BEHAVIORAL_INTERVENTION = 'BEHAVIORAL_INTERVENTION',
  ENVIRONMENTAL_CHANGE = 'ENVIRONMENTAL_CHANGE',
  DIETARY_MODIFICATION = 'DIETARY_MODIFICATION',
  GENETIC_MANIPULATION = 'GENETIC_MANIPULATION'
}

export enum EventSeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
  LIFE_THREATENING = 'LIFE_THREATENING',
  FATAL = 'FATAL'
}

export enum EventRelatedness {
  UNRELATED = 'UNRELATED',
  UNLIKELY = 'UNLIKELY',
  POSSIBLE = 'POSSIBLE',
  PROBABLE = 'PROBABLE',
  DEFINITE = 'DEFINITE'
}

export enum EventOutcome {
  RECOVERED = 'RECOVERED',
  RECOVERING = 'RECOVERING',
  NOT_RECOVERED = 'NOT_RECOVERED',
  RECOVERED_WITH_SEQUELAE = 'RECOVERED_WITH_SEQUELAE',
  FATAL = 'FATAL',
  UNKNOWN = 'UNKNOWN'
}

export enum CompletionStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  INCOMPLETE = 'INCOMPLETE',
  CANCELLED = 'CANCELLED'
}

export enum DataFlag {
  OUTLIER = 'OUTLIER',
  MISSING = 'MISSING',
  INVALID = 'INVALID',
  SUSPICIOUS = 'SUSPICIOUS',
  CORRECTED = 'CORRECTED',
  ESTIMATED = 'ESTIMATED'
}

export enum CheckResult {
  PASS = 'PASS',
  FAIL = 'FAIL',
  WARNING = 'WARNING',
  NOT_APPLICABLE = 'NOT_APPLICABLE'
}

export enum DeviationType {
  PROTOCOL = 'PROTOCOL',
  PROCEDURE = 'PROCEDURE',
  TIMING = 'TIMING',
  PERSONNEL = 'PERSONNEL',
  EQUIPMENT = 'EQUIPMENT',
  ENVIRONMENT = 'ENVIRONMENT'
}

export enum DeviationSeverity {
  MINOR = 'MINOR',
  MAJOR = 'MAJOR',
  CRITICAL = 'CRITICAL'
}

export enum DocumentType {
  PROTOCOL = 'PROTOCOL',
  REPORT = 'REPORT',
  MANUSCRIPT = 'MANUSCRIPT',
  ABSTRACT = 'ABSTRACT',
  POSTER = 'POSTER',
  PRESENTATION = 'PRESENTATION',
  GRANT_PROPOSAL = 'GRANT_PROPOSAL',
  TECHNICAL_NOTE = 'TECHNICAL_NOTE',
  REVIEW_ARTICLE = 'REVIEW_ARTICLE',
  CASE_STUDY = 'CASE_STUDY'
}

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  IN_REVIEW = 'IN_REVIEW',
  UNDER_REVISION = 'UNDER_REVISION',
  APPROVED = 'APPROVED',
  SUBMITTED = 'SUBMITTED',
  UNDER_PEER_REVIEW = 'UNDER_PEER_REVIEW',
  ACCEPTED = 'ACCEPTED',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}

export enum ContributionType {
  CONCEPTUALIZATION = 'CONCEPTUALIZATION',
  METHODOLOGY = 'METHODOLOGY',
  INVESTIGATION = 'INVESTIGATION',
  RESOURCES = 'RESOURCES',
  DATA_CURATION = 'DATA_CURATION',
  WRITING_ORIGINAL_DRAFT = 'WRITING_ORIGINAL_DRAFT',
  WRITING_REVIEW_EDITING = 'WRITING_REVIEW_EDITING',
  VISUALIZATION = 'VISUALIZATION',
  SUPERVISION = 'SUPERVISION',
  PROJECT_ADMINISTRATION = 'PROJECT_ADMINISTRATION',
  FUNDING_ACQUISITION = 'FUNDING_ACQUISITION',
  FORMAL_ANALYSIS = 'FORMAL_ANALYSIS',
  SOFTWARE = 'SOFTWARE',
  VALIDATION = 'VALIDATION'
}

export enum ReferenceType {
  JOURNAL_ARTICLE = 'JOURNAL_ARTICLE',
  BOOK = 'BOOK',
  BOOK_CHAPTER = 'BOOK_CHAPTER',
  CONFERENCE_PAPER = 'CONFERENCE_PAPER',
  THESIS = 'THESIS',
  PATENT = 'PATENT',
  WEBSITE = 'WEBSITE',
  DATASET = 'DATASET',
  SOFTWARE = 'SOFTWARE',
  REPORT = 'REPORT'
}

export enum SupplementaryType {
  DATA_FILE = 'DATA_FILE',
  ANALYSIS_CODE = 'ANALYSIS_CODE',
  ADDITIONAL_FIGURES = 'ADDITIONAL_FIGURES',
  ADDITIONAL_TABLES = 'ADDITIONAL_TABLES',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  PROTOCOL = 'PROTOCOL',
  QUESTIONNAIRE = 'QUESTIONNAIRE'
}

export enum ReviewType {
  SINGLE_BLIND = 'SINGLE_BLIND',
  DOUBLE_BLIND = 'DOUBLE_BLIND',
  OPEN = 'OPEN',
  POST_PUBLICATION = 'POST_PUBLICATION'
}

export enum SubmissionStatus {
  PREPARING = 'PREPARING',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  REVISION_REQUIRED = 'REVISION_REQUIRED',
  REVISED = 'REVISED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
  PUBLISHED = 'PUBLISHED'
}

export enum SubmissionType {
  ORIGINAL_RESEARCH = 'ORIGINAL_RESEARCH',
  REVIEW_ARTICLE = 'REVIEW_ARTICLE',
  SHORT_COMMUNICATION = 'SHORT_COMMUNICATION',
  LETTER_TO_EDITOR = 'LETTER_TO_EDITOR',
  CASE_REPORT = 'CASE_REPORT',
  TECHNICAL_NOTE = 'TECHNICAL_NOTE',
  EDITORIAL = 'EDITORIAL',
  COMMENTARY = 'COMMENTARY'
}

export enum SubmissionEvent {
  SUBMITTED = 'SUBMITTED',
  EDITOR_ASSIGNED = 'EDITOR_ASSIGNED',
  REVIEWERS_INVITED = 'REVIEWERS_INVITED',
  REVIEW_STARTED = 'REVIEW_STARTED',
  REVIEW_RECEIVED = 'REVIEW_RECEIVED',
  DECISION_MADE = 'DECISION_MADE',
  REVISION_SUBMITTED = 'REVISION_SUBMITTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  PUBLISHED = 'PUBLISHED',
  WITHDRAWN = 'WITHDRAWN'
}

export enum PeerReviewStatus {
  PENDING = 'PENDING',
  REVIEWERS_ASSIGNED = 'REVIEWERS_ASSIGNED',
  REVIEWS_IN_PROGRESS = 'REVIEWS_IN_PROGRESS',
  REVIEWS_COMPLETED = 'REVIEWS_COMPLETED',
  DECISION_PENDING = 'DECISION_PENDING',
  DECISION_MADE = 'DECISION_MADE'
}

export enum EditorDecision {
  ACCEPT = 'ACCEPT',
  MINOR_REVISION = 'MINOR_REVISION',
  MAJOR_REVISION = 'MAJOR_REVISION',
  REJECT = 'REJECT',
  REJECT_RESUBMIT = 'REJECT_RESUBMIT'
}

export enum CommentType {
  GENERAL = 'GENERAL',
  METHODOLOGY = 'METHODOLOGY',
  RESULTS = 'RESULTS',
  DISCUSSION = 'DISCUSSION',
  REFERENCES = 'REFERENCES',
  FIGURES = 'FIGURES',
  TABLES = 'TABLES'
}

export enum CommentVisibility {
  AUTHOR = 'AUTHOR',
  REVIEWER = 'REVIEWER',
  EDITOR = 'EDITOR',
  ALL = 'ALL'
}

export enum DecisionType {
  ACCEPT = 'ACCEPT',
  ACCEPT_WITH_CONDITIONS = 'ACCEPT_WITH_CONDITIONS',
  MINOR_REVISION = 'MINOR_REVISION',
  MAJOR_REVISION = 'MAJOR_REVISION',
  REJECT = 'REJECT',
  REJECT_RESUBMIT = 'REJECT_RESUBMIT'
}

export enum ReviewRecommendation {
  ACCEPT = 'ACCEPT',
  MINOR_REVISION = 'MINOR_REVISION',
  MAJOR_REVISION = 'MAJOR_REVISION',
  REJECT = 'REJECT',
  REJECT_RESUBMIT = 'REJECT_RESUBMIT'
}

// Search and Filter Types
export interface ResearchSearchFilters {
  projectIds?: string[];
  experimentIds?: string[];
  documentIds?: string[];
  authorIds?: string[];
  dateRange?: DateRange;
  species?: string[];
  status?: string[];
  documentTypes?: DocumentType[];
  keywords?: string[];
  tags?: string[];
  institutions?: string[];
  fundingSources?: string[];
  impactFactorRange?: NumberRange;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface NumberRange {
  min: number;
  max: number;
}

// API Response Types
export interface ResearchApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  metadata?: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface ResearchDashboardData {
  summary: ResearchSummary;
  recentActivity: RecentActivity[];
  upcomingDeadlines: UpcomingDeadline[];
  performanceMetrics: PerformanceMetrics;
  alerts: ResearchAlert[];
}

export interface ResearchSummary {
  totalProjects: number;
  activeProjects: number;
  totalExperiments: number;
  activeExperiments: number;
  totalPublications: number;
  publishedPapers: number;
  totalBudget: number;
  budgetUtilized: number;
  teamMembers: number;
  completionRate: number;
}

export interface RecentActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  actorId: string;
  actorName: string;
  relatedEntityId: string;
  relatedEntityType: string;
  priority: ActivityPriority;
}

export interface UpcomingDeadline {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  type: DeadlineType;
  priority: DeadlinePriority;
  relatedEntityId: string;
  relatedEntityType: string;
  assignedTo: string;
  status: DeadlineStatus;
}

export interface ResearchAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: Date;
  relatedEntityId: string;
  relatedEntityType: string;
  actionRequired: boolean;
  dismissed: boolean;
}

export enum ActivityType {
  PROJECT_CREATED = 'PROJECT_CREATED',
  PROJECT_UPDATED = 'PROJECT_UPDATED',
  EXPERIMENT_STARTED = 'EXPERIMENT_STARTED',
  EXPERIMENT_COMPLETED = 'EXPERIMENT_COMPLETED',
  DATA_COLLECTED = 'DATA_COLLECTED',
  DOCUMENT_CREATED = 'DOCUMENT_CREATED',
  DOCUMENT_SUBMITTED = 'DOCUMENT_SUBMITTED',
  PAPER_ACCEPTED = 'PAPER_ACCEPTED',
  PAPER_PUBLISHED = 'PAPER_PUBLISHED',
  REVIEW_RECEIVED = 'REVIEW_RECEIVED',
  MILESTONE_ACHIEVED = 'MILESTONE_ACHIEVED',
  BUDGET_UPDATED = 'BUDGET_UPDATED',
  TEAM_MEMBER_ADDED = 'TEAM_MEMBER_ADDED'
}

export enum ActivityPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum DeadlineType {
  PROJECT_MILESTONE = 'PROJECT_MILESTONE',
  EXPERIMENT_COMPLETION = 'EXPERIMENT_COMPLETION',
  DATA_COLLECTION = 'DATA_COLLECTION',
  DOCUMENT_SUBMISSION = 'DOCUMENT_SUBMISSION',
  REVIEW_DEADLINE = 'REVIEW_DEADLINE',
  PUBLICATION_DEADLINE = 'PUBLICATION_DEADLINE',
  GRANT_SUBMISSION = 'GRANT_SUBMISSION',
  ETHICS_APPROVAL = 'ETHICS_APPROVAL',
  REPORT_SUBMISSION = 'REPORT_SUBMISSION'
}

export enum DeadlinePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum DeadlineStatus {
  UPCOMING = 'UPCOMING',
  DUE_SOON = 'DUE_SOON',
  OVERDUE = 'OVERDUE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum AlertType {
  DEADLINE_APPROACHING = 'DEADLINE_APPROACHING',
  DEADLINE_OVERDUE = 'DEADLINE_OVERDUE',
  BUDGET_THRESHOLD = 'BUDGET_THRESHOLD',
  QUALITY_ISSUE = 'QUALITY_ISSUE',
  PROTOCOL_DEVIATION = 'PROTOCOL_DEVIATION',
  EQUIPMENT_FAILURE = 'EQUIPMENT_FAILURE',
  ADVERSE_EVENT = 'ADVERSE_EVENT',
  ETHICS_RENEWAL = 'ETHICS_RENEWAL',
  PUBLICATION_UPDATE = 'PUBLICATION_UPDATE',
  COLLABORATION_REQUEST = 'COLLABORATION_REQUEST'
}

export enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
} 