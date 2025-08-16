import React, { useState, useEffect } from 'react';
import { 
  Heart, Plus, Search, Filter, Edit, Trash2, Eye, Upload, Hash, Download, 
  FileText, Printer, ChevronDown, X, TestTube, Baby, Syringe, Calendar, 
  FlaskConical, PlusCircle, Activity, Info, AlertTriangle, Database, 
  Microscope, BarChart3, QrCode, Image, Clock, Settings, MapPin, User,
  Copy, CheckCircle, XCircle, TrendingUp, Users, Workflow
} from 'lucide-react';
import { Button } from './components/ui/Button';
import { Animal, AnimalFilterOptions, AnimalSummaryStats } from '../types/animalTypes';
import { 
  AnimalSpecies, 
  AnimalStatus, 
  AnimalRole,
  SPECIES_CONFIG, 
  ROLE_CONFIG, 
  STATUS_CONFIG 
} from '../types/animalStatus';
import { 
  filterAnimals, 
  calculateAnimalStats, 
  getActiveRoles, 
  getRoleDisplayInfo, 
  getAnimalWarnings,
  sortAnimals,
  exportAnimals,
  generateAnimalID,
  generateInternalNumber
} from '../utils/animalUtils';
import { AnimalForm } from '../components/AnimalForm';
import { EnhancedAnimalForm } from '../components/EnhancedAnimalForm';
import { BulkImport } from '../components/BulkImport';
import { OptimizedBulkImport } from '../components/OptimizedBulkImport';
import { InternalNumberManager } from '../components/InternalNumberManager';
import { EnhancedAnimalProfile } from '../components/EnhancedAnimalProfile';

