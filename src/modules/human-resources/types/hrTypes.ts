// Human Resources Module Types
// Phase 1: Core Employee Management

export interface EmployeeProfile {
  id: string;
  employeeId: string;
  oldEmployeeId?: string;
  fullName: {
    arabic: string;
    english: string;
  };
  religion: string;
  nationality: string;
  email: string;
  phone: string;
  education: string;
  dateOfBirth: string;
  workStartDate: string;
  gender: 'Male' | 'Female';
  idNumber: string;
  idExpiryDate: string;
  workLocation: string;
  department: string;
  jobTitle: string;
  visaTitle: string;
  sponsor: string;
  contractType: 'Fixed' | 'Unlimited';
  contractStartDate: string;
  contractEndDate?: string;
  contractDuration: number; // in months
  salary: number;
  experienceYears: number;
  annualLeaveDays: number;
  photo?: string;
  signature?: string;
  state: 'Active' | 'On Leave' | 'Resigned' | 'Terminated';
  attachments: string[];
  bankDetails: {
    iban: string;
    bank: string;
    accountNumber: string;
  };
  // KSA-Specific Fields
  gosiNumber?: string;
  gosiRegistrationDate?: string;
  gosiStatus: 'Registered' | 'Not Registered' | 'Suspended';
  gosiExempt: boolean; // New: GOSI exemption flag
  visaNumber?: string;
  visaExpiryDate?: string;
  iqamaNumber?: string;
  iqamaExpiryDate?: string;
  passportNumber?: string;
  passportExpiryDate?: string;
  workPermitNumber?: string;
  workPermitExpiryDate?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    address: string;
  };
  createdAt: string;
  updatedAt: string;
}

// NEW: Enhanced Role-Based Permissions
export interface UserRole {
  id: string;
  roleName: string;
  displayName: string;
  description: string;
  permissions: Permission[];
  isSystemRole: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  id: string;
  module: 'Employee' | 'Payroll' | 'Attendance' | 'Reports' | 'Settings' | 'Compliance' | 'Documents';
  action: 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export' | 'audit';
  resource?: string; // Specific resource like 'own_data', 'department_data', 'all_data'
  conditions?: PermissionCondition[];
}

export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

// NEW: Enhanced Mobile-First ESS Types
export interface MobileESSPreferences {
  id: string;
  employeeId: string;
  language: 'ar' | 'en' | 'both';
  notificationChannels: ('push' | 'sms' | 'email' | 'whatsapp')[];
  biometricEnabled: boolean;
  darkModeEnabled: boolean;
  offlineAccessEnabled: boolean;
  maxOfflineDays: number;
  quickActions: QuickAction[];
  dashboardLayout: DashboardWidget[];
  fontSize: 'small' | 'medium' | 'large';
  highContrastMode: boolean;
  dataUsageOptimized: boolean;
  autoSyncEnabled: boolean;
  syncFrequency: number; // minutes
  cacheSize: number; // MB
  updatedAt: string;
}

export interface QuickAction {
  id: string;
  actionType: 'request_leave' | 'view_payslip' | 'check_attendance' | 'upload_document' | 'emergency_contact';
  displayName: string;
  icon: string;
  isEnabled: boolean;
  order: number;
}

export interface DashboardWidget {
  id: string;
  widgetType: 'stats' | 'chart' | 'list' | 'calendar' | 'notifications';
  title: string;
  size: 'small' | 'medium' | 'large';
  position: { row: number; col: number };
  isVisible: boolean;
  refreshInterval: number; // seconds
  dataSource: string;
  configuration: Record<string, any>;
}

// NEW: Advanced Saudi Labor Law Compliance
export interface KSALaborLawRule {
  id: string;
  ruleType: 'Working_Hours' | 'Overtime' | 'Leave_Entitlement' | 'EOS_Calculation' | 'GOSI_Contribution' | 'WPS_Compliance';
  title: string;
  description: string;
  applicableFrom: string;
  isActive: boolean;
  configuration: {
    maxDailyHours?: number;
    maxWeeklyHours?: number;
    overtimeRate?: number;
    prayerBreakMinutes?: number;
    ramadanHours?: number;
    weekendDays?: string[];
    nationalHolidays?: string[];
  };
  validationScript?: string;
  penaltyConfiguration?: {
    violationThreshold: number;
    penaltyAmount: number;
    penaltyType: 'fixed' | 'percentage' | 'calculated';
  };
  autoEnforcement: boolean;
  notificationRules: NotificationRule[];
  auditRequired: boolean;
  updatedAt: string;
}

