import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Microscope, 
  Zap, 
  Target, 
  FileText,
  Eye,
  Download,
  ExternalLink,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { OPUSession } from '../types/opuTypes';

interface OPUDetailModalProps {
  session: OPUSession;
  isOpen: boolean;
  onClose: () => void;
  onViewSamples?: (sampleIds: string[]) => void;
}

const OPUDetailModal: React.FC<OPUDetailModalProps> = ({
  session,
  isOpen,
  onClose,
  onViewSamples
}) => {
  if (!isOpen) return null;

  const calculateViableOocytes = () => {
    return session.oocytesGradeA + session.oocytesGradeB;
  };

  const calculateSuccessRate = () => {
    const total = session.oocytesRetrieved;
    const viable = calculateViableOocytes();
    return total > 0 ? ((viable / total) * 100).toFixed(1) : '0';
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
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status as keyof typeof statusColors]}`}>
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
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${resultColors[result as keyof typeof resultColors]}`}>
        {result}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Microscope className="h-6 w-6 text-blue-600 mr-2" />
              {session.sessionId}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              OPU Session Details
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(session.status)}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{session.oocytesRetrieved}</div>
              <div className="text-sm text-blue-700">Total Oocytes</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{calculateViableOocytes()}</div>
              <div className="text-sm text-green-700">Viable (A+B)</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{calculateSuccessRate()}%</div>
              <div className="text-sm text-purple-700">Success Rate</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{session.cumulusComplexes}</div>
              <div className="text-sm text-orange-700">Cumulus Complexes</div>
            </div>
          </div>

          {/* Main Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 text-gray-600 mr-2" />
                Session Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Session Date:</span>
                  <span className="text-sm text-gray-900">{new Date(session.sessionDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Start Time:</span>
                  <span className="text-sm text-gray-900">{session.sessionStartTime}</span>
                </div>
                {session.sessionEndTime && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">End Time:</span>
                    <span className="text-sm text-gray-900">{session.sessionEndTime}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Protocol:</span>
                  <span className="text-sm text-gray-900">{session.protocolInfo?.name || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Anesthesia:</span>
                  <span className="text-sm text-gray-900">{session.anesthesiaUsed}</span>
                </div>
                {session.status === 'COMPLETED' && session.sessionResult && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Result:</span>
                    {getResultBadge(session.sessionResult)}
                  </div>
                )}
              </div>
            </div>

            {/* Donor & Team Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 text-gray-600 mr-2" />
                Donor & Team
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Donor Animal:</span>
                  <div className="mt-1 flex items-center">
                    <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-purple-600">
                        {session.donorInfo?.name.charAt(0) || 'D'}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{session.donorInfo?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{session.donorInfo?.animalID || session.donorId}</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Species:</span>
                  <span className="text-sm text-gray-900">{session.donorInfo?.species || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Age:</span>
                  <span className="text-sm text-gray-900">{session.donorInfo?.age || 'Unknown'} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Primary Operator:</span>
                  <span className="text-sm text-gray-900">{session.operatorName || 'Unknown'}</span>
                </div>
                {session.technicianName && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Technician:</span>
                    <span className="text-sm text-gray-900">{session.technicianName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Procedure Details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="h-5 w-5 text-gray-600 mr-2" />
                Procedure Parameters
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Collection Medium:</span>
                  <span className="text-sm text-gray-900">{session.mediaUsed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Needle Gauge:</span>
                  <span className="text-sm text-gray-900">{session.needleGauge}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Aspiration Pressure:</span>
                  <span className="text-sm text-gray-900">{session.aspirationPressure} mmHg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Flushing Volume:</span>
                  <span className="text-sm text-gray-900">{session.flushingVolume} ml</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Recovery Period:</span>
                  <span className="text-sm text-gray-900">{session.recoveryTime} days</span>
                </div>
              </div>
            </div>

            {/* Follicle Assessment */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 text-gray-600 mr-2" />
                Follicle Assessment
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Total Follicles:</span>
                  <span className="text-sm text-gray-900">{session.folliclesObserved}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Dominant (≥15mm):</span>
                  <span className="text-sm text-gray-900">{session.dominantFollicles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Medium (8-14mm):</span>
                  <span className="text-sm text-gray-900">{session.mediumFollicles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Small (3-7mm):</span>
                  <span className="text-sm text-gray-900">{session.smallFollicles}</span>
                </div>
                {session.preUltrasoundDate && (
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Pre-US Date:</span>
                    <span className="text-sm text-gray-900">{new Date(session.preUltrasoundDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Oocyte Results */}
          {session.status === 'COMPLETED' && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                Oocyte Collection Results
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{session.oocytesGradeA}</div>
                  <div className="text-sm text-emerald-700">Grade A</div>
                  <div className="text-xs text-gray-500">Excellent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{session.oocytesGradeB}</div>
                  <div className="text-sm text-green-700">Grade B</div>
                  <div className="text-xs text-gray-500">Good</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{session.oocytesGradeC}</div>
                  <div className="text-sm text-yellow-700">Grade C</div>
                  <div className="text-xs text-gray-500">Fair</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{session.oocytesDegenerated}</div>
                  <div className="text-sm text-red-700">Degenerated</div>
                  <div className="text-xs text-gray-500">Poor</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{session.cumulusComplexes}</div>
                  <div className="text-sm text-purple-700">Cumulus</div>
                  <div className="text-xs text-gray-500">Complexes</div>
                </div>
              </div>
            </div>
          )}

          {/* Sample Integration */}
          {session.autoCreateSamples && session.createdSampleIds && session.createdSampleIds.length > 0 && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <ExternalLink className="h-5 w-5 text-blue-600 mr-2" />
                Generated Samples
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">{session.createdSampleIds.length}</span> oocyte samples created automatically
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Samples: {session.createdSampleIds.slice(0, 3).join(', ')}
                    {session.createdSampleIds.length > 3 && ` + ${session.createdSampleIds.length - 3} more`}
                  </p>
                </div>
                {onViewSamples && (
                  <button
                    onClick={() => onViewSamples(session.createdSampleIds!)}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Samples</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Notes and Complications */}
          {(session.notes || session.complications) && (
            <div className="mt-6 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 text-gray-600 mr-2" />
                Notes & Complications
              </h3>
              {session.complications && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Complications</h4>
                      <p className="text-sm text-yellow-700 mt-1">{session.complications}</p>
                    </div>
                  </div>
                </div>
              )}
              {session.notes && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Session Notes</h4>
                  <p className="text-sm text-gray-700">{session.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Follow-up Information */}
          {session.nextSessionDate && (
            <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-2 flex items-center">
                <Clock className="h-5 w-5 text-purple-600 mr-2" />
                Follow-up Schedule
              </h3>
              <p className="text-sm text-purple-700">
                Next session scheduled for: <span className="font-medium">{new Date(session.nextSessionDate).toLocaleDateString()}</span>
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            Created: {new Date(session.createdAt).toLocaleString()}
            {session.updatedAt !== session.createdAt && (
              <span className="ml-2">• Updated: {new Date(session.updatedAt).toLocaleString()}</span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export Report</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OPUDetailModal; 