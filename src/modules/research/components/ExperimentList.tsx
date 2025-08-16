import React, { useState, useEffect } from 'react';
import { 
  Microscope, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  User,
  Target,
  TrendingUp,
  FileText,
  Edit,
  Eye,
  MoreHorizontal,
  Filter,
  Search,
  Download,
  Plus
} from 'lucide-react';
import { Badge } from './components/ui/Badge';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { 
  ExperimentInstance, 
  ResearchProject,
  ExperimentStatus, 
  CompletionStatus 
} from '../types/researchTypes';
import { researchApi } from '../services/researchApi';

interface ExperimentListProps {
  projectId?: string;
  onExperimentSelect?: (experiment: ExperimentInstance) => void;
  onExperimentEdit?: (experiment: ExperimentInstance) => void;
  onExperimentCreate?: () => void;
}

export const ExperimentList: React.FC<ExperimentListProps> = ({
  projectId,
  onExperimentSelect,
  onExperimentEdit,
  onExperimentCreate
}) => {
  const [experiments, setExperiments] = useState<ExperimentInstance[]>([]);
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ExperimentStatus | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'title' | 'startDate' | 'status' | 'completionRate'>('startDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [experimentsResponse, projectsResponse] = await Promise.all([
        researchApi.getExperiments(projectId),
        researchApi.getProjects()
      ]);

      if (experimentsResponse.success) {
        setExperiments(experimentsResponse.data);
      }
      if (projectsResponse.success) {
        setProjects(projectsResponse.data);
      }
    } catch (error) {
      console.error('Error loading experiments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: ExperimentStatus) => {
    switch (status) {
      case ExperimentStatus.ACTIVE:
        return <Play className="h-4 w-4 text-green-600" />;
      case ExperimentStatus.PAUSED:
        return <Pause className="h-4 w-4 text-yellow-600" />;
      case ExperimentStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case ExperimentStatus.TERMINATED:
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case ExperimentStatus.PLANNING:
        return <Target className="h-4 w-4 text-gray-600" />;
      default:
        return <Microscope className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: ExperimentStatus) => {
    switch (status) {
      case ExperimentStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case ExperimentStatus.PLANNING:
        return 'bg-blue-100 text-blue-800';
      case ExperimentStatus.COMPLETED:
        return 'bg-purple-100 text-purple-800';
      case ExperimentStatus.DATA_COLLECTION:
        return 'bg-orange-100 text-orange-800';
      case ExperimentStatus.DATA_ANALYSIS:
        return 'bg-indigo-100 text-indigo-800';
      case ExperimentStatus.PAUSED:
        return 'bg-yellow-100 text-yellow-800';
      case ExperimentStatus.TERMINATED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (completionRate: number) => {
    if (completionRate >= 90) return 'bg-green-500';
    if (completionRate >= 70) return 'bg-blue-500';
    if (completionRate >= 50) return 'bg-yellow-500';
    if (completionRate >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getQualityColor = (qualityScore: number) => {
    if (qualityScore >= 90) return 'text-green-600';
    if (qualityScore >= 80) return 'text-blue-600';
    if (qualityScore >= 70) return 'text-yellow-600';
    if (qualityScore >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const filteredAndSortedExperiments = experiments
    .filter(experiment => {
      const matchesSearch = experiment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           experiment.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || experiment.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'startDate':
          comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'completionRate':
          comparison = a.completionRate - b.completionRate;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.title || 'Unknown Project';
  };

  const getDaysFromStart = (startDate: Date) => {
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = Math.abs(today.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading experiments...</p>
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
            {projectId ? 'Project Experiments' : 'All Experiments'}
          </h2>
          <p className="text-gray-600">
            {filteredAndSortedExperiments.length} experiment{filteredAndSortedExperiments.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {onExperimentCreate && (
            <Button onClick={onExperimentCreate}>
              <Plus className="h-4 w-4 mr-2" />
              New Experiment
            </Button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search experiments..."
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
              onChange={(e) => setStatusFilter(e.target.value as ExperimentStatus | 'ALL')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Statuses</option>
              {Object.values(ExperimentStatus).map(status => (
                <option key={status} value={status}>
                  {status.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="min-w-[150px]">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as typeof sortBy);
                setSortOrder(order as typeof sortOrder);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="startDate-desc">Newest First</option>
              <option value="startDate-asc">Oldest First</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
              <option value="completionRate-desc">Progress High-Low</option>
              <option value="completionRate-asc">Progress Low-High</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Experiment Grid */}
      {filteredAndSortedExperiments.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Microscope className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No experiments found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'ALL' 
                ? 'Try adjusting your search criteria or filters.'
                : 'Get started by creating your first experiment.'
              }
            </p>
            {onExperimentCreate && (
              <Button onClick={onExperimentCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Create Experiment
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedExperiments.map((experiment) => (
            <Card key={experiment.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                    {experiment.title}
                  </h3>
                  {!projectId && (
                    <p className="text-sm text-gray-600 truncate">
                      {getProjectName(experiment.projectId)}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-3">
                  {getStatusIcon(experiment.status)}
                  <div className="relative">
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Status and Progress */}
              <div className="flex justify-between items-center mb-4">
                <Badge className={getStatusColor(experiment.status)}>
                  {experiment.status.replace('_', ' ')}
                </Badge>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {experiment.completionRate}% Complete
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full ${getProgressColor(experiment.completionRate)}`}
                      style={{ width: `${experiment.completionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {experiment.description}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">
                    {experiment.dataIntegrityScore}
                  </div>
                  <div className="text-xs text-gray-600">Data Integrity</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className={`text-lg font-semibold ${getQualityColor(experiment.qualityScore)}`}>
                    {experiment.qualityScore}
                  </div>
                  <div className="text-xs text-gray-600">Quality Score</div>
                </div>
              </div>

              {/* Timeline Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Started
                  </span>
                  <span className="text-gray-900">
                    {new Date(experiment.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Duration</span>
                  <span className="text-gray-900">
                    {getDaysFromStart(experiment.startDate)} days
                  </span>
                </div>
                {experiment.assignedPersonnel.length > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      Lead
                    </span>
                    <span className="text-gray-900 truncate max-w-[120px]">
                      {experiment.assignedPersonnel[0].name}
                    </span>
                  </div>
                )}
              </div>

              {/* Cost Tracking */}
              {experiment.costTracking && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Budget Used</span>
                    <span className="text-sm font-semibold text-blue-900">
                      ${experiment.costTracking.actualCost.toLocaleString()} / 
                      ${experiment.costTracking.budgetAllocated.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ 
                        width: `${Math.min((experiment.costTracking.actualCost / experiment.costTracking.budgetAllocated) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onExperimentSelect?.(experiment)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onExperimentEdit?.(experiment)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-3 w-3" />
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{experiment.dataCollectionSessions?.length || 0} sessions</span>
                  <span>{experiment.researchSubjects?.length || 0} subjects</span>
                  <span>{experiment.deviations?.length || 0} deviations</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperimentList; 