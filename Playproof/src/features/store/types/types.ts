// src/features/store/types/types.ts

// 상품 카테고리
export type ProductCategory = 'ITEM' | 'PROFILE' | 'MEMBERSHIP';

// 정렬 기준
export type SortOption = 'RECOMMEND' | 'LOW_PRICE' | 'HIGH_PRICE';

// ✨ 여기가 핵심입니다! 이 부분이 없으면 에러가 납니다.
export interface Product {
  id: number;
  title: string;
  price: number;
  imageSrc: string;
  category: ProductCategory;
  tags?: string[];
  isOwned?: boolean;
}

// 배너 데이터 타입
export interface StoreBanner {
  id: number;
  title: string;
  imageUrl: string;
  link?: string;
}

// 유저 포인트 타입
export interface UserPoint {
  currentPoint: number;
}