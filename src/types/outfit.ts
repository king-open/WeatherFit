export interface Outfit {
  id: string;
  name: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  tempRange: {
    min: number;
    max: number;
  };
  items: {
    top: string[];
    bottom: string[];
    shoes: string[];
    accessories: string[];
  };
  tags: string[];
  image?: string;
} 
