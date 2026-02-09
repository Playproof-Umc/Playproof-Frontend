import { api } from "@/services/api";

// ==================== Types ====================

export type SignupRequest = {
  nickname: string;
  password: string;
  phone: string;
};

export type SignupResponse = {
  statusCode: number;
  data: {
    id: number;
    phone: string;
    nickname: string;
  };
  error: null | unknown;
};

export type LoginRequest = {
  phone: string;
  password: string;
};

export type LoginResponse = {
  statusCode: number;
  data: {
    accessToken: string;
  };
  error: null | unknown;
};

export type SendCertificationRequest = {
  phone: string;
};

export type SendCertificationResponse = {
  statusCode: number;
  data: {
    status: string;
  };
  error: null | unknown;
};

export type ValidatePhoneRequest = {
  phone: string;
  code: string;
};

export type ValidatePhoneResponse = {
  statusCode: number;
  data: {
    status: string;
  };
  error: null | unknown;
};

// ==================== API Functions ====================

/**
 * 회원가입
 * POST /auth/signup
 */
export async function signup(body: SignupRequest): Promise<SignupResponse['data']> {
  const res = await api.post<SignupResponse>("/auth/signup", body);

  if (res.data.error || res.data.statusCode !== 201) {
    throw new Error('회원가입 처리 중 오류가 발생했습니다.');
  }

  return res.data.data;
}

/**
 * 로그인
 * POST /auth/login
 */
export async function login(body: LoginRequest): Promise<LoginResponse['data']> {
  const res = await api.post<LoginResponse>("/auth/login", body);

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('로그인 처리 중 오류가 발생했습니다.');
  }

  return res.data.data;
}

/**
 * 📵 인증번호 발송 (개발 중 사용 불가 - 유료 서비스)
 * POST /auth/phone/send-certification
 * 
 * ⚠️ 경고: 이 API는 SMS 발송 비용이 발생합니다.
 * 개발 환경에서는 사용하지 마세요!
 */
export async function sendPhoneCertification(body: SendCertificationRequest): Promise<SendCertificationResponse['data']> {
  // 개발 환경에서 실수로 호출되는 것을 방지 (Vite 환경)
  if (import.meta.env.DEV) {
    console.error('⚠️ [개발 환경] SMS 인증 API 호출이 차단되었습니다. (유료 서비스)');
    throw new Error('개발 환경에서는 SMS 인증을 사용할 수 없습니다.');
  }

  const res = await api.post<SendCertificationResponse>("/auth/phone/send-certification", body);

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('인증번호 발송 중 오류가 발생했습니다.');
  }

  return res.data.data;
}

/**
 * 인증번호 검증
 * POST /auth/phone/validate
 */
export async function validatePhone(body: ValidatePhoneRequest): Promise<ValidatePhoneResponse['data']> {
  const res = await api.post<ValidatePhoneResponse>("/auth/phone/validate", body);

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('인증번호 검증 중 오류가 발생했습니다.');
  }

  return res.data.data;
}

/**
 * 🧪 개발용 Mock 인증번호 발송 (SMS 비용 없음)
 * 실제 SMS를 발송하지 않고 콘솔에만 출력합니다.
 */
export function sendPhoneCertificationMock(phone: string): Promise<{ status: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`📱 [Mock SMS] ${phone}로 인증번호가 발송되었습니다: ${mockCode}`);
      resolve({ status: 'OK' });
    }, 1000);
  });
}
