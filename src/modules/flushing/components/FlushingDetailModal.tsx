import React from 'react';
import { 
  X, 
  Calendar, 
  User, 
  MapPin, 
  FlaskConical, 
  TestTube, 
  Eye, 
  Edit, 
  ExternalLink,
  CheckCircle,
  Clock,
  AlertTriangle,
  Zap,
  Activity,
  BarChart3
} from 'lucide-react';
import { FlushingSession } from '../pages/FlushingPage';

interface FlushingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: FlushingSession | null;
  onEdit?: (session: FlushingSession) => void;
  onViewSamples?: (session: FlushingSession) => void;
}

export const FlushingDetailModal: React.FC<FlushingDetailModalProps> = ({
  isOpen,
  onClose,
  session,
  onEdit,
  onViewSamples
}) => {
  if (!isOpen || !session) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'In Progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'Scheduled':
        return <Calendar className="h-5 w-5 text-yellow-600" />;
      case 'Cancelled':
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
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
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSuccessRate = () => {
    if (session.total_embryos === 0) return 0;
    return ((session.viable_embryos / session.total_embryos) * 100).toFixed(1);
  };

  const getQualityDistribution = () => {
    const total = session.total_embryos;
    if (total === 0) return { a: 0, b: 0, c: 0, d: 0 };
    
    return {
      a: ((session.quality_grade_a / total) * 100).toFixed(1),
      b: ((session.quality_grade_b / total) * 100).toFixed(1),
      c: ((session.quality_grade_c / total) * 100).toFixed(1),
      d: ((session.quality_grade_d / total) * 100).toFixed(1)
    };
  };

  const distribution = getQualityDistribution();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <FlaskConical className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Flushing Session Details</h2>
              <p className="text-sm text-gray-600">{session.session_id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(session)}
                className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
            )}
            {onViewSamples && session.generated_sample_ids.length > 0 && (
              <button
                onClick={() => onViewSamples(session)}
                className="flex items-center space-x-2 px-3 py-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View Samples</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Session Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(session.status)}`}>
                      {getStatusIcon(session.status)}
                      <span className="ml-1">{session.status}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Date:</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(session.flush_date)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Session ID:</span>
                    <span className="text-sm font-mono font-medium text-gray-900">{session.session_id}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Animals</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Donor:</span>
                    <span className="text-sm font-medium text-gray-900">{session.donor_name}</span>
                  </div>
                  {session.sire_name && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Sire:</span>
                      <span className="text-sm font-medium text-gray-900">{session.sire_name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Procedure Details</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Technician:</span>
                    <span className="text-sm font-medium text-gray-900">{session.technician}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Location:</span>
                    <span className="text-sm font-medium text-gray-900">{session.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TestTube className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Method:</span>
                    <span className="text-sm font-medium text-gray-900">{session.flush_method}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Medium & Volume</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Medium:</span>
                    <span className="text-sm font-medium text-gray-900">{session.flush_medium}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Volume:</span>
                    <span className="text-sm font-medium text-gray-900">{session.flush_volume_ml} mL</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Source:</span>
                    <span className="text-sm font-medium text-gray-900">{session.fertilization_source}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Overview */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Flush Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Summary Stats */}
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900">Summary</h4>
                  <BarChart3 className="h-4 w-4 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Embryos:</span>
                    <span className="text-lg font-bold text-gray-900">{session.total_embryos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Viable Embryos:</span>
                    <span className="text-lg font-bold text-green-600">{session.viable_embryos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Success Rate:</span>
                    <span className="text-lg font-bold text-blue-600">{getSuccessRate()}%</span>
                  </div>
                </div>
              </div>

              {/* Quality Distribution */}
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900">Quality Distribution</h4>
                  <Activity className="h-4 w-4 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600">Grade A:</span>
                    <span className="text-sm font-medium">{session.quality_grade_a} ({distribution.a}%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600">Grade B:</span>
                    <span className="text-sm font-medium">{session.quality_grade_b} ({distribution.b}%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-yellow-600">Grade C:</span>
                    <span className="text-sm font-medium">{session.quality_grade_c} ({distribution.c}%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-600">Grade D:</span>
                    <span className="text-sm font-medium">{session.quality_grade_d} ({distribution.d}%)</span>
                  </div>
                </div>
              </div>

              {/* Generated Samples */}
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-900">Generated Samples</h4>
                  <Zap className="h-4 w-4 text-gray-400" />
                </div>
                {session.generated_sample_ids.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Auto-Generated:</span>
                      <span className="text-lg font-bold text-teal-600">{session.generated_sample_ids.length}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Sample IDs: {session.generated_sample_ids.slice(0, 2).join(', ')}
                      {session.generated_sample_ids.length > 2 && ` +${session.generated_sample_ids.length - 2} more`}
                    </div>
                    {onViewSamples && (
                      <button
                        onClick={() => onViewSamples(session)}
                        className="w-full mt-2 px-3 py-1 bg-teal-100 text-teal-700 rounded text-xs hover:bg-teal-200 transition-colors"
                      >
                        View in Sample Management
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <TestTube className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No samples generated</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          {session.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">{session.notes}</p>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Session Metadata</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
              <div>
                <span className="block">Created by: {session.created_by}</span>
                <span className="block">Created: {formatDateTime(session.created_at)}</span>
              </div>
              <div>
                <span className="block">Last updated: {formatDateTime(session.updated_at)}</span>
                {session.reproductive_protocol && (
                  <span className="block">Protocol: {session.reproductive_protocol}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t bg-gray-50">
          {onViewSamples && session.generated_sample_ids.length > 0 && (
            <button
              onClick={() => onViewSamples(session)}
              className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View Generated Samples</span>
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(session)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Session</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}; 