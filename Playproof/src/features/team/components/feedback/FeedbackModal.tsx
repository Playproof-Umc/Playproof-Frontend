// src/features/team/components/feedback/FeedbackModal.tsx

import React from "react";
import { X } from "lucide-react";
import { ModalShell } from "@/components/ui/ModalShell";

type FeedbackModalProps = {
  open: boolean;
  targetName: string;
  targetMeta?: string;
  avatarUrl?: string;
  required?: boolean;
  onClose?: () => void;
  onSubmit: (payload: {
    positive: string[];
    negative: string[];
    memo: string;
    blockUser: boolean;
  }) => void;
};

const POSITIVE_TAGS = ["협력적이었어요", "소통이 원활했어요", "재밌어요", "실력이 우수해요", "하드캐리 가능", "오더 가능!"];
const NEGATIVE_TAGS = ["과도한 욕설", "고의 트롤,어뷰징", "계정 도용 행위", "핵,치트 의심"];

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  open,
  targetName,
  targetMeta,
  avatarUrl,
  required = false,
  onClose,
  onSubmit,
}) => {
  const [positive, setPositive] = React.useState<string[]>([]);
  const [negative, setNegative] = React.useState<string[]>([]);
  const [memo, setMemo] = React.useState("");
  const [blockUser, setBlockUser] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setPositive([]);
    setNegative([]);
    setMemo("");
    setBlockUser(false);
  }, [open]);

  if (!open) return null;

  const toggleTag = (
    target: string,
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    limit: number
  ) => {
    setList((prev) => {
      if (prev.includes(target)) return prev.filter((tag) => tag !== target);
      if (prev.length >= limit) return prev;
      return [...prev, target];
    });
  };

  return (
    <ModalShell
      open={open}
      onOverlayClick={!required ? onClose : undefined}
      overlayClassName="fixed inset-0 z-[140] bg-black/40"
      wrapperClassName="fixed inset-0 z-[141] flex items-center justify-center px-6"
      panelClassName="w-full max-w-[620px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6"
    >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-gray-900">피드백 작성</h2>
            {!required && (
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

        <div className="mt-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : null}
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{targetName}</div>
              <div className="text-xs text-gray-500">{targetMeta ?? "Tier TS 90"}</div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-bold text-gray-900 mb-2">긍정 피드백 (3개 이하)</div>
            <div className="grid grid-cols-2 gap-3">
              {POSITIVE_TAGS.map((tag) => (
                <label key={tag} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={positive.includes(tag)}
                    onChange={() => toggleTag(tag, setPositive, 3)}
                    className="h-4 w-4"
                  />
                  {tag}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-bold text-gray-900 mb-2">부정 피드백 (3개 이하)</div>
            <div className="grid grid-cols-2 gap-3">
              {NEGATIVE_TAGS.map((tag) => (
                <label key={tag} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={negative.includes(tag)}
                    onChange={() => toggleTag(tag, setNegative, 3)}
                    className="h-4 w-4"
                  />
                  {tag}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="좋았던 점 혹은 개선할 점을 작성해주세요. (선택)"
              rows={4}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-700 focus:outline-none focus:border-gray-400"
            />
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={blockUser}
              onChange={() => setBlockUser((prev) => !prev)}
              className="h-4 w-4"
            />
            이 유저 다시 만나지 않기
          </div>

          <button
            type="button"
            className="mt-6 w-full h-12 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black transition-colors"
            onClick={() => onSubmit({ positive, negative, memo, blockUser })}
          >
            피드백 제출하기
          </button>
    </ModalShell>
  );
};
