import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  MapPin, 
  Beaker, 
  Target,
  X,
  ChevronDown
} from 'lucide-react';

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

export interface FilterState {
  searchTerm: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  status: string[];
  technician: string[];
  location: string[];
  protocol: string[];
  qualityRange: {
    min: number;
    max: number;
  };
  embryoCountRange: {
    min: number;
    max: number;
  };
  successRateRange: {
    min: number;
    max: number;
  };
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ 
  onFiltersChange, 
  onClearFilters 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    dateRange: {
      startDate: '',
      endDate: ''
    },
    status: [],
    technician: [],
    location: [],
    protocol: [],
    qualityRange: {
      min: 0,
      max: 100
    },
    embryoCountRange: {
      min: 0,
      max: 50
    },
    successRateRange: {
      min: 0,
      max: 100
    }
  });

  const statusOptions = ['Scheduled', 'In Progress', 'Completed', 'Failed'];
  const technicianOptions = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown'];
  const locationOptions = ['Lab A', 'Lab B', 'Field Station 1', 'Field Station 2'];
  const protocolOptions = ['MOET v3.0', 'MOET v2.1', 'Custom Protocol A', 'Standard Protocol'];

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleArrayFilter = (
    field: 'status' | 'technician' | 'location' | 'protocol',
    value: string
  ) => {
    const currentArray = filters[field];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilters({ [field]: newArray });
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      searchTerm: '',
      dateRange: { startDate: '', endDate: '' },
      status: [],
      technician: [],
      location: [],
      protocol: [],
      qualityRange: { min: 0, max: 100 },
      embryoCountRange: { min: 0, max: 50 },
      successRateRange: { min: 0, max: 100 }
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.dateRange.startDate || filters.dateRange.endDate) count++;
    if (filters.status.length > 0) count++;
    if (filters.technician.length > 0) count++;
    if (filters.location.length > 0) count++;
    if (filters.protocol.length > 0) count++;
    if (filters.qualityRange.min > 0 || filters.qualityRange.max < 100) count++;
    if (filters.embryoCountRange.min > 0 || filters.embryoCountRange.max < 50) count++;
    if (filters.successRateRange.min > 0 || filters.successRateRange.max < 100) count++;
    return count;
  };

  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      {/* Basic Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search sessions, donors, sires, or notes..."
            value={filters.searchTerm}
            onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
            isExpanded ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="h-4 w-4" />
          <span>Advanced Filters</span>
          {getActiveFilterCount() > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
              {getActiveFilterCount()}
            </span>
          )}
          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {getActiveFilterCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
          >
            <X className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {isExpanded && (
        <div className="space-y-6 pt-4 border-t">
          {/* Date Range */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4" />
              <span>Date Range</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                value={filters.dateRange.startDate}
                onChange={(e) => updateFilters({ 
                  dateRange: { ...filters.dateRange, startDate: e.target.value }
                })}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={filters.dateRange.endDate}
                onChange={(e) => updateFilters({ 
                  dateRange: { ...filters.dateRange, endDate: e.target.value }
                })}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Target className="h-4 w-4" />
              <span>Status</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => handleArrayFilter('status', status)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    filters.status.includes(status)
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Technician Filter */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4" />
              <span>Technician</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {technicianOptions.map((technician) => (
                <button
                  key={technician}
                  onClick={() => handleArrayFilter('technician', technician)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    filters.technician.includes(technician)
                      ? 'bg-green-100 border-green-300 text-green-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {technician}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {locationOptions.map((location) => (
                <button
                  key={location}
                  onClick={() => handleArrayFilter('location', location)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    filters.location.includes(location)
                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>

          {/* Protocol Filter */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Beaker className="h-4 w-4" />
              <span>Protocol</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {protocolOptions.map((protocol) => (
                <button
                  key={protocol}
                  onClick={() => handleArrayFilter('protocol', protocol)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    filters.protocol.includes(protocol)
                      ? 'bg-orange-100 border-orange-300 text-orange-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {protocol}
                </button>
              ))}
            </div>
          </div>

          {/* Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quality Range */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Quality Score Range
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.qualityRange.min}
                    onChange={(e) => updateFilters({
                      qualityRange: { ...filters.qualityRange, min: parseInt(e.target.value) || 0 }
                    })}
                    className="w-16 border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.qualityRange.max}
                    onChange={(e) => updateFilters({
                      qualityRange: { ...filters.qualityRange, max: parseInt(e.target.value) || 100 }
                    })}
                    className="w-16 border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {filters.qualityRange.min}% - {filters.qualityRange.max}%
                </div>
              </div>
            </div>

            {/* Embryo Count Range */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Embryo Count Range
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={filters.embryoCountRange.min}
                    onChange={(e) => updateFilters({
                      embryoCountRange: { ...filters.embryoCountRange, min: parseInt(e.target.value) || 0 }
                    })}
                    className="w-16 border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={filters.embryoCountRange.max}
                    onChange={(e) => updateFilters({
                      embryoCountRange: { ...filters.embryoCountRange, max: parseInt(e.target.value) || 50 }
                    })}
                    className="w-16 border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {filters.embryoCountRange.min} - {filters.embryoCountRange.max} embryos
                </div>
              </div>
            </div>

            {/* Success Rate Range */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Success Rate Range
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.successRateRange.min}
                    onChange={(e) => updateFilters({
                      successRateRange: { ...filters.successRateRange, min: parseInt(e.target.value) || 0 }
                    })}
                    className="w-16 border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.successRateRange.max}
                    onChange={(e) => updateFilters({
                      successRateRange: { ...filters.successRateRange, max: parseInt(e.target.value) || 100 }
                    })}
                    className="w-16 border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  {filters.successRateRange.min}% - {filters.successRateRange.max}%
                </div>
              </div>
            </div>
          </div>

          {/* Quick Filter Presets */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Quick Filters
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateFilters({ 
                  status: ['Completed'],
                  successRateRange: { min: 80, max: 100 }
                })}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full hover:bg-green-200"
              >
                High Success
              </button>
              <button
                onClick={() => updateFilters({ 
                  dateRange: { 
                    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
                    endDate: new Date().toISOString().split('T')[0] 
                  }
                })}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
              >
                Last 7 Days
              </button>
              <button
                onClick={() => updateFilters({ 
                  embryoCountRange: { min: 15, max: 50 }
                })}
                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200"
              >
                High Yield
              </button>
              <button
                onClick={() => updateFilters({ 
                  protocol: ['MOET v3.0']
                })}
                className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200"
              >
                Latest Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 