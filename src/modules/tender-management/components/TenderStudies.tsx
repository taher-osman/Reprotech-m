import React, { useState } from 'react';
import { 
  Save, 
  Edit3, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  DollarSign, 
  Users, 
  Shield,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from 'lucide-react';
import { TenderStudy } from '../types/tenderTypes';

interface TenderStudiesProps {
  studies: TenderStudy;
  onUpdate: (studies: Partial<TenderStudy>) => Promise<void>;
  isEditable?: boolean;
  className?: string;
}

interface StudySection {
  key: keyof TenderStudy;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  placeholder: string;
  color: string;
}

const studySections: StudySection[] = [
  {
    key: 'technical_study',
    title: 'Technical Study',
    icon: FileText,
    description: 'Technical requirements, specifications, and feasibility analysis',
    placeholder: 'Enter technical study details including requirements, specifications, feasibility analysis, and technical approach...',
    color: 'blue'
  },
  {
    key: 'financial_study',
    title: 'Financial Study',
    icon: DollarSign,
    description: 'Cost analysis, budget planning, and financial feasibility',
    placeholder: 'Enter financial study details including cost analysis, budget planning, pricing strategy, and financial projections...',
    color: 'green'
  },
  {
    key: 'hr_study',
    title: 'HR Study',
    icon: Users,
    description: 'Human resources requirements, team structure, and staffing plan',
    placeholder: 'Enter HR study details including staffing requirements, team structure, qualifications needed, and resource allocation...',
    color: 'purple'
  },
  {
    key: 'compliance_study',
    title: 'Compliance Study',
    icon: Shield,
    description: 'Regulatory compliance, legal requirements, and risk assessment',
    placeholder: 'Enter compliance study details including regulatory requirements, legal considerations, risk assessment, and compliance measures...',
    color: 'orange'
  }
];

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    icon: 'text-blue-500',
    button: 'bg-blue-600 hover:bg-blue-700'
  },
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    icon: 'text-green-500',
    button: 'bg-green-600 hover:bg-green-700'
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    icon: 'text-purple-500',
    button: 'bg-purple-600 hover:bg-purple-700'
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    icon: 'text-orange-500',
    button: 'bg-orange-600 hover:bg-orange-700'
  }
};

export const TenderStudies: React.FC<TenderStudiesProps> = ({
  studies,
  onUpdate,
  isEditable = true,
  className = ''
}) => {
  const [editingSection, setEditingSection] = useState<keyof TenderStudy | null>(null);
  const [saving, setSaving] = useState(false);
  const [localStudies, setLocalStudies] = useState<TenderStudy>(studies);
  const [lockedSections, setLockedSections] = useState<Set<keyof TenderStudy>>(new Set());

  const handleEdit = (section: keyof TenderStudy) => {
    if (isEditable && !lockedSections.has(section)) {
      setEditingSection(section);
    }
  };

  const handleSave = async (section: keyof TenderStudy) => {
    if (!editingSection) return;

    try {
      setSaving(true);
      await onUpdate({ [section]: localStudies[section] });
      setEditingSection(null);
    } catch (error) {
      console.error('Failed to save study:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = (section: keyof TenderStudy) => {
    setLocalStudies(prev => ({ ...prev, [section]: studies[section] }));
    setEditingSection(null);
  };

  const toggleLock = (section: keyof TenderStudy) => {
    const newLocked = new Set(lockedSections);
    if (newLocked.has(section)) {
      newLocked.delete(section);
    } else {
      newLocked.add(section);
    }
    setLockedSections(newLocked);
  };

  const getCompletionStatus = (content: string) => {
    if (!content || content.trim().length === 0) return 'empty';
    if (content.trim().length < 100) return 'incomplete';
    return 'complete';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'incomplete':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'empty':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'complete':
        return 'Complete';
      case 'incomplete':
        return 'Incomplete';
      case 'empty':
        return 'Not Started';
      default:
        return '';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Tender Studies</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Final Review Mode</span>
          <button
            onClick={() => setLockedSections(new Set(Object.keys(studies) as Array<keyof TenderStudy>))}
            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200"
          >
            Lock All
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {studySections.map((section) => {
          const isEditing = editingSection === section.key;
          const isLocked = lockedSections.has(section.key);
          const content = localStudies[section.key] || '';
          const status = getCompletionStatus(content);
          const colors = colorClasses[section.color as keyof typeof colorClasses];

          return (
            <div
              key={section.key}
              className={`border rounded-lg overflow-hidden ${colors.border}`}
            >
              {/* Header */}
              <div className={`px-4 py-3 ${colors.bg} border-b ${colors.border}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <section.icon className={`h-5 w-5 ${colors.icon}`} />
                    <div>
                      <h3 className={`font-medium ${colors.text}`}>
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(status)}
                    <span className="text-sm text-gray-600">
                      {getStatusText(status)}
                    </span>
                    
                    {isEditable && (
                      <>
                        <button
                          onClick={() => toggleLock(section.key)}
                          className={`p-1 rounded ${isLocked ? 'text-red-500' : 'text-gray-400'} hover:bg-gray-100`}
                          title={isLocked ? 'Unlock Section' : 'Lock Section'}
                        >
                          {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        </button>
                        
                        {!isLocked && !isEditing && (
                          <button
                            onClick={() => handleEdit(section.key)}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                            title="Edit Section"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      value={content}
                      onChange={(e) => setLocalStudies(prev => ({
                        ...prev,
                        [section.key]: e.target.value
                      }))}
                      placeholder={section.placeholder}
                      className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleCancel(section.key)}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSave(section.key)}
                        disabled={saving}
                        className={`px-3 py-1 text-sm text-white rounded ${colors.button} disabled:opacity-50`}
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    {content ? (
                      <div className="whitespace-pre-wrap text-gray-700">
                        {content}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        No content available. {isEditable && !isLocked && 'Click edit to add content.'}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-2">Studies Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {studySections.map((section) => {
            const content = localStudies[section.key] || '';
            const status = getCompletionStatus(content);
            const colors = colorClasses[section.color as keyof typeof colorClasses];
            
            return (
              <div key={section.key} className="text-center">
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${colors.bg} mb-1`}>
                  {getStatusIcon(status)}
                </div>
                <p className="text-xs text-gray-600">{section.title}</p>
                <p className={`text-xs font-medium ${colors.text}`}>
                  {getStatusText(status)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TenderStudies; 