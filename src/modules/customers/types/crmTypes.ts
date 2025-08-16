// CRM System Types for Veterinary Biotechnology Application

export interface CustomerProfile {
  id: string;
  customerId: string;
  
  // Basic Information
  legalBusinessName: string;
  tradingName?: string;
  primaryContactPerson: string;
  primaryContactRole: string;
  contactMethods: ContactMethod[];
  addresses: CustomerAddress[];
  registrationNumbers: RegistrationNumber[];
  
  // Customer Categorization
  category: CustomerCategory;
  subCategory?: string;
  tags: string[];
  
  // Relationship Mapping
  accountManager: StaffMember;
  secondaryContacts: StaffMember[];
  escalationHierarchy: StaffMember[];
  preferredCommunicationMethods: CommunicationMethod[];
  languagePreferences: string[];
  
  // Business Intelligence
  customerLifetimeValue: number;
  riskAssessmentScore: number;
  creditRating: string;
  paymentHistory: PaymentHistoryRecord[];
  regulatoryComplianceStatus: ComplianceStatus;
  preferredServiceTypes: string[];
  specializations: string[];
  
  // Animal Portfolio
  linkedAnimals: AnimalReference[];
  breedingProgramAssociations: BreedingProgramReference[];
  genomicProjectParticipation: ProjectReference[];
  currentAnimalInventory: number;
  historicalAnimalCount: number;
  
  // Interaction History
  interactionHistory: InteractionRecord[];
  projectAssociations: ProjectAssociation[];
  
  // System Metadata
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface ContactMethod {
  type: 'PHONE' | 'EMAIL' | 'FAX' | 'MOBILE' | 'WHATSAPP';
  value: string;
  isPrimary: boolean;
  isActive: boolean;
  notes?: string;
}

export interface CustomerAddress {
  type: 'PHYSICAL' | 'BILLING' | 'SHIPPING' | 'LEGAL';
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  geolocation?: {
    latitude: number;
    longitude: number;
  };
  isPrimary: boolean;
  isActive: boolean;
}

export interface RegistrationNumber {
  type: 'TAX_ID' | 'BUSINESS_LICENSE' | 'VAT_NUMBER' | 'COMMERCIAL_REGISTRATION';
  number: string;
  issuingAuthority: string;
  issuedDate: string;
  expiryDate?: string;
  isActive: boolean;
}

export type CustomerCategory = 'INDIVIDUAL' | 'CORPORATE' | 'GOVERNMENTAL' | 'RESEARCH_INSTITUTION';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
}

export interface CommunicationMethod {
  method: 'EMAIL' | 'PHONE' | 'VIDEO_CALL' | 'IN_PERSON' | 'WHATSAPP';
  preference: number; // 1-5, 5 being highest preference
  timePreferences?: string[]; // e.g., ["09:00-12:00", "14:00-17:00"]
}

export interface PaymentHistoryRecord {
  transactionId: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  status: PaymentStatus;
  description: string;
}

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'CHECK' | 'ONLINE';
export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'FAILED';

export interface ComplianceStatus {
  overallStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW';
  lastAssessmentDate: string;
  nextAssessmentDate: string;
  complianceItems: ComplianceItem[];
}

export interface ComplianceItem {
  requirement: string;
  status: 'MET' | 'NOT_MET' | 'PARTIALLY_MET';
  details: string;
  dueDate?: string;
}

export interface AnimalReference {
  animalId: string;
  animalName: string;
  species: string;
  ownershipStartDate: string;
  ownershipEndDate?: string;
  currentStatus: string;
}

export interface BreedingProgramReference {
  programId: string;
  programName: string;
  participationStartDate: string;
  participationEndDate?: string;
  role: 'DONOR' | 'RECIPIENT' | 'BOTH';
  status: 'ACTIVE' | 'COMPLETED' | 'SUSPENDED';
}

export interface ProjectReference {
  projectId: string;
  projectName: string;
  projectType: string;
  participationStartDate: string;
  participationEndDate?: string;
  role: string;
  status: string;
}

export interface InteractionRecord {
  id: string;
  date: string;
  type: InteractionType;
  method: CommunicationMethod['method'];
  staffMember: StaffMember;
  subject: string;
  summary: string;
  outcome: string;
  followUpRequired: boolean;
  followUpDate?: string;
  attachments: DocumentReference[];
  duration?: number; // in minutes
  customerSatisfactionScore?: number; // 1-5
}

