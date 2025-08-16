import React, { useState } from 'react';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Settings, 
  Lightbulb,
  Target,
  Clock,
  FlaskConical,
  BarChart3,
  Zap,
  Star
} from 'lucide-react';

interface ProtocolOptimizerProps {
  sessions: any[];
}

interface OptimizationRecommendation {
  id: string;
  type: 'protocol' | 'timing' | 'equipment' | 'technique';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  currentValue: string;
  recommendedValue: string;
  expectedImprovement: string;
  confidence: number;
  affectedMetrics: string[];
}

interface ProtocolComparison {
  name: string;
  version: string;
  avgEmbryos: number;
  successRate: number;
  costEfficiency: number;
  timeEfficiency: number;
  complexity: 'Low' | 'Medium' | 'High';
  recommendations: string[];
}

export const ProtocolOptimizer: React.FC<ProtocolOptimizerProps> = ({ sessions }) => {
  const [selectedProtocol, setSelectedProtocol] = useState<string>('MOET v3.0');
  const [analysisType, setAnalysisType] = useState<'recommendations' | 'comparison' | 'simulation'>('recommendations');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const optimizationRecommendations: OptimizationRecommendation[] = [
    {
      id: '1',
      type: 'protocol',
      priority: 'high',
      title: 'Upgrade to Enhanced MOET v3.1',
      description: 'Analysis of your recent sessions shows that upgrading to MOET v3.1 could significantly improve embryo recovery rates.',
      currentValue: 'MOET v3.0',
      recommendedValue: 'MOET v3.1 with modified superovulation protocol',
      expectedImprovement: '+15% embryo recovery, +8% viability',
      confidence: 92,
      affectedMetrics: ['Embryo Count', 'Quality Score', 'Success Rate']
    },
    {
      id: '2',
      type: 'timing',
      priority: 'high',
      title: 'Optimize Flush Timing',
      description: 'Sessions performed 7-8 days post-estrus show 23% better results than current 6-7 day timing.',
      currentValue: '6-7 days post-estrus',
      recommendedValue: '7-8 days post-estrus',
      expectedImprovement: '+23% embryo recovery',
      confidence: 88,
      affectedMetrics: ['Embryo Count', 'Success Rate']
    },
    {
      id: '3',
      type: 'equipment',
      priority: 'medium',
      title: 'Temperature Control Enhancement',
      description: 'Maintaining flush medium at 38.5°C instead of 37°C shows improved embryo viability in similar operations.',
      currentValue: '37°C flush medium',
      recommendedValue: '38.5°C flush medium with precision controller',
      expectedImprovement: '+12% embryo viability',
      confidence: 76,
      affectedMetrics: ['Quality Score', 'Viability Rate']
    },
    {
      id: '4',
      type: 'technique',
      priority: 'medium',
      title: 'Multi-Pass Flushing Technique',
      description: 'Implementing 3-pass flushing technique could improve recovery rate, especially for difficult cases.',
      currentValue: 'Single-pass flushing',
      recommendedValue: '3-pass flushing with pressure adjustment',
      expectedImprovement: '+18% recovery in difficult cases',
      confidence: 84,
      affectedMetrics: ['Embryo Count', 'Success Rate']
    },
    {
      id: '5',
      type: 'protocol',
      priority: 'low',
      title: 'Hormone Dosage Optimization',
      description: 'FSH dosage could be fine-tuned based on donor body weight and previous response patterns.',
      currentValue: 'Standard FSH dosage',
      recommendedValue: 'Weight-adjusted FSH with response tracking',
      expectedImprovement: '+8% embryo quality',
      confidence: 71,
      affectedMetrics: ['Quality Score', 'Embryo Count']
    }
  ];

  const protocolComparisons: ProtocolComparison[] = [
    {
      name: 'MOET v3.1 Enhanced',
      version: 'v3.1',
      avgEmbryos: 14.2,
      successRate: 94,
      costEfficiency: 88,
      timeEfficiency: 92,
      complexity: 'Medium',
      recommendations: ['Ideal for high-value donors', 'Best overall performance', 'Recommended upgrade']
    },
    {
      name: 'MOET v3.0 Standard',
      version: 'v3.0',
      avgEmbryos: 12.3,
      successRate: 89,
      costEfficiency: 92,
      timeEfficiency: 88,
      complexity: 'Medium',
      recommendations: ['Current protocol', 'Good balance', 'Consider upgrade']
    },
    {
      name: 'MOET v2.1 Legacy',
      version: 'v2.1',
      avgEmbryos: 10.8,
      successRate: 82,
      costEfficiency: 96,
      timeEfficiency: 94,
      complexity: 'Low',
      recommendations: ['Cost-effective', 'Training protocol', 'Phase out recommended']
    },
    {
      name: 'Custom Protocol A',
      version: 'Custom',
      avgEmbryos: 13.1,
      successRate: 91,
      costEfficiency: 85,
      timeEfficiency: 89,
      complexity: 'High',
      recommendations: ['Specialized cases', 'Expert technicians only', 'Good performance']
    }
  ];

  const runOptimizationAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'protocol': return <FlaskConical className="h-5 w-5 text-purple-600" />;
      case 'timing': return <Clock className="h-5 w-5 text-blue-600" />;
      case 'equipment': return <Settings className="h-5 w-5 text-orange-600" />;
      case 'technique': return <Target className="h-5 w-5 text-green-600" />;
      default: return <Lightbulb className="h-5 w-5 text-gray-600" />;
    }
  };

  const renderRecommendations = () => (
    <div className="space-y-4">
      {optimizationRecommendations.map((rec) => (
        <div key={rec.id} className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getTypeIcon(rec.type)}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getPriorityColor(rec.priority)}`}>
                    {getPriorityIcon(rec.priority)}
                    <span>{rec.priority.toUpperCase()}</span>
                  </span>
                  <span className="text-sm text-gray-500">
                    {rec.confidence}% confidence
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="text-sm font-medium text-green-600">{rec.expectedImprovement}</div>
                <div className="text-xs text-gray-500">Expected improvement</div>
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-4">{rec.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm font-medium text-gray-700 mb-1">Current</div>
              <div className="text-gray-900">{rec.currentValue}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-sm font-medium text-blue-700 mb-1">Recommended</div>
              <div className="text-blue-900">{rec.recommendedValue}</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {rec.affectedMetrics.map((metric, index) => (
                <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                  {metric}
                </span>
              ))}
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              Implement
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProtocolComparison = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {protocolComparisons.map((protocol, index) => (
          <div key={index} className={`bg-white rounded-lg border p-6 ${
            protocol.name.includes(selectedProtocol) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{protocol.name}</h3>
                <span className="text-sm text-gray-500">{protocol.version}</span>
              </div>
              {protocol.name.includes('v3.1') && (
                <Star className="h-5 w-5 text-yellow-500" />
              )}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Embryos</span>
                <span className="font-medium">{protocol.avgEmbryos}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="font-medium text-green-600">{protocol.successRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cost Efficiency</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${protocol.costEfficiency}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Time Efficiency</span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${protocol.timeEfficiency}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Complexity</span>
                <span className={`text-sm font-medium ${
                  protocol.complexity === 'Low' ? 'text-green-600' :
                  protocol.complexity === 'Medium' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {protocol.complexity}
                </span>
              </div>
            </div>

            <div className="space-y-1 mb-4">
              {protocol.recommendations.map((rec, idx) => (
                <div key={idx} className="text-xs text-gray-600 flex items-center space-x-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>{rec}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setSelectedProtocol(protocol.name)}
              className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                protocol.name.includes(selectedProtocol)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {protocol.name.includes(selectedProtocol) ? 'Current Protocol' : 'Select Protocol'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSimulation = () => (
    <div className="bg-white rounded-lg border p-6">
      <div className="text-center mb-6">
        <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Simulation Engine</h3>
        <p className="text-gray-600">
          Simulate different protocol combinations to predict outcomes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Simulation Parameters</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Protocol Version
            </label>
            <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
              <option>MOET v3.1 Enhanced</option>
              <option>MOET v3.0 Standard</option>
              <option>Custom Protocol A</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Flush Timing (days post-estrus)
            </label>
            <input 
              type="range" 
              min="6" 
              max="9" 
              defaultValue="7" 
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>6</span>
              <span>7.5</span>
              <span>9</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperature (°C)
            </label>
            <input 
              type="range" 
              min="36" 
              max="40" 
              defaultValue="38" 
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>36°C</span>
              <span>38°C</span>
              <span>40°C</span>
            </div>
          </div>

          <button 
            onClick={runOptimizationAnalysis}
            disabled={isAnalyzing}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isAnalyzing ? 'Analyzing...' : 'Run Simulation'}
          </button>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Predicted Outcomes</h4>
          
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Expected Embryos</span>
                <span className="text-lg font-bold text-blue-600">14.8 ± 2.1</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '74%' }}></div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Success Rate</span>
                <span className="text-lg font-bold text-green-600">91.3%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '91%' }}></div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Quality Score</span>
                <span className="text-lg font-bold text-yellow-600">85.7%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '86%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">AI Insights</span>
            </div>
            <div className="text-xs text-blue-700">
              • Optimal timing appears to be 7.5 days post-estrus
              • Temperature at 38.5°C shows best viability
              • 94% confidence in predictions
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Protocol Optimizer</h2>
            </div>
            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="recommendations">AI Recommendations</option>
              <option value="comparison">Protocol Comparison</option>
              <option value="simulation">Outcome Simulation</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={runOptimizationAnalysis}
              disabled={isAnalyzing}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50"
            >
              <Zap className={`h-4 w-4 ${isAnalyzing ? 'animate-pulse' : ''}`} />
              <span>{isAnalyzing ? 'Analyzing...' : 'Optimize'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {analysisType === 'recommendations' && renderRecommendations()}
      {analysisType === 'comparison' && renderProtocolComparison()}
      {analysisType === 'simulation' && renderSimulation()}

      {/* Summary Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🧠 Optimization Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-medium text-gray-900">Potential Improvement</span>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">+28%</div>
            <div className="text-sm text-gray-600">Overall performance gain</div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-gray-900">Priority Actions</span>
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">3</div>
            <div className="text-sm text-gray-600">High-priority recommendations</div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <span className="font-medium text-gray-900">Confidence Level</span>
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">87%</div>
            <div className="text-sm text-gray-600">Average recommendation confidence</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 