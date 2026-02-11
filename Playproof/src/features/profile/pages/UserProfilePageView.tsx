// src/features/profile/pages/UserProfilePageView.tsx

import React from "react";
import { useParams } from "react-router-dom";
import { getUserProfileById, type UserProfile } from "@/services/userApi";
import type { MyProfileData } from "@/features/mypage/types";
import { ProfileCard, ProfileHeader } from "@/features/mypage/components";
import { ProfileDetail } from "@/features/mypage/components/profile/ProfileDetail";

const mapToMyProfileData = (data: UserProfile): MyProfileData => {
  const feedbackTags = data.feedbackTags?.map((t) => t.type) ?? [];
  const preferredTags = (data.preferredCategoryIds ?? []).map((id) => `TAG_${id}`);
  const playStyles = data.playStyle ? [data.playStyle] : [];

  return {
    userId: String(data.id),
    nickname: data.nickname,
    rank: data.tsRank ?? 0,
    profileImage: data.profileImageUrl ?? undefined,
    bio: data.statusMessage ?? "",
    tier: "BRONZE",
    tierScore: data.trustScore ?? 0,
    ranking: { rank: data.tsRank ?? 0, percentile: 0 },
    temperScore: data.trustScore ?? 0,
    positivityRating: data.positivePercentage ?? 0,
    playStyles,
    preferredTags,
    feedbackTags,
    gameAccounts: (data.verifiedAccounts ?? []).map((acc) => ({
      game: `Game ${acc.gameId}`,
      nickname: acc.accountId,
      tag: "",
    })),
    gameStats: [],
    favoriteGames: (data.favoriteGameIds ?? []).map((id, idx) => ({
      rank: idx + 1,
      game: `Game ${id}`,
    })),
  };
};

export const UserProfilePageView = () => {
  const { userId } = useParams();
  const [profile, setProfile] = React.useState<MyProfileData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const idNum = Number(userId);
    if (!idNum) {
      setError("유효하지 않은 사용자입니다.");
      return;
    }

    let alive = true;
    (async () => {
      try {
        const data = await getUserProfileById(idNum);
        if (!alive) return;
        setProfile(mapToMyProfileData(data));
      } catch (err) {
        if (!alive) return;
        setError(err instanceof Error ? err.message : "사용자 정보를 불러오지 못했습니다.");
      }
    })();

    return () => {
      alive = false;
    };
  }, [userId]);

  if (error) {
    return <div className="p-6 text-sm text-gray-600">{error}</div>;
  }

  if (!profile) {
    return <div className="p-6 text-sm text-gray-600">프로필 불러오는 중...</div>;
  }

  return (
    <main className="w-full min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ProfileCard profileData={profile} />
          <div className="lg:col-span-2">
            <ProfileHeader profileData={profile} readOnly />
          </div>
        </div>
        <ProfileDetail profileData={profile} />
      </div>
    </main>
  );
};
