import React, { useState, useEffect } from 'react';
import { 
  X, 
  Package, 
  Barcode, 
  DollarSign, 
  Clock, 
  Camera, 
  Upload, 
  QrCode, 
  Image as ImageIcon,
  FileText,
  Hash,
  Building2
} from 'lucide-react';
import { imageManagementService } from '../services/imageManagementService';
import { qrCodeService } from '../services/qrCodeService';

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
  
  // Enhanced fields
  description?: string;
  specifications?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  tags: string[];
  notes?: string;
  images: any[];
  primaryImageId?: string;
}

interface ItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: any) => void;
  item?: InventoryItem | null;
}

export const ItemForm: React.FC<ItemFormProps> = ({
  isOpen,
  onClose,
  onSave,
  item
}) => {
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    subCategory: '',
    unitOfMeasure: '',
    packageSize: 1,
    modules: [] as string[],
    preferredSupplier: '',
    minLevel: 0,
    maxLevel: 0,
    shelfLife: 0,
    storageConditions: '',
    costPrice: 0,
    salePrice: 0,
    barcode: '',
    qrCode: '',
    status: 'ACTIVE' as const,
    description: '',
    specifications: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    tags: [] as string[],
    notes: '',
    images: [] as any[],
    primaryImageId: ''
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [generatedQR, setGeneratedQR] = useState<string>('');
  const [autoGenerateBarcode, setAutoGenerateBarcode] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'MEDIA', label: 'Culture Media' },
    { value: 'HORMONE', label: 'Hormones' },
    { value: 'REAGENT', label: 'Lab Reagents' },
    { value: 'CONSUMABLE', label: 'Consumables' },
    { value: 'EQUIPMENT', label: 'Equipment' },
    { value: 'CRYO_MATERIAL', label: 'Cryo Materials' },
    { value: 'DRUG', label: 'Pharmaceuticals' }
  ];

  const modules = [
    'IVF', 'EMBRYO_TRANSFER', 'OPU', 'INJECTION', 'SYNCHRONIZATION', 
    'BIOBANK', 'LAB', 'GENOMICS', 'ULTRASOUND', 'CLINICAL'
  ];

  useEffect(() => {
    if (item) {
      setFormData({
        itemName: item.itemName,
        category: item.category,
        subCategory: item.subCategory,
        unitOfMeasure: item.unitOfMeasure,
        packageSize: item.packageSize,
        modules: item.modules,
        preferredSupplier: item.preferredSupplier,
        minLevel: item.minLevel,
        maxLevel: item.maxLevel,
        shelfLife: item.shelfLife,
        storageConditions: item.storageConditions,
        costPrice: item.costPrice,
        salePrice: item.salePrice || 0,
        barcode: item.barcode,
        qrCode: item.qrCode || '',
        status: item.status,
        description: item.description || '',
        specifications: item.specifications || '',
        manufacturer: item.manufacturer || '',
        model: item.model || '',
        serialNumber: item.serialNumber || '',
        tags: item.tags || [],
        notes: item.notes || '',
        images: item.images || [],
        primaryImageId: item.primaryImageId || ''
      });
    } else {
      setFormData({
        itemName: '',
        category: '',
        subCategory: '',
        unitOfMeasure: '',
        packageSize: 1,
        modules: [],
        preferredSupplier: '',
        minLevel: 0,
        maxLevel: 0,
        shelfLife: 0,
        storageConditions: '',
        costPrice: 0,
        salePrice: 0,
        barcode: '',
        qrCode: '',
        status: 'ACTIVE',
        description: '',
        specifications: '',
        manufacturer: '',
        model: '',
        serialNumber: '',
        tags: [],
        notes: '',
        images: [],
        primaryImageId: ''
      });
      setImageFiles([]);
      setPreviewImages([]);
      setGeneratedQR('');
    }
  }, [item, isOpen]);

  // Auto-generate barcode when item name changes
  useEffect(() => {
    if (autoGenerateBarcode && formData.itemName && formData.category) {
      const generatedBarcode = generateBarcode(formData.itemName, formData.category);
      setFormData(prev => ({ ...prev, barcode: generatedBarcode }));
    }
  }, [formData.itemName, formData.category, autoGenerateBarcode]);

  // Generate QR code when barcode changes
  useEffect(() => {
    if (formData.barcode) {
      generateQRCode();
    }
  }, [formData.barcode]);

  const generateBarcode = (itemName: string, category: string): string => {
    const prefix = category.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const nameHash = itemName.replace(/\s+/g, '').substring(0, 3).toUpperCase();
    return `${prefix}-${nameHash}-${timestamp}`;
  };

  const generateQRCode = async () => {
    try {
      const qrData = {
        barcode: formData.barcode,
        itemName: formData.itemName,
        category: formData.category,
        manufacturer: formData.manufacturer,
        timestamp: Date.now()
      };
      
      const qrCode = await qrCodeService.generateQRCode(JSON.stringify(qrData));
      setGeneratedQR(qrCode);
      setFormData(prev => ({ ...prev, qrCode }));
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setImageFiles(prev => [...prev, ...files]);

    // Generate preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.currentTarget;
      const tag = input.value.trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
        input.value = '';
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload images if any
      const uploadedImages = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const result = await imageManagementService.uploadImage({
          file: imageFiles[i],
          itemId: item?.id || 'new',
          isPrimary: i === 0 // First image is primary
        });
        
        if (result.success && result.image) {
          uploadedImages.push(result.image);
        }
      }

      const finalData = {
        ...formData,
        images: [...formData.images, ...uploadedImages],
        primaryImageId: uploadedImages.length > 0 ? uploadedImages[0].id : formData.primaryImageId
      };

      onSave(finalData);
    } catch (error) {
      console.error('Failed to save item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleToggle = (module: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.includes(module)
        ? prev.modules.filter(m => m !== module)
        : [...prev.modules, module]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {item ? 'Edit Item' : 'Add New Item'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(95vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Basic Information */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  Basic Information
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.itemName}
                    onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sub Category
                    </label>
                    <input
                      type="text"
                      value={formData.subCategory}
                      onChange={(e) => setFormData(prev => ({ ...prev, subCategory: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit of Measure
                    </label>
                    <input
                      type="text"
                      value={formData.unitOfMeasure}
                      onChange={(e) => setFormData(prev => ({ ...prev, unitOfMeasure: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      placeholder="e.g., mL, IU, kg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Package Size
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.packageSize}
                      onChange={(e) => setFormData(prev => ({ ...prev, packageSize: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Manufacturer Details */}
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-800 flex items-center">
                    <Building2 className="h-4 w-4 mr-2" />
                    Manufacturer Details
                  </h5>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Manufacturer
                    </label>
                    <input
                      type="text"
                      value={formData.manufacturer}
                      onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Model
                      </label>
                      <input
                        type="text"
                        value={formData.model}
                        onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Serial Number
                      </label>
                      <input
                        type="text"
                        value={formData.serialNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Inventory & Pricing */}
            <div className="space-y-6">
              {/* Inventory Levels */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Inventory Levels
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Level
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.minLevel}
                      onChange={(e) => setFormData(prev => ({ ...prev, minLevel: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Level
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.maxLevel}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxLevel: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shelf Life (days)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.shelfLife}
                    onChange={(e) => setFormData(prev => ({ ...prev, shelfLife: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Storage Conditions
                  </label>
                  <input
                    type="text"
                    value={formData.storageConditions}
                    onChange={(e) => setFormData(prev => ({ ...prev, storageConditions: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., 4°C, Room Temperature"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Supplier
                  </label>
                  <input
                    type="text"
                    value={formData.preferredSupplier}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredSupplier: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Pricing
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cost Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.costPrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, costPrice: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sale Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.salePrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, salePrice: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="DISCONTINUED">Discontinued</option>
                  </select>
                </div>
              </div>

              {/* Modules */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">
                  Associated Modules
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {modules.map(module => (
                    <label key={module} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.modules.includes(module)}
                        onChange={() => handleModuleToggle(module)}
                        className="mr-2 rounded"
                      />
                      <span className="text-sm text-gray-700">{module}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 3: Images, Barcodes & QR */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Product Images
                </h4>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload product images
                        </span>
                        <span className="mt-1 block text-sm text-gray-600">
                          PNG, JPG up to 5MB each
                        </span>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="sr-only"
                      />
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Files
                      </button>
                    </div>
                  </div>
                </div>

                {/* Image Previews */}
                {previewImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Barcode & QR Code */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Barcode className="h-4 w-4 mr-2" />
                  Barcode & QR Code
                </h4>

                <div>
                  <label className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={autoGenerateBarcode}
                      onChange={(e) => setAutoGenerateBarcode(e.target.checked)}
                      className="mr-2 rounded"
                    />
                    <span className="text-sm text-gray-700">Auto-generate barcode</span>
                  </label>
                  
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter or generate barcode"
                  />
                </div>

                {/* QR Code Display */}
                {generatedQR && (
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <QrCode className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Generated QR Code</span>
                    </div>
                    <img 
                      src={generatedQR} 
                      alt="QR Code" 
                      className="mx-auto w-32 h-32 border rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Contains item details and barcode
                    </p>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Hash className="h-4 w-4 mr-2" />
                  Tags
                </h4>

                <div>
                  <input
                    type="text"
                    placeholder="Type and press Enter to add tags"
                    onKeyDown={handleTagInput}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Specifications & Notes */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Additional Details
                </h4>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specifications
                  </label>
                  <textarea
                    value={formData.specifications}
                    onChange={(e) => setFormData(prev => ({ ...prev, specifications: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    rows={3}
                    placeholder="Technical specifications, features, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    rows={3}
                    placeholder="Additional notes, handling instructions, etc."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (item ? 'Update Item' : 'Add Item')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 