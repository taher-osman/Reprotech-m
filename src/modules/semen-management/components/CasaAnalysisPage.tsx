import React, { useState, useEffect } from 'react';
import api from './services/api';

interface CasaAnalysis {
  id: string;
  analysisDate: string;
  analysisTime: string;
  // Macroscopic Analysis
  volume?: number;
  color?: string;
  ph?: number;
  viscosity?: string;
  clotting?: boolean;
  macroscopicComments?: string;
  // Microscopic Analysis
  totalMotility?: number;
  progressiveMotility?: number;
  vap?: number; // Average Path Velocity
  vsl?: number; // Straight Line Velocity  
  vcl?: number; // Curvilinear Velocity
  str?: number; // Straightness
  lin?: number; // Linearity
  alh?: number; // Amplitude of Lateral Head displacement
  morphologyPercent?: number;
  vitalityPercent?: number;
  spermConcentration?: number;
  microscopicComments?: string;
  // File Attachments
  casaReportUrl?: string;
  videoUrl?: string;
  imageUrls?: string;
  // Status Flags
  readyForSorting: boolean;
  readyForFreezing: boolean;
  sortingRequested: boolean;
  freezingRequested: boolean;
  semenCollection: {
    semenBatchId: string;
    animal: {
      animalID: string;
      name: string;
      species: string;
    };
  };
  analyst: {
    firstName: string;
    lastName: string;
  };
}

interface FormData {
  semenCollectionId: string;
  analysisDate: string;
  analysisTime: string;
  analystId: string;
  // Macroscopic
  volume: string;
  color: string;
  ph: string;
  viscosity: string;
  clotting: boolean;
  macroscopicComments: string;
  // Microscopic
  totalMotility: string;
  progressiveMotility: string;
  vap: string;
  vsl: string;
  vcl: string;
  str: string;
  lin: string;
  alh: string;
  morphologyPercent: string;
  vitalityPercent: string;
  spermConcentration: string;
  microscopicComments: string;
  // Status flags
  readyForSorting: boolean;
  readyForFreezing: boolean;
  sortingRequested: boolean;
  freezingRequested: boolean;
}

