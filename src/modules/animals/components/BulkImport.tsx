import React, { useState, useRef } from 'react';
import { X, Upload, Download, AlertTriangle, CheckCircle, FileText, Eye, RefreshCw } from 'lucide-react';
import { Button } from './components/ui/Button';

interface ImportRecord {
  row: number;
  data: Record<string, any>;
  errors: string[];
  warnings: string[];
  status: 'valid' | 'warning' | 'error';
}

interface BulkImportProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
}

export const BulkImport: React.FC<BulkImportProps> = ({ isOpen, onClose, onImport }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [parsedData, setParsedData] = useState<ImportRecord[]>([]);
  const [currentStep, setCurrentStep] = useState<'upload' | 'preview' | 'importing' | 'complete'>('upload');
  const [importResults, setImportResults] = useState<{ success: number; errors: number; warnings: number }>({
    success: 0,
    errors: 0,
    warnings: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Required fields for animal import
  const requiredFields = ['animalID', 'name', 'species', 'sex', 'status'];
  
  // Optional fields with validation
  const optionalFields = [
    'type', 'age', 'color', 'purpose', 'microchip', 'owner', 'fatherName', 'motherName',
    'dateOfBirth', 'weight', 'height', 'yard', 'customerName', 'customerID', 'customerRegion',
    'customerContact', 'customerEmail', 'customerCategory', 'notes'
  ];

  // Template data for CSV download
  const templateData = [
    {
      animalID: 'BV-2025-001',
      name: 'Bella Prima',
      species: 'BOVINE',
      sex: 'FEMALE',
      status: 'ACTIVE',
      type: 'Holstein',
      age: 4,
      color: 'Black & White',
      purpose: 'Breeding',
      microchip: 'MC001234567890',
      owner: 'Al-Majd Farm',
      fatherName: 'Thunder King',
      motherName: 'Star Queen',
      dateOfBirth: '2021-03-15',
      weight: 650,
      height: 140,
      yard: 'Yard A-1',
      customerName: 'Al-Majd Farm',
      customerID: 'CUS-001',
      customerRegion: 'Riyadh',
      customerContact: '+966123456789',
      customerEmail: 'contact@almajd.com',
      customerCategory: 'Premium',
      notes: 'High-quality breeding stock'
    },
    {
      animalID: 'EQ-2025-002',
      name: 'Thunder King',
      species: 'EQUINE',
      sex: 'MALE',
      status: 'ACTIVE',
      type: 'Arabian',
      age: 6,
      color: 'Chestnut',
      purpose: 'Breeding',
      microchip: 'MC001234567891',
      owner: 'Royal Stables',
      fatherName: 'Desert Storm',
      motherName: 'Golden Mare',
      dateOfBirth: '2019-05-20',
      weight: 500,
      height: 160,
      yard: 'Yard B-3',
      customerName: 'Royal Stables',
      customerID: 'CUS-002',
      customerRegion: 'Dubai',
      customerContact: '+971123456789',
      customerEmail: 'info@royalstables.ae',
      customerCategory: 'Premium',
      notes: 'Champion bloodline'
    }
  ];

  const downloadTemplate = () => {
    const headers = [
      'animalID', 'name', 'species', 'sex', 'status', 'type', 'age', 'color', 'purpose',
      'microchip', 'owner', 'fatherName', 'motherName', 'dateOfBirth', 'weight', 'height',
      'yard', 'customerName', 'customerID', 'customerRegion', 'customerContact',
      'customerEmail', 'customerCategory', 'notes'
    ];

    const csvContent = [
      headers.join(','),
      ...templateData.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row];
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'animal_import_template.csv';
    link.click();
  };

  const validateRecord = (record: Record<string, any>, rowNumber: number): ImportRecord => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    requiredFields.forEach(field => {
      if (!record[field] || record[field].toString().trim() === '') {
        errors.push(`${field} is required`);
      }
    });

    // Validate specific fields
    if (record.species && !['BOVINE', 'EQUINE', 'CAMEL', 'OVINE', 'CAPRINE', 'SWINE'].includes(record.species)) {
      errors.push('Species must be one of: BOVINE, EQUINE, CAMEL, OVINE, CAPRINE, SWINE');
    }

    if (record.sex && !['MALE', 'FEMALE'].includes(record.sex)) {
      errors.push('Sex must be either MALE or FEMALE');
    }

    if (record.status && !['ACTIVE', 'INACTIVE', 'DECEASED', 'SOLD', 'TRANSFERRED'].includes(record.status)) {
      errors.push('Status must be one of: ACTIVE, INACTIVE, DECEASED, SOLD, TRANSFERRED');
    }

    if (record.age && (isNaN(record.age) || record.age < 0 || record.age > 50)) {
      errors.push('Age must be a number between 0 and 50');
    }

    if (record.weight && (isNaN(record.weight) || record.weight < 0 || record.weight > 5000)) {
      errors.push('Weight must be a number between 0 and 5000 kg');
    }

    if (record.customerEmail && !/\S+@\S+\.\S+/.test(record.customerEmail)) {
      errors.push('Invalid email format');
    }

    if (record.microchip && record.microchip.length < 10) {
      warnings.push('Microchip should be at least 10 characters');
    }

    if (!record.customerName && !record.owner) {
      warnings.push('Either customer name or owner should be specified');
    }

    const status = errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'valid';

    return {
      row: rowNumber,
      data: record,
      errors,
      warnings,
      status
    };
  };

  const parseCSV = (text: string): Record<string, any>[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const record: Record<string, any> = {};
      
      headers.forEach((header, index) => {
        record[header] = values[index] || '';
      });

      data.push(record);
    }

    return data;
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setCurrentStep('upload');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      handleFileSelect(file);
    }
  };

  const processFile = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setImportProgress(0);

    try {
      const text = await selectedFile.text();
      const rawData = parseCSV(text);
      
      setImportProgress(30);

      // Validate each record
      const validatedData = rawData.map((record, index) => 
        validateRecord(record, index + 2) // +2 because of header row and 0-indexing
      );

      setImportProgress(70);
      setParsedData(validatedData);
      setCurrentStep('preview');
      setImportProgress(100);

    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please check the format and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const executeImport = async () => {
    setCurrentStep('importing');
    setIsProcessing(true);
    setImportProgress(0);

    // Filter out records with errors
    const validRecords = parsedData.filter(record => record.status !== 'error');
    const totalRecords = validRecords.length;
    let processedRecords = 0;

    try {
      // Simulate import process with progress
      for (const record of validRecords) {
        // Transform the data to match Animal interface
        const animalData = {
          id: `animal_${Date.now()}_${processedRecords}`,
          animalID: record.data.animalID,
          name: record.data.name,
          species: record.data.species,
          sex: record.data.sex,
          status: record.data.status,
          type: record.data.type,
          age: parseInt(record.data.age) || 0,
          color: record.data.color,
          purpose: record.data.purpose,
          microchip: record.data.microchip,
          owner: record.data.owner,
          fatherName: record.data.fatherName,
          motherName: record.data.motherName,
          dateOfBirth: record.data.dateOfBirth,
          weight: parseFloat(record.data.weight) || 0,
          height: parseFloat(record.data.height) || 0,
          yard: record.data.yard,
          notes: record.data.notes,
          createdAt: new Date().toISOString(),
          customer: {
            name: record.data.customerName || '',
            customerID: record.data.customerID || '',
            region: record.data.customerRegion || '',
            contactNumber: record.data.customerContact || '',
            email: record.data.customerEmail || '',
            category: record.data.customerCategory || 'Standard'
          }
        };

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        processedRecords++;
        setImportProgress((processedRecords / totalRecords) * 100);
      }

      // Calculate results
      const results = {
        success: parsedData.filter(r => r.status === 'valid').length,
        warnings: parsedData.filter(r => r.status === 'warning').length,
        errors: parsedData.filter(r => r.status === 'error').length
      };

      setImportResults(results);
      
      // Call the onImport callback with valid data
      const importData = validRecords.map(record => ({
        id: `animal_${Date.now()}_${Math.random()}`,
        animalID: record.data.animalID,
        name: record.data.name,
        species: record.data.species,
        sex: record.data.sex,
        status: record.data.status,
        type: record.data.type,
        age: parseInt(record.data.age) || 0,
        color: record.data.color,
        purpose: record.data.purpose,
        microchip: record.data.microchip,
        owner: record.data.owner,
        yard: record.data.yard,
        createdAt: new Date().toISOString(),
        customer: {
          name: record.data.customerName || '',
          customerID: record.data.customerID || '',
          region: record.data.customerRegion || '',
          contactNumber: record.data.customerContact || '',
          email: record.data.customerEmail || '',
          category: record.data.customerCategory || 'Standard'
        }
      }));

      onImport(importData);
      setCurrentStep('complete');

    } catch (error) {
      console.error('Error during import:', error);
      alert('Error during import. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetImport = () => {
    setSelectedFile(null);
    setParsedData([]);
    setCurrentStep('upload');
    setImportProgress(0);
    setImportResults({ success: 0, errors: 0, warnings: 0 });
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Bulk Import Animals</h2>
              <p className="text-green-100">Import multiple animals from CSV file</p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-white hover:bg-green-700"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-4">
            {[
              { id: 'upload', label: 'Upload File', icon: Upload },
              { id: 'preview', label: 'Preview Data', icon: Eye },
              { id: 'importing', label: 'Importing', icon: RefreshCw },
              { id: 'complete', label: 'Complete', icon: CheckCircle }
            ].map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = ['upload', 'preview', 'importing', 'complete'].indexOf(currentStep) > index;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isActive ? 'bg-green-600 text-white' : 
                    isCompleted ? 'bg-green-100 text-green-600' : 
                    'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    isActive ? 'text-green-600' : 
                    isCompleted ? 'text-gray-900' : 
                    'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                  {index < 3 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh] p-6">
          {/* Upload Step */}
          {currentStep === 'upload' && (
            <div className="space-y-6">
              {/* Template Download */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-blue-700">Need a template?</h3>
                    <p className="text-xs text-blue-600">Download our CSV template with sample data</p>
                  </div>
                  <Button
                    onClick={downloadTemplate}
                    variant="outline"
                    size="sm"
                    className="border-blue-200 text-blue-700 hover:bg-blue-100"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </div>

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-green-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload CSV File
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop your CSV file here, or click to browse
                </p>
                
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
                  <div className="mt-4 p-3 bg-gray-50 rounded border">
                    <div className="flex items-center justify-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-700">{selectedFile.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Requirements */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">File Requirements</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• CSV format only</li>
                  <li>• First row must contain column headers</li>
                  <li>• Required fields: animalID, name, species, sex, status</li>
                  <li>• Maximum file size: 10 MB</li>
                  <li>• Maximum 1000 records per import</li>
                </ul>
              </div>
            </div>
          )}

          {/* Preview Step */}
          {currentStep === 'preview' && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">
                      {parsedData.filter(r => r.status === 'valid').length}
                    </p>
                    <p className="text-sm text-gray-600">Valid Records</p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-center">
                    <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-600">
                      {parsedData.filter(r => r.status === 'warning').length}
                    </p>
                    <p className="text-sm text-gray-600">Warnings</p>
                  </div>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-center">
                    <X className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">
                      {parsedData.filter(r => r.status === 'error').length}
                    </p>
                    <p className="text-sm text-gray-600">Errors</p>
                  </div>
                </div>
              </div>

              {/* Data Preview */}
              <div className="border rounded-lg">
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900">Data Preview</h3>
                  <p className="text-sm text-gray-600">
                    Showing {Math.min(parsedData.length, 10)} of {parsedData.length} records
                  </p>
                </div>
                
                <div className="overflow-x-auto max-h-96">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Row</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Animal ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Species</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Issues</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {parsedData.slice(0, 10).map((record, index) => (
                        <tr key={index} className={record.status === 'error' ? 'bg-red-50' : record.status === 'warning' ? 'bg-yellow-50' : ''}>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {record.status === 'valid' && <CheckCircle className="h-4 w-4 text-green-600" />}
                            {record.status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                            {record.status === 'error' && <X className="h-4 w-4 text-red-600" />}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900">{record.row}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{record.data.animalID}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{record.data.name}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{record.data.species}</td>
                          <td className="px-4 py-2 text-sm">
                            {record.errors.concat(record.warnings).slice(0, 2).map((issue, i) => (
                              <div key={i} className={`text-xs ${record.errors.includes(issue) ? 'text-red-600' : 'text-yellow-600'}`}>
                                {issue}
                              </div>
                            ))}
                            {record.errors.concat(record.warnings).length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{record.errors.concat(record.warnings).length - 2} more
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Importing Step */}
          {currentStep === 'importing' && (
            <div className="space-y-6">
              <div className="text-center">
                <RefreshCw className="h-16 w-16 text-green-600 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Importing Animals</h3>
                <p className="text-gray-600">Please wait while we process your data...</p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${importProgress}%` }}
                />
              </div>
              
              <p className="text-center text-sm text-gray-600">
                {importProgress.toFixed(0)}% Complete
              </p>
            </div>
          )}

          {/* Complete Step */}
          {currentStep === 'complete' && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Import Complete!</h3>
                <p className="text-gray-600">Your animals have been successfully imported.</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">{importResults.success}</p>
                  <p className="text-sm text-gray-600">Successfully Imported</p>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-yellow-600">{importResults.warnings}</p>
                  <p className="text-sm text-gray-600">Imported with Warnings</p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-600">{importResults.errors}</p>
                  <p className="text-sm text-gray-600">Failed to Import</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {isProcessing && (
              <span className="text-green-600">Processing...</span>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {currentStep === 'upload' && (
              <>
                <Button onClick={onClose} variant="outline">
                  Cancel
                </Button>
                <Button
                  onClick={processFile}
                  disabled={!selectedFile || isProcessing}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isProcessing ? 'Processing...' : 'Process File'}
                </Button>
              </>
            )}
            
            {currentStep === 'preview' && (
              <>
                <Button onClick={resetImport} variant="outline">
                  Start Over
                </Button>
                <Button
                  onClick={executeImport}
                  disabled={parsedData.filter(r => r.status !== 'error').length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Import {parsedData.filter(r => r.status !== 'error').length} Animals
                </Button>
              </>
            )}
            
            {currentStep === 'complete' && (
              <Button onClick={onClose} className="bg-green-600 hover:bg-green-700 text-white">
                Close
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 