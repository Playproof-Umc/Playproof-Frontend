// src/utils/cn.ts

export type ClassValue =
  | string
  | number
  | bigint
  | false
  | null
  | undefined;

/**
 * Tailwind / className 유틸
 * - 조건부 클래스 안전 처리
 * - ReactNode 조건식(leftIcon && "gap-2")에서 발생하는 0, "", 0n 등 타입 이슈 방지
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}