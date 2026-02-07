// src/features/auth/gameInfoPage/components/SignupGameInfoForm.tsx

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/utils/cn";
import { useSignupGameInfo } from "@/features/auth/gameInfoPage/hooks/useSignupGameInfo";

export function SignupGameInfoForm() {
  const {
    isPending,
    canSubmit,
    onSubmit,

    selectedGameTitle,
    isAuthStyleGame,

    playStyle,
    tier,
    position,
    tierOptions,
    positionOptions,
    onChangePlayStyle,
    onChangeTier,
    onChangePosition,

    gameName,
    nickname,
    onChangeGameName,
    onChangeNickname,
    onSelectManualPlayStyle,

    errors,
    showErrors,
  } = useSignupGameInfo();


  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <p className="text-xl font-bold text-gray-900">
          정확한 매칭을 위해
          <br />
          게임 정보를 입력하거나 인증해주세요.
        </p>
        <p className="text-xs text-gray-500">
          프로필 생성에 사용할 게임 데이터를 직접 입력해주세요.
        </p>
      </div>

      {isAuthStyleGame ? (
        <div className="mx-auto w-full max-w-[520px] space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900">선택한 주 게임</p>
              <div className="flex h-12 w-full items-center justify-center rounded-lg border border-gray-200 bg-[#F3F3F3] px-4 text-sm text-gray-600">
                {selectedGameTitle}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900">플레이 스타일</p>
              <div className="flex w-full gap-4">
                <Button
                  type="button"
                  variant={playStyle === "실력 중심" ? "primary" : "outline"}
                  fullWidth
                  className={cn(
                    "h-12",
                    playStyle !== "실력 중심" &&
                      "border-[#1533B6] text-[#1533B6] hover:bg-[#1533B6] hover:text-white"
                  )}
                  onClick={() => onChangePlayStyle("실력 중심")}
                >
                  실력 중심
                </Button>
                <Button
                  type="button"
                  variant={playStyle === "매너 중심" ? "primary" : "outline"}
                  fullWidth
                  className={cn(
                    "h-12",
                    playStyle !== "매너 중심" &&
                      "border-[#1533B6] text-[#1533B6] hover:bg-[#1533B6] hover:text-white"
                  )}
                  onClick={() => onChangePlayStyle("매너 중심")}
                >
                  매너 중심
                </Button>
              </div>
              {showErrors && errors.playStyle ? (
                <p className="text-xs text-red-500">{errors.playStyle}</p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900">티어 선택</p>
              <select
                className={cn(
                  "h-12 w-full rounded-lg border bg-white px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20",
                  showErrors && errors.tier ? "border-red-400" : "border-gray-200"
                )}
                value={tier}
                onChange={(e) => onChangeTier(e.target.value)}
              >
                <option value="">티어</option>
                {tierOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {showErrors && errors.tier ? (
                <p className="text-xs text-red-500">{errors.tier}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900">주 포지션</p>
              <select
                className={cn(
                  "h-12 w-full rounded-lg border bg-white px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/20",
                  showErrors && errors.position ? "border-red-400" : "border-gray-200"
                )}
                value={position}
                onChange={(e) => onChangePosition(e.target.value)}
              >
                <option value="">포지션</option>
                {positionOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {showErrors && errors.position ? (
                <p className="text-xs text-red-500">{errors.position}</p>
              ) : null}
            </div>
          </div>

          {canSubmit ? (
            <div className="pt-2">
              <Button
                type="button"
                variant="primary"
                fullWidth
                className="h-12"
                disabled={isPending}
                onClick={onSubmit}
              >
                {isPending ? "가입 처리 중..." : "가입하기"}
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mx-auto w-full max-w-[520px] space-y-8">
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-900">게임 이름</p>
            <Input
              variant="light"
              placeholder="영문, 숫자 포함 8글자 이상"
              value={gameName}
              onChange={(e) => onChangeGameName(e.target.value)}
              error={showErrors ? errors.gameName : undefined}
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-900">게임 내 닉네임</p>
            <Input
              variant="light"
              placeholder="영문, 숫자 포함 12글자 이하"
              value={nickname}
              onChange={(e) => onChangeNickname(e.target.value)}
              error={showErrors ? errors.nickname : undefined}
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-900">플레이 스타일</p>

            <div className="flex w-full gap-4">
              <Button
                type="button"
                variant={playStyle === "실력 중심" ? "primary" : "outline"}
                fullWidth
                className={cn(
                  "h-12",
                  playStyle !== "실력 중심" &&
                    "border-[#1533B6] text-[#1533B6] hover:bg-[#1533B6] hover:text-white"
                )}
                onClick={() => onSelectManualPlayStyle("실력 중심")}
              >
                실력 중심
              </Button>

              <Button
                type="button"
                variant={playStyle === "매너 중심" ? "primary" : "outline"}
                fullWidth
                className={cn(
                  "h-12",
                  playStyle !== "매너 중심" &&
                    "border-[#1533B6] text-[#1533B6] hover:bg-[#1533B6] hover:text-white"
                )}
                onClick={() => onSelectManualPlayStyle("매너 중심")}
              >
                매너 중심
              </Button>
            </div>

            {showErrors && errors.manualPlayStyle ? (
              <p className="text-xs text-red-500">{errors.manualPlayStyle}</p>
            ) : null}
          </div>

          {canSubmit ? (
            <div className="pt-2">
              <Button
                type="button"
                variant="primary"
                fullWidth
                className="h-12"
                disabled={isPending}
                onClick={onSubmit}
              >
                {isPending ? "가입 처리 중..." : "가입하기"}
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
