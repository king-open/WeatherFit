export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  description: string;
  icon: string;
  date: string;
}

export interface WeatherForecast {
  daily: WeatherData[];
  hourly: WeatherData[];
}

export interface Location {
  city: string;
  province: string;
  latitude: number;
  longitude: number;
} 
