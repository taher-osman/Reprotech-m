import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Calendar,
  Download, 
  Upload, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Calculator,
  Shield,
  FileSpreadsheet,
  FileCode,
  Bell,
  Clock,
  Zap,
  Banknote,
  Receipt,
  Settings,
  BarChart3,
  Archive,
  RefreshCw,
  Send,
  Printer,
  Copy,
  ExternalLink,
  AlertTriangle,
  Info,
  Star,
  Flag
} from 'lucide-react';
import { 
  KSAPayrollRecord,
  PayrollSettings,
  EOSBenefitRecord,
  WPSFile,
  OffCyclePayroll,
  ValidationResult,
  PayrollValidationRule
} from '../types/hrTypes';

const PayrollPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('payroll');
  const [selectedPayrolls, setSelectedPayrolls] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('current');
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [payrollSettings, setPayrollSettings] = useState<PayrollSettings | null>(null);

  // Mock Data
  const payrollRecords: KSAPayrollRecord[] = [
    {
      id: 'PR-2025-001',
      employeeId: 'EMP-001',
      employeeName: 'Dr. Sarah Johnson',
      position: 'Senior Veterinarian',
      department: 'Clinical Services',
      payPeriod: 'January 2025',
      basicSalary: 8500,
      allowances: {
        housing: 2000,
        transportation: 800,
        communication: 300,
        ticket: 500,
        food: 400,
        other: 200,
        totalAllowances: 4200
      },
      deductions: {
        gosiEmployee: 765, // 9% of basic salary
        gosiEmployer: 935, // 11% employer contribution
        insurance: 200,
        visa: 100,
        loans: 0,
        advances: 300,
        penalties: 0,
        other: 50,
        totalDeductions: 1415
      },
      overtime: {
        hours: 12,
        rate: 1.5,
        amount: 765
      },
      bonuses: {
        performance: 500,
        attendance: 200,
        other: 0,
        totalBonuses: 700
      },
      grossPay: 13400,
      netPay: 11985,
      eosAccrued: 1416.67, // Accrued EOS amount
      status: 'processed',
      paymentMethod: 'WPS',
      paymentDate: '2025-01-31',
      payslipGenerated: true,
      payslipUrl: '/payslips/PR-2025-001.pdf',
      isOffCycle: false,
      validationErrors: [],
      createdAt: '2025-01-28T10:00:00Z',
      updatedAt: '2025-01-28T10:00:00Z'
    },
    {
      id: 'PR-2025-002',
      employeeId: 'EMP-002',
      employeeName: 'Ahmed Al-Rashid',
      position: 'Lab Technician',
      department: 'Laboratory',
      payPeriod: 'January 2025',
      basicSalary: 4500,
      allowances: {
        housing: 1200,
        transportation: 500,
        communication: 200,
        ticket: 300,
        food: 250,
        other: 100,
        totalAllowances: 2550
      },
      deductions: {
        gosiEmployee: 405, // 9% of basic salary
        gosiEmployer: 495, // 11% employer contribution
        insurance: 150,
        visa: 80,
        loans: 200,
        advances: 0,
        penalties: 50,
        other: 30,
        totalDeductions: 915
      },
      overtime: {
        hours: 8,
        rate: 1.5,
        amount: 405
      },
      bonuses: {
        performance: 200,
        attendance: 100,
        other: 0,
        totalBonuses: 300
      },
      grossPay: 7755,
      netPay: 6840,
      eosAccrued: 750, // Accrued EOS amount
      status: 'draft',
      paymentMethod: 'WPS',
      paymentDate: '2025-01-31',
      payslipGenerated: false,
      isOffCycle: false,
      validationErrors: ['GOSI rate exceeds maximum threshold'],
      createdAt: '2025-01-28T10:00:00Z',
      updatedAt: '2025-01-28T10:00:00Z'
    }
  ];

  const mockPayrollSettings: PayrollSettings = {
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
    setPayrollSettings(mockPayrollSettings);
  }, []);

  const calculateGOSI = (basicSalary: number, isExempt: boolean = false) => {
    if (isExempt) return { employee: 0, employer: 0 };
    
    const employeeRate = payrollSettings?.gosi_percentage_employee || 9;
    const employerRate = payrollSettings?.gosi_percentage_employer || 11;
    
    return {
      employee: (basicSalary * employeeRate) / 100,
      employer: (basicSalary * employerRate) / 100
    };
  };

  const calculateEOSAccrual = (basicSalary: number, serviceYears: number, serviceMonths: number) => {
    const totalMonths = serviceYears * 12 + serviceMonths;
    const monthlyAccrual = serviceYears < 5 
      ? (basicSalary * 0.5) / 12  // Half month per year for first 5 years
      : (basicSalary * 1.0) / 12; // Full month per year after 5 years
    
    return monthlyAccrual;
  };

  const validatePayroll = (payroll: KSAPayrollRecord): ValidationResult[] => {
    const results: ValidationResult[] = [];
    
    // GOSI Rate Validation
    const gosiRate = (payroll.deductions.gosiEmployee / payroll.basicSalary) * 100;
    if (gosiRate > 20) {
      results.push({
        employeeId: payroll.employeeId,
        payrollId: payroll.id,
        ruleId: 'GOSI-001',
        ruleName: 'GOSI Rate Validation',
        severity: 'Error',
        message: 'GOSI rate exceeds maximum threshold of 20%',
        canProceed: false,
        autoFixed: false,
        validatedAt: new Date().toISOString()
      });
    }

    // Contract Validation
    if (!payroll.basicSalary || payroll.basicSalary <= 0) {
      results.push({
        employeeId: payroll.employeeId,
        payrollId: payroll.id,
        ruleId: 'SAL-001',
        ruleName: 'Basic Salary Validation',
        severity: 'Error',
        message: 'Basic salary is required and must be greater than 0',
        canProceed: false,
        autoFixed: false,
        validatedAt: new Date().toISOString()
      });
    }

    return results;
  };

  const handleBulkProcess = () => {
    console.log('Processing selected payrolls:', Array.from(selectedPayrolls));
  };

  const handleGenerateWPS = () => {
    const selectedRecords = payrollRecords.filter(p => selectedPayrolls.has(p.id));
    console.log('Generating WPS file for:', selectedRecords.length, 'records');
  };

  const handleBulkPayslips = () => {
    const selectedRecords = payrollRecords.filter(p => selectedPayrolls.has(p.id));
    console.log('Generating bulk payslips for:', selectedRecords.length, 'records');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'processed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getValidationIcon = (errors: string[]) => {
    if (errors.length === 0) return <CheckCircle className="w-4 h-4 text-green-600" />;
    return <AlertTriangle className="w-4 h-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Flag className="w-6 h-6 mr-2 text-green-600" />
              Saudi Payroll Management
            </h2>
            <p className="text-gray-600">Complete payroll processing with GOSI, WPS, and labor law compliance</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
              <Star className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">GOSI: {payrollSettings?.gosi_percentage_employee}%</span>
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Payroll</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">This Month</p>
              <p className="text-2xl font-bold text-green-900">SAR 285K</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">GOSI Total</p>
              <p className="text-2xl font-bold text-blue-900">SAR 28.5K</p>
            </div>
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">EOS Accrued</p>
              <p className="text-2xl font-bold text-purple-900">SAR 95K</p>
            </div>
            <Calculator className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-4 rounded-lg border border-teal-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-teal-600 font-medium">Employees</p>
              <p className="text-2xl font-bold text-teal-900">45</p>
            </div>
            <Users className="w-8 h-8 text-teal-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search payroll records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="processed">Processed</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="current">Current Month</option>
            <option value="last">Last Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedPayrolls.size > 0 && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {selectedPayrolls.size} payroll records selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBulkProcess}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Bulk Process
                </button>
                <button
                  onClick={handleGenerateWPS}
                  className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Generate WPS
                </button>
                <button
                  onClick={handleBulkPayslips}
                  className="px-3 py-1.5 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                >
                  Bulk Payslips
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payroll Records Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPayrolls(new Set(payrollRecords.map(p => p.id)));
                    } else {
                      setSelectedPayrolls(new Set());
                    }
                  }}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Basic Salary
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                GOSI
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                EOS Accrued
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payrollRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={selectedPayrolls.has(record.id)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedPayrolls);
                      if (e.target.checked) {
                        newSelected.add(record.id);
                      } else {
                        newSelected.delete(record.id);
                      }
                      setSelectedPayrolls(newSelected);
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                    <div className="text-sm text-gray-500">{record.position}</div>
                    <div className="text-xs text-gray-400">{record.department}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  SAR {record.basicSalary.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Emp:</span>
                      <span className="text-sm font-medium">SAR {record.deductions.gosiEmployee}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Com:</span>
                      <span className="text-sm font-medium">SAR {record.deductions.gosiEmployer}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  SAR {record.eosAccrued.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  SAR {record.netPay.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getValidationIcon(record.validationErrors || [])}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <Printer className="w-4 h-4" />
                    </button>
                    <button className="text-purple-600 hover:text-purple-900">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {payrollRecords.length} payroll records
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export to Excel</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Archive className="w-4 h-4" />
              <span>Archive Period</span>
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Process All</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollPage; 