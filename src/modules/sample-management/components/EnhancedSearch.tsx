import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Calendar, 
  MapPin, 
  User, 
  FlaskConical, 
  Star, 
  Clock,
  Save,
  Trash2,
  ChevronDown,
  CheckCircle
} from 'lucide-react';
import { Sample, SampleStatus, SAMPLE_STATUSES, STORAGE_LOCATIONS } from '../types/sampleTypes';

interface SearchFilters {
  searchQuery: string;
  status: SampleStatus[];
  location: string[];
  sampleType: string[];
  dateRange: {
    start: string;
    end: string;
  };
  qualityRange: {
    min: number;
    max: number;
  };
  animalName: string;
  researchFlag: boolean | null;
  hasQualityScore: boolean | null;
}

interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: string;
  frequency: number;
}

interface EnhancedSearchProps {
  samples: Sample[];
  onFiltersChange: (filters: SearchFilters) => void;
  onSamplesFiltered: (samples: Sample[]) => void;
}

export const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  samples,
  onFiltersChange,
  onSamplesFiltered
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    searchQuery: '',
    status: [],
    location: [],
    sampleType: [],
    dateRange: { start: '', end: '' },
    qualityRange: { min: 0, max: 10 },
    animalName: '',
    researchFlag: null,
    hasQualityScore: null
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sample types from data
  const sampleTypes = Array.from(new Set(samples.map(s => s.sample_type)));
  const animalNames = Array.from(new Set(samples.map(s => s.animal_name)));

  // Initialize saved searches
  useEffect(() => {
    const mockSavedSearches: SavedSearch[] = [
      {
        id: '1',
        name: 'Fresh Embryos',
        filters: {
          ...filters,
          status: ['Fresh'],
          sampleType: ['embryo']
        },
        createdAt: '2025-01-15',
        frequency: 25
      },
      {
        id: '2',
        name: 'High Quality Samples',
        filters: {
          ...filters,
          qualityRange: { min: 8, max: 10 }
        },
        createdAt: '2025-01-14',
        frequency: 18
      },
      {
        id: '3',
        name: 'Research Samples',
        filters: {
          ...filters,
          researchFlag: true
        },
        createdAt: '2025-01-13',
        frequency: 12
      }
    ];
    setSavedSearches(mockSavedSearches);
  }, []);

  // Generate suggestions based on input
  useEffect(() => {
    if (filters.searchQuery.length >= 2) {
      const query = filters.searchQuery.toLowerCase();
      const newSuggestions = [
        ...samples
          .filter(s => s.sample_id.toLowerCase().includes(query))
          .map(s => s.sample_id)
          .slice(0, 3),
        ...animalNames
          .filter(name => name.toLowerCase().includes(query))
          .slice(0, 3),
        ...sampleTypes
          .filter(type => type.toLowerCase().includes(query))
          .slice(0, 2)
      ].slice(0, 5);
      
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [filters.searchQuery, samples, animalNames, sampleTypes]);

  // Apply filters to samples
  useEffect(() => {
    let filtered = samples;

    // Text search
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(sample =>
        sample.sample_id.toLowerCase().includes(query) ||
        sample.animal_name.toLowerCase().includes(query) ||
        sample.sample_type.toLowerCase().includes(query) ||
        sample.location.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(sample => filters.status.includes(sample.status));
    }

    // Location filter
    if (filters.location.length > 0) {
      filtered = filtered.filter(sample => filters.location.includes(sample.location));
    }

    // Sample type filter
    if (filters.sampleType.length > 0) {
      filtered = filtered.filter(sample => filters.sampleType.includes(sample.sample_type));
    }

    // Date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(sample => {
        const sampleDate = new Date(sample.collection_date);
        const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
        const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
        
        if (startDate && sampleDate < startDate) return false;
        if (endDate && sampleDate > endDate) return false;
        return true;
      });
    }

    // Quality range filter
    if (filters.qualityRange.min > 0 || filters.qualityRange.max < 10) {
      filtered = filtered.filter(sample => {
        if (!sample.quality_score) return false;
        return sample.quality_score >= filters.qualityRange.min && 
               sample.quality_score <= filters.qualityRange.max;
      });
    }

    // Animal name filter
    if (filters.animalName) {
      filtered = filtered.filter(sample => 
        sample.animal_name.toLowerCase().includes(filters.animalName.toLowerCase())
      );
    }

    // Research flag filter
    if (filters.researchFlag !== null) {
      filtered = filtered.filter(sample => sample.research_flag === filters.researchFlag);
    }

    // Has quality score filter
    if (filters.hasQualityScore !== null) {
      filtered = filtered.filter(sample => 
        filters.hasQualityScore ? (sample.quality_score !== undefined) : (sample.quality_score === undefined)
      );
    }

    onSamplesFiltered(filtered);
    onFiltersChange(filters);
  }, [filters, samples, onSamplesFiltered, onFiltersChange]);

  // Update specific filter
  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Toggle array filter value
  const toggleArrayFilter = <K extends keyof Pick<SearchFilters, 'status' | 'location' | 'sampleType'>>(
    key: K, 
    value: string
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value as any)
        ? prev[key].filter((item: any) => item !== value)
        : [...prev[key], value]
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      status: [],
      location: [],
      sampleType: [],
      dateRange: { start: '', end: '' },
      qualityRange: { min: 0, max: 10 },
      animalName: '',
      researchFlag: null,
      hasQualityScore: null
    });
  };

  // Save current search
  const saveCurrentSearch = () => {
    if (!saveSearchName.trim()) return;

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: saveSearchName,
      filters: { ...filters },
      createdAt: new Date().toISOString().split('T')[0],
      frequency: 1
    };

    setSavedSearches(prev => [newSearch, ...prev]);
    setSaveSearchName('');
    setShowSaveDialog(false);
  };

  // Load saved search
  const loadSavedSearch = (savedSearch: SavedSearch) => {
    setFilters(savedSearch.filters);
    // Update frequency
    setSavedSearches(prev => 
      prev.map(search => 
        search.id === savedSearch.id 
          ? { ...search, frequency: search.frequency + 1 }
          : search
      )
    );
  };

  // Delete saved search
  const deleteSavedSearch = (searchId: string) => {
    setSavedSearches(prev => prev.filter(search => search.id !== searchId));
  };

  // Apply suggestion
  const applySuggestion = (suggestion: string) => {
    updateFilter('searchQuery', suggestion);
    setShowSuggestions(false);
  };

  // Count active filters
  const activeFilterCount = 
    (filters.status.length > 0 ? 1 : 0) +
    (filters.location.length > 0 ? 1 : 0) +
    (filters.sampleType.length > 0 ? 1 : 0) +
    (filters.dateRange.start || filters.dateRange.end ? 1 : 0) +
    (filters.qualityRange.min > 0 || filters.qualityRange.max < 10 ? 1 : 0) +
    (filters.animalName ? 1 : 0) +
    (filters.researchFlag !== null ? 1 : 0) +
    (filters.hasQualityScore !== null ? 1 : 0);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
      {/* Search Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Search className="h-6 w-6 text-teal-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Enhanced Search</h3>
            <p className="text-sm text-gray-600">Find samples with advanced filtering</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSaveDialog(true)}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Save current search"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center space-x-1 px-3 py-1 text-sm rounded transition-colors ${
              showAdvanced ? 'bg-teal-100 text-teal-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Advanced</span>
            {activeFilterCount > 0 && (
              <span className="bg-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search by sample ID, animal name, type, or location..."
            value={filters.searchQuery}
            onChange={(e) => updateFilter('searchQuery', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          {filters.searchQuery && (
            <button
              onClick={() => updateFilter('searchQuery', '')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search Suggestions */}
        {showSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => applySuggestion(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
              >
                <div className="flex items-center space-x-2">
                  <Search className="h-3 w-3 text-gray-400" />
                  <span className="text-sm text-gray-700">{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <div className="flex items-center space-x-2 flex-wrap">
          <span className="text-sm text-gray-600">Quick searches:</span>
          {savedSearches.slice(0, 3).map(search => (
            <button
              key={search.id}
              onClick={() => loadSavedSearch(search)}
              className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
            >
              <Star className="h-3 w-3 text-yellow-500" />
              <span>{search.name}</span>
              <span className="text-xs text-gray-500">({search.frequency})</span>
            </button>
          ))}
        </div>
      )}

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="space-y-1">
                {SAMPLE_STATUSES.map(status => (
                  <label key={status} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => toggleArrayFilter('status', status)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span>{status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="space-y-1">
                {STORAGE_LOCATIONS.map(location => (
                  <label key={location} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.location.includes(location)}
                      onChange={() => toggleArrayFilter('location', location)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span>{location}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sample Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sample Type</label>
              <div className="space-y-1">
                {sampleTypes.map(type => (
                  <label key={type} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.sampleType.includes(type)}
                      onChange={() => toggleArrayFilter('sampleType', type)}
                      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Date Range and Quality Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Collection Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, start: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
                />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, end: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            {/* Quality Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quality Score Range ({filters.qualityRange.min} - {filters.qualityRange.max})
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={filters.qualityRange.min}
                  onChange={(e) => updateFilter('qualityRange', { ...filters.qualityRange, min: parseInt(e.target.value) })}
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={filters.qualityRange.max}
                  onChange={(e) => updateFilter('qualityRange', { ...filters.qualityRange, max: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Research Flag */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Research Samples</label>
              <select
                value={filters.researchFlag === null ? '' : filters.researchFlag.toString()}
                onChange={(e) => updateFilter('researchFlag', e.target.value === '' ? null : e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">All</option>
                <option value="true">Research only</option>
                <option value="false">Non-research only</option>
              </select>
            </div>

            {/* Has Quality Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quality Assessment</label>
              <select
                value={filters.hasQualityScore === null ? '' : filters.hasQualityScore.toString()}
                onChange={(e) => updateFilter('hasQualityScore', e.target.value === '' ? null : e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="">All</option>
                <option value="true">With quality score</option>
                <option value="false">Without quality score</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Save Search</h3>
            <input
              type="text"
              placeholder="Enter search name..."
              value={saveSearchName}
              onChange={(e) => setSaveSearchName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:ring-teal-500 focus:border-teal-500"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={saveCurrentSearch}
                disabled={!saveSearchName.trim()}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 