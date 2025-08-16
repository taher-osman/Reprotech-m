import React, { useState, useCallback } from 'react';
import { 
  WorkflowTemplate, 
  WorkflowStep, 
  WorkflowCondition, 
  WorkflowAction 
} from '../types/workflowTypes';

interface WorkflowTemplateCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: WorkflowTemplate) => void;
  editingTemplate?: WorkflowTemplate;
}

interface StepBuilderState {
  step: Partial<WorkflowStep>;
  isEditing: boolean;
  editingIndex: number;
}

export const WorkflowTemplateCreator: React.FC<WorkflowTemplateCreatorProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTemplate
}) => {
  const [template, setTemplate] = useState<Partial<WorkflowTemplate>>({
    name: '',
    description: '',
    category: 'CUSTOM',
    applicableRoles: ['ALL'],
    applicableSpecies: ['ALL'],
    steps: [],
    startingStep: '',
    maxDuration: 30,
    priority: 'MEDIUM',
    autoStart: false,
    expectedSuccessRate: 85,
    averageDuration: 14,
    isActive: true
  });

  const [stepBuilder, setStepBuilder] = useState<StepBuilderState>({
    step: {},
    isEditing: false,
    editingIndex: -1
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'steps' | 'conditions' | 'review'>('basic');

  const speciesOptions = ['ALL', 'CAMEL', 'BOVINE', 'EQUINE', 'OVINE', 'CAPRINE'];
  const roleOptions = ['ALL', 'DONOR', 'RECIPIENT', 'BREEDING'];
  const stepTypes = ['EXAM', 'INJECTION', 'PROCEDURE', 'WAIT', 'DECISION', 'NOTIFICATION'];
  const actionTypes = ['SCHEDULE_EXAM', 'SCHEDULE_INJECTION', 'SCHEDULE_PROCEDURE', 'UPDATE_STATUS', 'NOTIFY', 'WAIT_DAYS'];
  const targetModules = ['CALENDAR', 'INJECTION', 'ET', 'OPU', 'ULTRASOUND', 'INTERNAL'];

  const conditionFields = [
    'follicle_count', 'cl_presence', 'pregnancy_status', 'estrus_cycle', 
    'hormone_level', 'body_condition', 'age_months', 'last_breeding_days',
    'response_score', 'embryo_count', 'oocyte_count'
  ];

  const conditionOperators = ['>', '<', '>=', '<=', '==', '!=', 'contains', 'not_contains'];

  // Initialize template for editing
  React.useEffect(() => {
    if (editingTemplate) {
      setTemplate(editingTemplate);
    }
  }, [editingTemplate]);

  const addCondition = (targetArray: WorkflowCondition[], setTargetArray: (conditions: WorkflowCondition[]) => void) => {
    const newCondition: WorkflowCondition = {
      id: `condition_${Date.now()}`,
      field: 'follicle_count',
      operator: '>=',
      value: 0
    };
    setTargetArray([...targetArray, newCondition]);
  };

  const updateCondition = (
    targetArray: WorkflowCondition[], 
    setTargetArray: (conditions: WorkflowCondition[]) => void,
    index: number, 
    field: keyof WorkflowCondition, 
    value: any
  ) => {
    const updated = [...targetArray];
    updated[index] = { ...updated[index], [field]: value };
    setTargetArray(updated);
  };

  const removeCondition = (targetArray: WorkflowCondition[], setTargetArray: (conditions: WorkflowCondition[]) => void, index: number) => {
    setTargetArray(targetArray.filter((_, i) => i !== index));
  };

  const addAction = (targetArray: WorkflowAction[], setTargetArray: (actions: WorkflowAction[]) => void) => {
    const newAction: WorkflowAction = {
      id: `action_${Date.now()}`,
      type: 'SCHEDULE_EXAM',
      targetModule: 'CALENDAR',
      parameters: {}
    };
    setTargetArray([...targetArray, newAction]);
  };

  const updateAction = (
    targetArray: WorkflowAction[], 
    setTargetArray: (actions: WorkflowAction[]) => void,
    index: number, 
    field: keyof WorkflowAction, 
    value: any
  ) => {
    const updated = [...targetArray];
    updated[index] = { ...updated[index], [field]: value };
    setTargetArray(updated);
  };

  const removeAction = (targetArray: WorkflowAction[], setTargetArray: (actions: WorkflowAction[]) => void, index: number) => {
    setTargetArray(targetArray.filter((_, i) => i !== index));
  };

  const saveStep = () => {
    if (!stepBuilder.step.name || !stepBuilder.step.stepType) return;

    const newStep: WorkflowStep = {
      id: stepBuilder.step.id || `step_${Date.now()}`,
      name: stepBuilder.step.name,
      description: stepBuilder.step.description || '',
      stepType: stepBuilder.step.stepType,
      order: stepBuilder.step.order || template.steps!.length + 1,
      entryConditions: stepBuilder.step.entryConditions || [],
      onStartActions: stepBuilder.step.onStartActions || [],
      exitConditions: stepBuilder.step.exitConditions || [],
      onSuccessActions: stepBuilder.step.onSuccessActions || [],
      onFailureActions: stepBuilder.step.onFailureActions || [],
      successNextStep: stepBuilder.step.successNextStep,
      failureNextStep: stepBuilder.step.failureNextStep,
      defaultNextStep: stepBuilder.step.defaultNextStep,
      estimatedDuration: stepBuilder.step.estimatedDuration || 1,
      maxWaitDays: stepBuilder.step.maxWaitDays,
      requiredRole: stepBuilder.step.requiredRole,
      requiredSpecies: stepBuilder.step.requiredSpecies || [],
      isManualStep: stepBuilder.step.isManualStep || false,
      displayInDashboard: stepBuilder.step.displayInDashboard || true,
      notificationRequired: stepBuilder.step.notificationRequired || false
    };

    const updatedSteps = [...(template.steps || [])];
    
    if (stepBuilder.isEditing) {
      updatedSteps[stepBuilder.editingIndex] = newStep;
    } else {
      updatedSteps.push(newStep);
    }

    setTemplate({ ...template, steps: updatedSteps });
    setStepBuilder({ step: {}, isEditing: false, editingIndex: -1 });
  };

  const editStep = (step: WorkflowStep, index: number) => {
    setStepBuilder({ step, isEditing: true, editingIndex: index });
  };

  const deleteStep = (index: number) => {
    const updatedSteps = template.steps!.filter((_, i) => i !== index);
    setTemplate({ ...template, steps: updatedSteps });
  };

  const saveTemplate = () => {
    if (!template.name || !template.steps || template.steps.length === 0) return;

    const finalTemplate: WorkflowTemplate = {
      id: editingTemplate?.id || `template_${Date.now()}`,
      name: template.name!,
      description: template.description!,
      category: template.category!,
      applicableRoles: template.applicableRoles!,
      applicableSpecies: template.applicableSpecies!,
      steps: template.steps,
      startingStep: template.startingStep || template.steps[0].id,
      maxDuration: template.maxDuration!,
      priority: template.priority!,
      autoStart: template.autoStart!,
      expectedSuccessRate: template.expectedSuccessRate!,
      averageDuration: template.averageDuration!,
      createdBy: editingTemplate?.createdBy || 'current_user',
      createdAt: editingTemplate?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: editingTemplate ? `${parseFloat(editingTemplate.version) + 0.1}` : '1.0',
      isActive: template.isActive!,
      usageCount: editingTemplate?.usageCount || 0,
      successCount: editingTemplate?.successCount || 0
    };

    onSave(finalTemplate);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {editingTemplate ? 'Edit Workflow Template' : 'Create Workflow Template'}
            </h2>
            <p className="text-gray-600">Design reusable workflow templates with conditional logic</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2 border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'basic', name: 'Basic Info', icon: '📋' },
              { id: 'steps', name: 'Workflow Steps', icon: '🔄' },
              { id: 'conditions', name: 'Logic & Conditions', icon: '🎯' },
              { id: 'review', name: 'Review & Save', icon: '✅' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template Name</label>
                  <input
                    type="text"
                    value={template.name}
                    onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Camel Donor Complete Workflow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={template.category}
                    onChange={(e) => setTemplate({ ...template, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="DONOR_COMPLETE">Donor Complete</option>
                    <option value="RECIPIENT_SYNC">Recipient Sync</option>
                    <option value="BREEDING_CYCLE">Breeding Cycle</option>
                    <option value="CUSTOM">Custom Workflow</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={template.description}
                  onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the purpose and scope of this workflow template"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Applicable Roles</label>
                  <div className="space-y-2">
                    {roleOptions.map((role) => (
                      <label key={role} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={template.applicableRoles?.includes(role as any)}
                          onChange={(e) => {
                            const roles = template.applicableRoles || [];
                            if (e.target.checked) {
                              setTemplate({ ...template, applicableRoles: [...roles.filter(r => r !== 'ALL'), role as any] });
                            } else {
                              setTemplate({ ...template, applicableRoles: roles.filter(r => r !== role) });
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{role}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Applicable Species</label>
                  <div className="space-y-2">
                    {speciesOptions.map((species) => (
                      <label key={species} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={template.applicableSpecies?.includes(species)}
                          onChange={(e) => {
                            const specs = template.applicableSpecies || [];
                            if (e.target.checked) {
                              setTemplate({ ...template, applicableSpecies: [...specs.filter(s => s !== 'ALL'), species] });
                            } else {
                              setTemplate({ ...template, applicableSpecies: specs.filter(s => s !== species) });
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{species}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Duration (days)</label>
                  <input
                    type="number"
                    value={template.maxDuration}
                    onChange={(e) => setTemplate({ ...template, maxDuration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={template.priority}
                    onChange={(e) => setTemplate({ ...template, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Success Rate (%)</label>
                  <input
                    type="number"
                    value={template.expectedSuccessRate}
                    onChange={(e) => setTemplate({ ...template, expectedSuccessRate: parseInt(e.target.value) })}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={template.autoStart}
                  onChange={(e) => setTemplate({ ...template, autoStart: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">Auto-start workflow when assigned to animals</label>
              </div>
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="space-y-6">
              {/* Step Builder */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {stepBuilder.isEditing ? 'Edit Step' : 'Add New Step'}
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Step Name</label>
                    <input
                      type="text"
                      value={stepBuilder.step.name || ''}
                      onChange={(e) => setStepBuilder({ ...stepBuilder, step: { ...stepBuilder.step, name: e.target.value } })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Initial Ultrasound Exam"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Step Type</label>
                    <select
                      value={stepBuilder.step.stepType || ''}
                      onChange={(e) => setStepBuilder({ ...stepBuilder, step: { ...stepBuilder.step, stepType: e.target.value as any } })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Type</option>
                      {stepTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={stepBuilder.step.description || ''}
                    onChange={(e) => setStepBuilder({ ...stepBuilder, step: { ...stepBuilder.step, description: e.target.value } })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe what happens in this step"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
                    <input
                      type="number"
                      value={stepBuilder.step.estimatedDuration || 1}
                      onChange={(e) => setStepBuilder({ ...stepBuilder, step: { ...stepBuilder.step, estimatedDuration: parseInt(e.target.value) } })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Required Role</label>
                    <select
                      value={stepBuilder.step.requiredRole || ''}
                      onChange={(e) => setStepBuilder({ ...stepBuilder, step: { ...stepBuilder.step, requiredRole: e.target.value as any } })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Role</option>
                      <option value="DONOR">Donor</option>
                      <option value="RECIPIENT">Recipient</option>
                      <option value="BREEDING">Breeding</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Wait (days)</label>
                    <input
                      type="number"
                      value={stepBuilder.step.maxWaitDays || ''}
                      onChange={(e) => setStepBuilder({ ...stepBuilder, step: { ...stepBuilder.step, maxWaitDays: parseInt(e.target.value) } })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex space-x-4 mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={stepBuilder.step.isManualStep || false}
                      onChange={(e) => setStepBuilder({ ...stepBuilder, step: { ...stepBuilder.step, isManualStep: e.target.checked } })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Manual Step</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={stepBuilder.step.displayInDashboard || false}
                      onChange={(e) => setStepBuilder({ ...stepBuilder, step: { ...stepBuilder.step, displayInDashboard: e.target.checked } })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Show in Dashboard</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={stepBuilder.step.notificationRequired || false}
                      onChange={(e) => setStepBuilder({ ...stepBuilder, step: { ...stepBuilder.step, notificationRequired: e.target.checked } })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Notification Required</span>
                  </label>
                </div>

                <button
                  onClick={saveStep}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {stepBuilder.isEditing ? 'Update Step' : 'Add Step'}
                </button>

                {stepBuilder.isEditing && (
                  <button
                    onClick={() => setStepBuilder({ step: {}, isEditing: false, editingIndex: -1 })}
                    className="ml-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              {/* Steps List */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Steps ({template.steps?.length || 0})</h3>
                {template.steps && template.steps.length > 0 ? (
                  <div className="space-y-2">
                    {template.steps.map((step, index) => (
                      <div key={step.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                              {index + 1}
                            </span>
                            <div>
                              <h4 className="font-medium text-gray-900">{step.name}</h4>
                              <p className="text-sm text-gray-600">Type: {step.stepType} • Duration: {step.estimatedDuration} days</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editStep(step, index)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteStep(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No steps added yet. Add your first step above.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'review' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Template Summary</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900">Basic Information</h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li><strong>Name:</strong> {template.name || 'Not set'}</li>
                      <li><strong>Category:</strong> {template.category}</li>
                      <li><strong>Roles:</strong> {template.applicableRoles?.join(', ')}</li>
                      <li><strong>Species:</strong> {template.applicableSpecies?.join(', ')}</li>
                      <li><strong>Priority:</strong> {template.priority}</li>
                      <li><strong>Max Duration:</strong> {template.maxDuration} days</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Workflow Configuration</h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                      <li><strong>Total Steps:</strong> {template.steps?.length || 0}</li>
                      <li><strong>Auto Start:</strong> {template.autoStart ? 'Yes' : 'No'}</li>
                      <li><strong>Expected Success Rate:</strong> {template.expectedSuccessRate}%</li>
                      <li><strong>Average Duration:</strong> {template.averageDuration} days</li>
                    </ul>
                  </div>
                </div>
              </div>

              {template.steps && template.steps.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Steps Overview</h3>
                  <div className="space-y-2">
                    {template.steps.map((step, index) => (
                      <div key={step.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium mr-3">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">{step.name}</span>
                          <span className="ml-2 text-sm text-gray-600">({step.stepType})</span>
                        </div>
                        <span className="text-sm text-gray-500">{step.estimatedDuration}d</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveTemplate}
                  disabled={!template.name || !template.steps || template.steps.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {editingTemplate ? 'Update Template' : 'Create Template'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowTemplateCreator; 