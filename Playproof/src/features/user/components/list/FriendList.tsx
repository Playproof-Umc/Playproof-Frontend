// src/features/user/components/list/FriendList.tsx

import type { UserBasicInfo } from "@/features/user/types";
import { cn } from "@/utils/cn"; 

type FriendListProps = {
  friends: UserBasicInfo[];
  variant?: "widget" | "detail"; 
  isLoading?: boolean;
  onInvite?: (id: string | number) => void;
  onRemove?: (id: string | number) => void;
  emptyMessage?: string;
};

export function FriendList({
  friends,
  variant = "widget",
  isLoading,
  onInvite,
  onRemove,
  emptyMessage = "친구가 없습니다.",
}: FriendListProps) {
  if (isLoading) {
    return <div className="py-8 text-center text-sm text-zinc-500">로딩 중...</div>;
  }

  if (friends.length === 0) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center text-center text-zinc-500",
        variant === "widget" ? "py-8" : "py-16"
      )}>
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", variant === "detail" && "space-y-4")}>
      {friends.map((friend) => (
        <div
          key={friend.id}
          className={cn(
            "flex items-center gap-3 rounded-xl ring-1 ring-black/5 transition-all",
            variant === "widget" 
              ? "bg-white p-3" 
              : "bg-white p-4 shadow-sm hover:shadow-md"
          )}
        >
          {/* 아바타 영역 */}
          <div className="relative h-10 w-10 shrink-0">
            <div className="h-full w-full overflow-hidden rounded-full bg-zinc-200">
              {friend.avatarUrl ? (
                <img 
                  src={friend.avatarUrl} 
                  alt={friend.nickname} 
                  className="h-full w-full object-cover" 
                />
              ) : (
                <div className="grid h-full w-full place-items-center text-zinc-400">
                  <UserIcon />
                </div>
              )}
            </div>
            {friend.isOnline && (
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
            )}
          </div>

          {/* 정보 영역 */}
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-zinc-900">
              {friend.nickname}
            </div>
            <div className="truncate text-xs text-zinc-500">
              {friend.game || "오프라인"} 
              {friend.status && ` · ${friend.status}`}
              {friend.tier && ` · ${friend.tier}`}
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="shrink-0 flex gap-2">
            {onInvite && (
              <button
                onClick={() => onInvite(friend.id)}
                className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800 transition-colors"
              >
                초대
              </button>
            )}
            {variant === "detail" && onRemove && (
              <button
                onClick={() => onRemove(friend.id)}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
              >
                삭제
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
