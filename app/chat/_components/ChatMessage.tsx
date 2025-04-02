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
    <div
      className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] px-4 py-3 rounded-lg ${
          isUser
            ? "bg-black text-white rounded-tr-none"
            : "bg-gray-200 text-black rounded-tl-none"
        }`}
      >
        <p className="whitespace-pre-wrap">{content}</p>
        {timestamp && (
          <p className="text-xs opacity-60 mt-1 text-right">{timestamp}</p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
