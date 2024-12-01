export type PlanType = 
  | 'outdoor'        // 户外活动
  | 'business'       // 商务会议
  | 'sports'         // 运动健身
  | 'entertainment'  // 休闲娱乐
  | 'study'          // 学习培训
  | 'family'         // 家庭活动
  | 'other';         // 其他安排

export interface Plan {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: PlanType;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanSettings {
  weatherAlerts: boolean;
  rainReminder: boolean;
  temperatureThreshold: {
    low: number;
    high: number;
  };
} 
