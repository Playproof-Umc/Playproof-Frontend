//src/features/matching/components/PartyRequestBanner.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Plus, RefreshCw, Settings, ChevronUp } from 'lucide-react';
import { usePartyApplications } from '@/features/matching/hooks/usePartyApplications';
import { getGameName } from '@/constants/games';

interface PartyRequestBannerProps {
  partyId?: number; // 내가 만든 파티의 ID
}

export const PartyRequestBanner: React.FC<PartyRequestBannerProps> = ({ partyId }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    applications,
    isLoading,
    acceptApplication,
    rejectApplication,
    acceptAll,
    rejectAll,
    isProcessing,
  } = usePartyApplications(partyId);

  // 게임별로 정렬
  const sortedApplicants = useMemo(() => {
    return [...applications].sort((a, b) => {
      return a.gameId - b.gameId;
    });
  }, [applications]);

  // 신청자가 없으면 표시 안 함
  if (!partyId || applications.length === 0) return null;

  // 신청자가 없으면 표시 안 함
  if (!partyId || applications.length === 0) return null;

  const latestUser = sortedApplicants[0]?.nickname || '신청자';
  const otherCount = applications.length - 1;
  const bannerDescription = otherCount > 0 
    ? `${latestUser} 님 외 ${otherCount}명이 파티 합류를 대기 중입니다.`
    : `${latestUser} 님이 파티 합류를 대기 중입니다.`;

  const handleRefresh = () => {
    // React Query가 자동으로 refetch
  };

  const handleProfileClick = (e: React.MouseEvent, userId: number) => {
    e.stopPropagation();
    navigate(`/user/${userId}`);
  };

  // 상대 시간 계산
  const getRelativeTime = (createdAt: string) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일 전`;
  };

  return (
    <div className="w-full mb-6">
        <div className={`flex items-center justify-between p-5 bg-white border border-gray-200 shadow-sm transition-all duration-200 ${isOpen ? 'rounded-t-2xl border-b-0' : 'rounded-2xl'}`}>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 relative">
                    <User size={24} />
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">{applications.length}</div>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-base">{applications.length}명의 파티 참가 요청이 있습니다.</h3>
                    <p className="text-sm text-gray-500">{bannerDescription}</p>
                </div>
            </div>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="bg-black text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors"
              disabled={isLoading}
            >
                {isOpen ? <ChevronUp size={16} /> : <Plus size={16} />}
                <span>{isLoading ? '로딩 중...' : '신청자 목록 확인'}</span>
            </button>
        </div>
        {isOpen && (
            <div className="bg-gray-50 border border-gray-200 border-t-0 rounded-b-2xl p-6 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h4 className="font-bold text-gray-900 text-sm">신청자 목록 <span className="ml-1 text-blue-600">{applications.length}</span></h4>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                        <button 
                          onClick={rejectAll} 
                          disabled={isProcessing}
                          className="hover:text-black transition-colors disabled:opacity-50"
                        >
                          전체 거절
                        </button>
                        <button 
                          onClick={acceptAll}
                          disabled={isProcessing}
                          className="hover:text-black transition-colors disabled:opacity-50"
                        >
                          전체 수락
                        </button>
                        <button 
                          onClick={handleRefresh}
                          className="hover:text-black transition-colors"
                        >
                          <RefreshCw size={14} />
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {sortedApplicants.map((applicant) => (
                        <div key={applicant.applicationId} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-[240px]">
                            <div className="font-bold text-sm text-gray-900 mb-4 border-b border-gray-50 pb-2 flex justify-between items-center">
                              <span>{getGameName(applicant.gameId)}</span>
                            </div>
                            <div 
                              onClick={(e) => handleProfileClick(e, applicant.userId)} 
                              className="flex flex-col items-center mb-4 cursor-pointer group"
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-full mb-3 flex items-center justify-center text-gray-400 group-hover:bg-gray-200 transition-colors overflow-hidden">
                                  {applicant.avatarUrl ? (
                                    <img src={applicant.avatarUrl} alt={applicant.nickname} className="w-full h-full object-cover" />
                                  ) : (
                                    <User size={32} />
                                  )}
                                </div>
                                <div className="font-bold text-gray-900 text-sm mb-1 group-hover:underline underline-offset-2">{applicant.nickname}</div>
                                <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                                  <span>TS {applicant.trustScore}</span>
                                  <Settings size={10} />
                                </div>
                            </div>
                            <div className="mb-4">
                              <p className="text-xs text-gray-500 line-clamp-1 text-center bg-gray-50 p-2 rounded-lg">
                                "{applicant.partyTitle}"
                              </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => rejectApplication(applicant.applicationId)} 
                                    disabled={isProcessing}
                                    className="flex-1 py-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors bg-white disabled:opacity-50"
                                  >
                                    거절
                                  </button>
                                  <button 
                                    onClick={() => acceptApplication(applicant.applicationId)}
                                    disabled={isProcessing}
                                    className="flex-1 py-3 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                                  >
                                    수락
                                  </button>
                                </div>
                                <div className="text-[10px] text-gray-300 font-medium text-center">
                                  {getRelativeTime(applicant.createdAt)}
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