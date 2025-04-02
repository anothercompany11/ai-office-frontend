"use client";

import { conversationApi } from "@/app/lib/api";
import { MessageRole } from "@/types";
import { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import ConversationSidebar from "./ConversationSidebar";

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      role: MessageRole.ASSISTANT,
      content: "안녕하세요! 무엇을 도와드릴까요?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 메시지 목록이 변경될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 메시지 전송 처리
  const handleSendMessage = async (content: string) => {
    // 사용자 메시지 추가
    const userMessage = {
      role: MessageRole.USER,
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 스트리밍 응답 처리
      let responseContent = "";

      // 로딩 상태 표시를 위한 임시 메시지
      setMessages((prev) => [
        ...prev,
        {
          role: MessageRole.ASSISTANT,
          content: "",
        },
      ]);

      // closeHandler는 메시지 스트림을 중단하는 함수
      const closeHandler = conversationApi.sendMessageStream(
        content,
        (chunk) => {
          // 청크 단위로 응답 업데이트
          responseContent += chunk;

          // 부분적으로 응답 표시
          setMessages((prev) => {
            // 마지막 메시지가 어시스턴트의 비어있는 메시지인 경우 교체
            const newMessages = [...prev];
            const lastMessageIndex = newMessages.length - 1;

            if (
              lastMessageIndex >= 0 &&
              newMessages[lastMessageIndex].role === MessageRole.ASSISTANT
            ) {
              newMessages[lastMessageIndex] = {
                role: MessageRole.ASSISTANT,
                content: responseContent,
              };
              return newMessages;
            }

            // 예상치 못한 상황에는 새 메시지 추가
            return [
              ...prev,
              {
                role: MessageRole.ASSISTANT,
                content: responseContent,
              },
            ];
          });
        },
        () => {
          // 응답 완료
          setIsLoading(false);
        },
        (error) => {
          // 오류 처리
          console.error("스트리밍 오류:", error);
          setIsLoading(false);

          // 오류 메시지 표시
          setMessages((prev) => {
            // 마지막 메시지가 어시스턴트의 것이면 교체, 아니면 추가
            const newMessages = [...prev];
            const lastMessageIndex = newMessages.length - 1;

            if (
              lastMessageIndex >= 0 &&
              newMessages[lastMessageIndex].role === MessageRole.ASSISTANT &&
              newMessages[lastMessageIndex].content === ""
            ) {
              newMessages[lastMessageIndex] = {
                role: MessageRole.ASSISTANT,
                content: "죄송합니다. 메시지 처리 중 오류가 발생했습니다.",
              };
              return newMessages;
            }

            return [
              ...prev,
              {
                role: MessageRole.ASSISTANT,
                content: "죄송합니다. 메시지 처리 중 오류가 발생했습니다.",
              },
            ];
          });
        }
      );

      // 컴포넌트 언마운트 시 스트림 중단을 위한 클린업 함수
      return () => closeHandler();
    } catch (error) {
      console.error("메시지 전송 오류:", error);
      setIsLoading(false);

      setMessages((prev) => {
        // 마지막 메시지가 어시스턴트의 것이면 교체, 아니면 추가
        const newMessages = [...prev];
        const lastMessageIndex = newMessages.length - 1;

        if (
          lastMessageIndex >= 0 &&
          newMessages[lastMessageIndex].role === MessageRole.ASSISTANT &&
          newMessages[lastMessageIndex].content === ""
        ) {
          newMessages[lastMessageIndex] = {
            role: MessageRole.ASSISTANT,
            content: "죄송합니다. 메시지 전송 중 오류가 발생했습니다.",
          };
          return newMessages;
        }

        return [
          ...prev,
          {
            role: MessageRole.ASSISTANT,
            content: "죄송합니다. 메시지 전송 중 오류가 발생했습니다.",
          },
        ];
      });
    }
  };

  // 대화 선택 처리
  const handleSelectConversation = (id: number) => {
    // TODO: 선택된 대화로 상태 업데이트
    console.log("Selected conversation:", id);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* 사이드바 */}
      <ConversationSidebar
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
      />

      {/* 채팅 인터페이스 */}
      <div className="flex-1 flex flex-col h-full">
        {/* 채팅 메시지 영역 */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 bg-gray-50"
        >
          <div className="max-w-3xl mx-auto">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                role={message.role}
                content={message.content}
              />
            ))}

            {isLoading &&
              messages[messages.length - 1]?.role !== MessageRole.ASSISTANT && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 p-3 rounded-lg flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* 채팅 입력 영역 */}
        <div className="bg-white border-t border-gray-200">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={handleSendMessage} disabled={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
