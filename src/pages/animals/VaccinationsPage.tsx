import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

interface VaccinationRecord {
  id: string;
  animalId: string;
  animalEarTag: string;
  animalName: string;
  vaccineType: string;
  vaccineName: string;
  manufacturer: string;
  batchNumber: string;
  expirationDate: string;
  administrationDate: string;
  nextDueDate: string;
  dosage: string;
  route: 'intramuscular' | 'subcutaneous' | 'intranasal' | 'oral' | 'intravenous';
  location: string; // Body location where administered
  veterinarian: string;
  notes?: string;
  reactions?: string;
  status: 'completed' | 'scheduled' | 'overdue' | 'cancelled';
  protocolId?: string;
  protocolName?: string;
}

interface VaccinationProtocol {
  id: string;
  name: string;
  description: string;
  species: string[];
  vaccines: {
    vaccineType: string;
    schedule: string;
    ageAtFirstDose: number; // in days
    intervalBetweenDoses: number; // in days
    numberOfDoses: number;
    boosterInterval: number; // in days
  }[];
  isActive: boolean;
}

const VaccinationsPage: React.FC = () => {
  const [records, setRecords] = useState<VaccinationRecord[]>([]);
  const [protocols, setProtocols] = useState<VaccinationProtocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterVaccine, setFilterVaccine] = useState<string>('all');
  const [selectedAnimal, setSelectedAnimal] = useState<string>('all');

  // Demo data for development
  const demoRecords: VaccinationRecord[] = [
    {
      id: '1',
      animalId: '1',
      animalEarTag: 'HOL-1247',
      animalName: 'Bella',
      vaccineType: 'Viral',
      vaccineName: 'BVD-MD Vaccine',
      manufacturer: 'Zoetis',
      batchNumber: 'ZT2024-BVD-001',
      expirationDate: '2025-06-15',
      administrationDate: '2024-08-01',
      nextDueDate: '2025-08-01',
      dosage: '2ml',
      route: 'intramuscular',
      location: 'Left neck',
      veterinarian: 'Dr. Smith',
      notes: 'Annual booster. Animal showed no adverse reactions.',
      reactions: 'None observed',
      status: 'completed',
      protocolId: '1',
      protocolName: 'Dairy Cattle Annual Protocol'
    },
    {
      id: '2',
      animalId: '1',
      animalEarTag: 'HOL-1247',
      animalName: 'Bella',
      vaccineType: 'Bacterial',
      vaccineName: 'Clostridial 7-Way',
      manufacturer: 'Merck',
      batchNumber: 'MK2024-CL7-045',
      expirationDate: '2025-03-20',
      administrationDate: '2024-08-01',
      nextDueDate: '2025-08-01',
      dosage: '5ml',
      route: 'subcutaneous',
      location: 'Right shoulder',
      veterinarian: 'Dr. Smith',
      notes: 'Part of annual vaccination protocol.',
      status: 'completed',
      protocolId: '1',
      protocolName: 'Dairy Cattle Annual Protocol'
    },
    {
      id: '3',
      animalId: '2',
      animalEarTag: 'JER-0892',
      animalName: 'Thunder',
      vaccineType: 'Reproductive',
      vaccineName: 'Vibriosis Vaccine',
      manufacturer: 'Boehringer Ingelheim',
      batchNumber: 'BI2024-VIB-012',
      expirationDate: '2025-04-10',
      administrationDate: '2024-07-15',
      nextDueDate: '2025-01-15',
      dosage: '2ml',
      route: 'intramuscular',
      location: 'Left hip',
      veterinarian: 'Dr. Johnson',
      notes: 'Breeding bull vaccination. Essential for reproductive health.',
      status: 'completed',
      protocolId: '2',
      protocolName: 'Bull Breeding Protocol'
    },
    {
      id: '4',
      animalId: '3',
      animalEarTag: 'ANG-1156',
      animalName: 'Princess',
      vaccineType: 'Viral',
      vaccineName: 'IBR-PI3 Vaccine',
      manufacturer: 'Zoetis',
      batchNumber: 'ZT2024-IBR-089',
      expirationDate: '2025-05-30',
      administrationDate: '2024-08-20',
      nextDueDate: '2024-09-20',
      dosage: '2ml',
      route: 'intramuscular',
      location: 'Right neck',
      veterinarian: 'Dr. Wilson',
      notes: 'First dose of primary series. Second dose scheduled.',
      status: 'scheduled',
      protocolId: '3',
      protocolName: 'Heifer Development Protocol'
    },
    {
      id: '5',
      animalId: '3',
      animalEarTag: 'ANG-1156',
      animalName: 'Princess',
      vaccineType: 'Parasitic',
      vaccineName: 'Lungworm Vaccine',
      manufacturer: 'MSD Animal Health',
      batchNumber: 'MSD2024-LW-067',
      expirationDate: '2025-02-28',
      administrationDate: '2024-06-15',
      nextDueDate: '2024-08-10',
      dosage: '1ml',
      route: 'subcutaneous',
      location: 'Behind left ear',
      veterinarian: 'Dr. Wilson',
      notes: 'Overdue for second dose. Schedule immediately.',
      reactions: 'Mild swelling at injection site (resolved)',
      status: 'overdue'
    }
  ];

  const demoProtocols: VaccinationProtocol[] = [
    {
      id: '1',
      name: 'Dairy Cattle Annual Protocol',
      description: 'Comprehensive annual vaccination program for dairy cattle',
      species: ['bovine'],
      vaccines: [
        {
          vaccineType: 'BVD-MD Vaccine',
          schedule: 'Annual',
          ageAtFirstDose: 180,
          intervalBetweenDoses: 365,
          numberOfDoses: 1,
          boosterInterval: 365
        },
        {
          vaccineType: 'Clostridial 7-Way',
          schedule: 'Annual',
          ageAtFirstDose: 90,
          intervalBetweenDoses: 365,
          numberOfDoses: 1,
          boosterInterval: 365
        }
      ],
      isActive: true
    },
    {
      id: '2',
      name: 'Bull Breeding Protocol',
      description: 'Vaccination protocol for breeding bulls',
      species: ['bovine'],
      vaccines: [
        {
          vaccineType: 'Vibriosis Vaccine',
          schedule: 'Bi-annual',
          ageAtFirstDose: 365,
          intervalBetweenDoses: 180,
          numberOfDoses: 2,
          boosterInterval: 180
        }
      ],
      isActive: true
    },
    {
      id: '3',
      name: 'Heifer Development Protocol',
      description: 'Vaccination schedule for developing heifers',
      species: ['bovine'],
      vaccines: [
        {
          vaccineType: 'IBR-PI3 Vaccine',
          schedule: 'Primary series + annual',
          ageAtFirstDose: 90,
          intervalBetweenDoses: 30,
          numberOfDoses: 2,
          boosterInterval: 365
        }
      ],
      isActive: true
    }
  ];

  useEffect(() => {
    fetchRecords();
    fetchProtocols();
  }, [searchTerm, filterStatus, filterVaccine, selectedAnimal]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      // Try to fetch from enterprise backend
      const params = new URLSearchParams({
        search: searchTerm,
        status: filterStatus !== 'all' ? filterStatus : '',
        vaccine: filterVaccine !== 'all' ? filterVaccine : '',
        animal: selectedAnimal !== 'all' ? selectedAnimal : ''
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/vaccinations?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setRecords(data.records || []);
      } else {
        console.log('Using demo data for vaccination records');
        setRecords(demoRecords);
      }
    } catch (error) {
      console.log('Using demo data for vaccination records');
      setRecords(demoRecords);
    } finally {
      setLoading(false);
    }
  };

  const fetchProtocols = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/vaccination-protocols`);
      
      if (response.ok) {
        const data = await response.json();
        setProtocols(data.protocols || []);
      } else {
        console.log('Using demo data for vaccination protocols');
        setProtocols(demoProtocols);
      }
    } catch (error) {
      console.log('Using demo data for vaccination protocols');
      setProtocols(demoProtocols);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      scheduled: 'bg-blue-100 text-blue-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getVaccineTypeColor = (type: string) => {
    const colors = {
      'Viral': 'bg-purple-100 text-purple-800',
      'Bacterial': 'bg-blue-100 text-blue-800',
      'Reproductive': 'bg-pink-100 text-pink-800',
      'Parasitic': 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const isOverdue = (nextDueDate: string, status: string) => {
    if (status === 'completed') return false;
    return new Date(nextDueDate) < new Date();
  };

  const getDaysUntilDue = (nextDueDate: string) => {
    const today = new Date();
    const dueDate = new Date(nextDueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.animalEarTag.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.vaccineName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    const matchesVaccine = filterVaccine === 'all' || record.vaccineType === filterVaccine;
    const matchesAnimal = selectedAnimal === 'all' || record.animalId === selectedAnimal;
    return matchesSearch && matchesStatus && matchesVaccine && matchesAnimal;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Vaccination Management</h1>
          <p className="text-gray-600 mt-1">Immunization tracking, protocols, and scheduling</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white">
            📋 Protocols
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            💉 New Vaccination
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{records.length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-lg">💉</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {records.filter(r => r.status === 'completed').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-lg">✅</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold text-blue-600">
                  {records.filter(r => r.status === 'scheduled').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-lg">📅</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {records.filter(r => r.status === 'overdue').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-lg">⚠️</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Protocols</p>
                <p className="text-2xl font-bold text-purple-600">
                  {protocols.filter(p => p.isActive).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-lg">📋</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <Input
                placeholder="Search animals, vaccines..."
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
                <option value="completed">Completed</option>
                <option value="scheduled">Scheduled</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vaccine Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterVaccine}
                onChange={(e) => setFilterVaccine(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="Viral">Viral</option>
                <option value="Bacterial">Bacterial</option>
                <option value="Reproductive">Reproductive</option>
                <option value="Parasitic">Parasitic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Animal</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedAnimal}
                onChange={(e) => setSelectedAnimal(e.target.value)}
              >
                <option value="all">All Animals</option>
                <option value="1">HOL-1247 (Bella)</option>
                <option value="2">JER-0892 (Thunder)</option>
                <option value="3">ANG-1156 (Princess)</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                📊 Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vaccination Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRecords.map((record) => (
          <Card key={record.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {record.animalEarTag} - {record.animalName}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {record.vaccineName} • {new Date(record.administrationDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getVaccineTypeColor(record.vaccineType)}>
                    {record.vaccineType}
                  </Badge>
                  <Badge className={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Vaccine Details */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Vaccine Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Manufacturer:</span>
                      <span className="font-medium">{record.manufacturer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Batch:</span>
                      <span className="font-medium">{record.batchNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dosage:</span>
                      <span className="font-medium">{record.dosage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Route:</span>
                      <span className="font-medium capitalize">{record.route}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{record.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Veterinarian:</span>
                      <span className="font-medium">{record.veterinarian}</span>
                    </div>
                  </div>
                </div>

                {/* Schedule Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Schedule</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Given:</span>
                      <span className="font-medium">{new Date(record.administrationDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Due:</span>
                      <span className={`font-medium ${isOverdue(record.nextDueDate, record.status) ? 'text-red-600' : 'text-gray-900'}`}>
                        {new Date(record.nextDueDate).toLocaleDateString()}
                      </span>
                    </div>
                    {record.status !== 'completed' && (
                      <div className="flex justify-between col-span-2">
                        <span className="text-gray-600">Days until due:</span>
                        <span className={`font-medium ${getDaysUntilDue(record.nextDueDate) < 0 ? 'text-red-600' : getDaysUntilDue(record.nextDueDate) <= 7 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {getDaysUntilDue(record.nextDueDate)} days
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Protocol Information */}
                {record.protocolName && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Protocol</h4>
                    <Badge className="bg-indigo-100 text-indigo-800">
                      {record.protocolName}
                    </Badge>
                  </div>
                )}

                {/* Notes and Reactions */}
                {(record.notes || record.reactions) && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Notes & Reactions</h4>
                    {record.notes && (
                      <p className="text-sm text-gray-600 mb-2">{record.notes}</p>
                    )}
                    {record.reactions && (
                      <div className="text-sm">
                        <span className="text-gray-600">Reactions: </span>
                        <span className={`font-medium ${record.reactions.toLowerCase().includes('none') ? 'text-green-600' : 'text-yellow-600'}`}>
                          {record.reactions}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Button size="sm" variant="outline" className="flex-1">
                    📋 View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    ✏️ Edit
                  </Button>
                  {record.status === 'scheduled' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      ✅ Complete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">💉</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vaccination records found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' || filterVaccine !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding your first vaccination record.'
              }
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              💉 New Vaccination
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VaccinationsPage;

