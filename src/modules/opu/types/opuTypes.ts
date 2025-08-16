// OPU (Ovum Pick-Up) Module Types
export type OPUStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
export type AnesthesiaType = 'SEDATION' | 'LOCAL' | 'EPIDURAL' | 'GENERAL' | 'NONE';
export type SessionResult = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'FAILED';

export interface OPUProtocol {
  id: string;
  name: string;
  description: string;
  fshDose?: number; // IU
  ecgDose?: number; // IU
  synchronizationDays: number;
  isActive: boolean;
  species: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OPUSession {
  id: string;
  sessionId: string; // Auto-generated unique ID (e.g., OPU-2025-0001)
  donorId: string;
  donorInfo?: {
    animalID: string;
    name: string;
    species: string;
    age: number;
  };
  sessionDate: string;
  protocolId: string;
  protocolInfo?: OPUProtocol;
  anesthesiaUsed: AnesthesiaType;
  operatorId: string;
  operatorName?: string;
  technicianId?: string;
  technicianName?: string;
  
  // Pre-procedure observations
  preUltrasoundDate?: string;
  folliclesObserved: number;
  dominantFollicles: number;
  mediumFollicles: number;
  smallFollicles: number;
  
  // Procedure details
  sessionStartTime: string;
  sessionEndTime?: string;
  mediaUsed: string;
  needleGauge: string;
  aspirationPressure: number; // mmHg
  flushingVolume: number; // ml
  
  // Results
  oocytesRetrieved: number;
  oocytesGradeA: number;
  oocytesGradeB: number;
  oocytesGradeC: number;
  oocytesDegenerated: number;
  cumulusComplexes: number;
  
  // Session outcome
  status: OPUStatus;
  sessionResult: SessionResult;
  complications?: string;
  notes?: string;
  
  // Auto-sample generation
  autoCreateSamples: boolean;
  createdSampleIds?: string[];
  
  // Follow-up
  nextSessionDate?: string;
  recoveryTime: number; // days
  
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface OPUFilters {
  searchTerm: string;
  donorId: string;
  protocolId: string;
  status: OPUStatus | '';
  dateFrom: string;
  dateTo: string;
  operatorId: string;
  sessionResult: SessionResult | '';
}

export interface OPUStats {
  totalSessions: number;
  completedSessions: number;
  successRate: number;
  averageOocytesPerSession: number;
  averageGradeARate: number;
  sessionsByProtocol: Record<string, number>;
  sessionsByOperator: Record<string, number>;
  sessionsByResult: Record<SessionResult, number>;
  monthlyTrends: Array<{
    month: string;
    sessions: number;
    oocytes: number;
    successRate: number;
  }>;
}

export interface OPUSessionFormData {
  donorId: string;
  sessionDate: string;
  protocolId: string;
  anesthesiaUsed: AnesthesiaType;
  operatorId: string;
  technicianId?: string;
  
  // Pre-procedure
  preUltrasoundDate?: string;
  folliclesObserved: number;
  dominantFollicles: number;
  mediumFollicles: number;
  smallFollicles: number;
  
  // Procedure
  sessionStartTime: string;
  mediaUsed: string;
  needleGauge: string;
  aspirationPressure: number;
  flushingVolume: number;
  
  // Expected/Planned
  autoCreateSamples: boolean;
  nextSessionDate?: string;
  notes?: string;
}

export interface OPUSessionUpdateData {
  sessionEndTime: string;
  oocytesRetrieved: number;
  oocytesGradeA: number;
  oocytesGradeB: number;
  oocytesGradeC: number;
  oocytesDegenerated: number;
  cumulusComplexes: number;
  status: OPUStatus;
  sessionResult: SessionResult;
  complications?: string;
  notes?: string;
  recoveryTime: number;
}

// Constants
export const OPU_STATUSES: OPUStatus[] = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'FAILED'];
export const ANESTHESIA_TYPES: AnesthesiaType[] = ['SEDATION', 'LOCAL', 'EPIDURAL', 'GENERAL', 'NONE'];
export const SESSION_RESULTS: SessionResult[] = ['EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'FAILED'];

export const NEEDLE_GAUGES = ['18G', '19G', '20G', '21G', '22G'];
export const MEDIA_TYPES = [
  'HEPES-buffered TCM-199',
  'PBS with BSA',
  'Commercial OPU Medium',
  'Dulbecco PBS',
  'Custom Medium'
];

export const DEFAULT_PROTOCOLS = [
  'Standard FSH Protocol',
  'Enhanced Superovulation',
  'Short Protocol',
  'Long Protocol',
  'Custom Protocol'
];

// Integration interfaces
export interface OPUSampleCreation {
  sessionId: string;
  animalId: string;
  collectionDate: string;
  oocyteGrade: 'A' | 'B' | 'C' | 'Degenerated';
  cumulusPresent: boolean;
  sampleNotes?: string;
}

export interface Animal {
  id: string;
  animalID: string;
  name: string;
  species: string;
  sex: 'MALE' | 'FEMALE';
  age: number;
  status: string;
}

export interface Operator {
  id: string;
  name: string;
  role: 'VETERINARIAN' | 'TECHNICIAN' | 'SPECIALIST';
  specialization?: string;
  active: boolean;
} 