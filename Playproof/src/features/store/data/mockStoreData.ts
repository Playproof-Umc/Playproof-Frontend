// src/features/store/data/mockStoreData.ts
import type { Product, StoreBanner } from '@/features/store/types';

export const STORE_BANNERS: StoreBanner[] = [
  { 
    id: 1, 
    title: '배너 1', 
    imageUrl: '/store/banner.svg' 
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
    title: '외각플레이트-화이트',
    price: 15000,
    category: 'ITEM',
    imageSrc: '/store/plate-white.svg',
    isRecommended: true,
  },
  {
    id: 2,
    title: '외각플레이트-블랙',
    price: 15000,
    category: 'ITEM',
    imageSrc: '/store/plate-black.svg',
    isRecommended: true,
  },
  {
    id: 3,
    title: '아이콘-흰색말',
    price: 8000,
    category: 'ITEM',
    imageSrc: '/store/icon-whitenight.svg',
    isRecommended: false,
  },
  {
    id: 4,
    title: '네임플레이트-화이트-글자없음',
    price: 12000,
    category: 'ITEM',
    imageSrc: '/store/nameplate-white-noname.svg',
  },
  {
    id: 5,
    title: '네임플레이트-블랙-글자없음',
    price: 12000,
    category: 'ITEM',
    imageSrc: '/store/nameplate-black-noname.svg',
  },
];
