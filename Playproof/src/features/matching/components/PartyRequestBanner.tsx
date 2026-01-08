import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Plus, RefreshCw, Settings, ChevronUp, ChevronDown } from 'lucide-react';

// [Mock Data] 신청자 목록 더미 데이터
const INITIAL_APPLICANTS = [
  { id: 1, game: '오버워치', title: '경쟁다인큐 구합니다 TS 90이상', user: '레나', ts: 90, time: '10분 전' },
  { id: 2, game: '배틀그라운드', title: '오늘 치킨 먹자', user: '치킨마스터', ts: 80, time: '5분 전' },
  { id: 3, game: 'Steam', title: 'Lethal Company 같이 할 분', user: 'MonsterHunter', ts: 50, time: '1분 전' },
  { id: 4, game: '리그오브레전드', title: '칼바람 나락 ㄱㄱ', user: '페이커팬', ts: 95, time: '방금 전' },
];

export const PartyRequestBanner = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);

  // 1. 노출 조건: 대기 중인 신청자가 0명이면 배너 숨김
  if (applicants.length === 0) return null;

  // 2. 정렬 순서: Steam(영어) 맨 앞 -> 나머지 가나다(ABC) 순
  const sortedApplicants = useMemo(() => {
    return [...applicants].sort((a, b) => {
      if (a.game === 'Steam') return -1;
      if (b.game === 'Steam') return 1;
      return a.game.localeCompare(b.game);
    });
  }, [applicants]);

  // 배너 문구 동적 생성
  const latestUser = sortedApplicants[0].user;
  const otherCount = applicants.length - 1;
  const bannerDescription = otherCount > 0 
    ? `${latestUser} 님 외 ${otherCount}명이 파티 합류를 대기 중입니다.`
    : `${latestUser} 님이 파티 합류를 대기 중입니다.`;

  // 삭제 핸들러 (수락/거절 시 리스트에서 제거)
  const handleRemove = (id: number) => {
    setApplicants((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAcceptAll = () => setApplicants([]);
  const handleRejectAll = () => setApplicants([]);

  // 프로필 클릭 핸들러 (페이지 이동)
  const handleProfileClick = (e: React.MouseEvent, userId: string | number) => {
    e.stopPropagation(); // 부모 클릭 이벤트 방지
    navigate(`/user/${userId}`);
  };

  return (
    <div className="w-full mb-6">
        
        {/* ─────────────────────────────────────────────────────────────
            1. 신청 현황 알림 배너 (항상 노출)
        ───────────────────────────────────────────────────────────── */}
        <div className={`flex items-center justify-between p-5 bg-white border border-gray-200 shadow-sm transition-all duration-200 ${isOpen ? 'rounded-t-2xl border-b-0' : 'rounded-2xl'}`}>
            
            {/* 좌측: 아이콘 및 텍스트 */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 relative">
                    <User size={24} />
                    {/* 알림 뱃지 */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                        {applicants.length}
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-base">
                        {applicants.length}명의 파티 참가 요청이 있습니다.
                    </h3>
                    <p className="text-sm text-gray-500">
                        {bannerDescription}
                    </p>
                </div>
            </div>

            {/* 우측: 토글 버튼 */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors"
            >
                {isOpen ? <ChevronUp size={16} /> : <Plus size={16} />}
                <span>신청자 목록 확인</span>
            </button>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            2. 신청자 목록 영역 (isOpen일 때만 렌더링)
        ───────────────────────────────────────────────────────────── */}
        {isOpen && (
            <div className="bg-gray-50 border border-gray-200 border-t-0 rounded-b-2xl p-6 animate-in slide-in-from-top-2 duration-200">
                
                {/* 헤더: 카운트 및 전체 관리 버튼 */}
                <div className="flex items-center justify-between mb-4 px-1">
                    <h4 className="font-bold text-gray-900 text-sm">
                        신청자 목록 <span className="ml-1 text-blue-600">{applicants.length}</span>
                    </h4>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                        <button onClick={handleRejectAll} className="hover:text-black transition-colors">전체 거절</button>
                        <button onClick={handleAcceptAll} className="hover:text-black transition-colors">전체 수락</button>
                        <button className="hover:text-black transition-colors rotate-0 hover:rotate-180 duration-500">
                            <RefreshCw size={14} />
                        </button>
                    </div>
                </div>

                {/* 카드 그리드 리스트 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sortedApplicants.map((applicant) => (
                        <div key={applicant.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-[240px]">
                            
                            {/* 상단: 게임 이름 */}
                            <div className="font-bold text-sm text-gray-900 mb-4 border-b border-gray-50 pb-2 flex justify-between items-center">
                                <span>{applicant.game}</span>
                            </div>

                            {/* 중단: 사용자 프로필 (클릭 시 페이지 이동) */}
                            <div 
                                onClick={(e) => handleProfileClick(e, applicant.user)} // 클릭 시 페이지 이동
                                className="flex flex-col items-center mb-4 cursor-pointer group"
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-full mb-3 flex items-center justify-center text-gray-400 group-hover:bg-gray-200 transition-colors">
                                    <User size={32} />
                                </div>
                                <div className="font-bold text-gray-900 text-sm mb-1 group-hover:underline underline-offset-2">
                                    {applicant.user}
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                                    <span>TS {applicant.ts}</span>
                                    <Settings size={10} />
                                </div>
                            </div>

                            {/* 중단: 매칭 글 제목 */}
                            <div className="mb-4">
                                <p className="text-xs text-gray-500 line-clamp-1 text-center bg-gray-50 p-2 rounded-lg">
                                   "{applicant.title}"
                                </p>
                            </div>

                            {/* 하단: 액션 버튼 */}
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleRemove(applicant.id)}
                                        className="flex-1 py-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors bg-white"
                                    >
                                        거절
                                    </button>
                                    <button 
                                        onClick={() => handleRemove(applicant.id)}
                                        className="flex-1 py-3 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors"
                                    >
                                        수락
                                    </button>
                                </div>
                                <div className="text-[10px] text-gray-300 font-medium text-center">
                                    {applicant.time}
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};