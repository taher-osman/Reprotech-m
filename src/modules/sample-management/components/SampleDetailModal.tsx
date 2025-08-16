import React from 'react';
import { X, Calendar, User, MapPin, FlaskConical, Dna, Heart, TestTube, Package, Eye, ExternalLink, AlertTriangle, CheckCircle, Clock, Microscope, QrCode, Printer } from 'lucide-react';
import { Sample } from '../types/sampleTypes';
import { getSampleAge, formatSampleDetails, isSampleSuitableForTransfer } from '../utils/SampleUtils';
import { QRCodeGenerator } from './QRCodeGenerator';

interface SampleDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sample: Sample | null;
  onEdit?: (sample: Sample) => void;
  onAssignToBiobank?: (sample: Sample) => void;
}

export const SampleDetailModal: React.FC<SampleDetailModalProps> = ({
  isOpen,
  onClose,
  sample,
  onEdit,
  onAssignToBiobank
}) => {
  if (!isOpen || !sample) return null;

  const sampleAge = getSampleAge(sample.collection_date);
  const isTransferSuitable = isSampleSuitableForTransfer(sample);

  const getSampleTypeIcon = (type: string) => {
    switch (type) {
      case 'embryo': return <Heart className="h-5 w-5 text-pink-600" />;
      case 'oocyte': return <TestTube className="h-5 w-5 text-purple-600" />;
      case 'semen': return <FlaskConical className="h-5 w-5 text-blue-600" />;
      case 'blood': return <Package className="h-5 w-5 text-red-600" />;
      case 'DNA': return <Dna className="h-5 w-5 text-green-600" />;
      default: return <Microscope className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Fresh': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Assigned to Biobank': return <Package className="h-4 w-4 text-blue-600" />;
      case 'Used': return <Eye className="h-4 w-4 text-gray-600" />;
      case 'Assigned': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'In Transfer': return <ExternalLink className="h-4 w-4 text-purple-600" />;
      case 'Research': return <Microscope className="h-4 w-4 text-indigo-600" />;
      case 'Discarded': return <X className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Fresh': return 'bg-green-100 text-green-800 border-green-200';
      case 'Assigned to Biobank': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Used': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Assigned': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'In Transfer': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Research': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Discarded': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getGeneticStatusColor = (status: string) => {
    switch (status) {
      case 'Normal': return 'text-green-600';
      case 'Carrier': return 'text-yellow-600';
      case 'Mutant': return 'text-red-600';
      case 'Untested': return 'text-gray-600';
      case 'Inconclusive': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            {getSampleTypeIcon(sample.sample_type)}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{sample.sample_id}</h2>
              <p className="text-sm text-gray-600">Sample Details & Traceability</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Banner */}
          <div className={`p-4 rounded-lg border ${getStatusBadgeColor(sample.status)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(sample.status)}
                <span className="font-medium">Status: {sample.status}</span>
              </div>
              {sample.research_flag && (
                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
                  Research Sample
                </span>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3">
            {onEdit && (
              <button
                onClick={() => onEdit(sample)}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
              >
                <FlaskConical className="h-4 w-4" />
                <span>Edit Sample</span>
              </button>
            )}
            {sample.status === 'Fresh' && onAssignToBiobank && (
              <button
                onClick={() => onAssignToBiobank(sample)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Package className="h-4 w-4" />
                <span>Assign to Biobank</span>
              </button>
            )}
            {sample.status === 'Assigned to Biobank' && (
              <button
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                title="View in Biobank Module"
              >
                <ExternalLink className="h-4 w-4" />
                <span>View in Biobank</span>
              </button>
            )}
          </div>

          {/* Main Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sample Type:</span>
                  <div className="flex items-center space-x-2">
                    {getSampleTypeIcon(sample.sample_type)}
                    <span className="font-medium capitalize">{sample.sample_type}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Animal:</span>
                  <span className="font-medium">{sample.animal_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Collection Method:</span>
                  <span className="font-medium">{sample.collection_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Collection Date:</span>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{new Date(sample.collection_date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-medium">{sampleAge} days</span>
                </div>
              </div>
            </div>

            {/* Location & Storage */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Location & Storage</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Location:</span>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{sample.location}</span>
                  </div>
                </div>
                {sample.container_type && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Container:</span>
                    <span className="font-medium">{sample.container_type}</span>
                  </div>
                )}
                {sample.storage_temperature && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Storage Temp:</span>
                    <span className="font-medium">{sample.storage_temperature}°C</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Created By:</span>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{sample.created_by}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code & Label */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">QR Code & Label</h3>
                <QrCode className="h-5 w-5 text-teal-600" />
              </div>
              <QRCodeGenerator
                sample={sample}
                size={120}
                includeText={false}
              />
            </div>
          </div>

          {/* Quality & Measurements */}
          {(sample.quality_score || sample.morphology_grade || sample.cell_count || sample.volume_ml || sample.concentration || sample.motility_percentage || sample.viability_percentage) && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quality & Measurements</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sample.quality_score && (
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="text-2xl font-bold text-teal-600">{sample.quality_score}/10</div>
                    <div className="text-sm text-gray-600">Quality Score</div>
                  </div>
                )}
                {sample.morphology_grade && (
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="text-2xl font-bold text-purple-600">{sample.morphology_grade}</div>
                    <div className="text-sm text-gray-600">Morphology</div>
                  </div>
                )}
                {sample.cell_count && (
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="text-2xl font-bold text-blue-600">{sample.cell_count}</div>
                    <div className="text-sm text-gray-600">Cell Count</div>
                  </div>
                )}
                {sample.volume_ml && (
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="text-2xl font-bold text-green-600">{sample.volume_ml}ml</div>
                    <div className="text-sm text-gray-600">Volume</div>
                  </div>
                )}
                {sample.concentration && (
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="text-2xl font-bold text-orange-600">{sample.concentration}</div>
                    <div className="text-sm text-gray-600">Concentration</div>
                  </div>
                )}
                {sample.motility_percentage && (
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="text-2xl font-bold text-red-600">{sample.motility_percentage}%</div>
                    <div className="text-sm text-gray-600">Motility</div>
                  </div>
                )}
                {sample.viability_percentage && (
                  <div className="text-center p-3 bg-white rounded border">
                    <div className="text-2xl font-bold text-indigo-600">{sample.viability_percentage}%</div>
                    <div className="text-sm text-gray-600">Viability</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Genetic Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Genetic Information</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Dna className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600">Genetic Status:</span>
              </div>
              <span className={`font-medium ${getGeneticStatusColor(sample.genetic_status)}`}>
                {sample.genetic_status}
              </span>
            </div>
          </div>

          {/* Transfer Suitability Assessment */}
          {sample.sample_type === 'embryo' && (
            <div className={`p-4 rounded-lg border ${isTransferSuitable ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
              <div className="flex items-center space-x-2 mb-2">
                {isTransferSuitable ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                )}
                <h3 className="font-semibold text-gray-900">Transfer Suitability</h3>
              </div>
              <p className={`text-sm ${isTransferSuitable ? 'text-green-700' : 'text-yellow-700'}`}>
                {isTransferSuitable 
                  ? 'This embryo is suitable for transfer based on age, status, and quality criteria.'
                  : 'This embryo may not be suitable for transfer. Check age, status, or quality requirements.'
                }
              </p>
            </div>
          )}

          {/* Activity History */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Activity History</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Sample Created</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(sample.created_at).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Last Updated</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(sample.updated_at).toLocaleString()}
                </span>
              </div>
              {sample.parent_event_id && (
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Source Event</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {sample.collection_method} #{sample.parent_event_id}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {sample.notes && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{sample.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              Sample ID: {sample.sample_id} • Created {sampleAge} days ago
            </div>
            <div>
              Last updated: {new Date(sample.updated_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 