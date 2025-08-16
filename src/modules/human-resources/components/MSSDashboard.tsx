import React, { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
  TrendingUp,
  BarChart3,
  Filter,
  Search,
  Eye,
  MessageSquare,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Award,
  RefreshCw,
  Settings,
  ArrowRight,
  FileText,
  Bell,
  Zap
} from 'lucide-react';
import { 
  MSSDashboardStats, 
  TeamMemberSummary, 
  EmployeeRequest,
  ApprovalDelegation 
} from '../types/hrTypes';
import { hrWorkflowEngine } from '../services/HRWorkflowEngine';

const MSSDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardStats, setDashboardStats] = useState<MSSDashboardStats | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMemberSummary[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<EmployeeRequest[]>([]);
  const [teamRequests, setTeamRequests] = useState<EmployeeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<EmployeeRequest | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDelegationModal, setShowDelegationModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock current manager ID
  const currentManagerId = 'MGR-001';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load dashboard statistics
      const mockStats: MSSDashboardStats = {
        teamOverview: {
          totalSubordinates: 12,
          presentToday: 10,
          onLeave: 2,
          pendingApprovals: 5,
          overdueApprovals: 1
        },
        approvalQueue: {
          urgent: 2,
          normal: 3,
          low: 1,
          delegated: 0
        },
        teamPerformance: {
          attendanceRate: 94.5,
          leaveUtilization: 65.2,
          requestResponseTime: 18.5,
          complianceScore: 98.2
        },
        upcomingDeadlines: {
          contractExpiries: 3,
          visaRenewals: 5,
          appraisalsDue: 4,
          trainingRequired: 2
        }
      };

      setDashboardStats(mockStats);

      // Load team members
      const mockTeamMembers: TeamMemberSummary[] = [
        {
          employeeId: 'EMP-001',
          name: 'Ahmed Al-Mansouri',
          position: 'Senior Developer',
          status: 'Present',
          attendanceRate: 96.5,
          pendingRequests: 1,
          lastActivity: '2025-01-02',
          photo: undefined,
          contactInfo: {
            email: 'ahmed.almansouri@company.com',
            phone: '+966 50 123 4567'
          },
          upcomingEvents: [
            { type: 'Appraisal', date: '2025-03-15', description: 'Annual performance review' }
          ]
        },
        {
          employeeId: 'EMP-002',
          name: 'Fatima Hassan',
          position: 'UI/UX Designer',
          status: 'Leave',
          attendanceRate: 92.8,
          pendingRequests: 0,
          lastActivity: '2024-12-30',
          contactInfo: {
            email: 'fatima.hassan@company.com',
            phone: '+966 55 987 6543'
          },
          upcomingEvents: [
            { type: 'Training', date: '2025-02-10', description: 'Design system workshop' }
          ]
        },
        {
          employeeId: 'EMP-003',
          name: 'Mohammed Al-Rashid',
          position: 'Backend Developer',
          status: 'Present',
          attendanceRate: 94.2,
          pendingRequests: 2,
          lastActivity: '2025-01-02',
          contactInfo: {
            email: 'mohammed.alrashid@company.com',
            phone: '+966 56 456 7890'
          },
          upcomingEvents: [
            { type: 'Contract Renewal', date: '2025-06-30', description: 'Contract expires' }
          ]
        }
      ];

      setTeamMembers(mockTeamMembers);

      // Load pending approvals (mock data for now)
      const mockPendingApprovals: EmployeeRequest[] = [
        {
          requestId: 'REQ-001',
          employeeId: 'EMP-001',
          employeeName: 'Ahmed Al-Mansouri',
          dateSubmitted: new Date('2025-01-02'),
          requestType: 'Leave',
          subType: 'Annual Leave',
          description: 'Annual leave for family vacation to Dubai',
          urgency: 'Medium',
          requestedDates: {
            startDate: '2025-02-15',
            endDate: '2025-02-22',
            totalDays: 7
          },
          approvers: [],
          currentApprover: currentManagerId,
          approvalStatus: 'Pending',
          approvalLog: [],
          executionStatus: 'Not Started',
          workflowStage: 'Manager Review',
          autoEscalation: {
            enabled: true,
            escalateAfterHours: 48,
            nextEscalationLevel: 'Department Manager',
            escalationHistory: []
          },
          tags: ['LEAVE_REQUEST'],
          budgetApprovalRequired: false,
          createdAt: '2025-01-02T10:00:00Z',
          updatedAt: '2025-01-02T10:00:00Z'
        },
        {
          requestId: 'REQ-002',
          employeeId: 'EMP-003',
          employeeName: 'Mohammed Al-Rashid',
          dateSubmitted: new Date('2025-01-01'),
          requestType: 'Medical Reimbursement',
          description: 'Dental treatment expenses',
          urgency: 'High',
          requestedAmount: 2500,
          documentAttachment: [
            {
              fileName: 'dental_receipt.pdf',
              fileUrl: '/documents/dental_receipt.pdf',
              fileType: 'PDF',
              uploadDate: '2025-01-01'
            }
          ],
          approvers: [],
          currentApprover: currentManagerId,
          approvalStatus: 'Pending',
          approvalLog: [],
          executionStatus: 'Not Started',
          workflowStage: 'Manager Review',
          autoEscalation: {
            enabled: true,
            escalateAfterHours: 72,
            nextEscalationLevel: 'Department Manager',
            escalationHistory: []
          },
          tags: ['HIGH_VALUE'],
          budgetApprovalRequired: true,
          createdAt: '2025-01-01T14:30:00Z',
          updatedAt: '2025-01-01T14:30:00Z'
        }
      ];

      setPendingApprovals(mockPendingApprovals);

      // Load all team requests
      const allTeamRequests = hrWorkflowEngine.getTeamRequests(currentManagerId);
      setTeamRequests(allTeamRequests);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalAction = async (requestId: string, action: 'Approved' | 'Rejected', comments?: string) => {
    try {
      await hrWorkflowEngine.processApproval(requestId, currentManagerId, action, comments);
      await loadDashboardData(); // Refresh data
      setShowApprovalModal(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error processing approval:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return <UserCheck className="w-4 h-4 text-green-600" />;
      case 'leave':
        return <Calendar className="w-4 h-4 text-yellow-600" />;
      case 'sick':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'travel':
        return <MapPin className="w-4 h-4 text-blue-600" />;
      default:
        return <UserX className="w-4 h-4 text-gray-600" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApprovals = pendingApprovals.filter(request => {
    const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUrgency = filterUrgency === 'all' || request.urgency.toLowerCase() === filterUrgency.toLowerCase();
    const matchesStatus = filterStatus === 'all' || request.approvalStatus.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesUrgency && matchesStatus;
  });

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Manager Dashboard 👨‍💼</h2>
            <p className="text-gray-600">Monitor your team's activities and approve requests efficiently</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">
              {dashboardStats?.teamOverview.totalSubordinates}
            </div>
            <div className="text-sm text-gray-500">Team Members</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-green-200">
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-green-600">
                {dashboardStats?.teamOverview.presentToday}
              </div>
              <div className="text-sm text-gray-600">Present Today</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-yellow-200">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-yellow-600">
                {dashboardStats?.teamOverview.onLeave}
              </div>
              <div className="text-sm text-gray-600">On Leave</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-200">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-orange-600">
                {dashboardStats?.teamOverview.pendingApprovals}
              </div>
              <div className="text-sm text-gray-600">Pending Approvals</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-red-200">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <div className="text-2xl font-bold text-red-600">
                {dashboardStats?.teamOverview.overdueApprovals}
              </div>
              <div className="text-sm text-gray-600">Overdue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Performance & Approval Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Performance */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
            Team Performance
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Attendance Rate</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${dashboardStats?.teamPerformance.attendanceRate}%` }}
                  ></div>
                </div>
                <span className="font-semibold text-green-600">
                  {dashboardStats?.teamPerformance.attendanceRate}%
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Leave Utilization</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${dashboardStats?.teamPerformance.leaveUtilization}%` }}
                  ></div>
                </div>
                <span className="font-semibold text-blue-600">
                  {dashboardStats?.teamPerformance.leaveUtilization}%
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg Response Time</span>
              <span className="font-semibold text-orange-600">
                {dashboardStats?.teamPerformance.requestResponseTime}h
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Compliance Score</span>
              <span className="font-semibold text-green-600">
                {dashboardStats?.teamPerformance.complianceScore}%
              </span>
            </div>
          </div>
        </div>

        {/* Approval Queue */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-orange-600" />
            Approval Queue
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-800">Urgent</span>
              </div>
              <span className="text-2xl font-bold text-red-600">
                {dashboardStats?.approvalQueue.urgent}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Normal</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">
                {dashboardStats?.approvalQueue.normal}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Low Priority</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {dashboardStats?.approvalQueue.low}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Bell className="w-5 h-5 mr-2 text-red-600" />
          Upcoming Deadlines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {dashboardStats?.upcomingDeadlines.contractExpiries}
            </div>
            <div className="text-sm text-red-700">Contract Expiries</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {dashboardStats?.upcomingDeadlines.visaRenewals}
            </div>
            <div className="text-sm text-yellow-700">Visa Renewals</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {dashboardStats?.upcomingDeadlines.appraisalsDue}
            </div>
            <div className="text-sm text-blue-700">Appraisals Due</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {dashboardStats?.upcomingDeadlines.trainingRequired}
            </div>
            <div className="text-sm text-purple-700">Training Required</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeamTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Team Overview</h2>
        <p className="text-gray-600">Monitor your team members' status and performance</p>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <div key={member.employeeId} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.position}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {getStatusIcon(member.status)}
                <span className="text-sm font-medium text-gray-700">{member.status}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Attendance Rate</span>
                <span className="text-sm font-semibold text-green-600">
                  {member.attendanceRate}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Requests</span>
                <span className="text-sm font-semibold text-orange-600">
                  {member.pendingRequests}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Activity</span>
                <span className="text-sm text-gray-700">
                  {new Date(member.lastActivity).toLocaleDateString()}
                </span>
              </div>
            </div>

            {member.upcomingEvents.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Upcoming Events</h4>
                {member.upcomingEvents.map((event, index) => (
                  <div key={index} className="text-xs text-gray-600 mb-1">
                    <span className="font-medium">{event.type}</span> - {event.date}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm">
                View Details
              </button>
              <button className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApprovalsTab = () => (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2>
          <p className="text-gray-600">Review and approve your team's requests</p>
        </div>
        <button
          onClick={() => setShowDelegationModal(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
        >
          <Settings className="w-4 h-4" />
          <span>Setup Delegation</span>
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
          value={filterUrgency}
          onChange={(e) => setFilterUrgency(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Urgency</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in review">In Review</option>
        </select>
      </div>

      {/* Approvals List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {filteredApprovals.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredApprovals.map((request) => (
              <div key={request.requestId} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {request.requestType}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency}
                      </span>
                      {request.budgetApprovalRequired && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Budget Approval
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{request.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>From: <strong>{request.employeeName}</strong></span>
                      <span>•</span>
                      <span>Submitted: {new Date(request.dateSubmitted).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>Stage: {request.workflowStage}</span>
                      {request.requestedAmount && (
                        <>
                          <span>•</span>
                          <span>Amount: <strong>SAR {request.requestedAmount.toLocaleString()}</strong></span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowApprovalModal(true);
                      }}
                      className="bg-green-100 text-green-700 px-3 py-2 rounded-lg hover:bg-green-200 flex items-center space-x-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleApprovalAction(request.requestId, 'Rejected', 'Declined by manager')}
                      className="bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 flex items-center space-x-1"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Pending Approvals</h3>
            <p className="text-gray-500">You're all caught up! No requests waiting for your approval.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Team Analytics</h2>
        <p className="text-gray-600">Detailed analytics and insights about your team</p>
      </div>

      {/* Analytics coming soon placeholder */}
      <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Advanced Analytics Coming Soon</h3>
        <p className="text-gray-500 mb-6">
          Get detailed insights into team performance, attendance patterns, and productivity metrics.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="bg-gray-50 p-4 rounded-lg">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Performance Trends</h4>
            <p className="text-sm text-gray-600">Track team performance over time</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Attendance Patterns</h4>
            <p className="text-sm text-gray-600">Analyze attendance and leave patterns</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Productivity Metrics</h4>
            <p className="text-sm text-gray-600">Measure and improve productivity</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Approval Modal
  const ApprovalModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Review Request</h3>
          <p className="text-gray-600">Review and approve this request</p>
        </div>
        
        {selectedRequest && (
          <div className="p-6 space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">Request Details</h4>
              <div className="mt-2 space-y-2 text-sm">
                <div><strong>Type:</strong> {selectedRequest.requestType}</div>
                <div><strong>Employee:</strong> {selectedRequest.employeeName}</div>
                <div><strong>Description:</strong> {selectedRequest.description}</div>
                {selectedRequest.requestedAmount && (
                  <div><strong>Amount:</strong> SAR {selectedRequest.requestedAmount.toLocaleString()}</div>
                )}
                {selectedRequest.requestedDates && (
                  <div>
                    <strong>Dates:</strong> {selectedRequest.requestedDates.startDate} to {selectedRequest.requestedDates.endDate}
                    ({selectedRequest.requestedDates.totalDays} days)
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments (Optional)
              </label>
              <textarea
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any comments or notes..."
              />
            </div>
          </div>
        )}
        
        <div className="p-6 border-t flex space-x-3 justify-end">
          <button
            onClick={() => {
              setShowApprovalModal(false);
              setSelectedRequest(null);
            }}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => handleApprovalAction(selectedRequest?.requestId || '', 'Rejected', 'Rejected by manager')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reject
          </button>
          <button
            onClick={() => handleApprovalAction(selectedRequest?.requestId || '', 'Approved', 'Approved by manager')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Users },
    { id: 'team', name: 'Team Members', icon: UserCheck },
    { id: 'approvals', name: 'Approvals', icon: CheckCircle },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manager Self-Service</h1>
              <p className="text-sm text-gray-600">Manage your team and approve requests</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                {dashboardStats?.teamOverview.pendingApprovals > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {dashboardStats.teamOverview.pendingApprovals}
                  </span>
                )}
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
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                  {tab.id === 'approvals' && dashboardStats?.teamOverview.pendingApprovals > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {dashboardStats.teamOverview.pendingApprovals}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'team' && renderTeamTab()}
          {activeTab === 'approvals' && renderApprovalsTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
        </div>
      </div>

      {/* Modals */}
      {showApprovalModal && <ApprovalModal />}
    </div>
  );
};

export default MSSDashboard; 