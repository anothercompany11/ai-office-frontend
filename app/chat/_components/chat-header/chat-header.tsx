"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { CircleHelp, ChevronsRight, FolderClosed } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import GuideBox from "../guide/guide-box";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SwipeGuideBox from "../guide/swipe-guide-box";
import { useSidebar } from "@/app/context/SidebarContext";
import { useProject } from "@/app/context/ProjectContext";
import Link from "next/link";
import { cn } from "@/app/lib/utils";

interface ChatHeaderProps {
  projectId?: string;
}

const ChatHeader = ({ projectId }: ChatHeaderProps) => {
  const { isSidebarVisible, setIsSidebarVisible } = useSidebar();
  const { currentProject, getProjectDetail, resetCurrentProject } =
    useProject();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // URL에서 projectId 파라미터를 가져오거나 prop으로 전달된 값을 사용
  const projectIdFromUrl = searchParams.get("projectId");
  const activeProjectId = projectId || projectIdFromUrl;

  // 현재 경로가 프로젝트 페이지인지 확인
  const isProjectPage = pathname.startsWith("/chat/project/");

  // 일반 채팅 페이지이고 프로젝트 ID가 없는 경우
  const isRegularChatPage =
    pathname.startsWith("/chat/") &&
    !pathname.startsWith("/chat/project/") &&
    !activeProjectId;

  // 프로젝트 ID 변경이나 페이지 경로 변경 시 프로젝트 정보 관리
  useEffect(() => {
    if (activeProjectId) {
      // 프로젝트 ID가 있으면 정보 로드
      getProjectDetail(activeProjectId);
    } else if (isRegularChatPage) {
      // 일반 채팅 페이지이고 프로젝트 ID가 없으면 초기화
      resetCurrentProject();
    }
  }, [
    activeProjectId,
    isRegularChatPage,
    getProjectDetail,
    resetCurrentProject,
  ]);

  return (
    <div
      className={cn(
        "px-4 py-3 z-10 fixed top-0 inset-x-0 tab:relative tab:py-5 tab:px-8 flex justify-between items-center",
        isSidebarVisible &&
          "web:w-[calc(100%-248px)] transition-all duration-300 web:ml-auto web:pl-[60px]",
      )}
    >
      <div className="flex items-center">
        <div className="hidden web:block">
          {!isSidebarVisible && (
            <button
              onClick={() => setIsSidebarVisible(true)}
              className="flex items-center justify-center mr-4"
            >
              <ChevronsRight className="size-6 text-component" />
            </button>
          )}
        </div>

        <div className="block relative z-50 web:hidden">
          <button
            onClick={() => setIsSidebarVisible(true)}
            className="flex items-center justify-center"
          >
            <ChevronsRight className="size-6 text-component" />
          </button>
        </div>
        {currentProject && !isProjectPage ? (
          <div className="flex items-center">
            <p className="text-body-l font-hakgyo-ansim">
              <Link
                href={`/chat/project/${currentProject.id}`}
                className="flex items-center gap-2 hover:text-primary"
              >
                <FolderClosed size={16} />
                <span>{currentProject.name}</span>
              </Link>
            </p>
          </div>
        ) : (
          <p className="text-body-l font-hakgyo-ansim block web:hidden absolute left-1/2 -translate-x-1/2">
            토르
          </p>
        )}

        {!currentProject && (
          <p className="text-body-l font-hakgyo-ansim hidden web:block">토르</p>
        )}
      </div>

      <div className="hidden web:block">
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center justify-center">
              <CircleHelp className="size-6 text-primary" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[640px] p-6 bg-white border border-[hsla(220,10%,94%,1)] shadow-[4px_4px_20px_0px_hsla(0,0%,0%,0.1)]"
            align="end"
          >
            <GuideBox />
          </PopoverContent>
        </Popover>
      </div>

      <div className="block web:hidden">
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex items-center justify-center outline-none tap-highlight-none">
              <CircleHelp className="size-6 text-primary" />
            </button>
          </DialogTrigger>
          <DialogContent className="outline-none tap-highlight-none">
            <DialogHeader>
              <DialogTitle className="font-hakgyo-ansim">
                토르 프롬프트 가이드
              </DialogTitle>
            </DialogHeader>

            <SwipeGuideBox />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ChatHeader;
