// src/services/axios.ts

// fileName: axios.ts
import axios from "axios";

// 공통: 캐시 끄기 (개발 중 디버깅 및 실시간 갱신을 위해)
const noCacheHeaders = {
  "Cache-Control": "no-store",
  Pragma: "no-cache",
  Expires: "0",
};

// 환경변수 기반 API 루트. 예: "https://myfit.my" 또는 빈 문자열(로컬 프록시 사용)
const API_BASE_RAW = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";
const API_BASE = API_BASE_RAW.replace(/\/$/, "");
const API_PREFIX = API_BASE ? `${API_BASE}/api` : "/api";

// ✅ 기본 공용 클라이언트 (default export로 사용)
export const appClient = axios.create({
  baseURL: API_BASE || "",
  headers: noCacheHeaders,
});

// 1. Riot 한국 서버
export const riotKrClient = axios.create({
  baseURL: "/api/riot",
  headers: noCacheHeaders,
});

// 2. Riot 아시아 서버
export const riotAsiaClient = axios.create({
  baseURL: "/api/riot-asia",
  headers: noCacheHeaders,
});

// 3. Nexon 클라이언트
export const nexonClient = axios.create({
  baseURL: "/api/nexon",
  headers: {
    "x-nxopen-api-key": import.meta.env.VITE_NEXON_API_KEY,
    ...noCacheHeaders,
  },
});

// 4. Steam 클라이언트
export const steamClient = axios.create({
  baseURL: "/api/steam",
  headers: noCacheHeaders,
});

// 5. Overwatch 클라이언트
export const overwatchClient = axios.create({
  baseURL: "/api/overwatch",
  headers: noCacheHeaders,
});

// Valorant 클라이언트
export const valorantClient = axios.create({
  baseURL: "/api/valorant",
  headers: noCacheHeaders,
});

// ✅ default export 제공 (기존 코드 영향 최소화)
export default appClient;
