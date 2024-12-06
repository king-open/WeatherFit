import type { NewsItem, UserBehavior, NewsPreference } from '../types/news';

const BEHAVIOR_KEY = 'weather-reminder-behavior';
const PREFERENCE_KEY = 'weather-reminder-news-preference';

// 获取新闻列表
export const getNews = async (temperature: number, weather: string): Promise<NewsItem[]> => {
  try {
    // 获取用户行为数据
    const behaviors = getBehaviors();
    const preferences = getNewsPreferences();
    
    // 分析用户兴趣
    const interests = analyzeUserInterests(behaviors);
    
    // 生成新闻列表
    const newsItems: NewsItem[] = [
      {
        id: '1',
        title: `${weather}天气穿搭指南`,
        content: `今日气温${temperature}°C，${weather}天气，建议穿着舒适透气的衣物。`,
        category: 'fashion',
        tags: ['穿搭', weather],
        source: '穿搭推荐',
        publishedAt: new Date().toISOString(),
        relevance: 0.9
      },
      {
        id: '2',
        title: '天气变化提醒',
        content: `今日气温${temperature}°C，${weather}天气，建议合理安排户外活动。`,
        category: 'weather',
        tags: ['天气', '出行'],
        source: '气象台',
        publishedAt: new Date().toISOString(),
        relevance: 0.8
      }
    ];

    // 根据用户兴趣排序
    return rankNewsByRelevance(newsItems, interests, preferences);
  } catch (error) {
    console.error('Failed to get news:', error);
    return [];
  }
};

// 记录用户行为
export const trackUserBehavior = (behavior: Omit<UserBehavior, 'id' | 'timestamp'>) => {
  try {
    const behaviors = getBehaviors();
    const newBehavior: UserBehavior = {
      ...behavior,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    behaviors.push(newBehavior);
    localStorage.setItem(BEHAVIOR_KEY, JSON.stringify(behaviors));
  } catch (error) {
    console.error('Failed to track behavior:', error);
  }
};

// 获取用户行为历史
const getBehaviors = (): UserBehavior[] => {
  try {
    const behaviors = localStorage.getItem(BEHAVIOR_KEY);
    return behaviors ? JSON.parse(behaviors) : [];
  } catch (error) {
    console.error('Failed to get behaviors:', error);
    return [];
  }
};

// 获取新闻偏好设置
const getNewsPreferences = (): NewsPreference => {
  try {
    const prefs = localStorage.getItem(PREFERENCE_KEY);
    return prefs ? JSON.parse(prefs) : getDefaultPreferences();
  } catch (error) {
    console.error('Failed to get news preferences:', error);
    return getDefaultPreferences();
  }
};

// 分析用户兴趣
const analyzeUserInterests = (behaviors: UserBehavior[]) => {
  const interests: Record<string, number> = {};
  
  behaviors.forEach(behavior => {
    // 根据行为类型赋予不同权重
    const weight = {
      view: 1,
      search: 2,
      click: 1.5,
      share: 3
    }[behavior.type];

    // 更新关键词权重
    if (behavior.keyword) {
      interests[behavior.keyword] = (interests[behavior.keyword] || 0) + weight;
    }

    // 更新分类权重
    if (behavior.category) {
      interests[behavior.category] = (interests[behavior.category] || 0) + weight;
    }
  });

  return interests;
};

// 对新闻进行排序
const rankNewsByRelevance = (
  news: NewsItem[],
  interests: Record<string, number>,
  preferences: NewsPreference
): NewsItem[] => {
  return news
    .map(item => {
      let score = item.relevance;

      // 根据分类偏好调整分数
      const categoryPref = preferences.categories.find(c => c.name === item.category);
      if (categoryPref) {
        score *= categoryPref.weight;
      }

      // 根据关键词兴趣调整分数
      item.tags.forEach(tag => {
        if (interests[tag]) {
          score += interests[tag] * 0.1;
        }
      });

      return { ...item, relevance: score };
    })
    .sort((a, b) => b.relevance - a.relevance);
};

// 默认偏好设置
const getDefaultPreferences = (): NewsPreference => ({
  categories: [
    { name: 'weather', weight: 1 },
    { name: 'fashion', weight: 0.8 },
    { name: 'lifestyle', weight: 0.6 },
    { name: 'health', weight: 0.7 }
  ],
  keywords: [],
  updateFrequency: 30
}); 
