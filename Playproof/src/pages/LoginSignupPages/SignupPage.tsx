import { SignupForm } from '@/features/auth/components/SignupForm';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
        <div className="w-full max-w-md">
            {/* 뒤로가기 버튼 등 헤더 영역 */}
            <button 
            onClick={() => navigate(-1)} 
            className="text-gray-400 hover:text-white mb-8 text-sm flex items-center gap-1 cursor-pointer"
            >
            &lt; 뒤로가기
            </button>

            <h2 className="text-3xl font-bold text-white mb-2">회원가입</h2>
            <p className="text-gray-400 mb-8">PlayProof와 함께 신뢰받는 팀원이 되어보세요.</p>
            
            <SignupForm />
        </div>
        </div>
    );
};

export default SignupPage;