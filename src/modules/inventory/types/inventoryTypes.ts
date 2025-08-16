// Enhanced Inventory Types with Image and Barcode Support

export interface InventoryItem {
  id: string;
  itemName: string;
  category: string;
  subCategory: string;
  unitOfMeasure: string;
  packageSize: number;
  modules: string[];
  preferredSupplier: string;
  minLevel: number;
  maxLevel: number;
  shelfLife: number;
  storageConditions: string;
  costPrice: number;
  salePrice?: number;
  barcode: string;
  qrCode?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
  
  // Enhanced Image Support
  images: ItemImage[];
  primaryImageId?: string;
  
  // Enhanced Barcode Support
  barcodeFormat: BarcodeFormat;
  alternativeBarcodes: AlternativeBarcode[];
  
  // Additional Properties
  description?: string;
  specifications?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  tags: string[];
  notes?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface ItemImage {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  thumbnailUrl: string;
  size: number;
  mimeType: string;
  width: number;
  height: number;
  isPrimary: boolean;
  description?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface AlternativeBarcode {
  id: string;
  code: string;
  format: BarcodeFormat;
  type: 'INTERNAL' | 'SUPPLIER' | 'MANUFACTURER' | 'CUSTOM';
  description?: string;
  isActive: boolean;
}

export type BarcodeFormat = 
  | 'CODE128' 
  | 'EAN13' 
  | 'EAN8' 
  | 'QR_CODE' 
  | 'DATA_MATRIX' 
  | 'PDF417' 
  | 'AZTEC' 
  | 'UPC_A' 
  | 'UPC_E'
  | 'CODE39'
  | 'CODE93'
  | 'CODABAR';

export interface PrintableLabel {
  id: string;
  itemId: string;
  templateType: 'STANDARD' | 'COMPACT' | 'DETAILED' | 'CUSTOM';
  dimensions: LabelDimensions;
  content: LabelContent;
  settings: PrintSettings;
}

export interface LabelDimensions {
  width: number;
  height: number;
  unit: 'mm' | 'inch';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface LabelContent {
  includeImage: boolean;
  includeBarcode: boolean;
  includeQRCode: boolean;
  includeName: boolean;
  includeCategory: boolean;
  includePrice: boolean;
  includeExpiry: boolean;
  includeSupplier: boolean;
  customFields: CustomField[];
  layout: 'HORIZONTAL' | 'VERTICAL' | 'GRID';
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
  position: FieldPosition;
  styling: FieldStyling;
}

export interface FieldPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FieldStyling {
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  color: string;
  backgroundColor?: string;
  alignment: 'left' | 'center' | 'right';
}

export interface PrintSettings {
  copies: number;
  paperSize: 'A4' | 'Letter' | 'Label_2x1' | 'Label_4x2' | 'Custom';
  orientation: 'portrait' | 'landscape';
  quality: 'draft' | 'normal' | 'high';
  colorMode: 'color' | 'grayscale' | 'monochrome';
  labelsPerPage: number;
  spacing: {
    horizontal: number;
    vertical: number;
  };
}

export interface ViewSettings {
  viewType: 'LIST' | 'GRID' | 'CARD';
  itemsPerPage: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  filters: InventoryFilter[];
  showImages: boolean;
  showBarcodes: boolean;
  gridColumns: number;
  cardSize: 'small' | 'medium' | 'large';
}

export interface InventoryFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: any;
  secondValue?: any;
}

export interface BarcodeGenerationRequest {
  code: string;
  format: BarcodeFormat;
  width: number;
  height: number;
  includeText: boolean;
  fontSize: number;
  margins: number;
  backgroundColor: string;
  foregroundColor: string;
}

export interface BarcodeGenerationResult {
  success: boolean;
  dataUrl?: string;
  svg?: string;
  error?: string;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface ImageUploadRequest {
  file: File;
  itemId: string;
  description?: string;
  isPrimary?: boolean;
}

export interface ImageUploadResult {
  success: boolean;
  image?: ItemImage;
  error?: string;
}

export interface InventoryBatch {
  id: string;
  itemId: string;
  batchNumber: string;
  lotNumber?: string;
  supplier: string;
  quantityReceived: number;
  quantityInStock: number;
  unitOfMeasure: string;
  receivedDate: string;
  expiryDate?: string;
  daysUntilExpiry?: number;
  status: 'AVAILABLE' | 'LOW' | 'EXPIRED' | 'QUARANTINE' | 'RECALLED';
  costPerUnit: number;
  totalCost: number;
  storageLocationId?: string;
  qcStatus?: 'PENDING' | 'PASSED' | 'FAILED' | 'NOT_REQUIRED';
  qcDate?: string;
  qcNotes?: string;
  images: ItemImage[];
  barcodes: AlternativeBarcode[];
}

export interface StorageLocation {
  id: string;
  locationCode: string;
  name: string;
  type: 'SITE' | 'BUILDING' | 'ROOM' | 'STORAGE_UNIT' | 'SHELF' | 'BIN';
  parentId?: string;
  conditions: string;
  capacity: number;
  currentOccupancy: number;
  temperature?: number;
  humidity?: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'OFFLINE';
  barcode?: string;
  qrCode?: string;
  images: ItemImage[];
}

export interface StockMovement {
  id: string;
  type: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT' | 'TRANSFER' | 'WASTE' | 'CONSUMPTION';
  itemId: string;
  batchId?: string;
  quantity: number;
  unitOfMeasure: string;
  costPerUnit: number;
  totalCost: number;
  reference: string;
  linkedModule?: string;
  linkedProcedure?: string;
  linkedAnimalId?: string;
  fromLocationId?: string;
  toLocationId?: string;
  staffId: string;
  staffName: string;
  movementDate: string;
  notes?: string;
  reason?: string;
  approvedBy?: string;
  isAutomated: boolean;
  images: ItemImage[];
  attachments: DocumentAttachment[];
}

export interface DocumentAttachment {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string;
  description?: string;
}

export interface InventoryAnalytics {
  totalItems: number;
  totalValue: number;
  criticalAlerts: number;
  expiryWarnings: number;
  lowStockItems: number;
  reorderSuggestions: number;
  turnoverRate: number;
  accuracy: number;
  categoryDistribution: CategoryAnalytics[];
  valueDistribution: ValueDistribution[];
  movementTrends: MovementTrend[];
}

export interface CategoryAnalytics {
  category: string;
  itemCount: number;
  totalValue: number;
  percentage: number;
  averageTurnover: number;
  alertCount: number;
}

export interface ValueDistribution {
  range: string;
  itemCount: number;
  totalValue: number;
  percentage: number;
}

export interface MovementTrend {
  date: string;
  stockIn: number;
  stockOut: number;
  adjustments: number;
  value: number;
}

// Export all types
export type {
  InventoryItem,
  ItemImage,
  AlternativeBarcode,
  BarcodeFormat,
  PrintableLabel,
  LabelDimensions,
  LabelContent,
  CustomField,
  FieldPosition,
  FieldStyling,
  PrintSettings,
  ViewSettings,
  InventoryFilter,
  BarcodeGenerationRequest,
  BarcodeGenerationResult,
  ImageUploadRequest,
  ImageUploadResult,
  InventoryBatch,
  StorageLocation,
  StockMovement,
  DocumentAttachment,
  InventoryAnalytics,
  CategoryAnalytics,
  ValueDistribution,
  MovementTrend
}; 