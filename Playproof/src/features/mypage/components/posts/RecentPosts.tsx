// src/features/mypage/components/posts/RecentPosts.tsx

import React from 'react';
import { getMyPosts } from '@/features/mypage/api/mypageApi';
import type { MyPostsData } from '@/features/mypage/types';
import { MatchingCard } from '@/features/matching/components';
import { HighlightCard, CommunityPostList, HighlightDetailModal } from '@/features/community/components';
import { useNavigate } from 'react-router-dom';
import { MYPAGE_ACTION_LABELS, MYPAGE_SECTION_LABELS } from '@/features/mypage/constants/labels';
import { useHighlightFeed } from '@/features/community/hooks/useHighlightFeed';

export function RecentPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = React.useState<MyPostsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [highlightPage, setHighlightPage] = React.useState(0);
  const [selectedHighlightId, setSelectedHighlightId] = React.useState<number | null>(null);
  const highlightFeed = useHighlightFeed({ seedComments: true });
  const {
    hydrateFromPosts,
    getLikeState,
    getCommentCount,
    toggleLike,
    deletePost,
    getComments,
    addComment,
    addReply,
    editComment,
    editReply,
    deleteComment,
    deleteReply,
  } = highlightFeed.actions;

  React.useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await getMyPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  React.useEffect(() => {
    if (!posts?.highlightPosts) return;
    hydrateFromPosts(posts.highlightPosts);
  }, [hydrateFromPosts, posts?.highlightPosts]);

  const highlights = highlightFeed.state.highlights;
  const highlightPageSize = 3;
  const totalHighlightPages = Math.max(1, Math.ceil(highlights.length / highlightPageSize));
  const highlightPageIndex = Math.min(highlightPage, totalHighlightPages - 1);
  const highlightSliceStart = highlightPageIndex * highlightPageSize;
  const visibleHighlights = highlights.slice(
    highlightSliceStart,
    highlightSliceStart + highlightPageSize
  );
  const selectedHighlight = highlights.find((post) => post.id === selectedHighlightId) ?? null;

  React.useEffect(() => {
    if (highlightPageIndex !== highlightPage) {
      setHighlightPage(highlightPageIndex);
    }
  }, [highlightPage, highlightPageIndex]);

  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-gray-500">{MYPAGE_ACTION_LABELS.loading}</p>
      </div>
    );
  }

  if (!posts) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-gray-500">
          {MYPAGE_ACTION_LABELS.dataLoadFail}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* 최근 작성한 매칭 글 */}
      <div>
        <h2 className="mb-6 text-xl font-bold text-gray-900">
          {MYPAGE_SECTION_LABELS.recentMatchingPosts}
        </h2>
        {posts.matchingPosts.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            {MYPAGE_ACTION_LABELS.emptyMatchingPosts}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.matchingPosts.map((post) => (
              <MatchingCard
                key={post.id}
                data={post}
              />
            ))}
          </div>
        )}
      </div>

      {/* 최근 작성한 하이라이트 */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {MYPAGE_SECTION_LABELS.recentHighlights}
          </h2>
          {highlights.length > highlightPageSize ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHighlightPage((prev) => Math.max(0, prev - 1))}
                disabled={highlightPageIndex === 0}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 transition disabled:opacity-40"
              >
                이전
              </button>
              <button
                type="button"
                onClick={() =>
                  setHighlightPage((prev) => Math.min(totalHighlightPages - 1, prev + 1))
                }
                disabled={highlightPageIndex >= totalHighlightPages - 1}
                className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 transition disabled:opacity-40"
              >
                다음
              </button>
            </div>
          ) : null}
        </div>
        {posts.highlightPosts.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            {MYPAGE_ACTION_LABELS.emptyHighlights}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleHighlights.map((post) => {
              const likeState = getLikeState(post);
              const commentCount = getCommentCount(post);
              return (
              <HighlightCard
                key={post.id}
                post={post}
                likeCount={likeState.count}
                isLiked={likeState.isLiked}
                commentCount={commentCount}
                onToggleLike={(postId) => toggleLike(postId, post.likes)}
                onPostClick={(post) => {
                  setSelectedHighlightId(post.id);
                }}
                currentUserName={highlightFeed.state.currentUserName}
                onDeletePost={deletePost}
              />
              );
            })}
          </div>
        )}
      </div>

      {/* 최근 작성한 커뮤니티 글 */}
      <div>
        <h2 className="mb-6 text-xl font-bold text-gray-900">
          {MYPAGE_SECTION_LABELS.recentCommunityPosts}
        </h2>
        {posts.communityPosts.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            {MYPAGE_ACTION_LABELS.emptyCommunityPosts}
          </p>
        ) : (
          <CommunityPostList
            posts={posts.communityPosts}
            onPostClick={(post) => {
              navigate(`/community/${post.id}?from=자유게시판`);
            }}
          />
        )}
      </div>

      {selectedHighlight ? (
        <HighlightDetailModal
          post={selectedHighlight}
          comments={getComments(selectedHighlight.id)}
          likeCount={getLikeState(selectedHighlight).count}
          isLiked={getLikeState(selectedHighlight).isLiked}
          totalCommentCount={getCommentCount(selectedHighlight)}
          onToggleLike={(postId) =>
            toggleLike(
              postId,
              getLikeState(selectedHighlight).count
            )
          }
          onAddComment={addComment}
          onAddReply={addReply}
          onEditComment={editComment}
          onEditReply={editReply}
          onDeleteComment={deleteComment}
          onDeleteReply={deleteReply}
          currentUserName={highlightFeed.state.currentUserName}
          isOpen
          onClose={() => setSelectedHighlightId(null)}
        />
      ) : null}
    </div>
  );
}
