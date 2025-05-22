import { Button } from "@/components/ui/button";
import { FolderClosed, Pencil } from "lucide-react";
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
    <div className="flex flex-col gap-5 items-center">
      <div className="flex flex-col items-center w-full justify-center h-full p-12 bg-background-alternative rounded-lg border-2 border-dashed border-line">
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
      <button className="flex flex-col items-center w-full max-w-md p-4 mb-6 border-2 border-line rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-title-s text-label-strong">지침 추가</h3>
          <Pencil size={16} className="text-label-alternative" />
        </div>
        <p className="text-body-s text-label-assistive text-center">
          프로젝트에 응답하는 방식을 직접 짜세요.
        </p>
      </button>
    </div>
  );
};
export default EmptyProjectCard;
