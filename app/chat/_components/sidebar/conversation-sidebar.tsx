"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { ChevronsLeft, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { folderApi } from "@/app/api";
import { conversationApi } from "@/app/api/conversation";
import { Conversation, Folder, TimeGroup } from "../types";
import FolderList from "./folder-list";
import ConversationsArea from "./conversation-area";
import ConversationItem from "./conversation-item";
import DragOverlayContent from "./drag-overlay-content";
import { ConversationFolder } from "./folder-item";
import CreateFolderModal from "./_components/create-folder-modal";
import { useGroupedConversations } from "@/hooks/use-groupped-conversation";
import { useGetCurrentDevice } from "@/hooks/use-get-current-device";

const groupTitles: Record<TimeGroup, string> = {
  today: "오늘",
  yesterday: "어제",
  previous7Days: "이전 7일",
  previous30Days: "이전 30일",
  older: "이전 기록",
};

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

  const [folders, setFolders] = useState<ConversationFolder[]>([]);
  const [convState, setConvState] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // DnD 센서
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
  );

  useEffect(() => {
    setConvState(conversations.filter((c) => c.id !== "new"));
  }, [conversations]);

  useEffect(() => {
    loadFolders();
  }, [convState]);

  const loadFolders = async () => {
    const res = await folderApi.getFolders();
    if (res.status !== "success" || !res.data) return;
    const enhanced = res.data.map((f: Folder) => ({
      ...f,
      conversations: convState
        .filter((c) => c.folder_id === f.id)
        .map(({ id, title, preview }) => ({ id, title, preview })),
    }));
    setFolders(enhanced);
  };

  const grouped = useGroupedConversations(
    convState.filter((c) => !c.folder_id),
  );

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
    document.body.style.overflow = "hidden";
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    document.body.style.overflow = "";
    if (!active || !over) return setActiveId(null);

    const dragId = active.id as string;
    const overId = over.id as string;
    const dragged = convState.find((c) => c.id === dragId);
    if (!dragged) return setActiveId(null);

    const fromFolder = dragged.folder_id;
    if (overId.startsWith("folder-")) {
      const toFolder = overId.replace("folder-", "");
      if (fromFolder === toFolder) return setActiveId(null);
      await conversationApi.updateConversation(dragId, { folder_id: toFolder });
      setConvState((prev) =>
        prev.map((c) => (c.id === dragId ? { ...c, folder_id: toFolder } : c)),
      );
    } else if (overId === "conversations-area" && fromFolder) {
      await conversationApi.updateConversation(dragId, { folder_id: null });
      setConvState((prev) =>
        prev.map((c) => (c.id === dragId ? { ...c, folder_id: undefined } : c)),
      );
    }
    setActiveId(null);
  };

  // 폴더 생성
  const createFolder = async (name: string) => {
    if (!name.trim()) return;
    await folderApi.createFolder(name.trim());
    await loadFolders();
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      {/* Sidebar */}
      <div
        className={`${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } fixed inset-0 z-50 h-full flex flex-col w-[280px] px-4 bg-white transition-transform duration-300 ease-in-out`}
      >
        {/* Header */}
        <div className="flex items-center justify-between py-[21.5px]">
          <Image src="/svg/logo.svg" alt="logo" width={97.45} height={18.21} />
          <button onClick={() => setIsSidebarVisible(false)}>
            <ChevronsLeft size={24} className="text-component" />
          </button>
        </div>

        {/* Content */}
        <aside className="flex-1 overflow-auto">
          {/* ---- Folders ---- */}
          <header className="flex justify-between items-center py-[8.5px]">
            <span className="text-title-xs">라이브러리</span>
            <button onClick={() => setShowCreateModal(true)}>
              <Plus size={14} />
            </button>
          </header>

          <FolderList
            folders={folders}
            currentConversationId={currentConversationId ?? null}
            onCreateFolder={() => setShowCreateModal(true)}
            onSelectConversation={onSelectConversation}
            onRenameFolder={(id, n) =>
              folderApi.updateFolder(id, n).then(loadFolders)
            }
            onDeleteFolder={(id) =>
              folderApi
                .deleteFolder(id)
                .then(() =>
                  setFolders((prev) => prev.filter((f) => f.id !== id)),
                )
            }
            onDeleteConversation={onDeleteConversation}
            activeId={activeId}
          />

          <div className="border-t border-line my-4" />

          {/* ---- Conversations ---- */}
          <header className="flex justify-between items-center py-[8.5px]">
            <span className="text-title-xs">지난 대화</span>
            <button onClick={onNewConversation}>
              <Plus size={14} />
            </button>
          </header>

          <ConversationsArea id="conversations-area">
            {Object.entries(grouped).map(
              ([k, v]) =>
                v.length > 0 && (
                  <section
                    key={k}
                    className="mt-5 first:mt-0 last:mb-5 text-body-s"
                  >
                    <h3 className="pb-1">{groupTitles[k as TimeGroup]}</h3>
                    <ol>
                      {v.map((c: Conversation) => (
                        <ConversationItem
                          key={c.id}
                          conversation={c}
                          isActive={activeId === c.id}
                          isCurrent={currentConversationId === c.id}
                          onSelect={() => {
                            onSelectConversation(c.id);
                            if (isMobile) setIsSidebarVisible(false);
                          }}
                          onDelete={(e) => {
                            onDeleteConversation(c.id);
                          }}
                        />
                      ))}
                    </ol>
                  </section>
                ),
            )}
          </ConversationsArea>
        </aside>
      </div>

      <CreateFolderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onConfirm={(name) => {
          createFolder(name);
          setShowCreateModal(false);
        }}
      />

      {/* DnD overlay */}
      <DragOverlay>
        {activeId && (
          <DragOverlayContent id={activeId} conversations={convState} />
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
