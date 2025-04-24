"use client";

import { Send, StopCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSend, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="relative flex flex-col w-full py-2 flex-grow px-4 max-h-60 rounded-xl border border-gray-200 bg-white shadow-[0_0_10px_rgba(0,0,0,0.05)]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-row max-w-3xl w-full mx-auto"
      >
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="flex w-full flex-grow flex-col">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="AI에게 메시지 보내기..."
              className="w-full resize-none bg-transparent py-[10px] pl-3 outline-none disabled:opacity-60 text-gray-800 placeholder:text-gray-500"
              rows={1}
              style={{ maxHeight: "200px" }}
              disabled={disabled}
            />
          </div>
          <div className="absolute bottom-1.5 right-1 md:right-2">
            <button
              type="submit"
              disabled={!message.trim() || disabled}
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                message.trim() && !disabled
                  ? "bg-black text-white"
                  : "text-token-text-disabled cursor-default bg-black/10"
              } px-2 py-1`}
            >
              {disabled ? (
                <StopCircle className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">전송</span>
            </button>
          </div>
        </div>
      </form>
      <div className="px-2 py-1 text-xs text-gray-600 text-center w-full">
        <span>저작권이 있는 콘텐츠에 주의하세요</span>
      </div>
    </div>
  );
};

export default ChatInput;
