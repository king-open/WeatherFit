export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  adcode: string;  // 高德地图行政区划代码
  city: string;
  district: string;
  isFavorite: boolean;
  createdAt: string;
  lastUsed?: string;
}

export interface Route {
  id: string;
  name: string;
  from: Location;
  to: Location;
  distance: number;  // 单位：米
  duration: number;  // 单位：秒
  weatherAlerts: boolean;
  reminderTime?: number;  // 提前提醒时间（分钟）
}

export interface LocationPreference {
  autoLocate: boolean;
  defaultCity: string;
  maxRecentLocations: number;
  weatherAlertDistance: number;  // 单位：米，超过此距离时发送天气提醒
} 
