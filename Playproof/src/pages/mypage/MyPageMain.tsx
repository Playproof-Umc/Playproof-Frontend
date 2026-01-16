//src/pages/mypage/MyPageMain.tsx
import React from 'react';
import { Navbar } from '@/components/common/Navbar';
import { fetchMyProfile, type MyProfileData } from '@/data/mockData';
import { MyPageSidebar } from './components/MyPageSidebar';
import { ProfileCard } from './components/ProfileCard';
import { ProfileHeader } from './components/ProfileHeader';
import { SectionContent } from './components/SectionContent';

const MyPageMain: React.FC = () => {
  const [activeSection, setActiveSection] = React.useState('내프로필');
  const [profileData, setProfileData] = React.useState<MyProfileData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchMyProfile();
        setProfileData(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading || !profileData) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <Navbar />
        <div className="flex h-screen items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl gap-6 px-6 py-8">
        {/* 왼쪽 영역 */}
        <div className="w-64 flex-shrink-0 space-y-6">
          <ProfileCard nickname={profileData.nickname} rank={profileData.rank} />
          <MyPageSidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
        </div>

        {/* 오른쪽 영역 */}
        <div className="flex-1 space-y-6">
          <ProfileHeader 
            bio={profileData.bio}
            playStyles={profileData.playStyles}
            preferredTags={profileData.preferredTags}
          />
          <SectionContent 
            activeSection={activeSection}
            profileData={profileData}
          />
        </div>
      </main>
    </div>
  );
};

export default MyPageMain;