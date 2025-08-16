import React, { useState, useEffect } from 'react';
import { 
  Award,
  Upload,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Users,
  DollarSign,
  FolderOpen,
  FileText,
  Clock,
  ArrowRight,
  Zap,
  AlertCircle,
  X,
  Download,
  Eye,
  Settings
} from 'lucide-react';
import { 
  Tender, 
  TenderStatus,
  ProjectIntegration,
  FinanceIntegration,
  HRIntegration
} from '../types/tenderTypes';

interface TenderAwardHandlerProps {
  tender: Tender;
  onAward: (awardData: AwardData) => Promise<void>;
  onClose: () => void;
  currentUser: {
    user_id: string;
    name: string;
    role: string;
    permissions: string[];
  };
  className?: string;
}

interface AwardData {
  award_value: number;
  award_currency: string;
  award_date: string;
  contract_start_date: string;
  contract_end_date: string;
  award_letter: File | null;
  signed_contract: File | null;
  project_manager_id: string;
  project_phases: ProjectPhase[];
  budget_breakdown: BudgetBreakdown[];
  team_assignments: TeamAssignment[];
  compliance_requirements: ComplianceItem[];
  notifications: NotificationConfig[];
}

interface ProjectPhase {
  phase_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  budget_allocated: number;
  deliverables: string[];
  dependencies: string[];
  assigned_team: string[];
}

interface BudgetBreakdown {
  category: string;
  amount: number;
  percentage: number;
  approval_required: boolean;
  assigned_to: string;
}

interface TeamAssignment {
  user_id: string;
  user_name: string;
  project_role: string;
  allocation_percentage: number;
  start_date: string;
  end_date?: string;
}

