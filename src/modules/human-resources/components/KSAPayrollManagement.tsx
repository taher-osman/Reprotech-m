import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  FileText, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Calculator,
  Shield,
  Gift,
  Heart,
  Car,
  Home,
  GraduationCap,
  Briefcase,
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
  ExternalLink
} from 'lucide-react';
import { 
  KSAPayrollRecord, 
  EndOfServiceCalculation, 
  WPSFile, 
  WPSRecord, 
  OffCyclePayroll,
  ContractCompliance,
  ComplianceNotification 
} from '../types/hrTypes';

const KSAPayrollManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('payroll');
  const [selectedPayroll, setSelectedPayroll] = useState<KSAPayrollRecord | null>(null);
  const [selectedEOS, setSelectedEOS] = useState<EndOfServiceCalculation | null>(null);
  const [selectedWPS, setSelectedWPS] = useState<WPSFile | null>(null);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showEOSModal, setShowEOSModal] = useState(false);
  const [showWPSModal, setShowWPSModal] = useState(false);
  const [showOffCycleModal, setShowOffCycleModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set());

  // Mock KSA Payroll Data
  const ksaPayrollRecords: KSAPayrollRecord[] = [
    {
      id: 'KSA-PR-2025-001',
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
        other: 200
      },
      deductions: {
        gosiEmployee: 765, // 9% of basic salary
        gosiEmployer: 765, // 9% of basic salary
        insurance: 200,
        visa: 100,
        other: 50
      },
      overtime: {
        hours: 12,
        rate: 1.5,
        amount: 765
      },
      bonuses: {
        performance: 500,
        attendance: 200,
        other: 0
      },
      netPay: 11450,
      status: 'paid',
      paymentMethod: 'WPS',
      paymentDate: '2025-01-31',
      wpsReference: 'WPS-2025-001-001',
      payslipGenerated: true,
      notes: 'Including performance bonus and overtime'
    },
    {
      id: 'KSA-PR-2025-002',
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
        other: 100
      },
      deductions: {
        gosiEmployee: 405,
        gosiEmployer: 405,
        insurance: 150,
        visa: 80,
        other: 30
      },
      overtime: {
        hours: 8,
        rate: 1.5,
        amount: 405
      },
      bonuses: {
        performance: 200,
        attendance: 100,
        other: 0
      },
      netPay: 6290,
      status: 'processed',
      paymentMethod: 'WPS',
      paymentDate: '2025-01-31',
      payslipGenerated: false
    }
  ];

  // Mock End-of-Service Calculations
  const eosCalculations: EndOfServiceCalculation[] = [
    {
      id: 'EOS-2025-001',
      employeeId: 'EMP-003',
      employeeName: 'Fatima Hassan',
      terminationDate: '2025-01-15',
      serviceYears: 5,
      serviceMonths: 3,
      lastBasicSalary: 3800,
      averageSalary: 3750,
      calculationMethod: 'Progressive',
      benefits: {
        basicEOS: 9500, // 5 years * 0.5 month * 3800
        additionalEOS: 1900, // Additional for 5+ years
        leaveEncashment: 1200,
        otherBenefits: 500,
        totalEOS: 13100
      },
      deductions: {
        loans: 0,
        advances: 500,
        other: 100,
        totalDeductions: 600
      },
      netEOSAmount: 12500,
      status: 'Approved',
      paymentDate: '2025-01-20',
      notes: 'Final settlement processed'
    }
  ];

  // Mock WPS Files
  const wpsFiles: WPSFile[] = [
    {
      id: 'WPS-2025-001',
      fileName: 'WPS_January_2025.csv',
      fileType: 'CSV',
      payPeriod: 'January 2025',
      totalEmployees: 45,
      totalAmount: 285000,
      status: 'Processed',
      uploadDate: '2025-01-30',
      processDate: '2025-01-31',
      fileUrl: '/files/wps/WPS_January_2025.csv'
    },
    {
      id: 'WPS-2025-002',
      fileName: 'WPS_January_2025.xml',
      fileType: 'XML',
      payPeriod: 'January 2025',
      totalEmployees: 45,
      totalAmount: 285000,
      status: 'Generated',
      fileUrl: '/files/wps/WPS_January_2025.xml'
    }
  ];

  // Mock Off-Cycle Payroll
  const offCyclePayrolls: OffCyclePayroll[] = [
    {
      id: 'OCP-2025-001',
      employeeId: 'EMP-004',
      employeeName: 'Mohammed Al-Zahra',
      type: 'Leave Encashment',
      effectiveDate: '2025-01-20',
      amount: 2400,
      reason: 'Annual leave encashment for 8 days',
      status: 'Paid',
      approvalDate: '2025-01-18',
      paymentDate: '2025-01-22'
    },
    {
      id: 'OCP-2025-002',
      employeeId: 'EMP-005',
      employeeName: 'Aisha Al-Mansouri',
      type: 'Backdated Join',
      effectiveDate: '2024-12-15',
      amount: 1800,
      reason: 'Backdated salary for late joining',
      status: 'Approved',
      approvalDate: '2025-01-25'
    }
  ];

  // Mock Compliance Notifications
  const complianceNotifications: ComplianceNotification[] = [
    {
      id: 'CN-2025-001',
      employeeId: 'EMP-001',
      type: 'Contract Expiry',
      title: {
        arabic: 'تنبيه انتهاء العقد',
        english: 'Contract Expiry Alert'
      },
      message: {
        arabic: 'عقدك سينتهي في 30 يوم. يرجى التواصل مع قسم الموارد البشرية للتجديد.',
        english: 'Your contract will expire in 30 days. Please contact HR for renewal.'
      },
      dueDate: '2025-02-28',
      daysRemaining: 30,
      status: 'Sent',
      sentDate: '2025-01-29',
      recipient: 'Employee'
    },
    {
      id: 'CN-2025-002',
      employeeId: 'EMP-002',
      type: 'Visa Renewal',
      title: {
        arabic: 'تنبيه تجديد التأشيرة',
        english: 'Visa Renewal Alert'
      },
      message: {
        arabic: 'تأشيرتك ستنتهي في 45 يوم. يرجى تجهيز المستندات المطلوبة.',
        english: 'Your visa will expire in 45 days. Please prepare required documents.'
      },
      dueDate: '2025-03-15',
      daysRemaining: 45,
      status: 'Pending',
      recipient: 'Employee'
    }
  ];

  const calculateGOSI = (basicSalary: number, employeeRate: number = 9, employerRate: number = 9) => {
    return {
      employee: (basicSalary * employeeRate) / 100,
      employer: (basicSalary * employerRate) / 100
    };
  };

  const calculateEOS = (basicSalary: number, serviceYears: number, serviceMonths: number) => {
    const totalMonths = serviceYears * 12 + serviceMonths;
    let eosRate = 0.5; // Half month for first 5 years
    
    if (serviceYears >= 5) {
      eosRate = 1; // Full month for 5+ years
    }
    
    const basicEOS = basicSalary * eosRate * serviceYears;
    const additionalEOS = serviceYears >= 5 ? basicSalary * 0.5 * (serviceYears - 5) : 0;
    
    return basicEOS + additionalEOS;
  };

  const generateWPSFile = (payrollRecords: KSAPayrollRecord[], fileType: 'CSV' | 'XML') => {
    const wpsRecords: WPSRecord[] = payrollRecords.map(record => ({
      id: record.id,
      employeeId: record.employeeId,
      employeeName: record.employeeName,
      iqamaNumber: '1234567890', // Mock data
      bankCode: 'SABB',
      accountNumber: '1234567890123456',
      basicSalary: record.basicSalary,
      allowances: Object.values(record.allowances).reduce((sum, val) => sum + val, 0),
      deductions: Object.values(record.deductions).reduce((sum, val) => sum + val, 0),
      netPay: record.netPay,
      payPeriod: record.payPeriod,
      status: 'Included'
    }));

    return {
      id: `WPS-${Date.now()}`,
      fileName: `WPS_${payrollRecords[0]?.payPeriod.replace(' ', '_')}_${fileType.toLowerCase()}`,
      fileType,
      payPeriod: payrollRecords[0]?.payPeriod || '',
      totalEmployees: wpsRecords.length,
      totalAmount: wpsRecords.reduce((sum, record) => sum + record.netPay, 0),
      status: 'Generated',
      fileUrl: `/files/wps/WPS_${Date.now()}.${fileType.toLowerCase()}`
    };
  };

  const generatePayslip = (payroll: KSAPayrollRecord) => {
    // Mock payslip generation
    console.log('Generating payslip for:', payroll.employeeName);
    return `/payslips/${payroll.id}.pdf`;
  };

  const sendComplianceNotification = (notification: ComplianceNotification) => {
    // Mock notification sending
    console.log('Sending notification:', notification.title.english);
    return true;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'Completed':
      case 'Processed':
        return 'bg-green-100 text-green-800';
      case 'processed':
      case 'Approved':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">KSA Payroll Management</h2>
            <p className="text-gray-600">Comprehensive payroll system with GOSI, WPS, and compliance features</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Archive className="w-4 h-4" />
              <span>Archive</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Payroll</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'payroll', label: 'Payroll Records', icon: DollarSign },
              { id: 'eos', label: 'End-of-Service', icon: Calculator },
              { id: 'wps', label: 'WPS Files', icon: FileSpreadsheet },
              { id: 'offcycle', label: 'Off-Cycle', icon: Clock },
              { id: 'compliance', label: 'Compliance', icon: Bell }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Payroll Records Tab */}
          {activeTab === 'payroll' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex items-center space-x-4">
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
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Generate WPS</span>
                </button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2">
                  <Printer className="w-4 h-4" />
                  <span>Bulk Payslips</span>
                </button>
              </div>

              {/* Payroll Records Table */}
              <div className="bg-white rounded-lg border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Basic Salary
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GOSI
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Net Pay
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ksaPayrollRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                            <div className="text-sm text-gray-500">{record.position}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.payPeriod}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          SAR {record.basicSalary.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>Employee: SAR {record.deductions.gosiEmployee}</div>
                          <div>Employer: SAR {record.deductions.gosiEmployer}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          SAR {record.netPay.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
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
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* End-of-Service Tab */}
          {activeTab === 'eos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">End-of-Service Calculations</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <Calculator className="w-4 h-4" />
                  <span>Calculate EOS</span>
                </button>
              </div>

              <div className="bg-white rounded-lg border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service Period
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Basic EOS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Net Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {eosCalculations.map((eos) => (
                      <tr key={eos.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{eos.employeeName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {eos.serviceYears} years, {eos.serviceMonths} months
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          SAR {eos.benefits.basicEOS.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          SAR {eos.netEOSAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(eos.status)}`}>
                            {eos.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Printer className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* WPS Files Tab */}
          {activeTab === 'wps' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">WPS (Wage Protection System) Files</h3>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Generate CSV</span>
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                    <FileCode className="w-4 h-4" />
                    <span>Generate XML</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wpsFiles.map((file) => (
                  <div key={file.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {file.fileType === 'CSV' ? (
                          <FileSpreadsheet className="w-6 h-6 text-green-600" />
                        ) : (
                          <FileCode className="w-6 h-6 text-blue-600" />
                        )}
                        <span className="text-sm font-medium text-gray-900">{file.fileName}</span>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(file.status)}`}>
                        {file.status}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>Period: {file.payPeriod}</div>
                      <div>Employees: {file.totalEmployees}</div>
                      <div>Total Amount: SAR {file.totalAmount.toLocaleString()}</div>
                      {file.uploadDate && <div>Uploaded: {new Date(file.uploadDate).toLocaleDateString()}</div>}
                    </div>

                    <div className="flex items-center space-x-2 mt-4">
                      <button className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                      <button className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Off-Cycle Payroll Tab */}
          {activeTab === 'offcycle' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Off-Cycle Payroll</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>New Off-Cycle</span>
                </button>
              </div>

              <div className="bg-white rounded-lg border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Effective Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {offCyclePayrolls.map((ocp) => (
                      <tr key={ocp.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{ocp.employeeName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {ocp.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          SAR {ocp.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(ocp.effectiveDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ocp.status)}`}>
                            {ocp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Compliance Tab */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Compliance Notifications</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <Bell className="w-4 h-4" />
                  <span>Send Notifications</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {complianceNotifications.map((notification) => (
                  <div key={notification.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                        <span className="text-sm font-medium text-gray-900">{notification.type}</span>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notification.status)}`}>
                        {notification.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{notification.title.english}</h4>
                        <p className="text-sm text-gray-600 mt-1">{notification.title.arabic}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">{notification.message.english}</p>
                        <p className="text-sm text-gray-600 mt-1">{notification.message.arabic}</p>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Due: {new Date(notification.dueDate).toLocaleDateString()}</span>
                        <span>{notification.daysRemaining} days remaining</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-4">
                      <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-1">
                        <Send className="w-4 h-4" />
                        <span>Send</span>
                      </button>
                      <button className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KSAPayrollManagement; 