import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

interface PhenotypeRecord {
  id: string;
  animalId: string;
  animalEarTag: string;
  animalName: string;
  recordDate: string;
  recordType: 'physical' | 'performance' | 'health' | 'genomic';
  measurements: {
    height?: number;
    weight?: number;
    bodyConditionScore?: number;
    chestGirth?: number;
    bodyLength?: number;
    hipHeight?: number;
  };
  performance: {
    milkYield?: number;
    milkFat?: number;
    milkProtein?: number;
    feedEfficiency?: number;
    reproductivePerformance?: number;
  };
  traits: {
    coatColor?: string;
    markings?: string;
    temperament?: 'calm' | 'active' | 'aggressive' | 'docile';
    conformation?: number; // 1-10 scale
  };
  genomicData: {
    snpCount?: number;
    breedingValue?: number;
    genomicAccuracy?: number;
    inheritedTraits?: string[];
  };
  photos?: string[];
  notes?: string;
  recordedBy: string;
  status: 'active' | 'archived' | 'pending_review';
}

const PhenotypeAnalysisPage: React.FC = () => {
  const [records, setRecords] = useState<PhenotypeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Demo data for development
  const demoRecords: PhenotypeRecord[] = [
    {
      id: '1',
      animalId: '1',
      animalEarTag: 'HOL-1247',
      animalName: 'Bella',
      recordDate: '2024-08-15',
      recordType: 'physical',
      measurements: {
        height: 142,
        weight: 650,
        bodyConditionScore: 3.5,
        chestGirth: 195,
        bodyLength: 165,
        hipHeight: 145
      },
      performance: {
        milkYield: 35.2,
        milkFat: 3.8,
        milkProtein: 3.2,
        feedEfficiency: 1.45
      },
      traits: {
        coatColor: 'Black and White',
        markings: 'Holstein pattern',
        temperament: 'calm',
        conformation: 8.5
      },
      genomicData: {
        snpCount: 60000,
        breedingValue: 85.2,
        genomicAccuracy: 92.1,
        inheritedTraits: ['High milk yield', 'Disease resistance', 'Longevity']
      },
      photos: ['photo1.jpg', 'photo2.jpg'],
      notes: 'Excellent conformation, strong dairy character. Recommended for breeding program.',
      recordedBy: 'Dr. Smith',
      status: 'active'
    },
    {
      id: '2',
      animalId: '2',
      animalEarTag: 'JER-0892',
      animalName: 'Thunder',
      recordDate: '2024-08-14',
      recordType: 'performance',
      measurements: {
        height: 138,
        weight: 750,
        bodyConditionScore: 4.0,
        chestGirth: 205,
        bodyLength: 170
      },
      performance: {
        reproductivePerformance: 95.5,
        feedEfficiency: 1.62
      },
      traits: {
        coatColor: 'Light Brown',
        temperament: 'active',
        conformation: 9.2
      },
      genomicData: {
        snpCount: 60000,
        breedingValue: 92.1,
        genomicAccuracy: 94.8,
        inheritedTraits: ['Superior fertility', 'Heat tolerance', 'Muscle development']
      },
      notes: 'Outstanding breeding bull with exceptional genetic merit.',
      recordedBy: 'Dr. Johnson',
      status: 'active'
    },
    {
      id: '3',
      animalId: '3',
      animalEarTag: 'ANG-1156',
      animalName: 'Princess',
      recordDate: '2024-08-13',
      recordType: 'health',
      measurements: {
        height: 135,
        weight: 580,
        bodyConditionScore: 3.2
      },
      traits: {
        coatColor: 'Black',
        temperament: 'docile',
        conformation: 7.8
      },
      genomicData: {
        snpCount: 60000,
        breedingValue: 78.9,
        genomicAccuracy: 88.3,
        inheritedTraits: ['Marbling quality', 'Growth rate', 'Docility']
      },
      notes: 'Currently under treatment, monitoring recovery progress.',
      recordedBy: 'Dr. Wilson',
      status: 'pending_review'
    }
  ];

  useEffect(() => {
    fetchRecords();
  }, [searchTerm, filterType]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      // Try to fetch from enterprise backend
      const params = new URLSearchParams({
        search: searchTerm,
        type: filterType !== 'all' ? filterType : ''
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/phenotype?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setRecords(data.records || []);
      } else {
        console.log('Using demo data for phenotype records');
        setRecords(demoRecords);
      }
    } catch (error) {
      console.log('Using demo data for phenotype records');
      setRecords(demoRecords);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      physical: 'bg-blue-100 text-blue-800',
      performance: 'bg-green-100 text-green-800',
      health: 'bg-yellow-100 text-yellow-800',
      genomic: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800',
      pending_review: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Phenotype Analysis</h1>
          <p className="text-gray-600 mt-1">Physical traits, performance metrics, and genomic analysis</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          + New Analysis
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{records.length}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-lg">📊</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Breeding Value</p>
                <p className="text-2xl font-bold text-green-600">
                  {(records.reduce((sum, r) => sum + (r.genomicData.breedingValue || 0), 0) / records.length).toFixed(1)}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-lg">📈</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Genomic Accuracy</p>
                <p className="text-2xl font-bold text-purple-600">
                  {(records.reduce((sum, r) => sum + (r.genomicData.genomicAccuracy || 0), 0) / records.length).toFixed(1)}%
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-lg">🧬</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">With Photos</p>
                <p className="text-2xl font-bold text-orange-600">
                  {records.filter(r => r.photos && r.photos.length > 0).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-lg">📷</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <Input
                placeholder="Search by ear tag or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Record Type</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="physical">Physical</option>
                <option value="performance">Performance</option>
                <option value="health">Health</option>
                <option value="genomic">Genomic</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                Export Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {records.map((record) => (
          <Card key={record.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {record.animalEarTag} - {record.animalName}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(record.recordDate).toLocaleDateString()} • {record.recordedBy}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getTypeColor(record.recordType)}>
                    {record.recordType.charAt(0).toUpperCase() + record.recordType.slice(1)}
                  </Badge>
                  <Badge className={getStatusColor(record.status)}>
                    {record.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* Physical Measurements */}
                {record.measurements && Object.keys(record.measurements).length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Physical Measurements</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {record.measurements.height && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Height:</span>
                          <span className="font-medium">{record.measurements.height} cm</span>
                        </div>
                      )}
                      {record.measurements.weight && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Weight:</span>
                          <span className="font-medium">{record.measurements.weight} kg</span>
                        </div>
                      )}
                      {record.measurements.bodyConditionScore && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">BCS:</span>
                          <span className="font-medium">{record.measurements.bodyConditionScore}/5</span>
                        </div>
                      )}
                      {record.traits.conformation && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Conformation:</span>
                          <span className="font-medium">{record.traits.conformation}/10</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Performance Data */}
                {record.performance && Object.keys(record.performance).length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Performance Metrics</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {record.performance.milkYield && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Milk Yield:</span>
                          <span className="font-medium">{record.performance.milkYield} L/day</span>
                        </div>
                      )}
                      {record.performance.milkFat && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fat %:</span>
                          <span className="font-medium">{record.performance.milkFat}%</span>
                        </div>
                      )}
                      {record.performance.feedEfficiency && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Feed Efficiency:</span>
                          <span className="font-medium">{record.performance.feedEfficiency}</span>
                        </div>
                      )}
                      {record.performance.reproductivePerformance && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reproductive:</span>
                          <span className="font-medium">{record.performance.reproductivePerformance}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Genomic Data */}
                {record.genomicData && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Genomic Analysis</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Breeding Value:</span>
                        <span className="font-medium text-green-600">{record.genomicData.breedingValue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Accuracy:</span>
                        <span className="font-medium">{record.genomicData.genomicAccuracy}%</span>
                      </div>
                      {record.genomicData.inheritedTraits && (
                        <div>
                          <span className="text-gray-600">Key Traits:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {record.genomicData.inheritedTraits.slice(0, 2).map((trait, index) => (
                              <Badge key={index} className="bg-purple-100 text-purple-800 text-xs">
                                {trait}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {record.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600">{record.notes}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Edit
                  </Button>
                  {record.photos && record.photos.length > 0 && (
                    <Button size="sm" variant="outline">
                      📷
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {records.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No phenotype records found</h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first phenotype analysis.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              + New Analysis
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PhenotypeAnalysisPage;

