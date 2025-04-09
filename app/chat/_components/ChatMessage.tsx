"use client";

import { MessageRole } from "@/types";

interface ChatMessageProps {
  role: MessageRole;
  content: string;
  timestamp?: string;
}

const ChatMessage = ({ role, content, timestamp }: ChatMessageProps) => {
  const isUser = role === MessageRole.USER;

  return (
    <article
      className={`w-full ${isUser ? "" : "text-token-text-primary"}`}
      dir="auto"
    >
      <h5 className="sr-only">{isUser ? "You said:" : "AI said:"}</h5>
      <div className="text-base my-auto mx-auto py-5 px-6">
        <div className="mx-auto flex flex-1 text-base gap-4 md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] group/turn-messages">
          <div className="group/conversation-turn relative flex w-full min-w-0 flex-col">
            <div className="relative flex-col gap-1 md:gap-3">
              <div className="flex max-w-full flex-col grow">
                {isUser ? (
                  <div className="min-h-8 text-message relative flex w-full flex-col items-end gap-2 text-start break-words whitespace-normal [.text-message+&]:mt-5">
                    <div className="w-full">
                      <div className="flex w-full flex-col gap-1 empty:hidden items-end rtl:items-start">
                        <div className="relative max-w-[70%] bg-gray-200 text-gray-800 rounded-3xl px-5 py-2.5">
                          <div className="whitespace-pre-wrap">{content}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="min-h-8 text-message relative flex w-full flex-col gap-2 text-start break-words whitespace-normal [.text-message+&]:mt-5">
                    <div className="flex w-full flex-col gap-1 empty:hidden first:pt-[3px]">
                      <div className="markdown prose w-full break-words text-gray-800">
                        <p>{content}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ChatMessage;
