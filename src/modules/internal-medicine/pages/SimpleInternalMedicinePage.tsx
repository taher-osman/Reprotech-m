import React, { useState, useEffect } from 'react';
import { Heart, Stethoscope, Pill, FileText, Calendar, AlertTriangle, CheckCircle, Clock, Plus, Search, Filter, Download, Activity, TrendingUp, Users, Clipboard } from 'lucide-react';

const SimpleInternalMedicinePage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cases, setCases] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [medications, setMedications] = useState([]);
  const [protocols, setProtocols] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    setCases([
      { id: 'MED-2025-001', animalId: 'A001', animalName: 'Bella', condition: 'Respiratory Infection', status: 'Active Treatment', priority: 'High', veterinarian: 'Dr. Smith', startDate: '2025-08-14', nextVisit: '2025-08-17' },
      { id: 'MED-2025-002', animalId: 'A002', animalName: 'Thunder', condition: 'Digestive Issues', status: 'Monitoring', priority: 'Normal', veterinarian: 'Dr. Johnson', startDate: '2025-08-12', nextVisit: '2025-08-19' },
      { id: 'MED-2025-003', animalId: 'A003', animalName: 'Princess', condition: 'Joint Pain', status: 'Recovery', priority: 'Normal', veterinarian: 'Dr. Wilson', startDate: '2025-08-10', nextVisit: '2025-08-20' },
      { id: 'MED-2025-004', animalId: 'A004', animalName: 'Champion', condition: 'Cardiac Monitoring', status: 'Critical', priority: 'Urgent', veterinarian: 'Dr. Brown', startDate: '2025-08-15', nextVisit: '2025-08-16' }
    ]);

    setTreatments([
      { id: 'TRT-001', name: 'Antibiotic Therapy', duration: '7-10 days', frequency: 'Twice daily', cases: 8 },
      { id: 'TRT-002', name: 'Pain Management', duration: '5-14 days', frequency: 'As needed', cases: 12 },
      { id: 'TRT-003', name: 'Fluid Therapy', duration: '1-3 days', frequency: 'Continuous', cases: 5 },
      { id: 'TRT-004', name: 'Nutritional Support', duration: '2-4 weeks', frequency: 'Daily', cases: 15 }
    ]);

    setMedications([
      { id: 'MED-001', name: 'Amoxicillin', type: 'Antibiotic', stock: 45, unit: 'vials', expiry: '2025-12-15', status: 'In Stock' },
      { id: 'MED-002', name: 'Meloxicam', type: 'Anti-inflammatory', stock: 8, unit: 'bottles', expiry: '2025-10-20', status: 'Low Stock' },
      { id: 'MED-003', name: 'Dexamethasone', type: 'Corticosteroid', stock: 22, unit: 'vials', expiry: '2025-11-30', status: 'In Stock' },
      { id: 'MED-004', name: 'Furosemide', type: 'Diuretic', stock: 2, unit: 'bottles', expiry: '2025-09-10', status: 'Critical' }
    ]);

    setProtocols([
      { id: 'PROT-001', name: 'Respiratory Treatment Protocol', category: 'Respiratory', steps: 5, duration: '7-14 days', success: '92%' },
      { id: 'PROT-002', name: 'Cardiac Emergency Protocol', category: 'Cardiovascular', steps: 8, duration: '1-3 days', success: '88%' },
      { id: 'PROT-003', name: 'Digestive Health Protocol', category: 'Gastrointestinal', steps: 6, duration: '5-10 days', success: '95%' },
      { id: 'PROT-004', name: 'Post-Surgery Recovery', category: 'Recovery', steps: 10, duration: '14-21 days', success: '97%' }
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active Treatment': return 'text-blue-600 bg-blue-100';
      case 'Monitoring': return 'text-yellow-600 bg-yellow-100';
      case 'Recovery': return 'text-green-600 bg-green-100';
      case 'Critical': return 'text-red-600 bg-red-100';
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

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'text-green-600 bg-green-100';
      case 'Low Stock': return 'text-yellow-600 bg-yellow-100';
      case 'Critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-700 rounded-lg p-6 text-white mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Internal Medicine</h1>
            <p className="text-green-100 mb-4">Comprehensive medical care, treatment protocols, and patient management</p>
            <div className="flex gap-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">AVMA Certified</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Evidence-Based</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Quality Care</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">Aug 16, 02:44 PM</div>
            <div className="text-green-200">Medical Status: Operational</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Heart },
          { id: 'cases', label: 'Medical Cases', icon: FileText },
          { id: 'treatments', label: 'Treatment Plans', icon: Stethoscope },
          { id: 'medications', label: 'Medications', icon: Pill },
          { id: 'protocols', label: 'Protocols', icon: Clipboard }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-green-600 shadow-sm'
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
                  <p className="text-blue-600 text-sm font-medium">Active Cases</p>
                  <p className="text-3xl font-bold text-blue-900">18</p>
                  <p className="text-blue-600 text-sm">Under treatment</p>
                </div>
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Recovery Rate</p>
                  <p className="text-3xl font-bold text-green-900">94%</p>
                  <p className="text-green-600 text-sm">This month</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Critical Cases</p>
                  <p className="text-3xl font-bold text-yellow-900">3</p>
                  <p className="text-yellow-600 text-sm">Require attention</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Avg Treatment Time</p>
                  <p className="text-3xl font-bold text-purple-900">8.5</p>
                  <p className="text-purple-600 text-sm">Days to recovery</p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Medical Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">New Case</div>
                  <div className="text-sm text-gray-600">Start medical case</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-400 transition-colors">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Stethoscope className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Examination</div>
                  <div className="text-sm text-gray-600">Schedule checkup</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition-colors">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Pill className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Prescribe</div>
                  <div className="text-sm text-gray-600">Add medication</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 transition-colors">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Medical Report</div>
                  <div className="text-sm text-gray-600">Generate report</div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Medical Activity */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Recent Medical Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Treatment completed for Bella (A001)</div>
                  <div className="text-sm text-gray-600">Dr. Smith • Aug 16, 02:30 PM • Respiratory infection resolved</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Stethoscope className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">New examination scheduled for Thunder (A002)</div>
                  <div className="text-sm text-gray-600">Dr. Johnson • Aug 16, 02:15 PM • Follow-up digestive assessment</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Critical case alert: Champion (A004)</div>
                  <div className="text-sm text-gray-600">Dr. Brown • Aug 16, 02:00 PM • Cardiac monitoring required</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Medical Cases Tab */}
      {activeTab === 'cases' && (
        <div className="space-y-6">
          {/* Case Controls */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search cases..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>All Status</option>
                <option>Active Treatment</option>
                <option>Monitoring</option>
                <option>Recovery</option>
                <option>Critical</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>All Priorities</option>
                <option>Urgent</option>
                <option>High</option>
                <option>Normal</option>
              </select>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Case
            </button>
          </div>

          {/* Cases Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Case ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Veterinarian</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Visit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {cases.map((medCase) => (
                  <tr key={medCase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{medCase.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{medCase.animalName}</div>
                        <div className="text-gray-500">{medCase.animalId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{medCase.condition}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(medCase.status)}`}>
                        {medCase.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(medCase.priority)}`}>
                        {medCase.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{medCase.veterinarian}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{medCase.nextVisit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-green-600 hover:text-green-900 mr-3">View</button>
                      <button className="text-blue-600 hover:text-blue-900">Update</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Treatment Plans Tab */}
      {activeTab === 'treatments' && (
        <div className="space-y-6">
          {/* Treatment Controls */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search treatments..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>All Categories</option>
                <option>Antibiotic</option>
                <option>Pain Management</option>
                <option>Supportive Care</option>
              </select>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Treatment
            </button>
          </div>

          {/* Treatment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {treatments.map((treatment) => (
              <div key={treatment.id} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{treatment.name}</h3>
                  <Stethoscope className="w-5 h-5 text-green-600" />
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{treatment.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Frequency:</span>
                    <span className="font-medium">{treatment.frequency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Active Cases:</span>
                    <span className="font-medium text-green-600">{treatment.cases}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-md text-sm font-medium hover:bg-green-200">
                    View Details
                  </button>
                  <button className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-200">
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medications Tab */}
      {activeTab === 'medications' && (
        <div className="space-y-6">
          {/* Medication Controls */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search medications..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>All Types</option>
                <option>Antibiotic</option>
                <option>Anti-inflammatory</option>
                <option>Corticosteroid</option>
                <option>Diuretic</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>All Stock Status</option>
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Critical</option>
              </select>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Medication
            </button>
          </div>

          {/* Medications Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medications.map((medication) => (
                  <tr key={medication.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{medication.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{medication.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {medication.stock} {medication.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{medication.expiry}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStockStatusColor(medication.status)}`}>
                        {medication.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-green-600 hover:text-green-900 mr-3">Prescribe</button>
                      <button className="text-blue-600 hover:text-blue-900">Reorder</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Protocols Tab */}
      {activeTab === 'protocols' && (
        <div className="space-y-6">
          {/* Protocol Controls */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search protocols..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>All Categories</option>
                <option>Respiratory</option>
                <option>Cardiovascular</option>
                <option>Gastrointestinal</option>
                <option>Recovery</option>
              </select>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Protocol
            </button>
          </div>

          {/* Protocol Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {protocols.map((protocol) => (
              <div key={protocol.id} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{protocol.name}</h3>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    {protocol.category}
                  </span>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Steps:</span>
                    <span className="font-medium">{protocol.steps} procedures</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{protocol.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Success Rate:</span>
                    <span className="font-medium text-green-600">{protocol.success}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-md text-sm font-medium hover:bg-green-200">
                    View Protocol
                  </button>
                  <button className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-200">
                    Apply
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

export default SimpleInternalMedicinePage;

