"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useConversations } from "../context/ConversationContext";
import EmptyChatScreen from "./_components/chat-screen/empty-chat-screen";
import ChatHeader from "./_components/chat-header/chat-header";
import { LoadIcon } from "../shared/loading";

export default function ChatPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { createNewConversation } = useConversations();

  // 새 대화 시작 핸들러
  const handleCreateNewConversation = (firstMsg: string) => {
    createNewConversation(firstMsg);
    router.push("/chat/new"); // 'new' 페이지로 리다이렉트
  };

  if (isAuthLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadIcon />
      </div>
    );
  }

  return (
    <div className="flex flex-col web:h-[100vh] h-[100dvh] w-full bg-line-alternative">
      <ChatHeader />
      <EmptyChatScreen
        user={user}
        createNewConversation={handleCreateNewConversation}
      />
    </div>
  );
}
