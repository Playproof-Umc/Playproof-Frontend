// src/pages/store/StorePage.tsx
import React from 'react';
import { StoreLayout } from '@/features/store/components/StoreLayout';
import { StoreSearchBar } from '@/features/store/components/StoreSearchBar';
import { StoreBannerSlider } from '@/features/store/components/StoreBannerSlider';
import { ProductCard } from '@/features/store/components/ProductCard';
import { MOCK_PRODUCTS } from '@/features/store/data/mockStoreData';

const StorePage = () => {
  return (
    <StoreLayout>
      <div className="flex flex-col pb-20">
        <StoreSearchBar />
        <StoreBannerSlider />

        {/* 상품 리스트 섹션 */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">추천 아이템 🎁</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MOCK_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </StoreLayout>
  );
};

export default StorePage;