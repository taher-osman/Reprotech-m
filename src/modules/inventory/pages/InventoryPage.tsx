import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Package2, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Clock, 
  Settings, 
  Plus, 
  Search, 
  Filter,
  MapPin,
  Thermometer,
  BarChart3,
  ShoppingCart,
  Eye,
  Edit,
  Trash2,
  Download,
  ScanLine,
  Image as ImageIcon,
  QrCode,
  Printer,
  Grid,
  List,
  Camera
} from 'lucide-react';
import { StockBatchForm } from '../components/StockBatchForm';
import { StockMovementForm } from '../components/StockMovementForm';
import { ItemForm } from '../components/ItemForm';
import { LocationForm } from '../components/LocationForm';
import InventoryItemGrid from '../components/InventoryItemGrid';
import BarcodeScanner from '../components/BarcodeScanner';
import { ItemDetailView } from '../components/ItemDetailView';
import { BarcodeFormat } from '../types/inventoryTypes';
import { barcodeGenerationService } from '../services/barcodeGenerationService';
import { imageManagementService } from '../services/imageManagementService';
import { printableLabelService } from '../services/printableLabelService';

// Types
interface InventoryItem {
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
  createdAt: string;
  
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
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

interface ItemImage {
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

interface AlternativeBarcode {
  id: string;
  code: string;
  format: BarcodeFormat;
  type: 'INTERNAL' | 'SUPPLIER' | 'MANUFACTURER' | 'CUSTOM';
  description?: string;
  isActive: boolean;
}

interface StorageLocation {
  id: string;
  locationCode: string;
  name: string;
  type: 'SITE' | 'BUILDING' | 'ROOM' | 'STORAGE_UNIT';
  parentId?: string;
  conditions: string;
  capacity: number;
  currentOccupancy: number;
  temperature?: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'OFFLINE';
}

interface DashboardStats {
  totalItems: number;
  totalValue: number;
  criticalAlerts: number;
  expiryWarnings: number;
  lowStockItems: number;
  reorderSuggestions: number;
}

export const InventoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterModule, setFilterModule] = useState('');
  const [loading, setLoading] = useState(false);

  // Form states
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [editingBatch, setEditingBatch] = useState<any>(null);
  
