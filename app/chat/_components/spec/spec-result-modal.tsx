"use client";

import { useState } from "react";
import { Download, Loader2, MessageSquare, RefreshCw } from "lucide-react";

import { specApi } from "@/app/api/spec";
import { ProjectSpec } from "@/app/api/dto/spec";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import MarkdownRenderer from "../chat-screen/markdown-renderer";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  spec: ProjectSpec | null;
  /** 다시 만들기 (대화에서 바뀐 내용을 반영) */
  onRegenerate: () => void;
  regenerating: boolean;
}

/**
 * 완성된 구현 명세를 보여주고 파일로 내려받게 하는 모달.
 *
 * 학생은 여기서 받은 파일을 빈 폴더에 넣고 코딩 도구에 넘긴다.
 * 내용이 마음에 들지 않으면 닫고 대화를 이어간 뒤 다시 만들면 된다.
 */
const SpecResultModal = ({
  isOpen,
  onClose,
  spec,
  onRegenerate,
  regenerating,
}: Props) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  if (!spec) return null;

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError(null);
    try {
      await specApi.download(spec.conversation_id, spec.filename);
    } catch (e) {
      setDownloadError(
        e instanceof Error ? e.message : "내려받는 중 문제가 생겼어요.",
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[85vh] w-full max-w-[720px] flex-col gap-0 overflow-hidden rounded-[20px] bg-white p-0">
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <DialogTitle className="text-title-l text-label-strong">
              {spec.title || "구현 명세"}
            </DialogTitle>
            <p className="mt-1 text-body-s text-label-natural">
              {spec.filename}
              {spec.version > 1 ? ` · ${spec.version}번째 수정본` : null}
            </p>
          </div>
        </div>

        {/* 전달 방법 안내 */}
        <div className="border-b border-line bg-background-alternative px-6 py-4">
          <p className="text-body-s font-bold text-label-strong">
            이 파일을 이렇게 넘기세요
          </p>
          <pre className="mt-2 whitespace-pre-wrap text-body-s text-label-natural">
            {spec.handoff_guide}
          </pre>
        </div>

        {/* 명세 본문 */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <MarkdownRenderer content={spec.content} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-6 py-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              <MessageSquare size={16} />
              대화로 돌아가기
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              disabled={regenerating}
            >
              {regenerating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              다시 만들기
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {downloadError ? (
              <span className="text-body-s text-red-500">{downloadError}</span>
            ) : null}
            <Button onClick={handleDownload} disabled={downloading}>
              {downloading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              {spec.filename} 내려받기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SpecResultModal;