const CasaAnalysisPage: React.FC = () => {
  const [analyses, setAnalyses] = useState<CasaAnalysis[]>([]);
  const [collections, setCollections] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAnalysis, setEditingAnalysis] = useState<CasaAnalysis | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    semenCollectionId: '',
    analysisDate: new Date().toISOString().split('T')[0],
    analysisTime: new Date().toTimeString().slice(0, 5),
    analystId: '',
    // Macroscopic
    volume: '',
    color: '',
    ph: '',
    viscosity: '',
    clotting: false,
    macroscopicComments: '',
    // Microscopic
    totalMotility: '',
    progressiveMotility: '',
    vap: '',
    vsl: '',
    vcl: '',
    str: '',
    lin: '',
    alh: '',
    morphologyPercent: '',
    vitalityPercent: '',
    spermConcentration: '',
    microscopicComments: '',
    // Status flags
    readyForSorting: false,
    readyForFreezing: false,
    sortingRequested: false,
    freezingRequested: false
  });

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      // Mock data for now
      const mockAnalyses = [
        {
          id: '1',
          analysisDate: '2024-06-30',
          analysisTime: '11:00',
          volume: 3.5,
          color: 'WHITE',
          ph: 7.2,
          viscosity: 'NORMAL',
          clotting: false,
          totalMotility: 85.5,
          progressiveMotility: 75.2,
          spermConcentration: 1200.5,
          readyForSorting: true,
          readyForFreezing: false,
          sortingRequested: false,
          freezingRequested: false,
          semenCollection: {
            semenBatchId: 'SB-2024-001',
            animal: {
              animalID: 'BL-001',
              name: 'Thunder',
              species: 'Bovine'
            }
          },
          analyst: {
            firstName: 'Dr. Sarah',
            lastName: 'Johnson'
          }
        }
      ];
      setAnalyses(mockAnalyses);
    } catch (error) {
      console.error('Error fetching CASA analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      // Mock data for now
      const mockCollections = [
        {
          id: '1',
          semenBatchId: 'SB-2024-001',
          animal: { animalID: 'BL-001', name: 'Thunder' }
        }
      ];
      setCollections(mockCollections);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      // Mock data for now
      const mockUsers = [
        { id: '1', firstName: 'Dr. Sarah', lastName: 'Johnson', role: 'VET' },
        { id: '2', firstName: 'Mike', lastName: 'Wilson', role: 'LAB_TECH' }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCreateAnalysis = () => {
    setEditingAnalysis(null);
    setFormData({
      semenCollectionId: '',
      analysisDate: new Date().toISOString().split('T')[0],
      analysisTime: new Date().toTimeString().slice(0, 5),
      analystId: '',
      volume: '', color: '', ph: '', viscosity: '', clotting: false, macroscopicComments: '',
      totalMotility: '', progressiveMotility: '', vap: '', vsl: '', vcl: '', str: '', lin: '', alh: '',
      morphologyPercent: '', vitalityPercent: '', spermConcentration: '', microscopicComments: '',
      readyForSorting: false, readyForFreezing: false,
      sortingRequested: false, freezingRequested: false
    });
    setShowForm(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Mock submission - replace with actual API call
      console.log('Submitting CASA analysis:', formData);
      setShowForm(false);
      fetchAnalyses();
    } catch (error) {
      console.error('Error saving analysis:', error);
      alert('Error saving analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
    fetchCollections();
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🔬 CASA Analysis</h2>
          <p className="text-gray-600 mt-1">Comprehensive semen analysis and quality assessment</p>
        </div>
        <button
          onClick={handleCreateAnalysis}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          New Analysis
        </button>
      </div>

      {/* Analysis Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analyses...</p>
          </div>
        ) : analyses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Animal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Volume</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motility</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concentration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {analyses.map((analysis) => (
                  <tr key={analysis.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{analysis.semenCollection.semenBatchId}</div>
                      <div className="text-sm text-gray-500">{new Date(analysis.analysisDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{analysis.semenCollection.animal.name}</div>
                      <div className="text-sm text-gray-500">{analysis.semenCollection.animal.animalID}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {analysis.volume ? `${analysis.volume} mL` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Total: {analysis.totalMotility || '-'}%</div>
                      <div className="text-sm text-gray-500">Progressive: {analysis.progressiveMotility || '-'}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {analysis.spermConcentration ? `${analysis.spermConcentration} mill/mL` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1 text-xs">
                        {analysis.readyForSorting && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">⚡ Ready Sorting</span>}
                        {analysis.readyForFreezing && <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded">❄️ Ready Freezing</span>}
                        {!analysis.readyForSorting && !analysis.readyForFreezing && (
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">📋 Analysis Complete</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-purple-600 hover:text-purple-900 mr-2">Edit</button>
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No CASA analyses found</h3>
            <p className="text-gray-600 mb-4">Start by analyzing your first semen sample</p>
            <button
              onClick={handleCreateAnalysis}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Create First Analysis
            </button>
          </div>
        )}
      </div>

      {/* Comprehensive CASA Analysis Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingAnalysis ? 'Edit CASA Analysis' : 'New CASA Analysis'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">📋 Basic Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Semen Collection *
                      </label>
                      <select
                        value={formData.semenCollectionId}
                        onChange={(e) => setFormData(prev => ({ ...prev, semenCollectionId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                      >
                        <option value="">Select Collection</option>
                        {collections.map((collection: any) => (
                          <option key={collection.id} value={collection.id}>
                            {collection.semenBatchId} - {collection.animal.name} ({collection.animal.animalID})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Analyst *
                      </label>
                      <select
                        value={formData.analystId}
                        onChange={(e) => setFormData(prev => ({ ...prev, analystId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                      >
                        <option value="">Select Analyst</option>
                        {users.map((user: any) => (
                          <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName} ({user.role})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Analysis Date *
                      </label>
                      <input
                        type="date"
                        value={formData.analysisDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, analysisDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Analysis Time *
                      </label>
                      <input
                        type="time"
                        value={formData.analysisTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, analysisTime: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Macroscopic Analysis */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">🔍 Macroscopic Analysis</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Volume (mL)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.volume}
                        onChange={(e) => setFormData(prev => ({ ...prev, volume: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., 3.5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color
                      </label>
                      <select
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">Select Color</option>
                        <option value="WHITE">⚪ White</option>
                        <option value="CREAM">🟡 Cream</option>
                        <option value="YELLOW">🟨 Yellow</option>
                        <option value="RED">🔴 Red</option>
                        <option value="CLEAR">💧 Clear</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        pH
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="6"
                        max="8"
                        value={formData.ph}
                        onChange={(e) => setFormData(prev => ({ ...prev, ph: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., 7.2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Viscosity
                      </label>
                      <select
                        value={formData.viscosity}
                        onChange={(e) => setFormData(prev => ({ ...prev, viscosity: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="">Select Viscosity</option>
                        <option value="NORMAL">✅ Normal</option>
                        <option value="THICK">🟫 Thick</option>
                        <option value="THIN">💧 Thin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Clotting
                      </label>
                      <div className="flex items-center space-x-4 mt-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="clotting"
                            checked={formData.clotting === true}
                            onChange={() => setFormData(prev => ({ ...prev, clotting: true }))}
                            className="mr-2"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="clotting"
                            checked={formData.clotting === false}
                            onChange={() => setFormData(prev => ({ ...prev, clotting: false }))}
                            className="mr-2"
                          />
                          No
                        </label>
                      </div>
                    </div>

                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Macroscopic Comments
                      </label>
                      <textarea
                        value={formData.macroscopicComments}
                        onChange={(e) => setFormData(prev => ({ ...prev, macroscopicComments: e.target.value }))}
                        placeholder="Additional macroscopic observations..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Microscopic Analysis */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">🔬 Microscopic Analysis</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Motility (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={formData.totalMotility}
                        onChange={(e) => setFormData(prev => ({ ...prev, totalMotility: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., 85.5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Progressive Motility (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={formData.progressiveMotility}
                        onChange={(e) => setFormData(prev => ({ ...prev, progressiveMotility: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., 75.2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Morphology (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={formData.morphologyPercent}
                        onChange={(e) => setFormData(prev => ({ ...prev, morphologyPercent: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., 92.0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Concentration (mill/mL)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.spermConcentration}
                        onChange={(e) => setFormData(prev => ({ ...prev, spermConcentration: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., 1200.5"
                      />
                    </div>

                    <div className="col-span-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Microscopic Comments
                      </label>
                      <textarea
                        value={formData.microscopicComments}
                        onChange={(e) => setFormData(prev => ({ ...prev, microscopicComments: e.target.value }))}
                        placeholder="Additional microscopic observations..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                {/* Status Flags */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">⚡ Workflow Status</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.readyForSorting}
                          onChange={(e) => setFormData(prev => ({ ...prev, readyForSorting: e.target.checked }))}
                          className="mr-3 h-4 w-4 text-purple-600"
                        />
                        <span className="text-sm font-medium text-gray-700">Ready for Sorting</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.readyForFreezing}
                          onChange={(e) => setFormData(prev => ({ ...prev, readyForFreezing: e.target.checked }))}
                          className="mr-3 h-4 w-4 text-purple-600"
                        />
                        <span className="text-sm font-medium text-gray-700">Ready for Freezing</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.sortingRequested}
                          onChange={(e) => setFormData(prev => ({ ...prev, sortingRequested: e.target.checked }))}
                          className="mr-3 h-4 w-4 text-purple-600"
                        />
                        <span className="text-sm font-medium text-gray-700">Sorting Requested</span>
                      </label>

                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.freezingRequested}
                          onChange={(e) => setFormData(prev => ({ ...prev, freezingRequested: e.target.checked }))}
                          className="mr-3 h-4 w-4 text-purple-600"
                        />
                        <span className="text-sm font-medium text-gray-700">Freezing Requested</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : editingAnalysis ? 'Update Analysis' : 'Create Analysis'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasaAnalysisPage; 