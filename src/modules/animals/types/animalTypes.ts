export interface AnimalRole {
  role: "Donor" | "Recipient" | "Sire" | "LabSample" | "Reference";
  assignedAt: string; // ISO timestamp
  revokedAt?: string; // ISO timestamp
  assignedBy?: string;
  notes?: string;
  isActive: boolean;
}

export interface InternalNumberRecord {
  id: string;
  internalNumber: string;
  assignedAt: string; // ISO timestamp
  endedAt?: string; // ISO timestamp
  assignedBy: string;
  reason: string;
  notes?: string;
  isActive: boolean;
}

export interface AnimalCustomer {
  name: string;
  customerID: string;
  region?: string;
  contactNumber?: string;
  email?: string;
  category?: 'Standard' | 'Premium' | 'VIP' | 'Research';
}

export interface AnimalGenomicData {
  hasSNPData: boolean;
  hasSNPIndex: boolean;
  hasBeadChip: boolean;
  hasParentInfo: boolean;
  missingParents: boolean;
  snpCount: number;
  beadChipId?: string;
  fileSize?: number;
  qualityScore?: number;
  lastUpdated?: string;
}

export interface AnimalActivityData {
  hasUltrasound: boolean;
  hasEmbryoTransfer: boolean;
  hasBreeding: boolean;
  hasLabResults: boolean;
  hasVaccinations: boolean;
  hasPhenotype: boolean;
  hasInternalMedicine: boolean;
  hasFlushing: boolean;
  hasSemenCollection: boolean;
  totalRecords: number;
  lastActivity?: string;
}

export interface AnimalWorkflowData {
  currentWorkflow?: {
    id: string;
    name: string;
    step: string;
    progress: number;
    nextAction: string;
    dueDate?: string;
  };
  activeWorkflows: number;
  completedWorkflows: number;
  lastWorkflowUpdate?: string;
}

export interface Animal {
  id: string;
  animalID: string; // Global permanent ID (SPP-YYYY-XXXX format)
  name: string;
  species: 'BOVINE' | 'EQUINE' | 'CAMEL' | 'OVINE' | 'CAPRINE' | 'SWINE';
  sex: 'MALE' | 'FEMALE';
  age?: number;
  dateOfBirth?: string;
  registrationDate: string;
  
  // Multi-role system (replaces legacy 'type' field)
  roles: AnimalRole[];
  
  // Physical characteristics
  breed?: string;
  color?: string;
  weight?: number;
  height?: number;
  microchip?: string;
  
  // Purpose and classification
  purpose?: 'Breeding' | 'Racing' | 'Dairy' | 'Meat' | 'Show' | 'Research';
  status: 'ACTIVE' | 'INACTIVE' | 'DECEASED' | 'SOLD' | 'TRANSFERRED';
  
  // Lineage information
  fatherName?: string;
  motherName?: string;
  fatherID?: string;
  motherID?: string;
  family?: string;
  
  // Session-based identification
  currentInternalNumber?: {
    id: string;
    internalNumber: string;
    isActive: boolean;
    assignedDate: string;
  };
  internalNumberHistory: InternalNumberRecord[];
  
  // Ownership and location
  owner?: string;
  customer?: AnimalCustomer;
  currentLocation?: string;
  
  // Extended data
  genomicData?: AnimalGenomicData;
  activityData?: AnimalActivityData;
  workflowData?: AnimalWorkflowData;
  
  // Additional fields
  notes?: string;
  images?: string[];
  qrCode?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface AnimalFilterOptions {
  species?: string[];
  roles?: string[];
  status?: string[];
  purpose?: string[];
  hasInternalNumber?: boolean;
  hasActiveWorkflow?: boolean;
  hasGenomicData?: boolean;
  ageRange?: { min: number; max: number };
  dateRange?: { start: string; end: string };
  customer?: string;
  location?: string;
}

export interface AnimalSummaryStats {
  total: number;
  active: number;
  bySpecies: Record<string, number>;
  byRole: Record<string, number>;
  byStatus: Record<string, number>;
  withInternalNumbers: number;
  withActiveWorkflows: number;
  withGenomicData: number;
  recentlyAdded: number;
}

export interface AnimalFormData extends Omit<Animal, 'id' | 'createdAt' | 'updatedAt' | 'roles' | 'internalNumberHistory'> {
  // Form-specific fields for creating/editing
  selectedRoles: string[];
  generateInternalNumber: boolean;
  assignToWorkflow?: string;
} 