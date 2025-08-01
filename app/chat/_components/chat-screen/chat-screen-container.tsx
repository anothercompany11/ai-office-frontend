"use client";

import { User } from "@/app/api/dto";
import ChatHeader from "../chat-header/chat-header";
import ChatInterface from "./chat-interface";
import EmptyChatScreen from "./empty-chat-screen";
import { useSidebar } from "@/app/context/SidebarContext";

interface ChatScreenContainerProps {
  user: User; // 사용자 정보
  currentId: string | null; // 현재 선택된 대화 ID (없을 수 있으므로 null 허용)
  createNewConversation: (firstMsg: string) => void; // 새 대화 생성 함수
  updateConversation: (id: string, data: Partial<any>) => void; // 대화 정보 업데이트
  assignToFolder: (
    conversationId: string,
    folderId: string | null,
  ) => Promise<void>; // 대화를 폴더에 할당하는 함수
  pendingFirstMsg: string | null;
  clearPendingFirstMsg: () => void;
  finalizeNewConversation: (realId: string) => void;
}

const ChatScreenContainer = ({
  user,
  currentId,
  createNewConversation,
  updateConversation,
  assignToFolder,
  pendingFirstMsg,
  clearPendingFirstMsg,
  finalizeNewConversation,
}: ChatScreenContainerProps) => {
  return (
    <div className="flex flex-col web:h-[100vh] h-[100dvh] w-full bg-line-alternative">
      <ChatHeader />

      {/* 대화가 선택된 경우 */}
      {currentId ? (
        <div className="h-[calc(100vh-67px)] overflow-y-auto mt-12 tab:mt-0">
          <ChatInterface
            user={user}
            key={currentId}
            conversationId={currentId}
            onUpdateConversation={updateConversation}
            isNewChat={currentId === "new"}
            initialMessage={pendingFirstMsg}
            onInitialHandled={clearPendingFirstMsg}
            finalizeNewConversation={finalizeNewConversation}
          />
        </div>
      ) : (
        /* 대화가 없을 경우 표시할 빈 화면 상태 */
        <EmptyChatScreen
          user={user}
          createNewConversation={createNewConversation}
        />
      )}
    </div>
  );
};

export default ChatScreenContainer;
