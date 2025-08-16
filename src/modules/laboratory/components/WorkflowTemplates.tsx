import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Copy,
  Edit,
  Trash2,
  Star,
  Eye,
  Play,
  Share,
  Archive,
  Clock,
  Users,
  Target,
  CheckCircle,
  TestTube,
  Beaker,
  Microscope,
  Settings,
  Bookmark,
  TrendingUp,
  Award,
  Tag,
  Calendar,
  BarChart3,
  Zap,
  GitBranch
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
  usageCount?: number;
  rating?: number;
  reviews?: number;
  isPublic?: boolean;
  isBookmarked?: boolean;
}

interface WorkflowTemplatesProps {
  workflows: LabWorkflow[];
  onSelect: (workflow: LabWorkflow) => void;
}

export const WorkflowTemplates: React.FC<WorkflowTemplatesProps> = ({
  workflows,
  onSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'usage' | 'rating'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTemplate, setSelectedTemplate] = useState<LabWorkflow | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-templates' | 'marketplace' | 'bookmarks'>('my-templates');

  // Extended mock data for templates marketplace
  const [templateMarketplace] = useState<LabWorkflow[]>([
    {
      id: 'market-001',
      name: 'Standard Hematology Panel',
      testType: 'Hematology',
      category: 'Routine',
      version: '2.0',
      status: 'active',
      description: 'Comprehensive hematology testing workflow with automated CBC and differential',
      estimatedTotalTime: 35,
      priority: 'normal',
      steps: [
        {
          id: 'step-001',
          name: 'Sample Collection',
          type: 'collection',
          description: 'Draw blood sample using EDTA tube',
          estimatedDuration: 5,
          requiredRole: 'Phlebotomist',
          qcRequired: false,
          dependencies: [],
          instructions: 'Draw 5ml blood in EDTA tube, label properly',
          status: 'pending'
        },
        {
          id: 'step-002',
          name: 'Automated CBC',
          type: 'analysis',
          description: 'Complete blood count analysis',
          estimatedDuration: 15,
          requiredRole: 'Lab Technician',
          requiredEquipment: 'Hematology Analyzer',
          qcRequired: true,
          dependencies: ['step-001'],
          instructions: 'Load sample into analyzer, run QC controls',
          status: 'pending'
        },
        {
          id: 'step-003',
          name: 'Microscopic Review',
          type: 'review',
          description: 'Manual differential if flagged',
          estimatedDuration: 10,
          requiredRole: 'Medical Technologist',
          qcRequired: false,
          dependencies: ['step-002'],
          instructions: 'Review slide if automated flags present',
          status: 'pending'
        },
        {
          id: 'step-004',
          name: 'Result Validation',
          type: 'approval',
          description: 'Final result validation',
          estimatedDuration: 5,
          requiredRole: 'Senior Technologist',
          qcRequired: false,
          dependencies: ['step-003'],
          instructions: 'Validate results and approve for release',
          status: 'pending'
        }
      ],
      createdBy: 'Dr. Sarah Johnson',
      createdAt: '2024-12-01T10:00:00Z',
      lastModified: '2025-01-01T15:30:00Z',
      tags: ['hematology', 'routine', 'cbc', 'automated'],
      sampleTypes: ['whole blood'],
      equipmentRequired: ['BC-6800 Analyzer', 'Microscope'],
      qualifications: ['Medical Technologist', 'Lab Technician'],
      compliance: ['CLIA', 'ISO 15189', 'CAP'],
      usageCount: 247,
      rating: 4.8,
      reviews: 34,
      isPublic: true,
      isBookmarked: false
    },
    {
      id: 'market-002',
      name: 'COVID-19 Rapid Testing',
      testType: 'Molecular',
      category: 'Infectious Disease',
      version: '1.3',
      status: 'active',
      description: 'Fast-track COVID-19 testing workflow for rapid antigen and PCR tests',
      estimatedTotalTime: 25,
      priority: 'high',
      steps: [
        {
          id: 'step-001',
          name: 'Sample Collection',
          type: 'collection',
          description: 'Nasopharyngeal swab collection',
          estimatedDuration: 5,
          requiredRole: 'Healthcare Worker',
          qcRequired: false,
          dependencies: [],
          instructions: 'Collect nasopharyngeal swab with proper PPE',
          status: 'pending'
        },
        {
          id: 'step-002',
          name: 'Rapid Antigen Test',
          type: 'analysis',
          description: 'Quick antigen detection',
          estimatedDuration: 15,
          requiredRole: 'Lab Technician',
          requiredEquipment: 'Rapid Test Kit',
          qcRequired: true,
          dependencies: ['step-001'],
          instructions: 'Process sample through rapid test device',
          status: 'pending'
        },
        {
          id: 'step-003',
          name: 'Result Interpretation',
          type: 'review',
          description: 'Read and validate results',
          estimatedDuration: 5,
          requiredRole: 'Medical Technologist',
          qcRequired: false,
          dependencies: ['step-002'],
          instructions: 'Read test lines and validate results',
          status: 'pending'
        }
      ],
      createdBy: 'Dr. Michael Chen',
      createdAt: '2024-11-15T08:00:00Z',
      lastModified: '2024-12-20T12:45:00Z',
      tags: ['covid-19', 'rapid', 'antigen', 'emergency'],
      sampleTypes: ['nasopharyngeal swab'],
      equipmentRequired: ['Rapid Test Kit'],
      qualifications: ['Lab Technician', 'Healthcare Worker'],
      compliance: ['FDA EUA', 'CE IVD'],
      usageCount: 156,
      rating: 4.6,
      reviews: 22,
      isPublic: true,
      isBookmarked: true
    },
    {
      id: 'market-003',
      name: 'Comprehensive Metabolic Panel',
      testType: 'Chemistry',
      category: 'Routine',
      version: '1.8',
      status: 'active',
      description: 'Complete metabolic panel with electrolytes, glucose, and liver function tests',
      estimatedTotalTime: 45,
      priority: 'normal',
      steps: [
        {
          id: 'step-001',
          name: 'Serum Separation',
          type: 'preparation',
          description: 'Centrifuge and separate serum',
          estimatedDuration: 15,
          requiredRole: 'Lab Technician',
          requiredEquipment: 'Centrifuge',
          qcRequired: true,
          dependencies: [],
          instructions: 'Centrifuge at 3000 RPM for 10 minutes',
          status: 'pending'
        },
        {
          id: 'step-002',
          name: 'Chemistry Analysis',
          type: 'analysis',
          description: 'Automated chemistry analysis',
          estimatedDuration: 20,
          requiredRole: 'Lab Technician',
          requiredEquipment: 'Chemistry Analyzer',
          qcRequired: true,
          dependencies: ['step-001'],
          instructions: 'Load samples into chemistry analyzer',
          status: 'pending'
        },
        {
          id: 'step-003',
          name: 'QC Review',
          type: 'qc',
          description: 'Quality control verification',
          estimatedDuration: 5,
          requiredRole: 'QC Specialist',
          qcRequired: true,
          dependencies: ['step-002'],
          instructions: 'Review QC results and delta checks',
          status: 'pending'
        },
        {
          id: 'step-004',
          name: 'Result Validation',
          type: 'approval',
          description: 'Final result approval',
          estimatedDuration: 5,
          requiredRole: 'Medical Technologist',
          qcRequired: false,
          dependencies: ['step-003'],
          instructions: 'Review results for critical values',
          status: 'pending'
        }
      ],
      createdBy: 'Dr. Emily Rodriguez',
      createdAt: '2024-10-10T14:30:00Z',
      lastModified: '2024-12-15T09:20:00Z',
      tags: ['chemistry', 'metabolic', 'routine', 'automated'],
      sampleTypes: ['serum', 'plasma'],
      equipmentRequired: ['AU5800 Analyzer', 'Centrifuge'],
      qualifications: ['Medical Technologist', 'QC Specialist'],
      compliance: ['CLIA', 'ISO 15189'],
      usageCount: 389,
      rating: 4.9,
      reviews: 56,
      isPublic: true,
      isBookmarked: false
    }
  ]);

  const categories = ['Hematology', 'Chemistry', 'Immunology', 'Microbiology', 'Molecular', 'Pathology', 'Blood Bank'];

  const filteredWorkflows = (() => {
    let filtered = workflows;
    
    // Apply tab filter
    if (activeTab === 'marketplace') {
      filtered = templateMarketplace;
    } else if (activeTab === 'bookmarks') {
      filtered = templateMarketplace.filter(template => template.isBookmarked);
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(workflow => 
        workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workflow.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(workflow => workflow.testType === categoryFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(workflow => workflow.status === statusFilter);
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'usage':
          return (b.usageCount || 0) - (a.usageCount || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });
  })();

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'collection': return <TestTube className="w-4 h-4" />;
      case 'preparation': return <Beaker className="w-4 h-4" />;
      case 'analysis': return <Microscope className="w-4 h-4" />;
      case 'qc': return <CheckCircle className="w-4 h-4" />;
      case 'review': return <Eye className="w-4 h-4" />;
      case 'reporting': return <FileText className="w-4 h-4" />;
      case 'approval': return <CheckCircle className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  const renderTemplateCard = (template: LabWorkflow) => (
    <div key={template.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
              {template.isPublic && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                  Public
                </span>
              )}
              {template.status === 'active' && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  Active
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{template.description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {template.tags.slice(0, 3).map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                  #{tag}
                </span>
              ))}
              {template.tags.length > 3 && (
                <span className="text-gray-500 text-xs">+{template.tags.length - 3} more</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            {template.isBookmarked !== undefined && (
              <button
                className={`p-2 rounded-md ${
                  template.isBookmarked 
                    ? 'text-yellow-600 bg-yellow-50' 
                    : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                }`}
              >
                <Bookmark className="w-4 h-4" />
              </button>
            )}
            <button 
              onClick={() => setSelectedTemplate(template)}
              className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">{template.steps.length}</div>
            <div className="text-xs text-gray-500">Steps</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">{template.estimatedTotalTime}m</div>
            <div className="text-xs text-gray-500">Duration</div>
          </div>
          {template.usageCount !== undefined && (
            <div>
              <div className="text-lg font-semibold text-gray-900">{template.usageCount}</div>
              <div className="text-xs text-gray-500">Uses</div>
            </div>
          )}
          {template.rating !== undefined && (
            <div>
              <div className="flex items-center justify-center space-x-1">
                <span className="text-lg font-semibold text-gray-900">{template.rating}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
              </div>
              <div className="text-xs text-gray-500">{template.reviews} reviews</div>
            </div>
          )}
        </div>
      </div>

      {/* Steps Preview */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Workflow Steps</h4>
        <div className="space-y-2">
          {template.steps.slice(0, 3).map((step, index) => (
            <div key={step.id} className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full text-xs font-medium text-blue-600">
                {index + 1}
              </div>
              <div className="flex items-center space-x-2 flex-1">
                {getStepIcon(step.type)}
                <span className="text-sm text-gray-700">{step.name}</span>
                <span className="text-xs text-gray-500">({step.estimatedDuration}min)</span>
              </div>
            </div>
          ))}
          {template.steps.length > 3 && (
            <div className="text-sm text-gray-500 ml-9">
              +{template.steps.length - 3} more steps
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500 space-x-4">
            <span>By {template.createdBy}</span>
            <span>v{template.version}</span>
            <span>{new Date(template.lastModified).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {activeTab === 'my-templates' && (
              <>
                <button className="flex items-center px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">
                  <Copy className="w-3 h-3 mr-1" />
                  Duplicate
                </button>
                <button className="flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200">
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </button>
              </>
            )}
            
            {activeTab === 'marketplace' && (
              <>
                <button className="flex items-center px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">
                  <Download className="w-3 h-3 mr-1" />
                  Import
                </button>
                <button className="flex items-center px-3 py-1 text-xs font-medium text-green-600 bg-green-100 rounded-md hover:bg-green-200">
                  <Play className="w-3 h-3 mr-1" />
                  Use Template
                </button>
              </>
            )}
            
            <button 
              onClick={() => onSelect(template)}
              className="flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
            >
              <Eye className="w-3 h-3 mr-1" />
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTemplateList = (template: LabWorkflow) => (
    <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
              {template.testType}
            </span>
            {template.rating && (
              <div className="flex items-center space-x-1">
                {renderRatingStars(template.rating)}
                <span className="text-sm text-gray-600">({template.reviews})</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{template.description}</p>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>{template.steps.length} steps</span>
            <span>{template.estimatedTotalTime} minutes</span>
            <span>By {template.createdBy}</span>
            {template.usageCount && <span>{template.usageCount} uses</span>}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <button 
            onClick={() => setSelectedTemplate(template)}
            className="p-2 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onSelect(template)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Use Template
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-500 rounded-full">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">📋 Workflow Templates</h2>
              <p className="text-gray-600">Manage, share, and discover workflow templates</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowImportModal(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('my-templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-templates'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              My Templates ({workflows.length})
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'marketplace'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Award className="h-4 w-4 inline mr-2" />
              Template Marketplace ({templateMarketplace.length})
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bookmarks'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Bookmark className="h-4 w-4 inline mr-2" />
              Bookmarked ({templateMarketplace.filter(t => t.isBookmarked).length})
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="name">Sort by Name</option>
              <option value="created">Sort by Date</option>
              {activeTab === 'marketplace' && (
                <>
                  <option value="usage">Sort by Usage</option>
                  <option value="rating">Sort by Rating</option>
                </>
              )}
            </select>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${
                  viewMode === 'grid' 
                    ? 'text-indigo-600 bg-indigo-100' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${
                  viewMode === 'list' 
                    ? 'text-indigo-600 bg-indigo-100' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredWorkflows.map(renderTemplateCard)}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredWorkflows.map(renderTemplateList)}
        </div>
      )}

      {filteredWorkflows.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-500 mb-4">
            {activeTab === 'my-templates' 
              ? "You haven't created any templates yet."
              : "No templates match your search criteria."
            }
          </p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Template
          </button>
        </div>
      )}

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{selectedTemplate.name}</h3>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <p className="text-gray-700">{selectedTemplate.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{selectedTemplate.steps.length}</div>
                    <div className="text-sm text-gray-500">Steps</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{selectedTemplate.estimatedTotalTime}m</div>
                    <div className="text-sm text-gray-500">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{selectedTemplate.testType}</div>
                    <div className="text-sm text-gray-500">Category</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">v{selectedTemplate.version}</div>
                    <div className="text-sm text-gray-500">Version</div>
                  </div>
                </div>

                {/* Steps Detail */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Workflow Steps</h4>
                  <div className="space-y-3">
                    {selectedTemplate.steps.map((step, index) => (
                      <div key={step.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full text-sm font-medium text-indigo-600">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getStepIcon(step.type)}
                            <h5 className="font-medium text-gray-900">{step.name}</h5>
                            <span className="text-sm text-gray-500">({step.estimatedDuration} min)</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                          <div className="text-xs text-gray-500">
                            Required Role: {step.requiredRole}
                            {step.requiredEquipment && ` • Equipment: ${step.requiredEquipment}`}
                            {step.qcRequired && ' • QC Required'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onSelect(selectedTemplate);
                  setSelectedTemplate(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 