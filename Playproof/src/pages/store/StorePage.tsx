// src/pages/store/StorePage.tsx
import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { StoreLayout } from '@/features/store/components/StoreLayout';
import { StoreSearchBar } from '@/features/store/components/StoreSearchBar';
import { StoreBannerSlider } from '@/features/store/components/StoreBannerSlider';
import { ProductCard } from '@/features/store/components/ProductCard';
import { StoreSectionHeader } from '@/features/store/components/StoreSectionHeader';
import { StorePagination } from '@/features/store/components/StorePagination';
import { useStoreProducts } from '@/features/store/hooks/useStoreProducts';

// 임시 유저 정보
const MOCK_USER = {
  isLoggedIn: true,
  point: 5400,
  membership: 'NORMAL'
};

const ToggleButton = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className="text-sm font-bold text-blue-500 flex items-center gap-1 hover:text-blue-600"
  >
    {isOpen ? '접기' : '펼치기'}
    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
  </button>
);

const StorePage = () => {
  // 비즈니스 로직
  const { 
    setKeyword, 
    recommendSort, setRecommendSort,
    allSort, setAllSort,
    filteredProducts, getSortedProducts 
  } = useStoreProducts();

  // UI 상태
  const [isRecommendOpen, setIsRecommendOpen] = useState(true);
  const [isAllOpen, setIsAllOpen] = useState(true);

  return (
    <StoreLayout>
      <div className="flex flex-col pb-20">
        
        {/* 배너 */}
        <StoreBannerSlider />

        {/* 로그인 상태 변경 시 컴포넌트를 새로고침 */}
        <StoreSearchBar 
          key={MOCK_USER.isLoggedIn ? 'user' : 'guest'}
          onSearch={setKeyword} 
          isLoggedIn={MOCK_USER.isLoggedIn} 
        />

        {/* 추천 상품 섹션 */}
        <section className="mt-4 mb-12">
          <StoreSectionHeader 
            title="추천 상품" 
            sortOption={recommendSort} 
            onSortChange={setRecommendSort}
          >
            <ToggleButton 
              isOpen={isRecommendOpen} 
              onClick={() => setIsRecommendOpen(!isRecommendOpen)} 
            />
          </StoreSectionHeader>
          
          {isRecommendOpen && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {getSortedProducts(filteredProducts, recommendSort).slice(0, 4).map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  userPoint={MOCK_USER.point}
                  isLoggedIn={MOCK_USER.isLoggedIn}
                  userMembershipLevel={MOCK_USER.membership}
                />
              ))}
            </div>
          )}
        </section>

        {/* 전체 상품 섹션 */}
        <section className="mb-12">
          <StoreSectionHeader 
            title="전체 상품" 
            sortOption={allSort} 
            onSortChange={setAllSort} 
          >
             <ToggleButton 
              isOpen={isAllOpen} 
              onClick={() => setIsAllOpen(!isAllOpen)} 
            />
          </StoreSectionHeader>

          {isAllOpen && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {getSortedProducts(filteredProducts, allSort).map((product) => (
                <ProductCard 
                  key={`all-${product.id}`} 
                  product={product}
                  userPoint={MOCK_USER.point}
                  isLoggedIn={MOCK_USER.isLoggedIn}
                />
              ))}
            </div>
          )}
        </section>

        {/* 페이지네이션 */}
        <StorePagination />

      </div>
    </StoreLayout>
  );
};

export default StorePage;