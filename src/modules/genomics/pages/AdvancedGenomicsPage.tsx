import React, { useState, useEffect } from 'react';
import { Dna, Plus, Search, Filter, Edit, Trash2, Eye, Calendar, AlertTriangle, Clock, RefreshCw, CheckCircle, XCircle, Activity, Brain, TrendingUp, Target, Zap, Users, BarChart3, Baby, Microscope, FileText, Download, Upload, Ruler, Heart, TreePine, Shield, Award, Beaker, FlaskConical, TestTube, Atom, Layers, Network, GitBranch, Fingerprint, Sparkles } from 'lucide-react';

interface GeneticProfile {
  id: string;
  animalId: string;
  animalName: string;
  animalNumber: string;
  species: string;
  sampleId: string;
  sampleDate: string;
  analysisDate: string;
  analysisType: 'FULL_GENOME' | 'TARGETED_PANEL' | 'PARENTAGE' | 'DISEASE_SCREENING' | 'BREEDING_VALUE';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  qualityScore: number;
  coverage: number;
  markers: {
    total: number;
    analyzed: number;
    polymorphic: number;
  };
  parentageConfidence?: number;
  breedingValue?: number;
  geneticDiversity: number;
  inbreedingCoefficient: number;
  diseaseRisks: DiseaseRisk[];
  traits: GeneticTrait[];
  createdAt: string;
  updatedAt: string;
}

interface DiseaseRisk {
  id: string;
  diseaseName: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  probability: number;
  confidence: number;
  markers: string[];
  description: string;
  recommendations: string;
}

interface GeneticTrait {
  id: string;
  traitName: string;
  category: 'PRODUCTION' | 'REPRODUCTION' | 'HEALTH' | 'CONFORMATION' | 'BEHAVIOR';
  value: number;
  unit: string;
  confidence: number;
  heritability: number;
  description: string;
}

interface ParentageRecord {
  id: string;
  offspringId: string;
  offspringName: string;
  sireId?: string;
  sireName?: string;
  damId?: string;
  damName?: string;
  confidence: number;
  method: 'DNA_ANALYSIS' | 'MANUAL_ASSIGNMENT' | 'PEDIGREE_INFERENCE';
  verificationDate: string;
  status: 'VERIFIED' | 'PROBABLE' | 'UNCERTAIN' | 'DISPUTED';
  exclusionProbability: number;
}

interface BreedingRecommendation {
  id: string;
  maleId: string;
  maleName: string;
  femaleId: string;
  femaleName: string;
  compatibilityScore: number;
  geneticGain: number;
  inbreedingRisk: number;
  diseaseRisk: number;
  expectedTraits: {
    trait: string;
    expectedValue: number;
    confidence: number;
  }[];
  recommendation: 'HIGHLY_RECOMMENDED' | 'RECOMMENDED' | 'ACCEPTABLE' | 'NOT_RECOMMENDED';
  reasoning: string;
}

interface Animal {
  id: string;
  name: string;
  internalNumber: string;
  species: string;
  sex: 'MALE' | 'FEMALE';
  age: number;
  hasGenomicData: boolean;
  lastGenomicAnalysis?: string;
  breedingValue?: number;
  geneticDiversity?: number;
}

