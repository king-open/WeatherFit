export type SceneType = 
  | 'work'           // 工作场合
  | 'dating'         // 约会场合
  | 'sports'         // 运动场合
  | 'travel'         // 旅行场合
  | 'party'          // 聚会场合
  | 'interview'      // 面试场合
  | 'casual';        // 日常场合

export interface ClothingHistory {
  id: string;
  date: string;
  temperature: number;
  weather: string;
  scene: SceneType;
  outfit: {
    top: string[];
    bottom: string[];
    shoes: string[];
    accessories: string[];
  };
  rating: number;  // 1-5 评分
  notes?: string;
}

export interface AIRecommendation {
  scene: SceneType;
  temperature: number;
  weather: string;
  suggestions: {
    outfits: Array<{
      top: string[];
      bottom: string[];
      shoes: string[];
      accessories: string[];
      confidence: number;  // 推荐置信度 0-1
    }>;
    reasons: string[];    // 推荐理由
    tips: string[];       // 穿搭建议
  };
} 
