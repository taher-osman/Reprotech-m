import React, { useState, useRef, useCallback } from 'react';
import {
  Plus,
  Save,
  X,
  TestTube,
  Beaker,
  Microscope,
  CheckCircle,
  Eye,
  FileText,
  ArrowRight,
  ArrowDown,
  Settings,
  Clock,
  Users,
  AlertTriangle,
  Target,
  Zap,
  GitBranch,
  Copy,
  Trash2,
  Edit,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'collection' | 'preparation' | 'analysis' | 'qc' | 'review' | 'reporting' | 'approval';
  description: string;
  estimatedDuration: number;
  requiredRole: string;
  requiredEquipment?: string;
  qcRequired: boolean;
  dependencies: string[];
  instructions: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  position?: { x: number; y: number };
  connections?: string[];
}

interface LabWorkflow {
  id: string;
  name: string;
  testType: string;
  category: string;
  version: string;
  status: 'draft' | 'active' | 'archived';
  description: string;
  estimatedTotalTime: number;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  steps: WorkflowStep[];
  createdBy: string;
  createdAt: string;
  lastModified: string;
  tags: string[];
  sampleTypes: string[];
  equipmentRequired: string[];
  qualifications: string[];
  compliance: string[];
}

interface WorkflowBuilderProps {
  workflows?: LabWorkflow[];
  initialWorkflow?: LabWorkflow | null;
  onSave: (workflow: LabWorkflow) => void;
  onClose?: () => void;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({ 
  workflows = [], 
  initialWorkflow = null, 
  onSave, 
  onClose 
}) => {
  const [workflow, setWorkflow] = useState<Partial<LabWorkflow>>(initialWorkflow || {
    name: '',
    testType: '',
    category: '',
    version: '1.0',
    status: 'draft',
    description: '',
    estimatedTotalTime: 0,
    priority: 'normal',
    steps: [],
    tags: [],
    sampleTypes: [],
    equipmentRequired: [],
    qualifications: [],
    compliance: []
  });
  
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);
  const [isEditingStep, setIsEditingStep] = useState(false);
  const [draggedStep, setDraggedStep] = useState<WorkflowStep | null>(null);
  const [showStepPalette, setShowStepPalette] = useState(true);
  const [viewMode, setViewMode] = useState<'visual' | 'list'>('visual');
  const [showValidation, setShowValidation] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const stepTypes = [
    {
      type: 'collection',
      name: 'Sample Collection',
      icon: <TestTube className="w-5 h-5" />,
      color: 'bg-blue-500',
      description: 'Collect and label samples'
    },
    {
      type: 'preparation',
      name: 'Sample Preparation',
      icon: <Beaker className="w-5 h-5" />,
      color: 'bg-purple-500',
      description: 'Process and prepare samples'
    },
    {
      type: 'analysis',
      name: 'Analysis',
      icon: <Microscope className="w-5 h-5" />,
      color: 'bg-green-500',
      description: 'Perform laboratory analysis'
    },
    {
      type: 'qc',
      name: 'Quality Control',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'bg-yellow-500',
      description: 'Quality control checks'
    },
    {
      type: 'review',
      name: 'Review',
      icon: <Eye className="w-5 h-5" />,
      color: 'bg-orange-500',
      description: 'Review and validate results'
    },
    {
      type: 'reporting',
      name: 'Reporting',
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-indigo-500',
      description: 'Generate reports'
    },
    {
      type: 'approval',
      name: 'Approval',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'bg-emerald-500',
      description: 'Final approval step'
    }
  ];

  const roles = [
    'Phlebotomist',
    'Lab Technician',
    'Medical Technologist',
    'Senior Technologist',
    'QC Specialist',
    'Lab Supervisor',
    'Pathologist',
    'Laboratory Director'
  ];

  const categories = [
    'Hematology',
    'Chemistry',
    'Immunology',
    'Microbiology',
    'Molecular',
    'Pathology',
    'Blood Bank',
    'Coagulation'
  ];

