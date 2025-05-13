"use client";

import { MessageRole } from "@/types";
import MarkdownRenderer from "./markdown-renderer";
import Image from "next/image";
import { useGetCurrentDevice } from "@/hooks/use-get-current-device";
import { cn } from "@/app/lib/utils";

interface ChatMessageProps {
  role: MessageRole;
  content: string;
  timestamp?: string;
  streaming?: boolean;
}

const ChatMessage = ({
  role,
  content,
  streaming = false,
}: ChatMessageProps) => {
  const isUser = role === MessageRole.USER;
  const isMob = useGetCurrentDevice() === "mob";

  /* --- 점(dot) 애니메이션 컴포넌트 --- */
  const TypingDots = (
    <span className="inline-flex items-center gap-1 ml-1">
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:120ms]" />
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:240ms]" />
    </span>
  );

  return (
    <article dir="auto">
      <h5 className="sr-only">{isUser ? "You said:" : "AI said:"}</h5>

      <div className="relative flex w-full flex-col">
        {/* ───── 사용자 메시지 ───── */}
        {isUser ? (
          <p
            className={cn(
              "bg-background-natural break-words py-2 px-4 ml-auto max-w-[70%] text-label-strong rounded-[20px]",
              isMob ? "text-body-s" : "text-body-m",
            )}
          >
            {content}
          </p>
        ) : (
          /* ───── AI 메시지 ───── */
          <div className="flex tab:gap-3 gap-2">
            <Image
              className="tab:size-[46px] size-8 transition-all duration-200"
              src="/png/icon/robot.png"
              alt="AI 로봇"
              width={46}
              height={46}
              unoptimized
            />

            <div className="break-words py-2 px-4 rounded-lg whitespace-normal border border-line bg-white">
              <div className="markdown prose w-full break-words">
                {/* 1) 스트리밍 중이면서 아직 텍스트가 없으면 점 애니메이션 */}
                {streaming && !content && TypingDots}

                {/* 2) 텍스트가 존재할 땐 렌더러 */}
                {content && (
                  <MarkdownRenderer isMob={isMob} content={content} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default ChatMessage;
