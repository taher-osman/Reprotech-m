import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  BarChart3, 
  Calendar, 
  Settings, 
  TrendingUp, 
  Microscope,
  Zap,
  Target,
  Users,
  Clock
} from 'lucide-react';
import OPUForm from '../components/OPUForm';
import OPUTable from '../components/OPUTable';
import { OPUSession, OPUStats, OPUSessionFormData, OPUSessionUpdateData } from '../types/opuTypes';
import apiService from '../../../services/api';

const OPUPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sessions, setSessions] = useState<OPUSession[]>([]);
  const [stats, setStats] = useState<OPUStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState<OPUSession | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'complete'>('create');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls
      const mockSessions: OPUSession[] = Array.from({ length: 25 }, (_, i) => ({
        id: (i + 1).toString(),
        sessionId: `OPU-2025-${(i + 1).toString().padStart(4, '0')}`,
        donorId: `BV-2025-${(Math.floor(Math.random() * 50) + 1).toString().padStart(3, '0')}`,
        donorInfo: {
          animalID: `BV-2025-${(Math.floor(Math.random() * 50) + 1).toString().padStart(3, '0')}`,
          name: `Donor ${i + 1}`,
          species: 'Holstein',
          age: Math.floor(Math.random() * 8) + 3
        },
        sessionDate: new Date(2025, 0, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0],
        protocolId: 'standard-fsh',
        protocolInfo: {
          id: 'standard-fsh',
          name: 'Standard FSH Protocol',
          description: 'Standard follicle stimulating hormone protocol',
          fshDose: 400,
          ecgDose: 500,
          synchronizationDays: 7,
          isActive: true,
          species: ['BOVINE'],
          createdAt: '2025-01-01',
          updatedAt: '2025-01-01'
        },
        anesthesiaUsed: ['SEDATION', 'LOCAL', 'EPIDURAL'][Math.floor(Math.random() * 3)] as any,
        operatorId: (Math.floor(Math.random() * 4) + 1).toString(),
        operatorName: ['Dr. Sarah Ahmed', 'Dr. Ahmad Ali', 'Dr. Fatima Hassan', 'Dr. Omar Abdullah'][Math.floor(Math.random() * 4)],
        technicianId: Math.random() > 0.5 ? (Math.floor(Math.random() * 2) + 5).toString() : undefined,
        technicianName: Math.random() > 0.5 ? ['Tech. Fatima Hassan', 'Tech. Ali Mohammed'][Math.floor(Math.random() * 2)] : undefined,
        preUltrasoundDate: Math.random() > 0.3 ? new Date(2025, 0, Math.floor(Math.random() * 30) + 1).toISOString().split('T')[0] : undefined,
        folliclesObserved: Math.floor(Math.random() * 20) + 5,
        dominantFollicles: Math.floor(Math.random() * 5) + 1,
        mediumFollicles: Math.floor(Math.random() * 8) + 2,
        smallFollicles: Math.floor(Math.random() * 10) + 3,
        sessionStartTime: `${Math.floor(Math.random() * 4) + 8}:${['00', '30'][Math.floor(Math.random() * 2)]}`,
        sessionEndTime: Math.random() > 0.3 ? `${Math.floor(Math.random() * 4) + 10}:${['00', '30'][Math.floor(Math.random() * 2)]}` : undefined,
        mediaUsed: 'HEPES-buffered TCM-199',
        needleGauge: ['18G', '19G', '20G'][Math.floor(Math.random() * 3)],
        aspirationPressure: Math.floor(Math.random() * 21) + 60, // 60-80 mmHg
        flushingVolume: Math.floor(Math.random() * 11) + 10, // 10-20 ml
        oocytesRetrieved: Math.floor(Math.random() * 15) + 2,
        oocytesGradeA: Math.floor(Math.random() * 6) + 1,
        oocytesGradeB: Math.floor(Math.random() * 5) + 1,
        oocytesGradeC: Math.floor(Math.random() * 3) + 1,
        oocytesDegenerated: Math.floor(Math.random() * 3),
        cumulusComplexes: Math.floor(Math.random() * 8) + 2,
        status: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'][Math.floor(Math.random() * 4)] as any,
        sessionResult: ['EXCELLENT', 'GOOD', 'FAIR', 'POOR'][Math.floor(Math.random() * 4)] as any,
        complications: Math.random() > 0.8 ? 'Minor bleeding observed' : undefined,
        notes: `OPU session ${i + 1} completed successfully`,
        autoCreateSamples: true,
        createdSampleIds: Math.random() > 0.7 ? Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => `SMPL-2025-${(i * 5 + j + 1).toString().padStart(4, '0')}`) : undefined,
        nextSessionDate: Math.random() > 0.5 ? new Date(2025, 0, Math.floor(Math.random() * 30) + 15).toISOString().split('T')[0] : undefined,
        recoveryTime: Math.floor(Math.random() * 7) + 7,
        createdBy: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      const mockStats: OPUStats = {
        totalSessions: mockSessions.length,
        completedSessions: mockSessions.filter(s => s.status === 'COMPLETED').length,
        successRate: 82.4,
        averageOocytesPerSession: 8.6,
        averageGradeARate: 34.2,
        sessionsByProtocol: {
          'Standard FSH Protocol': 15,
          'Enhanced Superovulation': 8,
          'Short Protocol': 2
        },
        sessionsByOperator: {
          'Dr. Sarah Ahmed': 8,
          'Dr. Ahmad Ali': 7,
          'Dr. Fatima Hassan': 6,
          'Dr. Omar Abdullah': 4
        },
        sessionsByResult: {
          'EXCELLENT': 6,
          'GOOD': 9,
          'FAIR': 5,
          'POOR': 3,
          'FAILED': 2
        },
        monthlyTrends: [
          { month: '2024-12', sessions: 8, oocytes: 72, successRate: 78.5 },
          { month: '2025-01', sessions: 17, oocytes: 146, successRate: 84.2 }
        ]
      };

      setSessions(mockSessions);
      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching OPU data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = () => {
    setSelectedSession(null);
    setFormMode('create');
    setShowForm(true);
  };

  const handleEditSession = (session: OPUSession) => {
    setSelectedSession(session);
    setFormMode('edit');
    setShowForm(true);
  };

  const handleCompleteSession = (session: OPUSession) => {
    setSelectedSession(session);
    setFormMode('complete');
    setShowForm(true);
  };

  const handleViewSession = (session: OPUSession) => {
    // TODO: Implement session detail view
    console.log('View session:', session);
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (window.confirm('Are you sure you want to cancel this session?')) {
      try {
        // TODO: Implement actual delete
        setSessions(prev => prev.filter(s => s.id !== sessionId));
      } catch (error) {
        console.error('Error cancelling session:', error);
      }
    }
  };

  const handleFormSubmit = async (data: OPUSessionFormData | OPUSessionUpdateData) => {
    try {
      setLoading(true);
      
      if (formMode === 'create') {
        const newSession: OPUSession = {
          id: Date.now().toString(),
          sessionId: `OPU-2025-${(sessions.length + 1).toString().padStart(4, '0')}`,
          ...(data as OPUSessionFormData),
          status: 'SCHEDULED',
          sessionResult: 'GOOD',
          oocytesRetrieved: 0,
          oocytesGradeA: 0,
          oocytesGradeB: 0,
          oocytesGradeC: 0,
          oocytesDegenerated: 0,
          cumulusComplexes: 0,
          recoveryTime: 7,
          createdBy: 'current-user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setSessions(prev => [...prev, newSession]);
      } else if (formMode === 'edit' && selectedSession) {
        setSessions(prev => prev.map(s => 
          s.id === selectedSession.id 
            ? { ...s, ...(data as OPUSessionFormData), updatedAt: new Date().toISOString() }
            : s
        ));
      } else if (formMode === 'complete' && selectedSession) {
        const updateData = data as OPUSessionUpdateData;
        setSessions(prev => prev.map(s => 
          s.id === selectedSession.id 
            ? { 
                ...s, 
                ...updateData,
                oocytesRetrieved: updateData.oocytesGradeA + updateData.oocytesGradeB + updateData.oocytesGradeC + updateData.oocytesDegenerated,
                updatedAt: new Date().toISOString()
              }
            : s
        ));
      }

      setShowForm(false);
      setSelectedSession(null);
      fetchData(); // Refresh stats
    } catch (error) {
      console.error('Error saving session:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabConfig = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <BarChart3 className="h-4 w-4" />,
      color: 'blue'
    },
    {
      id: 'sessions',
      label: 'Sessions',
      icon: <Calendar className="h-4 w-4" />,
      color: 'green'
    },
    {
      id: 'protocols',
      label: 'Protocols',
      icon: <Settings className="h-4 w-4" />,
      color: 'purple'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <TrendingUp className="h-4 w-4" />,
      color: 'orange'
    }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Microscope className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Total Sessions</p>
              <p className="text-2xl font-bold text-blue-900">
                {stats?.totalSessions || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Success Rate</p>
              <p className="text-2xl font-bold text-green-900">
                {stats?.successRate?.toFixed(1) || 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple-600">Avg Oocytes/Session</p>
              <p className="text-2xl font-bold text-purple-900">
                {stats?.averageOocytesPerSession?.toFixed(1) || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-500 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-600">Grade A Rate</p>
              <p className="text-2xl font-bold text-orange-900">
                {stats?.averageGradeARate?.toFixed(1) || 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sessions by Protocol</h3>
          <div className="space-y-3">
            {stats && Object.entries(stats.sessionsByProtocol).map(([protocol, count]) => (
              <div key={protocol} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{protocol}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(count / stats.totalSessions) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Results</h3>
          <div className="space-y-3">
            {stats && Object.entries(stats.sessionsByResult).map(([result, count]) => {
              const resultColors = {
                EXCELLENT: 'bg-emerald-600',
                GOOD: 'bg-green-600',
                FAIR: 'bg-yellow-600',
                POOR: 'bg-orange-600',
                FAILED: 'bg-red-600'
              };
              
              return (
                <div key={result} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{result}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${resultColors[result as keyof typeof resultColors]}`}
                        style={{ width: `${(count / stats.completedSessions) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Sessions</h3>
          <button
            onClick={() => setActiveTab('sessions')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {sessions.slice(0, 5).map((session) => (
            <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Microscope className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{session.sessionId}</p>
                  <p className="text-sm text-gray-500">{session.donorInfo?.name || 'Unknown'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{session.oocytesRetrieved} oocytes</p>
                <p className="text-xs text-gray-500">{new Date(session.sessionDate).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">OPU Sessions</h3>
          <p className="text-sm text-gray-600">Manage ovum pick-up sessions and procedures</p>
        </div>
        <button
          onClick={handleCreateSession}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Session</span>
        </button>
      </div>

      <OPUTable
        sessions={sessions}
        loading={loading}
        onViewSession={handleViewSession}
        onEditSession={handleEditSession}
        onCompleteSession={handleCompleteSession}
        onDeleteSession={handleDeleteSession}
      />
    </div>
  );

  const renderProtocols = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">OPU Protocols</h3>
        <p className="text-gray-600 mb-4">
          Configure and manage OPU protocols for different species and objectives
        </p>
        <div className="text-center py-8">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Protocol management interface will be implemented here</p>
          <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Create Protocol
          </button>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Analytics</h3>
        <p className="text-gray-600 mb-4">
          Detailed analytics and performance reporting for OPU operations
        </p>
        <div className="text-center py-8">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Advanced analytics dashboard will be implemented here</p>
          <button className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'sessions':
        return renderSessions();
      case 'protocols':
        return renderProtocols();
      case 'analytics':
        return renderAnalytics();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            🥚 OPU Management
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive ovum pick-up session management and tracking
          </p>
        </div>
        <div className="flex space-x-2">
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            PHASE 1
          </span>
          <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            ACTIVE
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? `border-${tab.color}-500 text-${tab.color}-600`
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        {loading && activeTab === 'dashboard' ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          renderContent()
        )}
      </div>

      {/* OPU Form Modal */}
      {showForm && (
        <OPUForm
          session={selectedSession}
          isOpen={showForm}
          onClose={() => {
            setShowForm(false);
            setSelectedSession(null);
          }}
          onSubmit={handleFormSubmit}
          mode={formMode}
          loading={loading}
        />
      )}
    </div>
  );
};

export default OPUPage; 