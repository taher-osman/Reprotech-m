import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Download, 
  RefreshCw, 
  Database, 
  FileText, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ExternalLink,
  Server,
  HardDrive,
  Settings,
  Zap
} from 'lucide-react';
import apiService from '../../../services/api';

interface DataSource {
  id: string;
  name: string;
  type: 'FILE_UPLOAD' | 'DATABASE' | 'API' | 'FTP' | 'CLOUD';
  status: 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'SYNCING';
  lastSync: string;
  recordCount: number;
  config: any;
  description?: string;
}

interface ImportJob {
  id: string;
  source: string;
  targetModule: string;
  fileName?: string;
  recordsProcessed: number;
  totalRecords: number;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  startTime: string;
  endTime?: string;
  errors?: string[];
  warnings?: string[];
}

interface FileUpload {
  id: string;
  fileName: string;
  fileSize: number;
  uploadDate: string;
  status: 'UPLOADED' | 'PROCESSING' | 'MAPPED' | 'IMPORTED' | 'ERROR';
  targetModule?: string;
  recordCount?: number;
  mapping?: any;
}

const DataIntegrationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sources');
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [importJobs, setImportJobs] = useState<ImportJob[]>([]);
  const [fileUploads, setFileUploads] = useState<FileUpload[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API calls
      const mockSources: DataSource[] = [
        {
          id: '1',
          name: 'Laboratory LIMS System',
          type: 'DATABASE',
          status: 'CONNECTED',
          lastSync: '2025-01-15T10:30:00Z',
          recordCount: 1247,
          config: { host: 'lims.lab.local', database: 'LabResults' },
          description: 'Integration with laboratory information system'
        },
        {
          id: '2',
          name: 'Breeding Records FTP',
          type: 'FTP',
          status: 'SYNCING',
          lastSync: '2025-01-15T09:15:00Z',
          recordCount: 856,
          config: { host: 'ftp.breeding.local', path: '/export' },
          description: 'Daily breeding record exports'
        },
        {
          id: '3',
          name: 'Genomic Cloud API',
          type: 'API',
          status: 'CONNECTED',
          lastSync: '2025-01-15T08:00:00Z',
          recordCount: 2341,
          config: { endpoint: 'https://api.genomics.com/v1' },
          description: 'Cloud-based genomic analysis platform'
        },
        {
          id: '4',
          name: 'Legacy Database',
          type: 'DATABASE',
          status: 'ERROR',
          lastSync: '2025-01-14T16:20:00Z',
          recordCount: 0,
          config: { host: 'old.db.server', database: 'legacy_data' },
          description: 'Historical animal records'
        }
      ];

      const mockJobs: ImportJob[] = [
        {
          id: '1',
          source: 'Laboratory LIMS System',
          targetModule: 'lab-results',
          recordsProcessed: 245,
          totalRecords: 245,
          status: 'COMPLETED',
          startTime: '2025-01-15T10:30:00Z',
          endTime: '2025-01-15T10:35:00Z'
        },
        {
          id: '2',
          source: 'Breeding Records FTP',
          targetModule: 'breeding',
          recordsProcessed: 156,
          totalRecords: 200,
          status: 'RUNNING',
          startTime: '2025-01-15T11:00:00Z',
          warnings: ['3 records missing required fields']
        },
        {
          id: '3',
          source: 'File Upload',
          targetModule: 'animals',
          fileName: 'animal_import_2025.csv',
          recordsProcessed: 0,
          totalRecords: 500,
          status: 'QUEUED',
          startTime: '2025-01-15T11:15:00Z'
        }
      ];

      const mockFiles: FileUpload[] = [
        {
          id: '1',
          fileName: 'breeding_records_jan2025.xlsx',
          fileSize: 2048576,
          uploadDate: '2025-01-15T09:30:00Z',
          status: 'IMPORTED',
          targetModule: 'breeding',
          recordCount: 189
        },
        {
          id: '2',
          fileName: 'ultrasound_results.csv',
          fileSize: 1024000,
          uploadDate: '2025-01-15T10:00:00Z',
          status: 'MAPPED',
          targetModule: 'ultrasound',
          recordCount: 67
        },
        {
          id: '3',
          fileName: 'animal_data_bulk.csv',
          fileSize: 5242880,
          uploadDate: '2025-01-15T10:45:00Z',
          status: 'PROCESSING',
          targetModule: 'animals'
        }
      ];

      await new Promise(resolve => setTimeout(resolve, 500));
      setDataSources(mockSources);
      setImportJobs(mockJobs);
      setFileUploads(mockFiles);
    } catch (error) {
      console.error('Error fetching integration data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, targetModule: string) => {
    try {
      // TODO: Replace with actual upload
      await apiService.uploadDataFile(file, targetModule);
      
      const newUpload: FileUpload = {
        id: Date.now().toString(),
        fileName: file.name,
        fileSize: file.size,
        uploadDate: new Date().toISOString(),
        status: 'UPLOADED',
        targetModule
      };

      setFileUploads(prev => [...prev, newUpload]);
      setShowUploadModal(false);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSyncSource = async (sourceId: string) => {
    try {
      // TODO: Replace with actual sync
      console.log(`Syncing source ${sourceId}`);
      
      setDataSources(prev => prev.map(source => 
        source.id === sourceId 
          ? { ...source, status: 'SYNCING' as const }
          : source
      ));

      // Simulate sync completion
      setTimeout(() => {
        setDataSources(prev => prev.map(source => 
          source.id === sourceId 
            ? { ...source, status: 'CONNECTED' as const, lastSync: new Date().toISOString() }
            : source
        ));
      }, 3000);
    } catch (error) {
      console.error('Error syncing source:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONNECTED':
      case 'COMPLETED':
      case 'IMPORTED':
        return 'bg-green-100 text-green-800';
      case 'SYNCING':
      case 'RUNNING':
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'QUEUED':
      case 'UPLOADED':
      case 'MAPPED':
        return 'bg-yellow-100 text-yellow-800';
      case 'ERROR':
      case 'FAILED':
      case 'DISCONNECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONNECTED':
      case 'COMPLETED':
      case 'IMPORTED':
        return <CheckCircle className="h-4 w-4" />;
      case 'SYNCING':
      case 'RUNNING':
      case 'PROCESSING':
        return <Clock className="h-4 w-4" />;
      case 'ERROR':
      case 'FAILED':
      case 'DISCONNECTED':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'DATABASE': return <Database className="h-5 w-5" />;
      case 'API': return <Server className="h-5 w-5" />;
      case 'FTP': return <HardDrive className="h-5 w-5" />;
      case 'CLOUD': return <ExternalLink className="h-5 w-5" />;
      case 'FILE_UPLOAD': return <FileText className="h-5 w-5" />;
      default: return <Database className="h-5 w-5" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderDataSources = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Data Sources</h3>
        <button
          onClick={() => setShowSourceModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>Add Source</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {dataSources.map((source) => (
          <div key={source.id} className="bg-white rounded-lg shadow border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {getSourceIcon(source.type)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{source.name}</h4>
                  <p className="text-sm text-gray-500">{source.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(source.status)}
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(source.status)}`}>
                  {source.status}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Records</span>
                <span className="font-medium">{source.recordCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Sync</span>
                <span className="font-medium text-sm">
                  {new Date(source.lastSync).toLocaleDateString()}
                </span>
              </div>
            </div>

            {source.description && (
              <p className="text-sm text-gray-600 mt-4">{source.description}</p>
            )}

            <div className="flex space-x-2 mt-4">
              <button 
                onClick={() => handleSyncSource(source.id)}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                disabled={source.status === 'SYNCING'}
              >
                <RefreshCw className={`h-4 w-4 ${source.status === 'SYNCING' ? 'animate-spin' : ''}`} />
                <span>{source.status === 'SYNCING' ? 'Syncing...' : 'Sync Now'}</span>
              </button>
              <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderImportJobs = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Import Jobs</h3>
      
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Started
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {importJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{job.source}</div>
                      {job.fileName && (
                        <div className="text-sm text-gray-500">{job.fileName}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {job.targetModule}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(job.recordsProcessed / job.totalRecords) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {job.recordsProcessed} / {job.totalRecords}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(job.startTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {job.status === 'COMPLETED' && (
                      <button className="text-blue-600 hover:text-blue-900">
                        View Report
                      </button>
                    )}
                    {job.status === 'RUNNING' && (
                      <button className="text-red-600 hover:text-red-900">
                        Cancel
                      </button>
                    )}
                    {job.warnings && job.warnings.length > 0 && (
                      <button className="text-yellow-600 hover:text-yellow-900">
                        View Warnings
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFileUploads = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">File Uploads</h3>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Upload className="h-4 w-4" />
          <span>Upload File</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Records
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
              {fileUploads.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{file.fileName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatFileSize(file.fileSize)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {file.targetModule || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {file.recordCount ? file.recordCount.toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(file.status)}`}>
                      {file.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(file.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {file.status === 'UPLOADED' && (
                      <button className="text-blue-600 hover:text-blue-900">
                        Map Fields
                      </button>
                    )}
                    {file.status === 'MAPPED' && (
                      <button className="text-green-600 hover:text-green-900">
                        Import
                      </button>
                    )}
                    {file.status === 'IMPORTED' && (
                      <button className="text-blue-600 hover:text-blue-900">
                        View Report
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            🔗 Data Integration
          </h1>
          <p className="text-gray-600 mt-1">
            Connect external systems and import data from various sources
          </p>
        </div>
        <div className="flex space-x-2">
          <span className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            CONNECTED
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Data Sources</p>
              <p className="text-2xl font-bold text-gray-900">{dataSources.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Connected</p>
              <p className="text-2xl font-bold text-gray-900">
                {dataSources.filter(s => s.status === 'CONNECTED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">
                {importJobs.filter(j => j.status === 'RUNNING').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileText className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Files Uploaded</p>
              <p className="text-2xl font-bold text-gray-900">{fileUploads.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('sources')}
            className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sources'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Database className="h-4 w-4" />
            <span>Data Sources</span>
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'jobs'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Zap className="h-4 w-4" />
            <span>Import Jobs</span>
          </button>
          <button
            onClick={() => setActiveTab('uploads')}
            className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'uploads'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Upload className="h-4 w-4" />
            <span>File Uploads</span>
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : activeTab === 'sources' ? (
          renderDataSources()
        ) : activeTab === 'jobs' ? (
          renderImportJobs()
        ) : (
          renderFileUploads()
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Upload Data File</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Module</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select module...</option>
                  <option value="animals">Animals</option>
                  <option value="breeding">Breeding</option>
                  <option value="ultrasound">Ultrasound</option>
                  <option value="lab-results">Lab Results</option>
                </select>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Drag and drop your file here</p>
                <p className="text-sm text-gray-500 mb-4">Supports CSV, Excel, JSON formats</p>
                <input
                  type="file"
                  className="hidden"
                  id="file-upload-integration"
                  accept=".csv,.xlsx,.xls,.json"
                />
                <label 
                  htmlFor="file-upload-integration"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700"
                >
                  Select File
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataIntegrationPage; 