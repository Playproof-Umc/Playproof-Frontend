import { Heart } from "lucide-react";
import type { BoardPost } from "@/features/community/types";

type PostDetailBodyProps = {
  post: BoardPost;
  onLike: () => void;
};

export const PostDetailBody = ({ post, onLike }: PostDetailBodyProps) => {
  return (
    <>
      <div className="p-6">
        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap text-gray-800">
            안녕하세요! 오늘은 눈이 와요.
            ~~~~~~~~~~~~~~~~
            혹시 듀오 구하시는 분 있으면 댓글 남겨주세요~! 같이 플레이 ㄱㄱ
          </p>

          {post.thumbnail && (
            <div className="mt-6 overflow-hidden rounded-lg bg-gray-200">
              <img src={post.thumbnail} alt="" className="h-auto w-full object-cover" />
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 px-6 py-4">
        <button
          onClick={onLike}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <Heart className="h-5 w-5" />
          <span>{post.likes}</span>
        </button>
      </div>
    </>
  );
};