export const AdvancedGenomicsPage: React.FC = () => {
  const [profiles, setProfiles] = useState<GeneticProfile[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [parentageRecords, setParentageRecords] = useState<ParentageRecord[]>([]);
  const [breedingRecommendations, setBreedingRecommendations] = useState<BreedingRecommendation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profiles' | 'parentage' | 'diseases' | 'breeding' | 'analytics'>('dashboard');
  const [selectedAnimal, setSelectedAnimal] = useState<string>('');

  // Enhanced sample data
  useEffect(() => {
    const sampleAnimals: Animal[] = [
      { 
        id: '1', name: 'Bella', internalNumber: 'C001', species: 'CAMEL', sex: 'FEMALE', age: 5,
        hasGenomicData: true, lastGenomicAnalysis: '2025-08-10', breedingValue: 85, geneticDiversity: 0.72
      },
      { 
        id: '2', name: 'Luna', internalNumber: 'C002', species: 'CAMEL', sex: 'FEMALE', age: 4,
        hasGenomicData: true, lastGenomicAnalysis: '2025-08-12', breedingValue: 78, geneticDiversity: 0.68
      },
      { 
        id: '3', name: 'Star', internalNumber: 'C003', species: 'CAMEL', sex: 'FEMALE', age: 6,
        hasGenomicData: true, lastGenomicAnalysis: '2025-08-05', breedingValue: 92, geneticDiversity: 0.75
      },
      { 
        id: '4', name: 'King', internalNumber: 'C004', species: 'CAMEL', sex: 'MALE', age: 7,
        hasGenomicData: true, lastGenomicAnalysis: '2025-08-08', breedingValue: 88, geneticDiversity: 0.71
      },
      { 
        id: '5', name: 'Grace', internalNumber: 'C005', species: 'CAMEL', sex: 'FEMALE', age: 3,
        hasGenomicData: false
      }
    ];

    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const sampleProfiles: GeneticProfile[] = [
      {
        id: '1',
        animalId: '1',
        animalName: 'Bella',
        animalNumber: 'C001',
        species: 'CAMEL',
        sampleId: 'GS-2025-001',
        sampleDate: '2025-08-08',
        analysisDate: '2025-08-10',
        analysisType: 'FULL_GENOME',
        status: 'COMPLETED',
        qualityScore: 98,
        coverage: 35.2,
        markers: {
          total: 50000,
          analyzed: 49850,
          polymorphic: 28500
        },
        parentageConfidence: 99.8,
        breedingValue: 85,
        geneticDiversity: 0.72,
        inbreedingCoefficient: 0.08,
        diseaseRisks: [
          {
            id: '1',
            diseaseName: 'Hereditary Cardiomyopathy',
            riskLevel: 'LOW',
            probability: 12,
            confidence: 95,
            markers: ['MYBPC3', 'MYH7', 'TNNT2'],
            description: 'Low genetic predisposition to cardiac muscle disease',
            recommendations: 'Regular cardiac monitoring recommended'
          },
          {
            id: '2',
            diseaseName: 'Metabolic Syndrome',
            riskLevel: 'MEDIUM',
            probability: 35,
            confidence: 88,
            markers: ['PPARG', 'ADIPOQ', 'LEP'],
            description: 'Moderate risk for metabolic disorders',
            recommendations: 'Monitor body condition and nutrition carefully'
          }
        ],
        traits: [
          {
            id: '1',
            traitName: 'Milk Production',
            category: 'PRODUCTION',
            value: 12.5,
            unit: 'L/day',
            confidence: 92,
            heritability: 0.35,
            description: 'Expected daily milk production capacity'
          },
          {
            id: '2',
            traitName: 'Fertility Index',
            category: 'REPRODUCTION',
            value: 88,
            unit: 'index',
            confidence: 85,
            heritability: 0.28,
            description: 'Reproductive performance indicator'
          }
        ],
        createdAt: '2025-08-10T10:30:00Z',
        updatedAt: '2025-08-10T10:30:00Z'
      },
      {
        id: '2',
        animalId: '2',
        animalName: 'Luna',
        animalNumber: 'C002',
        species: 'CAMEL',
        sampleId: 'GS-2025-002',
        sampleDate: '2025-08-10',
        analysisDate: '2025-08-12',
        analysisType: 'TARGETED_PANEL',
        status: 'COMPLETED',
        qualityScore: 95,
        coverage: 28.7,
        markers: {
          total: 15000,
          analyzed: 14850,
          polymorphic: 8200
        },
        parentageConfidence: 97.5,
        breedingValue: 78,
        geneticDiversity: 0.68,
        inbreedingCoefficient: 0.12,
        diseaseRisks: [
          {
            id: '3',
            diseaseName: 'Respiratory Syndrome',
            riskLevel: 'HIGH',
            probability: 68,
            confidence: 91,
            markers: ['CFTR', 'SCNN1A', 'TNFRSF1A'],
            description: 'Elevated risk for respiratory complications',
            recommendations: 'Enhanced respiratory monitoring and environmental management'
          }
        ],
        traits: [
          {
            id: '3',
            traitName: 'Growth Rate',
            category: 'PRODUCTION',
            value: 0.85,
            unit: 'kg/day',
            confidence: 89,
            heritability: 0.42,
            description: 'Expected daily weight gain'
          }
        ],
        createdAt: '2025-08-12T14:15:00Z',
        updatedAt: '2025-08-12T14:15:00Z'
      },
      {
        id: '3',
        animalId: '3',
        animalName: 'Star',
        animalNumber: 'C003',
        species: 'CAMEL',
        sampleId: 'GS-2025-003',
        sampleDate: '2025-08-03',
        analysisDate: '2025-08-05',
        analysisType: 'BREEDING_VALUE',
        status: 'COMPLETED',
        qualityScore: 97,
        coverage: 32.1,
        markers: {
          total: 25000,
          analyzed: 24750,
          polymorphic: 14200
        },
        breedingValue: 92,
        geneticDiversity: 0.75,
        inbreedingCoefficient: 0.05,
        diseaseRisks: [],
        traits: [
          {
            id: '4',
            traitName: 'Longevity',
            category: 'HEALTH',
            value: 95,
            unit: 'index',
            confidence: 93,
            heritability: 0.18,
            description: 'Expected lifespan indicator'
          }
        ],
        createdAt: '2025-08-05T09:20:00Z',
        updatedAt: '2025-08-05T09:20:00Z'
      }
    ];

    const sampleParentageRecords: ParentageRecord[] = [
      {
        id: '1',
        offspringId: '2',
        offspringName: 'Luna (C002)',
        sireId: '4',
        sireName: 'King (C004)',
        damId: '1',
        damName: 'Bella (C001)',
        confidence: 99.8,
        method: 'DNA_ANALYSIS',
        verificationDate: '2025-08-12',
        status: 'VERIFIED',
        exclusionProbability: 99.99
      },
      {
        id: '2',
        offspringId: '3',
        offspringName: 'Star (C003)',
        sireId: '4',
        sireName: 'King (C004)',
        confidence: 97.2,
        method: 'DNA_ANALYSIS',
        verificationDate: '2025-08-05',
        status: 'VERIFIED',
        exclusionProbability: 99.95
      }
    ];

    const sampleBreedingRecommendations: BreedingRecommendation[] = [
      {
        id: '1',
        maleId: '4',
        maleName: 'King (C004)',
        femaleId: '3',
        femaleName: 'Star (C003)',
        compatibilityScore: 94,
        geneticGain: 8.5,
        inbreedingRisk: 0.03,
        diseaseRisk: 15,
        expectedTraits: [
          { trait: 'Milk Production', expectedValue: 13.2, confidence: 88 },
          { trait: 'Fertility Index', expectedValue: 91, confidence: 85 }
        ],
        recommendation: 'HIGHLY_RECOMMENDED',
        reasoning: 'Excellent genetic compatibility with high expected genetic gain and minimal inbreeding risk'
      },
      {
        id: '2',
        maleId: '4',
        maleName: 'King (C004)',
        femaleId: '1',
        femaleName: 'Bella (C001)',
        compatibilityScore: 78,
        geneticGain: 5.2,
        inbreedingRisk: 0.08,
        diseaseRisk: 25,
        expectedTraits: [
          { trait: 'Growth Rate', expectedValue: 0.92, confidence: 82 },
          { trait: 'Longevity', expectedValue: 89, confidence: 79 }
        ],
        recommendation: 'RECOMMENDED',
        reasoning: 'Good genetic match with moderate genetic gain and acceptable inbreeding levels'
      }
    ];

    setAnimals(sampleAnimals);
    setProfiles(sampleProfiles);
    setParentageRecords(sampleParentageRecords);
    setBreedingRecommendations(sampleBreedingRecommendations);
    setIsLoading(false);
  }, []);

  const getAnalysisCompletionRate = (): number => {
    const completed = profiles.filter(p => p.status === 'COMPLETED').length;
    return profiles.length > 0 ? Math.round((completed / profiles.length) * 100) : 0;
  };

  const getAverageBreedingValue = (): number => {
    const withBV = profiles.filter(p => p.breedingValue);
    const totalBV = withBV.reduce((sum, p) => sum + (p.breedingValue || 0), 0);
    return withBV.length > 0 ? Math.round(totalBV / withBV.length) : 0;
  };

  const getAverageGeneticDiversity = (): number => {
    const totalDiversity = profiles.reduce((sum, p) => sum + p.geneticDiversity, 0);
    return profiles.length > 0 ? Math.round((totalDiversity / profiles.length) * 100) / 100 : 0;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'IN_PROGRESS': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'PENDING': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'FAILED': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'HIGHLY_RECOMMENDED': return 'bg-green-100 text-green-800';
      case 'RECOMMENDED': return 'bg-blue-100 text-blue-800';
      case 'ACCEPTABLE': return 'bg-yellow-100 text-yellow-800';
      case 'NOT_RECOMMENDED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getParentageStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'bg-green-100 text-green-800';
      case 'PROBABLE': return 'bg-blue-100 text-blue-800';
      case 'UNCERTAIN': return 'bg-yellow-100 text-yellow-800';
      case 'DISPUTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-lg p-6 text-white mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Advanced Genomics & DNA Analysis</h1>
            <p className="text-purple-100 mb-4">Comprehensive genetic profiling with parentage verification and breeding optimization</p>
            <div className="flex gap-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">DNA Sequencing</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Parentage Verification</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Disease Screening</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Breeding Values</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">Aug 16, 02:44 PM</div>
            <div className="text-purple-200">Genomics Lab: Operational</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Activity },
          { id: 'profiles', label: 'Genetic Profiles', icon: Dna },
          { id: 'parentage', label: 'Parentage & Pedigree', icon: GitBranch },
          { id: 'diseases', label: 'Disease Screening', icon: Shield },
          { id: 'breeding', label: 'Breeding Optimization', icon: Target },
          { id: 'analytics', label: 'Population Analytics', icon: BarChart3 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Genetic Profiles</p>
                  <p className="text-3xl font-bold text-purple-900">{profiles.length}</p>
                  <p className="text-purple-600 text-sm">Animals analyzed</p>
                </div>
                <Dna className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Analysis Success</p>
                  <p className="text-3xl font-bold text-green-900">{getAnalysisCompletionRate()}%</p>
                  <p className="text-green-600 text-sm">Completion rate</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Avg Breeding Value</p>
                  <p className="text-3xl font-bold text-blue-900">{getAverageBreedingValue()}</p>
                  <p className="text-blue-600 text-sm">Population index</p>
                </div>
                <Award className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Genetic Diversity</p>
                  <p className="text-3xl font-bold text-orange-900">{getAverageGeneticDiversity()}</p>
                  <p className="text-orange-600 text-sm">Population average</p>
                </div>
                <Network className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Genomics Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition-colors">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Plus className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">New Analysis</div>
                  <div className="text-sm text-gray-600">Submit DNA sample</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-400 transition-colors">
                <div className="bg-green-100 p-2 rounded-lg">
                  <GitBranch className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Verify Parentage</div>
                  <div className="text-sm text-gray-600">DNA confirmation</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Disease Screen</div>
                  <div className="text-sm text-gray-600">Genetic health check</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 transition-colors">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Target className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Breeding Match</div>
                  <div className="text-sm text-gray-600">Optimize pairings</div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Genomic Activity */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Recent Genomic Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Dna className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Full genome analysis completed for Luna (C002)</div>
                  <div className="text-sm text-gray-600">Aug 12, 02:15 PM • 14,850 markers analyzed • 95% quality score</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <GitBranch className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Parentage verified for Luna (C002)</div>
                  <div className="text-sm text-gray-600">Aug 12, 02:15 PM • Sire: King (C004), Dam: Bella (C001) • 99.8% confidence</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Award className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Breeding value calculated for Bella (C001)</div>
                  <div className="text-sm text-gray-600">Aug 10, 10:30 AM • Breeding value: 85 • Top 25% of population</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Parentage & Pedigree Tab */}
      {activeTab === 'parentage' && (
        <div className="space-y-6">
          {/* Parentage Verification Overview */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Parentage Verification Records</h3>
            <p className="text-sm text-gray-600 mb-4">DNA-based parentage verification with high confidence scoring</p>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offspring</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sire</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dam</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verification Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parentageRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.offspringName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.sireName || 'Unknown'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.damName || 'Unknown'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${record.confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{record.confidence}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.method.replace('_', ' ')}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getParentageStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.verificationDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-purple-600 hover:text-purple-900 mr-3">View</button>
                        <button className="text-green-600 hover:text-green-900">Report</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Disease Screening Tab */}
      {activeTab === 'diseases' && (
        <div className="space-y-6">
          {/* Disease Risk Overview */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Genetic Disease Risk Assessment</h3>
            <p className="text-sm text-gray-600 mb-6">Comprehensive screening for hereditary diseases and health conditions</p>
            
            <div className="space-y-6">
              {profiles.map((profile) => (
                <div key={profile.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium text-lg">{profile.animalName} ({profile.animalNumber})</h4>
                      <p className="text-sm text-gray-600">Analysis Date: {profile.analysisDate}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(profile.status)}`}>
                      {profile.status}
                    </span>
                  </div>
                  
                  {profile.diseaseRisks.length > 0 ? (
                    <div className="space-y-3">
                      {profile.diseaseRisks.map((risk) => (
                        <div key={risk.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium">{risk.diseaseName}</h5>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(risk.riskLevel)}`}>
                              {risk.riskLevel} RISK
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <div className="text-xs text-gray-500">Probability</div>
                              <div className="font-medium">{risk.probability}%</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Confidence</div>
                              <div className="font-medium">{risk.confidence}%</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Markers</div>
                              <div className="font-medium">{risk.markers.length}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Key Genes</div>
                              <div className="font-medium text-xs">{risk.markers.slice(0, 2).join(', ')}</div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{risk.description}</p>
                          <p className="text-sm text-blue-700 font-medium">Recommendations: {risk.recommendations}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-800 font-medium">No significant disease risks detected</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">Genetic screening shows low risk for common hereditary diseases</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Breeding Optimization Tab */}
      {activeTab === 'breeding' && (
        <div className="space-y-6">
          {/* Breeding Recommendations */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">AI-Powered Breeding Recommendations</h3>
            <p className="text-sm text-gray-600 mb-6">Optimized breeding pairs based on genetic compatibility and expected outcomes</p>
            
            <div className="space-y-4">
              {breedingRecommendations.map((rec) => (
                <div key={rec.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-medium text-lg">{rec.maleName} × {rec.femaleName}</h4>
                      <p className="text-sm text-gray-600">Genetic compatibility analysis</p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getRecommendationColor(rec.recommendation)}`}>
                      {rec.recommendation.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-xs text-blue-600 font-medium">Compatibility Score</div>
                      <div className="text-2xl font-bold text-blue-900">{rec.compatibilityScore}%</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-xs text-green-600 font-medium">Expected Genetic Gain</div>
                      <div className="text-2xl font-bold text-green-900">+{rec.geneticGain}%</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="text-xs text-yellow-600 font-medium">Inbreeding Risk</div>
                      <div className="text-2xl font-bold text-yellow-900">{(rec.inbreedingRisk * 100).toFixed(1)}%</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="text-xs text-red-600 font-medium">Disease Risk</div>
                      <div className="text-2xl font-bold text-red-900">{rec.diseaseRisk}%</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h5 className="font-medium mb-2">Expected Offspring Traits:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {rec.expectedTraits.map((trait, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">{trait.trait}</span>
                          <div className="text-right">
                            <div className="font-medium">{trait.expectedValue} {trait.trait.includes('Index') ? '' : trait.trait.includes('Production') ? 'L/day' : 'kg/day'}</div>
                            <div className="text-xs text-gray-500">{trait.confidence}% confidence</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h5 className="font-medium mb-1">Reasoning:</h5>
                    <p className="text-sm text-gray-700">{rec.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Population Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Population Genetics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Population Diversity</h3>
              <div className="text-3xl font-bold text-purple-600 mb-2">{getAverageGeneticDiversity()}</div>
              <div className="text-sm text-gray-600">Average diversity index</div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>High diversity (&gt;0.7)</span>
                  <span>67%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Moderate diversity (0.5-0.7)</span>
                  <span>33%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '33%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Inbreeding Levels</h3>
              <div className="text-3xl font-bold text-orange-600 mb-2">8.3%</div>
              <div className="text-sm text-gray-600">Average coefficient</div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Low inbreeding (&lt;5%)</span>
                  <span className="font-medium text-green-600">33%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Moderate (5-10%)</span>
                  <span className="font-medium text-yellow-600">50%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>High (&gt;10%)</span>
                  <span className="font-medium text-red-600">17%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Breeding Values</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">{getAverageBreedingValue()}</div>
              <div className="text-sm text-gray-600">Population average</div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Top performers (&gt;90)</span>
                  <span className="font-medium text-green-600">33%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Above average (80-90)</span>
                  <span className="font-medium text-blue-600">33%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Average (70-80)</span>
                  <span className="font-medium text-yellow-600">34%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Genetic Insights */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Population Genetic Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Top Genetic Contributors</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Star (C003)</div>
                      <div className="text-sm text-gray-600">Breeding value: 92</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">0.75</div>
                      <div className="text-xs text-gray-500">Diversity index</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">King (C004)</div>
                      <div className="text-sm text-gray-600">Breeding value: 88</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">0.71</div>
                      <div className="text-xs text-gray-500">Diversity index</div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Genetic Recommendations</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900">Optimize Breeding Pairs</div>
                      <div className="text-sm text-blue-700">Focus on high genetic gain combinations with low inbreeding risk</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <Network className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-900">Maintain Diversity</div>
                      <div className="text-sm text-green-700">Continue genetic diversity preservation programs</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedGenomicsPage;

