// src/features/mypage/gameData/components/overwatch/OverwatchOverviewSection.tsx

import { Card } from "@/components/ui/Card";
import type { OverwatchStatsResponse } from "@/features/mypage/gameData/api/overwatchApi";

type Props = {
  data: OverwatchStatsResponse;
};

// 역할(Role) 아이콘 SVG (간단히 텍스트나 이모지로 대체 가능, 여기선 텍스트)
const ROLE_LABELS: Record<string, string> = {
  tank: "탱커",
  damage: "딜러",
  support: "힐러",
};

export const OverwatchOverviewSection = ({ data }: Props) => {
  const { roles, top3Heroes } = data;

  // 역할 순서: 탱 -> 딜 -> 힐
  const roleKeys = ["tank", "damage", "support"] as const;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* 1. 경쟁전 티어 카드 */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">경쟁전 등급 (PC)</h3>
          <div className="space-y-4">
            {roleKeys.map((role) => {
              const info = roles[role];
              if (!info) return null;
              
              return (
                <div key={role} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {/* 티어 아이콘 */}
                    <img src={info.rank_icon} alt={role} className="w-10 h-10 object-contain" />
                    <div>
                      <div className="text-sm font-medium text-gray-500">{ROLE_LABELS[role]}</div>
                      <div className="text-base font-bold text-gray-900 capitalize">
                        {info.division} {info.tier}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {!roles.tank && !roles.damage && !roles.support && (
              <div className="text-gray-400 text-sm">배치된 경쟁전 티어가 없습니다.</div>
            )}
          </div>
        </Card>

        {/* 2. 모스트 영웅 TOP 3 */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">모스트 영웅 (TOP 3)</h3>
          <div className="space-y-3">
            {top3Heroes.map((h, idx) => {
              // 시간을 "12h 30m" 형태로 변환 (초 단위)
              const hours = Math.floor(h.playtimeSeconds / 3600);
              const minutes = Math.floor((h.playtimeSeconds % 3600) / 60);
              const timeStr = hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;

              return (
                <div key={h.hero} className="flex items-center justify-between p-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-4 text-center font-bold text-gray-400">{idx + 1}</span>
                    <div className="capitalize font-semibold text-gray-800">{h.hero}</div>
                  </div>
                  <div className="text-sm font-medium text-blue-600">{timeStr}</div>
                </div>
              );
            })}
            {top3Heroes.length === 0 && (
              <div className="text-gray-400 text-sm">플레이 데이터가 부족합니다.</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};