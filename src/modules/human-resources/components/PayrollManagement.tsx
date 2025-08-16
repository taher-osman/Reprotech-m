import React, { useState } from 'react';
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
  Briefcase
} from 'lucide-react';

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  payPeriod: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  status: 'pending' | 'processed' | 'paid' | 'cancelled';
  paymentMethod: string;
  paymentDate: string;
  notes?: string;
}

interface BenefitsPackage {
  id: string;
  name: string;
  type: 'health' | 'dental' | 'vision' | 'life' | 'retirement' | 'transport' | 'housing' | 'education';
  provider: string;
  coverage: string;
  employeeContribution: number;
  employerContribution: number;
  status: 'active' | 'inactive';
  effectiveDate: string;
  expiryDate?: string;
}

const PayrollManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('payroll');
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);
  const [selectedBenefit, setSelectedBenefit] = useState<BenefitsPackage | null>(null);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showBenefitModal, setShowBenefitModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');

  // Mock data
  const payrollRecords: PayrollRecord[] = [
    {
      id: 'PR-2025-001',
      employeeId: 'EMP-001',
      employeeName: 'Dr. Sarah Johnson',
      position: 'Senior Veterinarian',
      department: 'Clinical Services',
      payPeriod: 'January 2025',
      basicSalary: 8500,
      allowances: 1200,
      deductions: 850,
      netPay: 8850,
      status: 'paid',
      paymentMethod: 'Bank Transfer',
      paymentDate: '2025-01-31',
      notes: 'Including performance bonus'
    },
    {
      id: 'PR-2025-002',
      employeeId: 'EMP-002',
      employeeName: 'Ahmed Al-Rashid',
      position: 'Lab Technician',
      department: 'Laboratory',
      payPeriod: 'January 2025',
      basicSalary: 4500,
      allowances: 800,
      deductions: 450,
      netPay: 4850,
      status: 'processed',
      paymentMethod: 'Bank Transfer',
      paymentDate: '2025-01-31'
    },
    {
      id: 'PR-2025-003',
      employeeId: 'EMP-003',
      employeeName: 'Fatima Hassan',
      position: 'Administrative Assistant',
      department: 'Administration',
      payPeriod: 'January 2025',
      basicSalary: 3800,
      allowances: 600,
      deductions: 380,
      netPay: 4020,
      status: 'pending',
      paymentMethod: 'Bank Transfer',
      paymentDate: '2025-01-31'
    },
    {
      id: 'PR-2025-004',
      employeeId: 'EMP-004',
      employeeName: 'Mohammed Al-Zahra',
      position: 'Animal Care Specialist',
      department: 'Animal Care',
      payPeriod: 'January 2025',
      basicSalary: 4200,
      allowances: 700,
      deductions: 420,
      netPay: 4480,
      status: 'paid',
      paymentMethod: 'Bank Transfer',
      paymentDate: '2025-01-31'
    },
    {
      id: 'PR-2025-005',
      employeeId: 'EMP-005',
      employeeName: 'Aisha Al-Mansouri',
      position: 'Research Assistant',
      department: 'Research & Development',
      payPeriod: 'January 2025',
      basicSalary: 5200,
      allowances: 900,
      deductions: 520,
      netPay: 5580,
      status: 'cancelled',
      paymentMethod: 'Bank Transfer',
      paymentDate: '2025-01-31',
      notes: 'Payment cancelled due to incorrect calculations'
    }
  ];

  const benefitsPackages: BenefitsPackage[] = [
    {
      id: 'BEN-001',
      name: 'Comprehensive Health Insurance',
      type: 'health',
      provider: 'Gulf Insurance Group',
      coverage: 'Family coverage including spouse and children',
      employeeContribution: 200,
      employerContribution: 800,
      status: 'active',
      effectiveDate: '2024-01-01',
      expiryDate: '2024-12-31'
    },
    {
      id: 'BEN-002',
      name: 'Dental Care Plan',
      type: 'dental',
      provider: 'Dental Care Plus',
      coverage: 'Basic dental procedures and annual checkups',
      employeeContribution: 50,
      employerContribution: 150,
      status: 'active',
      effectiveDate: '2024-01-01'
    },
    {
      id: 'BEN-003',
      name: 'Life Insurance',
      type: 'life',
      provider: 'Gulf Life Insurance',
      coverage: '2x annual salary coverage',
      employeeContribution: 0,
      employerContribution: 300,
      status: 'active',
      effectiveDate: '2024-01-01'
    },
    {
      id: 'BEN-004',
      name: 'Transportation Allowance',
      type: 'transport',
      provider: 'Internal',
      coverage: 'Monthly transportation allowance',
      employeeContribution: 0,
      employerContribution: 500,
      status: 'active',
      effectiveDate: '2024-01-01'
    },
    {
      id: 'BEN-005',
      name: 'Housing Allowance',
      type: 'housing',
      provider: 'Internal',
      coverage: 'Monthly housing allowance',
      employeeContribution: 0,
      employerContribution: 1200,
      status: 'active',
      effectiveDate: '2024-01-01'
    },
    {
      id: 'BEN-006',
      name: 'Education Support',
      type: 'education',
      provider: 'Internal',
      coverage: 'Professional development and training',
      employeeContribution: 100,
      employerContribution: 400,
      status: 'active',
      effectiveDate: '2024-01-01'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'processed': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBenefitIcon = (type: string) => {
    switch (type) {
      case 'health': return <Heart className="w-4 h-4" />;
      case 'dental': return <Shield className="w-4 h-4" />;
      case 'vision': return <Eye className="w-4 h-4" />;
      case 'life': return <Shield className="w-4 h-4" />;
      case 'retirement': return <TrendingUp className="w-4 h-4" />;
      case 'transport': return <Car className="w-4 h-4" />;
      case 'housing': return <Home className="w-4 h-4" />;
      case 'education': return <GraduationCap className="w-4 h-4" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  const filteredPayroll = payrollRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesPeriod = filterPeriod === 'all' || record.payPeriod === filterPeriod;
    return matchesSearch && matchesStatus && matchesPeriod;
  });

  const totalPayroll = filteredPayroll.reduce((sum, record) => sum + record.netPay, 0);
  const pendingPayroll = filteredPayroll.filter(record => record.status === 'pending').length;
  const processedPayroll = filteredPayroll.filter(record => record.status === 'processed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payroll & Benefits Management</h2>
          <p className="text-gray-600">Comprehensive payroll processing and benefits administration</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Process Payroll</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payroll</p>
              <p className="text-2xl font-bold text-gray-900">${totalPayroll.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingPayroll}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Processed</p>
              <p className="text-2xl font-bold text-blue-600">{processedPayroll}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Benefits</p>
              <p className="text-2xl font-bold text-purple-600">{benefitsPackages.filter(b => b.status === 'active').length}</p>
            </div>
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('payroll')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payroll'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Payroll Processing</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('benefits')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'benefits'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Benefits Management</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Reports & Analytics</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'payroll' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processed">Processed</option>
                  <option value="paid">Paid</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={filterPeriod}
                  onChange={(e) => setFilterPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Periods</option>
                  <option value="January 2025">January 2025</option>
                  <option value="December 2024">December 2024</option>
                  <option value="November 2024">November 2024</option>
                </select>
              </div>

              {/* Payroll Table */}
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
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
                          Allowances
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Deductions
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
                      {filteredPayroll.map((record) => (
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
                            ${record.basicSalary.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${record.allowances.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${record.deductions.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              ${record.netPay.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedPayroll(record);
                                  setShowPayrollModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-900">
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
              </div>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Benefits Packages</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Benefit</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefitsPackages.map((benefit) => (
                  <div key={benefit.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getBenefitIcon(benefit.type)}
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{benefit.name}</h4>
                          <p className="text-sm text-gray-500">{benefit.provider}</p>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        benefit.status === 'active' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                      }`}>
                        {benefit.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Coverage</p>
                        <p className="text-sm font-medium text-gray-900">{benefit.coverage}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Employee Contribution</p>
                          <p className="text-sm font-medium text-gray-900">${benefit.employeeContribution}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Employer Contribution</p>
                          <p className="text-sm font-medium text-gray-900">${benefit.employerContribution}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 pt-3">
                        <button
                          onClick={() => {
                            setSelectedBenefit(benefit);
                            setShowBenefitModal(true);
                          }}
                          className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                        >
                          View Details
                        </button>
                        <button className="px-3 py-2 text-sm bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payroll Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Employees</span>
                      <span className="font-medium">{payrollRecords.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Payroll Amount</span>
                      <span className="font-medium">${totalPayroll.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Salary</span>
                      <span className="font-medium">${(totalPayroll / payrollRecords.length).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Benefits Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Benefits</span>
                      <span className="font-medium">{benefitsPackages.filter(b => b.status === 'active').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Employer Cost</span>
                      <span className="font-medium">${benefitsPackages.reduce((sum, b) => sum + b.employerContribution, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Employee Cost</span>
                      <span className="font-medium">${benefitsPackages.reduce((sum, b) => sum + b.employeeContribution, 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <div className="text-center">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">Generate Payroll Report</p>
                    </div>
                  </button>
                  <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <div className="text-center">
                      <Calculator className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">Calculate Benefits</p>
                    </div>
                  </button>
                  <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <div className="text-center">
                      <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">Analytics Dashboard</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payroll Detail Modal */}
      {showPayrollModal && selectedPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Payroll Details</h3>
              <button
                onClick={() => setShowPayrollModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Employee Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Name:</span> {selectedPayroll.employeeName}</div>
                    <div><span className="text-gray-600">ID:</span> {selectedPayroll.employeeId}</div>
                    <div><span className="text-gray-600">Position:</span> {selectedPayroll.position}</div>
                    <div><span className="text-gray-600">Department:</span> {selectedPayroll.department}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Payment Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Pay Period:</span> {selectedPayroll.payPeriod}</div>
                    <div><span className="text-gray-600">Payment Method:</span> {selectedPayroll.paymentMethod}</div>
                    <div><span className="text-gray-600">Payment Date:</span> {selectedPayroll.paymentDate}</div>
                    <div><span className="text-gray-600">Status:</span> 
                      <span className={`ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPayroll.status)}`}>
                        {selectedPayroll.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Salary Breakdown</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Basic Salary</span>
                    <span className="font-medium">${selectedPayroll.basicSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Allowances</span>
                    <span className="font-medium text-green-600">+${selectedPayroll.allowances.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deductions</span>
                    <span className="font-medium text-red-600">-${selectedPayroll.deductions.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-medium text-gray-900">Net Pay</span>
                    <span className="font-bold text-lg text-gray-900">${selectedPayroll.netPay.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {selectedPayroll.notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedPayroll.notes}</p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowPayrollModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Edit Payroll
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Benefits Detail Modal */}
      {showBenefitModal && selectedBenefit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Benefit Details</h3>
              <button
                onClick={() => setShowBenefitModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  {getBenefitIcon(selectedBenefit.type)}
                </div>
                <div>
                  <h4 className="text-xl font-medium text-gray-900">{selectedBenefit.name}</h4>
                  <p className="text-gray-600">{selectedBenefit.provider}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Coverage Details</h5>
                  <p className="text-sm text-gray-600">{selectedBenefit.coverage}</p>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Cost Breakdown</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employee Contribution:</span>
                      <span className="font-medium">${selectedBenefit.employeeContribution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employer Contribution:</span>
                      <span className="font-medium">${selectedBenefit.employerContribution}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Total Cost:</span>
                      <span className="font-bold">${(selectedBenefit.employeeContribution + selectedBenefit.employerContribution)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Effective Date</h5>
                  <p className="text-sm text-gray-600">{selectedBenefit.effectiveDate}</p>
                </div>
                
                {selectedBenefit.expiryDate && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Expiry Date</h5>
                    <p className="text-sm text-gray-600">{selectedBenefit.expiryDate}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowBenefitModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Edit Benefit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollManagement; 