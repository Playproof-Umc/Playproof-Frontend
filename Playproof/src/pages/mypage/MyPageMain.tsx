//src/pages/mypage/MyPageMain.tsx
import React from 'react';
import { Navbar } from '@/components/common/Navbar'; // [추가] Navbar 임포트
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';

const MyPageMain = () => {
  const myData = { nickname: '나(Player)' }; 

  return (
    <div className="min-h-screen bg-white">
       
       {/* [추가] 공통 Navbar 적용 (기본 모드) */}
       <Navbar /> 

       <div className="max-w-[600px] mx-auto mt-6 px-4">
          <ProfileHeader nickname={myData.nickname} isMyPage={true} />
          <div className="mt-8 space-y-4">
             <div className="p-4 border rounded-xl">내 매칭 내역</div>
             <div className="p-4 border rounded-xl">내가 쓴 글</div>
             <div className="p-4 border rounded-xl">설정</div>
          </div>
       </div>
    </div>
  );
};

export default MyPageMain;