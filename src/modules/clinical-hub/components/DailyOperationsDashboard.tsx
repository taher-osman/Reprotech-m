import React, { useState, useEffect } from 'react';
import { 
  DailyInjection, 
  NextDayExam, 
  DailyOperationsOverview,
  ActiveWorkflow 
} from '../types/workflowTypes';

interface DailyOperationsDashboardProps {
  dailyOverview: DailyOperationsOverview;
  todayInjections: DailyInjection[];
  tomorrowExams: NextDayExam[];
  activeWorkflows: ActiveWorkflow[];
  onExportInjectionList: () => void;
  onExportExamSchedule: () => void;
  onRefresh: () => void;
}

export const DailyOperationsDashboard: React.FC<DailyOperationsDashboardProps> = ({
  dailyOverview,
  todayInjections,
  tomorrowExams,
  activeWorkflows,
  onExportInjectionList,
  onExportExamSchedule,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'injections' | 'exams' | 'workflows'>('injections');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    setLastUpdate(new Date());
  }, [dailyOverview, todayInjections, tomorrowExams, activeWorkflows]);

  // Get medication distribution for chart
  const getMedicationDistribution = () => {
    const distribution: { [key: string]: number } = {};
    todayInjections.forEach(injection => {
      if (injection.medication && !injection.isNullAssignment) {
        distribution[injection.medication] = (distribution[injection.medication] || 0) + 1;
      }
    });
    return distribution;
  };

  // Get exam type distribution
  const getExamTypeDistribution = () => {
    const distribution: { [key: string]: number } = {};
    tomorrowExams.forEach(exam => {
      distribution[exam.examType] = (distribution[exam.examType] || 0) + 1;
    });
    return distribution;
  };

  // Get injection status colors
  const getInjectionStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      case 'NO_INJECTION': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get workflow phase colors
  const getWorkflowPhaseColor = (phase: string) => {
    switch (phase) {
      case 'PREPARATION': return 'bg-yellow-100 text-yellow-800';
      case 'EXECUTION': return 'bg-blue-100 text-blue-800';
      case 'MONITORING': return 'bg-purple-100 text-purple-800';
      case 'COMPLETION': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return 'Not scheduled';
    return new Date(timeString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Daily Operations Dashboard</h2>
            <p className="text-sm text-gray-600">
              Today: {new Date().toLocaleDateString()} • Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onRefresh}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={onExportInjectionList}
              className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Injection List
            </button>
            <button
              onClick={onExportExamSchedule}
              className="inline-flex items-center px-3 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Exam Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{dailyOverview.injections.total}</div>
            <div className="text-sm text-gray-600">Total Injections</div>
            <div className="text-xs text-gray-500">
              {dailyOverview.injections.noInjectionToday} no injection
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{dailyOverview.injections.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
            <div className="text-xs text-gray-500">
              {dailyOverview.injections.total > 0 ? Math.round((dailyOverview.injections.completed / dailyOverview.injections.total) * 100) : 0}% done
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{dailyOverview.injections.overdue}</div>
            <div className="text-sm text-gray-600">Overdue</div>
            <div className="text-xs text-gray-500">Need attention</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{dailyOverview.nextDayExams.total}</div>
            <div className="text-sm text-gray-600">Tomorrow Exams</div>
            <div className="text-xs text-gray-500">
              {dailyOverview.nextDayExams.estimatedTotalHours.toFixed(1)}h total
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{dailyOverview.workflows.active}</div>
            <div className="text-sm text-gray-600">Active Workflows</div>
            <div className="text-xs text-gray-500">
              {dailyOverview.workflows.completing} completing
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{dailyOverview.animals.total}</div>
            <div className="text-sm text-gray-600">Total Animals</div>
            <div className="text-xs text-gray-500">
              {dailyOverview.animals.inWorkflow} in workflows
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 py-2 border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'injections', name: 'Today\'s Injections', count: todayInjections.length, icon: '💉' },
            { id: 'exams', name: 'Tomorrow\'s Exams', count: tomorrowExams.length, icon: '🔬' },
            { id: 'workflows', name: 'Active Workflows', count: activeWorkflows.length, icon: '🔄' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'injections' && (
          <div className="space-y-4">
            {todayInjections.length > 0 ? (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Animal
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medication
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dosage & Route
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Scheduled Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Yard
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Technician
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {todayInjections.map((injection) => (
                      <tr key={injection.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {injection.animalName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {injection.internalNumber} • {injection.species}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">
                            {injection.isNullAssignment ? (
                              <span className="text-gray-500 italic">No injection today</span>
                            ) : (
                              injection.medication || 'Not specified'
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">
                            {!injection.isNullAssignment && (
                              <>
                                {injection.dosage || 'Not specified'}
                                {injection.route && (
                                  <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                    {injection.route}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {formatTime(injection.scheduledTime)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getInjectionStatusColor(injection.status)}`}>
                            {injection.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {injection.yard}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {injection.assignedTechnician || 'Unassigned'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5" />
                </svg>
                <p>No injections scheduled for today</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'exams' && (
          <div className="space-y-4">
            {tomorrowExams.length > 0 ? (
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Animal
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exam Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Scheduled Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Veterinarian
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Workflow
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tomorrowExams.map((exam) => (
                      <tr key={exam.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {exam.animalName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {exam.internalNumber} • {exam.species} • {exam.role}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900">
                            {exam.examType.replace('_', ' ')}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {formatTime(exam.scheduledTime)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {exam.assignedVet}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {exam.room || 'Not assigned'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {exam.estimatedDuration} min
                        </td>
                        <td className="px-4 py-3">
                          {exam.isWorkflowDriven ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              Workflow
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              Manual
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>No exams scheduled for tomorrow</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'workflows' && (
          <div className="space-y-4">
            {activeWorkflows.length > 0 ? (
              <div className="grid gap-4">
                {activeWorkflows.map((workflow) => (
                  <div key={workflow.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {workflow.animalName} - {workflow.templateName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Step {workflow.stepNumber} of {workflow.totalSteps}: {workflow.currentStepName}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getWorkflowPhaseColor(workflow.currentPhase)}`}>
                          {workflow.currentPhase}
                        </span>
                        <span className="text-sm text-gray-500">
                          {workflow.progressPercentage}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${workflow.progressPercentage}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Started:</span>
                        <span className="ml-2 text-gray-900">
                          {new Date(workflow.startedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Expected completion:</span>
                        <span className="ml-2 text-gray-900">
                          {new Date(workflow.expectedCompletionAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Assigned Vet:</span>
                        <span className="ml-2 text-gray-900">{workflow.assignedVet}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Priority:</span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                          workflow.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                          workflow.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                          workflow.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {workflow.priority}
                        </span>
                      </div>
                    </div>

                    {workflow.nextScheduledAction && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm">
                          <span className="font-medium text-blue-900">Next Action:</span>
                          <span className="ml-2 text-blue-800">{workflow.nextScheduledAction.description}</span>
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          Scheduled for: {new Date(workflow.nextScheduledAction.scheduledFor).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p>No active workflows</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 