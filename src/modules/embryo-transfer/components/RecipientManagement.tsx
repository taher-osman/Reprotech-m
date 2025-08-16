import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Plus, Eye, Edit, Trash2, Star, 
  Calendar, Heart, Activity, Award, CheckCircle, Clock,
  AlertTriangle, TrendingUp, Target, Zap, User, 
  ThermometerSun, Stethoscope, MapPin, Download, Upload
} from 'lucide-react';
import { RecipientRecord } from '../types/transferTypes';
import apiService from '../services/api';

interface RecipientManagementProps {}

const RecipientManagement: React.FC<RecipientManagementProps> = () => {
  const [recipients, setRecipients] = useState<RecipientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [readinessFilter, setReadinessFilter] = useState('ALL');
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<RecipientRecord | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Stats for dashboard
  const [stats, setStats] = useState({
    totalRecipients: 0,
    availableRecipients: 0,
    synchronizedRecipients: 0,
    pregnantRecipients: 0,
    averageReadinessScore: 0,
    topPerformers: 0
  });

  useEffect(() => {
    loadRecipients();
  }, []);

  const loadRecipients = async () => {
    try {
      setLoading(true);
      const response = await apiService.getRecipients();
      const recipientData = response?.recipients || generateMockRecipients();
      setRecipients(recipientData);
      calculateStats(recipientData);
    } catch (error) {
      console.error('Error loading recipients:', error);
      const mockData = generateMockRecipients();
      setRecipients(mockData);
      calculateStats(mockData);
    } finally {
      setLoading(false);
    }
  };

  const generateMockRecipients = (): RecipientRecord[] => {
    const statuses: RecipientRecord['currentStatus'][] = ['AVAILABLE', 'SYNCHRONIZED', 'READY', 'TRANSFERRED', 'PREGNANT'];
    const breeds = ['Holstein', 'Angus', 'Jersey', 'Simmental', 'Charolais', 'Limousin'];
    const healthStatuses: RecipientRecord['healthStatus'][] = ['EXCELLENT', 'GOOD', 'FAIR', 'POOR'];
    const protocols = ['CIDR-PGF', 'Ovsynch', 'CoSynch', 'Natural Cycle'];
    
    return Array.from({ length: 24 }, (_, i) => ({
      id: `REC-${(i + 1).toString().padStart(3, '0')}`,
      animalId: `AN-RT-R-${(i + 1).toString().padStart(3, '0')}`,
      name: `Recipient ${i + 1}`,
      species: 'BOVINE' as const,
      breed: breeds[Math.floor(Math.random() * breeds.length)],
      age: Math.floor(Math.random() * 6) + 2, // 2-8 years
      weight: Math.floor(Math.random() * 200) + 400, // 400-600 kg
      bodyConditionScore: Math.floor(Math.random() * 4) + 5, // 5-8

      // Reproductive History
      totalTransfers: Math.floor(Math.random() * 8),
      successfulPregnancies: Math.floor(Math.random() * 6),
      pregnancyRate: Math.floor(Math.random() * 40) + 60, // 60-100%
      lastTransferDate: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000) : undefined,
      lastCalvingDate: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000) : undefined,

      // Current Status
      currentStatus: statuses[Math.floor(Math.random() * statuses.length)],
      synchronizationProtocol: Math.random() > 0.4 ? protocols[Math.floor(Math.random() * protocols.length)] : undefined,
      synchronizationDay: Math.random() > 0.4 ? Math.floor(Math.random() * 21) + 1 : undefined,
      readinessScore: Math.floor(Math.random() * 40) + 60, // 60-100

      // Health Metrics
      healthStatus: healthStatuses[Math.floor(Math.random() * healthStatuses.length)],
      lastVetCheck: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
      vaccinations: ['FMD', 'RVF', 'LSD'].slice(0, Math.floor(Math.random() * 3) + 1),
      currentMedications: Math.random() > 0.7 ? ['Progesterone', 'Antibiotics'].slice(0, Math.floor(Math.random() * 2) + 1) : [],

      // Location & Management
      currentLocation: `Barn ${Math.floor(Math.random() * 5) + 1}`,
      owner: `Customer ${Math.floor(Math.random() * 10) + 1}`,
      manager: ['Dr. Sarah Ahmed', 'Dr. Ahmad Ali', 'Dr. Fatima Hassan'][Math.floor(Math.random() * 3)],

      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date()
    }));
  };

  const calculateStats = (recipientData: RecipientRecord[]) => {
    const total = recipientData.length;
    const available = recipientData.filter(r => r.currentStatus === 'AVAILABLE').length;
    const synchronized = recipientData.filter(r => r.currentStatus === 'SYNCHRONIZED').length;
    const pregnant = recipientData.filter(r => r.currentStatus === 'PREGNANT').length;
    const avgReadiness = recipientData.reduce((sum, r) => sum + r.readinessScore, 0) / total;
    const topPerformers = recipientData.filter(r => r.pregnancyRate >= 80).length;

    setStats({
      totalRecipients: total,
      availableRecipients: available,
      synchronizedRecipients: synchronized,
      pregnantRecipients: pregnant,
      averageReadinessScore: Math.round(avgReadiness),
      topPerformers
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'SYNCHRONIZED': return 'bg-blue-100 text-blue-800';
      case 'READY': return 'bg-purple-100 text-purple-800';
      case 'TRANSFERRED': return 'bg-yellow-100 text-yellow-800';
      case 'PREGNANT': return 'bg-pink-100 text-pink-800';
      case 'CALVED': return 'bg-indigo-100 text-indigo-800';
      case 'RETIRED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'EXCELLENT': return 'text-green-600';
      case 'GOOD': return 'text-blue-600';
      case 'FAIR': return 'text-yellow-600';
      case 'POOR': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getReadinessColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const filteredRecipients = recipients.filter(recipient => {
    const matchesSearch = searchTerm === '' || 
      recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipient.animalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipient.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipient.owner.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || recipient.currentStatus === statusFilter;
    
    const matchesReadiness = readinessFilter === 'ALL' || 
      (readinessFilter === 'HIGH' && recipient.readinessScore >= 85) ||
      (readinessFilter === 'MEDIUM' && recipient.readinessScore >= 70 && recipient.readinessScore < 85) ||
      (readinessFilter === 'LOW' && recipient.readinessScore < 70);

    return matchesSearch && matchesStatus && matchesReadiness;
  });

  const handleEditRecipient = (recipient: RecipientRecord) => {
    setEditingRecipient(recipient);
    setIsFormOpen(true);
  };

  const handleDeleteRecipient = async (recipientId: string) => {
    if (window.confirm('Are you sure you want to delete this recipient?')) {
      try {
        await apiService.delete(`/embryo-transfer/recipients/${recipientId}`);
        await loadRecipients();
      } catch (error) {
        console.error('Error deleting recipient:', error);
        alert('Failed to delete recipient');
      }
    }
  };

  const handleStatusUpdate = async (recipientId: string, newStatus: string) => {
    try {
      await apiService.updateRecipientStatus(recipientId, newStatus);
      await loadRecipients();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="h-8 w-8 text-purple-600 mr-3" />
              Recipient Management
            </h2>
            <p className="text-gray-600 mt-1">Comprehensive recipient tracking and quality assessment</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Recipients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRecipients}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">{stats.availableRecipients}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Synchronized</p>
              <p className="text-2xl font-bold text-blue-600">{stats.synchronizedRecipients}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pregnant</p>
              <p className="text-2xl font-bold text-pink-600">{stats.pregnantRecipients}</p>
            </div>
            <Heart className="h-8 w-8 text-pink-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Readiness</p>
              <p className="text-2xl font-bold text-purple-600">{stats.averageReadinessScore}%</p>
            </div>
            <Target className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Top Performers</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.topPerformers}</p>
            </div>
            <Award className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search recipients by name, ID, breed, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="SYNCHRONIZED">Synchronized</option>
              <option value="READY">Ready</option>
              <option value="TRANSFERRED">Transferred</option>
              <option value="PREGNANT">Pregnant</option>
              <option value="CALVED">Calved</option>
              <option value="RETIRED">Retired</option>
            </select>

            <select
              value={readinessFilter}
              onChange={(e) => setReadinessFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">All Readiness</option>
              <option value="HIGH">High (85%+)</option>
              <option value="MEDIUM">Medium (70-84%)</option>
              <option value="LOW">Low (&lt;70%)</option>
            </select>

            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 ${viewMode === 'table' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'}`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'}`}
              >
                Grid
              </button>
            </div>

            <button
              onClick={() => setIsFormOpen(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Recipient
            </button>
          </div>
        </div>
      </div>

      {/* Recipients Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recipients ({filteredRecipients.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status & Readiness
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Physical Metrics
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Reproductive History
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Health Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Location & Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecipients.map((recipient) => (
                <tr key={recipient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-2 rounded-lg mr-3">
                        <User className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{recipient.name}</div>
                        <div className="text-xs text-gray-500">{recipient.animalId}</div>
                        <div className="text-xs text-gray-600">{recipient.breed} • {recipient.age} years</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(recipient.currentStatus)}`}>
                        {recipient.currentStatus}
                      </span>
                      <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getReadinessColor(recipient.readinessScore)}`}>
                        {recipient.readinessScore}% Ready
                      </div>
                      {recipient.synchronizationProtocol && (
                        <div className="text-xs text-gray-600">
                          {recipient.synchronizationProtocol} (Day {recipient.synchronizationDay})
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>{recipient.weight} kg</div>
                      <div className="text-xs text-gray-600">BCS: {recipient.bodyConditionScore}/9</div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>{recipient.totalTransfers} transfers</div>
                      <div className="text-xs text-gray-600">{recipient.pregnancyRate}% success rate</div>
                      <div className="text-xs text-gray-600">{recipient.successfulPregnancies} pregnancies</div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className={`text-sm font-medium ${getHealthColor(recipient.healthStatus)}`}>
                        {recipient.healthStatus}
                      </div>
                      <div className="text-xs text-gray-600">
                        Last check: {recipient.lastVetCheck.toLocaleDateString()}
                      </div>
                      {recipient.vaccinations.length > 0 && (
                        <div className="text-xs text-green-600">
                          ✓ {recipient.vaccinations.join(', ')}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {recipient.currentLocation}
                      </div>
                      <div className="text-xs text-gray-600">{recipient.owner}</div>
                      <div className="text-xs text-gray-600">{recipient.manager}</div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {/* View details */}}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditRecipient(recipient)}
                        className="text-green-600 hover:text-green-900"
                        title="Edit Recipient"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRecipient(recipient.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Recipient"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredRecipients.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Recipients Found</h3>
          <p className="text-gray-600 mb-4">No recipients match your current filters.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('ALL');
              setReadinessFilter('ALL');
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipientManagement; 