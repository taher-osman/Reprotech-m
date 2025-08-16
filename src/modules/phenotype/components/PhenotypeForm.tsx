import React, { useState, useEffect } from 'react';
import { Camera, X, Upload, Image } from 'lucide-react';
import LoadingSpinner from './components/common/LoadingSpinner';

interface PhenotypeRecord {
  id?: string;
  phenotypeID?: string;
  animalId: string;
  animalName?: string;
  featureType: string;
  score?: number;
  measurement?: number;
  unit?: string;
  description?: string;
  analysisDate: string;
  analyst?: string;
  methodology?: string;
  attachmentPath?: string;
  notes?: string;
}

interface Animal {
  id: string;
  name: string;
  animalID: string;
  species: string;
}

interface PhenotypeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (phenotypeData: PhenotypeRecord) => void;
  initialData?: PhenotypeRecord | null;
  mode: 'create' | 'edit';
}

const PhenotypeForm: React.FC<PhenotypeFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode
}) => {
  const [formData, setFormData] = useState<PhenotypeRecord>({
    phenotypeID: '',
    animalId: '',
    featureType: '',
    score: undefined,
    measurement: undefined,
    unit: '',
    description: '',
    analysisDate: new Date().toISOString().split('T')[0],
    analyst: '',
    methodology: '',
    attachmentPath: '',
    notes: ''
  });

  const [animals, setAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      fetchAnimals();
      if (mode === 'edit' && initialData) {
        setFormData({
          ...initialData,
          analysisDate: initialData.analysisDate ? new Date(initialData.analysisDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        });
      } else {
        generatePhenotypeID();
      }
    }
  }, [isOpen, mode, initialData]);

  const fetchAnimals = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call for animals
      const response = await fetch('/api/modules/options');
      if (response.ok) {
        const data = await response.json();
        setAnimals(data.animals?.all || []);
      } else {
        setAnimals([]);
      }
    } catch (error) {
      setAnimals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePhenotypeID = () => {
    const prefix = 'PHE';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setFormData(prev => ({
      ...prev,
      phenotypeID: `${prefix}${timestamp}${random}`
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? undefined : parseFloat(value)) : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.phenotypeID?.trim()) {
      newErrors.phenotypeID = 'Phenotype ID is required';
    }
    if (!formData.animalId) {
      newErrors.animalId = 'Animal selection is required';
    }
    if (!formData.featureType.trim()) {
      newErrors.featureType = 'Feature type is required';
    }
    if (!formData.analysisDate) {
      newErrors.analysisDate = 'Analysis date is required';
    }

    // Validate score range if provided
    if (formData.score !== undefined && (formData.score < 1 || formData.score > 10)) {
      newErrors.score = 'Score must be between 1 and 10';
    }

    // Validate measurement if provided
    if (formData.measurement !== undefined && formData.measurement < 0) {
      newErrors.measurement = 'Measurement must be positive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Find selected animal name
    const selectedAnimal = animals.find(a => a.id === formData.animalId);
    const submitData = {
      ...formData,
      animalName: selectedAnimal?.name || ''
    };

    onSave(submitData);
  };

  const handleClose = () => {
    setFormData({
      phenotypeID: '',
      animalId: '',
      featureType: '',
      score: undefined,
      measurement: undefined,
      unit: '',
      description: '',
      analysisDate: new Date().toISOString().split('T')[0],
      analyst: '',
      methodology: '',
      attachmentPath: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Camera className="h-6 w-6 text-violet-600" />
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'edit' ? 'Edit Phenotype Analysis' : 'New Phenotype Analysis'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
            title="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phenotype ID</label>
              <input
                type="text"
                name="phenotypeID"
                value={formData.phenotypeID}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm ${errors.phenotypeID ? 'border-red-500' : ''}`}
                disabled
              />
              {errors.phenotypeID && <div className="text-red-600 text-xs mt-1">{errors.phenotypeID}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Animal</label>
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <select
                  name="animalId"
                  value={formData.animalId}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm ${errors.animalId ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Animal</option>
                  {animals.map(animal => (
                    <option key={animal.id} value={animal.id}>{animal.name} ({animal.animalID})</option>
                  ))}
                </select>
              )}
              {errors.animalId && <div className="text-red-600 text-xs mt-1">{errors.animalId}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Feature Type</label>
              <select
                name="featureType"
                value={formData.featureType}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm ${errors.featureType ? 'border-red-500' : ''}`}
              >
                <option value="">Select Feature Type</option>
                <option value="Body Weight">Body Weight</option>
                <option value="Height">Height</option>
                <option value="Length">Length</option>
                <option value="Chest Girth">Chest Girth</option>
                <option value="Horn Length">Horn Length</option>
                <option value="Coat Color">Coat Color</option>
                <option value="Eye Color">Eye Color</option>
                <option value="Milk Yield">Milk Yield</option>
                <option value="Fertility">Fertility</option>
                <option value="Disease Resistance">Disease Resistance</option>
                <option value="Temperament">Temperament</option>
                <option value="Conformation">Conformation</option>
                <option value="Other">Other</option>
              </select>
              {errors.featureType && <div className="text-red-600 text-xs mt-1">{errors.featureType}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Analysis Date</label>
              <input
                type="date"
                name="analysisDate"
                value={formData.analysisDate}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm ${errors.analysisDate ? 'border-red-500' : ''}`}
              />
              {errors.analysisDate && <div className="text-red-600 text-xs mt-1">{errors.analysisDate}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Score (1-10)</label>
              <input
                type="number"
                name="score"
                value={formData.score || ''}
                onChange={handleChange}
                min="1"
                max="10"
                step="0.1"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm ${errors.score ? 'border-red-500' : ''}`}
                placeholder="Optional subjective score"
              />
              {errors.score && <div className="text-red-600 text-xs mt-1">{errors.score}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Measurement</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  name="measurement"
                  value={formData.measurement || ''}
                  onChange={handleChange}
                  step="0.01"
                  className={`flex-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm ${errors.measurement ? 'border-red-500' : ''}`}
                  placeholder="Numerical measurement"
                />
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-20 mt-1 block rounded-md border-gray-300 shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                  placeholder="Unit"
                />
              </div>
              {errors.measurement && <div className="text-red-600 text-xs mt-1">{errors.measurement}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Analyst</label>
              <input
                type="text"
                name="analyst"
                value={formData.analyst}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                placeholder="Analyst name or ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Methodology</label>
              <input
                type="text"
                name="methodology"
                value={formData.methodology}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                placeholder="Analysis methodology"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                rows={2}
                placeholder="Detailed description of the phenotype analysis"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Attachment Path</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  name="attachmentPath"
                  value={formData.attachmentPath}
                  onChange={handleChange}
                  className="flex-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                  placeholder="Path to images or documents"
                />
                <button
                  type="button"
                  className="mt-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
                  title="Upload File"
                >
                  <Upload className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-violet-500 focus:border-violet-500 sm:text-sm"
                rows={3}
                placeholder="Additional notes and observations"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
            >
              {mode === 'edit' ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhenotypeForm; 