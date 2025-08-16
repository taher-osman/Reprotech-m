import React, { useState, useEffect } from 'react';
import { FlaskConical, User, Clock, AlertTriangle, Clipboard, X, ExternalLink, Brain, TestTube, Search, Calendar, DollarSign } from 'lucide-react';

interface LabTestFormProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
  initialData?: any;
}

interface Sample {
  id: string;
  sampleId: string;
  sampleType: string;
  animal: { animalID: string; name: string };
  customer: { customerID: string; name: string };
  collectionDate: string;
  status: string;
  priority: string;
}

interface Protocol {
  id: string;
  protocolName: string;
  protocolCode: string;
  category: string;
  expectedDuration: number;
  costPerTest: number;
  turnaroundTime: number;
  description: string;
  requiredEquipment: string[];
  sampleTypes: string[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  specialization?: string;
}

const LabTestForm: React.FC<LabTestFormProps> = ({ onSubmit, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    sampleId: '',
    protocolId: '',
    assignedTo: '',
    requestedBy: '',
    priority: 'NORMAL',
    requestedDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    clinicalIndication: '',
    specialInstructions: '',
    comments: '',
    isUrgent: false,
    requiresApproval: false,
    estimatedCost: 0,
    customerApprovalRequired: false
  });

  const [samples, setSamples] = useState<Sample[]>([]);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredProtocols, setFilteredProtocols] = useState<Protocol[]>([]);
  const [filteredSamples, setFilteredSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSample, setSelectedSample] = useState<Sample | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [sampleSearchTerm, setSampleSearchTerm] = useState('');
  const [protocolSearchTerm, setProtocolSearchTerm] = useState('');

  useEffect(() => {
    fetchSamples();
    fetchProtocols();
    fetchUsers();
    if (initialData) {
      setFormData({ ...formData, ...initialData });
    }
  }, [initialData]);

  useEffect(() => {
    // Filter samples based on search term
    const filtered = samples.filter(sample => 
      sample.sampleId.toLowerCase().includes(sampleSearchTerm.toLowerCase()) ||
      sample.animal.name.toLowerCase().includes(sampleSearchTerm.toLowerCase()) ||
      sample.animal.animalID.toLowerCase().includes(sampleSearchTerm.toLowerCase()) ||
      sample.customer.name.toLowerCase().includes(sampleSearchTerm.toLowerCase())
    );
    setFilteredSamples(filtered);
  }, [samples, sampleSearchTerm]);

  useEffect(() => {
    // Filter protocols based on selected sample and search term
    let filtered = protocols;
    
    if (selectedSample) {
      filtered = protocols.filter(protocol => 
        protocol.sampleTypes.includes('ALL') || 
        protocol.sampleTypes.includes(selectedSample.sampleType)
      );
    }
    
    if (protocolSearchTerm) {
      filtered = filtered.filter(protocol =>
        protocol.protocolName.toLowerCase().includes(protocolSearchTerm.toLowerCase()) ||
        protocol.protocolCode.toLowerCase().includes(protocolSearchTerm.toLowerCase()) ||
        protocol.category.toLowerCase().includes(protocolSearchTerm.toLowerCase())
      );
    }
    
    setFilteredProtocols(filtered);
  }, [selectedSample, protocols, protocolSearchTerm]);

  useEffect(() => {
    if (selectedProtocol && formData.requestedDate) {
      const requestDate = new Date(formData.requestedDate);
      const dueDate = new Date(requestDate);
      dueDate.setHours(dueDate.getHours() + selectedProtocol.turnaroundTime);
      setFormData(prev => ({
        ...prev,
        dueDate: dueDate.toISOString().split('T')[0],
        estimatedCost: selectedProtocol.costPerTest
      }));
    }
  }, [selectedProtocol, formData.requestedDate]);

  const fetchSamples = async () => {
    try {
      // Enhanced mock samples data from Sample Management
      const mockSamples: Sample[] = [
        {
          id: '1',
          sampleId: 'SM-2025-001',
          sampleType: 'BLOOD',
          animal: { animalID: 'RT-H-001', name: 'Bella' },
          customer: { customerID: 'CU-001', name: 'Al-Rajhi Farms' },
          collectionDate: '2025-01-02',
          status: 'RECEIVED',
          priority: 'NORMAL'
        },
        {
          id: '2',
          sampleId: 'SM-2025-002',
          sampleType: 'SERUM',
          animal: { animalID: 'RT-J-002', name: 'Thunder' },
          customer: { customerID: 'CU-002', name: 'Modern Dairy Co.' },
          collectionDate: '2025-01-02',
          status: 'RECEIVED',
          priority: 'HIGH'
        },
        {
          id: '3',
          sampleId: 'SM-2025-003',
          sampleType: 'DNA',
          animal: { animalID: 'RT-A-003', name: 'Jasmine' },
          customer: { customerID: 'CU-003', name: 'Elite Genetics' },
          collectionDate: '2025-01-01',
          status: 'RECEIVED',
          priority: 'URGENT'
        },
        {
          id: '4',
          sampleId: 'SM-2025-004',
          sampleType: 'URINE',
          animal: { animalID: 'RT-B-004', name: 'Storm' },
          customer: { customerID: 'CU-001', name: 'Al-Rajhi Farms' },
          collectionDate: '2025-01-02',
          status: 'RECEIVED',
          priority: 'NORMAL'
        },
        {
          id: '5',
          sampleId: 'SM-2025-005',
          sampleType: 'TISSUE',
          animal: { animalID: 'RT-C-005', name: 'Luna' },
          customer: { customerID: 'CU-004', name: 'Premium Genetics' },
          collectionDate: '2025-01-01',
          status: 'PROCESSING',
          priority: 'HIGH'
        }
      ];
      setSamples(mockSamples);
    } catch (error) {
      console.error('Error fetching samples:', error);
    }
  };

  const fetchProtocols = async () => {
    try {
      // Enhanced mock protocols data
      const mockProtocols: Protocol[] = [
        {
          id: '1',
          protocolName: 'Complete Blood Count',
          protocolCode: 'CBC-001',
          category: 'HEMATOLOGY',
          expectedDuration: 45,
          costPerTest: 25.00,
          turnaroundTime: 4,
          description: 'Comprehensive blood cell analysis including RBC, WBC, and platelet counts',
          requiredEquipment: ['Hematology Analyzer', 'Microscope'],
          sampleTypes: ['BLOOD']
        },
        {
          id: '2',
          protocolName: 'Genetic Marker Analysis',
          protocolCode: 'GMA-001',
          category: 'GENOMICS',
          expectedDuration: 120,
          costPerTest: 85.00,
          turnaroundTime: 24,
          description: 'SNP analysis for genetic markers and parentage verification',
          requiredEquipment: ['PCR Machine', 'Sequencer'],
          sampleTypes: ['DNA', 'BLOOD', 'TISSUE']
        },
        {
          id: '3',
          protocolName: 'Hormone Panel',
          protocolCode: 'HP-001',
          category: 'ENDOCRINOLOGY',
          expectedDuration: 60,
          costPerTest: 45.00,
          turnaroundTime: 8,
          description: 'Comprehensive hormone analysis including reproductive hormones',
          requiredEquipment: ['ELISA Reader', 'Centrifuge'],
          sampleTypes: ['SERUM', 'BLOOD']
        },
        {
          id: '4',
          protocolName: 'Pregnancy Test',
          protocolCode: 'PT-001',
          category: 'REPRODUCTION',
          expectedDuration: 30,
          costPerTest: 20.00,
          turnaroundTime: 2,
          description: 'Rapid pregnancy determination using PAG analysis',
          requiredEquipment: ['ELISA Reader'],
          sampleTypes: ['SERUM', 'BLOOD']
        },
        {
          id: '5',
          protocolName: 'Urinalysis Complete',
          protocolCode: 'UA-001',
          category: 'CLINICAL_CHEMISTRY',
          expectedDuration: 40,
          costPerTest: 30.00,
          turnaroundTime: 6,
          description: 'Complete urinalysis including microscopic examination',
          requiredEquipment: ['Urinalysis Analyzer', 'Microscope'],
          sampleTypes: ['URINE']
        },
        {
          id: '6',
          protocolName: 'Histopathology',
          protocolCode: 'HISTO-001',
          category: 'PATHOLOGY',
          expectedDuration: 180,
          costPerTest: 120.00,
          turnaroundTime: 48,
          description: 'Microscopic examination of tissue samples',
          requiredEquipment: ['Microtome', 'Microscope', 'Staining Station'],
          sampleTypes: ['TISSUE']
        }
      ];
      setProtocols(mockProtocols);
      setFilteredProtocols(mockProtocols);
    } catch (error) {
      console.error('Error fetching protocols:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const mockUsers: User[] = [
        { id: '1', firstName: 'Dr. Sarah', lastName: 'Ahmed', role: 'VET', specialization: 'Clinical Pathology' },
        { id: '2', firstName: 'John', lastName: 'Doe', role: 'LAB_TECH', specialization: 'Hematology' },
        { id: '3', firstName: 'Jane', lastName: 'Smith', role: 'LAB_TECH', specialization: 'Genomics' },
        { id: '4', firstName: 'Mike', lastName: 'Wilson', role: 'LAB_TECH', specialization: 'Clinical Chemistry' },
        { id: '5', firstName: 'Dr. Lisa', lastName: 'Brown', role: 'VET', specialization: 'Reproduction' }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSampleChange = (sampleId: string) => {
    const sample = samples.find(s => s.id === sampleId);
    setSelectedSample(sample || null);
    setFormData({ ...formData, sampleId });
  };

  const handleProtocolChange = (protocolId: string) => {
    const protocol = protocols.find(p => p.id === protocolId);
    setSelectedProtocol(protocol || null);
    setFormData({ ...formData, protocolId });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const testData = {
        ...formData,
        testId: `TEST-${Date.now().toString().slice(-6)}`,
        status: 'PENDING',
        requestedDate: new Date(formData.requestedDate),
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
        createdAt: new Date().toISOString(),
        sampleDetails: selectedSample,
        protocolDetails: selectedProtocol
      };

      await onSubmit(testData);
      onClose();
    } catch (error) {
      console.error('Error submitting test:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToSampleManagement = () => {
    window.location.href = '/#/sample-management';
  };

  const priorityLevels = [
    { value: 'LOW', label: 'Low', color: 'text-gray-600', bg: 'bg-gray-100' },
    { value: 'NORMAL', label: 'Normal', color: 'text-blue-600', bg: 'bg-blue-100' },
    { value: 'HIGH', label: 'High', color: 'text-orange-600', bg: 'bg-orange-100' },
    { value: 'URGENT', label: 'Urgent', color: 'text-red-600', bg: 'bg-red-100' },
    { value: 'STAT', label: 'STAT', color: 'text-red-800', bg: 'bg-red-200' }
  ];

  const getSampleStatusColor = (status: string) => {
    const colors = {
      'COLLECTED': 'bg-blue-100 text-blue-800',
      'RECEIVED': 'bg-green-100 text-green-800',
      'PROCESSING': 'bg-yellow-100 text-yellow-800',
      'COMPLETED': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FlaskConical className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">
                  {initialData ? 'Edit Lab Test' : '⚗️ Create Laboratory Test'}
                </h2>
                <p className="text-blue-100">Assign test protocols to samples from Sample Management</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Sample Management Integration Notice */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg border border-teal-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <TestTube className="w-5 h-5 text-teal-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Sample Management Integration</h4>
                  <p className="text-sm text-gray-600">Samples are sourced from the centralized Sample Management module</p>
                </div>
              </div>
              <button
                type="button"
                onClick={navigateToSampleManagement}
                className="flex items-center px-3 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Manage Samples
              </button>
            </div>
          </div>

          {/* Sample Selection */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FlaskConical className="w-5 h-5 mr-2 text-blue-600" />
              Sample Selection
            </h3>
            
            {/* Sample Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search samples by ID, animal name, or customer..."
                  value={sampleSearchTerm}
                  onChange={(e) => setSampleSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sample * ({filteredSamples.length} available)
                </label>
                <select
                  required
                  value={formData.sampleId}
                  onChange={(e) => handleSampleChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a sample...</option>
                  {filteredSamples.map(sample => (
                    <option key={sample.id} value={sample.id}>
                      {sample.sampleId} - {sample.animal.name} ({sample.animal.animalID}) - {sample.sampleType}
                    </option>
                  ))}
                </select>
                {filteredSamples.length === 0 && sampleSearchTerm && (
                  <p className="text-sm text-red-600 mt-1">No samples found matching your search</p>
                )}
              </div>

              {selectedSample && (
                <div className="bg-white p-4 rounded-md border border-blue-200">
                  <h4 className="font-medium text-gray-900 mb-2">Sample Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Animal:</span> {selectedSample.animal.name} ({selectedSample.animal.animalID})</p>
                    <p><span className="font-medium">Customer:</span> {selectedSample.customer.name}</p>
                    <p><span className="font-medium">Type:</span> {selectedSample.sampleType}</p>
                    <p><span className="font-medium">Collected:</span> {selectedSample.collectionDate}</p>
                    <p className="flex items-center">
                      <span className="font-medium mr-2">Status:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getSampleStatusColor(selectedSample.status)}`}>
                        {selectedSample.status}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Protocol Selection */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Clipboard className="w-5 h-5 mr-2 text-green-600" />
              Test Protocol
            </h3>
            
            {/* Protocol Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search protocols by name, code, or category..."
                  value={protocolSearchTerm}
                  onChange={(e) => setProtocolSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Protocol * ({filteredProtocols.length} compatible)
                </label>
                <select
                  required
                  value={formData.protocolId}
                  onChange={(e) => handleProtocolChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select a protocol...</option>
                  {filteredProtocols.map(protocol => (
                    <option key={protocol.id} value={protocol.id}>
                      {protocol.protocolCode} - {protocol.protocolName} ({protocol.category})
                    </option>
                  ))}
                </select>
                {selectedSample && filteredProtocols.length === 0 && (
                  <p className="text-sm text-orange-600 mt-1">
                    No protocols available for {selectedSample.sampleType} samples
                  </p>
                )}
              </div>

              {selectedProtocol && (
                <div className="bg-white p-4 rounded-md border border-green-200">
                  <h4 className="font-medium text-gray-900 mb-2">Protocol Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Duration:</span> {selectedProtocol.expectedDuration} minutes</p>
                    <p><span className="font-medium">Cost:</span> ${selectedProtocol.costPerTest.toFixed(2)}</p>
                    <p><span className="font-medium">Turnaround:</span> {selectedProtocol.turnaroundTime} hours</p>
                    <p><span className="font-medium">Category:</span> {selectedProtocol.category}</p>
                    <p className="text-xs text-gray-500 mt-2">{selectedProtocol.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Assignment and Priority */}
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-yellow-600" />
              Assignment & Priority
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to Technician
                </label>
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Auto-assign</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.role}) {user.specialization && `- ${user.specialization}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority *
                </label>
                <select
                  required
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  {priorityLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col justify-center space-y-2">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={formData.isUrgent}
                    onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                    className="mr-2 rounded focus:ring-yellow-500"
                  />
                  Mark as Urgent
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={formData.requiresApproval}
                    onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                    className="mr-2 rounded focus:ring-yellow-500"
                  />
                  Requires Approval
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={formData.customerApprovalRequired}
                    onChange={(e) => setFormData({ ...formData, customerApprovalRequired: e.target.checked })}
                    className="mr-2 rounded focus:ring-yellow-500"
                  />
                  Customer Approval Required
                </label>
              </div>
            </div>
          </div>

          {/* Schedule and Dates */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-purple-600" />
              Schedule & Cost
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requested Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.requestedDate}
                  onChange={(e) => setFormData({ ...formData, requestedDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requested By
                </label>
                <select
                  value={formData.requestedBy}
                  onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select requester...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Cost
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clinical Indication
                </label>
                <textarea
                  value={formData.clinicalIndication}
                  onChange={(e) => setFormData({ ...formData, clinicalIndication: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Clinical reason for the test..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Special handling or processing instructions..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments
                </label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Additional comments or notes..."
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.sampleId || !formData.protocolId}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Test...
                </div>
              ) : (
                'Create Lab Test'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LabTestForm; 