import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Brain,
  Users,
  CheckSquare,
  Square,
  Download,
  Plus,
  Settings,
  Grid3X3,
  List,
  Bell,
  Activity,
  Heart,
  Eye,
  Edit,
  ChevronDown,
  RefreshCw,
  Workflow,
  Calendar,
  Syringe,
  AlertTriangle,
  Clock,
  TrendingUp,
  Target,
  Stethoscope,
  Zap,
  X
} from 'lucide-react';
import { 
  EnhancedReproductiveAnimal,
  ReproductiveAnimalFilter,
  WorkflowTemplate,
  BulkWorkflowAssignment 
} from '../types/workflowTypes';
import { reproductionHubApi, filterReproductiveAnimals } from '../services/reproductionHubMockApi';
import { WorkflowTemplateCreator } from '../components/WorkflowTemplateCreator';
import { BulkWorkflowModal } from '../components/BulkWorkflowModal';

// Compact Dropdown Filter Component
interface CompactFilterDropdownProps {
  label: string;
  value: string | string[];
  options: { value: string; label: string; count?: number }[];
  onChange: (value: string | string[]) => void;
  multiSelect?: boolean;
  icon?: React.ReactNode;
}

const CompactFilterDropdown: React.FC<CompactFilterDropdownProps> = ({
  label,
  value,
  options,
  onChange,
  multiSelect = false,
  icon
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const displayValue = useMemo(() => {
    if (multiSelect && Array.isArray(value)) {
      return value.length === 0 ? 'All' : 
             value.length === 1 ? options.find(o => o.value === value[0])?.label :
             `${value.length} selected`;
    }
    return value === 'ANY' || !value ? 'All' : options.find(o => o.value === value)?.label || value;
  }, [value, options, multiSelect]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
      >
        {icon}
        <div className="flex-1 text-left">
          <div className="text-xs text-gray-500">{label}</div>
          <div className="font-medium text-gray-900 truncate">{displayValue}</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[220px] max-h-64 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                if (multiSelect) {
                  const currentValues = Array.isArray(value) ? value : [];
                  const newValues = currentValues.includes(option.value)
                    ? currentValues.filter(v => v !== option.value)
                    : [...currentValues, option.value];
                  onChange(newValues);
                } else {
                  onChange(option.value);
                  setIsOpen(false);
                }
              }}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2">
                {multiSelect && (
                  <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center">
                    {Array.isArray(value) && value.includes(option.value) && (
                      <div className="w-2 h-2 bg-blue-600 rounded"></div>
                    )}
                  </div>
                )}
                {option.label}
              </span>
              {option.count !== undefined && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {option.count}
                </span>
              )}
            </button>
                     ))}
          </div>
      )}
    </div>
  );
};

// Critical Information Card Component - Horizontal Layout
interface ReproductiveAnimalCardProps {
  animal: EnhancedReproductiveAnimal;
  isSelected: boolean;
  onSelect: () => void;
  onViewDetails: () => void;
}

