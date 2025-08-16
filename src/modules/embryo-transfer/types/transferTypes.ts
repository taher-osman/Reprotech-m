// Embryo Transfer Module - Comprehensive Type System
// Phase 3: Advanced Transfer Management with Analytics Dashboard

export interface TransferRecord {
  // Core Identification
  id: string;
  transferId: string;
  internalNumber: string; // Main identification using internal numbers
  embryoId: string;
  recipientId: string;
  recipientInternalNumber: string;
  
  // Donor Information
  donorId: string;
  donorName: string;
  donorInternalNumber: string;
  donorBreed: string;
  
  // Sire Information
  sireId: string;
  sireName: string;
  sireInternalNumber: string;
  sireBreed: string;
  
  // Embryo Details
  embryoGrade: string;
  embryoStage: 'MORULA' | 'EARLY_BLASTOCYST' | 'BLASTOCYST' | 'EXPANDED_BLASTOCYST' | 'HATCHING_BLASTOCYST' | 'HATCHED_BLASTOCYST';
  embryoDay: number;
  
  // Recipient Information
  recipientName: string;
  recipientBreed: string;
  recipientAge: number;
  recipientWeight: number;
  recipientBCS: number; // Body Condition Score 1-9
  
  // Synchronization Data
  synchronizationProtocol: 'CIDR_PGF' | 'OVSYNCH' | 'HEATSYNCH' | 'COSYNCH' | 'NATURAL_CYCLE';
  synchronizationDay: number;
  lastEstrus: Date;
  ovulationTiming: 'CONFIRMED' | 'ESTIMATED' | 'UNKNOWN';
  
  // Transfer Procedure
  transferDate: Date;
  transferTime: string;
  veterinarian: string;
  technician: string;
  transferMethod: 'SURGICAL' | 'NON_SURGICAL_CERVICAL' | 'NON_SURGICAL_TRANSCERVICAL';
  transferSite: 'LEFT_HORN' | 'RIGHT_HORN' | 'UTERINE_BODY';
  
  // Procedure Details
  cervixCondition: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  transferDifficulty: 'EASY' | 'MODERATE' | 'DIFFICULT' | 'VERY_DIFFICULT';
  bloodInMucus: boolean;
  transferDepth: number; // cm
  
  // Medication & Treatments
  sedation: boolean;
  sedationType?: string;
  antibiotics: boolean;
  antibioticType?: string;
  progesterone: boolean;
  progesteroneType?: string;
  
  // Environmental Conditions
  weather: 'SUNNY' | 'CLOUDY' | 'RAINY' | 'WINDY' | 'HOT' | 'COLD';
  temperature: number;
  humidity: number;
  stress_level: 'LOW' | 'MODERATE' | 'HIGH';
  
  // Quality Control
  embryoThawTime?: Date;
  embryoViabilityPost: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  transferQuality: 'OPTIMAL' | 'GOOD' | 'SUBOPTIMAL' | 'POOR';
  
  // Pregnancy & Follow-up Management
  pregnancyAge: number; // Transfer date + 8 days
  followUpDates: {
    day15: Date;
    day30: Date;
    day45: Date;
    day60: Date;
  };
  nextFollowUp?: Date; // Next scheduled follow-up
  
  // Customer Reporting (60+ days)
  needsCustomerReport: boolean;
  customerReportSent: boolean;
  
  // Legacy Monitoring Schedule (maintained for compatibility)
  pregnancyCheck1: Date; // Day 30-35
  pregnancyCheck2?: Date; // Day 60-65
  pregnancyCheck3?: Date; // Day 90-100
  
  // Pregnancy Tracking System - NEW
  pregnancyTracking: PregnancyTracking;
  
  // Results & Outcomes
  pregnancyStatus: 'PREGNANT' | 'OPEN' | 'PENDING' | 'LOST' | 'UNKNOWN';
  pregnancyRate: number;
  birthOutcome?: 'LIVE_BIRTH' | 'STILLBORN' | 'ABORTED' | 'PENDING';
  calfWeight?: number;
  calfSex?: 'MALE' | 'FEMALE';
  
  // Financial
  transferCost: number;
  recipientCost: number;
  totalCost: number;
  
  // Research & Notes
  researchProject?: string;
  specialNotes: string;
  complications: string[];
  followUpRequired: boolean;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
}

export interface RecipientRecord {
  id: string;
  animalId: string;
  name: string;
  species: 'BOVINE' | 'EQUINE' | 'CAMEL' | 'OVINE' | 'CAPRINE';
  breed: string;
  age: number;
  weight: number;
  bodyConditionScore: number;
  
  // Reproductive History
  totalTransfers: number;
  successfulPregnancies: number;
  pregnancyRate: number;
  lastTransferDate?: Date;
  lastCalvingDate?: Date;
  
  // Current Status
  currentStatus: 'AVAILABLE' | 'SYNCHRONIZED' | 'READY' | 'TRANSFERRED' | 'PREGNANT' | 'CALVED' | 'RETIRED';
  synchronizationProtocol?: string;
  synchronizationDay?: number;
  readinessScore: number; // 0-100
  
