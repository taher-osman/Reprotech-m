import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Filter, 
  Save, 
  Eye, 
  Download, 
  Search, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Info,
  BarChart3,
  Target,
  Atom,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Database,
  Users,
  TrendingUp,
  Zap,
  X,
  ChevronDown,
  ChevronUp,
  Layers,
  ArrowRight,
  Clock,
  FlaskConical,
  Activity,
  Dna,
  FileText,
  Brain,
  Shield,
  Hash,
  Sparkles,
  TrendingDown,
  AlertTriangle,
  ListFilter,
  SortAsc,
  SortDesc
} from 'lucide-react';

interface FilterCriteria {
  species: string;
  minGcScore: number;
  minGtScore: number;
  mafThreshold: number;
  missingRateThreshold: number;
  hwePValue?: number;
  ldPruningMethod: 'none' | 'ld_prune' | 'snp_thinning';
  chromosomeRange?: {
    chromosome: string;
    startPosition: number;
    endPosition: number;
  };
  selectedAnimalIds?: string[];
  geneRegions?: string[];
  functionalCategories?: string[];
  pathwayFilters?: string[];
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  quality: {
    overallScore: number;
    filteringEfficiency: number;
    dataCompleteness: number;
  };
  recommendations: string[];
}

interface AdvancedSearchOptions {
  searchTerm: string;
  chromosome?: string;
  positionRange?: { start: number; end: number };
  geneSymbol?: string;
  functionalAnnotation?: string;
  sortBy: 'position' | 'maf' | 'quality' | 'missing_rate';
  sortOrder: 'asc' | 'desc';
}

