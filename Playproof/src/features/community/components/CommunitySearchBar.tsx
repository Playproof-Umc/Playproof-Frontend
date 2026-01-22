import * as React from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { COMMUNITY_SECTION_LABELS } from "@/features/community/constants/labels";

type CommunitySearchBarProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch?: () => void;
  onWritePost?: () => void;
};

export function CommunitySearchBar({
  searchQuery,
  onSearchChange,
  onSearch,
  onWritePost,
}: CommunitySearchBarProps) {
  return (
    <div className="flex items-center gap-3">
      {/* 검색 입력 - Input 컴포넌트 사용 */}
      <div className="relative flex-1">
        <SearchIcon />
        <Input
          type="text"
          placeholder={COMMUNITY_SECTION_LABELS.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch?.();
            }
          }}
          className="!bg-white !border-zinc-300 !text-zinc-900 placeholder:!text-zinc-400 pl-10 !py-2.5"
        />
      </div>

      {/* 필터 버튼 - Button 컴포넌트 사용 */}
      <Button
        variant="outline"
        className="!px-4 !py-2.5 !rounded-lg !border-zinc-300 !text-zinc-700 hover:!bg-zinc-50"
      >
        <FilterIcon />
        <span className="ml-2">{COMMUNITY_SECTION_LABELS.filter}</span>
      </Button>

      {/* 글쓰기 버튼 - Button 컴포넌트 사용 */}
      <Button
        onClick={onWritePost}
        variant="primary"
        className="!bg-zinc-900 hover:!bg-zinc-800 !px-6 !py-2.5 !rounded-lg"
      >
        <WriteIcon />
        <span className="ml-2">{COMMUNITY_SECTION_LABELS.write}</span>
      </Button>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m21 21-4.35-4.35"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 6h16M7 12h10M10 18h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WriteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
