import React from 'react';
import { getMyPosts } from '../../api/mypageApi';
import type { MyPostsData } from '@/features/mypage/types';
import { MatchingCard } from '@/features/matching/components/MatchingCard';
import { HighlightCard } from '@/features/community/components/HighlightCard';
import { CommunityPostList } from '@/features/community/components/CommunityPostList';
import { useNavigate } from 'react-router-dom';

export function RecentPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = React.useState<MyPostsData | null>(null);
  const [loading, setLoading] = React.useState(true);

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

  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (!posts) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-gray-500">데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* 최근 작성한 매칭 글 */}
      <div>
        <h2 className="mb-6 text-xl font-bold text-gray-900">최근 작성한 매칭 글</h2>
        {posts.matchingPosts.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">작성한 매칭 글이 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.matchingPosts.map((post) => (
              <MatchingCard key={post.id} data={post} />
            ))}
          </div>
        )}
      </div>

      {/* 최근 작성한 하이라이트 */}
      <div>
        <h2 className="mb-6 text-xl font-bold text-gray-900">최근 작성한 하이라이트</h2>
        {posts.highlightPosts.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">작성한 하이라이트가 없습니다.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.highlightPosts.map((post) => (
              <HighlightCard
                key={post.id}
                post={post}
                onPostClick={(post) => {
                  console.log('하이라이트 클릭:', post.id);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 최근 작성한 커뮤니티 글 */}
      <div>
        <h2 className="mb-6 text-xl font-bold text-gray-900">최근 작성한 커뮤니티 글</h2>
        {posts.communityPosts.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">작성한 커뮤니티 글이 없습니다.</p>
        ) : (
          <CommunityPostList
            posts={posts.communityPosts}
            onPostClick={(post) => {
              navigate(`/community/${post.id}?from=자유게시판`);
            }}
          />
        )}
      </div>
    </div>
  );
}