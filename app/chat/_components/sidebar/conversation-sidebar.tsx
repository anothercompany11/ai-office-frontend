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
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authApi, folderApi } from "@/app/api";
import { conversationApi } from "@/app/api/conversation";

import {
  Conversation,
  Folder,
  GroupedConversations,
  TimeGroup,
} from "../types";

import FolderList from "./folder-list"; // 기존 파일 그대로 사용
import { useGroupedConversations } from "@/hooks/use-groupped-conversation";
import ConversationsArea from "./conversation-area";
import ConversationItem from "./conversation-item";
import DragOverlayContent from "./drag-overlay-content";
import { ConversationFolder } from "./folder-item";

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
}

export default function ConversationSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}: Props) {
  /* ---------- state & ref ---------- */
  const router = useRouter();
  const [folders, setFolders] = useState<ConversationFolder[]>([]);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const newFolderInputRef = useRef<HTMLInputElement>(null);

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
      <div className="h-full flex flex-col max-w-[280px] border-r border-gray-200">
        {/* Folders */}
        <aside className="flex-1 overflow-auto p-2">
          <header
            className="flex items-center gap-1 text-xs font-semibold cursor-pointer h-[26px]"
            onClick={() => setShowFolders(!showFolders)}
          >
            {showFolders ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            <span>프로젝트</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsCreatingFolder(true);
                setTimeout(() => newFolderInputRef.current?.focus());
              }}
              className="ml-auto p-1 hover:bg-gray-100 rounded-full"
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

          {isCreatingFolder && (
            <div className="px-3 py-2 flex items-center">
              <input
                ref={newFolderInputRef}
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    folderApi.createFolder(newFolderName).then(loadFolders);
                    setIsCreatingFolder(false);
                    setNewFolderName("");
                  }
                  if (e.key === "Escape") setIsCreatingFolder(false);
                }}
                className="flex-1 px-2 py-1.5 border rounded text-sm"
                placeholder="프로젝트 이름"
              />
            </div>
          )}

          {/* Conversations */}
          <header
            className="flex items-center gap-1 text-xs font-semibold cursor-pointer h-[26px] pt-3"
            onClick={() => setShowConversations(!showConversations)}
          >
            {showConversations ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
            <span>대화 내역</span>
          </header>

          {showConversations && (
            <ConversationsArea id="conversations-area">
              {Object.entries(grouped).map(([k, v]) =>
                v.length ? (
                  <section key={k} className="mt-5 first:mt-0 last:mb-5">
                    <h3 className="px-4 text-xs font-semibold text-gray-800 pt-3 pb-2">
                      {groupTitles[k as TimeGroup]}
                    </h3>
                    <ol className="px-2">
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

        {/* footer */}
        <footer className="border-t border-gray-200 p-4">
          <button
            onClick={onNewConversation}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            <Plus size={16} />새 대화
          </button>
          <button
            onClick={() => authApi.logout().then(() => router.push("/auth"))}
            className="w-full mt-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
          >
            로그아웃
          </button>
        </footer>
      </div>

      <DragOverlay>
        {activeId && (
          <DragOverlayContent id={activeId} conversations={convState} />
        )}
      </DragOverlay>
    </DndContext>
  );
}
