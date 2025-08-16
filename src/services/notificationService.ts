export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'pregnancy_update' | 'development_alert';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'transfer' | 'pregnancy' | 'development' | 'system' | 'alert';
  data?: any;
  isRead: boolean;
  expiresAt?: Date;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'danger';
  action: () => void;
}

export interface PregnancyUpdate {
  transferId: string;
  recipientId: string;
  checkupDay: number;
  result: 'POSITIVE' | 'NEGATIVE' | 'PENDING' | 'LOST';
  notes?: string;
  nextCheckDate?: Date;
  veterinarian: string;
}

export interface DevelopmentAlert {
  sessionId: string;
  embryoId?: string;
  alertType: 'slow_development' | 'abnormal_morphology' | 'temperature_deviation' | 'contamination';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendedAction: string;
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnected = false;

  constructor() {
    this.initializeWebSocket();
    this.startPeriodicUpdates();
  }

  private initializeWebSocket() {
    try {
      // In a real environment, this would connect to your WebSocket server
      // For demo purposes, we'll simulate real-time updates
      this.simulateRealTimeUpdates();
    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      this.scheduleReconnect();
    }
  }

  private simulateRealTimeUpdates() {
    // Simulate WebSocket connection
    this.isConnected = true;
    
    // Simulate receiving real-time pregnancy updates
    setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        this.generateMockPregnancyUpdate();
      }
    }, 30000);

    // Simulate receiving development alerts
    setInterval(() => {
      if (Math.random() < 0.05) { // 5% chance every 45 seconds
        this.generateMockDevelopmentAlert();
      }
    }, 45000);

    // Simulate system notifications
    setInterval(() => {
      if (Math.random() < 0.03) { // 3% chance every minute
        this.generateMockSystemNotification();
      }
    }, 60000);
  }

  private generateMockPregnancyUpdate() {
    const transferIds = ['ET-2025-001', 'ET-2025-002', 'ET-2025-003', 'ET-2025-004'];
    const results = ['POSITIVE', 'NEGATIVE', 'PENDING'] as const;
    const days = [15, 30, 45, 60];
    
    const transferId = transferIds[Math.floor(Math.random() * transferIds.length)];
    const result = results[Math.floor(Math.random() * results.length)];
    const day = days[Math.floor(Math.random() * days.length)];
    
    const update: PregnancyUpdate = {
      transferId,
      recipientId: `R-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      checkupDay: day,
      result,
      notes: result === 'POSITIVE' ? 'Strong heartbeat detected' : 
             result === 'NEGATIVE' ? 'No pregnancy detected' : 'Scheduled for follow-up',
      nextCheckDate: result === 'POSITIVE' ? new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) : undefined,
      veterinarian: 'Dr. Sarah Ahmed'
    };

    this.addPregnancyNotification(update);
  }

  private generateMockDevelopmentAlert() {
    const sessionIds = ['FS-2025-001', 'FS-2025-002', 'FS-2025-003'];
    const alertTypes = ['slow_development', 'abnormal_morphology', 'temperature_deviation'] as const;
    const severities = ['low', 'medium', 'high'] as const;
    
    const alert: DevelopmentAlert = {
      sessionId: sessionIds[Math.floor(Math.random() * sessionIds.length)],
      embryoId: `EMB-${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
      alertType: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      description: 'Development parameters outside normal range',
      recommendedAction: 'Monitor closely and consider intervention'
    };

    this.addDevelopmentAlert(alert);
  }

  private generateMockSystemNotification() {
    const systemMessages = [
      'Incubator temperature stabilized',
      'New embryo transfer scheduled',
      'Weekly report available',
      'Equipment maintenance completed',
      'Data backup completed successfully'
    ];

    const notification: Notification = {
      id: this.generateId(),
      type: 'info',
      title: 'System Update',
      message: systemMessages[Math.floor(Math.random() * systemMessages.length)],
      timestamp: new Date(),
      priority: 'low',
      category: 'system',
      isRead: false
    };

    this.addNotification(notification);
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.initializeWebSocket();
      }, Math.pow(2, this.reconnectAttempts) * 1000);
    }
  }

  private startPeriodicUpdates() {
    // Clean up expired notifications every 5 minutes
    setInterval(() => {
      this.cleanupExpiredNotifications();
    }, 5 * 60 * 1000);
  }

  private cleanupExpiredNotifications() {
    const now = new Date();
    this.notifications = this.notifications.filter(
      notification => !notification.expiresAt || notification.expiresAt > now
    );
    this.notifyListeners();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  addNotification(notification: Notification) {
    this.notifications.unshift(notification);
    // Keep only last 100 notifications
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(0, 100);
    }
    this.notifyListeners();
  }

  addPregnancyNotification(update: PregnancyUpdate) {
    const notification: Notification = {
      id: this.generateId(),
      type: update.result === 'POSITIVE' ? 'success' : 
            update.result === 'NEGATIVE' ? 'warning' : 'info',
      title: `Pregnancy Check - Day ${update.checkupDay}`,
      message: `Transfer ${update.transferId}: ${update.result}${update.notes ? ` - ${update.notes}` : ''}`,
      timestamp: new Date(),
      priority: update.result === 'POSITIVE' ? 'high' : 'medium',
      category: 'pregnancy',
      data: update,
      isRead: false,
      actions: [
        {
          id: 'view_details',
          label: 'View Details',
          type: 'primary',
          action: () => this.viewTransferDetails(update.transferId)
        },
        {
          id: 'schedule_next',
          label: 'Schedule Next Check',
          type: 'secondary',
          action: () => this.scheduleNextCheck(update.transferId)
        }
      ]
    };

    this.addNotification(notification);
  }

  addDevelopmentAlert(alert: DevelopmentAlert) {
    const notification: Notification = {
      id: this.generateId(),
      type: alert.severity === 'critical' || alert.severity === 'high' ? 'error' : 'warning',
      title: `Development Alert - ${alert.alertType.replace('_', ' ').toUpperCase()}`,
      message: `Session ${alert.sessionId}: ${alert.description}`,
      timestamp: new Date(),
      priority: alert.severity === 'critical' ? 'critical' : 
                alert.severity === 'high' ? 'high' : 'medium',
      category: 'development',
      data: alert,
      isRead: false,
      actions: [
        {
          id: 'view_session',
          label: 'View Session',
          type: 'primary',
          action: () => this.viewSessionDetails(alert.sessionId)
        },
        {
          id: 'take_action',
          label: 'Take Action',
          type: 'danger',
          action: () => this.takeRecommendedAction(alert)
        }
      ]
    };

    this.addNotification(notification);
  }

  addTransferAlert(transferId: string, message: string, priority: 'low' | 'medium' | 'high' = 'medium') {
    const notification: Notification = {
      id: this.generateId(),
      type: priority === 'high' ? 'error' : 'warning',
      title: 'Transfer Alert',
      message: `Transfer ${transferId}: ${message}`,
      timestamp: new Date(),
      priority,
      category: 'transfer',
      isRead: false,
      actions: [
        {
          id: 'view_transfer',
          label: 'View Transfer',
          type: 'primary',
          action: () => this.viewTransferDetails(transferId)
        }
      ]
    };

    this.addNotification(notification);
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.notifyListeners();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.isRead = true;
    });
    this.notifyListeners();
  }

  removeNotification(notificationId: string) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notifyListeners();
  }

  clearAll() {
    this.notifications = [];
    this.notifyListeners();
  }

  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.isRead);
  }

  getNotificationsByCategory(category: string): Notification[] {
    return this.notifications.filter(n => n.category === category);
  }

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    // Immediately call with current notifications
    listener(this.getNotifications());
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => {
      listener(this.getNotifications());
    });
  }

  // Action handlers
  private viewTransferDetails(transferId: string) {
    // In a real application, this would navigate to the transfer details
    console.log('Viewing transfer details for:', transferId);
    window.location.href = `/modules/embryo-transfer/transfer/${transferId}`;
  }

  private viewSessionDetails(sessionId: string) {
    console.log('Viewing session details for:', sessionId);
    window.location.href = `/modules/fertilization/session/${sessionId}`;
  }

  private scheduleNextCheck(transferId: string) {
    console.log('Scheduling next check for:', transferId);
    // This would open a scheduling modal or navigate to scheduling page
  }

  private takeRecommendedAction(alert: DevelopmentAlert) {
    console.log('Taking recommended action for alert:', alert);
    // This would open an action modal or execute the recommended action
  }

  // Connection status
  isWebSocketConnected(): boolean {
    return this.isConnected;
  }

  // Real-time pregnancy monitoring
  startPregnancyMonitoring(transferIds: string[]) {
    console.log('Starting pregnancy monitoring for transfers:', transferIds);
    // In a real implementation, this would set up specific monitoring for these transfers
  }

  stopPregnancyMonitoring(transferId: string) {
    console.log('Stopping pregnancy monitoring for transfer:', transferId);
  }

  // Development tracking
  startDevelopmentTracking(sessionId: string) {
    console.log('Starting development tracking for session:', sessionId);
  }

  stopDevelopmentTracking(sessionId: string) {
    console.log('Stopping development tracking for session:', sessionId);
  }
}

// Create singleton instance
export const notificationService = new NotificationService();

// Export types and functions for React integration
export const useNotificationsAPI = {
  markAsRead: (id: string) => notificationService.markAsRead(id),
  markAllAsRead: () => notificationService.markAllAsRead(),
  removeNotification: (id: string) => notificationService.removeNotification(id),
  clearAll: () => notificationService.clearAll(),
  addPregnancyUpdate: (update: PregnancyUpdate) => notificationService.addPregnancyNotification(update),
  addDevelopmentAlert: (alert: DevelopmentAlert) => notificationService.addDevelopmentAlert(alert),
  addTransferAlert: (transferId: string, message: string, priority?: 'low' | 'medium' | 'high') => 
    notificationService.addTransferAlert(transferId, message, priority),
  isConnected: () => notificationService.isWebSocketConnected(),
  subscribe: (listener: (notifications: Notification[]) => void) => notificationService.subscribe(listener)
};

export default notificationService; 