export interface NotificationRule {
  triggerCondition: string;
  recipients: ('employee' | 'manager' | 'hr' | 'compliance_officer')[];
  channels: ('email' | 'sms' | 'push' | 'whatsapp')[];
  template: string;
  escalationLevels: EscalationLevel[];
}

export interface EscalationLevel {
  level: number;
  delayHours: number;
  recipients: string[];
  actions: string[];
}

// NEW: Enhanced Attendance Tracking with Saudi Compliance
export interface EnhancedAttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'sick' | 'on_leave';
  location: string;
  gpsLocation?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  deviceInfo?: {
    deviceId: string;
    ipAddress: string;
    userAgent: string;
  };
  biometricVerified: boolean;
  supervisorApproved: boolean;
  // Saudi Labor Law Specific
  prayerBreaks: PrayerBreak[];
  ramadanAdjustment: boolean;
  ramadanHours?: number;
  weekendWork: boolean;
  holidayWork: boolean;
  nightShiftAllowance: number;
  // Compliance Checks
  laborLawCompliant: boolean;
  complianceNotes?: string;
  overtimeApproved: boolean;
  overtimeApprovedBy?: string;
  maxHoursViolation: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrayerBreak {
  prayerName: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
  startTime: string;
  endTime: string;
  duration: number; // minutes
  location?: string;
}

// NEW: Comprehensive Audit and Reporting Types
export interface AuditReport {
  id: string;
  reportType: 'Payroll_Audit' | 'Attendance_Audit' | 'Compliance_Audit' | 'Data_Access_Audit' | 'System_Audit';
  title: string;
  description: string;
  generatedBy: string;
  generatedAt: string;
  reportPeriod: {
    startDate: string;
    endDate: string;
  };
  filters: ReportFilter[];
  metrics: AuditMetric[];
  findings: AuditFinding[];
  recommendations: AuditRecommendation[];
  complianceScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  actionItems: ActionItem[];
  attachments: string[];
  exportFormats: ('PDF' | 'Excel' | 'CSV' | 'JSON')[];
  distributionList: string[];
  scheduleConfig?: ScheduleConfig;
  isScheduled: boolean;
  nextGenerationDate?: string;
  retentionDays: number;
  confidentialityLevel: 'Public' | 'Internal' | 'Confidential' | 'Restricted';
  approvalRequired: boolean;
  approvedBy?: string;
  approvalDate?: string;
  status: 'Draft' | 'Generated' | 'Under_Review' | 'Approved' | 'Distributed' | 'Archived';
}

export interface ReportFilter {
  field: string;
  operator: string;
  value: any;
  displayName: string;
}

export interface AuditMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  benchmark?: number;
  variance?: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  category: string;
  isKPI: boolean;
}

export interface AuditFinding {
  id: string;
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  title: string;
  description: string;
  evidence: string[];
  affectedRecords: number;
  complianceImpact: string;
  recommendedAction: string;
  dueDate?: string;
  assignedTo?: string;
  status: 'Open' | 'In_Progress' | 'Resolved' | 'Closed';
}

export interface AuditRecommendation {
  id: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  title: string;
  description: string;
  implementation: {
    effort: 'Low' | 'Medium' | 'High';
    timeline: string;
    resources: string[];
    cost: number;
  };
  expectedBenefit: string;
  riskMitigation: string;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Not_Started' | 'In_Progress' | 'Completed' | 'Overdue';
  progress: number;
  dependencies: string[];
  attachments: string[];
  comments: ActionItemComment[];
}

export interface ActionItemComment {
  id: string;
  commentBy: string;
  commentDate: string;
  content: string;
  attachments: string[];
}

export interface ScheduleConfig {
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  timezone: string;
  isActive: boolean;
}

