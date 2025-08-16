import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

interface Animal {
  id: string;
  earTag: string;
  name?: string;
  species: string;
  breed: string;
  sex: 'male' | 'female';
  birthDate: string;
  status: 'active' | 'inactive' | 'sold' | 'deceased';
  customerId: string;
  customerName: string;
  location: string;
  weight?: number;
  healthStatus: 'healthy' | 'sick' | 'treatment' | 'quarantine';
  lastCheckup: string;
  microchipId?: string;
  tattooId?: string;
  parentage?: {
    sireId?: string;
    damId?: string;
  };
  genomicData?: {
    snpCount?: number;
    breedingValue?: number;
  };
}

const AnimalsDatabasePage: React.FC = () => {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSpecies, setFilterSpecies] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAnimals, setTotalAnimals] = useState(0);
  const animalsPerPage = 20;

  // Demo data for development
  const demoAnimals: Animal[] = [
    {
      id: '1',
      earTag: 'HOL-1247',
      name: 'Bella',
      species: 'Bovine',
      breed: 'Holstein',
      sex: 'female',
      birthDate: '2022-03-15',
      status: 'active',
      customerId: 'cust-001',
      customerName: 'Green Valley Farm',
      location: 'Barn A-12',
      weight: 650,
      healthStatus: 'healthy',
      lastCheckup: '2024-08-10',
      microchipId: 'MC-001247',
      parentage: {
        sireId: 'HOL-0892',
        damId: 'HOL-1156'
      },
      genomicData: {
        snpCount: 60000,
        breedingValue: 85.2
      }
    },
    {
      id: '2',
      earTag: 'JER-0892',
      name: 'Thunder',
      species: 'Bovine',
      breed: 'Jersey',
      sex: 'male',
      birthDate: '2021-11-22',
      status: 'active',
      customerId: 'cust-002',
      customerName: 'Sunrise Ranch',
      location: 'Pasture B-5',
      weight: 750,
      healthStatus: 'healthy',
      lastCheckup: '2024-08-12',
      microchipId: 'MC-000892',
      genomicData: {
        snpCount: 60000,
        breedingValue: 92.1
      }
    },
    {
      id: '3',
      earTag: 'ANG-1156',
      name: 'Princess',
      species: 'Bovine',
      breed: 'Angus',
      sex: 'female',
      birthDate: '2023-01-08',
      status: 'active',
      customerId: 'cust-003',
      customerName: 'Mountain View Dairy',
      location: 'Barn C-8',
      weight: 580,
      healthStatus: 'treatment',
      lastCheckup: '2024-08-14',
      microchipId: 'MC-001156',
      parentage: {
        sireId: 'ANG-0445',
        damId: 'ANG-0778'
      },
      genomicData: {
        snpCount: 60000,
        breedingValue: 78.9
      }
    }
  ];

  useEffect(() => {
    fetchAnimals();
  }, [currentPage, searchTerm, filterStatus, filterSpecies]);

  const fetchAnimals = async () => {
    setLoading(true);
    try {
      // Try to fetch from test endpoint (no authentication required)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/test/animals`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Successfully fetched real data from backend:', data);
        
        // Transform backend data to match frontend interface
        const transformedAnimals = (data.animals || []).map((animal: any) => ({
          id: animal.id,
          earTag: animal.animal_id,
          name: animal.name,
          species: animal.species === 'BOVINE' ? 'Bovine' : animal.species,
          breed: animal.breed,
          sex: animal.sex === 'FEMALE' ? 'female' : 'male',
          birthDate: animal.date_of_birth || '2022-01-01', // Default if missing
          status: animal.status === 'ACTIVE' ? 'active' : 'inactive',
          customerId: animal.customer_id || 'unknown',
          customerName: 'Real Customer', // Will be populated from customer API later
          location: animal.current_location || 'Unknown',
          weight: animal.weight,
          healthStatus: 'healthy', // Default for now
          lastCheckup: '2024-08-16',
          microchipId: animal.microchip,
          tattooId: '',
          parentage: {},
          genomicData: {
            snpCount: 60000,
            breedingValue: 85.0
          }
        }));
        
        setAnimals(transformedAnimals);
        setTotalAnimals(transformedAnimals.length);
        console.log('✅ Real data loaded successfully:', transformedAnimals.length, 'animals');
      } else {
        // Fallback to demo data with client-side filtering
        console.log('⚠️ API failed, using demo data for animals with filtering');
        const filteredAnimals = applyClientSideFiltering(demoAnimals);
        setAnimals(filteredAnimals);
        setTotalAnimals(filteredAnimals.length);
      }
    } catch (error) {
      console.log('❌ API error, using demo data for animals with filtering:', error);
      const filteredAnimals = applyClientSideFiltering(demoAnimals);
      setAnimals(filteredAnimals);
      setTotalAnimals(filteredAnimals.length);
    } finally {
      setLoading(false);
    }
  };

  const applyClientSideFiltering = (animals: Animal[]) => {
    let filtered = [...animals];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(animal => 
        animal.earTag.toLowerCase().includes(searchLower) ||
        (animal.name && animal.name.toLowerCase().includes(searchLower)) ||
        animal.breed.toLowerCase().includes(searchLower) ||
        animal.customerName.toLowerCase().includes(searchLower) ||
        (animal.microchipId && animal.microchipId.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(animal => animal.status === filterStatus);
    }

    // Apply species filter
    if (filterSpecies !== 'all') {
      filtered = filtered.filter(animal => animal.species === filterSpecies);
    }

    return filtered;
  };

  const handleViewAnimal = (animalId: string) => {
    navigate(`/animals/${animalId}`);
  };

  const handleEditAnimal = (animalId: string) => {
    navigate(`/animals/${animalId}/edit`);
  };

  const handleAddNewAnimal = () => {
    navigate('/animals/new');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
      sold: { color: 'bg-blue-100 text-blue-800', label: 'Sold' },
      deceased: { color: 'bg-red-100 text-red-800', label: 'Deceased' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getHealthBadge = (health: string) => {
    const healthConfig = {
      healthy: { color: 'bg-green-100 text-green-800', label: 'Healthy' },
      sick: { color: 'bg-red-100 text-red-800', label: 'Sick' },
      treatment: { color: 'bg-yellow-100 text-yellow-800', label: 'Treatment' },
      quarantine: { color: 'bg-orange-100 text-orange-800', label: 'Quarantine' }
    };
    const config = healthConfig[health as keyof typeof healthConfig] || healthConfig.healthy;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    
    if (ageInMonths < 12) {
      return `${ageInMonths}mo`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      return months > 0 ? `${years}y ${months}mo` : `${years}y`;
    }
  };

  const totalPages = Math.ceil(totalAnimals / animalsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Animals Database</h1>
          <p className="text-gray-600 mt-1">Comprehensive animal management and tracking</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={handleAddNewAnimal}
        >
          + Add New Animal
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <Input
                placeholder="Search by ear tag, name, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="sold">Sold</option>
                <option value="deceased">Deceased</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Species</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterSpecies}
                onChange={(e) => setFilterSpecies(e.target.value)}
              >
                <option value="all">All Species</option>
                <option value="Bovine">Bovine</option>
                <option value="Equine">Equine</option>
                <option value="Ovine">Ovine</option>
                <option value="Caprine">Caprine</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterSpecies('all');
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Animals Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Animals ({totalAnimals.toLocaleString()})</span>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Page {currentPage} of {totalPages}</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Ear Tag</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Breed</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Age</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Health</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {animals.map((animal) => (
                  <tr key={animal.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-blue-600">{animal.earTag}</div>
                      {animal.microchipId && (
                        <div className="text-xs text-gray-500">MC: {animal.microchipId}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{animal.name || 'Unnamed'}</div>
                      <div className="text-sm text-gray-500">{animal.sex === 'male' ? '♂' : '♀'} {animal.species}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{animal.breed}</div>
                      {animal.weight && (
                        <div className="text-sm text-gray-500">{animal.weight}kg</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{calculateAge(animal.birthDate)}</div>
                      <div className="text-xs text-gray-500">{new Date(animal.birthDate).toLocaleDateString()}</div>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(animal.status)}
                    </td>
                    <td className="py-3 px-4">
                      {getHealthBadge(animal.healthStatus)}
                      <div className="text-xs text-gray-500 mt-1">
                        Last: {new Date(animal.lastCheckup).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-sm">{animal.customerName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">{animal.location}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewAnimal(animal.id)}
                        >
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditAnimal(animal.id)}
                        >
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * animalsPerPage) + 1} to {Math.min(currentPage * animalsPerPage, totalAnimals)} of {totalAnimals} animals
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimalsDatabasePage;

