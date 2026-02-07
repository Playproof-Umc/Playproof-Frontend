// src/components/ui/ModalShell.tsx

import React from "react";

type ModalShellProps = {
  open: boolean;
  onOverlayClick?: () => void;
  overlayClassName?: string;
  wrapperClassName?: string;
  panelClassName?: string;
  children: React.ReactNode;
};

export const ModalShell = ({
  open,
  onOverlayClick,
  overlayClassName = "fixed inset-0 z-[120] bg-black/30",
  wrapperClassName = "fixed inset-0 z-[121] flex items-center justify-center px-6",
  panelClassName = "w-full max-w-[640px] bg-white rounded-2xl shadow-2xl border border-gray-100",
  children,
}: ModalShellProps) => {
  if (!open) return null;

  return (
    <>
      <div className={overlayClassName} onClick={onOverlayClick} />
      <div className={wrapperClassName}>
        <div className={panelClassName}>{children}</div>
      </div>
    </>
  );
};
