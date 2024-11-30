import React, { useEffect, useState } from 'react';
import { WeatherCard } from '../components/weather/WeatherCard';
import { Card } from '../components/common/Card';
import { getWeather, getWeatherIcon, getClothingSuggestion } from '../services/weather';
import type { Plan } from '../types/plan';

interface WeatherState {
  current: {
    temperature: number;
    humidity: number;
    weather: string;
    windDirection: string;
    windPower: string;
    reportTime: string;
    city: string;
  };
  forecast: Array<{
    date: string;
    dayWeather: string;
    nightWeather: string;
    dayTemp: number;
    nightTemp: number;
  }>;
}

const mockPlans: Plan[] = [
  {
    id: "1",
    title: "晨跑",
    date: "2024-03-20",
    time: "07:00",
    location: "公园",
    type: "sports"
  }
];

export const Home: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const data = await getWeather('331024'); // 修改为仙居县的城市编码
        setWeatherData(data);
        setError(null);
      } catch (err) {
        setError('获取天气数据失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // 每30分钟更新一次天气数据
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  if (!weatherData) {
    return null;
  }

  const { current, forecast } = weatherData;

  return (
    <div className="space-y-6">
      {/* 天气概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">今日天气</h2>
          <WeatherCard
            weather={{
              temperature: current.temperature,
              humidity: current.humidity,
              description: current.weather,
              icon: getWeatherIcon(current.weather),
              windDirection: current.windDirection,
              windPower: current.windPower,
              updateTime: current.reportTime,
              city: current.city
            }}
          />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4">穿衣建议</h2>
          <Card>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="p-2 bg-primary-light rounded-full text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <p className="text-gray-600">{getClothingSuggestion(current.temperature)}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="p-2 bg-primary-light rounded-full text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </span>
                <p className="text-gray-600">
                  {current.weather.includes('雨') ? '记得带伞' : '无需带伞'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 天气预报 */}
      <div>
        <h2 className="text-2xl font-bold mb-4">未来天气</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {forecast.slice(1).map((day) => (
            <Card key={day.date}>
              <div className="text-center">
                <p className="text-sm text-gray-500">{day.date}</p>
                <div className="my-2">
                  <p>{day.dayWeather}</p>
                  <p className="text-sm text-gray-500">{day.nightWeather}</p>
                </div>
                <p className="font-semibold">
                  {day.dayTemp}° / {day.nightTemp}°
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 今日计划 */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">今日计划</h2>
          <button className="text-primary-light hover:text-primary-dark">
            查看全部
          </button>
        </div>
        <Card>
          {mockPlans.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {mockPlans.map(plan => (
                <div key={plan.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{plan.title}</h3>
                      <p className="text-sm text-gray-600">{plan.time} @ {plan.location}</p>
                    </div>
                    <span className="px-2 py-1 text-sm rounded-full bg-primary-light text-white">
                      {plan.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">暂无计划</p>
          )}
        </Card>
      </div>
    </div>
  );
}; 
