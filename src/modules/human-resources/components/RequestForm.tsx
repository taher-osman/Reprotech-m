import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  Minus,
  Info,
  Clock,
  User
} from 'lucide-react';
import { 
  RequestFormConfig, 
  RequestFormField, 
  EmployeeRequest 
} from '../types/hrTypes';
import { hrWorkflowEngine } from '../services/HRWorkflowEngine';

interface RequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: EmployeeRequest) => void;
  employeeId?: string;
  employeeName?: string;
}

const RequestForm: React.FC<RequestFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employeeId = 'EMP-001',
  employeeName = 'Ahmed Al-Mansouri'
}) => {
  const [selectedRequestType, setSelectedRequestType] = useState<string>('');
  const [formConfig, setFormConfig] = useState<RequestFormConfig | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const requestTypes = [
    {
      type: 'Leave',
      title: 'Leave Request',
      description: 'Request annual, sick, or emergency leave',
      icon: Calendar,
      color: 'blue',
      estimatedDays: 2
    },
    {
      type: 'Salary Certificate',
      title: 'Salary Certificate',
      description: 'Generate official salary certificate',
      icon: FileText,
      color: 'green',
      estimatedDays: 1
    },
    {
      type: 'Vacation Salary Advance',
      title: 'Salary Advance',
      description: 'Request advance payment for vacation',
      icon: DollarSign,
      color: 'purple',
      estimatedDays: 5
    },
    {
      type: 'Medical Reimbursement',
      title: 'Medical Reimbursement',
      description: 'Claim medical expenses reimbursement',
      icon: FileText,
      color: 'red',
      estimatedDays: 7
    },
    {
      type: 'Exit Clearance',
      title: 'Exit Clearance',
      description: 'Request exit clearance process',
      icon: User,
      color: 'orange',
      estimatedDays: 10
    },
    {
      type: 'ID Renewal',
      title: 'ID/Visa Renewal',
      description: 'Request ID or visa renewal assistance',
      icon: CheckCircle,
      color: 'indigo',
      estimatedDays: 14
    }
  ];

  useEffect(() => {
    if (selectedRequestType) {
      const config = hrWorkflowEngine.getRequestFormConfig(selectedRequestType);
      setFormConfig(config);
      // Initialize form data with default values
      const initialData: Record<string, any> = {};
      config.formFields.forEach(field => {
        if (field.defaultValue !== undefined) {
          initialData[field.fieldId] = field.defaultValue;
        }
      });
      setFormData(initialData);
    }
  }, [selectedRequestType]);

  const validateField = (field: RequestFormField, value: any): string | null => {
    if (field.isRequired && (!value || value === '')) {
      return `${field.fieldName} is required`;
    }

    if (field.validation) {
      const validation = field.validation;
      
      if (validation.minLength && value && value.length < validation.minLength) {
        return `${field.fieldName} must be at least ${validation.minLength} characters`;
      }
      
      if (validation.maxLength && value && value.length > validation.maxLength) {
        return `${field.fieldName} must not exceed ${validation.maxLength} characters`;
      }
      
      if (validation.min && value && parseFloat(value) < validation.min) {
        return `${field.fieldName} must be at least ${validation.min}`;
      }
      
      if (validation.max && value && parseFloat(value) > validation.max) {
        return `${field.fieldName} must not exceed ${validation.max}`;
      }
      
      if (validation.pattern && value && !new RegExp(validation.pattern).test(value)) {
        return `${field.fieldName} format is invalid`;
      }
    }

    return null;
  };

  const validateForm = (): boolean => {
    if (!formConfig) return false;

    const newErrors: Record<string, string> = {};
    
    formConfig.formFields.forEach(field => {
      const value = formData[field.fieldId];
      const error = validateField(field, value);
      if (error) {
        newErrors[field.fieldId] = error;
      }
    });

    // Validate file uploads for required documents
    if (formConfig.requiredDocuments.length > 0 && uploadedFiles.length === 0) {
      newErrors.documents = 'Required documents must be uploaded';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !formConfig) return;

    setLoading(true);
    try {
      // Prepare request data
      const requestData: Partial<EmployeeRequest> = {
        employeeId,
        employeeName,
        requestType: selectedRequestType as any,
        description: formData.description || formData.reason || `${selectedRequestType} request`,
        urgency: formData.urgency || 'Medium',
        requestedAmount: formData.amount,
        requestedDates: formData.dateRange ? {
          startDate: formData.dateRange.start,
          endDate: formData.dateRange.end,
          totalDays: formData.dateRange.totalDays
        } : undefined,
        documentAttachment: uploadedFiles.map(file => ({
          fileName: file.name,
          fileUrl: URL.createObjectURL(file),
          fileType: file.type,
          uploadDate: new Date().toISOString()
        }))
      };

      // Submit through workflow engine
      const submittedRequest = await hrWorkflowEngine.submitRequest(requestData);
      
      onSubmit(submittedRequest);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error submitting request:', error);
      setErrors({ submit: 'Failed to submit request. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedRequestType('');
    setFormConfig(null);
    setFormData({});
    setUploadedFiles([]);
    setErrors({});
    setCurrentStep(1);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const renderField = (field: RequestFormField) => {
    const value = formData[field.fieldId] || '';
    const error = errors[field.fieldId];

    switch (field.fieldType) {
      case 'text':
      case 'email':
        return (
          <div key={field.fieldId}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.fieldName}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={field.fieldType}
              value={value}
              onChange={(e) => setFormData({ ...formData, [field.fieldId]: e.target.value })}
              placeholder={field.placeholder}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'number':
      case 'currency':
        return (
          <div key={field.fieldId}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.fieldName}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              {field.fieldType === 'currency' && (
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">SAR</span>
              )}
              <input
                type="number"
                value={value}
                onChange={(e) => setFormData({ ...formData, [field.fieldId]: parseFloat(e.target.value) || 0 })}
                placeholder={field.placeholder}
                min={field.validation?.min}
                max={field.validation?.max}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  field.fieldType === 'currency' ? 'pl-12' : ''
                } ${error ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'date':
        return (
          <div key={field.fieldId}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.fieldName}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="date"
              value={value}
              onChange={(e) => setFormData({ ...formData, [field.fieldId]: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'dateRange':
        return (
          <div key={field.fieldId}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.fieldName}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={value?.start || ''}
                  onChange={(e) => {
                    const newValue = { ...value, start: e.target.value };
                    if (newValue.start && newValue.end) {
                      const start = new Date(newValue.start);
                      const end = new Date(newValue.end);
                      const diffTime = Math.abs(end.getTime() - start.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                      newValue.totalDays = diffDays;
                    }
                    setFormData({ ...formData, [field.fieldId]: newValue });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={value?.end || ''}
                  onChange={(e) => {
                    const newValue = { ...value, end: e.target.value };
                    if (newValue.start && newValue.end) {
                      const start = new Date(newValue.start);
                      const end = new Date(newValue.end);
                      const diffTime = Math.abs(end.getTime() - start.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                      newValue.totalDays = diffDays;
                    }
                    setFormData({ ...formData, [field.fieldId]: newValue });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            {value?.totalDays && (
              <p className="mt-1 text-sm text-blue-600">Total days: {value.totalDays}</p>
            )}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.fieldId}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.fieldName}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => setFormData({ ...formData, [field.fieldId]: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select {field.fieldName}</option>
              {field.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.fieldId}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.fieldName}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => setFormData({ ...formData, [field.fieldId]: e.target.value })}
              placeholder={field.placeholder}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.fieldId} className="flex items-center">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => setFormData({ ...formData, [field.fieldId]: e.target.checked })}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700">
              {field.fieldName}
              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  const renderStep1 = () => (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Request Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requestTypes.map((type) => (
          <button
            key={type.type}
            onClick={() => {
              setSelectedRequestType(type.type);
              setCurrentStep(2);
            }}
            className={`p-4 border-2 rounded-lg text-left hover:shadow-md transition-all ${
              selectedRequestType === type.type
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg bg-${type.color}-100`}>
                <type.icon className={`w-6 h-6 text-${type.color}-600`} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{type.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Est. {type.estimatedDays} days</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Request Details</h3>
        <button
          onClick={() => setCurrentStep(1)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Change Request Type
        </button>
      </div>

      {formConfig && (
        <div className="space-y-4">
          {/* Request type info */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">{selectedRequestType}</span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              Estimated processing time: {formConfig.estimatedProcessingDays} days
            </p>
          </div>

          {/* Form fields */}
          {formConfig.formFields.map(field => renderField(field))}

          {/* File upload section */}
          {formConfig.requiredDocuments.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Documents
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="space-y-2 mb-3">
                {formConfig.requiredDocuments.map((doc, index) => (
                  <div key={index} className="text-sm text-gray-600 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    {doc}
                  </div>
                ))}
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload your documents</p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Choose Files</span>
                </label>
              </div>

              {/* Uploaded files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {errors.documents && (
                <p className="text-sm text-red-600">{errors.documents}</p>
              )}
            </div>
          )}

          {/* Submit error */}
          {errors.submit && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-red-800">{errors.submit}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">New Request</h2>
              <p className="text-gray-600">Submit a new HR request</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress indicator */}
          <div className="mt-4">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="text-sm font-medium">Select Type</span>
              </div>
              <div className={`flex-1 h-1 rounded ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="text-sm font-medium">Fill Details</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
        </div>

        {/* Footer */}
        {currentStep === 2 && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Submit Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestForm; 