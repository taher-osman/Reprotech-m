import { Sample, SampleType, FertilizationType, CleavageStatus, BlastocystDay, FailureReason } from '../../sample-management/types/sampleTypes';

// Fertilization Session Types
export interface FertilizationSession {
  id: string;
  sessionId: string; // Auto-generated session ID (e.g., FERT-2025-0001)
  fertilizationType: FertilizationType;
  fertilizationDate: string;
  technician: string;
  recipientLab: string;
  targetEmbryoCount: number;
  actualEmbryoCount?: number;
  status: FertilizationSessionStatus;
  notes?: string;
  
  // Sample selections
  selectedOocytes: SelectedSample[];
  selectedSemen?: SelectedSample[];
  selectedFibroblasts?: SelectedSample[];
  
  // Development tracking
  cleavageObserved: boolean;
  cleavageDate?: string;
  blastocystStage: boolean;
  blastocystDay?: BlastocystDay;
  blastocystGrade?: string;
  failureReason?: FailureReason;
  
  // Generated embryos
  generatedEmbryos: GeneratedEmbryo[];
  
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type FertilizationSessionStatus = 
  | 'Setup' 
  | 'In Progress' 
  | 'Development Tracking' 
  | 'Embryos Generated' 
  | 'Completed' 
  | 'Failed';

export interface SelectedSample {
  sampleId: string;
  sampleType: SampleType;
  animalId: string;
  quality?: string;
  volume?: number;
  concentration?: number;
  motility?: number;
  collectionDate: string;
  notes?: string;
}

export interface GeneratedEmbryo {
  id: string;
  embryoId: string; // Auto-generated embryo ID
  sessionId: string;
  parentOocyteId: string;
  parentSemenId?: string;
  parentFibroblastId?: string;
  quality: number;
  morphologyGrade: string;
  cellCount: number;
  developmentStage: EmbryoDevelopmentStage;
  status: EmbryoStatus;
  notes?: string;
}

export type EmbryoDevelopmentStage = 
  | 'Fertilized' 
  | 'Cleavage' 
  | 'Morula' 
  | 'Early Blastocyst' 
  | 'Blastocyst' 
  | 'Hatched Blastocyst' 
  | 'Arrested';

export type EmbryoStatus = 
  | 'Fresh' 
  | 'Ready for Transfer' 
  | 'Ready for Freezing' 
  | 'Assigned' 
  | 'Used' 
  | 'Discarded';

// Fertilization Setup Form Data
export interface FertilizationSetupData {
  fertilizationType: FertilizationType;
  fertilizationDate: string;
  technician: string;
  recipientLab: string;
  targetEmbryoCount: number;
  selectedOocyteIds: string[];
  selectedSemenIds?: string[];
  selectedFibroblastIds?: string[];
  notes?: string;
}

// Development Tracking Form Data
export interface DevelopmentTrackingData {
  sessionId: string;
  cleavageObserved: boolean;
  cleavageDate?: string;
  blastocystStage: boolean;
  blastocystDay?: BlastocystDay;
  blastocystGrade?: string;
  failureReason?: FailureReason;
  notes?: string;
}

// Embryo Generation Data
export interface EmbryoGenerationData {
  sessionId: string;
  embryos: {
    parentOocyteId: string;
    parentSemenId?: string;
    parentFibroblastId?: string;
    quality: number;
    morphologyGrade: string;
    cellCount: number;
    developmentStage: EmbryoDevelopmentStage;
    notes?: string;
  }[];
}

// Sample Selection Filters
export interface SampleSelectionFilters {
  type?: string;
  status?: string;
  quality?: string;
  animalId?: string;
  collectionDate?: string;
  search?: string;
}

// Fertilization Statistics
export interface FertilizationStats {
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  totalEmbryosGenerated: number;
  successRate: number; // percentage
  byType: Record<FertilizationType, {
    sessions: number;
    embryos: number;
    successRate: number;
  }>;
  byTechnician: Record<string, {
    sessions: number;
    embryos: number;
    successRate: number;
  }>;
}

// Summary Table Data
export interface EmbryoSummary {
  totalOocytes: number;
  totalEmbryos: number;
  cleavageRate: number; // percentage
  blastocystRate: number; // percentage
  gradeDistribution: Record<string, number>;
  developmentStages: Record<EmbryoDevelopmentStage, number>;
}

// Laboratory and Technician Data
export interface Laboratory {
  id: string;
  name: string;
  location: string;
  capacity: number;
  equipment: string[];
  available: boolean;
}

export interface Technician {
  id: string;
  name: string;
  specialization: string[];
  experience: string;
  available: boolean;
}

// Workflow Integration
export interface WorkflowStatusUpdate {
  sessionId: string;
  workflowId?: string;
  status: 'Embryos Created' | 'Ready for Transfer' | 'Ready for Freezing';
  nextSteps: string[];
}

// Export/Import Data
export interface FertilizationExportData {
  sessions: FertilizationSession[];
  embryos: GeneratedEmbryo[];
  statistics: FertilizationStats;
  exportDate: string;
  exportedBy: string;
}

// Constants
export const FERTILIZATION_SESSION_STATUSES: FertilizationSessionStatus[] = [
  'Setup',
  'In Progress', 
  'Development Tracking',
  'Embryos Generated',
  'Completed',
  'Failed'
];

export const EMBRYO_DEVELOPMENT_STAGES: EmbryoDevelopmentStage[] = [
  'Fertilized',
  'Cleavage',
  'Morula',
  'Early Blastocyst',
  'Blastocyst',
  'Hatched Blastocyst',
  'Arrested'
];

export const EMBRYO_STATUSES: EmbryoStatus[] = [
  'Fresh',
  'Ready for Transfer',
  'Ready for Freezing',
  'Assigned',
  'Used',
  'Discarded'
];

export const DEVELOPMENT_STAGES_ORDER = {
  'Fertilized': 1,
  'Cleavage': 2,
  'Morula': 3,
  'Early Blastocyst': 4,
  'Blastocyst': 5,
  'Hatched Blastocyst': 6,
  'Arrested': 0
};

// Validation rules
export const FERTILIZATION_VALIDATION = {
  MIN_OOCYTES_IVF: 1,
  MIN_OOCYTES_ICSI: 1,
  MIN_OOCYTES_SCNT: 1,
  MAX_OOCYTES_PER_SESSION: 50,
  MIN_QUALITY_SCORE: 1,
  MAX_QUALITY_SCORE: 10,
  REQUIRED_FIELDS: {
    IVF: ['oocytes', 'semen'],
    ICSI: ['oocytes', 'semen'],
    SCNT: ['oocytes', 'fibroblasts']
  }
}; 