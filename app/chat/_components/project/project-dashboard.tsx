import { FolderClosed } from "lucide-react";
import ProjectNewChatButton from "./project-new-chat-button";
import { FolderDetail } from "@/app/api/dto";
import ProjectConversationCard from "./project-conversation-card";
import { useRouter } from "next/navigation";
import ProjectGuidelineButton from "./project-guideline-button";

interface ProjectDashboardProps {
  currentProject: FolderDetail;
}

const ProjectDashboard = ({ currentProject }: ProjectDashboardProps) => {
  const router = useRouter();

  // 대화 선택 핸들러
  const handleSelectConversation = (conversationId: string) => {
    router.push(`/chat/${conversationId}`);
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-subtitle-l flex items-center text-label-strong">
          <FolderClosed size={24} className="inline-block mr-2" />
          {currentProject.name}
        </h2>
        <ProjectNewChatButton projectId={currentProject.id} />
      </div>
      <ProjectGuidelineButton projectId={currentProject.id} />
      <div className="flex-1 overflow-y-auto">
        <div className="mt-4">
          <div className="flex flex-col">
            {currentProject.conversations.map((conv) => (
              <ProjectConversationCard
                key={conv.id}
                conversation={conv}
                onSelect={handleSelectConversation}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
