import React, { useState, useEffect } from 'react';
import { 
  Folder,
  File,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Tag,
  Lock,
  Unlock,
  Users,
  Calendar,
  FileText,
  Image,
  Archive,
  Share2,
  MoreHorizontal,
  Star,
  Clock,
  CheckCircle
} from 'lucide-react';

interface TenderDocument {
  document_id: string;
  filename: string;
  original_name: string;
  file_type: string;
  file_size: number;
  folder: string;
  tags: string[];
  uploaded_by: string;
  uploaded_date: string;
  last_modified: string;
  access_permissions: AccessPermission[];
  version: number;
  is_starred: boolean;
  status: 'draft' | 'review' | 'approved' | 'archived';
  description?: string;
  related_tender_id: string;
}

interface AccessPermission {
  department: string;
  permission: 'view' | 'edit' | 'admin';
  granted_by: string;
  granted_date: string;
}

interface DocumentFolder {
  folder_id: string;
  folder_name: string;
  description: string;
  parent_folder?: string;
  document_count: number;
  created_date: string;
  access_level: 'public' | 'restricted' | 'confidential';
  icon: string;
}

interface TenderDocumentCenterProps {
  tender_id: string;
  className?: string;
}

// Mock data
const mockFolders: DocumentFolder[] = [
  {
    folder_id: 'folder-001',
    folder_name: 'RFP & TOR',
    description: 'Request for Proposal and Terms of Reference documents',
    document_count: 8,
    created_date: '2025-06-01',
    access_level: 'public',
    icon: 'FileText'
  },
  {
    folder_id: 'folder-002',
    folder_name: 'Technical Proposals',
    description: 'Technical proposals and specifications from vendors',
    document_count: 15,
    created_date: '2025-06-15',
    access_level: 'restricted',
    icon: 'File'
  },
  {
    folder_id: 'folder-003',
    folder_name: 'Financial Proposals',
    description: 'Financial bids and cost breakdowns',
    document_count: 12,
    created_date: '2025-06-15',
    access_level: 'confidential',
    icon: 'Archive'
  },
  {
    folder_id: 'folder-004',
    folder_name: 'Communication Logs',
    description: 'Email exchanges and meeting records',
    document_count: 24,
    created_date: '2025-06-01',
    access_level: 'restricted',
    icon: 'Users'
  },
  {
    folder_id: 'folder-005',
    folder_name: 'Award Documentation',
    description: 'Award letters and notifications',
    document_count: 5,
    created_date: '2025-07-01',
    access_level: 'confidential',
    icon: 'Star'
  },
  {
    folder_id: 'folder-006',
    folder_name: 'Contracts & Agreements',
    description: 'Final contracts and legal agreements',
    document_count: 3,
    created_date: '2025-07-05',
    access_level: 'confidential',
    icon: 'CheckCircle'
  }
];

