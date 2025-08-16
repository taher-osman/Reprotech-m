import React, { useState, useEffect, useMemo } from 'react';
import { 
  Grid, 
  List, 
  Search, 
  Filter, 
  Image as ImageIcon, 
  BarChart3, 
  QrCode, 
  Printer, 
  Download, 
  Upload, 
  Eye, 
  Edit3, 
  Trash2, 
  Plus,
  Settings,
  ScanLine,
  Camera,
  FileImage,
  Package
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { 
  InventoryItem, 
  ViewSettings, 
  PrintableLabel,
  BarcodeGenerationRequest,
  ItemImage,
  ImageUploadRequest
} from '../types/inventoryTypes';
import { barcodeGenerationService } from '../services/barcodeGenerationService';
import { imageManagementService } from '../services/imageManagementService';
import { printableLabelService } from '../services/printableLabelService';

interface InventoryItemGridProps {
  items: InventoryItem[];
  onItemSelect?: (item: InventoryItem) => void;
  onItemEdit?: (item: InventoryItem) => void;
  onItemDelete?: (itemId: string) => void;
  onBulkPrint?: (items: InventoryItem[]) => void;
  selectedItems?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

const InventoryItemGrid: React.FC<InventoryItemGridProps> = ({
  items,
  onItemSelect,
  onItemEdit,
  onItemDelete,
  onBulkPrint,
  selectedItems = [],
  onSelectionChange
}) => {
  // State management
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    viewType: 'GRID',
    itemsPerPage: 24,
    sortBy: 'itemName',
    sortOrder: 'asc',
    filters: [],
    showImages: true,
    showBarcodes: true,
    gridColumns: 4,
    cardSize: 'medium'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [barcodeData, setBarcodeData] = useState<{ [key: string]: string }>({});
  const [imageUploadingItems, setImageUploadingItems] = useState<Set<string>>(new Set());
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [printTemplate, setPrintTemplate] = useState<PrintableLabel | null>(null);

  // Generate barcodes for items
  useEffect(() => {
    const generateBarcodes = async () => {
      const newBarcodeData: { [key: string]: string } = {};
      
      for (const item of items) {
        if (item.barcode && viewSettings.showBarcodes) {
          try {
            const request: BarcodeGenerationRequest = {
              code: item.barcode,
              format: item.barcodeFormat || 'CODE128',
              width: 150,
              height: 40,
              includeText: false,
              fontSize: 8,
              margins: 2,
              backgroundColor: '#FFFFFF',
              foregroundColor: '#000000'
            };

            const result = await barcodeGenerationService.generateBarcode(request);
            if (result.success && result.dataUrl) {
              newBarcodeData[item.id] = result.dataUrl;
            }
          } catch (error) {
            console.error(`Failed to generate barcode for item ${item.id}:`, error);
          }
        }
      }
      
      setBarcodeData(newBarcodeData);
    };

    if (items.length > 0 && viewSettings.showBarcodes) {
      generateBarcodes();
    }
  }, [items, viewSettings.showBarcodes]);

  // Filter and sort items
  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.barcode.includes(searchTerm) ||
        item.preferredSupplier.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === '' || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sort items
    filtered.sort((a, b) => {
      const aValue = a[viewSettings.sortBy as keyof InventoryItem];
      const bValue = b[viewSettings.sortBy as keyof InventoryItem];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return viewSettings.sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return viewSettings.sortOrder === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [items, searchTerm, selectedCategory, viewSettings.sortBy, viewSettings.sortOrder]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(items.map(item => item.category)));
    return uniqueCategories.sort();
  }, [items]);

  // Handle image upload
  const handleImageUpload = async (itemId: string, file: File) => {
    setImageUploadingItems(prev => new Set(prev).add(itemId));

    try {
      const request: ImageUploadRequest = {
        file,
        itemId,
        isPrimary: true
      };

      const result = await imageManagementService.uploadImage(request);
      
      if (result.success && result.image) {
        // In a real implementation, update the item in the parent component
        console.log('Image uploaded successfully:', result.image);
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setImageUploadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  // Handle barcode print
  const handlePrintBarcode = async (item: InventoryItem) => {
    const template = printableLabelService.getTemplate('standard_2x1');
    if (template) {
      await printableLabelService.printLabels(template, [item]);
    }
  };

  // Handle bulk print
  const handleBulkPrint = async () => {
    const selectedItemsData = items.filter(item => selectedItems.includes(item.id));
    if (selectedItemsData.length > 0 && printTemplate) {
      await printableLabelService.printLabels(printTemplate, selectedItemsData);
      setShowPrintDialog(false);
    }
  };

  // Render item based on view type
  const renderItem = (item: InventoryItem) => {
    const isSelected = selectedItems.includes(item.id);
    const primaryImage = item.images.find(img => img.isPrimary) || item.images[0];
    const isImageUploading = imageUploadingItems.has(item.id);

    if (viewSettings.viewType === 'LIST') {
      return (
        <div
          key={item.id}
          className={`flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer ${
            isSelected ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
          }`}
          onClick={() => onItemSelect?.(item)}
        >
          {/* Selection checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              const newSelection = isSelected
                ? selectedItems.filter(id => id !== item.id)
                : [...selectedItems, item.id];
              onSelectionChange?.(newSelection);
            }}
            className="mr-3"
          />

          {/* Image */}
          <div className="w-16 h-16 flex-shrink-0 mr-4">
            {viewSettings.showImages && primaryImage ? (
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

          {/* Item details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">{item.itemName}</h3>
            <p className="text-sm text-gray-500">{item.category}</p>
            <p className="text-xs text-gray-400">Barcode: {item.barcode}</p>
          </div>

          {/* Price */}
          <div className="text-right mr-4">
            <p className="text-sm font-medium text-gray-900">
              ${item.costPrice?.toFixed(2) || '0.00'}
            </p>
            <Badge variant={item.status === 'ACTIVE' ? 'success' : 'secondary'}>
              {item.status}
            </Badge>
          </div>

          {/* Barcode */}
          {viewSettings.showBarcodes && barcodeData[item.id] && (
            <div className="w-24 h-8 mr-4">
              <img
                src={barcodeData[item.id]}
                alt="Barcode"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handlePrintBarcode(item);
              }}
            >
              <Printer className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onItemEdit?.(item);
              }}
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      );
    }

    // Grid/Card view
    const cardSizeClasses = {
      small: 'w-48 h-64',
      medium: 'w-56 h-72',
      large: 'w-64 h-80'
    };

    return (
      <Card
        key={item.id}
        className={`${cardSizeClasses[viewSettings.cardSize]} ${
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
        } hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden`}
        onClick={() => onItemSelect?.(item)}
      >
        {/* Selection checkbox */}
        <div className="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              const newSelection = isSelected
                ? selectedItems.filter(id => id !== item.id)
                : [...selectedItems, item.id];
              onSelectionChange?.(newSelection);
            }}
            className="rounded"
          />
        </div>

        {/* Status badge */}
        <div className="absolute top-2 right-2 z-10">
          <Badge variant={item.status === 'ACTIVE' ? 'success' : 'secondary'}>
            {item.status}
          </Badge>
        </div>

        {/* Image section */}
        <div className="relative h-32 bg-gray-100 overflow-hidden">
          {viewSettings.showImages && primaryImage ? (
            <img
              src={imageManagementService.getImageUrl(primaryImage, 'medium')}
              alt={item.itemName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-16 h-16 text-gray-300" />
            </div>
          )}

          {/* Image upload overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(item.id, file);
                  }
                }}
              />
              <div className="bg-white rounded-full p-2 shadow-lg">
                {isImageUploading ? (
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-5 h-5 text-gray-700" />
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 flex-1 flex flex-col">
          <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">
            {item.itemName}
          </h3>
          
          <p className="text-xs text-gray-500 mb-2">{item.category}</p>
          
          <div className="flex-1 space-y-2">
            {/* Price */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Price:</span>
              <span className="text-sm font-medium">
                ${item.costPrice?.toFixed(2) || '0.00'}
              </span>
            </div>

            {/* Stock info */}
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Min/Max:</span>
              <span className="text-xs">{item.minLevel}/{item.maxLevel}</span>
            </div>

            {/* Supplier */}
            <div className="text-xs text-gray-500 truncate">
              Supplier: {item.preferredSupplier}
            </div>
          </div>

          {/* Barcode */}
          {viewSettings.showBarcodes && barcodeData[item.id] && (
            <div className="mt-2 h-6 bg-white rounded border">
              <img
                src={barcodeData[item.id]}
                alt="Barcode"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* QR Code */}
          {item.qrCode && (
            <div className="absolute bottom-2 right-2 w-8 h-8">
              <QrCode className="w-full h-full text-gray-400" />
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute bottom-2 left-2 flex space-x-1 opacity-0 hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className="bg-white shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              handlePrintBarcode(item);
            }}
          >
            <Printer className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-white shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              onItemEdit?.(item);
            }}
          >
            <Edit3 className="w-3 h-3" />
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-4 rounded-lg border">
        {/* Search and filters */}
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search items, barcodes, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* View controls */}
        <div className="flex items-center space-x-2">
          {/* View type toggle */}
          <div className="flex border rounded-lg">
            <Button
              variant={viewSettings.viewType === 'GRID' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewSettings(prev => ({ ...prev, viewType: 'GRID' }))}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewSettings.viewType === 'LIST' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewSettings(prev => ({ ...prev, viewType: 'LIST' }))}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Show/hide options */}
          <Button
            variant={viewSettings.showImages ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewSettings(prev => ({ ...prev, showImages: !prev.showImages }))}
          >
            <ImageIcon className="w-4 h-4" />
          </Button>

          <Button
            variant={viewSettings.showBarcodes ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewSettings(prev => ({ ...prev, showBarcodes: !prev.showBarcodes }))}
          >
            <ScanLine className="w-4 h-4" />
          </Button>

          {/* Grid columns (only show in grid view) */}
          {viewSettings.viewType === 'GRID' && (
            <select
              value={viewSettings.gridColumns}
              onChange={(e) => setViewSettings(prev => ({ ...prev, gridColumns: parseInt(e.target.value) }))}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value={2}>2 Columns</option>
              <option value={3}>3 Columns</option>
              <option value={4}>4 Columns</option>
              <option value={5}>5 Columns</option>
              <option value={6}>6 Columns</option>
            </select>
          )}

          {/* Card size (only show in grid view) */}
          {viewSettings.viewType === 'GRID' && (
            <select
              value={viewSettings.cardSize}
              onChange={(e) => setViewSettings(prev => ({ ...prev, cardSize: e.target.value as 'small' | 'medium' | 'large' }))}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          )}
        </div>
      </div>

      {/* Selection summary and bulk actions */}
      {selectedItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-blue-700 font-medium">
            {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center space-x-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                const template = printableLabelService.getTemplate('standard_2x1');
                if (template) {
                  setPrintTemplate(template);
                  setShowPrintDialog(true);
                }
              }}
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Labels
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectionChange?.([])}
            >
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      {/* Items grid/list */}
      {viewSettings.viewType === 'GRID' ? (
        <div 
          className={`grid gap-4`}
          style={{
            gridTemplateColumns: `repeat(${viewSettings.gridColumns}, minmax(0, 1fr))`
          }}
        >
          {filteredAndSortedItems.map(renderItem)}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAndSortedItems.map(renderItem)}
        </div>
      )}

      {/* Empty state */}
      {filteredAndSortedItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-500">
            {searchTerm || selectedCategory 
              ? 'Try adjusting your search or filter criteria'
              : 'Start by adding your first inventory item'
            }
          </p>
        </div>
      )}

      {/* Print dialog */}
      {showPrintDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Print Labels</h3>
            <p className="text-gray-600 mb-4">
              Print labels for {selectedItems.length} selected item{selectedItems.length > 1 ? 's' : ''}?
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                onClick={() => setShowPrintDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleBulkPrint}
              >
                Print
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryItemGrid; 