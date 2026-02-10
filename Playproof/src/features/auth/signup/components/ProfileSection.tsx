// src/features/auth/signup/components/ProfileSection.tsx

//src/features/auth/signup/components/ProfileSection.tsx
import { Button } from "@/components/ui/Button";

type NicknameProps = {
    nickname: string;
    nickTouched: boolean;
    nickOk: boolean;
    nickCheckState: "idle" | "checking" | "ok" | "dup" | "invalid";
    onNicknameBlur: () => void;
    onNicknameChange: (v: string) => void;
    onCheckNickname: () => void;
};

type Props = {
    nicknameProps: NicknameProps;
    avatarIdx: number | null;
    onSelectAvatar: (idx: number) => void;
};

export const ProfileSection = ({ nicknameProps, avatarIdx, onSelectAvatar }: Props) => {
    const {
        nickname,
        nickTouched,
        nickOk,
        nickCheckState,
        onNicknameBlur,
        onNicknameChange,
        onCheckNickname,
    } = nicknameProps;

    const canCheck = nickname.length > 0 && nickOk && nickCheckState !== "checking";

    return (
        <section>
            <div className="mb-10 text-center text-2xl font-bold">프로필 설정</div>

            {/* 닉네임 */}
            <div className="mb-6">
                <div className="mb-6 ml-2 font-semibold text-base">닉네임</div>

                <div className="mb-16 grid grid-cols-[1fr_100px] gap-1.5 items-start">
                    <div>
                        <input
                            value={nickname}
                            onBlur={onNicknameBlur}
                            onChange={(e) => onNicknameChange(e.target.value)}
                            placeholder="닉네임을 입력해주세요."
                            className={[
                                "w-full h-[48px] rounded-lg border px-4 text-xs outline-none bg-white",
                                nickTouched && nickname.length > 0 && !nickOk ? "border-red-500" : "border-[#E5E5E5]",
                            ].join(" ")}
                        />

                        {nickname.length > 0 && nickCheckState === "invalid" && (
                            <div className="mt-1 text-xs text-red-500">허용되지 않는 표현입니다.</div>
                        )}
                        {nickname.length > 0 && nickCheckState === "dup" && (
                            <div className="mt-1 text-xs text-red-500">중복된 이름입니다.</div>
                        )}
                        {nickname.length > 0 && nickCheckState === "ok" && (
                            <div className="mt-1 text-xs text-[#1533B6]">사용 가능한 이름입니다.</div>
                        )}
                    </div>

                    <Button
                        type="button"
                        variant={canCheck ? "primary" : "secondary"}
                        disabled={!canCheck}
                        onClick={onCheckNickname}
                        className="h-[48px] rounded-lg font-semibold text-xs whitespace-nowrap"
                    >
                        {nickCheckState === "checking" ? "확인중..." : "중복 확인"}
                    </Button>
                </div>
            </div>

            {/* 아바타 */}
            <div>
                <div className="mb-6 ml-2 font-semibold text-base">아바타 선택하기</div>
                <div className="mb-16 grid grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => {
                        const selected = avatarIdx === i;
                        return (
                            <button
                                key={i}
                                type="button"
                                onClick={() => onSelectAvatar(i)}
                                aria-label={`avatar-${i + 1}`}
                                aria-pressed={selected}
                                className={[
                                    "aspect-square w-full rounded-lg bg-[#F3F3F3]",
                                    selected ? "ring-2 ring-[#1533B6]" : "ring-1 ring-transparent",
                                    "transition hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1533B6]",
                                ].join(" ")}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
