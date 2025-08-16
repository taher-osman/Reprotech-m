import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  Calendar, 
  TrendingUp, 
  FileText, 
  Plus, 
  Download, 
  Upload,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Activity,
  Zap,
  Award,
  Thermometer,
  Eye,
  BarChart3,
  Edit
} from 'lucide-react';
import { 
  TransferRecord, 
  RecipientRecord, 
  TransferDashboardStats,
  TransferAnalytics,
  TRANSFER_METHODS,
  EMBRYO_STAGES,
  PREGNANCY_STATUSES
} from '../types/transferTypes';
import api from '../services/api';
import AdvancedAnalytics from '../components/AdvancedAnalytics';
import TransferForm from '../components/TransferForm';
import RecipientManagement from '../components/RecipientManagement';

const EmbryoTransferPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transfers, setTransfers] = useState<TransferRecord[]>([]);
  const [recipients, setRecipients] = useState<RecipientRecord[]>([]);
  const [stats, setStats] = useState<TransferDashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<TransferAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<any>({});
  
  // Transfer Form State
  const [isTransferFormOpen, setIsTransferFormOpen] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<TransferRecord | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transfersData, recipientsData, statsData, analyticsData] = await Promise.all([
        api.getTransfers(),
        api.getRecipients(), 
        api.getTransferStats(),
        api.getTransferAnalytics()
      ]);
      
      // Extract the arrays from the response objects
      setTransfers(transfersData?.transfers || []);
      setRecipients(recipientsData?.recipients || []);
      setStats(statsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading transfer data:', error);
      // Set empty arrays as fallback
      setTransfers([]);
      setRecipients([]);
    } finally {
      setLoading(false);
    }
  };

  // Transfer Form Handlers
  const handleNewTransfer = () => {
    setEditingTransfer(null);
    setFormMode('create');
    setIsTransferFormOpen(true);
  };

  const handleEditTransfer = (transfer: TransferRecord) => {
    setEditingTransfer(transfer);
    setFormMode('edit');
    setIsTransferFormOpen(true);
  };

  const handleViewDetails = (transfer: TransferRecord) => {
    navigate(`/modules/embryo-transfer/transfer/${transfer.id}`);
  };

  const handleTransferFormClose = () => {
    setIsTransferFormOpen(false);
    setEditingTransfer(null);
  };

  const handleTransferFormSuccess = () => {
    loadData(); // Reload data after successful form submission
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, color: 'blue' },
    { id: 'transfers', label: 'Transfer Records', icon: Heart, color: 'pink' },
    { id: 'recipients', label: 'Recipients', icon: Users, color: 'purple' },
    { id: 'advanced-analytics', label: 'Advanced Analytics', icon: BarChart3, color: 'indigo' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, color: 'orange' }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Transfers</p>
              <p className="text-3xl font-bold">{stats?.totalTransfers || 0}</p>
              <p className="text-blue-100 text-sm mt-1">This Month</p>
            </div>
            <Heart className="h-12 w-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Success Rate</p>
              <p className="text-3xl font-bold">{stats?.currentSuccessRate || 0}%</p>
              <p className="text-green-100 text-sm mt-1">
                Target: {stats?.targetSuccessRate || 0}%
              </p>
            </div>
            <Target className="h-12 w-12 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Available Recipients</p>
              <p className="text-3xl font-bold">{stats?.availableRecipients || 0}</p>
              <p className="text-purple-100 text-sm mt-1">Ready for Transfer</p>
            </div>
            <Users className="h-12 w-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Follow-ups Due</p>
              <p className="text-3xl font-bold">{stats?.pendingFollowUps || 8}</p>
              <p className="text-orange-100 text-sm mt-1">Next 7 Days</p>
            </div>
            <Calendar className="h-12 w-12 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Customer Reports</p>
              <p className="text-3xl font-bold">{stats?.customerReportsNeeded || 5}</p>
              <p className="text-indigo-100 text-sm mt-1">60+ Days Due</p>
            </div>
            <Download className="h-12 w-12 text-indigo-200" />
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Award className="h-5 w-5 text-yellow-500 mr-2" />
            Performance Comparison
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Facility Success Rate</span>
              <span className="font-semibold text-green-600">{stats?.currentSuccessRate || 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Industry Average</span>
              <span className="font-semibold text-blue-600">{stats?.industryAverage || 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Target Goal</span>
              <span className="font-semibold text-purple-600">{stats?.targetSuccessRate || 0}%</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-medium">Performance Status</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  (stats?.currentSuccessRate || 0) >= (stats?.targetSuccessRate || 0) 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {(stats?.currentSuccessRate || 0) >= (stats?.targetSuccessRate || 0) ? 'Above Target' : 'Below Target'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Thermometer className="h-5 w-5 text-red-500 mr-2" />
            Quality Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Grade A Embryos</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${((stats?.gradeAEmbryos || 0) / (stats?.totalTransfers || 1)) * 100}%` }}
                  ></div>
                </div>
                <span className="font-semibold">{stats?.gradeAEmbryos || 0}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Grade B Embryos</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${((stats?.gradeBEmbryos || 0) / (stats?.totalTransfers || 1)) * 100}%` }}
                  ></div>
                </div>
                <span className="font-semibold">{stats?.gradeBEmbryos || 0}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Grade C Embryos</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${((stats?.gradeCEmbryos || 0) / (stats?.totalTransfers || 1)) * 100}%` }}
                  ></div>
                </div>
                <span className="font-semibold">{stats?.gradeCEmbryos || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="h-5 w-5 text-blue-500 mr-2" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium">Transfer ET-2025-001 Completed</p>
                <p className="text-xs text-gray-500">2 hours ago • Dr. Johnson</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm font-medium">Pregnancy Check Due</p>
                <p className="text-xs text-gray-500">Tomorrow • Recipient R-245</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <Heart className="h-5 w-5 text-pink-500 mr-3" />
              <div>
                <p className="text-sm font-medium">New Recipient Synchronized</p>
                <p className="text-xs text-gray-500">6 hours ago • Holstein #347</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            Alerts & Follow-ups
          </h3>
          <div className="space-y-3">
            {stats?.urgentFollowUps && stats.urgentFollowUps > 0 && (
              <div className="flex items-center p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    {stats.urgentFollowUps} Urgent Follow-ups Required
                  </p>
                  <p className="text-xs text-red-600">Immediate attention needed</p>
                </div>
              </div>
            )}
            {stats?.overdueCheckups && stats.overdueCheckups > 0 && (
              <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                <Clock className="h-5 w-5 text-orange-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-orange-800">
                    {stats.overdueCheckups} Overdue Checkups
                  </p>
                  <p className="text-xs text-orange-600">Schedule pregnancy checks</p>
                </div>
              </div>
            )}
            {(!stats?.urgentFollowUps && !stats?.overdueCheckups) && (
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-800">All Systems Normal</p>
                  <p className="text-xs text-green-600">No urgent actions required</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTransferRecords = () => (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by internal number, donor, sire, recipient, embryo ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
            <button 
              onClick={handleNewTransfer}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Transfer
            </button>
          </div>
        </div>
      </div>

      {/* Transfer Records Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Transfer Records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Internal Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transfer Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor & Sire
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Embryo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pregnancy Age
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Follow-up
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
              {Array.isArray(transfers) && transfers.length > 0 ? transfers.slice(0, 10).map((transfer) => (
                <tr key={transfer.id} className="hover:bg-gray-50">
                  {/* Internal Number */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-900">{transfer.internalNumber}</div>
                    <div className="text-xs text-gray-500">{transfer.transferId}</div>
                  </td>
                  
                  {/* Transfer Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(transfer.transferDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">{transfer.transferTime}</div>
                  </td>
                  
                  {/* Donor & Sire */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">D:</span> {transfer.donorInternalNumber}
                    </div>
                    <div className="text-xs text-gray-500">{transfer.donorName} • {transfer.donorBreed}</div>
                    <div className="text-sm text-gray-900 mt-1">
                      <span className="font-medium">S:</span> {transfer.sireInternalNumber}
                    </div>
                    <div className="text-xs text-gray-500">{transfer.sireName} • {transfer.sireBreed}</div>
                  </td>
                  
                  {/* Embryo */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transfer.embryoId}</div>
                    <div className="text-xs text-gray-500">
                      Grade {transfer.embryoGrade} • Day {transfer.embryoDay}
                    </div>
                    <div className="text-xs text-gray-500">{transfer.embryoStage}</div>
                  </td>
                  
                  {/* Recipient */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{transfer.recipientInternalNumber}</div>
                    <div className="text-xs text-gray-500">{transfer.recipientName}</div>
                    <div className="text-xs text-gray-500">{transfer.recipientBreed}</div>
                  </td>
                  
                  {/* Pregnancy Age */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {transfer.pregnancyAge} days
                    </div>
                    <div className="text-xs text-gray-500">
                      (T+8)
                    </div>
                  </td>
                  
                  {/* Next Follow-up */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {transfer.nextFollowUp ? (
                      <div className="text-sm text-gray-900">
                        {new Date(transfer.nextFollowUp).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Completed</span>
                    )}
                    <div className="text-xs text-gray-500">
                      {transfer.nextFollowUp && (
                        <>Day {Math.ceil((new Date(transfer.nextFollowUp).getTime() - new Date(transfer.transferDate).getTime()) / (1000 * 60 * 60 * 24))}</>
                      )}
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transfer.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      transfer.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      transfer.status === 'SCHEDULED' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {transfer.status}
                    </span>
                    {transfer.pregnancyStatus && (
                      <div className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transfer.pregnancyStatus === 'PREGNANT' ? 'bg-green-100 text-green-800' :
                          transfer.pregnancyStatus === 'OPEN' ? 'bg-red-100 text-red-800' :
                          transfer.pregnancyStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {transfer.pregnancyStatus}
                        </span>
                      </div>
                    )}
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewDetails(transfer)}
                        className="text-blue-600 hover:text-blue-900" 
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditTransfer(transfer)}
                        className="text-green-600 hover:text-green-900" 
                        title="Edit Transfer"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {transfer.needsCustomerReport && (
                        <button 
                          className={`${
                            transfer.customerReportSent 
                              ? 'text-green-600 hover:text-green-900' 
                              : 'text-orange-600 hover:text-orange-900 animate-pulse'
                          }`}
                          title={transfer.customerReportSent ? 'Report Sent' : 'Send Customer Report (60+ days)'}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Heart className="h-8 w-8 text-gray-300 mb-2" />
                      <p>No transfer records found</p>
                      <p className="text-sm">Start by creating your first embryo transfer</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPlaceholderTab = (title: string, description: string) => (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <div className="max-w-md mx-auto">
        <Zap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Coming Soon
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <div className="bg-pink-100 p-3 rounded-lg mr-4">
              <Heart className="h-8 w-8 text-pink-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Embryo Transfer Management</h1>
              <p className="text-gray-600 mt-1">Advanced transfer procedures and recipient management</p>
              <div className="flex items-center mt-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  PHASE 3
                </span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full ml-2">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button 
              onClick={handleNewTransfer}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Transfer
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <nav className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center px-4 py-4 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? `border-${tab.color}-500 text-${tab.color}-600 bg-${tab.color}-50`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'transfers' && renderTransferRecords()}
          {activeTab === 'recipients' && <RecipientManagement />}
          {activeTab === 'advanced-analytics' && <AdvancedAnalytics />}
          {activeTab === 'schedule' && renderPlaceholderTab(
            'Transfer Schedule', 
            'Calendar view of upcoming transfers and pregnancy checks'
          )}
        </div>
      </div>

      {/* Transfer Form Modal */}
      <TransferForm
        isOpen={isTransferFormOpen}
        onClose={handleTransferFormClose}
        onSuccess={handleTransferFormSuccess}
        transfer={editingTransfer}
        mode={formMode}
      />
    </div>
  );
}; 
export default EmbryoTransferPage;

