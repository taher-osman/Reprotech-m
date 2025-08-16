import React, { useState, useEffect } from 'react';
import { X, Save, Heart, Calendar, AlertCircle, CheckCircle, Clock, Baby } from 'lucide-react';
import { format } from 'date-fns';
import { PregnancyCheckpoint } from '../types/transferTypes';

interface PregnancyStatusFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  checkpoint: PregnancyCheckpoint;
  transferId: string;
  recipientName: string;
  transferDate: Date;
}

const PregnancyStatusForm: React.FC<PregnancyStatusFormProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  checkpoint,
  transferId,
  recipientName,
  transferDate
}) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const [formData, setFormData] = useState({
    result: checkpoint.result || 'UNKNOWN',
    actualDate: checkpoint.actualDate ? format(new Date(checkpoint.actualDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    actualTime: checkpoint.actualDate ? format(new Date(checkpoint.actualDate), 'HH:mm') : '09:00',
    confidence: checkpoint.confidence || 90,
    notes: checkpoint.notes || '',
    complications: checkpoint.complications?.join(', ') || '',
    followUpRequired: checkpoint.followUpRequired || false,
    nextCheckDate: checkpoint.nextCheckDate ? format(new Date(checkpoint.nextCheckDate), 'yyyy-MM-dd') : '',
    updatedBy: 'Current User' // This would come from auth context
  });

  useEffect(() => {
    if (isOpen && checkpoint) {
      setFormData({
        result: checkpoint.result || 'UNKNOWN',
        actualDate: checkpoint.actualDate ? format(new Date(checkpoint.actualDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        actualTime: checkpoint.actualDate ? format(new Date(checkpoint.actualDate), 'HH:mm') : '09:00',
        confidence: checkpoint.confidence || 90,
        notes: checkpoint.notes || '',
        complications: checkpoint.complications?.join(', ') || '',
        followUpRequired: checkpoint.followUpRequired || false,
        nextCheckDate: checkpoint.nextCheckDate ? format(new Date(checkpoint.nextCheckDate), 'yyyy-MM-dd') : '',
        updatedBy: 'Current User'
      });
    }
  }, [isOpen, checkpoint]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.result || formData.result === 'UNKNOWN') {
      newErrors.result = 'Please select a result';
    }
    if (!formData.actualDate) {
      newErrors.actualDate = 'Actual date is required';
    }
    if (formData.followUpRequired && !formData.nextCheckDate) {
      newErrors.nextCheckDate = 'Next check date is required when follow-up is needed';
    }
    if (formData.confidence < 0 || formData.confidence > 100) {
      newErrors.confidence = 'Confidence must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const actualDateTime = new Date(`${formData.actualDate}T${formData.actualTime}`);
      
      const updatedCheckpoint: PregnancyCheckpoint = {
        ...checkpoint,
        performed: true,
        result: formData.result as any,
        actualDate: actualDateTime,
        confidence: formData.confidence,
        notes: formData.notes,
        complications: formData.complications ? formData.complications.split(',').map(c => c.trim()) : [],
        followUpRequired: formData.followUpRequired,
        nextCheckDate: formData.nextCheckDate ? new Date(formData.nextCheckDate) : undefined,
        updatedBy: formData.updatedBy,
        updatedAt: new Date()
      };

      // This would call the API to update the pregnancy checkpoint
      // await api.updatePregnancyCheckpoint(transferId, checkpoint.id, updatedCheckpoint);
      
      console.log('Updated checkpoint:', updatedCheckpoint);
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating pregnancy status:', error);
      alert('Failed to update pregnancy status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'PREGNANT': return 'text-green-600 bg-green-50 border-green-200';
      case 'NOT_PREGNANT': return 'text-red-600 bg-red-50 border-red-200';
      case 'DELIVERED': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'ABORTED': case 'DIED': return 'text-red-600 bg-red-50 border-red-200';
      case 'RECHECK': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCheckpointIcon = () => {
    if (checkpoint.isParturition) return Baby;
    return Heart;
  };

  const CheckpointIcon = getCheckpointIcon();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${checkpoint.isParturition ? 'bg-blue-100' : 'bg-pink-100'}`}>
              <CheckpointIcon className={`h-6 w-6 ${checkpoint.isParturition ? 'text-blue-600' : 'text-pink-600'}`} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Update Pregnancy Status
              </h2>
              <p className="text-sm text-gray-600">
                {checkpoint.title} • {recipientName} • {transferId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Checkpoint Info Banner */}
        <div className="p-4 bg-blue-50 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Scheduled Date:</span>
              <p className="text-blue-600">{format(new Date(checkpoint.scheduledDate), 'MMM dd, yyyy')}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Days from Transfer:</span>
              <p className="text-blue-600">{checkpoint.daysFromTransfer} days</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Transfer Date:</span>
              <p className="text-blue-600">{format(new Date(transferDate), 'MMM dd, yyyy')}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Result Selection */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Check Result
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Result *
                </label>
                <select
                  value={formData.result}
                  onChange={(e) => handleChange('result', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.result ? 'border-red-500' : 'border-gray-300'
                  } ${getResultColor(formData.result)}`}
                >
                  <option value="UNKNOWN">Select Result</option>
                  {checkpoint.isParturition ? (
                    <>
                      <option value="DELIVERED">Delivered</option>
                      <option value="ABORTED">Aborted</option>
                      <option value="DIED">Died</option>
                    </>
                  ) : (
                    <>
                      <option value="PREGNANT">Pregnant</option>
                      <option value="NOT_PREGNANT">Not Pregnant</option>
                      <option value="RECHECK">Recheck Required</option>
                    </>
                  )}
                </select>
                {errors.result && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.result}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confidence Level (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.confidence}
                  onChange={(e) => handleChange('confidence', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.confidence ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.confidence && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.confidence}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Check Date & Time
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Actual Date *
                </label>
                <input
                  type="date"
                  value={formData.actualDate}
                  onChange={(e) => handleChange('actualDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    errors.actualDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.actualDate && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.actualDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.actualTime}
                  onChange={(e) => handleChange('actualTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Notes & Complications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes & Observations
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Record any observations, measurements, or additional notes..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complications (comma-separated)
            </label>
            <input
              type="text"
              value={formData.complications}
              onChange={(e) => handleChange('complications', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., bleeding, infection, positioning issues..."
            />
          </div>

          {/* Follow-up Requirements */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-yellow-600" />
              Follow-up Requirements
            </h3>
            
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.followUpRequired}
                  onChange={(e) => handleChange('followUpRequired', e.target.checked)}
                  className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                />
                <span className="text-sm font-medium text-gray-700">Follow-up check required</span>
              </label>
            </div>

            {formData.followUpRequired && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Check Date *
                </label>
                <input
                  type="date"
                  value={formData.nextCheckDate}
                  onChange={(e) => handleChange('nextCheckDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 ${
                    errors.nextCheckDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.nextCheckDate && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.nextCheckDate}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Update Status'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PregnancyStatusForm; 