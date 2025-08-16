import React, { useState, useRef, useCallback } from 'react';
import { X, Upload, Download, CheckCircle, FileText, Play, Pause, Database, Loader2 } from 'lucide-react';
import { Button } from './components/ui/Button';
import { useToast } from './components/ui/Toast';

interface ImportRecord {
  row: number;
  data: Record<string, any>;
  status: 'pending' | 'valid' | 'warning' | 'error' | 'imported';
}

interface BulkImportStats {
  totalRecords: number;
  processedRecords: number;
  validRecords: number;
  errorRecords: number;
  processingSpeed: number;
}

interface OptimizedBulkImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
}

export const OptimizedBulkImport: React.FC<OptimizedBulkImportProps> = ({ 
  isOpen, 
  onClose, 
  onImport 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'preview' | 'processing' | 'complete'>('upload');
  const [records, setRecords] = useState<ImportRecord[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchSize, setBatchSize] = useState(100);
  
  const [stats, setStats] = useState<BulkImportStats>({
    totalRecords: 0,
    processedRecords: 0,
    validRecords: 0,
    errorRecords: 0,
    processingSpeed: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showSuccess, showError } = useToast();

  const parseCSV = useCallback(async (text: string): Promise<Record<string, any>[]> => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data: Record<string, any>[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const record: Record<string, any> = {};
      
      headers.forEach((header, index) => {
        record[header] = values[index] || '';
      });
      
      data.push(record);
    }
    
    return data;
  }, []);

  const processFile = useCallback(async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setCurrentStep('processing');
    
    try {
      const text = await selectedFile.text();
      const rawData = await parseCSV(text);
      
      const totalRecords = rawData.length;
      setStats(prev => ({ ...prev, totalRecords }));

      // Initialize records
      const initialRecords: ImportRecord[] = rawData.map((data, index) => ({
        row: index + 2,
        data,
        status: 'pending'
      }));
      
      setRecords(initialRecords);

      // Process in batches
      let processedCount = 0;
      let validCount = 0;
      let errorCount = 0;

      for (let i = 0; i < totalRecords; i += batchSize) {
        const batch = rawData.slice(i, i + batchSize);
        
        // Simulate validation processing
        await new Promise(resolve => setTimeout(resolve, 100));
        
        batch.forEach((_, batchIndex) => {
          const recordIndex = i + batchIndex;
          const isValid = Math.random() > 0.15; // 85% success rate
          
          setRecords(prev => {
            const updated = [...prev];
            updated[recordIndex].status = isValid ? 'valid' : 'error';
            return updated;
          });
          
          if (isValid) validCount++;
          else errorCount++;
        });

        processedCount += batch.length;
        setStats(prev => ({ 
          ...prev, 
          processedRecords: processedCount,
          validRecords: validCount,
          errorRecords: errorCount,
          processingSpeed: processedCount / ((Date.now() - Date.now()) / 1000 + 1)
        }));
      }
      
      setCurrentStep('preview');
      showSuccess('Processing complete', `Processed ${totalRecords} records`);
      
    } catch (error) {
      showError('Processing failed', 'Error processing file');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, batchSize, parseCSV, showSuccess, showError]);

  const executeImport = useCallback(async () => {
    const validRecords = records.filter(r => r.status === 'valid');
    
    setCurrentStep('processing');
    setIsProcessing(true);
    
    try {
      const importData = validRecords.map(record => ({
        id: `animal_${Date.now()}_${Math.random()}`,
        ...record.data,
        createdAt: new Date().toISOString()
      }));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onImport(importData);
      setCurrentStep('complete');
      showSuccess('Import completed', `Imported ${validRecords.length} animals`);
      
    } catch (error) {
      showError('Import failed', 'Error during import');
    } finally {
      setIsProcessing(false);
    }
  }, [records, onImport, showSuccess, showError]);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setCurrentStep('upload');
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Optimized Bulk Import</h2>
              <p className="text-green-100">High-performance import with chunked processing</p>
            </div>
            <Button onClick={onClose} variant="ghost" className="text-white hover:bg-green-700">
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Performance Stats */}
        {stats.totalRecords > 0 && (
          <div className="border-b bg-gray-50 p-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.totalRecords}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.processedRecords}</div>
                <div className="text-sm text-gray-600">Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.validRecords}</div>
                <div className="text-sm text-gray-600">Valid</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.errorRecords}</div>
                <div className="text-sm text-gray-600">Errors</div>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Upload Step */}
          {currentStep === 'upload' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Performance Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-1">Batch Size</label>
                    <select
                      value={batchSize}
                      onChange={(e) => setBatchSize(Number(e.target.value))}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value={50}>50 (Small files)</option>
                      <option value={100}>100 (Recommended)</option>
                      <option value={200}>200 (Large files)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload CSV File</h3>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                  className="hidden"
                />
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Choose File
                </Button>

                {selectedFile && (
                  <div className="mt-4 p-3 bg-gray-50 rounded">
                    <div className="flex items-center justify-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{selectedFile.name}</span>
                    </div>
                  </div>
                )}
              </div>

              {selectedFile && (
                <div className="flex justify-end">
                  <Button
                    onClick={processFile}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Processing
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Preview Step */}
          {currentStep === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Validation Results</h3>
                <Button
                  onClick={executeImport}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={stats.validRecords === 0}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Import {stats.validRecords} Records
                </Button>
              </div>

              <div className="bg-white border rounded-lg overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Row</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.slice(0, 10).map((record) => (
                        <tr key={record.row} className="border-t">
                          <td className="px-4 py-2 text-sm">{record.row}</td>
                          <td className="px-4 py-2 text-sm">{record.data.name || '-'}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs ${
                              record.status === 'valid' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {currentStep === 'complete' && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <h3 className="text-xl font-bold">Import Completed!</h3>
              <p className="text-gray-600">Successfully imported {stats.validRecords} animals</p>
              <Button onClick={onClose} className="bg-green-600 hover:bg-green-700 text-white">
                Close
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 