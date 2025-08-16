import React, { useState, useEffect } from 'react';
import api from './services/api';

// =====================================================
// SEMEN COLLECTION MODULE
// Record and manage semen collection from animals
// =====================================================

interface SemenCollection {
  id: string;
  semenBatchId: string;
  collectionDate: string;
  collectionTime: string;
  collectionMethod: string;
  observationNotes?: string;
  animal: {
    animalID: string;
    name: string;
    species: string;
    customer: {
      name: string;
    };
  };
  collector: {
    firstName: string;
    lastName: string;
    role: string;
  };
  creator: {
    firstName: string;
    lastName: string;
  };
  casaAnalysis: Array<{
    id: string;
    analysisDate: string;
    readyForSorting: boolean;
    readyForFreezing: boolean;
  }>;
  createdAt: string;
}

interface Animal {
  id: string;
  animalID: string;
  name: string;
  species: string;
  sex: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface CollectionFormData {
  animalId: string;
  collectionDate: string;
  collectionTime: string;
  collectorId: string;
  collectionMethod: string;
  observationNotes: string;
}

const SemenCollectionPage: React.FC = () => {
  const [collections, setCollections] = useState<SemenCollection[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState<SemenCollection | null>(null);
  const [formData, setFormData] = useState<CollectionFormData>({
    animalId: '',
    collectionDate: new Date().toISOString().split('T')[0],
    collectionTime: new Date().toTimeString().slice(0, 5),
    collectorId: '',
    collectionMethod: 'AV',
    observationNotes: ''
  });

  // Filter states
  const [animalFilter, setAnimalFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('30'); // Last 30 days

  // Fetch collections
  const fetchCollections = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockCollections = [
        {
          id: '1',
          semenBatchId: 'SB-2024-001',
          collectionDate: '2024-06-30',
          collectionTime: '10:30',
          collectionMethod: 'AV',
          observationNotes: 'Good quality sample',
          animal: {
            animalID: 'BL-001',
            name: 'Thunder',
            species: 'Bovine',
            customer: { name: 'Johnson Farm' }
          },
          collector: {
            firstName: 'Dr. John',
            lastName: 'Smith',
            role: 'VET'
          },
          creator: {
            firstName: 'Dr. John',
            lastName: 'Smith'
          },
          casaAnalysis: [],
          createdAt: '2024-06-30T10:30:00Z'
        }
      ];
      setCollections(mockCollections);
    } catch (error) {
      console.error('Error fetching collections:', error);
      setError('Failed to load semen collections');
    } finally {
      setLoading(false);
    }
  };

  // Fetch animals and users
  const fetchAnimals = async () => {
    try {
      // Mock data for now
      const mockAnimals = [
        { id: '1', animalID: 'BL-001', name: 'Thunder', species: 'Bovine', sex: 'Male' },
        { id: '2', animalID: 'EQ-002', name: 'Lightning', species: 'Equine', sex: 'Male' }
      ];
      setAnimals(mockAnimals);
    } catch (error) {
      console.error('Error fetching animals:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      // Mock data for now
      const mockUsers = [
        { id: '1', firstName: 'Dr. John', lastName: 'Smith', role: 'VET' },
        { id: '2', firstName: 'Sarah', lastName: 'Johnson', role: 'LAB_TECH' }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Form handlers
  const handleCreateCollection = () => {
    setEditingCollection(null);
    setFormData({
      animalId: '',
      collectionDate: new Date().toISOString().split('T')[0],
      collectionTime: new Date().toTimeString().slice(0, 5),
      collectorId: '',
      collectionMethod: 'AV',
      observationNotes: ''
    });
    setShowForm(true);
  };

  const handleEditCollection = (collection: SemenCollection) => {
    setEditingCollection(collection);
    setFormData({
      animalId: collection.animal.animalID,
      collectionDate: collection.collectionDate.split('T')[0],
      collectionTime: collection.collectionTime,
      collectorId: collection.collector.firstName,
      collectionMethod: collection.collectionMethod,
      observationNotes: collection.observationNotes || ''
    });
    setShowForm(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Mock submission - replace with actual API call
      console.log('Submitting collection data:', formData);
      setShowForm(false);
      fetchCollections();
    } catch (error) {
      console.error('Error saving collection:', error);
      setError('Failed to save semen collection');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (confirm('Are you sure you want to delete this semen collection?')) {
      try {
        // Mock deletion - replace with actual API call
        console.log('Deleting collection:', id);
        fetchCollections();
      } catch (error) {
        console.error('Error deleting collection:', error);
        setError('Failed to delete semen collection');
      }
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'AV': return '🔧';
      case 'ELECTROEJACULATION': return '⚡';
      case 'INTERNAL_CONDOM': return '🛡️';
      case 'EPIDIDYMAL_FLUSH': return '💧';
      case 'POSTMORTEM': return '🏥';
      default: return '🧪';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'AV': return 'bg-blue-100 text-blue-800';
      case 'ELECTROEJACULATION': return 'bg-yellow-100 text-yellow-800';
      case 'INTERNAL_CONDOM': return 'bg-green-100 text-green-800';
      case 'EPIDIDYMAL_FLUSH': return 'bg-cyan-100 text-cyan-800';
      case 'POSTMORTEM': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetchCollections();
    fetchAnimals();
    fetchUsers();
  }, [animalFilter, methodFilter, dateFilter]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🧪 Semen Collection</h2>
          <p className="text-gray-600 mt-1">Record and manage semen collection from animals</p>
        </div>
        <button
          onClick={handleCreateCollection}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <span>➕</span>
          <span>New Collection</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Animal:</span>
            <select
              value={animalFilter}
              onChange={(e) => setAnimalFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Animals</option>
              {animals.map((animal) => (
                <option key={animal.id} value={animal.id}>
                  {animal.name} ({animal.animalID})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Method:</span>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Methods</option>
              <option value="AV">🔧 Artificial Vagina</option>
              <option value="ELECTROEJACULATION">⚡ Electroejaculation</option>
              <option value="INTERNAL_CONDOM">🛡️ Internal Condom</option>
              <option value="EPIDIDYMAL_FLUSH">💧 Epididymal Flush</option>
              <option value="POSTMORTEM">🏥 Post-mortem</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Period:</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Collections Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading collections...</p>
          </div>
        ) : collections.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Animal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Collection
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Collector
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
                {collections.map((collection) => (
                  <tr key={collection.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{collection.semenBatchId}</div>
                      <div className="text-sm text-gray-500">{formatDate(collection.collectionDate)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{collection.animal.name}</div>
                      <div className="text-sm text-gray-500">
                        {collection.animal.animalID} • {collection.animal.species}
                      </div>
                      <div className="text-xs text-gray-400">{collection.animal.customer.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{collection.collectionTime}</div>
                      <div className="text-sm text-gray-500">{formatDate(collection.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMethodColor(collection.collectionMethod)}`}>
                        {getMethodIcon(collection.collectionMethod)} {collection.collectionMethod.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {collection.collector.firstName} {collection.collector.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{collection.collector.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {collection.casaAnalysis.length > 0 ? (
                          <div className="text-xs">
                            <div className="text-green-600">✅ CASA: {collection.casaAnalysis.length}</div>
                            {collection.casaAnalysis.some(a => a.readyForSorting) && (
                              <div className="text-yellow-600">⚡ Ready for Sorting</div>
                            )}
                            {collection.casaAnalysis.some(a => a.readyForFreezing) && (
                              <div className="text-cyan-600">❄️ Ready for Freezing</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500">⏳ Pending CASA</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditCollection(collection)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCollection(collection.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🧪</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No collections found</h3>
            <p className="text-gray-600 mb-4">Start by recording your first semen collection</p>
            <button
              onClick={handleCreateCollection}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create First Collection
            </button>
          </div>
        )}
      </div>

      {/* Collection Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingCollection ? 'Edit Collection' : 'New Semen Collection'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Animal *
                    </label>
                    <select
                      value={formData.animalId}
                      onChange={(e) => setFormData(prev => ({ ...prev, animalId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Animal</option>
                      {animals.map((animal) => (
                        <option key={animal.id} value={animal.id}>
                          {animal.name} ({animal.animalID}) - {animal.species}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Collector *
                    </label>
                    <select
                      value={formData.collectorId}
                      onChange={(e) => setFormData(prev => ({ ...prev, collectorId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Collector</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName} ({user.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Collection Date *
                    </label>
                    <input
                      type="date"
                      value={formData.collectionDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, collectionDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Collection Time *
                    </label>
                    <input
                      type="time"
                      value={formData.collectionTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, collectionTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collection Method *
                  </label>
                  <select
                    value={formData.collectionMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, collectionMethod: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="AV">🔧 Artificial Vagina</option>
                    <option value="ELECTROEJACULATION">⚡ Electroejaculation</option>
                    <option value="INTERNAL_CONDOM">🛡️ Internal Condom</option>
                    <option value="EPIDIDYMAL_FLUSH">💧 Epididymal Flush</option>
                    <option value="POSTMORTEM">🏥 Post-mortem</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observation Notes
                  </label>
                  <textarea
                    value={formData.observationNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, observationNotes: e.target.value }))}
                    placeholder="Any observations during collection..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : editingCollection ? 'Update Collection' : 'Create Collection'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SemenCollectionPage;
