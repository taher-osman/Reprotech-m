import React, { useState, useEffect } from 'react';
import { 
  X, 
  TestTube, 
  CheckCircle, 
  AlertTriangle, 
  Calendar,
  User,
  Thermometer,
  Activity,
  BarChart3,
  Target,
  Settings,
  TrendingUp,
  Database,
  FileText,
  Calculator
} from 'lucide-react';

interface QualityControlFormProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
  initialData?: any;
}

interface ControlLimits {
  mean: number;
  standardDeviation: number;
  upperControlLimit: number;
  lowerControlLimit: number;
  upperWarningLimit: number;
  lowerWarningLimit: number;
}

const QualityControlForm: React.FC<QualityControlFormProps> = ({ onSubmit, onClose, initialData }) => {
  const [formData, setFormData] = useState({
    // Basic QC Information
    qcType: '',
    protocolId: '',
    sampleId: '',
    performedBy: '',
    reviewedBy: '',
    performedAt: new Date().toISOString().split('T')[0],
    performedTime: new Date().toTimeString().slice(0, 5),
    
    // Control Material Information
    controlMaterial: '',
    lotNumber: '',
    expiryDate: '',
    manufacturer: '',
    controlLevel: '',
    
    // Measurement Data
    measuredValue: '',
    expectedValue: '',
    units: '',
    measurementUncertainty: '',
    
    // Statistical Process Control
    spcEnabled: false,
    westgardRules: [],
    controlLimits: {
      mean: 0,
      standardDeviation: 0,
      upperControlLimit: 0,
      lowerControlLimit: 0,
      upperWarningLimit: 0,
      lowerWarningLimit: 0
    } as ControlLimits,
    
    // Environmental Conditions
    temperature: '',
    humidity: '',
    pressure: '',
    
    // Equipment Information
    equipmentUsed: '',
    calibrationDate: '',
    maintenanceStatus: 'UP_TO_DATE',
    
    // Quality Assessment
    status: 'PENDING',
    acceptanceCriteria: 'WITHIN_LIMITS',
    deviations: '',
    correctiveActions: '',
    preventiveActions: '',
    
    // Compliance & Documentation
    isoCompliance: true,
    cliaCompliance: true,
    documentationComplete: false,
    approvalRequired: false,
    
    // Additional Information
    comments: '',
    priority: 'NORMAL',
    riskAssessment: 'LOW'
  });

  const [loading, setLoading] = useState(false);
  const [protocols, setProtocols] = useState<any[]>([]);
  const [samples, setSamples] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [controlMaterials, setControlMaterials] = useState<any[]>([]);

  useEffect(() => {
    loadFormData();
    if (initialData) {
      setFormData({ ...formData, ...initialData });
    }
  }, [initialData]);

  const loadFormData = async () => {
    try {
      // Enhanced mock protocols data
      setProtocols([
        { id: '1', protocolName: 'Hematology QC Protocol', protocolCode: 'QC-HEM-001', category: 'HEMATOLOGY' },
        { id: '2', protocolName: 'Chemistry QC Protocol', protocolCode: 'QC-CHEM-001', category: 'CHEMISTRY' },
        { id: '3', protocolName: 'Immunology QC Protocol', protocolCode: 'QC-IMM-001', category: 'IMMUNOLOGY' },
        { id: '4', protocolName: 'Molecular QC Protocol', protocolCode: 'QC-MOL-001', category: 'MOLECULAR' },
        { id: '5', protocolName: 'Equipment Calibration QC', protocolCode: 'QC-CAL-001', category: 'CALIBRATION' }
      ]);

      // Enhanced mock control materials
      setControlMaterials([
        { id: '1', name: 'Normal Control Level 1', manufacturer: 'Bio-Rad', lotNumber: 'LOT-N1-2025', level: 'NORMAL' },
        { id: '2', name: 'Abnormal Control Level 2', manufacturer: 'Bio-Rad', lotNumber: 'LOT-A2-2025', level: 'ABNORMAL' },
        { id: '3', name: 'Pathological Control Level 3', manufacturer: 'Bio-Rad', lotNumber: 'LOT-P3-2025', level: 'PATHOLOGICAL' },
        { id: '4', name: 'Calibration Standard', manufacturer: 'Roche', lotNumber: 'CAL-STD-2025', level: 'STANDARD' }
      ]);

      // Enhanced mock equipment data
      setEquipment([
        { id: '1', name: 'Hematology Analyzer BC-6800', manufacturer: 'Mindray', model: 'BC-6800' },
        { id: '2', name: 'Chemistry Analyzer AU-5800', manufacturer: 'Beckman Coulter', model: 'AU-5800' },
        { id: '3', name: 'PCR Thermal Cycler', manufacturer: 'Applied Biosystems', model: 'T100' },
        { id: '4', name: 'Microscope BX43', manufacturer: 'Olympus', model: 'BX43' }
      ]);

      // Enhanced mock users data
      setUsers([
        { id: '1', firstName: 'Dr. Sarah', lastName: 'Ahmed', role: 'QUALITY_MANAGER', specialization: 'Clinical Chemistry' },
        { id: '2', firstName: 'John', lastName: 'Doe', role: 'LAB_TECH', specialization: 'Hematology' },
        { id: '3', firstName: 'Jane', lastName: 'Smith', role: 'SENIOR_TECH', specialization: 'Immunology' },
        { id: '4', firstName: 'Dr. Ahmad', lastName: 'Ali', role: 'LAB_SUPERVISOR', specialization: 'Molecular Biology' },
        { id: '5', firstName: 'Lisa', lastName: 'Brown', role: 'QC_SPECIALIST', specialization: 'Statistical Analysis' }
      ]);
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  const calculateControlLimits = (mean: number, sd: number): ControlLimits => {
    return {
      mean,
      standardDeviation: sd,
      upperControlLimit: mean + (3 * sd),
      lowerControlLimit: mean - (3 * sd),
      upperWarningLimit: mean + (2 * sd),
      lowerWarningLimit: mean - (2 * sd)
    };
  };

  const evaluateWestgardRules = (value: number, limits: ControlLimits): string[] => {
    const violations = [];
    const { mean, standardDeviation, upperControlLimit, lowerControlLimit, upperWarningLimit, lowerWarningLimit } = limits;
    
    // 1-3s rule (single observation beyond 3 standard deviations)
    if (value > upperControlLimit || value < lowerControlLimit) {
      violations.push('1-3s: Single observation beyond 3σ');
    }
    
    // 1-2s rule (single observation beyond 2 standard deviations - warning)
    if ((value > upperWarningLimit && value <= upperControlLimit) || 
        (value < lowerWarningLimit && value >= lowerControlLimit)) {
      violations.push('1-2s: Single observation beyond 2σ (Warning)');
    }
    
    return violations;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate control limits if SPC is enabled
      let calculatedLimits = formData.controlLimits;
      if (formData.spcEnabled && formData.expectedValue && formData.measurementUncertainty) {
        const mean = parseFloat(formData.expectedValue);
        const sd = parseFloat(formData.measurementUncertainty);
        calculatedLimits = calculateControlLimits(mean, sd);
      }

      // Evaluate Westgard rules if measurement value is provided
      let westgardViolations: string[] = [];
      if (formData.measuredValue && formData.spcEnabled) {
        westgardViolations = evaluateWestgardRules(parseFloat(formData.measuredValue), calculatedLimits);
      }

      const qcData = {
        ...formData,
        qcId: `QC-${Date.now().toString().slice(-6)}`,
        performedAt: new Date(`${formData.performedAt}T${formData.performedTime}`),
        controlLimits: calculatedLimits,
        westgardViolations,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onSubmit(qcData);
      onClose();
    } catch (error) {
      console.error('Error submitting QC record:', error);
    } finally {
      setLoading(false);
    }
  };

  const qcTypes = [
    { value: 'NORMAL_CONTROL', label: 'Normal Control', icon: '🟢', description: 'Normal range control material' },
    { value: 'ABNORMAL_CONTROL', label: 'Abnormal Control', icon: '🟡', description: 'Abnormal range control material' },
    { value: 'PATHOLOGICAL_CONTROL', label: 'Pathological Control', icon: '🔴', description: 'Pathological range control material' },
    { value: 'CALIBRATION', label: 'Equipment Calibration', icon: '⚙️', description: 'Equipment calibration verification' },
    { value: 'BLANK_CONTROL', label: 'Blank Control', icon: '⚪', description: 'Reagent blank or negative control' },
    { value: 'DUPLICATE_ANALYSIS', label: 'Duplicate Analysis', icon: '📋', description: 'Duplicate sample analysis' },
    { value: 'SPIKE_RECOVERY', label: 'Spike Recovery', icon: '🎯', description: 'Spiked sample recovery test' },
    { value: 'PROFICIENCY_TESTING', label: 'Proficiency Testing', icon: '🏆', description: 'External proficiency testing' },
    { value: 'LINEARITY_CHECK', label: 'Linearity Check', icon: '📈', description: 'Analytical measurement range verification' },
    { value: 'CARRYOVER_CHECK', label: 'Carryover Check', icon: '🔄', description: 'Sample carryover assessment' }
  ];

  const statusOptions = [
    { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    { value: 'PASSED', label: 'Passed', color: 'bg-green-100 text-green-800' },
    { value: 'FAILED', label: 'Failed', color: 'bg-red-100 text-red-800' },
    { value: 'WARNING', label: 'Warning', color: 'bg-orange-100 text-orange-800' },
    { value: 'UNDER_REVIEW', label: 'Under Review', color: 'bg-purple-100 text-purple-800' },
    { value: 'APPROVED', label: 'Approved', color: 'bg-emerald-100 text-emerald-800' }
  ];

  const acceptanceCriteriaOptions = [
    { value: 'WITHIN_LIMITS', label: 'Within Control Limits', color: 'text-green-600' },
    { value: 'OUTSIDE_WARNING', label: 'Outside Warning Limits', color: 'text-orange-600' },
    { value: 'OUTSIDE_CONTROL', label: 'Outside Control Limits', color: 'text-red-600' },
    { value: 'TRENDING', label: 'Trending Pattern Detected', color: 'text-purple-600' },
    { value: 'WESTGARD_VIOLATION', label: 'Westgard Rule Violation', color: 'text-red-600' }
  ];

  const westgardRulesOptions = [
    { value: '1_3s', label: '1-3s: Single obs. beyond 3σ', description: 'Random error detection' },
    { value: '2_2s', label: '2-2s: Two consecutive obs. beyond 2σ', description: 'Systematic error detection' },
    { value: '4_1s', label: '4-1s: Four consecutive obs. beyond 1σ', description: 'Systematic error detection' },
    { value: '10x', label: '10x: Ten consecutive obs. on same side', description: 'Systematic error detection' },
    { value: 'R_4s', label: 'R-4s: Range > 4σ', description: 'Random error detection' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">
                  {initialData ? 'Edit QC Record' : '🔬 Advanced Quality Control Record'}
                </h2>
                <p className="text-emerald-100">Statistical Process Control & Compliance Documentation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-emerald-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* QC Type and Protocol Selection */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TestTube className="w-5 h-5 mr-2 text-blue-600" />
              QC Type & Protocol Selection
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QC Type *
                </label>
                <select
                  required
                  value={formData.qcType}
                  onChange={(e) => setFormData({ ...formData, qcType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select QC type...</option>
                  {qcTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label} - {type.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Protocol
                </label>
                <select
                  value={formData.protocolId}
                  onChange={(e) => setFormData({ ...formData, protocolId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select protocol...</option>
                  {protocols.map(protocol => (
                    <option key={protocol.id} value={protocol.id}>
                      {protocol.protocolCode} - {protocol.protocolName} ({protocol.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Control Material Information */}
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2 text-purple-600" />
              Control Material Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Control Material *
                </label>
                <select
                  required
                  value={formData.controlMaterial}
                  onChange={(e) => setFormData({ ...formData, controlMaterial: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select control material...</option>
                  {controlMaterials.map(material => (
                    <option key={material.id} value={material.id}>
                      {material.name} ({material.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lot Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lotNumber}
                  onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="LOT-XXXX-YYYY"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer
                </label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Bio-Rad, Roche"
                />
              </div>
            </div>
          </div>

          {/* Measurement Data and SPC */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                Measurement Data & Statistical Process Control
              </h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.spcEnabled}
                  onChange={(e) => setFormData({ ...formData, spcEnabled: e.target.checked })}
                  className="mr-2 rounded focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">Enable SPC Analysis</span>
              </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Measured Value *
                </label>
                <input
                  type="number"
                  step="0.0001"
                  required
                  value={formData.measuredValue}
                  onChange={(e) => setFormData({ ...formData, measuredValue: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Value
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.expectedValue}
                  onChange={(e) => setFormData({ ...formData, expectedValue: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Units
                </label>
                <input
                  type="text"
                  value={formData.units}
                  onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="mg/dL, g/L, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Standard Deviation
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.measurementUncertainty}
                  onChange={(e) => setFormData({ ...formData, measurementUncertainty: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Acceptance Criteria
                </label>
                <select
                  value={formData.acceptanceCriteria}
                  onChange={(e) => setFormData({ ...formData, acceptanceCriteria: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {acceptanceCriteriaOptions.map(criteria => (
                    <option key={criteria.value} value={criteria.value}>
                      {criteria.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Westgard Rules Selection */}
            {formData.spcEnabled && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-green-300">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Calculator className="w-4 h-4 mr-2 text-green-600" />
                  Westgard Rules Configuration
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {westgardRulesOptions.map(rule => (
                    <label key={rule.value} className="flex items-start p-2 border border-gray-200 rounded">
                      <input
                        type="checkbox"
                        checked={formData.westgardRules.includes(rule.value)}
                        onChange={(e) => {
                          const newRules = e.target.checked
                            ? [...formData.westgardRules, rule.value]
                            : formData.westgardRules.filter(r => r !== rule.value);
                          setFormData({ ...formData, westgardRules: newRules });
                        }}
                        className="mr-2 mt-1 rounded focus:ring-green-500"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{rule.label}</div>
                        <div className="text-xs text-gray-500">{rule.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Equipment and Environmental Conditions */}
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-yellow-600" />
              Equipment & Environmental Conditions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment Used
                </label>
                <select
                  value={formData.equipmentUsed}
                  onChange={(e) => setFormData({ ...formData, equipmentUsed: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Select equipment...</option>
                  {equipment.map(eq => (
                    <option key={eq.id} value={eq.id}>
                      {eq.name} - {eq.model}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="22.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Humidity (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.humidity}
                  onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="45.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pressure (kPa)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.pressure}
                  onChange={(e) => setFormData({ ...formData, pressure: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="101.3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Calibration
                </label>
                <input
                  type="date"
                  value={formData.calibrationDate}
                  onChange={(e) => setFormData({ ...formData, calibrationDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
          </div>

          {/* Personnel and Timing */}
          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-indigo-600" />
              Personnel & Timing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Performed By *
                </label>
                <select
                  required
                  value={formData.performedBy}
                  onChange={(e) => setFormData({ ...formData, performedBy: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select performer...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.role}) - {user.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reviewed By
                </label>
                <select
                  value={formData.reviewedBy}
                  onChange={(e) => setFormData({ ...formData, reviewedBy: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select reviewer...</option>
                  {users.filter(u => u.role === 'QUALITY_MANAGER' || u.role === 'LAB_SUPERVISOR').map(user => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Performed *
                </label>
                <input
                  type="date"
                  required
                  value={formData.performedAt}
                  onChange={(e) => setFormData({ ...formData, performedAt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Performed *
                </label>
                <input
                  type="time"
                  required
                  value={formData.performedTime}
                  onChange={(e) => setFormData({ ...formData, performedTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Quality Assessment and Actions */}
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
              Quality Assessment & Corrective Actions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {statusOptions.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Risk Assessment
                </label>
                <select
                  value={formData.riskAssessment}
                  onChange={(e) => setFormData({ ...formData, riskAssessment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="LOW">Low Risk</option>
                  <option value="MEDIUM">Medium Risk</option>
                  <option value="HIGH">High Risk</option>
                  <option value="CRITICAL">Critical Risk</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deviations Observed
                </label>
                <textarea
                  value={formData.deviations}
                  onChange={(e) => setFormData({ ...formData, deviations: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Describe any deviations from expected results..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Corrective Actions
                  </label>
                  <textarea
                    value={formData.correctiveActions}
                    onChange={(e) => setFormData({ ...formData, correctiveActions: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Actions taken to correct the issue..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preventive Actions
                  </label>
                  <textarea
                    value={formData.preventiveActions}
                    onChange={(e) => setFormData({ ...formData, preventiveActions: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Actions to prevent recurrence..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Compliance and Documentation */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-gray-600" />
              Compliance & Documentation
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isoCompliance}
                    onChange={(e) => setFormData({ ...formData, isoCompliance: e.target.checked })}
                    className="mr-3 rounded focus:ring-gray-500"
                  />
                  <span className="text-sm font-medium text-gray-700">ISO 15189 Compliance Verified</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.cliaCompliance}
                    onChange={(e) => setFormData({ ...formData, cliaCompliance: e.target.checked })}
                    className="mr-3 rounded focus:ring-gray-500"
                  />
                  <span className="text-sm font-medium text-gray-700">CLIA Standards Met</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.documentationComplete}
                    onChange={(e) => setFormData({ ...formData, documentationComplete: e.target.checked })}
                    className="mr-3 rounded focus:ring-gray-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Documentation Complete</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.approvalRequired}
                    onChange={(e) => setFormData({ ...formData, approvalRequired: e.target.checked })}
                    className="mr-3 rounded focus:ring-gray-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Requires Supervisor Approval</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Comments
                </label>
                <textarea
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="Additional observations, notes, or comments..."
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-md hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating QC Record...
                </div>
              ) : (
                'Create QC Record'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QualityControlForm; 