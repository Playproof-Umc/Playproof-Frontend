// src/features/mypage/gameData/utils/overwatchHeros.ts

const OVERFAST_BASE = "https://overfast-api.tekrop.fr";

const HERO_NAME_KO: Record<string, string> = {
  ana: "아나",
  baptiste: "바티스트",
  kiriko: "키리코",
  lucio: "루시우",
  mercy: "메르시",
  "soldier-76": "솔저: 76",
  dva: "D.Va",
  zarya: "자리야",
  juno: "주노",
  wuyang: "우양",
};

function titleCaseWords(input: string) {
  return input
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function getOverwatchHeroDisplayName(heroKey: string): string {
  const key = heroKey.trim().toLowerCase();
  if (HERO_NAME_KO[key]) return HERO_NAME_KO[key];

  // fallback: slug -> Title Case
  const normalized = key.replace(/-/g, " ");
  return titleCaseWords(normalized);
}

/**
 * OverFast static 경로는 포맷이 바뀔 수 있어서 프론트에서 onError 폴백으로 대응한다.
 * 일단 가장 흔한 패턴을 1순위로 제공:
 * - /static/heroes/{hero}.{png|webp|jpg}
 */
export function getOverwatchHeroIconCandidates(heroKey: string): string[] {
  const key = heroKey.trim().toLowerCase();

  return [
    `${OVERFAST_BASE}/static/heroes/${key}.png`,
    `${OVERFAST_BASE}/static/heroes/${key}.webp`,
    `${OVERFAST_BASE}/static/heroes/${key}.jpg`,
    `${OVERFAST_BASE}/static/heroes/${key}.jpeg`,
  ];
}

export function formatPlaytimeSeconds(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);

  if (h <= 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export function formatNumberOrDash(v: number | null): string {
  if (v === null || !Number.isFinite(v)) return "-";
  return String(Math.round(v));
}

export function formatWinRatePercent(v: number | null): string {
  if (v === null || !Number.isFinite(v)) return "-";
  return `${v}%`;
}
