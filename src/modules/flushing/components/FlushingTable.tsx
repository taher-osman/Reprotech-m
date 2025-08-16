import React, { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Eye, 
  FlaskConical, 
  Calendar, 
  User, 
  MapPin,
  ArrowUpDown,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertTriangle,
  X
} from 'lucide-react';
import { FlushingSession } from '../pages/FlushingPage';

interface FlushingTableProps {
  sessions: FlushingSession[];
  onEdit: (session: FlushingSession) => void;
  onDelete: (session: FlushingSession) => void;
  onView: (session: FlushingSession) => void;
  onViewSamples: (session: FlushingSession) => void;
  isLoading?: boolean;
}

export const FlushingTable: React.FC<FlushingTableProps> = ({
  sessions,
  onEdit,
  onDelete,
  onView,
  onViewSamples,
  isLoading = false
}) => {
  const [sortField, setSortField] = useState<keyof FlushingSession>('flush_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof FlushingSession) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedSessions = [...sessions].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'Scheduled':
        return <Calendar className="h-4 w-4 text-yellow-600" />;
      case 'Cancelled':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading flushing sessions...</p>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-lg border">
        <div className="p-8 text-center">
          <FlaskConical className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Flushing Sessions</h3>
          <p className="text-gray-500">Start by creating your first flushing session.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('session_id')}
              >
                <div className="flex items-center space-x-1">
                  <span>Session ID</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('flush_date')}
              >
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>Date</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Donor / Sire
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('total_embryos')}
              >
                <div className="flex items-center space-x-1">
                  <FlaskConical className="h-3 w-3" />
                  <span>Embryos</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quality Distribution
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('technician')}
              >
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>Technician</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedSessions.map((session) => (
              <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FlaskConical className="h-4 w-4 text-pink-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900 font-mono">
                      {session.session_id}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(session.flush_date)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="font-medium">{session.donor_name}</div>
                    {session.sire_name && (
                      <div className="text-xs text-gray-500">× {session.sire_name}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-medium text-gray-900">
                      {session.total_embryos}
                    </div>
                    <div className="text-xs text-gray-500">
                      ({session.viable_embryos} viable)
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    {session.quality_grade_a > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        A: {session.quality_grade_a}
                      </span>
                    )}
                    {session.quality_grade_b > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        B: {session.quality_grade_b}
                      </span>
                    )}
                    {session.quality_grade_c > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        C: {session.quality_grade_c}
                      </span>
                    )}
                    {session.quality_grade_d > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        D: {session.quality_grade_d}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{session.technician}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{session.location}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(session.status)}`}>
                    {getStatusIcon(session.status)}
                    <span className="ml-1">{session.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onView(session)}
                      className="text-gray-600 hover:text-gray-900 p-1 rounded transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onViewSamples(session)}
                      className="text-teal-600 hover:text-teal-900 p-1 rounded transition-colors"
                      title="View Generated Samples"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(session)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                      title="Edit Session"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(session)}
                      className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                      title="Delete Session"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer with summary */}
      <div className="bg-gray-50 px-6 py-3 border-t">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Showing {sessions.length} flushing session{sessions.length !== 1 ? 's' : ''}</span>
          <span>
            Total embryos: {sessions.reduce((sum, s) => sum + s.total_embryos, 0)} |
            Total viable: {sessions.reduce((sum, s) => sum + s.viable_embryos, 0)}
          </span>
        </div>
      </div>
    </div>
  );
}; 