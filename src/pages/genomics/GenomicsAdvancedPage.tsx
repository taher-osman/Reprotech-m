import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

interface GenomicAnalysis {
  id: string;
  animalId: string;
  animalName: string;
  breed: string;
  species: string;
  analysisType: 'SNP Array' | 'Whole Genome' | 'Exome' | 'Targeted Panel' | 'RNA-Seq' | 'Methylation';
  sampleType: 'Blood' | 'Hair' | 'Tissue' | 'Semen' | 'Saliva';
  submissionDate: string;
  completionDate?: string;
  status: 'Submitted' | 'Processing' | 'Completed' | 'Failed' | 'Pending Review';
  priority: 'Standard' | 'High' | 'Urgent';
  genomicData: GenomicMetrics;
  predictions: AIPredicton[];
  parentage: ParentageInfo;
  breedingValues: BreedingValue[];
  healthRisks: HealthRisk[];
  cost: number;
  dataSize: string;
  qualityScore: number;
}

interface GenomicMetrics {
  totalSNPs: number;
  callRate: number;
  heterozygosity: number;
  inbreedingCoefficient: number;
  genomicRelatedness: number;
  chromosomalAnomalies: number;
  cnvCount: number;
  structuralVariants: number;
}

interface AIPredicton {
  trait: string;
  predictedValue: number;
  confidence: number;
  accuracy: string;
  geneticMerit: number;
}

interface ParentageInfo {
  sireId?: string;
  sireName?: string;
  sireConfidence?: number;
  damId?: string;
  damName?: string;
  damConfidence?: number;
  parentageVerified: boolean;
}

interface BreedingValue {
  trait: string;
  ebv: number; // Estimated Breeding Value
  accuracy: number;
  percentile: number;
  geneticTrend: 'Improving' | 'Stable' | 'Declining';
}

interface HealthRisk {
  condition: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
  geneticBasis: string;
  recommendations: string;
  carrierStatus?: string;
}