const ReproductiveAnimalCard: React.FC<ReproductiveAnimalCardProps> = ({
  animal,
  isSelected,
  onSelect,
  onViewDetails
}) => {
  // Format follicle information
  const formatFollicleInfo = () => {
    if (!animal.lastUltrasound) return 'No ultrasound data';
    
    const { leftOvary, rightOvary } = animal.lastUltrasound;
    const totalFollicles = leftOvary.follicleCount + rightOvary.follicleCount;
    const dominantSize = Math.max(leftOvary.dominantFollicle || 0, rightOvary.dominantFollicle || 0);
    
    return `${totalFollicles} follicles (${dominantSize}mm max)`;
  };

  // Format CL information
  const formatCLInfo = () => {
    if (!animal.lastUltrasound) return 'No data';
    
    const { leftCL, rightCL } = animal.lastUltrasound;
    if (!leftCL.present && !rightCL.present) return 'No CL';
    if (leftCL.present && rightCL.present) return 'CL: Both';
    if (leftCL.present) return 'CL: Left';
    if (rightCL.present) return 'CL: Right';
    return 'No CL';
  };

  return (
    <div className={`p-4 border rounded-lg transition-all hover:shadow-md ${
      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
    }`}>
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Selection + Basic Info */}
        <div className="col-span-2">
          <div className="flex items-center gap-3">
            <button onClick={onSelect} className="p-1 rounded hover:bg-gray-100">
              {isSelected ? (
                <CheckSquare className="w-5 h-5 text-blue-600" />
              ) : (
                <Square className="w-5 h-5 text-gray-400" />
              )}
            </button>
            <div>
              <h4 className="font-bold text-gray-900">{animal.name}</h4>
              <p className="text-xs text-gray-600">{animal.animalID}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="px-2 py-1 bg-gray-100 text-xs rounded">{animal.species}</span>
                {animal.roles.map(role => (
                  <span key={role.role} className={`px-2 py-1 text-xs rounded ${
                    role.role === 'DONOR' ? 'bg-purple-100 text-purple-800' :
                    role.role === 'RECIPIENT' ? 'bg-green-100 text-green-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {role.role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Current Workflow */}
        <div className="col-span-2">
          {animal.activeWorkflow ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Workflow className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-sm text-blue-900">
                  {animal.activeWorkflow.templateName}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Step {animal.activeWorkflow.stepNumber}/{animal.activeWorkflow.totalSteps}: {animal.activeWorkflow.currentStep}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-blue-600 h-1.5 rounded-full" 
                  style={{ width: `${animal.activeWorkflow.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Day {animal.activeWorkflow.daysInWorkflow} • {animal.activeWorkflow.status}
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <Workflow className="w-6 h-6 text-gray-300 mx-auto mb-1" />
              <p className="text-xs text-gray-500">No active workflow</p>
            </div>
          )}
        </div>

        {/* Ultrasound Information */}
        <div className="col-span-2">
          {animal.lastUltrasound ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Stethoscope className="w-4 h-4 text-green-600" />
                <span className="font-medium text-sm">
                  {animal.lastUltrasound.daysAgo}d ago
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-1">{formatCLInfo()}</p>
              <p className="text-xs text-gray-600 mb-1">{formatFollicleInfo()}</p>
              <p className="text-xs text-gray-600">
                Uterus: {animal.lastUltrasound.uterineStatus.endometritis !== 'NONE' ? 
                  animal.lastUltrasound.uterineStatus.endometritis : 'Normal'}
              </p>
              <span className={`inline-block px-2 py-1 text-xs rounded mt-1 ${
                animal.lastUltrasound.breedingReadiness === 'OPTIMAL' ? 'bg-green-100 text-green-800' :
                animal.lastUltrasound.breedingReadiness === 'READY' ? 'bg-blue-100 text-blue-800' :
                animal.lastUltrasound.breedingReadiness === 'MONITOR' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {animal.lastUltrasound.breedingReadiness}
              </span>
            </div>
          ) : (
            <div className="text-center py-4">
              <Stethoscope className="w-6 h-6 text-gray-300 mx-auto mb-1" />
              <p className="text-xs text-gray-500">No ultrasound data</p>
            </div>
          )}
        </div>

        {/* Last Injection */}
        <div className="col-span-1">
          {animal.lastInjection ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Syringe className="w-4 h-4 text-orange-600" />
                <span className="font-medium text-sm">
                  {animal.lastInjection.daysAgo}d ago
                </span>
              </div>
              <p className="text-xs text-gray-600 font-medium">{animal.lastInjection.medication}</p>
              <p className="text-xs text-gray-500">{animal.lastInjection.dosage} {animal.lastInjection.route}</p>
              {animal.lastInjection.nextInjectionDue && (
                <p className="text-xs text-blue-600 mt-1">Next due in {
                  Math.ceil((new Date(animal.lastInjection.nextInjectionDue).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
                }d</p>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <Syringe className="w-6 h-6 text-gray-300 mx-auto mb-1" />
              <p className="text-xs text-gray-500">No injections</p>
            </div>
          )}
        </div>

        {/* Reproductive History */}
        <div className="col-span-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-sm">Performance</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-gray-600">Total Cycles:</p>
                <p className="font-medium">{animal.reproductiveHistory.totalCycles}</p>
              </div>
              <div>
                <p className="text-gray-600">Success Rate:</p>
                <p className="font-medium text-green-600">{animal.reproductiveHistory.successRate}%</p>
              </div>
              {animal.roles[0].role === 'DONOR' && (
                <>
                  <div>
                    <p className="text-gray-600">OPU:</p>
                    <p className="font-medium">{animal.reproductiveHistory.totalOPUProcedures}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Flushing:</p>
                    <p className="font-medium">{animal.reproductiveHistory.totalFlushingProcedures}</p>
                  </div>
                </>
              )}
              {animal.roles[0].role === 'RECIPIENT' && (
                <>
                  <div>
                    <p className="text-gray-600">Transfers:</p>
                    <p className="font-medium">{animal.reproductiveHistory.totalTransfers}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Successful:</p>
                    <p className="font-medium">{animal.reproductiveHistory.successfulTransfers}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Next Examination */}
        <div className="col-span-1">
          {animal.nextExamination ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className={`w-4 h-4 ${animal.nextExamination.isOverdue ? 'text-red-600' : 'text-blue-600'}`} />
                <span className={`font-medium text-sm ${animal.nextExamination.isOverdue ? 'text-red-600' : 'text-blue-600'}`}>
                  {animal.nextExamination.isOverdue ? 'OVERDUE' : `${animal.nextExamination.daysUntil}d`}
                </span>
              </div>
              <p className="text-xs text-gray-600">{animal.nextExamination.type}</p>
              <p className="text-xs text-gray-500">{animal.nextExamination.assignedVet}</p>
            </div>
          ) : (
            <div className="text-center py-4">
              <Calendar className="w-6 h-6 text-gray-300 mx-auto mb-1" />
              <p className="text-xs text-gray-500">No scheduled exam</p>
            </div>
          )}
        </div>

        {/* Warnings & Actions */}
        <div className="col-span-1">
          <div className="flex flex-col items-center gap-2">
            {animal.warningFlags.length > 0 && (
              <div className="flex items-center gap-1">
                <AlertTriangle className={`w-4 h-4 ${
                  animal.warningFlags.some(w => w.severity === 'CRITICAL') ? 'text-red-600' :
                  animal.warningFlags.some(w => w.severity === 'HIGH') ? 'text-orange-600' :
                  'text-yellow-600'
                }`} />
                <span className="text-xs font-medium">{animal.warningFlags.length}</span>
              </div>
            )}
            
            <div className="flex gap-1">
              <button
                onClick={onViewDetails}
                className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
                title="Quick Edit"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Details (if any) */}
      {animal.warningFlags.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {animal.warningFlags.slice(0, 2).map((warning, index) => (
              <div
                key={index}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                  warning.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                  warning.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                {warning.message}
              </div>
            ))}
            {animal.warningFlags.length > 2 && (
              <span className="text-xs text-gray-500">
                +{animal.warningFlags.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ReproductionHubPage: React.FC = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('animals');
  const [animals, setAnimals] = useState<EnhancedReproductiveAnimal[]>([]);
  const [filteredAnimals, setFilteredAnimals] = useState<EnhancedReproductiveAnimal[]>([]);
  const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplate[]>([]);
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showTemplateCreator, setShowTemplateCreator] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkflowTemplate | undefined>(undefined);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | undefined>(undefined);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Assignment Groups Filters
  const [assignmentDateFrom, setAssignmentDateFrom] = useState('');
  const [assignmentDateTo, setAssignmentDateTo] = useState('');
  const [protocolTypeFilter, setProtocolTypeFilter] = useState('ALL');
  
  // Enhanced Filter State with all requested filters
  const [filters, setFilters] = useState<ReproductiveAnimalFilter>({
    search: '',
    species: [],
    animalType: [],
    yards: [],
    veterinarians: [],
    daysSinceLastExam: 'ANY',
    nextExamDays: 'ANY',
    clPresence: 'ANY',
    follicleSize: 'ANY',
    uterineStatus: 'ANY',
    breedingReadiness: 'ANY',
    workflowStatus: [],
    currentWorkflowType: [],
    currentStep: [],
    workflowProgress: 'ANY',
    lastInjection: 'ANY',
    injectionMedication: [],
    warningLevel: 'ANY',
    reproductiveStatus: [],
    hasActiveWorkflow: false,
    hasWarnings: false,
    hasInjectionToday: false,
    hasExamTomorrow: false,
    readyForBreeding: false,
    dateRange: null
  });

  // Data Loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [animalsData, templatesData] = await Promise.all([
          reproductionHubApi.getAnimals(),
          reproductionHubApi.getWorkflowTemplates()
        ]);
        
        setAnimals(animalsData);
        setWorkflowTemplates(templatesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter Application
  useEffect(() => {
    const filtered = filterReproductiveAnimals(animals, filters);
    setFilteredAnimals(filtered);
    setSelectedAnimals([]);
  }, [animals, filters]);

  // Selection Management
  const handleSelectAll = () => {
    if (selectedAnimals.length === filteredAnimals.length) {
      setSelectedAnimals([]);
    } else {
      setSelectedAnimals(filteredAnimals.map(a => a.animalID));
    }
  };

  const handleSelectAnimal = (animalId: string) => {
    setSelectedAnimals(prev => 
      prev.includes(animalId) 
        ? prev.filter(id => id !== animalId)
        : [...prev, animalId]
    );
  };

  // Bulk Operations
  const handleBulkWorkflowAssignment = async (assignment: BulkWorkflowAssignment) => {
    try {
      setLoading(true);
      await reproductionHubApi.assignWorkflowToAnimals(assignment);
      
      const updatedAnimals = await reproductionHubApi.getAnimals();
      setAnimals(updatedAnimals);
      setSelectedAnimals([]);
      setShowBulkModal(false);
      
      // Show success notification
      setSuccessMessage(`✅ Successfully assigned "${assignment.templateName}" workflow to ${assignment.selectedAnimalIds.length} animals on ${assignment.batchDate}. Batch notes: "${assignment.batchNotes}"`);
      setShowSuccessNotification(true);
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error assigning workflow:', error);
    } finally {
      setLoading(false);
    }
  };

  // Workflow Template Operations
  const handleCreateTemplate = () => {
    setEditingTemplate(undefined);
    setShowTemplateCreator(true);
  };

  const handleEditTemplate = (template: WorkflowTemplate) => {
    setEditingTemplate(template);
    setShowTemplateCreator(true);
  };

  const handleAssignTemplate = (template: WorkflowTemplate) => {
    setSelectedTemplate(template);
    setShowAssignModal(true);
  };

  const handleSaveTemplate = async (templateData: Omit<WorkflowTemplate, 'id'>) => {
    try {
      setLoading(true);
      if (editingTemplate) {
        await reproductionHubApi.updateWorkflowTemplate(editingTemplate.id, templateData);
      } else {
        await reproductionHubApi.createWorkflowTemplate(templateData);
      }
      
      const updatedTemplates = await reproductionHubApi.getWorkflowTemplates();
      setWorkflowTemplates(updatedTemplates);
      setShowTemplateCreator(false);
      setEditingTemplate(undefined);
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (confirm('Are you sure you want to delete this workflow template?')) {
      try {
        setLoading(true);
        await reproductionHubApi.deleteWorkflowTemplate(templateId);
        
        const updatedTemplates = await reproductionHubApi.getWorkflowTemplates();
        setWorkflowTemplates(updatedTemplates);
      } catch (error) {
        console.error('Error deleting template:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTemplateAssignment = async (assignment: BulkWorkflowAssignment) => {
    await handleBulkWorkflowAssignment(assignment);
    setShowAssignModal(false);
    setSelectedTemplate(undefined);
  };

  // Print Assignment Group Report
  const handlePrintGroupReport = (groupData: {
    name: string;
    date: string;
    animalCount: number;
    protocol: string;
    veterinarian: string;
    notes: string;
  }) => {
    // Generate mock animal internal numbers for demonstration
    const animalInternalNumbers = Array.from({ length: groupData.animalCount }, (_, i) => 
      `RT-${groupData.protocol.charAt(0)}${groupData.protocol.charAt(1)}-${String(1000 + i).padStart(4, '0')}`
    );

    const reportContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Assignment Group Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 5px; }
            .report-title { font-size: 18px; color: #374151; }
            .group-info { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 25px; }
            .info-row { display: flex; margin-bottom: 8px; }
            .info-label { font-weight: bold; width: 150px; color: #374151; }
            .info-value { color: #1f2937; }
            .animals-section { margin-top: 25px; }
            .animals-title { font-size: 16px; font-weight: bold; color: #374151; margin-bottom: 15px; border-bottom: 1px solid #d1d5db; padding-bottom: 5px; }
            .animals-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
            .animal-number { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 4px; padding: 8px; text-align: center; font-family: monospace; font-weight: bold; color: #1e40af; }
            .notes-section { margin-top: 25px; background: #fefce8; border: 1px solid #fde047; border-radius: 8px; padding: 15px; }
            .notes-title { font-weight: bold; color: #a16207; margin-bottom: 8px; }
            .notes-content { color: #713f12; }
            .footer { margin-top: 40px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 15px; }
            @media print {
              body { margin: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">🧬 Reprotech - Reproduction Hub</div>
            <div class="report-title">Assignment Group Report</div>
          </div>

          <div class="group-info">
            <div class="info-row">
              <span class="info-label">Group Name:</span>
              <span class="info-value">${groupData.name}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Assignment Date:</span>
              <span class="info-value">${groupData.date}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Protocol Type:</span>
              <span class="info-value">${groupData.protocol}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Assigned Veterinarian:</span>
              <span class="info-value">${groupData.veterinarian}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Total Animals:</span>
              <span class="info-value">${groupData.animalCount}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Report Generated:</span>
              <span class="info-value">${new Date().toLocaleString()}</span>
            </div>
          </div>

          <div class="animals-section">
            <div class="animals-title">Assigned Animal Internal Numbers</div>
            <div class="animals-grid">
              ${animalInternalNumbers.map(number => 
                `<div class="animal-number">${number}</div>`
              ).join('')}
            </div>
          </div>

          ${groupData.notes ? `
            <div class="notes-section">
              <div class="notes-title">Batch Notes:</div>
              <div class="notes-content">${groupData.notes}</div>
            </div>
          ` : ''}

          <div class="footer">
            Generated by Reprotech Reproduction Hub System<br>
            Report ID: RH-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportContent);
      printWindow.document.close();
    }
  };

  // Filter Options
  const filterOptions = useMemo(() => {
    const species = [...new Set(animals.map(a => a.species))];
    const yards = [...new Set(animals.map(a => a.yard).filter(Boolean))];
    const vets = [...new Set(animals.map(a => a.assignedVet).filter(Boolean))];
    const workflowTypes = [...new Set(animals.map(a => a.activeWorkflow?.templateName).filter(Boolean))];
    const currentSteps = [...new Set(animals.map(a => a.activeWorkflow?.currentStep).filter(Boolean))];
    const medications = [...new Set(animals.map(a => a.lastInjection?.medication).filter(Boolean))];
    
    return { species, yards, vets, workflowTypes, currentSteps, medications };
  }, [animals]);

  const selectedAnimalsData = animals.filter(a => selectedAnimals.includes(a.animalID));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading Reproduction Hub...</span>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reproduction Hub</h1>
            <p className="text-gray-600">Central Intelligence & Control Center for Reproductive Management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            New Workflow
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'animals', name: 'Animal Overview', icon: Users, count: filteredAnimals.length },
              { id: 'workflows', name: 'Workflow Templates', icon: Settings, count: workflowTemplates.length },
              { id: 'active', name: 'Active Workflows', icon: Activity, count: filteredAnimals.filter(a => a.activeWorkflow).length },
              { id: 'assignments', name: 'Assignment Groups', icon: Calendar, count: 0, badge: 'TRACK' },
              { id: 'daily', name: 'Daily Operations', icon: Clock, count: filteredAnimals.filter(a => a.todayInjection || a.nextExamination?.daysUntil === 0).length },
              { id: 'analytics', name: 'Analytics & Reports', icon: TrendingUp }
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.name}
                  {tab.count !== undefined && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === tab.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                  {(tab as any).badge && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-300">
                      {(tab as any).badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'animals' && (
        <>
          {/* Critical Statistics Dashboard */}
          <div className="grid grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">{filteredAnimals.length}</p>
              <p className="text-sm text-gray-600">Total Animals</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <Workflow className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {filteredAnimals.filter(a => a.activeWorkflow).length}
              </p>
              <p className="text-sm text-gray-600">Active Workflows</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {filteredAnimals.filter(a => a.breedingReadiness === 'OPTIMAL' || a.breedingReadiness === 'READY').length}
              </p>
              <p className="text-sm text-gray-600">Ready for Breeding</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <Syringe className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {filteredAnimals.filter(a => a.todayInjection).length}
              </p>
              <p className="text-sm text-gray-600">Injections Today</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {filteredAnimals.filter(a => a.nextExamination && a.nextExamination.daysUntil <= 1).length}
              </p>
              <p className="text-sm text-gray-600">Exams Tomorrow</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {filteredAnimals.filter(a => a.warningFlags.length > 0).length}
              </p>
              <p className="text-sm text-gray-600">Warnings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Filter System */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900">Smart Filters</h3>
          <span className="text-sm text-gray-500">({filteredAnimals.length} of {animals.length} animals)</span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search animals..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>

          {/* Species Filter */}
          <CompactFilterDropdown
            label="Species"
            value={filters.species}
            options={filterOptions.species.map(s => ({ value: s, label: s }))}
            onChange={(value) => setFilters(prev => ({ ...prev, species: value as string[] }))}
            multiSelect
            icon={<Heart className="w-4 h-4 text-pink-500" />}
          />

          {/* Animal Type Filter */}
          <CompactFilterDropdown
            label="Animal Type"
            value={filters.animalType}
            options={[
              { value: 'DONOR', label: 'Donor' },
              { value: 'RECIPIENT', label: 'Recipient' },
              { value: 'BREEDING', label: 'Breeding' }
            ]}
            onChange={(value) => setFilters(prev => ({ ...prev, animalType: value as string[] }))}
            multiSelect
            icon={<Users className="w-4 h-4 text-blue-500" />}
          />

          {/* CL Presence Filter */}
          <CompactFilterDropdown
            label="CL Presence"
            value={filters.clPresence}
            options={[
              { value: 'ANY', label: 'Any' },
              { value: 'LEFT', label: 'Left Ovary' },
              { value: 'RIGHT', label: 'Right Ovary' },
              { value: 'BOTH', label: 'Both Ovaries' },
              { value: 'NONE', label: 'No CL' }
            ]}
            onChange={(value) => setFilters(prev => ({ ...prev, clPresence: value as any }))}
            icon={<Target className="w-4 h-4 text-purple-500" />}
          />

          {/* Follicle Size Filter */}
          <CompactFilterDropdown
            label="Follicle Size"
            value={filters.follicleSize}
            options={[
              { value: 'ANY', label: 'Any Size' },
              { value: '5-9MM', label: '5-9mm' },
              { value: '9-12MM', label: '9-12mm' },
              { value: '12-19MM', label: '12-19mm' },
              { value: '19-25MM', label: '19-25mm' },
              { value: 'ABOVE_25MM', label: '>25mm' },
              { value: 'NO_FOLLICLE', label: 'No Follicles' }
            ]}
            onChange={(value) => setFilters(prev => ({ ...prev, follicleSize: value as any }))}
            icon={<Activity className="w-4 h-4 text-green-500" />}
          />

          {/* Workflow Status Filter */}
          <CompactFilterDropdown
            label="Workflow Type"
            value={filters.currentWorkflowType}
            options={filterOptions.workflowTypes.map(t => ({ value: t, label: t }))}
            onChange={(value) => setFilters(prev => ({ ...prev, currentWorkflowType: value as string[] }))}
            multiSelect
            icon={<Workflow className="w-4 h-4 text-indigo-500" />}
          />

          {/* Current Step Filter */}
          <CompactFilterDropdown
            label="Current Step"
            value={filters.currentStep}
            options={filterOptions.currentSteps.map(s => ({ value: s, label: s }))}
            onChange={(value) => setFilters(prev => ({ ...prev, currentStep: value as string[] }))}
            multiSelect
            icon={<Clock className="w-4 h-4 text-orange-500" />}
          />

          {/* Last Injection Filter */}
          <CompactFilterDropdown
            label="Last Injection"
            value={filters.lastInjection}
            options={[
              { value: 'ANY', label: 'Any Time' },
              { value: 'today', label: 'Today' },
              { value: 'yesterday', label: 'Yesterday' },
              { value: '2-7days', label: '2-7 days ago' },
              { value: '7-14days', label: '7-14 days ago' },
              { value: '14+days', label: '14+ days ago' }
            ]}
            onChange={(value) => setFilters(prev => ({ ...prev, lastInjection: value as string }))}
            icon={<Syringe className="w-4 h-4 text-orange-500" />}
          />

          {/* Days Since Last Exam Filter */}
          <CompactFilterDropdown
            label="Last Exam"
            value={filters.daysSinceLastExam}
            options={[
              { value: 'ANY', label: 'Any Time' },
              { value: '0-7', label: 'Last 7 days' },
              { value: '7-14', label: '7-14 days ago' },
              { value: '14-30', label: '14-30 days ago' },
              { value: '30+', label: '30+ days ago' },
              { value: 'overdue', label: 'Overdue' }
            ]}
            onChange={(value) => setFilters(prev => ({ ...prev, daysSinceLastExam: value as string }))}
            icon={<Stethoscope className="w-4 h-4 text-green-500" />}
          />
        </div>

        {/* Quick Filter Toggles */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t">
          {[
            { key: 'hasActiveWorkflow', label: 'Active Workflow', icon: <Workflow className="w-4 h-4" /> },
            { key: 'hasWarnings', label: 'Has Warnings', icon: <AlertTriangle className="w-4 h-4" /> },
            { key: 'readyForBreeding', label: 'Ready for Breeding', icon: <Target className="w-4 h-4" /> },
            { key: 'hasInjectionToday', label: 'Injection Today', icon: <Syringe className="w-4 h-4" /> },
            { key: 'hasExamTomorrow', label: 'Exam Tomorrow', icon: <Calendar className="w-4 h-4" /> }
          ].map((toggle) => (
            <button
              key={toggle.key}
              onClick={() => setFilters(prev => ({ 
                ...prev, 
                [toggle.key]: !(prev as any)[toggle.key] 
              }))}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                (filters as any)[toggle.key]
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {toggle.icon}
              {toggle.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Selection Shortcuts */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center gap-3 mb-3">
          <Zap className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-900">Quick Selection</h3>
          <span className="text-sm text-gray-500">Select animals by criteria for easy batch assignment</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedAnimals(filteredAnimals.filter(a => a.species === 'CAMEL').map(a => a.animalID))}
            className="flex items-center gap-2 px-3 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 text-sm"
          >
            🐪 All Camels ({filteredAnimals.filter(a => a.species === 'CAMEL').length})
          </button>
          <button
            onClick={() => setSelectedAnimals(filteredAnimals.filter(a => a.species === 'BOVINE').map(a => a.animalID))}
            className="flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 text-sm"
          >
            🐄 All Bovine ({filteredAnimals.filter(a => a.species === 'BOVINE').length})
          </button>
          <button
            onClick={() => setSelectedAnimals(filteredAnimals.filter(a => a.roles[0].role === 'DONOR').map(a => a.animalID))}
            className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 text-sm"
          >
            <Heart className="w-4 h-4" /> All Donors ({filteredAnimals.filter(a => a.roles[0].role === 'DONOR').length})
          </button>
          <button
            onClick={() => setSelectedAnimals(filteredAnimals.filter(a => a.roles[0].role === 'RECIPIENT').map(a => a.animalID))}
            className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-sm"
          >
            <Target className="w-4 h-4" /> All Recipients ({filteredAnimals.filter(a => a.roles[0].role === 'RECIPIENT').length})
          </button>
          <button
            onClick={() => setSelectedAnimals(filteredAnimals.filter(a => a.breedingReadiness === 'OPTIMAL' || a.breedingReadiness === 'READY').map(a => a.animalID))}
            className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 text-sm"
          >
            <Activity className="w-4 h-4" /> Ready for Breeding ({filteredAnimals.filter(a => a.breedingReadiness === 'OPTIMAL' || a.breedingReadiness === 'READY').length})
          </button>
          <button
            onClick={() => setSelectedAnimals(filteredAnimals.filter(a => !a.activeWorkflow).map(a => a.animalID))}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-sm"
          >
            <Clock className="w-4 h-4" /> No Active Workflow ({filteredAnimals.filter(a => !a.activeWorkflow).length})
          </button>
          <button
            onClick={() => setSelectedAnimals(filteredAnimals.filter(a => a.warningFlags.length > 0).map(a => a.animalID))}
            className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 text-sm"
          >
            <AlertTriangle className="w-4 h-4" /> Has Warnings ({filteredAnimals.filter(a => a.warningFlags.length > 0).length})
          </button>
        </div>
      </div>

      {/* Enhanced Bulk Operations Bar */}
      {selectedAnimals.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <CheckSquare className="w-6 h-6 text-blue-600" />
                <div>
                  <span className="font-bold text-blue-900 text-lg">
                    {selectedAnimals.length} animals selected
                  </span>
                  <p className="text-sm text-blue-700">
                    Ready for batch workflow assignment
                  </p>
                </div>
              </div>
              
              {/* Selection Summary */}
              <div className="flex gap-2">
                {selectedAnimalsData.filter(a => a.species === 'CAMEL').length > 0 && (
                  <span className="px-2 py-1 bg-amber-200 text-amber-800 rounded text-xs">
                    🐪 {selectedAnimalsData.filter(a => a.species === 'CAMEL').length} Camels
                  </span>
                )}
                {selectedAnimalsData.filter(a => a.species === 'BOVINE').length > 0 && (
                  <span className="px-2 py-1 bg-orange-200 text-orange-800 rounded text-xs">
                    🐄 {selectedAnimalsData.filter(a => a.species === 'BOVINE').length} Bovine
                  </span>
                )}
                {selectedAnimalsData.filter(a => a.roles[0].role === 'DONOR').length > 0 && (
                  <span className="px-2 py-1 bg-purple-200 text-purple-800 rounded text-xs">
                    {selectedAnimalsData.filter(a => a.roles[0].role === 'DONOR').length} Donors
                  </span>
                )}
                {selectedAnimalsData.filter(a => a.roles[0].role === 'RECIPIENT').length > 0 && (
                  <span className="px-2 py-1 bg-green-200 text-green-800 rounded text-xs">
                    {selectedAnimalsData.filter(a => a.roles[0].role === 'RECIPIENT').length} Recipients
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBulkModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium shadow-lg"
              >
                <Workflow className="w-5 h-5" />
                Assign Workflow Batch
              </button>
              <button
                onClick={() => setSelectedAnimals([])}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animals Display - Horizontal Cards */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSelectAll}
                className="p-1 rounded hover:bg-gray-100"
              >
                {selectedAnimals.length === filteredAnimals.length && filteredAnimals.length > 0 ? (
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400" />
                )}
              </button>
              <h3 className="font-semibold text-gray-900">
                Reproductive Animals ({filteredAnimals.length})
              </h3>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Column Headers */}
        <div className="px-4 py-3 bg-gray-50 border-b">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
            <div className="col-span-2">Animal Info</div>
            <div className="col-span-2">Current Workflow</div>
            <div className="col-span-2">Ultrasound Results</div>
            <div className="col-span-1">Last Injection</div>
            <div className="col-span-2">Performance History</div>
            <div className="col-span-1">Next Exam</div>
            <div className="col-span-1">Warnings & Actions</div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredAnimals.map(animal => (
            <ReproductiveAnimalCard
              key={animal.animalID}
              animal={animal}
              isSelected={selectedAnimals.includes(animal.animalID)}
              onSelect={() => handleSelectAnimal(animal.animalID)}
              onViewDetails={() => console.log('View details for', animal.animalID)}
            />
          ))}
        </div>

                  {filteredAnimals.length === 0 && (
            <div className="text-center py-12">
              <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No animals found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more results</p>
            </div>
          )}
        </div>
        </>
      )}

      {/* Workflow Templates Tab */}
      {activeTab === 'workflows' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Workflow Templates</h2>
            <button 
              onClick={handleCreateTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Create Template
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workflowTemplates.map(template => (
              <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <span className="ml-auto text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded">
                    v{template.version}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span>Steps: {template.steps.length}</span>
                  <span>Success: {template.expectedSuccessRate}%</span>
                  <span>Used: {template.usageCount}x</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEditTemplate(template)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleAssignTemplate(template)}
                    className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                  >
                    Assign
                  </button>
                  <button 
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {workflowTemplates.length === 0 && (
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No workflow templates</h3>
              <p className="text-gray-600 mb-4">Create your first workflow template to get started</p>
              <button 
                onClick={handleCreateTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Create Template
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active Workflows Tab */}
      {activeTab === 'active' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Active Workflows</h2>
          
          <div className="space-y-4">
            {filteredAnimals.filter(a => a.activeWorkflow).map(animal => (
              <div key={animal.animalID} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{animal.name}</h3>
                      <p className="text-sm text-gray-600">{animal.animalID}</p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">{animal.activeWorkflow?.templateName}</p>
                      <p className="text-sm text-gray-600">
                        Step {animal.activeWorkflow?.stepNumber}/{animal.activeWorkflow?.totalSteps}: {animal.activeWorkflow?.currentStep}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Day {animal.activeWorkflow?.daysInWorkflow}</p>
                      <p className="text-xs text-gray-500">{animal.activeWorkflow?.status}</p>
                    </div>
                    <div className="w-24">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${animal.activeWorkflow?.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{animal.activeWorkflow?.progress}%</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assignment Groups Tab */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          {/* Assignment Groups Header */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Assignment Groups Tracking</h2>
                  <p className="text-gray-600">Track workflow assignments by batch date and monitor progress</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handlePrintGroupReport({
                    name: 'All Assignment Groups',
                    date: `${assignmentDateFrom || 'All dates'} - ${assignmentDateTo || 'All dates'}`,
                    animalCount: 23, // Sum of all animals
                    protocol: protocolTypeFilter === 'ALL' ? 'All Protocols' : protocolTypeFilter,
                    veterinarian: 'Multiple Veterinarians',
                    notes: `Comprehensive report for all assignment groups matching current filters. Generated on ${new Date().toLocaleDateString()}.`
                  })}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Download className="w-4 h-4" />
                  Export All Groups
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <h4 className="font-medium text-gray-900">Filter Assignment Groups</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
                  <input
                    type="date"
                    value={assignmentDateFrom}
                    onChange={(e) => setAssignmentDateFrom(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
                  <input
                    type="date"
                    value={assignmentDateTo}
                    onChange={(e) => setAssignmentDateTo(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* Protocol Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Protocol Type</label>
                  <select
                    value={protocolTypeFilter}
                    onChange={(e) => setProtocolTypeFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Protocols</option>
                    {workflowTemplates.map(template => (
                      <option key={template.id} value={template.name}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Quick Filter Buttons */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-700">Quick Filters:</span>
                <button 
                  onClick={() => {
                    setAssignmentDateFrom(new Date().toISOString().split('T')[0]);
                    setAssignmentDateTo(new Date().toISOString().split('T')[0]);
                  }}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
                >
                  Today
                </button>
                <button 
                  onClick={() => {
                    const yesterday = new Date(Date.now() - 24*60*60*1000).toISOString().split('T')[0];
                    setAssignmentDateFrom(yesterday);
                    setAssignmentDateTo(yesterday);
                  }}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                >
                  Yesterday
                </button>
                <button 
                  onClick={() => {
                    const weekAgo = new Date(Date.now() - 7*24*60*60*1000).toISOString().split('T')[0];
                    const today = new Date().toISOString().split('T')[0];
                    setAssignmentDateFrom(weekAgo);
                    setAssignmentDateTo(today);
                  }}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                >
                  Last 7 Days
                </button>
                <button 
                  onClick={() => {
                    setAssignmentDateFrom('');
                    setAssignmentDateTo('');
                    setProtocolTypeFilter('ALL');
                  }}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Filter Results Indicator */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="font-medium text-blue-900">Filter Results</h4>
                  <p className="text-sm text-blue-700">
                    {assignmentDateFrom || assignmentDateTo || protocolTypeFilter !== 'ALL' 
                      ? `Showing 5 assignment groups matching filters` 
                      : 'Showing all assignment groups (5 total)'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-blue-900">Total Animals: 23</p>
                <p className="text-xs text-blue-600">Active protocols in progress</p>
              </div>
            </div>
          </div>

          {/* Assignment Groups by Date */}
          <div className="grid grid-cols-1 gap-6">
            {/* Today's Assignments */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-blue-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-gray-900">Today - {new Date().toLocaleDateString()}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                      3 Batch Groups
                    </span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    View All →
                  </button>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Batch Group 1 */}
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Camel Superovulation Protocol - Complete</h4>
                        <p className="text-sm text-gray-600">Batch assigned: 09:30 AM • Dr. Sarah Al-Rashid</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        8 animals assigned
                      </span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handlePrintGroupReport({
                            name: 'Camel Superovulation Protocol - Complete',
                            date: new Date().toLocaleDateString(),
                            animalCount: 8,
                            protocol: 'Camel Superovulation Protocol - Complete',
                            veterinarian: 'Dr. Sarah Al-Rashid',
                            notes: 'High-quality donor camels selected for enhanced superovulation program. All animals showed optimal follicle development in pre-screening ultrasound.'
                          })}
                          className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm hover:bg-purple-200"
                        >
                          <Download className="w-3 h-3" />
                          Print Report
                        </button>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">View Details</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-4 mb-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Species</p>
                      <p className="font-medium">🐪 Camel</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Animal Type</p>
                      <p className="font-medium">Donors</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Progress</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">25% (Step 2/8)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Next Step Date</p>
                      <p className="font-medium text-orange-600">{new Date(Date.now() + 2*24*60*60*1000).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">GnRH Injection</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Final Date</p>
                      <p className="font-medium text-blue-600">{new Date(Date.now() + 15*24*60*60*1000).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">Completion Target</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Batch Notes:</span> High-quality donor camels selected for enhanced superovulation program. 
                      All animals showed optimal follicle development in pre-screening ultrasound.
                    </p>
                  </div>
                </div>

                {/* Batch Group 2 */}
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Bovine Estrus Synchronization</h4>
                        <p className="text-sm text-gray-600">Batch assigned: 11:15 AM • Dr. Ahmed Hassan</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        12 animals assigned
                      </span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handlePrintGroupReport({
                            name: 'Bovine Estrus Synchronization',
                            date: new Date().toLocaleDateString(),
                            animalCount: 12,
                            protocol: 'Bovine Estrus Synchronization',
                            veterinarian: 'Dr. Ahmed Hassan',
                            notes: 'Recipient synchronization group for upcoming embryo transfer session. Animals selected based on optimal CL formation and uterine environment assessment.'
                          })}
                          className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm hover:bg-purple-200"
                        >
                          <Download className="w-3 h-3" />
                          Print Report
                        </button>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">View Details</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-4 mb-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Species</p>
                      <p className="font-medium">🐄 Bovine</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Animal Type</p>
                      <p className="font-medium">Recipients</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Progress</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">60% (Step 3/5)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Next Step Date</p>
                      <p className="font-medium text-green-600">{new Date(Date.now() + 1*24*60*60*1000).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">Embryo Transfer</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Final Date</p>
                      <p className="font-medium text-blue-600">{new Date(Date.now() + 7*24*60*60*1000).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">Completion Target</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Batch Notes:</span> Recipient synchronization group for upcoming embryo transfer session. 
                      Animals selected based on optimal CL formation and uterine environment assessment.
                    </p>
                  </div>
                </div>

                {/* Batch Group 3 */}
                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Camel Emergency Treatment Protocol</h4>
                        <p className="text-sm text-gray-600">Batch assigned: 02:45 PM • Dr. Maria Rodriguez</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        3 animals assigned
                      </span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handlePrintGroupReport({
                            name: 'Camel Emergency Treatment Protocol',
                            date: new Date().toLocaleDateString(),
                            animalCount: 3,
                            protocol: 'Camel Emergency Treatment Protocol',
                            veterinarian: 'Dr. Maria Rodriguez',
                            notes: 'Animals showing complications from previous protocols. Requires immediate veterinary attention and intensive monitoring throughout recovery phase.'
                          })}
                          className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm hover:bg-purple-200"
                        >
                          <Download className="w-3 h-3" />
                          Print Report
                        </button>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">View Details</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-4 mb-3">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Species</p>
                      <p className="font-medium">Mixed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Animal Type</p>
                      <p className="font-medium">Critical</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Progress</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">80% (Step 4/5)</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Next Step Date</p>
                      <p className="font-medium text-red-600">{new Date().toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">Critical Monitoring</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Final Date</p>
                      <p className="font-medium text-purple-600">{new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">Recovery Target</p>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-red-800">Priority Batch Notes:</span> Animals showing complications from previous protocols. 
                      Requires immediate veterinary attention and intensive monitoring throughout recovery phase.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Yesterday's Assignments */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <h3 className="font-bold text-gray-900">Yesterday - {new Date(Date.now() - 24*60*60*1000).toLocaleDateString()}</h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-medium">
                      2 Batch Groups
                    </span>
                  </div>
                  <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                    View All →
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <h4 className="font-semibold text-gray-900">Camel Recipient Synchronization</h4>
                      </div>
                      <button 
                        onClick={() => handlePrintGroupReport({
                          name: 'Camel Recipient Synchronization',
                          date: new Date(Date.now() - 1*24*60*60*1000).toLocaleDateString(),
                          animalCount: 6,
                          protocol: 'Camel Recipient Synchronization',
                          veterinarian: 'Dr. Sarah Al-Rashid',
                          notes: 'Camel recipient synchronization completed successfully. All animals responded well to the preparation protocol.'
                        })}
                        className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs hover:bg-purple-200"
                      >
                        <Download className="w-3 h-3" />
                        Print
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">6 animals • Completed: {new Date(Date.now() - 1*24*60*60*1000).toLocaleDateString()}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                    <p className="text-xs text-green-600 font-medium">✓ Successfully completed - Final step on {new Date(Date.now() - 1*24*60*60*1000).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <h4 className="font-semibold text-gray-900">Bovine Estrus Synchronization</h4>
                      </div>
                      <button 
                        onClick={() => handlePrintGroupReport({
                          name: 'Bovine Estrus Synchronization',
                          date: new Date(Date.now() - 1*24*60*60*1000).toLocaleDateString(),
                          animalCount: 10,
                          protocol: 'Bovine Estrus Synchronization',
                          veterinarian: 'Dr. Ahmed Hassan',
                          notes: 'Bovine estrus synchronization protocol in progress. Animals showing good response to hormonal treatment.'
                        })}
                        className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs hover:bg-purple-200"
                      >
                        <Download className="w-3 h-3" />
                        Print
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">10 animals • Next step: {new Date().toLocaleDateString()}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <p className="text-xs text-blue-600 font-medium">→ Monitoring until {new Date(Date.now() + 2*24*60*60*1000).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Schedule Overview */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-purple-600" />
              <h3 className="text-xl font-bold text-gray-900">7-Day Assignment Schedule</h3>
              <span className="text-sm text-gray-500">Track all upcoming workflow steps by date</span>
            </div>
            
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
                const isToday = i === 0;
                const isTomorrow = i === 1;
                
                return (
                  <div key={i} className={`border rounded-lg p-4 ${
                    isToday ? 'border-blue-500 bg-blue-50' : 
                    isTomorrow ? 'border-green-500 bg-green-50' : 
                    'border-gray-200 bg-white'
                  }`}>
                    <div className="text-center mb-3">
                      <p className="text-sm font-medium text-gray-900">
                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                      </p>
                      <p className={`text-lg font-bold ${
                        isToday ? 'text-blue-900' : 
                        isTomorrow ? 'text-green-900' : 
                        'text-gray-900'
                      }`}>
                        {date.getDate()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      {/* Today's scheduled items */}
                      {isToday && (
                        <>
                          <div className="bg-red-100 border border-red-200 rounded p-2">
                            <p className="text-xs font-medium text-red-800">Critical Monitoring</p>
                            <p className="text-xs text-red-600">3 animals</p>
                          </div>
                          <div className="bg-blue-100 border border-blue-200 rounded p-2">
                            <p className="text-xs font-medium text-blue-800">Estrus Check</p>
                            <p className="text-xs text-blue-600">10 animals</p>
                          </div>
                        </>
                      )}
                      
                      {/* Tomorrow's scheduled items */}
                      {isTomorrow && (
                        <>
                          <div className="bg-green-100 border border-green-200 rounded p-2">
                            <p className="text-xs font-medium text-green-800">Embryo Transfer</p>
                            <p className="text-xs text-green-600">12 animals</p>
                          </div>
                        </>
                      )}
                      
                      {/* Day 2 */}
                      {i === 2 && (
                        <div className="bg-orange-100 border border-orange-200 rounded p-2">
                          <p className="text-xs font-medium text-orange-800">GnRH Injection</p>
                          <p className="text-xs text-orange-600">8 animals</p>
                        </div>
                      )}
                      
                      {/* Day 3 */}
                      {i === 3 && (
                        <div className="bg-purple-100 border border-purple-200 rounded p-2">
                          <p className="text-xs font-medium text-purple-800">Recovery Complete</p>
                          <p className="text-xs text-purple-600">3 animals</p>
                        </div>
                      )}
                      
                      {/* Day 7 */}
                      {i === 6 && (
                        <div className="bg-blue-100 border border-blue-200 rounded p-2">
                          <p className="text-xs font-medium text-blue-800">Protocol Complete</p>
                          <p className="text-xs text-blue-600">12 animals</p>
                        </div>
                      )}
                      
                      {/* Empty state */}
                      {![0, 1, 2, 3, 6].includes(i) && (
                        <div className="text-center py-2">
                          <p className="text-xs text-gray-400">No scheduled steps</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Day indicator */}
                    {isToday && (
                      <div className="mt-2 text-center">
                        <span className="inline-block px-2 py-1 bg-blue-600 text-white rounded-full text-xs font-bold">
                          TODAY
                        </span>
                      </div>
                    )}
                    {isTomorrow && (
                      <div className="mt-2 text-center">
                        <span className="inline-block px-2 py-1 bg-green-600 text-white rounded-full text-xs font-bold">
                          TOMORROW
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Critical/Emergency</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Injections</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Procedures</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Monitoring/Checks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Completion/Recovery</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily Operations Tab */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          {/* Today's Injections */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Injections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAnimals.filter(a => a.todayInjection).map(animal => (
                <div key={animal.animalID} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Syringe className="w-4 h-4 text-orange-600" />
                    <h3 className="font-semibold">{animal.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{animal.todayInjection?.medication} - {animal.todayInjection?.dosage}</p>
                  <p className="text-xs text-gray-500">Time: {animal.todayInjection?.scheduledTime}</p>
                  <p className="text-xs text-gray-500">Yard: {animal.yard}</p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 text-xs rounded ${
                      animal.todayInjection?.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      animal.todayInjection?.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {animal.todayInjection?.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tomorrow's Exams */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Tomorrow's Examinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAnimals.filter(a => a.nextExamination?.daysUntil === 1).map(animal => (
                <div key={animal.animalID} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Stethoscope className="w-4 h-4 text-green-600" />
                    <h3 className="font-semibold">{animal.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{animal.nextExamination?.type}</p>
                  <p className="text-xs text-gray-500">Vet: {animal.nextExamination?.assignedVet}</p>
                  <p className="text-xs text-gray-500">Room: {animal.nextExamination?.room}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Analytics & Reports</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Success Rates */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Success Rates</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Overall:</span>
                  <span className="font-medium">
                    {Math.round(filteredAnimals.reduce((acc, a) => acc + a.reproductiveHistory.successRate, 0) / filteredAnimals.length)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Donors:</span>
                  <span className="font-medium">
                    {Math.round(filteredAnimals.filter(a => a.roles[0].role === 'DONOR').reduce((acc, a) => acc + a.reproductiveHistory.successRate, 0) / filteredAnimals.filter(a => a.roles[0].role === 'DONOR').length)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Recipients:</span>
                  <span className="font-medium">
                    {Math.round(filteredAnimals.filter(a => a.roles[0].role === 'RECIPIENT').reduce((acc, a) => acc + a.reproductiveHistory.successRate, 0) / filteredAnimals.filter(a => a.roles[0].role === 'RECIPIENT').length)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Activity Summary */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Activity Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Workflows:</span>
                  <span className="font-medium">{filteredAnimals.filter(a => a.activeWorkflow).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Today's Injections:</span>
                  <span className="font-medium">{filteredAnimals.filter(a => a.todayInjection).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Warnings:</span>
                  <span className="font-medium">{filteredAnimals.filter(a => a.warningFlags.length > 0).length}</span>
                </div>
              </div>
            </div>

            {/* Breeding Readiness */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Breeding Readiness</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Optimal:</span>
                  <span className="font-medium text-green-600">{filteredAnimals.filter(a => a.breedingReadiness === 'OPTIMAL').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ready:</span>
                  <span className="font-medium text-blue-600">{filteredAnimals.filter(a => a.breedingReadiness === 'READY').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monitor:</span>
                  <span className="font-medium text-yellow-600">{filteredAnimals.filter(a => a.breedingReadiness === 'MONITOR').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Not Ready:</span>
                  <span className="font-medium text-red-600">{filteredAnimals.filter(a => a.breedingReadiness === 'NOT_READY').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Workflow Assignment Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Bulk Workflow Assignment</h2>
              <button onClick={() => setShowBulkModal(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Assign workflow to {selectedAnimals.length} selected animals
            </p>
            {/* Bulk assignment form would go here */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Assign Workflow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-md">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-green-900 mb-1">Batch Assignment Successful!</h4>
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
            <button
              onClick={() => setShowSuccessNotification(false)}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-green-100"
            >
              <X className="w-4 h-4 text-green-600" />
            </button>
          </div>
        </div>
      )}

      {/* Workflow Template Creator Modal */}
      <WorkflowTemplateCreator
        isOpen={showTemplateCreator}
        onClose={() => {
          setShowTemplateCreator(false);
          setEditingTemplate(undefined);
        }}
        onSave={handleSaveTemplate}
        editingTemplate={editingTemplate}
      />

      {/* Bulk Workflow Assignment Modal */}
      {showAssignModal && selectedTemplate && (
        <BulkWorkflowModal
          isOpen={showAssignModal}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedTemplate(undefined);
          }}
          onAssign={handleTemplateAssignment}
          selectedAnimals={filteredAnimals}
          workflowTemplates={[selectedTemplate]}
        />
      )}
    </div>
  );
};

export default ReproductionHubPage; 