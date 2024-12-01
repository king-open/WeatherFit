export type NotificationType = 'weather' | 'plan' | 'clothing';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface NotificationSettings {
  enabled: boolean;
  time: string;  // 格式: "HH:mm"
  types: NotificationType[];
} 
