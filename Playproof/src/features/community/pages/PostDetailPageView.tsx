// src/features/community/pages/PostDetailPageView.tsx

import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { MOCK_BOARD_POSTS } from "@/features/community/data/mockCommunityData";
import { COMMUNITY_PAGE_LABELS } from "@/features/community/constants/labels";
import { PostDetailHeader } from "@/features/community/components/detail/PostDetailHeader";
import { PostDetailBody } from "@/features/community/components/detail/PostDetailBody";
import { PostDetailComments } from "@/features/community/components/detail/PostDetailComments";
import { useCommunityDetailLogic } from "@/features/community/hooks/useCommunityDetailLogic";

export const PostDetailPageView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { postId } = useParams();
  const [searchParams] = useSearchParams();
  const fromTab = searchParams.get("from") || COMMUNITY_PAGE_LABELS.highlightTab;
  const statePost = (location.state as { post?: typeof MOCK_BOARD_POSTS[number] } | null)?.post;
  const post = statePost ?? MOCK_BOARD_POSTS.find((p) => p.id === Number(postId));
  const { state, setters, handlers } = useCommunityDetailLogic(post);
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

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>{COMMUNITY_PAGE_LABELS.notFound}</p>
      </div>
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
    console.log("게시글 수정");
  };

  const handleDeletePost = () => {
    console.log("게시글 삭제");
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl px-6 py-8">
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
      </main>
    </div>
  );
};