export type InteractionType = 'PHONE_CALL' | 'EMAIL' | 'MEETING' | 'SITE_VISIT' | 'SERVICE_REQUEST' | 'COMPLAINT' | 'FOLLOW_UP';

export interface ProjectAssociation {
  projectId: string;
  projectName: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED';
  startDate: string;
  endDate?: string;
  resourceAllocation: ResourceAllocation[];
}

export interface ResourceAllocation {
  resourceType: string;
  resourceId: string;
  allocationDate: string;
  quantity: number;
  cost: number;
}

export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PROSPECT' | 'FORMER';

// Document Management Types
export interface DocumentRepository {
  customerId: string;
  categories: DocumentCategory[];
  totalDocuments: number;
  storageUsed: number; // in MB
  lastUpdated: string;
}

export interface DocumentCategory {
  name: string;
  type: DocumentCategoryType;
  documents: CRMDocument[];
  subcategories?: DocumentCategory[];
}

export type DocumentCategoryType = 
  | 'COMMUNICATIONS' 
  | 'CONTRACTS_LEGAL' 
  | 'FINANCIAL_DOCUMENTS' 
  | 'TECHNICAL_REPORTS' 
  | 'MARKETING_MATERIALS';

export interface CRMDocument {
  id: string;
  name: string;
  type: string;
  category: DocumentCategoryType;
  subcategory?: string;
  size: number; // in bytes
  mimeType: string;
  
  // Metadata
  createdAt: string;
  modifiedAt: string;
  author: StaffMember;
  reviewer?: StaffMember;
  
  // Version Control
  version: string;
  versionHistory: DocumentVersion[];
  isLatestVersion: boolean;
  
  // Security & Access
  securityClassification: SecurityLevel;
  accessPermissions: AccessPermission[];
  
  // Content & Relationships
  description: string;
  tags: string[];
  relatedProjects: string[];
  relatedAnimals: string[];
  retentionPolicy: RetentionPolicy;
  
  // File Information
  filePath: string;
  downloadUrl?: string;
  previewUrl?: string;
  
  // Approval Workflow
  approvalStatus: ApprovalStatus;
  approvalWorkflow?: ApprovalWorkflow;
}

export interface DocumentVersion {
  version: string;
  createdAt: string;
  author: StaffMember;
  changes: string;
  filePath: string;
  size: number;
}

export type SecurityLevel = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';

export interface AccessPermission {
  userId: string;
  role: string;
  permissions: ('READ' | 'WRITE' | 'DELETE' | 'SHARE')[];
  expiryDate?: string;
}

export interface RetentionPolicy {
  retentionPeriod: number; // in years
  disposalMethod: 'DELETE' | 'ARCHIVE' | 'MANUAL_REVIEW';
  nextReviewDate: string;
}

export type ApprovalStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export interface ApprovalWorkflow {
  steps: ApprovalStep[];
  currentStep: number;
  completed: boolean;
}

export interface ApprovalStep {
  stepNumber: number;
  approver: StaffMember;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  comments?: string;
  timestamp?: string;
}

export interface DocumentReference {
  documentId: string;
  documentName: string;
  documentType: string;
  attachedAt: string;
}

// Customer Portal Types
export interface CustomerPortalAccess {
  customerId: string;
  isEnabled: boolean;
  lastLogin?: string;
  loginCount: number;
  securitySettings: PortalSecuritySettings;
  permissions: PortalPermissions;
  preferences: PortalPreferences;
}

export interface PortalSecuritySettings {
  mfaEnabled: boolean;
  passwordLastChanged: string;
  securityQuestions: SecurityQuestion[];
  sessionTimeout: number; // in minutes
  allowedIPs?: string[];
}

export interface SecurityQuestion {
  question: string;
  answerHash: string;
  isActive: boolean;
}

export interface PortalPermissions {
  canViewAnimals: boolean;
  canViewProjects: boolean;
  canViewFinancials: boolean;
  canViewDocuments: boolean;
  canDownloadReports: boolean;
  canSubmitRequests: boolean;
  canManageProfile: boolean;
  documentCategories: string[];
}

export interface PortalPreferences {
  language: string;
  timezone: string;
  dateFormat: string;
  notifications: NotificationPreferences;
  dashboardLayout: DashboardWidget[];
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  frequencies: {
    projectUpdates: 'IMMEDIATE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
    financialUpdates: 'IMMEDIATE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
    systemUpdates: 'IMMEDIATE' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  };
}

