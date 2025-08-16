import React, { useState } from 'react';
import { 
  BarChart3, 
  Activity, 
  Settings, 
  Play,
  Download,
  RefreshCw,
  TrendingUp,
  Layers,
  Atom
} from 'lucide-react';

const PopulationPCA: React.FC = () => {
  const [selectedComponents, setSelectedComponents] = useState('PC1-PC2');
  const [isAnalysisRunning, setIsAnalysisRunning] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-orange-500 rounded-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Population PCA</h2>
            <p className="text-gray-600">Principal component analysis for genetic diversity and population structure</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-orange-600" />
              <span className="font-medium">Components</span>
            </div>
            <div className="text-lg font-bold text-orange-900 mt-1">
              {selectedComponents}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Variance Explained</span>
            </div>
            <div className="text-lg font-bold text-blue-900 mt-1">
              42.3%
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Layers className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Populations</span>
            </div>
            <div className="text-lg font-bold text-purple-900 mt-1">
              7
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-medium">Eigenvalues</span>
            </div>
            <div className="text-lg font-bold text-green-900 mt-1">
              12
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Configuration */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold">PCA Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Component View</label>
            <select 
              value={selectedComponents}
              onChange={(e) => setSelectedComponents(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="PC1-PC2">PC1 vs PC2</option>
              <option value="PC1-PC3">PC1 vs PC3</option>
              <option value="PC2-PC3">PC2 vs PC3</option>
              <option value="3D">3D View (PC1-PC2-PC3)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color Coding</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option>By Species</option>
              <option>By Population</option>
              <option>By Breeding Group</option>
              <option>By Geographic Origin</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SNP Filtering</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
              <option>All High-Quality SNPs</option>
              <option>LD Pruned SNPs</option>
              <option>Custom Panel</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <button 
            onClick={() => setIsAnalysisRunning(!isAnalysisRunning)}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center space-x-2"
          >
            {isAnalysisRunning ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Computing PCA...</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>Run PCA Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Placeholder */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold">PCA Results</h3>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
              <Download className="h-4 w-4 mr-1 inline" />
              Export Plot
            </button>
          </div>
        </div>

        <div className="text-center py-12">
          <Atom className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            📊 Population PCA (36KB) Coming Soon
          </h4>
          <p className="text-gray-600 mb-4">
            Advanced principal component analysis with interactive 2D/3D visualization
          </p>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-lg mx-auto">
            <h5 className="font-semibold text-orange-900 mb-2">Full Features Include:</h5>
            <ul className="text-orange-800 text-sm space-y-1">
              <li>• Interactive 2D and 3D PCA plots</li>
              <li>• Variance explained visualization</li>
              <li>• Population clustering and structure analysis</li>
              <li>• Outlier detection and quality control</li>
              <li>• Export capabilities (PNG, SVG, data files)</li>
              <li>• Custom color schemes and grouping options</li>
              <li>• Eigenvalue and loading analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopulationPCA; 