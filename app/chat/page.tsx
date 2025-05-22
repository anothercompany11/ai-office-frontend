"use client";

import { useAuth } from "../context/AuthContext";
import ChatScreenContainer from "./_components/chat-screen/chat-screen-container";
import { LoadIcon } from "../shared/loading";
import { useConversations } from "../context/ConversationContext";

export default function ChatPage() {
  const { user, isLoading: isAuthLoading } = useAuth();

  const {
    currentId,
    createNewConversation,
    updateConversation,
    pendingFirstMsg,
    clearPendingFirstMsg,
    assignToFolder,
    finalizeNewConversation,
  } = useConversations();

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
