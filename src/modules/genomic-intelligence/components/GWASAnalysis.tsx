import React, { useState } from 'react';
import { 
  Microscope, 
  BarChart3, 
  Settings, 
  Play,
  Download,
  RefreshCw,
  TrendingUp,
  Target,
  Database
} from 'lucide-react';

const GWASAnalysis: React.FC = () => {
  const [selectedTrait, setSelectedTrait] = useState('');
  const [isAnalysisRunning, setIsAnalysisRunning] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-indigo-500 rounded-lg">
            <Microscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">GWAS Analysis</h2>
            <p className="text-gray-600">Genome-wide association studies for trait discovery and genetic mapping</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-indigo-600" />
              <span className="font-medium">Traits</span>
            </div>
            <div className="text-lg font-bold text-indigo-900 mt-1">
              15
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-600" />
              <span className="font-medium">SNPs Tested</span>
            </div>
            <div className="text-lg font-bold text-blue-900 mt-1">
              2.1M
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Significant Hits</span>
            </div>
            <div className="text-lg font-bold text-purple-900 mt-1">
              287
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-medium">Heritability</span>
            </div>
            <div className="text-lg font-bold text-green-900 mt-1">
              0.65
            </div>
          </div>
        </div>
      </div>

      {/* GWAS Configuration */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold">GWAS Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Trait</label>
            <select 
              value={selectedTrait}
              onChange={(e) => setSelectedTrait(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">Choose a trait...</option>
              <option value="milk_yield">Milk Yield (kg/lactation)</option>
              <option value="milk_fat">Milk Fat Content (%)</option>
              <option value="milk_protein">Milk Protein Content (%)</option>
              <option value="fertility">Fertility Index</option>
              <option value="body_weight">Body Weight (kg)</option>
              <option value="height">Height at Withers (cm)</option>
              <option value="disease_resistance">Disease Resistance Score</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statistical Model</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option>Linear Mixed Model (LMM)</option>
              <option>Generalized Linear Model (GLM)</option>
              <option>Fixed Effects Model</option>
              <option>Bayesian GWAS</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Population Structure Correction</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option>Principal Components (PC1-5)</option>
              <option>Kinship Matrix</option>
              <option>Genomic Relationship Matrix</option>
              <option>No Correction</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">P-value Threshold</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option>5e-8 (Genome-wide significant)</option>
              <option>1e-5 (Suggestive)</option>
              <option>1e-4 (Exploratory)</option>
              <option>Custom threshold</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button 
            onClick={() => setIsAnalysisRunning(!isAnalysisRunning)}
            disabled={!selectedTrait}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isAnalysisRunning ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Running GWAS...</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>Run GWAS Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Placeholder */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold">GWAS Results</h3>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
              <Download className="h-4 w-4 mr-1 inline" />
              Manhattan Plot
            </button>
          </div>
        </div>

        <div className="text-center py-12">
          <Microscope className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            🧬 GWAS Analysis (28KB) Coming Soon
          </h4>
          <p className="text-gray-600 mb-4">
            Comprehensive genome-wide association studies with advanced statistical models
          </p>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 max-w-lg mx-auto">
            <h5 className="font-semibold text-indigo-900 mb-2">Full Features Include:</h5>
            <ul className="text-indigo-800 text-sm space-y-1">
              <li>• Interactive Manhattan and Q-Q plots</li>
              <li>• Multiple statistical models (LMM, GLM, Bayesian)</li>
              <li>• Population structure correction methods</li>
              <li>• Candidate gene annotation and pathway analysis</li>
              <li>• Multi-trait and conditional analysis</li>
              <li>• Heritability estimation and genetic correlation</li>
              <li>• Export results and publication-ready plots</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GWASAnalysis; 