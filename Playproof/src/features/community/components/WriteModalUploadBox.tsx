// src/features/community/components/WriteModalUploadBox.tsx

import React from "react";

type WriteModalUploadBoxProps = {
  label?: string;
  helperText?: string;
  accept?: string;
  multiple?: boolean;
  onFilesChange: (files: File[]) => void;
  initialFiles?: File[];
};

export const WriteModalUploadBox = ({
  label = "파일 업로드",
  helperText = "사진 최대 20장(5mb), 영상은 최대 1개(1분 이내) 업로드 가능합니다.",
  accept = "image/*",
  multiple = true,
  onFilesChange,
  initialFiles = [],
}: WriteModalUploadBoxProps) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = React.useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const previewsRef = React.useRef<string[]>([]);

  // 컴포넌트 언마운트 시에만 URL revoke
  React.useEffect(() => {
    return () => {
      previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handlePickFiles = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (!files.length) return;

    const maxFiles = multiple ? 20 : 1;
    const maxSize = 5 * 1024 * 1024;
    const validFiles = files.filter((file) => file.size <= maxSize);

    const merged = [...selectedFiles, ...validFiles].filter((file, index, self) => {
      return (
        self.findIndex(
          (item) =>
            item.name === file.name &&
            item.size === file.size &&
            item.lastModified === file.lastModified
        ) === index
      );
    });

    const nextFiles = merged.slice(0, maxFiles);
    // 이전 URL들을 revoke (새로운 URL로 대체되므로)
    previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    const nextPreviews = nextFiles.map((file) => URL.createObjectURL(file));
    previewsRef.current = nextPreviews;
    setSelectedFiles(nextFiles);
    setPreviews(nextPreviews);
    onFilesChange(nextFiles);
    event.target.value = "";
  };

  const clearPreviews = () => {
    // URL revoke는 나중에 cleanup에서 처리
    setPreviews([]);
    setSelectedFiles([]);
  };

  const areFilesEqual = (filesA: File[], filesB: File[]) => {
    if (filesA.length !== filesB.length) return false;
    return filesA.every((fileA, index) => {
      const fileB = filesB[index];
      return (
        fileA.name === fileB.name &&
        fileA.size === fileB.size &&
        fileA.lastModified === fileB.lastModified
      );
    });
  };

  React.useEffect(() => {
    if (!initialFiles.length) {
      if (selectedFiles.length > 0) {
        clearPreviews();
      }
      return;
    }
    
    // 현재 파일과 동일하면 업데이트하지 않음
    if (areFilesEqual(selectedFiles, initialFiles)) {
      return;
    }
    
    // 이전 URL들을 revoke (새로운 URL로 대체되므로)
    previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    const nextPreviews = initialFiles.map((file) => URL.createObjectURL(file));
    previewsRef.current = nextPreviews;
    setSelectedFiles(initialFiles);
    setPreviews(nextPreviews);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFiles]);

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-800">{label}</label>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleImageChange}
        className="hidden"
      />
      <button type="button" onClick={handlePickFiles} className="w-full">
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600">
            파일 업로드
          </div>
          <p className="mt-3 text-xs text-gray-500">클릭해서 파일을 선택하세요.</p>
        </div>
      </button>
      <p className="mt-2 text-[11px] text-gray-500">{helperText}</p>
      {previews.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {previews.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
