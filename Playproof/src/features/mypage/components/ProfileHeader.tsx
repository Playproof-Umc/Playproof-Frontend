import React from 'react';
import { Pencil } from 'lucide-react';
import type { MyProfileData } from '@/features/mypage/types';

interface ProfileHeaderProps {
  profileData: MyProfileData;
}

export function ProfileHeader({ profileData }: ProfileHeaderProps) {
  const [bio, setBio] = React.useState(profileData.bio || '');
  const [isEditingBio, setIsEditingBio] = React.useState(false);

  const handleBioSave = () => {
    // TODO: API 호출로 상태메시지 저장
    console.log('상태메시지 저장:', bio);
    setIsEditingBio(false);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm h-full flex flex-col justify-center">
      {/* 상태메시지 (수정 가능) */}
      <div className="mb-3">
        {isEditingBio ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="상태메시지를 입력하세요"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={handleBioSave}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
            >
              저장
            </button>
            <button
              onClick={() => {
                setBio(profileData.bio || '');
                setIsEditingBio(false);
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
            <button
              onClick={() => setIsEditingBio(true)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <p className="flex-1 text-sm text-gray-700">
              {bio || '상태메시지를 입력해주세요'}
            </p>
          </div>
        )}
      </div>

      {/* 플레이 스타일 태그 */}
      {profileData.playStyles && profileData.playStyles.length > 0 && (
        <div className="mb-3">
          <p className="mb-2 text-xs text-gray-500">플레이 스타일</p>
          <div className="flex flex-wrap gap-2">
            {profileData.playStyles.map((style, index) => (
              <span
                key={index}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
              >
                {style}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 선호 태그 */}
      {profileData.preferredTags && profileData.preferredTags.length > 0 && (
        <div>
          <p className="mb-2 text-xs text-gray-500">선호 태그</p>
          <div className="flex flex-wrap gap-2">
            {profileData.preferredTags.map((tag, index) => (
              <span
                key={index}
                className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}