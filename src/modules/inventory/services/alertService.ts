import { BehaviorSubject, Observable, interval, combineLatest } from 'rxjs';
import { map, filter } from 'rxjs/operators';

// Alert Types and Interfaces
export interface StockAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  itemId: string;
  itemName: string;
  category: string;
  currentStock: number;
  threshold: number;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  actions: AlertAction[];
  metadata?: Record<string, any>;
}

export interface AlertAction {
  id: string;
  label: string;
  action: string;
  primary?: boolean;
  autoExecute?: boolean;
  confirmRequired?: boolean;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  type: AlertType;
  conditions: AlertCondition[];
  severity: AlertSeverity;
  isActive: boolean;
  notificationChannels: NotificationChannel[];
  schedule?: AlertSchedule;
  escalation?: AlertEscalation;
}

export interface AlertCondition {
  field: string;
  operator: 'LESS_THAN' | 'GREATER_THAN' | 'EQUALS' | 'NOT_EQUALS' | 'BETWEEN';
  value: number | string;
  secondValue?: number | string;
}

export interface NotificationChannel {
  type: 'EMAIL' | 'SMS' | 'PUSH' | 'WEBHOOK' | 'IN_APP';
  enabled: boolean;
  configuration: Record<string, any>;
}

export interface AlertSchedule {
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
  timezone: string;
}

export interface AlertEscalation {
  levels: EscalationLevel[];
  enabled: boolean;
}

export interface EscalationLevel {
  delayMinutes: number;
  recipients: string[];
  channels: NotificationChannel[];
}

export interface InventoryMetrics {
  itemId: string;
  currentStock: number;
  minLevel: number;
  maxLevel: number;
  reorderPoint: number;
  safetyStock: number;
  averageConsumption: number;
  leadTime: number;
  lastRestocked: Date;
  daysOfStock: number;
  turnoverRate: number;
  expiryDate?: Date;
  quality?: number;
}

export interface AlertDashboard {
  totalAlerts: number;
  unreadAlerts: number;
  criticalAlerts: number;
  resolvedToday: number;
  averageResolutionTime: number;
  alertsByType: Record<AlertType, number>;
  alertsBySeverity: Record<AlertSeverity, number>;
  trends: AlertTrend[];
}

export interface AlertTrend {
  date: string;
  total: number;
  critical: number;
  resolved: number;
}

export type AlertType = 
  | 'LOW_STOCK'
  | 'CRITICAL_STOCK'
  | 'OVERSTOCK'
  | 'EXPIRY_WARNING'
  | 'EXPIRED'
  | 'REORDER_POINT'
  | 'QUALITY_ISSUE'
  | 'SUPPLIER_DELAY'
  | 'COST_VARIANCE'
  | 'SYSTEM_ERROR';

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

class AlertService {
  private alerts$ = new BehaviorSubject<StockAlert[]>([]);
  private alertRules$ = new BehaviorSubject<AlertRule[]>([]);
  private metrics$ = new BehaviorSubject<InventoryMetrics[]>([]);
  private isMonitoring$ = new BehaviorSubject<boolean>(false);

  // Mock data
  private mockMetrics: InventoryMetrics[] = [
    {
      itemId: '1',
      currentStock: 750,
      minLevel: 1000,
      maxLevel: 5000,
      reorderPoint: 1200,
      safetyStock: 200,
      averageConsumption: 180,
      leadTime: 3,
      lastRestocked: new Date('2024-12-15'),
      daysOfStock: 4.2,
      turnoverRate: 6.5,
      expiryDate: new Date('2025-12-01'),
      quality: 9.5
    },
    {
      itemId: '2',
      currentStock: 1600,
      minLevel: 2000,
      maxLevel: 10000,
      reorderPoint: 2500,
      safetyStock: 300,
      averageConsumption: 85,
      leadTime: 2,
      lastRestocked: new Date('2024-12-20'),
      daysOfStock: 18.8,
      turnoverRate: 4.2,
      expiryDate: new Date('2026-06-15'),
      quality: 8.8
    },
    {
      itemId: '3',
      currentStock: 150,
      minLevel: 200,
      maxLevel: 1000,
      reorderPoint: 300,
      safetyStock: 50,
      averageConsumption: 25,
      leadTime: 1,
      lastRestocked: new Date('2024-12-28'),
      daysOfStock: 6.0,
      turnoverRate: 12.1,
      quality: 9.2
    }
  ];

