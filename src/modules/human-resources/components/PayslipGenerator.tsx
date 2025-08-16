import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Eye, 
  Mail, 
  Languages, 
  QrCode,
  Calendar,
  User,
  Building,
  DollarSign,
  Shield,
  Calculator,
  CheckCircle,
  Settings,
  Copy,
  Share,
  Archive
} from 'lucide-react';
import { 
  KSAPayrollRecord,
  PayslipTemplate,
  PayslipRecord
} from '../types/hrTypes';

interface PayslipGeneratorProps {
  payrollRecord: KSAPayrollRecord;
  onGenerate?: (payslipUrl: string) => void;
  onDownload?: (payslipId: string) => void;
  onEmail?: (payslipId: string, email: string) => void;
}

const PayslipGenerator: React.FC<PayslipGeneratorProps> = ({
  payrollRecord,
  onGenerate,
  onDownload,
  onEmail
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'Arabic' | 'English' | 'Bilingual'>('Bilingual');
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [showPreview, setShowPreview] = useState(false);
  const [generatedPayslip, setGeneratedPayslip] = useState<PayslipRecord | null>(null);

  // Mock templates
  const templates: PayslipTemplate[] = [
    {
      id: 'default',
      name: 'Default Template',
      language: 'Bilingual',
      headerColor: '#1f2937',
      includeQRCode: true,
      includeEOSAccrual: true,
      includeGOSIBreakdown: true,
      customFields: [],
      isDefault: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 'arabic',
      name: 'Arabic Only',
      language: 'Arabic',
      headerColor: '#059669',
      includeQRCode: true,
      includeEOSAccrual: true,
      includeGOSIBreakdown: true,
      customFields: [],
      isDefault: false,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 'english',
      name: 'English Only',
      language: 'English',
      headerColor: '#2563eb',
      includeQRCode: true,
      includeEOSAccrual: true,
      includeGOSIBreakdown: true,
      customFields: [],
      isDefault: false,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    }
  ];

  const generatePayslip = () => {
    const newPayslip: PayslipRecord = {
      id: `PS-${Date.now()}`,
      payrollId: payrollRecord.id,
      employeeId: payrollRecord.employeeId,
      templateId: selectedTemplate,
      language: selectedLanguage,
      generatedDate: new Date().toISOString(),
      payslipUrl: `/payslips/${payrollRecord.id}-${selectedLanguage.toLowerCase()}.pdf`,
      downloadCount: 0,
      emailSent: false,
      printedCount: 0,
      status: 'Generated',
      fileSize: 245760, // ~240KB
      qrCodeData: `PAYSLIP:${payrollRecord.id}:${payrollRecord.employeeId}:${payrollRecord.netPay}`,
      createdAt: new Date().toISOString()
    };

    setGeneratedPayslip(newPayslip);
    if (onGenerate) {
      onGenerate(newPayslip.payslipUrl);
    }
  };

  const handleDownload = () => {
    if (generatedPayslip && onDownload) {
      onDownload(generatedPayslip.id);
    }
  };

  const handleEmail = () => {
    if (generatedPayslip && onEmail) {
      // In real implementation, would open email dialog
      onEmail(generatedPayslip.id, 'employee@example.com');
    }
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Payslip Generator
            </h3>
            <p className="text-gray-600">Generate bilingual payslips with KSA compliance</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              🇸🇦 KSA Compliant
            </span>
          </div>
        </div>
      </div>

      {/* Employee Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-gray-600" />
          Employee Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee Name</label>
            <p className="mt-1 text-sm text-gray-900">{payrollRecord.employeeName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Position</label>
            <p className="mt-1 text-sm text-gray-900">{payrollRecord.position}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <p className="mt-1 text-sm text-gray-900">{payrollRecord.department}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pay Period</label>
            <p className="mt-1 text-sm text-gray-900">{payrollRecord.payPeriod}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Basic Salary</label>
            <p className="mt-1 text-sm text-gray-900 font-medium">SAR {payrollRecord.basicSalary.toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Net Pay</label>
            <p className="mt-1 text-sm text-gray-900 font-bold text-green-600">SAR {payrollRecord.netPay.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2 text-gray-600" />
          Template Configuration
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <div className="space-y-2">
              {['Arabic', 'English', 'Bilingual'].map((lang) => (
                <label key={lang} className="flex items-center">
                  <input
                    type="radio"
                    name="language"
                    value={lang}
                    checked={selectedLanguage === lang}
                    onChange={(e) => setSelectedLanguage(e.target.value as any)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{lang}</span>
                  {lang === 'Bilingual' && (
                    <Languages className="w-4 h-4 ml-2 text-blue-600" />
                  )}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Template Features */}
        {selectedTemplateData && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h5 className="text-sm font-medium text-gray-900 mb-2">Template Features</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center">
                <QrCode className="w-4 h-4 mr-2 text-gray-600" />
                <span className={selectedTemplateData.includeQRCode ? 'text-green-600' : 'text-gray-400'}>
                  QR Code
                </span>
              </div>
              <div className="flex items-center">
                <Calculator className="w-4 h-4 mr-2 text-gray-600" />
                <span className={selectedTemplateData.includeEOSAccrual ? 'text-green-600' : 'text-gray-400'}>
                  EOS Accrual
                </span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-gray-600" />
                <span className={selectedTemplateData.includeGOSIBreakdown ? 'text-green-600' : 'text-gray-400'}>
                  GOSI Breakdown
                </span>
              </div>
              <div className="flex items-center">
                <Languages className="w-4 h-4 mr-2 text-gray-600" />
                <span className="text-green-600">
                  {selectedTemplateData.language}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payslip Breakdown Preview */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-gray-600" />
          Payslip Breakdown
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Earnings */}
          <div>
            <h5 className="text-md font-medium text-gray-900 mb-3 text-green-600">
              Earnings / الأرباح
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Basic Salary / الراتب الأساسي</span>
                <span className="font-medium">SAR {payrollRecord.basicSalary.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Housing Allowance / بدل السكن</span>
                <span className="font-medium">SAR {payrollRecord.allowances.housing.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Transportation / بدل النقل</span>
                <span className="font-medium">SAR {payrollRecord.allowances.transportation.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Other Allowances / بدلات أخرى</span>
                <span className="font-medium">SAR {(payrollRecord.allowances.totalAllowances - payrollRecord.allowances.housing - payrollRecord.allowances.transportation).toLocaleString()}</span>
              </div>
              {payrollRecord.overtime.amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Overtime / العمل الإضافي</span>
                  <span className="font-medium">SAR {payrollRecord.overtime.amount.toLocaleString()}</span>
                </div>
              )}
              {payrollRecord.bonuses.totalBonuses > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Bonuses / المكافآت</span>
                  <span className="font-medium">SAR {payrollRecord.bonuses.totalBonuses.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between text-sm font-semibold">
                <span>Gross Pay / إجمالي الراتب</span>
                <span>SAR {payrollRecord.grossPay.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h5 className="text-md font-medium text-gray-900 mb-3 text-red-600">
              Deductions / الخصومات
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>GOSI Employee / التأمينات الاجتماعية</span>
                <span className="font-medium">SAR {payrollRecord.deductions.gosiEmployee.toLocaleString()}</span>
              </div>
              {payrollRecord.deductions.insurance > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Insurance / التأمين</span>
                  <span className="font-medium">SAR {payrollRecord.deductions.insurance.toLocaleString()}</span>
                </div>
              )}
              {payrollRecord.deductions.loans > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Loans / القروض</span>
                  <span className="font-medium">SAR {payrollRecord.deductions.loans.toLocaleString()}</span>
                </div>
              )}
              {payrollRecord.deductions.advances > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Advances / السلف</span>
                  <span className="font-medium">SAR {payrollRecord.deductions.advances.toLocaleString()}</span>
                </div>
              )}
              {payrollRecord.deductions.other > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Other Deductions / خصومات أخرى</span>
                  <span className="font-medium">SAR {payrollRecord.deductions.other.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between text-sm font-semibold">
                <span>Total Deductions / إجمالي الخصومات</span>
                <span>SAR {payrollRecord.deductions.totalDeductions.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-600 font-medium">GOSI Employer Contribution:</span>
              <br />
              <span className="text-blue-900">SAR {payrollRecord.deductions.gosiEmployer.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-blue-600 font-medium">EOS Accrued This Month:</span>
              <br />
              <span className="text-blue-900">SAR {payrollRecord.eosAccrued.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-blue-600 font-medium">Payment Method:</span>
              <br />
              <span className="text-blue-900">{payrollRecord.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Net Pay */}
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-green-900">
              Net Pay / صافي الراتب
            </span>
            <span className="text-2xl font-bold text-green-600">
              SAR {payrollRecord.netPay.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">Generate Payslip</h4>
            <p className="text-gray-600">Create and download the payslip document</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={generatePayslip}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>Generate PDF</span>
            </button>
          </div>
        </div>

        {/* Generated Payslip Actions */}
        {generatedPayslip && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-900 font-medium">Payslip Generated Successfully</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
                <button
                  onClick={handleEmail}
                  className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center space-x-1"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>
                <button className="px-3 py-1.5 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 flex items-center space-x-1">
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
              </div>
            </div>
            <div className="mt-2 text-sm text-green-700">
              File size: {(generatedPayslip.fileSize / 1024).toFixed(0)} KB | Language: {generatedPayslip.language}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayslipGenerator; 