import React, { useState, useEffect, useCallback } from 'react';
import { X, Save, User, Heart, Hash, TestTube, MapPin, Calendar, QrCode, Building, Tag, ChevronDown, Plus, Trash2, AlertCircle, CheckCircle, Loader2, Download } from 'lucide-react';
import { Button } from './components/ui/Button';
import { ValidatedInput, useToast } from './components/ui/Toast';
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
  getRoleDisplayInfo 
} from '../utils/animalUtils';
import {
  validateField,
  validateAnimalForm,
  validateUniqueField,
  ValidationError,
  ValidationResult
} from '../utils/validation';

interface EnhancedAnimalFormProps {
  animal?: Animal | null;
  mode: 'create' | 'edit';
  isOpen: boolean;
  onClose: () => void;
  onSave: (animal: Animal) => void;
}

export const EnhancedAnimalForm: React.FC<EnhancedAnimalFormProps> = ({
  animal,
  mode,
  isOpen,
  onClose,
  onSave
}) => {
  // Form state
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

  // Validation state
  const [fieldErrors, setFieldErrors] = useState<Record<string, ValidationError>>({});
  const [isValidating, setIsValidating] = useState<Set<string>>(new Set());
  const [hasValidated, setHasValidated] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState('basic');
  const [customers, setCustomers] = useState<any[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { showSuccess, showError, showWarning, showValidationError } = useToast();

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
      const existingIDs: string[] = [];
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
      const existingIDs: string[] = [];
      const generatedID = generateAnimalID(formData.species, existingIDs);
      setFormData(prev => ({
        ...prev,
        animalID: generatedID
      }));
      
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.animalID;
        return newErrors;
      });
    }
  }, [formData.species, mode]);

  // Load customers on form open
  useEffect(() => {
    if (isOpen) {
      fetchCustomers();
    }
  }, [isOpen]);

  // Real-time form validation
  useEffect(() => {
    if (hasValidated) {
      const result = validateAnimalForm(formData);
      setIsFormValid(result.isValid);
      setFieldErrors(result.fieldErrors);
    }
  }, [formData, hasValidated]);

  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const mockCustomers = [
        { id: '1', name: 'Al-Majd Farm', customerId: 'CUS-001', region: 'Riyadh', category: 'Premium' },
        { id: '2', name: 'Royal Stables', customerId: 'CUS-002', region: 'Dubai', category: 'VIP' },
        { id: '3', name: 'Elite Breeding Center', customerId: 'CUS-003', region: 'Al Khobar', category: 'VIP' },
        { id: '4', name: 'Desert Racing Club', customerId: 'CUS-004', region: 'Abu Dhabi', category: 'Standard' },
        { id: '5', name: 'Green Valley Ranch', customerId: 'CUS-005', region: 'Dammam', category: 'Premium' }
      ];
      setCustomers(mockCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showError('Error loading customers', 'Unable to load customer list. Please try again.');
      setCustomers([]);
    } finally {
      setLoadingCustomers(false);
    }
  };

  // Real-time field validation
  const validateFieldAsync = useCallback(async (field: string, value: any) => {
    setIsValidating(prev => new Set(prev).add(field));
    
    try {
      const error = validateField(field, value, formData);
      let asyncError: ValidationError | null = null;
      if ((field === 'animalID' || field === 'microchip') && value) {
        asyncError = await validateUniqueField(field, value, animal?.id);
      }
      
      const finalError = asyncError || error;
      
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        if (finalError) {
          newErrors[field] = finalError;
        } else {
          delete newErrors[field];
        }
        return newErrors;
      });
      
    } catch (err) {
      console.error(`Validation error for ${field}:`, err);
    } finally {
      setIsValidating(prev => {
        const newSet = new Set(prev);
        newSet.delete(field);
        return newSet;
      });
    }
  }, [formData, animal?.id]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (!hasValidated) {
      setHasValidated(true);
    }

    const asyncFields = ['animalID', 'microchip', 'name'];
    if (asyncFields.includes(field)) {
      const timeoutId = setTimeout(() => {
        validateFieldAsync(field, value);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  };

  const handleRoleToggle = (role: string) => {
    const newRoles = formData.selectedRoles.includes(role)
      ? formData.selectedRoles.filter(r => r !== role)
      : [...formData.selectedRoles, role];
    
    setFormData(prev => ({
      ...prev,
      selectedRoles: newRoles
    }));

    if (hasValidated) {
      const error = validateField('selectedRoles', newRoles, formData);
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        if (error) {
          newErrors.selectedRoles = error;
        } else {
          delete newErrors.selectedRoles;
        }
        return newErrors;
      });
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
      
      showSuccess('Customer selected', `Selected ${selectedCustomer.name} as owner`);
    }
  };

  const downloadTemplate = useCallback(() => {
    const headers = [
      'animalID', 'name', 'species', 'sex', 'status', 'breed', 'age', 'color', 'purpose',
      'microchip', 'owner', 'fatherName', 'motherName', 'dateOfBirth', 'weight', 'height',
      'customerName', 'customerID', 'customerRegion', 'customerContact',
      'customerEmail', 'customerCategory', 'notes'
    ];

    const templateData = [{
      animalID: 'BV-2025-001',
      name: 'Example Animal',
      species: 'BOVINE',
      sex: 'FEMALE',
      status: 'ACTIVE',
      breed: 'Holstein',
      age: 4,
      color: 'Black & White',
      purpose: 'Breeding',
      microchip: 'MC001234567890',
      owner: 'Al-Majd Farm',
      fatherName: 'Thunder King',
      motherName: 'Star Queen',
      dateOfBirth: '2021-03-15',
      weight: 650,
      height: 140,
      customerName: 'Al-Majd Farm',
      customerID: 'CUS-001',
      customerRegion: 'Riyadh',
      customerContact: '+966123456789',
      customerEmail: 'contact@almajd.com',
      customerCategory: 'Premium',
      notes: 'Example entry for reference'
    }];

    const csvContent = [
      headers.join(','),
      ...templateData.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'animal_form_template.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const validationResult = validateAnimalForm(formData);
      
      if (!validationResult.isValid) {
        const errorMessages = validationResult.errors.map(e => e.message);
        const warningMessages = validationResult.warnings.map(w => w.message);
        
        showValidationError(errorMessages, warningMessages);
        setFieldErrors(validationResult.fieldErrors);
        setHasValidated(true);
        return;
      }

      if (validationResult.warnings.length > 0) {
        const warningMessages = validationResult.warnings.map(w => w.message);
        showWarning('Validation Warnings', `${warningMessages.length} warnings found. Please review.`);
      }

      const roles = formData.selectedRoles.map(role => ({
        role: role as any,
        assignedAt: new Date().toISOString(),
        assignedBy: 'System Admin',
        isActive: true,
        notes: `Assigned during ${mode === 'create' ? 'creation' : 'edit'}`
      }));

      let internalNumberHistory = animal?.internalNumberHistory || [];
      let currentInternalNumber = animal?.currentInternalNumber;

      if (formData.generateInternalNumber && mode === 'create') {
        const existingNumbers: string[] = [];
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

      await new Promise(resolve => setTimeout(resolve, 1000));

      onSave(animalData);
      showSuccess(
        mode === 'create' ? 'Animal created' : 'Animal updated',
        `${animalData.name} has been ${mode === 'create' ? 'created' : 'updated'} successfully.`
      );
      onClose();
      
    } catch (error) {
      console.error('Error saving animal:', error);
      showError('Save failed', 'Unable to save animal data. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (hasValidated && Object.keys(fieldErrors).length > 0) {
      const proceed = window.confirm(
        'You have unsaved changes with validation errors. Are you sure you want to close without saving?'
      );
      if (!proceed) return;
    }
    onClose();
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
  const errorCount = Object.values(fieldErrors).filter(e => e.severity === 'error').length;
  const warningCount = Object.values(fieldErrors).filter(e => e.severity === 'warning').length;

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
            
            <div className="flex items-center space-x-3">
              {/* Validation Status */}
              {hasValidated && (
                <div className="flex items-center space-x-2">
                  {errorCount > 0 && (
                    <div className="flex items-center text-red-200 bg-red-500 bg-opacity-20 px-3 py-1 rounded-md">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">{errorCount} error{errorCount > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {warningCount > 0 && (
                    <div className="flex items-center text-yellow-200 bg-yellow-500 bg-opacity-20 px-3 py-1 rounded-md">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">{warningCount} warning{warningCount > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {isFormValid && (
                    <div className="flex items-center text-green-200 bg-green-500 bg-opacity-20 px-3 py-1 rounded-md">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm">Valid</span>
                    </div>
                  )}
                </div>
              )}
              
              <Button
                onClick={downloadTemplate}
                variant="ghost"
                className="text-white hover:bg-blue-700"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Template
              </Button>
              
              <Button
                onClick={handleClose}
                variant="ghost"
                className="text-white hover:bg-blue-700"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const tabHasErrors = Object.keys(fieldErrors).some(field => {
                const fieldTabMap: Record<string, string> = {
                  animalID: 'basic', name: 'basic', species: 'basic', sex: 'basic',
                  selectedRoles: 'roles', purpose: 'roles',
                  age: 'physical', weight: 'physical', color: 'physical',
                  fatherName: 'lineage', motherName: 'lineage',
                  customerEmail: 'customer', customerPhone: 'customer'
                };
                return fieldTabMap[field] === tab.id && fieldErrors[field].severity === 'error';
              });

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 relative ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tabHasErrors && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                  )}
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
                <ValidatedInput
                  label="Animal ID"
                  value={formData.animalID}
                  onChange={(e) => handleInputChange('animalID', e.target.value)}
                  error={fieldErrors.animalID?.severity === 'error' ? fieldErrors.animalID.message : undefined}
                  warning={fieldErrors.animalID?.severity === 'warning' ? fieldErrors.animalID.message : undefined}
                  helperText={mode === 'create' ? 'Auto-generated based on species' : undefined}
                  disabled={mode === 'create'}
                  required
                />

                <ValidatedInput
                  label="Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={fieldErrors.name?.severity === 'error' ? fieldErrors.name.message : undefined}
                  warning={fieldErrors.name?.severity === 'warning' ? fieldErrors.name.message : undefined}
                  placeholder="e.g., Desert Star"
                  required
                />

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

                <ValidatedInput
                  label="Registration Date"
                  type="date"
                  value={formData.registrationDate}
                  onChange={(e) => handleInputChange('registrationDate', e.target.value)}
                />

                <ValidatedInput
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  error={fieldErrors.dateOfBirth?.severity === 'error' ? fieldErrors.dateOfBirth.message : undefined}
                  warning={fieldErrors.dateOfBirth?.severity === 'warning' ? fieldErrors.dateOfBirth.message : undefined}
                />
              </div>
            )}

            {/* Roles & Purpose Tab */}
            {activeTab === 'roles' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Animal Roles *</h3>
                    {fieldErrors.selectedRoles && (
                      <div className="flex items-center text-red-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="text-sm">{fieldErrors.selectedRoles.message}</span>
                      </div>
                    )}
                  </div>
                  
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purpose
                  </label>
                  <select
                    value={formData.purpose || ''}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select purpose</option>
                    {Object.values(AnimalPurpose).map((purpose) => (
                      <option key={purpose} value={purpose}>{purpose}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Physical Characteristics Tab */}
            {activeTab === 'physical' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ValidatedInput
                  label="Age (years)"
                  type="number"
                  value={formData.age || ''}
                  onChange={(e) => handleInputChange('age', parseFloat(e.target.value) || undefined)}
                  error={fieldErrors.age?.severity === 'error' ? fieldErrors.age.message : undefined}
                  warning={fieldErrors.age?.severity === 'warning' ? fieldErrors.age.message : undefined}
                  info={fieldErrors.age?.severity === 'info' ? fieldErrors.age.message : undefined}
                  min="0"
                  max={speciesConfig.maxAge}
                  step="0.1"
                />

                <ValidatedInput
                  label="Weight (kg)"
                  type="number"
                  value={formData.weight || ''}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || undefined)}
                  error={fieldErrors.weight?.severity === 'error' ? fieldErrors.weight.message : undefined}
                  warning={fieldErrors.weight?.severity === 'warning' ? fieldErrors.weight.message : undefined}
                  min="0"
                  max="5000"
                  step="0.1"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
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

                <ValidatedInput
                  label="Height (cm)"
                  type="number"
                  value={formData.height || ''}
                  onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || undefined)}
                  min="0"
                  max="300"
                />

                <ValidatedInput
                  label="Microchip"
                  value={formData.microchip || ''}
                  onChange={(e) => handleInputChange('microchip', e.target.value)}
                  error={fieldErrors.microchip?.severity === 'error' ? fieldErrors.microchip.message : undefined}
                  warning={fieldErrors.microchip?.severity === 'warning' ? fieldErrors.microchip.message : undefined}
                  placeholder="e.g., MC123456789012345"
                />

                <ValidatedInput
                  label="Current Location"
                  value={formData.currentLocation || ''}
                  onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                  placeholder="e.g., Barn A - Section 2"
                />
              </div>
            )}

            {/* Lineage Tab */}
            {activeTab === 'lineage' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ValidatedInput
                  label="Father Name"
                  value={formData.fatherName || ''}
                  onChange={(e) => handleInputChange('fatherName', e.target.value)}
                  placeholder="e.g., Thunder King"
                />

                <ValidatedInput
                  label="Mother Name"
                  value={formData.motherName || ''}
                  onChange={(e) => handleInputChange('motherName', e.target.value)}
                  placeholder="e.g., Star Queen"
                />

                <ValidatedInput
                  label="Father ID"
                  value={formData.fatherID || ''}
                  onChange={(e) => handleInputChange('fatherID', e.target.value)}
                  placeholder="e.g., CM-2020-001"
                />

                <ValidatedInput
                  label="Mother ID"
                  value={formData.motherID || ''}
                  onChange={(e) => handleInputChange('motherID', e.target.value)}
                  placeholder="e.g., CM-2019-005"
                />

                <ValidatedInput
                  label="Family Line"
                  value={formData.family || ''}
                  onChange={(e) => handleInputChange('family', e.target.value)}
                  placeholder="e.g., Royal Bloodline"
                />

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

            {/* Customer Tab */}
            {activeTab === 'customer' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quick Select Customer
                    </label>
                    <div className="relative">
                      <select
                        onChange={(e) => handleCustomerSelect(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loadingCustomers}
                      >
                        <option value="">Select existing customer...</option>
                        {customers.map(customer => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name} ({customer.region})
                          </option>
                        ))}
                      </select>
                      {loadingCustomers && (
                        <div className="absolute right-3 top-3">
                          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ValidatedInput
                      label="Customer Name"
                      value={formData.customer?.name || ''}
                      onChange={(e) => handleCustomerChange('name', e.target.value)}
                      placeholder="e.g., Al-Majd Farm"
                    />

                    <ValidatedInput
                      label="Customer ID"
                      value={formData.customer?.customerID || ''}
                      onChange={(e) => handleCustomerChange('customerID', e.target.value)}
                      placeholder="e.g., CUS-001"
                    />

                    <ValidatedInput
                      label="Region"
                      value={formData.customer?.region || ''}
                      onChange={(e) => handleCustomerChange('region', e.target.value)}
                      placeholder="e.g., Riyadh"
                    />

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

                    <ValidatedInput
                      label="Contact Number"
                      value={formData.customer?.contactNumber || ''}
                      onChange={(e) => handleCustomerChange('contactNumber', e.target.value)}
                      error={fieldErrors.customerPhone?.severity === 'error' ? fieldErrors.customerPhone.message : undefined}
                      warning={fieldErrors.customerPhone?.severity === 'warning' ? fieldErrors.customerPhone.message : undefined}
                      placeholder="+966501234567"
                    />

                    <ValidatedInput
                      label="Email"
                      type="email"
                      value={formData.customer?.email || ''}
                      onChange={(e) => handleCustomerChange('email', e.target.value)}
                      error={fieldErrors.customerEmail?.severity === 'error' ? fieldErrors.customerEmail.message : undefined}
                      placeholder="contact@customer.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Settings</h3>
                  
                  {mode === 'create' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.generateInternalNumber}
                          onChange={(e) => handleInputChange('generateInternalNumber', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          Generate Internal Number
                        </span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Automatically generate an internal tracking number for this animal
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {isValidating.size > 0 && (
                  <div className="flex items-center text-blue-600">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm">Validating...</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="outline"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  disabled={hasValidated && !isFormValid || isSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {mode === 'create' ? 'Create Animal' : 'Update Animal'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}; 