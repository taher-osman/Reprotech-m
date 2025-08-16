// Media Preparation Module Types

export interface MediaFormula {
  id: string;
  media_id: string;
  media_name: string;
  name: string;
  description: string;
  media_type: MediaType;
  application: ApplicationType;
  category: MediaCategory;
  version: string;
  default_volume: number;
  status: MediaStatus;
  sopReference?: string;
  media_sop_id?: string;
  preparationTime: number;
  shelfLife: number;
  storageConditions: StorageConditions;
  phTarget: {
    min: number;
    max: number;
  };
  osmolarityTarget: {
    min: number;
    max: number;
  };
  isActive: boolean;
  is_base_media: boolean;
  createdBy: string;
  created_by: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
  approved_by?: string;
  approved_at?: Date;
  notes?: string;
  ingredients: MediaFormulaIngredient[];
  linkedIngredients: LinkedIngredient[];
  estimatedCost: number;
  qualityScore?: number;
  usageCount?: number;
  lastUsed?: Date;
}

export interface LinkedIngredient {
  id: string;
  mediaFormulaId: string;
  inventory_item_id: string;
  chemical_name: string;
  concentration: number;
  unit: ConcentrationUnit;
  amount: number;
  molecular_weight?: number;
  density?: number;
  purity: number;
  hazard_class: HazardClass;
  isCritical: boolean;
  order: number;
  notes?: string;
  costContribution?: number;
  stockSufficient?: boolean;
  compatibilityWarnings?: string[];
  inventoryItem?: InventoryChemical;
}

export interface MediaFormulaIngredient {
  id: string;
  mediaFormulaId: string;
  inventoryItemId: string;
  concentration: number;
  unit: ConcentrationUnit;
  isCritical: boolean;
  order: number;
  notes?: string;
  inventoryItem?: InventoryItem;
}

export interface MediaBatch {
  id: string;
  batchNumber: string;
  mediaFormulaId: string;
  preparedBy: string;
  preparedAt: Date;
  expiryDate: Date;
  batchSize: number;
  unit: VolumeUnit;
  status: BatchStatus;
  storageLocation?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  mediaFormula?: MediaFormula;
  ingredients: MediaBatchIngredient[];
  qualityControl?: MediaQualityControl;
  usageRecords: MediaUsage[];
  totalCost: number;
}

export interface MediaBatchIngredient {
  id: string;
  mediaBatchId: string;
  inventoryItemId: string;
  lotNumber: string;
  quantityUsed: number;
  unit: string;
  expiryDate: Date;
  cost: number;
  inventoryItem?: InventoryItem;
}

export interface MediaQualityControl {
  id: string;
  mediaBatchId: string;
  testedBy: string;
  testedAt: Date;
  phValue?: number;
  osmolarityValue?: number;
  clarity: ClarityLevel;
  sterilityTest: TestResult;
  appearance: AppearanceStatus;
  notes?: string;
  overallResult: TestResult;
  approvedBy?: string;
  approvedAt?: Date;
  mediaBatch?: MediaBatch;
}

export interface MediaUsage {
  id: string;
  mediaBatchId: string;
  procedureType: ProcedureType;
  procedureId?: string;
  usedAt: Date;
  quantityUsed: number;
  unit: VolumeUnit;
  technicianId: string;
  outcome: UsageOutcome;
  notes?: string;
  mediaBatch?: MediaBatch;
}

export interface MediaPerformanceMetrics {
  id: string;
  mediaBatchId: string;
  procedureType: ProcedureType;
  fertilizationRate?: number;
  cleavageRate?: number;
  blastocystRate?: number;
  embryoQuality?: number;
  pregnancyRate?: number;
  dataSource: string;
  recordedAt: Date;
  mediaBatch?: MediaBatch;
}

export interface MediaSOP {
  id: string;
  mediaFormulaId: string;
  title: string;
  version: string;
  content: string;
  validationChecklist: ValidationChecklistItem[];
  safetyNotes?: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string;
  updatedAt: Date;
  mediaFormula?: MediaFormula;
}

export interface ValidationChecklistItem {
  id: string;
  step: string;
  isRequired: boolean;
  description: string;
}

// Supporting Types
export type MediaCategory = 'IVF' | 'ICSI' | 'SCNT' | 'Semen Processing' | 'Research' | 'General';

export type MediaType = 'Culture Medium' | 'Washing Medium' | 'Fertilization Medium' | 'Maturation Medium' | 'Capacitation Medium' | 'Freezing Medium' | 'Buffer Solution' | 'Stock Solution';

export type ApplicationType = 'Oocyte Collection' | 'Sperm Preparation' | 'IVF/ICSI' | 'Embryo Culture' | 'Embryo Transfer' | 'Cryopreservation' | 'Research' | 'Quality Control';

