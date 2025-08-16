import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, TestTube, FileText, AlertCircle, CheckCircle, XCircle, Plus, Search, Filter, Download, Upload } from 'lucide-react';

const SimpleLaboratoryPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [samples, setSamples] = useState([]);
  const [tests, setTests] = useState([]);
  const [equipment, setEquipment] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    setSamples([
      { id: 'LAB-2025-001', animalId: 'A001', type: 'Blood', status: 'Processing', priority: 'High', submittedBy: 'Dr. Smith', date: '2025-08-16', estimatedCompletion: '2025-08-17' },
      { id: 'LAB-2025-002', animalId: 'A002', type: 'Urine', status: 'Completed', priority: 'Normal', submittedBy: 'Dr. Johnson', date: '2025-08-15', estimatedCompletion: '2025-08-16' },
      { id: 'LAB-2025-003', animalId: 'A003', type: 'Tissue', status: 'Pending', priority: 'Urgent', submittedBy: 'Dr. Wilson', date: '2025-08-16', estimatedCompletion: '2025-08-18' },
      { id: 'LAB-2025-004', animalId: 'A004', type: 'Serum', status: 'In Progress', priority: 'Normal', submittedBy: 'Dr. Brown', date: '2025-08-16', estimatedCompletion: '2025-08-17' }
    ]);

    setTests([
      { id: 'TEST-001', name: 'Complete Blood Count', samples: 12, avgTime: '2-4 hours', equipment: 'Hematology Analyzer' },
      { id: 'TEST-002', name: 'Biochemistry Panel', samples: 8, avgTime: '1-2 hours', equipment: 'Chemistry Analyzer' },
      { id: 'TEST-003', name: 'Hormone Analysis', samples: 5, avgTime: '4-6 hours', equipment: 'ELISA Reader' },
      { id: 'TEST-004', name: 'Microbiology Culture', samples: 3, avgTime: '24-48 hours', equipment: 'Incubator' }
    ]);

    setEquipment([
      { id: 'EQ-001', name: 'Hematology Analyzer', status: 'Online', utilization: '78%', nextMaintenance: '2025-08-20' },
      { id: 'EQ-002', name: 'Chemistry Analyzer', status: 'Online', utilization: '65%', nextMaintenance: '2025-08-22' },
      { id: 'EQ-003', name: 'ELISA Reader', status: 'Maintenance', utilization: '0%', nextMaintenance: '2025-08-16' },
      { id: 'EQ-004', name: 'Microscope Station', status: 'Online', utilization: '45%', nextMaintenance: '2025-08-25' }
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Processing': case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Urgent': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Normal': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEquipmentStatusColor = (status) => {
    switch (status) {
      case 'Online': return 'text-green-600 bg-green-100';
      case 'Maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'Offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-6 text-white mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Laboratory Management</h1>
            <p className="text-blue-100 mb-4">Comprehensive sample processing, testing, and quality control</p>
            <div className="flex gap-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">ISO 15189 Certified</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">CLIA Compliant</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Quality Assured</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">Aug 16, 02:44 PM</div>
            <div className="text-blue-200">System Status: Operational</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: TestTube },
          { id: 'samples', label: 'Sample Management', icon: FileText },
          { id: 'tests', label: 'Test Catalog', icon: CheckCircle },
          { id: 'equipment', label: 'Equipment Status', icon: Users }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Active Samples</p>
                  <p className="text-3xl font-bold text-blue-900">24</p>
                  <p className="text-blue-600 text-sm">In processing queue</p>
                </div>
                <TestTube className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Completed Today</p>
                  <p className="text-3xl font-bold text-green-900">18</p>
                  <p className="text-green-600 text-sm">Results available</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Pending Tests</p>
                  <p className="text-3xl font-bold text-yellow-900">7</p>
                  <p className="text-yellow-600 text-sm">Awaiting processing</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Turnaround Time</p>
                  <p className="text-3xl font-bold text-purple-900">2.4h</p>
                  <p className="text-purple-600 text-sm">Average completion</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Laboratory Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">New Sample</div>
                  <div className="text-sm text-gray-600">Register new sample</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-400 transition-colors">
                <div className="bg-green-100 p-2 rounded-lg">
                  <TestTube className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Run Test</div>
                  <div className="text-sm text-gray-600">Start test procedure</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition-colors">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">View Results</div>
                  <div className="text-sm text-gray-600">Check test results</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 transition-colors">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Download className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Generate Report</div>
                  <div className="text-sm text-gray-600">Export lab reports</div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Recent Laboratory Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Blood test completed for Animal A002</div>
                  <div className="text-sm text-gray-600">Dr. Johnson • Aug 16, 02:30 PM • Results available</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <TestTube className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">New tissue sample registered</div>
                  <div className="text-sm text-gray-600">Dr. Wilson • Aug 16, 02:15 PM • Priority: Urgent</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Equipment maintenance scheduled</div>
                  <div className="text-sm text-gray-600">System • Aug 16, 02:00 PM • ELISA Reader maintenance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sample Management Tab */}
      {activeTab === 'samples' && (
        <div className="space-y-6">
          {/* Sample Controls */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search samples..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>All Status</option>
                <option>Pending</option>
                <option>Processing</option>
                <option>Completed</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>All Types</option>
                <option>Blood</option>
                <option>Urine</option>
                <option>Tissue</option>
                <option>Serum</option>
              </select>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Sample
            </button>
          </div>

          {/* Samples Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sample ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Completion</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {samples.map((sample) => (
                  <tr key={sample.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sample.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sample.animalId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sample.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sample.status)}`}>
                        {sample.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(sample.priority)}`}>
                        {sample.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sample.submittedBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sample.estimatedCompletion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                      <button className="text-green-600 hover:text-green-900">Process</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Test Catalog Tab */}
      {activeTab === 'tests' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <div key={test.id} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{test.name}</h3>
                  <TestTube className="w-6 h-6 text-blue-600" />
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Active Samples:</span>
                    <span className="font-medium">{test.samples}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Time:</span>
                    <span className="font-medium">{test.avgTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Equipment:</span>
                    <span className="font-medium">{test.equipment}</span>
                  </div>
                </div>
                <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  Run Test
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Equipment Status Tab */}
      {activeTab === 'equipment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {equipment.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getEquipmentStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Utilization:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: item.utilization }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{item.utilization}</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Maintenance:</span>
                    <span className="font-medium">{item.nextMaintenance}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200">
                    Schedule
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleLaboratoryPage;

