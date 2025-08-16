import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

interface BreedingRecord {
  id: string;
  animalId: string;
  animalName: string;
  breed: string;
  matingDate: string;
  sireId: string;
  sireName: string;
  method: 'Natural' | 'AI' | 'ET' | 'IVF';
  status: 'Planned' | 'Completed' | 'Confirmed' | 'Failed';
  expectedCalving: string;
  actualCalving?: string;
  offspring?: string;
  notes: string;
  veterinarian: string;
  success: boolean;
  geneticValue: number;
  breedingValue: number;
}

const BreedingPage: React.FC = () => {
  const [breedingRecords, setBreedingRecords] = useState<BreedingRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [methodFilter, setMethodFilter] = useState('All Methods');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockData: BreedingRecord[] = [
      {
        id: 'BR-001',
        animalId: 'HOL-1247',
        animalName: 'Bella',
        breed: 'Holstein',
        matingDate: '2024-06-15',
        sireId: 'BULL-456',
        sireName: 'Champion Thunder',
        method: 'AI',
        status: 'Confirmed',
        expectedCalving: '2025-03-22',
        notes: 'High genetic merit sire. Expected superior milk production offspring.',
        veterinarian: 'Dr. Smith',
        success: true,
        geneticValue: 92.5,
        breedingValue: 88.3
      },
      {
        id: 'BR-002',
        animalId: 'JER-0892',
        animalName: 'Thunder',
        breed: 'Jersey',
        matingDate: '2024-07-20',
        sireId: 'BULL-789',
        sireName: 'Elite Performer',
        method: 'Natural',
        status: 'Completed',
        expectedCalving: '2025-04-26',
        notes: 'Natural breeding with proven bull. Excellent fertility traits.',
        veterinarian: 'Dr. Johnson',
        success: true,
        geneticValue: 89.7,
        breedingValue: 91.2
      },
      {
        id: 'BR-003',
        animalId: 'ANG-1156',
        animalName: 'Princess',
        breed: 'Angus',
        matingDate: '2024-08-10',
        sireId: 'BULL-321',
        sireName: 'Premium Genetics',
        method: 'ET',
        status: 'Planned',
        expectedCalving: '2025-05-17',
        notes: 'Embryo transfer scheduled. High-value genetic combination.',
        veterinarian: 'Dr. Wilson',
        success: false,
        geneticValue: 94.1,
        breedingValue: 86.8
      },
      {
        id: 'BR-004',
        animalId: 'HOL-2134',
        animalName: 'Daisy',
        breed: 'Holstein',
        matingDate: '2024-05-30',
        sireId: 'BULL-654',
        sireName: 'Superior Bloodline',
        method: 'IVF',
        status: 'Failed',
        expectedCalving: '2025-03-07',
        notes: 'IVF procedure unsuccessful. Will retry with different protocol.',
        veterinarian: 'Dr. Brown',
        success: false,
        geneticValue: 87.3,
        breedingValue: 84.6
      },
      {
        id: 'BR-005',
        animalId: 'JER-3456',
        animalName: 'Honey',
        breed: 'Jersey',
        matingDate: '2024-07-05',
        sireId: 'BULL-987',
        sireName: 'Golden Standard',
        method: 'AI',
        status: 'Confirmed',
        expectedCalving: '2025-04-11',
        actualCalving: '2025-04-08',
        offspring: 'JER-4567 (Heifer)',
        notes: 'Successful breeding. Healthy heifer calf born 3 days early.',
        veterinarian: 'Dr. Davis',
        success: true,
        geneticValue: 90.8,
        breedingValue: 89.5
      }
    ];

    setTimeout(() => {
      setBreedingRecords(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRecords = breedingRecords.filter(record => {
    const matchesSearch = record.animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.animalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.sireName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || record.status === statusFilter;
    const matchesMethod = methodFilter === 'All Methods' || record.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const stats = {
    totalRecords: breedingRecords.length,
    successful: breedingRecords.filter(r => r.success).length,
    confirmed: breedingRecords.filter(r => r.status === 'Confirmed').length,
    planned: breedingRecords.filter(r => r.status === 'Planned').length,
    avgGeneticValue: breedingRecords.reduce((sum, r) => sum + r.geneticValue, 0) / breedingRecords.length || 0
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Planned': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'AI': return 'bg-blue-100 text-blue-800';
      case 'Natural': return 'bg-green-100 text-green-800';
      case 'ET': return 'bg-purple-100 text-purple-800';
      case 'IVF': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Breeding Management</h1>
          <p className="text-gray-600 mt-2">Genetic selection, mating programs, and breeding records</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            📊 Breeding Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            🧬 New Breeding
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalRecords}</p>
            </div>
            <div className="text-blue-500 text-2xl">🐄</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Successful</p>
              <p className="text-2xl font-bold text-green-600">{stats.successful}</p>
            </div>
            <div className="text-green-500 text-2xl">✅</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-purple-600">{stats.confirmed}</p>
            </div>
            <div className="text-purple-500 text-2xl">🤰</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Planned</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.planned}</p>
            </div>
            <div className="text-yellow-500 text-2xl">📅</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Genetic Value</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.avgGeneticValue.toFixed(1)}</p>
            </div>
            <div className="text-indigo-500 text-2xl">🧬</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search animals, sires..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Status</option>
              <option>Planned</option>
              <option>Completed</option>
              <option>Confirmed</option>
              <option>Failed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Method</label>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Methods</option>
              <option>Natural</option>
              <option>AI</option>
              <option>ET</option>
              <option>IVF</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
              📊 Export Report
            </button>
          </div>
        </div>
      </Card>

      {/* Breeding Records */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <Card key={record.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {record.animalId} - {record.animalName}
                  </h3>
                  <p className="text-sm text-gray-600">{record.breed} • Breeding ID: {record.id}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                  <Badge className={getMethodColor(record.method)}>
                    {record.method}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                  📋 View Details
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                  ✏️ Edit
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Breeding Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Breeding Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sire:</span>
                    <span className="font-medium">{record.sireName} ({record.sireId})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mating Date:</span>
                    <span className="font-medium">{new Date(record.matingDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-medium">{record.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Veterinarian:</span>
                    <span className="font-medium">{record.veterinarian}</span>
                  </div>
                </div>
              </div>

              {/* Genetic Values */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Genetic Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Genetic Value:</span>
                    <span className="font-medium text-blue-600">{record.geneticValue}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Breeding Value:</span>
                    <span className="font-medium text-green-600">{record.breedingValue}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Calving:</span>
                    <span className="font-medium">{new Date(record.expectedCalving).toLocaleDateString()}</span>
                  </div>
                  {record.actualCalving && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Actual Calving:</span>
                      <span className="font-medium text-green-600">{new Date(record.actualCalving).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Results & Notes */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Results & Notes</h4>
                <div className="space-y-2 text-sm">
                  {record.offspring && (
                    <div>
                      <span className="text-gray-600">Offspring:</span>
                      <p className="font-medium text-green-600">{record.offspring}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Notes:</span>
                    <p className="text-gray-800 mt-1">{record.notes}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 text-4xl mb-4">🐄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No breeding records found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or add a new breeding record.</p>
        </Card>
      )}
    </div>
  );
};

export default BreedingPage;

