import { FolderClosed } from "lucide-react";
import ProjectGuidelineButton from "./project-guideline-button";
import ProjectNewChatButton from "./project-new-chat-button";

interface EmptyProjectCardProps {
  projectId: string;
}

const EmptyProjectCard = ({ projectId }: EmptyProjectCardProps) => {
  return (
    <div className="flex flex-col gap-5 items-center">
      <div className="flex flex-col items-center w-full justify-center h-full p-12 bg-background-alternative rounded-lg border-2 border-dashed border-line">
        <FolderClosed size={32} className="text-label-alternative mb-4" />
        <p className="text-title-m text-label-natural mb-2">
          이 프로젝트에는 아직 대화가 없습니다
        </p>
        <p className="text-body-s text-label-assistive mb-6">
          새로운 대화를 시작하여 프로젝트를 채워보세요
        </p>
        <ProjectNewChatButton projectId={projectId} />
      </div>
      <ProjectGuidelineButton projectId={projectId} />
    </div>
  );
};
export default EmptyProjectCard;
