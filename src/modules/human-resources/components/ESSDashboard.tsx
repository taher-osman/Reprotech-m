import React, { useState, useEffect } from 'react';
import {
  User,
  Calendar,
  Clock,
  FileText,
  Download,
  Upload,
  Bell,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  Shield,
  TrendingUp,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { 
  ESSDashboardStats, 
  EmployeeRequest, 
  EmployeeDocument,
  LeaveCalendar 
} from '../types/hrTypes';
import { hrWorkflowEngine } from '../services/HRWorkflowEngine';

const ESSDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState<ESSDashboardStats | null>(null);
  const [myRequests, setMyRequests] = useState<EmployeeRequest[]>([]);
  const [myDocuments, setMyDocuments] = useState<EmployeeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<EmployeeRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock current employee ID - in real app would come from auth context
  const currentEmployeeId = 'EMP-001';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load dashboard statistics
      const mockStats: ESSDashboardStats = {
        personalInfo: {
          name: 'Ahmed Al-Mansouri',
          employeeId: 'EMP-001',
          department: 'Information Technology',
          position: 'Senior Developer',
          profileCompleteness: 95,
          photo: undefined
        },
        quickStats: {
          pendingRequests: 2,
          approvedRequests: 8,
          rejectedRequests: 1,
          documentsReady: 3,
          upcomingRenewals: 2
        },
        leaveBalance: {
          annual: 18,
          sick: 5,
          emergency: 2,
          used: 7,
          pending: 3
        },
        upcomingEvents: {
          contractExpiry: '2025-12-31',
          visaExpiry: '2025-08-15',
          idExpiry: '2026-05-20',
          appraisalDue: '2025-03-15'
        },
        recentActivity: [
          {
            type: 'Request Approved',
            description: 'Salary Certificate request approved',
            date: '2025-01-02',
            status: 'approved'
          },
          {
            type: 'Document Ready',
            description: 'Annual leave certificate generated',
            date: '2025-01-01',
            status: 'completed'
          },
          {
            type: 'Request Submitted',
            description: 'Medical reimbursement request submitted',
            date: '2024-12-30',
            status: 'pending'
          }
        ]
      };

      setDashboardStats(mockStats);

      // Load employee requests
      const requests = hrWorkflowEngine.getEmployeeRequests(currentEmployeeId);
      setMyRequests(requests);

      // Load employee documents (mock data)
      const mockDocuments: EmployeeDocument[] = [
        {
          id: 'DOC-001',
          employeeId: currentEmployeeId,
          categoryId: 'contracts',
          documentName: 'Employment Contract',
          documentType: 'PDF',
          fileUrl: '/documents/contract-emp-001.pdf',
          uploadDate: '2024-01-15',
          expiryDate: '2025-12-31',
          isVerified: true,
          verifiedBy: 'HR Manager',
          verificationDate: '2024-01-16',
          accessCount: 5,
          lastAccessed: '2024-12-15',
          tags: ['contract', 'official'],
          version: 1,
          isConfidential: false,
          downloadAllowed: true,
          printAllowed: true
        },
        {
          id: 'DOC-002',
          employeeId: currentEmployeeId,
          categoryId: 'certificates',
          documentName: 'Salary Certificate',
          documentType: 'PDF',
          fileUrl: '/documents/salary-cert-emp-001.pdf',
          uploadDate: '2025-01-02',
          isVerified: true,
          verifiedBy: 'HR System',
          verificationDate: '2025-01-02',
          accessCount: 2,
          tags: ['certificate', 'salary'],
          version: 1,
          isConfidential: false,
          downloadAllowed: true,
          printAllowed: true
        },
        {
          id: 'DOC-003',
          employeeId: currentEmployeeId,
          categoryId: 'payslips',
          documentName: 'December 2024 Payslip',
          documentType: 'PDF',
          fileUrl: '/documents/payslip-dec-2024.pdf',
          uploadDate: '2024-12-31',
          isVerified: true,
          verifiedBy: 'Payroll System',
          verificationDate: '2024-12-31',
          accessCount: 1,
          tags: ['payslip', 'salary'],
          version: 1,
          isConfidential: true,
          downloadAllowed: true,
          printAllowed: false
        }
      ];

      setMyDocuments(mockDocuments);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
      case 'in review':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      case 'in review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = myRequests.filter(request => {
    const matchesSearch = request.requestType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || request.approvalStatus.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome back, {dashboardStats?.personalInfo.name}! 👋
              </h2>
              <p className="text-gray-600">
                {dashboardStats?.personalInfo.position} • {dashboardStats?.personalInfo.department}
              </p>
              <p className="text-sm text-blue-600">
                Employee ID: {dashboardStats?.personalInfo.employeeId}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {dashboardStats?.personalInfo.profileCompleteness}%
            </div>
            <div className="text-sm text-gray-500">Profile Complete</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-yellow-200">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-yellow-600">
                {dashboardStats?.quickStats.pendingRequests}
              </div>
              <div className="text-sm text-gray-600">Pending Requests</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-green-200">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-green-600">
                {dashboardStats?.quickStats.approvedRequests}
              </div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-200">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-blue-600">
                {dashboardStats?.quickStats.documentsReady}
              </div>
              <div className="text-sm text-gray-600">Documents Ready</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-200">
          <div className="flex items-center">
            <Bell className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-orange-600">
                {dashboardStats?.quickStats.upcomingRenewals}
              </div>
              <div className="text-sm text-gray-600">Renewals Due</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-purple-200">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-purple-600">
                {dashboardStats?.leaveBalance.annual}
              </div>
              <div className="text-sm text-gray-600">Leave Days Left</div>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Balance & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leave Balance */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Leave Balance
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Annual Leave</span>
              <span className="font-semibold text-blue-600">
                {dashboardStats?.leaveBalance.annual} days
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sick Leave</span>
              <span className="font-semibold text-green-600">
                {dashboardStats?.leaveBalance.sick} days
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Emergency Leave</span>
              <span className="font-semibold text-orange-600">
                {dashboardStats?.leaveBalance.emergency} days
              </span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Used This Year</span>
                <span className="font-semibold text-gray-900">
                  {dashboardStats?.leaveBalance.used} days
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-orange-600" />
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {dashboardStats?.upcomingEvents.contractExpiry && (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <div className="font-medium text-red-800">Contract Expiry</div>
                  <div className="text-sm text-red-600">{dashboardStats.upcomingEvents.contractExpiry}</div>
                </div>
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            )}
            {dashboardStats?.upcomingEvents.visaExpiry && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <div className="font-medium text-yellow-800">Visa Expiry</div>
                  <div className="text-sm text-yellow-600">{dashboardStats.upcomingEvents.visaExpiry}</div>
                </div>
                <Shield className="w-5 h-5 text-yellow-600" />
              </div>
            )}
            {dashboardStats?.upcomingEvents.appraisalDue && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-medium text-blue-800">Appraisal Due</div>
                  <div className="text-sm text-blue-600">{dashboardStats.upcomingEvents.appraisalDue}</div>
                </div>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <RefreshCw className="w-5 h-5 mr-2 text-green-600" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {dashboardStats?.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                {getStatusIcon(activity.status)}
                <div>
                  <div className="font-medium text-gray-900">{activity.type}</div>
                  <div className="text-sm text-gray-600">{activity.description}</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">{activity.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRequestsTab = () => (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Requests</h2>
          <p className="text-gray-600">Manage your HR requests and track their status</p>
        </div>
        <button
          onClick={() => setShowRequestModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Request</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search requests..."
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
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {filteredRequests.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <div key={request.requestId} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.requestType}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.approvalStatus)}`}>
                        {getStatusIcon(request.approvalStatus)}
                        <span className="ml-1">{request.approvalStatus}</span>
                      </span>
                      {request.urgency === 'High' || request.urgency === 'Critical' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {request.urgency}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{request.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Submitted: {new Date(request.dateSubmitted).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Stage: {request.workflowStage}</span>
                      {request.currentApprover && (
                        <>
                          <span>•</span>
                          <span>Current Approver: {request.currentApprover}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-1"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Requests Found</h3>
            <p className="text-gray-500 mb-4">You haven't submitted any requests yet.</p>
            <button
              onClick={() => setShowRequestModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Submit Your First Request
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Documents</h2>
        <p className="text-gray-600">Access and download your official documents</p>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myDocuments.map((document) => (
          <div key={document.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{document.documentName}</h3>
                  <p className="text-sm text-gray-500">{document.documentType}</p>
                </div>
              </div>
              {document.isVerified && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div>Uploaded: {new Date(document.uploadDate).toLocaleDateString()}</div>
              {document.expiryDate && (
                <div>Expires: {new Date(document.expiryDate).toLocaleDateString()}</div>
              )}
              <div>Downloads: {document.accessCount}</div>
            </div>

            <div className="flex space-x-2">
              {document.downloadAllowed && (
                <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-1">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              )}
              <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
        <p className="text-gray-600">View and update your personal information</p>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Personal Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="mt-1 text-gray-900">{dashboardStats?.personalInfo.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                <div className="mt-1 text-gray-900">{dashboardStats?.personalInfo.employeeId}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <div className="mt-1 text-gray-900">{dashboardStats?.personalInfo.department}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <div className="mt-1 text-gray-900">{dashboardStats?.personalInfo.position}</div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-green-600" />
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Email</div>
                  <div className="text-gray-900">ahmed.almansouri@company.com</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Phone</div>
                  <div className="text-gray-900">+966 50 123 4567</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-700">Address</div>
                  <div className="text-gray-900">Riyadh, Saudi Arabia</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Update Profile</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'requests', name: 'My Requests', icon: FileText },
    { id: 'documents', name: 'Documents', icon: Download },
    { id: 'profile', name: 'Profile', icon: Edit }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employee Self-Service</h1>
              <p className="text-sm text-gray-600">Manage your HR needs efficiently</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
              </button>
              <button 
                onClick={loadDashboardData}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'requests' && renderRequestsTab()}
          {activeTab === 'documents' && renderDocumentsTab()}
          {activeTab === 'profile' && renderProfileTab()}
        </div>
      </div>
    </div>
  );
};

export default ESSDashboard; 