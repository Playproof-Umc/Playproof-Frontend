import * as React from "react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* 로고 */}
        <div className="flex items-center gap-1">
          <h1 className="text-xl font-bold text-zinc-900">PLAYPROOF</h1>
          <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-600">
            Pro
          </span>
        </div>

        {/* 네비게이션 메뉴 */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#"
            className="text-sm font-semibold text-zinc-900 underline decoration-2 underline-offset-8"
          >
            파티 보기
          </a>
          <a
            href="#"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            커뮤니티
          </a>
          <a
            href="#"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            아지트
          </a>
          <a
            href="#"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            상점
          </a>
        </nav>

        {/* 로그인 버튼 */}
        <button
          type="button"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          로그인
        </button>
      </div>
    </header>
  );
}
