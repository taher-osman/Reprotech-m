import api from '@/services/api';

// Mock API function for development
const mockApiCall = async (endpoint: string, data: any, method: string = 'GET'): Promise<any> => {
  console.log(`[MOCK API] ${method} ${endpoint}`, data);
  await new Promise(resolve => setTimeout(resolve, 100));
  return data;
};

import {
  Tender,
  TenderFormData,
  TenderFilter,
  TenderDashboardData,
  TenderCalendarEvent,
  TenderStatus,
  TenderSource,
  TenderCategory,
  TenderType,
  TenderMode,
  TenderLanguage,
  AttachmentType,
  TenderTeamMember,
  TeamMemberAvailability,
  DepartmentWorkload,
  TenderTask,
  TaskTemplate,
  TenderWorkflowEvent,
  TenderMilestone,
  TenderProgress,
  WorkflowTemplate,
  HRIntegration,
  InventoryIntegration,
  InventoryRequestItem,
  FinanceIntegration,
  FinanceBreakdownItem,
  ProjectIntegration,
  ProjectPhase
} from '../types/tenderTypes';

const tenderApi = {
  // Dashboard and Overview
  getDashboard: async (): Promise<TenderDashboardData> => {
    const response = await api.get('/tender-management/dashboard');
    return response.data;
  },

  getStats: async (): Promise<any> => {
    const response = await api.get('/tender-management/stats');
    return response.data;
  },

  // CRUD Operations
  getAllTenders: async (filters?: TenderFilter): Promise<Tender[]> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.status) {
        filters.status.forEach(status => params.append('status', status));
      }
      if (filters.source) {
        filters.source.forEach(source => params.append('source', source));
      }
      if (filters.category) {
        filters.category.forEach(category => params.append('category', category));
      }
      if (filters.assigned_manager) {
        params.append('assigned_manager', filters.assigned_manager);
      }
      if (filters.date_range) {
        params.append('start_date', filters.date_range.start);
        params.append('end_date', filters.date_range.end);
      }
      if (filters.deadline_urgent) {
        params.append('deadline_urgent', 'true');
      }
    }
    
    const response = await api.get(`/tender-management/tenders?${params.toString()}`);
    return response.data;
  },

  getTenderById: async (tenderId: string): Promise<Tender> => {
    const response = await api.get(`/tender-management/tenders/${tenderId}`);
    return response.data;
  },

  createTender: async (tenderData: TenderFormData): Promise<Tender> => {
    const response = await api.post('/tender-management/tenders', tenderData);
    return response.data;
  },

  updateTender: async (tenderId: string, tenderData: Partial<TenderFormData>): Promise<Tender> => {
    const response = await api.put(`/tender-management/tenders/${tenderId}`, tenderData);
    return response.data;
  },

  deleteTender: async (tenderId: string): Promise<void> => {
    await api.delete(`/tender-management/tenders/${tenderId}`);
  },

  // Status Management
  updateTenderStatus: async (tenderId: string, status: TenderStatus): Promise<Tender> => {
    const response = await api.patch(`/tender-management/tenders/${tenderId}/status`, { status });
    return response.data;
  },

  // Studies Management
  updateStudies: async (tenderId: string, studies: {
    technical_study?: string;
    financial_study?: string;
    hr_study?: string;
    compliance_study?: string;
  }): Promise<any> => {
    const response = await api.put(`/tender-management/tenders/${tenderId}/studies`, studies);
    return response.data;
  },

  // Attachments Management
  uploadAttachment: async (tenderId: string, file: File, type: AttachmentType): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await api.post(`/tender-management/tenders/${tenderId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteAttachment: async (tenderId: string, attachmentId: string): Promise<void> => {
    await api.delete(`/tender-management/tenders/${tenderId}/attachments/${attachmentId}`);
  },

  // Comments Management
  getComments: async (tenderId: string): Promise<any[]> => {
    const response = await api.get(`/tender-management/tenders/${tenderId}/comments`);
    return response.data;
  },

  addComment: async (tenderId: string, comment: { content: string; is_internal: boolean }): Promise<any> => {
    const response = await api.post(`/tender-management/tenders/${tenderId}/comments`, comment);
    return response.data;
  },

  // History Management
  getHistory: async (tenderId: string): Promise<any[]> => {
    const response = await api.get(`/tender-management/tenders/${tenderId}/history`);
    return response.data;
  },

  // Calendar Events
  getCalendarEvents: async (startDate: string, endDate: string): Promise<TenderCalendarEvent[]> => {
    const response = await api.get(`/tender-management/calendar?start=${startDate}&end=${endDate}`);
    return response.data;
  },

  // Bulk Operations
  bulkUpdateStatus: async (tenderIds: string[], status: TenderStatus): Promise<void> => {
    await api.patch('/tender-management/tenders/bulk-status', { tender_ids: tenderIds, status });
  },

  bulkDelete: async (tenderIds: string[]): Promise<void> => {
    await api.delete('/tender-management/tenders/bulk', { data: { tender_ids: tenderIds } });
  },

  // Export Operations
  exportTenders: async (filters?: TenderFilter, format: 'csv' | 'excel' | 'pdf' = 'excel'): Promise<Blob> => {
    const params = new URLSearchParams();
    if (filters) {
      // Add filter parameters
    }
    params.append('format', format);
    
    const response = await api.get(`/tender-management/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Import Operations
  importTenders: async (file: File): Promise<{ success: number; errors: any[] }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/tender-management/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Deadline Alerts
  getUrgentDeadlines: async (): Promise<Tender[]> => {
    const response = await api.get('/tender-management/deadlines/urgent');
    return response.data;
  },

  // Search and Filter Options
  getFilterOptions: async (): Promise<{
    sources: TenderSource[];
    categories: TenderCategory[];
    types: TenderType[];
    modes: TenderMode[];
    languages: TenderLanguage[];
    managers: { id: string; name: string }[];
    departments: string[];
  }> => {
    const response = await api.get('/tender-management/filter-options');
    return response.data;
  },

  // Advanced Search
  searchTenders: async (query: string, filters?: TenderFilter): Promise<Tender[]> => {
    const params = new URLSearchParams();
    params.append('q', query);
    if (filters) {
      // Add filter parameters
    }
    
    const response = await api.get(`/tender-management/search?${params.toString()}`);
    return response.data;
  },

  // Analytics and Reports
  getAnalytics: async (period: 'week' | 'month' | 'quarter' | 'year' = 'month'): Promise<any> => {
    const response = await api.get(`/tender-management/analytics?period=${period}`);
    return response.data;
  },

  getSuccessRateReport: async (startDate: string, endDate: string): Promise<any> => {
    const response = await api.get(`/tender-management/reports/success-rate?start=${startDate}&end=${endDate}`);
    return response.data;
  },

  // Notifications and Alerts
  getNotifications: async (): Promise<any[]> => {
    const response = await api.get('/tender-management/notifications');
    return response.data;
  },

  markNotificationRead: async (notificationId: string): Promise<void> => {
    await api.patch(`/tender-management/notifications/${notificationId}/read`);
  },

  // Team Management
  assignTeamMember: async (tenderId: string, userId: string, role: string): Promise<void> => {
    await api.post(`/tender-management/tenders/${tenderId}/team`, { user_id: userId, role });
  },

  removeTeamMember: async (tenderId: string, userId: string): Promise<void> => {
    await api.delete(`/tender-management/tenders/${tenderId}/team/${userId}`);
  },

  getTeamMembers: async (tenderId: string): Promise<any[]> => {
    const response = await api.get(`/tender-management/tenders/${tenderId}/team`);
    return response.data;
  }
};

