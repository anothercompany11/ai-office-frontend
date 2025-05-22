"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState, useRef } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

export default function CreateFolderModal({
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  const [name, setName] = useState("");
  const isSubmitting = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setName("");
      isSubmitting.current = false;
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (isSubmitting.current || !name.trim()) return;
    
    isSubmitting.current = true;
    onConfirm(name.trim());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="absolute bg-white border tab:w-[534px] border-[#EEEFF1] rounded-[20px] p-6 flex flex-col justify-center items-end gap-6">
        <div className="w-full space-y-6">
          <DialogTitle className="text-title-l text-label-strong">
            새 프로젝트 만들기
          </DialogTitle>

          <input
            className="w-full border border-line rounded-[10px] px-4 py-3 text-body-m outline-none"
            value={name}
            placeholder="프로젝트 이름"
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && name.trim()) {
                e.preventDefault();
                handleSubmit();
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
              onClick={handleSubmit}
              className="w-[97px] disabled:cursor-auto h-[48px] rounded-full text-title-s bg-[#00AC78] text-white disabled:opacity-40"
            >
              저장
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
