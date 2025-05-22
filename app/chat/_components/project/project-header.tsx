import { PlusIcon } from "lucide-react";

const ProjectHeader = ({ onNew }: { onNew: () => void }) => {
  return (
    <header className="flex justify-between items-center py-[8.5px]">
      <span className="text-title-xs">프로젝트</span>
      <button onClick={onNew}>
        <PlusIcon size={14} />
      </button>
    </header>
  );
};
export default ProjectHeader;
