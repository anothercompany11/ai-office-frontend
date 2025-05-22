"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState, useRef } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (guideline: string) => void;
  initialInstruction?: string;
}

export default function CreateGuidelineModal({
  isOpen,
  onClose,
  onConfirm,
  initialInstruction = "",
}: Props) {
  const [guideline, setGuideline] = useState(initialInstruction);
  const isSubmitting = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setGuideline(initialInstruction);
      isSubmitting.current = false;
    }
  }, [isOpen, initialInstruction]);

  const handleSubmit = () => {
    if (isSubmitting.current || !guideline.trim()) return;

    isSubmitting.current = true;
    onConfirm(guideline.trim());
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="absolute bg-white border tab:w-[534px] border-[#EEEFF1] rounded-[20px] p-6 flex flex-col justify-center items-end gap-6">
        <div className="w-full space-y-6">
          <DialogTitle className="text-title-l text-label-strong">
            프로젝트 지침 추가
          </DialogTitle>

          <div className="space-y-3">
            <p className="text-body-s text-label-natural">
              <span className="text-label-strong">
                어떻게 하면 AI오피스가 이 프로젝트를 최대한 도와드릴 수
                있을까요?
              </span>
              <br />
              AI오피스에게 특정 토픽에 집중해 달라고 하거나, 특정한 톤이나
              포맷으로 응답해 달라고 할 수 있습니다.
            </p>

            <textarea
              className="w-full border border-line rounded-[10px] px-4 py-3 text-body-m outline-none min-h-[150px] resize-none"
              value={guideline}
              placeholder="예: 최신 JavaScript 문법을 사용해서 답변해줘"
              onChange={(e) => setGuideline(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.ctrlKey && guideline.trim()) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              onClick={onClose}
              variant="outline_rounded"
              size={"rounded_lg"}
            >
              취소
            </Button>
            <Button
              disabled={!guideline.trim()}
              onClick={handleSubmit}
              size={"rounded_lg"}
              variant="rounded"
            >
              저장
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
