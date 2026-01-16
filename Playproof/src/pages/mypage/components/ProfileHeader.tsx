import React from 'react';
import { Card } from '@/components/ui/Card';
import { Edit3 } from 'lucide-react';

interface ProfileHeaderProps {
  bio: string;
  playStyles: string[];
  preferredTags: string[];
}

export function ProfileHeader({ bio, playStyles, preferredTags }: ProfileHeaderProps) {
  return (
    <Card className="flex h-[200px] flex-col justify-center !p-6 !bg-gray-200">
      <div className="mb-4 flex items-start gap-2 bg-white p-4 rounded-md">
        <Edit3 className="h-4 w-4 flex-shrink-0 text-gray-500" />
        <p className="flex-1 text-sm text-gray-700">{bio}</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="w-32 flex-shrink-0 text-xs font-medium text-gray-600">
            플레이 스타일
          </span>
          <div className="flex flex-wrap gap-1.5">
            {playStyles.map((style, index) => (
              <span 
                key={index}
                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700"
              >
                {style}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-32 flex-shrink-0 text-xs font-medium text-gray-600">
            선호 태그
          </span>
          <div className="flex flex-wrap gap-1.5">
            {preferredTags.map((tag, index) => (
              <span 
                key={index}
                className="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}