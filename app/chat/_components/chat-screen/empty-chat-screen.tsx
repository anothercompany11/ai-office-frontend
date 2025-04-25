import GuideBox from "../guide/guide-box";
import ChatInput from "./chat-input";

const EmptyChatScreen = ({
  createNewConversation,
}: {
  createNewConversation: (firstMsg: string, folderId?: string) => Promise<void>;
}) => {
  return (
    <div className="h-full px-5 py-20">
      <GuideBox />
      <ChatInput onSend={createNewConversation} />
    </div>
  );
};
export default EmptyChatScreen;
