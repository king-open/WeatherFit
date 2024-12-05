export interface WeatherAlert {
  type: 'rain' | 'temperature' | 'wind' | 'custom';
  condition: {
    threshold: number;
    operator: '>' | '<' | '=' | '>=' | '<=';
  };
  message: string;
  active: boolean;
  notifyBefore: number; // 提前多少分钟提醒
} 
