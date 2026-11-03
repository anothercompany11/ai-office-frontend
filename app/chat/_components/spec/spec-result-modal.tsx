"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Download,
  Loader2,
  MessageSquare,
  RefreshCw,
} from "lucide-react";

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
 * 완성된 결과물을 보여주는 모달.
 *
 * 파일로 내려받아야 쓸모가 있는 결과물(`filename` 이 있음)이면 다운로드와 전달
 * 안내를 함께 보여준다. 화면에서 읽고 끝나는 결과물이면 복사만 둔다 — 쓰지도 않을
 * 파일을 안기지 않는다.
 *
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
  const [copied, setCopied] = useState(false);

  if (!spec) return null;

  const filename = spec.filename;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(spec.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setDownloadError("복사하지 못했어요. 본문을 직접 선택해 주세요.");
    }
  };

  const handleDownload = async () => {
    if (!filename) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      await specApi.download(spec.conversation_id, filename);
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
              {spec.title || "정리한 결과"}
            </DialogTitle>
            <p className="mt-1 text-body-s text-label-natural">
              {filename}
              {filename && spec.version > 1 ? " · " : null}
              {spec.version > 1 ? `${spec.version}번째 수정본` : null}
            </p>
          </div>
        </div>

        {/* 전달 방법 안내 — 파일로 넘기는 결과물일 때만 */}
        {spec.handoff_guide ? (
          <div className="border-b border-line bg-background-alternative px-6 py-4">
            <p className="text-body-s font-bold text-label-strong">
              이 파일을 이렇게 넘기세요
            </p>
            <pre className="mt-2 whitespace-pre-wrap text-body-s text-label-natural">
              {spec.handoff_guide}
            </pre>
          </div>
        ) : null}

        {/* 결과물 본문 */}
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
            {filename ? (
              <Button onClick={handleDownload} disabled={downloading}>
                {downloading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Download size={16} />
                )}
                {filename} 내려받기
              </Button>
            ) : (
              <Button onClick={handleCopy}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "복사했어요" : "본문 복사"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SpecResultModal;