// NEW: Enhanced Payroll with Automated Saudi Calculations
export interface AutomatedPayrollCalculation {
  id: string;
  employeeId: string;
  payPeriod: string;
  calculationDate: string;
  // Basic Salary Components
  basicSalary: number;
  allowances: PayrollAllowances;
  deductions: PayrollDeductions;
  // Saudi-Specific Calculations
  gosiCalculation: GOSICalculation;
  eosAccrual: EOSAccrual;
  overtimeCalculation: OvertimeCalculation;
  // Labor Law Compliance
  complianceChecks: ComplianceCheck[];
  // Automated Calculations
  grossPay: number;
  netPay: number;
  // Validation Results
  validationResults: PayrollValidationResult[];
  calculationAuditTrail: CalculationStep[];
  // Processing Status
  status: 'calculated' | 'validated' | 'approved' | 'processed' | 'paid';
  processedBy: string;
  processedAt: string;
  // WPS Integration
  wpsEligible: boolean;
  wpsReference?: string;
  // Payslip Generation
  payslipGenerated: boolean;
  payslipUrl?: string;
}

export interface PayrollAllowances {
  housing: number;
  transportation: number;
  communication: number;
  ticket: number;
  food: number;
  other: number;
  totalAllowances: number;
}

export interface PayrollDeductions {
  gosiEmployee: number;
  insurance: number;
  loans: number;
  advances: number;
  penalties: number;
  other: number;
  totalDeductions: number;
}

export interface GOSICalculation {
  basicSalaryForGOSI: number;
  employeeRate: number; // 9%
  employerRate: number; // 11%
  employeeContribution: number;
  employerContribution: number;
  totalContribution: number;
  isExempt: boolean;
  exemptionReason?: string;
  ceilingApplied: boolean;
  ceilingAmount?: number;
}

export interface EOSAccrual {
  currentServiceYears: number;
  currentServiceMonths: number;
  dailyRate: number;
  monthlyAccrual: number;
  yearToDateAccrual: number;
  totalAccrued: number;
  calculationMethod: 'progressive' | 'fixed';
  lastCalculationDate: string;
}

export interface OvertimeCalculation {
  regularHours: number;
  overtimeHours: number;
  overtimeRate: number; // 1.5x base rate
  overtimeAmount: number;
  holidayOvertimeHours?: number;
  holidayOvertimeRate?: number; // 2x base rate
  holidayOvertimeAmount?: number;
  totalOvertimeAmount: number;
  approvalRequired: boolean;
  approvedBy?: string;
}

export interface ComplianceCheck {
  checkType: string;
  checkName: string;
  passed: boolean;
  value: any;
  threshold: any;
  message: string;
  severity: 'info' | 'warning' | 'error';
  autoResolved: boolean;
  resolutionAction?: string;
}

export interface PayrollValidationResult {
  ruleId: string;
  ruleName: string;
  passed: boolean;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  affectedAmount?: number;
  suggestedFix?: string;
  autoFixApplied: boolean;
}

export interface CalculationStep {
  stepNumber: number;
  stepName: string;
  operation: string;
  inputValues: Record<string, any>;
  outputValue: any;
  formula?: string;
  timestamp: string;
  notes?: string;
}

// New: Payroll Settings for Saudi Compliance
export interface PayrollSettings {
  id: string;
  gosi_percentage_employee: number; // default 9%
  gosi_percentage_employer: number; // default 11%
  eos_daily_rate_factor: number; // usually 1/2 salary per year < 5yrs, full after
  wage_protection_format: 'CSV' | 'XML';
  company_name: string;
  company_registration: string;
  sama_bank_code: string;
  default_currency: string;
  fiscal_year_start: string;
  overtime_rate_factor: number; // default 1.5
  createdAt: string;
  updatedAt: string;
}

