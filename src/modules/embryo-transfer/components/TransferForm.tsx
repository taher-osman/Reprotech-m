import React, { useState, useEffect } from 'react';
import { X, Save, Heart, Calendar, Users, Stethoscope, AlertCircle } from 'lucide-react';
import { addDays } from 'date-fns';
import { TransferRecord, PregnancyCheckpoint, PregnancyTracking } from '../types/transferTypes';
import api from '../services/api';

interface TransferFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transfer?: TransferRecord | null;
  mode: 'create' | 'edit';
}

interface Animal {
  id: string;
  name: string;
  animalID: string;
  species: string;
  breed: string;
  sex: 'MALE' | 'FEMALE';
  age?: number;
  weight?: number;
}

interface Embryo {
  id: string;
  embryoId: string;
  grade: string;
  stage: string;
  donorName: string;
  sireName: string;
}

const TransferForm: React.FC<TransferFormProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  transfer, 
  mode 
}) => {
  const [loading, setLoading] = useState(false);
  const [recipients, setRecipients] = useState<Animal[]>([]);
  const [embryos, setEmbryos] = useState<Embryo[]>([]);
  const [technicians, setTechnicians] = useState<string[]>([]);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const [formData, setFormData] = useState({
    embryoId: '',
    recipientId: '',
    transferDate: new Date().toISOString().split('T')[0],
    transferTime: '09:00',
    veterinarian: '',
    technician: '',
    transferMethod: 'NON_SURGICAL_CERVICAL',
    transferSite: 'LEFT_HORN',
    embryoGrade: 'A',
    embryoStage: 'BLASTOCYST',
    synchronizationProtocol: 'CIDR_PGF',
    cervixCondition: 'GOOD',
    transferDifficulty: 'EASY',
    specialNotes: '',
    sedation: false,
    antibiotics: false,
    progesterone: true
  });

  useEffect(() => {
    if (isOpen) {
      loadFormData();
      if (transfer && mode === 'edit') {
        setFormData({
          embryoId: transfer.embryoId,
          recipientId: transfer.recipientId,
          transferDate: transfer.transferDate.toString().split('T')[0],
          transferTime: transfer.transferTime,
          veterinarian: transfer.veterinarian,
          technician: transfer.technician,
          transferMethod: transfer.transferMethod,
          transferSite: transfer.transferSite,
          embryoGrade: transfer.embryoGrade,
          embryoStage: transfer.embryoStage,
          synchronizationProtocol: transfer.synchronizationProtocol,
          cervixCondition: transfer.cervixCondition,
          transferDifficulty: transfer.transferDifficulty,
          specialNotes: transfer.specialNotes,
          sedation: transfer.sedation,
          antibiotics: transfer.antibiotics,
          progesterone: transfer.progesterone
        });
      }
    }
  }, [isOpen, transfer, mode]);

  const loadFormData = async () => {
    try {
      setLoading(true);
      
      // Load available recipients (female animals)
      const recipientsRes = await api.get('/animals?sex=FEMALE&status=AVAILABLE');
      setRecipients(recipientsRes?.data || []);
      
      // Load available embryos
      const embryosRes = await api.get('/embryos?status=AVAILABLE');
      setEmbryos(embryosRes?.data || []);
      
      // Set default technicians
      setTechnicians([
        'Dr. Sarah Ahmed',
        'Dr. Ahmad Ali', 
        'Dr. Fatima Hassan',
        'Dr. Omar Abdullah'
      ]);
      
    } catch (error) {
      console.error('Error loading form data:', error);
      // Set mock data for demonstration
      setRecipients([
        { id: '1', name: 'Recipient 1', animalID: 'RT-R-001234', species: 'BOVINE', breed: 'Holstein', sex: 'FEMALE', age: 3, weight: 450 },
        { id: '2', name: 'Recipient 2', animalID: 'RT-R-001235', species: 'BOVINE', breed: 'Angus', sex: 'FEMALE', age: 4, weight: 480 },
        { id: '3', name: 'Recipient 3', animalID: 'RT-R-001236', species: 'BOVINE', breed: 'Jersey', sex: 'FEMALE', age: 2, weight: 380 }
      ]);
      
      setEmbryos([
        { id: '1', embryoId: 'EMB-001', grade: 'A', stage: 'BLASTOCYST', donorName: 'Elite Donor 1', sireName: 'Champion Sire 1' },
        { id: '2', embryoId: 'EMB-002', grade: 'B', stage: 'EXPANDED_BLASTOCYST', donorName: 'Elite Donor 2', sireName: 'Champion Sire 2' },
        { id: '3', embryoId: 'EMB-003', grade: 'A', stage: 'MORULA', donorName: 'Elite Donor 3', sireName: 'Champion Sire 1' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Generate pregnancy checkpoints with scheduled follow-ups
  const generatePregnancyCheckpoints = (transferDate: Date): PregnancyCheckpoint[] => {
    const checkpoints: PregnancyCheckpoint[] = [
      {
        id: 'check15',
        title: 'Day 15 Pregnancy Check',
        scheduledDate: addDays(transferDate, 15),
        performed: false,
        result: 'UNKNOWN',
        notes: '',
        daysFromTransfer: 15,
        isParturition: false
      },
      {
        id: 'check30',
        title: 'Day 30 Pregnancy Check',
        scheduledDate: addDays(transferDate, 30),
        performed: false,
        result: 'UNKNOWN',
        notes: '',
        daysFromTransfer: 30,
        isParturition: false
      },
      {
        id: 'check45',
        title: 'Day 45 Pregnancy Check',
        scheduledDate: addDays(transferDate, 45),
        performed: false,
        result: 'UNKNOWN',
        notes: '',
        daysFromTransfer: 45,
        isParturition: false
      },
      {
        id: 'check60',
        title: 'Day 60 Pregnancy Check',
        scheduledDate: addDays(transferDate, 60),
        performed: false,
        result: 'UNKNOWN',
        notes: '',
        daysFromTransfer: 60,
        isParturition: false
      },
      {
        id: 'parturition',
        title: 'Parturition',
        scheduledDate: addDays(transferDate, 330), // ~330 days gestation
        expectedDate: addDays(transferDate, 330),
        performed: false,
        result: 'UNKNOWN',
        notes: '',
        daysFromTransfer: 330,
        isParturition: true
      }
    ];

    return checkpoints;
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.embryoId) newErrors.embryoId = 'Embryo selection is required';
    if (!formData.recipientId) newErrors.recipientId = 'Recipient selection is required';
    if (!formData.transferDate) newErrors.transferDate = 'Transfer date is required';
    if (!formData.veterinarian.trim()) newErrors.veterinarian = 'Veterinarian is required';
    if (!formData.technician.trim()) newErrors.technician = 'Technician is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const selectedEmbryo = embryos.find(e => e.id === formData.embryoId);
      const selectedRecipient = recipients.find(r => r.id === formData.recipientId);
      const transferDate = new Date(formData.transferDate);
      
      // Generate pregnancy checkpoints for new transfers
      const pregnancyCheckpoints = mode === 'create' 
        ? generatePregnancyCheckpoints(transferDate)
        : transfer?.pregnancyTracking?.checkpoints || [];
      
      // Create pregnancy tracking object
      const pregnancyTracking: PregnancyTracking = {
        checkpoints: pregnancyCheckpoints,
        currentStatus: 'PENDING',
        nextCheckDate: pregnancyCheckpoints.length > 0 ? pregnancyCheckpoints[0].scheduledDate : undefined,
        expectedDeliveryDate: addDays(transferDate, 330),
        pregnancyRate: 0 // Will be calculated by analytics
      };
      
      const transferData = {
        ...formData,
        transferId: `ET-${Date.now()}`,
        internalNumber: `RT-ET-${Date.now().toString().slice(-6)}`,
        recipientName: selectedRecipient?.name,
        recipientInternalNumber: selectedRecipient?.animalID,
        donorName: selectedEmbryo?.donorName,
        sireName: selectedEmbryo?.sireName,
        pregnancyTracking,
        status: 'SCHEDULED',
        pregnancyStatus: 'PENDING',
        createdAt: new Date(),
        createdBy: 'Current User'
      };

      if (mode === 'create') {
        await api.createTransfer(transferData);
      } else {
        await api.updateTransfer(transfer!.id, transferData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving transfer:', error);
      alert('Failed to save transfer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Heart className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'edit' ? 'Edit Embryo Transfer' : 'New Embryo Transfer'}
              </h2>
              <p className="text-sm text-gray-600">
                Schedule and manage embryo transfer procedure
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Embryo & Recipient Selection */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-blue-600" />
              Embryo & Recipient Selection
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Embryo *
                </label>
                <select
                  value={formData.embryoId}
                  onChange={(e) => handleChange('embryoId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.embryoId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select embryo</option>
                  {embryos.map(embryo => (
                    <option key={embryo.id} value={embryo.id}>
                      {embryo.embryoId} - Grade {embryo.grade} ({embryo.stage})
                    </option>
                  ))}
                </select>
                {errors.embryoId && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.embryoId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient *
                </label>
                <select
                  value={formData.recipientId}
                  onChange={(e) => handleChange('recipientId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    errors.recipientId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select recipient</option>
                  {recipients.map(recipient => (
                    <option key={recipient.id} value={recipient.id}>
                      {recipient.name} ({recipient.animalID}) - {recipient.breed}
                    </option>
                  ))}
                </select>
                {errors.recipientId && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.recipientId}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Procedure Details */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Procedure Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transfer Date *
                </label>
                <input
                  type="date"
                  value={formData.transferDate}
                  onChange={(e) => handleChange('transferDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    errors.transferDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.transferDate && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.transferDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transfer Time
                </label>
                <input
                  type="time"
                  value={formData.transferTime}
                  onChange={(e) => handleChange('transferTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transfer Method
                </label>
                <select
                  value={formData.transferMethod}
                  onChange={(e) => handleChange('transferMethod', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="SURGICAL">Surgical</option>
                  <option value="NON_SURGICAL_CERVICAL">Non-Surgical Cervical</option>
                  <option value="NON_SURGICAL_TRANSCERVICAL">Non-Surgical Transcervical</option>
                </select>
              </div>
            </div>
          </div>

          {/* Staff Assignment */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-600" />
              Staff Assignment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Veterinarian *
                </label>
                <input
                  type="text"
                  value={formData.veterinarian}
                  onChange={(e) => handleChange('veterinarian', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                    errors.veterinarian ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter veterinarian name"
                />
                {errors.veterinarian && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.veterinarian}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technician *
                </label>
                <select
                  value={formData.technician}
                  onChange={(e) => handleChange('technician', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                    errors.technician ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select technician</option>
                  {technicians.map(tech => (
                    <option key={tech} value={tech}>
                      {tech}
                    </option>
                  ))}
                </select>
                {errors.technician && (
                  <p className="text-red-500 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.technician}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Transfer Site
              </label>
              <select
                value={formData.transferSite}
                onChange={(e) => handleChange('transferSite', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="LEFT_HORN">Left Horn</option>
                <option value="RIGHT_HORN">Right Horn</option>
                <option value="UTERINE_BODY">Uterine Body</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Synchronization Protocol
              </label>
              <select
                value={formData.synchronizationProtocol}
                onChange={(e) => handleChange('synchronizationProtocol', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="CIDR_PGF">CIDR + PGF</option>
                <option value="OVSYNCH">Ovsynch</option>
                <option value="HEATSYNCH">Heatsynch</option>
                <option value="COSYNCH">Cosynch</option>
                <option value="NATURAL_CYCLE">Natural Cycle</option>
              </select>
            </div>
          </div>

          {/* Treatments */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Stethoscope className="h-5 w-5 mr-2 text-yellow-600" />
              Treatments & Medications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.sedation}
                  onChange={(e) => handleChange('sedation', e.target.checked)}
                  className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                />
                <span className="text-sm font-medium text-gray-700">Sedation</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.antibiotics}
                  onChange={(e) => handleChange('antibiotics', e.target.checked)}
                  className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                />
                <span className="text-sm font-medium text-gray-700">Antibiotics</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.progesterone}
                  onChange={(e) => handleChange('progesterone', e.target.checked)}
                  className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                />
                <span className="text-sm font-medium text-gray-700">Progesterone</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Notes
            </label>
            <textarea
              value={formData.specialNotes}
              onChange={(e) => handleChange('specialNotes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Any special instructions or observations..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-pink-600 border border-transparent rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : mode === 'edit' ? 'Update Transfer' : 'Create Transfer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransferForm; 