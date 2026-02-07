// src/features/auth/signup/hooks/useSignup.ts

//src/features/auth/signup/hooks/useSignup.ts
import { useMutation } from "@tanstack/react-query";

export type SignupError = {
    code: "DUPLICATE" | "NETWORK";
    message: string;
};

type SignupPayload = {
	phone: string;
	password: string;
	nickname: string;
};

export const useSignup = () => {
	return useMutation<void, SignupError, SignupPayload>({
		mutationFn: async (payload) => {
			await new Promise((res) => setTimeout(res, 1000));

			if (payload.phone === "01000000000") {
				throw { code: "DUPLICATE", message: "duplicate account" };
			}

			return;
		},
	});
};