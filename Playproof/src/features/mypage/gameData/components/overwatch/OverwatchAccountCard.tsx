// src/features/mypage/gameData/components/overwatch/OverwatchAccountCard.tsx

import { Card } from "@/components/ui/Card";
import type { LinkedAccount } from "@/features/mypage/gameData/types/gameDataTypes";
import { useOverwatchSummary } from "@/features/mypage/gameData/hooks/useOverwatchSummary";

type Props = {
  account: LinkedAccount;
  selected: boolean;
  onClick: () => void;

  /** 아직 연동 플로우가 없으니 BattleTag를 주입 */
  battleTag: string;
};

type InfoItemProps = {
  label: string;
  value: string;
};

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-black/50">{label}</div>
      <div className="text-base font-semibold text-black">{value}</div>
    </div>
  );
}

export function OverwatchAccountCard({ account, selected, onClick, battleTag }: Props) {
  const safeBattleTag = battleTag.trim();

  const { data, isLoading, isError } = useOverwatchSummary({
    battleTag: safeBattleTag,
    enabled: safeBattleTag.length > 0, // ✅ battleTag 없으면 호출 안 함
  });

  const headerTitle = account.title ?? "오버워치";
  const headerSub = data?.name ?? (safeBattleTag || account.subtitle || "");

  const endorsementLevel =
    data?.endorsement && typeof data.endorsement === "object"
      ? (data.endorsement.level ?? null)
      : null;

  const stateText =
    safeBattleTag.length === 0 ? "BattleTag 필요" : isLoading ? "로딩중" : isError ? "실패" : "연동됨";

  const endorsementText = isLoading ? "-" : endorsementLevel !== null ? String(endorsementLevel) : "-";
  const playerIdText = isLoading ? "-" : (data?.player_id ?? "-");

  return (
    <Card
      className={[
        "overflow-hidden transition",
        selected ? "ring-2 ring-black/20" : "ring-1 ring-gray-200 hover:shadow-md",
      ].join(" ")}
    >
      {/* ✅ GameAccountCard처럼 내부 버튼으로 클릭 처리 (Card가 onClick을 안 받아도 클릭됨) */}
      <button type="button" onClick={onClick} className="w-full cursor-pointer p-6 text-left">
        {/* 헤더 */}
        <div className="flex items-start justify-between gap-4">
          {/* ✅ avatar 블록 제거, 텍스트만 */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="truncate text-base font-semibold text-black">{headerTitle}</div>
              {headerSub ? <div className="truncate text-sm text-black/60">{headerSub}</div> : null}
            </div>

            <div className="truncate text-sm text-black/60">
              {data?.title ? data.title : account.subtitle ?? "연동됨"}
            </div>
          </div>

          <div className="shrink-0 text-black/40">↻</div>
        </div>

        {/* ✅ 회색 블럭 */}
        <div className="mt-4 rounded-2xl bg-black/5 px-6 py-5">
          <div className="grid grid-cols-3 gap-6">
            <InfoItem label="상태" value={stateText} />
            <InfoItem label="Endorsement" value={endorsementText} />
            <InfoItem label="player_id" value={playerIdText} />
          </div>
        </div>

        {/* 에러 문구 */}
        {isError && safeBattleTag.length > 0 && (
          <div className="mt-4 text-sm text-red-600">
            오버워치 정보를 불러오지 못했습니다. (프로필 공개 설정/일시적 오류 가능)
          </div>
        )}
      </button>
    </Card>
  );
}
