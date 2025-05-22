"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ChatHeader from "../../_components/chat-header/chat-header";
import { useAuth } from "@/app/context/AuthContext";
import { LoadIcon } from "@/app/shared/loading";
import { useProject } from "@/app/context/ProjectContext";
import { FolderClosed } from "lucide-react";
import ProjectConversationCard from "../../_components/project/project-conversation-card";
import EmptyProjectCard from "../../_components/project/empty-project-card";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { user } = useAuth();
  const { currentProject, isLoading, getProjectDetail } = useProject();

  // 프로젝트 정보 업데이트
  useEffect(() => {
    if (projectId) {
      getProjectDetail(projectId);
    }
  }, [projectId, getProjectDetail]);

  // 대화 선택 핸들러
  const handleSelectConversation = (conversationId: string) => {
    router.push(`/chat/${conversationId}`);
  };

  // 로딩 상태
  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadIcon />
      </div>
    );
  }

  // 프로젝트를 찾을 수 없는 경우
  if (!currentProject) {
    return (
      <div className="flex flex-col items-center max-w-[680px] mx-auto justify-center h-screen">
        <FolderClosed size={64} className="text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">프로젝트를 찾을 수 없습니다</h1>
        <p className="text-gray-500 mb-6">
          요청하신 프로젝트가 존재하지 않거나 접근할 수 없습니다.
        </p>
        <button
          onClick={() => router.push("/chat")}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          채팅으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-background-alternative flex flex-col">
      <ChatHeader />
      <div className="max-w-[680px] bg-white rounded-md p-5 mx-auto w-full">

          <h2 className="text-title-xl text-label-strong">
            {currentProject.name}
          </h2>

        <div className="flex-1 overflow-y-auto pb-8">
          <div className="mt-4">
            {currentProject.conversations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentProject.conversations.map((conv) => (
                  <ProjectConversationCard
                    key={conv.id}
                    conversation={conv}
                    onSelect={handleSelectConversation}
                  />
                ))}
              </div>
            ) : (
              <EmptyProjectCard projectId={currentProject.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
