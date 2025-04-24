import { CircleHelp } from "lucide-react";

const ChatScreenHeader = () => {
  return (
    <div className="py-5 px-8 flex justify-between items-center">
      <p className="text-subtitle-l font-hakgyo-ansim">Chat AI 오피스</p>
      <button className="flex items-center justify-center">
        <CircleHelp className="size-6 text-primary" />
      </button>
    </div>
  );
};
export default ChatScreenHeader;
