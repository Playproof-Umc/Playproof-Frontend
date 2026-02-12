// src/features/auth/gameSelectPage/hooks/useSignupGameSelect.ts

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthKind, GameOption } from "@/features/auth/gameSelectPage/types";
import { GAME_OPTIONS, GAME_ID_MAP } from "@/features/auth/gameSelectPage/mock/games";
import { useSignupStore } from "@/store/signupStore";
import { verifyRiotAccount, verifyOverwatchAccount } from "@/services/authApi";

/**
 * Step 2 로직
 * - 단일 선택(필수)
 * - 카드 클릭: 선택 상태만 변경 (확정 X)
 * - 확정/이동: CTA 버튼 클릭에서만 수행
 * - 인증 버튼 문구/색상은 authKind 기반으로 결정
 */
export function useSignupGameSelect() {
  const navigate = useNavigate();
  const { setSelectedGame } = useSignupStore();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showRiotModal, setShowRiotModal] = useState(false);
  const [showOverwatchModal, setShowOverwatchModal] = useState(false);

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
      // Step 2: 게임 ID 저장 (수동 회원가입 - accountId 없음)
      const numericGameId = GAME_ID_MAP[selectedGame.id] || 8;
      setSelectedGame(numericGameId, ""); // accountId는 빈 문자열
      console.log('🎮 [Step 2 완료 - 수동 회원가입]', selectedGame.id, '-> ID:', numericGameId);

      navigate("/gameinfo", {
        state: {
          gameId: selectedGame.id,
          mode: "manual",
        },
      });
    } finally {
      setIsPending(false);
    }
  };

  const onClickAuth = async () => {
    console.log('🔵 onClickAuth 호출됨', { canProceed, isPending, selectedGame, authKind: selectedGame?.authKind });
    
    if (!canProceed || isPending || !selectedGame?.authKind) {
      console.log('❌ 조건 불만족:', { canProceed, isPending, hasAuthKind: !!selectedGame?.authKind });
      return;
    }

    // Riot 계정 연동인 경우 모달 열기
    if (selectedGame.authKind === "riot") {
      console.log('✅ Riot 모달 열기');
      setShowRiotModal(true);
      return;
    }

    // Overwatch (Battle.net) 계정 연동인 경우 모달 열기
    if (selectedGame.authKind === "battlenet") {
      console.log('✅ Overwatch 모달 열기');
      setShowOverwatchModal(true);
      return;
    }

    // Steam은 OAuth가 필요하므로 준비 중 메시지
    if (selectedGame.authKind === "steam") {
      alert('Steam 계정 연동은 준비 중입니다.');
      return;
    }

    alert(`${selectedGame.authKind} 연동은 준비 중입니다.`);
  };

  const handleRiotAccountVerified = async (_accountId: string, gameName: string, tagLine: string) => {
    if (!selectedGame) return;

    setIsPending(true);
    try {
      // Riot 계정 검증
      const result = await verifyRiotAccount(gameName, tagLine);
      
      // Step 2: 게임 ID + accountId (puuid) 저장
      const numericGameId = GAME_ID_MAP[selectedGame.id] || 8;
      setSelectedGame(numericGameId, result.puuid); // 자동 회원가입 - accountId에 puuid 저장
      
      console.log('✅ [Step 2 완료 - 자동 회원가입]', {
        gameId: selectedGame.id,
        numericGameId,
        accountId: result.puuid,
        riotAccount: `${gameName}#${tagLine}`
      });

      // 모달 닫고 다음 페이지로
      setShowRiotModal(false);
      navigate("/gameinfo", {
        state: {
          gameId: selectedGame.id,
          mode: "auth",
          authKind: selectedGame.authKind,
          riotAccount: {
            gameName: result.gameName,
            tagLine: result.tagLine,
            puuid: result.puuid,
          }
        },
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : '계정 검증에 실패했습니다.');
    } finally {
      setIsPending(false);
    }
  };

  const handleOverwatchAccountVerified = async (_accountId: string, battleTag: string) => {
    if (!selectedGame) return;

    setIsPending(true);
    try {
      // Overwatch 계정 검증
      const result = await verifyOverwatchAccount(battleTag);
      
      // Step 2: 게임 ID + accountId (player_id) 저장
      const numericGameId = GAME_ID_MAP[selectedGame.id] || 8;
      setSelectedGame(numericGameId, result.player_id); // 자동 회원가입 - accountId에 player_id 저장
      
      console.log('✅ [Step 2 완료 - 자동 회원가입 (Overwatch)]', {
        gameId: selectedGame.id,
        numericGameId,
        accountId: result.player_id,
        battleTag: battleTag
      });

      // 모달 닫고 다음 페이지로
      setShowOverwatchModal(false);
      navigate("/gameinfo", {
        state: {
          gameId: selectedGame.id,
          mode: "auth",
          authKind: selectedGame.authKind,
          overwatchAccount: {
            player_id: result.player_id,
            name: result.name,
            battleTag: battleTag,
          }
        },
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : '계정 검증에 실패했습니다.');
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
    
    // Riot 계정 모달 관련
    showRiotModal,
    onCloseRiotModal: () => setShowRiotModal(false),
    handleRiotAccountVerified,
    
    // Overwatch 계정 모달 관련
    showOverwatchModal,
    onCloseOverwatchModal: () => setShowOverwatchModal(false),
    handleOverwatchAccountVerified,
  };
}
