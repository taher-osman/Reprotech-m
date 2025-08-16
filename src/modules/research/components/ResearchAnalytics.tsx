import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  Award, 
  Users, 
  FileText,
  Target,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Microscope,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Badge } from './components/ui/Badge';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { 
  ResearchProject,
  ExperimentInstance,
  Publication,
  PublicationStatus,
  ExperimentStatus,
  ProjectStatus
} from '../types/researchTypes';
import { researchApi } from '../services/researchApi';

interface ResearchAnalyticsProps {
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
  onTimeRangeChange?: (range: 'week' | 'month' | 'quarter' | 'year') => void;
}

interface AnalyticsData {
  projects: ResearchProject[];
  experiments: ExperimentInstance[];
  publications: Publication[];
  metrics: {
    totalProjects: number;
    activeProjects: number;
    totalExperiments: number;
    activeExperiments: number;
    totalPublications: number;
    publishedPapers: number;
    totalBudget: number;
    spentBudget: number;
    averageProjectDuration: number;
    successRate: number;
  };
  trends: {
    projectsThisMonth: number;
    projectsLastMonth: number;
    experimentsThisMonth: number;
    experimentsLastMonth: number;
    publicationsThisMonth: number;
    publicationsLastMonth: number;
  };
  chartData: {
    projectsByStatus: Array<{ name: string; value: number; color: string }>;
    experimentsByStatus: Array<{ name: string; value: number; color: string }>;
    publicationsByStatus: Array<{ name: string; value: number; color: string }>;
    monthlyActivity: Array<{ month: string; projects: number; experiments: number; publications: number }>;
    budgetUtilization: Array<{ project: string; allocated: number; spent: number; remaining: number }>;
  };
}

