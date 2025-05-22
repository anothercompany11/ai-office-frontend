"use client";
import ConversationSidebar from "./_components/sidebar/conversation-sidebar";
import { useEffect, useState } from "react";
import { LoadIcon } from "../shared/loading";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { SidebarProvider } from "../context/SidebarContext";
import { ConversationProvider, useConversations } from "../context/ConversationContext";
import { ProjectProvider } from "../context/ProjectContext";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  // 로그인 유무에 따른 처리
  useEffect(() => {
    if (!isAuthLoading && !user) router.push("/auth");
  }, [user, isAuthLoading, router]);

  if (isAuthLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadIcon />
      </div>
    );
  }

  return (
    <ConversationProvider>
      <ProjectProvider>
        <SidebarProvider>
          <ConversationWrapper children={children} />
        </SidebarProvider>
      </ProjectProvider>
    </ConversationProvider>
  );
}

// 래퍼 컴포넌트: ConversationContext를 사용하기 위한 컴포넌트
function ConversationWrapper({ children }: { children: React.ReactNode }) {
  const {
    conversations,
    isLoadingConversations,
    currentId,
    loadConversations,
    selectConversation,
    startBlankConversation,
    deleteConversation,
  } = useConversations();

  const [initialLoaded, setInitialLoaded] = useState(false);

  // 최초 로드 여부 업데이트
  useEffect(() => {
    if (!isLoadingConversations) setInitialLoaded(true);
  }, [isLoadingConversations]);

  // 대화 목록 로드
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  if (!initialLoaded && isLoadingConversations) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadIcon />
      </div>
    );
  }

  return (
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
  );
}
