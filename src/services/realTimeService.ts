// Real-time Service for Clinical Hub - WebSocket Integration
interface WebSocketMessage {
  type: 'ANIMAL_UPDATE' | 'WORKFLOW_PROGRESS' | 'INJECTION_COMPLETE' | 'SCAN_RESULT' | 'ALERT_NOTIFICATION' | 'SYSTEM_STATUS';
  data: any;
  timestamp: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface RealTimeSubscription {
  id: string;
  topic: string;
  callback: (data: any) => void;
  active: boolean;
}

class RealTimeService {
  private ws: WebSocket | null = null;
  private subscriptions: Map<string, RealTimeSubscription> = new Map();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 5000;
  private isConnecting: boolean = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.connect();
  }

  private connect(): void {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.isConnecting = true;
    
    try {
      // Use development WebSocket URL - in production this would be from environment
      const wsUrl = 'ws://localhost:3001/ws/clinical-hub';
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.handleConnectionFailure();
    }
  }

  private handleOpen(): void {
    console.log('✅ WebSocket connected to Clinical Hub');
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    
    // Start heartbeat
    this.startHeartbeat();
    
    // Re-subscribe to all active subscriptions
    this.subscriptions.forEach(subscription => {
      if (subscription.active) {
        this.sendMessage({
          type: 'SUBSCRIBE',
          topic: subscription.topic,
          id: subscription.id
        });
      }
    });
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      this.processMessage(message);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log('WebSocket connection closed:', event.code, event.reason);
    this.isConnecting = false;
    this.stopHeartbeat();
    
    // Attempt to reconnect unless it was a clean close
    if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.scheduleReconnect();
    }
  }

  private handleError(error: Event): void {
    console.error('WebSocket error:', error);
    this.handleConnectionFailure();
  }

  private handleConnectionFailure(): void {
    this.isConnecting = false;
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.scheduleReconnect();
    } else {
      console.error('Max reconnection attempts reached. Real-time features disabled.');
      // Notify UI about offline mode
      this.notifyOfflineMode();
    }
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff
    
    console.log(`Scheduling reconnection attempt ${this.reconnectAttempts} in ${delay}ms`);
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.sendMessage({ type: 'PING' });
      }
    }, 30000); // 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private sendMessage(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  private processMessage(message: WebSocketMessage): void {
    console.log('📡 Real-time message received:', message.type, message.data);

    // Handle global message types
    switch (message.type) {
      case 'ANIMAL_UPDATE':
        this.broadcastToSubscribers('animal_updates', message.data);
        break;
      case 'WORKFLOW_PROGRESS':
        this.broadcastToSubscribers('workflow_progress', message.data);
        break;
      case 'INJECTION_COMPLETE':
        this.broadcastToSubscribers('injection_complete', message.data);
        this.showNotification('Injection Complete', `${message.data.animalName} - ${message.data.medication}`, 'success');
        break;
      case 'SCAN_RESULT':
        this.broadcastToSubscribers('scan_results', message.data);
        this.showNotification('Scan Complete', `${message.data.animalName} - Follicles: ${message.data.follicleCount}`, 'info');
        break;
      case 'ALERT_NOTIFICATION':
        this.broadcastToSubscribers('alerts', message.data);
        this.showNotification('Clinical Alert', message.data.message, message.data.severity || 'warning');
        break;
      case 'SYSTEM_STATUS':
        this.broadcastToSubscribers('system_status', message.data);
        break;
    }
  }

  private broadcastToSubscribers(topic: string, data: any): void {
    this.subscriptions.forEach(subscription => {
      if (subscription.active && subscription.topic === topic) {
        try {
          subscription.callback(data);
        } catch (error) {
          console.error(`Error in subscription callback for ${topic}:`, error);
        }
      }
    });
  }

  private showNotification(title: string, message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    // This would integrate with your notification system
    // For now, using browser notifications if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        tag: type
      });
    }
  }

  private notifyOfflineMode(): void {
    this.broadcastToSubscribers('system_status', {
      status: 'offline',
      message: 'Real-time features are temporarily unavailable'
    });
  }

  // Public API
  public subscribe(topic: string, callback: (data: any) => void): string {
    const id = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const subscription: RealTimeSubscription = {
      id,
      topic,
      callback,
      active: true
    };

    this.subscriptions.set(id, subscription);

    // If connected, send subscription message
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.sendMessage({
        type: 'SUBSCRIBE',
        topic,
        id
      });
    }

    return id;
  }

  public unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.active = false;
      
      // Send unsubscribe message
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.sendMessage({
          type: 'UNSUBSCRIBE',
          id: subscriptionId
        });
      }
      
      this.subscriptions.delete(subscriptionId);
    }
  }

  public publishUpdate(type: string, data: any): void {
    this.sendMessage({
      type: 'PUBLISH',
      topic: type,
      data,
      timestamp: new Date().toISOString()
    });
  }

  public getConnectionStatus(): 'connecting' | 'connected' | 'disconnected' | 'error' {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'error';
    }
  }

  public disconnect(): void {
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
    }
    
    this.subscriptions.clear();
  }

  // Request browser notification permissions
  public async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }
}

// Create singleton instance
export const realTimeService = new RealTimeService();
export default realTimeService; 