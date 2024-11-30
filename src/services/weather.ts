import axios from 'axios';

const AMAP_KEY = import.meta.env.VITE_AMAP_KEY;

if (!AMAP_KEY) {
  throw new Error('高德地图 API key 未设置，请在 .env 文件中设置 VITE_AMAP_KEY');
}

interface AmapWeatherResponse {
  status: string;
  count: string;
  info: string;
  infocode: string;
  lives: Array<{
    province: string;
    city: string;
    adcode: string;
    weather: string;
    temperature: string;
    winddirection: string;
    windpower: string;
    humidity: string;
    reporttime: string;
  }>;
}

interface AmapWeatherForecastResponse {
  status: string;
  count: string;
  info: string;
  infocode: string;
  forecasts: Array<{
    city: string;
    adcode: string;
    province: string;
    reporttime: string;
    casts: Array<{
      date: string;
      week: string;
      dayweather: string;
      nightweather: string;
      daytemp: string;
      nighttemp: string;
      daywind: string;
      nightwind: string;
      daypower: string;
      nightpower: string;
    }>;
  }>;
}

export const getWeather = async (city: string) => {
  try {
    // 实时天气
    const liveRes = await axios.get<AmapWeatherResponse>(
      `https://restapi.amap.com/v3/weather/weatherInfo`,
      {
        params: {
          key: AMAP_KEY,
          city,
          extensions: 'base'
        }
      }
    );

    // 天气预报
    const forecastRes = await axios.get<AmapWeatherForecastResponse>(
      `https://restapi.amap.com/v3/weather/weatherInfo`,
      {
        params: {
          key: AMAP_KEY,
          city,
          extensions: 'all'
        }
      }
    );

    if (liveRes.data.status === '1' && forecastRes.data.status === '1') {
      const live = liveRes.data.lives[0];
      const forecast = forecastRes.data.forecasts[0];

      return {
        current: {
          temperature: parseInt(live.temperature),
          humidity: parseInt(live.humidity),
          windDirection: live.winddirection,
          windPower: live.windpower,
          weather: live.weather,
          reportTime: live.reporttime,
          city: live.city
        },
        forecast: forecast.casts.map(cast => ({
          date: cast.date,
          dayWeather: cast.dayweather,
          nightWeather: cast.nightweather,
          dayTemp: parseInt(cast.daytemp),
          nightTemp: parseInt(cast.nighttemp),
          dayWind: cast.daywind,
          nightWind: cast.nightwind,
          dayPower: cast.daypower,
          nightPower: cast.nightpower
        }))
      };
    }
    throw new Error('获取天气数据失败');
  } catch (error) {
    console.error('Weather API Error:', error);
    throw error;
  }
};

// 根据天气描述返回对应的图标名称
export const getWeatherIcon = (weather: string): string => {
  const iconMap: Record<string, string> = {
    '晴': 'sunny',
    '多云': 'cloudy',
    '阴': 'overcast',
    '小雨': 'light-rain',
    '中雨': 'moderate-rain',
    '大雨': 'heavy-rain',
    '暴雨': 'storm',
    '雷阵雨': 'thunder',
    '雪': 'snow',
    '雾': 'fog'
  };

  return iconMap[weather] || 'unknown';
};

// 获取穿衣建议
export const getClothingSuggestion = (temperature: number): string => {
  if (temperature >= 30) {
    return '天气炎热，建议穿着轻薄、透气的衣物';
  } else if (temperature >= 20) {
    return '温度适宜，建议穿着短袖或薄外套';
  } else if (temperature >= 10) {
    return '温度较凉，建议穿着长袖外套';
  } else {
    return '天气寒冷，建议穿着保暖衣物';
  }
}; 
