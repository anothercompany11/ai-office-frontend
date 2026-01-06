"use client";

import { User } from "@/app/api/dto";
import { useAuth } from "@/app/context/AuthContext";
import { useGetCurrentDevice } from "@/hooks/use-get-current-device";
import { ArrowUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import CoinChargeButton from "../button/coin-charge-button";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  user: User;
}

const ChatInput = ({ onSend, disabled = false, user }: ChatInputProps) => {
  const device = useGetCurrentDevice(); // "mob" | "tab" | "web"
  const [message, setMessage] = useState("");
  const [isComposing, setIsComposing] = useState(false);
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

  // 공통 메시지 전송 함수
  const sendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled && !is_limit_reached) {
      incrementPromptCount(user);
      onSend(trimmedMessage);
      setMessage("");
    }
  };

  // 메세지 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  // 엔터키 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 최대 요청 가능 횟수 초과시
    if (is_limit_reached) return;

    if (e.key === "Enter" && !e.shiftKey && !isComposing && device === "web") {
      e.preventDefault(); // 엔터키의 기본 동작 방지
      sendMessage();
    }
  };

  // IME 입력 처리
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
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
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="무엇을 도와드릴까요?"
            className="w-full bg-white disabled:placeholder:text-gray-300 disabled:bg-gray-100 rounded-lg shadow-[0px_16px_14px_0px_rgba(0,0,0,0.1)] tab:rounded-[20px] resize-none text-body-2 focus-visible:outline-none py-6 px-6"
            rows={1}
            // maxLength={150}
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
        <div className="flex gap-[6px]">
          <div className="flex px-[10px] tab:px-[13px] bg-[#DADADA] rounded-full gap-1 items-center">
            <Image
              src={"/png/icon/coin.png"}
              alt="대화 토큰"
              width={23}
              height={22}
              className="w-[23px] -mt-[0.5px] h-[22px]"
            />
            <p className="flex -mb-[1px] text-[#212121] gap-1 leading-[22px] items-center text-[13px] tab:text-[18px] font-extrabold">
              <span className="">COIN X</span>
              <span className="">{remainingCount}</span>
            </p>
          </div>
          <CoinChargeButton />
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
