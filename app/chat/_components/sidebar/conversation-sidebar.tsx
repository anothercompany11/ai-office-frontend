"use client";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { ChevronsLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { folderApi } from "@/app/api";
import { conversationApi } from "@/app/api/conversation";
import Image from "next/image";
import { Conversation, TimeGroup } from "../types";
import FolderList from "./folder-list";
import { useGroupedConversations } from "@/hooks/use-groupped-conversation";
import ConversationsArea from "./conversation-area";
import ConversationItem from "./conversation-item";
import DragOverlayContent from "./drag-overlay-content";
import { ConversationFolder } from "./folder-item";
import CreateFolderModal from "./_components/create-folder-modal";

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
  setIsSidebarVisible: (visible: boolean) => void;
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
  /* ---------- state & ref ---------- */
  const router = useRouter();
  const [folders, setFolders] = useState<ConversationFolder[]>([]);
  // const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  // const [newFolderName, setNewFolderName] = useState("");
  // const newFolderInputRef = useRef<HTMLInputElement>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [convState, setConvState] = useState<Conversation[]>([]);
  const [showFolders, setShowFolders] = useState(true);
  const [showConversations, setShowConversations] = useState(true);

  /* ---------- sensors ---------- */
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
  );

  /* ---------- effects ---------- */
  useEffect(() => {
    setConvState(conversations.filter((c) => c.id !== "new"));
  }, [conversations]);

  useEffect(() => {
    loadFolders();
  }, [convState]);

  /* ---------- helpers ---------- */
  const loadFolders = async () => {
    const res = await folderApi.getFolders();
    if (res.status !== "success") return;

    const enriched: any = res.data?.map((f: any) => ({
      ...f,
      conversations: convState
        .filter((c) => c.folder_id === f.id)
        .map(({ id, title, preview }) => ({ id, title, preview })),
    }));
    setFolders(enriched);
  };

  const grouped = useGroupedConversations(
    convState.filter((c) => !c.folder_id),
  );

  /* ---------- dnd handlers (원본 로직 그대로) ---------- */
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
    /* ----- 폴더 → 폴더 or 폴더 <-> 밖  로직은 기존 코드 동일 ----- */
    if (overId.startsWith("folder-")) {
      const toFolder = overId.replace("folder-", "");
      if (fromFolder === toFolder) return setActiveId(null);

      const res = await conversationApi.updateConversation(dragId, {
        folder_id: toFolder,
      });
      if (res.status === "success") {
        setConvState((p) =>
          p.map((c) => (c.id === dragId ? { ...c, folder_id: toFolder } : c)),
        );
      } else await loadFolders();
    } else if (overId === "conversations-area" && fromFolder) {
      const res = await conversationApi.updateConversation(dragId, {
        folder_id: null,
      });
      if (res.status === "success") {
        setConvState((p) =>
          p.map((c) => (c.id === dragId ? { ...c, folder_id: undefined } : c)),
        );
      } else await loadFolders();
    }
    setActiveId(null);
  };

  /* ---------- UI ---------- */
  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      // onDragCancel={handleDragCancel}
      // onDragOver={handleDragOver}
      modifiers={[restrictToWindowEdges]}
    >
      <div
        className={`${
          isSidebarVisible ? "web:flex" : "web:hidden"
        } hidden h-full flex-col w-[280px] min-w-[280px] flex-shrink-0 px-4`}
      >
        <div className="flex items-center justify-between py-[21.5px]">
          <Image
            src="/svg/logo.svg"
            alt="chat-sidebar-bg"
            width={97.45}
            height={18.21}
          />
          <button onClick={() => setIsSidebarVisible(false)}>
            <ChevronsLeft size={24} className="text-component" />
          </button>
        </div>
        {/* Folders */}
        <aside className="flex-1 overflow-auto">
          <header className="flex justify-between items-center py-[8.5px]">
            <span className="text-title-xs">라이브러리</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCreateModal(true);
              }}
              className=""
            >
              <Plus size={14} />
            </button>
          </header>

          {showFolders && (
            <FolderList
              folders={folders}
              currentConversationId={currentConversationId || null}
              onSelectConversation={onSelectConversation}
              onRenameFolder={(id, n) =>
                folderApi.updateFolder(id, n).then(loadFolders)
              }
              onDeleteFolder={(id) =>
                folderApi
                  .deleteFolder(id)
                  .then(() => setFolders((p) => p.filter((f) => f.id !== id)))
              }
              onDeleteConversation={onDeleteConversation}
              activeId={activeId}
            />
          )}

          <div className="border-t border-line my-4" />
          {/* Conversations */}
          <header className="flex justify-between items-center py-[8.5px]">
            <span className="text-title-xs">지난 대화</span>
            <button onClick={onNewConversation}>
              <Plus size={14} />
            </button>
          </header>

          {showConversations && (
            <ConversationsArea id="conversations-area">
              {Object.entries(grouped).map(([k, v]) =>
                v.length ? (
                  <section
                    key={k}
                    className="mt-5 first:mt-0 last:mb-5 text-body-s"
                  >
                    <h3 className="pb-1">{groupTitles[k as TimeGroup]}</h3>
                    <ol className="">
                      {v.map((c: Conversation) => (
                        <ConversationItem
                          key={c.id}
                          conversation={c}
                          isActive={activeId === c.id}
                          isCurrent={currentConversationId === c.id}
                          onSelect={onSelectConversation}
                          onDelete={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(c.id);
                          }}
                        />
                      ))}
                    </ol>
                  </section>
                ) : null,
              )}
            </ConversationsArea>
          )}
        </aside>
      </div>
      <CreateFolderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onConfirm={(name) => {
          folderApi.createFolder(name).then(loadFolders);
          setShowCreateModal(false);
        }}
      />

      <DragOverlay>
        {activeId && (
          <DragOverlayContent id={activeId} conversations={convState} />
        )}
      </DragOverlay>
    </DndContext>
  );
}
