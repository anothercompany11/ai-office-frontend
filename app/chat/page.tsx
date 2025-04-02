"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageRole } from "@/types";
import { PlusCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ChatInput from "./_components/ChatInput";
import ChatMessage from "./_components/ChatMessage";

// Tailwind CSS 테스트 컴포넌트
const TailwindTest = () => {
  return (
    <div className="fixed top-4 right-4 p-4 bg-white border-2 border-blue-500 shadow-lg rounded-lg z-50">
      <h3 className="text-lg font-bold text-blue-600 mb-2">
        TailwindCSS 테스트
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-red-500 text-white p-2 rounded">빨간색</div>
        <div className="bg-green-500 text-white p-2 rounded">초록색</div>
        <div className="bg-blue-500 text-white p-2 rounded">파란색</div>
        <div className="bg-yellow-500 text-black p-2 rounded">노란색</div>
      </div>
    </div>
  );
};

interface Message {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messages: Message[];
}

// 더미 데이터
const dummyAssistantResponse = [
  "안녕하세요! AI 챗봇입니다. 무엇을 도와드릴까요?",
  "그것에 대한 답변은 다음과 같습니다. 먼저 문제를 이해해야 합니다...",
  "수학 문제에 대한 질문이군요. 이 문제는 다음과 같이 풀 수 있습니다...",
  "물리학 개념에 대해 설명해 드리겠습니다. 이 개념은...",
  "네, 과제에 도움이 필요하신 것 같네요. 어떤 부분이 어려우신가요?",
];

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "새로운 대화",
      lastMessage: "안녕하세요!",
      timestamp: "2024-03-20 14:30",
      messages: [],
    },
  ]);
  const [selectedConversationId, setSelectedConversationId] =
    useState<string>("1");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 선택된 대화 가져오기
  const selectedConversation =
    conversations.find((c) => c.id === selectedConversationId) ||
    conversations[0];

  useEffect(() => {
    scrollToBottom();
  }, [selectedConversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    setIsLoading(true);

    const timestamp = new Date().toLocaleString();
    const userMessage: Message = {
      id: `${Date.now()}-user`,
      content,
      role: MessageRole.USER,
      timestamp,
    };

    // 대화 업데이트
    setConversations((prev) => {
      return prev.map((conv) => {
        if (conv.id === selectedConversationId) {
          return {
            ...conv,
            lastMessage: content,
            timestamp,
            messages: [...conv.messages, userMessage],
          };
        }
        return conv;
      });
    });

    // 딜레이 시뮬레이션 (실제로는 API 호출)
    setTimeout(() => {
      // 랜덤 응답 생성
      const randomResponse =
        dummyAssistantResponse[
          Math.floor(Math.random() * dummyAssistantResponse.length)
        ];
      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        content: randomResponse,
        role: MessageRole.ASSISTANT,
        timestamp: new Date().toLocaleString(),
      };

      // 대화 업데이트
      setConversations((prev) => {
        return prev.map((conv) => {
          if (conv.id === selectedConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, assistantMessage],
            };
          }
          return conv;
        });
      });

      setIsLoading(false);
    }, 1500);
  };

  const handleNewConversation = () => {
    const newId = Date.now().toString();
    const newConversation: Conversation = {
      id: newId,
      title: "새로운 대화",
      lastMessage: "새로운 대화가 시작되었습니다.",
      timestamp: new Date().toLocaleString(),
      messages: [],
    };

    setConversations((prev) => [...prev, newConversation]);
    setSelectedConversationId(newId);
  };

  return (
    <div className="flex h-screen bg-background">
      <TailwindTest />
      <div className="w-80 border-r p-4 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">대화 목록</h2>
          <Button variant="outline" size="icon" onClick={handleNewConversation}>
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversationId(conversation.id)}
              className={`w-full text-left p-3 rounded-lg hover:bg-accent mb-2 transition-colors ${
                selectedConversationId === conversation.id ? "bg-accent" : ""
              }`}
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
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">AI 챗봇</h1>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {selectedConversation.messages.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <p className="text-lg">새로운 대화를 시작하세요</p>
                <p className="text-sm">질문을 입력하면 AI가 답변해 드립니다.</p>
              </div>
            ) : (
              selectedConversation.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  role={message.role}
                  timestamp={message.timestamp}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
          {isLoading && (
            <div className="text-sm text-center mt-2 text-muted-foreground">
              AI가 응답을 생성 중입니다...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
