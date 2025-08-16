import React, { useState } from 'react';
import { 
  Heart, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Baby, 
  Plus,
  Eye,
  Edit,
  TrendingUp,
  Activity
} from 'lucide-react';
import { format, differenceInDays, isAfter, isBefore, isToday } from 'date-fns';
import { PregnancyTracking, PregnancyCheckpoint } from '../types/transferTypes';
import PregnancyStatusForm from './PregnancyStatusForm';

interface PregnancyTrackerProps {
  pregnancyTracking: PregnancyTracking;
  transferId: string;
  recipientName: string;
  transferDate: Date;
  onUpdate: () => void;
}

const PregnancyTracker: React.FC<PregnancyTrackerProps> = ({
  pregnancyTracking,
  transferId,
  recipientName,
  transferDate,
  onUpdate
}) => {
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<PregnancyCheckpoint | null>(null);
  const [isStatusFormOpen, setIsStatusFormOpen] = useState(false);

  const getCheckpointStatus = (checkpoint: PregnancyCheckpoint) => {
    if (checkpoint.performed) {
      switch (checkpoint.result) {
        case 'PREGNANT': return { status: 'completed-success', color: 'green', icon: CheckCircle };
        case 'DELIVERED': return { status: 'completed-success', color: 'blue', icon: Baby };
        case 'NOT_PREGNANT': case 'ABORTED': case 'DIED': return { status: 'completed-failed', color: 'red', icon: AlertTriangle };
        case 'RECHECK': return { status: 'pending', color: 'yellow', icon: Clock };
        default: return { status: 'completed', color: 'gray', icon: CheckCircle };
      }
    }

    const today = new Date();
    const scheduledDate = new Date(checkpoint.scheduledDate);
    
    if (isToday(scheduledDate)) {
      return { status: 'due-today', color: 'orange', icon: Clock };
    } else if (isAfter(today, scheduledDate)) {
      return { status: 'overdue', color: 'red', icon: AlertTriangle };
    } else {
      return { status: 'upcoming', color: 'gray', icon: Calendar };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (pregnancyTracking.currentStatus) {
      case 'PREGNANT': return 'bg-green-100 text-green-800';
      case 'NOT_PREGNANT': return 'bg-red-100 text-red-800';
      case 'DELIVERED': return 'bg-blue-100 text-blue-800';
      case 'LOST': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditCheckpoint = (checkpoint: PregnancyCheckpoint) => {
    setSelectedCheckpoint(checkpoint);
    setIsStatusFormOpen(true);
  };

  const handleFormClose = () => {
    setIsStatusFormOpen(false);
    setSelectedCheckpoint(null);
  };

  const handleFormSuccess = () => {
    onUpdate();
    handleFormClose();
  };

  const getDaysFromTransfer = (date: Date) => {
    return differenceInDays(date, new Date(transferDate));
  };

  const getNextCheckpoint = () => {
    return pregnancyTracking.checkpoints.find(cp => !cp.performed);
  };

  const getProgressPercentage = () => {
    const completed = pregnancyTracking.checkpoints.filter(cp => cp.performed).length;
    const total = pregnancyTracking.checkpoints.length;
    return (completed / total) * 100;
  };

  const nextCheckpoint = getNextCheckpoint();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-pink-100 rounded-lg">
            <Heart className="h-6 w-6 text-pink-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pregnancy Tracking</h3>
            <p className="text-sm text-gray-600">
              {recipientName} • {transferId}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(pregnancyTracking.currentStatus)}`}>
            {pregnancyTracking.currentStatus}
          </span>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {Math.round(getProgressPercentage())}% Complete
            </p>
            <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-pink-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Days Pregnant</p>
              <p className="text-2xl font-bold text-blue-900">
                {getDaysFromTransfer(new Date())}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Next Check</p>
              <p className="text-lg font-bold text-green-900">
                {nextCheckpoint ? 
                  `Day ${nextCheckpoint.daysFromTransfer}` : 
                  'Complete'
                }
              </p>
            </div>
            <Clock className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Expected Delivery</p>
              <p className="text-lg font-bold text-purple-900">
                {pregnancyTracking.expectedDeliveryDate ? 
                  format(new Date(pregnancyTracking.expectedDeliveryDate), 'MMM dd') :
                  'TBD'
                }
              </p>
            </div>
            <Baby className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Success Rate</p>
              <p className="text-lg font-bold text-yellow-900">
                {pregnancyTracking.pregnancyRate || 0}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-6">
        <h4 className="text-md font-semibold text-gray-900 mb-4">Checkpoint Progress</h4>
        <div className="space-y-4">
          {pregnancyTracking.checkpoints.map((checkpoint, index) => {
            const statusInfo = getCheckpointStatus(checkpoint);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div 
                key={checkpoint.id} 
                className={`flex items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                  statusInfo.status === 'completed-success' ? 'border-green-200 bg-green-50' :
                  statusInfo.status === 'completed-failed' ? 'border-red-200 bg-red-50' :
                  statusInfo.status === 'due-today' ? 'border-orange-200 bg-orange-50' :
                  statusInfo.status === 'overdue' ? 'border-red-200 bg-red-50' :
                  statusInfo.status === 'pending' ? 'border-yellow-200 bg-yellow-50' :
                  'border-gray-200 bg-gray-50'
                }`}
              >
                {/* Step Number & Icon */}
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    statusInfo.status === 'completed-success' ? 'bg-green-500 text-white' :
                    statusInfo.status === 'completed-failed' ? 'bg-red-500 text-white' :
                    statusInfo.status === 'due-today' ? 'bg-orange-500 text-white' :
                    statusInfo.status === 'overdue' ? 'bg-red-500 text-white' :
                    statusInfo.status === 'pending' ? 'bg-yellow-500 text-white' :
                    'bg-gray-400 text-white'
                  }`}>
                    {checkpoint.performed ? (
                      <StatusIcon className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-bold">{index + 1}</span>
                    )}
                  </div>
                  
                  {checkpoint.isParturition && <Baby className="h-5 w-5 text-blue-500" />}
                </div>

                {/* Checkpoint Details */}
                <div className="flex-1 ml-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-md font-medium text-gray-900">
                        {checkpoint.title}
                      </h5>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>
                          Day {checkpoint.daysFromTransfer} • 
                          {format(new Date(checkpoint.scheduledDate), ' MMM dd, yyyy')}
                        </span>
                        {checkpoint.actualDate && (
                          <span className="text-blue-600">
                            Performed: {format(new Date(checkpoint.actualDate), 'MMM dd, yyyy')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Status & Actions */}
                    <div className="flex items-center space-x-3">
                      {checkpoint.performed && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          checkpoint.result === 'PREGNANT' ? 'bg-green-100 text-green-800' :
                          checkpoint.result === 'DELIVERED' ? 'bg-blue-100 text-blue-800' :
                          checkpoint.result === 'NOT_PREGNANT' || checkpoint.result === 'ABORTED' || checkpoint.result === 'DIED' ? 'bg-red-100 text-red-800' :
                          checkpoint.result === 'RECHECK' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {checkpoint.result.replace('_', ' ')}
                        </span>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-1">
                        {checkpoint.performed ? (
                          <button
                            onClick={() => handleEditCheckpoint(checkpoint)}
                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                            title="Edit Result"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditCheckpoint(checkpoint)}
                            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                            title="Record Result"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        )}
                        
                        {checkpoint.notes && (
                          <button
                            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                            title="View Notes"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Notes Preview */}
                  {checkpoint.notes && (
                    <div className="mt-2 p-2 bg-white bg-opacity-70 rounded text-sm text-gray-700">
                      <strong>Notes:</strong> {checkpoint.notes.substring(0, 100)}
                      {checkpoint.notes.length > 100 && '...'}
                    </div>
                  )}
                  
                  {/* Complications */}
                  {checkpoint.complications && checkpoint.complications.length > 0 && (
                    <div className="mt-2 flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600">
                        {checkpoint.complications.length} complication(s) noted
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk Factors & Recommendations */}
      {(pregnancyTracking.riskFactors?.length || pregnancyTracking.recommendations?.length) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pregnancyTracking.riskFactors && pregnancyTracking.riskFactors.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h5 className="text-md font-semibold text-red-900 mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Risk Factors
              </h5>
              <ul className="text-sm text-red-700 space-y-1">
                {pregnancyTracking.riskFactors.map((risk, index) => (
                  <li key={index}>• {risk}</li>
                ))}
              </ul>
            </div>
          )}
          
          {pregnancyTracking.recommendations && pregnancyTracking.recommendations.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="text-md font-semibold text-blue-900 mb-2 flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Recommendations
              </h5>
              <ul className="text-sm text-blue-700 space-y-1">
                {pregnancyTracking.recommendations.map((rec, index) => (
                  <li key={index}>• {rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Pregnancy Status Form Modal */}
      {selectedCheckpoint && (
        <PregnancyStatusForm
          isOpen={isStatusFormOpen}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          checkpoint={selectedCheckpoint}
          transferId={transferId}
          recipientName={recipientName}
          transferDate={transferDate}
        />
      )}
    </div>
  );
};

export default PregnancyTracker; 