"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ChatHeader from "../../_components/chat-header/chat-header";
import { useAuth } from "@/app/context/AuthContext";
import { LoadIcon } from "@/app/shared/loading";
import { useProject } from "@/app/context/ProjectContext";
import { FolderClosed } from "lucide-react";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { user } = useAuth();
  const { currentProject, isLoading, getProjectDetail } = useProject();

  // 프로젝트 정보 로드
  useEffect(() => {
    if (projectId) {
      getProjectDetail(projectId);
    }
  }, [projectId, getProjectDetail]);

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
      <div className="flex flex-col items-center justify-center h-screen">
        <FolderClosed size={64} className="text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-2">프로젝트를 찾을 수 없습니다</h1>
        <p className="text-gray-500 mb-6">요청하신 프로젝트가 존재하지 않거나 접근할 수 없습니다.</p>
        <button
          onClick={() => router.push('/chat')}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          채팅으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col">
      <ChatHeader />
      <div className="flex items-center justify-between py-4 px-8">
        <h2 className="text-title-l font-bold text-label-strong">
          {currentProject.name}
        </h2>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
          지침추가
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-8 pb-8">
        <div className="mt-4">
          {currentProject.conversations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentProject.conversations.map((conv) => (
                <div
                  key={conv.id}
                  className="p-4 rounded-lg border border-line hover:bg-background-alternative transition-colors cursor-pointer"
                  onClick={() => router.push(`/chat?id=${conv.id}`)}
                >
                  <p className="text-body-l text-label-strong truncate">
                    {conv.title || "제목 없음"}
                  </p>
                  <p className="text-body-s text-label-assistive mt-1">
                    {new Date(conv.updated_at).toLocaleDateString('ko-KR')}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 truncate">
                    {conv.preview}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FolderClosed size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-body-l text-label-assistive mb-4">
                이 프로젝트에는 아직 대화가 없습니다.
              </p>
              <button
                onClick={() => router.push('/chat')}
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                새 대화 시작하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
