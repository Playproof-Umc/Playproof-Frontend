import React, { createContext, useContext, useState, ReactNode } from 'react';

// 프로필 데이터 타입 정의
export interface UserProfileData {
  id: string | number;
  nickname: string;
  avatarUrl?: string;
  tsScore: number;
  mannerScore?: number;
  introduction?: string;
  mostGames?: string[];
}

interface UserProfileContextType {
  isOpen: boolean;
  activeUserId: string | number | null;
  openProfile: (userId: string | number) => void;
  closeProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

// Provider 컴포넌트
export const UserProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string | number | null>(null);

  const openProfile = (userId: string | number) => {
    setActiveUserId(userId);
    setIsOpen(true);
    // 모달 열릴 때 배경 스크롤 막기
    document.body.style.overflow = 'hidden';
  };

  const closeProfile = () => {
    setIsOpen(false);
    setActiveUserId(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <UserProfileContext.Provider value={{ isOpen, activeUserId, openProfile, closeProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};