const AnimalsPage: React.FC = () => {
  // Animal data states
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form and modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isInternalNumberManagerOpen, setIsInternalNumberManagerOpen] = useState(false);
  const [selectedAnimalForProfile, setSelectedAnimalForProfile] = useState<Animal | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<AnimalFilterOptions>({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Bulk operations
  const [selectedAnimals, setSelectedAnimals] = useState<Set<string>>(new Set());
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);

  // Sorting and pagination
  const [sortBy, setSortBy] = useState('animalID');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Statistics
  const [stats, setStats] = useState<AnimalSummaryStats | null>(null);

  // Generate comprehensive demo data with new structure
  const generateMockAnimals = (): Animal[] => {
    const mockAnimals: Animal[] = [];
    const customers = [
      { name: 'Al-Majd Farm', region: 'Riyadh', category: 'Premium' },
      { name: 'Royal Stables', region: 'Dubai', category: 'VIP' },
      { name: 'Desert Racing Club', region: 'Abu Dhabi', category: 'Standard' },
      { name: 'Green Valley Ranch', region: 'Dammam', category: 'Premium' },
      { name: 'Elite Breeding Center', region: 'Al Khobar', category: 'VIP' }
    ];

    for (let i = 1; i <= 50; i++) {
      const species = Object.values(AnimalSpecies)[Math.floor(Math.random() * Object.values(AnimalSpecies).length)];
      const sex = Math.random() > 0.5 ? 'MALE' : 'FEMALE';
      const status = Object.values(AnimalStatus)[Math.floor(Math.random() * Object.values(AnimalStatus).length)];
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const speciesConfig = SPECIES_CONFIG[species];
      
      // Generate roles (animals can have multiple roles)
      const availableRoles = Object.values(AnimalRole);
      const numRoles = Math.floor(Math.random() * 3) + 1; // 1-3 roles
      const selectedRoles = [];
      for (let j = 0; j < numRoles; j++) {
        const role = availableRoles[Math.floor(Math.random() * availableRoles.length)];
        if (!selectedRoles.some(r => r.role === role)) {
          selectedRoles.push({
            role,
            assignedAt: new Date(2025, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
            assignedBy: 'System Admin',
            isActive: Math.random() > 0.2, // 80% chance of being active
            notes: `Assigned for ${role.toLowerCase()} activities`
          });
        }
      }

      const hasInternalNumber = Math.random() > 0.4; // 60% have internal numbers
      const internalNumberHistory = hasInternalNumber ? [{
        id: `int-${i}`,
        internalNumber: generateInternalNumber(),
        assignedAt: new Date(2025, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
        assignedBy: 'System Admin',
        reason: 'Initial registration',
        isActive: true
      }] : [];

      const animal: Animal = {
        id: i.toString(),
        animalID: generateAnimalID(species, mockAnimals.map(a => a.animalID)),
        name: `${speciesConfig.defaultBreeds[0]} ${['Star', 'King', 'Queen', 'Prince', 'Princess', 'Champion'][Math.floor(Math.random() * 6)]} ${i}`,
        species,
        sex,
        age: Math.floor(Math.random() * speciesConfig.maxAge) + 1,
        dateOfBirth: new Date(2025 - Math.floor(Math.random() * speciesConfig.maxAge) - 1, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        registrationDate: new Date(2025, 0, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
        roles: selectedRoles,
        breed: speciesConfig.defaultBreeds[Math.floor(Math.random() * speciesConfig.defaultBreeds.length)],
        color: speciesConfig.colors[Math.floor(Math.random() * speciesConfig.colors.length)],
        weight: Math.floor(Math.random() * (speciesConfig.weightRange.max - speciesConfig.weightRange.min)) + speciesConfig.weightRange.min,
        microchip: `MC${(1000000000000000 + i).toString()}`,
        purpose: ['Breeding', 'Racing', 'Dairy', 'Research'][Math.floor(Math.random() * 4)],
        status,
        owner: customer.name,
        customer: {
          name: customer.name,
          customerID: `CUS-${i.toString().padStart(3, '0')}`,
          region: customer.region,
          contactNumber: `+966${Math.floor(Math.random() * 900000000) + 100000000}`,
          email: `contact${i}@${customer.name.toLowerCase().replace(/\s+/g, '')}.com`,
          category: customer.category as any
        },
        currentInternalNumber: hasInternalNumber ? {
          id: internalNumberHistory[0].id,
          internalNumber: internalNumberHistory[0].internalNumber,
          isActive: true,
          assignedDate: internalNumberHistory[0].assignedAt.split('T')[0]
        } : undefined,
        internalNumberHistory,
        currentLocation: `Section ${String.fromCharCode(65 + Math.floor(i / 10))}-${(i % 10) + 1}`,
        genomicData: Math.random() > 0.6 ? {
          hasSNPData: true,
          hasSNPIndex: Math.random() > 0.5,
          hasBeadChip: Math.random() > 0.7,
          hasParentInfo: Math.random() > 0.4,
          missingParents: Math.random() > 0.8,
          snpCount: Math.floor(Math.random() * 50000) + 20000,
          beadChipId: `BC-${i.toString().padStart(3, '0')}`,
          fileSize: Math.floor(Math.random() * 5000000) + 1000000,
          qualityScore: 0.8 + Math.random() * 0.2,
          lastUpdated: new Date().toISOString()
        } : undefined,
        activityData: {
          hasUltrasound: Math.random() > 0.5,
          hasEmbryoTransfer: Math.random() > 0.8,
          hasBreeding: Math.random() > 0.4,
          hasLabResults: Math.random() > 0.6,
          hasVaccinations: Math.random() > 0.3,
          hasPhenotype: Math.random() > 0.7,
          hasInternalMedicine: Math.random() > 0.9,
          hasFlushing: Math.random() > 0.8,
          hasSemenCollection: Math.random() > 0.9,
          totalRecords: Math.floor(Math.random() * 25) + 1,
          lastActivity: new Date(2025, 0, Math.floor(Math.random() * 30) + 1).toISOString()
        },
        workflowData: Math.random() > 0.6 ? {
          currentWorkflow: {
            id: `wf-${i}`,
            name: ['Breeding Program', 'Research Study', 'Health Monitoring'][Math.floor(Math.random() * 3)],
            step: ['Assessment', 'Treatment', 'Monitoring'][Math.floor(Math.random() * 3)],
            progress: Math.floor(Math.random() * 100),
            nextAction: 'Schedule examination',
            dueDate: new Date(2025, 1, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
          },
          activeWorkflows: Math.floor(Math.random() * 3) + 1,
          completedWorkflows: Math.floor(Math.random() * 10),
          lastWorkflowUpdate: new Date().toISOString()
        } : {
          activeWorkflows: 0,
          completedWorkflows: 0
        },
        notes: Math.random() > 0.7 ? 'Excellent performance and health record. Recommended for breeding program.' : undefined,
        images: [],
        createdAt: new Date(2025, 0, Math.floor(Math.random() * 30) + 1).toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockAnimals.push(animal);
    }

    return mockAnimals;
  };

  // Initialize data
  useEffect(() => {
    const mockData = generateMockAnimals();
    setAnimals(mockData);
    setIsLoading(false);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = animals;

    // Apply search
    if (searchTerm) {
      result = result.filter(animal =>
        animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.animalID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.microchip?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.currentInternalNumber?.internalNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    result = filterAnimals(result, filters);

    // Apply sorting
    result = sortAnimals(result, sortBy, sortOrder);

    setFilteredAnimals(result);
  }, [animals, searchTerm, filters, sortBy, sortOrder]);

  // Calculate statistics
  useEffect(() => {
    const calculatedStats = calculateAnimalStats(animals);
    setStats(calculatedStats);
  }, [animals]);

  // Event handlers
  const handleCreateAnimal = () => {
    setSelectedAnimal(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEditAnimal = (animal: Animal) => {
    setSelectedAnimal(animal);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleViewAnimal = (animal: Animal) => {
    setSelectedAnimalForProfile(animal);
  };

  const handleDeleteAnimal = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this animal?')) {
      setAnimals(prev => prev.filter(animal => animal.id !== id));
      setSelectedAnimals(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleSaveAnimal = (animalData: Animal) => {
    if (formMode === 'create') {
      const newAnimal: Animal = {
        ...animalData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setAnimals(prev => [newAnimal, ...prev]);
    } else {
      setAnimals(prev => prev.map(animal => 
        animal.id === animalData.id 
          ? { ...animalData, updatedAt: new Date().toISOString() }
          : animal
      ));
    }
    setIsFormOpen(false);
  };

  const handleFilterChange = (newFilters: Partial<AnimalFilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm('');
  };

  const handleSelectAll = () => {
    if (selectedAnimals.size === filteredAnimals.length) {
      setSelectedAnimals(new Set());
    } else {
      setSelectedAnimals(new Set(filteredAnimals.map(animal => animal.id)));
    }
  };

  const handleSelectAnimal = (animalId: string) => {
    const newSelected = new Set(selectedAnimals);
    if (newSelected.has(animalId)) {
      newSelected.delete(animalId);
    } else {
      newSelected.add(animalId);
    }
    setSelectedAnimals(newSelected);
  };

  const handleExport = (format: 'json' | 'csv') => {
    const dataToExport = selectedAnimals.size > 0 
      ? filteredAnimals.filter(animal => selectedAnimals.has(animal.id))
      : filteredAnimals;
    
    const exportData = exportAnimals(dataToExport, format);
    const mimeType = format === 'json' ? 'application/json' : 'text/csv';
    const filename = `animals_export_${new Date().toISOString().split('T')[0]}.${format}`;
    
    const blob = new Blob([exportData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyAnimalID = (animalID: string) => {
    navigator.clipboard.writeText(animalID);
    // You could add a toast notification here
  };

  // Pagination
  const paginatedAnimals = filteredAnimals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(filteredAnimals.length / pageSize);

  const getActivityIcons = (activityData: Animal['activityData']) => {
    if (!activityData) return [];
    
    const icons = [];
    if (activityData.hasUltrasound) icons.push({ icon: Microscope, color: 'text-purple-600', title: 'Ultrasound' });
    if (activityData.hasEmbryoTransfer) icons.push({ icon: Baby, color: 'text-pink-600', title: 'Embryo Transfer' });
    if (activityData.hasBreeding) icons.push({ icon: Heart, color: 'text-red-600', title: 'Breeding' });
    if (activityData.hasLabResults) icons.push({ icon: TestTube, color: 'text-blue-600', title: 'Lab Results' });
    if (activityData.hasVaccinations) icons.push({ icon: Syringe, color: 'text-green-600', title: 'Vaccinations' });
    
    return icons.slice(0, 3); // Show max 3 icons
  };

  if (selectedAnimalForProfile) {
    return (
      <EnhancedAnimalProfile
        animal={selectedAnimalForProfile}
        onBack={() => setSelectedAnimalForProfile(null)}
        onEdit={() => {
          setSelectedAnimalForProfile(null);
          handleEditAnimal(selectedAnimalForProfile);
        }}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Heart className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Animal Database</h1>
            <p className="text-gray-600">Core data foundation for all workflows and modules</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => handleExport('csv')}
            variant="outline"
            className="text-orange-600 border-orange-200 hover:bg-orange-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          
          <Button
            onClick={() => setIsImportModalOpen(true)}
            variant="outline"
            className="text-green-600 border-green-200 hover:bg-green-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          
          <Button
            onClick={() => setIsInternalNumberManagerOpen(true)}
            variant="outline"
            className="text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            <Hash className="h-4 w-4 mr-2" />
            Manage IDs
          </Button>
          
          <Button
            onClick={handleCreateAnimal}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Animal
          </Button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Animals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">With Internal #</p>
                <p className="text-2xl font-bold text-purple-600">{stats.withInternalNumbers}</p>
              </div>
              <Hash className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Workflows</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.withActiveWorkflows}</p>
              </div>
              <Workflow className="h-8 w-8 text-indigo-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">With Genomic Data</p>
                <p className="text-2xl font-bold text-cyan-600">{stats.withGenomicData}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-cyan-600" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recently Added</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.recentlyAdded}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border shadow-sm space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search animals by ID, name, microchip, customer, or internal number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <Button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            variant="outline"
            className={showAdvancedFilters ? 'bg-blue-50 border-blue-200' : ''}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown className={`h-4 w-4 ml-2 transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
          </Button>

          {(Object.keys(filters).length > 0 || searchTerm) && (
            <Button onClick={clearFilters} variant="outline" className="text-red-600">
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
              <select
                value={filters.species?.[0] || ''}
                onChange={(e) => handleFilterChange({ 
                  species: e.target.value ? [e.target.value] : undefined 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Species</option>
                {Object.entries(SPECIES_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={filters.roles?.[0] || ''}
                onChange={(e) => handleFilterChange({ 
                  roles: e.target.value ? [e.target.value] : undefined 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Roles</option>
                {Object.values(AnimalRole).map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status?.[0] || ''}
                onChange={(e) => handleFilterChange({ 
                  status: e.target.value ? [e.target.value] : undefined 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                {Object.values(AnimalStatus).map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end space-x-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.hasInternalNumber || false}
                  onChange={(e) => handleFilterChange({ 
                    hasInternalNumber: e.target.checked ? true : undefined 
                  })}
                  className="mr-2"
                />
                <span className="text-sm">Has Internal #</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.hasActiveWorkflow || false}
                  onChange={(e) => handleFilterChange({ 
                    hasActiveWorkflow: e.target.checked ? true : undefined 
                  })}
                  className="mr-2"
                />
                <span className="text-sm">In Workflow</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedAnimals.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-900">
                {selectedAnimals.size} animal{selectedAnimals.size > 1 ? 's' : ''} selected
              </span>
              <Button
                onClick={() => setSelectedAnimals(new Set())}
                variant="ghost"
                size="sm"
                className="text-blue-700 hover:text-blue-900"
              >
                Clear selection
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => handleExport('csv')}
                size="sm"
                variant="outline"
                className="text-blue-700 border-blue-300"
              >
                Export Selected
              </Button>
              <Button
                onClick={() => setIsBulkEditOpen(true)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Bulk Edit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Animals Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedAnimals.size === filteredAnimals.length && filteredAnimals.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Animal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Internal #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Workflow
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedAnimals.map((animal) => {
                const activeRoles = getActiveRoles(animal);
                const warnings = getAnimalWarnings(animal);
                const activityIcons = getActivityIcons(animal.activityData);
                const statusConfig = STATUS_CONFIG[animal.status];

                return (
                  <tr key={animal.id} className={selectedAnimals.has(animal.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedAnimals.has(animal.id)}
                        onChange={() => handleSelectAnimal(animal.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <div className="text-sm font-medium text-gray-900">{animal.name}</div>
                            {warnings.length > 0 && (
                              <AlertTriangle className="h-4 w-4 text-amber-500" title={warnings.join(', ')} />
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <button
                              onClick={() => handleCopyAnimalID(animal.animalID)}
                              className="text-xs text-gray-500 hover:text-blue-600 flex items-center"
                            >
                              {animal.animalID}
                              <Copy className="h-3 w-3 ml-1" />
                            </button>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{SPECIES_CONFIG[animal.species].label}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {activeRoles.slice(0, 2).map((role, index) => {
                          const roleConfig = getRoleDisplayInfo(role.role);
                          return (
                            <span
                              key={index}
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleConfig.color}`}
                            >
                              <span className="mr-1">{roleConfig.icon}</span>
                              {role.role}
                            </span>
                          );
                        })}
                        {activeRoles.length > 2 && (
                          <span className="text-xs text-gray-500">+{activeRoles.length - 2}</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {animal.currentInternalNumber ? (
                        <div className="text-sm">
                          <div className="font-mono text-gray-900">{animal.currentInternalNumber.internalNumber}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(animal.currentInternalNumber.assignedDate).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No number</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                        {statusConfig.icon} {animal.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {activityIcons.map((activity, index) => {
                          const Icon = activity.icon;
                          return (
                            <Icon
                              key={index}
                              className={`h-4 w-4 ${activity.color}`}
                              title={activity.title}
                            />
                          );
                        })}
                        {animal.activityData && animal.activityData.totalRecords > 3 && (
                          <span className="text-xs text-gray-500">+{animal.activityData.totalRecords - 3}</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {animal.workflowData?.currentWorkflow ? (
                        <div className="text-sm">
                          <div className="text-gray-900 truncate max-w-24" title={animal.workflowData.currentWorkflow.name}>
                            {animal.workflowData.currentWorkflow.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {animal.workflowData.currentWorkflow.progress}% complete
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">No workflow</span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleViewAnimal(animal)}
                          size="sm"
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleEditAnimal(animal)}
                          size="sm"
                          variant="ghost"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteAnimal(animal.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * pageSize, filteredAnimals.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredAnimals.length}</span> animals
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="rounded-l-md"
                  >
                    Previous
                  </Button>
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        className="rounded-none"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="rounded-r-md"
                  >
                    Next
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {isFormOpen && (
        <EnhancedAnimalForm
          animal={selectedAnimal}
          mode={formMode}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveAnimal}
        />
      )}

      {isImportModalOpen && (
        <OptimizedBulkImport
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImport={(data) => {
            // Handle enhanced import with better performance
            console.log('Importing animals:', data.length);
            setAnimals(prev => [...data, ...prev]);
            setIsImportModalOpen(false);
          }}
        />
      )}

      {isInternalNumberManagerOpen && (
        <InternalNumberManager
          isOpen={isInternalNumberManagerOpen}
          onClose={() => setIsInternalNumberManagerOpen(false)}
          animals={animals}
          onUpdateAnimal={(animalId, internalNumber) => {
            setAnimals(prev => prev.map(animal =>
              animal.id === animalId
                ? { ...animal, currentInternalNumber: internalNumber }
                : animal
            ));
          }}
        />
      )}
    </div>
  );
};

export { AnimalsPage }; 