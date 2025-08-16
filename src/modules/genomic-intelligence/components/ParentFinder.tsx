import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Settings,
  Download,
  CheckCircle,
  AlertTriangle,
  Brain,
  Target,
  BarChart3,
  TrendingUp,
  Award,
  FileText,
  Play,
  RefreshCw,
  Eye,
  EyeOff,
  ArrowRight,
  Zap,
  Heart,
  Shield,
  DollarSign,
  Clock,
  Layers,
  Database,
  FlaskConical,
  Activity,
  Dna
} from 'lucide-react';

interface UnknownAnimal {
  id: string;
  name: string;
  animalID: string;
  species: string;
  sex: string;
  missingParents: {
    father: boolean;
    mother: boolean;
  };
  customer: string;
  hasSNPData: boolean;
  hasSNPIndex: boolean;
  hasBeadChip: boolean;
  snpCount: number;
  beadChipId?: string;
}

interface PotentialParent {
  id: string;
  name: string;
  animalID: string;
  species: string;
  sex: string;
  type: string;
  age: number;
  customer: string;
  snpCount: number;
  hasSNPIndex: boolean;
  hasBeadChip: boolean;
  beadChipId?: string;
  canBeSire: boolean;
  canBeDam: boolean;
}

interface SNPPanel {
  id: string;
  name: string;
  description: string;
  species: string;
  snpCount: number;
  creator: string;
  createdAt: string;
}

interface ParentCandidate {
  animalId: string;
  animalName: string;
  matchScore: number;
  conflictLoci: number;
  totalSNPsCompared: number;
  validationScore: number;
  predictionConfidence: number;
  mendelianConsistency: number;
  concordanceRate: number;
  sharedRareAlleles: number;
  candidateType: 'sire' | 'dam';
  chromosomeConflicts: { [chromosome: string]: number };
  // Enhanced relationship analysis
  age?: number;
  relationshipRecommendation: 'parent' | 'offspring' | 'sibling' | 'uncertain';
  relationshipConfidence: number;
  generationScore: number;
  ageCompatibility: 'parent' | 'offspring' | 'peer' | 'unknown';
  kinshipRecommendation?: string;
  recommendKinshipAnalysis: boolean;
}

interface AnalysisResults {
  unknownAnimalId: string;
  parameters: any;
  snpPanelUsed?: string;
  totalPotentialParents: number;
  totalSNPsAnalyzed: number;
  results: {
    topSires: ParentCandidate[];
    topDams: ParentCandidate[];
    totalCandidates: number;
  };
  analysisTimestamp: string;
}

