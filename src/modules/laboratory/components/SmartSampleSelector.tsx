import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  FlaskConical, 
  TestTube, 
  Brain, 
  Zap, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  ArrowRight,
  Sparkles,
  Target,
  QrCode,
  RefreshCw
} from 'lucide-react';

interface Sample {
  id: string;
  sample_id: string;
  animal_id: string;
  animal_name: string;
  sample_type: 'embryo' | 'oocyte' | 'semen' | 'blood' | 'DNA';
  collection_date: string;
  status: string;
  location: string;
  quality_score?: number;
  research_flag: boolean;
  genetic_status: string;
  volume_ml?: number;
  concentration?: number;
  viability_percentage?: number;
  morphology_grade?: string;
  notes?: string;
  aiScore?: number;
}

interface SmartSampleSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSampleSelect: (samples: Sample[], testProtocol: string) => void;
  availableProtocols: Array<{
    id: string;
    protocolName: string;
    protocolCode: string;
    category: string;
    sampleTypes: string[];
    estimatedDuration: number;
    costPerTest: number;
  }>;
}

const SmartSampleSelector: React.FC<SmartSampleSelectorProps> = ({ 
  isOpen, 
  onClose, 
  onSampleSelect,
  availableProtocols 
}) => {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [filteredSamples, setFilteredSamples] = useState<Sample[]>([]);
  const [selectedSamples, setSelectedSamples] = useState<Set<string>>(new Set());
  const [selectedProtocol, setSelectedProtocol] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [aiMode, setAiMode] = useState(true);
  const [smartFilter, setSmartFilter] = useState('optimal');
  
  const [filters, setFilters] = useState({
    searchTerm: '',
    sampleType: '',
    status: '',
    minQuality: 0,
    location: '',
    researchOnly: false
  });

  useEffect(() => {
    if (isOpen) {
      loadSamplesFromSampleManagement();
    }
  }, [isOpen]);

  useEffect(() => {
    applyFiltersAndAI();
  }, [samples, filters, selectedProtocol, smartFilter, aiMode]);

  const loadSamplesFromSampleManagement = async () => {
    setLoading(true);
    try {
      // Fetch from Sample Management Module (central hub)
      const response = await fetch('/api/sample-management/samples?status=Fresh,Received,Available');
      
      // Mock data representing samples from Sample Management
      const mockSamples: Sample[] = [
        {
          id: '1',
          sample_id: 'SMPL-2025-0001',
          animal_id: '1',
          animal_name: 'Bella',
          sample_type: 'embryo',
          collection_date: '2025-01-15',
          status: 'Fresh',
          location: 'Lab Processing Area',
          quality_score: 9,
          research_flag: false,
          genetic_status: 'Normal',
          morphology_grade: 'A',
          viability_percentage: 95,
          notes: 'High quality blastocyst'
        },
        {
          id: '2',
          sample_id: 'SMPL-2025-0002',
          animal_id: '2',
          animal_name: 'Luna',
          sample_type: 'oocyte',
          collection_date: '2025-01-14',
          status: 'Fresh',
          location: 'Quality Control Lab',
          quality_score: 7,
          research_flag: true,
          genetic_status: 'Untested',
          morphology_grade: 'B',
          viability_percentage: 85,
          notes: 'Good quality for research'
        },
        {
          id: '3',
          sample_id: 'SMPL-2025-0003',
          animal_id: '4',
          animal_name: 'Thunder',
          sample_type: 'semen',
          collection_date: '2025-01-13',
          status: 'Available',
          location: 'Sample Prep Station',
          quality_score: 8,
          research_flag: false,
          genetic_status: 'Normal',
          volume_ml: 5.2,
          concentration: 850,
          viability_percentage: 88,
          notes: 'Excellent motility'
        },
        {
          id: '4',
          sample_id: 'SMPL-2025-0004',
          animal_id: '3',
          animal_name: 'Star',
          sample_type: 'blood',
          collection_date: '2025-01-12',
          status: 'Available',
          location: 'Sample Storage',
          quality_score: 6,
          research_flag: true,
          genetic_status: 'Carrier',
          volume_ml: 10,
          notes: 'For genetic testing'
        },
        {
          id: '5',
          sample_id: 'SMPL-2025-0005',
          animal_id: '6',
          animal_name: 'Princess',
          sample_type: 'DNA',
          collection_date: '2025-01-11',
          status: 'Available',
          location: 'Genetics Lab',
          quality_score: 9,
          research_flag: true,
          genetic_status: 'Untested',
          concentration: 125.5,
          volume_ml: 0.1,
          notes: 'High purity extraction'
        },
        {
          id: '6',
          sample_id: 'SMPL-2025-0006',
          animal_id: '7',
          animal_name: 'Champion',
          sample_type: 'embryo',
          collection_date: '2025-01-10',
          status: 'Fresh',
          location: 'Incubation Lab',
          quality_score: 8,
          research_flag: false,
          genetic_status: 'Normal',
          morphology_grade: 'A',
          viability_percentage: 92,
          notes: 'Day 7 blastocyst'
        }
      ];

      setSamples(mockSamples);
    } catch (error) {
      console.error('Error loading samples from Sample Management:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndAI = () => {
    let filtered = [...samples];

    // Basic filters
    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.sample_id.toLowerCase().includes(search) ||
        s.animal_name.toLowerCase().includes(search) ||
        s.notes?.toLowerCase().includes(search)
      );
    }

    if (filters.sampleType) {
      filtered = filtered.filter(s => s.sample_type === filters.sampleType);
    }

    if (filters.status) {
      filtered = filtered.filter(s => s.status === filters.status);
    }

    if (filters.minQuality > 0) {
      filtered = filtered.filter(s => (s.quality_score || 0) >= filters.minQuality);
    }

    if (filters.location) {
      filtered = filtered.filter(s => s.location.toLowerCase().includes(filters.location.toLowerCase()));
    }

    if (filters.researchOnly) {
      filtered = filtered.filter(s => s.research_flag);
    }

    // Protocol compatibility filter
    if (selectedProtocol) {
      const protocol = availableProtocols.find(p => p.id === selectedProtocol);
      if (protocol) {
        filtered = filtered.filter(s => protocol.sampleTypes.includes(s.sample_type));
      }
    }

    // AI-powered smart filtering
    if (aiMode && selectedProtocol) {
      filtered = applyAISmartFiltering(filtered);
    }

    setFilteredSamples(filtered);
  };

  const applyAISmartFiltering = (samples: Sample[]) => {
    const protocol = availableProtocols.find(p => p.id === selectedProtocol);
    if (!protocol) return samples;

    return samples
      .map(sample => ({
        ...sample,
        aiScore: calculateAIScore(sample, protocol)
      }))
      .filter(sample => sample.aiScore > 0.5) // AI threshold
      .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
  };

  const calculateAIScore = (sample: Sample, protocol: any) => {
    let score = 0;

    // Quality score weight (40%)
    score += ((sample.quality_score || 0) / 10) * 0.4;

    // Viability weight (30%) 
    score += ((sample.viability_percentage || 0) / 100) * 0.3;

    // Freshness weight (20%)
    const daysSinceCollection = Math.floor(
      (Date.now() - new Date(sample.collection_date).getTime()) / (1000 * 60 * 60 * 24)
    );
    score += Math.max(0, (7 - daysSinceCollection) / 7) * 0.2;

    // Protocol-specific weight (10%)
    if (protocol.category.includes('genetic') && sample.genetic_status === 'Normal') {
      score += 0.1;
    }

    return Math.min(1, score);
  };

  const handleSampleToggle = (sampleId: string) => {
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

  const handleSubmit = () => {
    const selected = filteredSamples.filter(s => selectedSamples.has(s.id));
    onSampleSelect(selected, selectedProtocol);
  };

  const getSampleTypeIcon = (type: string) => {
    switch (type) {
      case 'embryo': return '🧬';
      case 'oocyte': return '🥚';
      case 'semen': return '🐄';
      case 'blood': return '🩸';
      case 'DNA': return '🧬';
      default: return '🔬';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Fresh': return 'bg-green-100 text-green-800';
      case 'Available': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">🎯 Smart Sample Selector</h2>
                <p className="text-teal-100">AI-powered sample selection from Sample Management Hub</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm">AI Mode</span>
                <button
                  onClick={() => setAiMode(!aiMode)}
                  className={`w-8 h-4 rounded-full transition-colors ${
                    aiMode ? 'bg-cyan-300' : 'bg-gray-400'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
                    aiMode ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
                <Sparkles className={`w-4 h-4 ${aiMode ? 'text-cyan-200' : 'text-gray-300'}`} />
              </div>
              <button onClick={onClose} className="text-white hover:text-teal-200">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Filters Sidebar */}
          <div className="w-80 bg-gray-50 p-6 overflow-y-auto border-r">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Selection Criteria</h3>
            
            {/* Protocol Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Protocol *
              </label>
              <select
                value={selectedProtocol}
                onChange={(e) => setSelectedProtocol(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              >
                <option value="">Select protocol...</option>
                {availableProtocols.map(protocol => (
                  <option key={protocol.id} value={protocol.id}>
                    {protocol.protocolCode} - {protocol.protocolName}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search samples..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Sample Type Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sample Type</label>
              <select
                value={filters.sampleType}
                onChange={(e) => setFilters({ ...filters, sampleType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">All Types</option>
                <option value="embryo">🧬 Embryo</option>
                <option value="oocyte">🥚 Oocyte</option>
                <option value="semen">🐄 Semen</option>
                <option value="blood">🩸 Blood</option>
                <option value="DNA">🧬 DNA</option>
              </select>
            </div>

            {/* Quality Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Quality Score: {filters.minQuality}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={filters.minQuality}
                onChange={(e) => setFilters({ ...filters, minQuality: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>

            {/* AI Smart Filters */}
            {aiMode && (
              <div className="mb-4 p-4 bg-cyan-50 rounded-lg">
                <h4 className="font-medium text-cyan-900 mb-2 flex items-center">
                  <Brain className="w-4 h-4 mr-2" />
                  AI Recommendations
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setSmartFilter('optimal')}
                    className={`w-full text-left p-2 rounded text-sm ${
                      smartFilter === 'optimal' ? 'bg-cyan-100 text-cyan-900' : 'text-cyan-700 hover:bg-cyan-100'
                    }`}
                  >
                    🎯 Optimal Quality
                  </button>
                  <button
                    onClick={() => setSmartFilter('fresh')}
                    className={`w-full text-left p-2 rounded text-sm ${
                      smartFilter === 'fresh' ? 'bg-cyan-100 text-cyan-900' : 'text-cyan-700 hover:bg-cyan-100'
                    }`}
                  >
                    ⚡ Freshest Samples
                  </button>
                  <button
                    onClick={() => setSmartFilter('research')}
                    className={`w-full text-left p-2 rounded text-sm ${
                      smartFilter === 'research' ? 'bg-cyan-100 text-cyan-900' : 'text-cyan-700 hover:bg-cyan-100'
                    }`}
                  >
                    🔬 Research Ready
                  </button>
                </div>
              </div>
            )}

            {/* Refresh Button */}
            <button
              onClick={loadSamplesFromSampleManagement}
              disabled={loading}
              className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh from Sample Management
            </button>
          </div>

          {/* Samples Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Available Samples ({filteredSamples.length})
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedSamples.size} selected • Connected to Sample Management Hub
                </p>
              </div>
              {selectedSamples.size > 0 && (
                <button
                  onClick={handleSubmit}
                  disabled={!selectedProtocol}
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-2 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-colors flex items-center disabled:opacity-50"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Create Lab Tests ({selectedSamples.size})
                </button>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSamples.map((sample) => (
                  <div
                    key={sample.id}
                    className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all ${
                      selectedSamples.has(sample.id)
                        ? 'border-teal-300 bg-teal-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleSampleToggle(sample.id)}
                  >
                    {/* Sample Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getSampleTypeIcon(sample.sample_type)}</span>
                        <span className="font-mono text-sm font-medium">{sample.sample_id}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {selectedSamples.has(sample.id) && (
                          <CheckCircle className="w-4 h-4 text-teal-600" />
                        )}
                        {aiMode && sample.aiScore && (
                          <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                            AI: {Math.round(sample.aiScore * 100)}%
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sample Info */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Animal:</span>
                        <span className="font-medium">{sample.animal_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Quality:</span>
                        <span className={`font-medium ${getQualityColor(sample.quality_score || 0)}`}>
                          {sample.quality_score || 'N/A'}/10
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(sample.status)}`}>
                          {sample.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Location:</span>
                        <span className="font-medium text-xs">{sample.location}</span>
                      </div>
                      {sample.viability_percentage && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Viability:</span>
                          <span className="font-medium">{sample.viability_percentage}%</span>
                        </div>
                      )}
                    </div>

                    {/* Collection Date */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Collected: {new Date(sample.collection_date).toLocaleDateString()}</span>
                        {sample.research_flag && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Research</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredSamples.length === 0 && !loading && (
              <div className="text-center py-12">
                <TestTube className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No compatible samples found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your filters or select a different protocol
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="flex items-center">
                <FlaskConical className="w-4 h-4 mr-1" />
                Connected to Sample Management
              </span>
              <span className="flex items-center">
                <Target className="w-4 h-4 mr-1" />
                {filteredSamples.length} compatible samples
              </span>
              {aiMode && (
                <span className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-1" />
                  AI-optimized selection
                </span>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={selectedSamples.size === 0 || !selectedProtocol}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Proceed with {selectedSamples.size} samples
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartSampleSelector; 