const GenomicsAdvancedPage: React.FC = () => {
  const [genomicAnalyses, setGenomicAnalyses] = useState<GenomicAnalysis[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [analysisTypeFilter, setAnalysisTypeFilter] = useState('All Types');
  const [speciesFilter, setSpeciesFilter] = useState('All Species');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockData: GenomicAnalysis[] = [
      {
        id: 'GEN-001',
        animalId: 'HOL-1247',
        animalName: 'Bella',
        breed: 'Holstein',
        species: 'Bovine',
        analysisType: 'SNP Array',
        sampleType: 'Blood',
        submissionDate: '2024-08-10',
        completionDate: '2024-08-15',
        status: 'Completed',
        priority: 'High',
        genomicData: {
          totalSNPs: 777962,
          callRate: 99.2,
          heterozygosity: 0.342,
          inbreedingCoefficient: 0.045,
          genomicRelatedness: 0.125,
          chromosomalAnomalies: 0,
          cnvCount: 23,
          structuralVariants: 8
        },
        predictions: [
          { trait: 'Milk Yield', predictedValue: 12450, confidence: 92, accuracy: 'High', geneticMerit: 88 },
          { trait: 'Protein %', predictedValue: 3.42, confidence: 89, accuracy: 'High', geneticMerit: 85 },
          { trait: 'Fat %', predictedValue: 4.15, confidence: 87, accuracy: 'High', geneticMerit: 82 },
          { trait: 'Somatic Cell Score', predictedValue: 2.8, confidence: 84, accuracy: 'Moderate', geneticMerit: 78 }
        ],
        parentage: {
          sireId: 'BULL-456',
          sireName: 'Champion Thunder',
          sireConfidence: 99.8,
          damId: 'HOL-0892',
          damName: 'Elite Performer',
          damConfidence: 99.5,
          parentageVerified: true
        },
        breedingValues: [
          { trait: 'Milk Yield', ebv: 1250, accuracy: 0.92, percentile: 88, geneticTrend: 'Improving' },
          { trait: 'Fertility', ebv: 2.1, accuracy: 0.78, percentile: 75, geneticTrend: 'Stable' },
          { trait: 'Longevity', ebv: 3.2, accuracy: 0.85, percentile: 82, geneticTrend: 'Improving' },
          { trait: 'Disease Resistance', ebv: 1.8, accuracy: 0.71, percentile: 68, geneticTrend: 'Improving' }
        ],
        healthRisks: [
          { condition: 'BLAD (Bovine Leukocyte Adhesion Deficiency)', riskLevel: 'Low', geneticBasis: 'Recessive mutation in ITGB2 gene', recommendations: 'Carrier testing recommended for breeding decisions', carrierStatus: 'Non-carrier' },
          { condition: 'Brachyspina Syndrome', riskLevel: 'Low', geneticBasis: 'Recessive mutation in FANCI gene', recommendations: 'Monitor breeding selections', carrierStatus: 'Non-carrier' }
        ],
        cost: 450.00,
        dataSize: '2.3 GB',
        qualityScore: 94.2
      },
      {
        id: 'GEN-002',
        animalId: 'JER-0892',
        animalName: 'Thunder',
        breed: 'Jersey',
        species: 'Bovine',
        analysisType: 'Whole Genome',
        sampleType: 'Hair',
        submissionDate: '2024-08-12',
        completionDate: '2024-08-18',
        status: 'Completed',
        priority: 'Standard',
        genomicData: {
          totalSNPs: 28456789,
          callRate: 98.8,
          heterozygosity: 0.338,
          inbreedingCoefficient: 0.062,
          genomicRelatedness: 0.089,
          chromosomalAnomalies: 1,
          cnvCount: 45,
          structuralVariants: 23
        },
        predictions: [
          { trait: 'Milk Yield', predictedValue: 8950, confidence: 94, accuracy: 'High', geneticMerit: 91 },
          { trait: 'Protein %', predictedValue: 3.78, confidence: 92, accuracy: 'High', geneticMerit: 93 },
          { trait: 'Fat %', predictedValue: 4.85, confidence: 90, accuracy: 'High', geneticMerit: 89 },
          { trait: 'Calving Ease', predictedValue: 95.2, confidence: 86, accuracy: 'Moderate', geneticMerit: 85 }
        ],
        parentage: {
          sireId: 'BULL-789',
          sireName: 'Elite Performer',
          sireConfidence: 99.9,
          damId: 'JER-0456',
          damName: 'Golden Standard',
          damConfidence: 99.7,
          parentageVerified: true
        },
        breedingValues: [
          { trait: 'Milk Yield', ebv: 890, accuracy: 0.94, percentile: 91, geneticTrend: 'Improving' },
          { trait: 'Protein %', ebv: 0.28, accuracy: 0.92, percentile: 93, geneticTrend: 'Improving' },
          { trait: 'Fat %', ebv: 0.35, accuracy: 0.90, percentile: 89, geneticTrend: 'Stable' },
          { trait: 'Feed Efficiency', ebv: 1.95, accuracy: 0.82, percentile: 87, geneticTrend: 'Improving' }
        ],
        healthRisks: [
          { condition: 'A2 Beta-Casein', riskLevel: 'Low', geneticBasis: 'A1/A2 variant in CSN2 gene', recommendations: 'A2/A2 genotype favorable for milk quality', carrierStatus: 'A2/A2' },
          { condition: 'Kappa-Casein', riskLevel: 'Low', geneticBasis: 'Variants in CSN3 gene', recommendations: 'BB genotype associated with better cheese-making properties', carrierStatus: 'AB' }
        ],
        cost: 1250.00,
        dataSize: '45.7 GB',
        qualityScore: 96.8
      },
      {
        id: 'GEN-003',
        animalId: 'ANG-1156',
        animalName: 'Princess',
        breed: 'Angus',
        species: 'Bovine',
        analysisType: 'Targeted Panel',
        sampleType: 'Tissue',
        submissionDate: '2024-08-14',
        status: 'Processing',
        priority: 'Urgent',
        genomicData: {
          totalSNPs: 50000,
          callRate: 0,
          heterozygosity: 0,
          inbreedingCoefficient: 0,
          genomicRelatedness: 0,
          chromosomalAnomalies: 0,
          cnvCount: 0,
          structuralVariants: 0
        },
        predictions: [],
        parentage: {
          parentageVerified: false
        },
        breedingValues: [],
        healthRisks: [],
        cost: 285.00,
        dataSize: 'Processing...',
        qualityScore: 0
      },
      {
        id: 'GEN-004',
        animalId: 'HOL-2134',
        animalName: 'Daisy',
        breed: 'Holstein',
        species: 'Bovine',
        analysisType: 'RNA-Seq',
        sampleType: 'Tissue',
        submissionDate: '2024-08-16',
        completionDate: '2024-08-20',
        status: 'Completed',
        priority: 'High',
        genomicData: {
          totalSNPs: 0,
          callRate: 98.5,
          heterozygosity: 0,
          inbreedingCoefficient: 0,
          genomicRelatedness: 0,
          chromosomalAnomalies: 0,
          cnvCount: 0,
          structuralVariants: 0
        },
        predictions: [
          { trait: 'Immune Response', predictedValue: 85.2, confidence: 88, accuracy: 'High', geneticMerit: 86 },
          { trait: 'Stress Tolerance', predictedValue: 78.5, confidence: 82, accuracy: 'Moderate', geneticMerit: 79 },
          { trait: 'Metabolic Efficiency', predictedValue: 92.1, confidence: 91, accuracy: 'High', geneticMerit: 90 }
        ],
        parentage: {
          parentageVerified: false
        },
        breedingValues: [
          { trait: 'Disease Resistance', ebv: 2.1, accuracy: 0.88, percentile: 86, geneticTrend: 'Improving' },
          { trait: 'Heat Tolerance', ebv: 1.8, accuracy: 0.82, percentile: 79, geneticTrend: 'Stable' }
        ],
        healthRisks: [
          { condition: 'Mastitis Susceptibility', riskLevel: 'Moderate', geneticBasis: 'Multiple immune-related genes', recommendations: 'Enhanced udder health monitoring recommended' }
        ],
        cost: 850.00,
        dataSize: '12.4 GB',
        qualityScore: 91.5
      }
    ];

    setTimeout(() => {
      setGenomicAnalyses(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredAnalyses = genomicAnalyses.filter(analysis => {
    const matchesSearch = analysis.animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         analysis.animalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         analysis.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || analysis.status === statusFilter;
    const matchesType = analysisTypeFilter === 'All Types' || analysis.analysisType === analysisTypeFilter;
    const matchesSpecies = speciesFilter === 'All Species' || analysis.species === speciesFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesSpecies;
  });

  const stats = {
    totalAnalyses: genomicAnalyses.length,
    completed: genomicAnalyses.filter(a => a.status === 'Completed').length,
    processing: genomicAnalyses.filter(a => a.status === 'Processing').length,
    avgQuality: genomicAnalyses.filter(a => a.qualityScore > 0).reduce((sum, a) => sum + a.qualityScore, 0) / genomicAnalyses.filter(a => a.qualityScore > 0).length || 0,
    totalSNPs: genomicAnalyses.reduce((sum, a) => sum + a.genomicData.totalSNPs, 0),
    totalCost: genomicAnalyses.reduce((sum, a) => sum + a.cost, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Submitted': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Pending Review': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Standard': return 'bg-gray-100 text-gray-800';
      case 'High': return 'bg-yellow-100 text-yellow-800';
      case 'Urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Very High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Genomics & AI Intelligence</h1>
          <p className="text-gray-600 mt-2">Comprehensive genetic analysis with AI-powered predictions</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            📊 Genomic Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            🧬 New Analysis
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Analyses</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalAnalyses}</p>
            </div>
            <div className="text-blue-500 text-2xl">🧬</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="text-green-500 text-2xl">✅</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
            </div>
            <div className="text-blue-500 text-2xl">⚙️</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Quality</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgQuality.toFixed(1)}%</p>
            </div>
            <div className="text-purple-500 text-2xl">💎</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total SNPs</p>
              <p className="text-2xl font-bold text-indigo-600">{(stats.totalSNPs / 1000000).toFixed(1)}M</p>
            </div>
            <div className="text-indigo-500 text-2xl">🔬</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-emerald-600">${stats.totalCost.toFixed(0)}</p>
            </div>
            <div className="text-emerald-500 text-2xl">💰</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search animals, breeds..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Status</option>
              <option>Submitted</option>
              <option>Processing</option>
              <option>Completed</option>
              <option>Failed</option>
              <option>Pending Review</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Type</label>
            <select
              value={analysisTypeFilter}
              onChange={(e) => setAnalysisTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Types</option>
              <option>SNP Array</option>
              <option>Whole Genome</option>
              <option>Exome</option>
              <option>Targeted Panel</option>
              <option>RNA-Seq</option>
              <option>Methylation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Species</label>
            <select
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Species</option>
              <option>Bovine</option>
              <option>Equine</option>
              <option>Ovine</option>
              <option>Caprine</option>
              <option>Camellidea</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
              📊 Export Data
            </button>
          </div>
        </div>
      </Card>

      {/* Genomic Analyses */}
      <div className="space-y-6">
        {filteredAnalyses.map((analysis) => (
          <Card key={analysis.id} className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {analysis.animalId} - {analysis.animalName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {analysis.breed} • {analysis.species} • Analysis ID: {analysis.id}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(analysis.status)}>
                    {analysis.status}
                  </Badge>
                  <Badge className={getPriorityColor(analysis.priority)}>
                    {analysis.priority}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                  📋 View Report
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                  📊 Analysis
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Analysis Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Analysis Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{analysis.analysisType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sample:</span>
                    <span className="font-medium">{analysis.sampleType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submitted:</span>
                    <span className="font-medium">{new Date(analysis.submissionDate).toLocaleDateString()}</span>
                  </div>
                  {analysis.completionDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-medium">{new Date(analysis.completionDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data Size:</span>
                    <span className="font-medium">{analysis.dataSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quality Score:</span>
                    <span className="font-medium text-green-600">{analysis.qualityScore}%</span>
                  </div>
                </div>
              </div>

              {/* Genomic Metrics */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Genomic Metrics</h4>
                <div className="space-y-2 text-sm">
                  {analysis.genomicData.totalSNPs > 0 && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total SNPs:</span>
                        <span className="font-medium">{analysis.genomicData.totalSNPs.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Call Rate:</span>
                        <span className="font-medium">{analysis.genomicData.callRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Heterozygosity:</span>
                        <span className="font-medium">{analysis.genomicData.heterozygosity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Inbreeding:</span>
                        <span className="font-medium">{analysis.genomicData.inbreedingCoefficient}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">CNVs:</span>
                        <span className="font-medium">{analysis.genomicData.cnvCount}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost:</span>
                    <span className="font-medium text-green-600">${analysis.cost}</span>
                  </div>
                </div>
              </div>

              {/* AI Predictions */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">AI Predictions</h4>
                <div className="space-y-2 text-sm">
                  {analysis.predictions.length > 0 ? (
                    analysis.predictions.slice(0, 4).map((pred, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-600">{pred.trait}:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{pred.predictedValue}</span>
                          <Badge className="bg-blue-100 text-blue-800 text-xs">
                            {pred.confidence}%
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">Processing predictions...</p>
                  )}
                </div>
              </div>

              {/* Parentage & Health */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Parentage & Health</h4>
                <div className="space-y-2 text-sm">
                  {analysis.parentage.parentageVerified ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sire:</span>
                        <span className="font-medium">{analysis.parentage.sireName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dam:</span>
                        <span className="font-medium">{analysis.parentage.damName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Confidence:</span>
                        <span className="font-medium text-green-600">{analysis.parentage.sireConfidence}%</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 italic">Parentage analysis pending</p>
                  )}
                  
                  {analysis.healthRisks.length > 0 && (
                    <div className="mt-3">
                      <span className="text-gray-600 font-medium">Health Risks:</span>
                      {analysis.healthRisks.slice(0, 2).map((risk, index) => (
                        <div key={index} className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-600">{risk.condition}:</span>
                          <Badge className={getRiskColor(risk.riskLevel)}>
                            {risk.riskLevel}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Breeding Values */}
            {analysis.breedingValues.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Estimated Breeding Values (EBVs)</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {analysis.breedingValues.map((bv, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-900">{bv.trait}</span>
                        <Badge className={bv.geneticTrend === 'Improving' ? 'bg-green-100 text-green-800' : 
                                        bv.geneticTrend === 'Stable' ? 'bg-yellow-100 text-yellow-800' : 
                                        'bg-red-100 text-red-800'}>
                          {bv.geneticTrend}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-600">EBV:</span>
                          <span className="font-medium">{bv.ebv}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Accuracy:</span>
                          <span className="font-medium">{(bv.accuracy * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Percentile:</span>
                          <span className="font-medium text-blue-600">{bv.percentile}th</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredAnalyses.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 text-4xl mb-4">🧬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No genomic analyses found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or submit a new genomic analysis.</p>
        </Card>
      )}
    </div>
  );
};

export default GenomicsAdvancedPage;

