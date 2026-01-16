import React from 'react';

interface MyPageSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function MyPageSidebar({ activeSection, onSectionChange }: MyPageSidebarProps) {
  const sidebarItems = [
    { id: '내프로필', label: '내 프로필' },
    { id: '피드백', label: '피드백' },
    { id: '작성게시판글', label: '작성 게시판 글' },
    { id: '친구목록', label: '친구 목록' },
  ];

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-24">
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                activeSection === item.id
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}