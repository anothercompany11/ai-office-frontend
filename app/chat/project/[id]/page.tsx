"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ChatHeader from "../../_components/chat-header/chat-header";
import { useAuth } from "@/app/context/AuthContext";
import { LoadIcon } from "@/app/shared/loading";
import { useProject } from "@/app/context/ProjectContext";
import { FolderClosed } from "lucide-react";
import EmptyProjectCard from "../../_components/project/empty-project-card";
import ProjectDashboard from "../../_components/project/project-dashboard";

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
  ``;
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
      <div className="max-w-[680px] bg-white rounded-md p-6 mx-auto w-full">
        {currentProject.conversations.length > 0 ? (
          <ProjectDashboard currentProject={currentProject} />
        ) : (
          <EmptyProjectCard projectId={currentProject.id} />
        )}
      </div>
    </div>
  );
}
