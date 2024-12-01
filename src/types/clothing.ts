export interface ClothingRule {
  id: string;
  minTemp: number;
  maxTemp: number;
  weather: string[];
  suggestions: {
    tops: string[];    // 上装建议
    bottoms: string[]; // 下装建议
    shoes: string[];   // 鞋子建议
    accessories: string[]; // 配件建议
  };
}

export interface ClothingPreference {
  id: string;
  name: string;
  rules: ClothingRule[];
  isDefault?: boolean;
} 
