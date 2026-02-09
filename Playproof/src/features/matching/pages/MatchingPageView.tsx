// src/features/matching/pages/MatchingPageView.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { MatchingSearchBar, GameFilter, RecommendedSection, PartyRequestBanner, MatchingWriteModal } from '@/features/matching/components';
import { PopularMatchList } from '@/features/matching/components/home/PopularMatchList';
import { FilteredMatchList } from '@/features/matching/components/home/FilteredMatchList';
import { useMatchingBoard } from '@/features/matching/hooks/useMatchingBoard';
import { GAME_LIST } from '@/features/matching/constants/matchingConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMatchingDetail } from '@/features/matching/context/MatchingDetailContext';
import { useAuthStore } from '@/store/authStore';
import { FeedbackModal } from "@/features/team/components/feedback/FeedbackModal";
import {
  getPendingFeedbacks,
  removePendingFeedback,
} from "@/features/team/utils/pendingFeedback";

const FALLBACK_USER_ID = 'user-1';

export const MatchingPageView = () => {
  const { state, setters, actions } = useMatchingBoard();
  const location = useLocation();
  const navigate = useNavigate();
  const { openMatchingDetail, hydrateLikes, hydrateCommentCounts } = useMatchingDetail();
  const authUserId = useAuthStore((s) => s.userId);
  const currentUserId = authUserId ? `user-${authUserId}` : FALLBACK_USER_ID;
  const {
    allMatches,
    activeGame,
    searchText,
    isWriteModalOpen,
    isFilterModalOpen,
    isProUser,
    matchesByGame,
    popularMatches,
    filteredMatches,
  } = state;
  const lastLocationKeyRef = useRef<string | null>(null);
  const [pendingFeedback, setPendingFeedback] = React.useState(
    getPendingFeedbacks()[0]
  );
  const initialOpenApplicants = Boolean(
    (location.state as { openApplicants?: boolean } | null)?.openApplicants
  );

  // 수정됨: 4개 이상일 때 스크롤을 확인하기 위해 3개 제한을 10개로 늘림
  const recommendedData = useMemo(() => {
    return matchesByGame.slice(0, 10); 
  }, [matchesByGame]);

  useEffect(() => {
    hydrateLikes(allMatches);
    hydrateCommentCounts(allMatches);
  }, [allMatches, hydrateLikes, hydrateCommentCounts]);

  useEffect(() => {
    if (lastLocationKeyRef.current === location.key) return;
    lastLocationKeyRef.current = location.key;

    const routeState = location.state as {
      openMatchId?: number;
      openWriteModal?: boolean;
      activeGame?: string;
      openApplicants?: boolean;
    } | null;
    if (!routeState) return;

    const openMatchId = routeState.openMatchId;
    const openWriteModal = routeState.openWriteModal;
    const activeGameFromHome = routeState.activeGame;
    const shouldOpenApplicants = routeState.openApplicants;

    if (activeGameFromHome) {
      setters.setActiveGame(activeGameFromHome);
    }

    if (openWriteModal) {
      actions.openWriteModal();
      navigate('.', { replace: true, state: null });
      return;
    }

    if (shouldOpenApplicants) {
      navigate('.', { replace: true, state: null });
    }

    if (!openMatchId) return;

    const target = allMatches.find((m) => m.id === openMatchId);
    if (target) {
      openMatchingDetail(target);
      navigate('.', { replace: true, state: null });
    }
  }, [allMatches, location.key, location.state, navigate, openMatchingDetail, actions, setters]);

  return (
    <div className="min-h-screen bg-white text-gray-800 pb-20 font-sans">
      <Navbar isProUser={isProUser} onTogglePro={() => setters.setIsProUser(!isProUser)} />

      <div className="bg-white border-b border-gray-100 relative z-40">
        <div className="max-w-[1280px] mx-auto px-6 py-5 flex flex-col gap-5">
          <div className="w-full">
            <GameFilter games={GAME_LIST} activeGame={activeGame} onGameSelect={setters.setActiveGame} />
          </div>
          <div className="w-full border-t border-gray-50 pt-5">
            <MatchingSearchBar
              key={`${activeGame}-${currentUserId}`}
              searchText={searchText}
              onSearchChange={setters.setSearchText}
              onSearchSubmit={setters.setSearchText}
              onWriteClick={actions.openWriteModal}
              isFilterOpen={isFilterModalOpen}
              onFilterToggle={() => (isFilterModalOpen ? actions.closeFilterModal() : actions.openFilterModal())}
              onFilterClose={actions.closeFilterModal}
              onFilterApply={actions.handleApplyFilter}
              activeGame={activeGame}
              userId={currentUserId}
            />
          </div>
        </div>
      </div>

      <main className="max-w-[1280px] mx-auto px-6 py-8 space-y-10">
      <PartyRequestBanner initialOpen={initialOpenApplicants} />
        {/* 추천 섹션 */}
        <RecommendedSection isProUser={isProUser} recommendations={recommendedData} />
        <PopularMatchList matches={popularMatches} />
        <FilteredMatchList matches={filteredMatches} searchText={searchText} />
      </main>

      <MatchingWriteModal
        isOpen={isWriteModalOpen}
        onClose={actions.closeWriteModal}
        onUpload={actions.handleNewPost}
        existingPosts={allMatches.filter((p) => p.hostUser.id === currentUserId)}
        initialGame={activeGame}
      />

      <FeedbackModal
        open={Boolean(pendingFeedback)}
        required
        targetName={pendingFeedback?.targetName ?? "상대방"}
        onSubmit={() => {
    if (!pendingFeedback) return;
    removePendingFeedback(pendingFeedback.scheduleId, pendingFeedback.azitId);
    setPendingFeedback(getPendingFeedbacks()[0]);
  }}
      />
    </div>
  );
};