export interface DashboardWidget {
  id: string;
  type: 'ANIMALS' | 'PROJECTS' | 'FINANCIALS' | 'DOCUMENTS' | 'ANALYTICS';
  position: { x: number; y: number; width: number; height: number };
  isVisible: boolean;
  configuration: Record<string, any>;
}

// Analytics & Reporting Types
export interface CustomerAnalytics {
  customerId: string;
  generatedAt: string;
  period: AnalyticsPeriod;
  
  // Activity Analytics
  activityMetrics: ActivityMetrics;
  
  // Financial Analytics
  financialMetrics: FinancialMetrics;
  
  // Service Analytics
  serviceMetrics: ServiceMetrics;
  
  // Reproductive & Genomic Outcomes
  reproductiveMetrics: ReproductiveMetrics;
  genomicMetrics: GenomicMetrics;
}

export interface AnalyticsPeriod {
  startDate: string;
  endDate: string;
  periodType: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM';
}

export interface ActivityMetrics {
  totalInteractions: number;
  interactionsByType: Record<InteractionType, number>;
  averageResponseTime: number; // in hours
  customerSatisfactionAverage: number;
  communicationFrequency: CommunicationFrequencyData[];
  engagementScore: number;
}

export interface CommunicationFrequencyData {
  date: string;
  count: number;
  types: Record<InteractionType, number>;
}

export interface FinancialMetrics {
  totalRevenue: number;
  totalCosts: number;
  profitMargin: number;
  averageTransactionValue: number;
  paymentBehavior: PaymentBehaviorMetrics;
  revenueByService: ServiceRevenueBreakdown[];
  profitabilityTrend: TrendData[];
}

export interface PaymentBehaviorMetrics {
  averagePaymentDelay: number; // in days
  onTimePaymentRate: number; // percentage
  preferredPaymentMethod: PaymentMethod;
  creditUtilization: number; // percentage
}

export interface ServiceRevenueBreakdown {
  serviceType: string;
  revenue: number;
  percentage: number;
  transactionCount: number;
}

export interface TrendData {
  date: string;
  value: number;
  change?: number; // percentage change from previous period
}

export interface ServiceMetrics {
  totalServices: number;
  servicesByType: Record<string, number>;
  serviceSuccessRates: ServiceSuccessRate[];
  averageServiceDuration: number; // in days
  recurringServices: number;
  servicePreferences: string[];
}

export interface ServiceSuccessRate {
  serviceType: string;
  successRate: number;
  totalAttempts: number;
  averageDuration: number;
}

export interface ReproductiveMetrics {
  totalProcedures: number;
  successRates: Record<string, number>;
  embryoProduction: EmbrioMetrics;
  pregnancyRates: PregnancyMetrics;
  seasonalTrends: SeasonalTrendData[];
}

export interface EmbrioMetrics {
  totalEmbryos: number;
  viableEmbryos: number;
  averageQuality: number;
  transferSuccessRate: number;
}

export interface PregnancyMetrics {
  pregnancyRate: number;
  livebirthRate: number;
  abortionRate: number;
  twinningRate: number;
}

export interface SeasonalTrendData {
  month: number;
  procedureCount: number;
  successRate: number;
  averageCost: number;
}

export interface GenomicMetrics {
  genomicTestsPerformed: number;
  genomicDiversityIndex: number;
  parentageConfirmationRate: number;
  diseasePredictionAccuracy: number;
  traitPredictionAccuracy: number;
  genomicProjects: GenomicProjectMetrics[];
}

export interface GenomicProjectMetrics {
  projectId: string;
  projectName: string;
  samplesAnalyzed: number;
  markersAnalyzed: number;
  accuracyRating: number;
  costPerSample: number;
}

// Contract Management Types
export interface ContractManagement {
  customerId: string;
  contracts: Contract[];
  totalActiveContracts: number;
  totalContractValue: number;
  averageContractDuration: number;
  renewalRate: number;
}

export interface Contract {
  id: string;
  contractNumber: string;
  title: string;
  type: ContractType;
  status: ContractStatus;
  
  // Parties
  customer: CustomerProfile;
  provider: CompanyInfo;
  
  // Terms
  startDate: string;
  endDate: string;
  autoRenewal: boolean;
  renewalTerms?: RenewalTerms;
  
  // Financial Terms
  totalValue: number;
  paymentTerms: PaymentTerms;
  currency: string;
  
  // Legal Information
  governingLaw: string;
  jurisdiction: string;
  
  // Version Control
  version: string;
  versionHistory: ContractVersion[];
  amendments: ContractAmendment[];
  
