type Props = {
    pw: string;
    pw2: string;
    pwOk: boolean;
    pw2Ok: boolean;
    onPwChange: (v: string) => void;
    onPw2Change: (v: string) => void;
};

export const PasswordSection = ({
    pw,
    pw2,
    pwOk,
    pw2Ok,
    onPwChange,
    onPw2Change,
}: Props) => {
    return (
        <section>
            <div className="mb-3 ml-2 font-semibold text-base">비밀번호*</div>

            <div className="space-y-3">
                <div>
                    <input
                        type="password"
                        value={pw}
                        onChange={(e) => onPwChange(e.target.value)}
                        placeholder="영문&숫자 포함 8글자 이상"
                        className={[
                        "mt-3 w-full h-[48px] rounded-lg border px-4 text-xs outline-none bg-white",
                        pw.length > 0 && !pwOk ? "border-red-500" : "border-[#E5E5E5]",
                        ].join(" ")}
                    />
                    {pw.length > 0 && !pwOk && (
                        <div className="mt-1 text-xs text-red-500">
                        영문&숫자 포함 8글자 이상 입력해주세요.
                        </div>
                    )}
                    {pw.length > 0 && pwOk && (
                        <div className="mt-1 text-xs text-[#3B59FF]">
                        사용 가능한 비밀번호입니다.
                        </div>
                    )}
                </div>

                <div>
                    <input
                        type="password"
                        value={pw2}
                        onChange={(e) => onPw2Change(e.target.value)}
                        placeholder="비밀번호를 다시 입력해주세요."
                        className={[
                        "w-full h-[48px] rounded-lg border px-4 text-sm outline-none bg-white mb-3",
                        pw2.length > 0 && !pw2Ok ? "border-red-500" : "border-[#E5E5E5]",
                        ].join(" ")}
                    />
                    {pw2.length > 0 && !pw2Ok && (
                        <div className="mt-1 text-xs text-red-500">
                        비밀번호를 다시 확인해주세요.
                        </div>
                    )}
                    {pw2.length > 0 && pw2Ok && (
                        <div className="mt-1 text-xs text-[#3B59FF]">
                        비밀번호가 저장되었습니다.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};