const ParentFinder: React.FC = () => {
  // State management
  const [activeStep, setActiveStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [unknownAnimals, setUnknownAnimals] = useState<UnknownAnimal[]>([]);
  const [potentialParents, setPotentialParents] = useState<PotentialParent[]>([]);
  const [snpPanels, setSNPPanels] = useState<SNPPanel[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  
  // Form state
  const [selectedUnknownAnimal, setSelectedUnknownAnimal] = useState<string>('');
  const [selectedSNPPanel, setSelectedSNPPanel] = useState<string>('');
  const [referenceGroupType, setReferenceGroupType] = useState<'animalType' | 'specificAnimals'>('animalType');
  const [selectedAnimalTypes, setSelectedAnimalTypes] = useState<string[]>([]);
  const [selectedAnimalIds, setSelectedAnimalIds] = useState<string[]>([]);
  const [parameters, setParameters] = useState({
    minMatchingSNPs: 10000,
    maxMismatchTolerance: 5,
    minGenotypeConfidence: 0.6,
    useNormalizedScoring: true
  });
  const [validationStrategies, setValidationStrategies] = useState<string[]>([
    'mendelian',
    'trio',
    'snpConflict',
    'concordance',
    'rareAllele'
  ]);

  // Load initial data
  useEffect(() => {
    loadUnknownAnimals();
    loadSNPPanels();
    loadPotentialParents();
  }, []);

  const loadUnknownAnimals = async () => {
    try {
      // Generate mock unknown animals data
      const mockUnknownAnimals: UnknownAnimal[] = Array.from({ length: 8 }, (_, i) => ({
        id: `unknown-${i + 1}`,
        name: `Unknown Animal ${i + 1}`,
        animalID: `UNK-${String(i + 1).padStart(3, '0')}`,
        species: ['BOVINE', 'OVINE', 'CAMEL', 'EQUINE'][Math.floor(Math.random() * 4)],
        sex: Math.random() > 0.5 ? 'Male' : 'Female',
        missingParents: {
          father: Math.random() > 0.5,
          mother: Math.random() > 0.5
        },
        customer: `Customer ${Math.floor(Math.random() * 5) + 1}`,
        hasSNPData: true,
        hasSNPIndex: true,
        hasBeadChip: Math.random() > 0.5,
        snpCount: Math.floor(Math.random() * 50000) + 15000,
        beadChipId: Math.random() > 0.5 ? `BC-${String(i + 1).padStart(4, '0')}` : undefined
      }));
      setUnknownAnimals(mockUnknownAnimals);
    } catch (error) {
      console.error('Error loading unknown animals:', error);
    }
  };

  const loadPotentialParents = async (animalType?: string) => {
    try {
      // Generate mock potential parents data
      const mockPotentialParents: PotentialParent[] = Array.from({ length: 20 }, (_, i) => ({
        id: `parent-${i + 1}`,
        name: `Potential Parent ${i + 1}`,
        animalID: `PP-${String(i + 1).padStart(3, '0')}`,
        species: animalType && animalType !== 'all' ? animalType : ['BOVINE', 'OVINE', 'CAMEL', 'EQUINE'][Math.floor(Math.random() * 4)],
        sex: Math.random() > 0.5 ? 'Male' : 'Female',
        type: 'Breeding Stock',
        age: Math.floor(Math.random() * 15) + 3,
        customer: `Customer ${Math.floor(Math.random() * 10) + 1}`,
        snpCount: Math.floor(Math.random() * 60000) + 20000,
        hasSNPIndex: true,
        hasBeadChip: Math.random() > 0.3,
        beadChipId: Math.random() > 0.3 ? `BC-P-${String(i + 1).padStart(4, '0')}` : undefined,
        canBeSire: true,
        canBeDam: true
      }));
      setPotentialParents(mockPotentialParents);
    } catch (error) {
      console.error('Error loading potential parents:', error);
    }
  };

  const loadSNPPanels = async () => {
    try {
      // Generate mock SNP panels data
      const mockSNPPanels: SNPPanel[] = [
        {
          id: 'panel-1',
          name: 'High Quality Bovine Panel',
          description: 'Premium SNP panel for bovine parentage',
          species: 'BOVINE',
          snpCount: 45000,
          creator: 'System',
          createdAt: '2024-01-15'
        },
        {
          id: 'panel-2',
          name: 'Camel Genomics Panel',
          description: 'Specialized panel for camel genetics',
          species: 'CAMEL',
          snpCount: 32000,
          creator: 'Genomics Lab',
          createdAt: '2024-02-01'
        },
        {
          id: 'panel-3',
          name: 'Universal Livestock Panel',
          description: 'Cross-species compatible panel',
          species: 'ALL',
          snpCount: 25000,
          creator: 'Research Team',
          createdAt: '2024-02-15'
        }
      ];
      setSNPPanels(mockSNPPanels);
    } catch (error) {
      console.error('Error loading SNP panels:', error);
    }
  };

  const runParentFinder = async () => {
    if (!selectedUnknownAnimal) {
      alert('Please select an unknown animal');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate analysis with progress
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock analysis results
      const mockResults: AnalysisResults = {
        unknownAnimalId: selectedUnknownAnimal,
        parameters,
        snpPanelUsed: selectedSNPPanel || undefined,
        totalPotentialParents: 262,
        totalSNPsAnalyzed: 45231,
        results: {
          topSires: Array.from({ length: 5 }, (_, i) => ({
            animalId: `sire-${i + 1}`,
            animalName: `Top Sire ${i + 1}`,
            matchScore: 0.95 - i * 0.05,
            conflictLoci: Math.floor(Math.random() * 50) + 10,
            totalSNPsCompared: 45000 - Math.floor(Math.random() * 5000),
            validationScore: 0.9 - i * 0.03,
            predictionConfidence: 0.92 - i * 0.04,
            mendelianConsistency: 0.98 - i * 0.02,
            concordanceRate: 0.96 - i * 0.01,
            sharedRareAlleles: Math.floor(Math.random() * 100) + 50,
            candidateType: 'sire',
            chromosomeConflicts: {},
            age: Math.floor(Math.random() * 10) + 5,
            relationshipRecommendation: 'parent',
            relationshipConfidence: 0.9 - i * 0.05,
            generationScore: 0.95,
            ageCompatibility: 'parent',
            kinshipRecommendation: 'Likely parent based on age and genetic similarity',
            recommendKinshipAnalysis: i > 2
          })),
          topDams: Array.from({ length: 3 }, (_, i) => ({
            animalId: `dam-${i + 1}`,
            animalName: `Top Dam ${i + 1}`,
            matchScore: 0.93 - i * 0.04,
            conflictLoci: Math.floor(Math.random() * 40) + 15,
            totalSNPsCompared: 44000 - Math.floor(Math.random() * 3000),
            validationScore: 0.88 - i * 0.02,
            predictionConfidence: 0.90 - i * 0.03,
            mendelianConsistency: 0.97 - i * 0.01,
            concordanceRate: 0.94 - i * 0.02,
            sharedRareAlleles: Math.floor(Math.random() * 80) + 40,
            candidateType: 'dam',
            chromosomeConflicts: {},
            age: Math.floor(Math.random() * 8) + 4,
            relationshipRecommendation: 'parent',
            relationshipConfidence: 0.88 - i * 0.04,
            generationScore: 0.93,
            ageCompatibility: 'parent',
            kinshipRecommendation: 'Likely parent based on genetic analysis',
            recommendKinshipAnalysis: i > 1
          })),
          totalCandidates: 8
        },
        analysisTimestamp: new Date().toISOString()
      };
      
      setAnalysisResults(mockResults);
      setActiveStep(4); // Move to results step
    } catch (error) {
      console.error('Error running parent finder:', error);
      alert('Failed to run parent finder analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const assignParent = async (candidate: ParentCandidate) => {
    try {
      // Simulate assignment with mock response
      console.log('Assigning parent relationship:', {
        childAnimalId: analysisResults?.unknownAnimalId,
        parentAnimalId: candidate.animalId,
        relationshipType: candidate.candidateType,
        confidence: candidate.predictionConfidence
      });
      
      alert(`Successfully assigned ${candidate.animalName} as ${candidate.candidateType}`);
      // Refresh data
      loadUnknownAnimals();
    } catch (error) {
      console.error('Error assigning parent:', error);
      alert('Failed to assign parent relationship');
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step <= activeStep
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {step < activeStep ? <CheckCircle className="h-5 w-5" /> : step}
          </div>
          {step < 4 && (
            <div
              className={`w-12 h-1 ${
                step < activeStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderAnimalSelection = () => (
    <div className="bg-white rounded-lg shadow border p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Users className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Step 1: Animal Selection</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Unknown Animal (Missing Parent Information)
          </label>
          <select
            value={selectedUnknownAnimal}
            onChange={(e) => setSelectedUnknownAnimal(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose an animal...</option>
            {unknownAnimals.map(animal => (
              <option key={animal.id} value={animal.id}>
                {animal.name} ({animal.animalID}) - Missing: {
                  [
                    animal.missingParents.father ? 'Father' : '',
                    animal.missingParents.mother ? 'Mother' : ''
                  ].filter(Boolean).join(', ')
                } - SNP: {animal.hasSNPIndex ? `${animal.snpCount.toLocaleString()} SNPs` : animal.hasBeadChip ? `BeadChip ${animal.beadChipId}` : 'None'}
              </option>
            ))}
          </select>
          <div className="text-sm text-gray-500 mt-1 space-y-1">
            <p>{unknownAnimals.length} animals with missing parent information and SNP data found</p>
            {unknownAnimals.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm">
                  <strong>No eligible animals found.</strong> Animals need both missing parent information and SNP data to be eligible for parent finding.
                </p>
                <ul className="text-yellow-700 text-xs mt-2 space-y-1">
                  <li>• Make sure animals have BeadChip mappings or SNP Index records</li>
                  <li>• Check that animals have missing father or mother information</li>
                  <li>• Import SNP data first if needed</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {selectedUnknownAnimal && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            {(() => {
              const animal = unknownAnimals.find(a => a.id === selectedUnknownAnimal);
              return animal ? (
                <div>
                  <h4 className="font-medium text-blue-900">Selected Animal</h4>
                  <p className="text-blue-700 text-sm">
                    {animal.name} ({animal.animalID}) - {animal.species} {animal.sex}
                  </p>
                  <p className="text-blue-700 text-sm">
                    Customer: {animal.customer}
                  </p>
                  <p className="text-blue-700 text-sm">
                    SNP Data: {animal.hasSNPData ? '✓ Available' : '✗ Not Available'}
                  </p>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => setActiveStep(2)}
          disabled={!selectedUnknownAnimal}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Next: Panel & Reference Settings
          <ArrowRight className="h-4 w-4 ml-2 inline" />
        </button>
      </div>
    </div>
  );

  const renderPanelAndReference = () => (
    <div className="space-y-6">
      {/* SNP Panel Selection */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Target className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">SNP Panel Filter</h3>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select SNP Panel (Optional)
          </label>
          <select
            value={selectedSNPPanel}
            onChange={(e) => setSelectedSNPPanel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Use all available SNPs</option>
            {snpPanels.map(panel => (
              <option key={panel.id} value={panel.id}>
                {panel.name} ({panel.snpCount.toLocaleString()} SNPs) - {panel.species}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Using a filtered panel reduces computational load and standardizes analysis
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setActiveStep(1)}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Previous: Animal Selection
        </button>
        <button
          onClick={() => setActiveStep(3)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Next: Analysis Parameters
          <ArrowRight className="h-4 w-4 ml-2 inline" />
        </button>
      </div>
    </div>
  );

  const renderParameters = () => (
    <div className="space-y-6">
      {/* SNP Match & Scoring Parameters */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold">SNP Match & Scoring Parameters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Number of Matching SNPs
            </label>
            <input
              type="number"
              value={parameters.minMatchingSNPs}
              onChange={(e) => setParameters(prev => ({
                ...prev,
                minMatchingSNPs: parseInt(e.target.value) || 0
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              min="1000"
              max="100000"
              step="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Mismatch Tolerance (%)
            </label>
            <input
              type="number"
              value={parameters.maxMismatchTolerance}
              onChange={(e) => setParameters(prev => ({
                ...prev,
                maxMismatchTolerance: parseFloat(e.target.value) || 0
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              min="0"
              max="50"
              step="0.1"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setActiveStep(2)}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Previous: Panel & Reference Settings
        </button>
        <button
          onClick={runParentFinder}
          disabled={isLoading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Running Analysis...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Run Parent Finder AI
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderResults = () => {
    if (!analysisResults) return null;

    return (
      <div className="space-y-6">
        {/* Analysis Summary */}
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold">Analysis Results</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">SNPs Analyzed</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {analysisResults.totalSNPsAnalyzed.toLocaleString()}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Potential Parents</span>
              </div>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {analysisResults.totalPotentialParents}
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Top Sires</span>
              </div>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {analysisResults.results.topSires.length}
              </p>
            </div>

            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-pink-600" />
                <span className="text-sm font-medium text-pink-900">Top Dams</span>
              </div>
              <p className="text-2xl font-bold text-pink-900 mt-1">
                {analysisResults.results.topDams.length}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Analysis completed at {new Date(analysisResults.analysisTimestamp).toLocaleString()}
          </p>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setActiveStep(3)}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Previous: Analysis Parameters
          </button>
          <button
            onClick={() => {
              setAnalysisResults(null);
              setActiveStep(1);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Analysis
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Parent Finder AI</h2>
            <p className="text-gray-600">AI-powered parentage assignment using genomic SNP data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2 text-blue-700">
            <Target className="h-4 w-4" />
            <span className="text-sm">High-precision SNP matching</span>
          </div>
          <div className="flex items-center space-x-2 text-purple-700">
            <Brain className="h-4 w-4" />
            <span className="text-sm">AI-enhanced candidate discovery</span>
          </div>
          <div className="flex items-center space-x-2 text-green-700">
            <Shield className="h-4 w-4" />
            <span className="text-sm">Multi-strategy validation</span>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Step Content */}
      {activeStep === 1 && renderAnimalSelection()}
      {activeStep === 2 && renderPanelAndReference()}
      {activeStep === 3 && renderParameters()}
      {activeStep === 4 && renderResults()}
    </div>
  );
};

export default ParentFinder; 