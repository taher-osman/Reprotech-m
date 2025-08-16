// Sample Management Types
export type SampleType = 'embryo' | 'oocyte' | 'semen' | 'blood' | 'DNA' | 'fibroblast';
export type CollectionMethod = 'Flushing' | 'OPU' | 'Semen Collection' | 'Blood Draw' | 'Biopsy' | 'Fibroblast Collection';
export type SampleStatus = 'Fresh' | 'Used' | 'Assigned' | 'In Transfer' | 'Research' | 'Assigned to Biobank' | 'Discarded' | 'Ready' | 'Partially Used' | 'In Fertilization' | 'Fertilization Complete';
export type GeneticStatus = 'Untested' | 'Normal' | 'Carrier' | 'Mutant' | 'Inconclusive';

// Fertilization-specific types
export type FertilizationType = 'IVF' | 'ICSI' | 'SCNT';
export type CleavageStatus = 'YES' | 'NO' | 'PENDING';
export type BlastocystDay = 'D5' | 'D6';
export type FailureReason = 'No fertilization' | 'Arrest at cleavage' | 'Arrest at morula' | 'Arrest at blastocyst' | 'Degeneration' | 'Other';

export interface Sample {
  id: string;
  sample_id: string; // Auto-generated unique ID (e.g., SMPL-2025-0001)
  animal_id: string;
  animal_name?: string; // For display purposes
  animalInternalNumber?: string; // Internal animal number for display
  sample_type: SampleType;
  collection_method: CollectionMethod;
  collection_date: string;
  parent_event_id?: string; // FK to Flushing/OPU/Semen event
  status: SampleStatus;
  location: string; // Tank name, lab, field location, etc.
  research_flag: boolean;
  linked_transfer_id?: string; // ET session using this sample
  genetic_status: GeneticStatus;
  quality_score?: number; // 1-10 scale
  morphology_grade?: string; // A, B, C, D or 1-4
  cell_count?: number; // For embryos/oocytes
  volume_ml?: number; // For semen/blood
  concentration?: number; // Sperm concentration or cell concentration
  motility_percentage?: number; // For semen samples
  viability_percentage?: number; // General viability
  storage_temperature?: number; // °C
  container_type?: string; // Straw, vial, tube, etc.
  created_by: string;
  created_at: string;
  updated_at: string;
  notes?: string;

  // Fertilization-specific fields
  fertilizationType?: FertilizationType;
  parentOocyteId?: string;
  parentSemenId?: string;
  parentFibroblastId?: string;
  fertilizationSessionId?: string; // Link to fertilization session
  cleavageStatus?: CleavageStatus;
  cleavageDate?: string;
  blastocystDay?: BlastocystDay;
  blastocystGrade?: string; // AA, AB, BA, BB, etc.
  fertilizationDate?: string;
  failureReason?: FailureReason;
  technician?: string; // Fertilization technician
  targetEmbryoCount?: number; // Expected number of embryos
  actualEmbryoCount?: number; // Actual number created
  fertilizationNotes?: string; // Specific fertilization notes
}

export interface SampleFilters {
  searchTerm: string;
  sampleType: SampleType | '';
  status: SampleStatus | '';
  dateFrom: string;
  dateTo: string;
  location: string;
  researchOnly: boolean;
  geneticStatus: GeneticStatus | '';
  fertilizationType: FertilizationType | '';
  cleavageStatus: CleavageStatus | '';
}

export interface SampleStats {
  totalSamples: number;
  freshSamples: number;
  biobankSamples: number;
  usedSamples: number;
  researchSamples: number;
  byType: Record<SampleType, number>;
  byStatus: Record<SampleStatus, number>;
  byFertilizationType?: Record<FertilizationType, number>;
}

export interface Animal {
  id: string;
  name: string;
  internalNumber: string;
  species: string;
  sex: 'MALE' | 'FEMALE';
}

export interface BulkAction {
  type: 'freeze' | 'assign' | 'research' | 'delete' | 'export' | 'fertilize';
  selectedIds: string[];
  targetStatus?: SampleStatus;
  targetLocation?: string;
  fertilizationType?: FertilizationType;
  notes?: string;
}

export interface SampleFormData {
  animal_id: string;
  sample_type: SampleType;
  collection_method: CollectionMethod;
  collection_date: string;
  status: SampleStatus;
  location: string;
  research_flag: boolean;
  genetic_status: GeneticStatus;
  quality_score?: number;
  morphology_grade?: string;
  cell_count?: number;
  volume_ml?: number;
  concentration?: number;
  motility_percentage?: number;
  viability_percentage?: number;
  storage_temperature?: number;
  container_type?: string;
  notes?: string;
  
  // Fertilization fields for form
  fertilizationType?: FertilizationType;
  parentOocyteId?: string;
  parentSemenId?: string;
  parentFibroblastId?: string;
  cleavageStatus?: CleavageStatus;
  cleavageDate?: string;
  blastocystDay?: BlastocystDay;
  blastocystGrade?: string;
  fertilizationDate?: string;
  failureReason?: FailureReason;
  technician?: string;
  fertilizationNotes?: string;
}

// Constants for dropdowns and validation
export const SAMPLE_TYPES: SampleType[] = ['embryo', 'oocyte', 'semen', 'blood', 'DNA', 'fibroblast'];
export const COLLECTION_METHODS: CollectionMethod[] = ['Flushing', 'OPU', 'Semen Collection', 'Blood Draw', 'Biopsy', 'Fibroblast Collection'];
export const SAMPLE_STATUSES: SampleStatus[] = ['Fresh', 'Used', 'Assigned', 'In Transfer', 'Research', 'Assigned to Biobank', 'Discarded', 'Ready', 'Partially Used', 'In Fertilization', 'Fertilization Complete'];
export const GENETIC_STATUSES: GeneticStatus[] = ['Untested', 'Normal', 'Carrier', 'Mutant', 'Inconclusive'];

// Fertilization constants
export const FERTILIZATION_TYPES: FertilizationType[] = ['IVF', 'ICSI', 'SCNT'];
export const CLEAVAGE_STATUSES: CleavageStatus[] = ['YES', 'NO', 'PENDING'];
export const BLASTOCYST_DAYS: BlastocystDay[] = ['D5', 'D6'];
export const FAILURE_REASONS: FailureReason[] = [
  'No fertilization', 
  'Arrest at cleavage', 
  'Arrest at morula', 
  'Arrest at blastocyst', 
  'Degeneration', 
  'Other'
];

export const BLASTOCYST_GRADES = [
  'AA', 'AB', 'BA', 'BB', 'AC', 'CA', 'CC', 'BC', 'CB'
];

export const CONTAINER_TYPES = [
  '0.25ml Straw',
  '0.5ml Straw',
  '1ml Vial',
  '2ml Vial',
  '5ml Tube',
  '15ml Tube',
  '50ml Tube',
  'Cryovial',
  'Custom'
];

export const STORAGE_LOCATIONS = [
  'Lab Processing Area',
  'Temporary Storage',
  'Quality Control Lab',
  'Research Lab',
  'Field Collection Unit',
  'Sample Prep Station',
  'Awaiting Processing',
  'Fertilization Lab',
  'Incubation Chamber',
  'Custom'
]; 