"use client";

import { cn } from "@/app/lib/utils";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Plus } from "lucide-react";

interface ChatSidebarProps {
  className?: string;
  conversations: Array<{
    id: string;
    title: string;
    lastMessage: string;
    timestamp: string;
  }>;
  selectedConversationId?: string;
  onSelectConversation: (id: string) => void;
}

export function ChatSidebar({
  className,
  conversations,
  selectedConversationId,
  onSelectConversation,
}: ChatSidebarProps) {
  return (
    <Card className={cn("w-80 h-[calc(100vh-4rem)] bg-white", className)}>
      {/* 헤더 섹션 */}
      <div className="z-20 p-2 text-xs font-semibold select-none">
        <h2
          id="conversation-heading"
          className="flex h-[26px] w-full items-center justify-between"
        >
          대화 내역
          <span>
            <button
              aria-label="새 대화 만들기"
              className="me-1 flex items-center rounded-lg hover:bg-gray-100 focus-visible:opacity-100"
            >
              <div className="flex h-[26px] w-[26px] items-center justify-center">
                <Plus className="h-5 w-5" />
              </div>
            </button>
          </span>
        </h2>
      </div>

      {/* 대화 목록 */}
      <ScrollArea className="h-[calc(100%-2rem)]">
        <aside className="flex flex-col gap-2 px-2">
          <ul aria-labelledby="conversation-heading" className="flex flex-col">
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <button
                  onClick={() => onSelectConversation(conversation.id)}
                  className={cn(
                    "group w-full text-left rounded-lg active:opacity-90 h-9 flex items-center gap-2.5 p-2",
                    selectedConversationId === conversation.id
                      ? "bg-gray-200"
                      : "hover:bg-gray-100"
                  )}
                >
                  <div className="flex h-6 w-6 items-center justify-center text-gray-600">
                    <MessageSquare size={18} />
                  </div>
                  <div className="grow overflow-hidden text-sm text-ellipsis whitespace-nowrap font-medium">
                    {conversation.title}
                  </div>
                </button>

                {selectedConversationId === conversation.id && (
                  <div className="px-8 py-1 mb-2">
                    <div className="text-xs text-gray-700 truncate">
                      {conversation.lastMessage}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {conversation.timestamp}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </aside>
      </ScrollArea>
    </Card>
  );
}
