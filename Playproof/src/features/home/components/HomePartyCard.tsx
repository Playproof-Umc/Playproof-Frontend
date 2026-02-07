// src/features/home/components/HomePartyCard.tsx
import React from "react";
import { Clock, MapPin } from "lucide-react";

interface HomePartyCardProps {
  title: string;
  time: string;
  location?: string;
  currentPlayers: number;
  maxPlayers: number;
  memberAvatars?: string[];
  onClick?: () => void;
}

export const HomePartyCard: React.FC<HomePartyCardProps> = ({
  title,
  time,
  location = "아지트",
  currentPlayers,
  maxPlayers,
  memberAvatars = [],
  onClick,
}) => {
  return (
    <div className="flex h-full flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      {/* 타이틀 & 버튼 */}
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-xl font-bold text-zinc-900">{title}</h3>
        <button
          onClick={onClick}
          className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:bg-zinc-200 transition-colors"
        >
          참여 확정하기
        </button>
      </div>

      {/* 시간 & 장소 */}
      <div className="mb-6 flex flex-col gap-2 text-sm text-zinc-600">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-zinc-400" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-zinc-400" />
          <span>{location}</span>
        </div>
      </div>

      {/* 멤버 아바타 */}
      <div>
        <div className="mb-2 text-xs font-medium text-zinc-500">
          참여 멤버 {currentPlayers}/{maxPlayers}
        </div>
        <div className="flex -space-x-2 overflow-hidden py-1">
          {memberAvatars.length > 0 ? (
            memberAvatars.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="member"
                className="h-10 w-10 rounded-full border-2 border-white bg-zinc-200 object-cover ring-1 ring-black/5"
              />
            ))
          ) : (
            // 더미 아바타 (피그마 느낌)
            <>
              <div className="h-10 w-10 rounded-full border-2 border-white bg-zinc-200 ring-1 ring-black/5" />
              <div className="h-10 w-10 rounded-full border-2 border-white bg-zinc-200 ring-1 ring-black/5" />
              <div className="h-10 w-10 rounded-full border-2 border-white bg-zinc-200 ring-1 ring-black/5" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};