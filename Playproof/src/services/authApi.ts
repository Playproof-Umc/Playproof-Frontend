import { api } from "@/services/api";

// ==================== Types ====================

export type SignupRequest = {
  nickname: string;
  password: string;
  phone: string;
  terms: Array<{
    id: number;
    agree: boolean;
  }>;
  gameInfo?: {
    gameId: number;
    gameName: string;
    gameNickname: string;
    accountId: string;
    playStyle: string;
    positionId: number;
    tierId: number;
  };
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
    refreshToken: string;
    userId: number;
    nickname: string;
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

export type NicknameDuplicateRequest = {
  nickname: string;
};

export type NicknameDuplicateResponse = {
  statusCode: number;
  data: {
    isDuplicate: boolean;
  };
  error: null | unknown;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type RefreshTokenResponse = {
  statusCode: number;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  error: null | unknown;
};

export type ResetPasswordRequest = {
  phone: string;
  code: string;
  newPassword: string;
};

export type ResetPasswordResponse = {
  statusCode: number;
  data: {
    status: string;
  };
  error: null | unknown;
};

export type VerifyNameRequest = {
  phone: string;
  name: string;
};

export type VerifyNameResponse = {
  statusCode: number;
  data: {
    isValid: boolean;
  };
  error: null | unknown;
};

// ==================== API Functions ====================

/**
 * 회원가입
 * POST /auth/signup
 */
export async function signup(body: SignupRequest): Promise<SignupResponse['data']> {
  // 전화번호에서 하이픈 제거
  const normalizedBody = {
    ...body,
    phone: body.phone.replace(/\D/g, "")
  };
  const res = await api.post<SignupResponse>("/auth/signup", normalizedBody);

  if (res.data.error || res.data.statusCode !== 201) {
    throw new Error('회원가입 처리 중 오류가 발생했습니다.');
  }

  return res.data.data;
}

/**
 * 로그인
 * POST /auth/login
 */
export async function login(body: LoginRequest): Promise<LoginResponse> {
  // 전화번호에서 하이픈 제거
  const normalizedBody = {
    ...body,
    phone: body.phone.replace(/\D/g, "")
  };
  const res = await api.post<LoginResponse>("/auth/login", normalizedBody);

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('로그인 처리 중 오류가 발생했습니다.');
  }

  return res.data;
}

/**
 * 인증번호 발송
 * POST /auth/phone/send-certification
 * 
 * ⚠️ 경고: 이 API는 SMS 발송 비용이 발생합니다.
 */
export async function sendPhoneCertification(body: SendCertificationRequest): Promise<SendCertificationResponse['data']> {
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
 * 개발 환경에서는 항상 123456을 사용합니다.
 */
export function sendPhoneCertificationMock(phone: string): Promise<{ status: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockCode = "123456";
      console.log(`📱 [Mock SMS] ${phone}로 인증번호가 발송되었습니다: ${mockCode}`);
      console.log('💡 개발용 테스트 코드는 123456 입니다.');
      resolve({ status: 'OK' });
    }, 1000);
  });
}

/**
 * 닉네임 중복 확인
 * POST /auth/nickname/validate-duplicate
 */
export async function checkNicknameDuplicate(nickname: string): Promise<boolean> {
  try {
    const res = await api.post<NicknameDuplicateResponse>("/auth/nickname/validate-duplicate", {
      nickname
    });

    if (res.data.statusCode !== 200) {
      throw new Error('닉네임 중복 확인 처리 중 오류가 발생했습니다.');
    }

    // isDuplicate: true면 중복, false면 사용 가능
    // 반환값: true면 사용 가능, false면 중복
    return !res.data.data.isDuplicate;
  } catch (error) {
    console.error('닉네임 중복 확인 실패:', error);
    throw new Error('닉네임 중복 확인 중 오류가 발생했습니다.');
  }
}

/**
 * 🧪 개발용 Mock 닉네임 중복 확인
 */
export function checkNicknameDuplicateMock(nickname: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // "레나", "테스트", "관리자"는 중복으로 처리
      const duplicates = ["레나", "테스트", "관리자", "admin", "test"];
      const available = !duplicates.includes(nickname.toLowerCase());
      console.log(`🔍 [Mock] 닉네임 "${nickname}" 중복 확인: ${available ? '사용가능' : '중복됨'}`);
      resolve(available);
    }, 700);
  });
}

/**
 * 토큰 리프레시
 * POST /auth/refresh
 * 
 * @param refreshToken - 기존 리프레시 토큰
 * @returns 새로운 액세스 토큰과 리프레시 토큰
 */
