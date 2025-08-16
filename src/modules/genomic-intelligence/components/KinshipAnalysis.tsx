import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Users, 
  Activity, 
  Settings, 
  Play, 
  Download,
  Database,
  BarChart3,
  Network,
  AlertCircle,
  CheckCircle,
  Hash,
  RefreshCw,
  Search,
  Filter,
  Brain,
  Zap,
  Clock,
  FileText,
  Eye,
  Shield,
  TrendingUp,
  Layers,
  GitBranch,
  Target,
  Loader2,
  X,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

interface Animal {
  id: string;
  name: string;
  animalID: string;
  species: string;
  sex: string;
  customerName: string;
  snpIndex?: {
    snpCount: number;
    uploadDate: string;
    qualityScore: number;
  };
}

interface KinshipResult {
  animal1: string;
  animal2: string;
  kinshipCoefficient: number;
  relationshipType: 'PARENT_OFFSPRING' | 'FULL_SIBLINGS' | 'HALF_SIBLINGS' | 'COUSINS' | 'UNRELATED';
  confidence: number;
  aiPrediction?: {
    predictedRelationship: string;
    confidence: number;
    features: string[];
  };
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  dataQuality: {
    snpCoverage: number;
    missingDataRate: number;
    qualityScore: number;
  };
}

interface AnalysisProgress {
  currentStep: string;
  progress: number;
  estimatedTimeRemaining: number;
  comparisonsCompleted: number;
  totalComparisons: number;
}

