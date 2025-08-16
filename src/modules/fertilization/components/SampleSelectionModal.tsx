import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Filter,
  CheckSquare,
  Square,
  FlaskConical,
  TestTube,
  Microscope,
  Brain,
  Calendar,
  Hash,
  AlertTriangle,
  CheckCircle,
  Eye,
  Beaker,
  RefreshCw,
  Star,
  Plus
} from 'lucide-react';

import { 
  FertilizationSession,
  SelectedSample,
  SampleSelectionFilters
} from '../types/fertilizationTypes';
import { Sample, SampleType } from '../../sample-management/types/sampleTypes';
import { fertilizationApi } from '../services/fertilizationApi';
import { checkSingleSampleCompatibility, formatDate } from '../utils/fertilizationUtils';

interface SampleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: FertilizationSession;
  onUpdate: (session: FertilizationSession) => void;
}

const SampleSelectionModal: React.FC<SampleSelectionModalProps> = ({
  isOpen,
  onClose,
  session,
  onUpdate
}) => {
  const [activeTab, setActiveTab] = useState<'oocytes' | 'gametes'>('oocytes');
  const [availableSamples, setAvailableSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Selection states
  const [selectedOocytes, setSelectedOocytes] = useState<SelectedSample[]>(session.selectedOocytes);
  const [selectedSemen, setSelectedSemen] = useState<SelectedSample[]>(session.selectedSemen || []);
  const [selectedFibroblasts, setSelectedFibroblasts] = useState<SelectedSample[]>(session.selectedFibroblasts || []);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ready');
  const [qualityFilter, setQualityFilter] = useState('');
  const [animalFilter, setAnimalFilter] = useState('');
  const [collectionDateFilter, setCollectionDateFilter] = useState('');

  // Tab navigation and sample type logic
  const isSCNT = session.fertilizationType === 'SCNT';
  const gameteTabLabel = isSCNT ? 'Fibroblasts' : 'Semen';
  const gameteIcon = isSCNT ? Microscope : TestTube;

  useEffect(() => {
    if (isOpen) {
      fetchSamples();
    }
  }, [isOpen, activeTab]);

  const fetchSamples = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const sampleType = activeTab === 'oocytes' ? 'oocyte' : isSCNT ? 'fibroblast' : 'semen';
      
      const filters: SampleSelectionFilters = {
        type: sampleType,
        status: statusFilter || undefined,
        quality: qualityFilter || undefined,
        animalId: animalFilter || undefined,
        collectionDate: collectionDateFilter || undefined,
        search: searchTerm || undefined
      };

      const samples = await fertilizationApi.getAvailableSamples(filters);
      setAvailableSamples(samples);
    } catch (err) {
      setError('Failed to fetch available samples');
      console.error('Error fetching samples:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (isOpen) fetchSamples();
    }, 300);
    
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, statusFilter, qualityFilter, animalFilter, collectionDateFilter]);

  const handleSampleSelection = (sample: Sample, isSelected: boolean) => {
    const selectedSample: SelectedSample = {
      sampleId: sample.id,
      sampleType: sample.sample_type,
      animalId: sample.animal_id || '',
      quality: sample.quality_score?.toString() || '',
      volume: sample.volume_ml,
      concentration: sample.concentration,
      motility: sample.motility_percentage,
      collectionDate: sample.collection_date,
      notes: sample.notes
    };

    if (activeTab === 'oocytes') {
      if (isSelected) {
        setSelectedOocytes(prev => [...prev, selectedSample]);
      } else {
        setSelectedOocytes(prev => prev.filter(s => s.sampleId !== sample.id));
      }
    } else if (session.fertilizationType === 'SCNT') {
      if (isSelected) {
        setSelectedFibroblasts(prev => [...prev, selectedSample]);
      } else {
        setSelectedFibroblasts(prev => prev.filter(s => s.sampleId !== sample.id));
      }
    } else {
      if (isSelected) {
        setSelectedSemen(prev => [...prev, selectedSample]);
      } else {
        setSelectedSemen(prev => prev.filter(s => s.sampleId !== sample.id));
      }
    }
  };

  const isSelected = (sampleId: string): boolean => {
    if (activeTab === 'oocytes') {
      return selectedOocytes.some(s => s.sampleId === sampleId);
    } else if (session.fertilizationType === 'SCNT') {
      return selectedFibroblasts.some(s => s.sampleId === sampleId);
    } else {
      return selectedSemen.some(s => s.sampleId === sampleId);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedSession = await fertilizationApi.updateSampleSelection(session.id, {
        selectedOocytes,
        selectedSemen: session.fertilizationType !== 'SCNT' ? selectedSemen : undefined,
        selectedFibroblasts: session.fertilizationType === 'SCNT' ? selectedFibroblasts : undefined
      });
      onUpdate(updatedSession);
      onClose();
    } catch (err) {
      setError('Failed to update sample selection');
      console.error('Error updating selection:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCompatibilityWarning = (sample: Sample): string | null => {
    const selectedOocyteIds = selectedOocytes.map(s => s.sampleId);
    return checkSingleSampleCompatibility(sample, selectedOocyteIds, session.fertilizationType);
  };

  const getSampleIcon = (sampleType: SampleType | string) => {
    switch (sampleType) {
      case 'oocyte': return FlaskConical;
      case 'semen': return TestTube;
      case 'fibroblast': return Microscope;
      default: return Beaker;
    }
  };

  const getQualityColor = (quality?: string) => {
    switch (quality?.toLowerCase()) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderSampleCard = (sample: Sample) => {
    const SampleIcon = getSampleIcon(sample.sample_type);
    const selected = isSelected(sample.id);
    const compatibility = getCompatibilityWarning(sample);
    
    return (
      <div
        key={sample.id}
        className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
          selected 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
        onClick={() => handleSampleSelection(sample, !selected)}
      >
        {/* Selection Checkbox */}
        <div className="absolute top-3 right-3">
          {selected ? (
            <CheckSquare className="h-5 w-5 text-blue-600" />
          ) : (
            <Square className="h-5 w-5 text-gray-400" />
          )}
        </div>

        {/* Sample Header */}
        <div className="flex items-start space-x-3 mb-3">
          <div className={`p-2 rounded-lg ${
            sample.sample_type === 'oocyte' ? 'bg-purple-100' :
            sample.sample_type === 'semen' ? 'bg-blue-100' : 'bg-green-100'
          }`}>
            <SampleIcon className={`h-5 w-5 ${
              sample.sample_type === 'oocyte' ? 'text-purple-600' :
              sample.sample_type === 'semen' ? 'text-blue-600' : 'text-green-600'
            }`} />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{sample.sample_id}</h4>
            <p className="text-sm text-gray-500">
              {sample.animalInternalNumber} - {sample.animal_id}
            </p>
          </div>
        </div>

        {/* Sample Details */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Quality:</span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getQualityColor(sample.morphology_grade)}`}>
                {sample.quality_score ? `${sample.quality_score}/10` : sample.morphology_grade || 'Unknown'}
              </span>
            </div>
            {sample.volume_ml && (
              <div>
                <span className="text-gray-500">Volume:</span>
                <span className="ml-2 text-gray-900">{sample.volume_ml}ml</span>
              </div>
            )}
            {sample.concentration && (
              <div>
                <span className="text-gray-500">Concentration:</span>
                <span className="ml-2 text-gray-900">{sample.concentration}M/ml</span>
              </div>
            )}
            {sample.motility_percentage && (
              <div>
                <span className="text-gray-500">Motility:</span>
                <span className="ml-2 text-gray-900">{sample.motility_percentage}%</span>
              </div>
            )}
            {sample.cell_count && (
              <div>
                <span className="text-gray-500">Cell Count:</span>
                <span className="ml-2 text-gray-900">{sample.cell_count}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(sample.collection_date)}
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                sample.status === 'Ready' ? 'bg-green-100 text-green-800' :
                sample.status === 'Fresh' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {sample.status}
              </span>
            </div>
          </div>

          {/* Compatibility Warning */}
          {compatibility && (
            <div className="flex items-center space-x-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-yellow-800">{compatibility}</span>
            </div>
          )}

          {/* Additional Info */}
          {sample.notes && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {sample.notes}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  const currentSampleType = activeTab === 'oocytes' ? 'oocyte' : 
    session.fertilizationType === 'SCNT' ? 'fibroblast' : 'semen';

  const selectedCount = activeTab === 'oocytes' ? selectedOocytes.length :
    session.fertilizationType === 'SCNT' ? selectedFibroblasts.length : selectedSemen.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Sample Selection - {session.sessionId}
              </h2>
              <p className="text-sm text-gray-600">
                Select samples for {session.fertilizationType} fertilization
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('oocytes')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'oocytes'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FlaskConical className="h-4 w-4" />
                <span>Oocytes ({selectedOocytes.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('gametes')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'gametes'
                    ? isSCNT ? 'border-green-500 text-green-600' : 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {React.createElement(gameteIcon, { className: 'h-4 w-4' })}
                <span>{gameteTabLabel} ({isSCNT ? selectedFibroblasts.length : selectedSemen.length})</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search samples..."
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="ready">Ready</option>
                <option value="fresh">Fresh</option>
                <option value="assigned">Assigned</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
              <select
                value={qualityFilter}
                onChange={(e) => setQualityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Qualities</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Animal ID</label>
              <input
                type="text"
                value={animalFilter}
                onChange={(e) => setAnimalFilter(e.target.value)}
                placeholder="Filter by animal..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collection Date</label>
              <input
                type="date"
                value={collectionDateFilter}
                onChange={(e) => setCollectionDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {/* Selected Summary */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Selection Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <FlaskConical className="h-4 w-4 text-purple-600" />
                <span className="text-gray-700">Oocytes:</span>
                <span className="font-medium text-gray-900">{selectedOocytes.length}</span>
              </div>
              {session.fertilizationType !== 'SCNT' ? (
                <div className="flex items-center space-x-2">
                  <TestTube className="h-4 w-4 text-blue-600" />
                  <span className="text-gray-700">Semen:</span>
                  <span className="font-medium text-gray-900">{selectedSemen.length}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Microscope className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Fibroblasts:</span>
                  <span className="font-medium text-gray-900">{selectedFibroblasts.length}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4 text-orange-600" />
                <span className="text-gray-700">Target Embryos:</span>
                <span className="font-medium text-gray-900">{session.targetEmbryoCount}</span>
              </div>
            </div>
          </div>

          {/* Sample Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mr-3" />
              <span className="text-gray-500">Loading {currentSampleType} samples...</span>
            </div>
          ) : availableSamples.length === 0 ? (
            <div className="text-center py-12">
              <Beaker className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No {currentSampleType} samples found</p>
              <p className="text-gray-400 text-sm">Adjust your filters or check sample availability</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableSamples.map((sample) => renderSampleCard(sample))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {selectedCount} {currentSampleType}(s) selected
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || (selectedOocytes.length === 0)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
            >
              <CheckCircle className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Selection'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleSelectionModal; 