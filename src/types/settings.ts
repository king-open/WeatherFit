export interface UserSettings {
  notifications: {
    enabled: boolean;
    time: string;
    types: NotificationType[];
  };
  weatherPreferences: {
    temperatureUnit: 'celsius' | 'fahrenheit';
    rainThreshold: number;
    temperatureAlerts: {
      low: number;
      high: number;
    };
  };
  clothingPreferences: {
    coldWeather: number;
    hotWeather: number;
    rainProtection: boolean;
  };
}

export type NotificationType = 'weather' | 'plan' | 'clothing' | 'all'; 
