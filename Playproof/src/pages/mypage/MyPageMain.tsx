import React from 'react';
import { ProfileHeader } from '@/features/profile/components/ProfileHeader';

const MyPageMain = () => {
  // 내 정보 불러오기 (API or Context)
  const myData = { nickname: '나(Player)', ... }; 

  return (
    <div className="max-w-[600px] mx-auto mt-6 px-4">
       {/* isMyPage={true}를 전달해서 수정 버튼이 나오게 함 */}
       <ProfileHeader nickname={myData.nickname} isMyPage={true} />
       
       {/* 마이페이지 전용 메뉴들 */}
       <div className="mt-8 space-y-4">
          <div className="p-4 border rounded-xl">내 매칭 내역</div>
          <div className="p-4 border rounded-xl">내가 쓴 글</div>
          <div className="p-4 border rounded-xl">설정</div>
       </div>
    </div>
  );
};
export default MyPageMain;