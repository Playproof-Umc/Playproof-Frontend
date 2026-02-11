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
  gameInfo: {
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
export async function login(body: LoginRequest): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>("/auth/login", body);

  if (res.data.error || res.data.statusCode !== 200) {
    throw new Error('로그인 처리 중 오류가 발생했습니다.');
  }

  return res.data;
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
 * GET /auth/nickname/check?nickname={nickname}
 */
export async function checkNicknameDuplicate(nickname: string): Promise<boolean> {
  try {
    const res = await api.get(`/auth/nickname/check`, {
      params: { nickname }
    });

    // 사용 가능하면 true, 중복이면 false 반환
    return res.data.data?.available ?? false;
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
