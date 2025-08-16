import React, { useState, useEffect } from 'react';
import { Shield, X, Calendar } from 'lucide-react';
import LoadingSpinner from './components/common/LoadingSpinner';

interface Vaccination {
  id?: string;
  animalId: string;
  animalName?: string;
  animalType?: string;
  vaccineType: string;
  administrationDate: string;
  nextDueDate?: string;
  technician?: string;
  batchNumber?: string;
  dosage?: string;
  status: string;
  site?: string;
  notes?: string;
}

interface Animal {
  id: string;
  name: string;
  type: string;
  internalNumber: string;
}

interface VaccinationsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vaccinationData: Vaccination) => void;
  initialData?: Vaccination | null;
  mode: 'create' | 'edit';
}

const VaccinationsForm: React.FC<VaccinationsFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode
}) => {
  const [formData, setFormData] = useState<Vaccination>({
    animalId: '',
    animalName: '',
    animalType: '',
    vaccineType: '',
    administrationDate: new Date().toISOString().split('T')[0],
    nextDueDate: '',
    technician: '',
    batchNumber: '',
    dosage: '',
    status: 'Due',
    site: '',
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
          animalId: initialData.animalId || '',
          animalName: initialData.animalName || '',
          animalType: initialData.animalType || '',
          vaccineType: initialData.vaccineType || '',
          administrationDate: initialData.administrationDate || new Date().toISOString().split('T')[0],
          nextDueDate: initialData.nextDueDate || '',
          technician: initialData.technician || '',
          batchNumber: initialData.batchNumber || '',
          dosage: initialData.dosage || '',
          status: initialData.status || 'Due',
          site: initialData.site || '',
          notes: initialData.notes || ''
        });
      } else {
        // Reset form for create mode
        setFormData({
          animalId: '',
          animalName: '',
          animalType: '',
          vaccineType: '',
          administrationDate: new Date().toISOString().split('T')[0],
          nextDueDate: '',
          technician: '',
          batchNumber: '',
          dosage: '',
          status: 'Due',
          site: '',
          notes: ''
        });
      }
    }
  }, [isOpen, mode, initialData]);

  const fetchAnimals = async () => {
    try {
      setIsLoading(true);
      // Use the apiService to get animals
      const response = await fetch('/api/animals'); // Using mock API
      if (response.ok) {
        const data = await response.json();
        setAnimals(data.animals || []);
      } else {
        // Fallback mock data
        setAnimals([
          { id: 'AN-RT-001', name: 'Bella', type: 'Holstein', internalNumber: 'RT-D-001' },
          { id: 'AN-RT-002', name: 'Thunder', type: 'Angus', internalNumber: 'RT-B-001' },
          { id: 'AN-RT-003', name: 'Jasmine', type: 'Jersey', internalNumber: 'RT-D-002' }
        ]);
      }
    } catch (error) {
      // Fallback mock data
      setAnimals([
        { id: 'AN-RT-001', name: 'Bella', type: 'Holstein', internalNumber: 'RT-D-001' },
        { id: 'AN-RT-002', name: 'Thunder', type: 'Angus', internalNumber: 'RT-B-001' },
        { id: 'AN-RT-003', name: 'Jasmine', type: 'Jersey', internalNumber: 'RT-D-002' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Auto-calculate next dose date based on vaccine type
    if (name === 'vaccineType' && value) {
      calculateNextDoseDate(value);
    }

    // Update animal type when animal is selected
    if (name === 'animalId' && value) {
      const selectedAnimal = animals.find(a => a.id === value);
      if (selectedAnimal) {
        setFormData(prev => ({
          ...prev,
          animalName: selectedAnimal.name,
          animalType: selectedAnimal.type
        }));
      }
    }
  };

  const calculateNextDoseDate = (vaccineType: string) => {
    const vaccinationDate = new Date(formData.administrationDate);
    let daysToAdd = 0;

    // Standard vaccination intervals
    switch (vaccineType.toLowerCase()) {
      case 'foot and mouth disease (fmd)':
      case 'fmd':
        daysToAdd = 180; // Semi-annual
        break;
      case 'rift valley fever (rvf)':
      case 'rvf':
        daysToAdd = 365; // Annual
        break;
      case 'lumpy skin disease (lsd)':
      case 'lsd':
        daysToAdd = 365; // Annual
        break;
      case 'bovine viral diarrhea (bvd)':
      case 'bvd':
        daysToAdd = 30; // Second dose in series
        break;
      case 'infectious bovine rhinotracheitis (ibr)':
      case 'ibr':
        daysToAdd = 365; // Annual
        break;
      default:
        daysToAdd = 365; // Default to annual
    }

    if (daysToAdd > 0) {
      const nextDate = new Date(vaccinationDate);
      nextDate.setDate(nextDate.getDate() + daysToAdd);
      setFormData(prev => ({
        ...prev,
        nextDueDate: nextDate.toISOString().split('T')[0]
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.animalId) {
      newErrors.animalId = 'Animal selection is required';
    }
    if (!formData.administrationDate) {
      newErrors.administrationDate = 'Administration date is required';
    }
    if (!formData.vaccineType.trim()) {
      newErrors.vaccineType = 'Vaccine type is required';
    }

    // Validate dates
    if (formData.administrationDate && formData.nextDueDate) {
      const administrationDate = new Date(formData.administrationDate);
      const nextDoseDate = new Date(formData.nextDueDate);
      if (nextDoseDate <= administrationDate) {
        newErrors.nextDueDate = 'Next dose date must be after administration date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave(formData);
  };

  const handleClose = () => {
    setFormData({
      animalId: '',
      animalName: '',
      animalType: '',
      vaccineType: '',
      administrationDate: new Date().toISOString().split('T')[0],
      nextDueDate: '',
      technician: '',
      batchNumber: '',
      dosage: '',
      status: 'Due',
      site: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-emerald-600" />
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'edit' ? 'Edit Vaccination' : 'New Vaccination'}
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
              <label className="block text-sm font-medium text-gray-700">Animal</label>
              {isLoading ? (
                <LoadingSpinner />
              ) : (
                <select
                  name="animalId"
                  value={formData.animalId || ''}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${errors.animalId ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Animal</option>
                  {animals.map(animal => (
                    <option key={animal.id} value={animal.id}>{animal.name} ({animal.internalNumber})</option>
                  ))}
                </select>
              )}
              {errors.animalId && <div className="text-red-600 text-xs mt-1">{errors.animalId}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Administration Date</label>
              <input
                type="date"
                name="administrationDate"
                value={formData.administrationDate || ''}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${errors.administrationDate ? 'border-red-500' : ''}`}
              />
              {errors.administrationDate && <div className="text-red-600 text-xs mt-1">{errors.administrationDate}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vaccine Type</label>
              <input
                type="text"
                name="vaccineType"
                value={formData.vaccineType || ''}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${errors.vaccineType ? 'border-red-500' : ''}`}
                placeholder="e.g. Foot and Mouth Disease (FMD), Rift Valley Fever (RVF), etc."
              />
              {errors.vaccineType && <div className="text-red-600 text-xs mt-1">{errors.vaccineType}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Batch Number</label>
              <input
                type="text"
                name="batchNumber"
                value={formData.batchNumber || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="Batch #"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Next Due Date</label>
              <input
                type="date"
                name="nextDueDate"
                value={formData.nextDueDate || ''}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${errors.nextDueDate ? 'border-red-500' : ''}`}
              />
              {errors.nextDueDate && <div className="text-red-600 text-xs mt-1">{errors.nextDueDate}</div>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status || 'Due'}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              >
                <option value="Due">Due</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Technician</label>
              <input
                type="text"
                name="technician"
                value={formData.technician || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="Technician Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dosage</label>
              <input
                type="text"
                name="dosage"
                value={formData.dosage || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="e.g. 2ml, 1.5ml"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Injection Site</label>
              <input
                type="text"
                name="site"
                value={formData.site || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                placeholder="e.g. Neck (left side), Shoulder"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                rows={2}
                placeholder="Additional notes"
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
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              {mode === 'edit' ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VaccinationsForm; 