  private defaultRules: AlertRule[] = [
    {
      id: 'rule-low-stock',
      name: 'Low Stock Alert',
      description: 'Alert when stock falls below minimum level',
      type: 'LOW_STOCK',
      conditions: [
        { field: 'currentStock', operator: 'LESS_THAN', value: 'minLevel' }
      ],
      severity: 'MEDIUM',
      isActive: true,
      notificationChannels: [
        { type: 'IN_APP', enabled: true, configuration: {} },
        { type: 'EMAIL', enabled: true, configuration: { recipients: ['inventory@company.com'] } }
      ]
    },
    {
      id: 'rule-critical-stock',
      name: 'Critical Stock Alert',
      description: 'Alert when stock is critically low',
      type: 'CRITICAL_STOCK',
      conditions: [
        { field: 'currentStock', operator: 'LESS_THAN', value: 'safetyStock' }
      ],
      severity: 'CRITICAL',
      isActive: true,
      notificationChannels: [
        { type: 'IN_APP', enabled: true, configuration: {} },
        { type: 'EMAIL', enabled: true, configuration: { recipients: ['manager@company.com'] } },
        { type: 'SMS', enabled: true, configuration: { phone: '+1234567890' } }
      ],
      escalation: {
        enabled: true,
        levels: [
          {
            delayMinutes: 30,
            recipients: ['director@company.com'],
            channels: [{ type: 'EMAIL', enabled: true, configuration: {} }]
          }
        ]
      }
    },
    {
      id: 'rule-expiry-warning',
      name: 'Expiry Warning',
      description: 'Alert when items are nearing expiry',
      type: 'EXPIRY_WARNING',
      conditions: [
        { field: 'daysToExpiry', operator: 'LESS_THAN', value: 30 }
      ],
      severity: 'HIGH',
      isActive: true,
      notificationChannels: [
        { type: 'IN_APP', enabled: true, configuration: {} }
      ]
    }
  ];

  constructor() {
    this.alertRules$.next(this.defaultRules);
    this.metrics$.next(this.mockMetrics);
    this.startMonitoring();
  }

  // Monitoring Control
  startMonitoring(): void {
    if (this.isMonitoring$.value) return;

    this.isMonitoring$.next(true);
    
    // Monitor every 30 seconds
    interval(30000).pipe(
      filter(() => this.isMonitoring$.value)
    ).subscribe(() => {
      this.checkAlerts();
    });

    // Initial check
    this.checkAlerts();
  }

  stopMonitoring(): void {
    this.isMonitoring$.next(false);
  }

  // Alert Management
  private async checkAlerts(): Promise<void> {
    const metrics = this.metrics$.value;
    const rules = this.alertRules$.value.filter(rule => rule.isActive);
    const currentAlerts = this.alerts$.value;
    const newAlerts: StockAlert[] = [];

    for (const metric of metrics) {
      for (const rule of rules) {
        // Skip if alert already exists and is not resolved
        const existingAlert = currentAlerts.find(
          alert => alert.itemId === metric.itemId && 
                  alert.type === rule.type && 
                  !alert.isResolved
        );
        
        if (existingAlert) continue;

        // Check if conditions are met
        if (this.evaluateConditions(metric, rule.conditions)) {
          const alert = this.createAlert(metric, rule);
          newAlerts.push(alert);
          
          // Send notifications
          await this.sendNotifications(alert, rule.notificationChannels);
        }
      }
    }

    if (newAlerts.length > 0) {
      this.alerts$.next([...newAlerts, ...currentAlerts]);
    }
  }

