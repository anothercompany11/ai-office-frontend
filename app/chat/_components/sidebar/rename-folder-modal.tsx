"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  defaultName: string;
  onClose: () => void;
  onConfirm: (newName: string) => void;
}

export default function RenameFolderModal({
  isOpen,
  defaultName,
  onClose,
  onConfirm,
}: Props) {
  const [name, setName] = useState(defaultName);

  useEffect(() => {
    if (isOpen) setName(defaultName);
  }, [isOpen, defaultName]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="absolute bg-white border tab:w-[534px] border-[#EEEFF1] rounded-[20px] p-6 flex flex-col justify-center items-end gap-6">
        <div className="w-full space-y-6">
          <DialogTitle className="text-title-l text-label-strong">
            폴더 이름
          </DialogTitle>

          <input
            className="w-full border border-line rounded-[10px] px-4 py-3 text-body-m outline-none "
            value={name}
            placeholder="새 폴더 이름"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                name.trim() && onConfirm(name.trim());
              }
            }}
          />

          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="w-[84px] h-[48px] border border-line-strong rounded-full text-title-s bg-white"
            >
              취소
            </button>
            <button
              disabled={!name.trim()}
              onClick={() => onConfirm(name.trim())}
              className="w-[97px] h-[48px] rounded-full text-title-s bg-[#00AC78] text-white disabled:opacity-40"
            >
              저장
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
