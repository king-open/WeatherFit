import type { ClothingHistory, AIRecommendation, SceneType } from '../types/assistant';
import { getAIFashionAdvice, getSceneAdvice } from './openai';

const HISTORY_KEY = 'weather-reminder-clothing-history';

// 添加用户偏好类型
interface UserPreference {
  id: string;
  name: string;
  value: string;
}

// 添加获取用户偏好的函数
const getUserPreferences = (): UserPreference[] => {
  try {
    const prefs = localStorage.getItem('user-preferences');
    return prefs ? JSON.parse(prefs) : [];
  } catch (error) {
    console.error('Failed to load user preferences:', error);
    return [];
  }
};

// 获取穿衣历史
export const getClothingHistory = (): ClothingHistory[] => {
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Failed to load clothing history:', error);
    return [];
  }
};

// 保存穿衣记录
export const saveClothingRecord = (record: Omit<ClothingHistory, 'id'>) => {
  try {
    const history = getClothingHistory();
    const newRecord: ClothingHistory = {
      ...record,
      id: Date.now().toString()
    };
    history.push(newRecord);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return newRecord;
  } catch (error) {
    console.error('Failed to save clothing record:', error);
    throw error;
  }
};

// 基于历史数据和天气情况生成穿衣建议
export const getAIRecommendation = async (
  temperature: number,
  weather: string,
  scene: SceneType
): Promise<AIRecommendation> => {
  try {
    // 获取历史数据
    const history = getClothingHistory();
    const preferences = getUserPreferences();

    // 调用 OpenAI API
    const aiAdvice = await getAIFashionAdvice({
      temperature,
      weather,
      scene,
      preferences: preferences.map(p => p.name),
      history: history.map(h => h.outfit.top[0]) // 简化历史记录
    });

    // 获取场景特定建议
    const sceneAdvice = await getSceneAdvice(scene);

    // 合并建议
    return {
      scene,
      temperature,
      weather,
      suggestions: {
        outfits: aiAdvice.outfits.map(outfit => ({
          ...outfit,
          confidence: calculateConfidence(temperature, weather, scene, outfit)
        })),
        reasons: [...aiAdvice.reasons, ...sceneAdvice.keyPoints],
        tips: [...aiAdvice.tips, ...sceneAdvice.tips]
      }
    };
  } catch (error) {
    console.error('AI Recommendation Error:', error);
    // 降级到本地推荐
    return getLocalRecommendation(temperature, weather, scene);
  }
};

// 修改 getLocalRecommendation 函数
const getLocalRecommendation = (
  temperature: number,
  weather: string,
  scene: SceneType
): AIRecommendation => {
  return {
    scene,
    temperature,
    weather,
    suggestions: {
      outfits: [{
        top: ['白色T恤'],
        bottom: ['牛仔裤'],
        shoes: ['运动鞋'],
        accessories: [],
        confidence: 0.7
      }],
      reasons: generateReasons(temperature, weather, scene),
      tips: generateTips(temperature, weather, scene)
    }
  };
};

// 添加 outfit 类型定义
interface Outfit {
  top: string[];
  bottom: string[];
  shoes: string[];
  accessories: string[];
}

// 修改 calculateConfidence 函数的类型
const calculateConfidence = (
  temperature: number,
  weather: string,
  scene: SceneType,
  outfit: Outfit
): number => {
  // 基于规则的置信度计算
  let confidence = 0.7; // 基础置信度

  // 根据场景调整
  switch (scene) {
    case 'work':
      confidence += outfit.top.some(item => 
        item.includes('衬衫') || item.includes('西装')) ? 0.2 : -0.1;
      break;
    case 'sports':
      confidence += outfit.top.some(item => 
        item.includes('运动')) ? 0.2 : -0.1;
      break;
    // ... 其他场景
  }

  // 根据天气调整
  if (weather.includes('雨') && outfit.accessories.includes('雨伞')) {
    confidence += 0.1;
  }

  return Math.min(Math.max(confidence, 0), 1); // 确保在 0-1 范围内
};

// 生成推荐理由
const generateReasons = (
  temperature: number,
  weather: string,
  scene: SceneType
): string[] => {
  const reasons = [
    `当前温度${temperature}°C，${weather}天气`,
    `适合${getSceneDescription(scene)}的穿着建议`
  ];

  if (weather.includes('雨')) {
    reasons.push('建议携带雨具');
  }

  return reasons;
};

// 生成穿搭建议
const generateTips = (
  temperature: number,
  weather: string,
  scene: SceneType
): string[] => {
  const tips = [];

  // 基于温度的建议
  if (temperature < 10) {
    tips.push('温度较低，注意保暖');
  } else if (temperature > 30) {
    tips.push('温度较高，建议穿着清凉透气的衣物');
  }

  // 基于场景的建议
  switch (scene) {
    case 'work':
      tips.push('保持专业得体的着装');
      break;
    case 'dating':
      tips.push('可以选择稍正式一点的搭配');
      break;
    case 'sports':
      tips.push('选择运动功能性面料，注意透气性');
      break;
    // ... 其他场景
  }

  return tips;
};

// 获取场景描述
const getSceneDescription = (scene: SceneType): string => {
  const descriptions: Record<SceneType, string> = {
    work: '工作场合',
    dating: '约会',
    sports: '运动',
    travel: '旅行',
    party: '聚会',
    interview: '面试',
    casual: '日常场合'
  };
  return descriptions[scene];
}; 
