import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, Search, Filter, Calendar, TrendingUp, AlertCircle, CheckCircle, Clock, BarChart3, PieChart, Activity } from 'lucide-react';

const SimpleLabResultsPage = () => {
  const [activeTab, setActiveTab] = useState('results');
  const [results, setResults] = useState([]);
  const [reports, setReports] = useState([]);
  const [analytics, setAnalytics] = useState({});

  // Mock data for demonstration
  useEffect(() => {
    setResults([
      { 
        id: 'RES-2025-001', 
        sampleId: 'LAB-2025-001', 
        animalId: 'A001', 
        testType: 'Complete Blood Count', 
        status: 'Completed', 
        resultDate: '2025-08-16', 
        technician: 'Dr. Smith',
        priority: 'High',
        values: { wbc: '8.5', rbc: '6.2', hgb: '12.8', hct: '38.5' },
        interpretation: 'Normal values within reference range'
      },
      { 
        id: 'RES-2025-002', 
        sampleId: 'LAB-2025-002', 
        animalId: 'A002', 
        testType: 'Biochemistry Panel', 
        status: 'Completed', 
        resultDate: '2025-08-16', 
        technician: 'Dr. Johnson',
        priority: 'Normal',
        values: { glucose: '95', bun: '18', creatinine: '1.1', alt: '32' },
        interpretation: 'All parameters within normal limits'
      },
      { 
        id: 'RES-2025-003', 
        sampleId: 'LAB-2025-003', 
        animalId: 'A003', 
        testType: 'Hormone Analysis', 
        status: 'In Review', 
        resultDate: '2025-08-16', 
        technician: 'Dr. Wilson',
        priority: 'Urgent',
        values: { progesterone: '15.2', estradiol: '45.8', lh: '12.3' },
        interpretation: 'Elevated progesterone levels - review recommended'
      },
      { 
        id: 'RES-2025-004', 
        sampleId: 'LAB-2025-004', 
        animalId: 'A004', 
        testType: 'Microbiology Culture', 
        status: 'Pending', 
        resultDate: '2025-08-17', 
        technician: 'Dr. Brown',
        priority: 'Normal',
        values: { culture: 'In Progress', sensitivity: 'Pending' },
        interpretation: 'Culture in progress - results pending'
      }
    ]);

    setReports([
      { id: 'RPT-001', title: 'Weekly Lab Summary', type: 'Summary', date: '2025-08-16', samples: 24, status: 'Generated' },
      { id: 'RPT-002', title: 'Quality Control Report', type: 'QC', date: '2025-08-15', samples: 18, status: 'Generated' },
      { id: 'RPT-003', title: 'Monthly Trends Analysis', type: 'Analytics', date: '2025-08-14', samples: 156, status: 'Generated' },
      { id: 'RPT-004', title: 'Equipment Performance', type: 'Equipment', date: '2025-08-13', samples: 89, status: 'Generated' }
    ]);

    setAnalytics({
      totalResults: 156,
      completedToday: 18,
      pendingReview: 7,
      averageTurnaround: '2.4 hours',
      qualityScore: 98.5,
      abnormalResults: 12
    });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'In Review': return 'text-yellow-600 bg-yellow-100';
      case 'Pending': return 'text-blue-600 bg-blue-100';
      case 'Abnormal': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Normal': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-700 rounded-lg p-6 text-white mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Laboratory Results Management</h1>
            <p className="text-green-100 mb-4">Comprehensive results analysis, reporting, and quality management</p>
            <div className="flex gap-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">CAP Accredited</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">LIMS Integrated</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Quality Assured</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">Aug 16, 02:47 PM</div>
            <div className="text-green-200">Results System: Active</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'results', label: 'Test Results', icon: FileText },
          { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
          { id: 'quality', label: 'Quality Control', icon: CheckCircle },
          { id: 'trends', label: 'Trends & Insights', icon: TrendingUp }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Test Results Tab */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Total Results</p>
                  <p className="text-3xl font-bold text-green-900">{analytics.totalResults}</p>
                  <p className="text-green-600 text-sm">All time results</p>
                </div>
                <FileText className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Completed Today</p>
                  <p className="text-3xl font-bold text-blue-900">{analytics.completedToday}</p>
                  <p className="text-blue-600 text-sm">Results finalized</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Pending Review</p>
                  <p className="text-3xl font-bold text-yellow-900">{analytics.pendingReview}</p>
                  <p className="text-yellow-600 text-sm">Awaiting approval</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Quality Score</p>
                  <p className="text-3xl font-bold text-purple-900">{analytics.qualityScore}%</p>
                  <p className="text-purple-600 text-sm">Accuracy rating</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Results Controls */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search results..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>All Status</option>
                <option>Completed</option>
                <option>In Review</option>
                <option>Pending</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                <option>All Tests</option>
                <option>Blood Count</option>
                <option>Biochemistry</option>
                <option>Hormone Analysis</option>
                <option>Microbiology</option>
              </select>
            </div>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Results
            </button>
          </div>

          {/* Results Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sample</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.sampleId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.animalId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.testType}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(result.status)}`}>
                        {result.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(result.priority)}`}>
                        {result.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.resultDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reports & Analytics Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Quick Report Generation */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Generate Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-400 transition-colors">
                <div className="bg-green-100 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Daily Summary</div>
                  <div className="text-sm text-gray-600">Today's results</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Weekly Trends</div>
                  <div className="text-sm text-gray-600">7-day analysis</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition-colors">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Quality Control</div>
                  <div className="text-sm text-gray-600">QC metrics</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 transition-colors">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Activity className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Custom Report</div>
                  <div className="text-sm text-gray-600">Build custom</div>
                </div>
              </button>
            </div>
          </div>

          {/* Generated Reports */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Recent Reports</h3>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Samples</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{report.samples}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full text-green-600 bg-green-100">
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-green-600 hover:text-green-900 mr-3">View</button>
                      <button className="text-blue-600 hover:text-blue-900">Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quality Control Tab */}
      {activeTab === 'quality' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Quality Metrics</h3>
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Accuracy Rate:</span>
                  <span className="font-medium text-green-600">98.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Precision Score:</span>
                  <span className="font-medium text-green-600">97.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Turnaround Time:</span>
                  <span className="font-medium text-blue-600">2.4 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Error Rate:</span>
                  <span className="font-medium text-red-600">0.3%</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Control Samples</h3>
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Normal Controls:</span>
                  <span className="font-medium text-green-600">24/24 Pass</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Abnormal Controls:</span>
                  <span className="font-medium text-green-600">12/12 Pass</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Blank Controls:</span>
                  <span className="font-medium text-green-600">8/8 Pass</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Calibrators:</span>
                  <span className="font-medium text-green-600">6/6 Pass</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Alerts & Issues</h3>
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="font-medium text-yellow-800">Calibration Due</div>
                  <div className="text-sm text-yellow-600">Chemistry Analyzer - Due in 2 days</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-800">All Systems Normal</div>
                  <div className="text-sm text-green-600">No critical issues detected</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trends & Insights Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Test Volume Trends</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Chart visualization would appear here</p>
                  <p className="text-sm text-gray-500">Showing 7-day test volume trends</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Result Distribution</h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Pie chart would appear here</p>
                  <p className="text-sm text-gray-500">Normal vs Abnormal result distribution</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Performance Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">↑ 15%</div>
                <div className="text-gray-600">Test Volume</div>
                <div className="text-sm text-gray-500">vs last week</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">↓ 0.3h</div>
                <div className="text-gray-600">Avg Turnaround</div>
                <div className="text-sm text-gray-500">improvement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">↑ 2.1%</div>
                <div className="text-gray-600">Quality Score</div>
                <div className="text-sm text-gray-500">month over month</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleLabResultsPage;

