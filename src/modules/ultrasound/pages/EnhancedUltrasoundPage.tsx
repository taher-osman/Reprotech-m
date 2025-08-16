import React, { useState, useEffect } from 'react';
import { Camera, Plus, Search, Filter, Edit, Trash2, Eye, Calendar, AlertTriangle, Clock, RefreshCw, CheckCircle, XCircle, Activity, Brain, TrendingUp, Target, Zap, Users, BarChart3, Baby, Microscope, Image, FileText, Download, Upload, Ruler, Heart } from 'lucide-react';

interface UltrasoundRecord {
  id: string;
  examID: string;
  animalId: string;
  animalName: string;
  animalNumber: string;
  examDate: string;
  examTime: string;
  operator: string;
  examType: 'PREGNANCY_CHECK' | 'FETAL_DEVELOPMENT' | 'REPRODUCTIVE_HEALTH' | 'GENERAL_HEALTH';
  pregnancyStatus: 'PREGNANT' | 'NOT_PREGNANT' | 'UNCERTAIN' | 'EARLY_PREGNANCY';
  gestationAge?: number; // in days
  expectedCalvingDate?: string;
  fetalCount?: number;
  fetalViability: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'N/A';
  measurements: {
    crownRumpLength?: number; // mm
    biparietal?: number; // mm
    heartRate?: number; // bpm
    placentalThickness?: number; // mm
  };
  findings: string;
  recommendations: string;
  images: string[];
  aiAnalysis?: {
    pregnancyConfidence: number;
    gestationEstimate: number;
    abnormalityDetected: boolean;
    qualityScore: number;
  };
  followUpDate?: string;
  status: 'COMPLETED' | 'PENDING_REVIEW' | 'FOLLOW_UP_REQUIRED';
  createdAt: string;
  updatedAt: string;
}

interface Animal {
  id: string;
  name: string;
  internalNumber: string;
  species: string;
  sex: 'MALE' | 'FEMALE';
  age: number;
  lastBreeding?: string;
  lastTransfer?: string;
  reproductiveStatus: 'AVAILABLE' | 'PREGNANT' | 'LACTATING' | 'RESTING';
  expectedCalvingDate?: string;
}

interface PregnancyTracking {
  id: string;
  animalId: string;
  animalName: string;
  breedingDate: string;
  transferDate?: string;
  firstPositiveDate: string;
  currentGestationDays: number;
  expectedCalvingDate: string;
  lastExamDate: string;
  pregnancyStage: 'EARLY' | 'MID' | 'LATE';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  nextExamDue: string;
}

