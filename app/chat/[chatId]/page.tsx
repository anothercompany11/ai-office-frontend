"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useConversations } from "@/app/context/ConversationContext";
import ChatHeader from "../_components/chat-header/chat-header";
import ChatInterface from "../_components/chat-screen/chat-interface";
import { LoadIcon } from "@/app/shared/loading";

export default function ChatDetailPage() {
  const { chatId } = useParams();
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const {
    selectConversation,
    currentId,
    updateConversation,
    pendingFirstMsg,
    clearPendingFirstMsg,
    finalizeNewConversation,
  } = useConversations();

  // ID가 'new'인 경우 새 대화 시작
  const isNewChat = chatId === "new";

  // URL의 대화 ID로 현재 대화 설정
  useEffect(() => {
    if (chatId && typeof chatId === "string") {
      selectConversation(chatId);
    }
  }, [chatId, selectConversation]);

  // 새 대화 ID가 생성되면 URL 업데이트
  const handleFinalizeNewConversation = (realId: string) => {
    finalizeNewConversation(realId);
    router.replace(`/chat/${realId}`);
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
      <div className="h-[calc(100vh-67px)] overflow-y-auto mt-12 tab:mt-0">
        <ChatInterface
          user={user}
          key={chatId as string}
          conversationId={chatId as string}
          onUpdateConversation={updateConversation}
          isNewChat={isNewChat}
          initialMessage={pendingFirstMsg}
          onInitialHandled={clearPendingFirstMsg}
          finalizeNewConversation={handleFinalizeNewConversation}
        />
      </div>
    </div>
  );
}
