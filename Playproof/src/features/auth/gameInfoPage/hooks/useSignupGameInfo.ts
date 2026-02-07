// src/features/auth/gameInfoPage/hooks/useSignupGameInfo.ts

import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AUTH_STYLE_GAMES,
  GAME_LABEL,
  PLAY_STYLE_OPTIONS,
  getTierOptionsByGame,
  getPositionOptionsByGame,
} from "@/features/auth/gameInfoPage/mock/gameMeta";
import type { GameId } from "@/features/auth/gameInfoPage/types";

type LocationState = {
  gameId?: GameId;
};

export function useSignupGameInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;

  const gameId: GameId = state.gameId ?? "other";
  const selectedGameTitle = GAME_LABEL[gameId] ?? "기타";

  const isAuthStyleGame = AUTH_STYLE_GAMES.includes(gameId);

  // Layout A fields
  const [playStyle, setPlayStyle] = useState("");
  const [tier, setTier] = useState("");
  const [position, setPosition] = useState("");

  const playStyleOptions = PLAY_STYLE_OPTIONS;
  const tierOptions = useMemo(() => getTierOptionsByGame(gameId), [gameId]);
  const positionOptions = useMemo(() => getPositionOptionsByGame(gameId), [gameId]);

  // Layout B fields
  const [gameName, setGameName] = useState("");
  const [nickname, setNickname] = useState("");
  const [manualPlayStyle, setManualPlayStyle] = useState<"" | "실력 중심" | "매너 중심">("");

  const [isPending, setIsPending] = useState(false);

  // ✅ 추가: 제출 시도 여부 (에러 노출 트리거)
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => {
    const e: Record<string, string | undefined> = {};

    if (isAuthStyleGame) {
      if (!playStyle) e.playStyle = "플레이 스타일을 선택해 주세요.";
      if (!tier) e.tier = "티어를 선택해 주세요.";
      if (!position) e.position = "포지션을 선택해 주세요.";
    } else {
      if (gameName.trim().length === 0) e.gameName = "게임 이름을 입력해 주세요.";
      if (nickname.trim().length === 0) e.nickname = "닉네임을 입력해 주세요.";
      if (!manualPlayStyle) e.manualPlayStyle = "플레이 스타일을 선택해 주세요.";
    }

    return e as {
      playStyle?: string;
      tier?: string;
      position?: string;
      gameName?: string;
      nickname?: string;
      manualPlayStyle?: string;
    };
  }, [isAuthStyleGame, playStyle, tier, position, gameName, nickname, manualPlayStyle]);

  const canSubmit = useMemo(() => {
    if (isAuthStyleGame) {
      return !errors.playStyle && !errors.tier && !errors.position;
    }
    return !errors.gameName && !errors.nickname && !errors.manualPlayStyle;
  }, [isAuthStyleGame, errors]);

  // ✅ 에러 노출 여부: 제출 눌렀을 때만
  const showErrors = submitted;

  const onSubmit = async () => {
    // ✅ 제출 눌렀으면 에러 노출 시작
    setSubmitted(true);

    if (!canSubmit || isPending) return;

    setIsPending(true);
    try {
      // TODO(API 연동): 최종 회원가입 완료 요청
      navigate("/home", { replace: true, state: { signupCompleted: true }, });
    } finally {
      setIsPending(false);
    }
  };

  return {
    // common
    isPending,
    canSubmit,
    onSubmit,

    // errors
    errors,
    showErrors,

    // routing/game
    selectedGameTitle,
    isAuthStyleGame,

    // layout A
    playStyle,
    tier,
    position,
    playStyleOptions,
    tierOptions,
    positionOptions,
    onChangePlayStyle: setPlayStyle,
    onChangeTier: setTier,
    onChangePosition: setPosition,

    // layout B
    gameName,
    nickname,
    manualPlayStyle,
    onChangeGameName: setGameName,
    onChangeNickname: setNickname,
    onSelectManualPlayStyle: setManualPlayStyle,
  };
}