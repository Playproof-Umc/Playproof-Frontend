// src/features/auth/signup/hooks/useSignup.ts

import { useMutation } from "@tanstack/react-query";
import { signup, type SignupRequest } from "@/services/authApi";
import type { AxiosError } from "axios";

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
			try {
				const body: SignupRequest = {
					phone: payload.phone,
					password: payload.password,
					nickname: payload.nickname,
					terms: [],
					gameInfo: {
						gameId: 0,
						gameName: "",
						gameNickname: "",
						accountId: "",
						playStyle: "",
						positionId: 0,
						tierId: 0,
					},
				};

				const result = await signup(body);
				return result;
			} catch (err) {
				const axiosErr = err as AxiosError<ApiErrorResponse>;
				const status = axiosErr.response?.status;
				const code = axiosErr.response?.data?.error?.code;

				console.error('회원가입 오류:', { status, code, message: axiosErr.response?.data?.error?.message });

				if (status === 409 || code === "DUPLICATE_PHONE" || code === "DUPLICATE_NICKNAME") {
					throw { code: "DUPLICATE", message: axiosErr.response?.data?.error?.message || "이미 등록된 정보입니다." } as SignupError;
				}

				if (status === 400 && code === "VALIDATION_FAILED") {
					throw { code: "VALIDATION_FAILED", message: axiosErr.response?.data?.error?.message || "입력값을 확인해주세요." } as SignupError;
				}

				throw { code: "NETWORK", message: "일시적인 오류가 발생했습니다. 다시 시도해주세요." } as SignupError;
			}
		},
		onError: (error: SignupError) => {
			// 이미 mutationFn에서 SignupError로 변환되어 전달됩니다.
			console.error('회원가입 실패:', error);
		},
	});
};