  // Performance Tracking
  performanceMetrics: ContractPerformanceMetrics;
  complianceStatus: ContractComplianceStatus;
  
  // Alerts & Notifications
  alerts: ContractAlert[];
  
  // Documents
  documents: DocumentReference[];
  
  // System Metadata
  createdAt: string;
  createdBy: string;
  lastModified: string;
  lastModifiedBy: string;
}

export type ContractType = 
  | 'SERVICE_AGREEMENT' 
  | 'RESEARCH_COLLABORATION' 
  | 'SUPPLY_AGREEMENT' 
  | 'BREEDING_AGREEMENT' 
  | 'CONSULTING_AGREEMENT' 
  | 'NDA' 
  | 'LICENSING_AGREEMENT';

export type ContractStatus = 
  | 'DRAFT' 
  | 'UNDER_REVIEW' 
  | 'PENDING_SIGNATURE' 
  | 'ACTIVE' 
  | 'EXPIRED' 
  | 'TERMINATED' 
  | 'SUSPENDED';

export interface CompanyInfo {
  name: string;
  address: CustomerAddress;
  registrationNumber: string;
  taxId: string;
  signatoryName: string;
  signatoryTitle: string;
}

export interface RenewalTerms {
  autoRenewDays: number;
  noticePeriodDays: number;
  renewalDuration: number;
  priceAdjustment: PriceAdjustment;
}

export interface PriceAdjustment {
  type: 'FIXED' | 'PERCENTAGE' | 'INDEX_BASED' | 'NEGOTIATED';
  value?: number;
  index?: string;
}

export interface PaymentTerms {
  schedule: PaymentSchedule;
  method: PaymentMethod[];
  lateFeeRate?: number;
  discountTerms?: DiscountTerms;
}

export interface PaymentSchedule {
  type: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY' | 'MILESTONE' | 'ON_COMPLETION';
  dayOfMonth?: number;
  milestones?: PaymentMilestone[];
}

export interface PaymentMilestone {
  description: string;
  percentage: number;
  dueDate: string;
  completed: boolean;
}

export interface DiscountTerms {
  earlyPaymentDays: number;
  discountPercentage: number;
  volumeDiscounts?: VolumeDiscount[];
}

export interface VolumeDiscount {
  minimumAmount: number;
  discountPercentage: number;
}

export interface ContractVersion {
  version: string;
  createdAt: string;
  createdBy: string;
  changes: string;
  approvalStatus: ApprovalStatus;
  documentPath: string;
}

export interface ContractAmendment {
  id: string;
  amendmentNumber: string;
  date: string;
  description: string;
  changes: ContractChange[];
  approvalStatus: ApprovalStatus;
  effectiveDate: string;
}

export interface ContractChange {
  section: string;
  oldValue: string;
  newValue: string;
  reason: string;
}

export interface ContractPerformanceMetrics {
  deliveryPerformance: number; // percentage
  qualityScore: number;
  customerSatisfaction: number;
  costPerformance: number;
  timelineAdherence: number;
  milestoneCompletionRate: number;
}

export interface ContractComplianceStatus {
  overallStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'AT_RISK';
  lastAssessmentDate: string;
  complianceItems: ContractComplianceItem[];
}

export interface ContractComplianceItem {
  requirement: string;
  status: 'MET' | 'NOT_MET' | 'OVERDUE';
  dueDate: string;
  evidence?: string;
}

export interface ContractAlert {
  id: string;
  type: ContractAlertType;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  createdAt: string;
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export type ContractAlertType = 
  | 'EXPIRATION_WARNING' 
  | 'RENEWAL_OPPORTUNITY' 
  | 'COMPLIANCE_ISSUE' 
  | 'PERFORMANCE_ISSUE' 
  | 'PAYMENT_OVERDUE' 
  | 'MILESTONE_OVERDUE';

// Invoice & Financial Types
export interface InvoiceManagement {
  customerId: string;
  invoices: Invoice[];
  paymentHistory: PaymentHistoryRecord[];
  outstandingBalance: number;
  creditLimit: number;
  creditUtilization: number;
  averagePaymentDays: number;
  paymentBehaviorScore: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  
  // Invoice Details
  issueDate: string;
  dueDate: string;
  currency: string;
  
  // Line Items
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  
  // Payment Information
  paymentStatus: PaymentStatus;
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  
  // Related Information
  relatedContracts: string[];
  relatedProjects: string[];
  relatedServices: string[];
  