export type MediaStatus = 'Draft' | 'Under Review' | 'Approved' | 'Active' | 'Deprecated' | 'Discontinued';

export type HazardClass = 'Safe' | 'Irritant' | 'Corrosive' | 'Toxic' | 'Flammable' | 'Oxidizer';

export type ConcentrationUnit = 'mg/L' | 'mM' | 'μM' | '%' | 'μL/mL' | 'mL/L' | 'g/L' | 'mg/mL' | 'μg/mL' | 'units/mL';

export type VolumeUnit = 'mL' | 'L' | 'μL';

export type BatchStatus = 'Preparing' | 'QC_Pending' | 'QC_Passed' | 'QC_Failed' | 'Released' | 'Expired' | 'Discarded';

export type ClarityLevel = 'Clear' | 'Slightly Cloudy' | 'Cloudy';

export type TestResult = 'Pass' | 'Fail' | 'Pending';

export type AppearanceStatus = 'Normal' | 'Abnormal';

export type ProcedureType = 'IVF' | 'ICSI' | 'SCNT' | 'Semen Processing' | 'Embryo Culture' | 'Research';

export type UsageOutcome = 'Success' | 'Partial' | 'Failed';

export interface StorageConditions {
  temperature: {
    min: number;
    max: number;
    unit: 'Celsius' | 'Fahrenheit';
  };
  lightSensitive: boolean;
  humidity?: {
    min: number;
    max: number;
  };
  specialConditions?: string;
}

// Inventory Integration Types
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  expiryDate?: Date;
  lotNumber?: string;
  cost: number;
  isAvailable: boolean;
}

// NEW: Enhanced Inventory Chemical for media preparation
export interface InventoryChemical {
  item_id: string;
  name: string;
  cas_no: string;
  molecular_weight: number;
  density?: number;
  stock_concentration?: number;
  available_quantity: number;
  hazard_class: HazardClass;
  unit: string;
  purity: number;
  storage_temp: string;
  supplier: string;
  lot_number: string;
  expiry_date: string;
  cost_per_unit: number;
  is_available: boolean;
  category: 'Buffer' | 'Salt' | 'Sugar' | 'Protein' | 'Vitamin' | 'Hormone' | 'Antibiotic' | 'Indicator' | 'Growth Factor';
  sub_category: string;
  specifications: string;
  solubility: string;
  ph_range?: string;
  osmolarity_contribution?: number;
}

// NEW: Formula validation interface
export interface FormulaValidationResult {
  isValid: boolean;
  totalCost: number;
  estimatedOsmolarity: number;
  estimatedPH: number;
  stockWarnings: string[];
  compatibilityWarnings: string[];
  hazardWarnings: string[];
  suggestions: string[];
}

// Analytics Types
export interface MediaAnalytics {
  totalFormulas: number;
  activeBatches: number;
  pendingQC: number;
  expiredBatches: number;
  totalUsage: number;
  successRate: number;
  performanceByFormula: FormulaPerformance[];
  performanceByBatch: BatchPerformance[];
  usageTrends: UsageTrend[];
  costAnalysis: CostAnalysis;
}

export interface FormulaPerformance {
  formulaId: string;
  formulaName: string;
  totalBatches: number;
  successRate: number;
  averageCost: number;
  averagePreparationTime: number;
  usageCount: number;
}

export interface BatchPerformance {
  batchId: string;
  batchNumber: string;
  formulaName: string;
  preparationDate: Date;
  successRate: number;
  totalUsage: number;
  cost: number;
}

export interface UsageTrend {
  date: Date;
  totalUsage: number;
  procedureType: ProcedureType;
  successRate: number;
}

export interface CostAnalysis {
  totalCost: number;
  averageCostPerBatch: number;
  costByFormula: { [formulaId: string]: number };
  costByMonth: { [month: string]: number };
}

// API Response Types
export interface MediaFormulaResponse {
  success: boolean;
  data: MediaFormula;
  message?: string;
}

export interface MediaBatchResponse {
  success: boolean;
  data: MediaBatch;
  message?: string;
}

export interface MediaListResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface MediaAnalyticsResponse {
  success: boolean;
  data: MediaAnalytics;
  message?: string;
}

// Form Types
export interface CreateMediaFormulaRequest {
  media_id: string;
  media_name: string;
  name: string;
  description: string;
  media_type: MediaType;
  application: ApplicationType;
  category: MediaCategory;
  version: string;
  default_volume: number;
  sopReference?: string;
  media_sop_id?: string;
  preparationTime: number;
  shelfLife: number;
  storageConditions: StorageConditions;
  phTarget: { min: number; max: number };
  osmolarityTarget: { min: number; max: number };
  is_base_media: boolean;
  notes?: string;
  ingredients: Omit<MediaFormulaIngredient, 'id' | 'mediaFormulaId'>[];
  linkedIngredients: Omit<LinkedIngredient, 'id' | 'mediaFormulaId'>[];
}

