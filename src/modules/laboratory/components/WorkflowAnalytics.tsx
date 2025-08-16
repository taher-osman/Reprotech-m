import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Target,
  Zap,
  Activity,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  PieChart,
  LineChart,
  Settings,
  Eye,
  ArrowUp,
  ArrowDown,
  Minus,
  Award,
  Timer,
  TestTube,
  Beaker,
  Microscope,
  FileText
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
  startTime?: string;
  endTime?: string;
  assignedTo?: string;
  notes?: string;
  attachments?: string[];
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowName: string;
  sampleId: string;
  testId: string;
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  currentStep: string;
  startTime: string;
  estimatedCompletion: string;
  actualCompletion?: string;
  assignedTechnician: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  customer: string;
  testType: string;
  delayReason?: string;
  notes?: string;
  steps: WorkflowStep[];
}

interface WorkflowStats {
  totalWorkflows: number;
  activeExecutions: number;
  completedToday: number;
  delayedExecutions: number;
  averageCompletionTime: number;
  onTimeDelivery: number;
  qualityIssues: number;
  resourceUtilization: number;
}

interface WorkflowAnalyticsProps {
  executions: WorkflowExecution[];
  stats: WorkflowStats;
}

interface PerformanceMetric {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  color: string;
}

interface BottleneckAnalysis {
  stepName: string;
  stepType: string;
  averageTime: number;
  expectedTime: number;
  delay: number;
  occurrences: number;
  impact: 'high' | 'medium' | 'low';
}

