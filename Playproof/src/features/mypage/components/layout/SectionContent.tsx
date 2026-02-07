// src/features/mypage/components/layout/SectionContent.tsx

import type { MyProfileData } from '@/features/mypage/types';
import { ProfileDetail } from '@/features/mypage/components/profile/ProfileDetail';
import { FeedbackSection } from '@/features/mypage/components/feedback/FeedbackSection';
import { RecentPosts } from '@/features/mypage/components/posts/RecentPosts';
import { FriendsList } from '@/features/mypage/components/friends/FriendsList';
import { MYPAGE_SECTION_IDS, type MyPageSectionId } from '@/features/mypage/constants/labels';

interface SectionContentProps {
  activeSection: MyPageSectionId;
  profileData: MyProfileData;
}

export function SectionContent({ activeSection, profileData }: SectionContentProps) {
  if (activeSection === MYPAGE_SECTION_IDS.profile) {
    return <ProfileDetail profileData={profileData} />;
  }

  if (activeSection === MYPAGE_SECTION_IDS.feedback) {
    return <FeedbackSection />;
  }

  if (activeSection === MYPAGE_SECTION_IDS.writtenPosts) {
    return <RecentPosts />;
  }

  if (activeSection === MYPAGE_SECTION_IDS.friends) {
    return <FriendsList />;
  }

  return null;
}
