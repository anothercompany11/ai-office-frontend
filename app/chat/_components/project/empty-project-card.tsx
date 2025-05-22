import { Button } from "@/components/ui/button";
import { FolderClosed } from "lucide-react";
import { useRouter } from "next/navigation";


interface EmptyProjectCardProps {
  projectId: string;
}

const EmptyProjectCard = ({ projectId }: EmptyProjectCardProps) => {
  const router = useRouter();

  const handleStartNewChat = () => {
    // 새 대화 페이지로 이동하면서 프로젝트 ID를 쿼리 파라미터로 전달
    router.push(`/chat?projectId=${projectId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-12 bg-background-alternative rounded-lg border-2 border-dashed border-line">
      <FolderClosed size={32} className="text-label-alternative mb-4" />
      <p className="text-title-m text-label-natural mb-2">
        이 프로젝트에는 아직 대화가 없습니다
      </p>
      <p className="text-body-s text-label-assistive mb-6">
        새로운 대화를 시작하여 프로젝트를 채워보세요
      </p>
      <Button
        onClick={handleStartNewChat}
        className="bg-primary hover:bg-primary/90 text-white transition-colors"
      >
        새 대화 시작하기
      </Button>
    </div>
  );
};
export default EmptyProjectCard;