export const WorkflowAnalytics: React.FC<WorkflowAnalyticsProps> = ({
  executions,
  stats
}) => {
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'quarter'>('week');
  const [selectedMetric, setSelectedMetric] = useState<string>('completion-time');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('all');
  const [showBottlenecks, setShowBottlenecks] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock analytics data
  const [performanceMetrics] = useState<PerformanceMetric[]>([
    {
      label: 'Avg. Completion Time',
      value: 42.5,
      unit: 'minutes',
      trend: 'down',
      trendValue: 8.2,
      color: 'blue'
    },
    {
      label: 'On-Time Delivery',
      value: 94.8,
      unit: '%',
      trend: 'up',
      trendValue: 2.1,
      color: 'green'
    },
    {
      label: 'Throughput',
      value: 156,
      unit: 'tests/day',
      trend: 'up',
      trendValue: 12.5,
      color: 'purple'
    },
    {
      label: 'Quality Score',
      value: 98.2,
      unit: '%',
      trend: 'stable',
      trendValue: 0.3,
      color: 'emerald'
    },
    {
      label: 'Resource Utilization',
      value: 78.5,
      unit: '%',
      trend: 'up',
      trendValue: 5.4,
      color: 'orange'
    },
    {
      label: 'Error Rate',
      value: 1.8,
      unit: '%',
      trend: 'down',
      trendValue: 0.7,
      color: 'red'
    }
  ]);

  const [bottlenecks] = useState<BottleneckAnalysis[]>([
    {
      stepName: 'Sample Processing',
      stepType: 'preparation',
      averageTime: 18.5,
      expectedTime: 12.0,
      delay: 6.5,
      occurrences: 47,
      impact: 'high'
    },
    {
      stepName: 'Result Review',
      stepType: 'review',
      averageTime: 15.2,
      expectedTime: 10.0,
      delay: 5.2,
      occurrences: 32,
      impact: 'medium'
    },
    {
      stepName: 'QC Verification',
      stepType: 'qc',
      averageTime: 8.8,
      expectedTime: 5.0,
      delay: 3.8,
      occurrences: 28,
      impact: 'medium'
    },
    {
      stepName: 'Equipment Calibration',
      stepType: 'preparation',
      averageTime: 22.1,
      expectedTime: 18.0,
      delay: 4.1,
      occurrences: 15,
      impact: 'low'
    }
  ]);

  const [workflowPerformance] = useState([
    {
      name: 'Complete Blood Count',
      completedTests: 89,
      avgTime: 38.2,
      onTimeRate: 96.6,
      errorRate: 1.1,
      efficiency: 94.5
    },
    {
      name: 'COVID-19 RT-PCR',
      completedTests: 67,
      avgTime: 235.5,
      onTimeRate: 91.0,
      errorRate: 2.9,
      efficiency: 88.2
    },
    {
      name: 'Metabolic Panel',
      completedTests: 124,
      avgTime: 42.8,
      onTimeRate: 97.6,
      errorRate: 0.8,
      efficiency: 96.1
    },
    {
      name: 'Urinalysis',
      completedTests: 156,
      avgTime: 18.5,
      onTimeRate: 98.7,
      errorRate: 0.3,
      efficiency: 98.2
    }
  ]);

  const [technicianPerformance] = useState([
    {
      name: 'John Smith',
      completedTasks: 145,
      avgTime: 35.2,
      accuracy: 98.9,
      productivity: 95.4,
      specialization: 'Hematology'
    },
    {
      name: 'Jane Doe',
      completedTasks: 189,
      avgTime: 28.7,
      accuracy: 99.4,
      productivity: 97.8,
      specialization: 'Molecular'
    },
    {
      name: 'Mike Wilson',
      completedTasks: 167,
      avgTime: 32.1,
      accuracy: 97.8,
      productivity: 92.3,
      specialization: 'Chemistry'
    },
    {
      name: 'Sarah Johnson',
      completedTasks: 201,
      avgTime: 30.5,
      accuracy: 99.1,
      productivity: 96.7,
      specialization: 'General'
    }
  ]);

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'collection': return <TestTube className="w-4 h-4" />;
      case 'preparation': return <Beaker className="w-4 h-4" />;
      case 'analysis': return <Microscope className="w-4 h-4" />;
      case 'qc': return <CheckCircle className="w-4 h-4" />;
      case 'review': return <Eye className="w-4 h-4" />;
      case 'reporting': return <FileText className="w-4 h-4" />;
      case 'approval': return <CheckCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4" />;
      case 'down': return <ArrowDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trend: string, isPositive: boolean = true) => {
    if (trend === 'stable') return 'text-gray-500';
    if ((trend === 'up' && isPositive) || (trend === 'down' && !isPositive)) {
      return 'text-green-600';
    }
    return 'text-red-600';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderPerformanceMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {performanceMetrics.map((metric, index) => (
        <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">{metric.label}</h3>
            <div className={`p-2 rounded-lg bg-${metric.color}-100`}>
              <BarChart3 className={`w-5 h-5 text-${metric.color}-600`} />
            </div>
          </div>
          
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {metric.value}
                <span className="text-sm font-normal text-gray-500 ml-1">{metric.unit}</span>
              </div>
            </div>
            
            <div className={`flex items-center space-x-1 ${getTrendColor(metric.trend, !metric.label.includes('Error'))}`}>
              {getTrendIcon(metric.trend)}
              <span className="text-sm font-medium">
                {metric.trendValue}%
              </span>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="text-xs text-gray-500">
              vs. previous {timeRange}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderBottleneckAnalysis = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Bottleneck Analysis</h3>
            <p className="text-sm text-gray-600">Steps causing the most delays</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="text-sm text-gray-600 hover:text-gray-800">
            View Details
          </button>
          <button
            onClick={() => setShowBottlenecks(!showBottlenecks)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showBottlenecks && (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Step
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg. Time
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expected
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delay
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Occurrences
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impact
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bottlenecks.map((bottleneck, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      {getStepIcon(bottleneck.stepType)}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {bottleneck.stepName}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {bottleneck.stepType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {bottleneck.averageTime.toFixed(1)}m
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {bottleneck.expectedTime.toFixed(1)}m
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-red-600">
                        +{bottleneck.delay.toFixed(1)}m
                      </span>
                      <span className="text-xs text-gray-500">
                        ({((bottleneck.delay / bottleneck.expectedTime) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {bottleneck.occurrences}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getImpactColor(bottleneck.impact)}`}>
                      {bottleneck.impact}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderWorkflowPerformance = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Workflow Performance</h3>
            <p className="text-sm text-gray-600">Performance metrics by workflow type</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Workflow
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Completed
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Avg. Time
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                On-Time Rate
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Error Rate
              </th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Efficiency
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {workflowPerformance.map((workflow, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="text-sm font-medium text-gray-900">{workflow.name}</div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {workflow.completedTests}
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {workflow.avgTime.toFixed(1)}m
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${workflow.onTimeRate}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900">{workflow.onTimeRate}%</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className={`text-sm ${workflow.errorRate < 2 ? 'text-green-600' : workflow.errorRate < 5 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {workflow.errorRate}%
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${workflow.efficiency}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900">{workflow.efficiency}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTechnicianPerformance = () => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Technician Performance</h3>
            <p className="text-sm text-gray-600">Individual performance metrics</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {technicianPerformance.map((tech, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {tech.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{tech.name}</h4>
                  <p className="text-xs text-gray-500">{tech.specialization}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-900">{tech.productivity}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Completed Tasks</div>
                <div className="font-semibold text-gray-900">{tech.completedTasks}</div>
              </div>
              <div>
                <div className="text-gray-500">Avg. Time</div>
                <div className="font-semibold text-gray-900">{tech.avgTime.toFixed(1)}m</div>
              </div>
              <div>
                <div className="text-gray-500">Accuracy</div>
                <div className="font-semibold text-green-600">{tech.accuracy}%</div>
              </div>
              <div>
                <div className="text-gray-500">Productivity</div>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${tech.productivity}%` }}
                    />
                  </div>
                  <span className="font-semibold text-gray-900">{tech.productivity}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-emerald-500 rounded-full">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">📊 Workflow Analytics</h2>
              <p className="text-gray-600">Performance insights and optimization recommendations</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
            
            <select
              value={selectedWorkflow}
              onChange={(e) => setSelectedWorkflow(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Workflows</option>
              <option value="hematology">Hematology</option>
              <option value="chemistry">Chemistry</option>
              <option value="molecular">Molecular</option>
              <option value="microbiology">Microbiology</option>
            </select>
            
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="mr-2 rounded focus:ring-emerald-500"
              />
              Auto-refresh
            </label>
            
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      {renderPerformanceMetrics()}

      {/* Bottleneck Analysis */}
      {renderBottleneckAnalysis()}

      {/* Workflow Performance */}
      {renderWorkflowPerformance()}

      {/* Technician Performance */}
      {renderTechnicianPerformance()}

      {/* Summary Insights */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200 p-6 mt-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Key Insights & Recommendations</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-emerald-800">🎯 Performance Highlights</h4>
            <ul className="space-y-2 text-sm text-emerald-700">
              <li>• On-time delivery improved by 2.1% this week</li>
              <li>• Urinalysis workflow achieving 98.7% on-time rate</li>
              <li>• Jane Doe leading productivity at 97.8%</li>
              <li>• Quality score maintaining above 98%</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-blue-800">🔧 Optimization Opportunities</h4>
            <ul className="space-y-2 text-sm text-blue-700">
              <li>• Sample Processing step causing 6.5min delays</li>
              <li>• Consider additional training for Result Review</li>
              <li>• COVID-19 workflow efficiency at 88.2%</li>
              <li>• Equipment calibration automation recommended</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 