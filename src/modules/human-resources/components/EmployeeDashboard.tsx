import React, { useState, useEffect } from 'react';
import {
  User,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Download,
  Edit,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Building,
  GraduationCap,
  Badge,
  Award,
  Shield,
  TrendingUp,
  Plus,
  Upload
} from 'lucide-react';
import { EmployeePersonalStats, EmployeeProfile } from '../types/hrTypes';
import { employeeApi, mockEmployeeData, mockContractData } from '../services/hrApi';

const EmployeeDashboard: React.FC = () => {
  const [personalStats, setPersonalStats] = useState<EmployeePersonalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeProfile | null>(null);

  useEffect(() => {
    // Simulate loading personal stats
    const loadPersonalStats = async () => {
      try {
        // In real implementation, this would fetch from API
        // const stats = await employeeApi.getPersonalStats('current-employee-id');
        
        // Mock data for demonstration
        const mockStats: EmployeePersonalStats = {
          employeeInfo: mockEmployeeData[0],
          contractInfo: mockContractData[0],
          attendanceThisMonth: {
            workDays: 22,
            absences: 0,
            overtimeHours: 8
          },
          leaveBalance: {
            annual: 25,
            sick: 10,
            used: 5
          },
          recentPayroll: [
            {
              id: '1',
              employeeId: '1',
              year: 2024,
              month: 12,
              baseSalary: 15000,
              socialInsuranceDeduction: 1500,
              transportationAllowance: 1000,
              housingAllowance: 2000,
              communicationAllowance: 500,
              ticketAllowance: 3000,
              overtime: 800,
              penalties: 0,
              finalNetSalary: 19800,
              status: 'Paid',
              paymentDate: '2024-12-25',
              createdAt: '2024-12-01T00:00:00Z',
              updatedAt: '2024-12-25T00:00:00Z'
            }
          ],
          pendingRequests: []
        };
        
        setPersonalStats(mockStats);
        setSelectedEmployee(mockEmployeeData[0]);
      } catch (error) {
        console.error('Error loading personal stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPersonalStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!personalStats || !selectedEmployee) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Employee Data</h3>
        <p className="text-gray-500">Please contact HR to set up your employee profile.</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resigned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              {selectedEmployee.photo ? (
                <img 
                  src={selectedEmployee.photo} 
                  alt="Employee" 
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedEmployee.fullName.english}
              </h2>
              <p className="text-lg text-gray-600">
                {selectedEmployee.fullName.arabic}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedEmployee.state)}`}>
                  {selectedEmployee.state}
                </span>
                <span className="text-sm text-gray-500">
                  {selectedEmployee.employeeId}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Work Days This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {personalStats.attendanceThisMonth.workDays}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overtime Hours</p>
              <p className="text-2xl font-bold text-gray-900">
                {personalStats.attendanceThisMonth.overtimeHours}h
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Annual Leave Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                {personalStats.leaveBalance.annual} days
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Salary</p>
              <p className="text-2xl font-bold text-gray-900">
                SAR {personalStats.recentPayroll[0]?.finalNetSalary.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Personal Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedEmployee.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedEmployee.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedEmployee.workLocation}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedEmployee.department}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedEmployee.education}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedEmployee.jobTitle}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedEmployee.nationality}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedEmployee.experienceYears} years experience</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contract Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Contract Information</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contract Number</p>
                  <p className="text-sm text-gray-900">{personalStats.contractInfo.contractNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Contract Type</p>
                  <p className="text-sm text-gray-900">{selectedEmployee.contractType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Start Date</p>
                  <p className="text-sm text-gray-900">{selectedEmployee.contractStartDate}</p>
                </div>
                {selectedEmployee.contractEndDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">End Date</p>
                    <p className="text-sm text-gray-900">{selectedEmployee.contractEndDate}</p>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Base Salary</p>
                  <p className="text-sm text-gray-900">SAR {selectedEmployee.salary.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Annual Leave</p>
                  <p className="text-sm text-gray-900">{selectedEmployee.annualLeaveDays} days</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(personalStats.contractInfo.status)}`}>
                    {personalStats.contractInfo.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Payroll */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <DollarSign className="w-5 h-5" />
              <span>Recent Payroll</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Base Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Allowances
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Salary
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {personalStats.recentPayroll.map((payroll) => (
                    <tr key={payroll.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payroll.year, payroll.month - 1).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        SAR {payroll.baseSalary.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        SAR {(payroll.transportationAllowance + payroll.housingAllowance + payroll.communicationAllowance + payroll.ticketAllowance).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        SAR {payroll.finalNetSalary.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payroll.status === 'Paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payroll.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Request Leave</span>
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>View Documents</span>
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload Document</span>
              </button>
            </div>
          </div>

          {/* Leave Balance */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Balance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Annual Leave</span>
                <span className="text-sm font-medium text-gray-900">
                  {personalStats.leaveBalance.annual} days
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sick Leave</span>
                <span className="text-sm font-medium text-gray-900">
                  {personalStats.leaveBalance.sick} days
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Used</span>
                <span className="text-sm font-medium text-gray-900">
                  {personalStats.leaveBalance.used} days
                </span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Remaining</span>
                  <span className="text-sm font-bold text-blue-600">
                    {personalStats.leaveBalance.annual - personalStats.leaveBalance.used} days
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Bank</p>
                <p className="text-sm text-gray-900">{selectedEmployee.bankDetails.bank}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Account Number</p>
                <p className="text-sm text-gray-900">{selectedEmployee.bankDetails.accountNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">IBAN</p>
                <p className="text-sm text-gray-900 font-mono">{selectedEmployee.bankDetails.iban}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard; 