export const EnhancedUltrasoundPage: React.FC = () => {
  const [records, setRecords] = useState<UltrasoundRecord[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [pregnancyTracking, setPregnancyTracking] = useState<PregnancyTracking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'exams' | 'pregnancy' | 'imaging' | 'analytics'>('dashboard');
  const [selectedAnimal, setSelectedAnimal] = useState<string>('');

  // Enhanced sample data
  useEffect(() => {
    const sampleAnimals: Animal[] = [
      { 
        id: '1', name: 'Bella', internalNumber: 'C001', species: 'CAMEL', sex: 'FEMALE', age: 5,
        lastBreeding: '2025-07-20', reproductiveStatus: 'PREGNANT', 
        expectedCalvingDate: '2026-05-15'
      },
      { 
        id: '2', name: 'Luna', internalNumber: 'C002', species: 'CAMEL', sex: 'FEMALE', age: 4,
        lastTransfer: '2025-08-16', reproductiveStatus: 'PREGNANT', 
        expectedCalvingDate: '2026-05-23'
      },
      { 
        id: '3', name: 'Star', internalNumber: 'C003', species: 'CAMEL', sex: 'FEMALE', age: 6,
        lastBreeding: '2025-08-10', reproductiveStatus: 'AVAILABLE'
      },
      { 
        id: '4', name: 'Grace', internalNumber: 'C005', species: 'CAMEL', sex: 'FEMALE', age: 3,
        reproductiveStatus: 'AVAILABLE'
      }
    ];

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const sampleRecords: UltrasoundRecord[] = [
      {
        id: '1',
        examID: 'US-2025-001',
        animalId: '1',
        animalName: 'Bella',
        animalNumber: 'C001',
        examDate: today.toISOString().split('T')[0],
        examTime: '09:30',
        operator: 'Dr. Smith',
        examType: 'PREGNANCY_CHECK',
        pregnancyStatus: 'PREGNANT',
        gestationAge: 28,
        expectedCalvingDate: '2026-05-15',
        fetalCount: 1,
        fetalViability: 'EXCELLENT',
        measurements: {
          crownRumpLength: 45,
          biparietal: 12,
          heartRate: 180,
          placentalThickness: 8
        },
        findings: 'Single viable fetus detected. Normal fetal development for gestational age. Strong heartbeat observed.',
        recommendations: 'Continue regular monitoring. Next exam in 4 weeks.',
        images: ['us_001_1.jpg', 'us_001_2.jpg'],
        aiAnalysis: {
          pregnancyConfidence: 98,
          gestationEstimate: 28,
          abnormalityDetected: false,
          qualityScore: 95
        },
        followUpDate: new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'COMPLETED',
        createdAt: today.toISOString(),
        updatedAt: today.toISOString()
      },
      {
        id: '2',
        examID: 'US-2025-002',
        animalId: '2',
        animalName: 'Luna',
        animalNumber: 'C002',
        examDate: yesterday.toISOString().split('T')[0],
        examTime: '14:15',
        operator: 'Dr. Johnson',
        examType: 'PREGNANCY_CHECK',
        pregnancyStatus: 'EARLY_PREGNANCY',
        gestationAge: 21,
        expectedCalvingDate: '2026-05-23',
        fetalCount: 1,
        fetalViability: 'GOOD',
        measurements: {
          crownRumpLength: 28,
          heartRate: 165
        },
        findings: 'Early pregnancy confirmed. Fetal heartbeat detected. Development appears normal.',
        recommendations: 'Follow-up exam in 2 weeks to confirm continued development.',
        images: ['us_002_1.jpg'],
        aiAnalysis: {
          pregnancyConfidence: 92,
          gestationEstimate: 21,
          abnormalityDetected: false,
          qualityScore: 88
        },
        followUpDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'COMPLETED',
        createdAt: yesterday.toISOString(),
        updatedAt: yesterday.toISOString()
      },
      {
        id: '3',
        examID: 'US-2025-003',
        animalId: '3',
        animalName: 'Star',
        animalNumber: 'C003',
        examDate: lastWeek.toISOString().split('T')[0],
        examTime: '11:00',
        operator: 'Dr. Smith',
        examType: 'PREGNANCY_CHECK',
        pregnancyStatus: 'NOT_PREGNANT',
        fetalViability: 'N/A',
        measurements: {},
        findings: 'No signs of pregnancy detected. Reproductive tract appears normal.',
        recommendations: 'Animal available for breeding. Consider estrus synchronization.',
        images: ['us_003_1.jpg'],
        aiAnalysis: {
          pregnancyConfidence: 5,
          gestationEstimate: 0,
          abnormalityDetected: false,
          qualityScore: 92
        },
        status: 'COMPLETED',
        createdAt: lastWeek.toISOString(),
        updatedAt: lastWeek.toISOString()
      }
    ];

    const samplePregnancyTracking: PregnancyTracking[] = [
      {
        id: '1',
        animalId: '1',
        animalName: 'Bella (C001)',
        breedingDate: '2025-07-20',
        firstPositiveDate: '2025-08-10',
        currentGestationDays: 28,
        expectedCalvingDate: '2026-05-15',
        lastExamDate: today.toISOString().split('T')[0],
        pregnancyStage: 'EARLY',
        riskLevel: 'LOW',
        nextExamDue: new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        id: '2',
        animalId: '2',
        animalName: 'Luna (C002)',
        transferDate: '2025-08-16',
        firstPositiveDate: yesterday.toISOString().split('T')[0],
        currentGestationDays: 21,
        expectedCalvingDate: '2026-05-23',
        lastExamDate: yesterday.toISOString().split('T')[0],
        pregnancyStage: 'EARLY',
        riskLevel: 'LOW',
        nextExamDue: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ];

    setAnimals(sampleAnimals);
    setRecords(sampleRecords);
    setPregnancyTracking(samplePregnancyTracking);
    setIsLoading(false);
  }, []);

  const getPregnancyRate = (): number => {
    const pregnant = records.filter(r => r.pregnancyStatus === 'PREGNANT' || r.pregnancyStatus === 'EARLY_PREGNANCY').length;
    const total = records.filter(r => r.examType === 'PREGNANCY_CHECK').length;
    return total > 0 ? Math.round((pregnant / total) * 100) : 0;
  };

  const getAverageGestationAccuracy = (): number => {
    const withAI = records.filter(r => r.aiAnalysis);
    const totalAccuracy = withAI.reduce((sum, r) => sum + (r.aiAnalysis?.pregnancyConfidence || 0), 0);
    return withAI.length > 0 ? Math.round(totalAccuracy / withAI.length) : 0;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PREGNANT': return <Baby className="h-4 w-4 text-green-600" />;
      case 'EARLY_PREGNANCY': return <Heart className="h-4 w-4 text-blue-600" />;
      case 'NOT_PREGNANT': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'UNCERTAIN': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PREGNANT': return 'bg-green-100 text-green-800';
      case 'EARLY_PREGNANCY': return 'bg-blue-100 text-blue-800';
      case 'NOT_PREGNANT': return 'bg-red-100 text-red-800';
      case 'UNCERTAIN': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getViabilityColor = (viability: string) => {
    switch (viability) {
      case 'EXCELLENT': return 'bg-green-100 text-green-800';
      case 'GOOD': return 'bg-blue-100 text-blue-800';
      case 'FAIR': return 'bg-yellow-100 text-yellow-800';
      case 'POOR': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPregnancyStageColor = (stage: string) => {
    switch (stage) {
      case 'EARLY': return 'bg-blue-100 text-blue-800';
      case 'MID': return 'bg-purple-100 text-purple-800';
      case 'LATE': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-700 rounded-lg p-6 text-white mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Advanced Ultrasound Imaging</h1>
            <p className="text-blue-100 mb-4">AI-powered pregnancy monitoring with fetal development tracking</p>
            <div className="flex gap-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Pregnancy Monitoring</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">AI Image Analysis</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Fetal Development</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">Aug 16, 02:44 PM</div>
            <div className="text-blue-200">Imaging Status: Operational</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Activity },
          { id: 'exams', label: 'Ultrasound Exams', icon: Camera },
          { id: 'pregnancy', label: 'Pregnancy Tracking', icon: Baby },
          { id: 'imaging', label: 'Image Analysis', icon: Image },
          { id: 'analytics', label: 'Success Analytics', icon: BarChart3 }
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
                  <p className="text-blue-600 text-sm font-medium">Total Exams</p>
                  <p className="text-3xl font-bold text-blue-900">{records.length}</p>
                  <p className="text-blue-600 text-sm">This month</p>
                </div>
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Pregnancy Rate</p>
                  <p className="text-3xl font-bold text-green-900">{getPregnancyRate()}%</p>
                  <p className="text-green-600 text-sm">Confirmed pregnancies</p>
                </div>
                <Baby className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">AI Accuracy</p>
                  <p className="text-3xl font-bold text-purple-900">{getAverageGestationAccuracy()}%</p>
                  <p className="text-purple-600 text-sm">Pregnancy detection</p>
                </div>
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Active Pregnancies</p>
                  <p className="text-3xl font-bold text-orange-900">{pregnancyTracking.length}</p>
                  <p className="text-orange-600 text-sm">Being monitored</p>
                </div>
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Ultrasound Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">New Exam</div>
                  <div className="text-sm text-gray-600">Schedule ultrasound</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-400 transition-colors">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Baby className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Pregnancy Check</div>
                  <div className="text-sm text-gray-600">Confirm pregnancies</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition-colors">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Brain className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">AI Analysis</div>
                  <div className="text-sm text-gray-600">Automated diagnosis</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 transition-colors">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Generate Report</div>
                  <div className="text-sm text-gray-600">Exam documentation</div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Exam Activity */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Recent Ultrasound Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <Baby className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Pregnancy confirmed for Bella (C001)</div>
                  <div className="text-sm text-gray-600">Dr. Smith • Aug 16, 09:30 AM • 28 days gestation • Expected: May 15, 2026</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Heart className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Early pregnancy detected for Luna (C002)</div>
                  <div className="text-sm text-gray-600">Dr. Johnson • Aug 15, 02:15 PM • 21 days gestation • 92% AI confidence</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Brain className="w-4 h-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">AI analysis completed for Star (C003)</div>
                  <div className="text-sm text-gray-600">System • Aug 9, 11:00 AM • Not pregnant • 95% quality score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pregnancy Tracking Tab */}
      {activeTab === 'pregnancy' && (
        <div className="space-y-6">
          {/* Pregnancy Overview */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Active Pregnancy Monitoring</h3>
            <p className="text-sm text-gray-600 mb-4">Comprehensive tracking of confirmed pregnancies with AI-powered insights</p>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Breeding/Transfer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gestation Days</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Calving</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Exam</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pregnancyTracking.map((pregnancy) => (
                    <tr key={pregnancy.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pregnancy.animalName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pregnancy.breedingDate ? `Breeding: ${pregnancy.breedingDate}` : `Transfer: ${pregnancy.transferDate}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${Math.min((pregnancy.currentGestationDays / 280) * 100, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{pregnancy.currentGestationDays} days</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPregnancyStageColor(pregnancy.pregnancyStage)}`}>
                          {pregnancy.pregnancyStage}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskLevelColor(pregnancy.riskLevel)}`}>
                          {pregnancy.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pregnancy.expectedCalvingDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pregnancy.nextExamDue}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">Exam</button>
                        <button className="text-green-600 hover:text-green-900">Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Image Analysis Tab */}
      {activeTab === 'imaging' && (
        <div className="space-y-6">
          {/* AI Analysis Dashboard */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">AI-Powered Image Analysis</h3>
            <p className="text-sm text-gray-600 mb-6">Advanced computer vision for automated pregnancy detection and fetal development assessment</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-2">Pregnancy Detection</h4>
                <div className="text-2xl font-bold text-purple-600 mb-1">95%</div>
                <div className="text-sm text-purple-600">Average confidence</div>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Positive cases</span>
                    <span className="font-medium">98%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Negative cases</span>
                    <span className="font-medium">92%</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Gestation Estimation</h4>
                <div className="text-2xl font-bold text-blue-600 mb-1">±2.1</div>
                <div className="text-sm text-blue-600">Days accuracy</div>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Early pregnancy</span>
                    <span className="font-medium">±1.5 days</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Mid pregnancy</span>
                    <span className="font-medium">±2.8 days</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Image Quality</h4>
                <div className="text-2xl font-bold text-green-600 mb-1">92%</div>
                <div className="text-sm text-green-600">Average score</div>
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Excellent quality</span>
                    <span className="font-medium">67%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Good quality</span>
                    <span className="font-medium">33%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent AI Analysis Results */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Recent AI Analysis Results</h3>
            <div className="space-y-4">
              {records.filter(r => r.aiAnalysis).map((record) => (
                <div key={record.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{record.animalName} ({record.animalNumber})</h4>
                      <p className="text-sm text-gray-600">{record.examDate} • {record.operator}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(record.pregnancyStatus)}`}>
                      {record.pregnancyStatus.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-500">Pregnancy Confidence</div>
                      <div className="font-medium">{record.aiAnalysis?.pregnancyConfidence}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Gestation Estimate</div>
                      <div className="font-medium">{record.aiAnalysis?.gestationEstimate} days</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Quality Score</div>
                      <div className="font-medium">{record.aiAnalysis?.qualityScore}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Abnormalities</div>
                      <div className="font-medium">{record.aiAnalysis?.abnormalityDetected ? 'Detected' : 'None'}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-900 text-sm">View Images</button>
                    <button className="text-green-600 hover:text-green-900 text-sm">Download Report</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Success Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Pregnancy Detection Rate</h3>
              <div className="text-3xl font-bold text-green-600 mb-2">{getPregnancyRate()}%</div>
              <div className="text-sm text-gray-600">Overall success rate</div>
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Natural breeding</span>
                  <span>75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Embryo transfer</span>
                  <span>50%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">AI Performance</h3>
              <div className="text-3xl font-bold text-purple-600 mb-2">{getAverageGestationAccuracy()}%</div>
              <div className="text-sm text-gray-600">Detection accuracy</div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pregnancy detection</span>
                  <span className="font-medium text-purple-600">95%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Gestation estimation</span>
                  <span className="font-medium text-blue-600">±2.1 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Image quality scoring</span>
                  <span className="font-medium text-green-600">92%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Exam Efficiency</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
              <div className="text-sm text-gray-600">Minutes average</div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pregnancy checks</span>
                  <span className="font-medium text-blue-600">8 min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Fetal development</span>
                  <span className="font-medium text-purple-600">15 min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>General health</span>
                  <span className="font-medium text-green-600">10 min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Insights */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Performance Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Operator Performance</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Dr. Smith</div>
                      <div className="text-sm text-gray-600">2 exams this month</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">95%</div>
                      <div className="text-xs text-gray-500">AI agreement</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Dr. Johnson</div>
                      <div className="text-sm text-gray-600">1 exam this month</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">92%</div>
                      <div className="text-xs text-gray-500">AI agreement</div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-md font-medium text-gray-700 mb-3">Optimization Recommendations</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-blue-900">AI Model Enhancement</div>
                      <div className="text-sm text-blue-700">Continue training with new exam data for improved accuracy</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <Camera className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-900">Image Quality Focus</div>
                      <div className="text-sm text-green-700">Maintain consistent imaging protocols for optimal AI performance</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedUltrasoundPage;

