import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

interface LabResult {
  id: string;
  sampleId: string;
  animalId: string;
  animalName: string;
  breed: string;
  testType: 'Blood Chemistry' | 'Hematology' | 'Microbiology' | 'Serology' | 'Parasitology' | 'Molecular' | 'Histopathology';
  testName: string;
  sampleType: 'Blood' | 'Serum' | 'Plasma' | 'Urine' | 'Feces' | 'Milk' | 'Tissue' | 'Swab';
  collectionDate: string;
  receivedDate: string;
  completedDate?: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Abnormal' | 'Critical';
  priority: 'Routine' | 'Urgent' | 'STAT';
  veterinarian: string;
  technician: string;
  results: LabParameter[];
  interpretation: string;
  recommendations: string;
  cost: number;
  reportUrl?: string;
}

interface LabParameter {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'High' | 'Low' | 'Critical High' | 'Critical Low';
}

const LaboratoryResultsPage: React.FC = () => {
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [testTypeFilter, setTestTypeFilter] = useState('All Tests');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockData: LabResult[] = [
      {
        id: 'LAB-001',
        sampleId: 'S2024-001',
        animalId: 'HOL-1247',
        animalName: 'Bella',
        breed: 'Holstein',
        testType: 'Blood Chemistry',
        testName: 'Comprehensive Metabolic Panel',
        sampleType: 'Serum',
        collectionDate: '2024-08-15',
        receivedDate: '2024-08-15',
        completedDate: '2024-08-16',
        status: 'Abnormal',
        priority: 'Urgent',
        veterinarian: 'Dr. Smith',
        technician: 'Lab Tech. Anderson',
        results: [
          { parameter: 'Glucose', value: '4.2', unit: 'mmol/L', referenceRange: '2.8-4.2', status: 'Normal' },
          { parameter: 'BUN', value: '8.5', unit: 'mmol/L', referenceRange: '3.0-7.5', status: 'High' },
          { parameter: 'Creatinine', value: '145', unit: 'μmol/L', referenceRange: '88-177', status: 'Normal' },
          { parameter: 'Total Protein', value: '85', unit: 'g/L', referenceRange: '67-75', status: 'High' },
          { parameter: 'Albumin', value: '28', unit: 'g/L', referenceRange: '30-36', status: 'Low' },
          { parameter: 'AST', value: '120', unit: 'U/L', referenceRange: '48-100', status: 'High' }
        ],
        interpretation: 'Elevated BUN and AST suggest liver stress. Low albumin indicates protein loss or decreased synthesis.',
        recommendations: 'Monitor liver function. Consider hepatoprotective therapy. Recheck in 1 week.',
        cost: 125.00,
        reportUrl: '/reports/lab-001.pdf'
      },
      {
        id: 'LAB-002',
        sampleId: 'S2024-002',
        animalId: 'JER-0892',
        animalName: 'Thunder',
        breed: 'Jersey',
        testType: 'Hematology',
        testName: 'Complete Blood Count (CBC)',
        sampleType: 'Blood',
        collectionDate: '2024-08-14',
        receivedDate: '2024-08-14',
        completedDate: '2024-08-15',
        status: 'Completed',
        priority: 'Routine',
        veterinarian: 'Dr. Johnson',
        technician: 'Lab Tech. Martinez',
        results: [
          { parameter: 'WBC', value: '7.2', unit: '×10³/μL', referenceRange: '4.0-12.0', status: 'Normal' },
          { parameter: 'RBC', value: '6.8', unit: '×10⁶/μL', referenceRange: '5.0-10.0', status: 'Normal' },
          { parameter: 'Hemoglobin', value: '110', unit: 'g/L', referenceRange: '80-150', status: 'Normal' },
          { parameter: 'Hematocrit', value: '32', unit: '%', referenceRange: '24-46', status: 'Normal' },
          { parameter: 'Platelets', value: '450', unit: '×10³/μL', referenceRange: '100-800', status: 'Normal' }
        ],
        interpretation: 'All hematological parameters within normal limits.',
        recommendations: 'No immediate action required. Continue routine monitoring.',
        cost: 85.00
      },
      {
        id: 'LAB-003',
        sampleId: 'S2024-003',
        animalId: 'ANG-1156',
        animalName: 'Princess',
        breed: 'Angus',
        testType: 'Microbiology',
        testName: 'Bacterial Culture & Sensitivity',
        sampleType: 'Swab',
        collectionDate: '2024-08-16',
        receivedDate: '2024-08-16',
        status: 'In Progress',
        priority: 'STAT',
        veterinarian: 'Dr. Wilson',
        technician: 'Lab Tech. Chen',
        results: [
          { parameter: 'Organism', value: 'Streptococcus agalactiae', unit: '', referenceRange: 'No growth', status: 'Critical High' },
          { parameter: 'Colony Count', value: '>100,000', unit: 'CFU/ml', referenceRange: '<1,000', status: 'Critical High' },
          { parameter: 'Penicillin', value: 'Sensitive', unit: '', referenceRange: 'Sensitive', status: 'Normal' },
          { parameter: 'Ampicillin', value: 'Sensitive', unit: '', referenceRange: 'Sensitive', status: 'Normal' },
          { parameter: 'Ceftiofur', value: 'Sensitive', unit: '', referenceRange: 'Sensitive', status: 'Normal' }
        ],
        interpretation: 'Heavy growth of Strep. agalactiae. Organism sensitive to beta-lactam antibiotics.',
        recommendations: 'Initiate targeted antibiotic therapy. Penicillin or ceftiofur recommended.',
        cost: 95.00
      },
      {
        id: 'LAB-004',
        sampleId: 'S2024-004',
        animalId: 'HOL-2134',
        animalName: 'Daisy',
        breed: 'Holstein',
        testType: 'Serology',
        testName: 'BVD Virus Antibody Test',
        sampleType: 'Serum',
        collectionDate: '2024-08-13',
        receivedDate: '2024-08-13',
        completedDate: '2024-08-14',
        status: 'Completed',
        priority: 'Routine',
        veterinarian: 'Dr. Brown',
        technician: 'Lab Tech. Rodriguez',
        results: [
          { parameter: 'BVD Type 1 Ab', value: 'Positive', unit: '', referenceRange: 'Negative', status: 'High' },
          { parameter: 'BVD Type 2 Ab', value: 'Positive', unit: '', referenceRange: 'Negative', status: 'High' },
          { parameter: 'Titer Level', value: '1:512', unit: '', referenceRange: '<1:16', status: 'High' }
        ],
        interpretation: 'High antibody titers indicate recent vaccination or natural exposure to BVD virus.',
        recommendations: 'Vaccination status confirmed. Maintain biosecurity protocols.',
        cost: 65.00
      },
      {
        id: 'LAB-005',
        sampleId: 'S2024-005',
        animalId: 'JER-3456',
        animalName: 'Honey',
        breed: 'Jersey',
        testType: 'Parasitology',
        testName: 'Fecal Parasite Examination',
        sampleType: 'Feces',
        collectionDate: '2024-08-12',
        receivedDate: '2024-08-12',
        completedDate: '2024-08-13',
        status: 'Critical',
        priority: 'Urgent',
        veterinarian: 'Dr. Davis',
        technician: 'Lab Tech. Thompson',
        results: [
          { parameter: 'Coccidia oocysts', value: '15,000', unit: 'OPG', referenceRange: '<500', status: 'Critical High' },
          { parameter: 'Strongyle eggs', value: '800', unit: 'EPG', referenceRange: '<200', status: 'High' },
          { parameter: 'Trichuris eggs', value: 'None seen', unit: '', referenceRange: 'None', status: 'Normal' }
        ],
        interpretation: 'Heavy coccidia burden with moderate strongyle infection.',
        recommendations: 'Immediate anticoccidial treatment required. Deworm with broad-spectrum anthelmintic.',
        cost: 45.00
      }
    ];

    setTimeout(() => {
      setLabResults(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredResults = labResults.filter(result => {
    const matchesSearch = result.animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.animalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.testName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || result.status === statusFilter;
    const matchesTestType = testTypeFilter === 'All Tests' || result.testType === testTypeFilter;
    const matchesPriority = priorityFilter === 'All Priority' || result.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesTestType && matchesPriority;
  });

  const stats = {
    totalTests: labResults.length,
    completed: labResults.filter(r => r.status === 'Completed').length,
    pending: labResults.filter(r => r.status === 'Pending').length,
    abnormal: labResults.filter(r => r.status === 'Abnormal' || r.status === 'Critical').length,
    avgTurnaround: 1.5, // Mock average turnaround time in days
    totalCost: labResults.reduce((sum, r) => sum + r.cost, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Abnormal': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Routine': return 'bg-gray-100 text-gray-800';
      case 'Urgent': return 'bg-yellow-100 text-yellow-800';
      case 'STAT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getParameterColor = (status: string) => {
    switch (status) {
      case 'Normal': return 'bg-green-100 text-green-800';
      case 'High': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-blue-100 text-blue-800';
      case 'Critical High': return 'bg-red-100 text-red-800';
      case 'Critical Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Laboratory Results</h1>
          <p className="text-gray-600 mt-2">Comprehensive diagnostic testing and analysis</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            📊 Lab Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            🧪 New Test
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalTests}</p>
            </div>
            <div className="text-blue-500 text-2xl">🧪</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="text-green-500 text-2xl">✅</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="text-yellow-500 text-2xl">⏳</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Abnormal</p>
              <p className="text-2xl font-bold text-red-600">{stats.abnormal}</p>
            </div>
            <div className="text-red-500 text-2xl">⚠️</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Turnaround</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgTurnaround}d</p>
            </div>
            <div className="text-purple-500 text-2xl">⏱️</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-indigo-600">${stats.totalCost}</p>
            </div>
            <div className="text-indigo-500 text-2xl">💰</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Search animals, tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Status</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Abnormal</option>
              <option>Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Test Type</label>
            <select
              value={testTypeFilter}
              onChange={(e) => setTestTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Tests</option>
              <option>Blood Chemistry</option>
              <option>Hematology</option>
              <option>Microbiology</option>
              <option>Serology</option>
              <option>Parasitology</option>
              <option>Molecular</option>
              <option>Histopathology</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Priority</option>
              <option>Routine</option>
              <option>Urgent</option>
              <option>STAT</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
              📊 Export Report
            </button>
          </div>
        </div>
      </Card>

      {/* Lab Results */}
      <div className="space-y-4">
        {filteredResults.map((result) => (
          <Card key={result.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {result.animalId} - {result.animalName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {result.breed} • Sample: {result.sampleId} • {result.testName}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(result.status)}>
                    {result.status}
                  </Badge>
                  <Badge className={getPriorityColor(result.priority)}>
                    {result.priority}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                  📋 View Report
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                  📧 Send Report
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Sample Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Sample Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Test Type:</span>
                    <span className="font-medium">{result.testType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sample Type:</span>
                    <span className="font-medium">{result.sampleType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Collected:</span>
                    <span className="font-medium">{new Date(result.collectionDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Received:</span>
                    <span className="font-medium">{new Date(result.receivedDate).toLocaleDateString()}</span>
                  </div>
                  {result.completedDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-medium">{new Date(result.completedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Personnel */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Personnel</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Veterinarian:</span>
                    <span className="font-medium">{result.veterinarian}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Technician:</span>
                    <span className="font-medium">{result.technician}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost:</span>
                    <span className="font-medium text-green-600">${result.cost}</span>
                  </div>
                </div>
              </div>

              {/* Test Results */}
              <div className="col-span-2">
                <h4 className="font-medium text-gray-900 mb-3">Test Results</h4>
                <div className="space-y-2">
                  {result.results.map((param, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{param.parameter}:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{param.value} {param.unit}</span>
                        <Badge className={getParameterColor(param.status)}>
                          {param.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Interpretation</h4>
                <p className="text-sm text-gray-800">{result.interpretation}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                <p className="text-sm text-gray-800">{result.recommendations}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredResults.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 text-4xl mb-4">🧪</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No lab results found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or submit a new test.</p>
        </Card>
      )}
    </div>
  );
};

export default LaboratoryResultsPage;

