import { PlusIcon } from "lucide-react";

const SidebarChatHeader = ({ onNew }: { onNew: () => void }) => {
  return (
    <header className="flex justify-between items-center py-[8.5px]">
      <span className="text-title-xs">지난 대화</span>
      <button onClick={onNew}>
        <PlusIcon size={14} />
      </button>
    </header>
  );
};
export default SidebarChatHeader;
