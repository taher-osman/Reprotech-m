import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface Animal {
  id: string;
  animal_id: string;
  name?: string;
  species: string;
  breed: string;
  sex: string;
  date_of_birth?: string;
  status: string;
  customer_id?: string;
  customer_name?: string;
  current_location?: string;
  weight?: number;
  microchip?: string;
  purpose?: string;
  notes?: string;
  created_at: string;
}

const AnimalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState<Animal | null>(null);
  const [loading, setLoading] = useState(true);

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
    fetchAnimal();
  }, [id]);

  const fetchAnimal = async () => {
    setLoading(true);
    try {
      console.log(`🔍 Fetching animal details for ID: ${id}`);
      
      // Use test endpoint for real data without authentication
      const response = await fetch(`${import.meta.env.VITE_API_URL}/test/animals/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Animal details fetched successfully:', data);
        setAnimal(data.animal);
      } else {
        console.error('❌ Failed to fetch animal details:', response.status);
        setAnimal(null);
      }
    } catch (error) {
      console.error('❌ Error fetching animal details:', error);
      setAnimal(null);
    } finally {
      setLoading(false);
    }
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
      return `${ageInMonths} months`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;
      return months > 0 ? `${years} years ${months} months` : `${years} years`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Animal Not Found</h1>
            <p className="text-gray-600 mt-1">The requested animal could not be found</p>
          </div>
          <Button 
            variant="outline"
            onClick={() => navigate('/animals')}
          >
            ← Back to Animals
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{animal.name || 'Unnamed Animal'}</h1>
          <p className="text-gray-600 mt-1">{animal.animal_id} • {animal.breed} • {animal.customer_name}</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            onClick={() => navigate('/animals')}
          >
            ← Back to Animals
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => navigate(`/animals/${id}/edit`)}
          >
            Edit Animal
          </Button>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <p className="text-lg">{animal.date_of_birth ? calculateAge(animal.date_of_birth) : 'Unknown'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <p className="text-lg">{animal.weight ? `${animal.weight} kg` : 'Not recorded'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                {getStatusBadge(animal.status.toLowerCase())}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <p className="text-lg">{animal.current_location || 'Unknown'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Microchip ID</label>
                <p className="text-lg">{animal.microchip || 'Not implanted'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <p className="text-lg">{animal.purpose || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
                <p className="text-lg">{animal.date_of_birth ? new Date(animal.date_of_birth).toLocaleDateString() : 'Unknown'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <p className="text-lg">{animal.weight ? `${animal.weight} kg` : 'Not recorded'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status & Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              {getStatusBadge(animal.status)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Health Status</label>
              {getHealthBadge(animal.healthStatus)}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Checkup</label>
              <p className="text-sm text-gray-600">{new Date(animal.lastCheckup).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Identification & Location */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Identification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Microchip ID</label>
              <p className="text-lg font-mono">{animal.microchipId || 'Not recorded'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tattoo ID</label>
              <p className="text-lg font-mono">{animal.tattooId || 'Not recorded'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location & Owner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <p className="text-lg">{animal.customer_name || 'Unknown Customer'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <p className="text-lg">{animal.current_location || 'Unknown'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parentage & Genomics */}
      {(animal.parentage || animal.genomicData) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {animal.parentage && (
            <Card>
              <CardHeader>
                <CardTitle>Parentage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sire ID</label>
                  <p className="text-lg font-mono">{animal.parentage.sireId || 'Unknown'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dam ID</label>
                  <p className="text-lg font-mono">{animal.parentage.damId || 'Unknown'}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {animal.genomicData && (
            <Card>
              <CardHeader>
                <CardTitle>Genomic Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SNP Count</label>
                  <p className="text-lg">{animal.genomicData.snpCount?.toLocaleString() || 'Not available'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Breeding Value</label>
                  <p className="text-lg font-semibold text-green-600">
                    {animal.genomicData.breedingValue ? `${animal.genomicData.breedingValue}%` : 'Not calculated'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">View Health Records</Button>
            <Button variant="outline">View Breeding History</Button>
            <Button variant="outline">View Genomic Analysis</Button>
            <Button variant="outline">Schedule Checkup</Button>
            <Button variant="outline">Add Note</Button>
            <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
              Archive Animal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimalDetailPage;

