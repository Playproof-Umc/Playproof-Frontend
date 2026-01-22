import React from 'react';
import type { MyProfileData } from '@/features/mypage/types';
import { ProfileDetail } from '@/features/mypage/components/profile/ProfileDetail';
import { FeedbackSection } from '@/features/mypage/components/feedback/FeedbackSection';
import { RecentPosts } from '@/features/mypage/components/posts/RecentPosts';
import { FriendsList } from '@/features/mypage/components/friends/FriendsList';

interface SectionContentProps {
  activeSection: string;
  profileData: MyProfileData;
}

export function SectionContent({ activeSection, profileData }: SectionContentProps) {
  if (activeSection === '내프로필') {
    return <ProfileDetail profileData={profileData} />;
  }

  if (activeSection === '피드백') {
    return <FeedbackSection />;
  }

  if (activeSection === '작성게시판글') {
    return <RecentPosts />;
  }

  if (activeSection === '친구목록') {
    return <FriendsList />;
  }

  return null;
}