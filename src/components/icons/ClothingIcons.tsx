import React from 'react';

// 基础层（内衣）图标
export const BaseLayerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M6 4h12M6 4v16M18 4v16M6 12h12M9 8h6M9 16h6" />
  </svg>
);

// T恤图标
export const TShirtIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M3 6l4-2h10l4 2M3 6v14h18V6M7 4l5 6l5-6" />
  </svg>
);

// 外套图标
export const JacketIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M4 4l4-2h8l4 2M4 4v16h16V4M8 2v4M16 2v4M8 14h2M14 14h2" />
  </svg>
);

// 裤子图标
export const PantsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M6 2h12v4l-2 14H8L6 6V2zM12 2v20" />
  </svg>
);

// 鞋子图标
export const ShoesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M3 14c0-2 1-3 3-3h12c2 0 3 1 3 3v4c0 1-1 2-2 2H5c-1 0-2-1-2-2v-4z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M6 11V7c0-1 1-2 2-2h8c1 0 2 1 2 2v4" />
  </svg>
);

// 帽子图标
export const HatIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M12 4c-4 0-7 2-7 4s3 4 7 4 7-2 7-4-3-4-7-4z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M5 8v4c0 2 3 4 7 4s7-2 7-4V8" />
  </svg>
);

// 围巾图标
export const ScarfIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M8 4c0 4 8 4 8 0M8 4c0 8 8 8 8 0M8 4v16c0 4 8 4 8 0V4" />
  </svg>
);

// 雨伞图标
export const UmbrellaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M12 2v20M12 2C6.5 2 2 6.5 2 12h20c0-5.5-4.5-10-10-10z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M12 22c1.5 0 2-1.5 2-3" />
  </svg>
);

// 太阳镜图标
export const SunglassesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M4 12h16M8 12c0 2-1 3-2 3s-2-1-2-3 1-3 2-3 2 1 2 3zM20 12c0 2-1 3-2 3s-2-1-2-3 1-3 2-3 2 1 2 3z" />
  </svg>
);

// 活动图标
export const ActivityIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M13.73 21a1 1 0 01-1.46 0M18 10.5c0-3.04-2.46-5.5-5.5-5.5S7 7.46 7 10.5c0 3.86-1.45 5.28-2.66 6.23-.66.53-.28 1.27.56 1.27h15.2c.84 0 1.22-.74.56-1.27-1.21-.95-2.66-2.37-2.66-6.23z" />
  </svg>
);

// 导出所有图标
export const ClothingIcons = {
  BaseLayer: BaseLayerIcon,
  TShirt: TShirtIcon,
  Jacket: JacketIcon,
  Pants: PantsIcon,
  Shoes: ShoesIcon,
  Hat: HatIcon,
  Scarf: ScarfIcon,
  Umbrella: UmbrellaIcon,
  Sunglasses: SunglassesIcon,
  Activity: ActivityIcon,
}; 
