// src/features/mypage/gameData/components/lol/LolOverviewSection.tsx

import type {
  DashboardTabKey,
  LolAggregateStats,
  LolLinkedProfile,
  LolMatchItem,
  PaginationState,
} from "@/features/mypage/gameData/types/gameDataTypes";
import { FilterTabs } from "@/features/mypage/gameData/components/FilterTabs";
import { LolAccountHeaderCard } from "./LolAccountHeaderCard";
import { LolStatsCardRow } from "./LolStatsCardRow";
import { MatchListSection } from "./MatchListSection";

type Props = {
  linkedProfile: LolLinkedProfile;
  aggregate: LolAggregateStats;
  matches: LolMatchItem[];
  pagination: PaginationState;
  activeTab: DashboardTabKey;
  onChangeTab: (tab: DashboardTabKey) => void;
  onChangePage: (nextPage: number) => void;
};

export const LolOverviewSection = (props: Props) => {
  const { linkedProfile, aggregate, matches, pagination, activeTab, onChangeTab, onChangePage } = props;

  return (
    <div className="space-y-4">
      <LolAccountHeaderCard profile={linkedProfile} />
      <LolStatsCardRow stats={aggregate} />
      <FilterTabs activeTab={activeTab} onChangeTab={onChangeTab} />
      <MatchListSection matches={matches} pagination={pagination} activeTab={activeTab} onChangePage={onChangePage} />
    </div>
  );
};
