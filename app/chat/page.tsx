"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "./_components/chat-screen/chat-interface";
import ConversationSidebar from "./_components/sidebar/conversation-sidebar";
import useConversations from "@/hooks/use-conversation";
import { useAuth } from "../context/AuthContext";
import ChatScreenHeader from "./_components/chat-screen/chat-screen-header";
import ChatScreenContainer from "./_components/chat-screen/chat-screen-container";

export default function ChatPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // 채팅 관리 훅
  const {
    conversations,
    isLoadingConversations,
    currentId,
    loadConversations,
    selectConversation,
    createNewConversation,
    deleteConversation,
    updateConversation,
    assignToFolder,
  } = useConversations();

  // 로그인 유무에 따른 처리
  useEffect(() => {
    if (!isAuthLoading && !user) router.push("/auth");
    if (user) loadConversations();
  }, [user, isAuthLoading, router, loadConversations]);

  if (isAuthLoading || isLoadingConversations) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-xl">로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <aside className="w-80 min-w-80 border-r border-gray-200">
        <ConversationSidebar
          conversations={conversations}
          currentConversationId={currentId}
          onSelectConversation={selectConversation}
          onNewConversation={createNewConversation}
          onDeleteConversation={deleteConversation}
        />
      </aside>

      <ChatScreenContainer
        currentId={currentId}
        createNewConversation={createNewConversation}
        updateConversation={updateConversation}
        assignToFolder={assignToFolder}
      />
    </div>
  );
}
