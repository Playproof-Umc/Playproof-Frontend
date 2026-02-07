// src/features/auth/gameSelectPage/components/GameSelectGrid.tsx

import { cn } from "@/utils/cn";
import type { GameOption } from "@/features/auth/gameSelectPage/types";

type Props = {
  games: GameOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function GameSelectGrid({ games, selectedId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-4 gap-6">
      {games.map((g) => {
        const selected = selectedId === g.id;

        return (
          <button
            key={g.id}
            type="button"
            onClick={() => onSelect(g.id)}
            className={cn(
              "h-12 w-full rounded-lg border text-sm font-semibold transition-colors",
              selected
                ? "border-[#1533B6] bg-[#1533B6] text-white"
                : "border-black bg-white text-black hover:border-[#1533B6] hover:bg-[#1533B6] hover:text-white"
            )}
          >
            {g.name}
          </button>
        );
      })}
    </div>
  );
}
