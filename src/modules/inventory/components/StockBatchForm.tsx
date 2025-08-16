import React, { useState, useEffect } from 'react';
import { X, Package2, Save, AlertCircle, Calendar, MapPin, Thermometer, Truck } from 'lucide-react';

interface StockBatch {
  id?: string;
  itemId: string;
  batchNumber: string;
  lotNumber?: string;
  quantityReceived: number;
  quantityInStock: number;
  unitOfMeasure: string;
  costPerUnit: number;
  totalCost: number;
  supplier: string;
  purchaseOrderNumber?: string;
  receivedDate: string;
  expiryDate?: string;
  manufacturingDate?: string;
  storageLocationId: string;
  storageConditions: string;
  status: 'AVAILABLE' | 'RESERVED' | 'EXPIRED' | 'RECALLED' | 'QUARANTINE';
  qcStatus: 'PENDING' | 'PASSED' | 'FAILED' | 'NOT_REQUIRED';
  notes?: string;
  createdBy: string;
}

interface StockBatchFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (batch: StockBatch) => void;
  batch?: StockBatch;
  inventoryItems: any[];
  storageLocations: any[];
  mode: 'add' | 'edit';
}

export const StockBatchForm: React.FC<StockBatchFormProps> = ({
  isOpen,
  onClose,
  onSave,
  batch,
  inventoryItems,
  storageLocations,
  mode
}) => {
  const [formData, setFormData] = useState<Partial<StockBatch>>({
    itemId: batch?.itemId || '',
    batchNumber: batch?.batchNumber || '',
    lotNumber: batch?.lotNumber || '',
    quantityReceived: batch?.quantityReceived || 0,
    quantityInStock: batch?.quantityInStock || 0,
    unitOfMeasure: batch?.unitOfMeasure || '',
    costPerUnit: batch?.costPerUnit || 0,
    totalCost: batch?.totalCost || 0,
    supplier: batch?.supplier || '',
    purchaseOrderNumber: batch?.purchaseOrderNumber || '',
    receivedDate: batch?.receivedDate || new Date().toISOString().split('T')[0],
    expiryDate: batch?.expiryDate || '',
    manufacturingDate: batch?.manufacturingDate || '',
    storageLocationId: batch?.storageLocationId || '',
    storageConditions: batch?.storageConditions || '',
    status: batch?.status || 'AVAILABLE',
    qcStatus: batch?.qcStatus || 'NOT_REQUIRED',
    notes: batch?.notes || '',
    createdBy: batch?.createdBy || 'Current User'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const suppliers = [
    'Life Technologies',
    'Vetoquinol',
    'CryoTech Industries',
    'Thermo Fisher Scientific',
    'Sigma-Aldrich',
    'Merck Millipore',
    'BD Biosciences',
    'Beckman Coulter',
    'Eppendorf',
    'Corning'
  ];

  const storageConditionOptions = [
    'Room Temperature (15-25°C)',
    'Refrigerated (2-8°C)',
    'Frozen (-20°C)',
    'Ultra-frozen (-80°C)',
    'Liquid Nitrogen (-196°C)',
    'Controlled Room Temperature',
    'Dry Storage',
    'Dark Storage'
  ];

  useEffect(() => {
    if (formData.itemId) {
      const item = inventoryItems.find(i => i.id === formData.itemId);
      setSelectedItem(item);
      if (item) {
        setFormData(prev => ({
          ...prev,
          unitOfMeasure: item.unitOfMeasure,
          storageConditions: item.storageConditions
        }));
      }
    }
  }, [formData.itemId, inventoryItems]);

  useEffect(() => {
    if (formData.quantityReceived && formData.costPerUnit) {
      setFormData(prev => ({
        ...prev,
        totalCost: Number((prev.quantityReceived || 0) * (prev.costPerUnit || 0)),
        quantityInStock: mode === 'add' ? prev.quantityReceived : prev.quantityInStock
      }));
    }
  }, [formData.quantityReceived, formData.costPerUnit, mode]);

  useEffect(() => {
    if (formData.manufacturingDate && selectedItem?.shelfLife) {
      const mfgDate = new Date(formData.manufacturingDate);
      const expiryDate = new Date(mfgDate.getTime() + (selectedItem.shelfLife * 24 * 60 * 60 * 1000));
      setFormData(prev => ({
        ...prev,
        expiryDate: expiryDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.manufacturingDate, selectedItem]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.itemId) newErrors.itemId = 'Item is required';
    if (!formData.batchNumber) newErrors.batchNumber = 'Batch number is required';
    if (!formData.quantityReceived || formData.quantityReceived <= 0) {
      newErrors.quantityReceived = 'Quantity must be greater than 0';
    }
    if (!formData.costPerUnit || formData.costPerUnit <= 0) {
      newErrors.costPerUnit = 'Cost per unit must be greater than 0';
    }
    if (!formData.supplier) newErrors.supplier = 'Supplier is required';
    if (!formData.storageLocationId) newErrors.storageLocationId = 'Storage location is required';

    // Check expiry date logic
    if (formData.expiryDate && formData.receivedDate) {
      const expiry = new Date(formData.expiryDate);
      const received = new Date(formData.receivedDate);
      if (expiry <= received) {
        newErrors.expiryDate = 'Expiry date must be after received date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Generate batch number if not provided
    if (!formData.batchNumber) {
      const timestamp = Date.now();
      const itemCode = selectedItem?.itemName.substring(0, 3).toUpperCase() || 'ITM';
      setFormData(prev => ({ ...prev, batchNumber: `${itemCode}-${timestamp}` }));
    }

    onSave(formData as StockBatch);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const getDaysUntilExpiry = () => {
    if (!formData.expiryDate) return null;
    const expiry = new Date(formData.expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilExpiry = getDaysUntilExpiry();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'add' ? 'Add New Stock Batch' : 'Edit Stock Batch'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {mode === 'add' ? 'Receive new inventory into stock' : 'Update existing batch information'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inventory Item *
              </label>
              <select
                value={formData.itemId}
                onChange={(e) => handleInputChange('itemId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                  errors.itemId ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={mode === 'edit'}
              >
                <option value="">Select item...</option>
                {inventoryItems.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.itemName} ({item.barcode})
                  </option>
                ))}
              </select>
              {errors.itemId && <p className="mt-1 text-sm text-red-600">{errors.itemId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Number *
              </label>
              <input
                type="text"
                value={formData.batchNumber}
                onChange={(e) => handleInputChange('batchNumber', e.target.value)}
                placeholder="Auto-generated if empty"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                  errors.batchNumber ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.batchNumber && <p className="mt-1 text-sm text-red-600">{errors.batchNumber}</p>}
            </div>
          </div>

          {/* Quantity and Cost */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity Received *
              </label>
              <input
                type="number"
                value={formData.quantityReceived}
                onChange={(e) => handleInputChange('quantityReceived', Number(e.target.value))}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                  errors.quantityReceived ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.quantityReceived && <p className="mt-1 text-sm text-red-600">{errors.quantityReceived}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit of Measure
              </label>
              <input
                type="text"
                value={formData.unitOfMeasure}
                onChange={(e) => handleInputChange('unitOfMeasure', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost per Unit *
              </label>
              <input
                type="number"
                value={formData.costPerUnit}
                onChange={(e) => handleInputChange('costPerUnit', Number(e.target.value))}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                  errors.costPerUnit ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.costPerUnit && <p className="mt-1 text-sm text-red-600">{errors.costPerUnit}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Cost
              </label>
              <input
                type="text"
                value={`$${formData.totalCost?.toFixed(2) || '0.00'}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
            </div>
          </div>

          {/* Supplier and Purchase Order */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier *
              </label>
              <select
                value={formData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                  errors.supplier ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select supplier...</option>
                {suppliers.map(supplier => (
                  <option key={supplier} value={supplier}>{supplier}</option>
                ))}
              </select>
              {errors.supplier && <p className="mt-1 text-sm text-red-600">{errors.supplier}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchase Order Number
              </label>
              <input
                type="text"
                value={formData.purchaseOrderNumber}
                onChange={(e) => handleInputChange('purchaseOrderNumber', e.target.value)}
                placeholder="PO-2025-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lot Number
              </label>
              <input
                type="text"
                value={formData.lotNumber}
                onChange={(e) => handleInputChange('lotNumber', e.target.value)}
                placeholder="Supplier lot number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Received Date
              </label>
              <input
                type="date"
                value={formData.receivedDate}
                onChange={(e) => handleInputChange('receivedDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manufacturing Date
              </label>
              <input
                type="date"
                value={formData.manufacturingDate}
                onChange={(e) => handleInputChange('manufacturingDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
                {daysUntilExpiry !== null && (
                  <span className={`ml-2 text-xs ${
                    daysUntilExpiry < 30 ? 'text-red-600' : 
                    daysUntilExpiry < 90 ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    ({daysUntilExpiry} days)
                  </span>
                )}
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                  errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
            </div>
          </div>

          {/* Storage and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Storage Location *
              </label>
              <select
                value={formData.storageLocationId}
                onChange={(e) => handleInputChange('storageLocationId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                  errors.storageLocationId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select location...</option>
                {storageLocations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name} ({location.locationCode})
                  </option>
                ))}
              </select>
              {errors.storageLocationId && <p className="mt-1 text-sm text-red-600">{errors.storageLocationId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Storage Conditions
              </label>
              <select
                value={formData.storageConditions}
                onChange={(e) => handleInputChange('storageConditions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                {storageConditionOptions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Status and QC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="QUARANTINE">Quarantine</option>
                <option value="EXPIRED">Expired</option>
                <option value="RECALLED">Recalled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality Control Status
              </label>
              <select
                value={formData.qcStatus}
                onChange={(e) => handleInputChange('qcStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="NOT_REQUIRED">Not Required</option>
                <option value="PENDING">Pending</option>
                <option value="PASSED">Passed</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              placeholder="Additional notes about this batch..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{mode === 'add' ? 'Create Batch' : 'Update Batch'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 