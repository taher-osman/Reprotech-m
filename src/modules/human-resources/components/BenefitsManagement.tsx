import React, { useState } from 'react';
import { 
  Shield, 
  Heart, 
  Eye, 
  Car, 
  Home, 
  GraduationCap, 
  TrendingUp, 
  Gift, 
  Plus, 
  Edit, 
  Trash2, 
  Eye as ViewIcon,
  Users,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Download,
  Upload,
  Search,
  Filter
} from 'lucide-react';

interface BenefitsPackage {
  id: string;
  name: string;
  type: 'health' | 'dental' | 'vision' | 'life' | 'retirement' | 'transport' | 'housing' | 'education' | 'wellness';
  provider: string;
  coverage: string;
  employeeContribution: number;
  employerContribution: number;
  status: 'active' | 'inactive' | 'pending';
  effectiveDate: string;
  expiryDate?: string;
  maxCoverage?: number;
  waitingPeriod?: number;
  description?: string;
}

interface EmployeeBenefit {
  id: string;
  employeeId: string;
  employeeName: string;
  benefitId: string;
  benefitName: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'pending';
  dependents: number;
  totalCost: number;
  employeeShare: number;
  employerShare: number;
}

const BenefitsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('packages');
  const [selectedBenefit, setSelectedBenefit] = useState<BenefitsPackage | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<EmployeeBenefit | null>(null);
  const [showBenefitModal, setShowBenefitModal] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data
  const benefitsPackages: BenefitsPackage[] = [
    {
      id: 'BEN-001',
      name: 'Comprehensive Health Insurance',
      type: 'health',
      provider: 'Gulf Insurance Group',
      coverage: 'Family coverage including spouse and children up to 3 dependents',
      employeeContribution: 200,
      employerContribution: 800,
      status: 'active',
      effectiveDate: '2024-01-01',
      expiryDate: '2024-12-31',
      maxCoverage: 50000,
      waitingPeriod: 30,
      description: 'Comprehensive health insurance covering hospitalization, outpatient care, and prescription drugs'
    },
    {
      id: 'BEN-002',
      name: 'Dental Care Plan',
      type: 'dental',
      provider: 'Dental Care Plus',
      coverage: 'Basic dental procedures, annual checkups, and emergency dental care',
      employeeContribution: 50,
      employerContribution: 150,
      status: 'active',
      effectiveDate: '2024-01-01',
      maxCoverage: 5000,
      description: 'Comprehensive dental coverage including preventive care and major procedures'
    },
    {
      id: 'BEN-003',
      name: 'Life Insurance',
      type: 'life',
      provider: 'Gulf Life Insurance',
      coverage: '2x annual salary coverage with additional accidental death benefit',
      employeeContribution: 0,
      employerContribution: 300,
      status: 'active',
      effectiveDate: '2024-01-01',
      maxCoverage: 200000,
      description: 'Group life insurance providing financial security for employees and their families'
    },
    {
      id: 'BEN-004',
      name: 'Transportation Allowance',
      type: 'transport',
      provider: 'Internal',
      coverage: 'Monthly transportation allowance for commuting expenses',
      employeeContribution: 0,
      employerContribution: 500,
      status: 'active',
      effectiveDate: '2024-01-01',
      description: 'Monthly allowance to cover transportation costs including fuel and maintenance'
    },
    {
      id: 'BEN-005',
      name: 'Housing Allowance',
      type: 'housing',
      provider: 'Internal',
      coverage: 'Monthly housing allowance for accommodation expenses',
      employeeContribution: 0,
      employerContribution: 1200,
      status: 'active',
      effectiveDate: '2024-01-01',
      description: 'Monthly allowance to assist with housing costs including rent and utilities'
    },
    {
      id: 'BEN-006',
      name: 'Education Support',
      type: 'education',
      provider: 'Internal',
      coverage: 'Professional development, training courses, and certification programs',
      employeeContribution: 100,
      employerContribution: 400,
      status: 'active',
      effectiveDate: '2024-01-01',
      maxCoverage: 10000,
      description: 'Support for continuing education and professional development activities'
    },
    {
      id: 'BEN-007',
      name: 'Wellness Program',
      type: 'wellness',
      provider: 'Health & Wellness Partners',
      coverage: 'Gym memberships, wellness coaching, and health screenings',
      employeeContribution: 25,
      employerContribution: 75,
      status: 'active',
      effectiveDate: '2024-03-01',
      description: 'Comprehensive wellness program promoting employee health and well-being'
    },
    {
      id: 'BEN-008',
      name: 'Retirement Plan',
      type: 'retirement',
      provider: 'Gulf Pension Fund',
      coverage: 'Defined contribution plan with employer matching',
      employeeContribution: 300,
      employerContribution: 300,
      status: 'pending',
      effectiveDate: '2024-06-01',
      description: 'Retirement savings plan with employer matching contributions'
    }
  ];

  const employeeBenefits: EmployeeBenefit[] = [
    {
      id: 'ENR-001',
      employeeId: 'EMP-001',
      employeeName: 'Dr. Sarah Johnson',
      benefitId: 'BEN-001',
      benefitName: 'Comprehensive Health Insurance',
      enrollmentDate: '2024-01-15',
      status: 'active',
      dependents: 2,
      totalCost: 1000,
      employeeShare: 200,
      employerShare: 800
    },
    {
      id: 'ENR-002',
      employeeId: 'EMP-001',
      employeeName: 'Dr. Sarah Johnson',
      benefitId: 'BEN-002',
      benefitName: 'Dental Care Plan',
      enrollmentDate: '2024-01-15',
      status: 'active',
      dependents: 2,
      totalCost: 200,
      employeeShare: 50,
      employerShare: 150
    },
    {
      id: 'ENR-003',
      employeeId: 'EMP-002',
      employeeName: 'Ahmed Al-Rashid',
      benefitId: 'BEN-001',
      benefitName: 'Comprehensive Health Insurance',
      enrollmentDate: '2024-01-20',
      status: 'active',
      dependents: 1,
      totalCost: 1000,
      employeeShare: 200,
      employerShare: 800
    },
    {
      id: 'ENR-004',
      employeeId: 'EMP-003',
      employeeName: 'Fatima Hassan',
      benefitId: 'BEN-001',
      benefitName: 'Comprehensive Health Insurance',
      enrollmentDate: '2024-02-01',
      status: 'pending',
      dependents: 0,
      totalCost: 1000,
      employeeShare: 200,
      employerShare: 800
    },
    {
      id: 'ENR-005',
      employeeId: 'EMP-004',
      employeeName: 'Mohammed Al-Zahra',
      benefitId: 'BEN-004',
      benefitName: 'Transportation Allowance',
      enrollmentDate: '2024-01-01',
      status: 'active',
      dependents: 0,
      totalCost: 500,
      employeeShare: 0,
      employerShare: 500
    }
  ];

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
      case 'wellness': return <Gift className="w-4 h-4" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredBenefits = benefitsPackages.filter(benefit => {
    const matchesSearch = benefit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         benefit.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || benefit.type === filterType;
    const matchesStatus = filterStatus === 'all' || benefit.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalEmployerCost = benefitsPackages.reduce((sum, benefit) => sum + benefit.employerContribution, 0);
  const totalEmployeeCost = benefitsPackages.reduce((sum, benefit) => sum + benefit.employeeContribution, 0);
  const activeBenefits = benefitsPackages.filter(benefit => benefit.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Benefits Management</h2>
          <p className="text-gray-600">Comprehensive benefits administration and enrollment tracking</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Benefit</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Benefits</p>
              <p className="text-2xl font-bold text-green-600">{activeBenefits}</p>
            </div>
            <Shield className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
              <p className="text-2xl font-bold text-blue-600">{employeeBenefits.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Employer Cost</p>
              <p className="text-2xl font-bold text-purple-600">${totalEmployerCost.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Employee Cost</p>
              <p className="text-2xl font-bold text-orange-600">${totalEmployeeCost.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('packages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'packages'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Benefits Packages</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('enrollments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'enrollments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Employee Enrollments</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Analytics</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'packages' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search benefits..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="health">Health</option>
                  <option value="dental">Dental</option>
                  <option value="vision">Vision</option>
                  <option value="life">Life</option>
                  <option value="retirement">Retirement</option>
                  <option value="transport">Transport</option>
                  <option value="housing">Housing</option>
                  <option value="education">Education</option>
                  <option value="wellness">Wellness</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBenefits.map((benefit) => (
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
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(benefit.status)}`}>
                        {benefit.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Coverage</p>
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">{benefit.coverage}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Employee Cost</p>
                          <p className="text-sm font-medium text-gray-900">${benefit.employeeContribution}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Employer Cost</p>
                          <p className="text-sm font-medium text-gray-900">${benefit.employerContribution}</p>
                        </div>
                      </div>
                      
                      {benefit.maxCoverage && (
                        <div>
                          <p className="text-sm text-gray-600">Max Coverage</p>
                          <p className="text-sm font-medium text-gray-900">${benefit.maxCoverage.toLocaleString()}</p>
                        </div>
                      )}
                      
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

          {activeTab === 'enrollments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Employee Enrollments</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>New Enrollment</span>
                </button>
              </div>

              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Employee
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Benefit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Enrollment Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dependents
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Cost
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
                      {employeeBenefits.map((enrollment) => (
                        <tr key={enrollment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{enrollment.employeeName}</div>
                              <div className="text-sm text-gray-500">{enrollment.employeeId}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{enrollment.benefitName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {enrollment.enrollmentDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {enrollment.dependents}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              ${enrollment.totalCost.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              Emp: ${enrollment.employeeShare} | Comp: ${enrollment.employerShare}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(enrollment.status)}`}>
                              {enrollment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedEnrollment(enrollment);
                                  setShowEnrollmentModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <ViewIcon className="w-4 h-4" />
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

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Benefits Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Benefits Packages</span>
                      <span className="font-medium">{benefitsPackages.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Benefits</span>
                      <span className="font-medium">{activeBenefits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Enrollments</span>
                      <span className="font-medium">{employeeBenefits.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Enrollment Rate</span>
                      <span className="font-medium">85%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Cost Analysis</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Employer Cost</span>
                      <span className="font-medium">${totalEmployerCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Employee Cost</span>
                      <span className="font-medium">${totalEmployeeCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost per Employee</span>
                      <span className="font-medium">${(totalEmployerCost / 5).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ROI on Benefits</span>
                      <span className="font-medium text-green-600">+15%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Heart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">Health Insurance</p>
                    <p className="text-sm text-gray-600">100% enrollment</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Car className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">Transport Allowance</p>
                    <p className="text-sm text-gray-600">80% enrollment</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="font-medium text-gray-900">Dental Care</p>
                    <p className="text-sm text-gray-600">60% enrollment</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Benefit Detail Modal */}
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
                  {selectedBenefit.description && (
                    <p className="text-sm text-gray-600 mt-2">{selectedBenefit.description}</p>
                  )}
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

              {selectedBenefit.maxCoverage && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Coverage Limits</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Maximum Coverage:</span>
                      <span className="font-medium ml-2">${selectedBenefit.maxCoverage.toLocaleString()}</span>
                    </div>
                    {selectedBenefit.waitingPeriod && (
                      <div>
                        <span className="text-gray-600">Waiting Period:</span>
                        <span className="font-medium ml-2">{selectedBenefit.waitingPeriod} days</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
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

      {/* Enrollment Detail Modal */}
      {showEnrollmentModal && selectedEnrollment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Enrollment Details</h3>
              <button
                onClick={() => setShowEnrollmentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Employee Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Name:</span> {selectedEnrollment.employeeName}</div>
                    <div><span className="text-gray-600">ID:</span> {selectedEnrollment.employeeId}</div>
                    <div><span className="text-gray-600">Enrollment Date:</span> {selectedEnrollment.enrollmentDate}</div>
                    <div><span className="text-gray-600">Dependents:</span> {selectedEnrollment.dependents}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Benefit Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-600">Benefit:</span> {selectedEnrollment.benefitName}</div>
                    <div><span className="text-gray-600">Status:</span> 
                      <span className={`ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedEnrollment.status)}`}>
                        {selectedEnrollment.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Cost Breakdown</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employee Share</span>
                    <span className="font-medium">${selectedEnrollment.employeeShare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employer Share</span>
                    <span className="font-medium">${selectedEnrollment.employerShare}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-medium text-gray-900">Total Cost</span>
                    <span className="font-bold text-lg text-gray-900">${selectedEnrollment.totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowEnrollmentModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Edit Enrollment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BenefitsManagement; 