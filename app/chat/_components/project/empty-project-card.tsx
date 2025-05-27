import { FolderClosed, MessageCircle, MessageCircleMore } from "lucide-react";
import ProjectGuidelineButton from "./project-guideline-button";
import ProjectNewChatButton from "./project-new-chat-button";
import { useProject } from "@/app/context/ProjectContext";
import { FolderDetail } from "@/app/api/dto";

interface EmptyProjectCardProps {
  projectId: string;
  currentProject: FolderDetail;
}

const EmptyProjectCard = ({
  projectId,
  currentProject,
}: EmptyProjectCardProps) => {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-subtitle-l flex items-center text-label-strong">
        <FolderClosed size={24} className="inline-block mr-2" />
        {currentProject.name}
      </h2>
      <div className="flex flex-col gap-6 items-center w-full justify-center h-full p-5 web:p-12 rounded-lg border-2 border-dashed border-line">
        <div className="flex flex-col gap-[6px] items-center">
          <MessageCircleMore size={24} className="text-label-strong" />
          <p className="text-title-l whitespace-pre-line web:whitespace-normal text-center web:text-left text-label-strong">
            {`이 프로젝트의 새로운 대화를\n시작해보세요.`}
          </p>
          <p className="text-body-s text-center web:text-left text-label-alternative">
            {`새로운 대화를 시작하여 프로젝트를 채워보세요.`}
          </p>
        </div>
        <ProjectNewChatButton projectId={projectId} />
      </div>
      <ProjectGuidelineButton projectId={projectId} />
    </div>
  );
};
export default EmptyProjectCard;
