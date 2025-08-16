import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Dna, Upload, Database, BarChart3, Users, FileText, Search, Filter, 
  Play, Activity, Download, Trash2, Eye, Plus, RefreshCw, TrendingUp,
  Zap, GitBranch, Target, Brain, Settings, X, CheckCircle, AlertCircle,
  Clock, HardDrive, Server, MemoryStick, Cpu, Hash, MapPin, Gauge
} from 'lucide-react';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import SNPImportWizard from '../../../components/advanced/SNPImportWizard';

interface SNPIndex {
  id: string;
  animalId: string;
  animalName: string;
  animalID: string;
  customerName: string;
  beadChipId: string;
  snpCount: number;
  fileSize: number;
  fileSizeMB: string;
  status: string;
  uploadDate: string;
  lastAccessed: string;
  sex: string;
  farm: string;
}

interface SNPStatistics {
  totalAnimals: number;
  totalSNPs: number;
  averageSNPsPerAnimal: number;
  totalFileSize: string;
  qualityDistribution: { [key: string]: number };
}

interface UploadProgress {
  id: string;
  status: 'parsing' | 'processing' | 'completed' | 'error';
  current: number;
  total: number;
  message: string;
  processedAnimals: number;
  totalSNPs: number;
  errors: string[];
  duration: number;
  percentage: number;
}

interface SNPMatrix {
  animalIds: string[];
  snpNames: string[];
  matrix: Array<Array<string>>;
  metadata: {
    totalSNPs: number;
    totalAnimals: number;
    missingDataRate: number;
    quality: 'HIGH' | 'MEDIUM' | 'LOW';
  };
}

// Mock data
const mockSNPIndexes: SNPIndex[] = [
  {
    id: '1',
    animalId: 'A001',
    animalName: 'Luna',
    animalID: 'CML-2025-001',
    customerName: 'Al Ain Camel Farm',
    beadChipId: 'BCP-001-A001',
    snpCount: 54609,
    fileSize: 2048576,
    fileSizeMB: '2.0 MB',
    status: 'ACTIVE',
    uploadDate: '2025-06-28T10:00:00Z',
    lastAccessed: '2025-06-29T14:30:00Z',
    sex: 'FEMALE',
    farm: 'Al Ain Camel Farm'
  },
  {
    id: '2',
    animalId: 'A002',
    animalName: 'Thunder',
    animalID: 'CML-2025-002',
    customerName: 'Al Ain Camel Farm',
    beadChipId: 'BCP-002-A002',
    snpCount: 54609,
    fileSize: 2097152,
    fileSizeMB: '2.0 MB',
    status: 'PROCESSING',
    uploadDate: '2025-06-28T11:00:00Z',
    lastAccessed: '2025-06-29T15:00:00Z',
    sex: 'MALE',
    farm: 'Al Ain Camel Farm'
  },
  {
    id: '3',
    animalId: 'A003',
    animalName: 'Bella',
    animalID: 'BOV-2025-001',
    customerName: 'Sunrise Dairy Farm',
    beadChipId: 'BCP-003-A003',
    snpCount: 777962,
    fileSize: 3145728,
    fileSizeMB: '3.0 MB',
    status: 'ACTIVE',
    uploadDate: '2025-06-27T09:00:00Z',
    lastAccessed: '2025-06-29T13:45:00Z',
    sex: 'FEMALE',
    farm: 'Sunrise Dairy Farm'
  }
];

const mockStatistics: SNPStatistics = {
  totalAnimals: 1247,
  totalSNPs: 68495632,
  averageSNPsPerAnimal: 54927,
  totalFileSize: '2.8 GB',
  qualityDistribution: {
    'ACTIVE': 1098,
    'PROCESSING': 85,
    'ERROR': 64
  }
};