// Phase 2: Team Management Endpoints
const tenderTeamApi = {
  // Get team members for a tender
  getTeamMembers: async (tenderId: string): Promise<TenderTeamMember[]> => {
    return mockApiCall(`/api/tenders/${tenderId}/team`, []);
  },

  // Add team member to tender
  addTeamMember: async (tenderId: string, member: Omit<TenderTeamMember, 'assigned_at'>): Promise<TenderTeamMember> => {
    return mockApiCall(`/api/tenders/${tenderId}/team`, {
      ...member,
      assigned_at: new Date().toISOString()
    });
  },

  // Update team member role
  updateTeamMember: async (tenderId: string, memberId: string, updates: Partial<TenderTeamMember>): Promise<TenderTeamMember> => {
    return mockApiCall(`/api/tenders/${tenderId}/team/${memberId}`, updates);
  },

  // Remove team member
  removeTeamMember: async (tenderId: string, memberId: string): Promise<void> => {
    return mockApiCall(`/api/tenders/${tenderId}/team/${memberId}`, null, 'DELETE');
  },

  // Get available employees from HR module
  getAvailableEmployees: async (): Promise<TeamMemberAvailability[]> => {
    return mockApiCall('/api/hr/employees/available', []);
  },

  // Get department workloads
  getDepartmentWorkloads: async (): Promise<DepartmentWorkload[]> => {
    return mockApiCall('/api/hr/departments/workload', []);
  }
};