export async function refreshToken(refreshToken: string): Promise<RefreshTokenResponse['data']> {
  try {
    const res = await api.post<RefreshTokenResponse>("/auth/refresh", {
      refreshToken
    });

    if (res.data.error || res.data.statusCode !== 200) {
      throw new Error('토큰 갱신 처리 중 오류가 발생했습니다.');
    }

    return res.data.data;
  } catch (error) {
    console.error('토큰 리프레시 실패:', error);
    throw new Error('토큰 갱신에 실패했습니다. 다시 로그인해주세요.');
  }
}

/**
 * 비밀번호 재설정 - 이름 확인
 * POST /auth/password/verify-name
 * 
 * @param phone - 전화번호
 * @param name - 이름
 * @returns 유효한 계정인지 확인
 */
export async function verifyName(body: VerifyNameRequest): Promise<boolean> {
  try {
    const res = await api.post<VerifyNameResponse>("/auth/password/verify-name", body);

    if (res.data.statusCode !== 200) {
      throw new Error('등록되지 않은 계정입니다.');
    }

    return res.data.data.isValid;
  } catch (error) {
    console.error('이름 확인 실패:', error);
    
    const axiosError = error as { response?: { status?: number } };
    if (axiosError?.response?.status === 404) {
      throw new Error('등록되지 않은 계정입니다.');
    }
    
    throw new Error('이름 확인 중 오류가 발생했습니다.');
  }
}

/**
 * 비밀번호 재설정
 * POST /auth/password/reset
 * 
 * @param phone - 전화번호
 * @param code - 인증번호
 * @param newPassword - 새 비밀번호
 * @returns 재설정 성공 여부
 */
export async function resetPassword(body: ResetPasswordRequest): Promise<ResetPasswordResponse['data']> {
  try {
    const res = await api.post<ResetPasswordResponse>("/auth/password/reset", body);

    if (res.data.error || res.data.statusCode !== 200) {
      throw new Error('비밀번호 재설정 처리 중 오류가 발생했습니다.');
    }

    return res.data.data;
  } catch (error) {
    console.error('비밀번호 재설정 실패:', error);
    throw new Error('비밀번호 재설정에 실패했습니다. 다시 시도해주세요.');
  }
}

// ==================== Game Account Verification ====================

export type RiotAccountResponse = {
  puuid: string;
  gameName: string;
  tagLine: string;
};

export type OverwatchAccountResponse = {
  player_id: string;
  name: string;
  battleTag: string;
};

/**
 * Riot 계정 검증
 * GET /api/riot/account?gameName={gameName}&tagLine={tagLine}
 * 
 * @param gameName - 게임 이름 (예: 비둘기깃털)
 * @param tagLine - 태그 라인 (예: KR1)
 * @returns puuid (고유 계정 ID), gameName, tagLine
 */
export async function verifyRiotAccount(gameName: string, tagLine: string): Promise<RiotAccountResponse> {
  try {
    const res = await fetch(`/api/riot/account?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('❌ [Riot] API 에러:', res.status, errorData);
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    
    if (!data.puuid) {
      throw new Error('계정 정보를 찾을 수 없습니다.');
    }

    console.log(`✅ [Riot] 계정 검증 성공: ${gameName}#${tagLine} (puuid: ${data.puuid})`);
    return data;
  } catch (error) {
    console.error('❌ [Riot] 계정 검증 실패:', error);
    throw new Error('해당 Riot 계정을 찾을 수 없습니다. 게임명과 태그를 확인해주세요.');
  }
}

/**
 * Overwatch 계정 검증
 * GET /api/overwatch/summary?battleTag={battleTag}
 * 
 * @param battleTag - BattleTag (예: PlayerName#1234 또는 PlayerName-1234)
 * @returns player_id (고유 계정 ID), name, battleTag
 */
export async function verifyOverwatchAccount(battleTag: string): Promise<OverwatchAccountResponse> {
  try {
    const res = await fetch(`/api/overwatch/summary?battleTag=${encodeURIComponent(battleTag)}`);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('❌ [Overwatch] API 에러:', res.status, errorData);
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    
    if (!data.player_id) {
      throw new Error('계정 정보를 찾을 수 없습니다.');
    }

    console.log(`✅ [Overwatch] 계정 검증 성공: ${battleTag} (player_id: ${data.player_id})`);
    return {
      player_id: data.player_id,
      name: data.name || battleTag,
      battleTag: battleTag,
    };
  } catch (error) {
    console.error('❌ [Overwatch] 계정 검증 실패:', error);
    throw new Error('해당 Overwatch 계정을 찾을 수 없습니다. BattleTag를 확인해주세요.');
  }
}
