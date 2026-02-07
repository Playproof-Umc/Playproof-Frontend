// src/features/mypage/components/layout/MyPageSidebar.tsx

import { MYPAGE_SECTION_IDS, MYPAGE_SECTION_LABELS, type MyPageSectionId } from "@/features/mypage/constants/labels";

interface MyPageSidebarProps {
  activeSection: MyPageSectionId;
  onSectionChange: (section: MyPageSectionId) => void;
}

export function MyPageSidebar({ activeSection, onSectionChange }: MyPageSidebarProps) {
  const sidebarItems = [
    { id: MYPAGE_SECTION_IDS.profile, label: MYPAGE_SECTION_LABELS.profile },
    { id: MYPAGE_SECTION_IDS.feedback, label: MYPAGE_SECTION_LABELS.feedback },
    { id: MYPAGE_SECTION_IDS.writtenPosts, label: MYPAGE_SECTION_LABELS.writtenPosts },
    { id: MYPAGE_SECTION_IDS.friends, label: MYPAGE_SECTION_LABELS.friends },
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
