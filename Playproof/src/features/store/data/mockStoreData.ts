// src/features/store/data/mockStoreData.ts
import type { Product, StoreBanner } from '../types/types';

export const STORE_BANNERS: StoreBanner[] = [
  {
    id: 1,
    title: '오픈 기념 이벤트',
    imageUrl: 'https://placehold.co/1200x300/2563eb/ffffff?text=OPEN+EVENT', 
  },
  {
    id: 2,
    title: '신규 아이템 출시',
    imageUrl: 'https://placehold.co/1200x300/1e293b/ffffff?text=NEW+ITEMS',
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: '체크메이트 프로필 테두리',
    price: 3000,
    category: 'ITEM',
    imageSrc: 'https://placehold.co/300x300/f1f5f9/94a3b8?text=Profile+Item',
    tags: ['NEW'],
  },
  {
    id: 2,
    title: '경험치 2배 부스터 (1시간)',
    price: 500,
    category: 'ITEM',
    imageSrc: 'https://placehold.co/300x300/f1f5f9/94a3b8?text=EXP+Booster',
    tags: ['HOT'],
  },
  {
    id: 3,
    title: '닉네임 변경권',
    price: 9900,
    category: 'ITEM',
    imageSrc: 'https://placehold.co/300x300/f1f5f9/94a3b8?text=Name+Change',
  },
  {
    id: 4,
    title: '프리미엄 멤버십 (30일)',
    price: 15000,
    category: 'MEMBERSHIP',
    imageSrc: 'https://placehold.co/300x300/f1f5f9/94a3b8?text=Membership',
  },
];
