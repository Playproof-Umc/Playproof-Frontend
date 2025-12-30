import { Link } from "react-router-dom";
import { Button } from "@/components/Button";
import { OnboardingPlaceholder } from "@/components/landingPageComponents/OnboardingPlaceholder";
import { OnboardingIndicator } from "@/components/landingPageComponents/OnboardingIndicator";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white text-black">
        {/* 헤더 영역 <header /> */}
            <main className="mx-auto flex min-h-screen max-w-[980px] flex-col items-center justify-center px-6">
                {/* 온보딩 영역 */}
                <div className="w-full max-w-[680px]">
                    <OnboardingPlaceholder />
                    <div className="mt-4 flex items-center justify-center">
                        {/* 상태전환만 가능, total값 수정 */}
                        <OnboardingIndicator total={3} initialActive={0} />
                    </div>
                </div>

                {/* CTA 영역 */}
                <div className="mt-16 flex w-full flex-col items-center justify-center">
                    <Link to="/signup" className="w-full max-w-[420px]">
                        <Button variant="primary" fullWidth>
                            시작하기
                        </Button>
                    </Link>

                    <Link
                        to="/login"
                        className="mt-4 text-center text-sm text-[#9aa0a6] underline underline-offset-4 hover:text-[#6b7280]"
                        >
                        기존 계정으로 로그인
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default LandingPage;