"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  role: "user" | "assistant";
  timestamp: string;
}

export function ChatMessage({ message, role, timestamp }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full",
        role === "user" ? "justify-end" : "justify-start"
      )}
    >
      <Card
        className={cn(
          "max-w-[80%] p-4",
          role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        <div className="whitespace-pre-wrap">{message}</div>
        <div className="text-xs mt-2 opacity-70">{timestamp}</div>
      </Card>
    </div>
  );
}
