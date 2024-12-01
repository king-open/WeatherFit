export interface Notification {
  id: string;
  type: 'weather' | 'plan' | 'clothing';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const STORAGE_KEY = 'weather-reminder-notifications';

// 获取所有通知
export const getNotifications = (): Notification[] => {
  try {
    const notifications = localStorage.getItem(STORAGE_KEY);
    return notifications ? JSON.parse(notifications) : [];
  } catch (error) {
    console.error('Failed to load notifications:', error);
    return [];
  }
};

// 添加新通知
export const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
  try {
    const notifications = getNotifications();
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };
    notifications.unshift(newNotification);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    return newNotification;
  } catch (error) {
    console.error('Failed to add notification:', error);
  }
};

// 标记通知为已读
export const markAsRead = (id: string) => {
  try {
    const notifications = getNotifications();
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotifications));
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
  }
};

// 清除所有通知
export const clearNotifications = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Failed to clear notifications:', error);
  }
}; 
