// src/features/mypage/gameData/components/lol/PaginationBar.tsx

import type { PaginationState } from "@/features/mypage/gameData/types/gameDataTypes";

type Props = {
  pagination: PaginationState;
  onChangePage: (nextPage: number) => void;
};

export const PaginationBar = ({ pagination, onChangePage }: Props) => {
  const { page, totalPages } = pagination;
  const pages = Array.from({ length: totalPages }).map((_, i) => i + 1);

  const safeGo = (p: number) => {
    const next = Math.max(1, Math.min(totalPages, p));
    if (next !== page) onChangePage(next);
  };

  return (
    <div className="flex items-center justify-between pt-2">
      <div className="text-xs text-gray-500">페이지당 보기: {pagination.pageSize}</div>

      <div className="flex items-center gap-2">
        {pages.slice(0, 12).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => safeGo(p)}
            className={[
              "h-8 w-8 rounded-md text-xs",
              p === page ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
            ].join(" ")}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          onClick={() => safeGo(page + 1)}
          className="h-8 rounded-md bg-gray-100 px-3 text-xs text-gray-700 hover:bg-gray-200"
        >
          다음
        </button>
      </div>
    </div>
  );
};