interface ComplianceItem {
  requirement: string;
  due_date: string;
  responsible_department: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

interface NotificationConfig {
  type: 'email' | 'system' | 'sms';
  recipients: string[];
  template: string;
  trigger: 'immediate' | 'scheduled';
  schedule_date?: string;
}

// Mock data for demonstration
const mockProjectPhases: ProjectPhase[] = [
  {
    phase_id: 'phase-001',
    title: 'Project Initiation & Planning',
    description: 'Initial setup, team formation, and detailed project planning',
    start_date: '2025-07-15',
    end_date: '2025-08-15',
    budget_allocated: 125000,
    deliverables: ['Project Charter', 'Resource Plan', 'Risk Assessment'],
    dependencies: [],
    assigned_team: ['emp-001', 'emp-002']
  },
  {
    phase_id: 'phase-002',
    title: 'Equipment Procurement',
    description: 'Sourcing, ordering, and quality assurance of medical equipment',
    start_date: '2025-08-16',
    end_date: '2025-10-31',
    budget_allocated: 900000,
    deliverables: ['Equipment Orders', 'Quality Certificates', 'Delivery Schedule'],
    dependencies: ['phase-001'],
    assigned_team: ['emp-003', 'emp-004']
  },
  {
    phase_id: 'phase-003',
    title: 'Installation & Testing',
    description: 'On-site installation, system integration, and comprehensive testing',
    start_date: '2025-11-01',
    end_date: '2025-12-15',
    budget_allocated: 150000,
    deliverables: ['Installation Reports', 'Test Results', 'User Manuals'],
    dependencies: ['phase-002'],
    assigned_team: ['emp-001', 'emp-005', 'emp-006']
  },
  {
    phase_id: 'phase-004',
    title: 'Training & Handover',
    description: 'Staff training, documentation, and project closure',
    start_date: '2025-12-16',
    end_date: '2026-01-15',
    budget_allocated: 75000,
    deliverables: ['Training Completion', 'Documentation Package', 'Project Closure'],
    dependencies: ['phase-003'],
    assigned_team: ['emp-002', 'emp-006']
  }
];

const mockComplianceRequirements: ComplianceItem[] = [
  {
    requirement: 'Contract Signature & Legal Review',
    due_date: '2025-07-20',
    responsible_department: 'Legal',
    status: 'Pending',
    priority: 'Critical'
  },
  {
    requirement: 'Budget Approval & Financial Setup',
    due_date: '2025-07-18',
    responsible_department: 'Finance',
    status: 'Pending',
    priority: 'High'
  },
  {
    requirement: 'Team Assignment & HR Onboarding',
    due_date: '2025-07-15',
    responsible_department: 'HR',
    status: 'Pending',
    priority: 'High'
  },
  {
    requirement: 'Project Charter Approval',
    due_date: '2025-07-25',
    responsible_department: 'Management',
    status: 'Pending',
    priority: 'Medium'
  },
  {
    requirement: 'Insurance & Risk Coverage',
    due_date: '2025-07-30',
    responsible_department: 'Risk Management',
    status: 'Pending',
    priority: 'Medium'
  }
];

export const TenderAwardHandler: React.FC<TenderAwardHandlerProps> = ({
  tender,
  onAward,
  onClose,
  currentUser,
  className = ''
}) => {
  const [step, setStep] = useState<'confirmation' | 'details' | 'project' | 'approval' | 'completion'>('confirmation');
  const [awardData, setAwardData] = useState<Partial<AwardData>>({
    award_value: 0,
    award_currency: 'USD',
    award_date: new Date().toISOString().split('T')[0],
    contract_start_date: '',
    contract_end_date: '',
    project_phases: mockProjectPhases,
    team_assignments: [],
    compliance_requirements: mockComplianceRequirements
  });
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File }>({});
  const [processing, setProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const canAward = currentUser.permissions.includes('award_tender') || 
                   currentUser.role === 'Project Manager' || 
                   currentUser.role === 'Admin';

  useEffect(() => {
    // Pre-populate data from tender
    if (tender.integrations?.finance?.[0]) {
      const financeData = tender.integrations.finance[0];
      setAwardData(prev => ({
        ...prev,
        award_value: financeData.amount,
        budget_breakdown: financeData.breakdown.map(item => ({
          category: item.category,
          amount: item.amount,
          percentage: item.percentage,
          approval_required: item.amount > 50000,
          assigned_to: 'finance-dept'
        }))
      }));
    }

    // Pre-populate team assignments from tender team
    if (tender.team_members) {
      const teamAssignments = tender.team_members.map(member => ({
        user_id: member.user_id,
        user_name: member.user_name,
        project_role: member.role_in_tender,
        allocation_percentage: 100,
        start_date: awardData.contract_start_date || new Date().toISOString().split('T')[0]
      }));
      setAwardData(prev => ({ ...prev, team_assignments: teamAssignments }));
    }
  }, [tender]);

  const validateAwardData = (): string[] => {
    const errors: string[] = [];
    
    if (!awardData.award_value || awardData.award_value <= 0) {
      errors.push('Award value must be greater than 0');
    }
    
    if (!awardData.contract_start_date) {
      errors.push('Contract start date is required');
    }
    
    if (!awardData.contract_end_date) {
      errors.push('Contract end date is required');
    }
    
    if (awardData.contract_start_date && awardData.contract_end_date) {
      if (new Date(awardData.contract_start_date) >= new Date(awardData.contract_end_date)) {
        errors.push('Contract end date must be after start date');
      }
    }
    
    if (!uploadedFiles.award_letter) {
      errors.push('Award letter upload is required');
    }
    
    if (!awardData.project_manager_id) {
      errors.push('Project manager must be assigned');
    }

    return errors;
  };

  const handleFileUpload = (fileType: string, file: File) => {
    setUploadedFiles(prev => ({ ...prev, [fileType]: file }));
    setAwardData(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  const handleAwardSubmission = async () => {
    const errors = validateAwardData();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setProcessing(true);
    setValidationErrors([]);

    try {
      // Prepare complete award data
      const completeAwardData: AwardData = {
        award_value: awardData.award_value!,
        award_currency: awardData.award_currency!,
        award_date: awardData.award_date!,
        contract_start_date: awardData.contract_start_date!,
        contract_end_date: awardData.contract_end_date!,
        award_letter: uploadedFiles.award_letter || null,
        signed_contract: uploadedFiles.signed_contract || null,
        project_manager_id: awardData.project_manager_id!,
        project_phases: awardData.project_phases || [],
        budget_breakdown: awardData.budget_breakdown || [],
        team_assignments: awardData.team_assignments || [],
        compliance_requirements: awardData.compliance_requirements || [],
        notifications: [
          {
            type: 'email',
            recipients: awardData.team_assignments?.map(t => t.user_id) || [],
            template: 'tender_awarded',
            trigger: 'immediate'
          },
          {
            type: 'system',
            recipients: ['finance-dept', 'hr-dept', 'legal-dept'],
            template: 'project_initiated',
            trigger: 'immediate'
          }
        ]
      };

      await onAward(completeAwardData);
      setStep('completion');
    } catch (error) {
      console.error('Failed to award tender:', error);
      setValidationErrors(['Failed to process award. Please try again.']);
    } finally {
      setProcessing(false);
    }
  };

  const getStepIcon = (stepName: string) => {
    const icons = {
      confirmation: Award,
      details: FileText,
      project: FolderOpen,
      approval: CheckCircle,
      completion: Zap
    };
    return icons[stepName as keyof typeof icons] || FileText;
  };

  const getStepColor = (stepName: string) => {
    if (step === stepName) return 'bg-blue-600 text-white';
    const completedSteps = ['confirmation', 'details', 'project', 'approval'];
    const currentIndex = completedSteps.indexOf(step);
    const stepIndex = completedSteps.indexOf(stepName);
    return stepIndex < currentIndex ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'Critical': 'bg-red-100 text-red-800 border-red-200',
      'High': 'bg-orange-100 text-orange-800 border-orange-200',
      'Medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Low': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Pending': 'bg-gray-100 text-gray-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Overdue': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderStepIndicator = () => {
    const steps = [
      { id: 'confirmation', label: 'Confirm Award', icon: Award },
      { id: 'details', label: 'Award Details', icon: FileText },
      { id: 'project', label: 'Project Setup', icon: FolderOpen },
      { id: 'approval', label: 'Review & Approve', icon: CheckCircle },
      { id: 'completion', label: 'Complete', icon: Zap }
    ];

    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((stepItem, index) => {
          const StepIcon = stepItem.icon;
          const isActive = step === stepItem.id;
          const isCompleted = steps.findIndex(s => s.id === step) > index;
          
          return (
            <div key={stepItem.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  isActive ? 'bg-blue-600 text-white border-blue-600' :
                  isCompleted ? 'bg-green-600 text-white border-green-600' :
                  'bg-gray-200 text-gray-600 border-gray-300'
                }`}>
                  <StepIcon className="h-5 w-5" />
                </div>
                <span className={`text-sm mt-2 ${
                  isActive ? 'text-blue-600 font-medium' :
                  isCompleted ? 'text-green-600' :
                  'text-gray-500'
                }`}>
                  {stepItem.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  isCompleted ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderConfirmationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Award className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Award Tender</h3>
        <p className="text-gray-600">
          You are about to award this tender and initiate the project workflow
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800 mb-2">Important Notice</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• This action cannot be undone</li>
              <li>• A project will be automatically created</li>
              <li>• Team members will be notified</li>
              <li>• Budget allocations will be initiated</li>
              <li>• Compliance tracking will begin</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-medium text-gray-900 mb-4">Tender Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Title:</span>
            <div className="font-medium">{tender.title}</div>
          </div>
          <div>
            <span className="text-gray-500">Reference:</span>
            <div className="font-medium">{tender.reference_number}</div>
          </div>
          <div>
            <span className="text-gray-500">Category:</span>
            <div className="font-medium">{tender.category}</div>
          </div>
          <div>
            <span className="text-gray-500">Deadline:</span>
            <div className="font-medium">{new Date(tender.submission_deadline).toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {!canAward && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800 font-medium">Insufficient Permissions</span>
          </div>
          <p className="text-red-700 text-sm mt-1">
            You do not have permission to award this tender. Contact your administrator.
          </p>
        </div>
      )}
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Award Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Award Value *
          </label>
          <div className="flex space-x-2">
            <select
              value={awardData.award_currency}
              onChange={(e) => setAwardData(prev => ({ ...prev, award_currency: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="SAR">SAR</option>
            </select>
            <input
              type="number"
              value={awardData.award_value}
              onChange={(e) => setAwardData(prev => ({ ...prev, award_value: parseFloat(e.target.value) }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Award Date *
          </label>
          <input
            type="date"
            value={awardData.award_date}
            onChange={(e) => setAwardData(prev => ({ ...prev, award_date: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contract Start Date *
          </label>
          <input
            type="date"
            value={awardData.contract_start_date}
            onChange={(e) => setAwardData(prev => ({ ...prev, contract_start_date: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contract End Date *
          </label>
          <input
            type="date"
            value={awardData.contract_end_date}
            onChange={(e) => setAwardData(prev => ({ ...prev, contract_end_date: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Project Manager Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Manager *
        </label>
        <select
          value={awardData.project_manager_id}
          onChange={(e) => setAwardData(prev => ({ ...prev, project_manager_id: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select project manager</option>
          {tender.team_members?.map(member => (
            <option key={member.user_id} value={member.user_id}>
              {member.user_name} ({member.role_in_tender})
            </option>
          ))}
        </select>
      </div>

      {/* File Uploads */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Required Documents</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Award Letter *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Upload award letter
                  </span>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('award_letter', file);
                    }}
                  />
                </label>
                <p className="mt-1 text-sm text-gray-500">PDF, DOC up to 10MB</p>
              </div>
            </div>
            {uploadedFiles.award_letter && (
              <div className="mt-4 flex items-center justify-between bg-green-50 border border-green-200 rounded p-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">{uploadedFiles.award_letter.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Signed Contract (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Upload signed contract
                  </span>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('signed_contract', file);
                    }}
                  />
                </label>
                <p className="mt-1 text-sm text-gray-500">PDF, DOC up to 10MB</p>
              </div>
            </div>
            {uploadedFiles.signed_contract && (
              <div className="mt-4 flex items-center justify-between bg-green-50 border border-green-200 rounded p-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">{uploadedFiles.signed_contract.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjectStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Project Configuration</h3>
      
      {/* Project Phases */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Project Phases</h4>
        <div className="space-y-4">
          {awardData.project_phases?.map((phase, index) => (
            <div key={phase.phase_id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h5 className="font-medium text-gray-900">Phase {index + 1}: {phase.title}</h5>
                  <p className="text-sm text-gray-600">{phase.description}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  ${phase.budget_allocated.toLocaleString()}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Start:</span>
                  <span className="ml-2 font-medium">{new Date(phase.start_date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">End:</span>
                  <span className="ml-2 font-medium">{new Date(phase.end_date).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="mt-3">
                <span className="text-sm text-gray-500">Deliverables:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {phase.deliverables.map((deliverable, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {deliverable}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Assignments */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Team Assignments</h4>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Team Member</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Project Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Allocation</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {awardData.team_assignments?.map(assignment => (
                <tr key={assignment.user_id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{assignment.user_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{assignment.project_role}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{assignment.allocation_percentage}%</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(assignment.start_date).toLocaleDateString()} - 
                    {assignment.end_date ? new Date(assignment.end_date).toLocaleDateString() : 'TBD'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance Requirements */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Compliance Requirements</h4>
        <div className="space-y-3">
          {awardData.compliance_requirements?.map((item, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{item.requirement}</h5>
                  <p className="text-sm text-gray-600 mt-1">
                    Due: {new Date(item.due_date).toLocaleDateString()} • 
                    Responsible: {item.responsible_department}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderApprovalStep = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Review & Approve</h3>
      
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-800">Please resolve the following issues:</h4>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-4">Award Summary</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-blue-700 text-sm">Award Value:</span>
            <div className="font-medium text-blue-900">
              {awardData.award_currency} {awardData.award_value?.toLocaleString()}
            </div>
          </div>
          <div>
            <span className="text-blue-700 text-sm">Contract Period:</span>
            <div className="font-medium text-blue-900">
              {awardData.contract_start_date} to {awardData.contract_end_date}
            </div>
          </div>
          <div>
            <span className="text-blue-700 text-sm">Project Phases:</span>
            <div className="font-medium text-blue-900">{awardData.project_phases?.length} phases</div>
          </div>
          <div>
            <span className="text-blue-700 text-sm">Team Members:</span>
            <div className="font-medium text-blue-900">{awardData.team_assignments?.length} assigned</div>
          </div>
        </div>
      </div>

      {/* Actions that will be performed */}
      <div>
        <h4 className="font-medium text-gray-900 mb-4">Actions to be Performed</h4>
        <div className="space-y-3">
          {[
            { action: 'Update tender status to "Awarded"', module: 'Tender Management', icon: Award },
            { action: 'Create new project with phases and milestones', module: 'Project Management', icon: FolderOpen },
            { action: 'Submit budget allocation requests', module: 'Finance', icon: DollarSign },
            { action: 'Assign team members to project', module: 'Human Resources', icon: Users },
            { action: 'Initialize compliance tracking', module: 'Legal & Compliance', icon: CheckCircle },
            { action: 'Send notifications to stakeholders', module: 'Notification System', icon: Zap }
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <item.icon className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <span className="text-gray-900">{item.action}</span>
                <span className="text-gray-500 text-sm ml-2">({item.module})</span>
              </div>
              <CheckCircle className="h-4 w-4 text-gray-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCompletionStep = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Tender Successfully Awarded!</h3>
        <p className="text-gray-600">
          The tender has been awarded and the project workflow has been initiated.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h4 className="font-medium text-green-900 mb-3">Next Steps</h4>
        <div className="space-y-2 text-sm text-green-800">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Project created with ID: PROJ-{tender.tender_id.slice(-6)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Team members notified via email</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Budget requests submitted to Finance</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Compliance tracking initiated</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => window.open('/projects', '_blank')}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          View Project
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 'confirmation':
        return renderConfirmationStep();
      case 'details':
        return renderDetailsStep();
      case 'project':
        return renderProjectStep();
      case 'approval':
        return renderApprovalStep();
      case 'completion':
        return renderCompletionStep();
      default:
        return null;
    }
  };

  const handleNext = () => {
    const steps = ['confirmation', 'details', 'project', 'approval', 'completion'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1] as any);
    }
  };

  const handleBack = () => {
    const steps = ['confirmation', 'details', 'project', 'approval', 'completion'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1] as any);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'confirmation':
        return canAward;
      case 'details':
        return awardData.award_value && awardData.contract_start_date && awardData.contract_end_date && uploadedFiles.award_letter;
      case 'project':
        return awardData.project_manager_id;
      case 'approval':
        return validationErrors.length === 0;
      default:
        return true;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative min-h-full flex items-center justify-center p-4">
        <div className={`relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col ${className}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Award Tender</h2>
              <p className="text-sm text-gray-600">{tender.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderStepIndicator()}
            {renderStepContent()}
          </div>

          {/* Footer */}
          {step !== 'completion' && (
            <div className="flex items-center justify-between p-6 border-t border-gray-200">
              <button
                onClick={handleBack}
                disabled={step === 'confirmation'}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Back
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                
                {step === 'approval' ? (
                  <button
                    onClick={handleAwardSubmission}
                    disabled={!canProceed() || processing}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {processing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Award className="h-4 w-4" />
                    )}
                    <span>{processing ? 'Processing...' : 'Award Tender'}</span>
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenderAwardHandler; 