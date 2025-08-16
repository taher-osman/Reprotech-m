import React, { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Edit, 
  Eye, 
  Users, 
  MessageCircle, 
  Clock,
  Download,
  Upload,
  FileText,
  History,
  Share,
  Settings,
  Bold,
  Italic,
  Underline,
  List,
  Quote,
  Link,
  Image,
  ChevronLeft,
  ChevronRight,
  Search,
  Replace,
  Maximize,
  Minimize
} from 'lucide-react';
import { Badge } from './components/ui/Badge';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { 
  Publication,
  PublicationStatus,
  Author,
  ManuscriptVersion,
  Comment,
  CollaborationSession
} from '../types/researchTypes';
import { researchApi } from '../services/researchApi';

interface WritingEnvironmentProps {
  publicationId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (publication: Publication) => void;
}

export const WritingEnvironment: React.FC<WritingEnvironmentProps> = ({
  publicationId,
  isOpen,
  onClose,
  onSave
}) => {
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState('editor');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [collaborators, setCollaborators] = useState<Author[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [versions, setVersions] = useState<ManuscriptVersion[]>([]);
  const [activeCollaborators, setActiveCollaborators] = useState<string[]>([]);

  const tabs = [
    { id: 'editor', label: 'Editor', icon: Edit },
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'comments', label: 'Comments', icon: MessageCircle },
    { id: 'versions', label: 'Versions', icon: History },
    { id: 'collaborators', label: 'Collaborators', icon: Users }
  ];

  useEffect(() => {
    if (isOpen && publicationId) {
      loadPublication();
    }
  }, [isOpen, publicationId]);

  useEffect(() => {
    const words = content.split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  const loadPublication = async () => {
    try {
      setLoading(true);
      const response = await researchApi.getPublication(publicationId);
      
      if (response.success) {
        setPublication(response.data);
        setContent(response.data.abstract || ''); // Load existing content
        setCollaborators(response.data.authors || []);
      }
    } catch (error) {
      console.error('Error loading publication:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!publication) return;

    try {
      setSaving(true);
      
      const updatedPublication = {
        ...publication,
        abstract: content,
        status: PublicationStatus.WRITING
      };

      const response = await researchApi.updatePublication(publicationId, updatedPublication);
      
      if (response.success) {
        setPublication(response.data);
        onSave?.(response.data);
      }
    } catch (error) {
      console.error('Error saving publication:', error);
    } finally {
      setSaving(false);
    }
  };

  const insertFormatting = (format: string) => {
    // Simple text formatting - in a real implementation, this would use a rich text editor
    const textarea = document.getElementById('manuscript-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      default:
        formattedText = selectedText;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
  };

  const renderToolbar = () => (
    <div className="border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Formatting tools */}
          <div className="flex items-center space-x-1 border-r border-gray-300 pr-3 mr-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => insertFormatting('bold')}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => insertFormatting('italic')}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => insertFormatting('underline')}
              title="Underline"
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-1 border-r border-gray-300 pr-3 mr-3">
            <Button variant="ghost" size="sm" title="Bullet List">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Quote">
              <Quote className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Insert Link">
              <Link className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Insert Image">
              <Image className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" title="Find">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Replace">
              <Replace className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600">
            {wordCount} words
          </span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderEditor = () => (
    <div className="flex-1 p-6">
      <textarea
        id="manuscript-editor"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-full resize-none border-none outline-none text-gray-900 leading-relaxed"
        placeholder="Start writing your manuscript..."
        style={{ fontFamily: 'Georgia, serif', fontSize: '16px', lineHeight: '1.6' }}
      />
    </div>
  );

  const renderPreview = () => (
    <div className="flex-1 p-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="prose prose-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {publication?.title || 'Untitled Manuscript'}
          </h1>
          
          {publication?.authors && publication.authors.length > 0 && (
            <div className="mb-8">
              <p className="text-lg text-gray-700">
                {publication.authors.map(author => author.name).join(', ')}
              </p>
            </div>
          )}

          <div className="whitespace-pre-wrap text-gray-800">
            {content || 'No content to preview'}
          </div>
        </div>
      </div>
    </div>
  );

  const renderComments = () => (
    <div className="flex-1 p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Comments & Suggestions</h3>
          <Button size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            New Comment
          </Button>
        </div>

        {comments.length === 0 ? (
          <Card className="p-8">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
              <p className="text-gray-600">Start collaborating by adding comments to the manuscript</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {comments.map((comment, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {comment.author?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{comment.author?.name || 'Unknown'}</p>
                      <span className="text-xs text-gray-500">
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'Just now'}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-1">{comment.content}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderVersions = () => (
    <div className="flex-1 p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Version History</h3>
          <Button size="sm">
            <History className="h-4 w-4 mr-2" />
            Create Version
          </Button>
        </div>

        {versions.length === 0 ? (
          <Card className="p-8">
            <div className="text-center">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No versions saved</h3>
              <p className="text-gray-600">Create versions to track changes and collaborate effectively</p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {versions.map((version, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      Version {version.version} - {version.title}
                    </p>
                    <p className="text-sm text-gray-600">{version.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Created by {version.createdBy} on {new Date(version.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderCollaborators = () => (
    <div className="flex-1 p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Collaborators</h3>
          <Button size="sm">
            <Share className="h-4 w-4 mr-2" />
            Invite
          </Button>
        </div>

        <div className="space-y-3">
          {collaborators.map((collaborator, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {collaborator.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{collaborator.name}</p>
                    <p className="text-sm text-gray-600">{collaborator.email}</p>
                    <p className="text-xs text-gray-500">{collaborator.affiliation}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {activeCollaborators.includes(collaborator.id) && (
                    <Badge className="bg-green-100 text-green-800">
                      Online
                    </Badge>
                  )}
                  {collaborator.isCorresponding && (
                    <Badge className="bg-blue-100 text-blue-800">
                      Corresponding
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div className="w-80 border-l border-gray-200 bg-gray-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">Document Info</h3>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setSidebarOpen(false)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">Title</label>
          <p className="text-sm text-gray-900 mt-1">{publication?.title || 'Untitled'}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Status</label>
          <Badge className="mt-1 bg-blue-100 text-blue-800">
            {publication?.status?.replace('_', ' ') || 'Draft'}
          </Badge>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Word Count</label>
          <p className="text-sm text-gray-900 mt-1">{wordCount} words</p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Authors</label>
          <p className="text-sm text-gray-900 mt-1">
            {collaborators.length} author{collaborators.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Last Saved</label>
          <p className="text-sm text-gray-600 mt-1">
            {publication?.updatedAt ? new Date(publication.updatedAt).toLocaleString() : 'Not saved'}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="w-full"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'editor':
        return renderEditor();
      case 'preview':
        return renderPreview();
      case 'comments':
        return renderComments();
      case 'versions':
        return renderVersions();
      case 'collaborators':
        return renderCollaborators();
      default:
        return renderEditor();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-white z-50 ${isFullscreen ? '' : 'top-16'}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 truncate max-w-96">
                {loading ? 'Loading...' : publication?.title || 'Untitled Manuscript'}
              </h1>
              <p className="text-sm text-gray-600">
                Collaborative Writing Environment
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Toolbar */}
        {activeTab === 'editor' && renderToolbar()}

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Content */}
          <div className="flex-1 flex flex-col">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading manuscript...</p>
                </div>
              </div>
            ) : (
              renderTabContent()
            )}
          </div>

          {/* Sidebar */}
          {sidebarOpen ? (
            renderSidebar()
          ) : (
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="p-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WritingEnvironment; 