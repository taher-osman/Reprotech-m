import React, { useState, useCallback } from 'react';
import { Sample, SampleStatus, SAMPLE_STATUSES, STORAGE_LOCATIONS } from '../types/sampleTypes';
import { FlaskConical, MapPin, Calendar, User, MoreHorizontal, Package } from 'lucide-react';

interface SampleDragDropBoardProps {
  samples: Sample[];
  onSampleMove: (sampleId: string, newStatus: SampleStatus, newLocation?: string) => void;
  onSampleSelect: (sample: Sample) => void;
  groupBy: 'status' | 'location';
}

interface DragData {
  sampleId: string;
  sourceColumn: string;
}

export const SampleDragDropBoard: React.FC<SampleDragDropBoardProps> = ({
  samples,
  onSampleMove,
  onSampleSelect,
  groupBy
}) => {
  const [dragData, setDragData] = useState<DragData | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Get columns based on groupBy prop
  const getColumns = () => {
    if (groupBy === 'status') {
      return SAMPLE_STATUSES.map(status => ({
        id: status,
        title: status,
        samples: samples.filter(s => s.status === status)
      }));
    } else {
      return STORAGE_LOCATIONS.map(location => ({
        id: location,
        title: location,
        samples: samples.filter(s => s.location === location)
      }));
    }
  };

  // Drag handlers
  const handleDragStart = useCallback((e: React.DragEvent, sample: Sample) => {
    const sourceColumn = groupBy === 'status' ? sample.status : sample.location;
    const dragData: DragData = {
      sampleId: sample.id,
      sourceColumn
    };
    
    setDragData(dragData);
    e.dataTransfer.setData('text/plain', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
  }, [groupBy]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Only clear if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(null);

    try {
      const dragDataStr = e.dataTransfer.getData('text/plain');
      const dragData: DragData = JSON.parse(dragDataStr);
      
      if (dragData.sourceColumn !== columnId) {
        if (groupBy === 'status') {
          onSampleMove(dragData.sampleId, columnId as SampleStatus);
        } else {
          // For location changes, we need to find the sample to get its current status
          const sample = samples.find(s => s.id === dragData.sampleId);
          if (sample) {
            onSampleMove(dragData.sampleId, sample.status, columnId);
          }
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
    
    setDragData(null);
  }, [groupBy, onSampleMove, samples]);

  // Get column styling based on status/location
  const getColumnStyle = (columnId: string) => {
    if (groupBy === 'status') {
      switch (columnId) {
        case 'Fresh': return 'border-green-200 bg-green-50';
        case 'Assigned to Biobank': return 'border-blue-200 bg-blue-50';
        case 'Used': return 'border-gray-200 bg-gray-50';
        case 'Assigned': return 'border-yellow-200 bg-yellow-50';
        case 'In Transfer': return 'border-purple-200 bg-purple-50';
        case 'Research': return 'border-indigo-200 bg-indigo-50';
        case 'Discarded': return 'border-red-200 bg-red-50';
        default: return 'border-gray-200 bg-gray-50';
      }
    }
    return 'border-gray-200 bg-gray-50';
  };

  // Get sample card styling
  const getSampleCardStyle = (sample: Sample) => {
    let baseStyle = 'bg-white p-3 rounded-lg border shadow-sm cursor-move transition-all hover:shadow-md ';
    
    if (groupBy === 'status') {
      switch (sample.status) {
        case 'Fresh': return baseStyle + 'border-green-200 hover:border-green-300';
        case 'Assigned to Biobank': return baseStyle + 'border-blue-200 hover:border-blue-300';
        case 'Used': return baseStyle + 'border-gray-200 hover:border-gray-300';
        case 'Assigned': return baseStyle + 'border-yellow-200 hover:border-yellow-300';
        case 'In Transfer': return baseStyle + 'border-purple-200 hover:border-purple-300';
        case 'Research': return baseStyle + 'border-indigo-200 hover:border-indigo-300';
        case 'Discarded': return baseStyle + 'border-red-200 hover:border-red-300';
        default: return baseStyle + 'border-gray-200 hover:border-gray-300';
      }
    }
    
    return baseStyle + 'border-gray-200 hover:border-gray-300';
  };

  // Get sample type icon
  const getSampleTypeIcon = (type: string) => {
    switch (type) {
      case 'embryo': return '🧬';
      case 'oocyte': return '🥚';
      case 'semen': return '💧';
      case 'blood': return '🩸';
      case 'DNA': return '🧪';
      default: return '🔬';
    }
  };

  const columns = getColumns();

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Package className="h-6 w-6 text-teal-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sample Organization Board</h3>
            <p className="text-sm text-gray-600">
              Drag and drop samples to change their {groupBy}
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {samples.length} total samples
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {columns.map(column => (
          <div
            key={column.id}
            className={`min-h-96 p-4 rounded-lg border-2 transition-all ${
              getColumnStyle(column.id)
            } ${
              dragOverColumn === column.id ? 'border-teal-400 bg-teal-50' : ''
            }`}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900">{column.title}</h4>
                <p className="text-xs text-gray-500">{column.samples.length} samples</p>
              </div>
              {groupBy === 'status' && column.id === 'Fresh' && (
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" title="Active status" />
              )}
              {groupBy === 'status' && column.id === 'Assigned to Biobank' && (
                <Package className="h-4 w-4 text-blue-600" title="Ready for biobank" />
              )}
            </div>

            {/* Sample Cards */}
            <div className="space-y-3">
              {column.samples.map(sample => (
                <div
                  key={sample.id}
                  draggable
                  className={getSampleCardStyle(sample)}
                  onDragStart={(e) => handleDragStart(e, sample)}
                  onClick={() => onSampleSelect(sample)}
                >
                  {/* Sample Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getSampleTypeIcon(sample.sample_type)}</span>
                      <span className="font-mono text-sm font-medium">{sample.sample_id}</span>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal className="h-3 w-3 text-gray-400" />
                    </button>
                  </div>

                  {/* Sample Info */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <User className="h-3 w-3" />
                      <span className="truncate">{sample.animal_name}</span>
                    </div>
                    
                    {groupBy === 'status' && (
                      <div className="flex items-center space-x-1 text-xs text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{sample.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(sample.collection_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Sample Quality/Details */}
                  <div className="mt-2 flex items-center justify-between">
                    {sample.quality_score && (
                      <div className="text-xs">
                        <span className="text-gray-500">Quality:</span>
                        <span className={`ml-1 font-medium ${
                          sample.quality_score >= 8 ? 'text-green-600' :
                          sample.quality_score >= 6 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {sample.quality_score}/10
                        </span>
                      </div>
                    )}
                    
                    {sample.research_flag && (
                      <div className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">
                        Research
                      </div>
                    )}
                  </div>

                  {/* Drag Indicator */}
                  <div className="mt-2 flex justify-center">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Empty State */}
              {column.samples.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <FlaskConical className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No samples in {column.title.toLowerCase()}</p>
                  <p className="text-xs mt-1">Drop samples here to update their {groupBy}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Package className="h-5 w-5 text-teal-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-teal-900">How to use the drag-and-drop board:</h4>
            <ul className="mt-2 text-sm text-teal-700 space-y-1">
              <li>• Drag sample cards between columns to change their {groupBy}</li>
              <li>• Click on any sample card to view detailed information</li>
              <li>• Use the visual indicators to quickly identify sample status and quality</li>
              <li>• Empty columns show drop zones for easy organization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 