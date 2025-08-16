import React, { useState, useEffect } from 'react';
import api from './services/api';
import SortingForm from './SortingForm';

interface SemenSorting {
  id: string;
  sortingDate: string;
  sortingMethod: string;
  targetSex?: string;
  sortedVolume?: number;
  postSortMotility?: number;
  recoveryRate?: number;
  purity?: number;
  sortingStatus: string;
  sortedBatchCode: string;
  casaAnalysis: {
    semenCollection: {
      semenBatchId: string;
      animal: {
        animalID: string;
        name: string;
        species: string;
      };
    };
  };
  sortingTechnician: {
    firstName: string;
    lastName: string;
  };
}

const SemenSortingPage: React.FC = () => {
  const [sortingRecords, setSortingRecords] = useState<SemenSorting[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const fetchSortingRecords = async () => {
    try {
      setLoading(true);
      // Mock data for now
      const mockSortingRecords = [
        {
          id: '1',
          sortingDate: '2024-06-30',
          sortingMethod: 'FLOW_CYTOMETER',
          targetSex: 'X_CHROMOSOME',
          sortedVolume: 1.5,
          postSortMotility: 78.2,
          recoveryRate: 65.5,
          purity: 91.8,
          sortingStatus: 'COMPLETED',
          sortedBatchCode: 'SRT-2024-001',
          casaAnalysis: {
            semenCollection: {
              semenBatchId: 'SB-2024-001',
              animal: {
                animalID: 'BL-001',
                name: 'Thunder',
                species: 'Bovine'
              }
            }
          },
          sortingTechnician: {
            firstName: 'Dr. Sarah',
            lastName: 'Johnson'
          }
        }
      ];
      setSortingRecords(mockSortingRecords);
    } catch (error) {
      console.error('Error fetching sorting records:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'FLOW_CYTOMETER': return '🎯';
      case 'MICROFLUIDICS': return '💧';
      case 'MANUAL': return '✋';
      default: return '🔬';
    }
  };

  useEffect(() => {
    fetchSortingRecords();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🎯 Semen Sorting</h2>
          <p className="text-gray-600 mt-1">Flow cytometry sorting and quality control</p>
        </div>
        <button
          onClick={() => {
            console.log('🎯 Sorting button clicked!');
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          New Sorting Job
        </button>
      </div>

      {/* Sorting Records Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sorting records...</p>
          </div>
        ) : sortingRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Results</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortingRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.sortedBatchCode}</div>
                      <div className="text-sm text-gray-500">{new Date(record.sortingDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.casaAnalysis.semenCollection.animal.name}</div>
                      <div className="text-sm text-gray-500">{record.casaAnalysis.semenCollection.semenBatchId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getMethodIcon(record.sortingMethod)} {record.sortingMethod.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {record.targetSex === 'X_CHROMOSOME' ? '♀ Female (X)' : 
                         record.targetSex === 'Y_CHROMOSOME' ? '♂ Male (Y)' : '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm space-y-1">
                        {record.sortedVolume && <div>Volume: {record.sortedVolume} mL</div>}
                        {record.postSortMotility && <div>Motility: {record.postSortMotility}%</div>}
                        {record.purity && <div>Purity: {record.purity}%</div>}
                        {record.recoveryRate && <div>Recovery: {record.recoveryRate}%</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.sortingStatus)}`}>
                        {record.sortingStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-green-600 hover:text-green-900 mr-2">Edit</button>
                      <button className="text-blue-600 hover:text-blue-900">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sorting records found</h3>
            <p className="text-gray-600 mb-4">Start by sorting your first semen sample</p>
            <button
              onClick={() => {
                console.log('🎯 Create First Sorting button clicked!');
                setShowForm(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Create First Sorting Job
            </button>
          </div>
        )}
      </div>

      {/* Flow Cytometry Information Card */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Flow Cytometry Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">♀♂</div>
            <div className="font-medium text-gray-900">Sex Sorting</div>
            <div className="text-sm text-gray-600">X/Y chromosome separation</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium text-gray-900">Purity Analysis</div>
            <div className="text-sm text-gray-600">Quality control verification</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-medium text-gray-900">High Throughput</div>
            <div className="text-sm text-gray-600">Automated processing</div>
          </div>
        </div>
      </div>

      {/* Drop Delay Information Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">⚡ Drop Delay Parameter</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="font-medium text-gray-900 mb-2">Critical Timing Parameter</div>
            <div className="text-sm text-gray-600">
              The Drop Delay parameter (22.5μs) controls the precise timing between 
              cell detection and droplet charging, ensuring accurate sorting of 
              X and Y chromosome-bearing sperm cells.
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900 mb-2">Professional Control</div>
            <div className="text-sm text-gray-600">
              Advanced flow cytometry settings with full parameter control 
              including pressure, flow rates, laser power, and temperature 
              for optimal sorting performance.
            </div>
          </div>
        </div>
      </div>

      {/* Sorting Form Modal */}
      {showForm && (
        <div>
          {/* Debug: Rendering SortingForm modal */}
          <SortingForm
            onClose={() => {
              console.log('🎯 Closing form');
              setShowForm(false);
            }}
            onSubmit={() => {
              console.log('🎯 Submitting form');
              fetchSortingRecords();
              setShowForm(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SemenSortingPage; 