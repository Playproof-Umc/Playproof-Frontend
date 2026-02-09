// src/features/store/components/sections/StoreBannerSlider.tsx
import { useState, useEffect } from 'react';
import { STORE_BANNERS } from '@/features/store/data/mockStoreData';

export const StoreBannerSlider = () => {
  // 초기 배너 
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 5초마다 자동 전환 (마지막 후 1번으로 루프)
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % STORE_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-[280px] rounded-2xl overflow-hidden relative group bg-gray-100 mb-8">
      {/* 캐러셀 전환 방식 */}
      <div 
        className="w-full h-full flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {STORE_BANNERS.map((banner) => (
          <div key={banner.id} className="w-full h-full flex-shrink-0 relative">
            <img 
              src={banner.imageUrl} 
              alt={banner.title} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {STORE_BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === idx ? 'bg-white w-6' : 'bg-white/50 w-2 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
