import React, { useState, useEffect } from 'react';
import { Clipboard, Users, FileText, Calendar, CheckCircle, AlertTriangle, Clock, Plus, Search, Filter, Download, Activity, TrendingUp, Settings, Target } from 'lucide-react';

const SimpleClinicalManagementPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [workflows, setWorkflows] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [protocols, setProtocols] = useState([]);
  const [compliance, setCompliance] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    setWorkflows([
      { id: 'WF-2025-001', name: 'Pre-Surgery Preparation', status: 'Active', priority: 'High', assignedTo: 'Dr. Smith', progress: 75, dueDate: '2025-08-17', steps: 8 },
      { id: 'WF-2025-002', name: 'Post-Op Recovery Protocol', status: 'In Progress', priority: 'Normal', assignedTo: 'Dr. Johnson', progress: 45, dueDate: '2025-08-19', steps: 12 },
      { id: 'WF-2025-003', name: 'Emergency Response', status: 'Completed', priority: 'Urgent', assignedTo: 'Dr. Wilson', progress: 100, dueDate: '2025-08-16', steps: 6 },
      { id: 'WF-2025-004', name: 'Routine Health Check', status: 'Pending', priority: 'Normal', assignedTo: 'Dr. Brown', progress: 0, dueDate: '2025-08-20', steps: 5 }
    ]);

    setAssignments([
      { id: 'ASG-001', task: 'Blood Sample Analysis', assignee: 'Dr. Smith', department: 'Laboratory', status: 'In Progress', deadline: '2025-08-17', priority: 'High' },
      { id: 'ASG-002', task: 'Ultrasound Examination', assignee: 'Dr. Johnson', department: 'Imaging', status: 'Scheduled', deadline: '2025-08-18', priority: 'Normal' },
      { id: 'ASG-003', task: 'Medication Review', assignee: 'Dr. Wilson', department: 'Pharmacy', status: 'Completed', deadline: '2025-08-16', priority: 'Normal' },
      { id: 'ASG-004', task: 'Surgery Preparation', assignee: 'Dr. Brown', department: 'Surgery', status: 'Urgent', deadline: '2025-08-16', priority: 'Urgent' }
    ]);

    setProtocols([
      { id: 'PROT-001', name: 'Surgical Safety Checklist', category: 'Surgery', compliance: 98, lastUpdated: '2025-08-10', status: 'Active' },
      { id: 'PROT-002', name: 'Infection Control Protocol', category: 'Safety', compliance: 95, lastUpdated: '2025-08-12', status: 'Active' },
      { id: 'PROT-003', name: 'Emergency Response Plan', category: 'Emergency', compliance: 92, lastUpdated: '2025-08-08', status: 'Under Review' },
      { id: 'PROT-004', name: 'Quality Assurance Guidelines', category: 'Quality', compliance: 97, lastUpdated: '2025-08-14', status: 'Active' }
    ]);

    setCompliance([
      { id: 'COMP-001', area: 'Documentation', score: 96, trend: 'up', lastAudit: '2025-08-10', nextAudit: '2025-09-10' },
      { id: 'COMP-002', area: 'Safety Protocols', score: 94, trend: 'stable', lastAudit: '2025-08-08', nextAudit: '2025-09-08' },
      { id: 'COMP-003', area: 'Quality Standards', score: 98, trend: 'up', lastAudit: '2025-08-12', nextAudit: '2025-09-12' },
      { id: 'COMP-004', area: 'Staff Training', score: 91, trend: 'down', lastAudit: '2025-08-06', nextAudit: '2025-09-06' }
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': case 'Completed': return 'text-green-600 bg-green-100';
      case 'In Progress': case 'Scheduled': return 'text-blue-600 bg-blue-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Urgent': return 'text-red-600 bg-red-100';
      case 'Under Review': return 'text-purple-600 bg-purple-100';
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

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />;
      case 'stable': return <Activity className="w-4 h-4 text-blue-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-700 rounded-lg p-6 text-white mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Clinical Management</h1>
            <p className="text-purple-100 mb-4">Comprehensive clinical workflow management and quality assurance</p>
            <div className="flex gap-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">ISO 9001 Certified</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">CLIA Compliant</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Quality Assured</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">Aug 16, 02:44 PM</div>
            <div className="text-purple-200">Clinical Status: Operational</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: Clipboard },
          { id: 'workflows', label: 'Clinical Workflows', icon: Activity },
          { id: 'assignments', label: 'Task Assignments', icon: Users },
          { id: 'protocols', label: 'Clinical Protocols', icon: FileText },
          { id: 'compliance', label: 'Quality & Compliance', icon: Target }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Active Workflows</p>
                  <p className="text-3xl font-bold text-blue-900">12</p>
                  <p className="text-blue-600 text-sm">In progress</p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Compliance Score</p>
                  <p className="text-3xl font-bold text-green-900">96%</p>
                  <p className="text-green-600 text-sm">Overall rating</p>
                </div>
                <Target className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-sm font-medium">Pending Tasks</p>
                  <p className="text-3xl font-bold text-yellow-900">8</p>
                  <p className="text-yellow-600 text-sm">Require attention</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Team Efficiency</p>
                  <p className="text-3xl font-bold text-purple-900">94%</p>
                  <p className="text-purple-600 text-sm">This month</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Clinical Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Plus className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">New Workflow</div>
                  <div className="text-sm text-gray-600">Create workflow</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-400 transition-colors">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Assign Task</div>
                  <div className="text-sm text-gray-600">Delegate work</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition-colors">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Update Protocol</div>
                  <div className="text-sm text-gray-600">Modify guidelines</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 transition-colors">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Download className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Generate Report</div>
                  <div className="text-sm text-gray-600">Export analytics</div>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Clinical Activity */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Recent Clinical Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Emergency Response workflow completed</div>
                  <div className="text-sm text-gray-600">Dr. Wilson • Aug 16, 02:30 PM • All 6 steps completed successfully</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Pre-Surgery Preparation workflow updated</div>
                  <div className="text-sm text-gray-600">Dr. Smith • Aug 16, 02:15 PM • Progress: 75% (6/8 steps)</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Urgent task assigned: Surgery Preparation</div>
                  <div className="text-sm text-gray-600">Dr. Brown • Aug 16, 02:00 PM • Deadline: Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clinical Workflows Tab */}
      {activeTab === 'workflows' && (
        <div className="space-y-6">
          {/* Workflow Controls */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search workflows..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>All Status</option>
                <option>Active</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Pending</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>All Priorities</option>
                <option>Urgent</option>
                <option>High</option>
                <option>Normal</option>
              </select>
            </div>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Workflow
            </button>
          </div>

          {/* Workflows Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workflow ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workflows.map((workflow) => (
                  <tr key={workflow.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{workflow.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{workflow.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(workflow.status)}`}>
                        {workflow.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(workflow.priority)}`}>
                        {workflow.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{workflow.assignedTo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${workflow.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{workflow.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{workflow.dueDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-purple-600 hover:text-purple-900 mr-3">View</button>
                      <button className="text-blue-600 hover:text-blue-900">Update</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Task Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          {/* Assignment Controls */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>All Departments</option>
                <option>Laboratory</option>
                <option>Imaging</option>
                <option>Pharmacy</option>
                <option>Surgery</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>All Status</option>
                <option>In Progress</option>
                <option>Scheduled</option>
                <option>Completed</option>
                <option>Urgent</option>
              </select>
            </div>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Assignment
            </button>
          </div>

          {/* Assignments Table */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{assignment.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignment.task}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignment.assignee}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignment.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assignment.status)}`}>
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(assignment.priority)}`}>
                        {assignment.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignment.deadline}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-purple-600 hover:text-purple-900 mr-3">View</button>
                      <button className="text-blue-600 hover:text-blue-900">Update</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Clinical Protocols Tab */}
      {activeTab === 'protocols' && (
        <div className="space-y-6">
          {/* Protocol Controls */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search protocols..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option>All Categories</option>
                <option>Surgery</option>
                <option>Safety</option>
                <option>Emergency</option>
                <option>Quality</option>
              </select>
            </div>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Protocol
            </button>
          </div>

          {/* Protocol Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {protocols.map((protocol) => (
              <div key={protocol.id} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{protocol.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(protocol.status)}`}>
                    {protocol.status}
                  </span>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{protocol.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Compliance:</span>
                    <span className="font-medium text-green-600">{protocol.compliance}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">{protocol.lastUpdated}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-purple-100 text-purple-700 py-2 px-3 rounded-md text-sm font-medium hover:bg-purple-200">
                    View Protocol
                  </button>
                  <button className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-200">
                    Update
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quality & Compliance Tab */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          {/* Compliance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {compliance.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{item.area}</h3>
                  {getTrendIcon(item.trend)}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Score:</span>
                    <span className="font-bold text-2xl text-green-600">{item.score}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Audit:</span>
                    <span className="font-medium">{item.lastAudit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Next Audit:</span>
                    <span className="font-medium">{item.nextAudit}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Compliance Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Compliance Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center gap-3 p-4 border-2 border-green-200 rounded-lg hover:border-green-400 transition-colors">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Schedule Audit</div>
                  <div className="text-sm text-gray-600">Plan compliance review</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Update Standards</div>
                  <div className="text-sm text-gray-600">Modify guidelines</div>
                </div>
              </button>

              <button className="flex items-center gap-3 p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition-colors">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Download className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Generate Report</div>
                  <div className="text-sm text-gray-600">Export compliance data</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleClinicalManagementPage;