const mockDocuments: TenderDocument[] = [
  {
    document_id: 'doc-001',
    filename: 'RFP_Medical_Equipment_2025.pdf',
    original_name: 'RFP Medical Equipment 2025.pdf',
    file_type: 'pdf',
    file_size: 2845000,
    folder: 'RFP & TOR',
    tags: ['RFP', 'Medical Equipment', 'Requirements'],
    uploaded_by: 'Dr. Ahmed Hassan',
    uploaded_date: '2025-06-01T10:00:00Z',
    last_modified: '2025-06-03T14:30:00Z',
    access_permissions: [
      { department: 'Procurement', permission: 'admin', granted_by: 'System', granted_date: '2025-06-01' },
      { department: 'Medical', permission: 'edit', granted_by: 'Dr. Ahmed Hassan', granted_date: '2025-06-01' },
      { department: 'Finance', permission: 'view', granted_by: 'Dr. Ahmed Hassan', granted_date: '2025-06-01' }
    ],
    version: 2,
    is_starred: true,
    status: 'approved',
    description: 'Request for Proposal for medical equipment procurement',
    related_tender_id: 'tender-001'
  },
  {
    document_id: 'doc-002',
    filename: 'Technical_Specifications_V3.docx',
    original_name: 'Technical Specifications V3.docx',
    file_type: 'docx',
    file_size: 1256000,
    folder: 'RFP & TOR',
    tags: ['Technical', 'Specifications', 'Requirements'],
    uploaded_by: 'Eng. Sarah Al-Malik',
    uploaded_date: '2025-06-05T09:15:00Z',
    last_modified: '2025-06-10T16:45:00Z',
    access_permissions: [
      { department: 'Engineering', permission: 'admin', granted_by: 'Eng. Sarah Al-Malik', granted_date: '2025-06-05' },
      { department: 'Procurement', permission: 'edit', granted_by: 'Eng. Sarah Al-Malik', granted_date: '2025-06-05' }
    ],
    version: 3,
    is_starred: false,
    status: 'approved',
    description: 'Detailed technical specifications for equipment',
    related_tender_id: 'tender-001'
  },
  {
    document_id: 'doc-003',
    filename: 'Vendor_Proposal_CompanyA.pdf',
    original_name: 'Vendor Proposal - Company A.pdf',
    file_type: 'pdf',
    file_size: 4567000,
    folder: 'Technical Proposals',
    tags: ['Proposal', 'Vendor', 'Company A', 'Technical'],
    uploaded_by: 'Procurement Team',
    uploaded_date: '2025-06-20T11:30:00Z',
    last_modified: '2025-06-20T11:30:00Z',
    access_permissions: [
      { department: 'Procurement', permission: 'admin', granted_by: 'System', granted_date: '2025-06-20' },
      { department: 'Evaluation Committee', permission: 'view', granted_by: 'Procurement Team', granted_date: '2025-06-20' }
    ],
    version: 1,
    is_starred: false,
    status: 'review',
    description: 'Technical proposal from Company A',
    related_tender_id: 'tender-001'
  },
  {
    document_id: 'doc-004',
    filename: 'Financial_Bid_CompanyA.xlsx',
    original_name: 'Financial Bid - Company A.xlsx',
    file_type: 'xlsx',
    file_size: 856000,
    folder: 'Financial Proposals',
    tags: ['Financial', 'Bid', 'Company A', 'Pricing'],
    uploaded_by: 'Finance Team',
    uploaded_date: '2025-06-20T14:00:00Z',
    last_modified: '2025-06-22T10:15:00Z',
    access_permissions: [
      { department: 'Finance', permission: 'admin', granted_by: 'System', granted_date: '2025-06-20' },
      { department: 'Management', permission: 'view', granted_by: 'Finance Team', granted_date: '2025-06-20' }
    ],
    version: 1,
    is_starred: true,
    status: 'review',
    description: 'Financial proposal and pricing from Company A',
    related_tender_id: 'tender-001'
  },
  {
    document_id: 'doc-005',
    filename: 'Award_Letter_Final.pdf',
    original_name: 'Award Letter Final.pdf',
    file_type: 'pdf',
    file_size: 1234000,
    folder: 'Award Documentation',
    tags: ['Award', 'Letter', 'Final', 'Official'],
    uploaded_by: 'Dr. Abdullah Al-Mahmoud',
    uploaded_date: '2025-07-01T16:00:00Z',
    last_modified: '2025-07-01T16:00:00Z',
    access_permissions: [
      { department: 'Management', permission: 'admin', granted_by: 'System', granted_date: '2025-07-01' },
      { department: 'Legal', permission: 'view', granted_by: 'Dr. Abdullah Al-Mahmoud', granted_date: '2025-07-01' },
      { department: 'Procurement', permission: 'view', granted_by: 'Dr. Abdullah Al-Mahmoud', granted_date: '2025-07-01' }
    ],
    version: 1,
    is_starred: true,
    status: 'approved',
    description: 'Official award letter for the tender',
    related_tender_id: 'tender-001'
  }
];

const availableTags = ['RFP', 'Technical', 'Financial', 'Legal', 'Award', 'Contract', 'Proposal', 'Vendor', 'Review', 'Approved'];

