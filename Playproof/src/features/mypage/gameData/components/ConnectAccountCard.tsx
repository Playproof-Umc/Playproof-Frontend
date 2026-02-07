// src/features/mypage/gameData/components/ConnectAccountCard.tsx

import { Card } from "@/components/ui/Card";

export const ConnectAccountCard = () => {
  return (
    <Card className="flex h-full w-full items-center justify-center p-4">
      <div className="text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
          +
        </div>

        <div className="mt-2 text-sm font-semibold text-gray-800">계정 연동하기</div>
        <div className="mt-1 text-xs text-gray-500">추후 연동 플로우 연결</div>
      </div>
    </Card>
  );
};