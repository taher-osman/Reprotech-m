import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

interface OPUSession {
  id: string;
  animalId: string;
  animalName: string;
  breed: string;
  sessionDate: string;
  sessionTime: string;
  veterinarian: string;
  technician: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  oocytesCollected: number;
  oocytesViable: number;
  oocytesGradeA: number;
  oocytesGradeB: number;
  oocytesGradeC: number;
  aspirationTime: number; // minutes
  equipment: string;
  notes: string;
  complications?: string;
  nextSession?: string;
  success: boolean;
}

const OPUPage: React.FC = () => {
  const [opuSessions, setOpuSessions] = useState<OPUSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateFilter, setDateFilter] = useState('All Dates');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockData: OPUSession[] = [
      {
        id: 'OPU-001',
        animalId: 'HOL-1247',
        animalName: 'Bella',
        breed: 'Holstein',
        sessionDate: '2024-08-15',
        sessionTime: '09:00',
        veterinarian: 'Dr. Smith',
        technician: 'Tech. Johnson',
        status: 'Completed',
        oocytesCollected: 18,
        oocytesViable: 15,
        oocytesGradeA: 8,
        oocytesGradeB: 5,
        oocytesGradeC: 2,
        aspirationTime: 25,
        equipment: 'Aloka SSD-500 Ultrasound',
        notes: 'Excellent response. High-quality oocytes collected. Animal recovered well.',
        nextSession: '2024-09-15',
        success: true
      },
      {
        id: 'OPU-002',
        animalId: 'JER-0892',
        animalName: 'Thunder',
        breed: 'Jersey',
        sessionDate: '2024-08-16',
        sessionTime: '10:30',
        veterinarian: 'Dr. Wilson',
        technician: 'Tech. Davis',
        status: 'Completed',
        oocytesCollected: 12,
        oocytesViable: 10,
        oocytesGradeA: 6,
        oocytesGradeB: 3,
        oocytesGradeC: 1,
        aspirationTime: 20,
        equipment: 'Mindray DP-50 Ultrasound',
        notes: 'Good collection session. Jersey breed typically yields fewer but higher quality oocytes.',
        nextSession: '2024-09-16',
        success: true
      },
      {
        id: 'OPU-003',
        animalId: 'ANG-1156',
        animalName: 'Princess',
        breed: 'Angus',
        sessionDate: '2024-08-17',
        sessionTime: '14:00',
        veterinarian: 'Dr. Brown',
        technician: 'Tech. Miller',
        status: 'In Progress',
        oocytesCollected: 0,
        oocytesViable: 0,
        oocytesGradeA: 0,
        oocytesGradeB: 0,
        oocytesGradeC: 0,
        aspirationTime: 0,
        equipment: 'Edan DUS 60 Ultrasound',
        notes: 'Session currently in progress. Animal prepared and sedated.',
        success: false
      },
      {
        id: 'OPU-004',
        animalId: 'HOL-2134',
        animalName: 'Daisy',
        breed: 'Holstein',
        sessionDate: '2024-08-18',
        sessionTime: '11:00',
        veterinarian: 'Dr. Smith',
        technician: 'Tech. Johnson',
        status: 'Scheduled',
        oocytesCollected: 0,
        oocytesViable: 0,
        oocytesGradeA: 0,
        oocytesGradeB: 0,
        oocytesGradeC: 0,
        aspirationTime: 0,
        equipment: 'Aloka SSD-500 Ultrasound',
        notes: 'Pre-session preparation completed. Animal fasted for 12 hours.',
        success: false
      },
      {
        id: 'OPU-005',
        animalId: 'JER-3456',
        animalName: 'Honey',
        breed: 'Jersey',
        sessionDate: '2024-08-14',
        sessionTime: '15:30',
        veterinarian: 'Dr. Wilson',
        technician: 'Tech. Davis',
        status: 'Completed',
        oocytesCollected: 14,
        oocytesViable: 11,
        oocytesGradeA: 7,
        oocytesGradeB: 3,
        oocytesGradeC: 1,
        aspirationTime: 22,
        equipment: 'Mindray DP-50 Ultrasound',
        notes: 'Successful session with high viability rate. Oocytes sent for IVF.',
        complications: 'Minor bleeding at aspiration site, resolved quickly',
        nextSession: '2024-09-14',
        success: true
      }
    ];

    setTimeout(() => {
      setOpuSessions(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredSessions = opuSessions.filter(session => {
    const matchesSearch = session.animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.animalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.veterinarian.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || session.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalSessions: opuSessions.length,
    completed: opuSessions.filter(s => s.status === 'Completed').length,
    scheduled: opuSessions.filter(s => s.status === 'Scheduled').length,
    inProgress: opuSessions.filter(s => s.status === 'In Progress').length,
    totalOocytes: opuSessions.reduce((sum, s) => sum + s.oocytesCollected, 0),
    avgViability: opuSessions.filter(s => s.oocytesCollected > 0).reduce((sum, s) => sum + (s.oocytesViable / s.oocytesCollected * 100), 0) / opuSessions.filter(s => s.oocytesCollected > 0).length || 0
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-yellow-100 text-yellow-800';
      case 'C': return 'bg-orange-100 text-orange-800';
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
          <h1 className="text-3xl font-bold text-gray-900">OPU (Ovum Pick-Up)</h1>
          <p className="text-gray-600 mt-2">Advanced oocyte collection and reproductive technology</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            📊 Session Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            🥚 Schedule OPU
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalSessions}</p>
            </div>
            <div className="text-blue-500 text-2xl">🥚</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="text-green-500 text-2xl">✅</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.scheduled}</p>
            </div>
            <div className="text-yellow-500 text-2xl">📅</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-purple-600">{stats.inProgress}</p>
            </div>
            <div className="text-purple-500 text-2xl">🔄</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Oocytes</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.totalOocytes}</p>
            </div>
            <div className="text-indigo-500 text-2xl">🔬</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Viability</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.avgViability.toFixed(1)}%</p>
            </div>
            <div className="text-emerald-500 text-2xl">💎</div>
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
              placeholder="Search animals, veterinarians..."
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
              <option>Scheduled</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Dates</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
              📊 Export Report
            </button>
          </div>
        </div>
      </Card>

      {/* OPU Sessions */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <Card key={session.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {session.animalId} - {session.animalName}
                  </h3>
                  <p className="text-sm text-gray-600">{session.breed} • Session ID: {session.id}</p>
                </div>
                <Badge className={getStatusColor(session.status)}>
                  {session.status}
                </Badge>
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
              {/* Session Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Session Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date(session.sessionDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{session.sessionTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Veterinarian:</span>
                    <span className="font-medium">{session.veterinarian}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Technician:</span>
                    <span className="font-medium">{session.technician}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Equipment:</span>
                    <span className="font-medium text-xs">{session.equipment}</span>
                  </div>
                </div>
              </div>

              {/* Collection Results */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Collection Results</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Collected:</span>
                    <span className="font-medium text-blue-600">{session.oocytesCollected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Viable:</span>
                    <span className="font-medium text-green-600">{session.oocytesViable}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Viability Rate:</span>
                    <span className="font-medium text-green-600">
                      {session.oocytesCollected > 0 ? ((session.oocytesViable / session.oocytesCollected) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  {session.aspirationTime > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{session.aspirationTime} min</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quality Grades */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Quality Grades</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Grade A:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{session.oocytesGradeA}</span>
                      <Badge className={getGradeColor('A')}>A</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Grade B:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{session.oocytesGradeB}</span>
                      <Badge className={getGradeColor('B')}>B</Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Grade C:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{session.oocytesGradeC}</span>
                      <Badge className={getGradeColor('C')}>C</Badge>
                    </div>
                  </div>
                  {session.nextSession && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Session:</span>
                      <span className="font-medium text-blue-600">{new Date(session.nextSession).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes & Complications */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Notes & Observations</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Notes:</span>
                    <p className="text-gray-800 mt-1">{session.notes}</p>
                  </div>
                  {session.complications && (
                    <div>
                      <span className="text-gray-600">Complications:</span>
                      <p className="text-red-600 mt-1">{session.complications}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 text-4xl mb-4">🥚</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No OPU sessions found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or schedule a new OPU session.</p>
        </Card>
      )}
    </div>
  );
};

export default OPUPage;

