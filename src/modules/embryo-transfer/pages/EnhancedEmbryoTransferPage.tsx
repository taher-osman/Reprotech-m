import React, { useState, useEffect } from 'react';
import { Heart, Plus, Search, Filter, Edit, Trash2, Eye, Calendar, AlertTriangle, Clock, RefreshCw, CheckCircle, XCircle, Activity, Brain, TrendingUp, Target, Zap, Users, BarChart3, Baby, Microscope } from 'lucide-react';

interface EmbryoTransferRecord {
  id: string;
  transferID: string;
  donorId: string;
  donorName: string;
  recipientId: string;
  recipientName: string;
  embryoId: string;
  embryoGrade: 'A' | 'B' | 'C' | 'D';
  transferDate: string;
  transferTime: string;
  operator: string;
  status: 'COMPLETED' | 'FAILED' | 'SCHEDULED' | 'CONFIRMED_PREGNANT' | 'NOT_PREGNANT';
  synchronizationScore: number;
  matchingScore: number;
  pregnancyConfirmDate?: string;
  expectedCalvingDate?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface Animal {
  id: string;
  name: string;
  internalNumber: string;
  species: string;
  sex: 'MALE' | 'FEMALE';
  age: number;
  lastEstrus?: string;
  cycleLength?: number;
  reproductiveStatus: 'AVAILABLE' | 'PREGNANT' | 'LACTATING' | 'RESTING';
  bodyConditionScore: number;
  synchronizationProtocol?: string;
}

interface Embryo {
  id: string;
  embryoID: string;
  donorId: string;
  donorName: string;
  collectionDate: string;
  grade: 'A' | 'B' | 'C' | 'D';
  stage: 'MORULA' | 'EARLY_BLASTOCYST' | 'BLASTOCYST' | 'EXPANDED_BLASTOCYST' | 'HATCHED_BLASTOCYST';
  freezingMethod: 'FRESH' | 'SLOW_FREEZE' | 'VITRIFICATION';
  status: 'AVAILABLE' | 'TRANSFERRED' | 'DISCARDED';
  viabilityScore: number;
}

interface RecipientMatch {
  id: string;
  recipientId: string;
  recipientName: string;
  matchingScore: number;
  synchronizationScore: number;
  bodyCondition: number;
  reproductiveHistory: string;
  recommendationLevel: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  optimalTransferDate: string;
}

export const EnhancedEmbryoTransferPage: React.FC = () => {
  const [records, setRecords] = useState<EmbryoTransferRecord[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [embryos, setEmbryos] = useState<Embryo[]>([]);
  const [recipientMatches, setRecipientMatches] = useState<RecipientMatch[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transfers' | 'matching' | 'embryos' | 'analytics'>('dashboard');
  const [selectedEmbryo, setSelectedEmbryo] = useState<string>('');

  // Enhanced sample data
  useEffect(() => {
    const sampleAnimals: Animal[] = [
      { 
        id: '1', name: 'Bella', internalNumber: 'C001', species: 'CAMEL', sex: 'FEMALE', age: 5,
        lastEstrus: '2025-08-10', cycleLength: 21, reproductiveStatus: 'AVAILABLE', 
        bodyConditionScore: 3.5, synchronizationProtocol: 'CIDR-7'
      },
      { 
        id: '2', name: 'Luna', internalNumber: 'C002', species: 'CAMEL', sex: 'FEMALE', age: 4,
        lastEstrus: '2025-08-12', cycleLength: 20, reproductiveStatus: 'AVAILABLE', 
        bodyConditionScore: 3.8, synchronizationProtocol: 'CIDR-7'
      },
      { 
        id: '3', name: 'Star', internalNumber: 'C003', species: 'CAMEL', sex: 'FEMALE', age: 6,
        lastEstrus: '2025-08-08', cycleLength: 22, reproductiveStatus: 'PREGNANT', 
        bodyConditionScore: 3.2, synchronizationProtocol: 'CIDR-9'
      },
      { 
        id: '4', name: 'Grace', internalNumber: 'C005', species: 'CAMEL', sex: 'FEMALE', age: 3,
        lastEstrus: '2025-08-14', cycleLength: 21, reproductiveStatus: 'AVAILABLE', 
        bodyConditionScore: 4.0, synchronizationProtocol: 'CIDR-7'
      },
      { 
        id: '5', name: 'Hope', internalNumber: 'C006', species: 'CAMEL', sex: 'FEMALE', age: 7,
        lastEstrus: '2025-08-11', cycleLength: 23, reproductiveStatus: 'AVAILABLE', 
        bodyConditionScore: 3.6, synchronizationProtocol: 'CIDR-9'
      }
    ];

    const sampleEmbryos: Embryo[] = [
      {
        id: '1', embryoID: 'EMB-2025-001', donorId: '1', donorName: 'Bella',
        collectionDate: '2025-08-10', grade: 'A', stage: 'BLASTOCYST',
        freezingMethod: 'VITRIFICATION', status: 'AVAILABLE', viabilityScore: 95
      },
      {
        id: '2', embryoID: 'EMB-2025-002', donorId: '1', donorName: 'Bella',
        collectionDate: '2025-08-10', grade: 'B', stage: 'EXPANDED_BLASTOCYST',
        freezingMethod: 'VITRIFICATION', status: 'AVAILABLE', viabilityScore: 88
      },
      {
        id: '3', embryoID: 'EMB-2025-003', donorId: '2', donorName: 'Luna',
        collectionDate: '2025-08-12', grade: 'A', stage: 'BLASTOCYST',
        freezingMethod: 'FRESH', status: 'TRANSFERRED', viabilityScore: 92
      }
    ];

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const sampleRecords: EmbryoTransferRecord[] = [
      {
        id: '1',
        transferID: 'ET-2025-001',
        donorId: '1',
        donorName: 'Bella',
        recipientId: '2',
        recipientName: 'Luna',
        embryoId: '1',
        embryoGrade: 'A',
        transferDate: today.toISOString().split('T')[0],
        transferTime: '10:30',
        operator: 'Dr. Smith',
        status: 'COMPLETED',
        synchronizationScore: 95,
        matchingScore: 92,
        notes: 'Excellent synchronization, optimal transfer conditions',
        createdAt: today.toISOString(),
        updatedAt: today.toISOString()
      },
      {
        id: '2',
        transferID: 'ET-2025-002',
        donorId: '2',
        donorName: 'Luna',
        recipientId: '4',
        recipientName: 'Grace',
        embryoId: '3',
        embryoGrade: 'A',
        transferDate: yesterday.toISOString().split('T')[0],
        transferTime: '14:15',
        operator: 'Dr. Johnson',
        status: 'CONFIRMED_PREGNANT',
        synchronizationScore: 88,
        matchingScore: 90,
        pregnancyConfirmDate: today.toISOString().split('T')[0],
        expectedCalvingDate: new Date(today.getTime() + 280 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: 'Pregnancy confirmed via ultrasound',
        createdAt: yesterday.toISOString(),
        updatedAt: today.toISOString()
      }
    ];

    const sampleMatches: RecipientMatch[] = [
      {
        id: '1',
        recipientId: '4',
        recipientName: 'Grace (C005)',
        matchingScore: 95,
        synchronizationScore: 92,
        bodyCondition: 4.0,
        reproductiveHistory: 'Excellent - 2 successful pregnancies',
        recommendationLevel: 'EXCELLENT',
        optimalTransferDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        id: '2',
        recipientId: '5',
        recipientName: 'Hope (C006)',
        matchingScore: 88,
        synchronizationScore: 85,
        bodyCondition: 3.6,
        reproductiveHistory: 'Good - 3 successful pregnancies',
        recommendationLevel: 'GOOD',
        optimalTransferDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        id: '3',
        recipientId: '2',
        recipientName: 'Luna (C002)',
        matchingScore: 82,
        synchronizationScore: 80,
        bodyCondition: 3.8,
        reproductiveHistory: 'Fair - 1 successful pregnancy',
        recommendationLevel: 'GOOD',
        optimalTransferDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ];

    setAnimals(sampleAnimals);
    setEmbryos(sampleEmbryos);
    setRecords(sampleRecords);
    setRecipientMatches(sampleMatches);
    setIsLoading(false);
  }, []);

  const getSuccessRate = (): number => {
    const completed = records.filter(r => r.status === 'COMPLETED' || r.status === 'CONFIRMED_PREGNANT').length;
    const total = records.filter(r => r.status !== 'SCHEDULED').length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getPregnancyRate = (): number => {
    const pregnant = records.filter(r => r.status === 'CONFIRMED_PREGNANT').length;
    const total = records.filter(r => r.status !== 'SCHEDULED').length;
    return total > 0 ? Math.round((pregnant / total) * 100) : 0;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'CONFIRMED_PREGNANT': return <Baby className="h-4 w-4 text-green-600" />;
      case 'NOT_PREGNANT': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'FAILED': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'SCHEDULED': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED_PREGNANT': return 'bg-green-100 text-green-800';
      case 'NOT_PREGNANT': return 'bg-red-100 text-red-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'SCHEDULED': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRecommendationColor = (level: string) => {
    switch (level) {
      case 'EXCELLENT': return 'bg-green-100 text-green-800';
      case 'GOOD': return 'bg-blue-100 text-blue-800';
      case 'FAIR': return 'bg-yellow-100 text-yellow-800';
      case 'POOR': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-700 rounded-lg p-6 text-white mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Advanced Embryo Transfer</h1>
            <p className="text-purple-100 mb-4">AI-powered recipient matching with synchronization optimization</p>
            <div className="flex gap-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Recipient Matching</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Synchronization Analysis</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Pregnancy Tracking</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">Aug 16, 02:44 PM</div>
            <div className="text-purple-200">Transfer Status: Operational</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Heart },
          { id: 'transfers', label: 'Transfer Records', icon: Activity },
          { id: 'matching', label: 'Recipient Matching', icon: Target },
          { id: 'embryos', label: 'Embryo Bank', icon: Microscope },
          { id: 'analytics', label: 'Success Analytics', icon: BarChart3 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Transfers</p>
                  <p className="text-3xl font-bold text-blue-900">{records.length}</p>
                  <p className="text-blue-600 text-sm">This month</p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Pregnancy Rate</p>
                  <p className="text-3xl font-bold text-green-900">{getPregnancyRate()}%</p>
                  <p className="text-green-600 text-sm">Confirmed pregnancies</p>
                </div>
                <Baby className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Available Embryos</p>
                  <p className="text-3xl font-bold text-purple-900">{embryos.filter(e => e.status === 'AVAILABLE').length}</p>
                  <p className="text-purple-600 text-sm">Ready for transfer</p>
                </div>
                <Microscope className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Avg Matching Score</p>
                  <p className="text-3xl font-bold text-orange-900">91%</p>
                  <p className="text-orange-600 text-sm">Recipient compatibility</p>
                </div>
                <Target className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Transfer Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Schedule Transfer</div>
                  <div className="text-sm text-gray-600">Plan embryo transfer</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition-colors">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Find Recipients</div>
                  <div className="text-sm text-gray-600">Match optimal recipients</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-400 transition-colors">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Baby className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Pregnancy Check</div>
                  <div className="text-sm text-gray-600">Confirm pregnancies</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 transition-colors">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Success Report</div>
                  <div className="text-sm text-gray-600">Generate analytics</div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Transfer Activity */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Recent Transfer Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <Baby className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Pregnancy confirmed for Grace (C005)</div>
                  <div className="text-sm text-gray-600">Dr. Johnson • Aug 16, 02:00 PM • Expected calving: May 23, 2026</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Embryo transfer completed for Luna (C002)</div>
                  <div className="text-sm text-gray-600">Dr. Smith • Aug 16, 10:30 AM • Grade A embryo • 95% synchronization</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Target className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Optimal recipient match found for EMB-2025-002</div>
                  <div className="text-sm text-gray-600">System • Aug 16, 09:15 AM • Grace (C005) - 95% compatibility</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recipient Matching Tab */}
      {activeTab === 'matching' && (
        <div className="space-y-6">
          {/* Embryo Selection */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Select Embryo for Recipient Matching</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available Embryos</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={selectedEmbryo}
                  onChange={(e) => setSelectedEmbryo(e.target.value)}
                >
                  <option value="">Choose embryo...</option>
                  {embryos.filter(e => e.status === 'AVAILABLE').map(embryo => (
                    <option key={embryo.id} value={embryo.id}>
                      {embryo.embryoID} - Grade {embryo.grade} - {embryo.donorName} - {embryo.viabilityScore}% viability
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  Find Optimal Recipients
                </button>
              </div>
            </div>
          </div>

          {/* Recipient Matches */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Recommended Recipients</h3>
              <p className="text-sm text-gray-600">AI-powered matching based on synchronization and compatibility</p>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matching Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Synchronization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Body Condition</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reproductive History</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommendation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Optimal Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recipientMatches.map((match) => (
                  <tr key={match.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{match.recipientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${match.matchingScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{match.matchingScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${match.synchronizationScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{match.synchronizationScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{match.bodyCondition}/5.0</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{match.reproductiveHistory}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRecommendationColor(match.recommendationLevel)}`}>
                        {match.recommendationLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{match.optimalTransferDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-purple-600 hover:text-purple-900 mr-3">Schedule</button>
                      <button className="text-blue-600 hover:text-blue-900">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Embryo Bank Tab */}
      {activeTab === 'embryos' && (
        <div className="space-y-6">
          {/* Embryo Inventory */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Embryo Bank Inventory</h3>
              <p className="text-sm text-gray-600">Comprehensive embryo management and tracking</p>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Embryo ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collection Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Freezing Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Viability</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {embryos.map((embryo) => (
                  <tr key={embryo.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{embryo.embryoID}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{embryo.donorName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{embryo.collectionDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGradeColor(embryo.grade)}`}>
                        Grade {embryo.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{embryo.stage}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{embryo.freezingMethod}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${embryo.viabilityScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{embryo.viabilityScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        embryo.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                        embryo.status === 'TRANSFERRED' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {embryo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {embryo.status === 'AVAILABLE' && (
                        <button className="text-purple-600 hover:text-purple-900 mr-3">Transfer</button>
                      )}
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Success Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Transfer Success Rate</h3>
              <div className="text-3xl font-bold text-green-600 mb-2">{getSuccessRate()}%</div>
              <div className="text-sm text-gray-600">Overall success rate</div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Grade A Embryos</span>
                  <span>95%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Grade B Embryos</span>
                  <span>78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Pregnancy Confirmation</h3>
              <div className="text-3xl font-bold text-purple-600 mb-2">{getPregnancyRate()}%</div>
              <div className="text-sm text-gray-600">Confirmed pregnancies</div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>30-day confirmation</span>
                  <span className="font-medium text-green-600">85%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>60-day confirmation</span>
                  <span className="font-medium text-blue-600">78%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Full-term success</span>
                  <span className="font-medium text-purple-600">72%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Matching Accuracy</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">91%</div>
              <div className="text-sm text-gray-600">AI matching precision</div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Synchronization prediction</span>
                  <span className="font-medium text-blue-600">93%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Compatibility scoring</span>
                  <span className="font-medium text-purple-600">89%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Success prediction</span>
                  <span className="font-medium text-green-600">87%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Performance Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Top Performing Donors</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Bella (C001)</div>
                      <div className="text-sm text-gray-600">2 successful transfers</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">100%</div>
                      <div className="text-xs text-gray-500">Success rate</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Luna (C002)</div>
                      <div className="text-sm text-gray-600">1 successful transfer</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">100%</div>
                      <div className="text-xs text-gray-500">Success rate</div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Optimization Recommendations</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900">Synchronization Optimization</div>
                      <div className="text-sm text-blue-700">Maintain synchronization scores above 85% for optimal results</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <Microscope className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-900">Embryo Quality Focus</div>
                      <div className="text-sm text-green-700">Prioritize Grade A and B embryos for highest success rates</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedEmbryoTransferPage;

