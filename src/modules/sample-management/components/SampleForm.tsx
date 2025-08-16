import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle, Info, Thermometer, FlaskConical, QrCode } from 'lucide-react';
import { 
  Sample, 
  SampleFormData, 
  Animal,
  SAMPLE_TYPES,
  COLLECTION_METHODS,
  SAMPLE_STATUSES,
  GENETIC_STATUSES,
  CONTAINER_TYPES,
  STORAGE_LOCATIONS,
  SampleType 
} from '../types/sampleTypes';
import { QRCodeGenerator } from './QRCodeGenerator';

interface SampleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (sampleData: Sample) => void;
  existingSample?: Sample | null;
  animals: Animal[];
  mode: 'create' | 'edit';
}

export const SampleForm: React.FC<SampleFormProps> = ({
  isOpen,
  onClose,
  onSave,
  existingSample,
  animals,
  mode
}) => {
  const [formData, setFormData] = useState<SampleFormData>({
    animal_id: '',
    sample_type: 'embryo',
    collection_method: 'Flushing',
    collection_date: new Date().toISOString().split('T')[0],
    status: 'Fresh',
    location: '',
    research_flag: false,
    genetic_status: 'Untested',
    quality_score: undefined,
    morphology_grade: '',
    cell_count: undefined,
    volume_ml: undefined,
    concentration: undefined,
    motility_percentage: undefined,
    viability_percentage: undefined,
    storage_temperature: undefined,
    container_type: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate sample ID
  const generateSampleId = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `SMPL-${year}-${randomNum}`;
  };

  // Initialize form data
  useEffect(() => {
    if (existingSample && mode === 'edit') {
      setFormData({
        animal_id: existingSample.animal_id,
        sample_type: existingSample.sample_type,
        collection_method: existingSample.collection_method,
        collection_date: existingSample.collection_date,
        status: existingSample.status,
        location: existingSample.location,
        research_flag: existingSample.research_flag,
        genetic_status: existingSample.genetic_status,
        quality_score: existingSample.quality_score,
        morphology_grade: existingSample.morphology_grade || '',
        cell_count: existingSample.cell_count,
        volume_ml: existingSample.volume_ml,
        concentration: existingSample.concentration,
        motility_percentage: existingSample.motility_percentage,
        viability_percentage: existingSample.viability_percentage,
        storage_temperature: existingSample.storage_temperature,
        container_type: existingSample.container_type || '',
        notes: existingSample.notes || ''
      });
    } else {
      // Reset form for new sample
      setFormData({
        animal_id: '',
        sample_type: 'embryo',
        collection_method: 'Flushing',
        collection_date: new Date().toISOString().split('T')[0],
        status: 'Fresh',
        location: '',
        research_flag: false,
        genetic_status: 'Untested',
        quality_score: undefined,
        morphology_grade: '',
        cell_count: undefined,
        volume_ml: undefined,
        concentration: undefined,
        motility_percentage: undefined,
        viability_percentage: undefined,
        storage_temperature: undefined,
        container_type: '',
        notes: ''
      });
    }
  }, [existingSample, mode, isOpen]);

  // Update collection method based on sample type
  useEffect(() => {
    if (formData.sample_type === 'embryo' || formData.sample_type === 'oocyte') {
      setFormData(prev => ({ 
        ...prev, 
        collection_method: formData.sample_type === 'embryo' ? 'Flushing' : 'OPU' 
      }));
    } else if (formData.sample_type === 'semen') {
      setFormData(prev => ({ ...prev, collection_method: 'Semen Collection' }));
    } else if (formData.sample_type === 'blood') {
      setFormData(prev => ({ ...prev, collection_method: 'Blood Draw' }));
    } else if (formData.sample_type === 'DNA') {
      setFormData(prev => ({ ...prev, collection_method: 'Biopsy' }));
    }
  }, [formData.sample_type]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.animal_id) newErrors.animal_id = 'Animal selection is required';
    if (!formData.collection_date) newErrors.collection_date = 'Collection date is required';
    if (!formData.location) newErrors.location = 'Storage location is required';
    
    if (formData.quality_score && (formData.quality_score < 1 || formData.quality_score > 10)) {
      newErrors.quality_score = 'Quality score must be between 1 and 10';
    }
    
    if (formData.motility_percentage && (formData.motility_percentage < 0 || formData.motility_percentage > 100)) {
      newErrors.motility_percentage = 'Motility percentage must be between 0 and 100';
    }
    
    if (formData.viability_percentage && (formData.viability_percentage < 0 || formData.viability_percentage > 100)) {
      newErrors.viability_percentage = 'Viability percentage must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const selectedAnimal = animals.find(a => a.id === formData.animal_id);
      
      const sampleData: Sample = {
        id: existingSample?.id || Date.now().toString(),
        sample_id: existingSample?.sample_id || generateSampleId(),
        animal_id: formData.animal_id,
        animal_name: selectedAnimal?.name,
        sample_type: formData.sample_type,
        collection_method: formData.collection_method,
        collection_date: formData.collection_date,
        status: formData.status,
        location: formData.location,
        research_flag: formData.research_flag,
        genetic_status: formData.genetic_status,
        quality_score: formData.quality_score,
        morphology_grade: formData.morphology_grade || undefined,
        cell_count: formData.cell_count,
        volume_ml: formData.volume_ml,
        concentration: formData.concentration,
        motility_percentage: formData.motility_percentage,
        viability_percentage: formData.viability_percentage,
        storage_temperature: formData.storage_temperature,
        container_type: formData.container_type || undefined,
        created_by: existingSample?.created_by || 'Current User',
        created_at: existingSample?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        notes: formData.notes
      };
      
      await onSave(sampleData);
      onClose();
    } catch (error) {
      console.error('Error saving sample:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof SampleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderSampleTypeSpecificFields = () => {
    if (formData.sample_type === 'embryo' || formData.sample_type === 'oocyte') {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cell Count
              </label>
              <input
                type="number"
                value={formData.cell_count || ''}
                onChange={(e) => handleInputChange('cell_count', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Number of cells"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Morphology Grade
              </label>
              <select
                value={formData.morphology_grade}
                onChange={(e) => handleInputChange('morphology_grade', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select grade</option>
                <option value="A">Grade A (Excellent)</option>
                <option value="B">Grade B (Good)</option>
                <option value="C">Grade C (Fair)</option>
                <option value="D">Grade D (Poor)</option>
                <option value="1">Grade 1</option>
                <option value="2">Grade 2</option>
                <option value="3">Grade 3</option>
                <option value="4">Grade 4</option>
              </select>
            </div>
          </div>
        </>
      );
    }

    if (formData.sample_type === 'semen') {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Volume (ml)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.volume_ml || ''}
                onChange={(e) => handleInputChange('volume_ml', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Sample volume"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Concentration (million/ml)
              </label>
              <input
                type="number"
                value={formData.concentration || ''}
                onChange={(e) => handleInputChange('concentration', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Sperm concentration"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motility (%)
                {errors.motility_percentage && <span className="text-red-500 ml-1">{errors.motility_percentage}</span>}
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.motility_percentage || ''}
                onChange={(e) => handleInputChange('motility_percentage', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="0-100%"
              />
            </div>
          </div>
        </>
      );
    }

    if (formData.sample_type === 'blood' || formData.sample_type === 'DNA') {
      return (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Volume (ml)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.volume_ml || ''}
                onChange={(e) => handleInputChange('volume_ml', e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Sample volume"
              />
            </div>
            {formData.sample_type === 'DNA' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Concentration (ng/μl)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.concentration || ''}
                  onChange={(e) => handleInputChange('concentration', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="DNA concentration"
                />
              </div>
            )}
          </div>
        </>
      );
    }

    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <FlaskConical className="h-6 w-6 text-teal-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'edit' ? 'Edit Sample' : 'Add New Sample'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Animal *
                  {errors.animal_id && <span className="text-red-500 ml-1">{errors.animal_id}</span>}
                </label>
                <select
                  value={formData.animal_id}
                  onChange={(e) => handleInputChange('animal_id', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  <option value="">Select an animal</option>
                  {animals.map(animal => (
                    <option key={animal.id} value={animal.id}>
                      {animal.name} ({animal.internalNumber}) - {animal.species}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sample Type *
                </label>
                <select
                  value={formData.sample_type}
                  onChange={(e) => handleInputChange('sample_type', e.target.value as SampleType)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  {SAMPLE_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Method
                </label>
                <select
                  value={formData.collection_method}
                  onChange={(e) => handleInputChange('collection_method', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  {COLLECTION_METHODS.map(method => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Date *
                  {errors.collection_date && <span className="text-red-500 ml-1">{errors.collection_date}</span>}
                </label>
                <input
                  type="date"
                  value={formData.collection_date}
                  onChange={(e) => handleInputChange('collection_date', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Sample Type Specific Fields */}
          {renderSampleTypeSpecificFields()}

          {/* Status and Storage */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Status & Storage</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {SAMPLE_STATUSES.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Storage Location *
                  {errors.location && <span className="text-red-500 ml-1">{errors.location}</span>}
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  <option value="">Select location</option>
                  {STORAGE_LOCATIONS.map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Container Type
                </label>
                <select
                  value={formData.container_type}
                  onChange={(e) => handleInputChange('container_type', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select container</option>
                  {CONTAINER_TYPES.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quality Score (1-10)
                  {errors.quality_score && <span className="text-red-500 ml-1">{errors.quality_score}</span>}
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.quality_score || ''}
                  onChange={(e) => handleInputChange('quality_score', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="1-10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Viability (%)
                  {errors.viability_percentage && <span className="text-red-500 ml-1">{errors.viability_percentage}</span>}
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.viability_percentage || ''}
                  onChange={(e) => handleInputChange('viability_percentage', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="0-100%"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center space-x-1">
                    <Thermometer className="h-4 w-4" />
                    <span>Storage Temp (°C)</span>
                  </div>
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.storage_temperature || ''}
                  onChange={(e) => handleInputChange('storage_temperature', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="-196°C"
                />
              </div>
            </div>
          </div>

          {/* Research and Genetics */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Research & Genetics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Genetic Status
                </label>
                <select
                  value={formData.genetic_status}
                  onChange={(e) => handleInputChange('genetic_status', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {GENETIC_STATUSES.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="research_flag"
                  checked={formData.research_flag}
                  onChange={(e) => handleInputChange('research_flag', e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="research_flag" className="text-sm font-medium text-gray-700">
                  Assign for Research Use
                </label>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Additional notes or storage details..."
            />
          </div>

          {/* QR Code Preview */}
          {mode === 'edit' && existingSample ? (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <QrCode className="h-5 w-5 text-teal-600" />
                <h3 className="text-lg font-medium text-gray-900">Sample QR Code & Label</h3>
              </div>
              <div className="flex justify-center">
                <QRCodeGenerator
                  sample={existingSample}
                  size={150}
                  includeText={true}
                />
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-900">QR Code Generation</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    A unique QR code will be automatically generated for this sample after saving. 
                    The QR code will contain all sample information and can be used for quick identification and tracking.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Sample'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 