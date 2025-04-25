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
  isStreaming?: boolean;
}

const ChatMessage = ({
  role,
  content,
  isStreaming = false,
}: ChatMessageProps) => {
  const isUser = role === MessageRole.USER;
  const isMob = useGetCurrentDevice() === "mob";
  return (
    <article dir="auto">
      <h5 className="sr-only">{isUser ? "You said:" : "AI said:"}</h5>
      <div className="relative flex w-full flex-col">
        {isUser ? (
          <p
            className={cn(
              `bg-background-natural py-2 px-4 ml-auto max-w-[70%] text-label-strong rounded-[20px]`,
              isMob ? "text-body-s" : "text-body-m",
            )}
          >
            {content}
          </p>
        ) : (
          <div className="flex tab:gap-3 gap-2">
            <Image
              className="tab:size-[46px] transition-all duration-200 size-8"
              src={"/png/icon/robot.png"}
              alt="AI 로봇"
              width={46}
              height={46}
              unoptimized
            />
            <div className="break-words px-4 rounded-lg whitespace-normal border border-line bg-white">
              <div className="markdown prose w-full break-words">
                {content ? (
                  <MarkdownRenderer isMob={isMob} content={content} />
                ) : isStreaming ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default ChatMessage;
