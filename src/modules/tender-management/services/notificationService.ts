import { TenderTask, TaskStatus, TaskPriority, TenderAlert, TenderStatus } from '../types/tenderTypes';

// Notification Types
export interface NotificationRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  triggerType: 'deadline' | 'assignment' | 'status_change' | 'milestone' | 'escalation' | 'overdue';
  entityType: 'task' | 'tender' | 'milestone' | 'approval';
  conditions: NotificationCondition[];
  recipients: NotificationRecipient[];
  channels: NotificationChannel[];
  template: NotificationTemplate;
  timing: NotificationTiming;
  escalation?: EscalationRule;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in_list';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface NotificationRecipient {
  type: 'user' | 'role' | 'department' | 'custom_group' | 'email';
  identifier: string;
  name: string;
  isRequired: boolean;
}

export interface NotificationChannel {
  type: 'email' | 'sms' | 'push' | 'in_app' | 'webhook' | 'slack' | 'teams';
  config: Record<string, any>;
  priority: 'high' | 'medium' | 'low';
}

export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  htmlBody?: string;
  variables: string[];
  isSystemTemplate: boolean;
}

export interface NotificationTiming {
  trigger: 'immediate' | 'scheduled' | 'before_due' | 'after_due' | 'recurring';
  scheduleTime?: string; // ISO string for scheduled
  offsetHours?: number; // For before/after due
  recurringInterval?: 'hourly' | 'daily' | 'weekly';
  stopConditions?: string[];
}

export interface NotificationInstance {
  id: string;
  ruleId: string;
  ruleName: string;
  entityType: string;
  entityId: string;
  entityName: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  recipients: NotificationRecipient[];
  channels: NotificationChannel[];
  scheduledAt: string;
  sentAt?: string;
  deliveredAt?: string;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
  content: {
    subject: string;
    body: string;
    htmlBody?: string;
    variables: Record<string, any>;
  };
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface DeadlineAlert {
  id: string;
  type: 'task_due_soon' | 'task_overdue' | 'tender_deadline' | 'milestone_approaching';
  severity: 'info' | 'warning' | 'critical' | 'urgent';
  entityId: string;
  entityType: 'task' | 'tender' | 'milestone';
  entityName: string;
  assignedTo: string;
  assignedToName: string;
  dueDate: string;
  timeUntilDue: number; // hours
  description: string;
  actions: AlertAction[];
  isAcknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  createdAt: string;
}

export interface AlertAction {
  id: string;
  label: string;
  action: 'extend_deadline' | 'reassign' | 'escalate' | 'mark_complete' | 'add_comment';
  payload?: Record<string, any>;
  requiresConfirmation: boolean;
}

export interface EscalationRule {
  steps: EscalationStep[];
  maxAttempts: number;
  finalAction: 'ignore' | 'assign_manager' | 'mark_critical' | 'auto_approve';
}

export interface EscalationStep {
  stepNumber: number;
  delayHours: number;
  recipients: NotificationRecipient[];
  template: NotificationTemplate;
  condition?: string;
}

class NotificationService {
  private baseUrl = '/api/tender-management/notifications';
  private rules: NotificationRule[] = mockNotificationRules;
  private instances: NotificationInstance[] = mockNotificationInstances;
  private activeAlerts: DeadlineAlert[] = mockDeadlineAlerts;

