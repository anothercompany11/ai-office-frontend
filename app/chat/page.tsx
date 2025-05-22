"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useConversations } from "../context/ConversationContext";
import EmptyChatScreen from "./_components/chat-screen/empty-chat-screen";
import ChatHeader from "./_components/chat-header/chat-header";
import { LoadIcon } from "../shared/loading";

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { createNewConversation } = useConversations();

  // URL에서 프로젝트 ID 파라미터를 가져옴
  const projectId = searchParams.get("projectId");

  // 새 대화 시작 핸들러
  const handleCreateNewConversation = (firstMsg: string) => {
    // 빈 메시지는 처리하지 않음
    if (!firstMsg.trim()) return;

    // 전체 메시지를 Context에 저장
    createNewConversation(firstMsg);

    // 프로젝트 ID가 있으면 함께 전달
    if (projectId) {
      router.push(`/chat/new?projectId=${projectId}`);
    } else {
      router.push("/chat/new");
    }
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
      <ChatHeader projectId={projectId || undefined} />
      <EmptyChatScreen
        user={user}
        projectId={projectId || undefined}
        createNewConversation={handleCreateNewConversation}
      />
    </div>
  );
}
