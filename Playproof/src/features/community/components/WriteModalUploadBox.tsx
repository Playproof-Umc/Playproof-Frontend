import React from "react";

type WriteModalUploadBoxProps = {
  label?: string;
  helperText?: string;
  accept?: string;
  multiple?: boolean;
  onFilesChange: (files: File[]) => void;
};

export const WriteModalUploadBox = ({
  label = "파일 업로드",
  helperText = "사진 최대 20장(5mb), 영상은 최대 1개(1분 이내) 업로드 가능합니다.",
  accept = "image/*",
  multiple = true,
  onFilesChange,
}: WriteModalUploadBoxProps) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = React.useState<string[]>([]);

  React.useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handlePickFiles = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (!files.length) return;
    previews.forEach((url) => URL.revokeObjectURL(url));
    const nextPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(nextPreviews);
    onFilesChange(files);
  };

  const clearPreviews = () => {
    previews.forEach((url) => URL.revokeObjectURL(url));
    setPreviews([]);
  };

  React.useEffect(() => {
    clearPreviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
