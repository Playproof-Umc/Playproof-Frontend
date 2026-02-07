// src/features/mypage/gameData/components/GameAccountCard.tsx

import type { LinkedAccount } from "@/features/mypage/gameData/types/gameDataTypes";
import { Card } from "@/components/ui/Card";

type Props = {
  account: LinkedAccount;
  selected?: boolean;
  onClick?: () => void;
};

export function GameAccountCard({ account, selected = false, onClick }: Props) {
  const title = account.title ?? account.game;
  const subtitle =
    account.meta?.riot?.gameName && account.meta?.riot?.tagLine
      ? `${account.meta.riot.gameName}#${account.meta.riot.tagLine}`
      : account.subtitle ?? "";

  return (
    <Card
      className={[
        "h-full overflow-hidden",
        selected ? "ring-2 ring-gray-900" : "ring-1 ring-gray-200",
      ].join(" ")}
    >
      {/* ✅ 이 버튼이 “유일한” 버튼이어야 함 */}
      <button
        type="button"
        onClick={onClick}
        className="h-full w-full text-left"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-lg font-semibold text-gray-900">{title}</div>
              {subtitle ? (
                <div className="mt-1 text-sm text-gray-500">{subtitle}</div>
              ) : null}
            </div>
            {account.badge ? (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                {account.badge}
              </span>
            ) : null}
          </div>

          {/* accounts grid */}
          {Array.isArray(account.accounts) && account.accounts.length > 0 ? (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {account.accounts.slice(0, 3).map((it, idx) => (
                <div
                  key={`${it.label}-${idx}`}
                  className="rounded-lg bg-gray-50 px-3 py-2"
                >
                  <div className="text-xs text-gray-500">{it.label}</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">
                    {it.value}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 text-sm text-gray-400">
              표시할 데이터가 없습니다.
            </div>
          )}
        </div>
      </button>
    </Card>
  );
}
