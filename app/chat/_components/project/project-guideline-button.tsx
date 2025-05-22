import { Pencil, SquarePen } from "lucide-react";
import { useState } from "react";
import CreateGuidelineModal from "./create-guideline-modal";
import useFolders from "@/hooks/use-folder";
import { useConversations } from "@/app/context/ConversationContext";

interface ProjectGuidelineButtonProps {
  projectId: string;
}

const ProjectGuidelineButton = ({ projectId }: ProjectGuidelineButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { updateInstruction } = useFolders(useConversations().conversations);

  const handleGuidelineSubmit = async (guideline: string) => {
    try {
      await updateInstruction(projectId, guideline);
      alert("프로젝트 지침이 저장되었습니다.");
    } catch (error) {
      console.error("지침 저장 오류:", error);
      alert("지침 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <button
        className="flex flex-col gap-3 items-center w-full max-w-[338px] p-6 border border-line rounded-xl hover:bg-background-alternative transition-colors"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center gap-2 mb-2">
          <SquarePen size={24} className="text-label-alternative" />
          <h3 className="text-title-m text-label-strong">지침 추가</h3>
        </div>
        <p className="text-body-s text-label text-center">
          AI에게 가장 먼저 적용이 필요한 지침을 입력해보세요.
        </p>
      </button>

      <CreateGuidelineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleGuidelineSubmit}
      />
    </>
  );
};

export default ProjectGuidelineButton;
