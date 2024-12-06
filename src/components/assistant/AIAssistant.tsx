import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import type { SceneType, AIRecommendation } from '../../types/assistant';
import { getAIRecommendation, saveClothingRecord } from '../../services/assistant';

interface AIAssistantProps {
  temperature: number;
  weather: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ temperature, weather }) => {
  const [scene, setScene] = useState<SceneType>('casual');
  const [recommendation, setRecommendation] = useState<AIRecommendation | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [selectedOutfitIndex, setSelectedOutfitIndex] = useState<number>(-1);

  // 场景选项
  const sceneOptions: Array<{ value: SceneType; label: string; icon: JSX.Element }> = [
    {
      value: 'casual',
      label: '日常',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      value: 'work',
      label: '工作',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    // ... 其他场景选项
  ];

  // 获取推荐
  const handleGetRecommendation = async () => {
    try {
      const result = await getAIRecommendation(temperature, weather, scene);
      setRecommendation(result);
      setShowRating(false);
      setSelectedOutfitIndex(-1);
    } catch (error) {
      console.error('Failed to get AI recommendation:', error);
      // 可以添加错误提示
    }
  };

  // 选择穿搭
  const handleSelectOutfit = (index: number) => {
    setSelectedOutfitIndex(index);
    setShowRating(true);
  };

  // 评分
  const handleRate = async (rating: number) => {
    if (recommendation && selectedOutfitIndex >= 0) {
      const outfit = recommendation.suggestions.outfits[selectedOutfitIndex];
      await saveClothingRecord({
        date: new Date().toISOString(),
        temperature,
        weather,
        scene,
        outfit,
        rating,
      });
      setShowRating(false);
    }
  };

  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">AI 穿搭助手</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {temperature}°C · {weather}
          </span>
        </div>
      </div>

      {/* 场景选择 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {sceneOptions.map(option => (
          <button
            key={option.value}
            onClick={() => setScene(option.value)}
            className={`
              flex items-center space-x-2 p-3 rounded-lg transition-colors
              ${scene === option.value 
                ? 'bg-primary-light text-white' 
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            {option.icon}
            <span>{option.label}</span>
          </button>
        ))}
      </div>

      {/* 获取推荐按钮 */}
      <Button 
        onClick={handleGetRecommendation}
        className="w-full"
      >
        获取穿搭建议
      </Button>

      {/* 推荐结果 */}
      {recommendation && (
        <div className="space-y-4">
          {/* 推荐理由 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">推荐理由</h3>
            <ul className="space-y-2">
              {recommendation.suggestions.reasons.map((reason, index) => (
                <li key={index} className="text-gray-600 text-sm">
                  • {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* 穿搭建议 */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">推荐穿搭</h3>
            {recommendation.suggestions.outfits.map((outfit, index) => (
              <div
                key={index}
                className={`
                  p-4 rounded-lg border transition-colors cursor-pointer
                  ${selectedOutfitIndex === index 
                    ? 'border-primary-light bg-primary-light/5' 
                    : 'border-gray-200 hover:border-primary-light'
                  }
                `}
                onClick={() => handleSelectOutfit(index)}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">上装：{outfit.top.join(' + ')}</p>
                      <p className="text-sm text-gray-600">下装：{outfit.bottom.join(' + ')}</p>
                      <p className="text-sm text-gray-600">鞋子：{outfit.shoes.join(' + ')}</p>
                      {outfit.accessories.length > 0 && (
                        <p className="text-sm text-gray-600">
                          配饰：{outfit.accessories.join(' + ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    推荐度：{Math.round(outfit.confidence * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 评分面板 */}
          {showRating && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">这套穿搭怎么样？</h3>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => handleRate(rating)}
                    className={`
                      p-2 rounded-lg transition-colors
                      hover:bg-primary-light hover:text-white
                    `}
                  >
                    {'⭐'.repeat(rating)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 穿搭建议 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2">小贴士</h3>
            <ul className="space-y-2">
              {recommendation.suggestions.tips.map((tip, index) => (
                <li key={index} className="text-gray-600 text-sm">
                  • {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
}; 
