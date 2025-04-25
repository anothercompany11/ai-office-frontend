"use client";

import { ArrowUp, CircleArrowUp, Send, StopCircle } from "lucide-react";
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
    <div className="relative bg-white rounded-t-[20px] tab:rounded-[20px] shadow-[0_0_10px_rgba(0,0,0,0.05)]">
      <form onSubmit={handleSubmit} className="flex relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="무엇을 도와드릴까요?"
          className="w-full resize-none text-body-2 focus-visible:outline-none py-6 px-6"
          rows={1}
          style={{ maxHeight: "200px" }}
          disabled={disabled}
        />

        <div className="absolute right-0 bottom-0 mr-[26px] mb-5 tab:mb-4">
          <button
            type="submit"
            className="flex items-center justify-center rounded-full bg-component-alternative size-8 tab:size-10"
            disabled={!message.trim() || disabled}
          >
            <ArrowUp className="size-6 text-white" />
            <span className="sr-only">전송</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
