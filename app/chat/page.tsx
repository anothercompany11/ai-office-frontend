"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ConversationSidebar from "./_components/sidebar/conversation-sidebar";
import ConversationMobSidebar from "./_components/sidebar/conversation-mob-sidebar";
import useConversations from "@/hooks/use-conversation";
import { useAuth } from "../context/AuthContext";
import ChatScreenContainer from "./_components/chat-screen/chat-screen-container";
import ChatHeader from "./_components/chat-header/chat-header";

export default function ChatPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  // 채팅 관리 훅
  const {
    conversations,
    isLoadingConversations,
    currentId,
    loadConversations,
    selectConversation,
    startBlankConversation,
    createNewConversation,
    deleteConversation,
    updateConversation,
    pendingFirstMsg,
    clearPendingFirstMsg,
    assignToFolder,
    finalizeNewConversation,
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
      <div className="hidden web:block">
        <ConversationSidebar
          conversations={conversations}
          currentConversationId={currentId}
          onSelectConversation={selectConversation}
          onNewConversation={startBlankConversation}
          onDeleteConversation={deleteConversation}
          isSidebarVisible={isSidebarVisible}
          setIsSidebarVisible={setIsSidebarVisible}
        />
      </div>
      <div className="block web:hidden">
        <ConversationMobSidebar
          conversations={conversations}
          currentConversationId={currentId}
          onSelectConversation={selectConversation}
          onNewConversation={startBlankConversation}
          onDeleteConversation={deleteConversation}
          isSidebarVisible={isSidebarVisible}
          setIsSidebarVisible={setIsSidebarVisible}
        />
      </div>

      {/* <ChatHeader
          isSidebarVisible={isSidebarVisible}
          setIsSidebarVisible={setIsSidebarVisible}
        /> */}
      <ChatScreenContainer
        currentId={currentId}
        createNewConversation={createNewConversation}
        updateConversation={updateConversation}
        assignToFolder={assignToFolder}
        pendingFirstMsg={pendingFirstMsg}
        clearPendingFirstMsg={clearPendingFirstMsg}
        finalizeNewConversation={finalizeNewConversation}
        isSidebarVisible={isSidebarVisible}
        setIsSidebarVisible={setIsSidebarVisible}
      />
    </div>
  );
}
