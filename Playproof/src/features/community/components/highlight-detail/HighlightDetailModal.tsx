// src/features/community/components/highlight-detail/HighlightDetailModal.tsx

import React from "react";
import { X } from "lucide-react";
import type { HighlightPost, Comment } from "@/features/community/types";
import { useNavigate } from "react-router-dom";
import { HighlightDetailMediaPanel } from "@/features/community/components/highlight-detail/HighlightDetailMediaPanel";
import { HighlightDetailCommentsPanel } from "@/features/community/components/highlight-detail/HighlightDetailCommentsPanel";
import { useHighlightDetailState } from "@/features/community/components/highlight-detail/useHighlightDetailState";

interface HighlightDetailModalProps {
  post: HighlightPost;
  comments: Comment[];
  likeCount: number;
  isLiked: boolean;
  totalCommentCount: number;
  onToggleLike: (postId: number) => void;
  onAddComment: (postId: number, content: string) => void;
  onAddReply: (postId: number, commentId: string, content: string) => void;
  onEditComment: (postId: number, commentId: string, content: string) => void;
  onEditReply: (postId: number, commentId: string, replyId: string, content: string) => void;
  onDeleteComment: (postId: number, commentId: string) => void;
  onDeleteReply: (postId: number, commentId: string, replyId: string) => void;
  currentUserName: string;
  isOpen: boolean;
  onClose: () => void;
  profileUserId?: string;
}

export function HighlightDetailModal(props: HighlightDetailModalProps) {
  if (!props.isOpen) return null;

  return <HighlightDetailModalContent key={props.post.id} {...props} />;
}

function HighlightDetailModalContent({
  post,
  comments,
  likeCount,
  isLiked,
  totalCommentCount,
  onToggleLike,
  onAddComment,
  onAddReply,
  onEditComment,
  onEditReply,
  onDeleteComment,
  onDeleteReply,
  currentUserName,
  onClose,
  profileUserId,
}: HighlightDetailModalProps) {
  const navigate = useNavigate();
  const { state, refs, actions } = useHighlightDetailState(post);
  const resolvedProfileUserId = profileUserId ?? "user-1";

  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleMoveToProfile = (event: React.MouseEvent, userId: string) => {
    event.stopPropagation();
    navigate(`/user/${userId}`);
  };

  const handleCommentSubmit = () => {
    if (!state.commentText.trim()) return;
    onAddComment(post.id, state.commentText.trim());
    actions.setCommentText("");
    actions.focusCommentInput();
  };

  const handleReplySubmit = (commentId: string) => {
    if (!state.replyText.trim()) return;
    onAddReply(post.id, commentId, state.replyText.trim());
    actions.setReplyText("");
    actions.setReplyingToId(null);
    actions.focusCommentInput();
  };

  const handleEditSubmit = () => {
    const nextText = state.editText.trim();
    if (!nextText) return;
    if (state.editingCommentId) {
      onEditComment(post.id, state.editingCommentId, nextText);
      actions.handleEditCancel();
      return;
    }
    if (state.editingReplyId && state.editingParentId) {
      onEditReply(post.id, state.editingParentId, state.editingReplyId, nextText);
      actions.handleEditCancel();
    }
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div className="relative flex h-[90vh] w-full max-w-6xl flex-col overflow-y-auto md:overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-gray-600 hover:bg-white hover:text-gray-900"
        >
          <X className="h-6 w-6" />
        </button>

        <HighlightDetailMediaPanel
          post={post}
          currentImageIndex={state.currentImageIndex}
          onNextImage={actions.nextImage}
          onPrevImage={actions.prevImage}
          onToggleLike={onToggleLike}
          likeCount={likeCount}
          isLiked={isLiked}
          totalCommentCount={totalCommentCount}
          onMoveToProfile={handleMoveToProfile}
          profileUserId={resolvedProfileUserId}
        />

        <HighlightDetailCommentsPanel
          comments={comments}
          totalCommentCount={totalCommentCount}
          currentUserName={currentUserName}
          commentText={state.commentText}
          onCommentTextChange={actions.setCommentText}
          onCommentKeyDown={(event) => actions.handleCommentKeyDown(event, handleCommentSubmit)}
          onCommentSubmit={handleCommentSubmit}
          commentInputRef={refs.commentInputRef}
          replyingToId={state.replyingToId}
          replyText={state.replyText}
          onReplyTextChange={actions.setReplyText}
          onReplyKeyDown={(event, commentId) =>
            actions.handleReplyKeyDown(event, () => handleReplySubmit(commentId))
          }
          onReplySubmit={handleReplySubmit}
          onReplyToggle={actions.handleReplyToggle}
          replyInputRef={refs.replyInputRef}
          editingCommentId={state.editingCommentId}
          editingReplyId={state.editingReplyId}
          editingParentId={state.editingParentId}
          editText={state.editText}
          onEditTextChange={actions.setEditText}
          onEditKeyDown={(event) => actions.handleEditKeyDown(event, handleEditSubmit)}
          onEditStart={actions.handleEditStart}
          onReplyEditStart={actions.handleReplyEditStart}
          onEditCancel={actions.handleEditCancel}
          onEditSubmit={handleEditSubmit}
          onDeleteComment={(commentId) => onDeleteComment(post.id, commentId)}
          onDeleteReply={(commentId, replyId) => onDeleteReply(post.id, commentId, replyId)}
          editInputRef={refs.editInputRef}
          onMoveToProfile={handleMoveToProfile}
          profileUserId={resolvedProfileUserId}
        />
      </div>
    </div>
  );
}