  // Processing Status
  status: InvoiceStatus;
  approvalWorkflow?: ApprovalWorkflow;
  
  // System Metadata
  createdAt: string;
  createdBy: string;
  lastModified: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate?: number;
  serviceType: string;
  serviceDate?: string;
  projectReference?: string;
}

export type InvoiceStatus = 
  | 'DRAFT' 
  | 'PENDING_APPROVAL' 
  | 'SENT' 
  | 'VIEWED' 
  | 'PAID' 
  | 'OVERDUE' 
  | 'CANCELLED' 
  | 'DISPUTED';

// Custom Report Builder Types
export interface CustomReport {
  id: string;
  name: string;
  description: string;
  type: ReportType;
  
  // Report Configuration
  parameters: ReportParameter[];
  dataSource: DataSource[];
  filters: ReportFilter[];
  grouping: ReportGrouping[];
  sorting: ReportSorting[];
  
  // Output Configuration
  format: ReportFormat[];
  charts: ChartConfiguration[];
  
  // Scheduling
  schedule?: ReportSchedule;
  
  // Access Control
  createdBy: string;
  isPublic: boolean;
  accessPermissions: ReportAccessPermission[];
  
  // System Metadata
  createdAt: string;
  lastModified: string;
  lastGenerated?: string;
  generationCount: number;
}

export type ReportType = 
  | 'SUCCESS_RATE_ANALYSIS' 
  | 'BATCH_COMPARISON' 
  | 'DONOR_PERFORMANCE' 
  | 'QUALITY_TRENDS' 
  | 'FINANCIAL_SUMMARY' 
  | 'CUSTOMER_ANALYTICS' 
  | 'SERVICE_UTILIZATION';

export interface ReportParameter {
  name: string;
  type: 'DATE' | 'STRING' | 'NUMBER' | 'BOOLEAN' | 'LIST';
  defaultValue?: any;
  isRequired: boolean;
  options?: string[];
}

export interface DataSource {
  table: string;
  alias: string;
  joins?: DataJoin[];
}

export interface DataJoin {
  type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
  table: string;
  onCondition: string;
}

export interface ReportFilter {
  field: string;
  operator: FilterOperator;
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export type FilterOperator = 
  | 'EQUALS' 
  | 'NOT_EQUALS' 
  | 'GREATER_THAN' 
  | 'LESS_THAN' 
  | 'BETWEEN' 
  | 'CONTAINS' 
  | 'IN' 
  | 'IS_NULL' 
  | 'IS_NOT_NULL';

export interface ReportGrouping {
  field: string;
  order: number;
}

export interface ReportSorting {
  field: string;
  direction: 'ASC' | 'DESC';
  order: number;
}

export interface ReportFormat {
  type: 'PDF' | 'EXCEL' | 'CSV' | 'JSON';
  configuration?: Record<string, any>;
}

export interface ChartConfiguration {
  type: 'BAR' | 'LINE' | 'PIE' | 'SCATTER' | 'AREA';
  title: string;
  xAxis: ChartAxis;
  yAxis: ChartAxis;
  series: ChartSeries[];
}

export interface ChartAxis {
  field: string;
  label: string;
  format?: string;
}

export interface ChartSeries {
  field: string;
  label: string;
  color?: string;
  aggregation?: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX';
}

export interface ReportSchedule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  dayOfWeek?: number; // 0-6, Sunday = 0
  dayOfMonth?: number; // 1-31
  time: string; // HH:MM format
  timezone: string;
  recipients: string[];
  isActive: boolean;
}

export interface ReportAccessPermission {
  userId: string;
  permissions: ('VIEW' | 'EDIT' | 'DELETE' | 'SCHEDULE')[];
  expiryDate?: string;
}

// Integration Types
export interface ModuleIntegration {
  customerId: string;
  animalManagement: AnimalManagementIntegration;
  finance: FinanceIntegration;
  reproductionHub: ReproductionHubIntegration;
  inventory: InventoryIntegration;
  tenderManagement: TenderManagementIntegration;
}

export interface AnimalManagementIntegration {
  linkedAnimals: AnimalReference[];
  ownershipTransfers: OwnershipTransfer[];
  healthRecords: HealthRecordReference[];
  breedingHistory: BreedingHistoryReference[];
  performanceData: PerformanceDataReference[];
}

export interface OwnershipTransfer {
  animalId: string;
  fromCustomerId?: string;
  toCustomerId: string;
  transferDate: string;
  reason: string;
  transferType: 'SALE' | 'LEASE' | 'BREEDING_LOAN' | 'GIFT';
  financialTerms?: FinancialTerms;
}

export interface FinancialTerms {
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
}

export interface HealthRecordReference {
  recordId: string;
  animalId: string;
  recordType: string;
  date: string;
  veterinarian: string;
  summary: string;
}

export interface BreedingHistoryReference {
  recordId: string;
  animalId: string;
  mateId?: string;
  breedingDate: string;
  method: string;
  outcome: string;
  offspring?: string[];
}

export interface PerformanceDataReference {
  recordId: string;
  animalId: string;
  metricType: string;
  value: number;
  unit: string;
  date: string;
}

export interface FinanceIntegration {
  invoices: Invoice[];
  payments: PaymentHistoryRecord[];
  creditTerms: CreditTerms;
  financialAnalytics: FinancialMetrics;
}

export interface CreditTerms {
  creditLimit: number;
  paymentTerms: PaymentTerms;
  interestRate?: number;
  lateFeeStructure: LateFeeStructure;
}

export interface LateFeeStructure {
  gracePeriodDays: number;
  flatFee?: number;
  percentageRate?: number;
  maximumFee?: number;
}

export interface ReproductionHubIntegration {
  serviceHistory: ServiceHistoryRecord[];
  ongoingProjects: ProjectReference[];
  reproductiveMetrics: ReproductiveMetrics;
  genomicData: GenomicDataReference[];
}

export interface ServiceHistoryRecord {
  serviceId: string;
  serviceType: string;
  animalIds: string[];
  startDate: string;
  completionDate?: string;
  status: string;
  outcome: string;
  cost: number;
  technician: string;
}

export interface GenomicDataReference {
  dataId: string;
  animalId: string;
  testType: string;
  results: Record<string, any>;
  testDate: string;
  laboratory: string;
  quality: number;
}

export interface InventoryIntegration {
  resourceUtilization: ResourceUtilizationRecord[];
  supplierRelationships: SupplierRelationship[];
  costAllocation: CostAllocationRecord[];
}

export interface ResourceUtilizationRecord {
  resourceId: string;
  resourceType: string;
  quantity: number;
  usageDate: string;
  project: string;
  cost: number;
}

export interface SupplierRelationship {
  supplierId: string;
  supplierName: string;
  relationship: 'DIRECT' | 'INDIRECT';
  totalSpend: number;
  preferredSupplier: boolean;
}

export interface CostAllocationRecord {
  allocationId: string;
  costCenter: string;
  amount: number;
  date: string;
  description: string;
  project?: string;
}

export interface TenderManagementIntegration {
  tenderParticipation: TenderParticipationRecord[];
  bids: BidRecord[];
  contracts: ContractReference[];
  vendorRelationships: VendorRelationship[];
}

export interface TenderParticipationRecord {
  tenderId: string;
  tenderTitle: string;
  submissionDate: string;
  status: string;
  bidAmount: number;
  outcome: string;
}

export interface BidRecord {
  bidId: string;
  tenderId: string;
  submittedAmount: number;
  submissionDate: string;
  status: string;
  evaluationScore?: number;
}

export interface ContractReference {
  contractId: string;
  contractType: string;
  startDate: string;
  endDate: string;
  value: number;
  status: string;
}

export interface VendorRelationship {
  vendorId: string;
  vendorName: string;
  relationshipType: string;
  performanceRating: number;
  totalContracts: number;
  totalValue: number;
}

// API Response Types
export interface CRMApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  metadata?: ResponseMetadata;
}

export interface ResponseMetadata {
  totalCount?: number;
  pageSize?: number;
  currentPage?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

// Search & Filter Types
export interface CRMSearchFilters {
  searchTerm?: string;
  customerCategories?: CustomerCategory[];
  statuses?: CustomerStatus[];
  dateRange?: DateRange;
  regions?: string[];
  tags?: string[];
  accountManagers?: string[];
  minRevenue?: number;
  maxRevenue?: number;
  hasContracts?: boolean;
  hasOverduePayments?: boolean;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

// Export Types
export interface ExportConfiguration {
  format: 'CSV' | 'EXCEL' | 'PDF' | 'JSON';
  fields: string[];
  filters?: CRMSearchFilters;
  includeDocuments?: boolean;
  includeAnalytics?: boolean;
}

export interface ExportResult {
  exportId: string;
  fileName: string;
  downloadUrl: string;
  expiryDate: string;
  recordCount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
} 