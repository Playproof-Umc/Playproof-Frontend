// src/features/community/pages/PostDetailPageView.tsx

import React from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ModalShell } from "@/components/ui/ModalShell";
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
  const post = apiPost ?? statePost ?? MOCK_BOARD_POSTS.find((p) => p.id === Number(postId));
  console.log("PostDetailPageView - final post:", post, "statePost:", statePost, "apiPost:", apiPost);
  const { state, setters, handlers } = useCommunityDetailLogic(post);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
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
    const postAuthor = post.author;
    if (postAuthor !== currentUserName) {
      alert('본인이 작성한 게시글만 수정할 수 있습니다.');
      return;
    }
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (payload: { title: string; content: string; images: File[]; game: string }) => {
    // 권한 재확인 - nickname 또는 author 중 하나와 일치하면 허용
    const postAuthor = post.author;
    if (postAuthor !== currentUserName) {
      alert('본인이 작성한 게시글만 수정할 수 있습니다.');
      setIsEditModalOpen(false);
      return;
    }

    try {
      // API 스펙: title, content, medias만 전송 (game_id는 수정 시 불필요)
      const updated = await updateBoardPost(post.id, {
        title: payload.title,
        content: payload.content,
        files: payload.images,
      });
      setApiPost(updated);
    } catch (error: any) {
      console.error('게시글 수정 실패:', error);
      const errorMessage = error?.response?.data?.error?.message || '게시글 수정에 실패했습니다.';
      throw new Error(errorMessage);
    }
  };

  const handleDeletePost = () => {
    // 권한 체크 - nickname 또는 author 중 하나와 일치하면 허용
    const postAuthor = post.author;
    if (postAuthor !== currentUserName) {
      alert('본인이 작성한 게시글만 삭제할 수 있습니다.');
      return;
    }
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteBoardPost(post.id);
      navigate(`/community?tab=${fromTab}`);
    } catch (error: any) {
      console.error('게시글 삭제 실패:', error);
      const errorMessage = error?.response?.data?.error?.message || '게시글 삭제에 실패했습니다.';
      alert(errorMessage);
    } finally {
      setIsDeleteModalOpen(false);
    }
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
      <ModalShell open={isDeleteModalOpen} onOverlayClick={() => setIsDeleteModalOpen(false)}>
        <div className="px-6 py-5">
          <h2 className="text-lg font-bold text-gray-900">게시글 삭제</h2>
          <p className="mt-2 text-sm text-gray-600">게시글을 삭제할까요? 삭제 후에는 복구할 수 없습니다.</p>
        </div>
        <div className="flex gap-2 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(false)}
            className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleDeleteConfirm}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            삭제
          </button>
        </div>
      </ModalShell>
    </AppLayout>
  );
};