  // Health Metrics
  healthStatus: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  lastVetCheck: Date;
  vaccinations: string[];
  currentMedications: string[];
  
  // Location & Management
  currentLocation: string;
  owner: string;
  manager: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface TransferAnalytics {
  // Success Rates
  overallSuccessRate: number;
  monthlySuccessRate: number;
  veterinarianSuccessRates: { [key: string]: number };
  
  // Trend Analysis
  monthlyTrends: {
    month: string;
    transfers: number;
    pregnancies: number;
    successRate: number;
  }[];
  
  // Quality Metrics
  embryoGradeSuccess: { [key: string]: number };
  transferMethodSuccess: { [key: string]: number };
  recipientAgeSuccess: { [key: string]: number };
  
  // Performance Indicators
  averageTransferTime: number;
  averageCost: number;
  complicationRate: number;
  retryRate: number;
  
  // Comparative Analysis
  industryBenchmark: number;
  facilityRanking: number;
  improvementTrends: number;
}

export interface TransferDashboardStats {
  // Current Period
  totalTransfers: number;
  successfulTransfers: number;
  pendingResults: number;
  scheduledTransfers: number;
  
  // Success Metrics
  currentSuccessRate: number;
  targetSuccessRate: number;
  industryAverage: number;
  
  // Quality Distribution
  gradeAEmbryos: number;
  gradeBEmbryos: number;
  gradeCEmbryos: number;
  
  // Recent Activity
  transfersToday: number;
  transfersThisWeek: number;
  transfersThisMonth: number;
  
  // Alerts & Notifications
  urgentFollowUps: number;
  overdueCheckups: number;
  availableRecipients: number;
  
  // New Follow-up & Reporting Metrics
  pendingFollowUps: number; // Next 7 days
  customerReportsNeeded: number; // 60+ days transfers
}

export interface TransferFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  veterinarian?: string[];
  recipientBreed?: string[];
  embryoGrade?: string[];
  transferMethod?: string[];
  pregnancyStatus?: string[];
  transferStatus?: string[];
  species?: string[];
  successRateRange?: {
    min: number;
    max: number;
  };
}

export interface TransferExportData {
  format: 'CSV' | 'EXCEL' | 'PDF' | 'JSON';
  includeFields: string[];
  filters: TransferFilters;
  dateRange: {
    start: Date;
    end: Date;
  };
  includeAnalytics: boolean;
}

// Constants
export const TRANSFER_METHODS = [
  'SURGICAL',
  'NON_SURGICAL_CERVICAL', 
  'NON_SURGICAL_TRANSCERVICAL'
] as const;

export const EMBRYO_STAGES = [
  'MORULA',
  'EARLY_BLASTOCYST',
  'BLASTOCYST', 
  'EXPANDED_BLASTOCYST',
  'HATCHING_BLASTOCYST',
  'HATCHED_BLASTOCYST'
] as const;

export const SYNCHRONIZATION_PROTOCOLS = [
  'CIDR_PGF',
  'OVSYNCH', 
  'HEATSYNCH',
  'COSYNCH',
  'NATURAL_CYCLE'
] as const;

export const TRANSFER_QUALITY_GRADES = [
  'OPTIMAL',
  'GOOD',
  'SUBOPTIMAL', 
  'POOR'
] as const;

export const PREGNANCY_STATUSES = [
  'PREGNANT',
  'OPEN',
  'PENDING',
  'LOST',
  'UNKNOWN'
] as const;

export const SPECIES_OPTIONS = [
  'BOVINE',
  'EQUINE', 
  'CAMEL',
  'OVINE',
  'CAPRINE'
] as const;

// Pregnancy Checkpoint Types - NEW PREGNANCY TRACKING SYSTEM
export interface PregnancyCheckpoint {
  id: string;
  title: string;
  scheduledDate: Date;
  actualDate?: Date;
  performed: boolean;
  result: 'PREGNANT' | 'NOT_PREGNANT' | 'RECHECK' | 'UNKNOWN' | 'DELIVERED' | 'ABORTED' | 'DIED';
  confidence?: number; // 0-100%
  notes: string;
  updatedBy?: string;
  updatedAt?: Date;
  daysFromTransfer: number;
  isParturition?: boolean;
  expectedDate?: Date; // For parturition
  complications?: string[];
  followUpRequired?: boolean;
  nextCheckDate?: Date;
}

export interface PregnancyTracking {
  checkpoints: PregnancyCheckpoint[];
  currentStatus: 'PENDING' | 'PREGNANT' | 'NOT_PREGNANT' | 'DELIVERED' | 'LOST' | 'UNKNOWN';
  lastCheckDate?: Date;
  nextCheckDate?: Date;
  pregnancyConfirmedDate?: Date;
  gestationDays?: number;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  pregnancyRate?: number; // Cumulative success rate at current stage
  riskFactors?: string[];
  recommendations?: string[];
} 