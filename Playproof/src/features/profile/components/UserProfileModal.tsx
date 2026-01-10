// src/features/profile/components/UserProfileModal.tsx
import React, { useEffect, useState } from 'react';
import { useUserProfile } from '../context/UserProfileContext';
import { ProfileView } from './detail/ProfileView';
import type { UserProfile } from '@/features/profile/types';

export const UserProfileModal = () => {
  const { isOpen, activeUserId, closeProfile } = useUserProfile();
  const [userData, setUserData] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (isOpen && activeUserId) {
      // Mock API 호출
      const timer = setTimeout(() => {
        setUserData({
          id: activeUserId,
          nickname: `유저_${activeUserId}`,
          tsScore: 90,
          mannerScore: 4.8,
          introduction: '안녕하세요! 즐겜 유저입니다. 평일 저녁 접속 가능합니다.',
          mostGames: ['오버워치', '리그오브레전드'],
          tags: ['소통왕', '빡겜러', '오더가능']
        });
      }, 0);
      return () => clearTimeout(timer);
    } else {
      setUserData(null); 
    }
  }, [isOpen, activeUserId]);

  if (!isOpen || !userData) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <ProfileView 
        userData={userData} 
        onClose={closeProfile}
        onChatRequest={() => console.log("채팅 요청")}
      />
    </div>
  );
};