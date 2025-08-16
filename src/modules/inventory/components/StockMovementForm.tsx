import React, { useState, useEffect } from 'react';
import { X, TrendingUp, Save, AlertCircle, Search, Package, User, Calendar, FileText } from 'lucide-react';

interface StockMovement {
  id?: string;
  type: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT' | 'TRANSFER' | 'WASTE' | 'CONSUMPTION';
  batchId: string;
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
}

interface StockMovementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (movement: StockMovement) => void;
  stockBatches: any[];
  storageLocations: any[];
  animals?: any[];
  defaultType?: string;
  defaultBatchId?: string;
}

export const StockMovementForm: React.FC<StockMovementFormProps> = ({
  isOpen,
  onClose,
  onSave,
  stockBatches,
  storageLocations,
  animals = [],
  defaultType = 'STOCK_OUT',
  defaultBatchId = ''
}) => {
  const [formData, setFormData] = useState<Partial<StockMovement>>({
    type: defaultType as any,
    batchId: defaultBatchId,
    quantity: 1,
    unitOfMeasure: '',
    costPerUnit: 0,
    totalCost: 0,
    reference: '',
    linkedModule: '',
    linkedProcedure: '',
    linkedAnimalId: '',
    fromLocationId: '',
    toLocationId: '',
    staffId: 'current-user',
    staffName: 'Current User',
    movementDate: new Date().toISOString().split('T')[0],
    notes: '',
    reason: '',
    isAutomated: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [animalSearch, setAnimalSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const movementTypes = [
    { 
      value: 'STOCK_IN', 
      label: 'Stock In', 
      icon: '📥', 
      color: 'bg-green-100 text-green-800',
      description: 'Add stock to inventory'
    },
    { 
      value: 'STOCK_OUT', 
      label: 'Stock Out', 
      icon: '📤', 
      color: 'bg-red-100 text-red-800',
      description: 'Remove stock from inventory'
    },
    { 
      value: 'CONSUMPTION', 
      label: 'Usage/Consumption', 
      icon: '💉', 
      color: 'bg-blue-100 text-blue-800',
      description: 'Used in procedures'
    },
    { 
      value: 'TRANSFER', 
      label: 'Location Transfer', 
      icon: '🔄', 
      color: 'bg-purple-100 text-purple-800',
      description: 'Move between locations'
    },
    { 
      value: 'ADJUSTMENT', 
      label: 'Stock Adjustment', 
      icon: '⚖️', 
      color: 'bg-orange-100 text-orange-800',
      description: 'Correct stock levels'
    },
    { 
      value: 'WASTE', 
      label: 'Waste/Expired', 
      icon: '🗑️', 
      color: 'bg-gray-100 text-gray-800',
      description: 'Mark as waste or expired'
    }
  ];

  const modules = [
    'IVF',
    'EMBRYO_TRANSFER',
    'OPU',
    'INJECTION',
    'SYNCHRONIZATION',
    'ULTRASOUND',
    'LABORATORY',
    'BIOBANK',
    'PHARMACY',
    'CLINICAL',
    'GENOMICS'
  ];

  const procedures = [
    'Superovulation Protocol',
    'Embryo Transfer',
    'OPU (Oocyte Pickup)',
    'IVF Procedure',
    'ICSI Treatment',
    'Embryo Freezing',
    'Semen Processing',
    'Synchronization',
    'Pregnancy Diagnosis',
    'Vaccination',
    'Treatment',
    'Laboratory Analysis',
    'Quality Control',
    'Research',
    'Training',
    'Maintenance',
    'Other'
  ];

  const adjustmentReasons = [
    'Physical Count Correction',
    'Damaged Goods',
    'Expiry Date Correction',
    'System Error Correction',
    'Theft/Loss',
    'Quality Issue',
    'Supplier Return',
    'Internal Use',
    'Sample Testing',
    'Training Use',
    'Other'
  ];

  useEffect(() => {
    if (formData.batchId) {
      const batch = stockBatches.find(b => b.id === formData.batchId);
      setSelectedBatch(batch);
      if (batch) {
        setFormData(prev => ({
          ...prev,
          unitOfMeasure: batch.unitOfMeasure,
          costPerUnit: batch.costPerUnit || 0,
          fromLocationId: batch.storageLocationId
        }));
      }
    }
  }, [formData.batchId, stockBatches]);

  useEffect(() => {
    if (formData.quantity && formData.costPerUnit) {
      setFormData(prev => ({
        ...prev,
        totalCost: Number((prev.quantity || 0) * (prev.costPerUnit || 0))
      }));
    }
  }, [formData.quantity, formData.costPerUnit]);

  useEffect(() => {
    if (!formData.reference && formData.type) {
      const timestamp = Date.now().toString().slice(-6);
      const typePrefix = formData.type.substring(0, 2);
      setFormData(prev => ({
        ...prev,
        reference: `${typePrefix}-${timestamp}`
      }));
    }
  }, [formData.type]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.type) newErrors.type = 'Movement type is required';
    if (!formData.batchId) newErrors.batchId = 'Stock batch is required';
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    if (!formData.reference) newErrors.reference = 'Reference is required';

    // Validate stock availability
    if (selectedBatch && (formData.type === 'STOCK_OUT' || formData.type === 'CONSUMPTION' || formData.type === 'WASTE')) {
      if ((formData.quantity || 0) > selectedBatch.quantityInStock) {
        newErrors.quantity = `Insufficient stock. Available: ${selectedBatch.quantityInStock} ${selectedBatch.unitOfMeasure}`;
      }
    }

    // Validate transfer locations
    if (formData.type === 'TRANSFER') {
      if (!formData.fromLocationId) newErrors.fromLocationId = 'From location is required';
      if (!formData.toLocationId) newErrors.toLocationId = 'To location is required';
      if (formData.fromLocationId === formData.toLocationId) {
        newErrors.toLocationId = 'To location must be different from from location';
      }
    }

    // Validate reason for adjustments
    if (formData.type === 'ADJUSTMENT' && !formData.reason) {
      newErrors.reason = 'Reason is required for adjustments';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const movement: StockMovement = {
        ...formData,
        movementDate: new Date().toISOString(),
        totalCost: (formData.quantity || 0) * (formData.costPerUnit || 0)
      } as StockMovement;

      onSave(movement);
    } catch (error) {
      console.error('Error saving movement:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const filteredAnimals = animals.filter(animal =>
    animal.name?.toLowerCase().includes(animalSearch.toLowerCase()) ||
    animal.animalID?.toLowerCase().includes(animalSearch.toLowerCase())
  );

  const selectedMovementType = movementTypes.find(t => t.value === formData.type);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Record Stock Movement</h2>
            <p className="text-sm text-gray-500 mt-1">
              Track inventory movements with full audit trail
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Movement Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Movement Type *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {movementTypes.map(type => (
                <label
                  key={type.value}
                  className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                    formData.type === type.value
                      ? 'border-teal-600 ring-2 ring-teal-600'
                      : 'border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    checked={formData.type === type.value}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{type.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
          </div>

          {/* Batch and Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Batch *
              </label>
              <select
                value={formData.batchId}
                onChange={(e) => handleInputChange('batchId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                  errors.batchId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select batch...</option>
                {stockBatches.map(batch => (
                  <option key={batch.id} value={batch.id}>
                    {batch.item?.itemName} - {batch.batchNumber} 
                    (Available: {batch.quantityInStock} {batch.unitOfMeasure})
                  </option>
                ))}
              </select>
              {errors.batchId && <p className="mt-1 text-sm text-red-600">{errors.batchId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', Number(e.target.value))}
                  min="0"
                  step="0.01"
                  className={`flex-1 px-3 py-2 border rounded-l-lg focus:ring-2 focus:ring-teal-500 ${
                    errors.quantity ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-r-lg">
                  {formData.unitOfMeasure || 'units'}
                </span>
              </div>
              {selectedBatch && (
                <p className="mt-1 text-xs text-gray-500">
                  Available: {selectedBatch.quantityInStock} {selectedBatch.unitOfMeasure}
                </p>
              )}
              {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
            </div>
          </div>

          {/* Reference and Cost */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference Number *
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => handleInputChange('reference', e.target.value)}
                placeholder="Auto-generated"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                  errors.reference ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.reference && <p className="mt-1 text-sm text-red-600">{errors.reference}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cost per Unit
              </label>
              <input
                type="number"
                value={formData.costPerUnit}
                onChange={(e) => handleInputChange('costPerUnit', Number(e.target.value))}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                readOnly
              />
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

          {/* Transfer Locations (only for transfers) */}
          {formData.type === 'TRANSFER' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Location *
                </label>
                <select
                  value={formData.fromLocationId}
                  onChange={(e) => handleInputChange('fromLocationId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                    errors.fromLocationId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select location...</option>
                  {storageLocations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name} ({location.locationCode})
                    </option>
                  ))}
                </select>
                {errors.fromLocationId && <p className="mt-1 text-sm text-red-600">{errors.fromLocationId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Location *
                </label>
                <select
                  value={formData.toLocationId}
                  onChange={(e) => handleInputChange('toLocationId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                    errors.toLocationId ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select location...</option>
                  {storageLocations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name} ({location.locationCode})
                    </option>
                  ))}
                </select>
                {errors.toLocationId && <p className="mt-1 text-sm text-red-600">{errors.toLocationId}</p>}
              </div>
            </div>
          )}

          {/* Reason (for adjustments) */}
          {formData.type === 'ADJUSTMENT' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adjustment Reason *
              </label>
              <select
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                  errors.reason ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select reason...</option>
                {adjustmentReasons.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
              {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
            </div>
          )}

          {/* Procedure Linking */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Linked Module
              </label>
              <select
                value={formData.linkedModule}
                onChange={(e) => handleInputChange('linkedModule', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select module...</option>
                {modules.map(module => (
                  <option key={module} value={module}>{module}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Linked Procedure
              </label>
              <select
                value={formData.linkedProcedure}
                onChange={(e) => handleInputChange('linkedProcedure', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select procedure...</option>
                {procedures.map(procedure => (
                  <option key={procedure} value={procedure}>{procedure}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Animal Linking */}
          {animals.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Linked Animal (Optional)
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search animals..."
                  value={animalSearch}
                  onChange={(e) => setAnimalSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              {animalSearch && (
                <div className="mt-2 max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                  {filteredAnimals.slice(0, 5).map(animal => (
                    <button
                      key={animal.id}
                      type="button"
                      onClick={() => {
                        handleInputChange('linkedAnimalId', animal.id);
                        setAnimalSearch(`${animal.name} (${animal.animalID})`);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="text-sm font-medium text-gray-900">{animal.name}</div>
                      <div className="text-xs text-gray-500">{animal.animalID}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              placeholder="Additional notes about this movement..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Summary Box */}
          {selectedBatch && selectedMovementType && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Movement Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${selectedMovementType.color}`}>
                    {selectedMovementType.label}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Item:</span>
                  <span className="ml-2 font-medium">{selectedBatch.item?.itemName}</span>
                </div>
                <div>
                  <span className="text-gray-500">Batch:</span>
                  <span className="ml-2">{selectedBatch.batchNumber}</span>
                </div>
                <div>
                  <span className="text-gray-500">Amount:</span>
                  <span className="ml-2 font-medium">
                    {formData.quantity} {formData.unitOfMeasure}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Processing...' : 'Record Movement'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 