import ChatHeader from "../chat-header/chat-header";
import ChatInterface from "./chat-interface";
import EmptyChatScreen from "./empty-chat-screen";

interface ChatScreenContainerProps {
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
  isSidebarVisible: boolean;
  setIsSidebarVisible: (visible: boolean) => void;
}

const ChatScreenContainer = ({
  currentId,
  createNewConversation,
  updateConversation,
  assignToFolder,
  pendingFirstMsg,
  clearPendingFirstMsg,
  finalizeNewConversation,
  isSidebarVisible,
  setIsSidebarVisible,
}: ChatScreenContainerProps) => {
  return (
    <div className="flex flex-col w-full bg-line-alternative">
      <ChatHeader
        isSidebarVisible={isSidebarVisible}
        setIsSidebarVisible={setIsSidebarVisible}
      />

      {/* 대화가 선택된 경우 */}
      {currentId ? (
        <div className="h-[calc(100vh-67px)] overflow-y-auto">
          <ChatInterface
            key={currentId}
            conversationId={currentId}
            onUpdateConversation={updateConversation}
            onAssignToFolder={assignToFolder}
            isNewChat={currentId === "new"}
            initialMessage={pendingFirstMsg}
            onInitialHandled={clearPendingFirstMsg}
            finalizeNewConversation={finalizeNewConversation}
          />
        </div>
      ) : (
        /* 대화가 없을 경우 표시할 빈 화면 상태 */
        <EmptyChatScreen createNewConversation={createNewConversation} />
      )}
    </div>
  );
};

export default ChatScreenContainer;
