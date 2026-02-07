// src/features/matching/components/home/PartyRequestBanner.tsx

//src/features/matching/components/home/PartyRequestBanner.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Plus, RefreshCw, Settings, ChevronUp } from 'lucide-react';

const INITIAL_APPLICANTS = [
  { id: 1, game: '오버워치', title: '경쟁다인큐 구합니다 TS 90이상', user: '레나', ts: 90, time: '10분 전' },
  { id: 2, game: '배틀그라운드', title: '오늘 치킨 먹자', user: '치킨마스터', ts: 80, time: '5분 전' },
  { id: 3, game: 'Steam', title: 'Lethal Company 같이 할 분', user: 'MonsterHunter', ts: 50, time: '1분 전' },
  { id: 4, game: '리그오브레전드', title: '칼바람 나락 ㄱㄱ', user: '페이커팬', ts: 95, time: '방금 전' },
];

interface PartyRequestBannerProps {
  initialOpen?: boolean;
}

export const PartyRequestBanner = ({ initialOpen = false }: PartyRequestBannerProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);

  // 훅을 먼저 실행하고 조건부 렌더링은 나중에 처리
  const sortedApplicants = useMemo(() => {
    return [...applicants].sort((a, b) => {
      if (a.game === 'Steam') return -1;
      if (b.game === 'Steam') return 1;
      return a.game.localeCompare(b.game);
    });
  }, [applicants]);

  React.useEffect(() => {
    if (initialOpen) {
      setIsOpen(true);
    }
  }, [initialOpen]);

  // applicants가 비어있으면 Hooks 실행 후 여기서 리턴
  if (applicants.length === 0) return null;

  const latestUser = sortedApplicants[0].user;
  const otherCount = applicants.length - 1;
  const bannerDescription = otherCount > 0 
    ? `${latestUser} 님 외 ${otherCount}명이 파티 합류를 대기 중입니다.`
    : `${latestUser} 님이 파티 합류를 대기 중입니다.`;

  const handleRemove = (id: number) => {
    setApplicants((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAcceptAll = () => setApplicants([]);
  const handleRejectAll = () => setApplicants([]);

  const handleProfileClick = (e: React.MouseEvent, userId: string | number) => {
    e.stopPropagation();
    navigate(`/user/${userId}`);
  };

  return (
    <div className="w-full mb-6">
        <div className={`flex items-center justify-between p-5 bg-white border border-gray-200 shadow-sm transition-all duration-200 ${isOpen ? 'rounded-t-2xl border-b-0' : 'rounded-2xl'}`}>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 relative">
                    <User size={24} />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">{applicants.length}</div>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-base">{applicants.length}명의 파티 참가 요청이 있습니다.</h3>
                    <p className="text-sm text-gray-500">{bannerDescription}</p>
                </div>
            </div>
            <button onClick={() => setIsOpen(!isOpen)} className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors">
                {isOpen ? <ChevronUp size={16} /> : <Plus size={16} />}<span>신청자 목록 확인</span>
            </button>
        </div>
        {isOpen && (
            <div className="bg-gray-50 border border-gray-200 border-t-0 rounded-b-2xl p-6 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h4 className="font-bold text-gray-900 text-sm">신청자 목록 <span className="ml-1 text-blue-600">{applicants.length}</span></h4>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                        <button onClick={handleRejectAll} className="hover:text-black transition-colors">전체 거절</button>
                        <button onClick={handleAcceptAll} className="hover:text-black transition-colors">전체 수락</button>
                        <button className="hover:text-black transition-colors"><RefreshCw size={14} /></button>
                    </div>
                </div>
                <div
                    className="grid grid-flow-col auto-cols-[calc((100%-2*var(--gap))/3)] gap-4 overflow-x-auto pb-2 snap-x snap-mandatory"
                    style={{ ["--gap" as string]: "16px" }}
                >
                    {sortedApplicants.map((applicant) => (
                        <div
                            key={applicant.id}
                            className="snap-start bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-[240px]"
                        >
                            <div className="font-bold text-sm text-gray-900 mb-4 border-b border-gray-50 pb-2 flex justify-between items-center"><span>{applicant.game}</span></div>
                            <div onClick={(e) => handleProfileClick(e, applicant.user)} className="flex flex-col items-center mb-4 cursor-pointer group">
                                <div className="w-16 h-16 bg-gray-100 rounded-full mb-3 flex items-center justify-center text-gray-400 group-hover:bg-gray-200 transition-colors"><User size={32} /></div>
                                <div className="font-bold text-gray-900 text-sm mb-1 group-hover:underline underline-offset-2">{applicant.user}</div>
                                <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100"><span>TS {applicant.ts}</span><Settings size={10} /></div>
                            </div>
                            <div className="mb-4"><p className="text-xs text-gray-500 line-clamp-1 text-center bg-gray-50 p-2 rounded-lg">"{applicant.title}"</p></div>
                            <div className="space-y-2">
                                <div className="flex gap-2"><button onClick={() => handleRemove(applicant.id)} className="flex-1 py-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors bg-white">거절</button><button onClick={() => handleRemove(applicant.id)} className="flex-1 py-3 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">수락</button></div>
                                <div className="text-[10px] text-gray-300 font-medium text-center">{applicant.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};