export const ResearchAnalytics: React.FC<ResearchAnalyticsProps> = ({
  timeRange = 'month',
  onTimeRangeChange
}) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('overview');

  const chartTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'projects', label: 'Projects', icon: Target },
    { id: 'experiments', label: 'Experiments', icon: Microscope },
    { id: 'publications', label: 'Publications', icon: BookOpen },
    { id: 'budget', label: 'Budget', icon: DollarSign }
  ];

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, these would be separate API calls with time range filters
      const [projectsResponse, experimentsResponse, publicationsResponse] = await Promise.all([
        researchApi.getProjects(),
        researchApi.getExperiments(),
        researchApi.getPublications()
      ]);

      if (projectsResponse.success && experimentsResponse.success && publicationsResponse.success) {
        const projects = projectsResponse.data;
        const experiments = experimentsResponse.data;
        const publications = publicationsResponse.data;

        // Calculate metrics
        const metrics = {
          totalProjects: projects.length,
          activeProjects: projects.filter(p => p.status === ProjectStatus.ACTIVE).length,
          totalExperiments: experiments.length,
          activeExperiments: experiments.filter(e => e.status === ExperimentStatus.ACTIVE).length,
          totalPublications: publications.length,
          publishedPapers: publications.filter(p => p.status === PublicationStatus.PUBLISHED).length,
          totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
          spentBudget: projects.reduce((sum, p) => sum + (p.spentBudget || 0), 0),
          averageProjectDuration: 180, // Mock data - calculated from actual durations
          successRate: 85.4 // Mock data - calculated from completed vs total
        };

        // Mock trend data
        const trends = {
          projectsThisMonth: 5,
          projectsLastMonth: 3,
          experimentsThisMonth: 12,
          experimentsLastMonth: 8,
          publicationsThisMonth: 4,
          publicationsLastMonth: 6
        };

        // Generate chart data
        const chartData = {
          projectsByStatus: [
            { name: 'Active', value: metrics.activeProjects, color: '#10B981' },
            { name: 'Planning', value: projects.filter(p => p.status === ProjectStatus.PLANNING).length, color: '#3B82F6' },
            { name: 'Completed', value: projects.filter(p => p.status === ProjectStatus.COMPLETED).length, color: '#8B5CF6' },
            { name: 'On Hold', value: projects.filter(p => p.status === ProjectStatus.ON_HOLD).length, color: '#F59E0B' }
          ],
          experimentsByStatus: [
            { name: 'Active', value: metrics.activeExperiments, color: '#10B981' },
            { name: 'Planning', value: experiments.filter(e => e.status === ExperimentStatus.PLANNING).length, color: '#3B82F6' },
            { name: 'Completed', value: experiments.filter(e => e.status === ExperimentStatus.COMPLETED).length, color: '#8B5CF6' },
            { name: 'Data Collection', value: experiments.filter(e => e.status === ExperimentStatus.DATA_COLLECTION).length, color: '#F59E0B' }
          ],
          publicationsByStatus: [
            { name: 'Published', value: metrics.publishedPapers, color: '#10B981' },
            { name: 'Under Review', value: publications.filter(p => p.status === PublicationStatus.UNDER_REVIEW).length, color: '#3B82F6' },
            { name: 'Writing', value: publications.filter(p => p.status === PublicationStatus.WRITING).length, color: '#F59E0B' },
            { name: 'Draft', value: publications.filter(p => p.status === PublicationStatus.DRAFT).length, color: '#6B7280' }
          ],
          monthlyActivity: [
            { month: 'Jan', projects: 2, experiments: 8, publications: 3 },
            { month: 'Feb', projects: 1, experiments: 6, publications: 2 },
            { month: 'Mar', projects: 3, experiments: 10, publications: 4 },
            { month: 'Apr', projects: 2, experiments: 12, publications: 1 },
            { month: 'May', projects: 4, experiments: 15, publications: 3 },
            { month: 'Jun', projects: 3, experiments: 9, publications: 5 }
          ],
          budgetUtilization: projects.slice(0, 5).map(project => ({
            project: project.title,
            allocated: project.budget || 0,
            spent: project.spentBudget || 0,
            remaining: (project.budget || 0) - (project.spentBudget || 0)
          }))
        };

        setData({
          projects,
          experiments,
          publications,
          metrics,
          trends,
          chartData
        });
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (current < previous) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return <div className="h-4 w-4" />;
  };

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return 'text-green-600';
    if (current < previous) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendPercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const percentage = ((current - previous) / previous) * 100;
    return `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;
  };

  const renderMetricCard = (
    title: string,
    value: number | string,
    icon: React.ElementType,
    trend?: { current: number; previous: number },
    color: string = 'blue'
  ) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              {getTrendIcon(trend.current, trend.previous)}
              <span className={`text-sm ml-1 ${getTrendColor(trend.current, trend.previous)}`}>
                {getTrendPercentage(trend.current, trend.previous)}
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          {React.createElement(icon, { className: `h-6 w-6 text-${color}-600` })}
        </div>
      </div>
    </Card>
  );

  const renderSimpleBarChart = (data: Array<{ name: string; value: number; color: string }>, title: string) => (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-24 bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    backgroundColor: item.color,
                    width: `${Math.max((item.value / Math.max(...data.map(d => d.value))) * 100, 5)}%`
                  }}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-900 w-8 text-right">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderOverviewCharts = () => {
    if (!data) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderSimpleBarChart(data.chartData.projectsByStatus, 'Projects by Status')}
        {renderSimpleBarChart(data.chartData.experimentsByStatus, 'Experiments by Status')}
        {renderSimpleBarChart(data.chartData.publicationsByStatus, 'Publications by Status')}
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Activity</h3>
          <div className="space-y-4">
            {data.chartData.monthlyActivity.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 w-12">{month.month}</span>
                <div className="flex space-x-2 flex-1 max-w-xs">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Projects</span>
                      <span>{month.projects}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(month.projects / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Experiments</span>
                      <span>{month.experiments}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${(month.experiments / 15) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Publications</span>
                      <span>{month.publications}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${(month.publications / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  const renderBudgetAnalysis = () => {
    if (!data) return null;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Utilization</h3>
          <div className="space-y-4">
            {data.chartData.budgetUtilization.map((project, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 truncate max-w-xs" title={project.project}>
                    {project.project}
                  </span>
                  <span className="text-gray-600">
                    ${project.spent.toLocaleString()} / ${project.allocated.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full" 
                    style={{ width: `${Math.min((project.spent / project.allocated) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{((project.spent / project.allocated) * 100).toFixed(1)}% spent</span>
                  <span>${project.remaining.toLocaleString()} remaining</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Total Allocated</span>
              <span className="font-semibold text-gray-900">
                ${data.metrics.totalBudget.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Total Spent</span>
              <span className="font-semibold text-gray-900">
                ${data.metrics.spentBudget.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-600">Remaining</span>
              <span className="font-semibold text-green-600">
                ${(data.metrics.totalBudget - data.metrics.spentBudget).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Utilization Rate</span>
              <span className="font-semibold text-blue-600">
                {((data.metrics.spentBudget / data.metrics.totalBudget) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderChartContent = () => {
    switch (activeChart) {
      case 'overview':
        return renderOverviewCharts();
      case 'budget':
        return renderBudgetAnalysis();
      default:
        return renderOverviewCharts();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load analytics</h3>
        <p className="text-gray-600">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Research Analytics</h2>
          <p className="text-gray-600">Overview of research performance and metrics</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => onTimeRangeChange?.(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="outline" onClick={loadAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderMetricCard(
          'Total Projects',
          data.metrics.totalProjects,
          Target,
          { current: data.trends.projectsThisMonth, previous: data.trends.projectsLastMonth },
          'blue'
        )}
        {renderMetricCard(
          'Active Experiments',
          data.metrics.activeExperiments,
          Microscope,
          { current: data.trends.experimentsThisMonth, previous: data.trends.experimentsLastMonth },
          'green'
        )}
        {renderMetricCard(
          'Published Papers',
          data.metrics.publishedPapers,
          BookOpen,
          { current: data.trends.publicationsThisMonth, previous: data.trends.publicationsLastMonth },
          'purple'
        )}
        {renderMetricCard(
          'Success Rate',
          `${data.metrics.successRate}%`,
          Award,
          undefined,
          'yellow'
        )}
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderMetricCard(
          'Total Budget',
          `$${data.metrics.totalBudget.toLocaleString()}`,
          DollarSign,
          undefined,
          'green'
        )}
        {renderMetricCard(
          'Budget Spent',
          `$${data.metrics.spentBudget.toLocaleString()}`,
          TrendingUp,
          undefined,
          'red'
        )}
        {renderMetricCard(
          'Avg Project Duration',
          `${data.metrics.averageProjectDuration} days`,
          Clock,
          undefined,
          'indigo'
        )}
      </div>

      {/* Chart Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {chartTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveChart(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeChart === tab.id
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

      {/* Chart Content */}
      {renderChartContent()}
    </div>
  );
};

export default ResearchAnalytics; 