// src/features/matching/hooks/useMatchingBoard.ts
import { useState, useMemo, useCallback } from 'react';
import type { MatchingData, FilterState } from '@/features/matching/types';
import { MOCK_MATCHING_DATA } from '@/features/matching/data/mockMatchingData';
import { filterMatches } from '@/features/matching/utils/matchingUtils';

export const useMatchingBoard = () => {
  const [allMatches, setAllMatches] = useState<MatchingData[]>(MOCK_MATCHING_DATA);
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
    return filterMatches(matchesByGame, searchText, filterConditions);
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