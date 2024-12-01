import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import type { UserSettings } from '../types/settings';
import type { NotificationType } from '../types/notification';

const STORAGE_KEY = 'weather-reminder-settings';

const defaultSettings: UserSettings = {
  notifications: {
    enabled: true,
    time: '07:00',
    types: ['weather', 'plan', 'clothing']
  },
  weatherPreferences: {
    temperatureUnit: 'celsius',
    rainThreshold: 50,
    temperatureAlerts: {
      low: 10,
      high: 30
    }
  },
  clothingPreferences: {
    coldWeather: 10,
    hotWeather: 30,
    rainProtection: true
  }
};

const notificationTypes: Array<{ value: NotificationType; label: string }> = [
  { value: 'weather', label: '天气提醒' },
  { value: 'plan', label: '计划提醒' },
  { value: 'clothing', label: '穿衣提醒' }
];

const getStoredSettings = (): UserSettings => {
  try {
    const settings = localStorage.getItem(STORAGE_KEY);
    return settings ? JSON.parse(settings) : defaultSettings;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return defaultSettings;
  }
};

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(getStoredSettings());

  const saveSettings = (newSettings: UserSettings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">系统设置</h1>

      {/* 通知设置 */}
      <section>
        <h2 className="text-lg font-semibold mb-4">通知设置</h2>
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`
                  p-2 rounded-lg transition-colors duration-300
                  ${settings.notifications.enabled 
                    ? 'bg-primary-light text-white' 
                    : 'bg-gray-100 text-gray-400'
                  }
                `}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d={settings.notifications.enabled
                        ? "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        : "M6 18L18 6M6 6l12 12"
                      } 
                    />
                  </svg>
                </span>
                <div>
                  <span className="text-gray-700 font-medium">
                    {settings.notifications.enabled ? '通知已开启' : '通知已关闭'}
                  </span>
                  <p className="text-sm text-gray-500">
                    {settings.notifications.enabled 
                      ? '你将收到天气和计划的实时提醒' 
                      : '你将不会收到任何通知提醒'
                    }
                  </p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={settings.notifications.enabled}
                  onChange={e => saveSettings({
                    ...settings,
                    notifications: { ...settings.notifications, enabled: e.target.checked }
                  })}
                  id="notifications-toggle"
                />
                <label
                  htmlFor="notifications-toggle"
                  className={`
                    block w-14 h-8 rounded-full transition-colors duration-300 cursor-pointer
                    ${settings.notifications.enabled ? 'bg-primary-light' : 'bg-gray-200'}
                  `}
                >
                  <span 
                    className={`
                      absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300
                      ${settings.notifications.enabled ? 'transform translate-x-6' : ''}
                    `}
                  />
                </label>
              </div>
            </div>

            {/* 其他通知设置只在通知开启时显示 */}
            <div className={`
              space-y-4 transition-all duration-300
              ${settings.notifications.enabled 
                ? 'opacity-100 max-h-96' 
                : 'opacity-0 max-h-0 overflow-hidden'
              }
            `}>
              <div>
                <label className="block text-sm font-medium text-gray-700">通知时间</label>
                <input
                  type="time"
                  className="mt-1 input-field"
                  value={settings.notifications.time}
                  onChange={e => saveSettings({
                    ...settings,
                    notifications: { ...settings.notifications, time: e.target.value }
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">通知类型</label>
                <div className="space-y-2">
                  {notificationTypes.map(type => (
                    <div key={type.value} className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded text-primary-light focus:ring-primary-light"
                        checked={settings.notifications.types.includes(type.value)}
                        onChange={e => {
                          const types = e.target.checked
                            ? [...settings.notifications.types, type.value]
                            : settings.notifications.types.filter(t => t !== type.value);
                          saveSettings({
                            ...settings,
                            notifications: { ...settings.notifications, types }
                          });
                        }}
                      />
                      <label className="ml-2 text-gray-700">{type.label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 天气偏好设置 */}
      <section>
        <h2 className="text-lg font-semibold mb-4">天气偏好</h2>
        <Card>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">降雨提醒阈值 (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="mt-1 input-field w-24"
                value={settings.weatherPreferences.rainThreshold}
                onChange={e => saveSettings({
                  ...settings,
                  weatherPreferences: {
                    ...settings.weatherPreferences,
                    rainThreshold: Number(e.target.value)
                  }
                })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">温度提醒</label>
              <div className="grid grid-cols-2 gap-4 mt-1">
                <div>
                  <label className="block text-xs text-gray-500">低温阈值 (°C)</label>
                  <input
                    type="number"
                    min="-30"
                    max="40"
                    className="mt-1 input-field w-20"
                    value={settings.weatherPreferences.temperatureAlerts.low}
                    onChange={e => saveSettings({
                      ...settings,
                      weatherPreferences: {
                        ...settings.weatherPreferences,
                        temperatureAlerts: {
                          ...settings.weatherPreferences.temperatureAlerts,
                          low: Number(e.target.value)
                        }
                      }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500">高温阈值 (°C)</label>
                  <input
                    type="number"
                    min="-30"
                    max="40"
                    className="mt-1 input-field w-20"
                    value={settings.weatherPreferences.temperatureAlerts.high}
                    onChange={e => saveSettings({
                      ...settings,
                      weatherPreferences: {
                        ...settings.weatherPreferences,
                        temperatureAlerts: {
                          ...settings.weatherPreferences.temperatureAlerts,
                          high: Number(e.target.value)
                        }
                      }
                    })}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* 穿衣偏好设置 */}
      <section>
        <h2 className="text-lg font-semibold mb-4">穿衣偏好</h2>
        <Card>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">寒冷阈值 (°C)</label>
                <input
                  type="number"
                  className="mt-1 input-field w-20"
                  value={settings.clothingPreferences.coldWeather}
                  onChange={e => saveSettings({
                    ...settings,
                    clothingPreferences: {
                      ...settings.clothingPreferences,
                      coldWeather: Number(e.target.value)
                    }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">炎热阈值 (°C)</label>
                <input
                  type="number"
                  className="mt-1 input-field w-20"
                  value={settings.clothingPreferences.hotWeather}
                  onChange={e => saveSettings({
                    ...settings,
                    clothingPreferences: {
                      ...settings.clothingPreferences,
                      hotWeather: Number(e.target.value)
                    }
                  })}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                className="rounded text-primary-light focus:ring-primary-light"
                checked={settings.clothingPreferences.rainProtection}
                onChange={e => saveSettings({
                  ...settings,
                  clothingPreferences: {
                    ...settings.clothingPreferences,
                    rainProtection: e.target.checked
                  }
                })}
              />
              <label className="ml-2 text-sm text-gray-700">
                下雨天自动提醒携带雨具
              </label>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}; 
