'use client'
import useConversations from "@/hooks/use-conversation";
import ConversationSidebar from "./_components/sidebar/conversation-sidebar";
import { useEffect, useState } from "react";
import { LoadIcon } from "../shared/loading";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "../context/SidebarContext";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [initialLoaded, setInitialLoaded] = useState(false);

  // 채팅 관리 훅
  const {
    conversations,
    isLoadingConversations,
    currentId,
    loadConversations,
    selectConversation,
    startBlankConversation,
    deleteConversation,
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
    <SidebarProvider>
      <div className="flex web:h-[100vh] h-[100dvh]">
        <ConversationSidebar
          conversations={conversations}
          currentConversationId={currentId}
          onSelectConversation={selectConversation}
          onNewConversation={startBlankConversation}
          onDeleteConversation={deleteConversation}
        />
        <main className="w-full">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}