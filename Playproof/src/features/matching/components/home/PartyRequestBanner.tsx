// src/features/matching/components/home/PartyRequestBanner.tsx

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Plus, ChevronUp, Loader2 } from 'lucide-react';
import { usePartyApplications } from '@/features/matching/hooks/usePartyApplications';
import { getGameName } from '@/constants/games';

interface PartyRequestBannerProps {
  partyId?: number; // 내가 만든 파티의 ID
  initialOpen?: boolean;
}

export const PartyRequestBanner = ({ partyId, initialOpen = false }: PartyRequestBannerProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(initialOpen);

  // API 연결
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

  React.useEffect(() => {
    if (initialOpen) {
      setIsOpen(true);
    }
  }, [initialOpen]);

  // 로딩 중이거나 신청자가 없으면 표시하지 않음
  if (isLoading || applications.length === 0) return null;

  const latestUser = sortedApplicants[0].nickname;
  const otherCount = applications.length - 1;
  const bannerDescription = otherCount > 0 
    ? `${latestUser} 님 외 ${otherCount}명이 파티 합류를 대기 중입니다.`
    : `${latestUser} 님이 파티 합류를 대기 중입니다.`;

  const handleAccept = (applicationId: number) => {
    acceptApplication(applicationId);
  };

  const handleReject = (applicationId: number) => {
    rejectApplication(applicationId);
  };

  const handleAcceptAll = () => {
    if (window.confirm('모든 신청을 수락하시겠습니까?')) {
      acceptAll();
    }
  };

  const handleRejectAll = () => {
    if (window.confirm('모든 신청을 거절하시겠습니까?')) {
      rejectAll();
    }
  };

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
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">{applications.length}</div>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 text-base">{applications.length}명의 파티 참가 요청이 있습니다.</h3>
                    <p className="text-sm text-gray-500">{bannerDescription}</p>
                </div>
            </div>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              disabled={isProcessing}
              className="bg-[var(--color-primary-800)] text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[var(--color-primary-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isOpen ? <ChevronUp size={16} /> : <Plus size={16} />}
                <span>신청자 목록 확인</span>
            </button>
        </div>
        {isOpen && (
            <div className="bg-gray-50 border border-gray-200 border-t-0 rounded-b-2xl p-6 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-4 px-1">
                    <h4 className="font-bold text-gray-900 text-sm">신청자 목록 <span className="ml-1 text-blue-600">{applications.length}</span></h4>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                        <button 
                          onClick={handleRejectAll}
                          disabled={isProcessing}
                          className="hover:text-black transition-colors disabled:opacity-50"
                        >
                          전체 거절
                        </button>
                        <button 
                          onClick={handleAcceptAll}
                          disabled={isProcessing}
                          className="hover:text-black transition-colors disabled:opacity-50"
                        >
                          {isProcessing ? <Loader2 size={14} className="animate-spin" /> : '전체 수락'}
                        </button>
                    </div>
                </div>
                <div
                    className="grid grid-flow-col auto-cols-[calc((100%-2*var(--gap))/3)] gap-4 overflow-x-auto pb-2 snap-x snap-mandatory"
                    style={{ ["--gap" as string]: "16px" }}
                >
                    {sortedApplicants.map((applicant) => (
                        <div
                            key={applicant.applicationId}
                            className="snap-start bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-[240px]"
                        >
                            <div className="font-bold text-sm text-gray-900 mb-4 border-b border-gray-50 pb-2 flex justify-between items-center">
                              <span>{getGameName(applicant.gameId)}</span>
                            </div>
                            <div 
                              onClick={() => navigate(`/user/${applicant.userId}`)} 
                              className="flex flex-col items-center mb-4 cursor-pointer group"
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-full mb-3 flex items-center justify-center text-gray-400 group-hover:bg-gray-200 transition-colors">
                                  <User size={32} />
                                </div>
                                <div className="font-bold text-gray-900 text-sm mb-1 group-hover:underline underline-offset-2">
                                  {applicant.nickname}
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                                  <span>TS {applicant.trustScore ?? 0}</span>
                                </div>
                            </div>
                            <div className="mb-4">
                              <p className="text-xs text-gray-500 line-clamp-1 text-center bg-gray-50 p-2 rounded-lg">
                                신청 ID: {applicant.applicationId}
                              </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleReject(applicant.applicationId)} 
                                    disabled={isProcessing}
                                    className="flex-1 py-3 border border-gray-200 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors bg-white disabled:opacity-50"
                                  >
                                    거절
                                  </button>
                                  <button 
                                    onClick={() => handleAccept(applicant.applicationId)} 
                                    disabled={isProcessing}
                                    className="flex-1 py-3 bg-[var(--color-primary-800)] text-white rounded-lg text-sm font-bold hover:bg-[var(--color-primary-700)] transition-colors disabled:opacity-50"
                                  >
                                    {isProcessing ? <Loader2 size={14} className="animate-spin mx-auto" /> : '수락'}
                                  </button>
                                </div>
                                <div className="text-[10px] text-gray-300 font-medium text-center">
                                  {new Date(applicant.createdAt).toLocaleString('ko-KR')}
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