  // Rule Management
  async createNotificationRule(rule: Omit<NotificationRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<NotificationRule> {
    const newRule: NotificationRule = {
      id: `rule_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...rule
    };

    this.rules.push(newRule);
    console.log('Created notification rule:', newRule);
    return newRule;
  }

  async getNotificationRules(entityType?: string): Promise<NotificationRule[]> {
    return this.rules.filter(rule => 
      rule.isActive && (!entityType || rule.entityType === entityType)
    );
  }

  // Task Assignment Notifications
  async notifyTaskAssignment(task: TenderTask, assignedBy: string): Promise<NotificationInstance[]> {
    const notifications: NotificationInstance[] = [];
    
    // Find applicable rules for task assignment
    const assignmentRules = this.rules.filter(rule => 
      rule.isActive && 
      rule.triggerType === 'assignment' && 
      rule.entityType === 'task'
    );

    for (const rule of assignmentRules) {
      if (this.evaluateConditions(rule.conditions, task)) {
        const notification = await this.createNotificationFromRule(rule, task, {
          assignedBy,
          assignedTo: task.assigned_to_name,
          taskTitle: task.title,
          dueDate: task.due_date,
          priority: task.priority
        });
        notifications.push(notification);
      }
    }

    return notifications;
  }

  // Deadline Management
  async checkDeadlines(): Promise<DeadlineAlert[]> {
    const alerts: DeadlineAlert[] = [];
    const now = new Date();

    // Check task deadlines
    for (const task of mockTasks) {
      if (task.status === TaskStatus.DONE) continue;

      const dueDate = new Date(task.due_date);
      const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      let alertType: DeadlineAlert['type'];
      let severity: DeadlineAlert['severity'];

      if (hoursUntilDue < 0) {
        alertType = 'task_overdue';
        severity = 'critical';
      } else if (hoursUntilDue <= 24) {
        alertType = 'task_due_soon';
        severity = 'warning';
      } else if (hoursUntilDue <= 48 && task.priority === TaskPriority.URGENT) {
        alertType = 'task_due_soon';
        severity = 'info';
      } else {
        continue;
      }

      const alert: DeadlineAlert = {
        id: `alert_${task.task_id}_${Date.now()}`,
        type: alertType,
        severity,
        entityId: task.task_id,
        entityType: 'task',
        entityName: task.title,
        assignedTo: task.assigned_to_user_id,
        assignedToName: task.assigned_to_name,
        dueDate: task.due_date,
        timeUntilDue: Math.round(hoursUntilDue),
        description: `Task "${task.title}" ${hoursUntilDue < 0 ? 'is overdue' : `is due in ${Math.round(hoursUntilDue)} hours`}`,
        actions: this.generateAlertActions(task),
        isAcknowledged: false,
        createdAt: new Date().toISOString()
      };

      alerts.push(alert);
    }

    // Update active alerts
    this.activeAlerts = [...this.activeAlerts.filter(a => a.isAcknowledged), ...alerts];
    
    // Send notifications for new alerts
    await this.sendDeadlineNotifications(alerts);

    return alerts;
  }

  async getActiveAlerts(userId?: string): Promise<DeadlineAlert[]> {
    return this.activeAlerts.filter(alert => 
      !alert.isAcknowledged && 
      (!userId || alert.assignedTo === userId)
    );
  }

  async acknowledgeAlert(alertId: string, userId: string): Promise<DeadlineAlert> {
    const alert = this.activeAlerts.find(a => a.id === alertId);
    if (!alert) throw new Error('Alert not found');

    alert.isAcknowledged = true;
    alert.acknowledgedBy = userId;
    alert.acknowledgedAt = new Date().toISOString();

    return alert;
  }

  // Status Change Notifications
  async notifyStatusChange(entityType: string, entityId: string, oldStatus: string, newStatus: string, changedBy: string): Promise<NotificationInstance[]> {
    const notifications: NotificationInstance[] = [];
    
    const statusChangeRules = this.rules.filter(rule => 
      rule.isActive && 
      rule.triggerType === 'status_change' && 
      rule.entityType === entityType
    );

    const entity = this.getEntityData(entityType, entityId);
    if (!entity) return notifications;

    for (const rule of statusChangeRules) {
      const conditions = [
        { field: 'oldStatus', operator: 'equals', value: oldStatus },
        { field: 'newStatus', operator: 'equals', value: newStatus }
      ];

      if (this.evaluateConditions([...rule.conditions, ...conditions], entity)) {
        const notification = await this.createNotificationFromRule(rule, entity, {
          changedBy,
          oldStatus,
          newStatus,
          entityName: entity.title || entity.name,
          changeTime: new Date().toISOString()
        });
        notifications.push(notification);
      }
    }

    return notifications;
  }

  // Helper Methods
  private async createNotificationFromRule(
    rule: NotificationRule, 
    entity: any, 
    variables: Record<string, any>
  ): Promise<NotificationInstance> {
    const notification: NotificationInstance = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ruleId: rule.id,
      ruleName: rule.name,
      entityType: rule.entityType,
      entityId: entity.id || entity.task_id || entity.tender_id,
      entityName: entity.title || entity.name,
      status: 'pending',
      priority: this.determinePriority(rule, entity),
      recipients: rule.recipients,
      channels: rule.channels,
      scheduledAt: this.calculateScheduledTime(rule.timing),
      retryCount: 0,
      maxRetries: 3,
      content: {
        subject: this.processTemplate(rule.template.subject, variables),
        body: this.processTemplate(rule.template.body, variables),
        htmlBody: rule.template.htmlBody ? this.processTemplate(rule.template.htmlBody, variables) : undefined,
        variables
      },
      metadata: {
        ruleType: rule.triggerType,
        entityType: rule.entityType
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.instances.push(notification);
    
    // Schedule sending
    await this.scheduleNotification(notification);
    
    return notification;
  }

  private evaluateConditions(conditions: NotificationCondition[], entity: any): boolean {
    if (conditions.length === 0) return true;

    return conditions.every(condition => {
      const entityValue = this.getNestedValue(entity, condition.field);
      
      switch (condition.operator) {
        case 'equals':
          return entityValue === condition.value;
        case 'not_equals':
          return entityValue !== condition.value;
        case 'greater_than':
          return entityValue > condition.value;
        case 'less_than':
          return entityValue < condition.value;
        case 'contains':
          return String(entityValue).includes(condition.value);
        case 'in_list':
          return condition.value.includes(entityValue);
        default:
          return false;
      }
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private determinePriority(rule: NotificationRule, entity: any): NotificationInstance['priority'] {
    if (entity.priority === TaskPriority.URGENT) return 'urgent';
    if (entity.priority === TaskPriority.HIGH) return 'high';
    if (rule.triggerType === 'deadline' || rule.triggerType === 'overdue') return 'high';
    return 'medium';
  }

  private calculateScheduledTime(timing: NotificationTiming): string {
    const now = new Date();
    
    switch (timing.trigger) {
      case 'immediate':
        return now.toISOString();
      case 'scheduled':
        return timing.scheduleTime || now.toISOString();
      case 'before_due':
        return new Date(now.getTime() + (timing.offsetHours || 0) * 60 * 60 * 1000).toISOString();
      default:
        return now.toISOString();
    }
  }

  private processTemplate(template: string, variables: Record<string, any>): string {
    let processed = template;
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      processed = processed.replace(new RegExp(placeholder, 'g'), String(value));
    });
    
    return processed;
  }

  private async scheduleNotification(notification: NotificationInstance): Promise<void> {
    console.log('Scheduling notification:', notification.id);
    
    // Simulate immediate sending for demo
    setTimeout(() => {
      this.sendNotification(notification);
    }, 1000);
  }

  private async sendNotification(notification: NotificationInstance): Promise<void> {
    try {
      notification.status = 'sent';
      notification.sentAt = new Date().toISOString();
      
      // Simulate delivery delay
      setTimeout(() => {
        notification.status = 'delivered';
        notification.deliveredAt = new Date().toISOString();
        notification.updatedAt = new Date().toISOString();
      }, 2000);
      
      console.log('Notification sent:', notification.id);
    } catch (error) {
      notification.status = 'failed';
      notification.failureReason = String(error);
      notification.updatedAt = new Date().toISOString();
    }
  }

  private async sendDeadlineNotifications(alerts: DeadlineAlert[]): Promise<void> {
    for (const alert of alerts) {
      const deadlineRules = this.rules.filter(rule => 
        rule.isActive && 
        rule.triggerType === 'deadline'
      );

      for (const rule of deadlineRules) {
        await this.createNotificationFromRule(rule, {
          id: alert.entityId,
          title: alert.entityName,
          priority: alert.severity
        }, {
          alertType: alert.type,
          entityName: alert.entityName,
          assignedTo: alert.assignedToName,
          timeUntilDue: alert.timeUntilDue,
          dueDate: alert.dueDate
        });
      }
    }
  }

  private generateAlertActions(task: TenderTask): AlertAction[] {
    const actions: AlertAction[] = [
      {
        id: 'extend_deadline',
        label: 'Extend Deadline',
        action: 'extend_deadline',
        payload: { taskId: task.task_id },
        requiresConfirmation: true
      },
      {
        id: 'reassign',
        label: 'Reassign Task',
        action: 'reassign',
        payload: { taskId: task.task_id },
        requiresConfirmation: true
      }
    ];

    if (task.status !== TaskStatus.DONE) {
      actions.push({
        id: 'mark_complete',
        label: 'Mark Complete',
        action: 'mark_complete',
        payload: { taskId: task.task_id },
        requiresConfirmation: true
      });
    }

    return actions;
  }

  private getEntityData(entityType: string, entityId: string): any {
    if (entityType === 'task') {
      return mockTasks.find(t => t.task_id === entityId);
    }
    return null;
  }
}

// Mock Data
const mockNotificationRules: NotificationRule[] = [
  {
    id: 'rule_001',
    name: 'Task Assignment Notification',
    description: 'Notify users when they are assigned a new task',
    isActive: true,
    triggerType: 'assignment',
    entityType: 'task',
    conditions: [],
    recipients: [
      {
        type: 'user',
        identifier: '{{assignedTo}}',
        name: 'Assigned User',
        isRequired: true
      }
    ],
    channels: [
      {
        type: 'email',
        config: {},
        priority: 'high'
      },
      {
        type: 'push',
        config: {},
        priority: 'medium'
      }
    ],
    template: {
      id: 'template_001',
      name: 'Task Assignment',
      subject: 'New Task Assigned: {{taskTitle}}',
      body: 'You have been assigned a new task: {{taskTitle}}. Due date: {{dueDate}}. Priority: {{priority}}.',
      variables: ['taskTitle', 'dueDate', 'priority', 'assignedBy'],
      isSystemTemplate: true
    },
    timing: {
      trigger: 'immediate'
    },
    createdBy: 'system',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  }
];

const mockNotificationInstances: NotificationInstance[] = [
  {
    id: 'notif_001',
    ruleId: 'rule_001',
    ruleName: 'Task Assignment Notification',
    entityType: 'task',
    entityId: 'task_001',
    entityName: 'Technical Specification Review',
    status: 'delivered',
    priority: 'high',
    recipients: [
      {
        type: 'user',
        identifier: 'user_001',
        name: 'Dr. Ahmed Hassan',
        isRequired: true
      }
    ],
    channels: [
      {
        type: 'email',
        config: {},
        priority: 'high'
      }
    ],
    scheduledAt: '2025-07-02T14:30:00Z',
    sentAt: '2025-07-02T14:30:15Z',
    deliveredAt: '2025-07-02T14:30:18Z',
    retryCount: 0,
    maxRetries: 3,
    content: {
      subject: 'New Task Assigned: Technical Specification Review',
      body: 'You have been assigned a new task: Technical Specification Review. Due date: 2025-07-15. Priority: HIGH.',
      variables: {
        taskTitle: 'Technical Specification Review',
        dueDate: '2025-07-15',
        priority: 'HIGH'
      }
    },
    metadata: {
      ruleType: 'assignment',
      entityType: 'task'
    },
    createdAt: '2025-07-02T14:30:00Z',
    updatedAt: '2025-07-02T14:30:18Z'
  }
];

const mockTasks: TenderTask[] = [
  {
    task_id: 'task_001',
    tender_id: 'tender_001',
    title: 'Technical Specification Review',
    description: 'Review and validate technical requirements document',
    assigned_to_user_id: 'user_001',
    assigned_to_name: 'Dr. Ahmed Hassan',
    department: 'Medical Devices',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    due_date: '2025-07-15',
    attachment_refs: [],
    created_by: 'user_001',
    created_by_name: 'Dr. Ahmed Hassan',
    created_at: '2025-07-01T09:00:00Z',
    updated_at: '2025-07-02T14:30:00Z',
    estimated_hours: 16,
    dependencies: [],
    comments: []
  }
];

const mockDeadlineAlerts: DeadlineAlert[] = [
  {
    id: 'alert_001',
    type: 'task_due_soon',
    severity: 'warning',
    entityId: 'task_001',
    entityType: 'task',
    entityName: 'Technical Specification Review',
    assignedTo: 'user_001',
    assignedToName: 'Dr. Ahmed Hassan',
    dueDate: '2025-07-15T23:59:00Z',
    timeUntilDue: 18,
    description: 'Task "Technical Specification Review" is due in 18 hours',
    actions: [
      {
        id: 'extend_deadline',
        label: 'Extend Deadline',
        action: 'extend_deadline',
        requiresConfirmation: true
      }
    ],
    isAcknowledged: false,
    createdAt: '2025-07-14T05:00:00Z'
  }
];

export const notificationService = new NotificationService();
export default notificationService;
