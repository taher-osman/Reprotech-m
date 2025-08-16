import React, { useState } from 'react';
import { X, Package, Microscope, Download, Trash2, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { Sample, SampleStatus, STORAGE_LOCATIONS } from '../types/sampleTypes';

interface SampleBatchActionProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSamples: Sample[];
  onExecute: (action: BatchActionType, params?: BatchActionParams) => void;
}

export interface BatchActionType {
  type: 'assign-to-biobank' | 'assign-research' | 'update-location' | 'export' | 'delete';
}

export interface BatchActionParams {
  targetLocation?: string;
  targetStatus?: SampleStatus;
  notes?: string;
  exportFormat?: 'csv' | 'excel' | 'pdf';
  includeDetails?: boolean;
}

export const SampleBatchAction: React.FC<SampleBatchActionProps> = ({
  isOpen,
  onClose,
  selectedSamples,
  onExecute
}) => {
  const [activeAction, setActiveAction] = useState<string>('');
  const [targetLocation, setTargetLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('csv');
  const [includeDetails, setIncludeDetails] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleExecute = async (type: string) => {
    setIsProcessing(true);
    
    try {
      const params: BatchActionParams = {
        targetLocation,
        notes,
        exportFormat,
        includeDetails
      };

      switch (type) {
        case 'assign-to-biobank':
          params.targetStatus = 'Assigned to Biobank';
          params.targetLocation = 'Lab Processing Area';
          break;
        case 'assign-research':
          params.targetStatus = 'Research';
          params.targetLocation = 'Research Lab';
          break;
        case 'update-location':
          // targetLocation already set
          break;
      }

      await onExecute({ type: type as any }, params);
      onClose();
    } catch (error) {
      console.error('Batch action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getActionSummary = () => {
    const sampleCount = selectedSamples.length;
    const sampleTypes = selectedSamples.reduce((acc, sample) => {
      acc[sample.sample_type] = (acc[sample.sample_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const typesSummary = Object.entries(sampleTypes)
      .map(([type, count]) => `${count} ${type}${count > 1 ? 's' : ''}`)
      .join(', ');

    return `${sampleCount} samples selected: ${typesSummary}`;
  };

  const getEligibleSamples = (actionType: string): Sample[] => {
    switch (actionType) {
      case 'assign-to-biobank':
        return selectedSamples.filter(s => s.status === 'Fresh' || s.status === 'Assigned');
      case 'assign-research':
        return selectedSamples.filter(s => s.status !== 'Used' && s.status !== 'Discarded');
      default:
        return selectedSamples;
    }
  };

  const ActionCard: React.FC<{
    action: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    onClick: () => void;
  }> = ({ action, title, description, icon, color, onClick }) => {
    const eligibleCount = getEligibleSamples(action).length;
    const ineligibleCount = selectedSamples.length - eligibleCount;
    
    return (
      <div 
        onClick={onClick}
        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
          activeAction === action 
            ? `border-${color}-500 bg-${color}-50` 
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center space-x-3 mb-2">
          <div className={`p-2 rounded-lg bg-${color}-100`}>
            {icon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-green-600 flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            {eligibleCount} eligible
          </span>
          {ineligibleCount > 0 && (
            <span className="text-yellow-600 flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {ineligibleCount} skipped
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Bulk Actions</h2>
            <p className="text-sm text-gray-600">{getActionSummary()}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Action Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Select Action</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ActionCard
                action="assign-to-biobank"
                title="Assign to Biobank"
                description="Send samples to biobank for freezing and long-term storage"
                icon={<Package className="h-5 w-5 text-blue-600" />}
                color="blue"
                onClick={() => setActiveAction('assign-to-biobank')}
              />
              
              <ActionCard
                action="assign-research"
                title="Assign to Research"
                description="Flag samples for research use and move to research lab"
                icon={<Microscope className="h-5 w-5 text-indigo-600" />}
                color="indigo"
                onClick={() => setActiveAction('assign-research')}
              />
              
              <ActionCard
                action="update-location"
                title="Update Location"
                description="Move samples to a different storage location"
                icon={<FileText className="h-5 w-5 text-green-600" />}
                color="green"
                onClick={() => setActiveAction('update-location')}
              />
              
              <ActionCard
                action="export"
                title="Export Data"
                description="Export sample information to various formats"
                icon={<Download className="h-5 w-5 text-purple-600" />}
                color="purple"
                onClick={() => setActiveAction('export')}
              />
            </div>
          </div>

          {/* Action-Specific Parameters */}
          {activeAction === 'update-location' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Update Location</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Location
                  </label>
                  <select
                    value={targetLocation}
                    onChange={(e) => setTargetLocation(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select location</option>
                    {STORAGE_LOCATIONS.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeAction === 'export' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Export Options</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Export Format
                  </label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value as any)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="csv">CSV (Comma Separated Values)</option>
                    <option value="excel">Excel Spreadsheet</option>
                    <option value="pdf">PDF Report</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="include_details"
                    checked={includeDetails}
                    onChange={(e) => setIncludeDetails(e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label htmlFor="include_details" className="text-sm font-medium text-gray-700">
                    Include detailed measurements and quality data
                  </label>
                </div>
              </div>
            </div>
          )}

          {(activeAction === 'assign-to-biobank' || activeAction === 'assign-research' || activeAction === 'update-location') && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Additional Notes</h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Optional notes about this batch operation..."
              />
            </div>
          )}

          {/* Sample Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Selected Samples</h4>
            <div className="max-h-40 overflow-y-auto">
              <div className="space-y-2">
                {selectedSamples.map(sample => {
                  const isEligible = activeAction ? getEligibleSamples(activeAction).includes(sample) : true;
                  return (
                    <div 
                      key={sample.id} 
                      className={`flex items-center justify-between p-2 rounded ${
                        isEligible ? 'bg-white' : 'bg-yellow-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium">{sample.sample_id}</span>
                        <span className="text-sm text-gray-600 capitalize">{sample.sample_type}</span>
                        <span className="text-sm text-gray-500">{sample.animal_name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          sample.status === 'Fresh' ? 'bg-green-100 text-green-800' :
                          sample.status === 'Assigned to Biobank' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {sample.status}
                        </span>
                        {!isEligible && (
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            
            {activeAction === 'delete' && (
              <button
                onClick={() => handleExecute('delete')}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                <span>{isProcessing ? 'Deleting...' : 'Delete Samples'}</span>
              </button>
            )}
            
            {activeAction && activeAction !== 'delete' && (
              <button
                onClick={() => handleExecute(activeAction)}
                disabled={isProcessing || (activeAction === 'update-location' && !targetLocation)}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {activeAction === 'assign-to-biobank' && <Package className="h-4 w-4" />}
                {activeAction === 'assign-research' && <Microscope className="h-4 w-4" />}
                {activeAction === 'update-location' && <FileText className="h-4 w-4" />}
                {activeAction === 'export' && <Download className="h-4 w-4" />}
                <span>
                  {isProcessing ? 'Processing...' : 
                   activeAction === 'assign-to-biobank' ? 'Assign to Biobank' :
                   activeAction === 'assign-research' ? 'Assign to Research' :
                   activeAction === 'update-location' ? 'Update Location' :
                   activeAction === 'export' ? 'Export Data' : 'Execute'}
                </span>
              </button>
            )}
          </div>

          {/* Delete Action (Separate for Safety) */}
          {activeAction !== 'delete' && (
            <div className="border-t pt-4">
              <button
                onClick={() => setActiveAction('delete')}
                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete Selected Samples</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 