// src/features/auth/gameSelectPage/hooks/useSignupGameSelect.ts

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthKind, GameOption } from "@/features/auth/gameSelectPage/types";
import { GAME_OPTIONS } from "@/features/auth/gameSelectPage/mock/games";

/**
 * Step 2 로직
 * - 단일 선택(필수)
 * - 카드 클릭: 선택 상태만 변경 (확정 X)
 * - 확정/이동: CTA 버튼 클릭에서만 수행
 * - 인증 버튼 문구/색상은 authKind 기반으로 결정
 */
export function useSignupGameSelect() {
  const navigate = useNavigate();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const games = GAME_OPTIONS;

  const selectedGame: GameOption | null = useMemo(() => {
    if (!selectedId) return null;
    return games.find((g) => g.id === selectedId) ?? null;
  }, [games, selectedId]);

  const canProceed = selectedGame !== null;

  const hasAuthCta = Boolean(selectedGame?.authKind);

  const authCtaLabel = useMemo(() => {
    const kind = selectedGame?.authKind;
    if (!kind) return "";

    const labelByKind: Record<AuthKind, string> = {
      riot: "라이엇 계정으로 인증하기",
      steam: "Steam 계정으로 인증하기",
      battlenet: "Battle.net 계정으로 인증하기",
    };

    return labelByKind[kind];
  }, [selectedGame]);

  /**
   * Button 컴포넌트는 브랜드 로직을 몰라야 하므로
   * variant는 그대로 쓰되, className으로 색상만 덮어쓴다.
   * (Tailwind에서 뒤에 온 class가 우선)
   */
  const authCtaClassName = useMemo(() => {
    const kind = selectedGame?.authKind;
    if (!kind) return "";

    const classByKind: Record<AuthKind, string> = {
      // 빨강 버튼
      riot: "bg-red-600 hover:bg-red-700 text-white",
      // 파랑 버튼 (기본 blue 톤 유지 가능, 명시적으로 조금 진하게)
      steam: "bg-[#4562D6] hover:brightness-95 text-white",
      // 초록 버튼
      battlenet: "bg-teal-600 hover:bg-green-700 text-white",
    };

    return classByKind[kind];
  }, [selectedGame]);

  const onSelectGame = (id: string) => {
    setSelectedId(id);
  };

  const onClickManual = async () => {
    if (!canProceed || isPending || !selectedGame) return;

    setIsPending(true);
    try {
      // TODO(API 연동): Step2 선택 저장

      navigate("/signup/username", {
        state: {
          gameId: selectedGame.id,
          mode: "manual",
          nextPath: "/gameinfo",
        },
      });
    } finally {
      setIsPending(false);
    }
  };

  const onClickAuth = async () => {
    if (!canProceed || isPending || !selectedGame?.authKind) return;

    setIsPending(true);
    try {
      // TODO(API 연동): Step2 선택 저장 + 인증 시작

      navigate("/signup/step3", {
        state: {
          step: 3,
          gameId: selectedGame.id,
          mode: "auth",
          authKind: selectedGame.authKind,
        },
      });
    } finally {
      setIsPending(false);
    }
  };

  return {
    games,
    selectedGame,
    canProceed,
    isPending,

    hasAuthCta,
    authCtaLabel,
    authCtaClassName,

    onSelectGame,
    onClickManual,
    onClickAuth,
  };
}
