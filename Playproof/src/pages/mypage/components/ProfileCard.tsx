import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Edit2, User } from 'lucide-react';

interface ProfileCardProps {
  nickname: string;
  rank: number;
}

export function ProfileCard({ nickname, rank }: ProfileCardProps) {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/mypage/edit');
  };

  return (
    <Card className="flex h-[200px] flex-col justify-center !p-6">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center text-white">
            <User size={40} />
          </div>
          <button 
            onClick={handleEditProfile}
            className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50"
          >
            <Edit2 className="h-3 w-3 text-gray-600" />
          </button>
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-lg font-bold text-gray-900">{nickname}</h2>
          <p className="mt-1 text-xs text-gray-500">Rank #{rank}</p>
        </div>
      </div>
    </Card>
  );
}