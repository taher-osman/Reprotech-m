import React, { useState, useEffect } from 'react';
import api from './services/api';
import SemenCollectionPage from '../components/SemenCollectionPage';
import CasaAnalysisPage from '../components/CasaAnalysisPage';
import SemenSortingPage from '../components/SemenSortingPage';

// =====================================================
// SEMEN MANAGEMENT SYSTEM - MAIN PAGE
// Comprehensive semen tracking from collection to sorting
// =====================================================

interface DashboardStats {
  overview: {
    totalCollections: number;
    totalAnalyses: number;
    totalSorting: number;
    readyForSorting: number;
    readyForFreezing: number;
  };
  thisMonth: {
    collections: number;
    analyses: number;
  };
}

const SemenManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'collection' | 'casa' | 'sorting' | 'dashboard'>('dashboard');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockStats = {
        overview: {
          totalCollections: 347,
          totalAnalyses: 289,
          totalSorting: 156,
          readyForSorting: 23,
          readyForFreezing: 45
        },
        thisMonth: {
          collections: 42,
          analyses: 38
        }
      };
      setDashboardStats(mockStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">🧬 Semen Management Dashboard</h2>
        <p className="text-gray-600">Complete semen tracking from collection to analysis</p>
      </div>

      {/* Statistics Overview */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                🧪
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Collections</p>
                <p className="text-xl font-bold text-blue-600">{dashboardStats.overview.totalCollections}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                🔬
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">CASA Analyses</p>
                <p className="text-xl font-bold text-purple-600">{dashboardStats.overview.totalAnalyses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                🎯
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Sorting Jobs</p>
                <p className="text-xl font-bold text-green-600">{dashboardStats.overview.totalSorting}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                ⚡
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Ready Sorting</p>
                <p className="text-xl font-bold text-yellow-600">{dashboardStats.overview.readyForSorting}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-cyan-100 rounded-lg">
                ❄️
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Ready Freezing</p>
                <p className="text-xl font-bold text-cyan-600">{dashboardStats.overview.readyForFreezing}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* This Month Statistics */}
      {dashboardStats && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 This Month Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{dashboardStats.thisMonth.collections}</div>
              <div className="text-sm text-gray-600">New Collections</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{dashboardStats.thisMonth.analyses}</div>
              <div className="text-sm text-gray-600">CASA Analyses</div>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Overview */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔄 Workflow Overview</h3>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
              🧪
            </div>
            <div className="text-sm font-medium">Collection</div>
            <div className="text-xs text-gray-500">Semen collection from animals</div>
          </div>
          <div className="text-gray-400">→</div>
          <div className="text-center">
            <div className="p-3 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
              🔬
            </div>
            <div className="text-sm font-medium">CASA Analysis</div>
            <div className="text-xs text-gray-500">Quality & motility analysis</div>
          </div>
          <div className="text-gray-400">→</div>
          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
              🎯
            </div>
            <div className="text-sm font-medium">Sorting</div>
            <div className="text-xs text-gray-500">Flow cytometry sorting</div>
          </div>
          <div className="text-gray-400">→</div>
          <div className="text-center">
            <div className="p-3 bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
              ❄️
            </div>
            <div className="text-sm font-medium">Storage</div>
            <div className="text-xs text-gray-500">Cryopreservation</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('collection')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🧪</div>
              <div className="font-medium text-blue-600">New Collection</div>
              <div className="text-xs text-gray-500">Record semen collection</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('casa')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🔬</div>
              <div className="font-medium text-purple-600">CASA Analysis</div>
              <div className="text-xs text-gray-500">Analyze semen quality</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('sorting')}
            className="flex items-center justify-center p-4 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-medium text-green-600">Sort Semen</div>
              <div className="text-xs text-gray-500">Flow cytometry sorting</div>
            </div>
          </button>
        </div>
      </div>

      {/* Drop Delay Feature Highlight */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Advanced Flow Cytometry</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="font-medium text-gray-900 mb-2">Drop Delay Parameter Control</div>
            <div className="text-sm text-gray-600">
              Professional-grade flow cytometry with precise Drop Delay parameter (22.5μs) 
              for accurate X/Y chromosome separation and optimal sorting performance.
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900 mb-2">Complete Parameter Suite</div>
            <div className="text-sm text-gray-600">
              Full control over pressure, flow rates, laser power, temperature, 
              and all critical parameters for professional semen sorting operations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Navigation */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Semen Management System</h1>
          <p className="text-gray-600 mt-1">Complete workflow from collection to storage</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          🧬 SEMEN MODULE
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'dashboard'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('collection')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'collection'
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🧪 Semen Collection
          </button>
          <button
            onClick={() => setActiveTab('casa')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'casa'
                ? 'border-purple-500 text-purple-600 bg-purple-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🔬 CASA Analysis
          </button>
          <button
            onClick={() => setActiveTab('sorting')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'sorting'
                ? 'border-green-500 text-green-600 bg-green-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🎯 Semen Sorting
          </button>
        </div>

        {/* Tab Status Indicators */}
        <div className="px-6 py-2 bg-gray-50 border-b text-xs text-gray-600">
          {activeTab === 'dashboard' && 'System overview and workflow statistics'}
          {activeTab === 'collection' && 'Record and manage semen collection from animals'}
          {activeTab === 'casa' && 'Comprehensive CASA analysis with macro and microscopic evaluation'}
          {activeTab === 'sorting' && 'Flow cytometry sorting with Drop Delay parameter control'}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'collection' && <SemenCollectionPage />}
            {activeTab === 'casa' && <CasaAnalysisPage />}
            {activeTab === 'sorting' && <SemenSortingPage />}
          </>
        )}
      </div>
    </div>
  );
};

export default SemenManagementPage; 