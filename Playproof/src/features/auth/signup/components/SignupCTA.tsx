// src/features/auth/signup/components/SignupCTA.tsx

//src/features/auth/signup/components/SignupCTA.tsx
import { Button } from "@/components/ui/Button";

type Props = {
    disabled: boolean;
    loading?: boolean;
    onSubmit: () => void;
};

export const SignupCTA = ({ disabled, loading, onSubmit }: Props) => {
    const canSubmit = !disabled && !loading;
    return (
        <section className="flex justify-center text-lg">
            <Button
                type="button"
                variant={canSubmit ? "primary" : "secondary"}
                fullWidth
                disabled={disabled || !!loading}
                onClick={onSubmit}
                className="max-w-[520px] h-[54px] rounded-full text-white"
            >
                {loading ? "처리 중..." : "가입하기"}
            </Button>
        </section>
    );
};