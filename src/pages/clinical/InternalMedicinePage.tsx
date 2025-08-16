import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

interface MedicalRecord {
  id: string;
  animalId: string;
  animalName: string;
  breed: string;
  visitDate: string;
  visitTime: string;
  chiefComplaint: string;
  diagnosis: string;
  treatment: string;
  medications: string[];
  veterinarian: string;
  status: 'Active Treatment' | 'Recovered' | 'Monitoring' | 'Referred' | 'Chronic';
  severity: 'Mild' | 'Moderate' | 'Severe' | 'Critical';
  temperature: number;
  heartRate: number;
  respiratoryRate: number;
  bloodPressure: string;
  weight: number;
  bodyCondition: number;
  followUpDate?: string;
  notes: string;
  labResults?: string[];
  imaging?: string[];
  cost: number;
}

const InternalMedicinePage: React.FC = () => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [severityFilter, setSeverityFilter] = useState('All Severity');
  const [dateFilter, setDateFilter] = useState('All Dates');
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockData: MedicalRecord[] = [
      {
        id: 'MED-001',
        animalId: 'HOL-1247',
        animalName: 'Bella',
        breed: 'Holstein',
        visitDate: '2024-08-15',
        visitTime: '09:30',
        chiefComplaint: 'Decreased milk production and lethargy',
        diagnosis: 'Subclinical mastitis with secondary metabolic stress',
        treatment: 'Antibiotic therapy, anti-inflammatory, nutritional support',
        medications: ['Ceftiofur 2mg/kg IM', 'Flunixin 2.2mg/kg IV', 'Vitamin B Complex'],
        veterinarian: 'Dr. Smith',
        status: 'Active Treatment',
        severity: 'Moderate',
        temperature: 39.2,
        heartRate: 72,
        respiratoryRate: 28,
        bloodPressure: '140/90',
        weight: 650,
        bodyCondition: 3.5,
        followUpDate: '2024-08-22',
        notes: 'Somatic cell count elevated. Started on targeted antibiotic therapy. Monitor milk production daily.',
        labResults: ['SCC: 450,000 cells/ml', 'Milk culture: Strep. agalactiae', 'CBC: Mild leukocytosis'],
        cost: 285.50
      },
      {
        id: 'MED-002',
        animalId: 'JER-0892',
        animalName: 'Thunder',
        breed: 'Jersey',
        visitDate: '2024-08-14',
        visitTime: '14:15',
        chiefComplaint: 'Lameness in right front leg',
        diagnosis: 'Digital dermatitis (hairy heel warts)',
        treatment: 'Topical antibiotic, hoof trimming, zinc sulfate footbath',
        medications: ['Oxytetracycline spray', 'Zinc sulfate 5% solution'],
        veterinarian: 'Dr. Johnson',
        status: 'Monitoring',
        severity: 'Mild',
        temperature: 38.8,
        heartRate: 68,
        respiratoryRate: 24,
        bloodPressure: '135/85',
        weight: 750,
        bodyCondition: 4.0,
        followUpDate: '2024-08-21',
        notes: 'Lesions on heel bulbs. Improved hygiene protocols recommended. Locomotion score 2/5.',
        cost: 125.00
      },
      {
        id: 'MED-003',
        animalId: 'ANG-1156',
        animalName: 'Princess',
        breed: 'Angus',
        visitDate: '2024-08-16',
        visitTime: '11:00',
        chiefComplaint: 'Respiratory distress and coughing',
        diagnosis: 'Bovine Respiratory Disease Complex (BRDC)',
        treatment: 'Broad-spectrum antibiotic, bronchodilator, supportive care',
        medications: ['Tulathromycin 2.5mg/kg SC', 'Dexamethasone 0.1mg/kg IM', 'Electrolyte solution'],
        veterinarian: 'Dr. Wilson',
        status: 'Active Treatment',
        severity: 'Severe',
        temperature: 40.1,
        heartRate: 88,
        respiratoryRate: 45,
        bloodPressure: '150/95',
        weight: 580,
        bodyCondition: 3.0,
        followUpDate: '2024-08-18',
        notes: 'Acute onset respiratory signs. Possible viral component with secondary bacterial infection.',
        labResults: ['WBC: 12,500/μl', 'Neutrophils: 85%', 'Viral PCR: Pending'],
        imaging: ['Chest X-ray: Bilateral pneumonia'],
        cost: 420.75
      },
      {
        id: 'MED-004',
        animalId: 'HOL-2134',
        animalName: 'Daisy',
        breed: 'Holstein',
        visitDate: '2024-08-13',
        visitTime: '16:45',
        chiefComplaint: 'Routine health check and vaccination',
        diagnosis: 'Healthy - Preventive care',
        treatment: 'Annual vaccinations, deworming, hoof trimming',
        medications: ['IBR-PI3-BRSV vaccine', 'Ivermectin 200μg/kg SC'],
        veterinarian: 'Dr. Brown',
        status: 'Recovered',
        severity: 'Mild',
        temperature: 38.6,
        heartRate: 65,
        respiratoryRate: 22,
        bloodPressure: '130/80',
        weight: 680,
        bodyCondition: 4.5,
        notes: 'Excellent body condition. All parameters within normal limits. Next check in 6 months.',
        cost: 95.00
      },
      {
        id: 'MED-005',
        animalId: 'JER-3456',
        animalName: 'Honey',
        breed: 'Jersey',
        visitDate: '2024-08-12',
        visitTime: '13:20',
        chiefComplaint: 'Chronic diarrhea and weight loss',
        diagnosis: 'Johne\'s Disease (Paratuberculosis) - suspected',
        treatment: 'Supportive care, nutritional management, isolation protocols',
        medications: ['Probiotics', 'Vitamin supplements', 'Electrolyte replacement'],
        veterinarian: 'Dr. Davis',
        status: 'Chronic',
        severity: 'Moderate',
        temperature: 38.9,
        heartRate: 70,
        respiratoryRate: 26,
        bloodPressure: '125/75',
        weight: 520,
        bodyCondition: 2.5,
        followUpDate: '2024-08-26',
        notes: 'Chronic wasting condition. ELISA test ordered. Implement biosecurity measures.',
        labResults: ['Fecal culture: Pending', 'ELISA: Pending', 'Protein levels: Low'],
        cost: 180.25
      }
    ];

    setTimeout(() => {
      setMedicalRecords(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredRecords = medicalRecords.filter(record => {
    const matchesSearch = record.animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.animalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || record.status === statusFilter;
    const matchesSeverity = severityFilter === 'All Severity' || record.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const stats = {
    totalRecords: medicalRecords.length,
    activetreatment: medicalRecords.filter(r => r.status === 'Active Treatment').length,
    monitoring: medicalRecords.filter(r => r.status === 'Monitoring').length,
    recovered: medicalRecords.filter(r => r.status === 'Recovered').length,
    avgTemperature: medicalRecords.reduce((sum, r) => sum + r.temperature, 0) / medicalRecords.length || 0,
    totalCost: medicalRecords.reduce((sum, r) => sum + r.cost, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active Treatment': return 'bg-red-100 text-red-800';
      case 'Recovered': return 'bg-green-100 text-green-800';
      case 'Monitoring': return 'bg-yellow-100 text-yellow-800';
      case 'Referred': return 'bg-blue-100 text-blue-800';
      case 'Chronic': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Mild': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Severe': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Internal Medicine</h1>
          <p className="text-gray-600 mt-2">Comprehensive medical care and diagnostics</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            📊 Medical Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            🏥 New Visit
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalRecords}</p>
            </div>
            <div className="text-blue-500 text-2xl">🏥</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Treatment</p>
              <p className="text-2xl font-bold text-red-600">{stats.activetreatment}</p>
            </div>
            <div className="text-red-500 text-2xl">🚨</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monitoring</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.monitoring}</p>
            </div>
            <div className="text-yellow-500 text-2xl">👁️</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recovered</p>
              <p className="text-2xl font-bold text-green-600">{stats.recovered}</p>
            </div>
            <div className="text-green-500 text-2xl">✅</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Temperature</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgTemperature.toFixed(1)}°C</p>
            </div>
            <div className="text-purple-500 text-2xl">🌡️</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-indigo-600">${stats.totalCost.toFixed(0)}</p>
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
              placeholder="Search animals, diagnosis..."
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
              <option>Active Treatment</option>
              <option>Recovered</option>
              <option>Monitoring</option>
              <option>Referred</option>
              <option>Chronic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Severity</option>
              <option>Mild</option>
              <option>Moderate</option>
              <option>Severe</option>
              <option>Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Dates</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
              📊 Export Report
            </button>
          </div>
        </div>
      </Card>

      {/* Medical Records */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <Card key={record.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {record.animalId} - {record.animalName}
                  </h3>
                  <p className="text-sm text-gray-600">{record.breed} • Visit ID: {record.id}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                  <Badge className={getSeverityColor(record.severity)}>
                    {record.severity}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                  📋 View Details
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                  ✏️ Edit
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Visit Information */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Visit Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date(record.visitDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{record.visitTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Veterinarian:</span>
                    <span className="font-medium">{record.veterinarian}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost:</span>
                    <span className="font-medium text-green-600">${record.cost}</span>
                  </div>
                </div>
              </div>

              {/* Vital Signs */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Vital Signs</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Temperature:</span>
                    <span className="font-medium">{record.temperature}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Heart Rate:</span>
                    <span className="font-medium">{record.heartRate} bpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Respiratory:</span>
                    <span className="font-medium">{record.respiratoryRate} rpm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blood Pressure:</span>
                    <span className="font-medium">{record.bloodPressure}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{record.weight} kg</span>
                  </div>
                </div>
              </div>

              {/* Diagnosis & Treatment */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Diagnosis & Treatment</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Chief Complaint:</span>
                    <p className="text-gray-800 mt-1">{record.chiefComplaint}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Diagnosis:</span>
                    <p className="font-medium text-blue-600 mt-1">{record.diagnosis}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Treatment:</span>
                    <p className="text-gray-800 mt-1">{record.treatment}</p>
                  </div>
                </div>
              </div>

              {/* Medications & Follow-up */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Medications & Follow-up</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Medications:</span>
                    <ul className="mt-1 space-y-1">
                      {record.medications.map((med, index) => (
                        <li key={index} className="text-gray-800 text-xs">• {med}</li>
                      ))}
                    </ul>
                  </div>
                  {record.followUpDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Follow-up:</span>
                      <span className="font-medium text-orange-600">{new Date(record.followUpDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {record.labResults && (
                    <div>
                      <span className="text-gray-600">Lab Results:</span>
                      <ul className="mt-1 space-y-1">
                        {record.labResults.map((result, index) => (
                          <li key={index} className="text-gray-800 text-xs">• {result}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {record.notes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Clinical Notes</h4>
                <p className="text-sm text-gray-800">{record.notes}</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <Card className="p-12 text-center">
          <div className="text-gray-400 text-4xl mb-4">🏥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or add a new medical visit.</p>
        </Card>
      )}
    </div>
  );
};

export default InternalMedicinePage;

