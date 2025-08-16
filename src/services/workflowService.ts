interface WorkflowDecision {
  id: string;
  consultantId: string;
  consultantName: string;
  animalId: string;
  animalName: string;
  decisionType: 'ET' | 'OPU' | 'FLUSHING' | 'RECHECK' | 'BREEDING' | 'HOLD' | 'INJECTION';
  scheduledDate: string;
  assignedVet: string;
  location?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  reasoning: string;
  ultrasoundRef?: string;
  expectedOutcome?: string;
  followUpSchedule?: {
    type: 'PREGNANCY_CHECK' | 'RECHECK' | 'INJECTION';
    daysFromProcedure: number;
  }[];
  timestamp: string;
  status: 'ASSIGNED' | 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

interface BulkWorkflowAssignment {
  consultantId: string;
  consultantName: string;
  selectedAnimals: string[];
  workflowType: 'SYNCHRONIZATION' | 'BULK_ET' | 'BULK_FLUSHING' | 'BATCH_RECHECK';
  baseDate: string;
  assignedVet: string;
  reasoning: string;
  batchId?: string;
  donorGroupRef?: string; // For recipient assignments linked to donor flushes
}

interface AutomatedAction {
  actionType: 'CALENDAR_EVENT' | 'INJECTION_SCHEDULE' | 'MODULE_UPDATE' | 'NOTIFICATION';
  targetModule: string;
  actionData: any;
  triggerDecision: string;
  status: 'PENDING' | 'EXECUTED' | 'FAILED';
  executedAt?: string;
  error?: string;
}

class WorkflowService {
  private decisionHistory: WorkflowDecision[] = [];
  private automatedActions: AutomatedAction[] = [];

  // Enhanced workflow assignment with full automation
  async assignWorkflow(decision: Omit<WorkflowDecision, 'id' | 'timestamp' | 'status'>): Promise<{
    decision: WorkflowDecision;
    automatedActions: AutomatedAction[];
  }> {
    // Create the decision record
    const workflowDecision: WorkflowDecision = {
      ...decision,
      id: `WF_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
      status: 'ASSIGNED'
    };

    // Store decision in history
    this.decisionHistory.push(workflowDecision);

    // Generate automated actions based on decision type
    const automatedActions = await this.generateAutomatedActions(workflowDecision);

    // Execute automated actions
    for (const action of automatedActions) {
      await this.executeAutomatedAction(action);
    }

    return {
      decision: workflowDecision,
      automatedActions
    };
  }

  // Bulk workflow assignment with intelligent scheduling
  async assignBulkWorkflow(bulkAssignment: BulkWorkflowAssignment): Promise<{
    decisions: WorkflowDecision[];
    automatedActions: AutomatedAction[];
  }> {
    const decisions: WorkflowDecision[] = [];
    const allAutomatedActions: AutomatedAction[] = [];

    for (let i = 0; i < bulkAssignment.selectedAnimals.length; i++) {
      const animalId = bulkAssignment.selectedAnimals[i];
      
      // Calculate staggered scheduling for bulk operations
      const scheduledDate = this.calculateStaggeredDate(
        bulkAssignment.baseDate, 
        i, 
        bulkAssignment.workflowType
      );

      const decision: Omit<WorkflowDecision, 'id' | 'timestamp' | 'status'> = {
        consultantId: bulkAssignment.consultantId,
        consultantName: bulkAssignment.consultantName,
        animalId,
        animalName: `Animal ${animalId}`, // Would be fetched from animal service
        decisionType: this.mapBulkTypeToDecision(bulkAssignment.workflowType),
        scheduledDate,
        assignedVet: bulkAssignment.assignedVet,
        priority: 'MEDIUM',
        reasoning: `${bulkAssignment.reasoning} (Batch ${i + 1}/${bulkAssignment.selectedAnimals.length})`,
        expectedOutcome: this.getExpectedOutcome(bulkAssignment.workflowType),
        followUpSchedule: this.getStandardFollowUp(bulkAssignment.workflowType)
      };

      const result = await this.assignWorkflow(decision);
      decisions.push(result.decision);
      allAutomatedActions.push(...result.automatedActions);
    }

    return {
      decisions,
      automatedActions: allAutomatedActions
    };
  }

  // Generate automated actions based on workflow decision
  private async generateAutomatedActions(decision: WorkflowDecision): Promise<AutomatedAction[]> {
    const actions: AutomatedAction[] = [];

    // 1. Calendar Event Creation
    actions.push({
      actionType: 'CALENDAR_EVENT',
      targetModule: 'calendar',
      actionData: {
        title: `${decision.decisionType} - ${decision.animalName}`,
        date: decision.scheduledDate,
        time: this.calculateOptimalTime(decision.decisionType, decision.scheduledDate),
        type: decision.decisionType.toLowerCase(),
        animals: [{
          id: decision.animalId,
          name: decision.animalName
        }],
        assignedVet: decision.assignedVet,
        location: decision.location || this.getDefaultLocation(decision.decisionType),
        priority: decision.priority,
        status: 'SCHEDULED',
        workflowRef: decision.id,
        notes: decision.reasoning
      },
      triggerDecision: decision.id,
      status: 'PENDING'
    });

    // 2. Pre-procedure injection scheduling
    if (['ET', 'OPU', 'FLUSHING'].includes(decision.decisionType)) {
      const injectionSchedule = this.getPreProcedureInjections(decision.decisionType);
      
      for (const injection of injectionSchedule) {
        const injectionDate = this.calculateInjectionDate(decision.scheduledDate, injection.daysBefore);
        
        actions.push({
          actionType: 'INJECTION_SCHEDULE',
          targetModule: 'injections',
          actionData: {
            animalId: decision.animalId,
            medication: injection.medication,
            dosage: injection.dosage,
            route: injection.route,
            scheduledDate: injectionDate,
            assignedBy: decision.consultantName,
            reason: `Pre-${decision.decisionType} protocol`,
            workflowRef: decision.id,
            priority: decision.priority
          },
          triggerDecision: decision.id,
          status: 'PENDING'
        });
      }
    }

    // 3. Module-specific preparations
    actions.push({
      actionType: 'MODULE_UPDATE',
      targetModule: this.getTargetModule(decision.decisionType),
      actionData: {
        animalId: decision.animalId,
        procedureType: decision.decisionType,
        scheduledDate: decision.scheduledDate,
        assignedVet: decision.assignedVet,
        status: 'ASSIGNED',
        workflowRef: decision.id,
        clinicalNotes: decision.reasoning,
        ultrasoundRef: decision.ultrasoundRef
      },
      triggerDecision: decision.id,
      status: 'PENDING'
    });

    // 4. Follow-up scheduling
    if (decision.followUpSchedule) {
      for (const followUp of decision.followUpSchedule) {
        const followUpDate = this.addDaysToDate(decision.scheduledDate, followUp.daysFromProcedure);
        
        actions.push({
          actionType: 'CALENDAR_EVENT',
          targetModule: 'calendar',
          actionData: {
            title: `${followUp.type} - ${decision.animalName}`,
            date: followUpDate,
            type: followUp.type.toLowerCase(),
            animals: [{ id: decision.animalId, name: decision.animalName }],
            assignedVet: decision.assignedVet,
            priority: 'MEDIUM',
            status: 'SCHEDULED',
            workflowRef: decision.id,
            notes: `Follow-up for ${decision.decisionType} procedure`
          },
          triggerDecision: decision.id,
          status: 'PENDING'
        });
      }
    }

    // 5. Mobile notifications for field team
    actions.push({
      actionType: 'NOTIFICATION',
      targetModule: 'mobile',
      actionData: {
        recipientRole: 'FIELD_VET',
        recipientId: decision.assignedVet,
        type: 'WORKFLOW_ASSIGNMENT',
        title: `New ${decision.decisionType} Assignment`,
        message: `${decision.animalName} scheduled for ${decision.decisionType} on ${decision.scheduledDate}`,
        actionRequired: true,
        workflowRef: decision.id,
        priority: decision.priority
      },
      triggerDecision: decision.id,
      status: 'PENDING'
    });

    return actions;
  }

  // Execute automated action
  private async executeAutomatedAction(action: AutomatedAction): Promise<void> {
    try {
      switch (action.actionType) {
        case 'CALENDAR_EVENT':
          await this.createCalendarEvent(action.actionData);
          break;
        case 'INJECTION_SCHEDULE':
          await this.scheduleInjection(action.actionData);
          break;
        case 'MODULE_UPDATE':
          await this.updateTargetModule(action.targetModule, action.actionData);
          break;
        case 'NOTIFICATION':
          await this.sendNotification(action.actionData);
          break;
      }
      
      action.status = 'EXECUTED';
      action.executedAt = new Date().toISOString();
    } catch (error) {
      action.status = 'FAILED';
      action.error = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Failed to execute automated action:`, error);
    }
    
    this.automatedActions.push(action);
  }

  // Helper methods for specific automation tasks
  private async createCalendarEvent(eventData: any): Promise<void> {
    // TODO: Integrate with actual calendar API
    console.log('Creating calendar event:', eventData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In real implementation, this would call:
    // await apiService.post('/calendar/events', eventData);
  }

  private async scheduleInjection(injectionData: any): Promise<void> {
    // TODO: Integrate with actual injections API
    console.log('Scheduling injection:', injectionData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In real implementation:
    // await apiService.post('/injections/schedule', injectionData);
  }

  private async updateTargetModule(moduleName: string, updateData: any): Promise<void> {
    console.log(`Updating ${moduleName} module:`, updateData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // In real implementation:
    // await apiService.post(`/${moduleName}/workflow-assignment`, updateData);
  }

  private async sendNotification(notificationData: any): Promise<void> {
    console.log('Sending notification:', notificationData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // In real implementation:
    // await apiService.post('/notifications/send', notificationData);
  }

  // Workflow calculation helpers
  private calculateStaggeredDate(baseDate: string, index: number, workflowType: string): string {
    const date = new Date(baseDate);
    
    // Stagger appointments based on procedure type
    const staggerMinutes = {
      'SYNCHRONIZATION': 15, // 15 minutes apart
      'BULK_ET': 30,         // 30 minutes apart
      'BULK_FLUSHING': 45,   // 45 minutes apart
      'BATCH_RECHECK': 20    // 20 minutes apart
    };
    
    date.setMinutes(date.getMinutes() + (index * (staggerMinutes[workflowType as keyof typeof staggerMinutes] || 30)));
    return date.toISOString().split('T')[0];
  }

  private calculateOptimalTime(procedureType: string, date: string): string {
    // Optimal procedure times based on physiology
    const optimalTimes = {
      'ET': '09:00',          // Early morning for best success
      'OPU': '08:00',         // Very early for oocyte quality
      'FLUSHING': '10:00',    // Mid-morning
      'RECHECK': '14:00',     // Afternoon
      'BREEDING': '16:00',    // Late afternoon
      'INJECTION': '07:00'    // Early morning
    };
    
    return optimalTimes[procedureType as keyof typeof optimalTimes] || '09:00';
  }

  private getPreProcedureInjections(procedureType: string): Array<{
    medication: string;
    dosage: string;
    route: string;
    daysBefore: number;
  }> {
    const protocols = {
      'ET': [
        { medication: 'GnRH', dosage: '2.5ml', route: 'IM', daysBefore: 7 },
        { medication: 'PGF2α', dosage: '5ml', route: 'IM', daysBefore: 2 }
      ],
      'OPU': [
        { medication: 'FSH', dosage: '3ml', route: 'IM', daysBefore: 4 },
        { medication: 'GnRH', dosage: '2.5ml', route: 'IM', daysBefore: 2 }
      ],
      'FLUSHING': [
        { medication: 'Superovulation Protocol', dosage: '4ml', route: 'IM', daysBefore: 5 }
      ]
    };
    
    return protocols[procedureType as keyof typeof protocols] || [];
  }

  private mapBulkTypeToDecision(bulkType: string): WorkflowDecision['decisionType'] {
    const mapping = {
      'SYNCHRONIZATION': 'INJECTION',
      'BULK_ET': 'ET',
      'BULK_FLUSHING': 'FLUSHING',
      'BATCH_RECHECK': 'RECHECK'
    };
    
    return mapping[bulkType as keyof typeof mapping] as WorkflowDecision['decisionType'] || 'RECHECK';
  }

  private getExpectedOutcome(workflowType: string): string {
    const outcomes = {
      'SYNCHRONIZATION': 'Synchronized estrus cycle for breeding',
      'BULK_ET': 'Successful embryo implantation and pregnancy',
      'BULK_FLUSHING': 'Collection of viable embryos for transfer',
      'BATCH_RECHECK': 'Updated reproductive status assessment'
    };
    
    return outcomes[workflowType as keyof typeof outcomes] || 'Positive clinical outcome';
  }

  private getStandardFollowUp(workflowType: string): WorkflowDecision['followUpSchedule'] {
    const followUps = {
      'BULK_ET': [
        { type: 'PREGNANCY_CHECK' as const, daysFromProcedure: 14 },
        { type: 'RECHECK' as const, daysFromProcedure: 30 }
      ],
      'BULK_FLUSHING': [
        { type: 'RECHECK' as const, daysFromProcedure: 7 }
      ],
      'SYNCHRONIZATION': [
        { type: 'RECHECK' as const, daysFromProcedure: 21 }
      ]
    };
    
    return followUps[workflowType as keyof typeof followUps];
  }

  private getTargetModule(decisionType: string): string {
    const moduleMapping = {
      'ET': 'embryo-transfer',
      'OPU': 'flushing',
      'FLUSHING': 'flushing',
      'BREEDING': 'breeding',
      'RECHECK': 'ultrasound',
      'INJECTION': 'injections'
    };
    
    return moduleMapping[decisionType as keyof typeof moduleMapping] || 'clinical-hub';
  }

  private getDefaultLocation(procedureType: string): string {
    const locations = {
      'ET': 'Embryo Transfer Suite',
      'OPU': 'OPU Laboratory',
      'FLUSHING': 'Flushing Room',
      'BREEDING': 'Breeding Facility',
      'RECHECK': 'Ultrasound Room',
      'INJECTION': 'Treatment Area'
    };
    
    return locations[procedureType as keyof typeof locations] || 'Clinical Area';
  }

  private calculateInjectionDate(procedureDate: string, daysBefore: number): string {
    const date = new Date(procedureDate);
    date.setDate(date.getDate() - daysBefore);
    return date.toISOString().split('T')[0];
  }

  private addDaysToDate(dateString: string, days: number): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  }

  // Public methods for accessing workflow data
  getDecisionHistory(): WorkflowDecision[] {
    return [...this.decisionHistory].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  getAutomatedActions(): AutomatedAction[] {
    return [...this.automatedActions].sort((a, b) => {
      const aTime = a.executedAt || a.status === 'PENDING' ? '9999' : '0000';
      const bTime = b.executedAt || b.status === 'PENDING' ? '9999' : '0000';
      return bTime.localeCompare(aTime);
    });
  }

  getDecisionsByAnimal(animalId: string): WorkflowDecision[] {
    return this.decisionHistory.filter(decision => decision.animalId === animalId);
  }

  getWorkflowStatus(decisionId: string): {
    decision: WorkflowDecision | null;
    actions: AutomatedAction[];
    completionRate: number;
  } {
    const decision = this.decisionHistory.find(d => d.id === decisionId);
    const actions = this.automatedActions.filter(a => a.triggerDecision === decisionId);
    
    const completionRate = actions.length > 0 
      ? (actions.filter(a => a.status === 'EXECUTED').length / actions.length) * 100 
      : 0;

    return {
      decision: decision || null,
      actions,
      completionRate
    };
  }
}

// Singleton instance
export const workflowService = new WorkflowService();
export default workflowService;

// Export types for use in components
export type {
  WorkflowDecision,
  BulkWorkflowAssignment,
  AutomatedAction
}; 