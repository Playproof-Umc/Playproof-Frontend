// src/features/mypage/pages/MyPageMainView.tsx

import React from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { ProfileCard, ProfileHeader, MyPageSidebar, SectionContent } from '@/features/mypage/components';
import { getMyProfile } from '@/features/mypage/api/mypageApi';
import type { MyProfileData } from '@/features/mypage/types';
import { MYPAGE_ACTION_LABELS, MYPAGE_SECTION_IDS, MYPAGE_SECTION_LABELS, type MyPageSectionId } from '@/features/mypage/constants/labels';
import { useAuthStore } from '@/store/authStore';

export const MyPageMainView = () => {
  const [activeSection, setActiveSection] = React.useState<MyPageSectionId>(MYPAGE_SECTION_IDS.profile);
  const authNickname = useAuthStore((s) => s.nickname);
  const displayNickname = authNickname ?? '사용자';
  const [profileData, setProfileData] = React.useState<MyProfileData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyProfile();

        if (!data) {
          throw new Error(MYPAGE_ACTION_LABELS.profileLoadError);
        }

        setProfileData(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
        setError(
          error instanceof Error ? error.message : MYPAGE_ACTION_LABELS.profileFetchFail
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-500">
              {MYPAGE_ACTION_LABELS.loading}
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
            >
              {MYPAGE_ACTION_LABELS.retry}
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!profileData) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <p className="text-sm text-gray-500">
            {MYPAGE_SECTION_LABELS.profile} 데이터가 없습니다
          </p>
        </div>
      </>
    );
  }

  const displayProfileData: MyProfileData = {
    ...profileData,
    nickname: displayNickname,
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          {/* 상단: 프로필 카드(좌) + 프로필 헤더(우) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <ProfileCard profileData={displayProfileData} />
            </div>
            <div className="lg:col-span-3">
              <ProfileHeader profileData={displayProfileData} />
            </div>
          </div>

          {/* 하단: 사이드바(좌) + 메인 컨텐츠(우) */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className="lg:col-span-1">
              <MyPageSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
            </aside>

            <main className="lg:col-span-3">
              <SectionContent activeSection={activeSection} profileData={displayProfileData} />
            </main>
          </div>
        </div>
      </div>
    </>
  );
};
