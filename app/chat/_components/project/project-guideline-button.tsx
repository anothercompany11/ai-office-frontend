import { SquarePen } from "lucide-react";
import { useState } from "react";
import CreateGuidelineModal from "./create-guideline-modal";
import useFolders from "@/hooks/use-folder";
import { useConversations } from "@/app/context/ConversationContext";
import OneButtonModal from "../sidebar/one-button-modal";

interface ProjectGuidelineButtonProps {
  projectId: string;
}

const ProjectGuidelineButton = ({ projectId }: ProjectGuidelineButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const { folders, updateInstruction } = useFolders(
    useConversations().conversations,
  );

  // 현재 프로젝트의 지침
  const currentFolder = folders.find((folder) => folder.id === projectId);
  const currentInstruction = currentFolder?.instruction || "";

  const handleGuidelineSubmit = async (guideline: string) => {
    try {
      await updateInstruction(projectId, guideline);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("지침 저장 오류:", error);
      setIsErrorModalOpen(true);
    }
  };

  return (
    <>
      <button
        className="flex flex-col gap-3 w-full max-w-[342px] p-6 border border-line rounded-xl hover:bg-background-alternative transition-colors"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center gap-2">
          <SquarePen size={24} className="text-label-strong" />
          <h3 className="text-title-m text-label-strong">지침 추가</h3>
        </div>
        <p className="text-body-s text-label">
          AI에게 가장 먼저 적용이 필요한 지침을 입력해보세요.
        </p>
      </button>

      <CreateGuidelineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleGuidelineSubmit}
        initialInstruction={currentInstruction}
      />

      <OneButtonModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onConfirm={() => setIsSuccessModalOpen(false)}
        title="저장 완료"
        description="프로젝트 지침이 저장되었습니다."
      />

      <OneButtonModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        onConfirm={() => setIsErrorModalOpen(false)}
        title="저장 실패"
        description="지침 저장 중 오류가 발생했습니다."
      />
    </>
  );
};

export default ProjectGuidelineButton;
