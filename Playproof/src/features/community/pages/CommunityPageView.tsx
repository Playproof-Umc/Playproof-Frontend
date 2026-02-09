// src/features/community/pages/CommunityPageView.tsx

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import {
  CommunityTabs,
  CommunitySearchBar,
  HighlightFeed,
  BestPostsSection,
  CommunityPostList,
  Pagination,
  HighlightDetailModal,
  HighlightWriteModal,
  BoardWriteModal,
} from "@/features/community/components";
import { useCommunityPageLogic } from "@/features/community/hooks/useCommunityPageLogic";
import { COMMUNITY_PAGE_LABELS } from "@/features/community/constants/labels";
import { GameFilter } from "@/features/matching/components";
import { GAME_LIST } from "@/features/matching/constants/matchingConfig";

const COMMUNITY_BOARD_GAMES = ["전체글", ...GAME_LIST];

export const CommunityPageView = () => {
  const { ui, data, modal, user, actions } = useCommunityPageLogic();
  const navigate = useNavigate();
  const location = useLocation();
  const [sharedFiles, setSharedFiles] = React.useState<File[]>([]);
  const shareState = location.state as { shareFiles?: File[] } | null;

  React.useEffect(() => {
    if (!shareState?.shareFiles || shareState.shareFiles.length === 0) return;
    if (ui.activeTab !== COMMUNITY_PAGE_LABELS.highlightTab) {
      actions.tab.change(COMMUNITY_PAGE_LABELS.highlightTab);
    }
    setSharedFiles(shareState.shareFiles);
    actions.modal.setWriteOpen(true);
    navigate(`${location.pathname}${location.search}`, { replace: true, state: {} });
  }, [
    actions.modal,
    actions.tab,
    navigate,
    location.pathname,
    location.search,
    shareState,
    ui.activeTab,
  ]);

  React.useEffect(() => {
    if (!modal.isWriteOpen && sharedFiles.length > 0) {
      setSharedFiles([]);
    }
  }, [modal.isWriteOpen, sharedFiles.length]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-zinc-900">
            {COMMUNITY_PAGE_LABELS.title}
          </h1>
        </div>

        <CommunityTabs activeTab={ui.activeTab} onTabChange={actions.tab.change} />

        <div className="mt-6">
          <CommunitySearchBar
            searchQuery={ui.searchQuery}
            onSearchChange={actions.search.setQuery}
            onSearch={actions.search.submit}
            onWritePost={actions.write.open}
            activeTab={ui.activeTab}
            userId={user.userId}
            isFilterOpen={ui.isFilterOpen}
            onFilterToggle={() => actions.filter.setOpen((prev) => !prev)}
            onFilterClose={() => actions.filter.setOpen(false)}
            onFilterApply={(nextFilters) => actions.filter.setFilters(nextFilters)}
          />
        </div>

        {ui.activeTab === COMMUNITY_PAGE_LABELS.freeTab && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <GameFilter
              games={COMMUNITY_BOARD_GAMES}
              activeGame={ui.boardGame}
              onGameSelect={actions.board.setGame}
            />
          </div>
        )}

        {data.loading ? (
          <div className="py-10 text-center text-zinc-500">로딩 중...</div>
        ) : (
          <>
            {ui.activeTab === "하이라이트" ? (
              <div className="mt-6">
                <HighlightFeed
                  posts={data.filteredHighlights}
                  onPostClick={actions.highlight.openDetail}
                  getLikeState={actions.highlight.getLikeState}
                  getCommentCount={actions.highlight.getCommentCount}
                  onToggleLike={actions.highlight.toggleLike}
                  currentUserName={user.currentUserName}
                  onDeletePost={actions.highlight.deletePost}
                />
              </div>
            ) : (
              <>
                <BestPostsSection posts={data.bestPosts} onPostClick={actions.board.openDetail} />
                <CommunityPostList posts={data.filteredBoardPosts} onPostClick={actions.board.openDetail} />
                <Pagination
                  currentPage={ui.currentPage}
                  totalPages={data.totalPages}
                  onPageChange={actions.pagination.setPage}
                />
              </>
            )}
          </>
        )}
      </main>

      {modal.selectedPost && (
        <HighlightDetailModal
          post={modal.selectedPost}
          comments={actions.highlight.getComments(modal.selectedPost.id)}
          likeCount={actions.highlight.getLikeState(modal.selectedPost).count}
          isLiked={actions.highlight.getLikeState(modal.selectedPost).isLiked}
          totalCommentCount={actions.highlight.getCommentCount(modal.selectedPost)}
          onToggleLike={(postId) => actions.highlight.toggleLike(postId, modal.selectedPost!.likes)}
          onAddComment={actions.highlight.addComment}
          onAddReply={actions.highlight.addReply}
          onEditComment={actions.highlight.editComment}
          onEditReply={actions.highlight.editReply}
          onDeleteComment={actions.highlight.deleteComment}
          onDeleteReply={actions.highlight.deleteReply}
          currentUserName={user.currentUserName}
          isOpen={modal.isModalOpen}
          onClose={actions.modal.closeDetail}
        />
      )}

      {ui.activeTab === COMMUNITY_PAGE_LABELS.freeTab ? (
        <BoardWriteModal
          isOpen={modal.isWriteOpen}
          onClose={() => actions.modal.setWriteOpen(false)}
          onSubmit={actions.write.submit}
          initialGame={ui.boardGame}
        />
      ) : (
        <HighlightWriteModal
          isOpen={modal.isWriteOpen}
          onClose={() => actions.modal.setWriteOpen(false)}
          onSubmit={actions.write.submit}
          initialImages={sharedFiles}
        />
      )}
    </div>
  );
};
