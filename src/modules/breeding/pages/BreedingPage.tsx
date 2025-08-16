import React, { useState, useEffect } from 'react';
import { Heart, Plus, Search, Filter, Edit, Trash2, Eye, Calendar, AlertTriangle, Clock, RefreshCw, CheckCircle, XCircle, Activity } from 'lucide-react';
import { BreedingForm } from '../components/BreedingForm';
import { BullUsageTracker } from '../components/BullUsageTracker';

interface BreedingRecord {
  id: string;
  breedingID: string;
  donorId: string;
  donorName: string;
  bullId: string;
  bullName: string;
  breedingDate: string;
  breedingTime: string;
  method: 'NATURAL' | 'AI' | 'IVF_SEMEN' | 'EMBRYO_TRANSFER';
  operator: string;
  status: 'COMPLETED' | 'FAILED' | 'INCOMPLETE' | 'SCHEDULED';
  attemptNumber: number;
  expectedFlushDate: string;
  quality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  notes: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface Animal {
  id: string;
  name: string;
  internalNumber: string;
  species: string;
  sex: 'MALE' | 'FEMALE';
}

export const BreedingPage: React.FC = () => {
  const [records, setRecords] = useState<BreedingRecord[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BreedingRecord | null>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [activeTab, setActiveTab] = useState<'records' | 'bull-usage'>('records');

  // Sample data - replace with API calls
  useEffect(() => {
    const sampleAnimals: Animal[] = [
      { id: '1', name: 'Bella', internalNumber: 'C001', species: 'CAMEL', sex: 'FEMALE' },
      { id: '2', name: 'Luna', internalNumber: 'C002', species: 'CAMEL', sex: 'FEMALE' },
      { id: '3', name: 'Star', internalNumber: 'C003', species: 'CAMEL', sex: 'FEMALE' },
      { id: '4', name: 'Thunder', internalNumber: 'B001', species: 'BOVINE', sex: 'MALE' },
      { id: '5', name: 'Storm', internalNumber: 'B002', species: 'BOVINE', sex: 'MALE' },
      { id: '6', name: 'King', internalNumber: 'C004', species: 'CAMEL', sex: 'MALE' },
    ];

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const fourDaysAgo = new Date(today);
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

    const sampleRecords: BreedingRecord[] = [
      {
        id: '1',
        breedingID: 'BR-2025-001',
        donorId: '1',
        donorName: 'Bella',
        bullId: '6',
        bullName: 'King',
        breedingDate: today.toISOString().split('T')[0],
        breedingTime: '09:30',
        method: 'AI',
        operator: 'Dr. Smith',
        status: 'COMPLETED',
        attemptNumber: 1,
        expectedFlushDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quality: 'EXCELLENT',
        notes: 'Successful breeding, excellent response',
        createdAt: today.toISOString(),
        updatedAt: today.toISOString()
      },
      {
        id: '2',
        breedingID: 'BR-2025-002',
        donorId: '2',
        donorName: 'Luna',
        bullId: '6',
        bullName: 'King',
        breedingDate: today.toISOString().split('T')[0],
        breedingTime: '14:15',
        method: 'AI',
        operator: 'Dr. Johnson',
        status: 'SCHEDULED',
        attemptNumber: 1,
        expectedFlushDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quality: 'GOOD',
        notes: 'Second breeding today - showing overuse warning',
        createdAt: today.toISOString(),
        updatedAt: today.toISOString()
      },
      {
        id: '3',
        breedingID: 'BR-2025-003',
        donorId: '3',
        donorName: 'Star',
        bullId: '6',
        bullName: 'King',
        breedingDate: yesterday.toISOString().split('T')[0],
        breedingTime: '10:00',
        method: 'AI',
        operator: 'Dr. Smith',
        status: 'COMPLETED',
        attemptNumber: 1,
        expectedFlushDate: new Date(yesterday.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quality: 'EXCELLENT',
        notes: 'Day 2 of consecutive use',
        createdAt: yesterday.toISOString(),
        updatedAt: yesterday.toISOString()
      },
      {
        id: '4',
        breedingID: 'BR-2025-004',
        donorId: '1',
        donorName: 'Bella',
        bullId: '6',
        bullName: 'King',
        breedingDate: twoDaysAgo.toISOString().split('T')[0],
        breedingTime: '15:30',
        method: 'AI',
        operator: 'Dr. Williams',
        status: 'COMPLETED',
        attemptNumber: 1,
        expectedFlushDate: new Date(twoDaysAgo.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quality: 'GOOD',
        notes: 'Day 3 of consecutive use',
        createdAt: twoDaysAgo.toISOString(),
        updatedAt: twoDaysAgo.toISOString()
      },
      {
        id: '5',
        breedingID: 'BR-2025-005',
        donorId: '2',
        donorName: 'Luna',
        bullId: '4',
        bullName: 'Thunder',
        breedingDate: threeDaysAgo.toISOString().split('T')[0],
        breedingTime: '11:00',
        method: 'NATURAL',
        operator: 'Dr. Johnson',
        status: 'FAILED',
        attemptNumber: 2,
        expectedFlushDate: new Date(threeDaysAgo.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quality: 'POOR',
        notes: 'Thunder - moderate usage',
        failureReason: 'Animal rejected mounting',
        createdAt: threeDaysAgo.toISOString(),
        updatedAt: threeDaysAgo.toISOString()
      },
      {
        id: '6',
        breedingID: 'BR-2025-006',
        donorId: '3',
        donorName: 'Star',
        bullId: '4',
        bullName: 'Thunder',
        breedingDate: fourDaysAgo.toISOString().split('T')[0],
        breedingTime: '16:45',
        method: 'AI',
        operator: 'Dr. Brown',
        status: 'COMPLETED',
        attemptNumber: 1,
        expectedFlushDate: new Date(fourDaysAgo.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quality: 'GOOD',
        notes: 'Thunder - moderate usage pattern',
        createdAt: fourDaysAgo.toISOString(),
        updatedAt: fourDaysAgo.toISOString()
      }
    ];

    setAnimals(sampleAnimals);
    setRecords(sampleRecords);
    setIsLoading(false);
  }, []);

  const femaleAnimals = animals.filter(a => a.sex === 'FEMALE');
  const maleAnimals = animals.filter(a => a.sex === 'MALE');

  const filteredRecords = records.filter(record => {
    const matchesSearch = searchTerm === '' || 
      record.breedingID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.bullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.operator.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || record.status === statusFilter;
    const matchesMethod = methodFilter === '' || record.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleAddNew = () => {
    setSelectedRecord(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEdit = (record: BreedingRecord) => {
    setSelectedRecord(record);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDelete = async (record: BreedingRecord) => {
    if (window.confirm(`Are you sure you want to delete breeding record ${record.breedingID}?`)) {
      setRecords(prev => prev.filter(r => r.id !== record.id));
    }
  };

  const handleRepeatBreeding = (record: BreedingRecord) => {
    const newRecord = {
      ...record,
      id: '',
      breedingID: '',
      attemptNumber: record.attemptNumber + 1,
      breedingDate: new Date().toISOString().split('T')[0],
      breedingTime: new Date().toTimeString().slice(0, 5),
      status: 'SCHEDULED' as const,
      notes: `Repeat attempt #${record.attemptNumber + 1} after previous ${record.status.toLowerCase()}`,
      failureReason: undefined
    };
    setSelectedRecord(newRecord);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleFormSave = async (breedingData: BreedingRecord) => {
    try {
      if (formMode === 'edit') {
        // Update existing record
        setRecords(prev => prev.map(r => 
          r.id === breedingData.id ? breedingData : r
        ));
      } else {
        // Add new record
        const newRecord = {
          ...breedingData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setRecords(prev => [newRecord, ...prev]);
      }
      
      setIsFormOpen(false);
      setSelectedRecord(null);
    } catch (error) {
      console.error('Error saving breeding record:', error);
      alert('Failed to save breeding record');
    }
  };

  const calculateExpectedFlushDate = (breedingDate: string): string => {
    const breeding = new Date(breedingDate);
    const flush = new Date(breeding);
    flush.setDate(flush.getDate() + 7); // 7 days after breeding
    return flush.toISOString().split('T')[0];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'FAILED': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'INCOMPLETE': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'SCHEDULED': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'INCOMPLETE': return 'bg-yellow-100 text-yellow-800';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityBadgeColor = (quality: string) => {
    switch (quality) {
      case 'EXCELLENT': return 'bg-green-100 text-green-800';
      case 'GOOD': return 'bg-blue-100 text-blue-800';
      case 'FAIR': return 'bg-yellow-100 text-yellow-800';
      case 'POOR': return 'bg-red-100 text-red-800';
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Heart className="h-8 w-8 text-pink-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Breeding Management</h1>
            <p className="text-gray-600">Track breeding events and manage bull assignments</p>
          </div>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-pink-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Breeding</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('records')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'records'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>Breeding Records</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('bull-usage')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bull-usage'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Bull Usage Tracking</span>
              {/* Show alert indicator if there are overused bulls */}
              {records.some(r => {
                const today = new Date();
                const bullRecords = records.filter(br => 
                  br.bullId === r.bullId && 
                  (br.status === 'COMPLETED' || br.status === 'SCHEDULED') &&
                  new Date(br.breedingDate).toDateString() === today.toDateString()
                );
                return bullRecords.length > 1;
              }) && (
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </div>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'records' && (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-pink-600">{records.length}</div>
              <div className="text-sm text-gray-600">Total Breedings</div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-green-600">
                {records.filter(r => r.status === 'COMPLETED').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-red-600">
                {records.filter(r => r.status === 'FAILED').length}
              </div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">
                {records.filter(r => r.status === 'SCHEDULED').length}
              </div>
              <div className="text-sm text-gray-600">Scheduled</div>
            </div>
          </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search breeding records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
            <option value="INCOMPLETE">Incomplete</option>
            <option value="SCHEDULED">Scheduled</option>
          </select>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="">All Methods</option>
            <option value="NATURAL">Natural</option>
            <option value="AI">Artificial Insemination</option>
            <option value="IVF_SEMEN">IVF Semen</option>
            <option value="EMBRYO_TRANSFER">Embryo Transfer</option>
          </select>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredRecords.length} of {records.length} records
            </span>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Breeding ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor Animal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bull
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date/Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attempt #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expected Flush
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quality
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.breedingID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.donorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.bullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(record.breedingDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">{record.breedingTime}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.method.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(record.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{record.attemptNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(record.expectedFlushDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getQualityBadgeColor(record.quality)}`}>
                      {record.quality}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(record)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {(record.status === 'FAILED' || record.status === 'INCOMPLETE') && (
                      <button
                        onClick={() => handleRepeatBreeding(record)}
                        className="text-green-600 hover:text-green-900"
                        title="Repeat Breeding"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(record)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <Heart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No breeding records found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter || methodFilter
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first breeding record.'}
            </p>
            {!searchTerm && !statusFilter && !methodFilter && (
              <button
                onClick={handleAddNew}
                className="mt-4 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
              >
                Add First Breeding
              </button>
            )}
          </div>
        )}
      </div>
      </>
      )}

      {/* Bull Usage Tracking Tab */}
      {activeTab === 'bull-usage' && (
        <BullUsageTracker records={records} />
      )}

      {/* Breeding Form Modal */}
      <BreedingForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleFormSave}
        breeding={selectedRecord}
        mode={formMode}
        animals={animals}
        allRecords={records}
      />
    </div>
  );
}; 