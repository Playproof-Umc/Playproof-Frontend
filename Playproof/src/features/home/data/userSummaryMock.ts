// src/features/home/data/userSummaryMock.ts

export type UserStat = {
  label: string;
  value: string | number;
};

export type UserSummary = {
  name: string;
  avatarUrl?: string;
  chips: string[];
  stats: UserStat[];
};

/**
 * 나중에 실제 API로 대체할 자리.
 * 지금은 네트워크 호출처럼 보이도록 Promise + 지연을 둠.
 */
export function fetchUserSummaryMock(delayMs = 350): Promise<UserSummary> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: "레나",
        avatarUrl: undefined, // 나중에 프로필 이미지 URL 들어오면 여기에
        chips: ["파티 찾기", "소울 밸런", "실력중심", "즐겜 유저"],
        stats: [
          { label: "긍정 피드백", value: "99%" },
          { label: "응답률", value: "98%" },
          { label: "매칭횟수", value: 142 },
        ],
      });
    }, delayMs);
  });
}
