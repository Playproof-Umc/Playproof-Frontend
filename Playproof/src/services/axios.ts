// src/services/axios.ts

// fileName: axios.ts
import axios from "axios";

// 공통: 캐시 끄기 (개발 중 디버깅 및 실시간 갱신을 위해)
const noCacheHeaders = {
  "Cache-Control": "no-store",
  Pragma: "no-cache",
  Expires: "0",
};

// ✅ 기본 공용 클라이언트 (default export로 사용)
export const appClient = axios.create({
  baseURL: "",
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

// ✅ default export 제공 (기존 코드 영향 최소화)
export default appClient;
