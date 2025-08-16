import { 
  EmployeeRequest, 
  ApprovalWorkflow, 
  ApprovalStage,
  ESSDashboardStats,
  MSSDashboardStats,
  TeamMemberSummary,
  RequestFormConfig
} from '../types/hrTypes';

// HR Workflow Engine - Handles all ESS/MSS request workflows
export class HRWorkflowEngine {
  private static instance: HRWorkflowEngine;
  private workflows: Map<string, ApprovalWorkflow> = new Map();
  private activeRequests: Map<string, EmployeeRequest> = new Map();
  private escalationTimer: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    this.initializeDefaultWorkflows();
  }

  public static getInstance(): HRWorkflowEngine {
    if (!HRWorkflowEngine.instance) {
      HRWorkflowEngine.instance = new HRWorkflowEngine();
    }
    return HRWorkflowEngine.instance;
  }

  // Initialize default approval workflows for different request types
  private initializeDefaultWorkflows(): void {
    // Annual Leave Workflow
    this.workflows.set('Leave', {
      id: 'wf-leave-001',
      requestType: 'Leave',
      workflowName: 'Standard Leave Approval',
      description: 'Standard workflow for leave requests requiring manager and HR approval',
      isActive: true,
      stages: [
        {
          stageId: 'stage-1',
          stageName: 'Direct Manager Review',
          stageOrder: 1,
          requiredRole: 'Direct Manager',
          isRequired: true,
          canDelegate: true,
          canSkip: false,
          timeoutHours: 48,
          parallelApproval: false,
          requiredApprovers: 1
        },
        {
          stageId: 'stage-2',
          stageName: 'HR Review',
          stageOrder: 2,
          requiredRole: 'HR Manager',
          isRequired: true,
          canDelegate: true,
          canSkip: false,
          timeoutHours: 24,
          parallelApproval: false,
          requiredApprovers: 1
        }
      ],
      autoEscalationRules: {
        enabled: true,
        escalateAfterHours: 72,
        escalateToRole: 'Department Manager'
      },
      conditions: {
        urgencyLevel: ['Low', 'Medium', 'High']
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Exit Clearance Workflow
    this.workflows.set('Exit Clearance', {
      id: 'wf-exit-001',
      requestType: 'Exit Clearance',
      workflowName: 'Exit Clearance Process',
      description: 'Comprehensive exit clearance workflow requiring multiple approvals',
      isActive: true,
      stages: [
        {
          stageId: 'stage-1',
          stageName: 'Direct Manager Approval',
          stageOrder: 1,
          requiredRole: 'Direct Manager',
          isRequired: true,
          canDelegate: false,
          canSkip: false,
          timeoutHours: 24,
          parallelApproval: false,
          requiredApprovers: 1
        },
        {
          stageId: 'stage-2',
          stageName: 'HR Clearance',
          stageOrder: 2,
          requiredRole: 'HR Manager',
          isRequired: true,
          canDelegate: false,
          canSkip: false,
          timeoutHours: 48,
          parallelApproval: false,
          requiredApprovers: 1
        },
        {
          stageId: 'stage-3',
          stageName: 'CEO Final Approval',
          stageOrder: 3,
          requiredRole: 'CEO',
          isRequired: true,
          canDelegate: false,
          canSkip: false,
          timeoutHours: 72,
          parallelApproval: false,
          requiredApprovers: 1
        }
      ],
      autoEscalationRules: {
        enabled: true,
        escalateAfterHours: 96,
        escalateToRole: 'CEO'
      },
      conditions: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Salary Certificate Workflow (Auto-approve)
    this.workflows.set('Salary Certificate', {
      id: 'wf-salary-001',
      requestType: 'Salary Certificate',
      workflowName: 'Salary Certificate Auto-Process',
      description: 'Automated salary certificate generation with HR notification',
      isActive: true,
      stages: [
        {
          stageId: 'stage-1',
          stageName: 'HR Auto-Processing',
          stageOrder: 1,
          requiredRole: 'HR Manager',
          isRequired: true,
          canDelegate: false,
          canSkip: false,
          timeoutHours: 4,
          autoApproveConditions: ['template_available'],
          parallelApproval: false,
          requiredApprovers: 1
        }
      ],
      autoEscalationRules: {
        enabled: false,
        escalateAfterHours: 24,
        escalateToRole: 'HR Manager'
      },
      conditions: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Vacation Salary Advance Workflow
    this.workflows.set('Vacation Salary Advance', {
      id: 'wf-advance-001',
      requestType: 'Vacation Salary Advance',
      workflowName: 'Salary Advance Approval',
      description: 'Workflow for vacation salary advance requests',
      isActive: true,
      stages: [
        {
          stageId: 'stage-1',
          stageName: 'Manager Approval',
          stageOrder: 1,
          requiredRole: 'Direct Manager',
          isRequired: true,
          canDelegate: true,
          canSkip: false,
          timeoutHours: 24,
          parallelApproval: false,
          requiredApprovers: 1
        },
        {
          stageId: 'stage-2',
          stageName: 'Finance Approval',
          stageOrder: 2,
          requiredRole: 'Finance Manager',
          isRequired: true,
          canDelegate: false,
          canSkip: false,
          timeoutHours: 48,
          parallelApproval: false,
          requiredApprovers: 1
        }
      ],
      autoEscalationRules: {
        enabled: true,
        escalateAfterHours: 72,
        escalateToRole: 'CEO'
      },
      conditions: {
        amountThreshold: 10000
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Medical Reimbursement Workflow
    this.workflows.set('Medical Reimbursement', {
      id: 'wf-medical-001',
      requestType: 'Medical Reimbursement',
      workflowName: 'Medical Reimbursement Process',
      description: 'Workflow for medical expense reimbursement',
      isActive: true,
      stages: [
        {
          stageId: 'stage-1',
          stageName: 'Manager Review',
          stageOrder: 1,
          requiredRole: 'Direct Manager',
          isRequired: true,
          canDelegate: true,
          canSkip: false,
          timeoutHours: 48,
          parallelApproval: false,
          requiredApprovers: 1
        },
        {
          stageId: 'stage-2',
          stageName: 'HR Verification',
          stageOrder: 2,
          requiredRole: 'HR Manager',
          isRequired: true,
          canDelegate: false,
          canSkip: false,
          timeoutHours: 24,
          parallelApproval: false,
          requiredApprovers: 1
        }
      ],
      autoEscalationRules: {
        enabled: true,
        escalateAfterHours: 72,
        escalateToRole: 'Department Manager'
      },
      conditions: {
        amountThreshold: 5000
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  // Submit a new employee request
  public async submitRequest(requestData: Partial<EmployeeRequest>): Promise<EmployeeRequest> {
    const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const workflow = this.workflows.get(requestData.requestType!);
    if (!workflow) {
      throw new Error(`No workflow found for request type: ${requestData.requestType}`);
    }

    const request: EmployeeRequest = {
      requestId,
      employeeId: requestData.employeeId!,
      employeeName: requestData.employeeName!,
      dateSubmitted: new Date(),
      requestType: requestData.requestType!,
      subType: requestData.subType,
      description: requestData.description!,
      urgency: requestData.urgency || 'Medium',
      requestedAmount: requestData.requestedAmount,
      requestedDates: requestData.requestedDates,
      documentAttachment: requestData.documentAttachment || [],
      approvers: this.generateApprovers(workflow, requestData.employeeId!),
      currentApprover: this.generateApprovers(workflow, requestData.employeeId!)[0]?.id,
      approvalStatus: 'Pending',
      approvalLog: [],
      executionStatus: 'Not Started',
      workflowStage: 'Submission',
      autoEscalation: {
        enabled: workflow.autoEscalationRules.enabled,
        escalateAfterHours: workflow.autoEscalationRules.escalateAfterHours,
        nextEscalationLevel: workflow.autoEscalationRules.escalateToRole,
        escalationHistory: []
      },
      tags: this.generateTags(requestData),
      budgetApprovalRequired: this.requiresBudgetApproval(requestData),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store the request
    this.activeRequests.set(requestId, request);

    // Start auto-escalation timer if enabled
    if (request.autoEscalation.enabled) {
      this.startEscalationTimer(requestId);
    }

    // Send notifications
    await this.sendNotification(request, 'Request Submitted');

    // Check for auto-approval conditions
    await this.checkAutoApproval(request);

    return request;
  }

  // Process approval/rejection by approver
  public async processApproval(
    requestId: string, 
    approverId: string, 
    action: 'Approved' | 'Rejected' | 'Delegated',
    comments?: string,
    delegatedTo?: string
  ): Promise<EmployeeRequest> {
    const request = this.activeRequests.get(requestId);
    if (!request) {
      throw new Error(`Request ${requestId} not found`);
    }

    // Clear escalation timer
    this.clearEscalationTimer(requestId);

    // Add to approval log
    request.approvalLog.push({
      approverId,
      approverName: this.getApproverName(approverId),
      approverRole: this.getApproverRole(approverId),
      status: action,
      actionDate: new Date(),
      comments,
      delegatedTo
    });

    if (action === 'Rejected') {
      request.approvalStatus = 'Rejected';
      request.workflowStage = 'Completed';
      await this.sendNotification(request, 'Request Rejected');
    } else if (action === 'Delegated') {
      request.currentApprover = delegatedTo;
      await this.sendNotification(request, 'Approval Delegated');
      // Restart escalation timer for new approver
      this.startEscalationTimer(requestId);
    } else {
      // Move to next stage
      await this.advanceToNextStage(request);
    }

    request.updatedAt = new Date().toISOString();
    return request;
  }

  // Advance request to next approval stage
  private async advanceToNextStage(request: EmployeeRequest): Promise<void> {
    const workflow = this.workflows.get(request.requestType);
    if (!workflow) return;

    const currentStageIndex = this.getCurrentStageIndex(request);
    const nextStageIndex = currentStageIndex + 1;

    if (nextStageIndex >= workflow.stages.length) {
      // All stages completed - execute the request
      request.approvalStatus = 'Approved';
      request.workflowStage = 'Execution';
      request.executionStatus = 'In Progress';
      request.executionDate = new Date();
      
      await this.executeRequest(request);
      await this.sendNotification(request, 'Request Approved');
    } else {
      // Move to next stage
      const nextStage = workflow.stages[nextStageIndex];
      request.currentApprover = this.getStageApprover(nextStage, request.employeeId);
      request.approvalStatus = 'In Review';
      request.workflowStage = this.getWorkflowStageName(nextStageIndex);
      
      // Start escalation timer for new stage
      this.startEscalationTimer(request.requestId);
      
      await this.sendNotification(request, 'Approval Required');
    }
  }

  // Execute the approved request
  private async executeRequest(request: EmployeeRequest): Promise<void> {
    try {
      switch (request.requestType) {
        case 'Salary Certificate':
          await this.generateSalaryCertificate(request);
          break;
        case 'Leave':
          await this.processLeaveRequest(request);
          break;
        case 'Vacation Salary Advance':
          await this.processSalaryAdvance(request);
          break;
        case 'Medical Reimbursement':
          await this.processMedicalReimbursement(request);
          break;
        case 'Exit Clearance':
          await this.processExitClearance(request);
          break;
        default:
          console.log(`No specific execution logic for ${request.requestType}`);
      }

      request.executionStatus = 'Completed';
      request.actualCompletionDate = new Date();
      request.workflowStage = 'Completed';
      
      await this.sendNotification(request, 'Request Completed');
    } catch (error) {
      request.executionStatus = 'On Hold';
      console.error(`Error executing request ${request.requestId}:`, error);
    }
  }

  // Generate salary certificate
  private async generateSalaryCertificate(request: EmployeeRequest): Promise<void> {
    // Simulate salary certificate generation
    const certificateUrl = `/documents/salary-certificate-${request.requestId}.pdf`;
    
    request.resultDocuments = [{
      fileName: `Salary Certificate - ${request.employeeName}.pdf`,
      fileUrl: certificateUrl,
      generatedDate: new Date().toISOString()
    }];
  }

  // Process leave request
  private async processLeaveRequest(request: EmployeeRequest): Promise<void> {
    // Update leave calendar and employee leave balance
    console.log(`Processing leave request for ${request.employeeName}`);
    // Implementation would integrate with leave management system
  }

  // Process salary advance
  private async processSalaryAdvance(request: EmployeeRequest): Promise<void> {
    // Create payroll adjustment record
    console.log(`Processing salary advance of ${request.requestedAmount} for ${request.employeeName}`);
    // Implementation would integrate with payroll system
  }

  // Process medical reimbursement
  private async processMedicalReimbursement(request: EmployeeRequest): Promise<void> {
    // Create reimbursement record and payment instruction
    console.log(`Processing medical reimbursement of ${request.requestedAmount} for ${request.employeeName}`);
    // Implementation would integrate with finance system
  }

  // Process exit clearance
  private async processExitClearance(request: EmployeeRequest): Promise<void> {
    // Generate exit clearance checklist and final settlement
    console.log(`Processing exit clearance for ${request.employeeName}`);
    // Implementation would integrate with full exit clearance workflow
  }

  // Auto-escalation system
  private startEscalationTimer(requestId: string): void {
    const request = this.activeRequests.get(requestId);
    if (!request || !request.autoEscalation.enabled) return;

    const timeoutMs = request.autoEscalation.escalateAfterHours * 60 * 60 * 1000;
    
    const timer = setTimeout(async () => {
      await this.escalateRequest(requestId);
    }, timeoutMs);

    this.escalationTimer.set(requestId, timer);
  }

  private clearEscalationTimer(requestId: string): void {
    const timer = this.escalationTimer.get(requestId);
    if (timer) {
      clearTimeout(timer);
      this.escalationTimer.delete(requestId);
    }
  }

  private async escalateRequest(requestId: string): Promise<void> {
    const request = this.activeRequests.get(requestId);
    if (!request) return;

    const escalationTarget = this.getEscalationTarget(request);
    if (!escalationTarget) return;

    // Add escalation to history
    request.autoEscalation.escalationHistory.push({
      fromLevel: request.currentApprover || 'Unknown',
      toLevel: escalationTarget,
      escalatedAt: new Date(),
      reason: 'Timeout - No response within allowed time'
    });

    // Update current approver
    request.currentApprover = escalationTarget;
    
    // Add to approval log
    request.approvalLog.push({
      approverId: 'SYSTEM',
      approverName: 'System Auto-Escalation',
      approverRole: 'System',
      status: 'Escalated',
      actionDate: new Date(),
      comments: `Escalated to ${escalationTarget} due to timeout`,
      escalatedAfter: request.autoEscalation.escalateAfterHours
    });

    // Restart timer for new approver
    this.startEscalationTimer(requestId);
    
    // Send escalation notifications
    await this.sendNotification(request, 'Escalation');
  }

  // Notification system
  private async sendNotification(request: EmployeeRequest, event: string): Promise<void> {
    // Simulate notification sending
    console.log(`📧 Notification: ${event} for request ${request.requestId}`);
    
    switch (event) {
      case 'Request Submitted':
        console.log(`✅ Notified ${request.currentApprover}: New ${request.requestType} request from ${request.employeeName}`);
        break;
      case 'Approval Required':
        console.log(`⏰ Notified ${request.currentApprover}: Approval needed for ${request.requestType} request`);
        break;
      case 'Request Approved':
        console.log(`✅ Notified ${request.employeeId}: Your ${request.requestType} request has been approved`);
        break;
      case 'Request Rejected':
        console.log(`❌ Notified ${request.employeeId}: Your ${request.requestType} request has been rejected`);
        break;
      case 'Request Completed':
        console.log(`🎉 Notified ${request.employeeId}: Your ${request.requestType} request has been completed`);
        break;
      case 'Escalation':
        console.log(`⚠️ Escalation notification sent for request ${request.requestId}`);
        break;
    }
  }

  // Helper methods
  private generateApprovers(workflow: ApprovalWorkflow, employeeId: string): any[] {
    // In real implementation, this would fetch from organizational structure
    return workflow.stages.map((stage, index) => ({
      id: `approver-${stage.requiredRole.toLowerCase().replace(/\s+/g, '-')}-${employeeId}`,
      name: this.getMockApproverName(stage.requiredRole),
      role: stage.requiredRole,
      order: index + 1,
      required: stage.isRequired
    }));
  }

  private getMockApproverName(role: string): string {
    const roleNames = {
      'Direct Manager': 'Ahmed Al-Mansouri',
      'Department Manager': 'Fatima Hassan',
      'HR Manager': 'Mohammad Al-Rashid',
      'CEO': 'Abdullah Al-Otaibi',
      'Finance Manager': 'Sarah Al-Zahra'
    };
    return roleNames[role as keyof typeof roleNames] || 'Unknown Approver';
  }

  private getApproverName(approverId: string): string {
    // Mock implementation - would fetch from user management system
    return 'Approver Name';
  }

  private getApproverRole(approverId: string): string {
    // Mock implementation - would fetch from user management system
    return 'Manager';
  }

  private getCurrentStageIndex(request: EmployeeRequest): number {
    const approvedCount = request.approvalLog.filter(log => log.status === 'Approved').length;
    return approvedCount;
  }

  private getStageApprover(stage: ApprovalStage, employeeId: string): string {
    return `approver-${stage.requiredRole.toLowerCase().replace(/\s+/g, '-')}-${employeeId}`;
  }

  private getWorkflowStageName(stageIndex: number): string {
    const stageNames = [
      'Manager Review',
      'HR Review', 
      'Finance Review',
      'CEO Approval'
    ];
    return stageNames[stageIndex] || 'Review';
  }

  private getEscalationTarget(request: EmployeeRequest): string | null {
    // Mock implementation - would determine escalation target based on org structure
    return request.autoEscalation.nextEscalationLevel;
  }

  private generateTags(requestData: Partial<EmployeeRequest>): string[] {
    const tags: string[] = [];
    
    if (requestData.urgency === 'Critical') tags.push('URGENT');
    if (requestData.requestedAmount && requestData.requestedAmount > 5000) tags.push('HIGH_VALUE');
    if (requestData.requestType === 'Leave') tags.push('LEAVE_REQUEST');
    if (requestData.requestType === 'Exit Clearance') tags.push('EXIT_PROCESS');
    
    return tags;
  }

  private requiresBudgetApproval(requestData: Partial<EmployeeRequest>): boolean {
    return ['Vacation Salary Advance', 'Medical Reimbursement', 'Training Request'].includes(requestData.requestType!);
  }

  private async checkAutoApproval(request: EmployeeRequest): Promise<void> {
    const workflow = this.workflows.get(request.requestType);
    if (!workflow) return;

    const firstStage = workflow.stages[0];
    if (firstStage.autoApproveConditions) {
      // Check auto-approval conditions
      if (request.requestType === 'Salary Certificate') {
        // Auto-approve salary certificates
        await this.processApproval(request.requestId, 'SYSTEM', 'Approved', 'Auto-approved: Template available');
      }
    }
  }

  // Public methods for dashboard data
  public getEmployeeRequests(employeeId: string): EmployeeRequest[] {
    return Array.from(this.activeRequests.values())
      .filter(request => request.employeeId === employeeId)
      .sort((a, b) => new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime());
  }

  public getPendingApprovals(approverId: string): EmployeeRequest[] {
    return Array.from(this.activeRequests.values())
      .filter(request => 
        request.currentApprover === approverId && 
        request.approvalStatus === 'Pending'
      )
      .sort((a, b) => new Date(a.dateSubmitted).getTime() - new Date(b.dateSubmitted).getTime());
  }

  public getTeamRequests(managerId: string): EmployeeRequest[] {
    // Mock implementation - would filter by team members
    return Array.from(this.activeRequests.values())
      .filter(request => request.approvers.some(approver => approver.id === managerId))
      .sort((a, b) => new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime());
  }

  public getRequestById(requestId: string): EmployeeRequest | undefined {
    return this.activeRequests.get(requestId);
  }

  public getWorkflows(): ApprovalWorkflow[] {
    return Array.from(this.workflows.values());
  }

  public getRequestFormConfig(requestType: string): RequestFormConfig {
    // Return form configuration based on request type
    const baseConfig: RequestFormConfig = {
      requestType,
      formFields: [],
      requiredDocuments: [],
      approvalWorkflow: requestType,
      estimatedProcessingDays: 3,
      autoGenerate: false
    };

    switch (requestType) {
      case 'Leave':
        baseConfig.formFields = [
          { fieldId: 'leaveType', fieldName: 'Leave Type', fieldType: 'select', isRequired: true, options: ['Annual', 'Sick', 'Emergency', 'Maternity/Paternity', 'Hajj/Umrah'] },
          { fieldId: 'dateRange', fieldName: 'Leave Dates', fieldType: 'dateRange', isRequired: true },
          { fieldId: 'reason', fieldName: 'Reason', fieldType: 'textarea', isRequired: true },
          { fieldId: 'emergencyContact', fieldName: 'Emergency Contact', fieldType: 'text', isRequired: false }
        ];
        baseConfig.requiredDocuments = ['Medical Report (for sick leave)'];
        baseConfig.estimatedProcessingDays = 2;
        break;

      case 'Salary Certificate':
        baseConfig.formFields = [
          { fieldId: 'purpose', fieldName: 'Purpose', fieldType: 'select', isRequired: true, options: ['Bank Loan', 'Visa Application', 'Embassy', 'Other'] },
          { fieldId: 'language', fieldName: 'Language', fieldType: 'select', isRequired: true, options: ['English', 'Arabic', 'Both'] },
          { fieldId: 'additionalInfo', fieldName: 'Additional Information', fieldType: 'textarea', isRequired: false }
        ];
        baseConfig.estimatedProcessingDays = 1;
        baseConfig.autoGenerate = true;
        break;

      case 'Vacation Salary Advance':
        baseConfig.formFields = [
          { fieldId: 'amount', fieldName: 'Requested Amount', fieldType: 'currency', isRequired: true, validation: { min: 1000, max: 10000 } },
          { fieldId: 'reason', fieldName: 'Reason', fieldType: 'textarea', isRequired: true },
          { fieldId: 'repaymentMethod', fieldName: 'Repayment Method', fieldType: 'select', isRequired: true, options: ['Salary Deduction', 'Lump Sum'] }
        ];
        baseConfig.estimatedProcessingDays = 5;
        break;

      case 'Medical Reimbursement':
        baseConfig.formFields = [
          { fieldId: 'amount', fieldName: 'Claim Amount', fieldType: 'currency', isRequired: true },
          { fieldId: 'description', fieldName: 'Medical Service Description', fieldType: 'textarea', isRequired: true },
          { fieldId: 'provider', fieldName: 'Healthcare Provider', fieldType: 'text', isRequired: true },
          { fieldId: 'attachments', fieldName: 'Receipts/Reports', fieldType: 'file', isRequired: true }
        ];
        baseConfig.requiredDocuments = ['Medical Receipts', 'Medical Reports'];
        baseConfig.estimatedProcessingDays = 7;
        break;

      case 'Exit Clearance':
        baseConfig.formFields = [
          { fieldId: 'lastWorkingDay', fieldName: 'Last Working Day', fieldType: 'date', isRequired: true },
          { fieldId: 'reason', fieldName: 'Reason for Leaving', fieldType: 'select', isRequired: true, options: ['Resignation', 'Contract Expiry', 'Transfer', 'Other'] },
          { fieldId: 'handoverPlan', fieldName: 'Handover Plan', fieldType: 'textarea', isRequired: true }
        ];
        baseConfig.estimatedProcessingDays = 10;
        break;
    }

    return baseConfig;
  }
}

// Export singleton instance
export const hrWorkflowEngine = HRWorkflowEngine.getInstance(); 