  const generateStepId = () => `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const addStep = (stepType: any, position?: { x: number; y: number }) => {
    const newStep: WorkflowStep = {
      id: generateStepId(),
      name: stepType.name,
      type: stepType.type,
      description: stepType.description,
      estimatedDuration: 15,
      requiredRole: roles[0],
      qcRequired: stepType.type === 'qc',
      dependencies: [],
      instructions: '',
      status: 'pending',
      position: position || { x: 100 + (workflow.steps?.length || 0) * 250, y: 100 },
      connections: []
    };

    setWorkflow(prev => ({
      ...prev,
      steps: [...(prev.steps || []), newStep],
      estimatedTotalTime: (prev.estimatedTotalTime || 0) + newStep.estimatedDuration
    }));
  };

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps?.map(step => 
        step.id === stepId 
          ? { 
              ...step, 
              ...updates,
              // Recalculate total time if duration changed
              ...(updates.estimatedDuration !== undefined && {
                estimatedDuration: updates.estimatedDuration
              })
            }
          : step
      ) || [],
      // Recalculate total estimated time
      estimatedTotalTime: prev.steps?.reduce((total, step) => 
        total + (step.id === stepId && updates.estimatedDuration !== undefined 
          ? updates.estimatedDuration 
          : step.estimatedDuration), 0) || 0
    }));
  };

  const deleteStep = (stepId: string) => {
    setWorkflow(prev => {
      const stepToDelete = prev.steps?.find(s => s.id === stepId);
      const updatedSteps = prev.steps?.filter(step => step.id !== stepId) || [];
      
      // Remove dependencies on deleted step
      const cleanedSteps = updatedSteps.map(step => ({
        ...step,
        dependencies: step.dependencies.filter(dep => dep !== stepId),
        connections: step.connections?.filter(conn => conn !== stepId) || []
      }));

      return {
        ...prev,
        steps: cleanedSteps,
        estimatedTotalTime: (prev.estimatedTotalTime || 0) - (stepToDelete?.estimatedDuration || 0)
      };
    });
    
    if (selectedStep?.id === stepId) {
      setSelectedStep(null);
    }
  };

  const connectSteps = (fromStepId: string, toStepId: string) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps?.map(step => {
        if (step.id === fromStepId) {
          return {
            ...step,
            connections: [...(step.connections || []), toStepId]
          };
        }
        if (step.id === toStepId) {
          return {
            ...step,
            dependencies: [...step.dependencies, fromStepId]
          };
        }
        return step;
      }) || []
    }));
  };

  const validateWorkflow = () => {
    const validationErrors = [];
    
    if (!workflow.name) validationErrors.push('Workflow name is required');
    if (!workflow.testType) validationErrors.push('Test type is required');
    if (!workflow.steps || workflow.steps.length === 0) validationErrors.push('At least one step is required');
    
    // Check for circular dependencies
    const checkCircularDeps = (stepId: string, visited: Set<string> = new Set()): boolean => {
      if (visited.has(stepId)) return true;
      visited.add(stepId);
      
      const step = workflow.steps?.find(s => s.id === stepId);
      return step?.dependencies.some(dep => checkCircularDeps(dep, new Set(visited))) || false;
    };
    
    workflow.steps?.forEach(step => {
      if (checkCircularDeps(step.id)) {
        validationErrors.push(`Circular dependency detected for step: ${step.name}`);
      }
    });

    return validationErrors;
  };

  const saveWorkflow = () => {
    const errors = validateWorkflow();
    if (errors.length > 0) {
      setShowValidation(true);
      return;
    }

    const completeWorkflow: LabWorkflow = {
      id: workflow.id || `wf-${Date.now()}`,
      name: workflow.name || '',
      testType: workflow.testType || '',
      category: workflow.category || '',
      version: workflow.version || '1.0',
      status: workflow.status || 'draft',
      description: workflow.description || '',
      estimatedTotalTime: workflow.estimatedTotalTime || 0,
      priority: workflow.priority || 'normal',
      steps: workflow.steps || [],
      createdBy: 'Current User',
      createdAt: workflow.createdAt || new Date().toISOString(),
      lastModified: new Date().toISOString(),
      tags: workflow.tags || [],
      sampleTypes: workflow.sampleTypes || [],
      equipmentRequired: workflow.equipmentRequired || [],
      qualifications: workflow.qualifications || [],
      compliance: workflow.compliance || []
    };

    onSave(completeWorkflow);
  };

  const handleDragStart = (step: WorkflowStep) => {
    setDraggedStep(step);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedStep || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (workflow.steps?.find(s => s.id === draggedStep.id)) {
      // Move existing step
      updateStep(draggedStep.id, { position: { x, y } });
    } else {
      // Add new step from palette
      const stepType = stepTypes.find(type => type.type === draggedStep.type);
      if (stepType) {
        addStep(stepType, { x, y });
      }
    }

    setDraggedStep(null);
  };

  const renderStepPalette = () => (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Step Palette</h3>
        <button
          onClick={() => setShowStepPalette(!showStepPalette)}
          className="p-1 text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-2">
        {stepTypes.map((stepType) => (
          <div
            key={stepType.type}
            draggable
            onDragStart={() => handleDragStart({ ...stepType, id: 'palette-item' } as any)}
            className="flex items-center p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100 transition-colors"
          >
            <div className={`p-2 ${stepType.color} text-white rounded-lg mr-3`}>
              {stepType.icon}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{stepType.name}</div>
              <div className="text-xs text-gray-500">{stepType.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Quick Actions</h4>
        <div className="space-y-2">
          <button
            onClick={() => setViewMode(viewMode === 'visual' ? 'list' : 'visual')}
            className="w-full flex items-center p-2 text-sm text-gray-700 bg-gray-50 rounded hover:bg-gray-100"
          >
            <GitBranch className="w-4 h-4 mr-2" />
            {viewMode === 'visual' ? 'List View' : 'Visual View'}
          </button>
          <button
            onClick={() => setShowValidation(true)}
            className="w-full flex items-center p-2 text-sm text-gray-700 bg-gray-50 rounded hover:bg-gray-100"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Validate Workflow
          </button>
        </div>
      </div>
    </div>
  );

  const renderStepNode = (step: WorkflowStep) => {
    const stepType = stepTypes.find(type => type.type === step.type);
    const isSelected = selectedStep?.id === step.id;
    
    return (
      <div
        key={step.id}
        className={`absolute bg-white border-2 rounded-lg p-4 cursor-pointer hover:shadow-lg transition-all ${
          isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200'
        }`}
        style={{
          left: step.position?.x || 0,
          top: step.position?.y || 0,
          width: '200px'
        }}
        onClick={() => setSelectedStep(step)}
        draggable
        onDragStart={() => handleDragStart(step)}
      >
        <div className="flex items-center mb-2">
          <div className={`p-2 ${stepType?.color} text-white rounded-lg mr-3`}>
            {stepType?.icon}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{step.name}</div>
            <div className="text-xs text-gray-500">{step.estimatedDuration}min</div>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedStep(step);
                setIsEditingStep(true);
              }}
              className="p-1 text-gray-400 hover:text-blue-600"
            >
              <Edit className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteStep(step.id);
              }}
              className="p-1 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        <div className="text-xs text-gray-600 mb-2">{step.description}</div>
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">{step.requiredRole}</span>
          {step.qcRequired && (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">QC</span>
          )}
        </div>

        {/* Connection points */}
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white cursor-crosshair"></div>
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
      </div>
    );
  };

  const renderConnections = () => {
    if (!workflow.steps) return null;

    return (
      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {workflow.steps.map(step => 
          step.connections?.map(connectionId => {
            const fromStep = step;
            const toStep = workflow.steps?.find(s => s.id === connectionId);
            
            if (!toStep || !fromStep.position || !toStep.position) return null;

            const fromX = fromStep.position.x + 200; // step width
            const fromY = fromStep.position.y + 50; // step height / 2
            const toX = toStep.position.x;
            const toY = toStep.position.y + 50;

            return (
              <line
                key={`${fromStep.id}-${connectionId}`}
                x1={fromX}
                y1={fromY}
                x2={toX}
                y2={toY}
                stroke="#3B82F6"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            );
          }) || []
        )}
        
        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#3B82F6"
            />
          </marker>
        </defs>
      </svg>
    );
  };

  const renderStepEditor = () => {
    if (!selectedStep) return null;

    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Step Configuration</h3>
          <button
            onClick={() => {
              setSelectedStep(null);
              setIsEditingStep(false);
            }}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Step Name</label>
            <input
              type="text"
              value={selectedStep.name}
              onChange={(e) => updateStep(selectedStep.id, { name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={selectedStep.description}
              onChange={(e) => updateStep(selectedStep.id, { description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
              <input
                type="number"
                value={selectedStep.estimatedDuration}
                onChange={(e) => updateStep(selectedStep.id, { estimatedDuration: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <input
                  type="checkbox"
                  checked={selectedStep.qcRequired}
                  onChange={(e) => updateStep(selectedStep.id, { qcRequired: e.target.checked })}
                  className="mr-2"
                />
                QC Required
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Required Role</label>
            <select
              value={selectedStep.requiredRole}
              onChange={(e) => updateStep(selectedStep.id, { requiredRole: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Required Equipment</label>
            <input
              type="text"
              value={selectedStep.requiredEquipment || ''}
              onChange={(e) => updateStep(selectedStep.id, { requiredEquipment: e.target.value })}
              placeholder="e.g., BC-6800 Analyzer"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
            <textarea
              value={selectedStep.instructions}
              onChange={(e) => updateStep(selectedStep.id, { instructions: e.target.value })}
              rows={4}
              placeholder="Detailed step-by-step instructions..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dependencies</label>
            <div className="space-y-2">
              {workflow.steps?.filter(s => s.id !== selectedStep.id).map(step => (
                <label key={step.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedStep.dependencies.includes(step.id)}
                    onChange={(e) => {
                      const deps = e.target.checked
                        ? [...selectedStep.dependencies, step.id]
                        : selectedStep.dependencies.filter(d => d !== step.id);
                      updateStep(selectedStep.id, { dependencies: deps });
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{step.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-500 rounded-lg">
              <GitBranch className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Visual Workflow Builder</h2>
              <p className="text-sm text-gray-600">Design and configure laboratory workflows</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowValidation(true)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <CheckCircle className="w-4 h-4 inline mr-2" />
              Validate
            </button>
            <button
              onClick={saveWorkflow}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Save className="w-4 h-4 inline mr-2" />
              Save Workflow
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                <X className="w-4 h-4 inline mr-2" />
                Close
              </button>
            )}
          </div>
        </div>

        {/* Workflow Configuration */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Workflow Name</label>
            <input
              type="text"
              value={workflow.name}
              onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Complete Blood Count"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
            <select
              value={workflow.testType}
              onChange={(e) => setWorkflow(prev => ({ ...prev, testType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category...</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={workflow.priority}
              onChange={(e) => setWorkflow(prev => ({ ...prev, priority: e.target.value as any }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
            <input
              type="text"
              value={workflow.version}
              onChange={(e) => setWorkflow(prev => ({ ...prev, version: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Step Palette */}
        {showStepPalette && renderStepPalette()}

        {/* Canvas */}
        <div className="flex-1 relative overflow-auto bg-gray-100">
          <div
            ref={canvasRef}
            className="relative w-full h-full min-h-[600px]"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{ backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          >
            {/* Render connections */}
            {renderConnections()}
            
            {/* Render steps */}
            {workflow.steps?.map(renderStepNode)}
            
            {/* Empty state */}
            {(!workflow.steps || workflow.steps.length === 0) && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <GitBranch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building Your Workflow</h3>
                  <p className="text-gray-500 mb-4">Drag steps from the palette to create your workflow</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step Editor */}
        {selectedStep && renderStepEditor()}
      </div>

      {/* Validation Modal */}
      {showValidation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Validation</h3>
            
            {(() => {
              const errors = validateWorkflow();
              return errors.length > 0 ? (
                <div>
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <h4 className="text-sm font-medium text-red-800 mb-2">Validation Errors:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-800">Workflow is valid!</span>
                  </div>
                  <div className="mt-2 text-sm text-green-700">
                    <div>• {workflow.steps?.length || 0} steps configured</div>
                    <div>• Total estimated time: {workflow.estimatedTotalTime || 0} minutes</div>
                    <div>• All dependencies are valid</div>
                  </div>
                </div>
              );
            })()}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowValidation(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 