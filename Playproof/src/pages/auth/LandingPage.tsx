import { Link } from "react-router-dom";
import { Button } from "@/components/Button";
import { OnboardingPlaceholder } from "@/components/ui/OnboardingPlaceholder";
import { OnboardingIndicator } from "@/components/ui/OnboardingIndicator";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white text-black">
        {/* 헤더 영역 <header /> */}
            <main className="mx-auto flex min-h-screen max-w-[1280px] flex-col items-center justify-center px-6">
                {/* 온보딩 영역 */}
                <div className="w-full max-w-[1232px]">
                    <div className="relative">
                        <OnboardingPlaceholder />
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                            {/* 상태전환만 가능, total값 수정 */}
                            <OnboardingIndicator total={3} initialActive={0} />
                        </div>
                    </div>
                </div>

                {/* CTA 영역 */}
                <div className="mt-16 flex w-full flex-col items-center justify-center">
                    <Link to="/signup" className="w-full max-w-[604px]">
                        <Button variant="primary" fullWidth>
                            시작하기
                        </Button>
                    </Link>

                </div>
            </main>
        </div>
    );
};

export default LandingPage;