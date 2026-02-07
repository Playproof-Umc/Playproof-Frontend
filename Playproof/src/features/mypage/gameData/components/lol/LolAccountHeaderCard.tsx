// src/features/mypage/gameData/components/lol/LolAccountHeaderCard.tsx

import { Card } from "@/components/ui/Card";
import type { LolLinkedProfile } from "@/features/mypage/gameData/types/gameDataTypes";

type Props = {
  profile: LolLinkedProfile;
};

const DDRAGON_VERSION = import.meta.env.VITE_DDRAGON_VERSION ?? "14.16.1";

const getProfileIconUrl = (iconId?: number) => {
  if (!iconId) return null;
  return `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}/img/profileicon/${iconId}.png`;
};

export const LolAccountHeaderCard = ({ profile }: Props) => {
  const iconUrl = getProfileIconUrl(profile.profileIconId);

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-[260px_1fr]">
        <div className="flex items-center gap-4">
          {iconUrl ? (
            <img
              src={iconUrl}
              alt="profile icon"
              className="h-12 w-12 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-200" />
          )}

          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900">
              {profile.riotId ?? profile.summonerName}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              {profile.serverLabel}
              {typeof profile.summonerLevel === "number" ? ` · Lv.${profile.summonerLevel}` : ""}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div>
            <div className="text-[11px] text-gray-500">현재 티어</div>
            <div className="mt-1 text-sm font-semibold">{profile.currentTier}</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-500">주 포지션</div>
            <div className="mt-1 text-sm font-semibold">{profile.mainPosition}</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-500">승률</div>
            <div className="mt-1 text-sm font-semibold">{profile.winRatePercent}%</div>
          </div>
        </div>
      </div>
    </Card>
  );
};