import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/common/Navbar";
import { MOCK_BOARD_POSTS, MOCK_COMMENTS } from "@/features/community/data/mockCommunityData";
import { COMMUNITY_PAGE_LABELS } from "@/features/community/constants/labels";
import { PostDetailHeader } from "@/features/community/components/detail/PostDetailHeader";
import { PostDetailBody } from "@/features/community/components/detail/PostDetailBody";
import { PostDetailComments } from "@/features/community/components/detail/PostDetailComments";

export const PostDetailPageView = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [searchParams] = useSearchParams();
  const [newComment, setNewComment] = React.useState("");

  const fromTab = searchParams.get("from") || COMMUNITY_PAGE_LABELS.highlightTab;
  const post = MOCK_BOARD_POSTS.find((p) => p.id === Number(postId));

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

  const handleMore = () => {
    console.log("더보기");
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("댓글 작성:", newComment);
    setNewComment("");
  };

  const handleLike = () => {
    console.log("좋아요");
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
            onShare={handleShare}
            onReport={handleReport}
            onMore={handleMore}
          />
          <PostDetailBody post={post} onLike={handleLike} />
          <PostDetailComments
            comments={MOCK_COMMENTS}
            newComment={newComment}
            onCommentChange={setNewComment}
            onCommentSubmit={handleCommentSubmit}
          />
        </div>
      </main>
    </div>
  );
};
