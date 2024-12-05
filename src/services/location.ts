import AMapLoader from '@amap/amap-jsapi-loader';
import type { Location, Route, LocationPreference } from '../types/location';

const STORAGE_KEY = 'weather-reminder-locations';
const PREFERENCES_KEY = 'weather-reminder-location-preferences';
const AMAP_KEY = import.meta.env.VITE_AMAP_KEY;

// 定义高德地图API返回的类型
interface AMapGeolocationResult {
  position: {
    lat: number;
    lng: number;
  };
  formattedAddress: string;
  addressComponent: {
    adcode: string;
    city: string;
    district: string;
  };
}

interface AMapDrivingResult {
  routes: Array<{
    distance: number;
    time: number;
  }>;
}

interface AMapSearchTip {
  id: string;
  name: string;
  district: string;
  address: string;
  location?: {
    lat: number;
    lng: number;
  };
  adcode: string;
  city: string;
}

// 获取位置偏好设置
export const getLocationPreferences = (): LocationPreference => {
  try {
    const prefs = localStorage.getItem(PREFERENCES_KEY);
    return prefs ? JSON.parse(prefs) : {
      autoLocate: true,
      defaultCity: '仙居',
      maxRecentLocations: 10,
      weatherAlertDistance: 5000 // 默认5公里
    };
  } catch (error) {
    console.error('Failed to load location preferences:', error);
    return {
      autoLocate: true,
      defaultCity: '仙居',
      maxRecentLocations: 10,
      weatherAlertDistance: 5000
    };
  }
};

// 保存位置偏好设置
export const saveLocationPreferences = (preferences: LocationPreference): void => {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save location preferences:', error);
  }
};

// 初始化高德地图
const initAMap = async () => {
  return await AMapLoader.load({
    key: AMAP_KEY,
    version: '2.0',
    plugins: ['AMap.Geolocation', 'AMap.Geocoder', 'AMap.AutoComplete', 'AMap.Driving']
  });
};

// 获取当前位置
export const getCurrentLocation = async (): Promise<Location> => {
  const AMap = await initAMap();
  
  return new Promise((resolve, reject) => {
    const geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000,
      buttonPosition: 'RB',
      buttonOffset: new AMap.Pixel(10, 20),
      zoomToAccuracy: true
    });

    geolocation.getCurrentPosition((status: string, result: AMapGeolocationResult) => {
      if (status === 'complete') {
        const location: Location = {
          id: Date.now().toString(),
          name: '当前位置',
          address: result.formattedAddress,
          latitude: result.position.lat,
          longitude: result.position.lng,
          adcode: result.addressComponent.adcode,
          city: result.addressComponent.city,
          district: result.addressComponent.district,
          isFavorite: false,
          createdAt: new Date().toISOString()
        };
        resolve(location);
      } else {
        reject(new Error('定位失败'));
      }
    });
  });
};

// 保存常用地点
export const saveFavoriteLocation = async (location: Omit<Location, 'id' | 'createdAt'>) => {
  try {
    const locations = await getFavoriteLocations();
    const newLocation: Location = {
      ...location,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    locations.push(newLocation);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
    return newLocation;
  } catch (error) {
    console.error('Failed to save location:', error);
    throw error;
  }
};

// 获取常用地点列表
export const getFavoriteLocations = async (): Promise<Location[]> => {
  try {
    const locations = localStorage.getItem(STORAGE_KEY);
    return locations ? JSON.parse(locations) : [];
  } catch (error) {
    console.error('Failed to get locations:', error);
    return [];
  }
};

// 规划路线
export const planRoute = async (from: Location, to: Location): Promise<Route> => {
  const AMap = await initAMap();
  
  return new Promise((resolve, reject) => {
    const driving = new AMap.Driving({
      policy: AMap.DrivingPolicy.LEAST_TIME
    });

    driving.search(
      [from.longitude, from.latitude],
      [to.longitude, to.latitude],
      (status: string, result: AMapDrivingResult) => {
        if (status === 'complete') {
          const route: Route = {
            id: Date.now().toString(),
            name: `${from.name} → ${to.name}`,
            from,
            to,
            distance: result.routes[0].distance,
            duration: result.routes[0].time,
            weatherAlerts: true
          };
          resolve(route);
        } else {
          reject(new Error('路线规划失败'));
        }
      }
    );
  });
};

// 搜索地点
export const searchLocation = async (keyword: string): Promise<Location[]> => {
  const AMap = await initAMap();
  
  return new Promise((resolve, reject) => {
    const autoComplete = new AMap.AutoComplete({
      city: '全国'
    });

    autoComplete.search(keyword, (status: string, result: { tips: AMapSearchTip[] }) => {
      if (status === 'complete') {
        const locations: Location[] = result.tips.map((tip) => ({
          id: tip.id,
          name: tip.name,
          address: tip.district + tip.address,
          latitude: tip.location?.lat || 0,
          longitude: tip.location?.lng || 0,
          adcode: tip.adcode,
          city: tip.city,
          district: tip.district,
          isFavorite: false,
          createdAt: new Date().toISOString()
        }));
        resolve(locations);
      } else {
        reject(new Error('搜索失败'));
      }
    });
  });
}; 
