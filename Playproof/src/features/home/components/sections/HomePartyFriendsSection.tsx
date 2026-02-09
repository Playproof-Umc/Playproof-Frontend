// src/features/home/components/sections/HomePartyFriendsSection.tsx

import { HomePartyCard, HomeFriendList } from "@/features/home/components";
import type { HomePartyFriendsSectionProps } from "@/features/home/components/sections/types";

export const HomePartyFriendsSection = ({
  azitSlides,
  azitIndex,
  onPrevAzit,
  onNextAzit,
  onOpenAzit,
}: HomePartyFriendsSectionProps) => {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="relative lg:col-span-2 group">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${azitIndex * 100}%)` }}
          >
            {azitSlides.map((slide) => (
              <div key={slide.azit.id} className="w-full shrink-0">
                <HomePartyCard
                  title={slide.schedule?.title ?? "일정 없음"}
                  time={slide.timeLabel}
                  location={slide.azit?.name ?? "아지트"}
                  currentPlayers={slide.schedule?.participants.length ?? 0}
                  maxPlayers={slide.schedule?.maxMembers ?? 0}
                  memberAvatars={[]}
                  onClick={() => onOpenAzit(slide.azit.id)}
                />
              </div>
            ))}
          </div>

          {azitSlides.length > 1 ? (
            <>
              <button
                type="button"
                onClick={onPrevAzit}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
                aria-label="이전 아지트"
              >
                ←
              </button>
              <button
                type="button"
                onClick={onNextAzit}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white"
                aria-label="다음 아지트"
              >
                →
              </button>
            </>
          ) : null}
        </div>
      </div>

      <div className="h-full">
        <HomeFriendList
          friends={[
            { id: 1, nickname: "유진", statusMessage: "TS 99", isOnline: true },
            { id: 2, nickname: "유진", statusMessage: "상태메세지", isOnline: true },
            { id: 3, nickname: "유진", statusMessage: "TS 90", isOnline: false },
          ]}
        />
      </div>
    </div>
  );
};
