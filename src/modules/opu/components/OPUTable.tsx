import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  CheckCircle, 
  Calendar, 
  User, 
  Microscope,
  Clock,
  AlertCircle,
  Zap,
  Download,
  MoreHorizontal
} from 'lucide-react';
import { OPUSession, OPUFilters, OPU_STATUSES, SESSION_RESULTS } from '../types/opuTypes';

interface OPUTableProps {
  sessions: OPUSession[];
  loading?: boolean;
  onViewSession: (session: OPUSession) => void;
  onEditSession: (session: OPUSession) => void;
  onCompleteSession: (session: OPUSession) => void;
  onDeleteSession: (sessionId: string) => void;
}

const OPUTable: React.FC<OPUTableProps> = ({
  sessions,
  loading = false,
  onViewSession,
  onEditSession,
  onCompleteSession,
  onDeleteSession
}) => {
  const [filters, setFilters] = useState<OPUFilters>({
    searchTerm: '',
    donorId: '',
    protocolId: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    operatorId: '',
    sessionResult: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<keyof OPUSession>('sessionDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);

  // Filter sessions based on current filters
  const filteredSessions = sessions.filter(session => {
    if (filters.searchTerm && !session.sessionId.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !session.donorInfo?.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    if (filters.donorId && session.donorId !== filters.donorId) return false;
    if (filters.status && session.status !== filters.status) return false;
    if (filters.sessionResult && session.sessionResult !== filters.sessionResult) return false;
    if (filters.dateFrom && session.sessionDate < filters.dateFrom) return false;
    if (filters.dateTo && session.sessionDate > filters.dateTo) return false;
    if (filters.operatorId && session.operatorId !== filters.operatorId) return false;
    return true;
  });

  // Sort sessions
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof OPUSession) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectSession = (sessionId: string) => {
    setSelectedSessions(prev => 
      prev.includes(sessionId) 
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedSessions.length === sortedSessions.length) {
      setSelectedSessions([]);
    } else {
      setSelectedSessions(sortedSessions.map(s => s.id));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      SCHEDULED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
      FAILED: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors]}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getResultBadge = (result: string) => {
    const resultColors = {
      EXCELLENT: 'bg-emerald-100 text-emerald-800',
      GOOD: 'bg-green-100 text-green-800',
      FAIR: 'bg-yellow-100 text-yellow-800',
      POOR: 'bg-orange-100 text-orange-800',
      FAILED: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${resultColors[result as keyof typeof resultColors]}`}>
        {result}
      </span>
    );
  };

  const calculateViableOocytes = (session: OPUSession) => {
    return session.oocytesGradeA + session.oocytesGradeB;
  };

  const calculateSuccessRate = (session: OPUSession) => {
    const total = session.oocytesRetrieved;
    const viable = calculateViableOocytes(session);
    return total > 0 ? ((viable / total) * 100).toFixed(1) : '0';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">OPU Sessions</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${
                showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : ''
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search sessions by ID, donor name..."
            value={filters.searchTerm}
            onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Statuses</option>
                  {OPU_STATUSES.map(status => (
                    <option key={status} value={status}>{status.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
                <select
                  value={filters.sessionResult}
                  onChange={(e) => setFilters({ ...filters, sessionResult: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Results</option>
                  {SESSION_RESULTS.map(result => (
                    <option key={result} value={result}>{result}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setFilters({
                    searchTerm: '',
                    donorId: '',
                    protocolId: '',
                    status: '',
                    dateFrom: '',
                    dateTo: '',
                    operatorId: '',
                    sessionResult: ''
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count and Bulk Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {sortedSessions.length} of {sessions.length} sessions
          {selectedSessions.length > 0 && (
            <span className="ml-2 text-blue-600 font-medium">
              ({selectedSessions.length} selected)
            </span>
          )}
        </div>

        {selectedSessions.length > 0 && (
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
              Bulk Export
            </button>
            <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
              Cancel Selected
            </button>
          </div>
        )}
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedSessions.length === sortedSessions.length && sortedSessions.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('sessionId')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Session ID</span>
                    {sortField === 'sessionId' && (
                      <span className="text-blue-500">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('sessionDate')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    {sortField === 'sessionDate' && (
                      <span className="text-blue-500">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Donor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operator
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Results
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oocytes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Success Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedSessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedSessions.includes(session.id)}
                      onChange={() => handleSelectSession(session.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Microscope className="h-4 w-4 text-blue-500 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{session.sessionId}</div>
                        <div className="text-sm text-gray-500">{session.protocolInfo?.name || 'Standard Protocol'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">{new Date(session.sessionDate).toLocaleDateString()}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {session.sessionStartTime}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-purple-600">
                          {session.donorInfo?.name.charAt(0) || 'D'}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{session.donorInfo?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{session.donorInfo?.animalID || session.donorId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm text-gray-900">{session.operatorName || 'Unknown'}</div>
                        {session.technicianName && (
                          <div className="text-sm text-gray-500">+ {session.technicianName}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(session.status)}
                    {session.status === 'COMPLETED' && session.sessionResult && (
                      <div className="mt-1">
                        {getResultBadge(session.sessionResult)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Total: <span className="font-medium">{session.oocytesRetrieved}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      A: {session.oocytesGradeA} | B: {session.oocytesGradeB} | C: {session.oocytesGradeC}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <span className="font-medium">{calculateViableOocytes(session)}</span> viable
                    </div>
                    <div className="text-sm text-gray-500">
                      {calculateSuccessRate(session)}% success
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onViewSession(session)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {session.status !== 'COMPLETED' && (
                        <>
                          <button
                            onClick={() => onEditSession(session)}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Edit Session"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          {session.status === 'IN_PROGRESS' && (
                            <button
                              onClick={() => onCompleteSession(session)}
                              className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                              title="Complete Session"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                        </>
                      )}

                      <div className="relative group">
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => onViewSession(session)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              View Details
                            </button>
                            {session.autoCreateSamples && session.createdSampleIds && (
                              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                View Samples ({session.createdSampleIds.length})
                              </button>
                            )}
                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                              Print Report
                            </button>
                            {session.status === 'SCHEDULED' && (
                              <button
                                onClick={() => onDeleteSession(session.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                              >
                                Cancel Session
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedSessions.length === 0 && (
          <div className="text-center py-12">
            <Microscope className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No OPU sessions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.searchTerm || filters.status || filters.dateFrom ? 
                'Try adjusting your filters or search terms.' :
                'Get started by creating your first OPU session.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OPUTable; 