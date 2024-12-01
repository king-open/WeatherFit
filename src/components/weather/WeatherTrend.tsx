import React from 'react';
import { Card } from '../common/Card';

interface WeatherTrendProps {
  forecast: Array<{
    date: string;
    dayWeather: string;
    nightWeather: string;
    dayTemp: number;
    nightTemp: number;
  }>;
}

export const WeatherTrend: React.FC<WeatherTrendProps> = ({ forecast }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {forecast.map((day, index) => {
        const date = new Date(day.date);
        const isToday = index === 0;
        
        return (
          <Card key={day.date}>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">
                {isToday ? '今天' : date.getDate() + '日'}
              </div>
              <div className="text-lg font-medium text-gray-900 mb-2">
                {day.dayWeather}
              </div>
              <div className="text-base">
                <span className="text-gray-900">{day.dayTemp}°</span>
                <span className="text-gray-400 mx-1">/</span>
                <span className="text-gray-500">{day.nightTemp}°</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}; 
