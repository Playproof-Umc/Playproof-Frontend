import React from 'react';
import type { MyProfileData } from '@/data/mockData';
import { ProfileDetail } from './profile/ProfileDetail';
import { FeedbackSection } from './feedback/FeedbackSection';
import { RecentPosts } from './posts/RecentPosts';
import { FriendsList } from './friends/FriendsList';

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