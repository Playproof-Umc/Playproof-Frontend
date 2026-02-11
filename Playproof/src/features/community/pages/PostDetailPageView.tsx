// src/features/community/pages/PostDetailPageView.tsx

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { MOCK_BOARD_POSTS } from "@/features/community/data/mockCommunityData";
import { COMMUNITY_PAGE_LABELS } from "@/features/community/constants/labels";
import { PostDetailHeader } from "@/features/community/components/detail/PostDetailHeader";
import { PostDetailBody } from "@/features/community/components/detail/PostDetailBody";
import { PostDetailComments } from "@/features/community/components/detail/PostDetailComments";
import { BoardEditModal } from "@/features/community/components";
import { useCommunityDetailLogic } from "@/features/community/hooks/useCommunityDetailLogic";
import { updateBoardPost, deleteBoardPost, getBoardPost } from "@/features/community/api/communityApi";
import type { BoardPost } from "@/features/community/types/types";

export const PostDetailPageView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { postId } = useParams();
  const [searchParams] = useSearchParams();
  const fromTab = searchParams.get("from") || COMMUNITY_PAGE_LABELS.highlightTab;
  const statePost = (location.state as { post?: BoardPost } | null)?.post;
  const [apiPost, setApiPost] = React.useState<BoardPost | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  
  // API에서 post 정보 로드
  React.useEffect(() => {
    if (!postId) return;
    setIsLoading(true);
    getBoardPost(Number(postId))
      .then((post) => {
        setApiPost(post);
        console.log("Loaded post from API:", post);
      })
      .catch(() => {
        console.log("Failed to load post from API, using state or MOCK");
      })
      .finally(() => setIsLoading(false));
  }, [postId]);
  
  // statePost가 있으면 우선, 없으면 API post 사용, 둘 다 없으면 MOCK에서 찾기
  const post = statePost ?? apiPost ?? MOCK_BOARD_POSTS.find((p) => p.id === Number(postId));
  console.log("PostDetailPageView - final post:", post, "statePost:", statePost, "apiPost:", apiPost);
  const { state, setters, handlers } = useCommunityDetailLogic(post);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const {
    commentText,
    replyText,
    replyingToId,
    comments,
    currentUserName,
    likeState,
    totalCommentCount,
    editingCommentId,
    editingReplyId,
    editingParentId,
    editText,
  } = state;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex min-h-screen items-center justify-center">
          <p>로드 중...</p>
        </div>
      </AppLayout>
    );
  }

  if (!post) {
    return (
      <AppLayout>
        <div className="flex min-h-screen items-center justify-center">
          <p>{COMMUNITY_PAGE_LABELS.notFound}</p>
        </div>
      </AppLayout>
    );
  }

  const handleBack = () => {
    navigate(`/community?tab=${fromTab}`);
  };

  const handleShare = () => {
    console.log("공유하기");
  };

  const handleReport = () => {
    console.log("신고하기");
  };

  const handleEditPost = () => {
    // 권한 체크 - nickname 또는 author 중 하나와 일치하면 허용
    const postAuthor = post.nickname ?? post.author;
    if (postAuthor !== currentUserName) {
      alert('본인이 작성한 게시글만 수정할 수 있습니다.');
      return;
    }
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (payload: { title: string; content: string; images: File[]; game: string }) => {
    // 권한 재확인 - nickname 또는 author 중 하나와 일치하면 허용
    const postAuthor = post.nickname ?? post.author;
    if (postAuthor !== currentUserName) {
      alert('본인이 작성한 게시글만 수정할 수 있습니다.');
      setIsEditModalOpen(false);
      return;
    }

    try {
      // API 스펙: title, content, medias만 전송 (game_id는 수정 시 불필요)
      await updateBoardPost(post.id, {
        title: payload.title,
        content: payload.content,
        medias: [], // 기존 이미지 유지 (새 이미지 업로드는 별도 처리 TODO)
      });
      
      // 수정 성공 후 페이지 새로고침
      window.location.reload();
    } catch (error: any) {
      console.error('게시글 수정 실패:', error);
      const errorMessage = error?.response?.data?.error?.message || '게시글 수정에 실패했습니다.';
      alert(errorMessage);
      setIsEditModalOpen(false);
    }
  };

  const handleDeletePost = () => {
       console.log("게시글 삭제");
    // TODO: 향후 구현
  };

  return (
    <AppLayout className="bg-zinc-50">
      <main className="py-8">
        <div className="mx-auto w-full max-w-4xl">
          <button
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{fromTab}</span>
          </button>

          <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
            <PostDetailHeader
              post={post}
              likeCount={likeState.count}
              commentCount={totalCommentCount}
              isLiked={likeState.isLiked}
              currentUserName={currentUserName}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onShare={handleShare}
              onReport={handleReport}
            />
            <PostDetailBody
              post={post}
              likeCount={likeState.count}
              isLiked={likeState.isLiked}
              onLike={handlers.handleLikeToggle}
            />
            <PostDetailComments
              comments={comments}
              totalCount={totalCommentCount}
              currentUserName={currentUserName}
              commentText={commentText}
              replyText={replyText}
              replyingToId={replyingToId}
              editingCommentId={editingCommentId}
              editingReplyId={editingReplyId}
              editingParentId={editingParentId}
              editText={editText}
              onCommentChange={setters.setCommentText}
              onCommentSubmit={handlers.handleCommentSubmit}
              onReplyChange={setters.setReplyText}
              onReplyToggle={handlers.handleReplyToggle}
              onReplySubmit={handlers.handleReplySubmit}
              onEditTextChange={setters.setEditText}
              onEditCommentStart={handlers.handleEditCommentStart}
              onEditReplyStart={handlers.handleEditReplyStart}
              onEditCancel={handlers.handleEditCancel}
              onEditSubmit={handlers.handleEditSubmit}
              onDeleteComment={handlers.handleDeleteComment}
              onDeleteReply={handlers.handleDeleteReply}
            />
          </div>
        </div>
      </main>

      <BoardEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        post={post}
      />
    </AppLayout>
  );
};
