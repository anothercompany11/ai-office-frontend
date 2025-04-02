"use client";

import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "새로운 대화",
      lastMessage: "안녕하세요!",
      timestamp: "2024-03-20 14:30",
    },
  ]);
  const [selectedConversationId, setSelectedConversationId] =
    useState<string>("1");

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date().toLocaleString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // TODO: API 호출 구현
    // const response = await fetch('/api/chat', {
    //   method: 'POST',
    //   body: JSON.stringify({ message: content }),
    // });
    // const data = await response.json();

    // const assistantMessage: Message = {
    //   id: Date.now().toString(),
    //   content: data.message,
    //   role: 'assistant',
    //   timestamp: new Date().toLocaleString(),
    // };
    // setMessages((prev) => [...prev, assistantMessage]);
  };

  return (
    <div className="flex h-screen">
      <ChatSidebar
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
      />
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.content}
                role={message.role}
                timestamp={message.timestamp}
              />
            ))}
          </div>
        </ScrollArea>
        <ChatInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}
