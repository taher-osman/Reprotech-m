import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  CheckCircle, 
  AlertCircle,
  FileText,
  DollarSign,
  Users,
  Shield,
  Upload,
  Calendar,
  Building,
  Globe,
  Type,
  Languages
} from 'lucide-react';
import { TenderFormData, TenderSource, TenderCategory, TenderType, TenderMode, TenderLanguage, AttachmentType } from '../types/tenderTypes';
import TenderAttachments from './TenderAttachments';

interface TenderFormProps {
  initialData?: Partial<TenderFormData>;
  onSubmit: (data: TenderFormData) => Promise<void>;
  onSaveDraft?: (data: Partial<TenderFormData>) => Promise<void>;
  isEditing?: boolean;
  className?: string;
}

interface FormStep {
  id: number;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
}

const formSteps: FormStep[] = [
  {
    id: 1,
    title: 'Basic Information',
    icon: FileText,
    description: 'Tender details and basic information'
  },
  {
    id: 2,
    title: 'Technical Study',
    icon: FileText,
    description: 'Technical requirements and specifications'
  },
  {
    id: 3,
    title: 'Financial Study',
    icon: DollarSign,
    description: 'Cost analysis and financial planning'
  },
  {
    id: 4,
    title: 'HR Study',
    icon: Users,
    description: 'Human resources and team requirements'
  },
  {
    id: 5,
    title: 'Compliance Study',
    icon: Shield,
    description: 'Regulatory compliance and legal requirements'
  },
  {
    id: 6,
    title: 'Attachments',
    icon: Upload,
    description: 'Upload supporting documents'
  }
];

const validationRules = {
  title: (value: string) => value.trim().length >= 5 ? null : 'Title must be at least 5 characters',
  reference_number: (value: string) => value.trim().length >= 3 ? null : 'Reference number must be at least 3 characters',
  owner_entity: (value: string) => value.trim().length >= 2 ? null : 'Owner entity is required',
  submission_deadline: (value: string) => {
    if (!value) return 'Submission deadline is required';
    const deadline = new Date(value);
    const now = new Date();
    if (deadline <= now) return 'Deadline must be in the future';
    return null;
  },
  opening_date: (value: string) => {
    if (!value) return 'Opening date is required';
    return null;
  }
};

