import React, { useState, useEffect } from 'react';
import {
  X,
  Package,
  Image as ImageIcon,
  QrCode,
  Download,
  Printer,
  Edit,
  AlertTriangle,
  Clock,
  MapPin,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  Users,
  Calendar,
  FileText,
  Archive,
  Thermometer,
  Building2,
  Tag,
  ChevronRight,
  Eye,
  RefreshCw
} from 'lucide-react';
import { imageManagementService } from '../services/imageManagementService';
import { qrCodeService } from '../services/qrCodeService';

interface ItemDetailViewProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  onEdit?: (item: any) => void;
}

interface InventoryItem {
  id: string;
  itemName: string;
  description?: string;
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
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  specifications?: string;
  notes?: string;
  tags: string[];
  images: any[];
  primaryImageId?: string;
  createdAt: string;
  updatedAt: string;
}

interface StockBatch {
  id: string;
  batchNumber: string;
  lotNumber?: string;
  supplier: string;
  quantityReceived: number;
  quantityInStock: number;
  receivedDate: string;
  expiryDate?: string;
  daysUntilExpiry?: number;
  status: 'AVAILABLE' | 'EXPIRED' | 'QUARANTINE' | 'DEPLETED';
}

interface ModuleRequest {
  id: string;
  moduleName: string;
  requestType: string;
  quantity: number;
  requestedBy: string;
  requestDate: string;
  status: 'PENDING' | 'APPROVED' | 'FULFILLED' | 'CANCELLED';
  notes?: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface StockMovement {
  id: string;
  type: 'STOCK_IN' | 'STOCK_OUT' | 'TRANSFER' | 'ADJUSTMENT';
  quantity: number;
  reference: string;
  date: string;
  staff: string;
  notes?: string;
  fromLocation?: string;
  toLocation?: string;
}

export const ItemDetailView: React.FC<ItemDetailViewProps> = ({
  isOpen,
  onClose,
  itemId,
  onEdit
}) => {
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [stockBatches, setStockBatches] = useState<StockBatch[]>([]);
  const [moduleRequests, setModuleRequests] = useState<ModuleRequest[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [generatedQR, setGeneratedQR] = useState<string>('');

  useEffect(() => {
    if (isOpen && itemId) {
      loadItemDetails();
    }
  }, [isOpen, itemId]);

  const loadItemDetails = async () => {
    setLoading(true);
    try {
      // Mock data - in real implementation, fetch from API
      const mockItem: InventoryItem = {
        id: itemId,
        itemName: 'Culture Medium DMEM',
        description: 'High-quality cell culture medium for optimal cell growth and viability',
        category: 'MEDIA',
        subCategory: 'Cell Culture',
        unitOfMeasure: 'mL',
        packageSize: 500,
        modules: ['IVF', 'EMBRYO_CULTURE', 'LAB', 'GENOMICS'],
        preferredSupplier: 'Life Technologies',
        minLevel: 1000,
        maxLevel: 5000,
        shelfLife: 365,
        storageConditions: '4°C',
        costPrice: 85.50,
        salePrice: 120.00,
        barcode: 'DMEM-500ML-001',
        qrCode: '',
        status: 'ACTIVE',
        manufacturer: 'Thermo Fisher Scientific',
        model: 'DMEM-001',
        serialNumber: 'TFS-DMEM-2025',
        specifications: 'Modified Eagle Medium with 4.5g/L glucose, L-glutamine, sodium pyruvate',
        notes: 'Store at 4°C. Use within 30 days after opening.',
        tags: ['cell culture', 'media', 'dmem', 'high glucose'],
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
        createdAt: '2025-01-01T10:00:00Z',
        updatedAt: '2025-01-15T14:30:00Z'
      };

      const mockBatches: StockBatch[] = [
        {
          id: '1',
          batchNumber: 'DM-240101-001',
          lotNumber: 'LT-98765',
          supplier: 'Life Technologies',
          quantityReceived: 1000,
          quantityInStock: 750,
          receivedDate: '2024-01-01',
          expiryDate: '2025-01-01',
          daysUntilExpiry: 365,
          status: 'AVAILABLE'
        },
        {
          id: '2',
          batchNumber: 'DM-240115-002',
          lotNumber: 'LT-98766',
          supplier: 'Life Technologies',
          quantityReceived: 500,
          quantityInStock: 450,
          receivedDate: '2024-01-15',
          expiryDate: '2025-01-15',
          daysUntilExpiry: 380,
          status: 'AVAILABLE'
        },
        {
          id: '3',
          batchNumber: 'DM-231201-003',
          lotNumber: 'LT-98764',
          supplier: 'Life Technologies',
          quantityReceived: 500,
          quantityInStock: 0,
          receivedDate: '2023-12-01',
          expiryDate: '2024-12-01',
          daysUntilExpiry: -30,
          status: 'EXPIRED'
        }
      ];

      const mockRequests: ModuleRequest[] = [
        {
          id: '1',
          moduleName: 'IVF Laboratory',
          requestType: 'Regular Supply',
          quantity: 200,
          requestedBy: 'Dr. Smith',
          requestDate: '2025-01-10',
          status: 'PENDING',
          notes: 'Needed for upcoming procedures',
          urgency: 'MEDIUM'
        },
        {
          id: '2',
          moduleName: 'Embryo Culture',
          requestType: 'Emergency Supply',
          quantity: 100,
          requestedBy: 'Lab Technician',
          requestDate: '2025-01-12',
          status: 'APPROVED',
          notes: 'Urgent requirement',
          urgency: 'HIGH'
        },
        {
          id: '3',
          moduleName: 'Genomics Lab',
          requestType: 'Research Project',
          quantity: 50,
          requestedBy: 'Research Team',
          requestDate: '2025-01-08',
          status: 'FULFILLED',
          notes: 'For ongoing study',
          urgency: 'LOW'
        }
      ];

      const mockMovements: StockMovement[] = [
        {
          id: '1',
          type: 'STOCK_OUT',
          quantity: 250,
          reference: 'SO-001234',
          date: '2025-01-02',
          staff: 'Dr. Smith',
          notes: 'IVF procedures',
          toLocation: 'IVF Lab'
        },
        {
          id: '2',
          type: 'STOCK_IN',
          quantity: 500,
          reference: 'SI-001235',
          date: '2025-01-15',
          staff: 'Inventory Manager',
          notes: 'New batch received',
          fromLocation: 'Supplier'
        },
        {
          id: '3',
          type: 'TRANSFER',
          quantity: 100,
          reference: 'TR-001236',
          date: '2025-01-10',
          staff: 'Lab Tech',
          notes: 'Transfer to backup storage',
          fromLocation: 'Main Storage',
          toLocation: 'Backup Storage'
        }
      ];

      setItem(mockItem);
      setStockBatches(mockBatches);
      setModuleRequests(mockRequests);
      setStockMovements(mockMovements);

      // Generate QR code
      if (mockItem.barcode) {
        const qrCode = await qrCodeService.generateItemQR(mockItem);
        setGeneratedQR(qrCode);
      }
    } catch (error) {
      console.error('Failed to load item details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintQR = () => {
    if (generatedQR && item) {
      qrCodeService.printQRCode(generatedQR, item.itemName);
    }
  };

  const handleDownloadQR = () => {
    if (generatedQR && item) {
      qrCodeService.downloadQRCode(generatedQR, `QR-${item.barcode}.png`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'AVAILABLE':
      case 'APPROVED':
      case 'FULFILLED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'INACTIVE':
      case 'EXPIRED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'DISCONTINUED':
      case 'QUARANTINE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'CRITICAL':
        return 'text-red-600';
      case 'HIGH':
        return 'text-orange-600';
      case 'MEDIUM':
        return 'text-yellow-600';
      case 'LOW':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const totalStock = stockBatches.reduce((sum, batch) => sum + batch.quantityInStock, 0);
  const availableStock = stockBatches
    .filter(batch => batch.status === 'AVAILABLE')
    .reduce((sum, batch) => sum + batch.quantityInStock, 0);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Package },
    { id: 'stock', name: 'Stock & Batches', icon: Archive },
    { id: 'requests', name: 'Module Requests', icon: Users },
    { id: 'movements', name: 'Movement History', icon: Activity },
    { id: 'analytics', name: 'Usage Analytics', icon: BarChart3 }
  ];

  if (!isOpen || !item) return null;

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Item Header */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{item.itemName}</h2>
            <p className="text-teal-100 mb-4">{item.description}</p>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                {item.category} • {item.subCategory}
              </span>
            </div>
          </div>
          
          {/* Primary Image */}
          <div className="ml-6">
            {item.images.length > 0 ? (
              <img
                src={imageManagementService.getImageUrl(item.images[0], 'medium')}
                alt={item.itemName}
                className="w-32 h-32 object-cover rounded-lg border-2 border-white/20"
              />
            ) : (
              <div className="w-32 h-32 bg-white/20 rounded-lg flex items-center justify-center">
                <Package className="w-16 h-16 text-white/40" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stock Summary */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Archive className="w-5 h-5 mr-2" />
              Current Stock Status
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{totalStock}</div>
                <div className="text-sm text-gray-500">Total Stock</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{availableStock}</div>
                <div className="text-sm text-gray-500">Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{item.minLevel}</div>
                <div className="text-sm text-gray-500">Min Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{item.maxLevel}</div>
                <div className="text-sm text-gray-500">Max Level</div>
              </div>
            </div>

            {/* Stock Level Progress */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Stock Level</span>
                <span>{totalStock} / {item.maxLevel} {item.unitOfMeasure}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    totalStock < item.minLevel ? 'bg-red-500' :
                    totalStock > item.maxLevel * 0.8 ? 'bg-green-500' :
                    'bg-yellow-500'
                  }`}
                  style={{ width: `${Math.min((totalStock / item.maxLevel) * 100, 100)}%` }}
                ></div>
              </div>
              {totalStock < item.minLevel && (
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Stock below minimum level
                </div>
              )}
            </div>
          </div>

          {/* Recent Requests */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Recent Module Requests
            </h3>
            
            <div className="space-y-3">
              {moduleRequests.slice(0, 3).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{request.moduleName}</span>
                      <span className={`text-sm font-medium ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {request.quantity} {item.unitOfMeasure} • {request.requestedBy}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
            
            {moduleRequests.length > 3 && (
              <button 
                onClick={() => setActiveTab('requests')}
                className="mt-4 text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center"
              >
                View all requests <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>

        {/* Details Panel */}
        <div className="space-y-6">
          {/* QR Code */}
          {generatedQR && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <QrCode className="w-5 h-5 mr-2" />
                QR Code
              </h3>
              
              <div className="text-center">
                <img 
                  src={generatedQR} 
                  alt="QR Code" 
                  className="mx-auto w-32 h-32 border rounded-lg mb-4"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handlePrintQR}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    <Printer className="w-4 h-4 inline mr-1" />
                    Print
                  </button>
                  <button
                    onClick={handleDownloadQR}
                    className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700"
                  >
                    <Download className="w-4 h-4 inline mr-1" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Item Details */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Item Details
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Barcode:</span>
                <span className="font-medium">{item.barcode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Package Size:</span>
                <span className="font-medium">{item.packageSize} {item.unitOfMeasure}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shelf Life:</span>
                <span className="font-medium">{item.shelfLife} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Storage:</span>
                <span className="font-medium">{item.storageConditions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cost Price:</span>
                <span className="font-medium">${item.costPrice}</span>
              </div>
              {item.salePrice && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Sale Price:</span>
                  <span className="font-medium">${item.salePrice}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Supplier:</span>
                <span className="font-medium">{item.preferredSupplier}</span>
              </div>
            </div>
          </div>

          {/* Manufacturer Info */}
          {item.manufacturer && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Manufacturer
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Company:</span>
                  <span className="font-medium">{item.manufacturer}</span>
                </div>
                {item.model && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model:</span>
                    <span className="font-medium">{item.model}</span>
                  </div>
                )}
                {item.serialNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Serial:</span>
                    <span className="font-medium">{item.serialNumber}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Associated Modules */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Associated Modules</h3>
            
            <div className="flex flex-wrap gap-2">
              {item.modules.map((module) => (
                <span 
                  key={module}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {module}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Tags
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStockBatches = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Stock Batches</h3>
        <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      <div className="grid gap-4">
        {stockBatches.map((batch) => (
          <div key={batch.id} className="bg-white rounded-lg border p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-lg font-medium">{batch.batchNumber}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(batch.status)}`}>
                    {batch.status}
                  </span>
                </div>
                
                {batch.lotNumber && (
                  <p className="text-sm text-gray-600 mb-2">Lot: {batch.lotNumber}</p>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Supplier:</span>
                    <p className="font-medium">{batch.supplier}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Received:</span>
                    <p className="font-medium">{new Date(batch.receivedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">In Stock:</span>
                    <p className="font-medium">{batch.quantityInStock} / {batch.quantityReceived} {item.unitOfMeasure}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Expiry:</span>
                    <p className={`font-medium ${
                      batch.daysUntilExpiry && batch.daysUntilExpiry < 30 ? 'text-red-600' :
                      batch.daysUntilExpiry && batch.daysUntilExpiry < 60 ? 'text-orange-600' :
                      'text-green-600'
                    }`}>
                      {batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString() : 'No expiry'}
                      {batch.daysUntilExpiry && (
                        <span className="text-xs block">
                          {batch.daysUntilExpiry > 0 ? `${batch.daysUntilExpiry} days left` : 'Expired'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Stock Level Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Usage</span>
                    <span>{((batch.quantityReceived - batch.quantityInStock) / batch.quantityReceived * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: `${(batch.quantityReceived - batch.quantityInStock) / batch.quantityReceived * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderModuleRequests = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Module Requests</h3>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border rounded-lg text-sm">
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="FULFILLED">Fulfilled</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {moduleRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg border p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="text-lg font-medium">{request.moduleName}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                  <span className={`text-sm font-medium ${getUrgencyColor(request.urgency)}`}>
                    {request.urgency}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <p className="font-medium">{request.requestType}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Quantity:</span>
                    <p className="font-medium">{request.quantity} {item.unitOfMeasure}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Requested By:</span>
                    <p className="font-medium">{request.requestedBy}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <p className="font-medium">{new Date(request.requestDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {request.notes && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-gray-600 text-sm">Notes:</span>
                    <p className="text-sm mt-1">{request.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="ml-4 flex flex-col space-y-2">
                <button className="bg-teal-600 text-white px-3 py-1 rounded text-sm hover:bg-teal-700">
                  View Details
                </button>
                {request.status === 'PENDING' && (
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                    Approve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMovementHistory = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Movement History</h3>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border rounded-lg text-sm">
            <option value="">All Types</option>
            <option value="STOCK_IN">Stock In</option>
            <option value="STOCK_OUT">Stock Out</option>
            <option value="TRANSFER">Transfer</option>
            <option value="ADJUSTMENT">Adjustment</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stockMovements.map((movement) => (
              <tr key={movement.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {new Date(movement.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {movement.type === 'STOCK_IN' && <TrendingUp className="w-4 h-4 text-green-500 mr-2" />}
                    {movement.type === 'STOCK_OUT' && <TrendingDown className="w-4 h-4 text-red-500 mr-2" />}
                    {movement.type === 'TRANSFER' && <RefreshCw className="w-4 h-4 text-blue-500 mr-2" />}
                    {movement.type === 'ADJUSTMENT' && <Edit className="w-4 h-4 text-orange-500 mr-2" />}
                    <span className="text-sm font-medium">{movement.type.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`font-medium ${
                    movement.type === 'STOCK_IN' ? 'text-green-600' : 
                    movement.type === 'STOCK_OUT' ? 'text-red-600' : 
                    'text-blue-600'
                  }`}>
                    {movement.type === 'STOCK_OUT' ? '-' : '+'}{movement.quantity} {item.unitOfMeasure}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{movement.reference}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{movement.staff}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {movement.fromLocation && movement.toLocation 
                    ? `${movement.fromLocation} → ${movement.toLocation}`
                    : movement.fromLocation || movement.toLocation || '-'
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Usage Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h4 className="font-medium mb-4">Monthly Usage</h4>
          <div className="text-3xl font-bold text-blue-600 mb-2">2,450</div>
          <div className="text-sm text-gray-600">mL consumed this month</div>
          <div className="mt-4 text-sm text-green-600">↑ 12% from last month</div>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <h4 className="font-medium mb-4">Average Daily Use</h4>
          <div className="text-3xl font-bold text-purple-600 mb-2">82</div>
          <div className="text-sm text-gray-600">mL per day</div>
          <div className="mt-4 text-sm text-blue-600">Based on 30-day average</div>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <h4 className="font-medium mb-4">Stock Efficiency</h4>
          <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
          <div className="text-sm text-gray-600">Utilization rate</div>
          <div className="mt-4 text-sm text-orange-600">2% waste reduction</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <h4 className="font-medium mb-4">Module Usage Distribution</h4>
        <div className="space-y-3">
          {[
            { module: 'IVF Laboratory', usage: 45, color: 'bg-blue-500' },
            { module: 'Embryo Culture', usage: 30, color: 'bg-green-500' },
            { module: 'Genomics Lab', usage: 15, color: 'bg-purple-500' },
            { module: 'Research', usage: 10, color: 'bg-orange-500' }
          ].map((data) => (
            <div key={data.module} className="flex items-center">
              <div className="w-24 text-sm text-gray-600">{data.module}</div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${data.color}`}
                    style={{ width: `${data.usage}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-12 text-sm font-medium text-right">{data.usage}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">Item Details</h2>
            <span className="text-sm text-gray-500">#{item.barcode}</span>
          </div>
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(item)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Item
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          ) : (
            <>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'stock' && renderStockBatches()}
              {activeTab === 'requests' && renderModuleRequests()}
              {activeTab === 'movements' && renderMovementHistory()}
              {activeTab === 'analytics' && renderAnalytics()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 