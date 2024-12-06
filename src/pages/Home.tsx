import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { WeatherCard } from '../components/weather/WeatherCard';
import { Card } from '../components/common/Card';
import { getWeather, getWeatherIcon } from '../services/weather';
import { getClothingSuggestions } from '../services/clothing';
import { WeatherTrend } from '../components/weather/WeatherTrend';
import { AIAssistant } from '../components/assistant/AIAssistant';
import { NewsSection } from '../components/news/NewsSection';

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
    dayWind: string;
    nightWind: string;
    dayPower: string;
    nightPower: string;
  }>;
}

// 添加城市配置
const cities = [
  { code: '331024', name: '仙居' },
  { code: '330100', name: '杭州' },
  { code: '310100', name: '上海' },
  { code: '110100', name: '北京' },
  { code: '440100', name: '广州' },
  { code: '320100', name: '南京' },
  { code: '330200', name: '宁波' }
];

export const Home: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [weatherData, setWeatherData] = useState<WeatherState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCitySelect, setShowCitySelect] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const data = await getWeather(selectedCity.code);
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
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">{error}</div>
    );
  }

  if (!weatherData) return null;

  const { current, forecast } = weatherData;

  return (
    <div className="space-y-6">
      {/* 天气概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">今日天气</h2>
            <div className="relative">
              <button
                onClick={() => setShowCitySelect(!showCitySelect)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm"
              >
                <span>{selectedCity.name}</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* 城市选择下拉菜单 */}
              {showCitySelect && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1" role="menu">
                    {cities.map(city => (
                      <button
                        key={city.code}
                        onClick={() => {
                          setSelectedCity(city);
                          setShowCitySelect(false);
                        }}
                        className={`
                          w-full text-left px-4 py-2 text-sm
                          ${selectedCity.code === city.code 
                            ? 'bg-primary-light text-white' 
                            : 'text-gray-700 hover:bg-gray-100'
                          }
                        `}
                        role="menuitem"
                      >
                        {city.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
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
            <div className="space-y-4">
              {getClothingSuggestions(current.temperature, current.weather).map((suggestion, index) => (
                <div key={index} className="text-sm text-gray-600 py-2 border-b border-gray-100 last:border-0">
                  {suggestion}
                </div>
              ))}
              <Link 
                to="/settings" 
                className="flex items-center space-x-2 text-sm text-primary-light hover:text-primary-dark mt-4"
              >
                <span>自定义穿衣建议</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* 一周天气趋势 */}
      <div>
        <h2 className="text-2xl font-bold mb-4">多日预报</h2>
        <WeatherTrend forecast={forecast} />
      </div>

      {/* AI 助手 */}
      {weatherData && (
        <AIAssistant
          temperature={weatherData.current.temperature}
          weather={weatherData.current.weather}
        />
      )}

      {/* 新闻推荐 */}
      {weatherData && (
        <NewsSection
          temperature={weatherData.current.temperature}
          weather={weatherData.current.weather}
        />
      )}
    </div>
  );
}; 
