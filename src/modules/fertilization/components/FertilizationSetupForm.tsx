import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Calendar,
  Users,
  Building,
  TestTube,
  Microscope,
  Brain,
  AlertCircle,
  CheckCircle,
  Target,
  Hash
} from 'lucide-react';

import { 
  FertilizationSetupData,
  Laboratory,
  Technician
} from '../types/fertilizationTypes';
import { FertilizationType } from '../../sample-management/types/sampleTypes';
import { fertilizationApi } from '../services/fertilizationApi';
import { generateSessionId, validateFertilizationSetup } from '../utils/fertilizationUtils';

interface FertilizationSetupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FertilizationSetupData) => Promise<void>;
  fertilizationType?: FertilizationType;
}

const FertilizationSetupForm: React.FC<FertilizationSetupFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  fertilizationType = 'IVF'
}) => {
  const [formData, setFormData] = useState<FertilizationSetupData>({
    fertilizationType,
    fertilizationDate: new Date().toISOString().split('T')[0],
    technician: '',
    recipientLab: '',
    targetEmbryoCount: 0,
    selectedOocyteIds: [],
    selectedSemenIds: [],
    selectedFibroblastIds: [],
    notes: ''
  });

  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [estimatedOocytes, setEstimatedOocytes] = useState(0);

  useEffect(() => {
    if (isOpen) {
      fetchLaboratories();
      fetchTechnicians();
      // Update fertilization type if passed as prop
      setFormData(prev => ({
        ...prev,
        fertilizationType,
        targetEmbryoCount: 0 // Reset target count when type changes
      }));
    }
  }, [isOpen, fertilizationType]);

  useEffect(() => {
    // Auto-calculate target embryo count based on fertilization type and estimated oocytes
    if (estimatedOocytes > 0) {
      let expectedRate = 0.7; // Default 70% success rate
      if (formData.fertilizationType === 'ICSI') expectedRate = 0.8; // 80% for ICSI
      if (formData.fertilizationType === 'SCNT') expectedRate = 0.4; // 40% for SCNT
      
      const estimated = Math.round(estimatedOocytes * expectedRate);
      setFormData(prev => ({
        ...prev,
        targetEmbryoCount: estimated
      }));
    }
  }, [estimatedOocytes, formData.fertilizationType]);

  const fetchLaboratories = async () => {
    try {
      const labs = await fertilizationApi.getLaboratories();
      setLaboratories(labs);
    } catch (error) {
      console.error('Error fetching laboratories:', error);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const techs = await fertilizationApi.getTechnicians();
      setTechnicians(techs);
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateFertilizationSetup(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      setErrors({ submit: 'Failed to create fertilization session' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      fertilizationType: 'IVF',
      fertilizationDate: new Date().toISOString().split('T')[0],
      technician: '',
      recipientLab: '',
      targetEmbryoCount: 0,
      selectedOocyteIds: [],
      selectedSemenIds: [],
      selectedFibroblastIds: [],
      notes: ''
    });
    setErrors({});
    setEstimatedOocytes(0);
    onClose();
  };

  const updateFormData = (field: keyof FertilizationSetupData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getFertilizationTypeInfo = (type: FertilizationType) => {
    switch (type) {
      case 'IVF':
        return {
          icon: TestTube,
          color: 'blue',
          description: 'In Vitro Fertilization - Standard fertilization process',
          expectedRate: '70-75%',
          sampleRequirement: 'Oocytes + Semen'
        };
      case 'ICSI':
        return {
          icon: Microscope,
          color: 'green',
          description: 'Intracytoplasmic Sperm Injection - Single sperm injection',
          expectedRate: '75-85%',
          sampleRequirement: 'Oocytes + Semen'
        };
      case 'SCNT':
        return {
          icon: Brain,
          color: 'purple',
          description: 'Somatic Cell Nuclear Transfer - Cloning technology',
          expectedRate: '35-45%',
          sampleRequirement: 'Oocytes + Fibroblasts'
        };
    }
  };

  if (!isOpen) return null;

  const typeInfo = getFertilizationTypeInfo(formData.fertilizationType);
  const TypeIcon = typeInfo.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 bg-${typeInfo.color}-100 rounded-lg`}>
                <TypeIcon className={`h-6 w-6 text-${typeInfo.color}-600`} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  New {formData.fertilizationType} Session
                </h2>
                <p className="text-sm text-gray-600">{typeInfo.description}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
          {/* Fertilization Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Fertilization Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['IVF', 'ICSI', 'SCNT'] as FertilizationType[]).map((type) => {
                const info = getFertilizationTypeInfo(type);
                const Icon = info.icon;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateFormData('fertilizationType', type)}
                    className={`relative p-4 border-2 rounded-lg text-left transition-all ${
                      formData.fertilizationType === type
                        ? `border-${info.color}-500 bg-${info.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon className={`h-5 w-5 ${
                        formData.fertilizationType === type 
                          ? `text-${info.color}-600` 
                          : 'text-gray-400'
                      }`} />
                      <span className={`font-medium ${
                        formData.fertilizationType === type 
                          ? `text-${info.color}-900` 
                          : 'text-gray-700'
                      }`}>
                        {type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{info.expectedRate} success</p>
                    <p className="text-xs text-gray-500">{info.sampleRequirement}</p>
                    {formData.fertilizationType === type && (
                      <CheckCircle className={`absolute top-2 right-2 h-4 w-4 text-${info.color}-600`} />
                    )}
                  </button>
                );
              })}
            </div>
            {errors.fertilizationType && (
              <p className="mt-1 text-sm text-red-600">{errors.fertilizationType}</p>
            )}
          </div>

          {/* Session Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fertilization Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Fertilization Date
              </label>
              <input
                type="date"
                value={formData.fertilizationDate}
                onChange={(e) => updateFormData('fertilizationDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.fertilizationDate && (
                <p className="mt-1 text-sm text-red-600">{errors.fertilizationDate}</p>
              )}
            </div>

            {/* Technician */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Technician
              </label>
              <select
                value={formData.technician}
                onChange={(e) => updateFormData('technician', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Technician</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.name}>
                    {tech.name} - {tech.specialization}
                  </option>
                ))}
              </select>
              {errors.technician && (
                <p className="mt-1 text-sm text-red-600">{errors.technician}</p>
              )}
            </div>

            {/* Recipient Laboratory */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="inline h-4 w-4 mr-1" />
                Recipient Laboratory
              </label>
              <select
                value={formData.recipientLab}
                onChange={(e) => updateFormData('recipientLab', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Laboratory</option>
                {laboratories.map((lab) => (
                  <option key={lab.id} value={lab.name}>
                    {lab.name} - {lab.location}
                  </option>
                ))}
              </select>
              {errors.recipientLab && (
                <p className="mt-1 text-sm text-red-600">{errors.recipientLab}</p>
              )}
            </div>

            {/* Estimated Oocytes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="inline h-4 w-4 mr-1" />
                Estimated Oocytes Available
              </label>
              <input
                type="number"
                value={estimatedOocytes}
                onChange={(e) => setEstimatedOocytes(parseInt(e.target.value) || 0)}
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter number of oocytes..."
              />
              <p className="mt-1 text-xs text-gray-500">
                This will auto-calculate target embryo count
              </p>
            </div>
          </div>

          {/* Target Embryo Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="inline h-4 w-4 mr-1" />
              Target Embryo Count
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.targetEmbryoCount}
                onChange={(e) => updateFormData('targetEmbryoCount', parseInt(e.target.value) || 0)}
                min="0"
                max="50"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span className="text-sm text-gray-500">embryos</span>
              </div>
            </div>
            {estimatedOocytes > 0 && (
              <p className="mt-1 text-xs text-gray-500">
                Based on {estimatedOocytes} oocytes × {typeInfo.expectedRate} success rate
              </p>
            )}
            {errors.targetEmbryoCount && (
              <p className="mt-1 text-sm text-red-600">{errors.targetEmbryoCount}</p>
            )}
          </div>

          {/* Session Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => updateFormData('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Additional notes about this fertilization session..."
            />
          </div>

          {/* Expected Workflow */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Expected Workflow:</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>1. Create session and select samples (oocytes + {formData.fertilizationType === 'SCNT' ? 'fibroblasts' : 'semen'})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>2. Perform {formData.fertilizationType} procedure</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>3. Track development (cleavage, blastocyst formation)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>4. Generate embryo samples for transfer/storage</span>
              </div>
            </div>
          </div>

          {/* Form Errors */}
          {errors.submit && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {errors.submit}
            </div>
          )}
          {Object.keys(errors).filter(key => key !== 'submit').length > 0 && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded">
              <ul className="list-disc pl-5">
                {Object.entries(errors).filter(([key]) => key !== 'submit').map(([field, msg]) => (
                  <li key={field}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-${typeInfo.color}-600 text-white rounded-lg hover:bg-${typeInfo.color}-700 flex items-center space-x-2 disabled:opacity-50`}
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Creating...' : 'Create Session'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FertilizationSetupForm; 