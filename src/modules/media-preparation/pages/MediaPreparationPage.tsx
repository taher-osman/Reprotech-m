import React, { useState, useEffect } from 'react';
import { 
  Beaker, 
  FlaskConical, 
  TestTube, 
  BarChart3, 
  FileText, 
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';

// Import enhanced components
import MediaFormulaBuilder from '../components/MediaFormulaBuilder';
import MediaCreationForm from '../components/MediaCreationForm';
import QualityControlPanel from '../components/QualityControlPanel';
import MediaUsageTracker from '../components/MediaUsageTracker';
import MediaAnalytics from '../components/MediaAnalytics';
import MediaSOPViewer from '../components/MediaSOPViewer';
import AdvancedFormulaCalculator from '../components/AdvancedFormulaCalculator';
import EnhancedQualityControl from '../components/EnhancedQualityControl';
import StockMediaTable from '../components/StockMediaTable';
import { mediaDemoService } from '../services/mediaDemoService';
import { MediaAnalytics as MediaAnalyticsType } from '../types/mediaTypes';

const MediaPreparationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('master-table');
  const [searchQuery, setSearchQuery] = useState('');
  const [analytics, setAnalytics] = useState<MediaAnalyticsType | null>(null);
  const [recentBatches, setRecentBatches] = useState([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    activeBatches: 0,
    pendingQC: 0,
    formulasUsed: 0,
    successRate: 0
  });

  useEffect(() => {
    // Load analytics and recent data
    setAnalytics(mediaDemoService.getAnalytics());
    setRecentBatches(mediaDemoService.getBatches().slice(0, 4));
    
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        activeBatches: prev.activeBatches + Math.floor(Math.random() * 3) - 1,
        pendingQC: Math.max(0, prev.pendingQC + Math.floor(Math.random() * 3) - 1),
        formulasUsed: prev.formulasUsed + Math.floor(Math.random() * 2),
        successRate: 94.2 + (Math.random() - 0.5) * 2
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    { 
      title: 'Media Master Table', 
      icon: Sparkles, 
      action: () => setActiveTab('master-table'), 
      color: 'purple',
      description: 'Inventory integrated formulas'
    },
    { 
      title: 'Formula Calculator', 
      icon: Calculator, 
      action: () => setActiveTab('calculator'), 
      color: 'blue',
      description: 'Precise calculations'
    },
    { 
      title: 'Media Creation', 
      icon: FlaskConical, 
      action: () => setActiveTab('batch-creation'), 
      color: 'green',
      description: 'Create new media batches'
    },
    { 
      title: 'Advanced QC', 
      icon: Zap, 
      action: () => setActiveTab('enhanced-qc'), 
      color: 'orange',
      description: 'Real-time testing'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold mb-2">Media Preparation Laboratory</h1>
                <p className="text-xl opacity-90">
                  Advanced formula calculation, batch preparation, and quality control system
                </p>
                <div className="flex items-center space-x-4 mt-4">
                  <Badge className="bg-white/20 text-white border-white/30">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    ISO 17025 Certified
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30">
                    <Zap className="h-4 w-4 mr-1" />
                    AI-Powered
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30">
                    <FlaskConical className="h-4 w-4 mr-1" />
                    GMP Compliant
                  </Badge>
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
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Active Formulas</CardTitle>
                <Beaker className="h-8 w-8 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.totalFormulas || 0}</div>
              <p className="text-blue-100 text-sm mt-1">Ready for preparation</p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-xs text-blue-100">All systems operational</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Active Batches</CardTitle>
                <FlaskConical className="h-8 w-8 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.activeBatches || 0}</div>
              <p className="text-green-100 text-sm mt-1">In production</p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                <span className="text-xs text-green-100">2 nearing completion</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">QC Testing</CardTitle>
                <TestTube className="h-8 w-8 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.pendingQC || 0}</div>
              <p className="text-purple-100 text-sm mt-1">Pending approval</p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                <span className="text-xs text-purple-100">High priority tests</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Success Rate</CardTitle>
                <CheckCircle className="h-8 w-8 opacity-80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{realTimeMetrics.successRate.toFixed(1)}%</div>
              <p className="text-orange-100 text-sm mt-1">Quality compliance</p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-xs text-orange-100">Above target</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Actions */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Laboratory Quick Actions</CardTitle>
            <CardDescription>Access advanced tools and workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-gray-50 border-2 hover:border-blue-200 transition-all duration-200"
                  onClick={action.action}
                >
                  <action.icon className={`h-8 w-8 text-${action.color}-600`} />
                  <div className="text-center">
                    <div className="text-sm font-medium">{action.title}</div>
                    <div className="text-xs text-gray-500">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>Recent Batch Activity</span>
              </CardTitle>
              <CardDescription>Latest preparation and testing updates</CardDescription>
            </CardHeader>
            <CardContent>
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
                      <Badge 
                        variant={batch.status === 'Released' ? 'default' : 'secondary'}
                        className={
                          batch.status === 'Released' ? 'bg-green-100 text-green-800' : 
                          batch.status === 'QC_Pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'
                        }
                      >
                        {batch.status.replace('_', ' ')}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">{batch.batchSize} {batch.unit}</div>
                    </div>
                  </div>
                ))}
                {recentBatches.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FlaskConical className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <div>No recent batch activity</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Thermometer className="h-5 w-5 text-orange-600" />
                <span>Laboratory Environment</span>
              </CardTitle>
              <CardDescription>Real-time monitoring and alerts</CardDescription>
            </CardHeader>
            <CardContent>
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
                    <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Equipment Status</span>
                    <Badge className="bg-green-100 text-green-800">All Online</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Calibration Status</span>
                    <Badge className="bg-yellow-100 text-yellow-800">2 Due Soon</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Module Tabs */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Media Preparation Laboratory</CardTitle>
                <CardDescription className="text-lg">
                  Complete suite of advanced tools for laboratory media management
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search across all modules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64 bg-white"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-11 bg-gray-100">
                <TabsTrigger value="master-table" className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600">
                  <Sparkles className="h-4 w-4" />
                  <span>Master Table</span>
                </TabsTrigger>
                <TabsTrigger value="calculator" className="flex items-center space-x-2">
                  <Calculator className="h-4 w-4" />
                  <span>Calculator</span>
                </TabsTrigger>
                <TabsTrigger value="batch-creation" className="flex items-center space-x-2">
                  <FlaskConical className="h-4 w-4" />
                  <span>Media Creation</span>
                </TabsTrigger>
                <TabsTrigger value="stock-media" className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600">
                  <Package className="h-4 w-4" />
                  <span>Stock Media</span>
                </TabsTrigger>
                <TabsTrigger value="smart-prep" className="flex items-center space-x-2">
                  <Workflow className="h-4 w-4" />
                  <span>Smart Prep</span>
                </TabsTrigger>
                <TabsTrigger value="enhanced-qc" className="flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>Advanced QC</span>
                </TabsTrigger>
                <TabsTrigger value="qc" className="flex items-center space-x-2">
                  <TestTube className="h-4 w-4" />
                  <span>QC Testing</span>
                </TabsTrigger>
                <TabsTrigger value="usage" className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4" />
                  <span>Usage</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="sop" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>SOPs</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="master-table" className="mt-6">
                <MediaFormulaBuilder />
              </TabsContent>

              <TabsContent value="calculator" className="mt-6">
                <AdvancedFormulaCalculator />
              </TabsContent>

              <TabsContent value="batch-creation" className="mt-6">
                <MediaCreationForm />
              </TabsContent>

              <TabsContent value="stock-media" className="mt-6">
                <StockMediaTable />
              </TabsContent>

              <TabsContent value="smart-prep" className="mt-6">
                <div className="text-center py-16">
                  <Workflow className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Smart Preparation Workflows</h3>
                  <p className="text-gray-500">Advanced guided workflows coming soon</p>
                </div>
              </TabsContent>

              <TabsContent value="enhanced-qc" className="mt-6">
                <EnhancedQualityControl />
              </TabsContent>

              <TabsContent value="qc" className="mt-6">
                <QualityControlPanel />
              </TabsContent>

              <TabsContent value="usage" className="mt-6">
                <MediaUsageTracker />
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <MediaAnalytics />
              </TabsContent>

              <TabsContent value="sop" className="mt-6">
                <MediaSOPViewer />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MediaPreparationPage; 