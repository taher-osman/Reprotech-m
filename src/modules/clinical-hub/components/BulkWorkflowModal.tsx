import React, { useState } from 'react';
import {
  X,
  Users,
  Calendar,
  Clock,
  Stethoscope,
  Send,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Activity,
  Zap,
  AlertCircle
} from 'lucide-react';
import { BulkWorkflowAssignment } from '../../../services/workflowService';

interface BulkWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAnimals: string[];
  onExecuteBulkWorkflow: (assignment: BulkWorkflowAssignment) => Promise<void>;
  veterinarians: string[];
}

const BulkWorkflowModal: React.FC<BulkWorkflowModalProps> = ({
  isOpen,
  onClose,
  selectedAnimals,
  onExecuteBulkWorkflow,
  veterinarians
}) => {
  const [workflowType, setWorkflowType] = useState<'BULK_ET' | 'BULK_FLUSHING' | 'SYNCHRONIZATION' | 'BATCH_RECHECK'>('BULK_ET');
  const [baseDate, setBaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [assignedVet, setAssignedVet] = useState(veterinarians[0] || 'Dr. Sarah Ahmed');
  const [reasoning, setReasoning] = useState('');
  const [loading, setLoading] = useState(false);

  const workflowOptions = [
    { 
      value: 'BULK_ET', 
      label: 'Bulk Embryo Transfer',
      description: 'Schedule ET procedures for multiple recipients',
      staggerTime: 30,
      icon: '🧬'
    },
    { 
      value: 'BULK_FLUSHING', 
      label: 'Bulk Flushing',
      description: 'Schedule flushing procedures for multiple donors',
      staggerTime: 45,
      icon: '🔄'
    },
    { 
      value: 'SYNCHRONIZATION', 
      label: 'Synchronization Protocol',
      description: 'Initiate synchronization for breeding groups',
      staggerTime: 15,
      icon: '⚡'
    },
    { 
      value: 'BATCH_RECHECK', 
      label: 'Batch Recheck',
      description: 'Schedule follow-up examinations',
      staggerTime: 20,
      icon: '🔍'
    }
  ];

  const selectedOption = workflowOptions.find(opt => opt.value === workflowType);
  const totalActions = selectedAnimals.length * 5; // 5 automated actions per animal

  const handleExecute = async () => {
    if (!reasoning.trim()) {
      alert('Please provide clinical reasoning for this bulk assignment');
      return;
    }

    setLoading(true);
    try {
      const assignment: BulkWorkflowAssignment = {
        consultantId: 'consultant_001',
        consultantName: 'Dr. Sarah Ahmed',
        selectedAnimals,
        workflowType,
        baseDate,
        assignedVet,
        reasoning: reasoning.trim()
      };

      await onExecuteBulkWorkflow(assignment);
      onClose();
    } catch (error) {
      console.error('Error executing bulk workflow:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStaggeredSchedule = () => {
    const baseDate = new Date(baseDate);
    const staggerMinutes = {
      'SYNCHRONIZATION': 15,
      'BULK_ET': 30,
      'BULK_FLUSHING': 45,
      'BATCH_RECHECK': 20
    };
    
    const interval = staggerMinutes[workflowType as keyof typeof staggerMinutes] || 30;
    
    return selectedAnimals.slice(0, 5).map((_, index) => {
      const scheduledTime = new Date(baseDate);
      scheduledTime.setMinutes(scheduledTime.getMinutes() + (index * interval));
      return scheduledTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap className="h-6 w-6 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Bulk Workflow Assignment</h3>
              <p className="text-sm text-gray-500">{selectedAnimals.length} animals selected</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Workflow Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Workflow Type</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {workflowOptions.map((option) => (
                <div
                  key={option.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    workflowType === option.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setWorkflowType(option.value as any)}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                      <div className="text-xs text-blue-600 mt-1">
                        Staggered by {option.staggerTime} minutes
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Base Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="date"
                  value={baseDate}
                  onChange={(e) => setBaseDate(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Veterinarian</label>
              <select
                value={assignedVet}
                onChange={(e) => setAssignedVet(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500"
              >
                {veterinarians.map((vet) => (
                  <option key={vet} value={vet}>{vet}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clinical Reasoning */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clinical Reasoning <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              placeholder="Provide clinical reasoning for this bulk workflow assignment..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Preview Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-900">Automation Preview</h4>
                <div className="text-sm text-blue-700 mt-1 space-y-1">
                  <div>• {selectedAnimals.length} animals will be assigned to {selectedOption?.label}</div>
                  <div>• {totalActions} automated actions will be triggered</div>
                  <div>• Procedures staggered by {selectedOption?.staggerTime} minutes</div>
                  <div>• Calendar events, injections, and follow-ups will be auto-created</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExecute}
            disabled={loading || !reasoning.trim()}
            className="flex items-center space-x-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <span>{loading ? 'Executing...' : 'Execute Bulk Workflow'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkWorkflowModal; 