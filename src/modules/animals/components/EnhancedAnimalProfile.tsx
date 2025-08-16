import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Download, Settings, MapPin, Calendar, FileText, Heart, Activity, User, UserCheck, Filter, Search, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { Button } from './components/ui/Button';
import { Animal } from '../types/animalTypes';
import { getRoleDisplayInfo } from '../utils/animalUtils';

interface EnhancedAnimalProfileProps {
  animal: Animal;
  onBack: () => void;
  onEdit: () => void;
}

interface ViewSettings {
  showQuickStats: boolean;
  showRoles: boolean;
  showAgeInMonths: boolean;
  enableCompactView: boolean;
  defaultTab: string;
  showCriticalOnly: boolean;
}

export const EnhancedAnimalProfile: React.FC<EnhancedAnimalProfileProps> = ({
  animal,
  onBack,
  onEdit
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);
  const [viewSettings, setViewSettings] = useState<ViewSettings>({
    showQuickStats: true,
    showRoles: true,
    showAgeInMonths: false,
    enableCompactView: false,
    defaultTab: 'overview',
    showCriticalOnly: false
  });

  // Load saved view settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('animalProfileSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setViewSettings(settings);
        setActiveTab(settings.defaultTab || 'overview');
      } catch (e) {
        console.warn('Failed to load view settings:', e);
      }
    }
  }, []);

  // Save view settings
  const updateViewSettings = (newSettings: Partial<ViewSettings>) => {
    const updated = { ...viewSettings, ...newSettings };
    setViewSettings(updated);
    localStorage.setItem('animalProfileSettings', JSON.stringify(updated));
  };

  const exportAnimalData = () => {
    const exportData = {
      basicInfo: {
        id: animal.id,
        animalID: animal.animalID,
        name: animal.name,
        species: animal.species,
        sex: animal.sex,
        status: animal.status,
        breed: animal.breed,
        age: animal.age,
        weight: animal.weight,
        color: animal.color
      },
      roles: animal.roles.map(role => ({
        role: role.role,
        assignedAt: role.assignedAt,
        isActive: role.isActive
      })),
      health: {
        currentLocation: animal.currentLocation,
        microchip: animal.microchip,
        lastHealthCheck: animal.lastHealthCheck
      },
      lineage: {
        fatherName: animal.fatherName,
        motherName: animal.motherName,
        fatherID: animal.fatherID,
        motherID: animal.motherID,
        family: animal.family
      },
      customer: animal.customer,
      metadata: {
        createdAt: animal.createdAt,
        updatedAt: animal.updatedAt,
        exportedAt: new Date().toISOString()
      }
    };

    const jsonData = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `animal_${animal.animalID}_profile.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getAgeDisplay = () => {
    if (!animal.age) return 'Unknown';
    if (viewSettings.showAgeInMonths) {
      const months = Math.round(animal.age * 12);
      return `${months} months`;
    }
    return `${animal.age} years`;
  };

  const activeRoles = animal.roles.filter(r => r.isActive);
  const criticalRoles = activeRoles.filter(r => ['Donor', 'Recipient', 'Breeder'].includes(r.role));
  const displayRoles = viewSettings.showCriticalOnly ? criticalRoles : activeRoles;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'health', label: 'Health Records', icon: Heart },
    { id: 'reproduction', label: 'Reproduction', icon: Activity },
    { id: 'lineage', label: 'Lineage', icon: UserCheck },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'location', label: 'Location History', icon: MapPin }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={onBack}
                variant="ghost"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{animal.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{animal.animalID}</span>
                  <span className="capitalize">{animal.species.toLowerCase()} ({animal.sex.toLowerCase()})</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    animal.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    animal.status === 'INACTIVE' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {animal.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowCustomizePanel(!showCustomizePanel)}
                variant="outline"
                size="sm"
                className="relative"
              >
                <Settings className="h-4 w-4 mr-2" />
                Customize
                {showCustomizePanel && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                    <h3 className="font-medium text-gray-900 mb-3">View Settings</h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={viewSettings.showQuickStats}
                          onChange={(e) => updateViewSettings({ showQuickStats: e.target.checked })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Show Quick Stats</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={viewSettings.showRoles}
                          onChange={(e) => updateViewSettings({ showRoles: e.target.checked })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Show Active Roles</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={viewSettings.showAgeInMonths}
                          onChange={(e) => updateViewSettings({ showAgeInMonths: e.target.checked })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Show Age in Months</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={viewSettings.enableCompactView}
                          onChange={(e) => updateViewSettings({ enableCompactView: e.target.checked })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Compact View</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={viewSettings.showCriticalOnly}
                          onChange={(e) => updateViewSettings({ showCriticalOnly: e.target.checked })}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Critical Roles Only</span>
                      </label>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Default Tab
                        </label>
                        <select
                          value={viewSettings.defaultTab}
                          onChange={(e) => updateViewSettings({ defaultTab: e.target.value })}
                          className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                        >
                          {tabs.map(tab => (
                            <option key={tab.id} value={tab.id}>{tab.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <Button
                        onClick={() => setShowCustomizePanel(false)}
                        size="sm"
                        className="w-full"
                      >
                        Apply Settings
                      </Button>
                    </div>
                  </div>
                )}
              </Button>

              <Button
                onClick={exportAnimalData}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <Button
                onClick={onEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        {viewSettings.showQuickStats && (
          <div className={`bg-white border-r border-gray-200 ${viewSettings.enableCompactView ? 'w-64' : 'w-80'}`}>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Age</span>
                  <span className="font-medium">{getAgeDisplay()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Sex</span>
                  <span className="font-medium">{animal.sex}</span>
                </div>
                
                {animal.weight && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight</span>
                    <span className="font-medium">{animal.weight} kg</span>
                  </div>
                )}

                {animal.breed && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Breed</span>
                    <span className="font-medium">{animal.breed}</span>
                  </div>
                )}

                {animal.currentLocation && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">{animal.currentLocation}</span>
                  </div>
                )}
              </div>

              {viewSettings.showRoles && displayRoles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    {viewSettings.showCriticalOnly ? 'Critical Roles' : 'Active Roles'}
                  </h3>
                  
                  <div className="space-y-2">
                    {displayRoles.map((roleAssignment) => {
                      const roleInfo = getRoleDisplayInfo(roleAssignment.role);
                      return (
                        <div
                          key={roleAssignment.role}
                          className={`flex items-center p-2 rounded-lg ${
                            viewSettings.enableCompactView ? 'text-xs' : 'text-sm'
                          }`}
                          style={{ backgroundColor: roleInfo.color + '20' }}
                        >
                          <span className="text-lg mr-2">{roleInfo.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium">{roleAssignment.role}</div>
                            {!viewSettings.enableCompactView && (
                              <div className="text-xs text-gray-500">
                                Since {new Date(roleAssignment.assignedAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {/* Tab Navigation */}
          <div className="bg-white border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Animal ID</label>
                        <p className="text-gray-900">{animal.animalID}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Name</label>
                        <p className="text-gray-900">{animal.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Species</label>
                        <p className="text-gray-900 capitalize">{animal.species.toLowerCase()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Registration Date</label>
                        <p className="text-gray-900">
                          {new Date(animal.registrationDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Physical Characteristics</h3>
                    <div className="space-y-3">
                      {animal.age && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Age</label>
                          <p className="text-gray-900">{getAgeDisplay()}</p>
                        </div>
                      )}
                      {animal.weight && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Weight</label>
                          <p className="text-gray-900">{animal.weight} kg</p>
                        </div>
                      )}
                      {animal.height && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Height</label>
                          <p className="text-gray-900">{animal.height} cm</p>
                        </div>
                      )}
                      {animal.color && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Color</label>
                          <p className="text-gray-900">{animal.color}</p>
                        </div>
                      )}
                      {animal.microchip && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Microchip</label>
                          <p className="text-gray-900 font-mono text-sm">{animal.microchip}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {animal.customer && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Name</label>
                        <p className="text-gray-900">{animal.customer.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Customer ID</label>
                        <p className="text-gray-900">{animal.customer.customerID}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Region</label>
                        <p className="text-gray-900">{animal.customer.region}</p>
                      </div>
                      {animal.customer.contactNumber && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Contact</label>
                          <p className="text-gray-900">{animal.customer.contactNumber}</p>
                        </div>
                      )}
                      {animal.customer.email && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Email</label>
                          <p className="text-gray-900">{animal.customer.email}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-600">Category</label>
                        <p className="text-gray-900">{animal.customer.category}</p>
                      </div>
                    </div>
                  </div>
                )}

                {animal.notes && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{animal.notes}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'health' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Records</h3>
                <p className="text-gray-600">Health records and medical history would be displayed here.</p>
              </div>
            )}

            {activeTab === 'reproduction' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Reproduction History</h3>
                <p className="text-gray-600">Breeding records, offspring, and reproductive health data would be shown here.</p>
              </div>
            )}

            {activeTab === 'lineage' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lineage Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Father</h4>
                      <div className="space-y-2">
                        {animal.fatherName && (
                          <div>
                            <label className="text-sm font-medium text-gray-600">Name</label>
                            <p className="text-gray-900">{animal.fatherName}</p>
                          </div>
                        )}
                        {animal.fatherID && (
                          <div>
                            <label className="text-sm font-medium text-gray-600">ID</label>
                            <p className="text-gray-900">{animal.fatherID}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Mother</h4>
                      <div className="space-y-2">
                        {animal.motherName && (
                          <div>
                            <label className="text-sm font-medium text-gray-600">Name</label>
                            <p className="text-gray-900">{animal.motherName}</p>
                          </div>
                        )}
                        {animal.motherID && (
                          <div>
                            <label className="text-sm font-medium text-gray-600">ID</label>
                            <p className="text-gray-900">{animal.motherID}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {animal.family && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-600">Family Line</label>
                      <p className="text-gray-900">{animal.family}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900">Animal Created</p>
                      <p className="text-sm text-gray-600">
                        {new Date(animal.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {animal.updatedAt !== animal.createdAt && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Last Updated</p>
                        <p className="text-sm text-gray-600">
                          {new Date(animal.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {animal.roles.map((role, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium text-gray-900">Role Assigned: {role.role}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(role.assignedAt).toLocaleString()} by {role.assignedBy}
                        </p>
                        {role.notes && (
                          <p className="text-sm text-gray-500 mt-1">{role.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'location' && (
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location History</h3>
                {animal.currentLocation ? (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Current Location</p>
                        <p className="text-gray-600">{animal.currentLocation}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600">No location information available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close customize panel */}
      {showCustomizePanel && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowCustomizePanel(false)}
        />
      )}
    </div>
  );
}; 