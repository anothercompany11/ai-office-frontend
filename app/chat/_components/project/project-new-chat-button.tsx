import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ProjectNewChatButtonProps {
  projectId: string;
}

const ProjectNewChatButton = ({ projectId }: ProjectNewChatButtonProps) => {
  const router = useRouter();

  const handleStartNewChat = () => {
    // 새 대화 페이지로 이동하면서 프로젝트 ID를 쿼리 파라미터로 전달
    router.push(`/chat?projectId=${projectId}`);
  };

  return (
    <Button onClick={handleStartNewChat} variant="outline" size={"lg"}>
      대화 시작하기
    </Button>
  );
};

export default ProjectNewChatButton;
