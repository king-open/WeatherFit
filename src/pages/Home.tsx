import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { WeatherCard } from '../components/weather/WeatherCard';
import { Card } from '../components/common/Card';
import { getWeather, getWeatherIcon } from '../services/weather';
import { getClothingSuggestions } from '../services/clothing';
import type { Plan } from '../types/plan';
import { WeatherTrend } from '../components/weather/WeatherTrend';

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

// 从 localStorage 获取计划
const getStoredPlans = () => {
  try {
    const plans = localStorage.getItem('weather-reminder-plans');
    if (!plans) return [];
    
    const parsedPlans = JSON.parse(plans);
    // 确保日期格式正确
    const today = new Date().toISOString().split('T')[0];
    // 过滤出今天的计划并按时间排序
    return parsedPlans
      .filter((plan: Plan) => plan.date === today)
      .sort((a: Plan, b: Plan) => a.time.localeCompare(b.time));
  } catch (error) {
    console.error('Failed to load plans:', error);
    return [];
  }
};

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
  const [todayPlans, setTodayPlans] = useState<Plan[]>([]);
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

  // 加载今日计划
  const loadTodayPlans = () => {
    const plans = getStoredPlans();
    console.log('Today plans:', plans); // 添加调试日志
    setTodayPlans(plans);
  };

  // 添加 localStorage 变化监听
  useEffect(() => {
    loadTodayPlans(); // 初始加载

    // 创建一个 StorageEvent 监听器
    const handleStorageChange = () => {
      loadTodayPlans();
    };

    // 添加自定义事件监听器
    window.addEventListener('planUpdated', handleStorageChange);
    // 监听 localStorage 变化
    window.addEventListener('storage', handleStorageChange);

    // 每分钟刷新一次计划（处理跨天情况）
    const interval = setInterval(loadTodayPlans, 60000);

    return () => {
      window.removeEventListener('planUpdated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
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

      {/* 今日计划 */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">今日计划 ({todayPlans.length})</h2>
          <Link to="/plans" className="text-primary-light hover:text-primary-dark">
            管理计划
          </Link>
        </div>
        <Card>
          {todayPlans.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {todayPlans.map(plan => (
                <div key={plan.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{plan.title}</h3>
                      <p className="text-sm text-gray-600">{plan.time} · {plan.location}</p>
                    </div>
                    <span className="px-2 py-1 text-sm rounded-full bg-primary-light text-white">
                      {plan.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">今日暂无计划</p>
              <Link 
                to="/plans" 
                className="mt-2 inline-block text-primary-light hover:text-primary-dark"
              >
                添加计划
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}; 