export const TenderDocumentCenter: React.FC<TenderDocumentCenterProps> = ({
  tender_id,
  className = ''
}) => {
  const [currentView, setCurrentView] = useState<'folders' | 'documents' | 'search'>('folders');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [filterByStatus, setFilterByStatus] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const getFileIcon = (fileType: string) => {
    const icons = {
      'pdf': FileText,
      'doc': FileText,
      'docx': FileText,
      'xls': Archive,
      'xlsx': Archive,
      'jpg': Image,
      'jpeg': Image,
      'png': Image,
      'gif': Image
    };
    return icons[fileType as keyof typeof icons] || File;
  };

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAccessLevelColor = (level: string) => {
    const colors = {
      'public': 'bg-green-100 text-green-800 border-green-200',
      'restricted': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'confidential': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-800',
      'review': 'bg-yellow-100 text-yellow-800',
      'approved': 'bg-green-100 text-green-800',
      'archived': 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesFolder = !selectedFolder || doc.folder === selectedFolder;
    const matchesSearch = !searchQuery || 
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => doc.tags.includes(tag));
    const matchesStatus = filterByStatus === 'all' || doc.status === filterByStatus;
    
    return matchesFolder && matchesSearch && matchesTags && matchesStatus;
  });

  const renderFoldersView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Document Folders</h3>
        <div className="flex space-x-3">
          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Folder</span>
          </button>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Documents</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockFolders.map(folder => {
          const IconComponent = folder.icon === 'FileText' ? FileText : 
                               folder.icon === 'File' ? File :
                               folder.icon === 'Archive' ? Archive :
                               folder.icon === 'Users' ? Users :
                               folder.icon === 'Star' ? Star :
                               folder.icon === 'CheckCircle' ? CheckCircle : Folder;

          return (
            <div
              key={folder.folder_id}
              onClick={() => {
                setSelectedFolder(folder.folder_name);
                setCurrentView('documents');
              }}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <IconComponent className="h-6 w-6 text-blue-600" />
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getAccessLevelColor(folder.access_level)}`}>
                  {folder.access_level}
                </span>
              </div>
              
              <h4 className="font-medium text-gray-900 mb-2">{folder.folder_name}</h4>
              <p className="text-sm text-gray-600 mb-4">{folder.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{folder.document_count} documents</span>
                <span>{new Date(folder.created_date).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderDocumentsView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setCurrentView('folders');
                setSelectedFolder(null);
              }}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Folders
            </button>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mt-2">
            {selectedFolder || 'All Documents'}
          </h3>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
        >
          <Upload className="h-4 w-4" />
          <span>Upload</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search documents..."
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <select
              multiple
              value={selectedTags}
              onChange={(e) => setSelectedTags(Array.from(e.target.selectedOptions, option => option.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterByStatus}
              onChange={(e) => setFilterByStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="approved">Approved</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
              <option value="type">Type</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Document</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Tags</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Size</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Modified</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDocuments.map(doc => {
              const FileIcon = getFileIcon(doc.file_type);
              return (
                <tr key={doc.document_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <FileIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{doc.original_name}</span>
                          {doc.is_starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                          <span className="text-xs text-gray-500">v{doc.version}</span>
                        </div>
                        <p className="text-sm text-gray-600">{doc.description}</p>
                        <p className="text-xs text-gray-500">by {doc.uploaded_by}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {getFileSize(doc.file_size)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(doc.last_modified).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUploadModal = () => {
    if (!showUploadModal) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative min-h-full flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Upload Documents</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Click to upload or drag and drop
                        </span>
                        <input type="file" className="sr-only" multiple />
                      </label>
                      <p className="mt-1 text-sm text-gray-500">
                        PDF, DOC, DOCX, XLS, XLSX up to 10MB each
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Folder</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {mockFolders.map(folder => (
                        <option key={folder.folder_id} value={folder.folder_name}>
                          {folder.folder_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter tags separated by commas"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Document description..."
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Upload Documents
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Document Center</h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {filteredDocuments.length} of {mockDocuments.length} documents
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentView('folders')}
                className={`px-3 py-1 rounded text-sm ${
                  currentView === 'folders' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Folders
              </button>
              <button
                onClick={() => setCurrentView('documents')}
                className={`px-3 py-1 rounded text-sm ${
                  currentView === 'documents' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Documents
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {currentView === 'folders' ? renderFoldersView() : renderDocumentsView()}
      </div>

      {/* Upload Modal */}
      {renderUploadModal()}
    </div>
  );
};

export default TenderDocumentCenter; 