import type { ClothingRule, ClothingPreference } from '../types/clothing';

// 三层穿衣法则的建议
const getLayeredClothing = (temperature: number, weather: string) => {
  // 基础层（贴身层）- 排汗
  const baseLayer = {
    cold: ['保暖内衣', '保暖内裤'],
    mild: ['排汗内衣', '轻薄内衣'],
    hot: ['排汗速干内衣', '轻薄透气内衣']
  };

  // 中间层 - 保暖
  const midLayer = {
    cold: ['羊毛衫', '抓绒衣'],
    mild: ['长袖T恤', '轻薄毛衣'],
    hot: [] // 炎热天气可以不需要中间层
  };

  // 外层 - 防风防水
  const outerLayer = {
    cold: ['羽绒服', '厚外套'],
    mild: ['轻薄外套', '夹克'],
    hot: ['防晒衣', '轻薄防风衣']
  };

  // 根据温度确定季节类型
  let seasonType: 'cold' | 'mild' | 'hot';
  if (temperature <= 10) {
    seasonType = 'cold';
  } else if (temperature <= 25) {
    seasonType = 'mild';
  } else {
    seasonType = 'hot';
  }

  // 组合建议
  const suggestions: string[] = [];
  
  // 基础层建议
  suggestions.push('贴身层（排汗）：' + baseLayer[seasonType].join('或'));
  
  // 中间层建议
  if (midLayer[seasonType].length > 0) {
    suggestions.push('中间层（保暖）：' + midLayer[seasonType].join('或'));
  }
  
  // 外层建议
  suggestions.push('外层（防护）：' + outerLayer[seasonType].join('或'));

  // 特殊天气建议
  if (weather.includes('雨')) {
    suggestions.push('建议添加防水层：雨衣或防水外套');
  }
  if (weather.includes('风')) {
    suggestions.push('建议选择防风性能好的外层');
  }
  if (temperature >= 28) {
    suggestions.push('注意防晒：建议涂抹防晒霜，戴遮阳帽');
  }
  if (temperature <= 5) {
    suggestions.push('注意保暖：建议戴帽子、围巾和手套');
  }

  // 活动建议
  suggestions.push(getActivitySuggestion(temperature, weather));

  return suggestions;
};

// 活动建议
const getActivitySuggestion = (temperature: number, weather: string): string => {
  if (weather.includes('雨') || weather.includes('雪')) {
    return '不适合户外活动，建议室内活动';
  }
  if (temperature >= 35 || temperature <= 0) {
    return '不适宜剧烈运动，注意防暑/防寒';
  }
  if (temperature >= 15 && temperature <= 25 && !weather.includes('雨')) {
    return '天气适宜，适合户外活动';
  }
  return '适合适度户外活动，注意防护';
};

// 默认穿衣规则
const defaultRules: ClothingRule[] = [
  {
    id: '1',
    minTemp: -Infinity,
    maxTemp: 5,
    weather: ['晴', '多云', '阴'],
    suggestions: {
      tops: ['羽绒服', '保暖内衣'],
      bottoms: ['保暖裤', '厚牛仔裤'],
      shoes: ['保暖靴', '加绒运动鞋'],
      accessories: ['围巾', '手套', '帽子']
    }
  },
  {
    id: '2',
    minTemp: 5,
    maxTemp: 15,
    weather: ['晴', '多云', '阴'],
    suggestions: {
      tops: ['厚外套', '毛衣'],
      bottoms: ['牛仔裤', '休闲裤'],
      shoes: ['运动鞋', '休闲鞋'],
      accessories: ['围巾']
    }
  },
  {
    id: '3',
    minTemp: 15,
    maxTemp: 25,
    weather: ['晴', '多云', '阴'],
    suggestions: {
      tops: ['薄外套', '长袖衬衫'],
      bottoms: ['休闲裤', '牛仔裤'],
      shoes: ['运动鞋', '帆布鞋'],
      accessories: []
    }
  },
  {
    id: '4',
    minTemp: 25,
    maxTemp: Infinity,
    weather: ['晴', '多云', '阴'],
    suggestions: {
      tops: ['T恤', '短袖衬衫'],
      bottoms: ['短裤', '休闲裤'],
      shoes: ['凉鞋', '帆布鞋'],
      accessories: ['遮阳帽', '太阳镜']
    }
  }
];

// 获取穿衣建议
export const getClothingSuggestions = (temperature: number, weather: string): string[] => {
  // 获取三层穿衣法则的建议
  const layeredSuggestions = getLayeredClothing(temperature, weather);
  
  // 找到适合当前温度的基础规则
  const rule = defaultRules.find(
    r => temperature > r.minTemp && temperature <= r.maxTemp
  );

  if (!rule) return layeredSuggestions;

  // 添加配饰建议
  if (rule.suggestions.accessories && rule.suggestions.accessories.length > 0) {
    layeredSuggestions.push('建议配饰：' + rule.suggestions.accessories.join('、'));
  }

  return layeredSuggestions;
};

// 保存用户自定义规则
export const saveCustomRule = (rule: ClothingRule): void => {
  try {
    const rules = getCustomRules();
    rules.push(rule);
    localStorage.setItem('clothing-rules', JSON.stringify(rules));
  } catch (error) {
    console.error('Failed to save clothing rule:', error);
  }
};

// 获取用户自定义规则
export const getCustomRules = (): ClothingRule[] => {
  try {
    const rules = localStorage.getItem('clothing-rules');
    return rules ? JSON.parse(rules) : [];
  } catch (error) {
    console.error('Failed to load clothing rules:', error);
    return [];
  }
}; 
