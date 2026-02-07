// src/features/mypage/gameData/components/LinkedAccountsRow.tsx

import type { GameKey, LinkedAccount } from "@/features/mypage/gameData/types/gameDataTypes";

import { ConnectAccountCard } from "@/features/mypage/gameData/components/ConnectAccountCard";
import { GameAccountCard } from "@/features/mypage/gameData/components/GameAccountCard";
import { OverwatchAccountCard } from "@/features/mypage/gameData/components/overwatch/OverwatchAccountCard";

type Props = {
  accounts: LinkedAccount[];
  selectedGame: GameKey | null;
  onSelectGame: (game: GameKey) => void;
};

function getBattleTag(account: LinkedAccount): string {
  const meta = account.meta as unknown;
  if (meta && typeof meta === "object") {
    const m = meta as Record<string, unknown>;
    const bt = m["battleTag"];
    if (typeof bt === "string") return bt.trim();
  }
  return "";
}

export function LinkedAccountsRow({ accounts, selectedGame, onSelectGame }: Props) {
  return (
    <div className="flex gap-4">
      {/* 좌측: 가로 스크롤 카드 리스트 */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex min-w-max gap-4">
          {accounts.map((account, idx) => {
            const isSelected = selectedGame === account.game;
            const key = `${account.game}-${idx}`;

            if (account.game === "overwatch") {
              const battleTag = getBattleTag(account);

              return (
                <div key={key} className="w-[400px] shrink-0">
                  <OverwatchAccountCard
                    account={account}
                    selected={isSelected}
                    battleTag={battleTag}
                    onClick={() => onSelectGame(account.game)}
                  />
                </div>
              );
            }

            return (
              <div key={key} className="w-[400px] shrink-0">
                <GameAccountCard
                  account={account}
                  selected={isSelected}
                  onClick={() => onSelectGame(account.game)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* 우측: 계정 연동 CTA */}
      <div className="w-[320px] shrink-0">
        <ConnectAccountCard />
      </div>
    </div>
  );
}
