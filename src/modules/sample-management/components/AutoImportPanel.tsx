import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, CheckCircle, AlertTriangle, Calendar, FlaskConical } from 'lucide-react';
import { generateSampleFromFlushing, generateSampleFromOPU, generateSampleFromSemen } from '../utils/SampleUtils';
import { Sample } from '../types/sampleTypes';

interface AutoImportPanelProps {
  onSamplesGenerated: (samples: Sample[]) => void;
}

interface ImportEvent {
  id: string;
  type: 'flushing' | 'opu' | 'semen';
  animalName: string;
  date: string;
  status: 'pending' | 'imported' | 'skipped';
  details: string;
}

export const AutoImportPanel: React.FC<AutoImportPanelProps> = ({ onSamplesGenerated }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [pendingEvents, setPendingEvents] = useState<ImportEvent[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());

  // Simulate scanning for new events from other modules
  const scanForNewEvents = async () => {
    setIsScanning(true);
    
    // Simulate API calls to other modules
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockEvents: ImportEvent[] = [
      {
        id: 'flush_001',
        type: 'flushing',
        animalName: 'Belle',
        date: '2025-01-16',
        status: 'pending',
        details: '3 Grade A embryos recovered'
      },
      {
        id: 'opu_002',
        type: 'opu',
        animalName: 'Star',
        date: '2025-01-16',
        status: 'pending',
        details: '12 oocytes collected'
      },
      {
        id: 'semen_003',
        type: 'semen',
        animalName: 'Thunder',
        date: '2025-01-15',
        status: 'pending',
        details: '5.8ml collected, 85% motility'
      }
    ];
    
    setPendingEvents(mockEvents);
    setIsScanning(false);
  };

  const toggleEventSelection = (eventId: string) => {
    const newSelection = new Set(selectedEvents);
    if (newSelection.has(eventId)) {
      newSelection.delete(eventId);
    } else {
      newSelection.add(eventId);
    }
    setSelectedEvents(newSelection);
  };

  const importSelectedEvents = async () => {
    const eventsToImport = pendingEvents.filter(e => selectedEvents.has(e.id));
    const generatedSamples: Sample[] = [];
    
    for (const event of eventsToImport) {
      try {
        let samples: Sample[] = [];
        
        switch (event.type) {
          case 'flushing':
            samples = generateSampleFromFlushing({
              id: event.id,
              animalName: event.animalName,
              date: event.date,
              embryoCount: 3,
              quality: 'High'
            });
            break;
          case 'opu':
            samples = generateSampleFromOPU({
              id: event.id,
              animalName: event.animalName,
              date: event.date,
              oocyteCount: 12,
              quality: 'Good'
            });
            break;
          case 'semen':
            samples = generateSampleFromSemen({
              id: event.id,
              animalName: event.animalName,
              date: event.date,
              volume: 5.8,
              motility: 85
            });
            break;
        }
        
        generatedSamples.push(...samples);
        
        // Update event status
        setPendingEvents(prev => prev.map(e => 
          e.id === event.id ? { ...e, status: 'imported' } : e
        ));
        
      } catch (error) {
        console.error(`Failed to import event ${event.id}:`, error);
        setPendingEvents(prev => prev.map(e => 
          e.id === event.id ? { ...e, status: 'skipped' } : e
        ));
      }
    }
    
    if (generatedSamples.length > 0) {
      onSamplesGenerated(generatedSamples);
    }
    
    setSelectedEvents(new Set());
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'flushing': return <FlaskConical className="h-4 w-4 text-pink-600" />;
      case 'opu': return <Calendar className="h-4 w-4 text-purple-600" />;
      case 'semen': return <FlaskConical className="h-4 w-4 text-blue-600" />;
      default: return <FlaskConical className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'imported': return 'text-green-600 bg-green-100';
      case 'skipped': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  useEffect(() => {
    // Automatically scan on component mount
    scanForNewEvents();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Auto-Import from Modules</h3>
          <p className="text-sm text-gray-600">Automatically detect and import samples from flushing, OPU, and semen collection events</p>
        </div>
        <button
          onClick={scanForNewEvents}
          disabled={isScanning}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Scanning...' : 'Scan for Events'}</span>
        </button>
      </div>

      {pendingEvents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FlaskConical className="h-12 w-12 mx-auto mb-2 text-gray-300" />
          <p>No pending events found</p>
          <p className="text-sm">Click "Scan for Events" to check for new samples from other modules</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Event List */}
          <div className="space-y-2">
            {pendingEvents.map(event => (
              <div 
                key={event.id} 
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedEvents.has(event.id) 
                    ? 'border-teal-300 bg-teal-50' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${event.status !== 'pending' ? 'opacity-60' : ''}`}
                onClick={() => event.status === 'pending' && toggleEventSelection(event.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedEvents.has(event.id)}
                      disabled={event.status !== 'pending'}
                      onChange={() => {}}
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    {getEventIcon(event.type)}
                    <div>
                      <div className="font-medium text-gray-900">
                        {event.animalName} - {event.type.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-600">{event.details}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">{event.date}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          {selectedEvents.size > 0 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm text-gray-600">
                {selectedEvents.size} event(s) selected
              </span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedEvents(new Set())}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Clear Selection
                </button>
                <button
                  onClick={importSelectedEvents}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Import Selected</span>
                </button>
              </div>
            </div>
          )}

          {/* Import Statistics */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {pendingEvents.filter(e => e.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {pendingEvents.filter(e => e.status === 'imported').length}
              </div>
              <div className="text-sm text-gray-600">Imported</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {pendingEvents.filter(e => e.status === 'skipped').length}
              </div>
              <div className="text-sm text-gray-600">Skipped</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 