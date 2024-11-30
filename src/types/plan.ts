export interface Plan {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: PlanType;
  description?: string;
}

export type PlanType = 'outdoor' | 'business' | 'sports' | 'other';

export interface PlanSettings {
  weatherAlerts: boolean;
  rainReminder: boolean;
  temperatureThreshold: {
    low: number;
    high: number;
  };
} 
