import React, { useState, useEffect } from 'react';
import { Heart, X, Save, AlertCircle, Calendar, Clock, RefreshCw, Activity } from 'lucide-react';
import { BullUsageTracker } from './BullUsageTracker';

interface Animal {
  id: string;
  name: string;
  internalNumber: string;
  species: string;
  sex: 'MALE' | 'FEMALE';
}

interface BreedingRecord {
  id?: string;
  breedingID: string;
  donorId: string;
  donorName?: string;
  bullId: string;
  bullName?: string;
  breedingDate: string;
  breedingTime: string;
  method: 'NATURAL' | 'AI' | 'IVF_SEMEN' | 'EMBRYO_TRANSFER';
  operator: string;
  status: 'COMPLETED' | 'FAILED' | 'INCOMPLETE' | 'SCHEDULED';
  attemptNumber: number;
  expectedFlushDate: string;
  quality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  notes: string;
  failureReason?: string;
}

interface BreedingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (breeding: BreedingRecord) => void;
  breeding?: BreedingRecord | null;
  mode: 'create' | 'edit';
  animals: Animal[];
  allRecords?: BreedingRecord[];
}

export const BreedingForm: React.FC<BreedingFormProps> = ({
  isOpen,
  onClose,
  onSave,
  breeding,
  mode,
  animals,
  allRecords = []
}) => {
  const [formData, setFormData] = useState<BreedingRecord>({
    breedingID: '',
    donorId: '',
    bullId: '',
    breedingDate: '',
    breedingTime: '',
    method: 'AI',
    operator: '',
    status: 'SCHEDULED',
    attemptNumber: 1,
    expectedFlushDate: '',
    quality: 'GOOD',
    notes: '',
    failureReason: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  // Predefined options
  const methods = [
    { value: 'NATURAL', label: 'Natural Breeding' },
    { value: 'AI', label: 'Artificial Insemination (AI)' },
    { value: 'IVF_SEMEN', label: 'IVF Semen' },
    { value: 'EMBRYO_TRANSFER', label: 'Embryo Transfer' }
  ];

  const operators = [
    'Dr. Smith',
    'Dr. Johnson',
    'Dr. Williams',
    'Dr. Brown',
    'Vet Tech - Sarah',
    'Vet Tech - Mike',
    'Lab Technician - Ana'
  ];

  const statusOptions = [
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'INCOMPLETE', label: 'Incomplete' }
  ];

  const qualityOptions = [
    { value: 'EXCELLENT', label: 'Excellent' },
    { value: 'GOOD', label: 'Good' },
    { value: 'FAIR', label: 'Fair' },
    { value: 'POOR', label: 'Poor' }
  ];

  const femaleAnimals = animals.filter(a => a.sex === 'FEMALE');
  const maleAnimals = animals.filter(a => a.sex === 'MALE');

  // Calculate bull usage status for dropdown filtering and warnings
  const getBullUsageStatus = (bullId: string) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const bullRecords = allRecords.filter(r => 
      r.bullId === bullId && 
      (r.status === 'COMPLETED' || r.status === 'SCHEDULED')
    );

    const todayUsage = bullRecords.filter(r => 
      new Date(r.breedingDate).toDateString() === today.toDateString()
    ).length;

    const weeklyUsage = bullRecords.filter(r => {
      const recordDate = new Date(r.breedingDate);
      return recordDate >= startOfWeek && recordDate <= today;
    }).length;

    // Calculate consecutive days
    const usageByDate = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      usageByDate.set(dateStr, 0);
    }

    bullRecords.forEach(record => {
      const dateStr = record.breedingDate;
      if (usageByDate.has(dateStr)) {
        usageByDate.set(dateStr, (usageByDate.get(dateStr) || 0) + 1);
      }
    });

    let consecutiveDays = 0;
    const sortedDates = Array.from(usageByDate.keys()).reverse();
    for (const dateStr of sortedDates) {
      if (usageByDate.get(dateStr)! > 0) {
        consecutiveDays++;
      } else {
        break;
      }
    }

    const alerts = [];
    if (todayUsage > 0) {
      alerts.push(`Used ${todayUsage} time${todayUsage > 1 ? 's' : ''} today`);
    }
    if (weeklyUsage >= 4) {
      alerts.push(`${weeklyUsage}/5 weekly uses`);
    }
    if (consecutiveDays >= 3) {
      alerts.push(`${consecutiveDays} consecutive days`);
    }

    return {
      todayUsage,
      weeklyUsage,
      consecutiveDays,
      alerts,
      isOverused: todayUsage > 1 || weeklyUsage > 5 || consecutiveDays >= 3,
      needsRest: consecutiveDays >= 3,
      approachingLimit: weeklyUsage >= 4 && weeklyUsage <= 5
    };
  };

  useEffect(() => {
    if (isOpen) {
      if (breeding && mode === 'edit') {
        setFormData(breeding);
      } else if (breeding && mode === 'create') {
        // For repeat attempts
        setFormData({
          ...breeding,
          id: undefined,
          breedingID: generateBreedingID(),
          breedingDate: new Date().toISOString().split('T')[0],
          breedingTime: new Date().toTimeString().slice(0, 5),
          status: 'SCHEDULED',
          failureReason: ''
        });
      } else {
        // New breeding record
        const today = new Date();
        setFormData({
          breedingID: generateBreedingID(),
          donorId: '',
          bullId: '',
          breedingDate: today.toISOString().split('T')[0],
          breedingTime: today.toTimeString().slice(0, 5),
          method: 'AI',
          operator: '',
          status: 'SCHEDULED',
          attemptNumber: 1,
          expectedFlushDate: '',
          quality: 'GOOD',
          notes: '',
          failureReason: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, breeding, mode]);

  // Auto-calculate expected flush date when breeding date changes
  useEffect(() => {
    if (formData.breedingDate) {
      const breedingDate = new Date(formData.breedingDate);
      const flushDate = new Date(breedingDate);
      flushDate.setDate(flushDate.getDate() + 7); // 7 days after breeding
      setFormData(prev => ({
        ...prev,
        expectedFlushDate: flushDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.breedingDate]);

  const generateBreedingID = () => {
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-6);
    return `BR-${year}-${timestamp}`;
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.breedingID.trim()) newErrors.breedingID = 'Breeding ID is required';
    if (!formData.donorId) newErrors.donorId = 'Donor animal is required';
    if (!formData.bullId) newErrors.bullId = 'Bull is required';
    if (!formData.breedingDate) newErrors.breedingDate = 'Breeding date is required';
    if (!formData.breedingTime) newErrors.breedingTime = 'Breeding time is required';
    if (!formData.operator.trim()) newErrors.operator = 'Operator is required';
    
    // Validate breeding date is not in future beyond today
    const today = new Date();
    const breedingDate = new Date(formData.breedingDate);
    if (breedingDate > today) {
      newErrors.breedingDate = 'Breeding date cannot be in the future';
    }

    // Validate attempt number
    if (formData.attemptNumber < 1 || formData.attemptNumber > 10) {
      newErrors.attemptNumber = 'Attempt number must be between 1 and 10';
    }

    // Require failure reason for failed/incomplete breedings
    if ((formData.status === 'FAILED' || formData.status === 'INCOMPLETE') && !formData.failureReason?.trim()) {
      newErrors.failureReason = 'Failure reason is required for failed/incomplete breedings';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Add donor and bull names for display
      const donorAnimal = animals.find(a => a.id === formData.donorId);
      const bullAnimal = animals.find(a => a.id === formData.bullId);
      
      const submitData = {
        ...formData,
        donorName: donorAnimal?.name || '',
        bullName: bullAnimal?.name || '',
        id: mode === 'edit' ? formData.id : Date.now().toString()
      };

      await onSave(submitData);
      onClose();
    } catch (error) {
      console.error('Error saving breeding record:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof BreedingRecord, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePreviousAttempts = () => {
    if (formData.donorId && formData.bullId) {
      // This would normally query the database for previous attempts
      alert(`Previous breeding attempts for this donor-bull combination:\n\nThis feature will show historical breeding records to help track repeated attempts and success rates.`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Heart className="h-6 w-6 text-pink-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'edit' ? 'Edit Breeding Record' : 'New Breeding Record'}
            </h2>
            {formData.attemptNumber > 1 && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                Attempt #{formData.attemptNumber}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Breeding ID *
              </label>
              <input
                type="text"
                value={formData.breedingID}
                onChange={(e) => handleChange('breedingID', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.breedingID ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Auto-generated"
              />
              {errors.breedingID && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.breedingID}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Donor Animal (Female) *
              </label>
              <select
                value={formData.donorId}
                onChange={(e) => handleChange('donorId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.donorId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select donor animal</option>
                {femaleAnimals.map(animal => (
                  <option key={animal.id} value={animal.id}>
                    {animal.name} ({animal.internalNumber}) - {animal.species}
                  </option>
                ))}
              </select>
              {errors.donorId && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.donorId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bull (Male) *
              </label>
              <select
                value={formData.bullId}
                onChange={(e) => handleChange('bullId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.bullId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select bull</option>
                {maleAnimals
                  .sort((a, b) => {
                    // Sort by usage status: healthy bulls first, then by name
                    const aStatus = getBullUsageStatus(a.id);
                    const bStatus = getBullUsageStatus(b.id);
                    
                    if (aStatus.isOverused && !bStatus.isOverused) return 1;
                    if (!aStatus.isOverused && bStatus.isOverused) return -1;
                    
                    return a.name.localeCompare(b.name);
                  })
                  .map(animal => {
                    const usageStatus = getBullUsageStatus(animal.id);
                    const statusIndicator = usageStatus.isOverused ? '⚠️ ' : 
                                          usageStatus.approachingLimit ? '⚡ ' : 
                                          usageStatus.todayUsage > 0 ? '📅 ' : '';
                    
                    return (
                      <option 
                        key={animal.id} 
                        value={animal.id}
                        style={{ 
                          color: usageStatus.isOverused ? '#DC2626' : 
                                usageStatus.approachingLimit ? '#D97706' : 'inherit' 
                        }}
                      >
                        {statusIndicator}{animal.name} ({animal.internalNumber}) - {animal.species}
                        {usageStatus.alerts.length > 0 && ` - ${usageStatus.alerts[0]}`}
                      </option>
                    );
                  })}
              </select>
              {errors.bullId && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.bullId}
                </p>
              )}
              
              {/* Bull Usage Warning */}
              {formData.bullId && (
                <div className="mt-2">
                  <BullUsageTracker 
                    records={allRecords}
                    selectedBullId={formData.bullId}
                    compact={true}
                  />
                </div>
              )}
              
              {/* Bull Selection Legend */}
              <div className="mt-1 text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>📅 Used today</span>
                  <span>⚡ Approaching limit</span>
                  <span>⚠️ Overused</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Breeding Date *
              </label>
              <input
                type="date"
                value={formData.breedingDate}
                onChange={(e) => handleChange('breedingDate', e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.breedingDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.breedingDate && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.breedingDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Breeding Time *
              </label>
              <input
                type="time"
                value={formData.breedingTime}
                onChange={(e) => handleChange('breedingTime', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.breedingTime ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.breedingTime && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.breedingTime}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Breeding Method *
              </label>
              <select
                value={formData.method}
                onChange={(e) => handleChange('method', e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                {methods.map(method => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operator (Vet/Staff) *
              </label>
              <select
                value={formData.operator}
                onChange={(e) => handleChange('operator', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.operator ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select operator</option>
                {operators.map(operator => (
                  <option key={operator} value={operator}>
                    {operator}
                  </option>
                ))}
              </select>
              {errors.operator && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.operator}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attempt Number
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.attemptNumber}
                onChange={(e) => handleChange('attemptNumber', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.attemptNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.attemptNumber && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.attemptNumber}
                </p>
              )}
            </div>
          </div>

          {/* Expected Flush Date & Quality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Flush Date (Auto-calculated)
              </label>
              <div className="relative">
                <Calendar className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={formData.expectedFlushDate}
                  onChange={(e) => handleChange('expectedFlushDate', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-gray-50"
                  readOnly
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Automatically set to 7 days after breeding date
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quality Assessment
              </label>
              <select
                value={formData.quality}
                onChange={(e) => handleChange('quality', e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                {qualityOptions.map(quality => (
                  <option key={quality.value} value={quality.value}>
                    {quality.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Failure Reason - only show for failed/incomplete */}
          {(formData.status === 'FAILED' || formData.status === 'INCOMPLETE') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Failure/Issue Reason *
              </label>
              <select
                value={formData.failureReason || ''}
                onChange={(e) => handleChange('failureReason', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.failureReason ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select reason</option>
                <option value="Animal rejected mounting">Animal rejected mounting</option>
                <option value="Bull refused service">Bull refused service</option>
                <option value="Poor semen quality">Poor semen quality</option>
                <option value="Behavioral issues">Behavioral issues</option>
                <option value="Equipment malfunction">Equipment malfunction</option>
                <option value="Environmental factors">Environmental factors</option>
                <option value="Health concerns">Health concerns</option>
                <option value="Timing issues">Timing issues</option>
                <option value="Other">Other (specify in notes)</option>
              </select>
              {errors.failureReason && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.failureReason}
                </p>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes & Observations
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Record any observations, issues, or additional information..."
            />
          </div>

          {/* Previous Attempts Info */}
          {formData.donorId && formData.bullId && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-blue-900">
                    Bull Assignment Tracking
                  </h4>
                  <p className="text-sm text-blue-700">
                    This bull assignment will persist through flushing and embryo transfer until pregnancy confirmation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handlePreviousAttempts}
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="text-sm">View Previous Attempts</span>
                </button>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-pink-600 border border-transparent rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? 'Saving...' : mode === 'edit' ? 'Update Record' : 'Create Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 