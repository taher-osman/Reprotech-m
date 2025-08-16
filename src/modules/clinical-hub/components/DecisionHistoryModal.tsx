import React, { useState, useMemo } from 'react';
import {
  X,
  History,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
  Download,
  Search,
  ArrowRight,
  Activity,
  Stethoscope,
  Syringe,
  AlertCircle
} from 'lucide-react';
import { WorkflowDecision, AutomatedAction } from '../../../services/workflowService';

interface DecisionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  decisions: WorkflowDecision[];
  automatedActions: AutomatedAction[];
}

const DecisionHistoryModal: React.FC<DecisionHistoryModalProps> = ({
  isOpen,
  onClose,
  decisions,
  automatedActions
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState<'TODAY' | 'WEEK' | 'MONTH' | 'ALL'>('ALL');
  const [activeTab, setActiveTab] = useState<'decisions' | 'actions'>('decisions');

  const filteredDecisions = useMemo(() => {
    let filtered = decisions;

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(decision =>
        decision.animalName.toLowerCase().includes(search) ||
        decision.animalId.toLowerCase().includes(search) ||
        decision.consultantName.toLowerCase().includes(search) ||
        decision.assignedVet.toLowerCase().includes(search) ||
        decision.reasoning.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(decision => decision.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(decision => decision.decisionType === typeFilter);
    }

    // Date range filter
    if (dateRange !== 'ALL') {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (dateRange) {
        case 'TODAY':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'WEEK':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'MONTH':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(decision => 
        new Date(decision.timestamp) >= cutoffDate
      );
    }

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [decisions, searchTerm, statusFilter, typeFilter, dateRange]);

  const filteredActions = useMemo(() => {
    let filtered = automatedActions;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(action =>
        action.description.toLowerCase().includes(search) ||
        action.type.toLowerCase().includes(search) ||
        action.targetModule?.toLowerCase().includes(search)
      );
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(action => action.status === statusFilter);
    }

    return filtered.sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
  }, [automatedActions, searchTerm, statusFilter]);

  const exportHistory = () => {
    const dataToExport = activeTab === 'decisions' ? filteredDecisions : filteredActions;
    const headers = activeTab === 'decisions' 
      ? ['Timestamp', 'Animal', 'Decision Type', 'Consultant', 'Assigned Vet', 'Status', 'Reasoning']
      : ['Scheduled Date', 'Decision ID', 'Action Type', 'Description', 'Status', 'Executed At'];

    const csvContent = [
      headers.join(','),
      ...dataToExport.map(item => {
        if (activeTab === 'decisions') {
          const decision = item as WorkflowDecision;
          return [
            new Date(decision.timestamp).toLocaleString(),
            `"${decision.animalName} (${decision.animalId})"`,
            decision.decisionType,
            decision.consultantName,
            decision.assignedVet,
            decision.status,
            `"${decision.reasoning}"`
          ].join(',');
        } else {
          const action = item as AutomatedAction;
          return [
            new Date(action.scheduledDate).toLocaleString(),
            action.decisionId,
            action.type,
            `"${action.description}"`,
            action.status,
            action.executedAt ? new Date(action.executedAt).toLocaleString() : 'N/A'
          ].join(',');
        }
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}_history_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'EXECUTED':
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'FAILED':
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-600 bg-red-100';
      case 'HIGH': return 'text-orange-600 bg-orange-100';
      case 'MEDIUM': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-screen overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <History className="h-6 w-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Decision History & Automated Actions</h3>
                <p className="text-sm text-gray-500">
                  {decisions.length} decisions • {automatedActions.length} automated actions
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={exportHistory}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => setActiveTab('decisions')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'decisions'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Workflow Decisions ({decisions.length})
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'actions'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Automated Actions ({automatedActions.length})
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by animal, consultant, or reasoning..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="EXECUTED">Executed</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            {activeTab === 'decisions' && (
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Types</option>
                <option value="ET">ET</option>
                <option value="OPU">OPU</option>
                <option value="FLUSHING">Flushing</option>
                <option value="RECHECK">Recheck</option>
                <option value="BREEDING">Breeding</option>
                <option value="INJECTION">Injection</option>
              </select>
            )}

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as any)}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Time</option>
              <option value="TODAY">Today</option>
              <option value="WEEK">Last Week</option>
              <option value="MONTH">Last Month</option>
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
          {activeTab === 'decisions' ? (
            <div className="p-6">
              {filteredDecisions.length === 0 ? (
                <div className="text-center py-12">
                  <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No workflow decisions found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredDecisions.map((decision) => (
                    <div key={decision.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            {getStatusIcon(decision.status)}
                            <span className="font-medium text-gray-900">
                              {decision.animalName} ({decision.animalId})
                            </span>
                            <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                              {decision.decisionType}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(decision.priority)}`}>
                              {decision.priority}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div>
                              <div className="text-sm text-gray-500">Consultant</div>
                              <div className="font-medium">{decision.consultantName}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Assigned Vet</div>
                              <div className="font-medium">{decision.assignedVet}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Scheduled Date</div>
                              <div className="font-medium">
                                {new Date(decision.scheduledDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="text-sm text-gray-500">Clinical Reasoning</div>
                            <div className="text-sm text-gray-700 bg-gray-50 rounded p-2">
                              {decision.reasoning}
                            </div>
                          </div>

                          {decision.followUpSchedule && decision.followUpSchedule.length > 0 && (
                            <div>
                              <div className="text-sm text-gray-500 mb-1">Follow-up Schedule</div>
                              <div className="text-sm space-x-2">
                                {decision.followUpSchedule.map((followUp, idx) => (
                                  <span key={idx} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                    {followUp.type} (Day +{followUp.daysFromProcedure})
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="text-right text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(decision.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-6">
              {filteredActions.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No automated actions found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredActions.map((action) => (
                    <div key={action.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(action.status)}
                          <div>
                            <div className="font-medium text-gray-900">{action.description}</div>
                            <div className="text-sm text-gray-500">
                              {action.type} • Decision: {action.decisionId}
                              {action.targetModule && ` • Module: ${action.targetModule}`}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right text-sm">
                          <div className="text-gray-900">
                            Scheduled: {new Date(action.scheduledDate).toLocaleString()}
                          </div>
                          {action.executedAt && (
                            <div className="text-green-600">
                              Executed: {new Date(action.executedAt).toLocaleString()}
                            </div>
                          )}
                          {action.errorMessage && (
                            <div className="text-red-600 text-xs">
                              Error: {action.errorMessage}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DecisionHistoryModal; 