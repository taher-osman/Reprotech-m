import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Calendar,
  User,
  MapPin,
  Activity,
  FlaskConical,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  RefreshCw,
  ExternalLink,
  TestTube,
  Microscope,
  AlertTriangle,
  CheckCircle,
  Brain
} from 'lucide-react';
import { FlushingForm } from '../components/FlushingForm';
import { FlushingTable } from '../components/FlushingTable';
import { FlushingDetailModal } from '../components/FlushingDetailModal';
import { FlushingStats } from '../components/FlushingStats';
import { AdvancedAnalytics } from '../components/AdvancedAnalytics';
import { AdvancedFilters, FilterState } from '../components/AdvancedFilters';
import { ProtocolOptimizer } from '../components/ProtocolOptimizer';
import { MobileFieldDashboard } from '../components/MobileFieldDashboard';
import { EquipmentIntegration } from '../components/EquipmentIntegration';
import { OfflineSync } from '../components/OfflineSync';

// Types for flushing management
export interface FlushingSession {
  id: string;
  session_id: string; // Auto-generated (e.g., FLUSH-2025-001)
  donor_id: string;
  donor_name: string;
  sire_id?: string;
  sire_name?: string;
  flush_date: string;
  flush_medium: string;
  flush_volume_ml: number;
  flush_method: string;
  technician: string;
  location: string;
  total_embryos: number;
  viable_embryos: number;
  quality_grade_a: number;
  quality_grade_b: number;
  quality_grade_c: number;
  quality_grade_d: number;
  fertilization_source: 'Natural' | 'IVF' | 'ICSI';
  reproductive_protocol?: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  created_by: string;
  created_at: string;
  updated_at: string;
  notes?: string;
  generated_sample_ids: string[]; // Track auto-generated samples
}

export interface FlushingFilters {
  searchTerm: string;
  dateFrom: string;
  dateTo: string;
  donor: string;
  technician: string;
  status: string;
  minEmbryos: number;
}

export interface FlushingSessionStats {
  totalSessions: number;
  totalEmbryos: number;
  averageEmbryosPerFlush: number;
  successRate: number;
  monthlyTrend: { month: string; sessions: number; embryos: number }[];
  topDonors: { donor: string; sessions: number; embryos: number }[];
}

