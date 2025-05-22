"use client";

import { User } from "@/app/api/dto";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  user: User;
  onChargeRequest?: () => void;
}

const ChatInput = ({ onSend, disabled = false, user, onChargeRequest }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { incrementPromptCount } = useAuth(); // 요청 횟수 증가 핸들러
  const is_limit_reached = user.prompt_count === user.prompt_limit; // 요청 횟수 초과 여부
  const remainingCount = user.prompt_limit - user.prompt_count;

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
      <div className="pl-3 text-label-natural items-center flex justify-between">
        <p className="text-caption tab:hidden">AI는 실수할 수 있습니다.</p>
        <p className="text-body-s tab:block hidden">AI는 실수할 수 있습니다.</p>
        <div className="flex gap-3">
          {remainingCount === 0 ? (
            <Button
              size={"sm"}
              variant="secondary"
              onClick={onChargeRequest}
            >
              원코?
            </Button>
          ) : (
            <div className="flex gap-1 items-center">
              <Image
                src={"/svg/token.svg"}
                alt="대화 토큰"
                width={28}
                height={28}
                className="size-[28px]"
              />
              <p className="flex gap-1 items-center">
                <span className="text-label-alternative text-caption">x</span>
                <span className="text-body-l">{remainingCount}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
