import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Microscope, User, Settings, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { 
  OPUSessionFormData, 
  OPUSessionUpdateData, 
  ANESTHESIA_TYPES, 
  NEEDLE_GAUGES, 
  MEDIA_TYPES, 
  DEFAULT_PROTOCOLS,
  Animal,
  Operator,
  OPUSession 
} from '../types/opuTypes';

interface OPUFormProps {
  session?: OPUSession;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OPUSessionFormData | OPUSessionUpdateData) => void;
  mode: 'create' | 'edit' | 'complete';
  loading?: boolean;
}

const OPUForm: React.FC<OPUFormProps> = ({
  session,
  isOpen,
  onClose,
  onSubmit,
  mode,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<OPUSessionFormData>({
    donorId: '',
    sessionDate: new Date().toISOString().split('T')[0],
    protocolId: '',
    anesthesiaUsed: 'SEDATION',
    operatorId: '',
    technicianId: '',
    preUltrasoundDate: '',
    folliclesObserved: 0,
    dominantFollicles: 0,
    mediumFollicles: 0,
    smallFollicles: 0,
    sessionStartTime: '',
    mediaUsed: 'HEPES-buffered TCM-199',
    needleGauge: '18G',
    aspirationPressure: 60,
    flushingVolume: 10,
    autoCreateSamples: true,
    nextSessionDate: '',
    notes: ''
  });

  const [resultData, setResultData] = useState<Partial<OPUSessionUpdateData>>({
    sessionEndTime: '',
    oocytesRetrieved: 0,
    oocytesGradeA: 0,
    oocytesGradeB: 0,
    oocytesGradeC: 0,
    oocytesDegenerated: 0,
    cumulusComplexes: 0,
    status: 'COMPLETED',
    sessionResult: 'GOOD',
    complications: '',
    notes: '',
    recoveryTime: 7
  });

  // Mock data - TODO: Replace with actual API calls
  const [animals] = useState<Animal[]>(Array.from({ length: 50 }, (_, i) => ({
    id: (i + 1).toString(),
    animalID: `BV-2025-${(i + 1).toString().padStart(3, '0')}`,
    name: `Donor ${i + 1}`,
    species: 'Holstein',
    sex: 'FEMALE',
    age: Math.floor(Math.random() * 10) + 2,
    status: 'ACTIVE'
  })));

  const [operators] = useState<Operator[]>([
    { id: '1', name: 'Dr. Sarah Ahmed', role: 'VETERINARIAN', specialization: 'Reproduction', active: true },
    { id: '2', name: 'Dr. Ahmad Ali', role: 'VETERINARIAN', specialization: 'OPU Specialist', active: true },
    { id: '3', name: 'Tech. Fatima Hassan', role: 'TECHNICIAN', specialization: 'Laboratory', active: true },
    { id: '4', name: 'Dr. Omar Abdullah', role: 'SPECIALIST', specialization: 'IVF', active: true }
  ]);

  useEffect(() => {
    if (session && (mode === 'edit' || mode === 'complete')) {
      setFormData({
        donorId: session.donorId,
        sessionDate: session.sessionDate,
        protocolId: session.protocolId,
        anesthesiaUsed: session.anesthesiaUsed,
        operatorId: session.operatorId,
        technicianId: session.technicianId || '',
        preUltrasoundDate: session.preUltrasoundDate || '',
        folliclesObserved: session.folliclesObserved,
        dominantFollicles: session.dominantFollicles,
        mediumFollicles: session.mediumFollicles,
        smallFollicles: session.smallFollicles,
        sessionStartTime: session.sessionStartTime,
        mediaUsed: session.mediaUsed,
        needleGauge: session.needleGauge,
        aspirationPressure: session.aspirationPressure,
        flushingVolume: session.flushingVolume,
        autoCreateSamples: session.autoCreateSamples,
        nextSessionDate: session.nextSessionDate || '',
        notes: session.notes || ''
      });

      if (mode === 'complete') {
        setResultData({
          sessionEndTime: new Date().toTimeString().slice(0, 5),
          oocytesRetrieved: session.oocytesRetrieved || 0,
          oocytesGradeA: session.oocytesGradeA || 0,
          oocytesGradeB: session.oocytesGradeB || 0,
          oocytesGradeC: session.oocytesGradeC || 0,
          oocytesDegenerated: session.oocytesDegenerated || 0,
          cumulusComplexes: session.cumulusComplexes || 0,
          status: 'COMPLETED',
          sessionResult: 'GOOD',
          complications: session.complications || '',
          notes: session.notes || '',
          recoveryTime: session.recoveryTime || 7
        });
      }
    }
  }, [session, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'complete') {
      onSubmit(resultData as OPUSessionUpdateData);
    } else {
      onSubmit(formData);
    }
  };

  const calculateTotalOocytes = () => {
    return (resultData.oocytesGradeA || 0) + 
           (resultData.oocytesGradeB || 0) + 
           (resultData.oocytesGradeC || 0) + 
           (resultData.oocytesDegenerated || 0);
  };

  const calculateSuccessRate = () => {
    const total = calculateTotalOocytes();
    const viable = (resultData.oocytesGradeA || 0) + (resultData.oocytesGradeB || 0);
    return total > 0 ? ((viable / total) * 100).toFixed(1) : '0';
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <User className="h-4 w-4" /> },
    { id: 'procedure', label: 'Procedure', icon: <Microscope className="h-4 w-4" /> },
    { id: 'follicles', label: 'Follicles', icon: <Zap className="h-4 w-4" /> },
    ...(mode === 'complete' ? [{ id: 'results', label: 'Results', icon: <CheckCircle2 className="h-4 w-4" /> }] : [])
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'create' ? '🥚 New OPU Session' : 
               mode === 'edit' ? '✏️ Edit OPU Session' : 
               '✅ Complete OPU Session'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {mode === 'create' ? 'Schedule a new ovum pick-up session' :
               mode === 'edit' ? 'Modify session details' :
               'Record session results and create samples'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Donor Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Donor Animal <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.donorId}
                    onChange={(e) => setFormData({ ...formData, donorId: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={mode === 'complete'}
                  >
                    <option value="">Select Donor</option>
                    {animals.filter(a => a.sex === 'FEMALE').map((animal) => (
                      <option key={animal.id} value={animal.id}>
                        {animal.animalID} - {animal.name} ({animal.species}, {animal.age}y)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Session Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.sessionDate}
                      onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={mode === 'complete'}
                    />
                  </div>
                </div>

                {/* Protocol */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OPU Protocol <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.protocolId}
                    onChange={(e) => setFormData({ ...formData, protocolId: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={mode === 'complete'}
                  >
                    <option value="">Select Protocol</option>
                    {DEFAULT_PROTOCOLS.map((protocol, index) => (
                      <option key={index} value={protocol}>
                        {protocol}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Anesthesia */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Anesthesia Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.anesthesiaUsed}
                    onChange={(e) => setFormData({ ...formData, anesthesiaUsed: e.target.value as any })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={mode === 'complete'}
                  >
                    {ANESTHESIA_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0) + type.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Operator */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Operator <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.operatorId}
                    onChange={(e) => setFormData({ ...formData, operatorId: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={mode === 'complete'}
                  >
                    <option value="">Select Operator</option>
                    {operators.filter(op => op.role === 'VETERINARIAN' || op.role === 'SPECIALIST').map((operator) => (
                      <option key={operator.id} value={operator.id}>
                        {operator.name} ({operator.specialization})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Technician */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assistant Technician
                  </label>
                  <select
                    value={formData.technicianId}
                    onChange={(e) => setFormData({ ...formData, technicianId: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={mode === 'complete'}
                  >
                    <option value="">Select Technician (Optional)</option>
                    {operators.filter(op => op.role === 'TECHNICIAN').map((operator) => (
                      <option key={operator.id} value={operator.id}>
                        {operator.name} ({operator.specialization})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'procedure' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Session Start Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Start Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="time"
                      value={formData.sessionStartTime}
                      onChange={(e) => setFormData({ ...formData, sessionStartTime: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      disabled={mode === 'complete'}
                    />
                  </div>
                </div>

                {/* Media Used */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Collection Medium <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.mediaUsed}
                    onChange={(e) => setFormData({ ...formData, mediaUsed: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={mode === 'complete'}
                  >
                    {MEDIA_TYPES.map((media) => (
                      <option key={media} value={media}>
                        {media}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Needle Gauge */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Needle Gauge <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.needleGauge}
                    onChange={(e) => setFormData({ ...formData, needleGauge: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={mode === 'complete'}
                  >
                    {NEEDLE_GAUGES.map((gauge) => (
                      <option key={gauge} value={gauge}>
                        {gauge}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Aspiration Pressure */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aspiration Pressure (mmHg) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.aspirationPressure}
                    onChange={(e) => setFormData({ ...formData, aspirationPressure: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="40"
                    max="100"
                    required
                    disabled={mode === 'complete'}
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 60-80 mmHg</p>
                </div>

                {/* Flushing Volume */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Flushing Volume (ml) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.flushingVolume}
                    onChange={(e) => setFormData({ ...formData, flushingVolume: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="5"
                    max="50"
                    required
                    disabled={mode === 'complete'}
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 10-20 ml per follicle</p>
                </div>

                {/* Auto-Create Samples */}
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.autoCreateSamples}
                      onChange={(e) => setFormData({ ...formData, autoCreateSamples: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={mode === 'complete'}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Auto-create oocyte samples
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Automatically generate sample records in Sample Management module
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'follicles' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Pre-procedure Ultrasound Assessment</h3>
                <p className="text-sm text-blue-700">
                  Record follicle counts from pre-OPU ultrasound examination
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pre-ultrasound Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pre-ultrasound Date
                  </label>
                  <input
                    type="date"
                    value={formData.preUltrasoundDate}
                    onChange={(e) => setFormData({ ...formData, preUltrasoundDate: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={mode === 'complete'}
                  />
                </div>

                {/* Total Follicles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Follicles Observed <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.folliclesObserved}
                    onChange={(e) => setFormData({ ...formData, folliclesObserved: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    required
                    disabled={mode === 'complete'}
                  />
                </div>

                {/* Dominant Follicles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dominant Follicles (≥15mm)
                  </label>
                  <input
                    type="number"
                    value={formData.dominantFollicles}
                    onChange={(e) => setFormData({ ...formData, dominantFollicles: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    disabled={mode === 'complete'}
                  />
                </div>

                {/* Medium Follicles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medium Follicles (8-14mm)
                  </label>
                  <input
                    type="number"
                    value={formData.mediumFollicles}
                    onChange={(e) => setFormData({ ...formData, mediumFollicles: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    disabled={mode === 'complete'}
                  />
                </div>

                {/* Small Follicles */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Small Follicles (3-7mm)
                  </label>
                  <input
                    type="number"
                    value={formData.smallFollicles}
                    onChange={(e) => setFormData({ ...formData, smallFollicles: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    disabled={mode === 'complete'}
                  />
                </div>

                {/* Next Session Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Next Scheduled Session
                  </label>
                  <input
                    type="date"
                    value={formData.nextSessionDate}
                    onChange={(e) => setFormData({ ...formData, nextSessionDate: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={mode === 'complete'}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Additional notes about the session..."
                  disabled={mode === 'complete'}
                />
              </div>
            </div>
          )}

          {activeTab === 'results' && mode === 'complete' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Session Results</h3>
                <p className="text-sm text-green-700">
                  Record the final results of the OPU session
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Session End Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session End Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="time"
                      value={resultData.sessionEndTime}
                      onChange={(e) => setResultData({ ...resultData, sessionEndTime: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                {/* Recovery Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recovery Period (days)
                  </label>
                  <input
                    type="number"
                    value={resultData.recoveryTime}
                    onChange={(e) => setResultData({ ...resultData, recoveryTime: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="1"
                    max="30"
                  />
                </div>

                {/* Grade A Oocytes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade A Oocytes
                  </label>
                  <input
                    type="number"
                    value={resultData.oocytesGradeA}
                    onChange={(e) => setResultData({ ...resultData, oocytesGradeA: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Excellent quality, multiple layers of cumulus cells</p>
                </div>

                {/* Grade B Oocytes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade B Oocytes
                  </label>
                  <input
                    type="number"
                    value={resultData.oocytesGradeB}
                    onChange={(e) => setResultData({ ...resultData, oocytesGradeB: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Good quality, complete cumulus investment</p>
                </div>

                {/* Grade C Oocytes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade C Oocytes
                  </label>
                  <input
                    type="number"
                    value={resultData.oocytesGradeC}
                    onChange={(e) => setResultData({ ...resultData, oocytesGradeC: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Fair quality, partial cumulus investment</p>
                </div>

                {/* Degenerated Oocytes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Degenerated Oocytes
                  </label>
                  <input
                    type="number"
                    value={resultData.oocytesDegenerated}
                    onChange={(e) => setResultData({ ...resultData, oocytesDegenerated: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Poor quality, fragmented or atretic</p>
                </div>

                {/* Cumulus Complexes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cumulus Complexes
                  </label>
                  <input
                    type="number"
                    value={resultData.cumulusComplexes}
                    onChange={(e) => setResultData({ ...resultData, cumulusComplexes: Number(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                  />
                </div>

                {/* Session Result */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overall Session Result <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={resultData.sessionResult}
                    onChange={(e) => setResultData({ ...resultData, sessionResult: e.target.value as any })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  >
                    <option value="EXCELLENT">Excellent (&gt;15 Grade A+B oocytes)</option>
                    <option value="GOOD">Good (8-15 Grade A+B oocytes)</option>
                    <option value="FAIR">Fair (4-7 Grade A+B oocytes)</option>
                    <option value="POOR">Poor (1-3 Grade A+B oocytes)</option>
                    <option value="FAILED">Failed (0 viable oocytes)</option>
                  </select>
                </div>
              </div>

              {/* Results Summary */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Session Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{calculateTotalOocytes()}</div>
                    <div className="text-sm text-gray-600">Total Oocytes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {(resultData.oocytesGradeA || 0) + (resultData.oocytesGradeB || 0)}
                    </div>
                    <div className="text-sm text-gray-600">Viable (A+B)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{calculateSuccessRate()}%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{resultData.cumulusComplexes || 0}</div>
                    <div className="text-sm text-gray-600">Cumulus Complexes</div>
                  </div>
                </div>
              </div>

              {/* Complications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complications
                </label>
                <textarea
                  value={resultData.complications}
                  onChange={(e) => setResultData({ ...resultData, complications: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows={3}
                  placeholder="Note any complications or unusual observations..."
                />
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              disabled={loading}
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              <span>
                {mode === 'create' ? 'Schedule Session' : 
                 mode === 'edit' ? 'Save Changes' : 
                 'Complete Session'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OPUForm; 