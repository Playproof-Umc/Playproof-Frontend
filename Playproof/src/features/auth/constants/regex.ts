// src/features/auth/constants/regex.ts

//src/constants/regex.ts
export const NICKNAME_REGEX = /^[A-Za-z0-9가-힣]{1,5}$/;

export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export const PHONE_REGEX = /^010\d{8}$/;