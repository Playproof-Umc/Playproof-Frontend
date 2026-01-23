/* eslint-disable react-refresh/only-export-components */
//src/features/matching/context/MatchingDetailContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { MatchingData } from '@/features/matching/types';

interface MatchingDetailContextType {
  isOpen: boolean;
  selectedPost: MatchingData | null;
  openMatchingDetail: (post: MatchingData) => void;
  closeMatchingDetail: () => void;
}

const MatchingDetailContext = createContext<MatchingDetailContextType | undefined>(undefined);

export const useMatchingDetail = () => {
  const context = useContext(MatchingDetailContext);
  if (!context) {
    throw new Error('useMatchingDetail must be used within a MatchingDetailProvider');
  }
  return context;
};

export const MatchingDetailProvider: React.FC<{ children?: ReactNode }> = ({ children } = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<MatchingData | null>(null);

  const openMatchingDetail = (post: MatchingData) => {
    setSelectedPost(post);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeMatchingDetail = () => {
    setIsOpen(false);
    setSelectedPost(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <MatchingDetailContext.Provider value={{ isOpen, selectedPost, openMatchingDetail, closeMatchingDetail }}>
      {children}
    </MatchingDetailContext.Provider>
  );
};