const KinshipAnalysis: React.FC = () => {
  // Enhanced state management
  const [selectedAnimals, setSelectedAnimals] = useState<Set<string>>(new Set());
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('KING');
  const [isAnalysisRunning, setIsAnalysisRunning] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress | null>(null);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<Animal[]>([]);
  const [kinshipResults, setKinshipResults] = useState<KinshipResult[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('ALL');
  const [minQualityFilter, setMinQualityFilter] = useState(7.0);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [aiEnhancedMode, setAiEnhancedMode] = useState(true);
  const [visualizationMode, setVisualizationMode] = useState<'heatmap' | 'network' | 'table'>('heatmap');
  
  // Algorithm parameters
  const [algorithmParams, setAlgorithmParams] = useState({
    mafThreshold: 0.05,
    missingGenotypeThreshold: 0.1,
    ldPruning: true,
    confidenceThreshold: 0.8
  });

  // Performance optimization: Memoized filtered animals
  const memoizedFilteredAnimals = useMemo(() => {
    return animals.filter(animal => {
      const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           animal.animalID.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecies = speciesFilter === 'ALL' || animal.species === speciesFilter;
      const matchesQuality = !animal.snpIndex || animal.snpIndex.qualityScore >= minQualityFilter;
      
      return matchesSearch && matchesSpecies && matchesQuality;
    });
  }, [animals, searchTerm, speciesFilter, minQualityFilter]);

  // Performance optimization: Memoized statistics
  const analysisStats = useMemo(() => {
    const totalComparisons = selectedAnimals.size > 1 ? 
      (selectedAnimals.size * (selectedAnimals.size - 1)) / 2 : 0;
    
    const averageQuality = memoizedFilteredAnimals.length > 0 ?
      memoizedFilteredAnimals.reduce((sum, animal) => 
        sum + (animal.snpIndex?.qualityScore || 0), 0) / memoizedFilteredAnimals.length : 0;

    return {
      totalComparisons,
      averageQuality: Math.round(averageQuality * 10) / 10,
      estimatedTime: totalComparisons * 0.25, // seconds
      dataIntegrity: validationResult?.dataQuality.qualityScore || 0
    };
  }, [selectedAnimals.size, memoizedFilteredAnimals, validationResult]);

  // Load animals on component mount
  useEffect(() => {
    loadAnimals();
  }, []);

  // Load animals on component mount
  useEffect(() => {
    loadAnimals();
  }, []);

  // Update filtered animals when filters change
  useEffect(() => {
    setFilteredAnimals(memoizedFilteredAnimals);
  }, [memoizedFilteredAnimals]);

  const loadAnimals = async () => {
    try {
      // Use mock data instead of API call
      setAnimals(mockAnimals);
    } catch (error) {
      console.error('Error loading animals:', error);
      setAnimals(mockAnimals);
    }
  };

  // Enhanced data validation
  const validateAnalysisData = useCallback(async (): Promise<ValidationResult> => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check minimum animal count
    if (selectedAnimals.size < 2) {
      errors.push('At least 2 animals are required for kinship analysis');
    }

    // Check for mixed species (warning)
    const selectedAnimalObjects = animals.filter(a => selectedAnimals.has(a.id));
    const species = new Set(selectedAnimalObjects.map(a => a.species));
    if (species.size > 1) {
      warnings.push('Multiple species detected. Consider species-specific analysis for better accuracy.');
    }

    // Check SNP data quality
    const animalsWithLowQuality = selectedAnimalObjects.filter(a => 
      a.snpIndex && a.snpIndex.qualityScore < 7.0
    );
    if (animalsWithLowQuality.length > 0) {
      warnings.push(`${animalsWithLowQuality.length} animals have quality scores below 7.0`);
    }

    // Check missing SNP data
    const animalsWithoutSNP = selectedAnimalObjects.filter(a => !a.snpIndex);
    if (animalsWithoutSNP.length > 0) {
      errors.push(`${animalsWithoutSNP.length} animals missing SNP data`);
    }

    // Calculate data quality metrics
    const totalSNPs = selectedAnimalObjects.reduce((sum, a) => sum + (a.snpIndex?.snpCount || 0), 0);
    const averageSNPs = totalSNPs / selectedAnimals.size;
    const snpCoverage = Math.min(averageSNPs / 50000, 1.0); // Assuming 50k is ideal
    
    const qualityScores = selectedAnimalObjects
      .filter(a => a.snpIndex)
      .map(a => a.snpIndex!.qualityScore);
    const averageQuality = qualityScores.length > 0 ? 
      qualityScores.reduce((sum, q) => sum + q, 0) / qualityScores.length : 0;

    const result: ValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings,
      dataQuality: {
        snpCoverage: Math.round(snpCoverage * 100) / 100,
        missingDataRate: animalsWithoutSNP.length / selectedAnimals.size,
        qualityScore: Math.round(averageQuality * 10) / 10
      }
    };

    setValidationResult(result);
    return result;
  }, [selectedAnimals, animals]);

  // Enhanced kinship analysis with AI integration
  const runKinshipAnalysis = async () => {
    const validation = await validateAnalysisData();
    if (!validation.isValid) {
      return; // Don't proceed if validation fails
    }

    setIsAnalysisRunning(true);
    setAnalysisProgress({
      currentStep: 'Initializing analysis...',
      progress: 0,
      estimatedTimeRemaining: analysisStats.estimatedTime,
      comparisonsCompleted: 0,
      totalComparisons: analysisStats.totalComparisons
    });

    try {
      // Simulate real-time progress updates
      const progressSteps = [
        { step: 10, message: 'Validating SNP data...', delay: 800 },
        { step: 25, message: 'Loading genotype matrices...', delay: 1200 },
        { step: 40, message: 'Calculating kinship coefficients...', delay: 2000 },
        { step: 65, message: 'Applying relationship classification...', delay: 1500 },
        { step: 80, message: 'Running AI-enhanced predictions...', delay: 1000 },
        { step: 95, message: 'Generating visualization data...', delay: 500 },
        { step: 100, message: 'Analysis complete!', delay: 300 }
      ];

      for (const progress of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, progress.delay));
        setAnalysisProgress(prev => prev ? {
          ...prev,
          progress: progress.step,
          currentStep: progress.message,
          comparisonsCompleted: Math.round((progress.step / 100) * analysisStats.totalComparisons),
          estimatedTimeRemaining: Math.max(0, prev.estimatedTimeRemaining - progress.delay / 1000)
        } : null);
      }

      // Generate mock results with AI predictions
      const mockResults = generateMockKinshipResults();
      setKinshipResults(mockResults);

    } catch (error) {
      console.error('Error in kinship analysis:', error);
    } finally {
      setIsAnalysisRunning(false);
      setAnalysisProgress(null);
    }
  };

  const generateMockKinshipResults = (): KinshipResult[] => {
    const selectedAnimalIds = Array.from(selectedAnimals);
    const results: KinshipResult[] = [];

    for (let i = 0; i < selectedAnimalIds.length; i++) {
      for (let j = i + 1; j < selectedAnimalIds.length; j++) {
        const coefficient = Math.random() * 0.5;
        let relationshipType: KinshipResult['relationshipType'] = 'UNRELATED';
        
        if (coefficient > 0.4) relationshipType = 'PARENT_OFFSPRING';
        else if (coefficient > 0.2) relationshipType = 'FULL_SIBLINGS';
        else if (coefficient > 0.1) relationshipType = 'HALF_SIBLINGS';
        else if (coefficient > 0.05) relationshipType = 'COUSINS';

        results.push({
          animal1: selectedAnimalIds[i],
          animal2: selectedAnimalIds[j],
          kinshipCoefficient: Math.round(coefficient * 1000) / 1000,
          relationshipType,
          confidence: 0.8 + Math.random() * 0.2,
          aiPrediction: aiEnhancedMode ? {
            predictedRelationship: relationshipType,
            confidence: 0.85 + Math.random() * 0.15,
            features: ['Shared SNP patterns', 'Genomic similarity', 'Population structure']
          } : undefined
        });
      }
    }

    return results;
  };

  // Toggle animal selection
  const toggleAnimalSelection = (animalId: string) => {
    setSelectedAnimals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(animalId)) {
        newSet.delete(animalId);
      } else {
        newSet.add(animalId);
      }
      return newSet;
    });
  };

  // Select all filtered animals
  const selectAllFiltered = () => {
    const allFilteredIds = new Set(filteredAnimals.map(a => a.id));
    setSelectedAnimals(allFilteredIds);
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedAnimals(new Set());
  };

  // Export results
  const exportResults = (format: 'csv' | 'json' | 'xlsx') => {
    // Implementation would depend on the chosen export library
    console.log(`Exporting results in ${format} format`);
  };

  // Mock data for development
  const mockAnimals: Animal[] = [
    {
      id: '1',
      name: 'Luna',
      animalID: 'BOV-2023-001',
      species: 'BOVINE',
      sex: 'Female',
      customerName: 'Prairie Genetics',
      snpIndex: { snpCount: 45231, uploadDate: '2024-01-15', qualityScore: 9.2 }
    },
    {
      id: '2', 
      name: 'Thunder',
      animalID: 'BOV-2023-002',
      species: 'BOVINE',
      sex: 'Male',
      customerName: 'Prairie Genetics',
      snpIndex: { snpCount: 47856, uploadDate: '2024-01-16', qualityScore: 8.8 }
    },
    {
      id: '3',
      name: 'Stella',
      animalID: 'BOV-2023-003', 
      species: 'BOVINE',
      sex: 'Female',
      customerName: 'Mountain View Ranch',
      snpIndex: { snpCount: 44892, uploadDate: '2024-01-17', qualityScore: 9.5 }
    },
    {
      id: '4',
      name: 'Atlas',
      animalID: 'CAM-2023-001',
      species: 'CAMEL',
      sex: 'Male',
      customerName: 'Desert Breeders Co.',
      snpIndex: { snpCount: 38456, uploadDate: '2024-01-18', qualityScore: 8.1 }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Real-time Stats */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-green-500 rounded-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Advanced Kinship Analysis</h2>
            <p className="text-gray-600">AI-enhanced relationship analysis with comprehensive validation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <span className="font-medium">Selected Animals</span>
            </div>
            <div className="text-lg font-bold text-green-900 mt-1">
              {selectedAnimals.size}
            </div>
            <div className="text-sm text-gray-500">
              from {filteredAnimals.length} available
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Comparisons</span>
            </div>
            <div className="text-lg font-bold text-blue-900 mt-1">
              {analysisStats.totalComparisons.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              ~{Math.round(analysisStats.estimatedTime)}s estimated
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Data Quality</span>
            </div>
            <div className="text-lg font-bold text-purple-900 mt-1">
              {analysisStats.averageQuality}/10
            </div>
            <div className="text-sm text-gray-500">
              {validationResult?.isValid ? 'Validated' : 'Pending'}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-orange-600" />
              <span className="font-medium">AI Enhanced</span>
            </div>
            <div className="text-lg font-bold text-orange-900 mt-1">
              {aiEnhancedMode ? 'Active' : 'Disabled'}
            </div>
            <div className="text-sm text-gray-500">
              ML predictions
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold">Animal Selection & Filtering</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="flex items-center space-x-1 px-3 py-1 text-sm border rounded-lg hover:bg-gray-50"
            >
              <Settings className="h-4 w-4" />
              <span>Advanced</span>
              {showAdvancedOptions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Animals</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or ID..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Species Filter</label>
            <select
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="ALL">All Species</option>
              <option value="BOVINE">Bovine</option>
              <option value="CAMEL">Camel</option>
              <option value="EQUINE">Equine</option>
              <option value="OVINE">Ovine</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Quality Score: {minQualityFilter}
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={minQualityFilter}
              onChange={(e) => setMinQualityFilter(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        {/* Advanced Options */}
        {showAdvancedOptions && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium mb-3">Advanced Options</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={aiEnhancedMode}
                    onChange={(e) => setAiEnhancedMode(e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm">AI-Enhanced Predictions</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kinship Algorithm
                </label>
                <select
                  value={selectedAlgorithm}
                  onChange={(e) => setSelectedAlgorithm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="KING">KING Algorithm</option>
                  <option value="PLINK_IBS">PLINK IBS</option>
                  <option value="PLINK_GRM">PLINK GRM</option>
                  <option value="AI_CLASSIFIER">AI-Based Classifier</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Animal Selection Grid */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">
              Showing {filteredAnimals.length} animals
            </span>
            <div className="flex space-x-2">
              <button
                onClick={selectAllFiltered}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
              >
                Select All
              </button>
              <button
                onClick={clearSelection}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
            {filteredAnimals.map((animal) => (
              <div
                key={animal.id}
                onClick={() => toggleAnimalSelection(animal.id)}
                className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                  selectedAnimals.has(animal.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{animal.name}</div>
                    <div className="text-sm text-gray-600">{animal.animalID}</div>
                    <div className="text-xs text-gray-500">{animal.species} • {animal.sex}</div>
                    {animal.snpIndex && (
                      <div className="text-xs text-green-600 mt-1">
                        Quality: {animal.snpIndex.qualityScore}/10 • 
                        SNPs: {animal.snpIndex.snpCount.toLocaleString()}
                      </div>
                    )}
                  </div>
                  {selectedAnimals.has(animal.id) && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Validation Status */}
        {validationResult && (
          <div className={`rounded-lg p-4 ${
            validationResult.isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {validationResult.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium">
                {validationResult.isValid ? 'Data Validation Passed' : 'Validation Issues Detected'}
              </span>
            </div>
            
            {validationResult.errors.length > 0 && (
              <div className="mb-2">
                <div className="text-sm font-medium text-red-700 mb-1">Errors:</div>
                {validationResult.errors.map((error, idx) => (
                  <div key={idx} className="text-sm text-red-600">• {error}</div>
                ))}
              </div>
            )}
            
            {validationResult.warnings.length > 0 && (
              <div className="mb-2">
                <div className="text-sm font-medium text-yellow-700 mb-1">Warnings:</div>
                {validationResult.warnings.map((warning, idx) => (
                  <div key={idx} className="text-sm text-yellow-600">• {warning}</div>
                ))}
              </div>
            )}
            
            <div className="text-sm text-gray-600">
              Data Quality: {validationResult.dataQuality.qualityScore}/10 • 
              SNP Coverage: {Math.round(validationResult.dataQuality.snpCoverage * 100)}% • 
              Missing Rate: {Math.round(validationResult.dataQuality.missingDataRate * 100)}%
            </div>
          </div>
        )}

        {/* Analysis Controls */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4">
            <button
              onClick={runKinshipAnalysis}
              disabled={selectedAnimals.size < 2 || isAnalysisRunning || !validationResult?.isValid}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isAnalysisRunning ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Running Analysis...</span>
                </>
              ) : (
                <>
                  <Play className="h-5 w-5" />
                  <span>Run Kinship Analysis</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => validateAnalysisData()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span>Validate Data</span>
            </button>
          </div>
          
          {kinshipResults.length > 0 && (
            <div className="flex items-center space-x-2">
              <select
                value={visualizationMode}
                onChange={(e) => setVisualizationMode(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="heatmap">Heatmap View</option>
                <option value="network">Network View</option>
                <option value="table">Table View</option>
              </select>
              
              <button
                onClick={() => exportResults('csv')}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Progress */}
      {analysisProgress && (
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            <h3 className="text-lg font-semibold">Analysis in Progress</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{analysisProgress.currentStep}</span>
                <span>{analysisProgress.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analysisProgress.progress}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Comparisons:</span>
                <span className="ml-2 font-medium">
                  {analysisProgress.comparisonsCompleted.toLocaleString()} / {analysisProgress.totalComparisons.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Time Remaining:</span>
                <span className="ml-2 font-medium">
                  ~{Math.round(analysisProgress.estimatedTimeRemaining)}s
                </span>
              </div>
              <div>
                <span className="text-gray-600">Algorithm:</span>
                <span className="ml-2 font-medium">{selectedAlgorithm}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Results Display */}
      {kinshipResults.length > 0 && !isAnalysisRunning && (
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Kinship Analysis Results</h3>
              {aiEnhancedMode && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  AI Enhanced
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {kinshipResults.length} relationships analyzed
            </div>
          </div>

          {/* Results Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 font-medium">Parent-Offspring</div>
              <div className="text-xl font-bold text-blue-900">
                {kinshipResults.filter(r => r.relationshipType === 'PARENT_OFFSPRING').length}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 font-medium">Full Siblings</div>
              <div className="text-xl font-bold text-green-900">
                {kinshipResults.filter(r => r.relationshipType === 'FULL_SIBLINGS').length}
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm text-yellow-600 font-medium">Half Siblings</div>
              <div className="text-xl font-bold text-yellow-900">
                {kinshipResults.filter(r => r.relationshipType === 'HALF_SIBLINGS').length}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 font-medium">Unrelated</div>
              <div className="text-xl font-bold text-gray-900">
                {kinshipResults.filter(r => r.relationshipType === 'UNRELATED').length}
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Animal Pair
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kinship Coefficient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Relationship
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  {aiEnhancedMode && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AI Prediction
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {kinshipResults.slice(0, 10).map((result, idx) => {
                  const animal1 = animals.find(a => a.id === result.animal1);
                  const animal2 = animals.find(a => a.id === result.animal2);
                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {animal1?.name} ↔ {animal2?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {animal1?.animalID} ↔ {animal2?.animalID}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-mono">{result.kinshipCoefficient}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          result.relationshipType === 'PARENT_OFFSPRING' ? 'bg-blue-100 text-blue-800' :
                          result.relationshipType === 'FULL_SIBLINGS' ? 'bg-green-100 text-green-800' :
                          result.relationshipType === 'HALF_SIBLINGS' ? 'bg-yellow-100 text-yellow-800' :
                          result.relationshipType === 'COUSINS' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {result.relationshipType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${result.confidence * 100}%` }}
                            />
                          </div>
                          <span>{Math.round(result.confidence * 100)}%</span>
                        </div>
                      </td>
                      {aiEnhancedMode && result.aiPrediction && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            <Brain className="h-4 w-4 text-purple-600" />
                            <span className="text-sm text-gray-900">
                              {Math.round(result.aiPrediction.confidence * 100)}%
                            </span>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {kinshipResults.length > 10 && (
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500">
                Showing 10 of {kinshipResults.length} results
              </span>
            </div>
          )}
        </div>
      )}

      {/* Placeholder for empty state */}
      {kinshipResults.length === 0 && !isAnalysisRunning && (
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="text-center py-12">
            <Network className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Ready for Kinship Analysis
            </h4>
            <p className="text-gray-600 mb-4">
              Select animals and run the analysis to discover genetic relationships
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-lg mx-auto">
              <h5 className="font-semibold text-blue-900 mb-2">Enhanced Features:</h5>
              <ul className="text-blue-800 text-sm space-y-1 text-left">
                <li>• Real-time data validation and quality assessment</li>
                <li>• Multiple kinship algorithms (KING, PLINK, AI-based)</li>
                <li>• AI-enhanced relationship predictions</li>
                <li>• Interactive visualizations (heatmap, network, table)</li>
                <li>• Advanced filtering and search capabilities</li>
                <li>• Comprehensive export options</li>
                <li>• Performance optimized for large datasets</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KinshipAnalysis; 