// New: End-of-Service Benefit Records
export interface EOSBenefitRecord {
  id: string;
  employeeId: string;
  contractId: string;
  startDate: string;
  endDate: string;
  totalServiceYears: number;
  totalServiceMonths: number;
  lastBasicSalary: number;
  averageSalary: number;
  calculationMethod: 'Progressive' | 'Fixed' | 'Custom';
  eosBreakdown: {
    firstFiveYears: number; // Half month per year
    afterFiveYears: number; // Full month per year
    leaveEncashment: number;
    bonusEncashment: number;
    totalEOS: number;
  };
  deductions: {
    loans: number;
    advances: number;
    penalties: number;
    other: number;
    totalDeductions: number;
  };
  calculatedAmount: number;
  netEOSAmount: number;
  paymentStatus: 'PENDING' | 'CALCULATED' | 'APPROVED' | 'PAID';
  paymentDate?: string;
  terminationReason: 'Resignation' | 'Termination' | 'Contract Expiry' | 'Retirement';
  approvedBy?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Enhanced KSA Payroll Record
export interface KSAPayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  payPeriod: string;
  basicSalary: number;
  allowances: {
    housing: number;
    transportation: number;
    communication: number;
    ticket: number;
    food: number;
    other: number;
    totalAllowances: number;
  };
  deductions: {
    gosiEmployee: number; // 9% of basic salary
    gosiEmployer: number; // 11% of basic salary (company contribution)
    insurance: number;
    visa: number;
    loans: number;
    advances: number;
    penalties: number;
    other: number;
    totalDeductions: number;
  };
  overtime: {
    hours: number;
    rate: number; // 1.5x basic hourly rate
    amount: number;
  };
  bonuses: {
    performance: number;
    attendance: number;
    other: number;
    totalBonuses: number;
  };
  grossPay: number;
  netPay: number;
  eosAccrued: number; // Accrued end-of-service amount
  status: 'draft' | 'processed' | 'paid' | 'cancelled';
  paymentMethod: 'WPS' | 'Bank Transfer' | 'Cash';
  paymentDate: string;
  wpsReference?: string;
  bankTransferFile?: string;
  payslipGenerated: boolean;
  payslipUrl?: string;
  isOffCycle: boolean;
  offCycleReason?: string;
  validationErrors?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// WPS (Wage Protection System) Types
export interface WPSFile {
  id: string;
  fileName: string;
  fileType: 'CSV' | 'XML';
  payPeriod: string;
  totalEmployees: number;
  totalAmount: number;
  companyCode: string;
  samaReference?: string;
  status: 'Generated' | 'Uploaded' | 'Processed' | 'Failed' | 'Validated';
  uploadDate?: string;
  processDate?: string;
  validationResults?: {
    validRecords: number;
    invalidRecords: number;
    errors: string[];
  };
  errorMessage?: string;
  fileUrl?: string;
  fileSize?: number;
  createdAt: string;
}

export interface WPSRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  iqamaNumber: string;
  bankCode: string;
  accountNumber: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  payPeriod: string;
  employeeType: 'Saudi' | 'GCC' | 'Non-GCC';
  status: 'Included' | 'Excluded' | 'Error' | 'Validated';
  errorMessage?: string;
  validationRules: {
    salaryRange: boolean;
    accountValid: boolean;
    iqamaValid: boolean;
    contractActive: boolean;
  };
}

