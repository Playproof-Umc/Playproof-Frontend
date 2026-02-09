/* eslint-disable react-refresh/only-export-components */
//src/features/matching/context/MatchingDetailContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MatchingDetailContextType {
  isOpen: boolean;
  selectedPartyId: number | null;
  openMatchingDetail: (partyId: number) => void;
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
  const [selectedPartyId, setSelectedPartyId] = useState<number | null>(null);

  const openMatchingDetail = (partyId: number) => {
    setSelectedPartyId(partyId);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeMatchingDetail = () => {
    setIsOpen(false);
    setSelectedPartyId(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <MatchingDetailContext.Provider value={{ isOpen, selectedPartyId, openMatchingDetail, closeMatchingDetail }}>
      {children}
    </MatchingDetailContext.Provider>
  );
};
