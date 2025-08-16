import { useState, useEffect } from 'react';
import { 
  Notification, 
  PregnancyUpdate, 
  DevelopmentAlert, 
  notificationService 
} from '../services/notificationService';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.isRead).length,
    markAsRead: (id: string) => notificationService.markAsRead(id),
    markAllAsRead: () => notificationService.markAllAsRead(),
    removeNotification: (id: string) => notificationService.removeNotification(id),
    clearAll: () => notificationService.clearAll(),
    addPregnancyUpdate: (update: PregnancyUpdate) => notificationService.addPregnancyNotification(update),
    addDevelopmentAlert: (alert: DevelopmentAlert) => notificationService.addDevelopmentAlert(alert),
    addTransferAlert: (transferId: string, message: string, priority?: 'low' | 'medium' | 'high') => 
      notificationService.addTransferAlert(transferId, message, priority),
    isConnected: notificationService.isWebSocketConnected(),
    getNotificationsByCategory: (category: string) => notifications.filter(n => n.category === category),
    getUnreadNotifications: () => notifications.filter(n => !n.isRead)
  };
}; 