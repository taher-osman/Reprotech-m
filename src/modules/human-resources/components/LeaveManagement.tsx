import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  UserCheck, 
  UserX, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Filter,
  Download,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Send,
  Clock3
} from 'lucide-react';
import { LeaveRequest, LeaveBalance, LeaveStats, LeaveFilter } from '../types/hrTypes';

const LeaveManagement: React.FC = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [stats, setStats] = useState<LeaveStats>({
    totalRequests: 0,
    pendingApproval: 0,
    approved: 0,
    rejected: 0,
    averageProcessingTime: 0
  });
  const [filters, setFilters] = useState<LeaveFilter>({
    status: '',
    leaveType: '',
    employee: '',
    dateRange: 'month'
  });
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(new Set());
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'balances'>('requests');

  // Mock data
  useEffect(() => {
    const mockRequests: LeaveRequest[] = [
      {
        id: '1',
        employeeId: 'EMP001',
        employeeName: 'Dr. Sarah Johnson',
        department: 'Veterinary Services',
        leaveType: 'annual',
        startDate: '2024-02-15',
        endDate: '2024-02-20',
        days: 6,
        reason: 'Family vacation',
        status: 'pending',
        submittedDate: '2024-01-10',
        approvedBy: null,
        approvedDate: null,
        notes: 'Requesting annual leave for family trip'
      },
      {
        id: '2',
        employeeId: 'EMP002',
        employeeName: 'Ahmed Al-Mansouri',
        department: 'Laboratory',
        leaveType: 'sick',
        startDate: '2024-01-15',
        endDate: '2024-01-17',
        days: 3,
        reason: 'Medical appointment',
        status: 'approved',
        submittedDate: '2024-01-12',
        approvedBy: 'HR Manager',
        approvedDate: '2024-01-13',
        notes: 'Approved for medical leave'
      },
      {
        id: '3',
        employeeId: 'EMP003',
        employeeName: 'Maria Rodriguez',
        department: 'Administration',
        leaveType: 'maternity',
        startDate: '2024-03-01',
        endDate: '2024-08-31',
        days: 180,
        reason: 'Maternity leave',
        status: 'approved',
        submittedDate: '2024-01-05',
        approvedBy: 'HR Manager',
        approvedDate: '2024-01-06',
        notes: 'Standard maternity leave period'
      },
      {
        id: '4',
        employeeId: 'EMP004',
        employeeName: 'Dr. James Wilson',
        department: 'Veterinary Services',
        leaveType: 'emergency',
        startDate: '2024-01-20',
        endDate: '2024-01-22',
        days: 3,
        reason: 'Family emergency',
        status: 'pending',
        submittedDate: '2024-01-19',
        approvedBy: null,
        approvedDate: null,
        notes: 'Urgent family matter'
      },
      {
        id: '5',
        employeeId: 'EMP005',
        employeeName: 'Fatima Hassan',
        department: 'Laboratory',
        leaveType: 'personal',
        startDate: '2024-02-01',
        endDate: '2024-02-01',
        days: 1,
        reason: 'Personal appointment',
        status: 'rejected',
        submittedDate: '2024-01-15',
        approvedBy: 'HR Manager',
        approvedDate: '2024-01-16',
        notes: 'Rejected due to staffing requirements'
      }
    ];

    const mockBalances: LeaveBalance[] = [
      {
        employeeId: 'EMP001',
        employeeName: 'Dr. Sarah Johnson',
        annualLeave: { total: 25, used: 8, remaining: 17 },
        sickLeave: { total: 15, used: 2, remaining: 13 },
        personalLeave: { total: 5, used: 1, remaining: 4 },
        maternityLeave: { total: 180, used: 0, remaining: 180 },
        emergencyLeave: { total: 10, used: 0, remaining: 10 }
      },
      {
        employeeId: 'EMP002',
        employeeName: 'Ahmed Al-Mansouri',
        annualLeave: { total: 25, used: 12, remaining: 13 },
        sickLeave: { total: 15, used: 5, remaining: 10 },
        personalLeave: { total: 5, used: 2, remaining: 3 },
        maternityLeave: { total: 180, used: 0, remaining: 180 },
        emergencyLeave: { total: 10, used: 1, remaining: 9 }
      },
      {
        employeeId: 'EMP003',
        employeeName: 'Maria Rodriguez',
        annualLeave: { total: 25, used: 15, remaining: 10 },
        sickLeave: { total: 15, used: 3, remaining: 12 },
        personalLeave: { total: 5, used: 0, remaining: 5 },
        maternityLeave: { total: 180, used: 0, remaining: 180 },
        emergencyLeave: { total: 10, used: 0, remaining: 10 }
      }
    ];

    setLeaveRequests(mockRequests);
    setLeaveBalances(mockBalances);
    setStats({
      totalRequests: 5,
      pendingApproval: 2,
      approved: 2,
      rejected: 1,
      averageProcessingTime: 1.2
    });
  }, []);

  const handleRequestSelection = (requestId: string) => {
    const newSelection = new Set(selectedRequests);
    if (newSelection.has(requestId)) {
      newSelection.delete(requestId);
    } else {
      newSelection.add(requestId);
    }
    setSelectedRequests(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedRequests.size === leaveRequests.length) {
      setSelectedRequests(new Set());
    } else {
      setSelectedRequests(new Set(leaveRequests.map(r => r.id)));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock3 className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'annual': return 'text-blue-600 bg-blue-100';
      case 'sick': return 'text-red-600 bg-red-100';
      case 'maternity': return 'text-pink-600 bg-pink-100';
      case 'personal': return 'text-purple-600 bg-purple-100';
      case 'emergency': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leave Management</h2>
          <p className="text-gray-600">Manage employee leave requests and balances</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsNewRequestOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            New Request
          </button>
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingApproval}</p>
            </div>
            <Clock3 className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Processing</p>
              <p className="text-2xl font-bold text-blue-600">{stats.averageProcessingTime}d</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Leave Requests
            </button>
            <button
              onClick={() => setActiveTab('balances')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'balances'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Leave Balances
            </button>
          </nav>
        </div>

        {/* Filters Panel */}
        {isFilterPanelOpen && (
          <div className="p-4 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select
                  value={filters.leaveType}
                  onChange={(e) => setFilters({...filters, leaveType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="maternity">Maternity Leave</option>
                  <option value="personal">Personal Leave</option>
                  <option value="emergency">Emergency Leave</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Employee</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={filters.employee}
                    onChange={(e) => setFilters({...filters, employee: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {activeTab === 'requests' ? (
            /* Leave Requests Table */
            <div className="overflow-x-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Leave Requests</h3>
                <div className="flex gap-2">
                  {selectedRequests.size > 0 && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {selectedRequests.size} selected
                    </span>
                  )}
                </div>
              </div>
              
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedRequests.size === leaveRequests.length}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Employee</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Leave Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Dates</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Days</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Submitted</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leaveRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRequests.has(request.id)}
                          onChange={() => handleRequestSelection(request.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{request.employeeName}</p>
                          <p className="text-sm text-gray-500">{request.department}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(request.leaveType)}`}>
                          {request.leaveType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {request.startDate} - {request.endDate}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{request.days} days</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          {request.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{request.submittedDate}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          {request.status === 'pending' && (
                            <>
                              <button className="p-1 text-gray-400 hover:text-green-600">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-red-600">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Leave Balances Table */
            <div className="overflow-x-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Balances</h3>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Employee</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Annual Leave</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Sick Leave</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Personal Leave</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Maternity Leave</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Emergency Leave</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leaveBalances.map((balance) => (
                    <tr key={balance.employeeId} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900">{balance.employeeName}</p>
                          <p className="text-sm text-gray-500">{balance.employeeId}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <p className="text-gray-700">{balance.annualLeave.remaining}/{balance.annualLeave.total}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(balance.annualLeave.remaining / balance.annualLeave.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <p className="text-gray-700">{balance.sickLeave.remaining}/{balance.sickLeave.total}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-red-600 h-2 rounded-full" 
                              style={{ width: `${(balance.sickLeave.remaining / balance.sickLeave.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <p className="text-gray-700">{balance.personalLeave.remaining}/{balance.personalLeave.total}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${(balance.personalLeave.remaining / balance.personalLeave.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <p className="text-gray-700">{balance.maternityLeave.remaining}/{balance.maternityLeave.total}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-pink-600 h-2 rounded-full" 
                              style={{ width: `${(balance.maternityLeave.remaining / balance.maternityLeave.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <p className="text-gray-700">{balance.emergencyLeave.remaining}/{balance.emergencyLeave.total}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-orange-600 h-2 rounded-full" 
                              style={{ width: `${(balance.emergencyLeave.remaining / balance.emergencyLeave.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* New Leave Request Modal */}
      {isNewRequestOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">New Leave Request</h3>
              <button
                onClick={() => setIsNewRequestOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Select Employee</option>
                  <option>Dr. Sarah Johnson</option>
                  <option>Ahmed Al-Mansouri</option>
                  <option>Maria Rodriguez</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Select Leave Type</option>
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal Leave</option>
                  <option value="emergency">Emergency Leave</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  rows={3}
                  placeholder="Please provide a reason for the leave request..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsNewRequestOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement; 