export const FlushingPage: React.FC = () => {
  const [sessions, setSessions] = useState<FlushingSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<FlushingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<FlushingSession | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [showFilters, setShowFilters] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailSession, setDetailSession] = useState<FlushingSession | null>(null);
  const [activeTab, setActiveTab] = useState<'sessions' | 'analytics' | 'optimizer' | 'mobile' | 'equipment' | 'sync'>('sessions');
  const [stats, setStats] = useState<FlushingSessionStats>({
    totalSessions: 0,
    totalEmbryos: 0,
    averageEmbryosPerFlush: 0,
    successRate: 0,
    monthlyTrend: [],
    topDonors: []
  });

  const [filters, setFilters] = useState<FlushingFilters>({
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
    donor: '',
    technician: '',
    status: '',
    minEmbryos: 0
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Mock data for Phase 1
        const mockSessions: FlushingSession[] = [
          {
            id: '1',
            session_id: 'FLUSH-2025-001',
            donor_id: 'BV-001',
            donor_name: 'Bella',
            sire_id: 'BU-002',
            sire_name: 'Thunder',
            flush_date: '2025-01-15',
            flush_medium: 'PBS + BSA',
            flush_volume_ml: 500,
            flush_method: 'Foley Catheter',
            technician: 'Dr. Smith',
            location: 'Flushing Room 1',
            total_embryos: 12,
            viable_embryos: 8,
            quality_grade_a: 3,
            quality_grade_b: 5,
            quality_grade_c: 3,
            quality_grade_d: 1,
            fertilization_source: 'Natural',
            reproductive_protocol: 'MOET Protocol v2.1',
            status: 'Completed',
            created_by: 'Dr. Smith',
            created_at: '2025-01-15T08:30:00Z',
            updated_at: '2025-01-15T11:45:00Z',
            notes: 'Excellent flush with high-quality embryos',
            generated_sample_ids: ['SMPL-2025-0015', 'SMPL-2025-0016', 'SMPL-2025-0017']
          },
          {
            id: '2',
            session_id: 'FLUSH-2025-002',
            donor_id: 'BV-003',
            donor_name: 'Luna',
            sire_id: 'BU-001',
            sire_name: 'Apollo',
            flush_date: '2025-01-14',
            flush_medium: 'DPBS + FBS',
            flush_volume_ml: 400,
            flush_method: 'Manual',
            technician: 'Dr. Johnson',
            location: 'Flushing Room 2',
            total_embryos: 6,
            viable_embryos: 4,
            quality_grade_a: 1,
            quality_grade_b: 3,
            quality_grade_c: 2,
            quality_grade_d: 0,
            fertilization_source: 'IVF',
            status: 'Completed',
            created_by: 'Dr. Johnson',
            created_at: '2025-01-14T09:15:00Z',
            updated_at: '2025-01-14T12:30:00Z',
            notes: 'Good quality embryos, donor responded well',
            generated_sample_ids: ['SMPL-2025-0010', 'SMPL-2025-0011']
          }
        ];

        setSessions(mockSessions);
        
        // Calculate stats
        const totalSessions = mockSessions.length;
        const totalEmbryos = mockSessions.reduce((sum, s) => sum + s.total_embryos, 0);
        const averageEmbryosPerFlush = totalSessions > 0 ? totalEmbryos / totalSessions : 0;
        const successRate = totalSessions > 0 
          ? (mockSessions.filter(s => s.viable_embryos > 0).length / totalSessions) * 100 
          : 0;

        setStats({
          totalSessions,
          totalEmbryos,
          averageEmbryosPerFlush,
          successRate,
          monthlyTrend: [
            { month: 'Dec 2024', sessions: 8, embryos: 85 },
            { month: 'Jan 2025', sessions: 12, embryos: 128 }
          ],
          topDonors: [
            { donor: 'Bella', sessions: 5, embryos: 58 },
            { donor: 'Luna', sessions: 4, embryos: 42 }
          ]
        });

      } catch (error) {
        console.error('Error loading flushing data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...sessions];

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(session =>
        session.session_id.toLowerCase().includes(searchLower) ||
        session.donor_name.toLowerCase().includes(searchLower) ||
        session.technician.toLowerCase().includes(searchLower) ||
        session.notes?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(session => session.flush_date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      filtered = filtered.filter(session => session.flush_date <= filters.dateTo);
    }
    if (filters.donor) {
      filtered = filtered.filter(session => session.donor_name.includes(filters.donor));
    }
    if (filters.technician) {
      filtered = filtered.filter(session => session.technician.includes(filters.technician));
    }
    if (filters.status) {
      filtered = filtered.filter(session => session.status === filters.status);
    }
    if (filters.minEmbryos > 0) {
      filtered = filtered.filter(session => session.total_embryos >= filters.minEmbryos);
    }

    setFilteredSessions(filtered);
  }, [sessions, filters]);

  const handleAddNew = () => {
    setSelectedSession(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEdit = (session: FlushingSession) => {
    setSelectedSession(session);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDelete = async (session: FlushingSession) => {
    if (window.confirm(`Are you sure you want to delete flushing session ${session.session_id}?`)) {
      setSessions(prev => prev.filter(s => s.id !== session.id));
    }
  };

  const handleView = (session: FlushingSession) => {
    setDetailSession(session);
    setIsDetailModalOpen(true);
  };

  const handleFormSave = (sessionData: FlushingSession) => {
    if (formMode === 'edit') {
      setSessions(prev => prev.map(s => s.id === sessionData.id ? sessionData : s));
    } else {
      setSessions(prev => [sessionData, ...prev]);
    }
    setIsFormOpen(false);
    setSelectedSession(null);
  };

  const handleViewSamples = (session: FlushingSession) => {
    // Navigate to sample management with filter for this session
    const searchParams = new URLSearchParams({
      parent_event_id: session.id,
      sample_type: 'embryo'
    });
    window.location.href = `/modules/sample-management?${searchParams.toString()}`;
  };

  const updateFilter = (key: keyof FlushingFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Zap className="h-8 w-8 text-pink-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Embryo Flushing</h1>
            <p className="text-gray-600">Comprehensive flushing session management with automated sample generation</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">PHASE 1 ✓</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">PHASE 2 ✓</span>
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">PHASE 3 ✓</span>
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">MOBILE READY</span>
              <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded-full text-xs font-medium">IOT READY</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {activeTab === 'sessions' && (
            <>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-200 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
              <button
                onClick={handleAddNew}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-pink-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>New Flush Session</span>
              </button>
            </>
          )}
          {activeTab === 'analytics' && (
            <button
              onClick={() => {/* Export analytics */}}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export Analytics</span>
            </button>
          )}
          {activeTab === 'optimizer' && (
            <button
              onClick={() => {/* Run optimization */}}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-purple-700 transition-colors"
            >
              <Brain className="h-4 w-4" />
              <span>Run Optimization</span>
            </button>
          )}
          {activeTab === 'mobile' && (
            <button
              onClick={() => {/* Mobile actions */}}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-orange-700 transition-colors"
            >
              <Microscope className="h-4 w-4" />
              <span>Field Mode</span>
            </button>
          )}
          {activeTab === 'equipment' && (
            <button
              onClick={() => {/* Equipment scan */}}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-teal-700 transition-colors"
            >
              <Activity className="h-4 w-4" />
              <span>Scan Devices</span>
            </button>
          )}
          {activeTab === 'sync' && (
            <button
              onClick={() => {/* Force sync */}}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Force Sync</span>
            </button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <FlushingStats stats={stats} />

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('sessions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sessions'
                  ? 'border-pink-500 text-pink-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📋 Session Management
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Advanced Analytics
            </button>
            <button
              onClick={() => setActiveTab('optimizer')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'optimizer'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🧠 Protocol Optimizer
            </button>
            <button
              onClick={() => setActiveTab('mobile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'mobile'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📱 Mobile Field
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'equipment'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🔧 Equipment Hub
            </button>
            <button
              onClick={() => setActiveTab('sync')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sync'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🔄 Offline Sync
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'sessions' && (
        <>
          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-lg border space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sessions, donors, technicians..."
                  value={filters.searchTerm}
                  onChange={(e) => updateFilter('searchTerm', e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <select
                value={filters.status}
                onChange={(e) => updateFilter('status', e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="">All Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <input
                type="number"
                placeholder="Min Embryos"
                value={filters.minEmbryos || ''}
                onChange={(e) => updateFilter('minEmbryos', parseInt(e.target.value) || 0)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button
                onClick={() => window.location.href = '/modules/sample-management?sample_type=embryo&collection_method=Flushing'}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-teal-700 transition-colors"
              >
                <FlaskConical className="h-4 w-4" />
                <span>View Samples</span>
              </button>
            </div>

            {showFilters && (
              <div className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => updateFilter('dateFrom', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => updateFilter('dateTo', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Donor</label>
                    <input
                      type="text"
                      placeholder="Donor name"
                      value={filters.donor}
                      onChange={(e) => updateFilter('donor', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Technician</label>
                    <input
                      type="text"
                      placeholder="Technician name"
                      value={filters.technician}
                      onChange={(e) => updateFilter('technician', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Flushing Sessions Table */}
          <FlushingTable
            sessions={filteredSessions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            onViewSamples={handleViewSamples}
            isLoading={isLoading}
          />
        </>
      )}

      {activeTab === 'analytics' && (
        <AdvancedAnalytics sessions={sessions} />
      )}

      {activeTab === 'optimizer' && (
        <ProtocolOptimizer sessions={sessions} />
      )}

      {activeTab === 'mobile' && (
        <MobileFieldDashboard 
          sessions={sessions}
          onQuickStart={handleAddNew}
          onSyncData={() => {/* Handle sync */}}
        />
      )}

      {activeTab === 'equipment' && (
        <EquipmentIntegration 
          onParameterChange={(equipmentId, parameter, value) => {
            console.log('Parameter changed:', equipmentId, parameter, value);
          }}
          onAlert={(alert) => {
            console.log('Equipment alert:', alert);
          }}
        />
      )}

      {activeTab === 'sync' && (
        <OfflineSync 
          sessions={sessions}
          onSyncComplete={(syncedSessions) => {
            setSessions(syncedSessions);
          }}
          onConflictDetected={(conflicts) => {
            console.log('Sync conflicts detected:', conflicts);
          }}
        />
      )}

      {/* Forms and Modals */}
      <FlushingForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleFormSave}
        existingSession={selectedSession}
        mode={formMode}
      />

      <FlushingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        session={detailSession}
        onEdit={(session) => {
          setSelectedSession(session);
          setFormMode('edit');
          setIsDetailModalOpen(false);
          setIsFormOpen(true);
        }}
        onViewSamples={handleViewSamples}
      />
    </div>
  );
}; 