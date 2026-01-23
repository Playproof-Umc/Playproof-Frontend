// src/features/matching/utils/matchingUtils.tsx
import React from 'react';
import { Sword, Zap, Target, Crosshair, Heart, Eye, Flag, Shield, Star, User, Circle } from 'lucide-react';
import type { MatchingData, FilterState } from '@/features/matching/types';

/* 포지션 ID에 따른 아이콘과 라벨 반환 */
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

/* 매칭 리스트를 검색어와 필터 조건에 따라 필터링하고 정렬하여 반환  */
export const filterMatches = (
  matches: MatchingData[], 
  searchText: string, 
  filterConditions: FilterState | null
): MatchingData[] => {
  let result = [...matches];

  // 검색어 필터
  if (searchText.length >= 2) {
    result = result.filter(item => 
      item.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  // 상세 조건 필터
  if (filterConditions) {
    const { minTs, memberCount, tags, useMic, positions, tiers } = filterConditions;

    if (minTs !== '상관 없음') {
      const minScore = parseInt(minTs.replace(/[^0-9]/g, '')) || 0;
      result = result.filter(item => item.tsScore >= minScore);
    }

    if (memberCount !== '제한 없음') {
      const count = parseInt(memberCount.replace(/[^0-9]/g, '')) || 0;
      result = result.filter(item => item.maxMembers === count);
    }

    if (tags.length > 0) {
      result = result.filter(item => 
        tags.every(tag => item.tags.includes(tag))
      );
    }

    if (useMic) {
      result = result.filter(item => item.mic === true);
    }

    if (positions.length > 0) {
      result = result.filter(item => 
        positions.some(pos => item.position.includes(pos))
      );
    }

    if (tiers.length > 0) {
      result = result.filter(item => tiers.includes(item.tier));
    }
  }

  // ID 기준 내림차순
  return result.sort((a, b) => b.id - a.id);
};