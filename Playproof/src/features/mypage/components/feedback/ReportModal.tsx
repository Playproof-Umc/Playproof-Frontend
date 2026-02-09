// src/features/mypage/components/feedback/ReportModal.tsx

import React from 'react';
import { X, ChevronDown, Image as ImageIcon, Video } from 'lucide-react';
import { MYPAGE_REPORT_LABELS, MYPAGE_REPORT_TYPES } from '@/features/mypage/constants/labels';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserNickname: string;
}

type ReportType = (typeof MYPAGE_REPORT_TYPES)[number] | '';

export function ReportModal({ isOpen, onClose, targetUserNickname }: ReportModalProps) {
  const [reportType, setReportType] = React.useState<ReportType>('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [images, setImages] = React.useState<File[]>([]);
  const [videos, setVideos] = React.useState<File[]>([]);
  const [showDropdown, setShowDropdown] = React.useState(false);

  const reportTypes: ReportType[] = [...MYPAGE_REPORT_TYPES];

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const nextFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...nextFiles]);
      e.target.value = "";
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const nextFiles = Array.from(e.target.files);
      setVideos((prev) => [...prev, ...nextFiles]);
      e.target.value = "";
    }
  };

  const handleSubmit = () => {
    // TODO: 신고 API 호출
    console.log('신고 제출:', {
      targetUser: targetUserNickname,
      reportType,
      name,
      email,
      title,
      content,
      images,
      videos,
    });
    handleClose();
  };

  const handleClose = () => {
    setReportType('');
    setName('');
    setEmail('');
    setTitle('');
    setContent('');
    setImages([]);
    setVideos([]);
    onClose();
  };

  const isFormValid = reportType && name && email && title && content;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900">
              <span className="text-sm text-white">🔒</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              {MYPAGE_REPORT_LABELS.title}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 space-y-6">
          {/* 이름 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              {MYPAGE_REPORT_LABELS.name}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={MYPAGE_REPORT_LABELS.namePlaceholder}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* 이메일 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              {MYPAGE_REPORT_LABELS.email}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={MYPAGE_REPORT_LABELS.emailPlaceholder}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* 신고분류 (드롭다운) */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              {MYPAGE_REPORT_LABELS.category}
            </label>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full flex items-center justify-between rounded-lg border border-gray-300 px-4 py-3 text-sm text-left focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <span className={reportType ? 'text-gray-900' : 'text-gray-400'}>
                  {reportType || MYPAGE_REPORT_LABELS.categoryPlaceholder}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {showDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowDropdown(false)}
                  ></div>
                  <div className="absolute z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                    {reportTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setReportType(type);
                          setShowDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 글 작성 */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-900">
              {MYPAGE_REPORT_LABELS.contentTitle}
            </label>
            {/* 제목 */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={MYPAGE_REPORT_LABELS.contentTitlePlaceholder}
              maxLength={20}
              className="w-full rounded-t-lg border border-b-0 border-gray-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {/* 내용 */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={MYPAGE_REPORT_LABELS.contentPlaceholder}
              rows={8}
              className="w-full rounded-b-lg border border-gray-300 px-4 py-3 text-sm resize-none focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* 사진 등록 */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900">
                {MYPAGE_REPORT_LABELS.imageUpload}
              </label>
              <span className="text-xs text-gray-400">{images.length}/20</span>
            </div>
            <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
              <ImageIcon className="h-6 w-6 text-gray-400" />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            {images.length > 0 && (
              <div className="mt-2 space-y-1 text-xs text-gray-500">
                {images.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="truncate">
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 영상 등록 */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-900">
                {MYPAGE_REPORT_LABELS.videoUpload}{" "}
                <span className="text-xs text-gray-400">
                  {MYPAGE_REPORT_LABELS.videoLimit}
                </span>
              </label>
              <span className="text-xs text-gray-400">{videos.length}/1</span>
            </div>
            <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
              <Video className="h-6 w-6 text-gray-400" />
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
            </label>
            {videos.length > 0 && (
              <div className="mt-2 space-y-1 text-xs text-gray-500">
                {videos.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="truncate">
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="sticky bottom-0 border-t border-gray-200 bg-white p-6">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`w-full rounded-lg py-3 text-sm font-medium transition-colors ${
              isFormValid
                ? 'bg-gray-900 text-white hover:bg-gray-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {MYPAGE_REPORT_LABELS.upload}
          </button>
        </div>
      </div>
    </div>
  );
}
