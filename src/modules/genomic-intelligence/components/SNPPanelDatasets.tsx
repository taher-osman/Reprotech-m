import React, { useState } from 'react';
import { 
  Database, 
  BarChart3, 
  Settings, 
  Filter,
  Download,
  Upload,
  RefreshCw,
  Eye,
  FileText,
  Layers
} from 'lucide-react';

const SNPPanelDatasets: React.FC = () => {
  const [selectedDataset, setSelectedDataset] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-teal-500 rounded-lg">
            <Database className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">SNP Panel Datasets</h2>
            <p className="text-gray-600">Manage pre-filtered datasets for efficient genomic analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-teal-600" />
              <span className="font-medium">Available Datasets</span>
            </div>
            <div className="text-lg font-bold text-teal-900 mt-1">
              12
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Total SNPs</span>
            </div>
            <div className="text-lg font-bold text-blue-900 mt-1">
              2.1M
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Layers className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Species</span>
            </div>
            <div className="text-lg font-bold text-purple-900 mt-1">
              5
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-orange-600" />
              <span className="font-medium">Storage</span>
            </div>
            <div className="text-lg font-bold text-orange-900 mt-1">
              847 GB
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Management */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold">Dataset Management</h3>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
              <Upload className="h-4 w-4 mr-1 inline" />
              Import
            </button>
            <button className="px-3 py-1 bg-teal-600 text-white rounded text-sm hover:bg-teal-700">
              <Database className="h-4 w-4 mr-1 inline" />
              Create Dataset
            </button>
          </div>
        </div>

        <div className="text-center py-12">
          <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            🗂️ SNP Panel Datasets (26KB) Coming Soon
          </h4>
          <p className="text-gray-600 mb-4">
            Advanced dataset management with filtering, validation, and optimization features
          </p>
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 max-w-lg mx-auto">
            <h5 className="font-semibold text-teal-900 mb-2">Full Features Include:</h5>
            <ul className="text-teal-800 text-sm space-y-1">
              <li>• Pre-filtered dataset creation and management</li>
              <li>• Quality control and validation pipeline</li>
              <li>• Cross-species dataset compatibility</li>
              <li>• Import/export capabilities (VCF, PLINK, custom formats)</li>
              <li>• Dataset versioning and change tracking</li>
              <li>• Performance optimization for large datasets</li>
              <li>• Usage analytics and access control</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SNPPanelDatasets; 