// src/features/mypage/gameData/components/lol/MatchListSection.tsx

import { Card } from "@/components/ui/Card";
import type { DashboardTabKey, LolMatchItem, PaginationState } from "@/features/mypage/gameData/types/gameDataTypes";
import { MatchRow } from "./MatchRow";
import { PaginationBar } from "./PaginationBar";

type Props = {
  matches: LolMatchItem[];
  pagination: PaginationState;
  activeTab: DashboardTabKey;
  onChangePage: (nextPage: number) => void;
};

export const MatchListSection = ({ matches, pagination, activeTab, onChangePage }: Props) => {
  if (activeTab === "tier") {
    return (
      <Card className="p-10">
        <div className="text-sm font-semibold text-gray-800">티어 기록</div>
        <div className="mt-2 text-xs text-gray-500">레이아웃 자리만 만들어 둔 상태입니다.</div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {matches.map((m) => (
        <MatchRow key={m.id} match={m} />
      ))}
      <PaginationBar pagination={pagination} onChangePage={onChangePage} />
    </div>
  );
};
