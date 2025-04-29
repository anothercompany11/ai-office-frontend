"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ConversationSidebar from "./_components/sidebar/conversation-sidebar";
import useConversations from "@/hooks/use-conversation";
import { useAuth } from "../context/AuthContext";
import ChatScreenContainer from "./_components/chat-screen/chat-screen-container";
import { LoadIcon } from "../shared/loading";

export default function ChatPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

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

  // 최초 로드 여부 업데이트
  useEffect(() => {
    if (!isLoadingConversations) setInitialLoaded(true);
  }, [isLoadingConversations]);

  // 로그인 유무에 따른 처리
  useEffect(() => {
    if (!isAuthLoading && !user) router.push("/auth");
    if (user) loadConversations();
  }, [user, isAuthLoading, router, loadConversations]);

  if (isAuthLoading || (!initialLoaded && isLoadingConversations) || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadIcon />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={currentId}
        onSelectConversation={selectConversation}
        onNewConversation={startBlankConversation}
        onDeleteConversation={deleteConversation}
        isSidebarVisible={isSidebarVisible}
        setIsSidebarVisible={setIsSidebarVisible}
      />

      <ChatScreenContainer
        user={user}
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
