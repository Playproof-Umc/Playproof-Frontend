// src/pages/mypage/GameData.tsx

import { GameDataPageView } from "@/features/mypage/pages/GameDataPageView";
import { Navbar } from "@/components/layout/Navbar";

export default function GameDataPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <GameDataPageView />
    </div>
  );
}
