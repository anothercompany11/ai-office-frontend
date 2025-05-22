"use client";

import { useState } from "react";
import useConversations from "@/hooks/use-conversation";
import { useAuth } from "../context/AuthContext";
import ChatScreenContainer from "./_components/chat-screen/chat-screen-container";
import { LoadIcon } from "../shared/loading";
import { useSidebar } from "../context/SidebarContext";

export default function ChatPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { isSidebarVisible } = useSidebar();
  
  // 채팅 관리 훅
  const {
    currentId,
    createNewConversation,
    updateConversation,
    pendingFirstMsg,
    clearPendingFirstMsg,
    assignToFolder,
    finalizeNewConversation,
  } = useConversations();

  console.log("현재 사이드바 상태:", isSidebarVisible);

  if (isAuthLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadIcon />
      </div>
    );
  }
  return (
    <ChatScreenContainer
      user={user}
      currentId={currentId}
      createNewConversation={createNewConversation}
      updateConversation={updateConversation}
      assignToFolder={assignToFolder}
      pendingFirstMsg={pendingFirstMsg}
      clearPendingFirstMsg={clearPendingFirstMsg}
      finalizeNewConversation={finalizeNewConversation}
    />
  );
}
