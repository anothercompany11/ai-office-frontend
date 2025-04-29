"use client";

import { DndContext, DragOverlay } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { useState } from "react";
import { useGroupedConversations } from "@/hooks/use-groupped-conversation";
import DragOverlayContent from "./drag-overlay-content";
import { useGetCurrentDevice } from "@/hooks/use-get-current-device";
import { useDnDSensors, useDragHighlight } from "@/hooks/use-dnd";
import SidebarLayout from "./sidebar-layout";
// import useFolders from "@/hooks/use-folder";
// import FolderHeader from "../folder/folder-header";
// import FolderList from "./folder-list";
// import CreateFolderModal from "./create-folder-modal";
import SidebarChatHeader from "./side-bar-chat-header";
import ChatGroupList from "./chat-group-list";
import { Conversation } from "../types";

interface Props {
  conversations: Conversation[];
  currentConversationId?: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  isSidebarVisible: boolean;
  setIsSidebarVisible: (v: boolean) => void;
}

export default function ConversationSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isSidebarVisible,
  setIsSidebarVisible,
}: Props) {
  const isMobile = useGetCurrentDevice() !== "web";
  const grouped = useGroupedConversations(
    conversations.filter((c) => !c.folder_id),
  );
  /** 폴더 관련 주석 처리 */
  // const { folders, create, rename, remove } = useFolders(conversations);

  // DnD 센서와 훅
  const sensors = useDnDSensors();
  const { activeId, onDragStart, onDragEnd } = useDragHighlight();

  // 새 대화 생성 모달 노출 여부
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 새 대화 생성 핸들러
  const handleNewChat = () => {
    onNewConversation();
    if (isMobile) setIsSidebarVisible(false);
  };

  // 사이드바 닫기 핸들러
  const handleCloseSidebar = () => setIsSidebarVisible(false);

  // 대화방 선택 핸들러
  const handleSelectChat = (id: string) => {
    onSelectConversation(id);
    isMobile && handleCloseSidebar();
  };
  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <SidebarLayout
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      >
        {/* <FolderHeader onNew={() => setShowCreateModal(true)} />
        <FolderList
          folders={folders}
          currentConversationId={currentConversationId ?? null}
          activeId={activeId}
          onSelectConversation={onSelectConversation}
          onRenameFolder={rename}
          onDeleteFolder={remove}
          onCreateFolder={() => setShowCreateModal(true)}
          onDeleteConversation={onDeleteConversation}
        />

        <div className="border-t border-line my-4" /> */}

        <SidebarChatHeader onNew={handleNewChat} />
        <ChatGroupList
          groups={grouped}
          currentConversationId={currentConversationId ?? null}
          onSelect={handleSelectChat}
          onDelete={onDeleteConversation}
        />
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
