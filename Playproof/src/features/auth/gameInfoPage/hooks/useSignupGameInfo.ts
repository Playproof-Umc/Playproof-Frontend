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
import { useSignupStore } from "@/store/signupStore";
import { useAuthStore } from "@/store/authStore";
import { signup } from "@/services/authApi";

type LocationState = {
  gameId?: GameId;
};

export function useSignupGameInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;
  const { setGameInfo, getFinalSignupData, clearSignupData, selectedGameId, accountId } = useSignupStore();
  const { setAuth } = useAuthStore();

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
      // Step 3: 게임 정보 저장
      const gameInfo = {
        gameId: selectedGameId || 8, // store에 저장된 숫자 ID 사용, 없으면 8(other)
        gameName: isAuthStyleGame ? selectedGameTitle : gameName,
        gameNickname: isAuthStyleGame ? "" : nickname,
        accountId: accountId, // store에 저장된 accountId (자동: puuid, 수동: "")
        playStyle: isAuthStyleGame ? playStyle : manualPlayStyle,
        positionId: isAuthStyleGame ? (parseInt(position) || 0) : 0,
        tierId: isAuthStyleGame ? (parseInt(tier) || 0) : 0,
      };
      
      setGameInfo(gameInfo);
      console.log('🎮 [Step 3 완료 - 게임 정보]', gameInfo);
      console.log(accountId ? '  ✅ 자동 회원가입 (계정 연동됨)' : '  📝 수동 회원가입');

      // 최종 데이터 조합
      const finalData = getFinalSignupData();
      
      if (!finalData) {
        alert('회원가입 정보가 비어있습니다. 처음부터 다시 시도해주세요.');
        navigate('/signup');
        return;
      }
      
      console.log('📤 [최종 회원가입 요청 데이터]', finalData);
      
      // 서버에 최종 데이터 전송
      const signupResult = await signup(finalData);
      
      console.log('✅ 회원가입 성공!', signupResult);
      
      // 회원가입 완료 후 authStore에 유저 정보 저장 (네비바에 표시용)
      // TODO: 실제로는 자동 로그인 또는 로그인 페이지로 이동해야 하지만,
      // 일단 회원가입 결과로 받은 정보를 저장
      setAuth({
        accessToken: '', // 회원가입 후 자동 로그인이 구현되면 토큰 저장
        userId: signupResult.id,
        nickname: signupResult.nickname,
      });
      
      // 회원가입 완료 후 store 초기화
      clearSignupData();
      
      navigate("/home", { 
        replace: true, 
        state: { signupCompleted: true } 
      });
    } catch (error) {
      console.error('❌ 회원가입 실패:', error);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
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