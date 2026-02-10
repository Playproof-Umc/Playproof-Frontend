// src/features/auth/pages/SignupUsernamePageView.tsx

import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { StepDots } from "@/components/auth/StepDots";
import { Button } from "@/components/ui/Button";

type LocationState = {
  nextPath?: string;
  gameId?: string;
  mode?: "manual" | "auth";
};

export const SignupUsernamePageView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as LocationState;
  const [username, setUsername] = useState("");

  const nextPath = useMemo(() => state.nextPath ?? "/gameinfo", [state.nextPath]);
  const canSubmit = username.trim().length > 0;

  const onSubmit = () => {
    if (!canSubmit) return;
    navigate(nextPath, {
      state: {
        step: 3,
        gameId: state.gameId,
        mode: state.mode ?? "manual",
        accountName: username.trim(),
      },
    });
  };

  return (
    <AppLayout>
      <div className="flex h-full flex-col">
        <div className="mb-8 px-6 pt-8">
          <StepDots step={2} />
          <div className="mt-6">
            <h1 className="text-2xl font-bold text-zinc-900">
              계정 이름을 입력해주세요
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              이후 단계에서 사용할 계정 이름입니다.
            </p>
          </div>
        </div>

        <div className="flex-1 px-6">
          <label className="block text-sm font-semibold text-zinc-800">
            계정 이름
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="계정 이름을 입력해주세요."
            className="mt-2 h-12 w-full rounded-lg border border-zinc-200 px-4 text-sm outline-none focus:border-[#1533B6]"
          />
        </div>

        <div className="px-6 pb-10">
          <Button
            type="button"
            variant={canSubmit ? "primary" : "secondary"}
            disabled={!canSubmit}
            fullWidth
            className="h-12"
            onClick={onSubmit}
          >
            다음
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};
