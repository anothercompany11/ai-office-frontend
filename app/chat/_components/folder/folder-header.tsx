import { PlusIcon } from "lucide-react";

const FolderHeader = ({ onNew }: { onNew: () => void }) => {
  return (
    <header className="flex justify-between items-center py-[8.5px]">
      <span className="text-title-xs">라이브러리</span>
      <button onClick={onNew}>
        <PlusIcon size={14} />
      </button>
    </header>
  );
};
export default FolderHeader;
