import React, { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Calendar, 
  User, 
  DollarSign, 
  Microscope,
  AlertTriangle,
  Clock,
  Target,
  Settings,
  CheckCircle,
  Upload,
  FileText
} from 'lucide-react';
import { Badge } from './components/ui/Badge';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { 
  ExperimentInstance,
  ResearchProject,
  ExperimentProtocol,
  ExperimentStatus,
  AssignedPersonnel,
  RequiredMaterial,
  RequiredEquipment,
  SafetyProtocol,
  RiskLevel,
  HazardType,
  ResearchRole,
  CostTracking
} from '../types/researchTypes';
import { researchApi } from '../services/researchApi';

interface ExperimentFormProps {
  experiment?: ExperimentInstance;
  projectId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (experiment: ExperimentInstance) => void;
}

export const ExperimentForm: React.FC<ExperimentFormProps> = ({
  experiment,
  projectId,
  isOpen,
  onClose,
  onSave
}) => {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [protocols, setProtocols] = useState<ExperimentProtocol[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ExperimentInstance>>({
    title: '',
    description: '',
    projectId: projectId || '',
    protocolId: '',
    status: ExperimentStatus.PLANNING,
    assignedPersonnel: [],
    environmentalConditions: [],
    researchSubjects: [],
    dataCollectionSessions: [],
    deviations: [],
    notes: '',
    completionRate: 0,
    dataIntegrityScore: 0,
    qualityScore: 0,
    startDate: new Date(),
    costTracking: {
      budgetAllocated: 0,
      actualCost: 0,
      materialCosts: 0,
      equipmentCosts: 0,
      personnelCosts: 0,
      overheadCosts: 0,
      costBreakdown: [],
      costVariance: 0,
      lastUpdated: new Date()
    }
  });

  const steps = [
    { id: 1, title: 'Basic Information', icon: FileText },
    { id: 2, title: 'Protocol & Timeline', icon: Calendar },
    { id: 3, title: 'Personnel & Resources', icon: User },
    { id: 4, title: 'Budget & Costs', icon: DollarSign },
    { id: 5, title: 'Safety & Compliance', icon: AlertTriangle }
  ];

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
      if (experiment) {
        setFormData(experiment);
      }
    }
  }, [isOpen, experiment]);

  const loadInitialData = async () => {
    try {
      const [projectsResponse, protocolsResponse] = await Promise.all([
        researchApi.getProjects(),
        researchApi.getProtocols()
      ]);

      if (projectsResponse.success) {
        setProjects(projectsResponse.data);
      }

      if (protocolsResponse.success) {
        setProtocols(protocolsResponse.data);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCostTrackingChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      costTracking: {
        ...prev.costTracking!,
        [field]: value
      }
    }));
  };

  const addPersonnel = () => {
    const newPersonnel: AssignedPersonnel = {
      personId: '',
      name: '',
      role: '',
      responsibility: '',
      startDate: new Date(),
      hoursAllocated: 0,
      hoursWorked: 0,
      performance: 0
    };

    setFormData(prev => ({
      ...prev,
      assignedPersonnel: [...(prev.assignedPersonnel || []), newPersonnel]
    }));
  };

  const updatePersonnel = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      assignedPersonnel: prev.assignedPersonnel?.map((person, i) => 
        i === index ? { ...person, [field]: value } : person
      ) || []
    }));
  };

  const removePersonnel = (index: number) => {
    setFormData(prev => ({
      ...prev,
      assignedPersonnel: prev.assignedPersonnel?.filter((_, i) => i !== index) || []
    }));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.description && formData.projectId;
      case 2:
        return formData.protocolId && formData.startDate;
      case 3:
        return formData.assignedPersonnel && formData.assignedPersonnel.length > 0;
      case 4:
        return formData.costTracking?.budgetAllocated;
      case 5:
        return true; // Safety is optional but recommended
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const experimentData: Omit<ExperimentInstance, 'id' | 'createdAt' | 'updatedAt'> = {
        ...formData,
        title: formData.title!,
        description: formData.description!,
        projectId: formData.projectId!,
        protocolId: formData.protocolId!,
        startDate: formData.startDate!,
        status: formData.status!,
        assignedPersonnel: formData.assignedPersonnel || [],
        environmentalConditions: formData.environmentalConditions || [],
        researchSubjects: formData.researchSubjects || [],
        dataCollectionSessions: formData.dataCollectionSessions || [],
        deviations: formData.deviations || [],
        notes: formData.notes || '',
        completionRate: formData.completionRate || 0,
        dataIntegrityScore: formData.dataIntegrityScore || 0,
        qualityScore: formData.qualityScore || 0,
        costTracking: formData.costTracking!
      };

      const response = await researchApi.createExperiment(experimentData);
      
      if (response.success) {
        onSave(response.data);
        onClose();
      }
    } catch (error) {
      console.error('Error saving experiment:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experiment Title *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter experiment title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project *
              </label>
              <select
                value={formData.projectId || ''}
                onChange={(e) => handleInputChange('projectId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the experiment objectives and methodology"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status || ExperimentStatus.PLANNING}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.values(ExperimentStatus).map(status => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Protocol *
              </label>
              <select
                value={formData.protocolId || ''}
                onChange={(e) => handleInputChange('protocolId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a protocol</option>
                {protocols.map(protocol => (
                  <option key={protocol.id} value={protocol.id}>
                    {protocol.title} (v{protocol.version})
                  </option>
                ))}
              </select>
            </div>

            {formData.protocolId && (
              <Card className="p-4 bg-blue-50">
                <div className="flex items-start">
                  <Microscope className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="font-medium text-blue-900">Selected Protocol</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {protocols.find(p => p.id === formData.protocolId)?.description}
                    </p>
                    <div className="flex items-center mt-2 text-sm text-blue-600">
                      <Clock className="h-4 w-4 mr-1" />
                      Estimated Duration: {protocols.find(p => p.id === formData.protocolId)?.estimatedDuration} hours
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('startDate', new Date(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('endDate', new Date(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Duration (hours)
              </label>
              <input
                type="number"
                value={formData.actualDuration || ''}
                onChange={(e) => handleInputChange('actualDuration', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter expected duration in hours"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Assigned Personnel</h3>
              <Button onClick={addPersonnel} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Person
              </Button>
            </div>

            {formData.assignedPersonnel && formData.assignedPersonnel.length === 0 ? (
              <Card className="p-8">
                <div className="text-center">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No personnel assigned</h3>
                  <p className="text-gray-600 mb-4">Add team members to this experiment</p>
                  <Button onClick={addPersonnel}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Person
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {formData.assignedPersonnel?.map((person, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-gray-900">Person {index + 1}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removePersonnel(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={person.name}
                          onChange={(e) => updatePersonnel(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter person name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <select
                          value={person.role}
                          onChange={(e) => updatePersonnel(index, 'role', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select role</option>
                          <option value="Lead Researcher">Lead Researcher</option>
                          <option value="Research Assistant">Research Assistant</option>
                          <option value="Data Collector">Data Collector</option>
                          <option value="Laboratory Technician">Laboratory Technician</option>
                          <option value="Quality Control">Quality Control</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Responsibility
                        </label>
                        <textarea
                          value={person.responsibility}
                          onChange={(e) => updatePersonnel(index, 'responsibility', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Describe responsibilities"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={person.startDate ? new Date(person.startDate).toISOString().split('T')[0] : ''}
                          onChange={(e) => updatePersonnel(index, 'startDate', new Date(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Hours Allocated
                        </label>
                        <input
                          type="number"
                          value={person.hoursAllocated}
                          onChange={(e) => updatePersonnel(index, 'hoursAllocated', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Allocated *
                </label>
                <div className="relative">
                  <DollarSign className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={formData.costTracking?.budgetAllocated || ''}
                    onChange={(e) => handleCostTrackingChange('budgetAllocated', parseFloat(e.target.value))}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Material Costs
                </label>
                <div className="relative">
                  <DollarSign className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={formData.costTracking?.materialCosts || ''}
                    onChange={(e) => handleCostTrackingChange('materialCosts', parseFloat(e.target.value))}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Equipment Costs
                </label>
                <div className="relative">
                  <DollarSign className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={formData.costTracking?.equipmentCosts || ''}
                    onChange={(e) => handleCostTrackingChange('equipmentCosts', parseFloat(e.target.value))}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Personnel Costs
                </label>
                <div className="relative">
                  <DollarSign className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    value={formData.costTracking?.personnelCosts || ''}
                    onChange={(e) => handleCostTrackingChange('personnelCosts', parseFloat(e.target.value))}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {formData.costTracking?.budgetAllocated && (
              <Card className="p-4 bg-green-50">
                <h4 className="font-medium text-green-900 mb-2">Budget Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Total Allocated:</span>
                    <span className="font-semibold text-green-900">
                      ${formData.costTracking.budgetAllocated.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Estimated Usage:</span>
                    <span className="font-semibold text-green-900">
                      ${((formData.costTracking.materialCosts || 0) + 
                         (formData.costTracking.equipmentCosts || 0) + 
                         (formData.costTracking.personnelCosts || 0)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-green-200 pt-2">
                    <span className="text-green-700">Remaining:</span>
                    <span className="font-semibold text-green-900">
                      ${(formData.costTracking.budgetAllocated - 
                         (formData.costTracking.materialCosts || 0) - 
                         (formData.costTracking.equipmentCosts || 0) - 
                         (formData.costTracking.personnelCosts || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Card className="p-4 bg-yellow-50">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-yellow-900">Safety Considerations</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Review and acknowledge all safety protocols and risk assessments for this experiment.
                  </p>
                </div>
              </div>
            </Card>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Safety Notes
              </label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Document any safety considerations, special protocols, or risk mitigation measures..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Quality Score (1-100)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.qualityScore || ''}
                  onChange={(e) => handleInputChange('qualityScore', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="85"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Data Integrity Score (1-100)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.dataIntegrityScore || ''}
                  onChange={(e) => handleInputChange('dataIntegrityScore', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="95"
                />
              </div>
            </div>

            <Card className="p-4 bg-green-50">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-green-900">Ready to Create</h4>
                  <p className="text-sm text-green-700 mt-1">
                    All required information has been provided. Review your experiment details and create the experiment.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {experiment ? 'Edit Experiment' : 'Create New Experiment'}
            </h2>
            <p className="text-gray-600 mt-1">
              Step {currentStep} of {steps.length}: {steps.find(s => s.id === currentStep)?.title}
            </p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`mx-4 h-0.5 w-12 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
            {currentStep < steps.length ? (
              <Button 
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!validateCurrentStep()}
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={loading || !validateCurrentStep()}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Experiment
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentForm; 