// Off-Cycle Payroll Types
export interface OffCyclePayroll {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'Backdated Join' | 'Backdated Leave' | 'Leave Encashment' | 'Final Settlement' | 'Bonus' | 'Adjustment' | 'EOS Payment';
  effectiveDate: string;
  amount: number;
  reason: string;
  linkedEOSId?: string; // Link to EOSBenefitRecord if applicable
  status: 'Pending' | 'Approved' | 'Processed' | 'Paid';
  approvalDate?: string;
  approvedBy?: string;
  paymentDate?: string;
  paymentMethod: 'WPS' | 'Bank Transfer' | 'Cash' | 'Check';
  validationChecks: {
    contractValid: boolean;
    amountValid: boolean;
    approvalRequired: boolean;
    duplicateCheck: boolean;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Contract Compliance Types
export interface ContractCompliance {
  id: string;
  employeeId: string;
  contractId: string;
  complianceType: 'Contract Expiry' | 'Visa Renewal' | 'ID Renewal' | 'Work Permit Renewal' | 'Passport Renewal' | 'GOSI Registration';
  dueDate: string;
  reminderDates: string[]; // 90, 60, 30, 15 days prior
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue' | 'Renewed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  notificationSent: boolean;
  lastNotificationDate?: string;
  renewalDate?: string;
  newExpiryDate?: string;
  documentUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Enhanced Notification System
export interface ComplianceNotification {
  id: string;
  employeeId: string;
  type: 'Contract Expiry' | 'Visa Renewal' | 'ID Renewal' | 'Work Permit Renewal' | 'Passport Renewal' | 'GOSI Registration' | 'EOS Eligibility';
  title: {
    arabic: string;
    english: string;
  };
  message: {
    arabic: string;
    english: string;
  };
  dueDate: string;
  daysRemaining: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Pending' | 'Sent' | 'Read' | 'Acknowledged' | 'Resolved';
  sentDate?: string;
  readDate?: string;
  acknowledgedDate?: string;
  recipient: 'Employee' | 'Manager' | 'HR' | 'All';
  notificationChannels: ('Email' | 'SMS' | 'Dashboard' | 'WhatsApp')[];
  recurring: boolean;
  recurringInterval?: number; // days
  linkedRecordId?: string; // Link to contract, EOS record, etc.
  actionRequired: boolean;
  actionUrl?: string;
  createdAt: string;
}

// Payslip Generation Types
export interface PayslipTemplate {
  id: string;
  name: string;
  language: 'Arabic' | 'English' | 'Bilingual';
  companyLogo?: string;
  headerColor: string;
  includeQRCode: boolean;
  includeEOSAccrual: boolean;
  includeGOSIBreakdown: boolean;
  customFields: {
    fieldName: string;
    fieldValue: string;
    isVisible: boolean;
  }[];
  templateUrl?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PayslipRecord {
  id: string;
  payrollId: string;
  employeeId: string;
  templateId: string;
  language: 'Arabic' | 'English' | 'Bilingual';
  generatedDate: string;
  payslipUrl: string;
  downloadCount: number;
  lastDownloaded?: string;
  emailSent: boolean;
  emailSentDate?: string;
  printedCount: number;
  status: 'Generated' | 'Sent' | 'Downloaded' | 'Printed';
  fileSize: number;
  qrCodeData?: string;
  digitalSignature?: string;
  createdAt: string;
}

// Validation Rules
export interface PayrollValidationRule {
  id: string;
  ruleName: string;
  ruleType: 'Contract' | 'Salary' | 'GOSI' | 'EOS' | 'WPS' | 'General';
  condition: string;
  errorMessage: {
    arabic: string;
    english: string;
  };
  severity: 'Error' | 'Warning' | 'Info';
  isActive: boolean;
  autoFix: boolean;
  createdAt: string;
}

export interface ValidationResult {
  employeeId: string;
  payrollId?: string;
  ruleId: string;
  ruleName: string;
  severity: 'Error' | 'Warning' | 'Info';
  message: string;
  canProceed: boolean;
  autoFixed: boolean;
  fixAction?: string;
  validatedAt: string;
}

// End-of-Service Benefits
export interface EndOfServiceCalculation {
  id: string;
  employeeId: string;
  employeeName: string;
  terminationDate: string;
  serviceYears: number;
  serviceMonths: number;
  lastBasicSalary: number;
  averageSalary: number;
  calculationMethod: 'Half Month' | 'Full Month' | 'Progressive';
  benefits: {
    basicEOS: number; // Basic end-of-service
    additionalEOS: number; // Additional for 5+ years
    leaveEncashment: number;
    otherBenefits: number;
    totalEOS: number;
  };
  deductions: {
    loans: number;
    advances: number;
    other: number;
    totalDeductions: number;
  };
  netEOSAmount: number;
  status: 'Calculated' | 'Approved' | 'Paid';
  paymentDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobPositionTemplate {
  id: string;
  title: string;
  educationRequired: string;
  yearsOfExperience: number;
  baseSalary: number;
  annualLeave: number;
  leaveAllowance: number;
  transportationAllowance: number;
  housingAllowance: number;
  ticketAllowance: number;
  communicationAllowance: number;
  socialSecurityDeduction: number; // percentage
  insuranceCost: number;
  visaCost: number;
  endServiceBenefits: number; // percentage
  // KSA-Specific Fields
  gosiCategory: 'Saudi' | 'GCC' | 'Non-GCC';
  gosiEmployeeRate: number; // percentage
  gosiEmployerRate: number; // percentage
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContractTracker {
  id: string;
  employeeId: string;
  contractNumber: string;
  contractStartDate: string;
  contractEndDate?: string;
  contractDuration: number; // in months
  salaryDetails: {
    baseSalary: number;
    allowances: {
      transportation: number;
      housing: number;
      ticket: number;
      communication: number;
    };
    deductions: {
      socialSecurity: number;
      insurance: number;
      visa: number;
    };
  };
  terminationReason?: string;
  lastWorkingDay?: string;
  finalSettlementGenerated: boolean;
  status: 'Active' | 'Expired' | 'Terminated' | 'Renewed';
  // KSA-Specific Fields
  gosiNumber?: string;
  gosiRegistrationDate?: string;
  visaNumber?: string;
  visaExpiryDate?: string;
  iqamaNumber?: string;
  iqamaExpiryDate?: string;
  passportNumber?: string;
  passportExpiryDate?: string;
  sponsorName: string;
  sponsorNumber: string;
  createdAt: string;
  updatedAt: string;
}

// Phase 2: Attendance and Leave Management
export interface AttendanceCard {
  id: string;
  employeeId: string;
  date: string;
  clockInTime?: string;
  clockOutTime?: string;
  lateness: number; // in minutes
  earlyLeave: number; // in minutes
  absence: boolean;
  workingHours: number;
  comments?: string;
  createdAt: string;
}

export interface MonthlyAttendanceSummary {
  id: string;
  employeeId: string;
  year: number;
  month: number;
  workDays: number;
  absences: number;
  overtimeHours: number;
  penalties: number;
  delays: number;
  notes?: string;
  createdAt: string;
}

export interface LeaveRequest {
  id: string;
  requesterId: string;
  requestType: 'Annual' | 'Sick' | 'Unpaid' | 'Emergency' | 'Maternity' | 'Paternity' | 'Hajj' | 'Umrah';
  requestDate: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  directManagerApproval: boolean;
  departmentManagerApproval: boolean;
  hrApproval: boolean;
  ceoApproval: boolean;
  executionStatus: 'Pending' | 'Approved' | 'Rejected' | 'Executed';
  executionDate?: string;
  attachment?: string;
  createdAt: string;
  updatedAt: string;
}

// Phase 3: Payroll and Benefits
export interface Payroll {
  id: string;
  employeeId: string;
  year: number;
  month: number;
  baseSalary: number;
  socialInsuranceDeduction: number;
  transportationAllowance: number;
  housingAllowance: number;
  communicationAllowance: number;
  ticketAllowance: number;
  overtime: number;
  penalties: number;
  finalNetSalary: number;
  status: 'Draft' | 'Finalized' | 'Paid';
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BenefitRecord {
  id: string;
  employeeId: string;
  benefitType: 'Medical' | 'Transport' | 'EndService' | 'Ticket' | 'Housing';
  value: number;
  paid: boolean;
  dueDate: string;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface EmployeeListResponse {
  employees: EmployeeProfile[];
  total: number;
  page: number;
  limit: number;
}

export interface JobPositionListResponse {
  positions: JobPositionTemplate[];
  total: number;
  page: number;
  limit: number;
}

export interface ContractListResponse {
  contracts: ContractTracker[];
  total: number;
  page: number;
  limit: number;
}

// Form Types
export interface EmployeeFormData {
  fullName: {
    arabic: string;
    english: string;
  };
  religion: string;
  nationality: string;
  email: string;
  phone: string;
  education: string;
  dateOfBirth: string;
  workStartDate: string;
  gender: 'Male' | 'Female';
  idNumber: string;
  idExpiryDate: string;
  workLocation: string;
  department: string;
  jobTitle: string;
  visaTitle: string;
  sponsor: string;
  contractType: 'Fixed' | 'Unlimited';
  contractStartDate: string;
  contractEndDate?: string;
  salary: number;
  experienceYears: number;
  annualLeaveDays: number;
  bankDetails: {
    iban: string;
    bank: string;
    accountNumber: string;
  };
}

export interface JobPositionFormData {
  title: string;
  educationRequired: string;
  yearsOfExperience: number;
  baseSalary: number;
  annualLeave: number;
  leaveAllowance: number;
  transportationAllowance: number;
  housingAllowance: number;
  ticketAllowance: number;
  communicationAllowance: number;
  socialSecurityDeduction: number;
  insuranceCost: number;
  visaCost: number;
  endServiceBenefits: number;
}

export interface ContractFormData {
  employeeId: string;
  contractNumber: string;
  contractStartDate: string;
  contractEndDate?: string;
  salaryDetails: {
    baseSalary: number;
    allowances: {
      transportation: number;
      housing: number;
      ticket: number;
      communication: number;
    };
    deductions: {
      socialSecurity: number;
      insurance: number;
      visa: number;
    };
  };
}

// Filter Types
export interface EmployeeFilters {
  search?: string;
  department?: string;
  jobTitle?: string;
  nationality?: string;
  state?: 'Active' | 'On Leave' | 'Resigned' | 'Terminated';
  contractType?: 'Fixed' | 'Unlimited';
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface JobPositionFilters {
  search?: string;
  isActive?: boolean;
  minSalary?: number;
  maxSalary?: number;
}

export interface ContractFilters {
  search?: string;
  status?: 'Active' | 'Expired' | 'Terminated' | 'Renewed';
  contractType?: 'Fixed' | 'Unlimited';
  dateRange?: {
    start: string;
    end: string;
  };
}

// Dashboard Types
export interface EmployeeDashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  newHiresThisMonth: number;
  contractsExpiringSoon: number;
  averageSalary: number;
  departmentDistribution: {
    department: string;
    count: number;
  }[];
  nationalityDistribution: {
    nationality: string;
    count: number;
  }[];
}

export interface EmployeePersonalStats {
  employeeInfo: EmployeeProfile;
  contractInfo: ContractTracker;
  attendanceThisMonth: {
    workDays: number;
    absences: number;
    overtimeHours: number;
  };
  leaveBalance: {
    annual: number;
    sick: number;
    used: number;
  };
  recentPayroll: Payroll[];
  pendingRequests: LeaveRequest[];
}

// ESS/MSS Module Types - Employee & Manager Self-Service
// Phase 5: ESS/MSS Implementation

export interface EmployeeRequest {
  requestId: string;
  employeeId: string;
  employeeName: string;
  dateSubmitted: Date;
  requestType: 'Leave' | 'Exit Clearance' | 'ID Renewal' | 'Salary Certificate' | 'Vacation Salary Advance' | 'Transfer Request' | 'Medical Reimbursement' | 'Contract Amendment' | 'Document Request' | 'Training Request';
  subType?: 'Annual Leave' | 'Sick Leave' | 'Emergency Leave' | 'Maternity/Paternity' | 'Hajj/Umrah' | 'Unpaid Leave';
  description: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  requestedAmount?: number; // For salary advance, reimbursement
  requestedDates?: {
    startDate: string;
    endDate: string;
    totalDays?: number;
  };
  documentAttachment?: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadDate: string;
  }[];
  approvers: {
    id: string;
    name: string;
    role: 'Direct Manager' | 'Department Manager' | 'HR Manager' | 'CEO' | 'Finance Manager';
    order: number;
    required: boolean;
  }[];
  currentApprover?: string;
  approvalStatus: 'Pending' | 'In Review' | 'Partially Approved' | 'Approved' | 'Rejected' | 'Completed' | 'Cancelled';
  approvalLog: {
    approverId: string;
    approverName: string;
    approverRole: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Delegated' | 'Escalated';
    actionDate: Date;
    comments?: string;
    delegatedTo?: string;
    escalatedAfter?: number; // hours
  }[];
  executionDate?: Date;
  executionStatus: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  estimatedCompletionDate?: Date;
  actualCompletionDate?: Date;
  resultDocuments?: {
    fileName: string;
    fileUrl: string;
    generatedDate: string;
  }[];
  workflowStage: 'Submission' | 'Manager Review' | 'HR Review' | 'Finance Review' | 'CEO Approval' | 'Execution' | 'Completed';
  autoEscalation: {
    enabled: boolean;
    escalateAfterHours: number;
    nextEscalationLevel: string;
    escalationHistory: {
      fromLevel: string;
      toLevel: string;
      escalatedAt: Date;
      reason: string;
    }[];
  };
  tags: string[];
  relatedRequests?: string[]; // Related request IDs
  costCenter?: string;
  budgetApprovalRequired: boolean;
  budgetApproved?: boolean;
  totalCost?: number;
  createdAt: string;
  updatedAt: string;
}

// Approval Workflow Types
export interface ApprovalWorkflow {
  id: string;
  requestType: string;
  workflowName: string;
  description: string;
  isActive: boolean;
  stages: ApprovalStage[];
  autoEscalationRules: {
    enabled: boolean;
    escalateAfterHours: number;
    escalateToRole: string;
    escalateToSpecificUser?: string;
  };
  conditions: {
    amountThreshold?: number;
    departmentSpecific?: string[];
    roleSpecific?: string[];
    urgencyLevel?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalStage {
  stageId: string;
  stageName: string;
  stageOrder: number;
  requiredRole: string;
  isRequired: boolean;
  canDelegate: boolean;
  canSkip: boolean;
  skipConditions?: string[];
  timeoutHours: number;
  autoApproveConditions?: string[];
  parallelApproval: boolean;
  requiredApprovers: number; // For parallel approval
}

// ESS Dashboard Types
export interface ESSDashboardStats {
  personalInfo: {
    name: string;
    employeeId: string;
    department: string;
    position: string;
    profileCompleteness: number;
    photo?: string;
  };
  quickStats: {
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    documentsReady: number;
    upcomingRenewals: number;
  };
  leaveBalance: {
    annual: number;
    sick: number;
    emergency: number;
    used: number;
    pending: number;
  };
  upcomingEvents: {
    contractExpiry?: string;
    visaExpiry?: string;
    idExpiry?: string;
    appraisalDue?: string;
    trainingScheduled?: string;
  };
  recentActivity: {
    type: string;
    description: string;
    date: string;
    status: string;
  }[];
}

// MSS Dashboard Types
export interface MSSDashboardStats {
  teamOverview: {
    totalSubordinates: number;
    presentToday: number;
    onLeave: number;
    pendingApprovals: number;
    overdueApprovals: number;
  };
  approvalQueue: {
    urgent: number;
    normal: number;
    low: number;
    delegated: number;
  };
  teamPerformance: {
    attendanceRate: number;
    leaveUtilization: number;
    requestResponseTime: number; // hours
    complianceScore: number;
  };
  upcomingDeadlines: {
    contractExpiries: number;
    visaRenewals: number;
    appraisalsDue: number;
    trainingRequired: number;
  };
}

export interface TeamMemberSummary {
  employeeId: string;
  name: string;
  position: string;
  status: 'Present' | 'Leave' | 'Sick' | 'Travel' | 'Training';
  attendanceRate: number;
  pendingRequests: number;
  lastActivity: string;
  photo?: string;
  contactInfo: {
    email: string;
    phone: string;
  };
  upcomingEvents: {
    type: string;
    date: string;
    description: string;
  }[];
}

// Request Form Types
export interface RequestFormConfig {
  requestType: string;
  formFields: RequestFormField[];
  requiredDocuments: string[];
  approvalWorkflow: string;
  estimatedProcessingDays: number;
  autoGenerate: boolean; // Auto-generate certain fields
}

export interface RequestFormField {
  fieldId: string;
  fieldName: string;
  fieldType: 'text' | 'email' | 'number' | 'date' | 'dateRange' | 'select' | 'multiSelect' | 'textarea' | 'file' | 'checkbox' | 'currency';
  isRequired: boolean;
  placeholder?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  options?: string[]; // For select fields
  dependsOn?: string; // Field dependency
  showWhen?: string; // Conditional display
  defaultValue?: any;
}

// Leave Calendar Types
export interface LeaveCalendar {
  id: string;
  employeeId: string;
  departmentId: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  isPublicHoliday: boolean;
  isCompanyEvent: boolean;
  conflictsWith: string[]; // Conflicting leave requests
  coveringEmployee?: string;
  handoverCompleted: boolean;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface PublicHoliday {
  id: string;
  name: {
    arabic: string;
    english: string;
  };
  date: string;
  isNational: boolean;
  isReligious: boolean;
  isOptional: boolean;
  isRecurring: boolean;
  affectedEmployees: 'All' | 'Muslims' | 'Non-Muslims' | 'Specific';
  specificGroups?: string[];
}

// Document Management Types
export interface DocumentCategory {
  id: string;
  categoryName: string;
  description: string;
  isPersonal: boolean;
  isOfficial: boolean;
  retentionPeriod: number; // months
  accessLevel: 'Employee' | 'Manager' | 'HR' | 'All';
  requiredFields: string[];
  templateUrl?: string;
}

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  categoryId: string;
  documentName: string;
  documentType: string;
  fileUrl: string;
  uploadDate: string;
  expiryDate?: string;
  isVerified: boolean;
  verifiedBy?: string;
  verificationDate?: string;
  accessCount: number;
  lastAccessed?: string;
  tags: string[];
  version: number;
  previousVersions?: string[];
  isConfidential: boolean;
  downloadAllowed: boolean;
  printAllowed: boolean;
}