// src/features/matching/constants/matchingConfig.tsx
/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { Sword, Zap, Target, Crosshair, Heart, Eye, Flag, Shield, Star, User, Circle } from 'lucide-react';

export const MY_AZITS = [
  { id: 'azit-1', name: '즐겜러들의 쉼터' },
  { id: 'azit-2', name: '빡겜 클랜 본부' }
];

export const TAGS = ["협력 유저", "소통 원활", "실력 중심", "즐겜 유저", "하드캐리", "오더가능"];

export const GAME_CONFIG: Record<string, { 
  positions: { id: string; label: string; icon: React.ReactNode }[];
  tiers: string[];
}> = {
  '리그오브레전드': {
    positions: [
      { id: 'top', label: '탑', icon: <Sword size={20} /> },
      { id: 'jungle', label: '정글', icon: <Zap size={20} /> },
      { id: 'mid', label: '미드', icon: <Target size={20} /> },
      { id: 'adc', label: '원딜', icon: <Crosshair size={20} /> },
      { id: 'sup', label: '서폿', icon: <Heart size={20} /> },
    ],
    tiers: ['아이언', '브론즈', '실버', '골드', '플래티넘', '에메랄드', '다이아몬드', '마스터', '그랜드마스터', '챌린저']
  },
  '발로란트': {
    positions: [
      { id: 'duelist', label: '타격대', icon: <Sword size={20} /> },
      { id: 'initiator', label: '척후대', icon: <Zap size={20} /> },
      { id: 'sentinel', label: '감시자', icon: <Eye size={20} /> },
      { id: 'controller', label: '전략가', icon: <Flag size={20} /> },
    ],
    tiers: ['아이언', '브론즈', '실버', '골드', '플래티넘', '다이아몬드', '초월자', '불멸', '레디언트']
  },
  '오버워치': {
    positions: [
      { id: 'tank', label: '탱커', icon: <Shield size={20} /> },
      { id: 'damage', label: '딜러', icon: <Sword size={20} /> },
      { id: 'support', label: '힐러', icon: <Heart size={20} /> },
      { id: 'flex', label: '올라운더', icon: <Star size={20} /> },
    ],
    tiers: ['브론즈', '실버', '골드', '플래티넘', '다이아몬드', '마스터', '그랜드마스터', '상위 500위']
  },
  '배틀그라운드': {
    positions: [
      { id: 'newbie', label: '뉴비', icon: <User size={20} /> },
      { id: 'normal', label: '일반', icon: <Circle size={20} /> },
      { id: 'expert', label: '고인물', icon: <Star size={20} /> },
    ],
    tiers: ['브론즈', '실버', '골드', '플래티넘', '크리스탈', '다이아몬드', '마스터', '서바이버']
  },
  'Steam': {
    positions: [
      { id: 'newbie', label: '뉴비', icon: <User size={20} /> },
      { id: 'normal', label: '일반', icon: <Circle size={20} /> },
      { id: 'expert', label: '고인물', icon: <Star size={20} /> },
    ],
    tiers: ['입문', '초보', '중수', '고수', '초고수']
  },
  '기타': {
     positions: [{ id: 'all', label: '전체', icon: <User size={20} /> }],
     tiers: ['레벨 무관']
  }
};

export const GAME_LIST = Object.keys(GAME_CONFIG);