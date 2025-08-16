import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  FileText, 
  BarChart3, 
  Users, 
  Calendar, 
  TrendingUp, 
  Search,
  Plus,
  Filter,
  Download,
  Settings,
  AlertCircle,
  Clock,
  DollarSign,
  Award,
  Brain,
  Microscope,
  BookOpen,
  Send,
  Target,
  Activity,
  Package
} from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { 
  ResearchDashboardData, 
  ResearchProject, 
  ExperimentInstance, 
  ResearchDocument,
  PublicationSubmission,
  ProjectStatus,
  ExperimentStatus,
  DocumentStatus,
  SubmissionStatus,
  AlertSeverity,
  MilestoneStatus
} from '../types/researchTypes';
import { researchApi } from '../services/researchApi';

interface TabInfo {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
  badge?: string;
  color: string;
}

const ResearchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<ResearchDashboardData | null>(null);
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [experiments, setExperiments] = useState<ExperimentInstance[]>([]);
  const [documents, setDocuments] = useState<ResearchDocument[]>([]);
  const [submissions, setSubmissions] = useState<PublicationSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const tabs: TabInfo[] = [
    {
      id: 'dashboard',
      label: 'Research Dashboard',
      icon: BarChart3,
      description: 'Overview of research activities and performance metrics',
      color: 'blue'
    },
    {
      id: 'projects',
      label: 'Project Management',
      icon: Target,
      description: 'Research project planning and tracking',
      badge: 'ACTIVE',
      color: 'green'
    },
    {
      id: 'experiments',
      label: 'Experiment Tracking',
      icon: Microscope,
      description: 'Experiment design, execution, and data collection',
      badge: 'NEW',
      color: 'purple'
    },
    {
      id: 'publications',
      label: 'Publication Management',
      icon: BookOpen,
      description: 'Research writing and publication tracking',
      color: 'orange'
    },
    {
      id: 'analytics',
      label: 'Research Analytics',
      icon: TrendingUp,
      description: 'Advanced analytics and performance insights',
      badge: 'AI',
      color: 'indigo'
    },
    {
      id: 'collaboration',
      label: 'Team Collaboration',
      icon: Users,
      description: 'Research team management and collaboration tools',
      color: 'pink'
    },
    {
      id: 'integration',
      label: 'System Integration',
      icon: Activity,
      description: 'Integration with lab, inventory, and finance modules',
      badge: 'BETA',
      color: 'teal'
    }
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, projectsResponse, experimentsResponse, documentsResponse, submissionsResponse] = await Promise.all([
        researchApi.getDashboardData(),
        researchApi.getProjects(),
        researchApi.getExperiments(),
        researchApi.getDocuments(),
        researchApi.getSubmissions()
      ]);

      if (dashboardResponse.success) setDashboardData(dashboardResponse.data);
      if (projectsResponse.success) setProjects(projectsResponse.data);
      if (experimentsResponse.success) setExperiments(experimentsResponse.data);
      if (documentsResponse.success) setDocuments(documentsResponse.data);
      if (submissionsResponse.success) setSubmissions(submissionsResponse.data);
    } catch (error) {
      console.error('Error loading research data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string, type: 'project' | 'experiment' | 'document' | 'submission') => {
    const colorMaps = {
      project: {
        [ProjectStatus.ACTIVE]: 'bg-green-100 text-green-800',
        [ProjectStatus.PLANNING]: 'bg-blue-100 text-blue-800',
        [ProjectStatus.COMPLETED]: 'bg-purple-100 text-purple-800',
        [ProjectStatus.ON_HOLD]: 'bg-yellow-100 text-yellow-800',
        [ProjectStatus.CANCELLED]: 'bg-red-100 text-red-800',
        [ProjectStatus.ARCHIVED]: 'bg-gray-100 text-gray-800'
      },
      experiment: {
        [ExperimentStatus.ACTIVE]: 'bg-green-100 text-green-800',
        [ExperimentStatus.PLANNING]: 'bg-blue-100 text-blue-800',
        [ExperimentStatus.COMPLETED]: 'bg-purple-100 text-purple-800',
        [ExperimentStatus.DATA_COLLECTION]: 'bg-orange-100 text-orange-800',
        [ExperimentStatus.DATA_ANALYSIS]: 'bg-indigo-100 text-indigo-800',
        [ExperimentStatus.PAUSED]: 'bg-yellow-100 text-yellow-800',
        [ExperimentStatus.TERMINATED]: 'bg-red-100 text-red-800'
      },
      document: {
        [DocumentStatus.DRAFT]: 'bg-gray-100 text-gray-800',
        [DocumentStatus.IN_REVIEW]: 'bg-blue-100 text-blue-800',
        [DocumentStatus.APPROVED]: 'bg-green-100 text-green-800',
        [DocumentStatus.SUBMITTED]: 'bg-orange-100 text-orange-800',
        [DocumentStatus.UNDER_PEER_REVIEW]: 'bg-yellow-100 text-yellow-800',
        [DocumentStatus.ACCEPTED]: 'bg-emerald-100 text-emerald-800',
        [DocumentStatus.PUBLISHED]: 'bg-purple-100 text-purple-800',
        [DocumentStatus.REJECTED]: 'bg-red-100 text-red-800'
      },
      submission: {
        [SubmissionStatus.PREPARING]: 'bg-gray-100 text-gray-800',
        [SubmissionStatus.SUBMITTED]: 'bg-blue-100 text-blue-800',
        [SubmissionStatus.UNDER_REVIEW]: 'bg-yellow-100 text-yellow-800',
        [SubmissionStatus.ACCEPTED]: 'bg-green-100 text-green-800',
        [SubmissionStatus.PUBLISHED]: 'bg-purple-100 text-purple-800',
        [SubmissionStatus.REJECTED]: 'bg-red-100 text-red-800'
      }
    };
    return colorMaps[type][status] || 'bg-gray-100 text-gray-800';
  };

  const renderDashboard = () => {
    if (!dashboardData) return <div>Loading dashboard...</div>;

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-3xl font-bold text-green-600">{dashboardData.summary.activeProjects}</p>
                <p className="text-sm text-gray-500">of {dashboardData.summary.totalProjects} total</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Experiments</p>
                <p className="text-3xl font-bold text-blue-600">{dashboardData.summary.activeExperiments}</p>
                <p className="text-sm text-gray-500">of {dashboardData.summary.totalExperiments} total</p>
              </div>
              <Microscope className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published Papers</p>
                <p className="text-3xl font-bold text-purple-600">{dashboardData.summary.publishedPapers}</p>
                <p className="text-sm text-gray-500">of {dashboardData.summary.totalPublications} total</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Utilized</p>
                <p className="text-3xl font-bold text-orange-600">
                  {((dashboardData.summary.budgetUtilized / dashboardData.summary.totalBudget) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">${dashboardData.summary.budgetUtilized.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-indigo-600" />
              Performance Metrics
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Overall Efficiency', value: dashboardData.performanceMetrics.overallEfficiency, color: 'bg-blue-500' },
                { label: 'Quality Score', value: dashboardData.performanceMetrics.qualityScore, color: 'bg-green-500' },
                { label: 'Innovation Index', value: dashboardData.performanceMetrics.innovationIndex, color: 'bg-purple-500' },
                { label: 'Impact Score', value: dashboardData.performanceMetrics.impactScore, color: 'bg-orange-500' },
                { label: 'Collaboration Score', value: dashboardData.performanceMetrics.collaborationScore, color: 'bg-pink-500' }
              ].map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${metric.color}`} 
                        style={{ width: `${metric.value}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{metric.value.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-600" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {dashboardData.recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.priority === 'HIGH' ? 'bg-red-100 text-red-600' :
                    activity.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.actorName} • {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Upcoming Deadlines */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-orange-600" />
            Upcoming Deadlines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.upcomingDeadlines.map((deadline) => (
              <div key={deadline.id} className="p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">{deadline.title}</h4>
                  <Badge variant={deadline.priority === 'HIGH' ? 'destructive' : deadline.priority === 'MEDIUM' ? 'warning' : 'secondary'}>
                    {deadline.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{deadline.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Due: {new Date(deadline.deadline).toLocaleDateString()}</span>
                  <span>{deadline.assignedTo}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Alerts */}
        {dashboardData.alerts.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
              Active Alerts
            </h3>
            <div className="space-y-3">
              {dashboardData.alerts.filter(alert => !alert.dismissed).map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === AlertSeverity.CRITICAL ? 'bg-red-50 border-red-500' :
                  alert.severity === AlertSeverity.WARNING ? 'bg-yellow-50 border-yellow-500' :
                  alert.severity === AlertSeverity.ERROR ? 'bg-orange-50 border-orange-500' :
                  'bg-blue-50 border-blue-500'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{alert.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={
                      alert.severity === AlertSeverity.CRITICAL ? 'destructive' :
                      alert.severity === AlertSeverity.WARNING ? 'warning' :
                      'secondary'
                    }>
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  };

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Research Projects</h2>
          <p className="text-gray-600">Manage and track research project lifecycle</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{project.title}</h3>
                <Badge className={getStatusColor(project.status, 'project')}>
                  {project.status}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">PI:</span>
                  <span className="font-medium text-gray-900">{project.principalInvestigatorName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Budget:</span>
                  <span className="font-medium text-gray-900">${project.budgetAllocated.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Utilized:</span>
                  <span className="font-medium text-gray-900">
                    {((project.budgetSpent / project.budgetAllocated) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="text-gray-700">
                    {project.milestones.filter(m => m.status === MilestoneStatus.COMPLETED).length} / {project.milestones.length} milestones
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ 
                      width: `${(project.milestones.filter(m => m.status === MilestoneStatus.COMPLETED).length / project.milestones.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Started: {new Date(project.startDate).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">View</Button>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderExperiments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Experiment Tracking</h2>
          <p className="text-gray-600">Design, execute, and monitor research experiments</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Experiment
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experiment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quality Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {experiments.map((experiment) => (
                <tr key={experiment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{experiment.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{experiment.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {projects.find(p => p.id === experiment.projectId)?.title || 'Unknown Project'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusColor(experiment.status, 'experiment')}>
                      {experiment.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${experiment.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{experiment.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-gray-900">{experiment.qualityScore}/100</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button variant="outline" size="sm">View</Button>
                    <Button variant="outline" size="sm">Data</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderPublications = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Publication Management</h2>
          <p className="text-gray-600">Research writing, review, and publication tracking</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Documents
          </h3>
          <div className="space-y-4">
            {documents.map((document) => (
              <div key={document.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">{document.title}</h4>
                  <Badge className={getStatusColor(document.status, 'document')}>
                    {document.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{document.abstract}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{document.authors.length} authors</span>
                  <span className="text-gray-500">{document.wordCount.toLocaleString()} words</span>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">
                    Updated: {new Date(document.updatedAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Review</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Send className="h-5 w-5 mr-2 text-green-600" />
            Submissions
          </h3>
          <div className="space-y-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">{submission.manuscriptId}</h4>
                  <Badge className={getStatusColor(submission.status, 'submission')}>
                    {submission.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {documents.find(d => d.id === submission.documentId)?.title || 'Unknown Document'}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Journal:</span>
                    <span className="text-gray-900">{submission.journalId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Submitted:</span>
                    <span className="text-gray-900">{new Date(submission.submissionDate).toLocaleDateString()}</span>
                  </div>
                  {submission.peerReviewProcess.currentRound > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Review Round:</span>
                      <span className="text-gray-900">{submission.peerReviewProcess.currentRound}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">
                    {submission.timeline.length} events
                  </span>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Research Analytics</h2>
          <p className="text-gray-600">Advanced insights and performance analysis</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-green-600" />
            Project Metrics
          </h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{projects.length}</div>
              <div className="text-sm text-gray-500">Total Projects</div>
            </div>
            <div className="space-y-2">
              {Object.entries(
                projects.reduce((acc, project) => {
                  acc[project.status] = (acc[project.status] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([status, count]) => (
                <div key={status} className="flex justify-between text-sm">
                  <span className="text-gray-600">{status.replace('_', ' ')}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Microscope className="h-5 w-5 mr-2 text-blue-600" />
            Experiment Metrics
          </h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{experiments.length}</div>
              <div className="text-sm text-gray-500">Total Experiments</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg. Quality Score</span>
                <span className="font-medium">
                  {experiments.length > 0 ? 
                    (experiments.reduce((sum, exp) => sum + exp.qualityScore, 0) / experiments.length).toFixed(1) : 
                    '0'
                  }
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg. Completion</span>
                <span className="font-medium">
                  {experiments.length > 0 ? 
                    (experiments.reduce((sum, exp) => sum + exp.completionRate, 0) / experiments.length).toFixed(1) : 
                    '0'
                  }%
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-purple-600" />
            Publication Metrics
          </h3>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{documents.length}</div>
              <div className="text-sm text-gray-500">Total Documents</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Published</span>
                <span className="font-medium">
                  {documents.filter(d => d.status === DocumentStatus.PUBLISHED).length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Under Review</span>
                <span className="font-medium">
                  {documents.filter(d => d.status === DocumentStatus.UNDER_PEER_REVIEW).length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">In Progress</span>
                <span className="font-medium">
                  {documents.filter(d => [DocumentStatus.DRAFT, DocumentStatus.IN_REVIEW].includes(d.status)).length}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderCollaboration = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Collaboration</h2>
          <p className="text-gray-600">Research team management and collaboration tools</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      <Card className="p-6">
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Team Collaboration Features</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Comprehensive team management, role assignments, communication tools, and collaborative workflows coming soon.
          </p>
          <Badge variant="secondary">COMING SOON</Badge>
        </div>
      </Card>
    </div>
  );

  const renderIntegration = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Integration</h2>
          <p className="text-gray-600">Integration with laboratory, inventory, and finance modules</p>
        </div>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Configure Integrations
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Laboratory Module', status: 'Connected', icon: FlaskConical, color: 'green' },
          { name: 'Inventory Management', status: 'Connected', icon: Package, color: 'green' },
          { name: 'Finance Module', status: 'Connected', icon: DollarSign, color: 'green' },
          { name: 'Animal Management', status: 'Pending', icon: Activity, color: 'yellow' },
          { name: 'Genomic Intelligence', status: 'Pending', icon: Brain, color: 'yellow' },
          { name: 'Sample Management', status: 'Disconnected', icon: FlaskConical, color: 'red' }
        ].map((integration, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <integration.icon className={`h-8 w-8 ${
                integration.color === 'green' ? 'text-green-600' :
                integration.color === 'yellow' ? 'text-yellow-600' :
                'text-red-600'
              }`} />
              <Badge variant={
                integration.status === 'Connected' ? 'default' :
                integration.status === 'Pending' ? 'secondary' :
                'destructive'
              }>
                {integration.status}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{integration.name}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {integration.status === 'Connected' ? 'Real-time data synchronization active' :
               integration.status === 'Pending' ? 'Integration setup in progress' :
               'Integration not configured'}
            </p>
            <Button variant="outline" size="sm" className="w-full">
              {integration.status === 'Connected' ? 'Configure' : 'Setup Integration'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'projects':
        return renderProjects();
      case 'experiments':
        return renderExperiments();
      case 'publications':
        return renderPublications();
      case 'analytics':
        return renderAnalytics();
      case 'collaboration':
        return renderCollaboration();
      case 'integration':
        return renderIntegration();
      default:
        return renderDashboard();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading research data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <FlaskConical className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Research & Studies Management</h1>
                  <p className="text-gray-600">Comprehensive research lifecycle management platform</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search research data..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? `border-${tab.color}-500 text-${tab.color}-600`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <Badge variant="secondary" className="ml-2">
                    {tab.badge}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ResearchPage; 