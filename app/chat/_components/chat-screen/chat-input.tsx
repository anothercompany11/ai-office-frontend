"use client";

import { User } from "@/app/api/dto";
import { useAuth } from "@/app/context/AuthContext";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  user: User;
}

const ChatInput = ({ onSend, disabled = false, user }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { incrementPromptCount } = useAuth(); // 요청 횟수 증가 핸들러
  const is_limit_reached = user.prompt_count === user.prompt_limit; // 요청 횟수 초과 여부

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [message]);

  // 메세지 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      incrementPromptCount(user);
      onSend(message);
      setMessage("");
    }
  };

  // 엔터키 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 최대 요청 가능 횟수 초과시
    if (is_limit_reached) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isDisabled = !message.trim() || disabled || is_limit_reached;
  return (
    <div className="flex flex-col gap-3 web:gap-6">
      <div className="relative">
        <form onSubmit={handleSubmit} className="flex relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="무엇을 도와드릴까요?"
            className="w-full bg-white disabled:placeholder:text-gray-300 disabled:bg-gray-100 rounded-lg shadow-[0px_16px_14px_0px_rgba(0,0,0,0.1)] tab:rounded-[20px] resize-none text-body-2 focus-visible:outline-none py-6 px-6"
            rows={1}
            maxLength={150}
            disabled={disabled || is_limit_reached}
          />

          <div className="absolute right-0 bottom-0 mr-[26px] mb-5 tab:mb-4">
            <button
              type="submit"
              className={`flex disabled:cursor-auto items-center justify-center rounded-full size-8 tab:size-10 ${
                isDisabled ? "bg-component-alternative" : "bg-label-strong"
              }`}
              disabled={isDisabled}
            >
              <ArrowUp className="size-6 text-white" />
              <span className="sr-only">전송</span>
            </button>
          </div>
        </form>
      </div>
      <div className="px-3 text-label-natural hidden tab:flex text-body-s justify-between">
        <p>AI는 실수할 수 있습니다.</p>
        <p>{`남은 횟수 : ${user.prompt_count}/${user.prompt_limit}`}</p>
      </div>
      <div className="flex tab:hidden px-3 text-label-natural text-caption justify-between">
        <p>AI는 실수할 수 있습니다.</p>
        <p>{`남은 횟수 : ${user.prompt_count}/${user.prompt_limit}`}</p>
      </div>
    </div>
  );
};

export default ChatInput;
