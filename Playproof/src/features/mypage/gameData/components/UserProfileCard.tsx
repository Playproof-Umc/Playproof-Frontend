// src/features/mypage/gameData/components/UserProfileCard.tsx

import { Card } from "@/components/ui/Card";
import type { SiteUserProfile } from "@/features/mypage/gameData/types/gameDataTypes";

type Props = { profile: SiteUserProfile };

const UserProfileCard = ({ profile }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="h-28 w-28 rounded-full bg-gray-200" />

          <button
            type="button"
            className="text-[11px] text-gray-500 hover:text-gray-700 hover:underline"
          >
            프로필 편집
          </button>
        </div>

        <div className="pt-1">
          <div className="text-3xl font-semibold leading-none text-gray-900">
            {profile.displayName}
          </div>
          <div className="mt-2 text-xs font-medium text-gray-500">
            {profile.rankLabel}
          </div>
        </div>
      </div>

      <Card className="p-6">
        <div className="space-y-3">
          <div className="h-10 w-full rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700">
            {profile.intro}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-md bg-gray-50 px-4 py-3">
              <div className="text-[11px] text-gray-500">{profile.noteLabel}</div>
              <div className="mt-1 text-sm font-medium text-gray-800">
                {profile.noteValue}
              </div>
            </div>

            <div className="rounded-md bg-gray-50 px-4 py-3">
              <div className="text-[11px] text-gray-500">상태</div>
              <div className="mt-1 text-sm font-medium text-gray-800">정상</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserProfileCard;
export { UserProfileCard };