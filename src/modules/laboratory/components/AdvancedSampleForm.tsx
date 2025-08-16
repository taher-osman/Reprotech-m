import React, { useState, useEffect } from 'react';
import { 
  X, 
  TestTube, 
  Calendar, 
  User, 
  MapPin, 
  Thermometer,
  Clock,
  AlertTriangle,
  CheckCircle,
  QrCode,
  Upload
} from 'lucide-react';

interface AdvancedSampleFormProps {
  onSubmit: (sampleData: any) => void;
  onClose: () => void;
  initialData?: any;
  mode?: 'create' | 'edit';
}

interface SampleData {
  sampleId: string;
  animalId: string;
  customerId: string;
  sampleType: string;
  collectionDate: string;
  collectionTime: string;
  collectionMethod: string;
  collectionSite: string;
  priority: string;
  status: string;
  temperature: string;
  volume: string;
  collectedBy: string;
  notes: string;
  requestedTests: string[];
  storageConditions: string;
  containerType: string;
  preservative: string;
  transportConditions: string;
}

const AdvancedSampleForm: React.FC<AdvancedSampleFormProps> = ({
  onSubmit,
  onClose,
  initialData,
  mode = 'create'
}) => {
  const [formData, setFormData] = useState<SampleData>({
    sampleId: '',
    animalId: '',
    customerId: '',
    sampleType: '',
    collectionDate: new Date().toISOString().split('T')[0],
    collectionTime: new Date().toTimeString().slice(0, 5),
    collectionMethod: '',
    collectionSite: '',
    priority: 'NORMAL',
    status: 'COLLECTED',
    temperature: '',
    volume: '',
    collectedBy: '',
    notes: '',
    requestedTests: [],
    storageConditions: 'REFRIGERATED',
    containerType: 'TUBE',
    preservative: 'NONE',
    transportConditions: 'AMBIENT'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [animals, setAnimals] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [availableTests, setAvailableTests] = useState<any[]>([]);

  useEffect(() => {
    if (mode === 'create') {
      generateSampleId();
    }
    loadFormData();
  }, [mode]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const generateSampleId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setFormData(prev => ({
      ...prev,
      sampleId: `LAB${timestamp}${random}`
    }));
  };

  const loadFormData = async () => {
    try {
      // Mock data for animals
      setAnimals([
        { id: 'AN-001', name: 'Holstein A1', animalID: 'RT-H-001', species: 'Bovine' },
        { id: 'AN-002', name: 'Jersey B2', animalID: 'RT-J-002', species: 'Bovine' },
        { id: 'AN-003', name: 'Angus C3', animalID: 'RT-A-003', species: 'Bovine' },
      ]);

      // Mock data for customers
      setCustomers([
        { id: 'CU-001', name: 'Al-Rajhi Farms', customerID: 'CU-001' },
        { id: 'CU-002', name: 'Modern Dairy Co.', customerID: 'CU-002' },
        { id: 'CU-003', name: 'Elite Genetics', customerID: 'CU-003' },
      ]);

      // Mock data for available tests
      setAvailableTests([
        { id: 'T-001', name: 'Complete Blood Count', code: 'CBC' },
        { id: 'T-002', name: 'Genetic Marker Analysis', code: 'GMA' },
        { id: 'T-003', name: 'Hormone Panel', code: 'HP' },
        { id: 'T-004', name: 'Pregnancy Test', code: 'PT' },
        { id: 'T-005', name: 'Disease Screening', code: 'DS' },
        { id: 'T-006', name: 'Nutritional Analysis', code: 'NA' },
      ]);
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTestSelection = (testId: string) => {
    const updatedTests = formData.requestedTests.includes(testId)
      ? formData.requestedTests.filter(id => id !== testId)
      : [...formData.requestedTests, testId];
    
    handleChange('requestedTests', updatedTests);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.sampleId.trim()) {
      newErrors.sampleId = 'Sample ID is required';
    }
    if (!formData.animalId) {
      newErrors.animalId = 'Animal selection is required';
    }
    if (!formData.customerId) {
      newErrors.customerId = 'Customer selection is required';
    }
    if (!formData.sampleType) {
      newErrors.sampleType = 'Sample type is required';
    }
    if (!formData.collectionDate) {
      newErrors.collectionDate = 'Collection date is required';
    }
    if (!formData.collectedBy.trim()) {
      newErrors.collectedBy = 'Collector name is required';
    }
    if (formData.requestedTests.length === 0) {
      newErrors.requestedTests = 'At least one test must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Find selected animal and customer names
      const selectedAnimal = animals.find(a => a.id === formData.animalId);
      const selectedCustomer = customers.find(c => c.id === formData.customerId);

      const submitData = {
        ...formData,
        animalName: selectedAnimal?.name || '',
        customerName: selectedCustomer?.name || '',
        barcode: `BC${formData.sampleId}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting sample:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleTypes = [
    'BLOOD', 'SERUM', 'PLASMA', 'URINE', 'FECES', 'SALIVA', 
    'HAIR', 'TISSUE', 'MILK', 'SEMEN', 'DNA', 'RNA'
  ];

  const collectionMethods = [
    'VENIPUNCTURE', 'CAPILLARY', 'CATHETER', 'BIOPSY', 
    'SWAB', 'ASPIRATION', 'COLLECTION_CUP', 'MANUAL'
  ];

  const collectionSites = [
    'JUGULAR_VEIN', 'COCCYGEAL_VEIN', 'MAMMARY_VEIN', 
    'EAR_VEIN', 'RECTAL', 'NASAL', 'ORAL', 'OTHER'
  ];

  const priorities = [
    { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-800' },
    { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'NORMAL', label: 'Normal', color: 'bg-green-100 text-green-800' },
    { value: 'LOW', label: 'Low', color: 'bg-gray-100 text-gray-800' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TestTube className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {mode === 'create' ? '🧪 Advanced Sample Collection' : '📝 Edit Sample'}
                </h2>
                <p className="text-sm text-gray-600">Comprehensive laboratory sample registration</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TestTube className="h-5 w-5 mr-2 text-blue-600" />
              Basic Sample Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sample ID *
                </label>
                <input
                  type="text"
                  value={formData.sampleId}
                  onChange={(e) => handleChange('sampleId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.sampleId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Auto-generated"
                />
                {errors.sampleId && (
                  <p className="text-red-500 text-xs mt-1">{errors.sampleId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Animal *
                </label>
                <select
                  value={formData.animalId}
                  onChange={(e) => handleChange('animalId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.animalId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select animal</option>
                  {animals.map(animal => (
                    <option key={animal.id} value={animal.id}>
                      {animal.name} ({animal.animalID})
                    </option>
                  ))}
                </select>
                {errors.animalId && (
                  <p className="text-red-500 text-xs mt-1">{errors.animalId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer *
                </label>
                <select
                  value={formData.customerId}
                  onChange={(e) => handleChange('customerId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.customerId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select customer</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} ({customer.customerID})
                    </option>
                  ))}
                </select>
                {errors.customerId && (
                  <p className="text-red-500 text-xs mt-1">{errors.customerId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sample Type *
                </label>
                <select
                  value={formData.sampleType}
                  onChange={(e) => handleChange('sampleType', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.sampleType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select type</option>
                  {sampleTypes.map(type => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ')}
                    </option>
                  ))}
                </select>
                {errors.sampleType && (
                  <p className="text-red-500 text-xs mt-1">{errors.sampleType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="COLLECTED">Collected</option>
                  <option value="RECEIVED">Received</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Collection Details */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Collection Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Date *
                </label>
                <input
                  type="date"
                  value={formData.collectionDate}
                  onChange={(e) => handleChange('collectionDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    errors.collectionDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.collectionDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.collectionDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Time
                </label>
                <input
                  type="time"
                  value={formData.collectionTime}
                  onChange={(e) => handleChange('collectionTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collected By *
                </label>
                <input
                  type="text"
                  value={formData.collectedBy}
                  onChange={(e) => handleChange('collectedBy', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    errors.collectedBy ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Technician name"
                />
                {errors.collectedBy && (
                  <p className="text-red-500 text-xs mt-1">{errors.collectedBy}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Method
                </label>
                <select
                  value={formData.collectionMethod}
                  onChange={(e) => handleChange('collectionMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select method</option>
                  {collectionMethods.map(method => (
                    <option key={method} value={method}>
                      {method.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Site
                </label>
                <select
                  value={formData.collectionSite}
                  onChange={(e) => handleChange('collectionSite', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select site</option>
                  {collectionSites.map(site => (
                    <option key={site} value={site}>
                      {site.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Volume (ml)
                </label>
                <input
                  type="number"
                  value={formData.volume}
                  onChange={(e) => handleChange('volume', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Sample volume"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Requested Tests */}
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TestTube className="h-5 w-5 mr-2 text-purple-600" />
              Requested Tests *
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableTests.map(test => (
                <label key={test.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.requestedTests.includes(test.id)}
                    onChange={() => handleTestSelection(test.id)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{test.name}</div>
                    <div className="text-xs text-gray-500">{test.code}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.requestedTests && (
              <p className="text-red-500 text-xs mt-2">{errors.requestedTests}</p>
            )}
          </div>

          {/* Storage & Transport */}
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Thermometer className="h-5 w-5 mr-2 text-yellow-600" />
              Storage & Transport Conditions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Storage Conditions
                </label>
                <select
                  value={formData.storageConditions}
                  onChange={(e) => handleChange('storageConditions', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="FROZEN">Frozen (-20°C)</option>
                  <option value="REFRIGERATED">Refrigerated (2-8°C)</option>
                  <option value="AMBIENT">Ambient (15-25°C)</option>
                  <option value="CONTROLLED">Controlled Environment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Container Type
                </label>
                <select
                  value={formData.containerType}
                  onChange={(e) => handleChange('containerType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="TUBE">Tube</option>
                  <option value="VIAL">Vial</option>
                  <option value="CONTAINER">Container</option>
                  <option value="BAG">Collection Bag</option>
                  <option value="SLIDE">Slide</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preservative
                </label>
                <select
                  value={formData.preservative}
                  onChange={(e) => handleChange('preservative', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="NONE">None</option>
                  <option value="EDTA">EDTA</option>
                  <option value="HEPARIN">Heparin</option>
                  <option value="FORMALIN">Formalin</option>
                  <option value="ALCOHOL">Alcohol</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  value={formData.temperature}
                  onChange={(e) => handleChange('temperature', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                  placeholder="Collection temp"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Any additional information about the sample collection..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {mode === 'create' ? 'Create Sample' : 'Update Sample'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvancedSampleForm; 