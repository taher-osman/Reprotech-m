import React, { useState } from 'react';
import { Users, Workflow, Calendar, User, AlertCircle, CheckCircle, X } from 'lucide-react';
import { 
  BulkWorkflowAssignment, 
  WorkflowTemplate, 
  EnhancedReproductiveAnimal 
} from '../types/workflowTypes';

interface BulkWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAnimals: EnhancedReproductiveAnimal[];
  workflowTemplates: WorkflowTemplate[];
  onAssign: (assignment: BulkWorkflowAssignment) => void;
  loading?: boolean;
}

export const BulkWorkflowModal: React.FC<BulkWorkflowModalProps> = ({
  isOpen,
  onClose,
  selectedAnimals,
  workflowTemplates,
  onAssign,
  loading = false
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [assignedVet, setAssignedVet] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [batchDate, setBatchDate] = useState(new Date().toISOString().split('T')[0]);
  const [batchNotes, setBatchNotes] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [reasoning, setReasoning] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!selectedTemplate) {
      newErrors.push('Please select a workflow template');
    }
    if (!assignedVet) {
      newErrors.push('Please assign a veterinarian');
    }
    if (!reasoning.trim()) {
      newErrors.push('Please provide reasoning for this assignment');
    }
    if (!batchNotes.trim()) {
      newErrors.push('Please provide batch notes for easier tracking');
    }
    if (selectedAnimals.length === 0) {
      newErrors.push('No animals selected');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const template = workflowTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;

    const assignment: BulkWorkflowAssignment = {
      templateId: selectedTemplate,
      templateName: template.name,
      selectedAnimalIds: selectedAnimals.map(a => a.animalID),
      startDate,
      batchDate,
      batchNotes: batchNotes.trim(),
      assignedVet,
      priority,
      reasoning: reasoning.trim()
    };

    onAssign(assignment);
    
    // Reset form
    setSelectedTemplate('');
    setAssignedVet('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setBatchDate(new Date().toISOString().split('T')[0]);
    setBatchNotes('');
    setPriority('MEDIUM');
    setReasoning('');
    setErrors([]);
  };

  // Available veterinarians (TODO: Replace with real API data)
  const availableVets = [
    'Dr. Ahmed Al-Rashid',
    'Dr. Sarah Johnson',
    'Dr. Mohammed Hassan',
    'Dr. Fatima Al-Zahra',
    'Dr. Omar Abdullah',
    'Dr. Leila Mansouri'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Workflow className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Bulk Workflow Assignment</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Selected Animals Summary */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-blue-900">Selected Animals</h3>
            </div>
            <p className="text-blue-800 mb-3">
              <strong>{selectedAnimals.length}</strong> animals selected for workflow assignment
            </p>
            
            {/* Animals preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {selectedAnimals.slice(0, 10).map(animal => (
                <div key={animal.animalID} className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  <span className="font-medium">{animal.animalID}</span>
                  <span className="text-blue-700">({animal.name})</span>
                  <span className="text-blue-600">{animal.species}</span>
                </div>
              ))}
              {selectedAnimals.length > 10 && (
                <div className="text-sm text-blue-700 italic">
                  ...and {selectedAnimals.length - 10} more animals
                </div>
              )}
            </div>
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-medium text-red-900">Please fix the following errors:</h3>
              </div>
              <ul className="list-disc list-inside space-y-1 text-red-800">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Assignment Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Workflow Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Workflow Template *
              </label>
              <div className="space-y-3">
                {workflowTemplates.map(template => (
                  <div
                    key={template.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <input
                            type="radio"
                            name="template"
                            value={template.id}
                            checked={selectedTemplate === template.id}
                            onChange={() => setSelectedTemplate(template.id)}
                            className="text-blue-600"
                          />
                          <h4 className="font-medium text-gray-900">{template.name}</h4>
                          <span className={`px-2 py-1 text-xs rounded ${
                            template.category === 'DONOR_COMPLETE' ? 'bg-purple-100 text-purple-800' :
                            template.category === 'RECIPIENT_SYNC' ? 'bg-green-100 text-green-800' :
                            template.category === 'BREEDING_CYCLE' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {template.category.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Success Rate: {template.expectedSuccessRate}%</span>
                          <span>Duration: ~{template.averageDuration} days</span>
                          <span>Steps: {template.steps.length}</span>
                          <span>Priority: {template.priority}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Batch Assignment Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Batch Assignment Details
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Batch Assignment Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch Assignment Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={batchDate}
                    onChange={(e) => setBatchDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Date when this batch workflow was assigned
                  </p>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Workflow Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    When to start the workflow (defaults to today)
                  </p>
                </div>
              </div>

              {/* Batch Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Notes *
                </label>
                <textarea
                  required
                  value={batchNotes}
                  onChange={(e) => setBatchNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                  placeholder="Enter notes to help identify and track this batch (e.g., 'Superovulation batch for January donors', 'Recipient sync group 1', 'High-priority breeding batch')"
                />
                <p className="text-xs text-gray-500 mt-1">
                  These notes will help identify this batch for easier follow-up and tracking
                </p>
              </div>
            </div>

            {/* Assignment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assigned Veterinarian */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assigned Veterinarian *
                </label>
                <select
                  required
                  value={assignedVet}
                  onChange={(e) => setAssignedVet(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Veterinarian</option>
                  {availableVets.map(vet => (
                    <option key={vet} value={vet}>{vet}</option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              {/* Estimated Completion */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Completion
                </label>
                <div className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-600">
                  {selectedTemplate && workflowTemplates.find(t => t.id === selectedTemplate) ? (
                    (() => {
                      const template = workflowTemplates.find(t => t.id === selectedTemplate)!;
                      const completionDate = new Date(startDate);
                      completionDate.setDate(completionDate.getDate() + template.averageDuration);
                      return completionDate.toLocaleDateString();
                    })()
                  ) : (
                    'Select template first'
                  )}
                </div>
              </div>
            </div>

            {/* Reasoning */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Reasoning *
              </label>
              <textarea
                required
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                placeholder="Explain why this workflow is being assigned to these animals..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              />
              <p className="text-xs text-gray-500 mt-1">
                This reasoning will be logged for audit purposes
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedTemplate || !assignedVet || !reasoning.trim() || !batchNotes.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Assigning...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Assign Workflow
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}; 