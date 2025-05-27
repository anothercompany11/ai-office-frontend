"use client";

import { DndContext, DragOverlay } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGroupedConversations } from "@/hooks/use-groupped-conversation";
import DragOverlayContent from "./drag-overlay-content";
import { useGetCurrentDevice } from "@/hooks/use-get-current-device";
import { useDnDSensors, useDragHighlight } from "@/hooks/use-dnd";
import SidebarLayout from "./sidebar-layout";
import useFolders from "@/hooks/use-folder";
import FolderHeader from "../project/project-header";
import FolderList from "./folder-list";
import CreateFolderModal from "./create-folder-modal";
import SidebarChatHeader from "./side-bar-chat-header";
import ChatGroupList from "./chat-group-list";
import { Conversation } from "../types";
import LogoutButton from "@/app/auth/_components/logout-button";
import { useSidebar } from "@/app/context/SidebarContext";
import { useConversations } from "@/app/context/ConversationContext";
import { useProject } from "@/app/context/ProjectContext";

interface Props {
  conversations: Conversation[];
  currentConversationId?: string | null;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export default function ConversationSidebar({
  conversations,
  currentConversationId,
  onNewConversation,
  onDeleteConversation,
}: Props) {
  const router = useRouter();
  const isMobile = useGetCurrentDevice() !== "web";
  const { isSidebarVisible, setIsSidebarVisible } = useSidebar();
  const { selectConversation } = useConversations();
  const { resetCurrentProject } = useProject();
  const grouped = useGroupedConversations(
    conversations.filter((c) => !c.folder_id),
  );
  // 폴더
  const { folders, create, rename, remove } = useFolders(conversations);

  // DnD 센서와 훅
  const sensors = useDnDSensors();
  const {
    activeId,
    hoveredFolderId,
    onDragStart,
    onDragOver,
    onDragEnd,
    FOLDER_PREFIX,
    CONVERSATION_PREFIX,
  } = useDragHighlight();

  // 새 대화 생성 모달 노출 여부
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 폴더 생성 핸들러
  const handleCreateFolder = async (name: string) => {
    await create(name);
    setShowCreateModal(false); // 폴더 생성 성공 시 모달 닫기
  };

  // 새 대화 생성 핸들러
  const handleNewChat = () => {
    onNewConversation();
    router.push("/chat"); // 빈 채팅 페이지로 이동
    resetCurrentProject(); // 프로젝트 컨텍스트 초기화
    if (isMobile) setIsSidebarVisible(false);
  };

  // 사이드바 닫기 핸들러
  const handleCloseSidebar = () => setIsSidebarVisible(false);

  // 대화방 선택 핸들러 - URL 형식 변경
  const handleSelectChat = (id: string) => {
    selectConversation(id);
    router.push(`/chat/${id}`); // 새로운 URL 형식, 프로젝트 ID 없음
    resetCurrentProject(); // 프로젝트 컨텍스트 초기화
    isMobile && handleCloseSidebar();
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <SidebarLayout>
        <FolderHeader onNew={() => setShowCreateModal(true)} />
        <FolderList
          folders={folders}
          currentConversationId={currentConversationId ?? null}
          activeId={activeId}
          hoveredFolderId={hoveredFolderId}
          folderPrefix={FOLDER_PREFIX}
          onSelectConversation={handleSelectChat}
          onRenameFolder={rename}
          onDeleteFolder={remove}
          onCreateFolder={() => setShowCreateModal(true)}
          onDeleteConversation={onDeleteConversation}
        />
        <CreateFolderModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onConfirm={handleCreateFolder}
        />

        <div className="border-t border-line my-4" />

        <SidebarChatHeader onNew={handleNewChat} />
        <ChatGroupList
          groups={grouped}
          currentConversationId={currentConversationId ?? null}
          onSelect={handleSelectChat}
          onDelete={onDeleteConversation}
          conversationPrefix={CONVERSATION_PREFIX}
          activeId={activeId}
        />
        <LogoutButton />
      </SidebarLayout>

      <DragOverlay>
        {activeId && (
          <DragOverlayContent id={activeId} conversations={conversations} />
        )}
      </DragOverlay>

      {/* Mobile backdrop */}
      {isMobile && isSidebarVisible && (
        <div
          className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300"
          onClick={handleCloseSidebar}
        />
      )}
    </DndContext>
  );
}
