import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Settings, 
  Workflow, 
  Save, 
  X,
  ChevronDown,
  ChevronRight,
  Edit,
  Copy
} from 'lucide-react';
import { 
  WorkflowTemplate, 
  WorkflowStep, 
  WorkflowAction 
} from '../types/workflowTypes';

interface WorkflowTemplateCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Omit<WorkflowTemplate, 'id'>) => void;
  editingTemplate?: WorkflowTemplate;
}

export const WorkflowTemplateCreator: React.FC<WorkflowTemplateCreatorProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTemplate
}) => {
  // Form state for workflow template
  const [templateData, setTemplateData] = useState<Omit<WorkflowTemplate, 'id'>>({
    name: editingTemplate?.name || '',
    description: editingTemplate?.description || '',
    category: editingTemplate?.category || 'CUSTOM',
    applicableRoles: editingTemplate?.applicableRoles || ['ALL'],
    applicableSpecies: editingTemplate?.applicableSpecies || ['ALL'],
    steps: editingTemplate?.steps || [],
    startingStep: editingTemplate?.startingStep || '',
    maxDuration: editingTemplate?.maxDuration || 21,
    priority: editingTemplate?.priority || 'MEDIUM',
    autoStart: editingTemplate?.autoStart || false,
    expectedSuccessRate: editingTemplate?.expectedSuccessRate || 80,
    averageDuration: editingTemplate?.averageDuration || 14,
    createdBy: editingTemplate?.createdBy || 'Current User',
    createdAt: editingTemplate?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: editingTemplate?.version || '1.0',
    isActive: editingTemplate?.isActive !== undefined ? editingTemplate.isActive : true,
    usageCount: editingTemplate?.usageCount || 0,
    successCount: editingTemplate?.successCount || 0
  });

  const [currentStep, setCurrentStep] = useState<Partial<WorkflowStep>>({
    name: '',
    description: '',
    stepType: 'EXAM',
    order: templateData.steps.length + 1,
    onStartActions: [],
    onSuccessActions: [],
    onFailureActions: [],
    estimatedDuration: 1,
    isManualStep: false,
    displayInDashboard: true,
    notificationRequired: false
  });

  const [showStepForm, setShowStepForm] = useState(false);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);

  // Reset form when modal opens/closes or editing template changes
  useEffect(() => {
    if (isOpen) {
      setTemplateData({
        name: editingTemplate?.name || '',
        description: editingTemplate?.description || '',
        category: editingTemplate?.category || 'CUSTOM',
        applicableRoles: editingTemplate?.applicableRoles || ['ALL'],
        applicableSpecies: editingTemplate?.applicableSpecies || ['ALL'],
        steps: editingTemplate?.steps || [],
        startingStep: editingTemplate?.startingStep || '',
        maxDuration: editingTemplate?.maxDuration || 21,
        priority: editingTemplate?.priority || 'MEDIUM',
        autoStart: editingTemplate?.autoStart || false,
        expectedSuccessRate: editingTemplate?.expectedSuccessRate || 80,
        averageDuration: editingTemplate?.averageDuration || 14,
        createdBy: editingTemplate?.createdBy || 'Current User',
        createdAt: editingTemplate?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: editingTemplate?.version || '1.0',
        isActive: editingTemplate?.isActive !== undefined ? editingTemplate.isActive : true,
        usageCount: editingTemplate?.usageCount || 0,
        successCount: editingTemplate?.successCount || 0
      });

      setCurrentStep({
        name: '',
        description: '',
        stepType: 'EXAM',
        order: (editingTemplate?.steps?.length || 0) + 1,
        onStartActions: [],
        onSuccessActions: [],
        onFailureActions: [],
        estimatedDuration: 1,
        isManualStep: false,
        displayInDashboard: true,
        notificationRequired: false
      });

      setShowStepForm(false);
      setEditingStepIndex(null);
    }
  }, [isOpen, editingTemplate]);

  // Update template field
  const updateTemplate = (field: keyof typeof templateData, value: any) => {
    setTemplateData(prev => ({ ...prev, [field]: value }));
  };

  // Update step field
  const updateStep = (field: keyof WorkflowStep, value: any) => {
    setCurrentStep(prev => ({ ...prev, [field]: value }));
  };

  // Add or update step
  const saveStep = () => {
    if (!currentStep.name || !currentStep.description) return;

    const stepToSave: WorkflowStep = {
      id: editingStepIndex !== null ? templateData.steps[editingStepIndex].id : `step-${Date.now()}`,
      name: currentStep.name!,
      description: currentStep.description!,
      stepType: currentStep.stepType!,
      order: currentStep.order!,
      onStartActions: currentStep.onStartActions || [],
      onSuccessActions: currentStep.onSuccessActions || [],
      onFailureActions: currentStep.onFailureActions || [],
      estimatedDuration: currentStep.estimatedDuration || 1,
      isManualStep: currentStep.isManualStep || false,
      displayInDashboard: currentStep.displayInDashboard !== false,
      notificationRequired: currentStep.notificationRequired || false,
      entryConditions: currentStep.entryConditions,
      exitConditions: currentStep.exitConditions,
      successNextStep: currentStep.successNextStep,
      failureNextStep: currentStep.failureNextStep,
      defaultNextStep: currentStep.defaultNextStep,
      maxWaitDays: currentStep.maxWaitDays,
      requiredRole: currentStep.requiredRole,
      requiredSpecies: currentStep.requiredSpecies
    };

    if (editingStepIndex !== null) {
      const updatedSteps = [...templateData.steps];
      updatedSteps[editingStepIndex] = stepToSave;
      updateTemplate('steps', updatedSteps);
    } else {
      updateTemplate('steps', [...templateData.steps, stepToSave]);
    }

    // Reset form
    setCurrentStep({
      name: '',
      description: '',
      stepType: 'EXAM',
      order: templateData.steps.length + 2,
      onStartActions: [],
      onSuccessActions: [],
      onFailureActions: [],
      estimatedDuration: 1,
      isManualStep: false,
      displayInDashboard: true,
      notificationRequired: false
    });
    setShowStepForm(false);
    setEditingStepIndex(null);
  };

  // Edit step
  const editStep = (index: number) => {
    const step = templateData.steps[index];
    setCurrentStep(step);
    setEditingStepIndex(index);
    setShowStepForm(true);
  };

  // Remove step
  const removeStep = (index: number) => {
    const updatedSteps = templateData.steps.filter((_, i) => i !== index);
    updateTemplate('steps', updatedSteps);
  };

  // Save template
  const handleSave = () => {
    if (!templateData.name || !templateData.description || templateData.steps.length === 0) {
      alert('Please fill in all required fields and add at least one step');
      return;
    }

    if (!templateData.startingStep) {
      updateTemplate('startingStep', templateData.steps[0].id);
    }

    onSave(templateData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Workflow className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              {editingTemplate ? 'Edit' : 'Create'} Workflow Template
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Name *
              </label>
              <input
                type="text"
                required
                value={templateData.name}
                onChange={(e) => updateTemplate('name', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Camel Superovulation Protocol"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={templateData.category}
                onChange={(e) => updateTemplate('category', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DONOR_COMPLETE">Donor Complete</option>
                <option value="RECIPIENT_SYNC">Recipient Sync</option>
                <option value="BREEDING_CYCLE">Breeding Cycle</option>
                <option value="CUSTOM">Custom</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                value={templateData.description}
                onChange={(e) => updateTemplate('description', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                placeholder="Describe the purpose and workflow of this template..."
              />
            </div>
          </div>

          {/* Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Applicable Roles
              </label>
              <select
                multiple
                value={templateData.applicableRoles}
                onChange={(e) => updateTemplate('applicableRoles', Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Roles</option>
                <option value="DONOR">Donor</option>
                <option value="RECIPIENT">Recipient</option>
                <option value="BREEDING">Breeding</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Applicable Species
              </label>
              <select
                multiple
                value={templateData.applicableSpecies}
                onChange={(e) => updateTemplate('applicableSpecies', Array.from(e.target.selectedOptions, option => option.value))}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Species</option>
                <option value="CAMEL">Camel</option>
                <option value="BOVINE">Bovine</option>
                <option value="EQUINE">Equine</option>
                <option value="OVINE">Ovine</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={templateData.priority}
                onChange={(e) => updateTemplate('priority', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Workflow Steps</h3>
              <button
                onClick={() => setShowStepForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Step
              </button>
            </div>

            {/* Steps List */}
            <div className="space-y-3">
              {templateData.steps.map((step, index) => (
                <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                        {step.order}
                      </span>
                      <div>
                        <h4 className="font-medium text-gray-900">{step.name}</h4>
                        <p className="text-sm text-gray-600">{step.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                            {step.stepType}
                          </span>
                          <span className="text-xs text-gray-500">
                            ~{step.estimatedDuration} day(s)
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => editStep(index)}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeStep(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Module-Based Step Creation Form */}
            {showStepForm && (
              <EnhancedStepCreator
                currentStep={currentStep}
                updateStep={updateStep}
                onSave={saveStep}
                onCancel={() => {
                  setShowStepForm(false);
                  setEditingStepIndex(null);
                  setCurrentStep({
                    name: '',
                    description: '',
                    stepType: 'EXAM',
                    order: templateData.steps.length + 1,
                    onStartActions: [],
                    onSuccessActions: [],
                    onFailureActions: [],
                    estimatedDuration: 1,
                    isManualStep: false,
                    displayInDashboard: true,
                    notificationRequired: false
                  });
                }}
                isEditing={editingStepIndex !== null}
                templateStepsLength={templateData.steps.length}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
};

// Simplified Workflow Template Creator - Ultrasonography-Centric Design
interface SimplifiedWorkflowCreatorProps {
  currentStep: Partial<WorkflowStep>;
  updateStep: (field: keyof WorkflowStep, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
  templateStepsLength: number;
}

const EnhancedStepCreator: React.FC<SimplifiedWorkflowCreatorProps> = ({
  currentStep,
  updateStep,
  onSave,
  onCancel,
  isEditing,
  templateStepsLength
}) => {
  // Simplified state for 3 fields only
  const [selectedModule, setSelectedModule] = useState<string>(currentStep.stepType || 'ULTRASONOGRAPHY');
  const [period, setPeriod] = useState<number>(currentStep.estimatedDuration || 1);
  const [injection, setInjection] = useState<string>('');
  const [rescheduleUltrasound, setRescheduleUltrasound] = useState<number>(7); // Days to reschedule ultrasound after procedure

  // Available modules for assignment
  const availableModules = [
    { 
      value: 'ULTRASONOGRAPHY', 
      label: 'Ultrasonography Exam', 
      icon: '🔬',
      description: 'Main examination module - assigns ultrasound scan',
      defaultReschedule: 7
    },
    { 
      value: 'BREEDING', 
      label: 'Breeding Assignment', 
      icon: '🐄',
      description: 'Assigns animal for breeding procedure',
      defaultReschedule: 1
    },
    { 
      value: 'FLUSHING', 
      label: 'Embryo Flushing', 
      icon: '🧬',
      description: 'Assigns animal for embryo collection',
      defaultReschedule: 7
    },
    { 
      value: 'OPU', 
      label: 'Ovum Pick-up (OPU)', 
      icon: '🥚',
      description: 'Assigns animal for oocyte collection',
      defaultReschedule: 3
    },
    { 
      value: 'INJECTION_ONLY', 
      label: 'Injection Only', 
      icon: '💉',
      description: 'Only assigns injection for today',
      defaultReschedule: 1
    }
  ];

  // Common injection medications
  const commonInjections = [
    'GnRH - 100μg',
    'FSH - 5ml',
    'PGF2α - 5ml',
    'Estradiol - 1mg',
    'hCG - 1500IU',
    'PMSG - 1000IU',
    'Oxytocin - 20IU',
    'Custom Injection'
  ];

  const selectedModuleConfig = availableModules.find(m => m.value === selectedModule);

  // Calculate scheduled date
  const calculateScheduledDate = () => {
    const today = new Date();
    const scheduledDate = new Date(today.getTime() + (period * 24 * 60 * 60 * 1000));
    return scheduledDate.toLocaleDateString();
  };

  // Calculate ultrasound reschedule date
  const calculateUltrasoundReschedule = () => {
    const today = new Date();
    const procedureDate = new Date(today.getTime() + (period * 24 * 60 * 60 * 1000));
    const rescheduleDate = new Date(procedureDate.getTime() + (rescheduleUltrasound * 24 * 60 * 60 * 1000));
    return rescheduleDate.toLocaleDateString();
  };

  // Update step when module changes
  useEffect(() => {
    if (selectedModuleConfig) {
      updateStep('stepType', selectedModule);
      updateStep('name', selectedModuleConfig.label);
      updateStep('description', selectedModuleConfig.description);
      updateStep('estimatedDuration', period);
      setRescheduleUltrasound(selectedModuleConfig.defaultReschedule);
    }
  }, [selectedModule, period]);

  // Handle save
  const handleSave = () => {
    if (!selectedModule || !period) {
      alert('Please select module and specify period');
      return;
    }

    // Create simple workflow action
    const workflowAction = {
      id: `action-${Date.now()}`,
      type: 'SCHEDULE_PROCEDURE',
      targetModule: selectedModule,
      parameters: {
        scheduleDays: period,
        createPendingRecord: true,
        recordStatus: 'PENDING',
        injection: injection || null,
        rescheduleUltrasound: selectedModule !== 'ULTRASONOGRAPHY' ? rescheduleUltrasound : null
      }
    };

    updateStep('onStartActions', [workflowAction]);
    onSave();
  };

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
      <h4 className="font-medium text-gray-900 mb-6">
        {isEditing ? 'Edit' : 'Add'} Workflow Action - Simplified Design
      </h4>

      <div className="space-y-6">
        {/* Three Main Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Module Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              1. Module Assignment *
            </label>
            <div className="space-y-3">
              {availableModules.map((module) => (
                <div
                  key={module.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedModule === module.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedModule(module.value)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{module.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{module.label}</h4>
                      <p className="text-xs text-gray-600">{module.description}</p>
                    </div>
                    <input
                      type="radio"
                      name="module"
                      checked={selectedModule === module.value}
                      onChange={() => setSelectedModule(module.value)}
                      className="text-blue-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Period Configuration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              2. Schedule Period *
            </label>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 mb-2">Days from today</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={period}
                  onChange={(e) => setPeriod(parseInt(e.target.value) || 1)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg font-bold"
                />
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium">
                  Scheduled Date: {calculateScheduledDate()}
                </p>
                <p className="text-xs text-blue-600">
                  {period === 0 ? 'Today' : `${period} day(s) from today`}
                </p>
              </div>

              {selectedModule !== 'ULTRASONOGRAPHY' && (
                <div className="border-t pt-3">
                  <label className="block text-xs text-gray-600 mb-2">
                    Auto-reschedule Ultrasound after procedure
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={rescheduleUltrasound}
                    onChange={(e) => setRescheduleUltrasound(parseInt(e.target.value) || 7)}
                    className="w-full border border-gray-300 rounded p-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ultrasound reschedule: {calculateUltrasoundReschedule()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 3. Injection Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              3. Today's Injection (Optional)
            </label>
            <div className="space-y-3">
              <select
                value={injection}
                onChange={(e) => setInjection(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No injection</option>
                {commonInjections.map((inj) => (
                  <option key={inj} value={inj}>
                    {inj}
                  </option>
                ))}
              </select>

              {injection === 'Custom Injection' && (
                <input
                  type="text"
                  placeholder="Enter custom injection details"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setInjection(e.target.value)}
                />
              )}

              {injection && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    ✓ Injection: {injection}
                  </p>
                  <p className="text-xs text-green-600">
                    Will be scheduled for today
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Workflow Summary */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600">📋</div>
            <div>
              <h5 className="font-medium text-yellow-800 mb-2">Workflow Summary</h5>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>
                  <strong>Module:</strong> {selectedModuleConfig?.label} - 
                  creates pending record on {calculateScheduledDate()}
                </li>
                {injection && (
                  <li>
                    <strong>Injection:</strong> {injection} - scheduled for today
                  </li>
                )}
                {selectedModule !== 'ULTRASONOGRAPHY' && (
                  <li>
                    <strong>Auto-reschedule:</strong> Ultrasound exam will be automatically 
                    scheduled for {calculateUltrasoundReschedule()} (after procedure completion)
                  </li>
                )}
                <li>
                  <strong>Hub Status:</strong> Animal will show as "{selectedModuleConfig?.label}" 
                  workflow status in the hub
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Ultrasonography-Centric Philosophy */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-600">🔬</div>
            <div>
              <h5 className="font-medium text-blue-800 mb-2">Ultrasonography-Centric Design</h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ultrasonography is the main examination module</li>
                <li>• Other modules are assigned procedures that automatically reschedule ultrasound</li>
                <li>• After each procedure completion → automatic ultrasound scheduling</li>
                <li>• Simple 3-field configuration for easier workflow management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isEditing ? 'Update' : 'Add'} Workflow Action
        </button>
      </div>
    </div>
  );
};

export default WorkflowTemplateCreator; 