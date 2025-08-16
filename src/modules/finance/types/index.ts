// ====================================
// CORE FINANCE TYPES
// ====================================

export interface ChartOfAccounts {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  parentAccountId?: string;
  isActive: boolean;
  description?: string;
  balance: number;
  currencyCode: CurrencyCode;
  createdAt: Date;
  updatedAt: Date;
}

export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
  CURRENT_ASSET = 'CURRENT_ASSET',
  FIXED_ASSET = 'FIXED_ASSET',
  CURRENT_LIABILITY = 'CURRENT_LIABILITY',
  LONG_TERM_LIABILITY = 'LONG_TERM_LIABILITY'
}

export enum CurrencyCode {
  SAR = 'SAR',
  USD = 'USD',
  EUR = 'EUR',
  AED = 'AED'
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  description: string;
  reference?: string;
  entryDate: Date;
  postingDate: Date;
  costCenterId?: string;
  moduleSource?: ModuleSource;
  sourceId?: string;
  totalDebit: number;
  totalCredit: number;
  isPosted: boolean;
  createdBy: string;
  approvedBy?: string;
  journalLines: JournalLine[];
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface JournalLine {
  id: string;
  journalEntryId: string;
  accountId: string;
  account: ChartOfAccounts;
  description: string;
  debitAmount: number;
  creditAmount: number;
  costCenterId?: string;
  dimension1?: string;
  dimension2?: string;
  currencyCode: CurrencyCode;
  exchangeRate?: number;
}

export enum ModuleSource {
  MANUAL = 'MANUAL',
  SAMPLE_MANAGEMENT = 'SAMPLE_MANAGEMENT',
  CLINICAL_HUB = 'CLINICAL_HUB',
  REPRODUCTION = 'REPRODUCTION',
  INVENTORY = 'INVENTORY',
  HR_PAYROLL = 'HR_PAYROLL',
  PROCUREMENT = 'PROCUREMENT',
  TENDER = 'TENDER',
  CUSTOMER_BILLING = 'CUSTOMER_BILLING'
}

// ====================================
// COST CENTER ANALYSIS
// ====================================

export interface CostCenter {
  id: string;
  code: string;
  name: string;
  type: CostCenterType;
  parentId?: string;
  description?: string;
  isActive: boolean;
  managerId?: string;
  manager?: Employee;
  budget?: CostCenterBudget;
  currentPeriodStats?: CostCenterStats;
  createdAt: Date;
  updatedAt: Date;
}

export enum CostCenterType {
  CLINICAL_DEPARTMENT = 'CLINICAL_DEPARTMENT',
  REPRODUCTION_LAB = 'REPRODUCTION_LAB',
  GENOMIC_LAB = 'GENOMIC_LAB',
  PHARMACEUTICAL_PREP = 'PHARMACEUTICAL_PREP',
  FIELD_TEAMS = 'FIELD_TEAMS',
  SALES_CRM = 'SALES_CRM',
  RND_DEPARTMENT = 'RND_DEPARTMENT',
  TRAINING_HR = 'TRAINING_HR',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  TENDER_MANAGEMENT = 'TENDER_MANAGEMENT'
}

export interface CostCenterStats {
  costCenterId: string;
  period: string; // YYYY-MM format
  totalRevenue: number;
  totalExpenses: number;
  grossProfit: number;
  profitMargin: number;
  staffCosts: number;
  materialCosts: number;
  equipmentCosts: number;
  overheadCosts: number;
  servicesDelivered: number;
  costPerService: number;
  utilizationRate: number;
  budgetVariance: number;
  kpiMetrics: CostCenterKPI[];
}

export interface CostCenterKPI {
  id: string;
  costCenterId: string;
  kpiType: KPIType;
  name: string;
  value: number;
  target: number;
  unit: string;
  period: string;
  variance: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export enum KPIType {
  COST_PER_EMBRYO = 'COST_PER_EMBRYO',
  COST_PER_SCAN = 'COST_PER_SCAN',
  REVENUE_PER_STAFF = 'REVENUE_PER_STAFF',
  UTILIZATION_RATE = 'UTILIZATION_RATE',
  PROFIT_MARGIN = 'PROFIT_MARGIN',
  CUSTOMER_SATISFACTION = 'CUSTOMER_SATISFACTION',
  EFFICIENCY_SCORE = 'EFFICIENCY_SCORE'
}

// ====================================
// BUDGETING SYSTEM
// ====================================

export interface CostCenterBudget {
  id: string;
  costCenterId: string;
  fiscalYear: number;
  status: BudgetStatus;
  totalBudget: number;
  revenueTargets: BudgetLine[];
  expenseTargets: BudgetLine[];
  monthlyAllocations: MonthlyBudgetAllocation[];
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetLine {
  id: string;
  budgetId: string;
  accountId: string;
  account: ChartOfAccounts;
  categoryType: 'REVENUE' | 'EXPENSE';
  budgetAmount: number;
  actualAmount: number;
  variance: number;
  variancePercentage: number;
  description?: string;
}

export interface MonthlyBudgetAllocation {
  month: number; // 1-12
  budgetAmount: number;
  actualAmount: number;
  variance: number;
  forecastAmount: number;
}

export enum BudgetStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED'
}

export enum BudgetPeriod {
  ANNUAL = 'ANNUAL',
  QUARTERLY = 'QUARTERLY',
  MONTHLY = 'MONTHLY'
}

// ====================================
// CONTRACT MANAGEMENT SYSTEM
// ====================================

export interface ServiceContract {
  id: string;
  contractNumber: string;
  customerId: string;
  customer: Customer;
  contractType: ContractType;
  servicePackage: ServicePackage;
  startDate: Date;
  endDate: Date;
  totalValue: number;
  paidAmount: number;
  remainingAmount: number;
  status: ContractStatus;
  paymentSchedule: PaymentScheduleItem[];
  serviceTargets: ServiceTarget[];
  progressTracking: ContractProgress;
  costCenterId: string;
  assignedTechnician?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ContractType {
  REPRODUCTION_PACKAGE = 'REPRODUCTION_PACKAGE',
  IVF_PROGRAM = 'IVF_PROGRAM',
  EMBRYO_TRANSFER_PLAN = 'EMBRYO_TRANSFER_PLAN',
  GENETIC_TESTING_PROGRAM = 'GENETIC_TESTING_PROGRAM',
  BREEDING_CONSULTATION = 'BREEDING_CONSULTATION',
  MAINTENANCE_CONTRACT = 'MAINTENANCE_CONTRACT',
  RESEARCH_COLLABORATION = 'RESEARCH_COLLABORATION'
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  services: ContractService[];
  totalValue: number;
  estimatedDuration: number; // in days
  requiredResources: ResourceRequirement[];
}

export interface ContractService {
  serviceId: string;
  serviceName: string;
  serviceType: ServiceType;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  costCenterId: string;
  estimatedDuration: number; // in hours
  requiredStaff: string[];
  dependencies?: string[]; // other service IDs
}

export interface ResourceRequirement {
  resourceType: 'EQUIPMENT' | 'STAFF' | 'MATERIAL' | 'FACILITY';
  resourceId: string;
  quantity: number;
  duration: number; // in hours
}

export interface ServiceTarget {
  id: string;
  targetType: TargetType;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: Date;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: TargetStatus;
  milestones: TargetMilestone[];
}

export enum TargetType {
  PREGNANCY_RATE = 'PREGNANCY_RATE',
  EMBRYO_SURVIVAL_RATE = 'EMBRYO_SURVIVAL_RATE',
  SERVICE_COMPLETION_TIME = 'SERVICE_COMPLETION_TIME',
  COST_EFFICIENCY = 'COST_EFFICIENCY',
  CUSTOMER_SATISFACTION = 'CUSTOMER_SATISFACTION',
  QUALITY_SCORE = 'QUALITY_SCORE'
}

export enum TargetStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_TRACK = 'ON_TRACK',
  AT_RISK = 'AT_RISK',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface TargetMilestone {
  id: string;
  description: string;
  dueDate: Date;
  completedDate?: Date;
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
  value: number;
}

export interface ContractProgress {
  overallProgress: number; // percentage 0-100
  servicesCompleted: number;
  totalServices: number;
  timeElapsed: number; // percentage of contract duration
  budgetUtilized: number; // percentage of contract value
  targetAchievements: TargetAchievement[];
  riskFactors: RiskFactor[];
  nextMilestones: TargetMilestone[];
}

export interface TargetAchievement {
  targetId: string;
  targetName: string;
  achievementPercentage: number;
  status: TargetStatus;
  variance: number; // difference from expected at this point
}

export interface RiskFactor {
  type: 'SCHEDULE' | 'BUDGET' | 'QUALITY' | 'RESOURCE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  impact: string;
  mitigation: string;
  identified: Date;
}

export enum ContractStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export interface PaymentScheduleItem {
  id: string;
  description: string;
  dueDate: Date;
  amount: number;
  paidDate?: Date;
  paidAmount?: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIAL';
  linkedMilestones?: string[]; // milestone IDs
}

// ====================================
// ADVANCED ANALYTICS & INTEGRATION
// ====================================

export interface CrossModuleAnalytics {
  period: DateRange;
  modulePerformance: ModulePerformanceMetric[];
  serviceEfficiency: ServiceEfficiencyMetric[];
  costCenterProductivity: CostCenterProductivityMetric[];
  customerProfitability: CustomerProfitabilityAnalysis[];
  resourceUtilization: ResourceUtilizationMetric[];
  predictiveInsights: PredictiveInsight[];
}

export interface ModulePerformanceMetric {
  moduleSource: ModuleSource;
  revenue: number;
  costs: number;
  profit: number;
  profitMargin: number;
  transactionCount: number;
  averageTransactionValue: number;
  growthRate: number;
  efficiency: number; // cost per transaction
  customerSatisfaction: number;
  targetAchievement: number; // percentage of targets met
}

export interface ServiceEfficiencyMetric {
  serviceType: ServiceType;
  costCenterId: string;
  averageDuration: number; // in hours
  standardCost: number;
  actualCost: number;
  costVariance: number;
  qualityScore: number;
  customerRating: number;
  repeatCustomerRate: number;
  profitability: number;
  resourceEfficiency: number;
}

export interface CostCenterProductivityMetric {
  costCenterId: string;
  costCenterName: string;
  revenuePerHour: number;
  costPerHour: number;
  utilizationRate: number;
  staffProductivity: number;
  equipmentEfficiency: number;
  targetAchievementRate: number;
  customerSatisfaction: number;
  qualityMetrics: QualityMetric[];
}

export interface QualityMetric {
  metricName: string;
  value: number;
  target: number;
  unit: string;
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
}

export interface CustomerProfitabilityAnalysis {
  customerId: string;
  customerName: string;
  totalRevenue: number;
  totalCosts: number;
  grossProfit: number;
  profitMargin: number;
  serviceUtilization: ServiceUtilization[];
  contractPerformance: ContractPerformanceMetric[];
  loyaltyScore: number;
  riskScore: number;
  predictedLifetimeValue: number;
}

export interface ServiceUtilization {
  serviceType: ServiceType;
  frequency: number;
  totalSpent: number;
  averageValue: number;
  lastUsed: Date;
}

export interface ContractPerformanceMetric {
  contractId: string;
  onTimeCompletion: boolean;
  budgetAdherence: number; // percentage
  qualityScore: number;
  customerSatisfaction: number;
  targetAchievement: number;
}

export interface ResourceUtilizationMetric {
  resourceType: 'STAFF' | 'EQUIPMENT' | 'FACILITY';
  resourceId: string;
  resourceName: string;
  utilizationRate: number;
  revenueGenerated: number;
  costPerHour: number;
  efficiency: number;
  bookingRate: number;
  maintenanceTime: number;
}

export interface PredictiveInsight {
  type: 'REVENUE_FORECAST' | 'COST_PREDICTION' | 'RESOURCE_DEMAND' | 'CUSTOMER_CHURN' | 'QUALITY_TREND';
  timeframe: string; // "next_month", "next_quarter", etc.
  prediction: number;
  confidence: number; // percentage
  factors: string[];
  recommendation: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
}

// ====================================
// ENHANCED INVOICE INTEGRATION
// ====================================

export interface IntegratedInvoice extends Invoice {
  serviceBreakdown: InvoiceServiceBreakdown[];
  costCenterAllocation: InvoiceCostCenterAllocation[];
  contractReference?: string;
  moduleIntegration: InvoiceModuleIntegration;
  profitabilityAnalysis: InvoiceProfitabilityAnalysis;
  qualityMetrics: InvoiceQualityMetric[];
}

export interface InvoiceServiceBreakdown {
  serviceId: string;
  serviceName: string;
  serviceType: ServiceType;
  costCenterId: string;
  quantity: number;
  standardCost: number;
  actualCost: number;
  sellingPrice: number;
  grossProfit: number;
  profitMargin: number;
  durationHours: number;
  staffInvolved: string[];
  equipmentUsed: string[];
  qualityScore: number;
}

export interface InvoiceCostCenterAllocation {
  costCenterId: string;
  costCenterName: string;
  allocatedAmount: number;
  allocatedPercentage: number;
  profitContribution: number;
  resourcesUsed: ResourceUsage[];
}

export interface ResourceUsage {
  resourceType: 'STAFF' | 'EQUIPMENT' | 'MATERIAL';
  resourceId: string;
  usage: number;
  cost: number;
}

export interface InvoiceModuleIntegration {
  sourceModule: ModuleSource;
  sourceRecordId: string;
  relatedRecords: RelatedRecord[];
  workflowStatus: string;
  qualityChecks: QualityCheck[];
  autoGeneratedItems: AutoGeneratedItem[];
}

export interface RelatedRecord {
  moduleSource: ModuleSource;
  recordId: string;
  recordType: string;
  relationship: string;
}

export interface QualityCheck {
  checkType: string;
  status: 'PASSED' | 'FAILED' | 'PENDING';
  value: number;
  threshold: number;
  checkedBy: string;
  checkedAt: Date;
}

export interface AutoGeneratedItem {
  itemType: string;
  generatedFrom: string;
  automationRule: string;
  value: number;
}

export interface InvoiceProfitabilityAnalysis {
  grossRevenue: number;
  directCosts: number;
  indirectCosts: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  contributionMargin: number;
  customerLifetimeValueImpact: number;
}

export interface InvoiceQualityMetric {
  metricName: string;
  value: number;
  benchmark: number;
  performance: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';
  impactOnPrice: number;
}

// ====================================
// DATA ENTRY & EXTRACTION INNOVATION
// ====================================

export interface SmartDataEntry {
  formType: string;
  autoPopulationRules: AutoPopulationRule[];
  validationRules: ValidationRule[];
  suggestedValues: SuggestedValue[];
  recentEntries: RecentEntry[];
  templates: DataEntryTemplate[];
}

export interface AutoPopulationRule {
  fieldName: string;
  sourceModule: ModuleSource;
  sourceField: string;
  condition?: string;
  transformation?: string;
}

export interface ValidationRule {
  fieldName: string;
  ruleType: 'REQUIRED' | 'RANGE' | 'FORMAT' | 'CROSS_REFERENCE' | 'BUSINESS_LOGIC';
  rule: string;
  errorMessage: string;
  warningMessage?: string;
}

export interface SuggestedValue {
  fieldName: string;
  suggestions: ValueSuggestion[];
  source: 'HISTORY' | 'PATTERN' | 'SIMILAR_RECORDS' | 'AI_PREDICTION';
}

export interface ValueSuggestion {
  value: any;
  confidence: number;
  reason: string;
  frequency?: number;
}

export interface RecentEntry {
  timestamp: Date;
  user: string;
  formType: string;
  values: Record<string, any>;
  isTemplate: boolean;
}

export interface DataEntryTemplate {
  id: string;
  name: string;
  description: string;
  formType: string;
  templateData: Record<string, any>;
  isPublic: boolean;
  createdBy: string;
  usageCount: number;
}

export interface BulkDataOperation {
  operationType: 'IMPORT' | 'EXPORT' | 'UPDATE' | 'DELETE';
  dataType: string;
  format: 'CSV' | 'EXCEL' | 'JSON' | 'PDF';
  filters: BulkOperationFilter[];
  transformations: DataTransformation[];
  validationResults?: ValidationResult[];
  progress?: BulkOperationProgress;
}

export interface BulkOperationFilter {
  field: string;
  operator: 'EQUALS' | 'CONTAINS' | 'RANGE' | 'IN' | 'NOT_IN';
  value: any;
}

export interface DataTransformation {
  sourceField: string;
  targetField: string;
  transformation: string;
  parameters?: Record<string, any>;
}

export interface ValidationResult {
  rowNumber: number;
  field: string;
  value: any;
  error: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
}

export interface BulkOperationProgress {
  totalRecords: number;
  processedRecords: number;
  successfulRecords: number;
  failedRecords: number;
  currentOperation: string;
  estimatedTimeRemaining: number;
}

// ====================================
// SERVICE-BASED COSTING
// ====================================

export interface ServiceCost {
  id: string;
  serviceType: ServiceType;
  serviceName: string;
  costCenterId: string;
  standardCost: number;
  actualCosts: ServiceCostBreakdown;
  profitMargin: number;
  sellingPrice: number;
  isActive: boolean;
  lastUpdated: Date;
}

export enum ServiceType {
  IVF = 'IVF',
  OPU = 'OPU',
  FLUSHING = 'FLUSHING',
  EMBRYO_TRANSFER = 'EMBRYO_TRANSFER',
  GENETIC_TESTING = 'GENETIC_TESTING',
  ULTRASOUND = 'ULTRASOUND',
  BREEDING = 'BREEDING',
  CLINICAL_EXAM = 'CLINICAL_EXAM',
  VACCINATION = 'VACCINATION',
  LABORATORY_TEST = 'LABORATORY_TEST'
}

export interface ServiceCostBreakdown {
  laborCost: number;
  materialCost: number;
  equipmentCost: number;
  overheadCost: number;
  totalCost: number;
}

export interface ServiceTransaction {
  id: string;
  serviceId: string;
  service: ServiceCost;
  customerId: string;
  animalId: string;
  costCenterId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  costBreakdown: ServiceCostBreakdown;
  profitAmount: number;
  serviceDate: Date;
  invoiceId?: string;
  moduleSource: ModuleSource;
  sourceRecordId: string;
  createdAt: Date;
}

// ====================================
// ACCOUNTS PAYABLE & RECEIVABLE
// ====================================

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: Address;
  paymentTerms: PaymentTerms;
  creditLimit: number;
  currentBalance: number;
  vatNumber?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  type: CustomerType;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: Address;
  paymentTerms: PaymentTerms;
  creditLimit: number;
  currentBalance: number;
  vatNumber?: string;
  isActive: boolean;
  totalRevenue: number;
  lastTransaction?: Date;
  createdAt: Date;
}

export enum CustomerType {
  INDIVIDUAL = 'INDIVIDUAL',
  FARM = 'FARM',
  RESEARCH_INSTITUTE = 'RESEARCH_INSTITUTE',
  GOVERNMENT = 'GOVERNMENT',
  VETERINARY_CLINIC = 'VETERINARY_CLINIC'
}

export interface PaymentTerms {
  days: number;
  discountPercentage?: number;
  discountDays?: number;
  description: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customer: Customer;
  issueDate: Date;
  dueDate: Date;
  subtotal: number;
  vatAmount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: InvoiceStatus;
  paymentTerms: PaymentTerms;
  lines: InvoiceLine[];
  payments: Payment[];
  costCenterId?: string;
  moduleSource?: ModuleSource;
  sourceRecordId?: string;
  notes?: string;
  createdAt: Date;
}

export interface InvoiceLine {
  id: string;
  invoiceId: string;
  description: string;
  serviceType?: ServiceType;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  vatRate: number;
  vatAmount: number;
  accountId: string;
  costCenterId?: string;
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

export interface Payment {
  id: string;
  paymentNumber: string;
  customerId?: string;
  supplierId?: string;
  invoiceId?: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: PaymentMethod;
  reference?: string;
  bankAccountId?: string;
  currencyCode: CurrencyCode;
  exchangeRate?: number;
  status: PaymentStatus;
  notes?: string;
  createdAt: Date;
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHECK = 'CHECK',
  CREDIT_CARD = 'CREDIT_CARD',
  MOBILE_PAYMENT = 'MOBILE_PAYMENT'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

// ====================================
// ASSET MANAGEMENT
// ====================================

export interface Asset {
  id: string;
  assetCode: string;
  name: string;
  category: AssetCategory;
  costCenterId: string;
  acquisitionCost: number;
  acquisitionDate: Date;
  depreciationMethod: DepreciationMethod;
  usefulLife: number;
  salvageValue: number;
  currentBookValue: number;
  accumulatedDepreciation: number;
  status: AssetStatus;
  location?: string;
  serialNumber?: string;
  model?: string;
  supplier?: string;
  warrantyExpiry?: Date;
  lastMaintenanceDate?: Date;
  nextMaintenanceDate?: Date;
  createdAt: Date;
}

export enum AssetCategory {
  LABORATORY_EQUIPMENT = 'LABORATORY_EQUIPMENT',
  ULTRASOUND_EQUIPMENT = 'ULTRASOUND_EQUIPMENT',
  MICROSCOPES = 'MICROSCOPES',
  CENTRIFUGES = 'CENTRIFUGES',
  FREEZERS = 'FREEZERS',
  VEHICLES = 'VEHICLES',
  OFFICE_EQUIPMENT = 'OFFICE_EQUIPMENT',
  FURNITURE = 'FURNITURE',
  BUILDING = 'BUILDING'
}

export enum DepreciationMethod {
  STRAIGHT_LINE = 'STRAIGHT_LINE',
  DECLINING_BALANCE = 'DECLINING_BALANCE',
  UNITS_OF_PRODUCTION = 'UNITS_OF_PRODUCTION'
}

export enum AssetStatus {
  ACTIVE = 'ACTIVE',
  DISPOSED = 'DISPOSED',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
  IDLE = 'IDLE'
}

export interface DepreciationSchedule {
  id: string;
  assetId: string;
  period: string; // YYYY-MM
  depreciationAmount: number;
  accumulatedDepreciation: number;
  bookValue: number;
  journalEntryId?: string;
}

// ====================================
// TAX & COMPLIANCE (SAUDI ARABIA)
// ====================================

export interface TaxConfiguration {
  id: string;
  taxType: TaxType;
  rate: number;
  isActive: boolean;
  effectiveFrom: Date;
  effectiveTo?: Date;
  description: string;
}

export enum TaxType {
  VAT = 'VAT',
  ZAKAT = 'ZAKAT',
  WITHHOLDING_TAX = 'WITHHOLDING_TAX',
  INCOME_TAX = 'INCOME_TAX'
}

export interface VATReturn {
  id: string;
  period: string; // YYYY-MM
  outputVAT: number;
  inputVAT: number;
  netVAT: number;
  status: VATReturnStatus;
  submittedAt?: Date;
  dueDate: Date;
  createdAt: Date;
}

export enum VATReturnStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

// ====================================
// PAYROLL INTEGRATION
// ====================================

export interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  department: string;
  position: string;
  costCenterIds: string[];
  baseSalary: number;
  allowances: PayrollAllowance[];
  deductions: PayrollDeduction[];
  isActive: boolean;
}

export interface PayrollAllowance {
  type: string;
  amount: number;
  isRecurring: boolean;
}

export interface PayrollDeduction {
  type: string;
  amount: number;
  isRecurring: boolean;
}

export interface PayrollEntry {
  id: string;
  employeeId: string;
  employee: Employee;
  period: string; // YYYY-MM
  baseSalary: number;
  totalAllowances: number;
  totalDeductions: number;
  grossSalary: number;
  netSalary: number;
  gosiEmployee: number;
  gosiEmployer: number;
  costCenterAllocations: CostCenterAllocation[];
  journalEntryId?: string;
  status: PayrollStatus;
  processedAt?: Date;
}

export interface CostCenterAllocation {
  costCenterId: string;
  percentage: number;
  amount: number;
}

export enum PayrollStatus {
  DRAFT = 'DRAFT',
  PROCESSED = 'PROCESSED',
  PAID = 'PAID'
}

// ====================================
// REPORTING & ANALYTICS
// ====================================

export interface FinancialReport {
  id: string;
  reportType: ReportType;
  title: string;
  parameters: ReportParameters;
  generatedAt: Date;
  generatedBy: string;
  format: ReportFormat;
  data: any;
  costCenterFilter?: string[];
  periodFilter?: DateRange;
}

export enum ReportType {
  PROFIT_LOSS = 'PROFIT_LOSS',
  BALANCE_SHEET = 'BALANCE_SHEET',
  CASH_FLOW = 'CASH_FLOW',
  COST_CENTER_ANALYSIS = 'COST_CENTER_ANALYSIS',
  BUDGET_VARIANCE = 'BUDGET_VARIANCE',
  SERVICE_PROFITABILITY = 'SERVICE_PROFITABILITY',
  AGING_REPORT = 'AGING_REPORT',
  TAX_REPORT = 'TAX_REPORT'
}

export enum ReportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
  JSON = 'JSON'
}

export interface ReportParameters {
  dateRange: DateRange;
  costCenters?: string[];
  accounts?: string[];
  currencies?: CurrencyCode[];
  includeInactive?: boolean;
  comparisonPeriod?: DateRange;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// ====================================
// DASHBOARD & METRICS
// ====================================

export interface FinancialDashboard {
  period: string;
  totalRevenue: number;
  totalExpenses: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  cashPosition: number;
  accountsReceivable: number;
  accountsPayable: number;
  topPerformingCostCenters: CostCenterPerformance[];
  revenueByService: ServiceRevenue[];
  expensesByCategory: ExpenseCategory[];
  budgetVariances: BudgetVariance[];
  kpiMetrics: DashboardKPI[];
}

export interface CostCenterPerformance {
  costCenter: CostCenter;
  revenue: number;
  expenses: number;
  profit: number;
  profitMargin: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface ServiceRevenue {
  serviceType: ServiceType;
  revenue: number;
  transactions: number;
  averageValue: number;
  growth: number;
}

export interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
  budget: number;
  variance: number;
}

export interface BudgetVariance {
  costCenterId: string;
  costCenterName: string;
  budgetAmount: number;
  actualAmount: number;
  variance: number;
  variancePercentage: number;
  status: 'OVER_BUDGET' | 'UNDER_BUDGET' | 'ON_TARGET';
}

export interface DashboardKPI {
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
  variance: number;
  status: 'GOOD' | 'WARNING' | 'CRITICAL';
}

// ====================================
// MODULE INTEGRATION INTERFACES
// ====================================

export interface ModuleIntegration {
  moduleSource: ModuleSource;
  isEnabled: boolean;
  configuration: IntegrationConfiguration;
  lastSyncAt?: Date;
  syncStatus: SyncStatus;
}

export interface IntegrationConfiguration {
  autoCreateInvoices?: boolean;
  defaultCostCenter?: string;
  defaultServiceMapping?: Record<string, string>;
  priceListId?: string;
  vatRate?: number;
}

export enum SyncStatus {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  ERROR = 'ERROR',
  SYNCING = 'SYNCING'
}

// ====================================
// AUDIT & COMPLIANCE
// ====================================

export interface AuditTrail {
  id: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  userId: string;
  userName: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  POST = 'POST',
  REVERSE = 'REVERSE'
}

// ====================================
// API RESPONSE TYPES
// ====================================

export interface FinanceApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FinanceFilters {
  search?: string;
  dateRange?: DateRange;
  costCenters?: string[];
  accountTypes?: AccountType[];
  status?: string[];
  currencies?: CurrencyCode[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Enhanced Service Management Types
export interface ServiceConfiguration {
  id: string;
  serviceName: string;
  serviceCode: string;
  serviceType: ServiceType;
  description: string;
  category: ServiceCategory;
  moduleSource: ModuleSource;
  isActive: boolean;
  isConfigurable: boolean;
  version: string;
  lastUpdated: Date;
  createdBy: string;
}

export interface ServiceModuleOutput {
  id: string;
  serviceId: string;
  moduleSource: ModuleSource;
  outputType: ServiceOutputType;
  outputValue: number;
  outputUnit: string;
  qualityScore: number;
  performanceMetrics: ServicePerformanceMetric[];
  timestamp: Date;
}

export interface ServicePerformanceMetric {
  id: string;
  metricName: string;
  metricValue: number;
  metricUnit: string;
  targetValue: number;
  actualValue: number;
  variance: number;
  variancePercentage: number;
  status: PerformanceStatus;
  timestamp: Date;
}

export interface ServiceCostBreakdown {
  id: string;
  serviceId: string;
  costType: CostType;
  baseCost: number;
  variableCost: number;
  fixedCost: number;
  overheadAllocation: number;
  totalCost: number;
  costCenterId: string;
  lastUpdated: Date;
}

export interface ServicePricing {
  id: string;
  serviceId: string;
  basePrice: number;
  markupPercentage: number;
  discountPercentage: number;
  finalPrice: number;
  currency: CurrencyCode;
  pricingModel: PricingModel;
  isDynamic: boolean;
  lastUpdated: Date;
}

export interface ServiceContractTemplate {
  id: string;
  templateName: string;
  templateCode: string;
  description: string;
  services: ServiceContractService[];
  targetMetrics: ServiceTargetMetric[];
  paymentSchedule: PaymentSchedule[];
  terms: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface ServiceContractService {
  id: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  deliverySchedule: DeliverySchedule;
  qualityRequirements: QualityRequirement[];
}

export interface ServiceTargetMetric {
  id: string;
  targetName: string;
  targetType: TargetType;
  targetValue: number;
  targetUnit: string;
  measurementFrequency: MeasurementFrequency;
  successCriteria: string;
  weight: number;
}

export interface ServiceEstimate {
  id: string;
  estimateNumber: string;
  customerId: string;
  customerName: string;
  services: ServiceEstimateItem[];
  totalAmount: number;
  taxAmount: number;
  discountAmount: number;
  finalAmount: number;
  validityPeriod: number;
  status: EstimateStatus;
  createdBy: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface ServiceEstimateItem {
  id: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  costBreakdown: ServiceCostBreakdown;
  performanceEstimate: ServicePerformanceEstimate;
  deliveryTimeline: number;
  riskFactors: RiskFactor[];
}

export interface ServicePerformanceEstimate {
  id: string;
  estimatedSuccessRate: number;
  estimatedDuration: number;
  estimatedQuality: number;
  estimatedEfficiency: number;
  confidenceLevel: number;
  riskLevel: RiskLevel;
  assumptions: string[];
}

export interface ServiceAnalysis {
  id: string;
  serviceId: string;
  analysisType: AnalysisType;
  analysisPeriod: DateRange;
  revenueAnalysis: RevenueAnalysis;
  costAnalysis: CostAnalysis;
  performanceAnalysis: PerformanceAnalysis;
  profitabilityAnalysis: ProfitabilityAnalysis;
  recommendations: Recommendation[];
  generatedAt: Date;
}

export interface RevenueAnalysis {
  totalRevenue: number;
  averageRevenue: number;
  revenueGrowth: number;
  revenueByPeriod: RevenueByPeriod[];
  topCustomers: TopCustomer[];
  revenueTrends: RevenueTrend[];
}

export interface CostAnalysis {
  totalCost: number;
  averageCost: number;
  costBreakdown: CostBreakdown[];
  costVariance: number;
  costTrends: CostTrend[];
  efficiencyMetrics: EfficiencyMetric[];
}

export interface PerformanceAnalysis {
  overallPerformance: number;
  performanceByMetric: PerformanceByMetric[];
  performanceTrends: PerformanceTrend[];
  benchmarkComparison: BenchmarkComparison[];
  improvementAreas: ImprovementArea[];
}

export interface ProfitabilityAnalysis {
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  profitTrends: ProfitTrend[];
  profitabilityByService: ProfitabilityByService[];
  breakEvenAnalysis: BreakEvenAnalysis;
}

// Enums
export enum ServiceCategory {
  REPRODUCTION = 'REPRODUCTION',
  CLINICAL = 'CLINICAL',
  LABORATORY = 'LABORATORY',
  DIAGNOSTIC = 'DIAGNOSTIC',
  CONSULTATION = 'CONSULTATION',
  TRAINING = 'TRAINING',
  MAINTENANCE = 'MAINTENANCE',
  SUPPORT = 'SUPPORT'
}

export enum ServiceOutputType {
  EMBRYO = 'EMBRYO',
  PREGNANCY = 'PREGNANCY',
  DIAGNOSIS = 'DIAGNOSIS',
  REPORT = 'REPORT',
  CONSULTATION = 'CONSULTATION',
  TRAINING = 'TRAINING',
  MAINTENANCE = 'MAINTENANCE',
  SUPPORT = 'SUPPORT'
}

export enum PerformanceStatus {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  AVERAGE = 'AVERAGE',
  BELOW_AVERAGE = 'BELOW_AVERAGE',
  POOR = 'POOR'
}

export enum CostType {
  LABOR = 'LABOR',
  MATERIAL = 'MATERIAL',
  EQUIPMENT = 'EQUIPMENT',
  OVERHEAD = 'OVERHEAD',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  MARKETING = 'MARKETING',
  RESEARCH = 'RESEARCH'
}

export enum PricingModel {
  FIXED = 'FIXED',
  VARIABLE = 'VARIABLE',
  TIERED = 'TIERED',
  VOLUME_BASED = 'VOLUME_BASED',
  PERFORMANCE_BASED = 'PERFORMANCE_BASED'
}

export enum TargetType {
  PREGNANCY_RATE = 'PREGNANCY_RATE',
  EMBRYO_QUALITY = 'EMBRYO_QUALITY',
  SUCCESS_RATE = 'SUCCESS_RATE',
  EFFICIENCY = 'EFFICIENCY',
  QUALITY_SCORE = 'QUALITY_SCORE',
  CUSTOMER_SATISFACTION = 'CUSTOMER_SATISFACTION',
  COST_EFFICIENCY = 'COST_EFFICIENCY',
  TIME_TO_COMPLETION = 'TIME_TO_COMPLETION'
}

export enum MeasurementFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY'
}

export enum EstimateStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  CONVERTED = 'CONVERTED'
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum AnalysisType {
  REVENUE = 'REVENUE',
  COST = 'COST',
  PERFORMANCE = 'PERFORMANCE',
  PROFITABILITY = 'PROFITABILITY',
  COMPREHENSIVE = 'COMPREHENSIVE'
}

// Additional interfaces for enhanced functionality
export interface DeliverySchedule {
  startDate: Date;
  endDate: Date;
  milestones: Milestone[];
  dependencies: string[];
}

export interface QualityRequirement {
  requirement: string;
  standard: string;
  measurement: string;
  target: number;
}

export interface PaymentSchedule {
  milestone: string;
  percentage: number;
  amount: number;
  dueDate: Date;
  conditions: string[];
}

export interface RiskFactor {
  factor: string;
  probability: number;
  impact: number;
  mitigation: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface RevenueByPeriod {
  period: string;
  revenue: number;
  growth: number;
}

export interface TopCustomer {
  customerId: string;
  customerName: string;
  revenue: number;
  percentage: number;
}

export interface RevenueTrend {
  period: string;
  trend: number;
  forecast: number;
}

export interface CostBreakdown {
  costType: CostType;
  amount: number;
  percentage: number;
}

export interface CostTrend {
  period: string;
  cost: number;
  variance: number;
}

export interface EfficiencyMetric {
  metric: string;
  value: number;
  target: number;
  efficiency: number;
}

export interface PerformanceByMetric {
  metric: string;
  value: number;
  target: number;
  performance: number;
}

export interface PerformanceTrend {
  period: string;
  performance: number;
  trend: number;
}

export interface BenchmarkComparison {
  metric: string;
  current: number;
  benchmark: number;
  difference: number;
}

export interface ImprovementArea {
  area: string;
  currentValue: number;
  targetValue: number;
  improvement: number;
  priority: string;
}

export interface ProfitTrend {
  period: string;
  profit: number;
  margin: number;
}

export interface ProfitabilityByService {
  serviceId: string;
  serviceName: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
}

export interface BreakEvenAnalysis {
  breakEvenPoint: number;
  contributionMargin: number;
  safetyMargin: number;
  analysis: string;
}

export interface Recommendation {
  category: string;
  recommendation: string;
  impact: string;
  priority: string;
  implementation: string;
}

export interface Milestone {
  name: string;
  date: Date;
  deliverables: string[];
  status: string;
} 