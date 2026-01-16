import { cn } from "@/components/utils/cn";
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
              "h-12 w-full rounded-md border text-xs font-medium transition-colors",
              selected
                ? "border-black bg-black text-white"
                : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
            )}
          >
            {g.name}
          </button>
        );
      })}
    </div>
  );
}