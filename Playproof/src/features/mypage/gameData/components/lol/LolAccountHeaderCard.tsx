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

function getTierLabel(profile: LolLinkedProfile) {
  const anyProfile = profile as unknown as Record<string, unknown>;

  const candidates = [
    anyProfile.currentTier,
    anyProfile.tierText,
    anyProfile.tier,
    anyProfile.rank ? `${String(anyProfile.tier ?? "").trim()} ${String(anyProfile.rank ?? "").trim()}`.trim() : null,
  ];

  const first = candidates.find((v) => typeof v === "string" && v.trim().length > 0) as string | undefined;
  return first ?? "-";
}

function getPositionLabel(profile: LolLinkedProfile) {
  return profile.mainPosition && profile.mainPosition.trim().length > 0 ? profile.mainPosition : "미정";
}

function getWinRateLabel(profile: LolLinkedProfile) {
  return typeof profile.winRatePercent === "number" ? `${profile.winRatePercent}%` : "-";
}

export const LolAccountHeaderCard = ({ profile }: Props) => {
  const iconUrl = getProfileIconUrl(profile.profileIconId);

  const tierLabel = getTierLabel(profile);
  const posLabel = getPositionLabel(profile);
  const winRateLabel = getWinRateLabel(profile);

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
            <div className="mt-1 text-sm font-semibold">{tierLabel}</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-500">주 포지션</div>
            <div className="mt-1 text-sm font-semibold">{posLabel}</div>
          </div>
          <div>
            <div className="text-[11px] text-gray-500">승률</div>
            <div className="mt-1 text-sm font-semibold">{winRateLabel}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