  // Additional form states for all buttons
  const [showItemForm, setShowItemForm] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editingLocation, setEditingLocation] = useState<StorageLocation | null>(null);
  
  // Item detail view state
  const [showItemDetail, setShowItemDetail] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // New feature states
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showImages, setShowImages] = useState(true);
  const [showBarcodes, setShowBarcodes] = useState(true);

  // Mock data for Phase 1
  const [dashboardStats] = useState<DashboardStats>({
    totalItems: 1247,
    totalValue: 485750.50,
    criticalAlerts: 8,
    expiryWarnings: 23,
    lowStockItems: 15,
    reorderSuggestions: 12
  });

  const [inventoryItems] = useState<InventoryItem[]>([
    {
      id: '1',
      itemName: 'Culture Medium DMEM',
      category: 'MEDIA',
      subCategory: 'Cell Culture',
      unitOfMeasure: 'mL',
      packageSize: 500,
      modules: ['IVF', 'EMBRYO_CULTURE', 'LAB'],
      preferredSupplier: 'Life Technologies',
      minLevel: 1000,
      maxLevel: 5000,
      shelfLife: 365,
      storageConditions: '4°C',
      costPrice: 85.50,
      salePrice: 120.00,
      barcode: 'DMEM-500ML-001',
      qrCode: 'QR-DMEM-500ML-001',
      status: 'ACTIVE',
      createdAt: '2025-01-01',
      images: [{
        id: 'img1',
        filename: 'dmem_bottle.jpg',
        originalName: 'DMEM Culture Medium.jpg',
        url: imageManagementService.createPlaceholder(400, 300, 'DMEM Culture Medium'),
        thumbnailUrl: imageManagementService.createPlaceholder(150, 150, 'DMEM'),
        size: 245760,
        mimeType: 'image/jpeg',
        width: 400,
        height: 300,
        isPrimary: true,
        description: 'DMEM culture medium bottle',
        uploadedAt: '2025-01-01T10:00:00Z',
        uploadedBy: 'admin'
      }],
      primaryImageId: 'img1',
      barcodeFormat: 'CODE128' as BarcodeFormat,
      alternativeBarcodes: [],
      description: 'High-quality cell culture medium',
      manufacturer: 'Life Technologies',
      tags: ['cell culture', 'media', 'dmem'],
      updatedAt: '2025-01-01',
      createdBy: 'admin',
      lastModifiedBy: 'admin'
    },
    {
      id: '2',
      itemName: 'FSH (Folltropin)',
      category: 'HORMONE',
      subCategory: 'Reproductive Hormone',
      unitOfMeasure: 'IU',
      packageSize: 400,
      modules: ['INJECTION', 'SYNCHRONIZATION', 'OPU'],
      preferredSupplier: 'Vetoquinol',
      minLevel: 2000,
      maxLevel: 10000,
      shelfLife: 730,
      storageConditions: '2-8°C',
      costPrice: 125.00,
      salePrice: 180.00,
      barcode: 'FSH-400IU-002',
      qrCode: 'QR-FSH-400IU-002',
      status: 'ACTIVE',
      createdAt: '2025-01-01',
      images: [{
        id: 'img2',
        filename: 'fsh_vial.jpg',
        originalName: 'FSH Hormone Vial.jpg',
        url: imageManagementService.createPlaceholder(400, 400, 'FSH Hormone'),
        thumbnailUrl: imageManagementService.createPlaceholder(150, 150, 'FSH'),
        size: 187520,
        mimeType: 'image/jpeg',
        width: 400,
        height: 400,
        isPrimary: true,
        description: 'FSH hormone vial',
        uploadedAt: '2025-01-01T10:30:00Z',
        uploadedBy: 'admin'
      }],
      primaryImageId: 'img2',
      barcodeFormat: 'EAN13' as BarcodeFormat,
      alternativeBarcodes: [],
      description: 'Reproductive hormone for superovulation',
      manufacturer: 'Vetoquinol',
      tags: ['hormone', 'fsh', 'reproductive'],
      updatedAt: '2025-01-01',
      createdBy: 'admin',
      lastModifiedBy: 'admin'
    },
    {
      id: '3',
      itemName: 'Liquid Nitrogen',
      category: 'CRYO_MATERIAL',
      subCategory: 'Cryogenic',
      unitOfMeasure: 'L',
      packageSize: 50,
      modules: ['BIOBANK', 'EMBRYO_STORAGE', 'SEMEN_STORAGE'],
      preferredSupplier: 'CryoTech Industries',
      minLevel: 200,
      maxLevel: 1000,
      shelfLife: 0,
      storageConditions: '-196°C',
      costPrice: 12.50,
      barcode: 'LN2-50L-003',
      qrCode: 'QR-LN2-50L-003',
      status: 'ACTIVE',
      createdAt: '2025-01-01',
      images: [{
        id: 'img3',
        filename: 'ln2_tank.jpg',
        originalName: 'Liquid Nitrogen Tank.jpg',
        url: imageManagementService.createPlaceholder(300, 400, 'LN₂ Tank'),
        thumbnailUrl: imageManagementService.createPlaceholder(150, 150, 'LN₂'),
        size: 332800,
        mimeType: 'image/jpeg',
        width: 300,
        height: 400,
        isPrimary: true,
        description: 'Liquid nitrogen storage tank',
        uploadedAt: '2025-01-01T11:00:00Z',
        uploadedBy: 'admin'
      }],
      primaryImageId: 'img3',
      barcodeFormat: 'QR_CODE' as BarcodeFormat,
      alternativeBarcodes: [],
      description: 'Ultra-pure liquid nitrogen for cryogenic storage',
      manufacturer: 'CryoTech Industries',
      tags: ['cryogenic', 'storage', 'liquid nitrogen'],
      updatedAt: '2025-01-01',
      createdBy: 'admin',
      lastModifiedBy: 'admin'
    }
  ]);

  const [storageLocations] = useState<StorageLocation[]>([
    {
      id: '1',
      locationCode: 'SITE-001',
      name: 'Main Facility',
      type: 'SITE',
      conditions: 'Climate Controlled',
      capacity: 100,
      currentOccupancy: 75,
      status: 'ACTIVE'
    },
    {
      id: '2',
      locationCode: 'BLDG-001',
      name: 'Laboratory Building',
      type: 'BUILDING',
      parentId: '1',
      conditions: 'Temperature Controlled',
      capacity: 50,
      currentOccupancy: 38,
      status: 'ACTIVE'
    },
    {
      id: '3',
      locationCode: 'RM-LAB-001',
      name: 'IVF Laboratory',
      type: 'ROOM',
      parentId: '2',
      conditions: '18-22°C, 50-60% RH',
      capacity: 20,
      currentOccupancy: 15,
      temperature: 20.5,
      status: 'ACTIVE'
    },
    {
      id: '4',
      locationCode: 'FRZ-001',
      name: 'Main Freezer',
      type: 'STORAGE_UNIT',
      parentId: '3',
      conditions: '-20°C',
      capacity: 500,
      currentOccupancy: 380,
      temperature: -19.8,
      status: 'ACTIVE'
    }
  ]);

  // Mock data for Phase 2
  const [mockMovements] = useState([
    {
      id: '1',
      type: 'STOCK_OUT',
      itemName: 'Culture Medium DMEM',
      quantity: 250,
      unit: 'mL',
      reference: 'SO-001234',
      date: '2025-01-02',
      staff: 'Dr. Smith'
    },
    {
      id: '2',
      type: 'STOCK_IN',
      itemName: 'FSH (Folltropin)',
      quantity: 400,
      unit: 'IU',
      reference: 'SI-001235',
      date: '2025-01-02',
      staff: 'Lab Tech'
    },
    {
      id: '3',
      type: 'TRANSFER',
      itemName: 'Liquid Nitrogen',
      quantity: 10,
      unit: 'L',
      reference: 'TR-001236',
      date: '2025-01-01',
      staff: 'Field Tech'
    },
    {
      id: '4',
      type: 'ADJUSTMENT',
      itemName: 'Culture Medium DMEM',
      quantity: -50,
      unit: 'mL',
      reference: 'AD-001237',
      date: '2025-01-01',
      staff: 'Manager'
    }
  ]);

  const [mockBatches] = useState([
    {
      id: '1',
      batchNumber: 'DM-240101-001',
      lotNumber: 'LT-98765',
      itemName: 'Culture Medium DMEM',
      supplier: 'Life Technologies',
      quantityReceived: 1000,
      quantityInStock: 750,
      unit: 'mL',
      receivedDate: '2024-01-01',
      expiryDate: '2025-01-01',
      daysUntilExpiry: 365,
      status: 'AVAILABLE'
    },
    {
      id: '2',
      batchNumber: 'FSH-240115-002',
      lotNumber: 'VQ-54321',
      itemName: 'FSH (Folltropin)',
      supplier: 'Vetoquinol',
      quantityReceived: 2000,
      quantityInStock: 1600,
      unit: 'IU',
      receivedDate: '2024-01-15',
      expiryDate: '2025-07-15',
      daysUntilExpiry: 560,
      status: 'AVAILABLE'
    },
    {
      id: '3',
      batchNumber: 'LN2-240201-003',
      lotNumber: null,
      itemName: 'Liquid Nitrogen',
      supplier: 'CryoTech Industries',
      quantityReceived: 200,
      quantityInStock: 150,
      unit: 'L',
      receivedDate: '2024-02-01',
      expiryDate: null,
      daysUntilExpiry: null,
      status: 'AVAILABLE'
    },
    {
      id: '4',
      batchNumber: 'DM-231201-004',
      lotNumber: 'LT-12345',
      itemName: 'Culture Medium DMEM',
      supplier: 'Life Technologies',
      quantityReceived: 500,
      quantityInStock: 0,
      unit: 'mL',
      receivedDate: '2023-12-01',
      expiryDate: '2024-12-01',
      daysUntilExpiry: -30,
      status: 'EXPIRED'
    }
  ]);

  const categories = [
    { value: 'MEDIA', label: 'Culture Media', color: 'bg-blue-500', count: 156 },
    { value: 'HORMONE', label: 'Hormones', color: 'bg-pink-500', count: 89 },
    { value: 'REAGENT', label: 'Lab Reagents', color: 'bg-purple-500', count: 234 },
    { value: 'CONSUMABLE', label: 'Consumables', color: 'bg-green-500', count: 445 },
    { value: 'EQUIPMENT', label: 'Equipment', color: 'bg-orange-500', count: 78 },
    { value: 'CRYO_MATERIAL', label: 'Cryo Materials', color: 'bg-cyan-500', count: 67 },
    { value: 'DRUG', label: 'Pharmaceuticals', color: 'bg-red-500', count: 178 }
  ];

  const modules = [
    'IVF', 'EMBRYO_TRANSFER', 'OPU', 'INJECTION', 'SYNCHRONIZATION', 
    'BIOBANK', 'LAB', 'GENOMICS', 'ULTRASOUND', 'CLINICAL'
  ];

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3, badge: 'PHASE 1' },
    { id: 'items', name: 'Item Master', icon: Package, count: inventoryItems.length, badge: 'ENHANCED' },
    { id: 'locations', name: 'Locations', icon: MapPin, count: storageLocations.length },
    { id: 'movements', name: 'Stock Movements', icon: TrendingUp, badge: 'PHASE 2', count: mockMovements.length },
    { id: 'batches', name: 'Batch Tracking', icon: Package2, badge: 'PHASE 2', count: mockBatches.length },
    { id: 'module-integration', name: 'Module Integration', icon: Settings, badge: 'PHASE 3' },
    { id: 'biobank-integration', name: 'Biobank Integration', icon: Thermometer, badge: 'PHASE 4' }
  ];

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = !searchTerm || 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.barcode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || item.category === filterCategory;
    const matchesModule = !filterModule || item.modules.includes(filterModule);
    
    return matchesSearch && matchesCategory && matchesModule;
  });

  // Form handlers
  const handleBatchSave = (batchData: any) => {
    console.log('Saving batch:', batchData);
    setShowBatchForm(false);
    setEditingBatch(null);
    // Here you would typically call an API to save the batch
  };

  const handleMovementSave = (movementData: any) => {
    console.log('Saving movement:', movementData);
    setShowMovementForm(false);
    setSelectedBatch(null);
    // Here you would typically call an API to save the movement
  };

  const handleItemSave = (itemData: any) => {
    console.log('Saving item:', itemData);
    setShowItemForm(false);
    setEditingItem(null);
    // Here you would typically call an API to save the item
  };

  const handleLocationSave = (locationData: any) => {
    console.log('Saving location:', locationData);
    setShowLocationForm(false);
    setEditingLocation(null);
    // Here you would typically call an API to save the location
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setShowItemForm(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setShowItemForm(true);
  };

  const handleDeleteItem = (itemId: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      console.log('Deleting item:', itemId);
      // Here you would typically call an API to delete the item
    }
  };

  const handleAddLocation = () => {
    setEditingLocation(null);
    setShowLocationForm(true);
  };

  const handleEditLocation = (location: StorageLocation) => {
    setEditingLocation(location);
    setShowLocationForm(true);
  };

  const handleDeleteLocation = (locationId: string) => {
    if (confirm('Are you sure you want to delete this location?')) {
      console.log('Deleting location:', locationId);
      // Here you would typically call an API to delete the location
    }
  };

  const handleAddMovement = () => {
    setSelectedBatch(null);
    setShowMovementForm(true);
  };

  const handleExportData = () => {
    console.log('Exporting inventory data...');
    // Here you would implement CSV/Excel export functionality
    alert('Export functionality will be implemented in next phase');
  };

  const handlePrintReport = () => {
    console.log('Printing inventory report...');
    window.print();
  };

  // New handlers for enhanced features
  const handleBarcodeScanned = (barcode: string, format: BarcodeFormat) => {
    console.log('Barcode scanned:', barcode, format);
    setShowBarcodeScanner(false);
    
    // Find item by barcode
    const foundItem = inventoryItems.find(item => 
      item.barcode === barcode || 
      item.qrCode === barcode ||
      item.alternativeBarcodes.some(alt => alt.code === barcode)
    );
    
    if (foundItem) {
      alert(`Item found: ${foundItem.itemName}`);
      setActiveTab('items');
      setSelectedItems([foundItem.id]);
    } else {
      alert('Item not found. Would you like to create a new item?');
    }
  };

  const handlePrintLabels = async (items: InventoryItem[]) => {
    try {
      const template = printableLabelService.getTemplate('standard_2x1');
      if (template) {
        await printableLabelService.printLabels(template, items);
      }
    } catch (error) {
      console.error('Failed to print labels:', error);
      alert('Failed to print labels');
    }
  };

  const handleItemSelect = (item: InventoryItem) => {
    setSelectedItemId(item.id);
    setShowItemDetail(true);
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedItems(selectedIds);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Inventory Control System</h1>
            <p className="text-teal-100 mt-1">Core inventory management: items, locations, stock movements & batch tracking</p>
          </div>
          <div className="flex space-x-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">PHASE 1-2</span>
            <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">CORE INVENTORY</span>
            <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-medium">STOCK CONTROL</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalItems.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${dashboardStats.totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Critical Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.criticalAlerts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Expiry Warnings</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.expiryWarnings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.lowStockItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-indigo-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Procurement Active</p>
              <p className="text-2xl font-bold text-gray-900">{dashboardStats.reorderSuggestions}</p>
              <span className="text-xs text-indigo-600 font-medium">PHASE 5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Phase 5 Summary */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-indigo-900">🚀 Phase 6: Advanced Analytics Complete!</h3>
            <p className="text-indigo-700 mt-1">AI-powered predictive analytics, business intelligence, and comprehensive reporting</p>
          </div>
          <div className="flex space-x-2">
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">AI Analytics</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">6 Dashboards</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">87% ML Accuracy</span>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-indigo-800">Predictive Analytics</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-indigo-800">Business Intelligence</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-indigo-800">Cost Analysis</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-indigo-800">Performance Metrics</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-indigo-800">Risk Assessment</span>
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory by Category</h3>
          <div className="space-y-3">
            {categories.map(category => (
              <div key={category.value} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${category.color} mr-3`}></div>
                  <span className="text-sm font-medium text-gray-700">{category.label}</span>
                </div>
                <span className="text-sm text-gray-500">{category.count} items</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Locations</h3>
          <div className="space-y-3">
            {storageLocations.map(location => (
              <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{location.name}</p>
                    <p className="text-xs text-gray-500">{location.locationCode}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{location.currentOccupancy}/{location.capacity}</p>
                  {location.temperature && (
                    <p className="text-xs text-blue-600 flex items-center">
                      <Thermometer className="h-3 w-3 mr-1" />
                      {location.temperature}°C
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderItems = () => (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Enhanced Item Master</h1>
            <p className="text-teal-100 mt-1">
              Complete inventory management with images, barcodes, and smart views
            </p>
          </div>
          <div className="flex space-x-2">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">ENHANCED</span>
            <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">IMAGES</span>
            <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-medium">BARCODES</span>
            <span className="bg-yellow-500 px-3 py-1 rounded-full text-sm font-medium">PRINTABLE</span>
          </div>
        </div>
      </div>

      {/* Action Bar & Controls */}
      <div className="bg-white rounded-lg border p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left side - Actions */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowBarcodeScanner(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <ScanLine className="w-4 h-4" />
              <span>Scan Barcode</span>
            </button>
            
            <button 
              onClick={handleAddItem}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>

            {selectedItems.length > 0 && (
              <button 
                onClick={() => handlePrintLabels(inventoryItems.filter(item => selectedItems.includes(item.id)))}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Labels ({selectedItems.length})</span>
              </button>
            )}
          </div>

          {/* Right side - View controls */}
          <div className="flex items-center space-x-2">
            {/* View mode toggle */}
            <div className="flex border rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-l-lg flex items-center space-x-1 ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-r-lg flex items-center space-x-1 ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
                <span>Table</span>
              </button>
            </div>

            {/* Display options */}
            <button
              onClick={() => setShowImages(!showImages)}
              className={`px-3 py-2 rounded-lg flex items-center space-x-1 ${
                showImages ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Images</span>
            </button>
            
            <button
              onClick={() => setShowBarcodes(!showBarcodes)}
              className={`px-3 py-2 rounded-lg flex items-center space-x-1 ${
                showBarcodes ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Barcodes</span>
            </button>

            <button 
              onClick={handleExportData}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items, barcodes, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <select
            value={filterModule}
            onChange={(e) => setFilterModule(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Modules</option>
            {modules.map(module => (
              <option key={module} value={module}>{module}</option>
            ))}
          </select>

          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Advanced</span>
          </button>
        </div>
      </div>

      {/* Dynamic Content View */}
      {viewMode === 'grid' ? (
        <>
          {/* Enhanced Grid Component */}
          <InventoryItemGrid
            items={filteredItems}
            onItemSelect={handleItemSelect}
            onItemEdit={handleEditItem}
            onItemDelete={handleDeleteItem}
            onBulkPrint={handlePrintLabels}
            selectedItems={selectedItems}
            onSelectionChange={handleSelectionChange}
          />

          {/* Summary Footer */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{filteredItems.length}</div>
                <div className="text-sm text-gray-500">Items Displayed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{selectedItems.length}</div>
                <div className="text-sm text-gray-500">Selected</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {filteredItems.filter(item => item.images.length > 0).length}
                </div>
                <div className="text-sm text-gray-500">With Images</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  ${filteredItems.reduce((sum, item) => sum + (item.costPrice || 0), 0).toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">Total Value</div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Enhanced Table View */
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedItems(filteredItems.map(item => item.id));
                      } else {
                        setSelectedItems([]);
                      }
                    }}
                    className="rounded"
                  />
                </th>
                {showImages && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Levels</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pricing</th>
                {showBarcodes && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Barcode</th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const isSelected = selectedItems.includes(item.id);
                const primaryImage = item.images.find(img => img.isPrimary) || item.images[0];
                
                return (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-2 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, item.id]);
                          } else {
                            setSelectedItems(selectedItems.filter(id => id !== item.id));
                          }
                        }}
                        className="rounded"
                      />
                    </td>
                    
                    {showImages && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-16 h-16">
                          {primaryImage ? (
                            <img
                              src={imageManagementService.getImageUrl(primaryImage, 'thumbnail')}
                              alt={item.itemName}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                    
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                        <div className="text-sm text-gray-500">{item.barcode}</div>
                        <div className="text-xs text-gray-400">{item.packageSize} {item.unitOfMeasure}</div>
                        {item.description && (
                          <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">{item.description}</div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          categories.find(c => c.value === item.category)?.color || 'bg-gray-100'
                        } text-white`}>
                          {item.category}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">{item.subCategory}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.modules.slice(0, 2).map(module => (
                            <span key={module} className="inline-flex px-1 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">
                              {module}
                            </span>
                          ))}
                          {item.modules.length > 2 && (
                            <span className="inline-flex px-1 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                              +{item.modules.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Min: {item.minLevel} | Max: {item.maxLevel}
                      </div>
                      <div className="text-xs text-gray-500">
                        Storage: {item.storageConditions}
                      </div>
                      <div className="text-xs text-gray-500">
                        Shelf Life: {item.shelfLife} days
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Cost: ${item.costPrice?.toFixed(2) || '0.00'}
                      </div>
                      {item.salePrice && (
                        <div className="text-sm text-green-600">
                          Sale: ${item.salePrice.toFixed(2)}
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        {item.preferredSupplier}
                      </div>
                    </td>
                    
                    {showBarcodes && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-24 h-8 bg-white border rounded flex items-center justify-center">
                          <QrCode className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{item.barcode}</div>
                      </td>
                    )}
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleItemSelect(item)}
                          className="text-teal-600 hover:text-teal-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditItem(item)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit Item"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handlePrintLabels([item])}
                          className="text-purple-600 hover:text-purple-900"
                          title="Print Label"
                        >
                          <Printer className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderLocations = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Storage Locations</h2>
        <div className="flex space-x-2">
          <button 
            onClick={handleExportData}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={handleAddLocation}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Location</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {storageLocations.map(location => (
          <div key={location.id} className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{location.name}</h3>
                <p className="text-sm text-gray-500">{location.locationCode}</p>
                <p className="text-sm text-gray-600 mt-1">{location.conditions}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                location.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                location.status === 'MAINTENANCE' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {location.status}
              </span>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Occupancy</span>
                <span className="font-medium">{location.currentOccupancy}/{location.capacity}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-teal-600 h-2 rounded-full" 
                  style={{ width: `${(location.currentOccupancy / location.capacity) * 100}%` }}
                ></div>
              </div>
            </div>

            {location.temperature && (
              <div className="mt-3 flex items-center text-sm text-blue-600">
                <Thermometer className="h-4 w-4 mr-1" />
                <span>{location.temperature}°C</span>
              </div>
            )}

            <div className="mt-4 flex space-x-2">
              <button 
                onClick={() => alert(`Viewing details for ${location.name}`)}
                className="text-teal-600 hover:text-teal-900 text-sm"
              >
                View
              </button>
              <button 
                onClick={() => handleEditLocation(location)}
                className="text-blue-600 hover:text-blue-900 text-sm"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDeleteLocation(location.id)}
                className="text-red-600 hover:text-red-900 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMovements = () => (
    <div className="space-y-4">
              <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Stock Movements</h2>
        <div className="flex space-x-2">
          <button 
            onClick={handleExportData}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={handleAddMovement}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Record Movement</span>
          </button>
        </div>
      </div>

      {/* Movement Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Stock In</p>
              <p className="text-2xl font-bold text-gray-900">847</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-red-500 transform rotate-180" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Stock Out</p>
              <p className="text-2xl font-bold text-gray-900">523</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Transfers</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Adjustments</p>
              <p className="text-2xl font-bold text-gray-900">34</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Movements */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Movements</h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockMovements.map((movement) => (
              <tr key={movement.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(movement.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    movement.type === 'STOCK_IN' ? 'bg-green-100 text-green-800' :
                    movement.type === 'STOCK_OUT' ? 'bg-red-100 text-red-800' :
                    movement.type === 'TRANSFER' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {movement.type.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {movement.itemName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {movement.quantity} {movement.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {movement.reference}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {movement.staff}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBatches = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Stock Batches</h2>
        <button 
          onClick={() => setShowBatchForm(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Batch</span>
        </button>
      </div>

      {/* Batch Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Package2 className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Available</p>
              <p className="text-2xl font-bold text-gray-900">234</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">23</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Expired</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Settings className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Quarantine</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-gray-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Reserved</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
            </div>
          </div>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockBatches.map((batch) => (
              <tr key={batch.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{batch.batchNumber}</div>
                    <div className="text-sm text-gray-500">Lot: {batch.lotNumber}</div>
                    <div className="text-xs text-gray-400">Received: {new Date(batch.receivedDate).toLocaleDateString()}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{batch.itemName}</div>
                  <div className="text-sm text-gray-500">{batch.supplier}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {batch.quantityInStock} / {batch.quantityReceived} {batch.unit}
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-teal-600 h-2 rounded-full" 
                      style={{ width: `${(batch.quantityInStock / batch.quantityReceived) * 100}%` }}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${
                    batch.daysUntilExpiry < 30 ? 'text-red-600' :
                    batch.daysUntilExpiry < 90 ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString() : 'No expiry'}
                  </div>
                  {batch.daysUntilExpiry && (
                    <div className="text-xs text-gray-500">
                      {batch.daysUntilExpiry} days left
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    batch.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                    batch.status === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                    batch.status === 'QUARANTINE' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {batch.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-teal-600 hover:text-teal-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedBatch(batch);
                        setShowMovementForm(true);
                      }}
                      className="text-purple-600 hover:text-purple-900"
                    >
                      <TrendingUp className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="mt-1 text-gray-600">Complete stock control and automation platform</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    isActive
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`-ml-0.5 mr-2 h-5 w-5 ${
                    isActive ? 'text-teal-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  {tab.name}
                  {tab.count && (
                    <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                  {tab.badge && (
                    <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${
                      tab.badge === 'PHASE 1' ? 'bg-green-100 text-green-800' :
                      tab.badge === 'PHASE 2' ? 'bg-blue-100 text-blue-800' :
                      tab.badge === 'PHASE 3' ? 'bg-purple-100 text-purple-800' :
                      tab.badge === 'PHASE 4' ? 'bg-cyan-100 text-cyan-800' :
                      tab.badge === 'PHASE 5' ? 'bg-indigo-100 text-indigo-800' :
                      tab.badge === 'PHASE 6' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
                      {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'items' && renderItems()}
            {activeTab === 'locations' && renderLocations()}
            {activeTab === 'movements' && renderMovements()}
            {activeTab === 'batches' && renderBatches()}
            {activeTab === 'module-integration' && (
              <div className="text-center py-16">
                <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Module Integration Hub</h3>
                <p className="text-gray-500">Integration with other modules coming soon</p>
              </div>
            )}
            {activeTab === 'biobank-integration' && (
              <div className="text-center py-16">
                <Thermometer className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Biobank Integration</h3>
                <p className="text-gray-500">Biobank integration features coming soon</p>
              </div>
            )}
        </div>

        {/* Form Components */}
        <StockBatchForm
          isOpen={showBatchForm}
          onClose={() => {
            setShowBatchForm(false);
            setEditingBatch(null);
          }}
          onSave={handleBatchSave}
          batch={editingBatch}
          inventoryItems={inventoryItems}
          storageLocations={storageLocations}
          mode={editingBatch ? 'edit' : 'add'}
        />

        <StockMovementForm
          isOpen={showMovementForm}
          onClose={() => {
            setShowMovementForm(false);
            setSelectedBatch(null);
          }}
          onSave={handleMovementSave}
          stockBatches={mockBatches.map(batch => ({
            ...batch,
            item: { itemName: batch.itemName },
            unitOfMeasure: batch.unit,
            costPerUnit: 10.50,
            storageLocationId: '1'
          }))}
          storageLocations={storageLocations}
          defaultBatchId={selectedBatch?.id}
        />

        <ItemForm
          isOpen={showItemForm}
          onClose={() => {
            setShowItemForm(false);
            setEditingItem(null);
          }}
          onSave={handleItemSave}
          item={editingItem}
        />

        <LocationForm
          isOpen={showLocationForm}
          onClose={() => {
            setShowLocationForm(false);
            setEditingLocation(null);
          }}
          onSave={handleLocationSave}
          location={editingLocation}
          locations={storageLocations}
        />

        {/* Barcode Scanner */}
        <BarcodeScanner
          isOpen={showBarcodeScanner}
          onClose={() => setShowBarcodeScanner(false)}
          onScan={handleBarcodeScanned}
          allowedFormats={['CODE128', 'EAN13', 'EAN8', 'QR_CODE', 'UPC_A', 'UPC_E']}
        />

        {/* Item Detail View */}
        {selectedItemId && (
          <ItemDetailView
            isOpen={showItemDetail}
            onClose={() => {
              setShowItemDetail(false);
              setSelectedItemId(null);
            }}
            itemId={selectedItemId}
            onEdit={(item) => {
              setEditingItem(item);
              setShowItemForm(true);
              setShowItemDetail(false);
            }}
          />
        )}

      </div>
    </div>
  );
}; 