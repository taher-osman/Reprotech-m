// Audit Trail and Approval Workflow Service
export interface AuditTrailEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: 'invoice' | 'payment' | 'budget' | 'contract' | 'service_cost' | 'asset' | 'cost_center';
  entityId: string;
  entityName: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  changesSummary: string;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  approvalRequired: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  complianceFlags: string[];
  metadata?: Record<string, any>;
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  description: string;
  entityType: string;
  triggerConditions: ApprovalTrigger[];
  approvalSteps: ApprovalStep[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalTrigger {
  id: string;
  type: 'amount_threshold' | 'percentage_change' | 'user_role' | 'entity_field' | 'time_based';
  field: string;
  operator: 'gt' | 'gte' | 'lt' | 'lte' | 'eq' | 'neq' | 'contains' | 'between';
  value: any;
  secondaryValue?: any;
  description: string;
}

export interface ApprovalStep {
  id: string;
  stepNumber: number;
  name: string;
  description: string;
  approverRoles: string[];
  approverUsers: string[];
  requiredApprovals: number;
  isParallel: boolean;
  timeLimit: number; // hours
  escalationUsers: string[];
  escalationAfter: number; // hours
  skipConditions?: ApprovalTrigger[];
  autoApproveConditions?: ApprovalTrigger[];
}

export interface ApprovalRequest {
  id: string;
  workflowId: string;
  entityType: string;
  entityId: string;
  entityName: string;
  requestedBy: string;
  requestedAt: string;
  currentStep: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  changesSummary: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  attachments: string[];
  comments: ApprovalComment[];
  stepApprovals: StepApproval[];
  escalations: ApprovalEscalation[];
  dueDate: string;
  completedAt?: string;
  totalSteps: number;
}

export interface ApprovalComment {
  id: string;
  userId: string;
  userName: string;
  comment: string;
  timestamp: string;
  isInternal: boolean;
}

export interface StepApproval {
  stepId: string;
  stepNumber: number;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  approvedBy?: string;
  approvedAt?: string;
  comments?: string;
  timeToApprove?: number; // minutes
}

export interface ApprovalEscalation {
  id: string;
  stepNumber: number;
  escalatedTo: string;
  escalatedAt: string;
  reason: string;
  resolvedAt?: string;
  resolution?: string;
}

export interface ComplianceReport {
  id: string;
  reportType: 'audit_trail' | 'approval_summary' | 'risk_assessment' | 'user_activity';
  generatedAt: string;
  generatedBy: string;
  period: {
    startDate: string;
    endDate: string;
  };
  filters: Record<string, any>;
  summary: {
    totalEntries: number;
    criticalActions: number;
    pendingApprovals: number;
    complianceViolations: number;
    averageApprovalTime: number;
  };
  details: any[];
  exportFormats: ('pdf' | 'excel' | 'csv' | 'json')[];
  retentionPeriod: number; // days
}

export interface RiskAlert {
  id: string;
  alertType: 'unusual_activity' | 'failed_login' | 'privilege_escalation' | 'data_access' | 'approval_bypass';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId: string;
  userName: string;
  description: string;
  detectedAt: string;
  entity?: {
    type: string;
    id: string;
    name: string;
  };
  riskScore: number;
  triggers: string[];
  recommendedActions: string[];
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  investigationNotes?: string;
}

class AuditTrailService {
  private baseUrl = '/api/finance/audit';

  // Audit Trail Management
  async createAuditEntry(entry: Omit<AuditTrailEntry, 'id' | 'timestamp'>): Promise<AuditTrailEntry> {
    const newEntry: AuditTrailEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };

    // In real implementation, this would call the backend API
    console.log('Creating audit entry:', newEntry);
    return newEntry;
  }

  async getAuditTrail(filters: {
    entityType?: string;
    entityId?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
    action?: string;
    riskLevel?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ entries: AuditTrailEntry[]; total: number }> {
    // Mock implementation
    return {
      entries: mockAuditEntries.filter(entry => {
        if (filters.entityType && entry.entityType !== filters.entityType) return false;
        if (filters.entityId && entry.entityId !== filters.entityId) return false;
        if (filters.userId && entry.userId !== filters.userId) return false;
        if (filters.riskLevel && entry.riskLevel !== filters.riskLevel) return false;
        return true;
      }).slice(0, filters.limit || 50),
      total: mockAuditEntries.length
    };
  }

  async createApprovalRequest(request: Omit<ApprovalRequest, 'id' | 'requestedAt' | 'currentStep' | 'status' | 'stepApprovals'>): Promise<ApprovalRequest> {
    const workflow = mockWorkflows.find(w => w.id === request.workflowId);
    
    const newRequest: ApprovalRequest = {
      id: `approval_${Date.now()}`,
      requestedAt: new Date().toISOString(),
      currentStep: 1,
      status: 'pending',
      stepApprovals: workflow?.approvalSteps.map(step => ({
        stepId: step.id,
        stepNumber: step.stepNumber,
        status: 'pending' as const
      })) || [],
      totalSteps: workflow?.approvalSteps.length || 0,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      comments: [],
      escalations: [],
      ...request
    };

    console.log('Creating approval request:', newRequest);
    return newRequest;
  }

  async getPendingApprovals(userId?: string): Promise<ApprovalRequest[]> {
    return mockApprovalRequests.filter(request => 
      request.status === 'pending' && 
      (!userId || this.canUserApprove(request, userId))
    );
  }

  async approveRequest(requestId: string, stepNumber: number, userId: string, comments?: string): Promise<ApprovalRequest> {
    const request = mockApprovalRequests.find(r => r.id === requestId);
    if (!request) throw new Error('Approval request not found');

    // Update step approval
    const stepApproval = request.stepApprovals.find(s => s.stepNumber === stepNumber);
    if (stepApproval) {
      stepApproval.status = 'approved';
      stepApproval.approvedBy = userId;
      stepApproval.approvedAt = new Date().toISOString();
      stepApproval.comments = comments;
    }

    // Add comment
    if (comments) {
      request.comments.push({
        id: `comment_${Date.now()}`,
        userId,
        userName: 'Current User',
        comment: comments,
        timestamp: new Date().toISOString(),
        isInternal: false
      });
    }

    // Check if all steps are approved
    const allApproved = request.stepApprovals.every(s => s.status === 'approved' || s.status === 'skipped');
    if (allApproved) {
      request.status = 'approved';
      request.completedAt = new Date().toISOString();
    } else {
      request.currentStep = Math.max(...request.stepApprovals.filter(s => s.status === 'approved').map(s => s.stepNumber)) + 1;
    }

    return request;
  }

  async generateComplianceReport(type: ComplianceReport['reportType'], filters: any): Promise<ComplianceReport> {
    return {
      id: `report_${Date.now()}`,
      reportType: type,
      generatedAt: new Date().toISOString(),
      generatedBy: 'current_user',
      period: filters.period || {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString()
      },
      filters,
      summary: {
        totalEntries: 245,
        criticalActions: 8,
        pendingApprovals: 12,
        complianceViolations: 2,
        averageApprovalTime: 4.5
      },
      details: mockAuditEntries,
      exportFormats: ['pdf', 'excel', 'csv'],
      retentionPeriod: 2555 // 7 years
    };
  }

  async getRiskAlerts(): Promise<RiskAlert[]> {
    return mockRiskAlerts;
  }

  private canUserApprove(request: ApprovalRequest, userId: string): boolean {
    const workflow = mockWorkflows.find(w => w.id === request.workflowId);
    if (!workflow) return false;

    const currentStep = workflow.approvalSteps.find(s => s.stepNumber === request.currentStep);
    if (!currentStep) return false;

    return currentStep.approverUsers.includes(userId) || 
           currentStep.approverRoles.some(role => this.userHasRole(userId, role));
  }

  private userHasRole(userId: string, role: string): boolean {
    // Mock implementation - in real app, this would check user roles
    return true;
  }
}

// Mock Data
const mockAuditEntries: AuditTrailEntry[] = [
  {
    id: 'audit_001',
    timestamp: '2025-07-02T14:30:00Z',
    userId: 'user_001',
    userName: 'Dr. Ahmed Hassan',
    userRole: 'Finance Manager',
    action: 'CREATE_INVOICE',
    entityType: 'invoice',
    entityId: 'inv_001',
    entityName: 'Medical Equipment Invoice - Q1 2025',
    newValues: { amount: 125000, customerId: 'cust_001', status: 'draft' },
    changesSummary: 'Created new invoice for medical equipment procurement',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'session_abc123',
    riskLevel: 'medium',
    approvalRequired: true,
    approvalStatus: 'pending',
    complianceFlags: ['high_amount'],
    metadata: { department: 'Procurement', project: 'Equipment Upgrade' }
  },
  {
    id: 'audit_002',
    timestamp: '2025-07-02T13:15:00Z',
    userId: 'user_002',
    userName: 'Sarah Wilson',
    userRole: 'Accountant',
    action: 'UPDATE_BUDGET',
    entityType: 'budget',
    entityId: 'budget_001',
    entityName: 'Q2 2025 Operational Budget',
    oldValues: { amount: 450000 },
    newValues: { amount: 485000 },
    changesSummary: 'Increased operational budget by 35,000 SAR for additional staff',
    ipAddress: '192.168.1.105',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    sessionId: 'session_def456',
    riskLevel: 'high',
    approvalRequired: true,
    approvalStatus: 'approved',
    approvedBy: 'user_003',
    approvedAt: '2025-07-02T15:30:00Z',
    complianceFlags: ['budget_increase'],
    metadata: { previousApprover: 'user_003', justification: 'Staff expansion' }
  }
];

const mockWorkflows: ApprovalWorkflow[] = [
  {
    id: 'workflow_001',
    name: 'High Value Invoice Approval',
    description: 'Approval workflow for invoices above 100,000 SAR',
    entityType: 'invoice',
    triggerConditions: [
      {
        id: 'trigger_001',
        type: 'amount_threshold',
        field: 'totalAmount',
        operator: 'gte',
        value: 100000,
        description: 'Invoice amount >= 100,000 SAR'
      }
    ],
    approvalSteps: [
      {
        id: 'step_001',
        stepNumber: 1,
        name: 'Finance Manager Review',
        description: 'Initial review by Finance Manager',
        approverRoles: ['Finance Manager'],
        approverUsers: ['user_001'],
        requiredApprovals: 1,
        isParallel: false,
        timeLimit: 24,
        escalationUsers: ['user_003'],
        escalationAfter: 48
      }
    ],
    isActive: true,
    createdBy: 'user_001',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  }
];

const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: 'approval_001',
    workflowId: 'workflow_001',
    entityType: 'invoice',
    entityId: 'inv_001',
    entityName: 'Medical Equipment Invoice - Q1 2025',
    requestedBy: 'user_002',
    requestedAt: '2025-07-02T14:30:00Z',
    currentStep: 1,
    status: 'pending',
    priority: 'medium',
    description: 'New invoice for medical equipment procurement requiring approval',
    changesSummary: 'New invoice created for 125,000 SAR',
    newValues: { amount: 125000, customerId: 'cust_001', status: 'draft' },
    attachments: ['quote_medical_equipment.pdf', 'po_approval.pdf'],
    comments: [],
    stepApprovals: [
      {
        stepId: 'step_001',
        stepNumber: 1,
        status: 'pending'
      }
    ],
    escalations: [],
    dueDate: '2025-07-09T14:30:00Z',
    totalSteps: 1
  }
];

const mockRiskAlerts: RiskAlert[] = [
  {
    id: 'alert_001',
    alertType: 'unusual_activity',
    severity: 'medium',
    userId: 'user_005',
    userName: 'Unknown User',
    description: 'Multiple failed login attempts detected',
    detectedAt: '2025-07-02T16:45:00Z',
    riskScore: 65,
    triggers: ['failed_login_threshold', 'ip_address_change'],
    recommendedActions: ['Account lockout', 'Security team notification', 'Password reset'],
    isAcknowledged: false
  }
];

export const auditTrailService = new AuditTrailService();
export default auditTrailService;
