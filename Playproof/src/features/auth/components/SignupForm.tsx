import { useState } from 'react';
import { Input } from '@/components/landingPageComponents/Input';
import { Button } from '@/components/Button';

export const SignupForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        nickname: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: API 연동 로직 추가 (Axios)
        console.log('Signup Data:', formData);
        alert('회원가입 요청이 전송되었습니다.');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-md">
        <Input
            label="이메일"
            name="email"
            type="email"
            placeholder="example@playproof.com"
            value={formData.email}
            onChange={handleChange}
            required
        />
        
        <Input
            label="비밀번호"
            name="password"
            type="password"
            placeholder="8자 이상 입력해주세요"
            value={formData.password}
            onChange={handleChange}
            required
        />

        <Input
            label="비밀번호 확인"
            name="confirmPassword"
            type="password"
            placeholder="비밀번호를 한 번 더 입력해주세요"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={
            formData.confirmPassword && formData.password !== formData.confirmPassword
                ? '비밀번호가 일치하지 않습니다.'
                : ''
            }
        />

        <Input
            label="닉네임"
            name="nickname"
            type="text"
            placeholder="사용하실 닉네임을 입력해주세요"
            value={formData.nickname}
            onChange={handleChange}
            required
        />

        <Button type="submit" fullWidth className="mt-4">
            가입하기
        </Button>
        </form>
    );
};