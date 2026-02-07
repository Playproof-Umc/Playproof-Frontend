// src/features/auth/signup/components/SignupCompleteModal.tsx


interface SignupCompleteModalProps {
  isOpen: boolean;
  nickname?: string;
}

export const SignupCompleteModal = ({ isOpen, nickname }: SignupCompleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-sm mx-6 transform overflow-hidden rounded-2xl bg-white p-8 text-center shadow-xl transition-all animate-in zoom-in-95 duration-300">
        
        {/* 아이콘 영역 */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
          <span className="text-3xl" role="img" aria-label="celebration">🎉</span>
        </div>

        <h2 className="mb-2 text-2xl font-bold text-zinc-900">
          환영합니다{nickname ? `, ${nickname}님!` : "!"}
        </h2>
        
        <p className="mb-6 text-zinc-600 leading-relaxed">
          PlayProof의 멤버가 되신 것을 축하드려요.<br />
          이제 팀원들을 만나러 가볼까요?
        </p>

        {/* 하단 안내 문구 */}
        <div className="rounded-xl bg-zinc-50 py-3 px-4">
          <p className="text-sm text-zinc-500">
            <span className="font-bold text-blue-600">5초 뒤</span> 자동으로 닫힙니다...
          </p>
        </div>
      </div>
    </div>
  );
};
