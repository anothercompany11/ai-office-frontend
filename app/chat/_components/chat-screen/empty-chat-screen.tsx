import { useGetCurrentDevice } from "@/hooks/use-get-current-device";
import GuideBox from "../guide/guide-box";
import SwipeGuideBox from "../guide/swipe-guide-box";
import ChatInput from "./chat-input";

const EmptyChatScreen = ({
  createNewConversation,
}: {
  createNewConversation: (firstMsg: string) => void;
}) => {
  const isMob = useGetCurrentDevice() === "mob";
  return (
    <div className="h-full flex flex-col justify-between px-5 pt-10 tab:pt-20">
      <div className=" h-full tab:block flex items-center">
        {isMob ? <SwipeGuideBox /> : <GuideBox />}
      </div>
      <div className="w-full sticky max-w-[680px] tab:px-4 web:px-0 bg-line-alternative mx-auto mt-5 bottom-0 z-10">
        <div className="tab:pb-10 tab:px-0 web:pb-20 mx-auto">
          <ChatInput onSend={createNewConversation} />
        </div>
      </div>
    </div>
  );
};
export default EmptyChatScreen;
