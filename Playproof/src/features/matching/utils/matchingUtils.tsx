//src/features/matching/constants/matchingConfig.tsx
import React from 'react';
import { Sword, Zap, Target, Crosshair, Heart, Eye, Flag, Shield, Star, User, Circle } from 'lucide-react';

// 포지션 ID에 따른 아이콘과 라벨 반환
export const getPositionInfo = (posId: string) => {
  const POS_MAP: Record<string, { label: string, icon: React.ReactNode }> = {
    // 롤
    'top': { label: '탑', icon: <Sword size={16} /> },
    'jungle': { label: '정글', icon: <Zap size={16} /> },
    'mid': { label: '미드', icon: <Target size={16} /> },
    'adc': { label: '원딜', icon: <Crosshair size={16} /> },
    'sup': { label: '서폿', icon: <Heart size={16} /> },
    // 발로란트
    'duelist': { label: '타격대', icon: <Sword size={16} /> },
    'initiator': { label: '척후대', icon: <Zap size={16} /> },
    'sentinel': { label: '감시자', icon: <Eye size={16} /> },
    'controller': { label: '전략가', icon: <Flag size={16} /> },
    // 오버워치
    'tank': { label: '탱커', icon: <Shield size={16} /> },
    'damage': { label: '딜러', icon: <Sword size={16} /> },
    'support': { label: '힐러', icon: <Heart size={16} /> },
    'flex': { label: '올라운더', icon: <Star size={16} /> },
    // 공용
    'newbie': { label: '뉴비', icon: <User size={16} /> },
    'normal': { label: '일반', icon: <Circle size={16} /> },
    'expert': { label: '고인물', icon: <Star size={16} /> },
  };

  return POS_MAP[posId] || { label: posId, icon: <User size={16} /> };
};