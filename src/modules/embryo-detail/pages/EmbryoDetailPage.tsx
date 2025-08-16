import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Plus, Download, Upload, BarChart3, 
  Target, Calendar, Microscope, Settings, FlaskConical,
  TrendingUp, Clock, CheckCircle, AlertTriangle, Eye,
  Dna, Snowflake, ArrowRight, Heart, Award, Archive
} from 'lucide-react';
import { EmbryoRecord, EmbryoDashboardStats, EmbryoFilters, EmbryoStatus, EmbryoDevelopmentStage } from '../types/embryoTypes';

interface EmbryoDetailPageProps {}

const EmbryoDetailPage: React.FC<EmbryoDetailPageProps> = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [embryos, setEmbryos] = useState<EmbryoRecord[]>([]);
  const [stats, setStats] = useState<EmbryoDashboardStats | null>(null);
  const [filters, setFilters] = useState<EmbryoFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedEmbryos, setSelectedEmbryos] = useState<Set<string>>(new Set());

  // Mock data - replace with actual API calls
  useEffect(() => {
    loadDashboardStats();
    loadEmbryos();
  }, []);

  const loadDashboardStats = () => {
    // Mock stats
    setStats({
      activeCultures: 47,
      frozenEmbryos: 126,
      transfersToday: 3,
      successRate: 67.5,
      avgDevelopmentTime: 6.2,
      qualityDistribution: {
        'EXCELLENT': 15,
        'GOOD': 28,
        'FAIR': 18,
        'POOR': 8,
        'DEGENERATED': 4
      }
    });
  };

  const loadEmbryos = () => {
    // Mock embryo data
    const mockEmbryos: EmbryoRecord[] = [
      {
        id: '1',
        embryoId: 'EMB-2024-001',
        opuSessionId: 'OPU-2024-001',
        sourceOocyteId: 'OOC-2024-001',
        collectionDate: '2024-01-15',
        donorId: 'D001',
        donorName: 'Prima Donna',
        sireId: 'S001',
        sireName: 'Champion Zeus',
        species: 'BOVINE',
        breed: 'Holstein',
        currentStage: 'BLASTOCYST',
        developmentDay: 7,
        fertilizationDate: '2024-01-16',
        fertilizationMethod: 'IVF',
        qualityGrade: 'EXCELLENT',
        morphologyScore: 9,
        viabilityScore: 9,
        developmentRate: 'NORMAL',
        diameter: 150,
        cellCount: 120,
        fragmentationLevel: 'NONE',
        zonaPellucidaThickness: 15,
        cultureMedia: 'G-2 PLUS',
        cultureConditions: {
          temperature: 38.5,
          co2Percentage: 6.0,
          humidity: 95
        },
        incubatorId: 'INC-01',
        cultureStartDate: '2024-01-16',
        currentLocation: {
          facility: 'Main Lab',
          building: 'A',
          room: '101',
          tank: 'T1',
          cane: 'C5',
          position: 'P12'
        },
        storageConditions: {
          temperature: -196,
          storageType: 'LIQUID_NITROGEN'
        },
        transferEligible: true,
        notes: 'Excellent quality blastocyst with normal morphology',
        createdBy: 'Dr. Smith',
        createdAt: '2024-01-16T10:00:00Z',
        updatedAt: '2024-01-22T14:30:00Z',
        status: 'IN_CULTURE'
      },
      // Add more mock embryos...
    ];
    setEmbryos(mockEmbryos);
  };

  const getStatusColor = (status: EmbryoStatus) => {
    switch (status) {
      case 'IN_CULTURE': return 'text-blue-600 bg-blue-100';
      case 'FROZEN': return 'text-purple-600 bg-purple-100';
      case 'TRANSFERRED': return 'text-green-600 bg-green-100';
      case 'DISCARDED': return 'text-red-600 bg-red-100';
      case 'RESEARCH': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStageColor = (stage: EmbryoDevelopmentStage) => {
    if (stage.includes('BLASTOCYST')) return 'text-green-600 bg-green-100';
    if (stage.includes('CLEAVAGE') || stage === 'MORULA') return 'text-blue-600 bg-blue-100';
    if (stage === 'FERTILIZED_OOCYTE') return 'text-purple-600 bg-purple-100';
    if (stage === 'DEGENERATED' || stage === 'ARRESTED') return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  const formatStageDisplay = (stage: EmbryoDevelopmentStage) => {
    return stage.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'records', label: 'Embryo Records', icon: Microscope },
    { id: 'timeline', label: 'Development Timeline', icon: Calendar },
    { id: 'quality', label: 'Quality Assessment', icon: Award },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FlaskConical className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Embryo Detail Module</h1>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  PHASE 2
                </span>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  ACTIVE
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                New Embryo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FlaskConical className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Cultures</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.activeCultures}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Snowflake className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Frozen Embryos</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.frozenEmbryos}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ArrowRight className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Transfers Today</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.transfersToday}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Heart className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Success Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.successRate}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Avg Dev Time</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats?.avgDevelopmentTime} days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Distribution Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Distribution</h3>
              <div className="space-y-4">
                {stats && Object.entries(stats.qualityDistribution).map(([grade, count]) => (
                  <div key={grade} className="flex items-center">
                    <div className="w-20 text-sm font-medium text-gray-600">
                      {grade}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 mx-4">
                      <div 
                        className={`h-4 rounded-full ${
                          grade === 'EXCELLENT' ? 'bg-green-500' :
                          grade === 'GOOD' ? 'bg-blue-500' :
                          grade === 'FAIR' ? 'bg-yellow-500' :
                          grade === 'POOR' ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(count / 73) * 100}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-sm font-medium text-gray-900 text-right">
                      {count}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">
                    Embryo EMB-2024-001 reached blastocyst stage (Day 7)
                  </span>
                  <span className="text-xs text-gray-400">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Snowflake className="h-5 w-5 text-purple-500" />
                  <span className="text-sm text-gray-600">
                    3 embryos successfully frozen using vitrification protocol
                  </span>
                  <span className="text-xs text-gray-400">4 hours ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ArrowRight className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    Transfer scheduled for EMB-2024-002 tomorrow at 10:00 AM
                  </span>
                  <span className="text-xs text-gray-400">6 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 max-w-lg">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search embryos by ID, donor, sire..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Embryo Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Embryo Records</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Embryo ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Donor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sire
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quality
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
                    {embryos.map((embryo) => (
                      <tr key={embryo.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-blue-600">{embryo.embryoId}</div>
                          <div className="text-xs text-gray-500">Day {embryo.developmentDay}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{embryo.donorName}</div>
                          <div className="text-xs text-gray-500">{embryo.species}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{embryo.sireName || embryo.sireId || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(embryo.currentStage)}`}>
                            {formatStageDisplay(embryo.currentStage)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{embryo.qualityGrade}</div>
                          <div className="text-xs text-gray-500">{embryo.morphologyScore}/10</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(embryo.status)}`}>
                            {embryo.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Development Timeline</h3>
            <div className="text-center text-gray-500 py-12">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Development timeline visualization coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Quality Assessment Tools</h3>
            <div className="text-center text-gray-500 py-12">
              <Award className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Quality assessment interface coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Analytics Dashboard</h3>
            <div className="text-center text-gray-500 py-12">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Advanced analytics coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmbryoDetailPage; 