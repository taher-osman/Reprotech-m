import React, { useState, useEffect } from 'react';
import { 
  TestTube, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  Users,
  Microscope,
  FlaskConical,
  Zap,
  Brain,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
  Download,
  Upload,
  RefreshCw,
  BarChart3
} from 'lucide-react';

import { 
  FertilizationSession,
  FertilizationSetupData,
  DevelopmentTrackingData,
  EmbryoGenerationData,
  FertilizationStats,
  EmbryoSummary,
  FertilizationSessionStatus
} from '../types/fertilizationTypes';
import { FertilizationType } from '../../sample-management/types/sampleTypes';
import { fertilizationApi } from '../services/fertilizationApi';
import { formatSessionId, formatDate, getStatusColor, validateFertilizationSetup } from '../utils/fertilizationUtils';

// Component imports
import SampleSelectionModal from '../components/SampleSelectionModal';
import FertilizationSetupForm from '../components/FertilizationSetupForm';
import DevelopmentTrackingPanel from '../components/DevelopmentTrackingPanel';
import EmbryoGenerationPanel from '../components/EmbryoGenerationPanel';
import FertilizationAnalytics from '../components/FertilizationAnalytics';
import AnalyticsDashboardPage from './AnalyticsDashboardPage';

const FertilizationPage: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sessions, setSessions] = useState<FertilizationSession[]>([]);
  const [stats, setStats] = useState<FertilizationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showSetupForm, setShowSetupForm] = useState(false);
  const [showSampleSelection, setShowSampleSelection] = useState(false);
  const [showDevelopmentTracking, setShowDevelopmentTracking] = useState(false);
  const [showEmbryoGeneration, setShowEmbryoGeneration] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Form states
  const [selectedSession, setSelectedSession] = useState<FertilizationSession | null>(null);
  const [fertilizationType, setFertilizationType] = useState<FertilizationType>('IVF');

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FertilizationSessionStatus | ''>('');
  const [dateFilter, setDateFilter] = useState('');
  const [technicianFilter, setTechnicianFilter] = useState('');

  useEffect(() => {
    fetchSessions();
    fetchStats();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await fertilizationApi.getSessions({
        search: searchTerm,
        status: statusFilter || undefined,
        date: dateFilter || undefined,
        technician: technicianFilter || undefined
      });
      setSessions(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch fertilization sessions');
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await fertilizationApi.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleCreateSession = async (setupData: FertilizationSetupData) => {
    try {
      const newSession = await fertilizationApi.createSession(setupData);
      setSessions(prev => [newSession, ...prev]);
      setShowSetupForm(false);
      await fetchStats();
    } catch (err) {
      setError('Failed to create fertilization session');
      console.error('Error creating session:', err);
    }
  };

  const handleUpdateDevelopment = async (sessionId: string, data: DevelopmentTrackingData) => {
    try {
      const updatedSession = await fertilizationApi.updateDevelopment(sessionId, data);
      setSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s));
      setShowDevelopmentTracking(false);
      await fetchStats();
    } catch (err) {
      setError('Failed to update development tracking');
      console.error('Error updating development:', err);
    }
  };

  const handleGenerateEmbryos = async (sessionId: string, data: EmbryoGenerationData) => {
    try {
      const result = await fertilizationApi.generateEmbryos(sessionId, data);
      setSessions(prev => prev.map(s => s.id === sessionId ? result.session : s));
      setShowEmbryoGeneration(false);
      await fetchStats();
    } catch (err) {
      setError('Failed to generate embryos');
      console.error('Error generating embryos:', err);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = searchTerm === '' || 
      session.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.technician.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || session.status === statusFilter;
    const matchesDate = dateFilter === '' || session.fertilizationDate.includes(dateFilter);
    const matchesTechnician = technicianFilter === '' || session.technician === technicianFilter;

    return matchesSearch && matchesStatus && matchesDate && matchesTechnician;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TestTube className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalSessions || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.averageSuccessRate || 0}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FlaskConical className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Embryos Created</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalEmbryosCreated || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Quality Score</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.averageQualityScore || 0}/10</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowSetupForm(true)}
            className="flex items-center justify-center p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <Plus className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-blue-600 font-medium">New IVF Session</span>
          </button>
          <button
            onClick={() => {
              setFertilizationType('ICSI');
              setShowSetupForm(true);
            }}
            className="flex items-center justify-center p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
          >
            <Microscope className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-600 font-medium">New ICSI Session</span>
          </button>
          <button
            onClick={() => {
              setFertilizationType('SCNT');
              setShowSetupForm(true);
            }}
            className="flex items-center justify-center p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors"
          >
            <Brain className="h-5 w-5 text-purple-600 mr-2" />
            <span className="text-purple-600 font-medium">New SCNT Session</span>
          </button>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Sessions</h3>
        </div>
        <div className="p-6">
          {sessions.filter(Boolean).slice(0, 5).map((session) => (
            <div key={session.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${
                  session.fertilizationType === 'IVF' ? 'bg-blue-100' :
                  session.fertilizationType === 'ICSI' ? 'bg-green-100' : 'bg-purple-100'
                }`}>
                  {session.fertilizationType === 'IVF' ? <TestTube className="h-4 w-4 text-blue-600" /> :
                   session.fertilizationType === 'ICSI' ? <Microscope className="h-4 w-4 text-green-600" /> :
                   <Brain className="h-4 w-4 text-purple-600" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{session.sessionId}</p>
                  <p className="text-sm text-gray-500">{session.technician} • {formatDate(session.fertilizationDate)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(session.status)}`}>
                  {session.status}
                </span>
                <div className="flex items-center space-x-2">
                  {(session.status === 'In Progress' || session.status === 'Development Tracking') && (
                    <button
                      onClick={() => {
                        setSelectedSession(session);
                        setShowDevelopmentTracking(true);
                      }}
                      className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                      title="Track Development"
                    >
                      <FlaskConical className="h-4 w-4" />
                    </button>
                  )}
                  {session.status === 'Development Tracking' && (
                    <button
                      onClick={() => {
                        setSelectedSession(session);
                        setShowEmbryoGeneration(true);
                      }}
                      className="text-purple-600 hover:text-purple-800 p-1 rounded transition-colors"
                      title="Generate Embryos"
                    >
                      <Zap className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedSession(session);
                      if (session.status === 'Setup') setShowSampleSelection(true);
                      else if (session.status === 'In Progress') setShowDevelopmentTracking(true);
                      else if (session.status === 'Development Tracking') setShowEmbryoGeneration(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 p-1 rounded transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSessionManagement = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sessions & Embryo Generation</h2>
          <p className="text-gray-600">Manage fertilization sessions, track development, and generate embryo samples</p>
        </div>
        <button
          onClick={() => setShowSetupForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Session</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search sessions..."
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FertilizationSessionStatus | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="Setup">Setup</option>
              <option value="In Progress">In Progress</option>
              <option value="Development Tracking">Development Tracking</option>
              <option value="Embryos Generated">Embryos Generated</option>
              <option value="Completed">Completed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Technician</label>
            <input
              type="text"
              value={technicianFilter}
              onChange={(e) => setTechnicianFilter(e.target.value)}
              placeholder="Filter by technician..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sire</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Samples</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-2" />
                    <p className="text-gray-500">Loading sessions...</p>
                  </td>
                </tr>
              ) : filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <TestTube className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No fertilization sessions found</p>
                    <p className="text-gray-400 text-sm">Create your first session to get started</p>
                  </td>
                </tr>
              ) : (
                filteredSessions.filter(Boolean).map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-blue-600">{session.sessionId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{session.donorName || session.donorId || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{session.sireName || session.sireId || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(session.fertilizationDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.technician}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        <div>Oocytes: {session.selectedOocytes.length}</div>
                        {session.fertilizationType !== 'SCNT' && (
                          <div>Semen: {session.selectedSemen?.length || 0}</div>
                        )}
                        {session.fertilizationType === 'SCNT' && (
                          <div>Fibroblasts: {session.selectedFibroblasts?.length || 0}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              session.status === 'Completed' ? 'bg-green-600' :
                              session.status === 'Failed' ? 'bg-red-600' :
                              session.status === 'Embryos Generated' ? 'bg-blue-600' :
                              session.status === 'Development Tracking' ? 'bg-yellow-600' :
                              session.status === 'In Progress' ? 'bg-orange-600' :
                              'bg-gray-400'
                            }`}
                            style={{
                              width: session.status === 'Completed' ? '100%' :
                                     session.status === 'Embryos Generated' ? '80%' :
                                     session.status === 'Development Tracking' ? '60%' :
                                     session.status === 'In Progress' ? '40%' :
                                     session.status === 'Setup' ? '20%' : '0%'
                            }}
                          />
                        </div>
                        <span className="ml-2 text-xs text-gray-500">
                          {session.actualEmbryoCount || 0}/{session.targetEmbryoCount}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        {(session.status === 'In Progress' || session.status === 'Development Tracking') && (
                          <button
                            onClick={() => {
                              setSelectedSession(session);
                              setShowDevelopmentTracking(true);
                            }}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                            title="Track Development"
                          >
                            <FlaskConical className="h-4 w-4" />
                          </button>
                        )}
                        {session.status === 'Development Tracking' && (
                          <button
                            onClick={() => {
                              setSelectedSession(session);
                              setShowEmbryoGeneration(true);
                            }}
                            className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50 transition-colors"
                            title="Generate Embryos"
                          >
                            <Zap className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedSession(session);
                            if (session.status === 'Setup') setShowSampleSelection(true);
                            else if (session.status === 'In Progress') setShowDevelopmentTracking(true);
                            else if (session.status === 'Development Tracking') setShowEmbryoGeneration(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fertilization Module</h1>
              <p className="text-gray-600 mt-1">Comprehensive IVF, ICSI, and SCNT fertilization management</p>
            </div>
            <div className="flex space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                🧬 PHASE 4
              </div>
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                🔬 EMBRYO GENERATION
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'dashboard', label: '📊 Dashboard', icon: TrendingUp },
                { id: 'sessions', label: '🧪 Sessions & Embryo Generation', icon: TestTube },
                { id: 'analytics', label: '📊 Analytics', icon: BarChart3 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'sessions' && renderSessionManagement()}
        {activeTab === 'analytics' && (
          <AnalyticsDashboardPage />
        )}
      </div>

      {/* Modals */}
      {showSetupForm && (
        <FertilizationSetupForm
          isOpen={showSetupForm}
          onClose={() => setShowSetupForm(false)}
          onSubmit={handleCreateSession}
          fertilizationType={fertilizationType}
        />
      )}

      {showSampleSelection && selectedSession && (
        <SampleSelectionModal
          isOpen={showSampleSelection}
          onClose={() => setShowSampleSelection(false)}
          session={selectedSession}
          onUpdate={(session) => setSessions(prev => prev.map(s => s.id === session.id ? session : s))}
        />
      )}

      {showDevelopmentTracking && selectedSession && (
        <DevelopmentTrackingPanel
          isOpen={showDevelopmentTracking}
          onClose={() => setShowDevelopmentTracking(false)}
          session={selectedSession}
          onUpdate={handleUpdateDevelopment}
        />
      )}

      {showEmbryoGeneration && selectedSession && (
        <EmbryoGenerationPanel
          isOpen={showEmbryoGeneration}
          onClose={() => setShowEmbryoGeneration(false)}
          session={selectedSession}
          onGenerate={handleGenerateEmbryos}
        />
      )}
    </div>
  );
};

export default FertilizationPage;