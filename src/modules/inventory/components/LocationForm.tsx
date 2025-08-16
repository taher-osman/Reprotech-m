import React, { useState, useEffect } from 'react';
import { X, MapPin, Thermometer, Settings } from 'lucide-react';

interface StorageLocation {
  id: string;
  locationCode: string;
  name: string;
  type: 'SITE' | 'BUILDING' | 'ROOM' | 'STORAGE_UNIT';
  parentId?: string;
  conditions: string;
  capacity: number;
  currentOccupancy: number;
  temperature?: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'OFFLINE';
}

interface LocationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (locationData: any) => void;
  location?: StorageLocation | null;
  locations: StorageLocation[];
}

export const LocationForm: React.FC<LocationFormProps> = ({
  isOpen,
  onClose,
  onSave,
  location,
  locations
}) => {
  const [formData, setFormData] = useState({
    locationCode: '',
    name: '',
    type: 'ROOM' as const,
    parentId: '',
    conditions: '',
    capacity: 100,
    currentOccupancy: 0,
    temperature: '',
    status: 'ACTIVE' as const
  });

  const locationTypes = [
    { value: 'SITE', label: 'Site' },
    { value: 'BUILDING', label: 'Building' },
    { value: 'ROOM', label: 'Room' },
    { value: 'STORAGE_UNIT', label: 'Storage Unit' }
  ];

  const parentLocations = locations.filter(loc => 
    loc.id !== location?.id && 
    (formData.type === 'BUILDING' && loc.type === 'SITE' ||
     formData.type === 'ROOM' && loc.type === 'BUILDING' ||
     formData.type === 'STORAGE_UNIT' && loc.type === 'ROOM')
  );

  useEffect(() => {
    if (location) {
      setFormData({
        locationCode: location.locationCode,
        name: location.name,
        type: location.type,
        parentId: location.parentId || '',
        conditions: location.conditions,
        capacity: location.capacity,
        currentOccupancy: location.currentOccupancy,
        temperature: location.temperature?.toString() || '',
        status: location.status
      });
    } else {
      setFormData({
        locationCode: '',
        name: '',
        type: 'ROOM',
        parentId: '',
        conditions: '',
        capacity: 100,
        currentOccupancy: 0,
        temperature: '',
        status: 'ACTIVE'
      });
    }
  }, [location, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const locationData = {
      ...formData,
      temperature: formData.temperature ? parseFloat(formData.temperature) : undefined
    };
    onSave(locationData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {location ? 'Edit Location' : 'Add New Location'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Basic Information
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.locationCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, locationCode: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g., SITE-001, RM-LAB-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any, parentId: '' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    {locationTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Main Facility, IVF Laboratory"
                />
              </div>

              {parentLocations.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Location
                  </label>
                  <select
                    value={formData.parentId}
                    onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">No Parent</option>
                    {parentLocations.map(parentLoc => (
                      <option key={parentLoc.id} value={parentLoc.id}>
                        {parentLoc.name} ({parentLoc.locationCode})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Storage Configuration */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Storage Configuration
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Occupancy
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={formData.capacity}
                    value={formData.currentOccupancy}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentOccupancy: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Storage Conditions *
                </label>
                <input
                  type="text"
                  required
                  value={formData.conditions}
                  onChange={(e) => setFormData(prev => ({ ...prev, conditions: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Climate Controlled, 18-22°C, 50-60% RH"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature (°C)
                </label>
                <div className="relative">
                  <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="Optional temperature monitoring"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="OFFLINE">Offline</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              {location ? 'Update Location' : 'Add Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 