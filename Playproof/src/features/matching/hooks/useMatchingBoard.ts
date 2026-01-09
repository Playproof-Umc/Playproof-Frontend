// src/features/matching/hooks/useMatchingBoard.ts
import { useState, useMemo, useCallback } from 'react';
import type { MatchingData, FilterState } from '@/features/matching/types/types';

const INITIAL_MOCK_DATA: MatchingData[] = [
  {
    id: 1,
    game: '리그오브레전드',
    title: '칼바람 나락 즐겜팟 구함',
    tier: '골드',
    tags: ['즐겜 유저', '소통 원활'],
    azit: '즐겜러들의 쉼터',
    position: ['top', 'mid'],
    memo: '매너 게임 하실 분만 오세요~',
    currentMembers: 2,
    maxMembers: 5,
    time: '10분 전',
    views: 120,
    likes: 5,
    comments: 2,
    tsScore: 80,
    mic: true,
    hostUser: { id: 'user-1', nickname: '페이커팬', avatarUrl: '' }
  },
  {
    id: 2,
    game: '오버워치',
    title: '경쟁전 빡겜 하실 힐러님',
    tier: '다이아몬드',
    tags: ['실력 중심', '오더가능'],
    azit: '신규 생성',
    position: ['support'],
    memo: '마이크 필수입니다.',
    currentMembers: 1,
    maxMembers: 2,
    time: '방금 전',
    views: 50,
    likes: 1,
    comments: 0,
    tsScore: 92,
    mic: true,
    hostUser: { id: 'user-2', nickname: '겐지장인', avatarUrl: '' }
  },
  {
    id: 3,
    game: '리그오브레전드',
    title: '브론즈 탈출하실 분 (마이크X)',
    tier: '브론즈',
    tags: ['협력 유저'],
    azit: '신규 생성',
    position: ['adc', 'sup'],
    memo: '채팅으로 소통해요.',
    currentMembers: 1,
    maxMembers: 2,
    time: '30분 전',
    views: 30,
    likes: 0,
    comments: 0,
    tsScore: 65,
    mic: false,
    hostUser: { id: 'user-3', nickname: '침묵의고수', avatarUrl: '' }
  }
];

export const useMatchingBoard = () => {
  const [allMatches, setAllMatches] = useState<MatchingData[]>(INITIAL_MOCK_DATA);
  const [activeGame, setActiveGame] = useState('리그오브레전드');
  const [searchText, setSearchText] = useState('');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isProUser, setIsProUser] = useState(false);
  
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterConditions, setFilterConditions] = useState<FilterState | null>(null);

  const openWriteModal = useCallback(() => {
    setIsWriteModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeWriteModal = useCallback(() => {
    setIsWriteModalOpen(false);
    document.body.style.overflow = 'unset';
  }, []);

  const openFilterModal = useCallback(() => setIsFilterModalOpen(true), []);
  const closeFilterModal = useCallback(() => setIsFilterModalOpen(false), []);

  const handleApplyFilter = useCallback((filters: FilterState) => {
    setFilterConditions(filters);
    console.log("적용된 필터:", filters);
  }, []);

  const handleNewPost = useCallback((newPost: MatchingData, action: 'new' | 'replace' | 'bump') => {
    setAllMatches((prev) => {
      const myPostsForGame = prev.filter(p => p.game === newPost.game && p.hostUser.id === 'me');

      if (myPostsForGame.length > 0) {
        const latestPost = myPostsForGame.sort((a, b) => b.id - a.id)[0];
        if (action === 'bump') {
           const bumpedPost = { ...latestPost, id: Date.now(), time: '방금 전' };
           return [bumpedPost, ...prev.filter(p => p.id !== latestPost.id)];
        } else if (action === 'replace') {
           const otherPosts = prev.filter(p => p.game !== newPost.game || p.hostUser.id !== 'me');
           return [newPost, ...otherPosts];
        }
      }
      return [newPost, ...prev];
    });
  }, []);

  const matchesByGame = useMemo(() => {
    return allMatches.filter(item => item.game === activeGame);
  }, [allMatches, activeGame]);

  const popularMatches = useMemo(() => {
    return [...matchesByGame]
      .sort((a, b) => (b.views + b.likes) - (a.views + a.likes))
      .slice(0, 10);
  }, [matchesByGame]);

  const filteredMatches = useMemo(() => {
    let result = [...matchesByGame];

    // 1. 검색어 필터
    if (searchText.length >= 2) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 2. 상세 조건 필터
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

    return result.sort((a, b) => b.id - a.id);
  }, [matchesByGame, searchText, filterConditions]);

  return {
    state: { 
      allMatches, activeGame, searchText, isWriteModalOpen, isProUser, 
      matchesByGame, popularMatches, filteredMatches, isFilterModalOpen 
    },
    setters: { setActiveGame, setSearchText, setIsProUser },
    actions: { 
      openWriteModal, closeWriteModal, handleNewPost,
      openFilterModal, closeFilterModal, handleApplyFilter 
    }
  };
};