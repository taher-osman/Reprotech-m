import React, { useState } from 'react';
import { X, Hash, Plus, Calendar, User, Check, AlertTriangle, History, Search } from 'lucide-react';
import { Button } from './components/ui/Button';

interface InternalNumberRecord {
  id: string;
  internalNumber: string;
  isActive: boolean;
  assignedDate: string;
  endDate?: string;
  assignedBy?: string;
  reason?: string;
  notes?: string;
  animal: {
    name: string;
    animalID: string;
  };
}

interface Animal {
  id: string;
  animalID: string;
  name: string;
  species: string;
  currentInternalNumber?: {
    id: string;
    internalNumber: string;
    isActive: boolean;
    assignedDate: string;
  };
}

interface InternalNumberManagerProps {
  isOpen: boolean;
  onClose: () => void;
  animals: Animal[];
  onUpdateAnimal: (animalId: string, internalNumber: any) => void;
}

export const InternalNumberManager: React.FC<InternalNumberManagerProps> = ({
  isOpen,
  onClose,
  animals,
  onUpdateAnimal
}) => {
  const [activeTab, setActiveTab] = useState<'assign' | 'history' | 'manage'>('assign');
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newInternalNumber, setNewInternalNumber] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [assignedBy, setAssignedBy] = useState('System Admin');
  const [isGeneratingNumber, setIsGeneratingNumber] = useState(false);

  // Mock internal number history data
  const [internalNumberHistory, setInternalNumberHistory] = useState<InternalNumberRecord[]>([
    {
      id: 'int-001',
      internalNumber: 'INT-2025-0001',
      isActive: true,
      assignedDate: '2025-01-15',
      assignedBy: 'Dr. Sarah Ahmed',
      reason: 'New animal registration',
      notes: 'Premium breeding stock',
      animal: {
        name: 'Bella Prima',
        animalID: 'BV-2025-001'
      }
    },
    {
      id: 'int-002',
      internalNumber: 'INT-2025-0002',
      isActive: true,
      assignedDate: '2025-01-20',
      assignedBy: 'Dr. Ahmad Ali',
      reason: 'Transfer from partner facility',
      notes: 'Champion bloodline',
      animal: {
        name: 'Thunder King',
        animalID: 'EQ-2025-002'
      }
    }
  ]);

  const generateInternalNumber = () => {
    setIsGeneratingNumber(true);
    
    setTimeout(() => {
      const year = new Date().getFullYear();
      const lastNumber = Math.max(
        ...internalNumberHistory
          .filter(record => record.internalNumber.includes(year.toString()))
          .map(record => {
            const match = record.internalNumber.match(/\d{4}$/);
            return match ? parseInt(match[0]) : 0;
          }),
        0
      );
      
      const nextNumber = (lastNumber + 1).toString().padStart(4, '0');
      const generatedNumber = `INT-${year}-${nextNumber}`;
      
      setNewInternalNumber(generatedNumber);
      setIsGeneratingNumber(false);
    }, 1000);
  };

  const assignInternalNumber = () => {
    if (!selectedAnimal || !newInternalNumber.trim()) {
      alert('Please select an animal and enter an internal number');
      return;
    }

    const newRecord: InternalNumberRecord = {
      id: `int-${Date.now()}`,
      internalNumber: newInternalNumber,
      isActive: true,
      assignedDate: new Date().toISOString().split('T')[0],
      assignedBy,
      reason: reason || 'Manual assignment',
      notes: notes || '',
      animal: {
        name: selectedAnimal.name,
        animalID: selectedAnimal.animalID
      }
    };

    setInternalNumberHistory(prev => [newRecord, ...prev]);

    const internalNumberData = {
      id: newRecord.id,
      internalNumber: newInternalNumber,
      isActive: true,
      assignedDate: newRecord.assignedDate
    };

    onUpdateAnimal(selectedAnimal.id, internalNumberData);

    setSelectedAnimal(null);
    setNewInternalNumber('');
    setReason('');
    setNotes('');
    
    alert(`Internal number ${newInternalNumber} assigned to ${selectedAnimal.name}`);
  };

  const filteredAnimals = animals.filter(animal =>
    !searchTerm ||
    animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.animalID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <Hash className="h-6 w-6 mr-2" />
                Internal Number Management
              </h2>
              <p className="text-indigo-100">Track and manage internal animal identification numbers</p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-white hover:bg-indigo-700"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'assign', label: 'Assign Numbers', icon: Plus },
              { id: 'history', label: 'Number History', icon: History },
              { id: 'manage', label: 'Manage Active', icon: Check }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
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

        <div className="overflow-y-auto max-h-[60vh] p-6">
          {/* Assign Numbers Tab */}
          {activeTab === 'assign' && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-700 mb-2">Internal Number Assignment</h3>
                <p className="text-xs text-blue-600">
                  Assign unique internal tracking numbers to animals for enhanced identification and workflow management.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Animal Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Select Animal</h3>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search animals..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="border rounded-lg max-h-64 overflow-y-auto">
                    {filteredAnimals.map((animal) => (
                      <div
                        key={animal.id}
                        onClick={() => setSelectedAnimal(animal)}
                        className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                          selectedAnimal?.id === animal.id ? 'bg-indigo-50 border-indigo-200' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">{animal.name}</div>
                            <div className="text-sm text-gray-500">{animal.animalID} • {animal.species}</div>
                          </div>
                          <div className="text-xs">
                            {animal.currentInternalNumber ? (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                {animal.currentInternalNumber.internalNumber}
                              </span>
                            ) : (
                              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                No Number
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assignment Form */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Assignment Details</h3>
                  
                  {selectedAnimal && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-gray-900">{selectedAnimal.name}</h4>
                      <p className="text-sm text-gray-600">{selectedAnimal.animalID}</p>
                      {selectedAnimal.currentInternalNumber && (
                        <div className="mt-2">
                          <span className="inline-flex items-center text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Already has: {selectedAnimal.currentInternalNumber.internalNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Internal Number
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newInternalNumber}
                        onChange={(e) => setNewInternalNumber(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g., INT-2025-0001"
                      />
                      <Button
                        onClick={generateInternalNumber}
                        disabled={isGeneratingNumber}
                        variant="outline"
                      >
                        {isGeneratingNumber ? 'Generating...' : 'Generate'}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned By
                    </label>
                    <input
                      type="text"
                      value={assignedBy}
                      onChange={(e) => setAssignedBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g., Dr. Sarah Ahmed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason
                    </label>
                    <select
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Select reason</option>
                      <option value="New animal registration">New animal registration</option>
                      <option value="Transfer from partner facility">Transfer from partner facility</option>
                      <option value="Research program enrollment">Research program enrollment</option>
                      <option value="Breeding program assignment">Breeding program assignment</option>
                      <option value="Manual assignment">Manual assignment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Additional notes about this assignment..."
                    />
                  </div>

                  <Button
                    onClick={assignInternalNumber}
                    disabled={!selectedAnimal || !newInternalNumber.trim()}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <Hash className="h-4 w-4 mr-2" />
                    Assign Internal Number
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="text-center">
                <History className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Internal Number History</h3>
                <p className="text-gray-600">View all assigned internal numbers and their history</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {internalNumberHistory.map((record) => (
                  <div key={record.id} className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-mono text-lg font-medium text-indigo-600">
                        {record.internalNumber}
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {record.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">{record.animal.name}</div>
                      <div className="text-xs text-gray-500">{record.animal.animalID}</div>
                      <div className="text-xs text-gray-500">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        Assigned: {record.assignedDate}
                      </div>
                      <div className="text-xs text-gray-500">
                        <User className="h-3 w-3 inline mr-1" />
                        By: {record.assignedBy}
                      </div>
                      <div className="text-xs text-gray-500">{record.reason}</div>
                      {record.notes && (
                        <div className="text-xs text-gray-400 italic">{record.notes}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Manage Active Tab */}
          {activeTab === 'manage' && (
            <div className="space-y-6">
              <div className="text-center">
                <Check className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Manage Active Numbers</h3>
                <p className="text-gray-600">View and manage currently active internal numbers</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {internalNumberHistory.filter(r => r.isActive).length}
                  </p>
                  <p className="text-sm text-gray-600">Active Numbers</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-600">
                    {internalNumberHistory.filter(r => !r.isActive).length}
                  </p>
                  <p className="text-sm text-gray-600">Inactive Numbers</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {animals.filter(a => !a.currentInternalNumber).length}
                  </p>
                  <p className="text-sm text-gray-600">Animals Without Numbers</p>
                </div>
              </div>

              <div className="space-y-4">
                {internalNumberHistory.filter(r => r.isActive).map((record) => (
                  <div key={record.id} className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="font-mono text-lg font-medium text-indigo-600">
                            {record.internalNumber}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{record.animal.name}</div>
                            <div className="text-sm text-gray-500">{record.animal.animalID}</div>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          Assigned by {record.assignedBy} on {record.assignedDate}
                          {record.reason && ` • ${record.reason}`}
                        </div>
                        {record.notes && (
                          <div className="mt-1 text-xs text-gray-500">{record.notes}</div>
                        )}
                      </div>
                      <Button
                        onClick={() => {
                          if (window.confirm('Deactivate this internal number?')) {
                            setInternalNumberHistory(prev =>
                              prev.map(r =>
                                r.id === record.id
                                  ? { ...r, isActive: false, endDate: new Date().toISOString().split('T')[0] }
                                  : r
                              )
                            );
                            alert('Internal number deactivated');
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-900 border-red-200"
                      >
                        Deactivate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Internal number management helps track animals across different workflows and modules
          </div>
          <Button onClick={onClose} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
