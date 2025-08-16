import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Shield, 
  TrendingDown,
  BarChart3,
  Settings,
  Play,
  RefreshCw,
  Download,
  Eye,
  Heart,
  Activity
} from 'lucide-react';

const InbreedingAnalysis: React.FC = () => {
  const [analysisType, setAnalysisType] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-orange-600 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Inbreeding Analysis</h2>
            <p className="text-gray-600">Comprehensive inbreeding assessment and health impact analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span className="font-medium">Avg Inbreeding</span>
            </div>
            <div className="text-lg font-bold text-orange-900 mt-1">
              4.2%
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              <span className="font-medium">High Risk</span>
            </div>
            <div className="text-lg font-bold text-red-900 mt-1">
              23 animals
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="font-medium">Low Risk</span>
            </div>
            <div className="text-lg font-bold text-green-900 mt-1">
              1,186 animals
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-pink-600" />
              <span className="font-medium">Health Score</span>
            </div>
            <div className="text-lg font-bold text-pink-900 mt-1">
              8.4/10
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Configuration */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold">Inbreeding Analysis Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Type</label>
            <select 
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Choose analysis type...</option>
              <option value="population">Population-wide Analysis</option>
              <option value="individual">Individual Animal Assessment</option>
              <option value="breeding_group">Breeding Group Analysis</option>
              <option value="lineage">Lineage-specific Analysis</option>
              <option value="temporal">Temporal Trend Analysis</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Inbreeding Coefficient Method</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option>Pedigree-based (Wright's F)</option>
              <option>Genomic-based (FROH)</option>
              <option>Kinship-based (G-matrix)</option>
              <option>Hybrid Method</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Risk Threshold</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option>Conservative (&gt;3%)</option>
              <option>Moderate (&gt;6%)</option>
              <option>Aggressive (&gt;10%)</option>
              <option>Custom Threshold</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Health Impact Assessment</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option>Include Health Metrics</option>
              <option>Reproductive Performance</option>
              <option>Disease Susceptibility</option>
              <option>Growth Performance</option>
              <option>All Assessments</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button 
            onClick={() => setIsAnalyzing(!isAnalyzing)}
            disabled={!analysisType}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Analyzing Inbreeding...</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>Run Inbreeding Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Placeholder */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold">Inbreeding Analysis Results</h3>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
              <Download className="h-4 w-4 mr-1 inline" />
              Export Report
            </button>
            <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
              <Eye className="h-4 w-4 mr-1 inline" />
              Detailed View
            </button>
          </div>
        </div>

        <div className="text-center py-12">
          <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            ⚠️ Comprehensive Inbreeding Analysis (27KB) Coming Soon
          </h4>
          <p className="text-gray-600 mb-4">
            Advanced inbreeding assessment with health impact analysis and breeding recommendations
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-lg mx-auto">
            <h5 className="font-semibold text-orange-900 mb-2">Full Features Include:</h5>
            <ul className="text-orange-800 text-sm space-y-1">
              <li>• Multiple inbreeding coefficient calculations (F, FROH, G-matrix)</li>
              <li>• Population and individual-level risk assessment</li>
              <li>• Health impact correlation analysis</li>
              <li>• Breeding recommendations for inbreeding reduction</li>
              <li>• Temporal trend analysis and forecasting</li>
              <li>• Interactive visualizations and heatmaps</li>
              <li>• Comprehensive reporting and alerts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InbreedingAnalysis; 