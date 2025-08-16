import React, { useState, useEffect } from 'react';
import { X, Save, Zap, TestTube, Info, CheckCircle } from 'lucide-react';
import { FlushingSession } from '../pages/FlushingPage';

interface FlushingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sessionData: FlushingSession) => void;
  existingSession?: FlushingSession | null;
  mode: 'create' | 'edit';
}

interface FlushingFormData {
  donor_name: string;
  sire_name?: string;
  flush_date: string;
  flush_medium: string;
  flush_volume_ml: number;
  flush_method: string;
  technician: string;
  location: string;
  total_embryos: number;
  viable_embryos: number;
  quality_grade_a: number;
  quality_grade_b: number;
  quality_grade_c: number;
  quality_grade_d: number;
  fertilization_source: 'Natural' | 'IVF' | 'ICSI';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  notes?: string;
  auto_generate_samples: boolean;
}

export const FlushingForm: React.FC<FlushingFormProps> = ({
  isOpen,
  onClose,
  onSave,
  existingSession,
  mode
}) => {
  const [formData, setFormData] = useState<FlushingFormData>({
    donor_name: '',
    sire_name: '',
    flush_date: new Date().toISOString().split('T')[0],
    flush_medium: 'PBS + BSA',
    flush_volume_ml: 500,
    flush_method: 'Foley Catheter',
    technician: '',
    location: '',
    total_embryos: 0,
    viable_embryos: 0,
    quality_grade_a: 0,
    quality_grade_b: 0,
    quality_grade_c: 0,
    quality_grade_d: 0,
    fertilization_source: 'Natural',
    status: 'Scheduled',
    notes: '',
    auto_generate_samples: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateSessionId = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `FLUSH-${year}-${randomNum}`;
  };

  // Auto-calculate viable embryos when quality grades change
  useEffect(() => {
    const totalViable = formData.quality_grade_a + formData.quality_grade_b + formData.quality_grade_c;
    const totalEmbryos = totalViable + formData.quality_grade_d;
    
    setFormData(prev => ({
      ...prev,
      viable_embryos: totalViable,
      total_embryos: totalEmbryos
    }));
  }, [formData.quality_grade_a, formData.quality_grade_b, formData.quality_grade_c, formData.quality_grade_d]);

  const handleInputChange = (field: keyof FlushingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.donor_name.trim()) newErrors.donor_name = 'Donor name is required';
    if (!formData.technician.trim()) newErrors.technician = 'Technician is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.flush_volume_ml <= 0) newErrors.flush_volume_ml = 'Volume must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const sessionData: FlushingSession = {
        id: existingSession?.id || Date.now().toString(),
        session_id: existingSession?.session_id || generateSessionId(),
        donor_id: Date.now().toString(),
        ...formData,
        reproductive_protocol: '',
        created_by: 'Current User',
        created_at: existingSession?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        generated_sample_ids: []
      };

      // Auto-generate samples if requested
      if (formData.auto_generate_samples && mode === 'create' && formData.status === 'Completed' && formData.viable_embryos > 0) {
        const sampleIds: string[] = [];
        for (let i = 0; i < formData.viable_embryos; i++) {
          sampleIds.push(`SMPL-${Date.now()}-${i.toString().padStart(3, '0')}`);
        }
        sessionData.generated_sample_ids = sampleIds;
        
        alert(`✅ Session created! ${formData.viable_embryos} embryo samples generated automatically.`);
      }

      onSave(sessionData);
      onClose();
      
    } catch (error) {
      console.error('Error saving session:', error);
      alert('Failed to save session. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Zap className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {mode === 'edit' ? 'Edit Flushing Session' : 'New Flushing Session'}
              </h2>
              <p className="text-sm text-gray-600">
                Create flushing session with automatic sample generation
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Donor Animal *</label>
              <input
                type="text"
                placeholder="Enter donor name"
                value={formData.donor_name}
                onChange={(e) => handleInputChange('donor_name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.donor_name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.donor_name && <p className="mt-1 text-sm text-red-600">{errors.donor_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sire (Optional)</label>
              <input
                type="text"
                placeholder="Enter sire name"
                value={formData.sire_name}
                onChange={(e) => handleInputChange('sire_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Flush Date *</label>
              <input
                type="date"
                value={formData.flush_date}
                onChange={(e) => handleInputChange('flush_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Technician *</label>
              <input
                type="text"
                placeholder="Performing technician"
                value={formData.technician}
                onChange={(e) => handleInputChange('technician', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.technician ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.technician && <p className="mt-1 text-sm text-red-600">{errors.technician}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <select
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  errors.location ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select location</option>
                <option value="Flushing Room 1">Flushing Room 1</option>
                <option value="Flushing Room 2">Flushing Room 2</option>
                <option value="Field Unit">Field Unit</option>
                <option value="Mobile Lab">Mobile Lab</option>
              </select>
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>
          </div>

          {/* Flush Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Flush Medium</label>
              <select
                value={formData.flush_medium}
                onChange={(e) => handleInputChange('flush_medium', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="PBS + BSA">PBS + BSA</option>
                <option value="DPBS + FBS">DPBS + FBS</option>
                <option value="Ringer's Solution">Ringer's Solution</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Volume (mL) *</label>
              <input
                type="number"
                min="0"
                step="50"
                value={formData.flush_volume_ml}
                onChange={(e) => handleInputChange('flush_volume_ml', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Method</label>
              <select
                value={formData.flush_method}
                onChange={(e) => handleInputChange('flush_method', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="Foley Catheter">Foley Catheter</option>
                <option value="Manual">Manual</option>
                <option value="Vacuum Aspiration">Vacuum Aspiration</option>
              </select>
            </div>
          </div>

          {/* Embryo Quality Grading */}
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-medium text-blue-900">Embryo Quality Grading</h3>
              </div>
              <p className="mt-1 text-sm text-blue-700">
                Grade A: Excellent, Grade B: Good, Grade C: Fair, Grade D: Poor
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade A</label>
                <input
                  type="number"
                  min="0"
                  value={formData.quality_grade_a}
                  onChange={(e) => handleInputChange('quality_grade_a', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade B</label>
                <input
                  type="number"
                  min="0"
                  value={formData.quality_grade_b}
                  onChange={(e) => handleInputChange('quality_grade_b', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade C</label>
                <input
                  type="number"
                  min="0"
                  value={formData.quality_grade_c}
                  onChange={(e) => handleInputChange('quality_grade_c', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade D</label>
                <input
                  type="number"
                  min="0"
                  value={formData.quality_grade_d}
                  onChange={(e) => handleInputChange('quality_grade_d', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Calculated Totals</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-medium">{formData.total_embryos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Viable:</span>
                  <span className="font-medium text-green-600">{formData.viable_embryos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Success Rate:</span>
                  <span className="font-medium text-blue-600">
                    {formData.total_embryos > 0 ? ((formData.viable_embryos / formData.total_embryos) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Generation */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TestTube className="h-5 w-5 text-teal-600" />
                <div>
                  <h3 className="text-sm font-medium text-teal-900">Automatic Sample Generation</h3>
                  <p className="text-xs text-teal-700">
                    Generate {formData.viable_embryos} embryo samples in Sample Management
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.auto_generate_samples}
                  onChange={(e) => handleInputChange('auto_generate_samples', e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-teal-900">Enable</label>
              </div>
            </div>
            {formData.auto_generate_samples && formData.viable_embryos > 0 && (
              <div className="mt-3 flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Will generate {formData.viable_embryos} samples when status is "Completed"</span>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              rows={3}
              placeholder="Additional observations..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Session'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 