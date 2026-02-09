// src/features/home/components/CommunityPostCard.tsx


type CommunityPostProps = {
  author: string;
  date: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  avatarUrl?: string;
};

export function CommunityPostCard({
  author,
  date,
  title,
  content,
  likes,
  comments,
  avatarUrl,
}: CommunityPostProps) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        {/* 아바타 */}
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-zinc-200">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={author}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-zinc-400">
              <UserIcon />
            </div>
          )}
        </div>

        {/* 작성자 정보 */}
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-zinc-900">{author}</div>
          <div className="text-xs text-zinc-500">{date}</div>
        </div>

        {/* 더보기 버튼 */}
        <button className="shrink-0 p-1 text-zinc-400 hover:text-zinc-600">
          <ThreeDotsIcon />
        </button>
      </div>

      {/* 컨텐츠 */}
      <div className="mt-4">
        <h3 className="text-base font-bold text-zinc-900">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600">{content}</p>
      </div>

      {/* 푸터 - 액션 버튼들 */}
      <div className="mt-4 flex items-center gap-4 border-t border-zinc-100 pt-3">
        <button className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900">
          <HeartIcon />
          <span className="text-sm font-medium">{likes}</span>
        </button>

        <button className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900">
          <CommentIcon />
          <span className="text-sm font-medium">{comments}</span>
        </button>

        <button className="ml-auto flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900">
          <ShareIcon />
        </button>
      </div>
    </article>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 21a8 8 0 0 0-16 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 13a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ThreeDotsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m8.59 13.51 6.83 3.98m-.01-10.98-6.82 3.98"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}
