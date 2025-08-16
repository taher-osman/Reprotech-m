import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  FileText, 
  Database, 
  Link,
  Activity,
  Users,
  BarChart3,
  Download,
  RefreshCw,
  Play,
  Pause,
  X
} from 'lucide-react';

interface ImportProgress {
  id: string;
  status: 'parsing' | 'processing' | 'completed' | 'error';
  current: number;
  total: number;
  message: string;
  processedAnimals: number;
  totalSNPs: number;
  errors: string[];
  summary: any;
  duration: number;
  percentage: number;
}

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  status: 'pending' | 'active' | 'completed' | 'error';
  details?: string;
}

const SNPImportWizard: React.FC<{ isOpen: boolean; onClose: () => void; onComplete: () => void }> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<ImportProgress | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const uploadIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const processSteps: ProcessStep[] = [
    {
      id: 'file_validation',
      title: 'File Validation',
      description: 'Validating file format and structure',
      icon: FileText,
      status: 'pending'
    },
    {
      id: 'data_parsing',
      title: 'Data Parsing',
      description: 'Parsing SNP data and extracting samples',
      icon: Activity,
      status: 'pending'
    },
    {
      id: 'beadchip_mapping',
      title: 'BeadChip Mapping',
      description: 'Connecting samples to animals via BeadChip IDs',
      icon: Link,
      status: 'pending'
    },
    {
      id: 'quality_analysis',
      title: 'Quality Analysis',
      description: 'Analyzing SNP quality and calculating metrics',
      icon: BarChart3,
      status: 'pending'
    },
    {
      id: 'database_storage',
      title: 'Database Storage',
      description: 'Storing SNP data and updating indexes',
      icon: Database,
      status: 'pending'
    },
    {
      id: 'completion',
      title: 'Import Complete',
      description: 'Finalizing import and updating dashboard',
      icon: CheckCircle,
      status: 'pending'
    }
  ];

  const [steps, setSteps] = useState<ProcessStep[]>(processSteps);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal closes
      setUploadFile(null);
      setIsUploading(false);
      setUploadProgress(null);
      setCurrentStep(0);
      setSteps(processSteps);
      if (uploadIntervalRef.current) {
        clearInterval(uploadIntervalRef.current);
        uploadIntervalRef.current = null;
      }
    }
  }, [isOpen]);

  const updateStepStatus = (stepId: string, status: ProcessStep['status'], details?: string) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId ? { ...step, status, details } : step
      )
    );
  };

  const getStepIndexFromProgress = (progress: ImportProgress): number => {
    if (progress.percentage <= 10) return 0; // File validation
    if (progress.percentage <= 30) return 1; // Data parsing
    if (progress.percentage <= 50) return 2; // BeadChip mapping
    if (progress.percentage <= 70) return 3; // Quality analysis
    if (progress.percentage <= 90) return 4; // Database storage
    return 5; // Completion
  };

  const pollUploadProgress = async (uploadId: string) => {
    try {
      const response = await fetch(`/api/snp-files/upload-progress/${uploadId}`);
      
      if (!response.ok) {
        throw new Error('Progress polling failed');
      }

      const progress: ImportProgress = await response.json();
      setUploadProgress(progress);

      // Update step statuses based on progress
      const stepIndex = getStepIndexFromProgress(progress);
      setCurrentStep(stepIndex);

      // Update step statuses
      steps.forEach((step, index) => {
        if (index < stepIndex) {
          updateStepStatus(step.id, 'completed');
        } else if (index === stepIndex) {
          updateStepStatus(step.id, 'active', progress.message);
        } else {
          updateStepStatus(step.id, 'pending');
        }
      });

      if (progress.status === 'completed') {
        // Mark all steps as completed
        setSteps(prevSteps => 
          prevSteps.map(step => ({ ...step, status: 'completed' as const }))
        );
        
        if (uploadIntervalRef.current) {
          clearInterval(uploadIntervalRef.current);
          uploadIntervalRef.current = null;
        }
        setIsUploading(false);
        
        // Auto-close after showing completion for 3 seconds
        setTimeout(() => {
          onComplete();
          onClose();
        }, 3000);
      } else if (progress.status === 'error') {
        // Mark current step as error
        updateStepStatus(steps[stepIndex]?.id, 'error', progress.message);
        
        if (uploadIntervalRef.current) {
          clearInterval(uploadIntervalRef.current);
          uploadIntervalRef.current = null;
        }
        setIsUploading(false);
      }
    } catch (error) {
      console.error('Progress polling error:', error);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      alert('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(null);
    setCurrentStep(0);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('uploadedBy', 'current-user');

      const response = await fetch('/api/snp-files/upload-bulk-snp', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload started:', result);

      // Start polling for progress
      if (uploadIntervalRef.current) clearInterval(uploadIntervalRef.current);
      uploadIntervalRef.current = setInterval(() => {
        pollUploadProgress(result.uploadId);
      }, 1000);

    } catch (error: any) {
      console.error('Upload error:', error);
      updateStepStatus('file_validation', 'error', `Upload failed: ${error.message}`);
      setIsUploading(false);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    setUploadFile(files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const downloadTemplate = () => {
    const csvContent = `Sample ID,SNP Name,Allele1 - Top,Allele2 - Top,GC Score,GT Score,Chr,Position
208717090008_R09C02,BovineHD0100000001,T,T,0.9287,0.9793,15,15453392
208717090008_R09C02,BovineHD0100000010,A,A,0.7538,0.9218,4,185469010
208717090008_R09C02,BovineHD0100000025,C,C,0.8918,0.8193,13,111236823
208717090008_R09C02,BovineHD0100000050,A,C,0.8959,0.9573,9,29163515`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'snp_import_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const getStatusIcon = (status: ProcessStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'active':
        return <Activity className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ProcessStep['status']) => {
    switch (status) {
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'active':
        return 'border-blue-500 bg-blue-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Upload className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">SNP Data Import Wizard</h2>
              <p className="text-gray-600">Import SNP genotype data with BeadChip mapping</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* File Upload Section */}
          <div className="lg:w-1/2 p-6 border-r">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload SNP Data</h3>
            
            {/* File Drop Zone */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : uploadFile
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
            >
              {uploadFile ? (
                <div className="space-y-2">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <p className="text-green-700 font-medium">{uploadFile.name}</p>
                  <p className="text-gray-600">{(uploadFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-gray-600">Drop your SNP CSV file here, or</p>
                    <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                      browse to select
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => handleFileSelect(e.target.files)}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Template Download */}
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={downloadTemplate}
                className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>Download Template</span>
              </button>
              
              {uploadFile && !isUploading && (
                <button
                  onClick={handleUpload}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Start Import</span>
                </button>
              )}
            </div>

            {/* Progress Bar */}
            {uploadProgress && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                  <span className="text-sm text-gray-600">{uploadProgress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.percentage}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">{uploadProgress.message}</p>
              </div>
            )}
          </div>

          {/* Process Steps Section */}
          <div className="lg:w-1/2 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Process</h3>
            
            <div className="space-y-4">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                
                return (
                  <div
                    key={step.id}
                    className={`border rounded-lg p-4 transition-all ${getStatusColor(step.status)}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(step.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <StepIcon className="h-4 w-4 text-gray-600" />
                          <h4 className="text-sm font-medium text-gray-900">{step.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        {step.details && (
                          <p className="text-xs text-gray-500 mt-2 bg-white bg-opacity-50 rounded px-2 py-1">
                            {step.details}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Statistics */}
            {uploadProgress && uploadProgress.status === 'completed' && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-900 mb-2">Import Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">Animals Processed:</span>
                    <span className="font-medium ml-2">{uploadProgress.processedAnimals}</span>
                  </div>
                  <div>
                    <span className="text-green-700">Total SNPs:</span>
                    <span className="font-medium ml-2">{uploadProgress.totalSNPs?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-green-700">Duration:</span>
                    <span className="font-medium ml-2">{Math.round(uploadProgress.duration / 1000)}s</span>
                  </div>
                  {uploadProgress.summary?.qualityStats?.connectionRate && (
                    <div>
                      <span className="text-green-700">Connection Rate:</span>
                      <span className="font-medium ml-2">{uploadProgress.summary.qualityStats.connectionRate.toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error Display */}
            {uploadProgress && uploadProgress.errors && uploadProgress.errors.length > 0 && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-red-900 mb-2">Warnings & Errors</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {uploadProgress.errors.slice(0, 10).map((error, index) => (
                    <p key={index} className="text-xs text-red-700">{error}</p>
                  ))}
                  {uploadProgress.errors.length > 10 && (
                    <p className="text-xs text-red-600 font-medium">
                      ... and {uploadProgress.errors.length - 10} more
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {uploadProgress ? (
                <span>
                  {uploadProgress.status === 'completed' 
                    ? '🎉 Import completed successfully!'
                    : uploadProgress.status === 'error'
                    ? '❌ Import failed with errors'
                    : '⏳ Import in progress...'
                  }
                </span>
              ) : (
                <span>Select a CSV file to begin the import process</span>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {uploadProgress?.status === 'completed' && (
                <button
                  onClick={() => {
                    onComplete();
                    onClose();
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  View Results
                </button>
              )}
              {!isUploading && (
                <button
                  onClick={onClose}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SNPImportWizard; 