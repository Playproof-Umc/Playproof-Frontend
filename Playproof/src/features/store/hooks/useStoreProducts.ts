// src/features/store/hooks/useStoreProducts.ts
import { useState, useMemo } from 'react';
import { MOCK_PRODUCTS } from '@/features/store/data/mockStoreData';
import type { SortOption, Product } from '@/features/store/types';

export const useStoreProducts = () => {
  const [keyword, setKeyword] = useState('');
  
  // 섹션별 정렬 상태
  const [recommendSort, setRecommendSort] = useState<SortOption>('RECOMMEND');
  const [allSort, setAllSort] = useState<SortOption>('RECOMMEND');

  // 검색 필터링
  const filteredProducts = useMemo(() => {
    if (!keyword) return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter(p => p.title.includes(keyword));
  }, [keyword]);

  // 정렬 함수
  const getSortedProducts = (products: Product[], option: SortOption) => {
    const sorted = [...products];
    switch (option) {
      case 'LOW_PRICE': return sorted.sort((a, b) => a.price - b.price);
      case 'HIGH_PRICE': return sorted.sort((a, b) => b.price - a.price);
      case 'RECOMMEND': return sorted.sort((a, b) => (Number(b.isRecommended) - Number(a.isRecommended)));
      default: return sorted;
    }
  };

  return {
    keyword,
    setKeyword,
    recommendSort,
    setRecommendSort,
    allSort,
    setAllSort,
    filteredProducts,
    getSortedProducts
  };
};