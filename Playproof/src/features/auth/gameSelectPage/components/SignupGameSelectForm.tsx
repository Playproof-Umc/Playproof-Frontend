// src/features/auth/gameSelectPage/components/SignupGameSelectForm.tsx

import { Button } from "@/components/ui/Button";
import { GameSelectGrid } from "@/features/auth/gameSelectPage/components/GameSelectGrid";
import type { GameOption } from "@/features/auth/gameSelectPage/types";

type SignupGameSelectFormProps = {
  games: GameOption[];
  selectedGame: GameOption | null;
  isPending: boolean;
  hasAuthCta: boolean;
  authCtaLabel: string;
  authCtaClassName: string;
  onSelectGame: (id: string) => void;
  onClickManual: () => void;
  onClickAuth: () => void;
};

export function SignupGameSelectForm({
  games,
  selectedGame,
  isPending,
  hasAuthCta,
  authCtaLabel,
  authCtaClassName,
  onSelectGame,
  onClickManual,
  onClickAuth,
}: SignupGameSelectFormProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2 text-center">
        <p className="text-xl font-bold text-gray-900">
          주로 플레이하는 게임을 선택해주세요.
        </p>
        <p className="text-sm mt-5 mb-7 text-gray-500">
          프로필 생성에 사용할 게임 데이터를 불러올 게임을 선택해주세요.
        </p>
      </div>

      <GameSelectGrid
        games={games}
        selectedId={selectedGame?.id ?? null}
        onSelect={onSelectGame}
      />

      {/* ✅ 게임 선택 후에만 버튼 노출 */}
      {selectedGame ? (
        <div className="mt-8 px-12 flex gap-4">
          {/* 왼쪽: 항상 노출 */}
          <Button
            type="button"
            variant="primary"
            fullWidth
            className="h-10 text-xs"
            disabled={isPending}
            onClick={onClickManual}
          >
            정보 직접 입력하기
          </Button>

          {/* 오른쪽: authKind 있을 때만(= 리그/발로/스팀/오버워치) */}
          {hasAuthCta ? (
            <Button
              type="button"
              variant="primary"
              fullWidth
              className={`h-10 text-xs ${authCtaClassName}`}
              disabled={isPending}
              onClick={onClickAuth}
            >
              {authCtaLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
