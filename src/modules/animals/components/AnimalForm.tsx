import React, { useState, useEffect } from 'react';
import { X, Save, User, Heart, Hash, TestTube, MapPin, Calendar, QrCode, Building, Tag, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { Button } from './components/ui/Button';
import { Animal, AnimalFormData } from '../types/animalTypes';
import { 
  AnimalSpecies, 
  AnimalStatus, 
  AnimalRole, 
  AnimalPurpose,
  SPECIES_CONFIG, 
  ROLE_CONFIG, 
  DEFAULT_VALUES 
} from '../types/animalStatus';
import { 
  generateAnimalID, 
  generateInternalNumber, 
  validateAnimal, 
  getRoleDisplayInfo 
} from '../utils/animalUtils';

interface AnimalFormProps {
  animal?: Animal | null;
  mode: 'create' | 'edit';
  isOpen: boolean;
  onClose: () => void;
  onSave: (animal: Animal) => void;
}

export const AnimalForm: React.FC<AnimalFormProps> = ({
  animal,
  mode,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<AnimalFormData>({
    animalID: '',
    name: '',
    species: DEFAULT_VALUES.species,
    sex: DEFAULT_VALUES.sex,
    registrationDate: DEFAULT_VALUES.registrationDate(),
    roles: [],
    status: DEFAULT_VALUES.status,
    selectedRoles: [],
    generateInternalNumber: false,
    internalNumberHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('basic');
  const [customers, setCustomers] = useState<any[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (animal && mode === 'edit') {
      const activeRoles = animal.roles.filter(r => r.isActive).map(r => r.role);
      setFormData({
        ...animal,
        selectedRoles: activeRoles,
        generateInternalNumber: false,
        customer: animal.customer || {
          name: '',
          customerID: '',
          region: '',
          contactNumber: '',
          email: '',
          category: 'Standard'
        }
      });
    } else if (mode === 'create') {
      // Generate animal ID for new animals
      const existingIDs: string[] = []; // In real app, fetch from context/API
      const generatedID = generateAnimalID(formData.species, existingIDs);
      
      setFormData(prev => ({
        ...prev,
        animalID: generatedID,
        registrationDate: DEFAULT_VALUES.registrationDate()
      }));
    }
  }, [animal, mode]);

  // Regenerate Animal ID when species changes
  useEffect(() => {
    if (mode === 'create') {
      const existingIDs: string[] = []; // In real app, fetch from context/API
      const generatedID = generateAnimalID(formData.species, existingIDs);
      setFormData(prev => ({
        ...prev,
        animalID: generatedID
      }));
    }
  }, [formData.species, mode]);

  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
    }
  }, [isOpen]);

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      // Mock customer data - in real app, fetch from API
      const mockCustomers = [
        { id: '1', name: 'Al-Majd Farm', customerId: 'CUS-001', region: 'Riyadh', category: 'Premium' },
        { id: '2', name: 'Royal Stables', customerId: 'CUS-002', region: 'Dubai', category: 'VIP' },
        { id: '3', name: 'Elite Breeding Center', customerId: 'CUS-003', region: 'Al Khobar', category: 'VIP' }
      ];
      setCustomers(mockCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setCustomers([]);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const validateForm = () => {
    const animalToValidate = {
      ...formData,
      roles: formData.selectedRoles.map(role => ({
        role: role as any,
        assignedAt: new Date().toISOString(),
        assignedBy: 'System Admin',
        isActive: true
      }))
    };
    
    const validationErrors = validateAnimal(animalToValidate);
    
    // Additional role validation
    if (formData.selectedRoles.length === 0) {
      validationErrors.roles = 'At least one role must be selected';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert form data to Animal format
      const roles = formData.selectedRoles.map(role => ({
        role: role as any,
        assignedAt: new Date().toISOString(),
        assignedBy: 'System Admin',
        isActive: true,
        notes: `Assigned during ${mode === 'create' ? 'creation' : 'edit'}`
      }));

      let internalNumberHistory = animal?.internalNumberHistory || [];
      let currentInternalNumber = animal?.currentInternalNumber;

      // Generate internal number if requested
      if (formData.generateInternalNumber && mode === 'create') {
        const existingNumbers: string[] = []; // In real app, fetch from context/API
        const internalNumber = generateInternalNumber(existingNumbers);
        
        const newRecord = {
          id: `int_${Date.now()}`,
          internalNumber,
          assignedAt: new Date().toISOString(),
          assignedBy: 'System Admin',
          reason: 'Initial registration',
          isActive: true
        };

        internalNumberHistory = [newRecord];
        currentInternalNumber = {
          id: newRecord.id,
          internalNumber,
          isActive: true,
          assignedDate: new Date().toISOString().split('T')[0]
        };
      }

      const animalData: Animal = {
        ...formData,
        id: animal?.id || `animal_${Date.now()}`,
        roles,
        internalNumberHistory,
        currentInternalNumber,
        createdAt: animal?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      onSave(animalData);
      onClose();
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleRoleToggle = (role: string) => {
    setFormData(prev => {
      const newRoles = prev.selectedRoles.includes(role)
        ? prev.selectedRoles.filter(r => r !== role)
        : [...prev.selectedRoles, role];
      
      return {
        ...prev,
        selectedRoles: newRoles
      };
    });

    // Clear role error
    if (errors.roles) {
      setErrors(prev => ({
        ...prev,
        roles: ''
      }));
    }
  };

  const handleCustomerChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      customer: {
        ...prev.customer!,
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    const errorKey = `customer${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: ''
      }));
    }
  };

  const handleCustomerSelect = (customerId: string) => {
    const selectedCustomer = customers.find(c => c.id === customerId);
    if (selectedCustomer) {
      setFormData(prev => ({
        ...prev,
        customer: {
          name: selectedCustomer.name,
          customerID: selectedCustomer.customerId,
          region: selectedCustomer.region,
          contactNumber: selectedCustomer.contactNumber || '',
          email: selectedCustomer.email || '',
          category: selectedCustomer.category
        },
        owner: selectedCustomer.name
      }));
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'roles', label: 'Roles & Purpose', icon: Tag },
    { id: 'physical', label: 'Physical', icon: Heart },
    { id: 'lineage', label: 'Lineage', icon: Hash },
    { id: 'customer', label: 'Customer', icon: Building },
    { id: 'settings', label: 'Settings', icon: QrCode }
  ];

  const speciesConfig = SPECIES_CONFIG[formData.species];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {mode === 'create' ? 'Add New Animal' : 'Edit Animal'}
              </h2>
              <p className="text-blue-100">
                {mode === 'create' ? 'Enter animal information with multi-role assignment' : `Editing ${animal?.name}`}
              </p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-white hover:bg-blue-700"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[60vh]">
          <div className="p-6 space-y-6">
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Animal ID *
                  </label>
                  <input
                    type="text"
                    value={formData.animalID}
                    onChange={(e) => handleInputChange('animalID', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.animalID ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={`e.g., ${speciesConfig.prefix}-2025-001`}
                    disabled={mode === 'create'} // Auto-generated for new animals
                  />
                  {errors.animalID && <p className="text-red-500 text-xs mt-1">{errors.animalID}</p>}
                  {mode === 'create' && (
                    <p className="text-xs text-gray-500 mt-1">Auto-generated based on species</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Desert Star"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Species *
                  </label>
                  <select
                    value={formData.species}
                    onChange={(e) => handleInputChange('species', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(SPECIES_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>{config.label}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Max age: {speciesConfig.maxAge} years, Weight: {speciesConfig.weightRange.min}-{speciesConfig.weightRange.max}kg
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sex *
                  </label>
                  <select
                    value={formData.sex}
                    onChange={(e) => handleInputChange('sex', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Breed/Type
                  </label>
                  <select
                    value={formData.breed || ''}
                    onChange={(e) => handleInputChange('breed', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select breed</option>
                    {speciesConfig.defaultBreeds.map(breed => (
                      <option key={breed} value={breed}>{breed}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.values(AnimalStatus).map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Date
                  </label>
                  <input
                    type="date"
                    value={formData.registrationDate}
                    onChange={(e) => handleInputChange('registrationDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth || ''}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Roles & Purpose Tab */}
            {activeTab === 'roles' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Animal Roles *</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Select one or more roles for this animal. Each role determines which modules and workflows the animal can participate in.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.values(AnimalRole).map((role) => {
                      const roleConfig = getRoleDisplayInfo(role);
                      const isSelected = formData.selectedRoles.includes(role);
                      
                      return (
                        <div
                          key={role}
                          onClick={() => handleRoleToggle(role)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{roleConfig.icon}</div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{role}</div>
                              <div className="text-xs text-gray-500 mt-1">{roleConfig.description}</div>
                              <div className="text-xs text-gray-400 mt-1">
                                Modules: {roleConfig.associatedModules.join(', ')}
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                            }`}>
                              {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {errors.roles && <p className="text-red-500 text-sm mt-2">{errors.roles}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Purpose
                  </label>
                  <select
                    value={formData.purpose || ''}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Purpose</option>
                    {Object.values(AnimalPurpose).map((purpose) => (
                      <option key={purpose} value={purpose}>{purpose}</option>
                    ))}
                  </select>
                </div>

                {/* Role Preview */}
                {formData.selectedRoles.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Roles Preview</h4>
                    <div className="flex flex-wrap gap-2">
                      {formData.selectedRoles.map((role) => {
                        const roleConfig = getRoleDisplayInfo(role);
                        return (
                          <span
                            key={role}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${roleConfig.color}`}
                          >
                            <span className="mr-1">{roleConfig.icon}</span>
                            {role}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Physical Information Tab */}
            {activeTab === 'physical' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age (years)
                  </label>
                  <input
                    type="number"
                    value={formData.age || ''}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value) || undefined)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.age ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    min="0"
                    max={speciesConfig.maxAge}
                  />
                  {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                  <p className="text-xs text-gray-500 mt-1">Maximum age for {speciesConfig.label}: {speciesConfig.maxAge} years</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weight || ''}
                    onChange={(e) => handleInputChange('weight', parseInt(e.target.value) || undefined)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.weight ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                    min={speciesConfig.weightRange.min}
                    max={speciesConfig.weightRange.max}
                  />
                  {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    Expected range: {speciesConfig.weightRange.min}-{speciesConfig.weightRange.max}kg
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color/Markings
                  </label>
                  <select
                    value={formData.color || ''}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select color</option>
                    {speciesConfig.colors.map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={formData.height || ''}
                    onChange={(e) => handleInputChange('height', parseInt(e.target.value) || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Microchip ID
                  </label>
                  <input
                    type="text"
                    value={formData.microchip || ''}
                    onChange={(e) => handleInputChange('microchip', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.microchip ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., MC123456789012345"
                  />
                  {errors.microchip && <p className="text-red-500 text-xs mt-1">{errors.microchip}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional notes about the animal..."
                  />
                </div>
              </div>
            )}

            {/* Lineage Tab */}
            {activeTab === 'lineage' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Father Name
                  </label>
                  <input
                    type="text"
                    value={formData.fatherName || ''}
                    onChange={(e) => handleInputChange('fatherName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Desert King"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Father ID
                  </label>
                  <input
                    type="text"
                    value={formData.fatherID || ''}
                    onChange={(e) => handleInputChange('fatherID', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`e.g., ${speciesConfig.prefix}-2020-001`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mother Name
                  </label>
                  <input
                    type="text"
                    value={formData.motherName || ''}
                    onChange={(e) => handleInputChange('motherName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Royal Princess"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mother ID
                  </label>
                  <input
                    type="text"
                    value={formData.motherID || ''}
                    onChange={(e) => handleInputChange('motherID', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`e.g., ${speciesConfig.prefix}-2021-002`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Family/Bloodline
                  </label>
                  <input
                    type="text"
                    value={formData.family || ''}
                    onChange={(e) => handleInputChange('family', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Elite Bloodline A"
                  />
                </div>
              </div>
            )}

            {/* Customer Tab */}
            {activeTab === 'customer' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Existing Customer
                  </label>
                  <select
                    onChange={(e) => handleCustomerSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose customer...</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.customerId}) - {customer.region}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        value={formData.customer?.name || ''}
                        onChange={(e) => handleCustomerChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Al-Majd Farm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer ID
                      </label>
                      <input
                        type="text"
                        value={formData.customer?.customerID || ''}
                        onChange={(e) => handleCustomerChange('customerID', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., CUS-001"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Region
                      </label>
                      <input
                        type="text"
                        value={formData.customer?.region || ''}
                        onChange={(e) => handleCustomerChange('region', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Riyadh"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={formData.customer?.category || 'Standard'}
                        onChange={(e) => handleCustomerChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Standard">Standard</option>
                        <option value="Premium">Premium</option>
                        <option value="VIP">VIP</option>
                        <option value="Research">Research</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        value={formData.customer?.contactNumber || ''}
                        onChange={(e) => handleCustomerChange('contactNumber', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.customerContact ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+966501234567"
                      />
                      {errors.customerContact && <p className="text-red-500 text-xs mt-1">{errors.customerContact}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.customer?.email || ''}
                        onChange={(e) => handleCustomerChange('email', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.customerEmail ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="contact@almajd.com"
                      />
                      {errors.customerEmail && <p className="text-red-500 text-xs mt-1">{errors.customerEmail}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Location
                  </label>
                  <input
                    type="text"
                    value={formData.currentLocation || ''}
                    onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Section A-1, Breeding Facility"
                  />
                </div>

                {mode === 'create' && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Hash className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.generateInternalNumber}
                            onChange={(e) => handleInputChange('generateInternalNumber', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            Generate Internal Number
                          </span>
                        </label>
                        <p className="text-xs text-gray-600 mt-1">
                          Automatically assign a unique internal tracking number for cross-module workflows
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {mode === 'edit' && animal?.currentInternalNumber && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Current Internal Number</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-mono text-lg text-gray-900">{animal.currentInternalNumber.internalNumber}</div>
                        <div className="text-xs text-gray-500">
                          Assigned: {new Date(animal.currentInternalNumber.assignedDate).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-green-600 text-sm font-medium">Active</div>
                    </div>
                  </div>
                )}

                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">System Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-600">Animal ID</label>
                      <p className="font-mono text-gray-900">{formData.animalID}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Species Code</label>
                      <p className="font-mono text-gray-900">{speciesConfig.prefix}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Registration Date</label>
                      <p className="text-gray-900">{formData.registrationDate}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Status</label>
                      <p className="text-gray-900">{formData.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {mode === 'create' ? 'All fields marked with * are required' : 'Changes will be saved immediately'}
            </div>
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                {mode === 'create' ? 'Create Animal' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}; 