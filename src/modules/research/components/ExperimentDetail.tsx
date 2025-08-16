import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  User, 
  Clock, 
  DollarSign, 
  Microscope,
  FileText,
  BarChart3,
  Shield,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Pause,
  Play,
  Download,
  Edit,
  Share,
  Star,
  Target,
  Zap,
  Settings
} from 'lucide-react';
import { Badge } from './components/ui/Badge';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { 
  ExperimentInstance,
  ResearchProject,
  ExperimentStatus,
  DataCollectionSession,
  ProtocolDeviation,
  AssignedPersonnel
} from '../types/researchTypes';
import { researchApi } from '../services/researchApi';

interface ExperimentDetailProps {
  experimentId: string;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (experiment: ExperimentInstance) => void;
}

export const ExperimentDetail: React.FC<ExperimentDetailProps> = ({
  experimentId,
  isOpen,
  onClose,
  onEdit
}) => {
  const [experiment, setExperiment] = useState<ExperimentInstance | null>(null);
  const [project, setProject] = useState<ResearchProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'data', label: 'Data Collection', icon: BarChart3 },
    { id: 'results', label: 'Results & Analysis', icon: TrendingUp },
    { id: 'audit', label: 'Audit Trail', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  useEffect(() => {
    if (isOpen && experimentId) {
      loadExperimentData();
    }
  }, [isOpen, experimentId]);

  const loadExperimentData = async () => {
    try {
      setLoading(true);
      const response = await researchApi.getExperiment(experimentId);
      
      if (response.success) {
        setExperiment(response.data);
        
        // Load project details
        const projectResponse = await researchApi.getProject(response.data.projectId);
        if (projectResponse.success) {
          setProject(projectResponse.data);
        }
      }
    } catch (error) {
      console.error('Error loading experiment:', error);
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
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
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

  const getDaysFromStart = (startDate: Date) => {
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = Math.abs(today.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const renderOverviewTab = () => {
    if (!experiment) return null;

    return (
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-900">{experiment.completionRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div 
                className={`h-2 rounded-full ${getProgressColor(experiment.completionRate)}`}
                style={{ width: `${experiment.completionRate}%` }}
              ></div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Data Integrity</p>
                <p className="text-2xl font-bold text-gray-900">{experiment.dataIntegrityScore}</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {experiment.dataIntegrityScore >= 95 ? 'Excellent' : 
               experiment.dataIntegrityScore >= 85 ? 'Good' : 
               experiment.dataIntegrityScore >= 75 ? 'Fair' : 'Needs Attention'}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quality Score</p>
                <p className="text-2xl font-bold text-gray-900">{experiment.qualityScore}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {experiment.qualityScore >= 90 ? 'Outstanding' : 
               experiment.qualityScore >= 80 ? 'High' : 
               experiment.qualityScore >= 70 ? 'Medium' : 'Low'}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-2xl font-bold text-gray-900">{getDaysFromStart(experiment.startDate)}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-xs text-gray-500 mt-1">Days running</div>
          </Card>
        </div>

        {/* Experiment Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Experiment Information</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Title</label>
                <p className="text-gray-900">{experiment.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-900 text-sm">{experiment.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Project</label>
                <p className="text-gray-900">{project?.title || 'Loading...'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Protocol ID</label>
                <p className="text-gray-900 font-mono">{experiment.protocolId}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline & Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Status</span>
                <Badge className={getStatusColor(experiment.status)}>
                  <div className="flex items-center">
                    {getStatusIcon(experiment.status)}
                    <span className="ml-1">{experiment.status.replace('_', ' ')}</span>
                  </div>
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Start Date</label>
                <p className="text-gray-900">{new Date(experiment.startDate).toLocaleDateString()}</p>
              </div>
              {experiment.endDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">End Date</label>
                  <p className="text-gray-900">{new Date(experiment.endDate).toLocaleDateString()}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-gray-900">{new Date(experiment.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Personnel */}
        {experiment.assignedPersonnel && experiment.assignedPersonnel.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned Personnel</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {experiment.assignedPersonnel.map((person, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{person.name}</p>
                    <p className="text-xs text-gray-600 truncate">{person.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Notes */}
        {experiment.notes && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{experiment.notes}</p>
          </Card>
        )}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'data':
        return (
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Data Collection</h3>
            <p className="text-gray-600">Data collection interface coming soon</p>
          </div>
        );
      case 'results':
        return (
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Results & Analysis</h3>
            <p className="text-gray-600">Results analysis coming soon</p>
          </div>
        );
      case 'audit':
        return (
          <div className="text-center py-12">
            <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Audit Trail</h3>
            <p className="text-gray-600">Audit trail interface coming soon</p>
          </div>
        );
      case 'settings':
        return (
          <div className="text-center py-12">
            <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600">Settings interface coming soon</p>
          </div>
        );
      default:
        return renderOverviewTab();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            ) : experiment ? (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 truncate">
                  {experiment.title}
                </h2>
                <div className="flex items-center mt-1 space-x-4">
                  <span className="text-gray-600">ID: {experiment.id}</span>
                  <Badge className={getStatusColor(experiment.status)}>
                    <div className="flex items-center">
                      {getStatusIcon(experiment.status)}
                      <span className="ml-1">{experiment.status.replace('_', ' ')}</span>
                    </div>
                  </Badge>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Experiment Not Found</h2>
                <p className="text-gray-600 mt-1">Unable to load experiment details</p>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3 ml-4">
            {experiment && onEdit && (
              <Button variant="outline" onClick={() => onEdit(experiment)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            <Button variant="ghost" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
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

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[65vh]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading experiment details...</p>
              </div>
            </div>
          ) : (
            renderTabContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperimentDetail; 