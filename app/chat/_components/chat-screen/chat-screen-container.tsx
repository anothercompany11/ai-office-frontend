import ChatInterface from "./chat-interface";
import ChatScreenHeader from "./chat-screen-header";
import EmptyChatScreen from "./empty-chat-screen";

interface ChatScreenContainerProps {
  currentId: string | null; // 현재 선택된 대화 ID (없을 수 있으므로 null 허용)
  createNewConversation: () => void; // 새 대화 생성 함수
  updateConversation: (id: string, data: Partial<any>) => void; // 대화 정보 업데이트
  assignToFolder: (
    conversationId: string,
    folderId: string | null,
  ) => Promise<void>; // 대화를 폴더에 할당하는 함수
}

const ChatScreenContainer = ({
  currentId,
  createNewConversation,
  updateConversation,
  assignToFolder,
}: ChatScreenContainerProps) => {
  return (
    <div className="flex flex-col w-full bg-line-alternative">
      <ChatScreenHeader />

      {/* 대화가 선택된 경우 */}
      {currentId ? (
        <ChatInterface
          key={currentId}
          conversationId={currentId}
          onUpdateConversation={updateConversation}
          onAssignToFolder={assignToFolder}
          isNewChat={currentId === "new"}
        />
      ) : (
        /* 대화가 없을 경우 표시할 빈 화면 상태 */
        // <div className="flex h-full items-center justify-center">
        //   <div className="text-center">
        //     <h2 className="mb-4 text-2xl font-semibold">대화가 없습니다</h2>
        //     <p className="mb-6 text-gray-500">
        //       새 대화를 시작하거나 왼쪽 메뉴에서 대화를 선택하세요.
        //     </p>
        //     <button
        //       onClick={createNewConversation}
        //       className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
        //     >
        //       새 대화 시작하기
        //     </button>
        //   </div>
        // </div>
        <EmptyChatScreen />
      )}
    </div>
  );
};

export default ChatScreenContainer;
