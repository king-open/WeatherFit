export type PlanType = 
  | 'outdoor'        // 户外活动
  | 'business'       // 商务会议
  | 'sports'         // 运动健身
  | 'entertainment'  // 休闲娱乐
  | 'study'          // 学习培训
  | 'family'         // 家庭活动
  | 'other';         // 其他安排

export type PlanCategory = 
  | 'work'           // 工作
  | 'exercise'       // 运动
  | 'social'         // 社交
  | 'study'          // 学习
  | 'personal'       // 个人
  | 'family'         // 家庭
  | 'other';         // 其他

export type PlanTag = 
  | 'important'      // 重要
  | 'urgent'         // 紧急
  | 'longterm'       // 长期
  | 'recurring'      // 重复
  | 'flexible'       // 灵活
  | 'custom';        // 自定义

export interface Plan {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: PlanType;
  category: PlanCategory;  // 新增：计划类别
  tags: PlanTag[];        // 新增：计划标签
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
