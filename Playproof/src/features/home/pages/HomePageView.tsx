// src/features/home/pages/HomePageView.tsx

import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import {
  HomeCommunityHighlightSection,
  HomeHotTopicSection,
  HomeMatchingSection,
  HomePartyFriendsSection,
  HomeUserSummarySection,
} from "@/features/home/components/sections";
import { SignupCompleteModal } from "@/components/auth/SignupCompleteModal";
import { HighlightDetailModal } from "@/features/community/components";
import { useHomePageLogic } from "@/features/home/hooks/useHomePageLogic";

export const HomePageView = () => {
  const navigate = useNavigate();
  const { state, handlers } = useHomePageLogic();
  const { state: s, handlers: h } = { state, handlers };
  const userSummaryProps = {
    loading: s.loading,
    user: s.user,
    displayName: s.displayName,
    onEditProfile: () => navigate("/mypage"),
  };
  const partyFriendsProps = {
    azitSlides: s.azitSlides,
    azitIndex: s.azitIndex,
    onPrevAzit: h.handlePrevAzit,
    onNextAzit: h.handleNextAzit,
    onOpenAzit: (azitId: number) => navigate("/azit", { state: { azitId } }),
  };
  const matchingProps = {
    activeGameTab: s.activeGameTab,
    searchKeyword: s.searchKeyword,
    isFilterOpen: s.isFilterOpen,
    onTabChange: h.setActiveGameTab,
    onMoreClick: () => navigate("/matching", { state: { activeGame: s.activeGameTab } }),
    onSearchChange: h.setSearchKeyword,
    onSearchSubmit: h.handleSearchSubmit,
    onWriteClick: () =>
      navigate("/matching", {
        state: { openWriteModal: true, activeGame: s.activeGameTab },
      }),
    onFilterToggle: () => h.setIsFilterOpen((prev) => !prev),
    onFilterClose: () => h.setIsFilterOpen(false),
    onFilterApply: h.handleFilterApply,
    matches: s.filteredPopularMatches,
    onCardClick: h.handleHomeMatchClick,
  };
  const highlightSectionProps = {
    posts: s.highlights.slice(0, 3),
    onPostClick: h.handleHighlightClick,
    getLikeState: h.handleHighlightLikeState,
    getCommentCount: h.handleHighlightCommentCount,
    onToggleLike: h.toggleHighlightLike,
    currentUserName: s.highlightUserName,
    onDeletePost: h.deleteHighlightPost,
  };
  const highlightModalProps = s.selectedHighlight
    ? {
        post: s.selectedHighlight,
        comments: h.handleHighlightComments(s.selectedHighlight.id),
        likeCount: h.handleHighlightLikeState(s.selectedHighlight).count,
        isLiked: h.handleHighlightLikeState(s.selectedHighlight).isLiked,
        totalCommentCount: h.handleHighlightCommentCount(s.selectedHighlight),
        onToggleLike: (postId: number) => h.toggleHighlightLike(postId, s.selectedHighlight!.likes),
        onAddComment: h.addHighlightComment,
        onAddReply: h.addHighlightReply,
        onEditComment: h.editHighlightComment,
        onEditReply: h.editHighlightReply,
        onDeleteComment: h.deleteHighlightComment,
        onDeleteReply: h.deleteHighlightReply,
        currentUserName: s.highlightUserName,
        isOpen: s.isHighlightOpen,
        onClose: () => h.setIsHighlightOpen(false),
      }
    : null;

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-6 py-6">
        <div className="space-y-8">
          <HomeUserSummarySection {...userSummaryProps} />

          <HomePartyFriendsSection {...partyFriendsProps} />

          <HomeMatchingSection {...matchingProps} />

          <HomeCommunityHighlightSection {...highlightSectionProps} />

          <HomeHotTopicSection
            posts={s.bestPosts}
            onMoreClick={() =>
              navigate({ pathname: "/community", search: "?tab=자유게시판" })
            }
            onPostClick={(post) => navigate(`/community/${post.id}?from=자유게시판`)}
          />
        </div>
      </main>

      <SignupCompleteModal
        open={s.signupModal.open}
        username={s.signupModal.username ?? undefined}
        onClose={h.closeSignupComplete}
      />
      {highlightModalProps ? <HighlightDetailModal {...highlightModalProps} /> : null}
    </div>
  );
};
