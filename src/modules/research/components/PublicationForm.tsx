import React, { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Calendar, 
  User, 
  FileText,
  BookOpen,
  Target,
  Globe,
  Award,
  Search,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Badge } from './components/ui/Badge';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { 
  Publication,
  PublicationType,
  PublicationStatus,
  Author,
  ResearchProject
} from '../types/researchTypes';
import { researchApi } from '../services/researchApi';

interface PublicationFormProps {
  publication?: Publication;
  projectId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (publication: Publication) => void;
}

export const PublicationForm: React.FC<PublicationFormProps> = ({
  publication,
  projectId,
  isOpen,
  onClose,
  onSave
}) => {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<Publication>>({
    title: '',
    abstract: '',
    projectId: projectId || '',
    type: PublicationType.JOURNAL_ARTICLE,
    status: PublicationStatus.DRAFT,
    authors: [],
    keywords: [],
    journal: '',
    volume: '',
    issue: '',
    pages: '',
    doi: '',
    citations: 0,
    impactFactor: undefined,
    submissionDate: undefined,
    acceptanceDate: undefined,
    publicationDate: undefined
  });

  const steps = [
    { id: 1, title: 'Basic Information', icon: FileText },
    { id: 2, title: 'Authors & Contributors', icon: User },
    { id: 3, title: 'Publication Details', icon: BookOpen },
    { id: 4, title: 'Journal & Metrics', icon: Award }
  ];

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
      if (publication) {
        setFormData(publication);
      }
    }
  }, [isOpen, publication]);

  const loadInitialData = async () => {
    try {
      const response = await researchApi.getProjects();
      if (response.success) {
        setProjects(response.data);
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

  const addAuthor = () => {
    const newAuthor: Author = {
      id: `temp-${Date.now()}`,
      name: '',
      email: '',
      affiliation: '',
      isCorresponding: false,
      orcid: ''
    };

    setFormData(prev => ({
      ...prev,
      authors: [...(prev.authors || []), newAuthor]
    }));
  };

  const updateAuthor = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors?.map((author, i) => 
        i === index ? { ...author, [field]: value } : author
      ) || []
    }));
  };

  const removeAuthor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors?.filter((_, i) => i !== index) || []
    }));
  };

  const addKeyword = (keyword: string) => {
    if (keyword.trim() && !formData.keywords?.includes(keyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...(prev.keywords || []), keyword.trim()]
      }));
    }
  };

  const removeKeyword = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords?.filter((_, i) => i !== index) || []
    }));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.abstract && formData.projectId && formData.type;
      case 2:
        return formData.authors && formData.authors.length > 0 && 
               formData.authors.every(author => author.name && author.email);
      case 3:
        return true; // Keywords are optional
      case 4:
        return true; // Journal details are optional for drafts
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const publicationData: Omit<Publication, 'id' | 'createdAt' | 'updatedAt'> = {
        ...formData,
        title: formData.title!,
        abstract: formData.abstract!,
        projectId: formData.projectId!,
        type: formData.type!,
        status: formData.status!,
        authors: formData.authors || [],
        keywords: formData.keywords || [],
        journal: formData.journal || '',
        volume: formData.volume || '',
        issue: formData.issue || '',
        pages: formData.pages || '',
        doi: formData.doi || '',
        citations: formData.citations || 0,
        impactFactor: formData.impactFactor,
        submissionDate: formData.submissionDate,
        acceptanceDate: formData.acceptanceDate,
        publicationDate: formData.publicationDate
      };

      const response = await researchApi.createPublication(publicationData);
      
      if (response.success) {
        onSave(response.data);
        onClose();
      }
    } catch (error) {
      console.error('Error saving publication:', error);
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
                Publication Title *
              </label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter publication title"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publication Type *
                </label>
                <select
                  value={formData.type || PublicationType.JOURNAL_ARTICLE}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.values(PublicationType).map(type => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status || PublicationStatus.DRAFT}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.values(PublicationStatus).map(status => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Abstract *
              </label>
              <textarea
                value={formData.abstract || ''}
                onChange={(e) => handleInputChange('abstract', e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter publication abstract"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.abstract?.length || 0} characters
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Authors & Contributors</h3>
              <Button onClick={addAuthor} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Author
              </Button>
            </div>

            {formData.authors && formData.authors.length === 0 ? (
              <Card className="p-8">
                <div className="text-center">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No authors added</h3>
                  <p className="text-gray-600 mb-4">Add authors to this publication</p>
                  <Button onClick={addAuthor}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Author
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {formData.authors?.map((author, index) => (
                  <Card key={author.id || index} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-gray-900">Author {index + 1}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeAuthor(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={author.name}
                          onChange={(e) => updateAuthor(index, 'name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={author.email}
                          onChange={(e) => updateAuthor(index, 'email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter email address"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Affiliation
                        </label>
                        <input
                          type="text"
                          value={author.affiliation}
                          onChange={(e) => updateAuthor(index, 'affiliation', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter institutional affiliation"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ORCID
                        </label>
                        <input
                          type="text"
                          value={author.orcid || ''}
                          onChange={(e) => updateAuthor(index, 'orcid', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0000-0000-0000-0000"
                        />
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={author.isCorresponding}
                          onChange={(e) => updateAuthor(index, 'isCorresponding', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          Corresponding author
                        </label>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Type a keyword and press Enter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addKeyword(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                
                {formData.keywords && formData.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.keywords.map((keyword, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {keyword}
                        <button
                          onClick={() => removeKeyword(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Submission Date
                </label>
                <input
                  type="date"
                  value={formData.submissionDate ? new Date(formData.submissionDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('submissionDate', e.target.value ? new Date(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Acceptance Date
                </label>
                <input
                  type="date"
                  value={formData.acceptanceDate ? new Date(formData.acceptanceDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('acceptanceDate', e.target.value ? new Date(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publication Date
                </label>
                <input
                  type="date"
                  value={formData.publicationDate ? new Date(formData.publicationDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange('publicationDate', e.target.value ? new Date(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Journal/Conference Name
              </label>
              <input
                type="text"
                value={formData.journal || ''}
                onChange={(e) => handleInputChange('journal', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter journal or conference name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volume
                </label>
                <input
                  type="text"
                  value={formData.volume || ''}
                  onChange={(e) => handleInputChange('volume', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issue
                </label>
                <input
                  type="text"
                  value={formData.issue || ''}
                  onChange={(e) => handleInputChange('issue', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pages
                </label>
                <input
                  type="text"
                  value={formData.pages || ''}
                  onChange={(e) => handleInputChange('pages', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 123-145"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DOI
                </label>
                <input
                  type="text"
                  value={formData.doi || ''}
                  onChange={(e) => handleInputChange('doi', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10.1000/182"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Impact Factor
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={formData.impactFactor || ''}
                  onChange={(e) => handleInputChange('impactFactor', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 4.582"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Citations
              </label>
              <input
                type="number"
                value={formData.citations || 0}
                onChange={(e) => handleInputChange('citations', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
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
              {publication ? 'Edit Publication' : 'Create New Publication'}
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
                    Create Publication
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

export default PublicationForm; 