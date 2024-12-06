import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { getNews, trackUserBehavior } from '../../services/news';
import type { NewsItem } from '../../types/news';

interface NewsSectionProps {
  temperature: number;
  weather: string;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ temperature, weather }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const items = await getNews(temperature, weather);
        setNews(items);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [temperature, weather]);

  const handleNewsClick = (item: NewsItem) => {
    trackUserBehavior({
      type: 'click',
      keyword: item.tags[0],
      category: item.category
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">今日推荐</h2>
      {news.map(item => (
        <div
          key={item.id}
          className="cursor-pointer"
          onClick={() => handleNewsClick(item)}
        >
          <Card>
            <div className="flex items-start space-x-4">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {item.content}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs text-gray-500">{item.source}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}; 
