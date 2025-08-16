import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Edit, 
  Eye, 
  Download, 
  Share, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  User,
  Target,
  TrendingUp,
  MoreHorizontal,
  Filter,
  Search,
  Plus,
  BookOpen,
  Award,
  Users,
  Globe,
  Star
} from 'lucide-react';
import { Badge } from './components/ui/Badge';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { 
  Publication, 
  PublicationStatus,
  PublicationType,
  ResearchProject,
  Author
} from '../types/researchTypes';
import { researchApi } from '../services/researchApi';

interface PublicationListProps {
  projectId?: string;
  onPublicationSelect?: (publication: Publication) => void;
  onPublicationEdit?: (publication: Publication) => void;
  onPublicationCreate?: () => void;
}

export const PublicationList: React.FC<PublicationListProps> = ({
  projectId,
  onPublicationSelect,
  onPublicationEdit,
  onPublicationCreate
}) => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<PublicationStatus | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<PublicationType | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'title' | 'submissionDate' | 'status' | 'impactFactor'>('submissionDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [publicationsResponse, projectsResponse] = await Promise.all([
        researchApi.getPublications(projectId),
        researchApi.getProjects()
      ]);

      if (publicationsResponse.success) {
        setPublications(publicationsResponse.data);
      }
      if (projectsResponse.success) {
        setProjects(projectsResponse.data);
      }
    } catch (error) {
      console.error('Error loading publications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: PublicationStatus) => {
    switch (status) {
      case PublicationStatus.DRAFT:
        return <Edit className="h-4 w-4 text-gray-600" />;
      case PublicationStatus.WRITING:
        return <FileText className="h-4 w-4 text-blue-600" />;
      case PublicationStatus.REVIEW:
        return <Eye className="h-4 w-4 text-yellow-600" />;
      case PublicationStatus.REVISION:
        return <Clock className="h-4 w-4 text-orange-600" />;
      case PublicationStatus.SUBMITTED:
        return <Target className="h-4 w-4 text-purple-600" />;
      case PublicationStatus.UNDER_REVIEW:
        return <Search className="h-4 w-4 text-indigo-600" />;
      case PublicationStatus.ACCEPTED:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case PublicationStatus.PUBLISHED:
        return <Award className="h-4 w-4 text-blue-600" />;
      case PublicationStatus.REJECTED:
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: PublicationStatus) => {
    switch (status) {
      case PublicationStatus.DRAFT:
        return 'bg-gray-100 text-gray-800';
      case PublicationStatus.WRITING:
        return 'bg-blue-100 text-blue-800';
      case PublicationStatus.REVIEW:
        return 'bg-yellow-100 text-yellow-800';
      case PublicationStatus.REVISION:
        return 'bg-orange-100 text-orange-800';
      case PublicationStatus.SUBMITTED:
        return 'bg-purple-100 text-purple-800';
      case PublicationStatus.UNDER_REVIEW:
        return 'bg-indigo-100 text-indigo-800';
      case PublicationStatus.ACCEPTED:
        return 'bg-green-100 text-green-800';
      case PublicationStatus.PUBLISHED:
        return 'bg-blue-100 text-blue-800';
      case PublicationStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: PublicationType) => {
    switch (type) {
      case PublicationType.JOURNAL_ARTICLE:
        return <BookOpen className="h-4 w-4" />;
      case PublicationType.CONFERENCE_PAPER:
        return <Users className="h-4 w-4" />;
      case PublicationType.BOOK_CHAPTER:
        return <FileText className="h-4 w-4" />;
      case PublicationType.THESIS:
        return <Award className="h-4 w-4" />;
      case PublicationType.REPORT:
        return <FileText className="h-4 w-4" />;
      case PublicationType.POSTER:
        return <Target className="h-4 w-4" />;
      case PublicationType.ABSTRACT:
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impactFactor?: number) => {
    if (!impactFactor) return 'text-gray-600';
    if (impactFactor >= 10) return 'text-red-600'; // Very high impact
    if (impactFactor >= 5) return 'text-orange-600'; // High impact
    if (impactFactor >= 2) return 'text-yellow-600'; // Medium impact
    if (impactFactor >= 1) return 'text-green-600'; // Low-medium impact
    return 'text-gray-600'; // Low impact
  };

  const getDaysFromSubmission = (submissionDate?: Date) => {
    if (!submissionDate) return null;
    const today = new Date();
    const submission = new Date(submissionDate);
    const diffTime = Math.abs(today.getTime() - submission.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredAndSortedPublications = publications
    .filter(publication => {
      const matchesSearch = publication.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           publication.abstract?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           publication.keywords?.some(keyword => 
                             keyword.toLowerCase().includes(searchTerm.toLowerCase())
                           );
      const matchesStatus = statusFilter === 'ALL' || publication.status === statusFilter;
      const matchesType = typeFilter === 'ALL' || publication.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'submissionDate':
          const dateA = a.submissionDate ? new Date(a.submissionDate).getTime() : 0;
          const dateB = b.submissionDate ? new Date(b.submissionDate).getTime() : 0;
          comparison = dateA - dateB;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'impactFactor':
          comparison = (a.impactFactor || 0) - (b.impactFactor || 0);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.title || 'Unknown Project';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading publications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {projectId ? 'Project Publications' : 'All Publications'}
          </h2>
          <p className="text-gray-600">
            {filteredAndSortedPublications.length} publication{filteredAndSortedPublications.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {onPublicationCreate && (
            <Button onClick={onPublicationCreate}>
              <Plus className="h-4 w-4 mr-2" />
              New Publication
            </Button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search publications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="min-w-[200px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PublicationStatus | 'ALL')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Statuses</option>
              {Object.values(PublicationStatus).map(status => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="min-w-[180px]">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as PublicationType | 'ALL')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Types</option>
              {Object.values(PublicationType).map(type => (
                <option key={type} value={type}>
                  {type.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="min-w-[180px]">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as typeof sortBy);
                setSortOrder(order as typeof sortOrder);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="submissionDate-desc">Newest First</option>
              <option value="submissionDate-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="impactFactor-desc">Impact High-Low</option>
              <option value="impactFactor-asc">Impact Low-High</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Publication Grid */}
      {filteredAndSortedPublications.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No publications found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL'
                ? 'Try adjusting your search criteria or filters.'
                : 'Get started by creating your first publication.'
              }
            </p>
            {onPublicationCreate && (
              <Button onClick={onPublicationCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Create Publication
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedPublications.map((publication) => (
            <Card key={publication.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(publication.type)}
                  <Badge className="bg-blue-100 text-blue-800">
                    {publication.type.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(publication.status)}
                  <div className="relative">
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {publication.title}
              </h3>

              {/* Project */}
              {!projectId && (
                <p className="text-sm text-gray-600 mb-2 truncate">
                  {getProjectName(publication.projectId)}
                </p>
              )}

              {/* Status and Timeline */}
              <div className="flex justify-between items-center mb-3">
                <Badge className={getStatusColor(publication.status)}>
                  {publication.status.replace('_', ' ')}
                </Badge>
                {publication.submissionDate && (
                  <span className="text-xs text-gray-500">
                    {getDaysFromSubmission(publication.submissionDate)} days ago
                  </span>
                )}
              </div>

              {/* Abstract */}
              {publication.abstract && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {publication.abstract}
                </p>
              )}

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className={`text-lg font-semibold ${getImpactColor(publication.impactFactor)}`}>
                    {publication.impactFactor ? publication.impactFactor.toFixed(2) : 'N/A'}
                  </div>
                  <div className="text-xs text-gray-600">Impact Factor</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">
                    {publication.citations || 0}
                  </div>
                  <div className="text-xs text-gray-600">Citations</div>
                </div>
              </div>

              {/* Authors */}
              {publication.authors && publication.authors.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      Authors
                    </span>
                    <span className="text-xs text-gray-500">
                      {publication.authors.length} author{publication.authors.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {publication.authors.slice(0, 3).map(author => author.name).join(', ')}
                    {publication.authors.length > 3 && ` +${publication.authors.length - 3} more`}
                  </div>
                </div>
              )}

              {/* Journal/Conference */}
              {publication.journal && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Journal</span>
                    <Globe className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-blue-900 truncate">
                    {publication.journal}
                  </p>
                </div>
              )}

              {/* Keywords */}
              {publication.keywords && publication.keywords.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {publication.keywords.slice(0, 3).map((keyword, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                    {publication.keywords.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{publication.keywords.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onPublicationSelect?.(publication)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onPublicationEdit?.(publication)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-3 w-3" />
                </Button>
              </div>

              {/* Progress Indicator */}
              {publication.status !== PublicationStatus.PUBLISHED && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>
                      {publication.status === PublicationStatus.DRAFT ? '10%' :
                       publication.status === PublicationStatus.WRITING ? '30%' :
                       publication.status === PublicationStatus.REVIEW ? '50%' :
                       publication.status === PublicationStatus.REVISION ? '60%' :
                       publication.status === PublicationStatus.SUBMITTED ? '75%' :
                       publication.status === PublicationStatus.UNDER_REVIEW ? '85%' :
                       publication.status === PublicationStatus.ACCEPTED ? '95%' : '0%'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${
                          publication.status === PublicationStatus.DRAFT ? '10%' :
                          publication.status === PublicationStatus.WRITING ? '30%' :
                          publication.status === PublicationStatus.REVIEW ? '50%' :
                          publication.status === PublicationStatus.REVISION ? '60%' :
                          publication.status === PublicationStatus.SUBMITTED ? '75%' :
                          publication.status === PublicationStatus.UNDER_REVIEW ? '85%' :
                          publication.status === PublicationStatus.ACCEPTED ? '95%' : '0%'
                        }` 
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicationList; 