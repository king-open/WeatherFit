import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import type { UserSettings } from '../types/settings';

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
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // 检查通知权限
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const saveSettings = (newSettings: UserSettings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        setSettings(prev => ({
          ...prev,
          notifications: { ...prev.notifications, enabled: true }
        }));
      }
    }
  };

  const handleNotificationToggle = () => {
    if (!settings.notifications.enabled && notificationPermission !== 'granted') {
      requestNotificationPermission();
    } else {
      setSettings(prev => ({
        ...prev,
        notifications: { ...prev.notifications, enabled: !prev.notifications.enabled }
      }));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>

      {/* 通知设置 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">通知设置</h2>
        <Card>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">天气通知</p>
                <p className="text-sm text-gray-500">接收天气变化和穿衣建议提醒</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.notifications.enabled}
                  onChange={handleNotificationToggle}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-light"></div>
              </label>
            </div>

            {settings.notifications.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">推送时间</label>
                  <input
                    type="time"
                    className="input-field w-full mt-1 text-gray-900 bg-white"
                    value={settings.notifications.time}
                    onChange={e => saveSettings({
                      ...settings,
                      notifications: { ...settings.notifications, time: e.target.value }
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">通知类型</label>
                  <div className="mt-2 space-y-2">
                    {[
                      { value: 'weather', label: '天气变化提醒' },
                      { value: 'plan', label: '计划提醒' },
                      { value: 'clothing', label: '穿衣建议' }
                    ].map(type => (
                      <label key={type.value} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded text-primary-light focus:ring-primary-light"
                          checked={settings.notifications.types.includes(type.value as any)}
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
                        <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </section>

      {/* 天气偏好设置 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">天气偏好</h2>
        <Card>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">温度提醒阈值</label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm text-gray-500">低温提醒（°C）</label>
                  <input
                    type="number"
                    className="input-field w-full mt-1 text-gray-900 bg-white"
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
                  <label className="block text-sm text-gray-500">高温提醒（°C）</label>
                  <input
                    type="number"
                    className="input-field w-full mt-1 text-gray-900 bg-white"
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

            <div>
              <label className="block text-sm font-medium text-gray-700">降雨提醒阈值</label>
              <div className="flex items-center mt-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  value={settings.weatherPreferences.rainThreshold}
                  onChange={e => saveSettings({
                    ...settings,
                    weatherPreferences: {
                      ...settings.weatherPreferences,
                      rainThreshold: Number(e.target.value)
                    }
                  })}
                />
                <span className="ml-4 text-sm text-gray-700">
                  {settings.weatherPreferences.rainThreshold}%
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                当降雨概率超过此值时提醒带伞
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* 穿衣偏好设置 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">穿衣偏好</h2>
        <Card>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">寒冷阈值（°C）</label>
                <input
                  type="number"
                  className="input-field w-full mt-1 text-gray-900 bg-white"
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
                <label className="block text-sm font-medium text-gray-700">炎热阈值（°C）</label>
                <input
                  type="number"
                  className="input-field w-full mt-1 text-gray-900 bg-white"
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
