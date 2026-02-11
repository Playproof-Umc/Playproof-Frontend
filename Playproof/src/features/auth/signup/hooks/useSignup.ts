// src/features/auth/signup/hooks/useSignup.ts

import { useMutation } from "@tanstack/react-query";
import { signup, type SignupRequest } from "@/services/authApi";
import axios from "axios";

export type SignupError = {
    code: "DUPLICATE" | "NETWORK" | "VALIDATION_FAILED" | "UNKNOWN";
    message: string;
};

type SignupPayload = {
	phone: string;
	password: string;
	nickname: string;
};

type ApiErrorResponse = {
  error?: {
    code?: string;
    message?: string;
    errors?: Array<{ field?: string; reason?: string }>;
  };
};

export const useSignup = () => {
	return useMutation<{ id: number; phone: string; nickname: string }, SignupError, SignupPayload>({
		mutationFn: async (payload) => {
			const body: SignupRequest = {
				phone: payload.phone,
				password: payload.password,
				nickname: payload.nickname,
			};

			try {
				const result = await signup(body);
				return result;
			} catch (err) {
				if (axios.isAxiosError<ApiErrorResponse>(err)) {
					const status = err.response?.status;
					const code = err.response?.data?.error?.code;

					console.error("회원가입 오류:", {
						status,
						code,
						message: err.response?.data?.error?.message,
					});

					// 중복 계정 처리
					if (status === 409 || code === "DUPLICATE_PHONE" || code === "DUPLICATE_NICKNAME") {
						throw { code: "DUPLICATE", message: err.response?.data?.error?.message || "이미 등록된 정보입니다." } as SignupError;
					}

					// 유효성 검사 실패
					if (status === 400 && code === "VALIDATION_FAILED") {
						throw { code: "VALIDATION_FAILED", message: err.response?.data?.error?.message || "입력값을 확인해주세요." } as SignupError;
					}

					// 기타 오류
					throw { code: "NETWORK", message: "일시적인 오류가 발생했습니다. 다시 시도해주세요." } as SignupError;
				}

				throw { code: "UNKNOWN", message: "알 수 없는 오류가 발생했습니다." } as SignupError;
			}
		},
	});
};
