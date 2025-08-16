// Embryo Detail Module Types
export interface EmbryoRecord {
  id: string;
  embryoId: string; // Unique identifier (e.g., EMB-2024-001)
  
  // OPU Integration
  opuSessionId?: string;
  sourceOocyteId?: string;
  collectionDate: string;
  
  // Basic Information
  donorId: string;
  donorName: string;
  sireId?: string;
  sireName?: string;
  species: 'BOVINE' | 'EQUINE' | 'OVINE' | 'CAPRINE' | 'CAMEL' | 'OTHER';
  breed?: string;
  
  // Development Information
  currentStage: EmbryoDevelopmentStage;
  developmentDay: number; // Days post-fertilization
  fertilizationDate: string;
  fertilizationMethod: FertilizationMethod;
  
  // Quality Assessment
  qualityGrade: EmbryoQualityGrade;
  morphologyScore: number; // 1-10 scale
  viabilityScore: number; // 1-10 scale
  developmentRate: DevelopmentRate;
  
  // Physical Characteristics
  diameter?: number; // micrometers
  cellCount?: number;
  fragmentationLevel: FragmentationLevel;
  zonaPellucidaThickness?: number;
  
  // Culture Information
  cultureMedia: string;
  cultureConditions: CultureConditions;
  incubatorId?: string;
  cultureStartDate: string;
  
  // Genetic Information
  geneticTesting?: GeneticTestingData;
  chromosome?: ChromosomeData;
  parentalGenetics?: ParentalGeneticsData;
  
  // Storage & Location
  currentLocation: StorageLocation;
  storageConditions: StorageConditions;
  freezingProtocol?: FreezingProtocol;
  storageDate?: string;
  
  // Transfer Information
  transferEligible: boolean;
  transferDate?: string;
  recipientId?: string;
  transferOutcome?: TransferOutcome;
  
  // Research & Additional Data
  researchStudyId?: string;
  biopsy?: BiopsyData;
  imageFiles?: EmbryoImageData[];
  notes: string;
  
  // Metadata
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  status: EmbryoStatus;
}

export type EmbryoDevelopmentStage = 
  | 'FERTILIZED_OOCYTE'     // Day 0-1
  | 'CLEAVAGE_2_CELL'       // Day 1-2
  | 'CLEAVAGE_4_CELL'       // Day 2-3
  | 'CLEAVAGE_8_CELL'       // Day 3-4
  | 'MORULA'                // Day 4-5
  | 'EARLY_BLASTOCYST'      // Day 5-6
  | 'BLASTOCYST'            // Day 6-7
  | 'EXPANDED_BLASTOCYST'   // Day 7-8
  | 'HATCHING_BLASTOCYST'   // Day 8-9
  | 'HATCHED_BLASTOCYST'    // Day 9+
  | 'DEGENERATED'
  | 'ARRESTED';

export type FertilizationMethod = 
  | 'IVF' | 'ICSI' | 'IVM_IVF' | 'NATURAL' | 'AI_DERIVED';

export type EmbryoQualityGrade = 
  | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'DEGENERATED';

export type DevelopmentRate = 
  | 'FAST' | 'NORMAL' | 'SLOW' | 'ARRESTED';

export type FragmentationLevel = 
  | 'NONE' | 'MINIMAL' | 'MODERATE' | 'SEVERE';

export type EmbryoStatus = 
  | 'IN_CULTURE' | 'FROZEN' | 'TRANSFERRED' | 'DISCARDED' | 'RESEARCH';

export interface CultureConditions {
  temperature: number; // Celsius
  co2Percentage: number;
  o2Percentage?: number;
  humidity: number;
  osmolality?: number;
  phLevel?: number;
}

export interface GeneticTestingData {
  pgtaPerformed: boolean;
  pgtaResult?: 'EUPLOID' | 'ANEUPLOID' | 'MOSAIC' | 'NO_RESULT';
  pgtmPerformed: boolean;
  pgtmResult?: string;
  testingDate?: string;
  testingLab?: string;
  rawData?: string;
}

export interface ChromosomeData {
  karyotype?: string;
  chromosomeCount?: number;
  abnormalities?: string[];
}

export interface ParentalGeneticsData {
  donorGenetics?: string;
  sireGenetics?: string;
  expectedInheritance?: string;
  riskFactors?: string[];
}

export interface StorageLocation {
  facility: string;
  building?: string;
  room?: string;
  tank?: string;
  cane?: string;
  position?: string;
  coordinates?: string;
}

