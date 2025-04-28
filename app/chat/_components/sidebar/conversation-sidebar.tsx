"use client";

import { DndContext, DragOverlay } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { useState } from "react";
import { useGroupedConversations } from "@/hooks/use-groupped-conversation";
import DragOverlayContent from "./drag-overlay-content";
import { useGetCurrentDevice } from "@/hooks/use-get-current-device";
import useFolders from "@/hooks/use-folder";
import { useDnDSensors, useDragHighlight } from "@/hooks/use-dnd";
import SidebarLayout from "./sidebar-layout";
// import FolderHeader from "../folder/folder-header";
// import FolderList from "./folder-list";
import SidebarChatHeader from "./side-bar-chat-header";
import CreateFolderModal from "./create-folder-modal";
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
  const { folders, create, rename, remove } = useFolders(conversations);
  const grouped = useGroupedConversations(
    conversations.filter((c) => !c.folder_id),
  );

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
          activeId={activeId}
          onSelect={onSelectConversation}
          onDelete={onDeleteConversation}
        />
      </SidebarLayout>

      <CreateFolderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onConfirm={(name) => {
          create(name);
          setShowCreateModal(false);
        }}
      />

      <DragOverlay>
        {activeId && (
          <DragOverlayContent id={activeId} conversations={conversations} />
        )}
      </DragOverlay>

      {/* Mobile backdrop */}
      {isMobile && isSidebarVisible && (
        <div
          className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300"
          onClick={() => setIsSidebarVisible(false)}
        />
      )}
    </DndContext>
  );
}
