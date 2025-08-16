import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar as CalendarIcon,
  FileText,
  BarChart3,
  Settings
} from 'lucide-react';
import { 
  Tender, 
  TenderFormData, 
  TenderFilter, 
  TenderStats, 
  TenderStatus, 
  TenderSource, 
  TenderCategory,
  TenderType,
  TenderMode,
  TenderLanguage,
  TenderCalendarEvent
} from '../types/tenderTypes';
import { tenderApi } from '../services/tenderApi';
import TenderDashboard from '../components/TenderDashboard';
import TenderForm from '../components/TenderForm';
import TenderDetail from '../components/TenderDetail';
import TenderCalendar from '../components/TenderCalendar';

// Mock data for development
const mockStats: TenderStats = {
  total_tenders: 24,
  open_tenders: 8,
  submitted_tenders: 12,
  awarded_tenders: 3,
  urgent_deadlines: 4,
  total_value: 2500000,
  success_rate: 78.5
};

const mockTenders: Tender[] = [
  {
    tender_id: 'T-001',
    title: 'Medical Equipment Supply for Regional Hospital',
    reference_number: 'MOH-2025-001',
    source: TenderSource.GOVERNMENT,
    category: TenderCategory.MEDICAL,
    owner_entity: 'Ministry of Health',
    submission_deadline: '2025-08-15T23:59:00',
    opening_date: '2025-08-16T10:00:00',
    award_date: undefined,
    status: TenderStatus.OPEN,
    type: TenderType.SUPPLY,
    mode: TenderMode.OPEN,
    summary: 'Supply of advanced medical equipment including MRI machines, CT scanners, and laboratory equipment for the new regional hospital facility.',
    language: TenderLanguage.ENGLISH,
    assigned_manager_id: 'user-1',
    assigned_manager_name: 'Dr. Ahmed Hassan',
    linked_departments: ['Medical Devices', 'Procurement', 'Quality Assurance'],
    created_at: '2025-01-15T09:00:00',
    updated_at: '2025-01-20T14:30:00',
    studies: {
      technical_study: 'Technical specifications for medical equipment including MRI, CT, and lab equipment with detailed requirements for installation, training, and maintenance.',
      financial_study: 'Budget analysis showing total procurement cost of $2.5M with 3-year maintenance included. Cost breakdown by equipment type and vendor comparison.',
      hr_study: 'Staffing requirements including 2 biomedical engineers, 4 technicians, and training for existing staff. Total HR cost estimated at $150K annually.',
      compliance_study: 'FDA compliance requirements, ISO certifications, and local regulatory approvals. All equipment must meet international safety standards.',
      created_at: '2025-01-15T09:00:00',
      updated_at: '2025-01-20T14:30:00'
    },
    attachments: [],
    comments: [],
    history: []
  },
  {
    tender_id: 'T-002',
    title: 'Veterinary Laboratory Services Contract',
    reference_number: 'AGR-2025-002',
    source: TenderSource.GOVERNMENT,
    category: TenderCategory.VETERINARY,
    owner_entity: 'Ministry of Agriculture',
    submission_deadline: '2025-07-20T17:00:00',
    opening_date: '2025-07-21T09:00:00',
    status: TenderStatus.SUBMITTED,
    type: TenderType.SERVICE,
    mode: TenderMode.LIMITED,
    summary: 'Comprehensive veterinary laboratory services for livestock health monitoring and disease prevention programs.',
    language: TenderLanguage.BOTH,
    assigned_manager_id: 'user-2',
    assigned_manager_name: 'Dr. Sarah Wilson',
    linked_departments: ['Veterinary Services', 'Laboratory Operations'],
    created_at: '2025-01-10T08:00:00',
    updated_at: '2025-01-18T16:45:00'
  },
  {
    tender_id: 'T-003',
    title: 'Research Institute Equipment Maintenance',
    reference_number: 'RES-2025-003',
    source: TenderSource.PRIVATE,
    category: TenderCategory.RESEARCH,
    owner_entity: 'National Research Institute',
    submission_deadline: '2025-07-05T12:00:00',
    opening_date: '2025-07-06T14:00:00',
    status: TenderStatus.EVALUATING,
    type: TenderType.MAINTENANCE,
    mode: TenderMode.DIRECT,
    summary: 'Annual maintenance contract for research laboratory equipment including electron microscopes and analytical instruments.',
    language: TenderLanguage.ENGLISH,
    assigned_manager_id: 'user-3',
    assigned_manager_name: 'Prof. Michael Chen',
    linked_departments: ['Research Operations', 'Facilities Management'],
    created_at: '2025-01-05T10:30:00',
    updated_at: '2025-01-22T11:15:00'
  }
];

const mockCalendarEvents: TenderCalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Medical Equipment Submission Deadline',
    date: '2025-08-15',
    type: 'deadline',
    tender_id: 'T-001',
    status: TenderStatus.OPEN,
    color: '#ef4444'
  },
  {
    id: 'evt-2',
    title: 'Veterinary Lab Opening',
    date: '2025-07-21',
    type: 'opening',
    tender_id: 'T-002',
    status: TenderStatus.SUBMITTED,
    color: '#3b82f6'
  },
  {
    id: 'evt-3',
    title: 'Research Equipment Award',
    date: '2025-07-30',
    type: 'award',
    tender_id: 'T-003',
    status: TenderStatus.EVALUATING,
    color: '#10b981'
  }
];