const SNPAnalysisPage: React.FC = () => {
  const [snpIndexes, setSNPIndexes] = useState<SNPIndex[]>([]);
  const [statistics, setStatistics] = useState<SNPStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Upload states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const uploadIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Analysis states
  const [selectedAnimals, setSelectedAnimals] = useState<Set<string>>(new Set());
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isImportWizardOpen, setIsImportWizardOpen] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [analysisType, setAnalysisType] = useState<'matrix' | 'kinship' | 'pca' | 'filter'>('matrix');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'animals' | 'analysis'>('overview');

  const itemsPerPage = 20;

  // Mock data fetch function
  const fetchSNPData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Filter mock data based on status
      const filteredData = statusFilter 
        ? mockSNPIndexes.filter(item => item.status === statusFilter)
        : mockSNPIndexes;

      setSNPIndexes(filteredData);
      setStatistics(mockStatistics);
    } catch (error: any) {
      console.error('Error fetching SNP data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchSNPData();
  }, [fetchSNPData]);

  // Mock upload handler
  const handleUpload = async () => {
    if (!uploadFile) {
      alert('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress({
      id: 'mock-upload-' + Date.now(),
      status: 'parsing',
      current: 0,
      total: 100,
      message: 'Parsing SNP file...',
      processedAnimals: 0,
      totalSNPs: 0,
      errors: [],
      duration: 0,
      percentage: 0
    });

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploadProgress(prev => prev ? {
          ...prev,
          status: 'completed',
          current: 100,
          percentage: 100,
          message: 'Upload completed successfully!'
        } : null);
        setIsUploading(false);
        
        // Add mock SNP data
        const newSNP: SNPIndex = {
          id: 'new-' + Date.now(),
          animalId: 'A' + Math.random().toString().substr(2, 3),
          animalName: uploadFile.name.split('.')[0],
          animalID: 'NEW-' + Math.random().toString().substr(2, 3),
          customerName: 'Mock Customer',
          beadChipId: 'BCP-NEW-' + Math.random().toString().substr(2, 3),
          snpCount: Math.floor(Math.random() * 100000) + 50000,
          fileSize: uploadFile.size,
          fileSizeMB: (uploadFile.size / 1024 / 1024).toFixed(1) + ' MB',
          status: 'ACTIVE',
          uploadDate: new Date().toISOString(),
          lastAccessed: new Date().toISOString(),
          sex: Math.random() > 0.5 ? 'FEMALE' : 'MALE',
          farm: 'Mock Farm'
        };
        
        setSNPIndexes(prev => [newSNP, ...prev]);
        
        setTimeout(() => {
          setIsUploadModalOpen(false);
          setUploadFile(null);
          setUploadProgress(null);
        }, 2000);
      } else {
        setUploadProgress(prev => prev ? {
          ...prev,
          current: progress,
          percentage: progress,
          message: progress < 30 ? 'Parsing SNP file...' : 
                   progress < 70 ? 'Processing genotype data...' : 
                   'Finalizing upload...'
        } : null);
      }
    }, 200);
  };

  // Mock analysis handler
  const handleRunAnalysis = async () => {
    if (selectedAnimals.size === 0) {
      alert('Please select animals for analysis');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResults(null);

    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockResults = {
      analysisType,
      animalCount: selectedAnimals.size,
      results: analysisType === 'kinship' ? {
        relationships: [
          { animal1: 'Luna', animal2: 'Thunder', coefficient: 0.125, relationship: 'Half-siblings' },
          { animal1: 'Luna', animal2: 'Bella', coefficient: 0.0625, relationship: 'Cousins' }
        ]
      } : analysisType === 'pca' ? {
        components: [
          { pc1: 0.234, pc2: 0.156, pc3: 0.089, animal: 'Luna' },
          { pc1: 0.198, pc2: 0.234, pc3: 0.123, animal: 'Thunder' }
        ]
      } : {
        message: `${analysisType} analysis completed successfully`
      },
      completedAt: new Date().toISOString()
    };

    setAnalysisResults(mockResults);
    setIsAnalyzing(false);
  };

  // File handlers
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    setUploadFile(files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDeleteSNP = async (animalId: string) => {
    if (!window.confirm('Are you sure you want to delete this animal\'s SNP data?')) {
      return;
    }

    // Remove from mock data
    setSNPIndexes(prev => prev.filter(item => item.animalId !== animalId));
  };

  // UI helpers
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'PROCESSING': return <Activity className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'ERROR': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'HIGH': return 'text-green-600 bg-green-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'LOW': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const downloadTemplate = () => {
    const csvContent = `SNP Name,Sample ID,Allele1 - Top,Allele2 - Top,GC Score,Chr,Position
seq-mt1,208717090012_R01C02,G,G,0.5231,1,12345678
seq-mt1004,208717090012_R01C02,A,A,0.7104,2,23456789
BovineHD1000001,CHIP_001_SAMPLE,A,T,0.892,3,34567890
ARS-BFGL-NGS-1001,CHIP_002_SAMPLE,G,C,0.945,4,45678901`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'snp_bulk_upload_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Filter snp indexes
  const filteredSNPs = snpIndexes.filter(snp => {
    const matchesSearch = !searchTerm || 
      snp.animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snp.animalID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snp.beadChipId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || snp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading && !statistics) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Dna className="h-8 w-8 text-purple-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SNP Analysis Platform</h1>
            <p className="text-gray-600">Advanced genomic analysis with file-based storage</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsImportWizardOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          >
            <Upload className="h-4 w-4" />
            <span>Smart Import</span>
          </button>
          <button
            onClick={() => setIsAnalysisModalOpen(true)}
            disabled={selectedAnimals.size === 0}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-700 disabled:opacity-50"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analyze ({selectedAnimals.size})</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="mt-2 text-red-700 hover:text-red-900 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: Gauge },
            { id: 'animals', name: 'Animal SNP Files', icon: Database },
            { id: 'analysis', name: 'Analysis Results', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Statistics Cards */}
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Animals</p>
                <p className="text-3xl font-bold text-gray-900">{statistics.totalAnimals.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total SNPs</p>
                <p className="text-3xl font-bold text-gray-900">{statistics.totalSNPs.toLocaleString()}</p>
              </div>
              <Hash className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg SNPs/Animal</p>
                <p className="text-3xl font-bold text-gray-900">{statistics.averageSNPsPerAnimal.toLocaleString()}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-3xl font-bold text-gray-900">{statistics.totalFileSize}</p>
              </div>
              <HardDrive className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          {/* Quality Distribution */}
          <div className="bg-white p-6 rounded-lg shadow border md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">File Status Distribution</h3>
            <div className="space-y-3">
              {Object.entries(statistics.qualityDistribution).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(status)}
                    <span className="text-sm font-medium text-gray-700">{status}</span>
                  </div>
                  <span className="text-sm text-gray-600">{count} files</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow border md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsImportWizardOpen(true)}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <Upload className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Smart Import</span>
              </button>
              <button
                onClick={downloadTemplate}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <Download className="h-5 w-5 text-green-600" />
                <span className="text-sm">Template</span>
              </button>
              <button
                onClick={fetchSNPData}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <RefreshCw className="h-5 w-5 text-purple-600" />
                <span className="text-sm">Refresh</span>
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <TrendingUp className="h-5 w-5 text-orange-600" />
                <span className="text-sm">Analysis</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animals Tab */}
      {activeTab === 'animals' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search animals, IDs, or BeadChip IDs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="PROCESSING">Processing</option>
                <option value="ERROR">Error</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedAnimals.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-800 font-medium">
                  {selectedAnimals.size} animals selected
                </span>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsAnalysisModalOpen(true)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Analyze Selected
                  </button>
                  <button
                    onClick={() => setSelectedAnimals(new Set())}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SNP Files Table */}
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedAnimals.size === filteredSNPs.length && filteredSNPs.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAnimals(new Set(filteredSNPs.map(snp => snp.animalId)));
                          } else {
                            setSelectedAnimals(new Set());
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Animal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      BeadChip ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SNPs
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Uploaded
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSNPs.map((snp) => (
                    <tr key={snp.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedAnimals.has(snp.animalId)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedAnimals);
                            if (e.target.checked) {
                              newSelected.add(snp.animalId);
                            } else {
                              newSelected.delete(snp.animalId);
                            }
                            setSelectedAnimals(newSelected);
                          }}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{snp.animalName}</div>
                          <div className="text-sm text-gray-500">{snp.animalID}</div>
                          <div className="text-xs text-gray-400">{snp.customerName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-900">{snp.beadChipId}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{snp.snpCount?.toLocaleString() || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{snp.fileSizeMB} MB</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(snp.status)}
                          <span className="text-sm text-gray-900">{snp.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {new Date(snp.uploadDate).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {/* View details */}}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSNP(snp.animalId)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          {analysisResults ? (
            <div className="bg-white rounded-lg shadow border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(analysisResults, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow border p-6 text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analysis Results</h3>
              <p className="text-gray-600 mb-4">Select animals and run an analysis to see results here.</p>
              <button
                onClick={() => setActiveTab('animals')}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Select Animals
              </button>
            </div>
          )}
        </div>
      )}

      {/* Smart Import Wizard */}
      <SNPImportWizard
        isOpen={isImportWizardOpen}
        onClose={() => setIsImportWizardOpen(false)}
        onComplete={() => {
          fetchSNPData();
          setActiveTab('overview');
        }}
      />

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Bulk SNP Upload</h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                disabled={isUploading}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {!isUploading ? (
              <div className="space-y-4">
                {/* File Upload Area */}
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragOver
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
                >
                  <input
                    type="file"
                    accept=".csv,.txt,.vcf,.hapmap"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Drop SNP file here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports: CSV, VCF, HapMap formats (up to 500MB)
                  </p>
                </div>

                {uploadFile && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-purple-500" />
                      <span className="text-sm font-medium text-gray-900">{uploadFile.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(uploadFile.size / (1024 * 1024)).toFixed(1)} MB)
                      </span>
                    </div>
                    <button
                      onClick={() => setUploadFile(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Template Download */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Need a template?</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Download our template to see the expected format for bulk SNP uploads.
                  </p>
                  <button
                    onClick={downloadTemplate}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Download Template CSV
                  </button>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!uploadFile}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Start Upload
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Upload Progress</h3>
                
                {uploadProgress && (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      {uploadProgress.status === 'completed' ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : uploadProgress.status === 'error' ? (
                        <AlertCircle className="h-6 w-6 text-red-500" />
                      ) : (
                        <Activity className="h-6 w-6 text-blue-500 animate-spin" />
                      )}
                      <span className="text-lg font-medium text-gray-900">
                        {uploadProgress.message}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress.percentage}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Progress:</span>
                        <span className="ml-2 font-medium">{uploadProgress.percentage}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <span className="ml-2 font-medium">{uploadProgress.duration}s</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Animals:</span>
                        <span className="ml-2 font-medium">{uploadProgress.processedAnimals}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">SNPs:</span>
                        <span className="ml-2 font-medium">{uploadProgress.totalSNPs.toLocaleString()}</span>
                      </div>
                    </div>

                    {uploadProgress.errors.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <h4 className="text-red-800 font-medium mb-2">Errors:</h4>
                        <ul className="text-red-700 text-sm space-y-1">
                          {uploadProgress.errors.slice(0, 5).map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                          {uploadProgress.errors.length > 5 && (
                            <li className="text-red-600">... and {uploadProgress.errors.length - 5} more</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analysis Modal */}
      {isAnalysisModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Genomic Analysis</h2>
              <button
                onClick={() => setIsAnalysisModalOpen(false)}
                disabled={isAnalyzing}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Analysis Type
                </label>
                <select
                  value={analysisType}
                  onChange={(e) => setAnalysisType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="matrix">Load SNP Matrix</option>
                  <option value="kinship">Kinship Analysis</option>
                  <option value="pca">PCA Analysis</option>
                  <option value="filter">SNP Quality Filtering</option>
                </select>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  <strong>Selected:</strong> {selectedAnimals.size} animals
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {analysisType === 'matrix' && 'Load SNP data matrix for selected animals'}
                  {analysisType === 'kinship' && 'Calculate genetic relatedness between animals'}
                  {analysisType === 'pca' && 'Principal component analysis for population structure'}
                  {analysisType === 'filter' && 'Filter SNPs based on quality criteria'}
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsAnalysisModalOpen(false)}
                  disabled={isAnalyzing}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing || selectedAnimals.size === 0}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Activity className="h-4 w-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Run Analysis</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SNPAnalysisPage; 