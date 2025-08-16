import React, { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Package, 
  TestTube, 
  ArrowUpDown, 
  Check,
  FlaskConical,
  Dna,
  Heart,
  Microscope
} from 'lucide-react';
import { Sample, SampleType, SampleStatus } from '../types/sampleTypes';

interface SampleTableProps {
  samples: Sample[];
  selectedSamples: Set<string>;
  onSelectSample: (sampleId: string) => void;
  onSelectAll: (selected: boolean) => void;
  onEdit: (sample: Sample) => void;
  onDelete: (sample: Sample) => void;
  onView: (sample: Sample) => void;
  isLoading?: boolean;
}

type SortField = 'sample_id' | 'collection_date' | 'animal_name' | 'sample_type' | 'status' | 'location';
type SortDirection = 'asc' | 'desc';

export const SampleTable: React.FC<SampleTableProps> = ({
  samples,
  selectedSamples,
  onSelectSample,
  onSelectAll,
  onEdit,
  onDelete,
  onView,
  isLoading = false
}) => {
  const [sortField, setSortField] = useState<SortField>('collection_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedSamples = [...samples].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    // Handle date sorting
    if (sortField === 'collection_date') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    // Handle string sorting
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getSampleTypeIcon = (type: SampleType) => {
    switch (type) {
      case 'embryo': return <Heart className="h-4 w-4 text-pink-600" />;
      case 'oocyte': return <TestTube className="h-4 w-4 text-purple-600" />;
      case 'semen': return <FlaskConical className="h-4 w-4 text-blue-600" />;
      case 'blood': return <Package className="h-4 w-4 text-red-600" />;
      case 'DNA': return <Dna className="h-4 w-4 text-green-600" />;
      default: return <Microscope className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status: SampleStatus) => {
    switch (status) {
      case 'Fresh': return 'bg-green-100 text-green-800';
      case 'Assigned to Biobank': return 'bg-blue-100 text-blue-800';
      case 'Used': return 'bg-gray-100 text-gray-800';
      case 'Assigned': return 'bg-yellow-100 text-yellow-800';
      case 'In Transfer': return 'bg-purple-100 text-purple-800';
      case 'Research': return 'bg-indigo-100 text-indigo-800';
      case 'Discarded': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityBadgeColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6) return 'bg-blue-100 text-blue-800';
    if (score >= 4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const SortableHeader: React.FC<{ field: SortField; children: React.ReactNode }> = ({ field, children }) => (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <ArrowUpDown className="h-3 w-3" />
        {sortField === field && (
          <span className="text-teal-600">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={samples.length > 0 && selectedSamples.size === samples.length}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
              </th>
              <SortableHeader field="sample_id">Sample ID</SortableHeader>
              <SortableHeader field="animal_name">Animal</SortableHeader>
              <SortableHeader field="sample_type">Type</SortableHeader>
              <SortableHeader field="collection_date">Collection Date</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <SortableHeader field="location">Location</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quality
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedSamples.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center space-y-2">
                    <TestTube className="h-8 w-8 text-gray-400" />
                    <span>No samples found</span>
                  </div>
                </td>
              </tr>
            ) : (
              sortedSamples.map((sample) => (
                <tr key={sample.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedSamples.has(sample.id)}
                      onChange={() => onSelectSample(sample.id)}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{sample.sample_id}</span>
                      {sample.research_flag && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                          Research
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {sample.animal_name}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getSampleTypeIcon(sample.sample_type)}
                      <span className="text-sm text-gray-900 capitalize">
                        {sample.sample_type}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(sample.collection_date)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(sample.status)}`}>
                        {sample.status === 'Assigned to Biobank' && <Package className="h-3 w-3 mr-1" />}
                        {sample.status}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {sample.location}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      {sample.quality_score && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getQualityBadgeColor(sample.quality_score)}`}>
                          Quality: {sample.quality_score}/10
                        </span>
                      )}
                      {sample.morphology_grade && (
                        <span className="text-xs text-gray-500">
                          Grade: {sample.morphology_grade}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1 text-xs text-gray-500">
                      {sample.cell_count && (
                        <div>Cells: {sample.cell_count}</div>
                      )}
                      {sample.volume_ml && (
                        <div>Vol: {sample.volume_ml}ml</div>
                      )}
                      {sample.motility_percentage && (
                        <div>Motility: {sample.motility_percentage}%</div>
                      )}
                      {sample.concentration && (
                        <div>Conc: {sample.concentration}</div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onView(sample)}
                        className="text-gray-600 hover:text-gray-900"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(sample)}
                        className="text-teal-600 hover:text-teal-900"
                        title="Edit sample"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(sample)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete sample"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer with Summary */}
      <div className="bg-gray-50 px-6 py-3 border-t">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing {sortedSamples.length} of {samples.length} samples
          </div>
          <div>
            {selectedSamples.size > 0 && (
              <span>{selectedSamples.size} selected</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 