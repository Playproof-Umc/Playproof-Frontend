// src/features/team/components/azit/PartyCard.tsx


type PartyCardProps = {
  title: string;
  game: string;
  currentPlayers: number;
  maxPlayers: number;
  time: string;
  isRecruiting?: boolean;
};

export function PartyCard({
  title,
  game,
  currentPlayers,
  maxPlayers,
  time,
  isRecruiting = true,
}: PartyCardProps) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-zinc-900">{title}</h3>
            {isRecruiting && (
              <span className="inline-flex items-center rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium text-white">
                {currentPlayers}/{maxPlayers} 인원 모집중
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center gap-4 text-sm text-zinc-600">
            <div className="flex items-center gap-1.5">
              <ClockIcon />
              <span>{time}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GameIcon />
              <span>{game}</span>
            </div>
          </div>

          {/* 플레이어 아바타들 (mock) */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-500">
              입장 멤버 {currentPlayers}명
            </span>
            <div className="flex -space-x-2">
              {Array.from({ length: currentPlayers }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full bg-zinc-200 ring-2 ring-white"
                />
              ))}
              {Array.from({ length: maxPlayers - currentPlayers }).map(
                (_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="h-8 w-8 rounded-full border-2 border-dashed border-zinc-300 bg-zinc-50 ring-2 ring-white"
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 상단 알림 배지 (이미지에서 1번) */}
      <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
        1
      </div>
    </section>
  );
}

function ClockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="text-zinc-500"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 7v5l3 3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GameIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="text-zinc-500"
    >
      <path
        d="M6 12h12M12 6v12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
