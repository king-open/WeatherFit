import React from 'react';
import { Card } from '../common/Card';

interface WeatherCardProps {
  weather: {
    temperature: number;
    humidity: number;
    description: string;
    icon: string;
    windDirection: string;
    windPower: string;
    updateTime: string;
    city?: string;
  };
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          {weather.city && (
            <p className="text-sm text-gray-500 mb-1">{weather.city}</p>
          )}
          <h3 className="text-3xl font-semibold">{weather.temperature}°C</h3>
          <p className="text-gray-600">{weather.description}</p>
          <p className="text-sm text-gray-500 mt-1">
            {weather.windDirection}风 {weather.windPower}级
          </p>
        </div>
        <img 
          src={`/weather-icons/${weather.icon}.svg`} 
          alt={weather.description}
          className="w-20 h-20"
        />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500">湿度</p>
          <p className="text-lg">{weather.humidity}%</p>
        </div>
        <div>
          <p className="text-gray-500">更新时间</p>
          <p className="text-sm">{new Date(weather.updateTime).toLocaleTimeString()}</p>
        </div>
      </div>
    </Card>
  );
}; 
