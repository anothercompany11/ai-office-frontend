import { User } from "@/app/api/dto";
import ChatInput from "./chat-input";
import { useProject } from "@/app/context/ProjectContext";

const EmptyChatScreen = ({
  createNewConversation,
  user,
  projectId,
}: {
  createNewConversation: (firstMsg: string) => void;
  user: User;
  projectId?: string;
}) => {
  const { currentProject } = useProject();
  const isProjectPage = !!projectId;

  // 메시지 전송 핸들러
  const handleSendMessage = (content: string) => {
    // 메시지가 잘리지 않도록 전체 메시지 전달
    createNewConversation(content);
  };

  return (
    <div className="h-full flex-col relative web:gap-10 flex items-center  justify-center px-5">
      <div className="flex flex-col gap-2 text-center pb-[116px] web:pb-0">
        <p className="text-title-s text-label-natural">
          {isProjectPage ? currentProject?.name : "AI 오피스"}
        </p>
        <p className="text-[24px] web:whitespace-normal text-label-strong font-hakgyo-ansim">
          {isProjectPage
            ? `이 프로젝트의\n새로운 질문을 입력해주세요`
            : "지금 어떤 생각을 하고 있으신가요?"}
        </p>
      </div>
      <div className="w-full web:mt-0 absolute web:relative pb-4 web:pb-0 max-w-[680px] px-4 web:px-0 bg-line-alternative mx-auto bottom-0 z-10">
        <div className="tab:pb-10 tab:px-0 web:pb-20 mx-auto">
          <ChatInput user={user} onSend={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};
export default EmptyChatScreen;
