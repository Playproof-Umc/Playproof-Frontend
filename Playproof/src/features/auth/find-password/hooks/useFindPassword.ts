// src/features/auth/find-password/hooks/useFindPassword.ts

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword } from '@/services/authApi';

type Step = 'PHONE' | 'VERIFY' | 'NEW_PW' | 'COMPLETE';

export function useFindPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('PHONE');
  const [userData, setUserData] = useState({ phone: '', code: '', name: '' });
  const [isPending, setIsPending] = useState(false);

  const handlePhoneNext = (phone: string, name: string) => {
    setUserData(prev => ({ ...prev, phone, name }));
    setStep('VERIFY');
  };

  const handleVerifyNext = (code: string) => {
    setUserData(prev => ({ ...prev, code }));
    setStep('NEW_PW');
  };

  const handlePasswordSubmit = async (newPassword: string) => {
    if (isPending) return;

    setIsPending(true);
    try {
      await resetPassword({
        phone: userData.phone,
        code: userData.code,
        newPassword,
      });

      console.log('✅ 비밀번호 재설정 성공');
      setStep('COMPLETE');
    } catch (error) {
      console.error('❌ 비밀번호 재설정 실패:', error);
      alert('비밀번호 재설정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsPending(false);
    }
  };

  const handleComplete = () => {
    navigate('/login');
  };

  return {
    step,
    userData,
    isPending,
    handlePhoneNext,
    handleVerifyNext,
    handlePasswordSubmit,
    handleComplete,
  };
}
