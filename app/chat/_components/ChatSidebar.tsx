"use client";

import { cn } from "@/app/lib/utils";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <Card className={cn("w-80 h-[calc(100vh-4rem)]", className)}>
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">대화 내역</h2>
      </div>
      <ScrollArea className="h-[calc(100%-4rem)]">
        <div className="p-2 space-y-2">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg hover:bg-accent transition-colors",
                selectedConversationId === conversation.id && "bg-accent"
              )}
            >
              <div className="font-medium truncate">{conversation.title}</div>
              <div className="text-sm text-muted-foreground truncate">
                {conversation.lastMessage}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {conversation.timestamp}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
