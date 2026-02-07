// src/features/auth/signup/hooks/useSignupCompleteModal.ts

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { AppLocationState } from "@/features/auth/gameInfoPage/router";

/**
 * 회원가입 완료 모달 훅
 * 요구사항:
 * - 회원가입 성공 후 원래 가려던 화면(or /home)으로 이동했을 때 모달 1회 노출
 * - 배경 블러/암막 없이 모달만 표시
 * - 바깥 클릭 시 닫힘
 * - state는 replace로 제거하여 재등장 방지
 *
 * ESLint(react-hooks/set-state-in-effect) 대응:
 * - effect 안에서 setState 금지
 * - open/username은 "초기 렌더에서만" location.state로 초기화
 * - effect는 navigate(replace)로 state 제거만 수행
 */
export function useSignupCompleteModal() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = (location.state ?? null) as AppLocationState | null;

  // ✅ effect에서 setState를 하지 않기 위해, 초기값에서만 state를 읽어 open을 결정
  const [open, setOpen] = useState<boolean>(() => Boolean(state?.signupCompleted));

  // ✅ state 제거 후에도 문구를 유지하려고 username도 초기값으로 캐싱
  const [username] = useState<string | undefined>(() => state?.signupUsername);

  // ✅ state 제거(재등장 방지): 외부 시스템 동기화만 수행 (setState 없음)
  useEffect(() => {
    if (!state?.signupCompleted) return;

    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, [state?.signupCompleted, navigate, location.pathname]);

  const close = () => {
    setOpen(false);
  };

  return { open, username, close };
}