  private evaluateConditions(metric: InventoryMetrics, conditions: AlertCondition[]): boolean {
    return conditions.every(condition => {
      const fieldValue = this.getMetricValue(metric, condition.field);
      const compareValue = this.resolveValue(metric, condition.value);
      
      switch (condition.operator) {
        case 'LESS_THAN':
          return fieldValue < compareValue;
        case 'GREATER_THAN':
          return fieldValue > compareValue;
        case 'EQUALS':
          return fieldValue === compareValue;
        case 'NOT_EQUALS':
          return fieldValue !== compareValue;
        case 'BETWEEN':
          const secondValue = this.resolveValue(metric, condition.secondValue!);
          return fieldValue >= compareValue && fieldValue <= secondValue;
        default:
          return false;
      }
    });
  }

  private getMetricValue(metric: InventoryMetrics, field: string): number {
    switch (field) {
      case 'currentStock': return metric.currentStock;
      case 'minLevel': return metric.minLevel;
      case 'maxLevel': return metric.maxLevel;
      case 'reorderPoint': return metric.reorderPoint;
      case 'safetyStock': return metric.safetyStock;
      case 'daysOfStock': return metric.daysOfStock;
      case 'turnoverRate': return metric.turnoverRate;
      case 'quality': return metric.quality || 0;
      case 'daysToExpiry': 
        return metric.expiryDate ? 
          Math.ceil((metric.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 
          Infinity;
      default: return 0;
    }
  }

  private resolveValue(metric: InventoryMetrics, value: number | string): number {
    if (typeof value === 'number') return value;
    return this.getMetricValue(metric, value);
  }

  private createAlert(metric: InventoryMetrics, rule: AlertRule): StockAlert {
    const actions = this.generateActions(rule.type, metric);
    
    return {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: rule.type,
      severity: rule.severity,
      itemId: metric.itemId,
      itemName: this.getItemName(metric.itemId),
      category: this.getItemCategory(metric.itemId),
      currentStock: metric.currentStock,
      threshold: this.getThreshold(metric, rule.type),
      message: this.generateMessage(metric, rule),
      timestamp: new Date(),
      isRead: false,
      isResolved: false,
      actions,
      metadata: { ruleId: rule.id }
    };
  }

  private generateActions(type: AlertType, metric: InventoryMetrics): AlertAction[] {
    const actions: AlertAction[] = [
      {
        id: 'mark-read',
        label: 'Mark as Read',
        action: 'markRead'
      },
      {
        id: 'resolve',
        label: 'Resolve',
        action: 'resolve'
      }
    ];

    switch (type) {
      case 'LOW_STOCK':
      case 'CRITICAL_STOCK':
        actions.push(
          {
            id: 'create-po',
            label: 'Create Purchase Order',
            action: 'createPurchaseOrder',
            primary: true
          },
          {
            id: 'adjust-levels',
            label: 'Adjust Stock Levels',
            action: 'adjustLevels'
          }
        );
        break;
      
      case 'EXPIRY_WARNING':
        actions.push(
          {
            id: 'mark-clearance',
            label: 'Mark for Clearance',
            action: 'markClearance'
          },
          {
            id: 'extend-expiry',
            label: 'Extend Expiry Date',
            action: 'extendExpiry',
            confirmRequired: true
          }
        );
        break;
        
      case 'OVERSTOCK':
        actions.push(
          {
            id: 'return-supplier',
            label: 'Return to Supplier',
            action: 'returnToSupplier'
          },
          {
            id: 'transfer-location',
            label: 'Transfer Location',
            action: 'transferLocation'
          }
        );
        break;
    }

    return actions;
  }

  private generateMessage(metric: InventoryMetrics, rule: AlertRule): string {
    const itemName = this.getItemName(metric.itemId);
    
    switch (rule.type) {
      case 'LOW_STOCK':
        return `${itemName} is running low (${metric.currentStock} remaining, minimum: ${metric.minLevel})`;
      case 'CRITICAL_STOCK':
        return `CRITICAL: ${itemName} is critically low (${metric.currentStock} remaining, safety stock: ${metric.safetyStock})`;
      case 'EXPIRY_WARNING':
        const daysToExpiry = Math.ceil((metric.expiryDate!.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return `${itemName} expires in ${daysToExpiry} days`;
      case 'OVERSTOCK':
        return `${itemName} is overstocked (${metric.currentStock} on hand, maximum: ${metric.maxLevel})`;
      case 'REORDER_POINT':
        return `${itemName} has reached reorder point (${metric.currentStock} remaining)`;
      default:
        return `Alert for ${itemName}`;
    }
  }

  private getThreshold(metric: InventoryMetrics, type: AlertType): number {
    switch (type) {
      case 'LOW_STOCK': return metric.minLevel;
      case 'CRITICAL_STOCK': return metric.safetyStock;
      case 'OVERSTOCK': return metric.maxLevel;
      case 'REORDER_POINT': return metric.reorderPoint;
      default: return 0;
    }
  }

  private getItemName(itemId: string): string {
    const names: Record<string, string> = {
      '1': 'Culture Medium DMEM',
      '2': 'FSH (Folltropin)',
      '3': 'Liquid Nitrogen'
    };
    return names[itemId] || `Item ${itemId}`;
  }

  private getItemCategory(itemId: string): string {
    const categories: Record<string, string> = {
      '1': 'MEDIA',
      '2': 'HORMONE',
      '3': 'CRYO_MATERIAL'
    };
    return categories[itemId] || 'UNKNOWN';
  }

  // Notification System
  private async sendNotifications(alert: StockAlert, channels: NotificationChannel[]): Promise<void> {
    for (const channel of channels.filter(c => c.enabled)) {
      try {
        await this.sendNotification(alert, channel);
      } catch (error) {
        console.error(`Failed to send ${channel.type} notification:`, error);
      }
    }
  }

  private async sendNotification(alert: StockAlert, channel: NotificationChannel): Promise<void> {
    // Simulate sending notification
    await new Promise(resolve => setTimeout(resolve, 100));
    
    switch (channel.type) {
      case 'EMAIL':
        console.log(`Sending email notification for ${alert.type}:`, alert.message);
        break;
      case 'SMS':
        console.log(`Sending SMS notification for ${alert.type}:`, alert.message);
        break;
      case 'PUSH':
        console.log(`Sending push notification for ${alert.type}:`, alert.message);
        break;
      case 'WEBHOOK':
        console.log(`Sending webhook notification for ${alert.type}:`, alert);
        break;
      case 'IN_APP':
        // In-app notifications are handled by the UI
        break;
    }
  }

  // Alert Actions
  async executeAction(alertId: string, actionId: string, params?: any): Promise<boolean> {
    const alerts = this.alerts$.value;
    const alertIndex = alerts.findIndex(a => a.id === alertId);
    
    if (alertIndex === -1) return false;

    const alert = alerts[alertIndex];
    const action = alert.actions.find(a => a.id === actionId);
    
    if (!action) return false;

    try {
      switch (action.action) {
        case 'markRead':
          alert.isRead = true;
          break;
        
        case 'resolve':
          alert.isResolved = true;
          alert.resolvedBy = 'current-user';
          alert.resolvedAt = new Date();
          break;
        
        case 'createPurchaseOrder':
          await this.createPurchaseOrder(alert, params);
          alert.isResolved = true;
          alert.resolvedBy = 'current-user';
          alert.resolvedAt = new Date();
          break;
        
        case 'adjustLevels':
          await this.adjustStockLevels(alert, params);
          break;
        
        case 'markClearance':
          await this.markForClearance(alert);
          break;
        
        case 'extendExpiry':
          await this.extendExpiryDate(alert, params);
          alert.isResolved = true;
          alert.resolvedBy = 'current-user';
          alert.resolvedAt = new Date();
          break;
        
        default:
          console.log(`Executing action ${action.action} for alert ${alertId}`);
      }

      // Update alerts
      this.alerts$.next([...alerts]);
      return true;
    } catch (error) {
      console.error(`Failed to execute action ${actionId}:`, error);
      return false;
    }
  }

  private async createPurchaseOrder(alert: StockAlert, params: any): Promise<void> {
    console.log(`Creating purchase order for ${alert.itemName}`, params);
    // Implementation would create actual PO
  }

  private async adjustStockLevels(alert: StockAlert, params: any): Promise<void> {
    console.log(`Adjusting stock levels for ${alert.itemName}`, params);
    // Implementation would update stock levels
  }

  private async markForClearance(alert: StockAlert): Promise<void> {
    console.log(`Marking ${alert.itemName} for clearance`);
    // Implementation would mark items for clearance
  }

  private async extendExpiryDate(alert: StockAlert, params: any): Promise<void> {
    console.log(`Extending expiry date for ${alert.itemName}`, params);
    // Implementation would update expiry date
  }

  // Analytics and Dashboard
  getDashboardData(): AlertDashboard {
    const alerts = this.alerts$.value;
    const now = new Date();
    const today = now.toDateString();
    
    const resolvedToday = alerts.filter(
      a => a.isResolved && a.resolvedAt?.toDateString() === today
    ).length;

    const alertsByType = alerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {} as Record<AlertType, number>);

    const alertsBySeverity = alerts.reduce((acc, alert) => {
      acc[alert.severity] = (acc[alert.severity] || 0) + 1;
      return acc;
    }, {} as Record<AlertSeverity, number>);

    // Generate trend data for last 7 days
    const trends: AlertTrend[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayAlerts = alerts.filter(a => 
        a.timestamp.toISOString().split('T')[0] === dateStr
      );
      
      trends.push({
        date: dateStr,
        total: dayAlerts.length,
        critical: dayAlerts.filter(a => a.severity === 'CRITICAL').length,
        resolved: dayAlerts.filter(a => a.isResolved).length
      });
    }

    const resolvedAlerts = alerts.filter(a => a.isResolved && a.resolvedAt);
    const avgResolutionTime = resolvedAlerts.length > 0 
      ? resolvedAlerts.reduce((sum, alert) => {
          const resolution = alert.resolvedAt!.getTime() - alert.timestamp.getTime();
          return sum + resolution;
        }, 0) / resolvedAlerts.length / (1000 * 60) // Convert to minutes
      : 0;

    return {
      totalAlerts: alerts.filter(a => !a.isResolved).length,
      unreadAlerts: alerts.filter(a => !a.isRead && !a.isResolved).length,
      criticalAlerts: alerts.filter(a => a.severity === 'CRITICAL' && !a.isResolved).length,
      resolvedToday,
      averageResolutionTime: Math.round(avgResolutionTime),
      alertsByType,
      alertsBySeverity,
      trends
    };
  }

  // Rule Management
  addRule(rule: Omit<AlertRule, 'id'>): string {
    const newRule: AlertRule = {
      ...rule,
      id: `rule-${Date.now()}`
    };
    
    const rules = this.alertRules$.value;
    this.alertRules$.next([...rules, newRule]);
    
    return newRule.id;
  }

  updateRule(ruleId: string, updates: Partial<AlertRule>): boolean {
    const rules = this.alertRules$.value;
    const ruleIndex = rules.findIndex(r => r.id === ruleId);
    
    if (ruleIndex === -1) return false;
    
    rules[ruleIndex] = { ...rules[ruleIndex], ...updates };
    this.alertRules$.next([...rules]);
    
    return true;
  }

  deleteRule(ruleId: string): boolean {
    const rules = this.alertRules$.value;
    const filtered = rules.filter(r => r.id !== ruleId);
    
    if (filtered.length === rules.length) return false;
    
    this.alertRules$.next(filtered);
    return true;
  }

  // Observable Getters
  getAlerts(): Observable<StockAlert[]> {
    return this.alerts$.asObservable();
  }

  getUnreadAlerts(): Observable<StockAlert[]> {
    return this.alerts$.pipe(
      map(alerts => alerts.filter(a => !a.isRead && !a.isResolved))
    );
  }

  getCriticalAlerts(): Observable<StockAlert[]> {
    return this.alerts$.pipe(
      map(alerts => alerts.filter(a => a.severity === 'CRITICAL' && !a.isResolved))
    );
  }

  getAlertRules(): Observable<AlertRule[]> {
    return this.alertRules$.asObservable();
  }

  getMetrics(): Observable<InventoryMetrics[]> {
    return this.metrics$.asObservable();
  }

  // Cleanup
  dispose(): void {
    this.stopMonitoring();
    this.alerts$.complete();
    this.alertRules$.complete();
    this.metrics$.complete();
    this.isMonitoring$.complete();
  }
}

// Export singleton instance
export const alertService = new AlertService(); 