export interface StorageConditions {
  temperature: number;
  storageType: 'LIQUID_NITROGEN' | 'VAPOR_PHASE' | 'FRESH' | 'VITRIFICATION';
  cryoprotectant?: string;
  freezingRate?: number;
  containerType?: string;
}

export interface FreezingProtocol {
  protocolName: string;
  cryoprotectant: string;
  equilibrationTime: number; // minutes
  freezingRate: number; // degrees/minute
  finalTemperature: number;
  vitrification: boolean;
}

export interface TransferOutcome {
  result: 'POSITIVE' | 'NEGATIVE' | 'UNKNOWN';
  pregnancyConfirmed?: boolean;
  pregnancyDay?: number;
  heartbeatDetected?: boolean;
  complications?: string;
}

export interface BiopsyData {
  biopsyPerformed: boolean;
  biopsyDate?: string;
  cellsRemoved?: number;
  biopsyPurpose?: 'PGT' | 'RESEARCH' | 'OTHER';
  biopsyResults?: string;
}

export interface EmbryoImageData {
  id: string;
  filename: string;
  captureDate: string;
  captureTime: string;
  developmentDay: number;
  imageType: 'BRIGHTFIELD' | 'PHASE_CONTRAST' | 'FLUORESCENCE' | 'TIME_LAPSE';
  magnification?: string;
  notes?: string;
  url: string;
}

// Form Data Types
export interface EmbryoFormData {
  // Basic Information
  donorId: string;
  sireId?: string;
  species: string;
  breed?: string;
  
  // Development
  fertilizationDate: string;
  fertilizationMethod: string;
  currentStage: string;
  
  // Quality
  qualityGrade: string;
  morphologyScore: number;
  viabilityScore: number;
  developmentRate: string;
  fragmentationLevel: string;
  
  // Physical
  diameter?: number;
  cellCount?: number;
  zonaPellucidaThickness?: number;
  
  // Culture
  cultureMedia: string;
  temperature: number;
  co2Percentage: number;
  humidity: number;
  incubatorId?: string;
  
  // Storage
  facility: string;
  storageType: string;
  temperature_storage: number;
  
  // Additional
  transferEligible: boolean;
  researchStudyId?: string;
  notes: string;
}

// Analytics Types
export interface EmbryoAnalytics {
  totalEmbryos: number;
  byStage: Record<EmbryoDevelopmentStage, number>;
  byQuality: Record<EmbryoQualityGrade, number>;
  byStatus: Record<EmbryoStatus, number>;
  transferSuccess: {
    total: number;
    successful: number;
    rate: number;
  };
  developmentRates: {
    blastocystRate: number;
    utilizationRate: number;
    cryosurvivalRate: number;
  };
}

export interface EmbryoDashboardStats {
  activeCultures: number;
  frozenEmbryos: number;
  transfersToday: number;
  successRate: number;
  avgDevelopmentTime: number;
  qualityDistribution: Record<EmbryoQualityGrade, number>;
}

// Filter Types
export interface EmbryoFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  species?: string[];
  stages?: EmbryoDevelopmentStage[];
  qualityGrades?: EmbryoQualityGrade[];
  status?: EmbryoStatus[];
  donorId?: string;
  transferEligible?: boolean;
  location?: string;
}

// Constants
export const DEVELOPMENT_STAGES: EmbryoDevelopmentStage[] = [
  'FERTILIZED_OOCYTE',
  'CLEAVAGE_2_CELL',
  'CLEAVAGE_4_CELL',
  'CLEAVAGE_8_CELL',
  'MORULA',
  'EARLY_BLASTOCYST',
  'BLASTOCYST',
  'EXPANDED_BLASTOCYST',
  'HATCHING_BLASTOCYST',
  'HATCHED_BLASTOCYST',
  'DEGENERATED',
  'ARRESTED'
];

export const QUALITY_GRADES: EmbryoQualityGrade[] = [
  'EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'DEGENERATED'
];

export const FERTILIZATION_METHODS: FertilizationMethod[] = [
  'IVF', 'ICSI', 'IVM_IVF', 'NATURAL', 'AI_DERIVED'
];

export const STORAGE_TYPES = [
  'LIQUID_NITROGEN', 'VAPOR_PHASE', 'FRESH', 'VITRIFICATION'
];

export const CULTURE_MEDIA = [
  'G-1 PLUS', 'G-2 PLUS', 'Cleavage Medium', 'Blastocyst Medium',
  'Global Medium', 'Sage 1-Step', 'Custom Medium'
]; 