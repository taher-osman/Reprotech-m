import React, { useState, useEffect } from 'react';
import api from './services/api';

interface SortingFormProps {
  onClose: () => void;
  onSubmit: () => void;
}

interface CASAAnalysis {
  id: string;
  semenCollection: {
    semenBatchId: string;
    animal: {
      animalID: string;
      name: string;
      species: string;
    };
  };
  totalMotility?: number;
  spermConcentration?: number;
  readyForSorting: boolean;
}

interface Equipment {
  id: string;
  equipmentName: string;
  equipmentType: string;
  manufacturer?: string;
  model?: string;
  status: string;
  defaultParameters?: any;
}

interface MachinePreset {
  id: string;
  presetName: string;
  species?: string;
  parameters: any;
  isValidated: boolean;
}

const SortingForm: React.FC<SortingFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    casaAnalysisId: '',
    sortingDate: new Date().toISOString().split('T')[0],
    sortingTime: new Date().toTimeString().slice(0, 5),
    sortingTechnicianId: '',
    equipmentId: '',
    sortingMethod: 'FLOW_CYTOMETER',
    targetSex: 'X_CHROMOSOME',
    
    // Flow Cytometry Machine Parameters
    fcDropDelay: 22.5,
    fcSortPressure: 25.0,
    fcSheathFluidRate: 2000.0,
    fcCoreFluidRate: 150.0,
    fcLaserPower: 200.0,
    fcTemperature: 25.0,
    fcFlowRate: 30000.0,
    fcBreakoffFrequency: 80000.0,
    fcStreamStability: 98.5,
    
    // Expected Results
    sortedVolume: '',
    expectedPurity: 90.0,
    notes: ''
  });

  const [casaAnalyses, setCasaAnalyses] = useState<CASAAnalysis[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [presets, setPresets] = useState<MachinePreset[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('');

  // Fetch data for form dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for now
        const mockCasaAnalyses = [
          {
            id: '1',
            semenCollection: {
              semenBatchId: 'SB-2024-001',
              animal: {
                animalID: 'BL-001',
                name: 'Thunder',
                species: 'Bovine'
              }
            },
            totalMotility: 85.5,
            spermConcentration: 1200.5,
            readyForSorting: true
          }
        ];

        const mockEquipment = [
          {
            id: '1',
            equipmentName: 'FlowCytometer-A1',
            equipmentType: 'FLOW_CYTOMETER',
            manufacturer: 'Beckman Coulter',
            model: 'MoFlo XDP',
            status: 'OPERATIONAL',
            defaultParameters: {
              fcDropDelay: 22.5,
              fcSortPressure: 25.0,
              fcLaserPower: 200.0
            }
          }
        ];

        const mockUsers = [
          { id: '1', firstName: 'Dr. Sarah', lastName: 'Johnson', role: 'LAB_TECH' },
          { id: '2', firstName: 'Mike', lastName: 'Wilson', role: 'VET' }
        ];

        setCasaAnalyses(mockCasaAnalyses);
        setEquipment(mockEquipment);
        setUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };

    fetchData();
  }, []);

  // Fetch presets when equipment changes
  useEffect(() => {
    if (formData.equipmentId) {
      const selectedEquipment = equipment.find(eq => eq.id === formData.equipmentId);
      if (selectedEquipment) {
        // Load default parameters from equipment
        if (selectedEquipment.defaultParameters) {
          setFormData(prev => ({
            ...prev,
            ...selectedEquipment.defaultParameters
          }));
        }
      }
    }
  }, [formData.equipmentId, equipment]);

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
    const preset = presets.find(p => p.id === presetId);
    if (preset && preset.parameters) {
      setFormData(prev => ({
        ...prev,
        ...preset.parameters
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock submission - replace with actual API call
      console.log('Creating sorting job with data:', formData);
      console.log('Drop Delay parameter:', formData.fcDropDelay, 'μs');
      
      onSubmit();
      onClose();
    } catch (error) {
      console.error('Error creating sorting job:', error);
      alert('Error creating sorting job. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">🎯 New Sorting Job</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source CASA Analysis *
              </label>
              <select
                value={formData.casaAnalysisId}
                onChange={(e) => setFormData(prev => ({ ...prev, casaAnalysisId: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select CASA Analysis</option>
                {casaAnalyses.map(analysis => (
                  <option key={analysis.id} value={analysis.id}>
                    {analysis.semenCollection.semenBatchId} - {analysis.semenCollection.animal.name}
                    {analysis.totalMotility && ` (${analysis.totalMotility}% motility)`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sorting Technician *
              </label>
              <select
                value={formData.sortingTechnicianId}
                onChange={(e) => setFormData(prev => ({ ...prev, sortingTechnicianId: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select Technician</option>
                {users.filter(user => ['LAB_TECH', 'ADMIN', 'VET'].includes(user.role)).map(user => (
                  <option key={user.id} value={user.id}>
                    {user.firstName} {user.lastName} ({user.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sorting Date *
              </label>
              <input
                type="date"
                value={formData.sortingDate}
                onChange={(e) => setFormData(prev => ({ ...prev, sortingDate: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sorting Time *
              </label>
              <input
                type="time"
                value={formData.sortingTime}
                onChange={(e) => setFormData(prev => ({ ...prev, sortingTime: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          {/* Equipment Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flow Cytometer Equipment *
              </label>
              <select
                value={formData.equipmentId}
                onChange={(e) => setFormData(prev => ({ ...prev, equipmentId: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select Equipment</option>
                {equipment.map(eq => (
                  <option key={eq.id} value={eq.id}>
                    {eq.equipmentName} ({eq.manufacturer} {eq.model})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parameter Preset
              </label>
              <select
                value={selectedPreset}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Preset (Optional)</option>
                {presets.map(preset => (
                  <option key={preset.id} value={preset.id}>
                    {preset.presetName} {preset.species ? `(${preset.species})` : ''} 
                    {preset.isValidated && ' ✓'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sorting Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sorting Method
              </label>
              <select
                value={formData.sortingMethod}
                onChange={(e) => setFormData(prev => ({ ...prev, sortingMethod: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="FLOW_CYTOMETER">Flow Cytometer</option>
                <option value="MICROFLUIDICS">Microfluidics</option>
                <option value="MAGNETIC_SEPARATION">Magnetic Separation</option>
                <option value="DENSITY_GRADIENT">Density Gradient</option>
                <option value="MANUAL">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Sex
              </label>
              <select
                value={formData.targetSex}
                onChange={(e) => setFormData(prev => ({ ...prev, targetSex: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="X_CHROMOSOME">♀ Female (X-Chromosome)</option>
                <option value="Y_CHROMOSOME">♂ Male (Y-Chromosome)</option>
                <option value="MIXED">Mixed</option>
              </select>
            </div>
          </div>

          {/* Flow Cytometry Machine Parameters */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">🎛️ Flow Cytometry Parameters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Drop Delay (μs) ⭐
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.fcDropDelay}
                  onChange={(e) => setFormData(prev => ({ ...prev, fcDropDelay: parseFloat(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Critical timing parameter</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort Pressure (PSI)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.fcSortPressure}
                  onChange={(e) => setFormData(prev => ({ ...prev, fcSortPressure: parseFloat(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Laser Power (mW)
                </label>
                <input
                  type="number"
                  step="1"
                  value={formData.fcLaserPower}
                  onChange={(e) => setFormData(prev => ({ ...prev, fcLaserPower: parseFloat(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sheath Fluid Rate (μL/min)
                </label>
                <input
                  type="number"
                  step="1"
                  value={formData.fcSheathFluidRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, fcSheathFluidRate: parseFloat(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Core Fluid Rate (μL/min)
                </label>
                <input
                  type="number"
                  step="1"
                  value={formData.fcCoreFluidRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, fcCoreFluidRate: parseFloat(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.fcTemperature}
                  onChange={(e) => setFormData(prev => ({ ...prev, fcTemperature: parseFloat(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Flow Rate (events/sec)
                </label>
                <input
                  type="number"
                  step="1"
                  value={formData.fcFlowRate}
                  onChange={(e) => setFormData(prev => ({ ...prev, fcFlowRate: parseFloat(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Breakoff Frequency (Hz)
                </label>
                <input
                  type="number"
                  step="1"
                  value={formData.fcBreakoffFrequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, fcBreakoffFrequency: parseFloat(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stream Stability (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.fcStreamStability}
                  onChange={(e) => setFormData(prev => ({ ...prev, fcStreamStability: parseFloat(e.target.value) }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Expected Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Volume (mL)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.sortedVolume}
                onChange={(e) => setFormData(prev => ({ ...prev, sortedVolume: e.target.value }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Purity (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.expectedPurity}
                onChange={(e) => setFormData(prev => ({ ...prev, expectedPurity: parseFloat(e.target.value) }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Additional notes about the sorting procedure..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Start Sorting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SortingForm; 