export const TenderForm: React.FC<TenderFormProps> = ({
  initialData = {},
  onSubmit,
  onSaveDraft,
  isEditing = false,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TenderFormData>({
    title: '',
    reference_number: '',
    source: TenderSource.GOVERNMENT,
    category: TenderCategory.MEDICAL,
    owner_entity: '',
    submission_deadline: '',
    opening_date: '',
    type: TenderType.SUPPLY,
    mode: TenderMode.OPEN,
    summary: '',
    language: TenderLanguage.ENGLISH,
    assigned_manager_id: '',
    linked_departments: [],
    technical_study: '',
    financial_study: '',
    hr_study: '',
    compliance_study: '',
    attachments: [],
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  // Autosave draft every 30 seconds
  useEffect(() => {
    if (!onSaveDraft) return;

    const interval = setInterval(async () => {
      try {
        setIsSavingDraft(true);
        await onSaveDraft(formData);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Failed to autosave draft:', error);
      } finally {
        setIsSavingDraft(false);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [formData, onSaveDraft]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        // Basic Information validation
        Object.keys(validationRules).forEach(field => {
          const value = formData[field as keyof TenderFormData];
          const error = validationRules[field as keyof typeof validationRules](value as string);
          if (error) newErrors[field] = error;
        });
        break;
      
      case 2:
        if (!formData.technical_study.trim()) {
          newErrors.technical_study = 'Technical study is required';
        }
        break;
      
      case 3:
        if (!formData.financial_study.trim()) {
          newErrors.financial_study = 'Financial study is required';
        }
        break;
      
      case 4:
        if (!formData.hr_study.trim()) {
          newErrors.hr_study = 'HR study is required';
        }
        break;
      
      case 5:
        if (!formData.compliance_study.trim()) {
          newErrors.compliance_study = 'Compliance study is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, formSteps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to submit tender:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setIsSavingDraft(true);
      await onSaveDraft?.(formData);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const updateFormData = (field: keyof TenderFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tender Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter tender title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference Number *
                </label>
                <input
                  type="text"
                  value={formData.reference_number}
                  onChange={(e) => updateFormData('reference_number', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.reference_number ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="T-2025-001"
                />
                {errors.reference_number && (
                  <p className="mt-1 text-sm text-red-600">{errors.reference_number}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Source
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => updateFormData('source', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.values(TenderSource).map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => updateFormData('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.values(TenderCategory).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Entity *
                </label>
                <input
                  type="text"
                  value={formData.owner_entity}
                  onChange={(e) => updateFormData('owner_entity', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.owner_entity ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ministry of Health"
                />
                {errors.owner_entity && (
                  <p className="mt-1 text-sm text-red-600">{errors.owner_entity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tender Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => updateFormData('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.values(TenderType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Submission Deadline *
                </label>
                <input
                  type="datetime-local"
                  value={formData.submission_deadline}
                  onChange={(e) => updateFormData('submission_deadline', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.submission_deadline ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.submission_deadline && (
                  <p className="mt-1 text-sm text-red-600">{errors.submission_deadline}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opening Date *
                </label>
                <input
                  type="datetime-local"
                  value={formData.opening_date}
                  onChange={(e) => updateFormData('opening_date', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.opening_date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.opening_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.opening_date}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Summary
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) => updateFormData('summary', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the tender..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technical Study *
            </label>
            <textarea
              value={formData.technical_study}
              onChange={(e) => updateFormData('technical_study', e.target.value)}
              rows={12}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.technical_study ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter technical study details including requirements, specifications, feasibility analysis, and technical approach..."
            />
            {errors.technical_study && (
              <p className="mt-1 text-sm text-red-600">{errors.technical_study}</p>
            )}
          </div>
        );

      case 3:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Financial Study *
            </label>
            <textarea
              value={formData.financial_study}
              onChange={(e) => updateFormData('financial_study', e.target.value)}
              rows={12}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.financial_study ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter financial study details including cost analysis, budget planning, pricing strategy, and financial projections..."
            />
            {errors.financial_study && (
              <p className="mt-1 text-sm text-red-600">{errors.financial_study}</p>
            )}
          </div>
        );

      case 4:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HR Study *
            </label>
            <textarea
              value={formData.hr_study}
              onChange={(e) => updateFormData('hr_study', e.target.value)}
              rows={12}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.hr_study ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter HR study details including staffing requirements, team structure, qualifications needed, and resource allocation..."
            />
            {errors.hr_study && (
              <p className="mt-1 text-sm text-red-600">{errors.hr_study}</p>
            )}
          </div>
        );

      case 5:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compliance Study *
            </label>
            <textarea
              value={formData.compliance_study}
              onChange={(e) => updateFormData('compliance_study', e.target.value)}
              rows={12}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.compliance_study ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter compliance study details including regulatory requirements, legal considerations, risk assessment, and compliance measures..."
            />
            {errors.compliance_study && (
              <p className="mt-1 text-sm text-red-600">{errors.compliance_study}</p>
            )}
          </div>
        );

      case 6:
        return (
          <div>
            <TenderAttachments
              attachments={[]}
              onUpload={async (file, type) => {
                // Handle file upload
                console.log('Uploading file:', file, type);
              }}
              onDelete={async (attachmentId) => {
                // Handle file deletion
                console.log('Deleting attachment:', attachmentId);
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {formSteps.map((step, index) => {
            const status = getStepStatus(step.id);
            const StepIcon = step.icon;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center border-2
                      ${status === 'completed' 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : status === 'current'
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-gray-200 border-gray-300 text-gray-500'
                      }
                    `}
                  >
                    {status === 'completed' ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-xs font-medium ${
                      status === 'current' ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < formSteps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {formSteps[currentStep - 1].title}
          </h2>
          <p className="text-gray-600">
            {formSteps[currentStep - 1].description}
          </p>
        </div>

        {renderStepContent()}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            {onSaveDraft && (
              <button
                onClick={handleSaveDraft}
                disabled={isSavingDraft}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                {isSavingDraft ? 'Saving...' : 'Save Draft'}
              </button>
            )}
            {lastSaved && (
              <span className="text-xs text-gray-500">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
            )}

            {currentStep < formSteps.length ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : (isEditing ? 'Update Tender' : 'Submit Tender')}
                <Save className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderForm; 