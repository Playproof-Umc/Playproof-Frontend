// src/features/store/data/mockStoreData.ts
import type { Product, StoreBanner } from '@/features/store/types';

export const STORE_BANNERS: StoreBanner[] = [
  { 
    id: 1, 
    title: '배너 1', 
    imageUrl: 'https://placehold.co/1200x300/2563eb/ffffff?text=Banner+1' 
  },
  { 
    id: 2, 
    title: '배너 2', 
    imageUrl: 'https://placehold.co/1200x300/1e293b/ffffff?text=Banner+2' 
  },
  { 
    id: 3, 
    title: '배너 3', 
    imageUrl: 'https://placehold.co/1200x300/dc2626/ffffff?text=Banner+3' 
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: '체크메이트 프로필 (보유중)',
    price: 3000,
    category: 'ITEM',
    imageSrc: 'https://placehold.co/400x400/f1f5f9/cbd5e1?text=Profile',
    isOwned: true,
    isRecommended: true,
  },
  {
    id: 2,
    title: '비싼 아이템 (금액 부족)',
    price: 999999,
    category: 'ITEM',
    imageSrc: 'https://placehold.co/400x400/f1f5f9/cbd5e1?text=Expensive',
    isRecommended: false,
  },
  {
    id: 3,
    title: '멤버십 전용 아이템',
    price: 1000,
    category: 'ITEM',
    imageSrc: 'https://placehold.co/400x400/f1f5f9/cbd5e1?text=VIP',
    requiredMembership: true,
  },
  {
    id: 4,
    title: '일반 아이템 (추천)',
    price: 500,
    category: 'ITEM',
    imageSrc: 'https://placehold.co/400x400/f1f5f9/cbd5e1?text=Normal',
    isRecommended: true,
  },
  {
    id: 5,
    title: '저렴한 아이템',
    price: 100,
    category: 'ITEM',
    imageSrc: 'https://placehold.co/400x400/f1f5f9/cbd5e1?text=Cheap',
  },
];