export interface CreateMediaBatchRequest {
  mediaFormulaId: string;
  batchSize: number;
  unit: VolumeUnit;
  storageLocation?: string;
  notes?: string;
}

export interface QualityControlRequest {
  mediaBatchId: string;
  phValue?: number;
  osmolarityValue?: number;
  clarity: ClarityLevel;
  sterilityTest: TestResult;
  appearance: AppearanceStatus;
  notes?: string;
}

export interface MediaUsageRequest {
  mediaBatchId: string;
  procedureType: ProcedureType;
  procedureId?: string;
  quantityUsed: number;
  unit: VolumeUnit;
  outcome: UsageOutcome;
  notes?: string;
}

// Filter Types
export interface MediaFormulaFilters {
  category?: MediaCategory;
  media_type?: MediaType;
  application?: ApplicationType;
  status?: MediaStatus;
  isActive?: boolean;
  is_base_media?: boolean;
  search?: string;
  createdBy?: string;
  created_by?: string;
  approved_by?: string;
  hazard_level?: HazardClass;
  cost_range?: { min: number; max: number };
  usage_range?: { min: number; max: number };
}

export interface MediaBatchFilters {
  status?: BatchStatus;
  mediaFormulaId?: string;
  preparedBy?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  search?: string;
}

export interface QualityControlFilters {
  overallResult?: TestResult;
  testedBy?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface UsageFilters {
  procedureType?: ProcedureType;
  outcome?: UsageOutcome;
  technicianId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

// NEW: Export formats for enhanced functionality
export interface ExportOptions {
  format: 'CSV' | 'Excel' | 'PDF' | 'JSON';
  includeIngredients: boolean;
  includeCalculations: boolean;
  includeCosts: boolean;
  includeSOPs: boolean;
}

// NEW: Import validation
export interface ImportValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  duplicates: string[];
  importableCount: number;
  totalCount: number;
}

// STOCK MEDIA SYSTEM TYPES

// Stock Media Status enum
export type StockMediaStatus = 
  | 'Available' 
  | 'Used' 
  | 'Expired' 
  | 'Discarded';

// QC Status enum
export type QCStatus = 
  | 'Passed' 
  | 'Failed' 
  | 'Pending' 
  | 'N/A';

// Ingredient Type enum
export type IngredientType = 'chemical' | 'media';

// Storage Location Structure
export interface StorageLocation {
  compartment: string; // e.g., "Freezer A"
  rack?: string; // e.g., "Rack 1"
  box?: string; // e.g., "Box 3"
  position?: string; // e.g., "Position A1"
  temperature?: number;
  full_location: string; // e.g., "Freezer A > Rack 1 > Box 3 > Position A1"
}

// Main Stock Media Entity
export interface StockMedia {
  stock_media_id: string;
  media_id: string; // Links to Media Master
  batch_id: string; // Links to MediaCreation Table
  prepared_volume: number;
  remaining_volume: number;
  status: StockMediaStatus;
  storage_location: StorageLocation;
  expiration_date: Date;
  prepared_date: Date;
  prepared_by: string;
  qc_status: QCStatus;
  notes?: string;
  is_base_media: boolean;
  is_aliquoted: boolean;
  aliquot_details?: AliquotDetails;
  barcode?: string;
  qr_code?: string;
  media_formula?: MediaFormula;
  usage_history: MediaUsageLog[];
  created_at: Date;
  updated_at: Date;
}

// Aliquot Details for subdivided batches
export interface AliquotDetails {
  total_aliquots: number;
  volume_per_aliquot: number;
  unit: VolumeUnit;
  container_type: string; // e.g., "5 mL vials", "15 mL tubes"
  used_aliquots: number;
  remaining_aliquots: number;
}

// Media Usage Logging System
export interface MediaUsageLog {
  usage_id: string;
  linked_stock_media_id: string;
  used_in_batch_id: string;
  volume_used: number;
  unit: VolumeUnit;
  date_used: Date;
  used_by: string;
  purpose: string; // e.g., "Ingredient in IVF Medium Batch MED-20241204-001"
  linked_batch_details?: MediaBatchCreation;
  created_at: Date;
}

// Enhanced Media Batch Creation for Stock Integration
export interface MediaBatchCreation {
  batch_id: string;
  media_id: string;
  batch_volume: number;
  unit: string;
  prepared_by: string;
  preparation_date: string;
  status: BatchStatus;
  notes: string;
  is_base_media: boolean;
  formula?: MediaFormula;
  ingredients: BatchIngredient[];
  media_ingredients: StockMediaIngredient[]; // NEW: For stock media ingredients
  total_cost: number;
  estimated_ph?: number;
  estimated_osmolarity?: number;
  estimated_stability_days?: number;
}

// Stock Media as Ingredient
export interface StockMediaIngredient {
  stock_media_id: string;
  media_name: string;
  volume_required: number;
  volume_available: number;
  unit: VolumeUnit;
  expiration_date: Date;
  qc_status: QCStatus;
  storage_location: string;
  sufficient_stock: boolean;
  is_expired: boolean;
  cost_per_ml: number;
  total_cost: number;
  stock_media?: StockMedia;
}

// Enhanced BatchIngredient with ingredient type
export interface BatchIngredient {
  ingredient_type: IngredientType;
  // For chemical ingredients
  chemical_name?: string;
  inventory_item_id?: string;
  amount_required?: number;
  unit?: string;
  stock_available?: number;
  unit_cost?: number;
  total_cost: number;
  hazard_class?: HazardClass;
  sufficient_stock: boolean;
  molecular_weight?: number;
  cas_no?: string;
  supplier?: string;
  lot_number?: string;
  expiry_date?: string;
  // For media ingredients
  stock_media_id?: string;
  media_name?: string;
  volume_required?: number;
  volume_available?: number;
  qc_status?: QCStatus;
  storage_location?: string;
  is_expired?: boolean;
}

// Storage Management
export interface StorageCompartment {
  id: string;
  name: string;
  type: 'Freezer' | 'Fridge' | 'Room Temperature' | 'Incubator';
  temperature: number;
  capacity: number;
  current_usage: number;
  racks: StorageRack[];
}

export interface StorageRack {
  id: string;
  compartment_id: string;
  name: string;
  boxes: StorageBox[];
}

export interface StorageBox {
  id: string;
  rack_id: string;
  name: string;
  positions: StoragePosition[];
}

export interface StoragePosition {
  id: string;
  box_id: string;
  position: string; // e.g., "A1", "B3"
  is_occupied: boolean;
  stock_media_id?: string;
}

// Traceability and Reporting
export interface StockMediaTraceability {
  stock_media_id: string;
  media_name: string;
  batch_chain: TraceabilityNode[];
  downstream_usage: TraceabilityNode[];
  quality_chain: QCTraceability[];
  total_usage_volume: number;
  creation_cost: number;
  cost_per_ml: number;
}

export interface TraceabilityNode {
  batch_id: string;
  batch_type: 'source' | 'destination';
  media_name: string;
  volume: number;
  date: Date;
  technician: string;
  purpose: string;
}

export interface QCTraceability {
  qc_date: Date;
  qc_technician: string;
  qc_result: QCStatus;
  qc_notes?: string;
  parameters_tested: string[];
}

// Export and Reporting Types
export interface UsageCertificate {
  stock_media_id: string;
  media_name: string;
  batch_details: StockMedia;
  usage_summary: UsageSummary;
  qc_history: QCTraceability[];
  downstream_batches: TraceabilityNode[];
  generated_by: string;
  generated_at: Date;
}

export interface UsageSummary {
  total_prepared: number;
  total_used: number;
  remaining: number;
  usage_efficiency: number;
  number_of_batches_created: number;
  average_volume_per_batch: number;
}

// Filters for Stock Media
export interface StockMediaFilters {
  media_type?: MediaType;
  status?: StockMediaStatus;
  qc_status?: QCStatus;
  expiration_status?: 'Active' | 'Near Expiry' | 'Expired';
  storage_compartment?: string;
  is_base_media?: boolean;
  prepared_by?: string;
  date_range?: {
    start: Date;
    end: Date;
  };
  search?: string;
  volume_range?: {
    min: number;
    max: number;
  };
}

// API Response Types for Stock Media
export interface StockMediaResponse {
  success: boolean;
  data: StockMedia;
  message?: string;
}

export interface StockMediaListResponse {
  success: boolean;
  data: StockMedia[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface UsageLogResponse {
  success: boolean;
  data: MediaUsageLog[];
  message?: string;
}

// Batch Split Operation
export interface BatchSplitRequest {
  source_stock_media_id: string;
  split_operations: SplitOperation[];
  reason: string;
  performed_by: string;
}

export interface SplitOperation {
  volume: number;
  new_storage_location: StorageLocation;
  aliquot_details?: AliquotDetails;
  notes?: string;
}

export interface BatchSplitResult {
  success: boolean;
  original_batch: StockMedia;
  new_batches: StockMedia[];
  message?: string;
} 