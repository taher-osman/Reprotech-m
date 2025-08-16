import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  BarChart3,
  Settings,
  Play,
  RefreshCw,
  Eye,
  Download
} from 'lucide-react';

const QualityControl: React.FC = () => {
  const [isRunningQC, setIsRunningQC] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-pink-500 rounded-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quality Control</h2>
            <p className="text-gray-600">SNP data quality assessment and filtering pipeline</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">Passed QC</span>
            </div>
            <div className="text-lg font-bold text-green-900 mt-1">
              1.8M SNPs
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="font-medium">Failed QC</span>
            </div>
            <div className="text-lg font-bold text-yellow-900 mt-1">
              320K SNPs
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Call Rate</span>
            </div>
            <div className="text-lg font-bold text-blue-900 mt-1">
              95.2%
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Quality Score</span>
            </div>
            <div className="text-lg font-bold text-purple-900 mt-1">
              8.7/10
            </div>
          </div>
        </div>
      </div>

      {/* QC Configuration */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="h-5 w-5 text-pink-600" />
          <h3 className="text-lg font-semibold">Quality Control Parameters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Call Rate Threshold</label>
            <input 
              type="number" 
              defaultValue="0.95" 
              step="0.01" 
              min="0" 
              max="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">MAF Threshold</label>
            <input 
              type="number" 
              defaultValue="0.01" 
              step="0.005" 
              min="0" 
              max="0.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">HWE P-value</label>
            <input 
              type="number" 
              defaultValue="1e-6" 
              step="1e-7"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sample Call Rate</label>
            <input 
              type="number" 
              defaultValue="0.9" 
              step="0.01" 
              min="0" 
              max="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6">
          <button 
            onClick={() => setIsRunningQC(!isRunningQC)}
            className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium flex items-center space-x-2"
          >
            {isRunningQC ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Running QC...</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>Run Quality Control</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Placeholder */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-pink-600" />
            <h3 className="text-lg font-semibold">Quality Control Results</h3>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
              <Download className="h-4 w-4 mr-1 inline" />
              QC Report
            </button>
            <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
              <Eye className="h-4 w-4 mr-1 inline" />
              View Details
            </button>
          </div>
        </div>

        <div className="text-center py-12">
          <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            ✨ Quality Control Dashboard (23KB) Coming Soon
          </h4>
          <p className="text-gray-600 mb-4">
            Comprehensive SNP data quality assessment with automated filtering and reporting
          </p>
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 max-w-lg mx-auto">
            <h5 className="font-semibold text-pink-900 mb-2">Full Features Include:</h5>
            <ul className="text-pink-800 text-sm space-y-1">
              <li>• Automated quality control pipeline</li>
              <li>• Sample and SNP filtering based on multiple criteria</li>
              <li>• Hardy-Weinberg equilibrium testing</li>
              <li>• Relatedness and population structure analysis</li>
              <li>• Interactive quality plots and visualizations</li>
              <li>• Comprehensive QC reports and summaries</li>
              <li>• Custom filtering rules and thresholds</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityControl; 