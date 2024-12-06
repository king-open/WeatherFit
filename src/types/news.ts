export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: 'weather' | 'fashion' | 'lifestyle' | 'health';
  tags: string[];
  imageUrl?: string;
  source: string;
  publishedAt: string;
  relevance: number;  // 相关度评分 0-1
}

export interface UserBehavior {
  id: string;
  type: 'view' | 'search' | 'click' | 'share';
  keyword?: string;
  category?: string;
  timestamp: string;
  duration?: number;  // 浏览时长（秒）
}

export interface NewsPreference {
  categories: Array<{
    name: string;
    weight: number;  // 权重 0-1
  }>;
  keywords: Array<{
    word: string;
    weight: number;
  }>;
  updateFrequency: number;  // 更新频率（分钟）
} 
