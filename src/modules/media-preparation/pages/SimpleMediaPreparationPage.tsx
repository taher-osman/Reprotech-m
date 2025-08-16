import React, { useState, useEffect } from 'react';
import { 
  Beaker, 
  FlaskConical, 
  TestTube, 
  BarChart3, 
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  Thermometer,
  Droplets,
  Calculator,
  Workflow,
  Zap,
  Sparkles,
  Package
} from 'lucide-react';

const SimpleMediaPreparationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    totalFormulas: 24,
    activeBatches: 8,
    pendingQC: 3,
    successRate: 94.2
  });

  const [recentBatches] = useState([
    {
      id: 'MP-2025-001',
      batchNumber: 'MP-2025-001',
      formula: 'IVF Medium Base',
      status: 'Released',
      preparedBy: 'Dr. Smith',
      preparedAt: new Date('2025-08-16T08:30:00'),
      batchSize: 500,
      unit: 'mL'
    },
    {
      id: 'MP-2025-002',
      batchNumber: 'MP-2025-002',
      formula: 'Embryo Culture Medium',
      status: 'QC_Pending',
      preparedBy: 'Dr. Johnson',
      preparedAt: new Date('2025-08-16T10:15:00'),
      batchSize: 250,
      unit: 'mL'
    },
    {
      id: 'MP-2025-003',
      batchNumber: 'MP-2025-003',
      formula: 'Sperm Washing Medium',
      status: 'In_Progress',
      preparedBy: 'Dr. Wilson',
      preparedAt: new Date('2025-08-16T11:45:00'),
      batchSize: 1000,
      unit: 'mL'
    }
  ]);

  const quickActions = [
    { 
      title: 'New Batch', 
      icon: FlaskConical, 
      action: () => setActiveTab('batch-creation'), 
      color: 'blue',
      description: 'Create new media batch'
    },
    { 
      title: 'Formula Calculator', 
      icon: Calculator, 
      action: () => setActiveTab('calculator'), 
      color: 'green',
      description: 'Calculate formulations'
    },
    { 
      title: 'Quality Control', 
      icon: TestTube, 
      action: () => setActiveTab('quality-control'), 
      color: 'purple',
      description: 'QC testing and approval'
    },
    { 
      title: 'Batch Analytics', 
      icon: BarChart3, 
      action: () => setActiveTab('analytics'), 
      color: 'orange',
      description: 'Performance metrics'
    }
  ];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Released': return 'bg-green-100 text-green-800';
      case 'QC_Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In_Progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2">Media Preparation Laboratory</h1>
                <p className="text-xl opacity-90">
                  Advanced formula management, batch preparation, and quality control
                </p>
                <div className="flex items-center space-x-4 mt-4">
                  <div className="bg-white/20 text-white border border-white/30 px-3 py-1 rounded-full text-sm flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    ISO 17025 Certified
                  </div>
                  <div className="bg-white/20 text-white border border-white/30 px-3 py-1 rounded-full text-sm flex items-center">
                    <Zap className="h-4 w-4 mr-1" />
                    AI-Powered
                  </div>
                  <div className="bg-white/20 text-white border border-white/30 px-3 py-1 rounded-full text-sm flex items-center">
                    <FlaskConical className="h-4 w-4 mr-1" />
                    GMP Compliant
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{formatDate(new Date())}</div>
                <div className="text-lg opacity-90">System Status: Operational</div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Active Formulas</h3>
              <Beaker className="h-8 w-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold">{realTimeMetrics.totalFormulas}</div>
            <p className="text-blue-100 text-sm mt-1">Ready for preparation</p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span className="text-xs text-blue-100">All systems operational</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Active Batches</h3>
              <FlaskConical className="h-8 w-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold">{realTimeMetrics.activeBatches}</div>
            <p className="text-green-100 text-sm mt-1">In production</p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
              <span className="text-xs text-green-100">2 nearing completion</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">QC Testing</h3>
              <TestTube className="h-8 w-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold">{realTimeMetrics.pendingQC}</div>
            <p className="text-purple-100 text-sm mt-1">Pending approval</p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
              <span className="text-xs text-purple-100">High priority tests</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Success Rate</h3>
              <CheckCircle className="h-8 w-8 opacity-80" />
            </div>
            <div className="text-3xl font-bold">{realTimeMetrics.successRate}%</div>
            <p className="text-orange-100 text-sm mt-1">Quality compliance</p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span className="text-xs text-orange-100">Above target</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Laboratory Quick Actions</h2>
            <p className="text-gray-600">Access essential tools and workflows</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="h-24 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gray-50 border-2 hover:border-blue-200 transition-all duration-200 rounded-lg"
                onClick={action.action}
              >
                <action.icon className={`h-8 w-8 text-${action.color}-600`} />
                <div className="text-center">
                  <div className="text-sm font-medium">{action.title}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>Recent Batch Activity</span>
              </h3>
              <p className="text-gray-600">Latest preparation and testing updates</p>
            </div>
            <div className="space-y-3">
              {recentBatches.map((batch) => (
                <div key={batch.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <FlaskConical className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{batch.batchNumber}</div>
                      <div className="text-sm text-gray-600">
                        {batch.preparedBy} • {formatDate(batch.preparedAt)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.status)}`}>
                      {batch.status.replace('_', ' ')}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{batch.batchSize} {batch.unit}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <Thermometer className="h-5 w-5 text-orange-600" />
                <span>Laboratory Environment</span>
              </h3>
              <p className="text-gray-600">Real-time monitoring and alerts</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-sm text-gray-600">Temperature</div>
                  <div className="text-xl font-bold text-blue-600">22.5°C</div>
                  <div className="text-xs text-green-600">✓ Within range</div>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                  <div className="text-sm text-gray-600">Humidity</div>
                  <div className="text-xl font-bold text-green-600">45%</div>
                  <div className="text-xs text-green-600">✓ Optimal</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Air Quality</span>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Excellent</div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Equipment Status</span>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">All Online</div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Calibration Status</span>
                  <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">2 Due Soon</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'batch-creation' && (
          <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Create New Media Batch</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Formula Selection</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option>IVF Medium Base</option>
                  <option>Embryo Culture Medium</option>
                  <option>Sperm Washing Medium</option>
                  <option>Oocyte Maturation Medium</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Batch Size (mL)</label>
                <input 
                  type="number" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter batch size"
                />
              </div>
            </div>
            <div className="mt-6">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Create Batch</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Formula Calculator</h3>
            <div className="text-center py-8 text-gray-500">
              <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <div className="text-lg">Advanced Formula Calculator</div>
              <div className="text-sm">Precise calculations for media preparation</div>
            </div>
          </div>
        )}

        {activeTab === 'quality-control' && (
          <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Quality Control Testing</h3>
            <div className="text-center py-8 text-gray-500">
              <TestTube className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <div className="text-lg">QC Testing Dashboard</div>
              <div className="text-sm">Comprehensive quality control management</div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Batch Analytics</h3>
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <div className="text-lg">Performance Analytics</div>
              <div className="text-sm">Comprehensive batch performance metrics</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleMediaPreparationPage;