export const TenderManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tenders, setTenders] = useState<Tender[]>(mockTenders);
  const [stats, setStats] = useState<TenderStats>(mockStats);
  const [filters, setFilters] = useState<TenderFilter>({});
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTender, setEditingTender] = useState<Tender | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<TenderCalendarEvent[]>(mockCalendarEvents);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTenders();
  }, [filters]);

  const loadTenders = async () => {
    try {
      setLoading(true);
      // In real implementation, this would call tenderApi.getAllTenders(filters)
      // For now, we'll use mock data
      setTenders(mockTenders);
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load tenders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTender = () => {
    setEditingTender(null);
    setIsFormOpen(true);
  };

  const handleEditTender = (tender: Tender) => {
    setEditingTender(tender);
    setIsFormOpen(true);
  };

  const handleViewTender = (tender: Tender) => {
    setSelectedTender(tender);
    setActiveTab('detail');
  };

  const handleSubmitTender = async (formData: TenderFormData) => {
    try {
      if (editingTender) {
        // Update existing tender
        const updatedTender = { ...editingTender, ...formData };
        setTenders(prev => prev.map(t => t.tender_id === editingTender.tender_id ? updatedTender : t));
      } else {
        // Create new tender
        const newTender: Tender = {
          tender_id: `T-${String(tenders.length + 1).padStart(3, '0')}`,
          ...formData,
          status: TenderStatus.DRAFT,
          assigned_manager_name: 'Current User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setTenders(prev => [...prev, newTender]);
      }
      setIsFormOpen(false);
      setEditingTender(null);
    } catch (error) {
      console.error('Failed to submit tender:', error);
    }
  };

  const handleDeleteTender = async (tenderId: string) => {
    try {
      if (window.confirm('Are you sure you want to delete this tender?')) {
        setTenders(prev => prev.filter(t => t.tender_id !== tenderId));
        if (selectedTender?.tender_id === tenderId) {
          setSelectedTender(null);
          setActiveTab('dashboard');
        }
      }
    } catch (error) {
      console.error('Failed to delete tender:', error);
    }
  };

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      // In real implementation, this would call tenderApi.exportTenders
      console.log(`Exporting tenders as ${format}`);
    } catch (error) {
      console.error('Failed to export tenders:', error);
    }
  };

  const handleImport = async (file: File) => {
    try {
      // In real implementation, this would call tenderApi.importTenders
      console.log('Importing tenders from file:', file.name);
    } catch (error) {
      console.error('Failed to import tenders:', error);
    }
  };

  const tabs = [
    { id: 'dashboard', title: 'Dashboard', icon: BarChart3 },
    { id: 'calendar', title: 'Calendar', icon: CalendarIcon },
    { id: 'analytics', title: 'Analytics', icon: BarChart3 },
    { id: 'settings', title: 'Settings', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <TenderDashboard
            tenders={tenders}
            stats={stats}
            filters={filters}
            onFilterChange={setFilters}
            onViewChange={(view) => console.log('View changed to:', view)}
            onTenderClick={handleViewTender}
            onEditTender={handleEditTender}
            onDeleteTender={handleDeleteTender}
            onExport={handleExport}
            onImport={handleImport}
          />
        );

      case 'calendar':
        return (
          <TenderCalendar
            events={calendarEvents}
            onEventClick={(event) => {
              const tender = tenders.find(t => t.tender_id === event.tender_id);
              if (tender) handleViewTender(tender);
            }}
          />
        );

      case 'detail':
        return selectedTender ? (
          <TenderDetail
            tender={selectedTender}
            onEdit={() => handleEditTender(selectedTender)}
            onDelete={() => handleDeleteTender(selectedTender.tender_id)}
            onAddComment={async (comment) => {
              console.log('Adding comment:', comment);
            }}
            onUploadAttachment={async (file, type) => {
              console.log('Uploading attachment:', file.name, type);
            }}
            onDeleteAttachment={async (attachmentId) => {
              console.log('Deleting attachment:', attachmentId);
            }}
          />
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tender selected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Select a tender from the dashboard to view details.
            </p>
          </div>
        );

      case 'analytics':
        return (
          <div className="text-center py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Analytics Dashboard</h3>
            <p className="mt-1 text-sm text-gray-500">
              Advanced analytics and reporting features coming soon.
            </p>
          </div>
        );

      case 'settings':
        return (
          <div className="text-center py-12">
            <Settings className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Tender Settings</h3>
            <p className="mt-1 text-sm text-gray-500">
              Configure tender management settings and preferences.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Tender Management</h1>
                <p className="text-sm text-gray-500">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    PHASE 1
                  </span>
                  <span className="ml-2">Core Tender System</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleCreateTender}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Tender
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${isActive
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <TabIcon className="h-4 w-4" />
                  <span>{tab.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingTender ? 'Edit Tender' : 'Create New Tender'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <TenderForm
              initialData={editingTender || {}}
              onSubmit={handleSubmitTender}
              onSaveDraft={async (data) => {
                console.log('Saving draft:', data);
              }}
              isEditing={!!editingTender}
            />
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-4 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenderManagementPage; 