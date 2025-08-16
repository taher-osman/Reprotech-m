import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Filter, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  FlaskConical,
  CheckCircle,
  AlertCircle,
  Clock,
  Calendar,
  Target
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/Select';

const MediaAnalytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedFormula, setSelectedFormula] = useState('all');

  // Mock analytics data
  const analyticsData = {
    totalFormulas: 24,
    activeBatches: 8,
    pendingQC: 3,
    expiredBatches: 2,
    totalUsage: 156,
    successRate: 94.2,
    totalCost: 15420.50,
    averageCostPerBatch: 642.52,
    monthlyTrend: '+12.5%',
    performanceByFormula: [
      { name: 'IVF Medium v2.1', batches: 15, successRate: 96.7, avgCost: 125.50, usage: 45 },
      { name: 'SOF-HEPES', batches: 12, successRate: 91.7, avgCost: 89.75, usage: 38 },
      { name: 'SCNT Wash Buffer', batches: 8, successRate: 87.5, avgCost: 45.25, usage: 22 },
      { name: 'Semen Processing Medium', batches: 6, successRate: 83.3, avgCost: 67.80, usage: 18 }
    ],
    monthlyUsage: [
      { month: 'Jan', usage: 45, cost: 3200 },
      { month: 'Feb', usage: 52, cost: 3800 },
      { month: 'Mar', usage: 38, cost: 2800 },
      { month: 'Apr', usage: 61, cost: 4200 },
      { month: 'May', usage: 48, cost: 3400 },
      { month: 'Jun', usage: 55, cost: 3900 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics & Reporting</h2>
          <p className="text-gray-600">Comprehensive media performance analysis and insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedFormula} onValueChange={setSelectedFormula}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All formulas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All formulas</SelectItem>
              {analyticsData.performanceByFormula.map(formula => (
                <SelectItem key={formula.name} value={formula.name}>{formula.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <FlaskConical className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalUsage}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span>{analyticsData.monthlyTrend}</span>
              <span>vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analyticsData.successRate}%</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span>+2.1%</span>
              <span>vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.totalCost.toLocaleString()}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 text-red-600" />
              <span>-5.2%</span>
              <span>vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Cost/Batch</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.averageCostPerBatch.toFixed(2)}</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 text-green-600" />
              <span>-8.7%</span>
              <span>vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance by Formula */}
      <Card>
        <CardHeader>
          <CardTitle>Formula Performance</CardTitle>
          <CardDescription>Success rates and usage by media formula</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.performanceByFormula.map((formula, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{formula.name}</div>
                  <div className="text-sm text-gray-600">
                    {formula.batches} batches • {formula.usage} usage records
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{formula.successRate}%</div>
                    <div className="text-xs text-gray-600">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">${formula.avgCost}</div>
                    <div className="text-xs text-gray-600">Avg Cost</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={formula.successRate >= 95 ? "default" : 
                              formula.successRate >= 90 ? "secondary" : "outline"}
                      className={formula.successRate >= 95 ? "bg-green-100 text-green-800" : ""}
                    >
                      {formula.successRate >= 95 ? "Excellent" : 
                       formula.successRate >= 90 ? "Good" : "Monitor"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Usage Trends</CardTitle>
            <CardDescription>Usage volume over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.monthlyUsage.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium">{month.month}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-medium">{month.usage} records</div>
                      <div className="text-sm text-gray-600">Usage</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${month.cost.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Cost</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quality Metrics</CardTitle>
            <CardDescription>QC performance and batch status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>QC Pass Rate</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">94.2%</div>
                  <div className="text-sm text-gray-600">+2.1% vs last month</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span>Pending QC</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-600">{analyticsData.pendingQC}</div>
                  <div className="text-sm text-gray-600">Batches awaiting approval</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span>Expired Batches</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">{analyticsData.expiredBatches}</div>
                  <div className="text-sm text-gray-600">Require disposal</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FlaskConical className="h-5 w-5 text-blue-600" />
                  <span>Active Batches</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">{analyticsData.activeBatches}</div>
                  <div className="text-sm text-gray-600">Currently available</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Analysis</CardTitle>
          <CardDescription>Detailed cost breakdown and optimization opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-3">Cost by Formula</h3>
              <div className="space-y-2">
                {analyticsData.performanceByFormula.map((formula, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{formula.name}</span>
                    <span className="font-medium">${(formula.avgCost * formula.batches).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-3">Optimization Opportunities</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Reduce expired batches</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Improve QC efficiency</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Optimize batch sizes</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-3">Performance Insights</h3>
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium">Best Performing:</span>
                  <div className="text-green-600">IVF Medium v2.1 (96.7%)</div>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Needs Attention:</span>
                  <div className="text-orange-600">Semen Processing Medium (83.3%)</div>
                </div>
                <div className="text-sm">
                  <span className="font-medium">Cost Efficient:</span>
                  <div className="text-blue-600">SCNT Wash Buffer ($45.25)</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaAnalytics; 