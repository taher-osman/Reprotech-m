import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

interface EmbryoRecord {
  id: string;
  embryoId: string;
  donorId: string;
  donorName: string;
  sireId: string;
  sireName: string;
  collectionDate: string;
  developmentStage: 'Morula' | 'Early Blastocyst' | 'Blastocyst' | 'Expanded Blastocyst' | 'Hatched Blastocyst';
  quality: 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4';
  morphology: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  status: 'Fresh' | 'Frozen' | 'Transferred' | 'Discarded' | 'Cultured';
  freezingDate?: string;
  transferDate?: string;
  recipientId?: string;
  recipientName?: string;
  storageLocation?: string;
  viability: number;
  cellCount: number;
  fragmentationRate: number;
  zona: 'Intact' | 'Partial' | 'Hatching' | 'Hatched';
  innerCellMass: 'A' | 'B' | 'C';
  trophectoderm: 'A' | 'B' | 'C';
  notes: string;
  embryologist: string;
  success: boolean;
}

const EmbryoDetailPage: React.FC = () => {
  const [embryoRecords, setEmbryoRecords] = useState<EmbryoRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [qualityFilter, setQualityFilter] = useState('All Qualities');
  const [stageFilter, setStageFilter] = useState('All Stages');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockData: EmbryoRecord[] = [
      {
        id: 'EMB-001',
        embryoId: 'E2024-001',
        donorId: 'HOL-1247',
        donorName: 'Bella',
        sireId: 'BULL-456',
        sireName: 'Champion Thunder',
        collectionDate: '2024-08-10',
        developmentStage: 'Expanded Blastocyst',
        quality: 'Grade 1',
        morphology: 'Excellent',
        status: 'Frozen',
        freezingDate: '2024-08-12',
        storageLocation: 'Tank A-1, Canister 5, Straw 23',
        viability: 95,
        cellCount: 120,
        fragmentationRate: 5,
        zona: 'Intact',
        innerCellMass: 'A',
        trophectoderm: 'A',
        notes: 'Excellent quality embryo with perfect morphology. High implantation potential.',
        embryologist: 'Dr. Martinez',
        success: true
      },
      {
        id: 'EMB-002',
        embryoId: 'E2024-002',
        donorId: 'JER-0892',
        donorName: 'Thunder',
        sireId: 'BULL-789',
        sireName: 'Elite Performer',
        collectionDate: '2024-08-11',
        developmentStage: 'Blastocyst',
        quality: 'Grade 2',
        morphology: 'Good',
        status: 'Transferred',
        transferDate: '2024-08-13',
        recipientId: 'HOL-3456',
        recipientName: 'Rosie',
        viability: 88,
        cellCount: 95,
        fragmentationRate: 12,
        zona: 'Intact',
        innerCellMass: 'A',
        trophectoderm: 'B',
        notes: 'Good quality embryo successfully transferred. Recipient showing positive signs.',
        embryologist: 'Dr. Chen',
        success: true
      },
      {
        id: 'EMB-003',
        embryoId: 'E2024-003',
        donorId: 'ANG-1156',
        donorName: 'Princess',
        sireId: 'BULL-321',
        sireName: 'Premium Genetics',
        collectionDate: '2024-08-12',
        developmentStage: 'Early Blastocyst',
        quality: 'Grade 2',
        morphology: 'Good',
        status: 'Cultured',
        viability: 82,
        cellCount: 78,
        fragmentationRate: 18,
        zona: 'Intact',
        innerCellMass: 'B',
        trophectoderm: 'B',
        notes: 'Embryo in extended culture for further development assessment.',
        embryologist: 'Dr. Rodriguez',
        success: false
      },
      {
        id: 'EMB-004',
        embryoId: 'E2024-004',
        donorId: 'HOL-2134',
        donorName: 'Daisy',
        sireId: 'BULL-654',
        sireName: 'Superior Bloodline',
        collectionDate: '2024-08-13',
        developmentStage: 'Hatched Blastocyst',
        quality: 'Grade 1',
        morphology: 'Excellent',
        status: 'Fresh',
        viability: 92,
        cellCount: 135,
        fragmentationRate: 8,
        zona: 'Hatched',
        innerCellMass: 'A',
        trophectoderm: 'A',
        notes: 'Outstanding embryo with natural hatching. Ready for immediate transfer.',
        embryologist: 'Dr. Martinez',
        success: true
      },
      {
        id: 'EMB-005',
        embryoId: 'E2024-005',
        donorId: 'JER-3456',
        donorName: 'Honey',
        sireId: 'BULL-987',
        sireName: 'Golden Standard',
        collectionDate: '2024-08-14',
        developmentStage: 'Morula',
        quality: 'Grade 3',
        morphology: 'Fair',
        status: 'Discarded',
        viability: 45,
        cellCount: 32,
        fragmentationRate: 35,
        zona: 'Partial',
        innerCellMass: 'C',
        trophectoderm: 'C',
        notes: 'Poor development and high fragmentation rate. Not suitable for transfer.',
        embryologist: 'Dr. Chen',
        success: false
      }
    ];

    setTimeout(() => {
      setEmbryoRecords(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRecords = embryoRecords.filter(record => {
    const matchesSearch = record.embryoId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.sireName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || record.status === statusFilter;
    const matchesQuality = qualityFilter === 'All Qualities' || record.quality === qualityFilter;
    const matchesStage = stageFilter === 'All Stages' || record.developmentStage === stageFilter;
    
    return matchesSearch && matchesStatus && matchesQuality && matchesStage;
  });

  const stats = {
    totalEmbryos: embryoRecords.length,
    frozen: embryoRecords.filter(r => r.status === 'Frozen').length,
    transferred: embryoRecords.filter(r => r.status === 'Transferred').length,
    fresh: embryoRecords.filter(r => r.status === 'Fresh').length,
    grade1: embryoRecords.filter(r => r.quality === 'Grade 1').length,
    avgViability: embryoRecords.reduce((sum, r) => sum + r.viability, 0) / embryoRecords.length || 0
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Fresh': return 'bg-green-100 text-green-800';
      case 'Frozen': return 'bg-blue-100 text-blue-800';
      case 'Transferred': return 'bg-purple-100 text-purple-800';
      case 'Cultured': return 'bg-yellow-100 text-yellow-800';
      case 'Discarded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Grade 1': return 'bg-green-100 text-green-800';
      case 'Grade 2': return 'bg-yellow-100 text-yellow-800';
      case 'Grade 3': return 'bg-orange-100 text-orange-800';
      case 'Grade 4': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-yellow-100 text-yellow-800';
      case 'C': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-gray-900">Embryo Detail Management</h1>
          <p className="text-gray-600 mt-2">Comprehensive embryo tracking and quality assessment</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            📊 Quality Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            🧬 New Embryo
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Embryos</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalEmbryos}</p>
            </div>
            <div className="text-blue-500 text-2xl">🧬</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Frozen</p>
              <p className="text-2xl font-bold text-blue-600">{stats.frozen}</p>
            </div>
            <div className="text-blue-500 text-2xl">❄️</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Transferred</p>
              <p className="text-2xl font-bold text-purple-600">{stats.transferred}</p>
            </div>
            <div className="text-purple-500 text-2xl">🔄</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fresh</p>
              <p className="text-2xl font-bold text-green-600">{stats.fresh}</p>
            </div>
            <div className="text-green-500 text-2xl">🌱</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Grade 1</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.grade1}</p>
            </div>
            <div className="text-emerald-500 text-2xl">⭐</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Viability</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.avgViability.toFixed(1)}%</p>
            </div>
            <div className="text-indigo-500 text-2xl">💎</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search embryos, donors..."
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
              <option>Fresh</option>
              <option>Frozen</option>
              <option>Transferred</option>
              <option>Cultured</option>
              <option>Discarded</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
            <select
              value={qualityFilter}
              onChange={(e) => setQualityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Qualities</option>
              <option>Grade 1</option>
              <option>Grade 2</option>
              <option>Grade 3</option>
              <option>Grade 4</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Stages</option>
              <option>Morula</option>
              <option>Early Blastocyst</option>
              <option>Blastocyst</option>
              <option>Expanded Blastocyst</option>
              <option>Hatched Blastocyst</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
              📊 Export Report
            </button>
          </div>
        </div>
      </Card>

      {/* Embryo Records */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <Card key={record.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {record.embryoId}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Donor: {record.donorId} ({record.donorName}) • Sire: {record.sireName}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                  <Badge className={getQualityColor(record.quality)}>
                    {record.quality}
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Basic Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Collection Date:</span>
                    <span className="font-medium">{new Date(record.collectionDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stage:</span>
                    <span className="font-medium">{record.developmentStage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Morphology:</span>
                    <span className="font-medium">{record.morphology}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Embryologist:</span>
                    <span className="font-medium">{record.embryologist}</span>
                  </div>
                </div>
              </div>

              {/* Quality Assessment */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Quality Assessment</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Viability:</span>
                    <span className="font-medium text-green-600">{record.viability}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cell Count:</span>
                    <span className="font-medium">{record.cellCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fragmentation:</span>
                    <span className="font-medium text-orange-600">{record.fragmentationRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Zona:</span>
                    <span className="font-medium">{record.zona}</span>
                  </div>
                </div>
              </div>

              {/* Grading */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Grading</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ICM:</span>
                    <Badge className={getGradeColor(record.innerCellMass)}>
                      {record.innerCellMass}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Trophectoderm:</span>
                    <Badge className={getGradeColor(record.trophectoderm)}>
                      {record.trophectoderm}
                    </Badge>
                  </div>
                  {record.freezingDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frozen:</span>
                      <span className="font-medium">{new Date(record.freezingDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {record.storageLocation && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Storage:</span>
                      <span className="font-medium text-xs">{record.storageLocation}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Transfer Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Transfer & Notes</h4>
                <div className="space-y-2 text-sm">
                  {record.transferDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transfer Date:</span>
                      <span className="font-medium">{new Date(record.transferDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {record.recipientName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Recipient:</span>
                      <span className="font-medium">{record.recipientName}</span>
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
          <div className="text-gray-400 text-4xl mb-4">🧬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No embryo records found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or add a new embryo record.</p>
        </Card>
      )}
    </div>
  );
};

export default EmbryoDetailPage;

