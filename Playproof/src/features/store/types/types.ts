// src/features/store/types/types.ts

// src/features/store/types.ts
export type ProductCategory = 'ITEM' | 'PROFILE' | 'MEMBERSHIP';
export type SortOption = 'RECOMMEND' | 'LOW_PRICE' | 'HIGH_PRICE';

export interface Product {
  id: number;
  title: string;
  price: number;
  imageSrc: string;
  category: ProductCategory;
  tags?: string[];
  
  // 구매 로직 관련 필드
  isOwned?: boolean;          // 이미 보유 중인지
  requiredMembership?: boolean; // 멤버십 필요 여부
  isRecommended?: boolean;    // 추천 상품 여부 (정렬용)
}

export interface StoreBanner {
  id: number;
  title: string;
  imageUrl: string;
  link?: string;
}