interface SNPStatistics {
  snpName: string;
  chromosome: string | number;
  position: number;
  maf: number;
  missingRate: number;
  gcScoreMean: number;
  gtScoreMean?: number;
  hwePValue?: number;
  alleleCount: {
    A: number;
    T: number;
    C: number;
    G: number;
  };
  qualityGrade: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface Animal {
  id: string;
  name: string;
  animalID: string;
  sex: string;
  customerName: string;
  snpIndex: {
    snpCount: number;
    uploadDate: string;
  };
}

const SNPPanelBuilder: React.FC = () => {
  // Enhanced state management
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [species, setSpecies] = useState<string[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [filteredSNPs, setFilteredSNPs] = useState<SNPStatistics[]>([]);
  const [savedPanels, setSavedPanels] = useState<any[]>([]);
  const [processProgress, setProcessProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [searchOptions, setSearchOptions] = useState<AdvancedSearchOptions>({
    searchTerm: '',
    sortBy: 'position',
    sortOrder: 'asc'
  });
  const [aiOptimizationEnabled, setAiOptimizationEnabled] = useState(true);
  const [performanceMode, setPerformanceMode] = useState<'standard' | 'fast' | 'comprehensive'>('standard');
  
  // Filter criteria state
  const [filters, setFilters] = useState<FilterCriteria>({
    species: '',
    minGcScore: 0.7,
    minGtScore: 0.7,
    mafThreshold: 0.05,
    missingRateThreshold: 0.1,
    ldPruningMethod: 'none',
    selectedAnimalIds: []
  });

  // Panel save state
  const [panelName, setPanelName] = useState('');
  const [panelDescription, setPanelDescription] = useState('');
  const [showSavePanel, setShowSavePanel] = useState(false);

  // Summary statistics
  const [summary, setSummary] = useState<any>(null);

  // Performance optimization: Memoized filtered SNPs
  const optimizedFilteredSNPs = useMemo(() => {
    if (!filteredSNPs.length) return [];
    
    let result = [...filteredSNPs];
    
    // Apply search filter
    if (searchOptions.searchTerm) {
      result = result.filter(snp => 
        snp.snpName.toLowerCase().includes(searchOptions.searchTerm.toLowerCase()) ||
        snp.chromosome.toString().includes(searchOptions.searchTerm)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const multiplier = searchOptions.sortOrder === 'asc' ? 1 : -1;
      switch (searchOptions.sortBy) {
        case 'position':
          return (a.position - b.position) * multiplier;
        case 'maf':
          return (a.maf - b.maf) * multiplier;
        case 'quality':
          return (a.gcScoreMean - b.gcScoreMean) * multiplier;
        case 'missing_rate':
          return (a.missingRate - b.missingRate) * multiplier;
        default:
          return 0;
      }
    });
    
    return result;
  }, [filteredSNPs, searchOptions]);

  // Enhanced validation function
  const validatePanelConfiguration = useCallback(async (): Promise<ValidationResult> => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    
    // Species validation
    if (!filters.species) {
      errors.push('Species selection is required');
    }
    
    // Quality threshold validation
    if (filters.minGcScore < 0.5) {
      warnings.push('GC score threshold below 0.5 may include low-quality SNPs');
    }
    
    if (filters.mafThreshold < 0.01) {
      warnings.push('Very low MAF threshold may include rare variants with limited power');
    } else if (filters.mafThreshold > 0.1) {
      warnings.push('High MAF threshold may exclude informative variants');
    }
    
    // Missing data validation
    if (filters.missingRateThreshold > 0.2) {
      warnings.push('High missing rate threshold may reduce data quality');
    }
    
    // Animal selection validation
    if (!filters.selectedAnimalIds?.length) {
      warnings.push('No animals selected - using all available animals');
    } else if (filters.selectedAnimalIds.length < 10) {
      warnings.push('Small sample size may affect statistical power');
    }
    
    // Performance recommendations
    if (animals.length > 1000 && performanceMode === 'standard') {
      recommendations.push('Consider using "fast" mode for large datasets');
    }
    
    if (aiOptimizationEnabled && filters.selectedAnimalIds && filters.selectedAnimalIds.length > 500) {
      recommendations.push('AI optimization enabled - processing may take longer but will provide better results');
    }
    
    // Calculate quality scores
    const overallScore = Math.max(0, Math.min(10, 
      10 - (errors.length * 3) - (warnings.length * 1)
    ));
    
    const filteringEfficiency = Math.min(1.0,
      (filters.minGcScore * 0.3) + 
      (Math.min(filters.mafThreshold * 10, 1) * 0.3) +
      ((1 - filters.missingRateThreshold) * 0.4)
    );
    
    const dataCompleteness = filters.selectedAnimalIds?.length ? 
      Math.min(1.0, filters.selectedAnimalIds.length / 100) : 0.8;
    
    const result: ValidationResult = {
      isValid: errors.length === 0,
      errors,
      warnings,
      quality: {
        overallScore,
        filteringEfficiency: Math.round(filteringEfficiency * 100) / 100,
        dataCompleteness: Math.round(dataCompleteness * 100) / 100
      },
      recommendations
    };
    
    setValidationResult(result);
    return result;
  }, [filters, animals, performanceMode, aiOptimizationEnabled]);

  const steps = [
    { title: "Species Selection", icon: <Atom className="h-5 w-5" />, description: "Select target species" },
    { title: "Quality Filters", icon: <Filter className="h-5 w-5" />, description: "Configure SNP quality filters" },
    { title: "Animal Selection", icon: <Users className="h-5 w-5" />, description: "Choose sample group" },
    { title: "Advanced Filters", icon: <Settings className="h-5 w-5" />, description: "MAF, HWE, LD pruning" },
    { title: "Preview Results", icon: <Eye className="h-5 w-5" />, description: "Review filtered SNPs" },
    { title: "Save Panel", icon: <Save className="h-5 w-5" />, description: "Create reference panel" }
  ];

  // Load available species on component mount
  useEffect(() => {
    const loadSpecies = async () => {
      try {
        // Use mock data instead of API call
        const mockSpecies = ['BOVINE', 'OVINE', 'CAPRINE', 'EQUINE', 'CAMEL'];
        setSpecies(mockSpecies);
      } catch (error) {
        console.error('Error loading species:', error);
      }
    };

    loadSpecies();
    loadSavedPanels();
  }, []);

  // Load animals when species changes
  useEffect(() => {
    if (filters.species) {
      loadAnimalsForSpecies(filters.species);
    }
  }, [filters.species]);

  const loadAnimalsForSpecies = async (selectedSpecies: string) => {
    try {
      // Generate mock animals data
      const mockAnimals: Animal[] = Array.from({ length: 20 }, (_, i) => ({
        id: `animal-${i + 1}`,
        name: `${selectedSpecies}-${String(i + 1).padStart(3, '0')}`,
        animalID: `A${selectedSpecies.substring(0, 3).toUpperCase()}${String(i + 1).padStart(4, '0')}`,
        sex: Math.random() > 0.5 ? 'Male' : 'Female',
        customerName: `Customer ${Math.floor(Math.random() * 10) + 1}`,
        snpIndex: {
          snpCount: Math.floor(Math.random() * 50000) + 10000,
          uploadDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      }));
      setAnimals(mockAnimals);
    } catch (error) {
      console.error('Error loading animals:', error);
    }
  };

  const loadSavedPanels = async () => {
    try {
      // Generate mock panels data
      const mockPanels = [
        {
          id: 'panel-1',
          name: 'High Quality BOVINE Panel',
          description: 'Premium quality SNPs for bovine breeding',
          species: 'BOVINE',
          snpCount: 45000,
          createdDate: '2024-01-15'
        },
        {
          id: 'panel-2', 
          name: 'OVINE Fertility Focus',
          description: 'Fertility and reproduction focused SNP panel',
          species: 'OVINE',
          snpCount: 32000,
          createdDate: '2024-02-01'
        },
        {
          id: 'panel-3',
          name: 'CAMEL Desert Adaptation',
          description: 'Environmental adaptation and disease resistance',
          species: 'CAMEL',
          snpCount: 28000,
          createdDate: '2024-02-10'
        }
      ];
      setSavedPanels(mockPanels);
    } catch (error) {
      console.error('Error loading panels:', error);
    }
  };

  const previewFiltering = async () => {
    if (!filters.species) return;

    // Validate configuration first
    const validation = await validatePanelConfiguration();
    if (!validation.isValid) {
      console.warn('Validation failed:', validation.errors);
      return;
    }

    setIsProcessing(true);
    setProcessProgress(0);

    // Enhanced progress steps based on performance mode
    const progressSteps = performanceMode === 'fast' ? [
      { step: 25, message: "Loading SNP data (fast mode)...", delay: 300 },
      { step: 60, message: "Applying core filters...", delay: 400 },
      { step: 85, message: "Generating summary...", delay: 200 },
      { step: 100, message: "Complete!", delay: 100 }
    ] : performanceMode === 'comprehensive' ? [
      { step: 10, message: "Loading comprehensive SNP dataset...", delay: 800 },
      { step: 25, message: "Calculating detailed statistics...", delay: 1000 },
      { step: 40, message: "Applying quality filters...", delay: 800 },
      { step: 55, message: "Processing MAF thresholds...", delay: 600 },
      { step: 70, message: "Analyzing linkage disequilibrium...", delay: 900 },
      { step: 85, message: "AI optimization and ranking...", delay: 700 },
      { step: 100, message: "Finalizing comprehensive results...", delay: 300 }
    ] : [
      { step: 20, message: "Loading SNP data...", delay: 500 },
      { step: 40, message: "Calculating statistics...", delay: 600 },
      { step: 60, message: "Applying quality filters...", delay: 500 },
      { step: 80, message: "Processing MAF thresholds...", delay: 400 },
      { step: 100, message: "Finalizing results...", delay: 300 }
    ];

    // Add AI optimization step if enabled
    if (aiOptimizationEnabled && performanceMode !== 'fast') {
      const aiStep = { step: 90, message: "Running AI optimization...", delay: 800 };
      progressSteps.splice(-1, 0, aiStep);
    }

    for (const progress of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, progress.delay));
      setProcessProgress(progress.step);
    }

    try {
      // Generate enhanced mock data based on filters
      const mockSNPs = generateMockSNPData(filters);
      setFilteredSNPs(mockSNPs);
      
      setSummary({
        totalSNPs: mockSNPs.length,
        filteredSNPs: mockSNPs.length,
        qualityDistribution: calculateQualityDistribution(mockSNPs),
        performanceMetrics: {
          processingTime: performanceMode === 'fast' ? '2.1s' : 
                         performanceMode === 'comprehensive' ? '8.7s' : '4.3s',
          memoryUsage: `${Math.round(mockSNPs.length * 0.001)}MB`,
          optimizationScore: aiOptimizationEnabled ? 0.92 : 0.78
        }
      });
      
      setCurrentStep(4); // Move to preview step
    } catch (error) {
      console.error('Error previewing filtering:', error);
      // Generate fallback mock data
      const mockSNPs = generateMockSNPData(filters);
      setFilteredSNPs(mockSNPs);
    } finally {
      setIsProcessing(false);
      setProcessProgress(0);
    }
  };

  // Generate mock SNP data for development
  const generateMockSNPData = (filterCriteria: FilterCriteria): SNPStatistics[] => {
    const chromosomes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const mockData: SNPStatistics[] = [];
    
    const baseCount = performanceMode === 'fast' ? 5000 : 
                     performanceMode === 'comprehensive' ? 25000 : 12000;
    
    for (let i = 0; i < baseCount; i++) {
      const maf = Math.random() * 0.5;
      const gcScore = Math.random() * (1 - filterCriteria.minGcScore) + filterCriteria.minGcScore;
      const missingRate = Math.random() * filterCriteria.missingRateThreshold;
      
      // Only include SNPs that pass filters
      if (maf >= filterCriteria.mafThreshold && 
          gcScore >= filterCriteria.minGcScore && 
          missingRate <= filterCriteria.missingRateThreshold) {
        
        mockData.push({
          snpName: `rs${1000000 + i}`,
          chromosome: chromosomes[Math.floor(Math.random() * chromosomes.length)],
          position: Math.floor(Math.random() * 100000000) + 1000000,
          maf: Math.round(maf * 1000) / 1000,
          missingRate: Math.round(missingRate * 1000) / 1000,
          gcScoreMean: Math.round(gcScore * 100) / 100,
          gtScoreMean: Math.round((Math.random() * 0.3 + 0.7) * 100) / 100,
          hwePValue: Math.random() * 0.1,
          alleleCount: {
            A: Math.floor(Math.random() * 100),
            T: Math.floor(Math.random() * 100),
            C: Math.floor(Math.random() * 100),
            G: Math.floor(Math.random() * 100)
          },
          qualityGrade: gcScore > 0.9 ? 'HIGH' : gcScore > 0.7 ? 'MEDIUM' : 'LOW'
        });
      }
    }
    
    return mockData;
  };

  const calculateQualityDistribution = (snps: SNPStatistics[]) => {
    const high = snps.filter(s => s.qualityGrade === 'HIGH').length;
    const medium = snps.filter(s => s.qualityGrade === 'MEDIUM').length;
    const low = snps.filter(s => s.qualityGrade === 'LOW').length;
    
    return { high, medium, low };
  };

  const savePanel = async () => {
    if (!panelName.trim() || !filters.species) return;

    setIsProcessing(true);
    try {
      // Simulate saving panel with mock response
      console.log('Panel saved successfully:', {
        panelName: panelName.trim(),
        description: panelDescription.trim(),
        filters,
        snpCount: filteredSNPs.length
      });
      
      setShowSavePanel(false);
      setPanelName('');
      setPanelDescription('');
      loadSavedPanels();
      setCurrentStep(5); // Move to completion step
    } catch (error) {
      console.error('Error saving panel:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Component render methods
  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                index <= currentStep
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-400'
              }`}
            >
              {index < currentStep ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                step.icon
              )}
            </div>
            <div className="text-center mt-2">
              <p className={`text-xs font-medium ${index <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div 
                className={`h-0.5 w-full mt-5 -mb-5 transition-all duration-300 ${
                  index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSpeciesSelection = () => (
    <div className="bg-white rounded-lg shadow-lg border p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Atom className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-semibold">Select Species</h3>
      </div>
      <p className="text-gray-600 mb-6">Choose the species for your SNP panel analysis</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {species.map((sp) => (
          <div
            key={sp}
            onClick={() => {
              setFilters(prev => ({ ...prev, species: sp }));
              setCurrentStep(1);
            }}
            className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
              filters.species === sp
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🧬</div>
              <h4 className="font-semibold text-gray-900">{sp}</h4>
              <p className="text-sm text-gray-600 mt-1">Click to select</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEnhancedResults = () => (
    <div className="space-y-6">
      {/* Results Header with Search and Filter Controls */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-semibold">SNP Panel Results</h3>
            {aiOptimizationEnabled && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                AI Optimized
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              {optimizedFilteredSNPs.length.toLocaleString()} SNPs
            </span>
            <button
              onClick={() => setShowSavePanel(true)}
              disabled={optimizedFilteredSNPs.length === 0}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Panel</span>
            </button>
          </div>
        </div>

        {/* Performance Metrics */}
        {summary?.performanceMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Processing Time</span>
              </div>
              <div className="text-xl font-bold text-blue-900 mt-1">
                {summary.performanceMetrics.processingTime}
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">Memory Usage</span>
              </div>
              <div className="text-xl font-bold text-green-900 mt-1">
                {summary.performanceMetrics.memoryUsage}
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-purple-900">Optimization Score</span>
              </div>
              <div className="text-xl font-bold text-purple-900 mt-1">
                {Math.round(summary.performanceMetrics.optimizationScore * 100)}%
              </div>
            </div>
          </div>
        )}

        {/* Advanced Search and Filter Controls */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search SNPs</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchOptions.searchTerm}
                  onChange={(e) => setSearchOptions(prev => ({ ...prev, searchTerm: e.target.value }))}
                  placeholder="Search by SNP name, chromosome, or position..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {searchOptions.searchTerm && (
                  <button
                    onClick={() => setSearchOptions(prev => ({ ...prev, searchTerm: '' }))}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={searchOptions.sortBy}
                onChange={(e) => setSearchOptions(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="position">Chromosome Position</option>
                <option value="maf">Minor Allele Frequency</option>
                <option value="quality">Quality Score</option>
                <option value="missing_rate">Missing Rate</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <div className="flex">
                <button
                  onClick={() => setSearchOptions(prev => ({ ...prev, sortOrder: 'asc' }))}
                  className={`flex-1 px-3 py-2 border-l border-t border-b rounded-l-lg flex items-center justify-center ${
                    searchOptions.sortOrder === 'asc' 
                      ? 'bg-purple-100 border-purple-500 text-purple-700'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <SortAsc className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSearchOptions(prev => ({ ...prev, sortOrder: 'desc' }))}
                  className={`flex-1 px-3 py-2 border-r border-t border-b rounded-r-lg flex items-center justify-center ${
                    searchOptions.sortOrder === 'desc'
                      ? 'bg-purple-100 border-purple-500 text-purple-700'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <SortDesc className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quality Distribution */}
        {summary?.qualityDistribution && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Quality Distribution</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-green-600 font-medium">High Quality</div>
                <div className="text-lg font-bold text-green-900">
                  {summary.qualityDistribution.high.toLocaleString()}
                </div>
                <div className="text-xs text-green-600">
                  {Math.round((summary.qualityDistribution.high / optimizedFilteredSNPs.length) * 100)}%
                </div>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="text-sm text-yellow-600 font-medium">Medium Quality</div>
                <div className="text-lg font-bold text-yellow-900">
                  {summary.qualityDistribution.medium.toLocaleString()}
                </div>
                <div className="text-xs text-yellow-600">
                  {Math.round((summary.qualityDistribution.medium / optimizedFilteredSNPs.length) * 100)}%
                </div>
              </div>
              
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-sm text-red-600 font-medium">Low Quality</div>
                <div className="text-lg font-bold text-red-900">
                  {summary.qualityDistribution.low.toLocaleString()}
                </div>
                <div className="text-xs text-red-600">
                  {Math.round((summary.qualityDistribution.low / optimizedFilteredSNPs.length) * 100)}%
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SNP Results Table */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">SNP Details</h4>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Showing {Math.min(optimizedFilteredSNPs.length, 100)} of {optimizedFilteredSNPs.length.toLocaleString()}
              </span>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 flex items-center space-x-1">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SNP Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chromosome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MAF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quality Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Missing Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {optimizedFilteredSNPs.slice(0, 100).map((snp, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{snp.snpName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {snp.chromosome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {snp.position.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {snp.maf.toFixed(3)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${snp.gcScoreMean * 100}%` }}
                        />
                      </div>
                      <span>{snp.gcScoreMean.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(snp.missingRate * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      snp.qualityGrade === 'HIGH' ? 'bg-green-100 text-green-800' :
                      snp.qualityGrade === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {snp.qualityGrade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {optimizedFilteredSNPs.length > 100 && (
          <div className="p-4 border-t bg-gray-50 text-center">
            <span className="text-sm text-gray-600">
              Showing first 100 results. Use search and filters to refine or export full dataset.
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <FlaskConical className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Advanced SNP Panel Builder</h2>
              <p className="text-gray-600">AI-enhanced genomic panel creation with comprehensive validation</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Performance Mode Selector */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Mode:</label>
              <select
                value={performanceMode}
                onChange={(e) => setPerformanceMode(e.target.value as any)}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500"
              >
                <option value="fast">⚡ Fast</option>
                <option value="standard">🎯 Standard</option>
                <option value="comprehensive">🔬 Comprehensive</option>
              </select>
            </div>
            
            {/* AI Optimization Toggle */}
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={aiOptimizationEnabled}
                onChange={(e) => setAiOptimizationEnabled(e.target.checked)}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="font-medium">AI Optimization</span>
            </label>
            
            {/* Validation Button */}
            <button
              onClick={validatePanelConfiguration}
              className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
            >
              <Shield className="h-4 w-4" />
              <span>Validate</span>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Atom className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Species</span>
            </div>
            <div className="text-lg font-bold text-purple-900 mt-1">
              {filters.species || 'Select Species'}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Animals</span>
            </div>
            <div className="text-lg font-bold text-blue-900 mt-1">
              {filters.selectedAnimalIds?.length || 0}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              from {animals.length} available
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Dna className="h-5 w-5 text-green-600" />
              <span className="font-medium">Filtered SNPs</span>
            </div>
            <div className="text-lg font-bold text-green-900 mt-1">
              {optimizedFilteredSNPs.length.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {filteredSNPs.length > optimizedFilteredSNPs.length && 
                `${(filteredSNPs.length - optimizedFilteredSNPs.length).toLocaleString()} filtered out`
              }
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-orange-600" />
              <span className="font-medium">Quality Score</span>
            </div>
            <div className="text-lg font-bold text-orange-900 mt-1">
              {validationResult ? `${validationResult.quality.overallScore}/10` : 'Not validated'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {validationResult?.isValid ? 'Valid' : 'Pending validation'}
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-indigo-600" />
              <span className="font-medium">Saved Panels</span>
            </div>
            <div className="text-lg font-bold text-indigo-900 mt-1">
              {savedPanels.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Ready to use
            </div>
          </div>
        </div>

        {/* Validation Status Display */}
        {validationResult && (
          <div className={`mt-4 p-4 rounded-lg border ${
            validationResult.isValid 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {validationResult.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              )}
              <span className="font-medium">
                Validation {validationResult.isValid ? 'Passed' : 'Warnings'}
              </span>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Efficiency: {Math.round(validationResult.quality.filteringEfficiency * 100)}%</span>
                <span>Completeness: {Math.round(validationResult.quality.dataCompleteness * 100)}%</span>
              </div>
            </div>
            
            {validationResult.warnings.length > 0 && (
              <div className="text-sm text-yellow-700 mb-2">
                <div className="font-medium mb-1">Warnings:</div>
                <ul className="list-disc list-inside space-y-1">
                  {validationResult.warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {validationResult.recommendations.length > 0 && (
              <div className="text-sm text-blue-700">
                <div className="font-medium mb-1">Recommendations:</div>
                <ul className="list-disc list-inside space-y-1">
                  {validationResult.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {renderStepIndicator()}
      
      {isProcessing && currentStep === 3 && (
        <div className="bg-white rounded-lg shadow-lg border p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
              <div 
                className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full transition-all duration-500"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + (processProgress / 100) * 50}% 0%, ${50 + (processProgress / 100) * 50}% 100%, 50% 100%)`
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing SNP Data</h3>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${processProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{processProgress}% Complete</p>
          </div>
        </div>
      )}
      
      {!isProcessing && (
        <>
          {currentStep === 0 && renderSpeciesSelection()}
          {currentStep === 4 && renderEnhancedResults()}
          {/* Other render methods would be implemented here... */}
        </>
      )}

      {/* Save Panel Modal */}
      {showSavePanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Save SNP Panel</h3>
              <button
                onClick={() => setShowSavePanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Panel Name *</label>
                <input
                  type="text"
                  value={panelName}
                  onChange={(e) => setPanelName(e.target.value)}
                  placeholder="e.g., High Quality Bovine Panel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={panelDescription}
                  onChange={(e) => setPanelDescription(e.target.value)}
                  placeholder="Optional description of the panel and its use case"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">
                  <p><strong>Species:</strong> {filters.species}</p>
                  <p><strong>SNPs:</strong> {filteredSNPs.length.toLocaleString()}</p>
                  <p><strong>Animals:</strong> {filters.selectedAnimalIds?.length || 0}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSavePanel(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={savePanel}
                disabled={!panelName.trim() || isProcessing}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Panel</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SNPPanelBuilder; 