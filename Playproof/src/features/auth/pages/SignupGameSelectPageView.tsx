// src/features/auth/pages/SignupGameSelectPageView.tsx

import { AppLayout } from "@/components/layout/AppLayout";
import { StepDots } from "@/components/auth/StepDots";
import { SignupGameSelectForm } from "@/features/auth/gameSelectPage/components/SignupGameSelectForm";
import { RiotAccountModal } from "@/features/auth/gameSelectPage/components/RiotAccountModal";
import { OverwatchAccountModal } from "@/features/auth/gameSelectPage/components/OverwatchAccountModal";
import { useSignupGameSelect } from "@/features/auth/gameSelectPage/hooks/useSignupGameSelect";

export const SignupGameSelectPageView = () => {
  const {
    games,
    selectedGame,
    isPending,
    hasAuthCta,
    authCtaLabel,
    authCtaClassName,
    onSelectGame,
    onClickManual,
    onClickAuth,
    showRiotModal,
    onCloseRiotModal,
    handleRiotAccountVerified,
    showOverwatchModal,
    onCloseOverwatchModal,
    handleOverwatchAccountVerified,
  } = useSignupGameSelect();

  return (
    <AppLayout>
      <div className="flex h-full flex-col">
        <div className="mb-8 px-6 pt-8">
          {/* [수정] currentStep={3} -> step={3} */}
          <StepDots step={2} />
          <div className="mt-6">
            <h1 className="text-2xl font-bold text-zinc-900">
              플레이하는 게임을<br />
              선택해주세요
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              선택한 게임을 기반으로 팀원을 추천해드려요.
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-24 custom-scrollbar">
          <SignupGameSelectForm
            games={games}
            selectedGame={selectedGame}
            isPending={isPending}
            hasAuthCta={hasAuthCta}
            authCtaLabel={authCtaLabel}
            authCtaClassName={authCtaClassName}
            onSelectGame={onSelectGame}
            onClickManual={onClickManual}
            onClickAuth={onClickAuth}
          />
        </div>
      </div>

      {/* Riot 계정 인증 모달 */}
      <RiotAccountModal
        isOpen={showRiotModal}
        onClose={onCloseRiotModal}
        onVerified={handleRiotAccountVerified}
        isPending={isPending}
      />

      {/* Overwatch 계정 인증 모달 */}
      <OverwatchAccountModal
        isOpen={showOverwatchModal}
        onClose={onCloseOverwatchModal}
        onVerified={handleOverwatchAccountVerified}
        isPending={isPending}
      />
    </AppLayout>
  );
};