// Phase 2: Task Management Endpoints
const tenderTaskApi = {
  // Get tasks for a tender
  getTasks: async (tenderId: string): Promise<TenderTask[]> => {
    return mockApiCall(`/api/tenders/${tenderId}/tasks`, []);
  },

  // Create new task
  createTask: async (tenderId: string, task: Omit<TenderTask, 'task_id' | 'created_at' | 'updated_at'>): Promise<TenderTask> => {
    return mockApiCall(`/api/tenders/${tenderId}/tasks`, {
      ...task,
      task_id: `task-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  },

  // Update task
  updateTask: async (tenderId: string, taskId: string, updates: Partial<TenderTask>): Promise<TenderTask> => {
    return mockApiCall(`/api/tenders/${tenderId}/tasks/${taskId}`, {
      ...updates,
      updated_at: new Date().toISOString()
    });
  },

  // Delete task
  deleteTask: async (tenderId: string, taskId: string): Promise<void> => {
    return mockApiCall(`/api/tenders/${tenderId}/tasks/${taskId}`, null, 'DELETE');
  },

  // Add comment to task
  addTaskComment: async (tenderId: string, taskId: string, comment: Omit<TaskComment, 'comment_id' | 'created_at'>): Promise<TaskComment> => {
    return mockApiCall(`/api/tenders/${tenderId}/tasks/${taskId}/comments`, {
      ...comment,
      comment_id: `comment-${Date.now()}`,
      created_at: new Date().toISOString()
    });
  },

  // Get task templates
  getTaskTemplates: async (category?: TenderCategory): Promise<TaskTemplate[]> => {
    return mockApiCall(`/api/tasks/templates${category ? `?category=${category}` : ''}`, []);
  }
};

// Phase 2: Workflow Tracking Endpoints
const tenderWorkflowApi = {
  // Get workflow events
  getWorkflowEvents: async (tenderId: string): Promise<TenderWorkflowEvent[]> => {
    return mockApiCall(`/api/tenders/${tenderId}/workflow/events`, []);
  },

  // Create workflow event
  createWorkflowEvent: async (tenderId: string, event: Omit<TenderWorkflowEvent, 'event_id' | 'timestamp'>): Promise<TenderWorkflowEvent> => {
    return mockApiCall(`/api/tenders/${tenderId}/workflow/events`, {
      ...event,
      event_id: `event-${Date.now()}`,
      timestamp: new Date().toISOString()
    });
  },

  // Get milestones
  getMilestones: async (tenderId: string): Promise<TenderMilestone[]> => {
    return mockApiCall(`/api/tenders/${tenderId}/milestones`, []);
  },

  // Create milestone
  createMilestone: async (tenderId: string, milestone: Omit<TenderMilestone, 'milestone_id'>): Promise<TenderMilestone> => {
    return mockApiCall(`/api/tenders/${tenderId}/milestones`, {
      ...milestone,
      milestone_id: `milestone-${Date.now()}`
    });
  },

  // Update milestone
  updateMilestone: async (tenderId: string, milestoneId: string, updates: Partial<TenderMilestone>): Promise<TenderMilestone> => {
    return mockApiCall(`/api/tenders/${tenderId}/milestones/${milestoneId}`, updates);
  },

  // Get progress analytics
  getProgress: async (tenderId: string): Promise<TenderProgress> => {
    return mockApiCall(`/api/tenders/${tenderId}/progress`, {});
  },

  // Export timeline
  exportTimeline: async (tenderId: string, format: 'pdf' | 'excel' | 'csv'): Promise<Blob> => {
    return mockApiCall(`/api/tenders/${tenderId}/workflow/export?format=${format}`, new Blob());
  },

  // Get workflow templates
  getWorkflowTemplates: async (category?: TenderCategory): Promise<WorkflowTemplate[]> => {
    return mockApiCall(`/api/workflow/templates${category ? `?category=${category}` : ''}`, []);
  }
};

// Phase 2: Module Integration Endpoints
const tenderIntegrationApi = {
  // HR Integration
  hr: {
    getRequests: async (tenderId: string): Promise<HRIntegration[]> => {
      return mockApiCall(`/api/tenders/${tenderId}/integrations/hr`, []);
    },

    createRequest: async (tenderId: string, request: Omit<HRIntegration, 'integration_id' | 'requested_at'>): Promise<HRIntegration> => {
      return mockApiCall(`/api/tenders/${tenderId}/integrations/hr`, {
        ...request,
        integration_id: `hr-${Date.now()}`,
        requested_at: new Date().toISOString()
      });
    },

    updateRequest: async (tenderId: string, requestId: string, updates: Partial<HRIntegration>): Promise<HRIntegration> => {
      return mockApiCall(`/api/tenders/${tenderId}/integrations/hr/${requestId}`, updates);
    },

    approveRequest: async (tenderId: string, requestId: string, approverNotes?: string): Promise<HRIntegration> => {
      return mockApiCall(`/api/tenders/${tenderId}/integrations/hr/${requestId}/approve`, {
        status: 'APPROVED',
        approved_by: 'current_user',
        approved_at: new Date().toISOString(),
        notes: approverNotes
      });
    },

    rejectRequest: async (tenderId: string, requestId: string, rejectionReason: string): Promise<HRIntegration> => {
      return mockApiCall(`/api/tenders/${tenderId}/integrations/hr/${requestId}/reject`, {
        status: 'REJECTED',
        notes: rejectionReason
      });
    }
  },

  // Inventory Integration
  inventory: {
    getRequests: async (tenderId: string): Promise<InventoryIntegration[]> => {
      return mockApiCall(`/api/tenders/${tenderId}/integrations/inventory`, []);
    },

    createRequest: async (tenderId: string, request: Omit<InventoryIntegration, 'integration_id' | 'requested_at'>): Promise<InventoryIntegration> => {
      return mockApiCall(`/api/tenders/${tenderId}/integrations/inventory`, {
        ...request,
        integration_id: `inv-${Date.now()}`,
        requested_at: new Date().toISOString()
      });
    },

    updateRequest: async (tenderId: string, requestId: string, updates: Partial<InventoryIntegration>): Promise<InventoryIntegration> => {
      return mockApiCall(`/api/tenders/${tenderId}/integrations/inventory/${requestId}`, updates);
    },

    checkAvailability: async (items: InventoryRequestItem[]): Promise<{ item_id: string; available: boolean; current_stock: number }[]> => {
      return mockApiCall('/api/inventory/check-availability', []);
    },

    reserveStock: async (tenderId: string, requestId: string): Promise<{ success: boolean; reservation_id: string }> => {
      return mockApiCall(`/api/tenders/${tenderId}/integrations/inventory/${requestId}/reserve`, {
        success: true,
        reservation_id: `res-${Date.now()}`
      });
    }
  },

  // Finance Integration
  finance: {
    getRequests: async (tenderId: string): Promise<FinanceIntegration[]> => {
      return mockApiCall(`/api/tenders/${tenderId}/integrations/finance`, []);
    },

    createRequest: async (tenderId: string, request: Omit<FinanceIntegration, 'integration_id' | 'requested_at'>): Promise<FinanceIntegration> => {
      return mockApiCall(`/api/tenders/${tenderId}/integrations/finance`, {
        ...request,
        integration_id: `fin-${Date.now()}`,
        requested_at: new Date().toISOString()
      });
    },

    updateRequest: async (tenderId: string, requestId: string, updates: Partial<FinanceIntegration>): Promise<FinanceIntegration> => {
      return mockApiCall(`/api/tenders/${tenderId}/integrations/finance/${requestId}`, updates);
    },

    getBudgetStatus: async (tenderId: string): Promise<{ allocated: number; spent: number; remaining: number; currency: string }> => {
      return mockApiCall(`/api/tenders/${tenderId}/budget/status`, {
        allocated: 0,
        spent: 0,
        remaining: 0,
        currency: 'USD'
      });
    },

    generateCostEstimate: async (tenderId: string, parameters: any): Promise<{ estimate: number; breakdown: FinanceBreakdownItem[]; confidence: number }> => {
      return mockApiCall(`/api/tenders/${tenderId}/finance/estimate`, {
        estimate: 0,
        breakdown: [],
        confidence: 0
      });
    }
  },

  // Project Integration
  project: {
    getProjects: async (tenderId: string): Promise<ProjectIntegration[]> => {
      return mockApiCall(`/api/tenders/${tenderId}/integrations/project`, []);
    },

    createProject: async (tenderId: string, project: Omit<ProjectIntegration, 'integration_id' | 'created_at'>): Promise<ProjectIntegration> => {
      return mockApiCall(`/api/tenders/${tenderId}/integrations/project`, {
        ...project,
        integration_id: `proj-${Date.now()}`,
        created_at: new Date().toISOString()
      });
    },

    updateProject: async (tenderId: string, projectId: string, updates: Partial<ProjectIntegration>): Promise<ProjectIntegration> => {
      return mockApiCall(`/api/tenders/${tenderId}/integrations/project/${projectId}`, updates);
    },

    activateProject: async (tenderId: string, projectId: string): Promise<ProjectIntegration> => {
      return mockApiCall(`/api/tenders/${tenderId}/integrations/project/${projectId}/activate`, {
        status: 'Active',
        start_date: new Date().toISOString()
      });
    },

    getProjectTemplates: async (category?: TenderCategory): Promise<{ template_id: string; name: string; phases: ProjectPhase[] }[]> => {
      return mockApiCall(`/api/projects/templates${category ? `?category=${category}` : ''}`, []);
    }
  }
};

// Phase 2: Analytics and Reporting Endpoints
const tenderAnalyticsApi = {
  // Get tender progress summary
  getProgressSummary: async (tenderId: string): Promise<{
    overall_completion: number;
    studies_status: { [key: string]: number };
    team_performance: { user_id: string; completion_rate: number }[];
    risk_indicators: { type: string; level: 'low' | 'medium' | 'high'; description: string }[];
    upcoming_deadlines: { item: string; date: string; days_remaining: number }[];
  }> => {
    return mockApiCall(`/api/tenders/${tenderId}/analytics/summary`, {
      overall_completion: 0,
      studies_status: {},
      team_performance: [],
      risk_indicators: [],
      upcoming_deadlines: []
    });
  },

  // Get team workload analysis
  getTeamWorkload: async (tenderId: string): Promise<{
    member_utilization: { user_id: string; user_name: string; workload_percentage: number; efficiency: number }[];
    department_distribution: { department: string; task_count: number; completion_rate: number }[];
    bottlenecks: { area: string; impact: string; recommendation: string }[];
  }> => {
    return mockApiCall(`/api/tenders/${tenderId}/analytics/team`, {
      member_utilization: [],
      department_distribution: [],
      bottlenecks: []
    });
  },

  // Get deadline risk analysis
  getDeadlineRisk: async (tenderId: string): Promise<{
    overall_risk: 'low' | 'medium' | 'high';
    critical_path: { task_id: string; task_name: string; due_date: string; completion: number }[];
    recommendations: string[];
    scenario_analysis: { scenario: string; probability: number; impact: string }[];
  }> => {
    return mockApiCall(`/api/tenders/${tenderId}/analytics/deadline-risk`, {
      overall_risk: 'low',
      critical_path: [],
      recommendations: [],
      scenario_analysis: []
    });
  },

  // Generate reports
  generateReport: async (tenderId: string, reportType: 'progress' | 'team' | 'financial' | 'timeline', format: 'pdf' | 'excel'): Promise<Blob> => {
    return mockApiCall(`/api/tenders/${tenderId}/reports/${reportType}?format=${format}`, new Blob());
  }
};

// Phase 2: Real-time Updates and Notifications
const tenderNotificationApi = {
  // Subscribe to tender updates
  subscribeTo: async (tenderId: string, eventTypes: string[]): Promise<{ subscription_id: string }> => {
    return mockApiCall(`/api/tenders/${tenderId}/subscribe`, {
      subscription_id: `sub-${Date.now()}`
    });
  },

  // Get recent notifications
  getNotifications: async (tenderId: string, limit: number = 10): Promise<{
    notification_id: string;
    type: string;
    title: string;
    message: string;
    created_at: string;
    read: boolean;
  }[]> => {
    return mockApiCall(`/api/tenders/${tenderId}/notifications?limit=${limit}`, []);
  },

  // Mark notifications as read
  markAsRead: async (tenderId: string, notificationIds: string[]): Promise<void> => {
    return mockApiCall(`/api/tenders/${tenderId}/notifications/read`, null);
  },

  // Get alert settings
  getAlertSettings: async (tenderId: string): Promise<{
    email_notifications: boolean;
    deadline_warnings: { enabled: boolean; days_before: number };
    task_assignments: boolean;
    status_changes: boolean;
    integration_updates: boolean;
  }> => {
    return mockApiCall(`/api/tenders/${tenderId}/alert-settings`, {
      email_notifications: true,
      deadline_warnings: { enabled: true, days_before: 3 },
      task_assignments: true,
      status_changes: true,
      integration_updates: true
    });
  },

  // Update alert settings
  updateAlertSettings: async (tenderId: string, settings: any): Promise<void> => {
    return mockApiCall(`/api/tenders/${tenderId}/alert-settings`, null);
  }
};

// Enhanced main tender API with Phase 2 integrations
const enhancedTenderApi = {
  ...tenderApi,
  
  // Enhanced tender retrieval with Phase 2 data
  getTenderWithExtendedData: async (tenderId: string): Promise<Tender> => {
    const [
      tender,
      teamMembers,
      tasks,
      workflowEvents,
      milestones,
      progress,
      hrIntegrations,
      inventoryIntegrations,
      financeIntegrations,
      projectIntegrations
    ] = await Promise.all([
      tenderApi.getTender(tenderId),
      tenderTeamApi.getTeamMembers(tenderId),
      tenderTaskApi.getTasks(tenderId),
      tenderWorkflowApi.getWorkflowEvents(tenderId),
      tenderWorkflowApi.getMilestones(tenderId),
      tenderWorkflowApi.getProgress(tenderId),
      tenderIntegrationApi.hr.getRequests(tenderId),
      tenderIntegrationApi.inventory.getRequests(tenderId),
      tenderIntegrationApi.finance.getRequests(tenderId),
      tenderIntegrationApi.project.getProjects(tenderId)
    ]);

    return {
      ...tender,
      team_members: teamMembers,
      tasks,
      workflow_events: workflowEvents,
      milestones,
      progress,
      integrations: {
        hr: hrIntegrations,
        inventory: inventoryIntegrations,
        finance: financeIntegrations,
        project: projectIntegrations
      }
    };
  },

  // Bulk operations for Phase 2
  bulkUpdateTasks: async (tenderId: string, updates: { task_id: string; updates: Partial<TenderTask> }[]): Promise<TenderTask[]> => {
    return mockApiCall(`/api/tenders/${tenderId}/tasks/bulk-update`, []);
  },

  cloneTender: async (tenderId: string, newTitle: string): Promise<Tender> => {
    return mockApiCall(`/api/tenders/${tenderId}/clone`, {});
  },

  archiveTender: async (tenderId: string): Promise<void> => {
    return mockApiCall(`/api/tenders/${tenderId}/archive`, null);
  }
};

// Phase 3: Award Handling API
const tenderAwardApi = {
  processAward: async (tenderId: string, awardData: any) => {
    // Mock implementation - would integrate with actual backend
    console.log('Processing tender award:', { tenderId, awardData });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      award_id: `award-${Date.now()}`,
      project_id: `proj-${tenderId.slice(-6)}`,
      contract_flow_id: `contract-${Date.now()}`,
      integrations_created: {
        project_module: 'completed',
        finance_module: 'completed',
        hr_module: 'completed',
        inventory_module: 'pending'
      },
      notifications_sent: [
        { type: 'email', recipients: awardData.team_assignments?.map((t: any) => t.user_id) || [] },
        { type: 'system', recipients: ['finance-dept', 'hr-dept', 'legal-dept'] }
      ]
    };
  },

  getAwardStatus: async (tenderId: string) => {
    return mockApiCall(`/api/tenders/${tenderId}/award/status`, {
      is_awarded: false,
      award_date: null,
      project_id: null,
      contract_status: 'not_started'
    });
  },

  cancelAward: async (awardId: string, reason: string) => {
    return mockApiCall(`/api/awards/${awardId}/cancel`, { success: true });
  }
};

// Contract Approval API
const contractApprovalApi = {
  getContractTemplates: async (projectType: string) => {
    return mockApiCall(`/api/contracts/templates?type=${projectType}`, [
      {
        template_id: 'template-001',
        template_name: 'Medical Equipment Supply Contract',
        project_type: 'Medical',
        approval_workflow: [
          { step_name: 'Department Manager Review', approver_role: 'Department Manager' },
          { step_name: 'HR Approval', approver_role: 'HR Manager' },
          { step_name: 'Finance Review', approver_role: 'Finance Director' },
          { step_name: 'CEO Final Approval', approver_role: 'CEO' }
        ]
      }
    ]);
  },

  createContractFlow: async (tenderId: string, templateId: string) => {
    return mockApiCall(`/api/tenders/${tenderId}/contract/flow`, {
      flow_id: `flow-${Date.now()}`,
      current_step: 1,
      overall_status: 'Draft'
    });
  },

  submitApprovalStep: async (flowId: string, stepId: string, action: string, comments: string) => {
    return mockApiCall(`/api/contracts/flows/${flowId}/steps/${stepId}`, { success: true });
  },

  uploadContractDocument: async (flowId: string, documentType: string, file: File) => {
    return mockApiCall(`/api/contracts/flows/${flowId}/documents`, {
      document_id: `doc-${Date.now()}`,
      file_url: `/uploads/contracts/${file.name}`,
      version: 1
    });
  },

  getApprovalHistory: async (flowId: string) => {
    return mockApiCall(`/api/contracts/flows/${flowId}/history`, [
      {
        action_id: 'action-001',
        step_id: 'step-001',
        action: 'approved',
        user_name: 'Dr. Ahmed Hassan',
        timestamp: new Date().toISOString(),
        comments: 'Technical specifications approved.'
      }
    ]);
  }
};

// Document Management API
const documentApi = {
  getFolders: async (tenderId: string) => {
    return mockApiCall(`/api/tenders/${tenderId}/documents/folders`, [
      {
        folder_id: 'folder-001',
        folder_name: 'RFP & TOR',
        document_count: 8,
        access_level: 'public'
      },
      {
        folder_id: 'folder-002',
        folder_name: 'Technical Proposals',
        document_count: 15,
        access_level: 'restricted'
      }
    ]);
  },

  getDocuments: async (tenderId: string, folderId?: string) => {
    return mockApiCall(`/api/tenders/${tenderId}/documents${folderId ? `?folder=${folderId}` : ''}`, [
      {
        document_id: 'doc-001',
        filename: 'RFP_Medical_Equipment_2025.pdf',
        file_type: 'pdf',
        file_size: 2845000,
        folder: 'RFP & TOR',
        tags: ['RFP', 'Medical Equipment'],
        uploaded_by: 'Dr. Ahmed Hassan',
        uploaded_date: new Date().toISOString(),
        status: 'approved'
      }
    ]);
  },

  uploadDocument: async (tenderId: string, folderId: string, file: File, metadata: any) => {
    return mockApiCall(`/api/tenders/${tenderId}/documents`, {
      document_id: `doc-${Date.now()}`,
      file_url: `/uploads/documents/${file.name}`,
      version: 1
    });
  },

  updateDocumentPermissions: async (documentId: string, permissions: any[]) => {
    return mockApiCall(`/api/documents/${documentId}/permissions`, { success: true });
  },

  deleteDocument: async (documentId: string) => {
    return mockApiCall(`/api/documents/${documentId}`, { success: true });
  }
};

// Compliance Tracking API
const complianceApi = {
  getComplianceStatus: async (tenderId: string) => {
    return mockApiCall(`/api/tenders/${tenderId}/compliance`, {
      overall_status: 'At Risk',
      requirements: [
        {
          requirement_id: 'req-001',
          requirement_name: 'Contract Signature',
          due_date: '2025-07-20',
          status: 'Pending',
          priority: 'Critical'
        }
      ],
      alerts: [
        {
          alert_id: 'alert-001',
          alert_type: 'deadline_approaching',
          severity: 'Warning',
          message: 'Contract signature deadline in 3 days'
        }
      ]
    });
  },

  updateRequirementStatus: async (requirementId: string, status: string, evidence?: File[]) => {
    return mockApiCall(`/api/compliance/requirements/${requirementId}`, { success: true });
  },

  acknowledgeAlert: async (alertId: string) => {
    return mockApiCall(`/api/compliance/alerts/${alertId}/acknowledge`, { success: true });
  }
};

export default enhancedTenderApi; 