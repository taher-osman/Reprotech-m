import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Upload,
  Trash2,
  Package,
  TestTube,
  BarChart3,
  Calendar,
  MapPin,
  Eye,
  RefreshCw,
  QrCode,
  Move,
  Activity,
  Sliders
} from 'lucide-react';
import { SampleForm } from '../components/SampleForm';
import { SampleTable } from '../components/SampleTable';
import { SampleDetailModal } from '../components/SampleDetailModal';
import { SampleBatchAction, BatchActionType, BatchActionParams } from '../components/SampleBatchAction';
import { AutoImportPanel } from '../components/AutoImportPanel';
import { SampleDragDropBoard } from '../components/SampleDragDropBoard';
import { LabIntegrationHub } from '../components/LabIntegrationHub';
import { 
  Sample, 
  Animal, 
  SampleFilters, 
  SampleStats,
  SAMPLE_TYPES,
  SAMPLE_STATUSES,
  GENETIC_STATUSES,
  STORAGE_LOCATIONS
} from '../types/sampleTypes';

export const SampleManagementPage: React.FC = () => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filteredSamples, setFilteredSamples] = useState<Sample[]>([]);
  const [selectedSamples, setSelectedSamples] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [activeTab, setActiveTab] = useState<'all' | 'embryo' | 'oocyte' | 'semen' | 'blood' | 'DNA' | 'import' | 'drag-drop' | 'lab-integration'>('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Detail modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailSample, setDetailSample] = useState<Sample | null>(null);
  
  // Batch action modal state
  const [isBatchActionOpen, setIsBatchActionOpen] = useState(false);
  
  // Phase 3 state
  const [dragDropGroupBy, setDragDropGroupBy] = useState<'status' | 'location'>('status');

  const [filters, setFilters] = useState<SampleFilters>({
    searchTerm: '',
    sampleType: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    location: '',
    researchOnly: false,
    geneticStatus: ''
  });

  const [stats, setStats] = useState<SampleStats>({
    totalSamples: 0,
    freshSamples: 0,
    biobankSamples: 0,
    usedSamples: 0,
    researchSamples: 0,
    byType: { embryo: 0, oocyte: 0, semen: 0, blood: 0, DNA: 0 },
    byStatus: { Fresh: 0, Used: 0, Assigned: 0, 'In Transfer': 0, Research: 0, 'Assigned to Biobank': 0, Discarded: 0 }
  });

  // Sample data - replace with API calls
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Sample animals data
        const sampleAnimals: Animal[] = [
          { id: '1', name: 'Bella', internalNumber: 'C001', species: 'CAMEL', sex: 'FEMALE' },
          { id: '2', name: 'Luna', internalNumber: 'C002', species: 'CAMEL', sex: 'FEMALE' },
          { id: '3', name: 'Star', internalNumber: 'C003', species: 'CAMEL', sex: 'FEMALE' },
          { id: '4', name: 'Thunder', internalNumber: 'B001', species: 'BOVINE', sex: 'MALE' },
          { id: '5', name: 'Storm', internalNumber: 'B002', species: 'BOVINE', sex: 'MALE' },
          { id: '6', name: 'Princess', internalNumber: 'E001', species: 'EQUINE', sex: 'FEMALE' },
        ];

        // Sample data with realistic variety
        const sampleData: Sample[] = [
          {
            id: '1',
            sample_id: 'SMPL-2025-0001',
            animal_id: '1',
            animal_name: 'Bella',
            sample_type: 'embryo',
            collection_method: 'Flushing',
            collection_date: '2025-01-15',
            status: 'Assigned to Biobank',
            location: 'Lab Processing Area',
            research_flag: false,
            genetic_status: 'Normal',
            quality_score: 9,
            morphology_grade: 'A',
            cell_count: 128,
            container_type: '0.25ml Straw',
            created_by: 'Dr. Smith',
            created_at: '2025-01-15T10:30:00Z',
            updated_at: '2025-01-15T10:30:00Z',
            notes: 'High quality blastocyst - sent to biobank for freezing'
          },
          {
            id: '2',
            sample_id: 'SMPL-2025-0002',
            animal_id: '2',
            animal_name: 'Luna',
            sample_type: 'oocyte',
            collection_method: 'OPU',
            collection_date: '2025-01-14',
            status: 'Fresh',
            location: 'Quality Control Lab',
            research_flag: true,
            genetic_status: 'Untested',
            quality_score: 7,
            morphology_grade: 'B',
            cell_count: 1,
            viability_percentage: 85,
            created_by: 'Dr. Johnson',
            created_at: '2025-01-14T14:20:00Z',
            updated_at: '2025-01-14T14:20:00Z',
            notes: 'Collected for research project'
          },
          {
            id: '3',
            sample_id: 'SMPL-2025-0003',
            animal_id: '4',
            animal_name: 'Thunder',
            sample_type: 'semen',
            collection_method: 'Semen Collection',
            collection_date: '2025-01-13',
            status: 'Assigned to Biobank',
            location: 'Sample Prep Station',
            research_flag: false,
            genetic_status: 'Normal',
            quality_score: 8,
            volume_ml: 5.2,
            concentration: 850,
            motility_percentage: 72,
            viability_percentage: 88,
            container_type: '0.5ml Straw',
            created_by: 'Lab Tech',
            created_at: '2025-01-13T09:15:00Z',
            updated_at: '2025-01-13T09:15:00Z',
            notes: 'Excellent motility - prepared for biobank storage'
          },
          {
            id: '4',
            sample_id: 'SMPL-2025-0004',
            animal_id: '3',
            animal_name: 'Star',
            sample_type: 'blood',
            collection_method: 'Blood Draw',
            collection_date: '2025-01-12',
            status: 'Used',
            location: 'Research Lab',
            research_flag: true,
            genetic_status: 'Carrier',
            volume_ml: 10,
            created_by: 'Dr. Williams',
            created_at: '2025-01-12T11:45:00Z',
            updated_at: '2025-01-12T16:30:00Z',
            notes: 'Used for genetic testing'
          },
          {
            id: '5',
            sample_id: 'SMPL-2025-0005',
            animal_id: '6',
            animal_name: 'Princess',
            sample_type: 'DNA',
            collection_method: 'Biopsy',
            collection_date: '2025-01-11',
            status: 'Assigned',
            location: 'Awaiting Processing',
            research_flag: true,
            genetic_status: 'Untested',
            concentration: 125.5,
            volume_ml: 0.1,
            created_by: 'Dr. Brown',
            created_at: '2025-01-11T13:20:00Z',
            updated_at: '2025-01-11T13:20:00Z',
            notes: 'Assigned to genomic study'
          }
        ];

        setAnimals(sampleAnimals);
        setSamples(sampleData);
        
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

      // Calculate statistics
  useEffect(() => {
    const newStats: SampleStats = {
      totalSamples: samples.length,
      freshSamples: samples.filter(s => s.status === 'Fresh').length,
      biobankSamples: samples.filter(s => s.status === 'Assigned to Biobank').length,
      usedSamples: samples.filter(s => s.status === 'Used').length,
      researchSamples: samples.filter(s => s.research_flag).length,
      byType: { embryo: 0, oocyte: 0, semen: 0, blood: 0, DNA: 0 },
      byStatus: { Fresh: 0, Used: 0, Assigned: 0, 'In Transfer': 0, Research: 0, 'Assigned to Biobank': 0, Discarded: 0 }
    };

    samples.forEach(sample => {
      newStats.byType[sample.sample_type]++;
      newStats.byStatus[sample.status]++;
    });

    setStats(newStats);
  }, [samples]);

  // Apply filters
  useEffect(() => {
    let filtered = [...samples];

    // Tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(sample => sample.sample_type === activeTab);
    }

    // Search filter
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(sample =>
        sample.sample_id.toLowerCase().includes(searchLower) ||
        sample.animal_name?.toLowerCase().includes(searchLower) ||
        sample.notes?.toLowerCase().includes(searchLower)
      );
    }

    // Sample type filter
    if (filters.sampleType) {
      filtered = filtered.filter(sample => sample.sample_type === filters.sampleType);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(sample => sample.status === filters.status);
    }

    // Date filters
    if (filters.dateFrom) {
      filtered = filtered.filter(sample => sample.collection_date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(sample => sample.collection_date <= filters.dateTo);
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(sample => sample.location.includes(filters.location));
    }

    // Research filter
    if (filters.researchOnly) {
      filtered = filtered.filter(sample => sample.research_flag);
    }

    // Genetic status filter
    if (filters.geneticStatus) {
      filtered = filtered.filter(sample => sample.genetic_status === filters.geneticStatus);
    }

    setFilteredSamples(filtered);
  }, [samples, filters, activeTab]);

  const handleAddNew = () => {
    setSelectedSample(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEdit = (sample: Sample) => {
    setSelectedSample(sample);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDelete = async (sample: Sample) => {
    if (window.confirm(`Are you sure you want to delete sample ${sample.sample_id}?`)) {
      setSamples(prev => prev.filter(s => s.id !== sample.id));
      setSelectedSamples(prev => {
        const newSet = new Set(prev);
        newSet.delete(sample.id);
        return newSet;
      });
    }
  };

  const handleView = (sample: Sample) => {
    setDetailSample(sample);
    setIsDetailModalOpen(true);
  };

  const handleFormSave = (sampleData: Sample) => {
    if (formMode === 'edit') {
      setSamples(prev => prev.map(s => s.id === sampleData.id ? sampleData : s));
    } else {
      setSamples(prev => [sampleData, ...prev]);
    }
    setIsFormOpen(false);
    setSelectedSample(null);
  };

  const handleSelectSample = (sampleId: string) => {
    setSelectedSamples(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sampleId)) {
        newSet.delete(sampleId);
      } else {
        newSet.add(sampleId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedSamples(new Set(filteredSamples.map(s => s.id)));
    } else {
      setSelectedSamples(new Set());
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedSamples.size === 0) {
      alert('Please select samples first');
      return;
    }
    setIsBatchActionOpen(true);
  };

  const handleBatchActionExecute = async (action: BatchActionType, params?: BatchActionParams) => {
    const selectedSampleObjects = samples.filter(s => selectedSamples.has(s.id));
    
    try {
      switch (action.type) {
        case 'assign-to-biobank':
          const eligibleSamples = selectedSampleObjects.filter(s => 
            s.status === 'Fresh' || s.status === 'Assigned'
          );
          setSamples(prev => prev.map(sample => {
            if (eligibleSamples.find(s => s.id === sample.id)) {
              return {
                ...sample,
                status: 'Assigned to Biobank' as const,
                location: 'Lab Processing Area',
                updated_at: new Date().toISOString(),
                notes: `${sample.notes ? sample.notes + ' | ' : ''}Assigned to biobank${params?.notes ? ` - ${params.notes}` : ''}`
              };
            }
            return sample;
          }));
          break;
          
        case 'assign-research':
          const researchEligible = selectedSampleObjects.filter(s => 
            s.status !== 'Used' && s.status !== 'Discarded'
          );
          setSamples(prev => prev.map(sample => {
            if (researchEligible.find(s => s.id === sample.id)) {
              return {
                ...sample,
                status: 'Research' as const,
                research_flag: true,
                location: 'Research Lab',
                updated_at: new Date().toISOString(),
                notes: `${sample.notes ? sample.notes + ' | ' : ''}Assigned to research${params?.notes ? ` - ${params.notes}` : ''}`
              };
            }
            return sample;
          }));
          break;
          
        case 'update-location':
          if (params?.targetLocation) {
            setSamples(prev => prev.map(sample => {
              if (selectedSamples.has(sample.id)) {
                return {
                  ...sample,
                  location: params.targetLocation!,
                  updated_at: new Date().toISOString(),
                  notes: `${sample.notes ? sample.notes + ' | ' : ''}Location updated${params.notes ? ` - ${params.notes}` : ''}`
                };
              }
              return sample;
            }));
          }
          break;
          
        case 'export':
          // TODO: Implement actual export functionality
          console.log('Exporting samples:', selectedSampleObjects, params);
          break;
          
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${selectedSampleObjects.length} samples?`)) {
            setSamples(prev => prev.filter(s => !selectedSamples.has(s.id)));
          }
          break;
      }
      
      setSelectedSamples(new Set());
      setIsBatchActionOpen(false);
    } catch (error) {
      console.error('Batch action failed:', error);
      alert('Batch action failed');
    }
  };

  const handleAssignToBiobank = (sample: Sample) => {
    setSamples(prev => prev.map(s => 
      s.id === sample.id 
        ? {
            ...s,
            status: 'Assigned to Biobank' as const,
            location: 'Lab Processing Area',
            updated_at: new Date().toISOString(),
            notes: `${s.notes ? s.notes + ' | ' : ''}Assigned to biobank for freezing`
          }
        : s
    ));
    setIsDetailModalOpen(false);
  };

  const handleAutoImportedSamples = (newSamples: Sample[]) => {
    setSamples(prev => [...prev, ...newSamples]);
    // Switch to 'all' tab to show the newly imported samples
    setActiveTab('all');
  };

  const updateFilter = (key: keyof SampleFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Phase 3 handlers
  const handleSampleMove = (sampleId: string, newStatus: any, newLocation?: string) => {
    setSamples(prev => prev.map(sample => 
      sample.id === sampleId 
        ? {
            ...sample,
            ...(newLocation ? { location: newLocation } : {}),
            status: newStatus,
            updated_at: new Date().toISOString()
          }
        : sample
    ));
  };

  const handleEquipmentAction = (equipmentId: string, action: string) => {
    console.log(`Equipment ${equipmentId} action: ${action}`);
    // Implement equipment actions
  };

  const getTabCount = (type: string) => {
    if (type === 'all') return samples.length;
    if (['import', 'drag-drop', 'lab-integration'].includes(type)) return null; // Don't show count for these tabs
    return stats.byType[type as keyof typeof stats.byType] || 0;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FlaskConical className="h-8 w-8 text-teal-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sample Management</h1>
            <p className="text-gray-600">Track and manage biological samples across all collection methods</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">PHASE 1 ✓</span>
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">PHASE 2 ✓</span>
              <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded-full text-xs font-medium">PHASE 3 ACTIVE</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-200 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
          <button
            onClick={handleAddNew}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-teal-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Sample</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-teal-600" />
            <div className="text-2xl font-bold text-teal-600">{stats.totalSamples}</div>
          </div>
          <div className="text-sm text-gray-600">Total Samples</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-2">
            <TestTube className="h-5 w-5 text-green-600" />
            <div className="text-2xl font-bold text-green-600">{stats.freshSamples}</div>
          </div>
          <div className="text-sm text-gray-600">Fresh</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{stats.biobankSamples}</div>
          </div>
          <div className="text-sm text-gray-600">In Biobank</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-gray-600" />
            <div className="text-2xl font-bold text-gray-600">{stats.usedSamples}</div>
          </div>
          <div className="text-sm text-gray-600">Used</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-2">
            <FlaskConical className="h-5 w-5 text-indigo-600" />
            <div className="text-2xl font-bold text-indigo-600">{stats.researchSamples}</div>
          </div>
          <div className="text-sm text-gray-600">Research</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { id: 'all', label: 'All Samples', icon: FlaskConical },
            { id: 'embryo', label: 'Embryos', icon: FlaskConical },
                  { id: 'oocyte', label: 'Oocytes', icon: TestTube },
      { id: 'semen', label: 'Semen', icon: TestTube },
      { id: 'blood', label: 'Blood', icon: TestTube },
      { id: 'DNA', label: 'DNA', icon: TestTube },
            { id: 'import', label: 'Auto-Import', icon: RefreshCw },
            { id: 'drag-drop', label: 'Drag & Drop', icon: Move, badge: 'PHASE 3' },
            { id: 'lab-integration', label: 'Lab Integration', icon: Activity, badge: 'PHASE 3' }
          ].map(tab => {
            const Icon = tab.icon;
            const count = getTabCount(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {count !== null && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                      {count}
                    </span>
                  )}
                  {(tab as any).badge && (
                    <span className="bg-teal-100 text-teal-600 px-2 py-0.5 rounded-full text-xs font-medium">
                      {(tab as any).badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search and Basic Filters */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search samples or scan QR code..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="pl-10 pr-12 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={() => {
                // QR scanner functionality (placeholder for now)
                const sampleId = prompt('Enter sample ID from QR code:');
                if (sampleId) {
                  updateFilter('searchTerm', sampleId);
                }
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-teal-600 transition-colors"
              title="Scan QR Code"
            >
              <QrCode className="h-4 w-4" />
            </button>
          </div>
          <select
            value={filters.status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Status</option>
            {SAMPLE_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select
            value={filters.location}
            onChange={(e) => updateFilter('location', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">All Locations</option>
            {STORAGE_LOCATIONS.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredSamples.length} of {samples.length} samples
            </span>
          </div>
        </div>

                  {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => updateFilter('dateFrom', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => updateFilter('dateTo', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Genetic Status</label>
                <select
                  value={filters.geneticStatus}
                  onChange={(e) => updateFilter('geneticStatus', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">All Genetic Status</option>
                  {GENETIC_STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="research_only"
                  checked={filters.researchOnly}
                  onChange={(e) => updateFilter('researchOnly', e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="research_only" className="text-sm font-medium text-gray-700">
                  Research Samples Only
                </label>
              </div>
            </div>
            
            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  updateFilter('dateFrom', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                  updateFilter('dateTo', '');
                }}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Last 7 days
              </button>
              <button
                onClick={() => {
                  updateFilter('dateFrom', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                  updateFilter('dateTo', '');
                }}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                Last 30 days
              </button>
              <button
                onClick={() => {
                  updateFilter('status', 'Fresh');
                  updateFilter('geneticStatus', 'Normal');
                }}
                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
              >
                Transfer Ready
              </button>
              <button
                onClick={() => {
                  updateFilter('status', 'Assigned to Biobank');
                }}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              >
                In Biobank
              </button>
              <button
                onClick={() => {
                  setFilters({
                    searchTerm: '',
                    sampleType: '',
                    status: '',
                    dateFrom: '',
                    dateTo: '',
                    location: '',
                    researchOnly: false,
                    geneticStatus: ''
                  });
                }}
                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedSamples.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-blue-900">
                {selectedSamples.size} samples selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('assign-to-biobank')}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
              >
                <Package className="h-3 w-3" />
                <span>Assign to Biobank</span>
              </button>
              <button
                onClick={() => handleBulkAction('assign')}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
              >
                Assign
              </button>
              <button
                onClick={() => handleBulkAction('export')}
                className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors flex items-center space-x-1"
              >
                <Download className="h-3 w-3" />
                <span>Export</span>
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors flex items-center space-x-1"
              >
                <Trash2 className="h-3 w-3" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'import' ? (
        <AutoImportPanel
          onSamplesGenerated={handleAutoImportedSamples}
        />
      ) : activeTab === 'drag-drop' ? (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Group samples by:</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setDragDropGroupBy('status')}
                  className={`px-4 py-2 rounded text-sm transition-colors ${
                    dragDropGroupBy === 'status' 
                      ? 'bg-teal-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Status
                </button>
                <button
                  onClick={() => setDragDropGroupBy('location')}
                  className={`px-4 py-2 rounded text-sm transition-colors ${
                    dragDropGroupBy === 'location' 
                      ? 'bg-teal-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Location
                </button>
              </div>
            </div>
          </div>
          
          <SampleDragDropBoard
            samples={filteredSamples}
            onSampleMove={handleSampleMove}
            onSampleSelect={handleView}
            groupBy={dragDropGroupBy}
          />
        </div>
      ) : activeTab === 'lab-integration' ? (
        <LabIntegrationHub
          samples={filteredSamples}
          onEquipmentAction={handleEquipmentAction}
        />
      ) : (
        <SampleTable
          samples={filteredSamples}
          selectedSamples={selectedSamples}
          onSelectSample={handleSelectSample}
          onSelectAll={handleSelectAll}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          isLoading={isLoading}
        />
      )}

      {/* Sample Form Modal */}
      <SampleForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleFormSave}
        existingSample={selectedSample}
        animals={animals}
        mode={formMode}
      />

      {/* Sample Detail Modal */}
      <SampleDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        sample={detailSample}
        onEdit={(sample) => {
          setSelectedSample(sample);
          setFormMode('edit');
          setIsDetailModalOpen(false);
          setIsFormOpen(true);
        }}
        onAssignToBiobank={handleAssignToBiobank}
      />

      {/* Batch Action Modal */}
      <SampleBatchAction
        isOpen={isBatchActionOpen}
        onClose={() => setIsBatchActionOpen(false)}
        selectedSamples={samples.filter(s => selectedSamples.has(s.id))}
        onExecute={handleBatchActionExecute}
      />
    </div>
  );
}; 