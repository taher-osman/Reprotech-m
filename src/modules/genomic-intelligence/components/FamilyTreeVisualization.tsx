import React, { useState } from 'react';
import { 
  TreePine, 
  Users, 
  GitBranch,
  Network,
  Settings,
  Play,
  RefreshCw,
  Download,
  Eye,
  Search
} from 'lucide-react';

const FamilyTreeVisualization: React.FC = () => {
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [generations, setGenerations] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-green-600 rounded-lg">
            <TreePine className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Family Tree Visualization</h2>
            <p className="text-gray-600">Interactive pedigree charts and lineage analysis for breeding optimization</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <TreePine className="h-5 w-5 text-green-600" />
              <span className="font-medium">Family Trees</span>
            </div>
            <div className="text-lg font-bold text-green-900 mt-1">
              247
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Generations</span>
            </div>
            <div className="text-lg font-bold text-blue-900 mt-1">
              {generations}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Lineages</span>
            </div>
            <div className="text-lg font-bold text-purple-900 mt-1">
              89
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Network className="h-5 w-5 text-orange-600" />
              <span className="font-medium">Connections</span>
            </div>
            <div className="text-lg font-bold text-orange-900 mt-1">
              1,024
            </div>
          </div>
        </div>
      </div>

      {/* Tree Configuration */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold">Family Tree Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Root Animal</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search animals..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Generations to Show</label>
            <select 
              value={generations}
              onChange={(e) => setGenerations(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value={2}>2 Generations</option>
              <option value={3}>3 Generations</option>
              <option value={4}>4 Generations</option>
              <option value={5}>5 Generations</option>
              <option value={6}>6 Generations</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Layout Style</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option>Traditional Tree</option>
              <option>Circular Layout</option>
              <option>Force-Directed Graph</option>
              <option>Hierarchical Network</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <button 
            onClick={() => setIsGenerating(!isGenerating)}
            disabled={!selectedAnimal}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                <span>Generating Tree...</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                <span>Generate Family Tree</span>
              </>
            )}
          </button>

          <button className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Quick Search</span>
          </button>
        </div>
      </div>

      {/* Results Placeholder */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TreePine className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">Family Tree Visualization</h3>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
              <Download className="h-4 w-4 mr-1 inline" />
              Export SVG
            </button>
            <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
              <Eye className="h-4 w-4 mr-1 inline" />
              Full Screen
            </button>
          </div>
        </div>

        <div className="text-center py-12">
          <TreePine className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            🌳 Interactive Family Trees (31KB) Coming Soon
          </h4>
          <p className="text-gray-600 mb-4">
            Dynamic pedigree visualization with interactive navigation and lineage analysis
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-lg mx-auto">
            <h5 className="font-semibold text-green-900 mb-2">Full Features Include:</h5>
            <ul className="text-green-800 text-sm space-y-1">
              <li>• Interactive pedigree charts with zoom and pan</li>
              <li>• Multiple layout algorithms (tree, circular, force-directed)</li>
              <li>• Genetic relationship strength visualization</li>
              <li>• Ancestor and descendant lineage tracing</li>
              <li>• Breeding coefficient calculations</li>
              <li>• Export capabilities (SVG, PNG, PDF)</li>
              <li>• Mobile-responsive touch navigation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyTreeVisualization; 