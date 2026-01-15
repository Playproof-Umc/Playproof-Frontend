// src/pages/store/StorePage.tsx
import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronRight, MoreHorizontal } from 'lucide-react';
import { StoreLayout } from '@/features/store/components/StoreLayout';
import { StoreSearchBar } from '@/features/store/components/StoreSearchBar';
import { StoreBannerSlider } from '@/features/store/components/StoreBannerSlider';
import { ProductCard } from '@/features/store/components/ProductCard';
import { MOCK_PRODUCTS } from '@/features/store/data/mockStoreData';
import type { SortOption } from '@/features/store/types/types';

// 임시 유저 정보 (Context에서 가져와야 함)
const MOCK_USER = {
  isLoggedIn: true,
  point: 5400,
  membership: 'NORMAL'
};

const StorePage = () => {
  const [keyword, setKeyword] = useState('');
  
  // 섹션별 정렬 상태 관리 (4-b. 다른 섹션에 영향 없음)
  const [recommendSort, setRecommendSort] = useState<SortOption>('RECOMMEND');
  const [allSort, setAllSort] = useState<SortOption>('RECOMMEND');

  // 검색 필터링 로직
  const filteredProducts = useMemo(() => {
    if (!keyword) return MOCK_PRODUCTS;
    // 1-2. 제목/소개 검색 (여기선 title만 예시)
    return MOCK_PRODUCTS.filter(p => p.title.includes(keyword));
  }, [keyword]);

  // 정렬 유틸리티 함수
  const sortProducts = (products: typeof MOCK_PRODUCTS, option: SortOption) => {
    const sorted = [...products];
    switch (option) {
      case 'LOW_PRICE': return sorted.sort((a, b) => a.price - b.price);
      case 'HIGH_PRICE': return sorted.sort((a, b) => b.price - a.price);
      case 'RECOMMEND': return sorted.sort((a, b) => (Number(b.isRecommended) - Number(a.isRecommended)));
      default: return sorted;
    }
  };

  return (
    <StoreLayout>
      <div className="flex flex-col pb-20">
        
        {/* 3. 배너 */}
        <StoreBannerSlider />

        {/* 1. 검색바 (로그인 정보 전달) */}
        <StoreSearchBar 
          onSearch={setKeyword} 
          isLoggedIn={MOCK_USER.isLoggedIn} 
        />

        {/* 4. 추천 상품 섹션 */}
        <SectionHeader 
          title="추천 상품" 
          sortOption={recommendSort} 
          onSortChange={setRecommendSort} 
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {sortProducts(filteredProducts, recommendSort).slice(0, 4).map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              userPoint={MOCK_USER.point}
              isLoggedIn={MOCK_USER.isLoggedIn}
              userMembershipLevel={MOCK_USER.membership}
            />
          ))}
        </div>

        {/* 4. 전체 상품 섹션 (독립적인 정렬 적용) */}
        <SectionHeader 
          title="전체 상품" 
          sortOption={allSort} 
          onSortChange={setAllSort} 
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {sortProducts(filteredProducts, allSort).map((product) => (
            <ProductCard 
              key={`all-${product.id}`} 
              product={product}
              userPoint={MOCK_USER.point}
              isLoggedIn={MOCK_USER.isLoggedIn}
            />
          ))}
        </div>

        {/* 페이지네이션 (생략 - 이전 코드 유지) */}
      </div>
    </StoreLayout>
  );
};

// 4. 섹션 헤더 및 정렬 드롭다운 컴포넌트
const SectionHeader = ({ title, sortOption, onSortChange }: {
  title: string;
  sortOption: SortOption;
  onSortChange: (opt: SortOption) => void;
}) => {
  const SORT_LABELS: Record<SortOption, string> = {
    'RECOMMEND': '추천순',
    'LOW_PRICE': '가격 낮은순',
    'HIGH_PRICE': '가격 높은순',
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      
      {/* 4-a. 정렬 드롭다운 (간이 구현) */}
      <div className="relative group z-10">
        <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black">
          {SORT_LABELS[sortOption]}
          <ChevronDown size={14} />
        </button>
        <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-100 rounded-lg shadow-lg py-2 hidden group-hover:block">
          {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
            <button
              key={key}
              onClick={() => onSortChange(key)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortOption === key ? 'font-bold text-black' : 'text-gray-500'}`}
            >
              {SORT_LABELS[key]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorePage;