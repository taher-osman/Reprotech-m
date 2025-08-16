import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Calendar, 
  Users, 
  Activity, 
  BarChart3, 
  ArrowLeft,
  Edit,
  Download,
  Printer,
  Share,
  Clock,
  Award,
  Stethoscope,
  Target
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { TransferRecord, PregnancyTracking } from '../types/transferTypes';
import PregnancyTracker from '../components/PregnancyTracker';
import api from './services/api';

const TransferDetailPage: React.FC = () => {
  const { transferId } = useParams<{ transferId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [transfer, setTransfer] = useState<TransferRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (transferId) {
      loadTransferDetails();
    }
  }, [transferId]);

  const loadTransferDetails = async () => {
    try {
      setLoading(true);
      // This would be an actual API call
      // const response = await api.getTransferById(transferId);
      // setTransfer(response.data);
      
      // Mock data for now
      const mockTransfer: TransferRecord = {
        id: transferId || '1',
        transferId: `ET-${transferId}`,
        internalNumber: `RT-ET-${transferId}`,
        embryoId: 'EMB-2025-001',
        recipientId: 'R001',
        recipientInternalNumber: 'RT-R-001234',
        donorId: 'D001',
        donorName: 'Elite Donor Prima',
        donorInternalNumber: 'RT-D-001234',
        donorBreed: 'Holstein',
        sireId: 'S001',
        sireName: 'Champion Zeus',
        sireInternalNumber: 'RT-S-001234',
        sireBreed: 'Holstein',
        embryoGrade: 'A',
        embryoStage: 'BLASTOCYST',
        embryoDay: 7,
        recipientName: 'Prima Recipient',
        recipientBreed: 'Holstein',
        recipientAge: 3,
        recipientWeight: 450,
        recipientBCS: 6,
        synchronizationProtocol: 'CIDR_PGF',
        synchronizationDay: 7,
        lastEstrus: new Date('2025-01-10'),
        ovulationTiming: 'CONFIRMED',
        transferDate: new Date('2025-01-15'),
        transferTime: '10:30',
        veterinarian: 'Dr. Sarah Johnson',
        technician: 'Tech Mike Wilson',
        transferMethod: 'NON_SURGICAL_CERVICAL',
        transferSite: 'LEFT_HORN',
        cervixCondition: 'GOOD',
        transferDifficulty: 'EASY',
        bloodInMucus: false,
        transferDepth: 4.5,
        sedation: true,
        sedationType: 'Mild sedation',
        antibiotics: true,
        antibioticType: 'Penicillin',
        progesterone: true,
        progesteroneType: 'CIDR',
        weather: 'SUNNY',
        temperature: 22,
        humidity: 65,
        stress_level: 'LOW',
        embryoViabilityPost: 'EXCELLENT',
        transferQuality: 'OPTIMAL',
        pregnancyAge: differenceInDays(new Date(), new Date('2025-01-15')) + 8,
        followUpDates: {
          day15: new Date('2025-01-30'),
          day30: new Date('2025-02-14'),
          day45: new Date('2025-03-01'),
          day60: new Date('2025-03-16')
        },
        nextFollowUp: new Date('2025-01-30'),
        needsCustomerReport: false,
        customerReportSent: false,
        pregnancyCheck1: new Date('2025-02-14'),
        pregnancyCheck2: new Date('2025-03-16'),
        pregnancyStatus: 'PENDING',
        pregnancyRate: 75,
        transferCost: 1200,
        recipientCost: 800,
        totalCost: 2000,
        specialNotes: 'Excellent quality embryo, optimal transfer conditions',
        complications: [],
        followUpRequired: true,
        createdAt: new Date('2025-01-15'),
        updatedAt: new Date(),
        createdBy: 'Dr. Sarah Johnson',
        status: 'COMPLETED',
        pregnancyTracking: {
          checkpoints: [
            {
              id: 'check15',
              title: 'Day 15 Pregnancy Check',
              scheduledDate: new Date('2025-01-30'),
              performed: true,
              result: 'PREGNANT',
              confidence: 95,
              notes: 'Clear gestational sac visible, strong heartbeat detected',
              daysFromTransfer: 15,
              isParturition: false,
              updatedBy: 'Dr. Sarah Johnson',
              updatedAt: new Date('2025-01-30T09:15:00Z'),
              actualDate: new Date('2025-01-30T09:15:00Z')
            },
            {
              id: 'check30',
              title: 'Day 30 Pregnancy Check',
              scheduledDate: new Date('2025-02-14'),
              performed: false,
              result: 'UNKNOWN',
              notes: '',
              daysFromTransfer: 30,
              isParturition: false
            },
            {
              id: 'check45',
              title: 'Day 45 Pregnancy Check',
              scheduledDate: new Date('2025-03-01'),
              performed: false,
              result: 'UNKNOWN',
              notes: '',
              daysFromTransfer: 45,
              isParturition: false
            },
            {
              id: 'check60',
              title: 'Day 60 Pregnancy Check',
              scheduledDate: new Date('2025-03-16'),
              performed: false,
              result: 'UNKNOWN',
              notes: '',
              daysFromTransfer: 60,
              isParturition: false
            },
            {
              id: 'parturition',
              title: 'Parturition',
              scheduledDate: new Date('2025-12-12'),
              expectedDate: new Date('2025-12-12'),
              performed: false,
              result: 'UNKNOWN',
              notes: '',
              daysFromTransfer: 330,
              isParturition: true
            }
          ],
          currentStatus: 'PREGNANT',
          lastCheckDate: new Date('2025-01-30'),
          nextCheckDate: new Date('2025-02-14'),
          pregnancyConfirmedDate: new Date('2025-01-30'),
          gestationDays: differenceInDays(new Date(), new Date('2025-01-15')),
          expectedDeliveryDate: new Date('2025-12-12'),
          pregnancyRate: 75,
          recommendations: [
            'Continue routine monitoring',
            'Maintain optimal nutrition',
            'Monitor for stress factors'
          ]
        }
      };
      
      setTransfer(mockTransfer);
    } catch (error) {
      console.error('Error loading transfer details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePregnancyUpdate = () => {
    // Reload transfer data after pregnancy tracking update
    loadTransferDetails();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'pregnancy', label: 'Pregnancy Tracking', icon: Heart },
    { id: 'procedure', label: 'Procedure Details', icon: Stethoscope },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading transfer details...</p>
        </div>
      </div>
    );
  }

  if (!transfer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Transfer not found</p>
          <button 
            onClick={() => navigate('/embryo-transfer')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Return to transfers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/embryo-transfer')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {transfer.internalNumber}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {transfer.recipientName} • {format(transfer.transferDate, 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  transfer.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                  transfer.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {transfer.status}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  transfer.pregnancyTracking.currentStatus === 'PREGNANT' ? 'bg-green-100 text-green-800' :
                  transfer.pregnancyTracking.currentStatus === 'NOT_PREGNANT' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {transfer.pregnancyTracking.currentStatus}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Share className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Printer className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Download className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Edit className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-pink-500 text-pink-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Transfer Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Key Metrics */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Transfer Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="p-3 bg-blue-100 rounded-lg inline-block mb-2">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">Days Since Transfer</p>
                    <p className="text-xl font-semibold text-gray-900">{transfer.pregnancyAge}</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-green-100 rounded-lg inline-block mb-2">
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-xl font-semibold text-gray-900">{transfer.pregnancyRate}%</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-purple-100 rounded-lg inline-block mb-2">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-600">Embryo Grade</p>
                    <p className="text-xl font-semibold text-gray-900">{transfer.embryoGrade}</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 bg-orange-100 rounded-lg inline-block mb-2">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <p className="text-sm text-gray-600">Next Check</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {transfer.nextFollowUp ? 
                        format(transfer.nextFollowUp, 'MMM dd') : 
                        'Complete'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Transfer Participants</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Donor</h4>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">{transfer.donorInternalNumber}</p>
                      <p className="text-sm text-gray-600">{transfer.donorName}</p>
                      <p className="text-xs text-gray-500">{transfer.donorBreed}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Sire</h4>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">{transfer.sireInternalNumber}</p>
                      <p className="text-sm text-gray-600">{transfer.sireName}</p>
                      <p className="text-xs text-gray-500">{transfer.sireBreed}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Recipient</h4>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">{transfer.recipientInternalNumber}</p>
                      <p className="text-sm text-gray-600">{transfer.recipientName}</p>
                      <p className="text-xs text-gray-500">{transfer.recipientBreed} • {transfer.recipientAge} years</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {transfer.pregnancyTracking.checkpoints
                    .filter(cp => cp.performed)
                    .sort((a, b) => new Date(b.actualDate || b.scheduledDate).getTime() - new Date(a.actualDate || a.scheduledDate).getTime())
                    .slice(0, 3)
                    .map(checkpoint => (
                      <div key={checkpoint.id} className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          checkpoint.result === 'PREGNANT' ? 'bg-green-100' :
                          checkpoint.result === 'NOT_PREGNANT' ? 'bg-red-100' :
                          'bg-gray-100'
                        }`}>
                          <Heart className={`h-4 w-4 ${
                            checkpoint.result === 'PREGNANT' ? 'text-green-600' :
                            checkpoint.result === 'NOT_PREGNANT' ? 'text-red-600' :
                            'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {checkpoint.title} - {checkpoint.result.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-gray-500">
                            {checkpoint.actualDate && format(new Date(checkpoint.actualDate), 'MMM dd, yyyy HH:mm')}
                            {checkpoint.updatedBy && ` • ${checkpoint.updatedBy}`}
                          </p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Transfer Date</span>
                    <span className="text-sm font-medium text-gray-900">
                      {format(transfer.transferDate, 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Veterinarian</span>
                    <span className="text-sm font-medium text-gray-900">{transfer.veterinarian}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Method</span>
                    <span className="text-sm font-medium text-gray-900">
                      {transfer.transferMethod.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Quality</span>
                    <span className="text-sm font-medium text-gray-900">{transfer.transferQuality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Cost</span>
                    <span className="text-sm font-medium text-gray-900">${transfer.totalCost}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {transfer.specialNotes && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                  <p className="text-sm text-gray-700">{transfer.specialNotes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'pregnancy' && (
          <PregnancyTracker
            pregnancyTracking={transfer.pregnancyTracking}
            transferId={transfer.transferId}
            recipientName={transfer.recipientName}
            transferDate={transfer.transferDate}
            onUpdate={handlePregnancyUpdate}
          />
        )}

        {activeTab === 'procedure' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Procedure Details</h3>
            {/* Detailed procedure information would go here */}
            <div className="text-center text-gray-500 py-12">
              <Stethoscope className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Detailed procedure information coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Transfer Analytics</h3>
            {/* Analytics and charts would go here */}
            <div className="text-center text-gray-500 py-12">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Analytics dashboard coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransferDetailPage; 