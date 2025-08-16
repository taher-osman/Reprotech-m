import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet,
  FileCode,
  Download,
  Upload,
  Search,
  Filter,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Trash2,
  Calendar,
  Building,
  DollarSign,
  Shield,
  Clock,
  RefreshCw,
  Send,
  Archive,
  Star,
  Flag,
  Info,
  ExternalLink
} from 'lucide-react';
import { 
  KSAPayrollRecord,
  WPSFile,
  WPSRecord,
  PayrollSettings
} from '../types/hrTypes';

interface BankExportProps {
  payrollRecords: KSAPayrollRecord[];
  onExport?: (wpsFile: WPSFile) => void;
  onUpload?: (fileId: string) => void;
}

const BankExport: React.FC<BankExportProps> = ({
  payrollRecords,
  onExport,
  onUpload
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'CSV' | 'XML'>('XML');
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [validationResults, setValidationResults] = useState<Map<string, boolean>>(new Map());
  const [generatedFile, setGeneratedFile] = useState<WPSFile | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Mock payroll settings
  const payrollSettings: PayrollSettings = {
    id: 'PS-001',
    gosi_percentage_employee: 9,
    gosi_percentage_employer: 11,
    eos_daily_rate_factor: 0.5,
    wage_protection_format: 'XML',
    company_name: 'Reprotech Veterinary Services',
    company_registration: 'CR-1234567890',
    sama_bank_code: 'SABB',
    default_currency: 'SAR',
    fiscal_year_start: '2025-01-01',
    overtime_rate_factor: 1.5,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  };

  useEffect(() => {
    // Validate all payroll records on load
    const results = new Map<string, boolean>();
    payrollRecords.forEach(record => {
      const isValid = validatePayrollRecord(record);
      results.set(record.id, isValid);
    });
    setValidationResults(results);
  }, [payrollRecords]);

  const validatePayrollRecord = (record: KSAPayrollRecord): boolean => {
    // Basic validation rules for WPS
    const hasBasicSalary = record.basicSalary > 0;
    const hasValidNetPay = record.netPay > 0;
    const hasNoValidationErrors = !record.validationErrors || record.validationErrors.length === 0;
    const isProcessed = record.status === 'processed' || record.status === 'paid';
    
    return hasBasicSalary && hasValidNetPay && hasNoValidationErrors && isProcessed;
  };

  const getFilteredRecords = () => {
    return payrollRecords.filter(record => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          record.employeeName.toLowerCase().includes(searchLower) ||
          record.employeeId.toLowerCase().includes(searchLower) ||
          record.department.toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  };

  const getValidRecords = () => {
    return getFilteredRecords().filter(record => validationResults.get(record.id) === true);
  };

  const getSelectedRecords = () => {
    return getFilteredRecords().filter(record => selectedEmployees.has(record.id));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const validRecords = getValidRecords();
      setSelectedEmployees(new Set(validRecords.map(r => r.id)));
    } else {
      setSelectedEmployees(new Set());
    }
  };

  const handleSelectEmployee = (recordId: string, checked: boolean) => {
    const newSelected = new Set(selectedEmployees);
    if (checked) {
      newSelected.add(recordId);
    } else {
      newSelected.delete(recordId);
    }
    setSelectedEmployees(newSelected);
  };

  const generateWPSRecords = (records: KSAPayrollRecord[]): WPSRecord[] => {
    return records.map(record => ({
      id: `WPS-${record.id}`,
      employeeId: record.employeeId,
      employeeName: record.employeeName,
      iqamaNumber: '1234567890', // Mock - should come from employee profile
      bankCode: payrollSettings.sama_bank_code,
      accountNumber: '1234567890123456', // Mock - should come from employee profile
      basicSalary: record.basicSalary,
      allowances: record.allowances.totalAllowances,
      deductions: record.deductions.totalDeductions,
      netPay: record.netPay,
      payPeriod: record.payPeriod,
      employeeType: 'Non-GCC', // Mock - should be determined from employee profile
      status: 'Validated',
      validationRules: {
        salaryRange: record.basicSalary >= 1000 && record.basicSalary <= 50000,
        accountValid: true, // Mock validation
        iqamaValid: true, // Mock validation
        contractActive: record.status === 'processed' || record.status === 'paid'
      }
    }));
  };

  const generateWPSFile = () => {
    const selectedRecords = getSelectedRecords();
    if (selectedRecords.length === 0) {
      alert('Please select at least one employee');
      return;
    }

    const wpsRecords = generateWPSRecords(selectedRecords);
    const totalAmount = wpsRecords.reduce((sum, record) => sum + record.netPay, 0);
    
    const wpsFile: WPSFile = {
      id: `WPS-${Date.now()}`,
      fileName: `WPS_${selectedRecords[0]?.payPeriod.replace(' ', '_')}_${Date.now()}.${selectedFormat.toLowerCase()}`,
      fileType: selectedFormat,
      payPeriod: selectedRecords[0]?.payPeriod || '',
      totalEmployees: wpsRecords.length,
      totalAmount,
      companyCode: payrollSettings.company_registration,
      samaReference: `SAMA-${Date.now()}`,
      status: 'Generated',
      validationResults: {
        validRecords: wpsRecords.filter(r => r.status === 'Validated').length,
        invalidRecords: wpsRecords.filter(r => r.status === 'Error').length,
        errors: []
      },
      fileSize: selectedFormat === 'XML' ? 25600 : 15360, // Mock file sizes
      createdAt: new Date().toISOString()
    };

    setGeneratedFile(wpsFile);
    if (onExport) {
      onExport(wpsFile);
    }
  };

  const handleDownload = () => {
    if (generatedFile) {
      // Mock download
      console.log('Downloading WPS file:', generatedFile.fileName);
    }
  };

  const handleUploadToSAMA = () => {
    if (generatedFile && onUpload) {
      onUpload(generatedFile.id);
    }
  };

  const getValidationStatusIcon = (recordId: string) => {
    const isValid = validationResults.get(recordId);
    if (isValid === true) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    } else if (isValid === false) {
      return <XCircle className="w-4 h-4 text-red-600" />;
    }
    return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
  };

  const validRecordsCount = getValidRecords().length;
  const selectedRecordsCount = getSelectedRecords().length;
  const totalRecordsCount = getFilteredRecords().length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Flag className="w-5 h-5 mr-2 text-green-600" />
              WPS Bank Export
            </h3>
            <p className="text-gray-600">Generate Wage Protection System files for SAMA compliance</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              🇸🇦 SAMA Compliant
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {payrollSettings.sama_bank_code} Bank
            </span>
          </div>
        </div>
      </div>

      {/* Export Configuration */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-gray-600" />
          Export Configuration
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">File Format</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value="CSV"
                  checked={selectedFormat === 'CSV'}
                  onChange={(e) => setSelectedFormat(e.target.value as 'CSV' | 'XML')}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
                <span className="text-sm text-gray-700">CSV (Local Banks)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value="XML"
                  checked={selectedFormat === 'XML'}
                  onChange={(e) => setSelectedFormat(e.target.value as 'CSV' | 'XML')}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <FileCode className="w-4 h-4 mr-2 text-blue-600" />
                <span className="text-sm text-gray-700">XML (SAMA Upload)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Information</label>
            <div className="space-y-1 text-sm text-gray-600">
              <div>Company: {payrollSettings.company_name}</div>
              <div>Registration: {payrollSettings.company_registration}</div>
              <div>Bank Code: {payrollSettings.sama_bank_code}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Summary</label>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Total Records:</span>
                <span className="font-medium">{totalRecordsCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Valid Records:</span>
                <span className="font-medium text-green-600">{validRecordsCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Selected:</span>
                <span className="font-medium text-blue-600">{selectedRecordsCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Selection */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="w-5 h-5 mr-2 text-gray-600" />
              Employee Selection
            </h4>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => handleSelectAll(selectedEmployees.size === 0)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                {selectedEmployees.size === 0 ? 'Select All Valid' : 'Clear Selection'}
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedEmployees.size > 0 && selectedEmployees.size === validRecordsCount}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Basic Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Pay
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validation
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getFilteredRecords().map((record) => {
                const isValid = validationResults.get(record.id) === true;
                const isSelected = selectedEmployees.has(record.id);
                
                return (
                  <tr 
                    key={record.id} 
                    className={`hover:bg-gray-50 ${!isValid ? 'bg-red-50' : ''} ${isSelected ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={isSelected}
                        disabled={!isValid}
                        onChange={(e) => handleSelectEmployee(record.id, e.target.checked)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                        <div className="text-sm text-gray-500">{record.employeeId}</div>
                        <div className="text-xs text-gray-400">{record.department}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      SAR {record.basicSalary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      SAR {record.netPay.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.status === 'paid' ? 'bg-green-100 text-green-800' :
                        record.status === 'processed' ? 'bg-blue-100 text-blue-800' :
                        record.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getValidationStatusIcon(record.id)}
                        {!isValid && (
                          <span className="text-xs text-red-600">Invalid</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">Generate WPS File</h4>
            <p className="text-gray-600">
              {selectedRecordsCount} employees selected for export
              {selectedRecordsCount > 0 && (
                <span className="ml-2 text-green-600 font-medium">
                  (Total: SAR {getSelectedRecords().reduce((sum, r) => sum + r.netPay, 0).toLocaleString()})
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              disabled={selectedRecordsCount === 0}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={generateWPSFile}
              disabled={selectedRecordsCount === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Generate {selectedFormat}</span>
            </button>
          </div>
        </div>

        {/* Generated File */}
        {generatedFile && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <span className="text-green-900 font-medium">WPS File Generated Successfully</span>
                  <div className="text-sm text-green-700">
                    {generatedFile.fileName} | {generatedFile.totalEmployees} employees | SAR {generatedFile.totalAmount.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                {selectedFormat === 'XML' && (
                  <button
                    onClick={handleUploadToSAMA}
                    className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center space-x-1"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload to SAMA</span>
                  </button>
                )}
                <button className="px-3 py-1.5 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 flex items-center space-x-1">
                  <Archive className="w-4 h-4" />
                  <span>Archive</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankExport; 