"use client";

import { authApi, folderApi } from "@/app/api";
import { conversationApi } from "@/app/api/conversation";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { ChevronDown, ChevronRight, Folder, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import FolderList from "./FolderList";

// 폴더 타입 정의
interface Folder {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// 대화 항목의 타입 정의
interface Conversation {
  id: string;
  title: string;
  preview: string;
  lastUpdated: Date;
  folder_id?: string;
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId?: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

// 시간 그룹 정의
type TimeGroup =
  | "today"
  | "yesterday"
  | "previous7Days"
  | "previous30Days"
  | "older";

// 시간 그룹별 대화 목록 구조
interface GroupedConversations {
  today: Conversation[];
  yesterday: Conversation[];
  previous7Days: Conversation[];
  previous30Days: Conversation[];
  older: Conversation[];
}

// 시간 그룹 제목 매핑
const groupTitles: Record<TimeGroup, string> = {
  today: "오늘",
  yesterday: "어제",
  previous7Days: "이전 7일",
  previous30Days: "이전 30일",
  older: "이전 기록",
};

// ConversationItem 컴포넌트 - 드래그 가능한 대화 항목
function ConversationItem({
  conversation,
  isActive,
  isCurrentConversation,
  onSelect,
  onDelete,
}: {
  conversation: Conversation;
  isActive: boolean;
  isCurrentConversation: boolean;
  onSelect: (id: string) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: conversation.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
        position: "relative" as const,
        width: "calc(100% - 4px)",
        maxWidth: "100%",
        boxSizing: "border-box" as const,
        margin: "0 2px",
        boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
        background: "white",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
      }
    : undefined;

  return (
    <li className="relative">
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={`group rounded-lg h-9 text-sm relative hover:bg-gray-50 ${
          isActive ? "opacity-50" : ""
        }`}
      >
        <a
          className="flex items-center gap-2 p-2 cursor-pointer"
          onClick={() => onSelect(conversation.id)}
          data-conversation-id={conversation.id}
        >
          <div
            className={`relative grow overflow-hidden whitespace-nowrap ${
              isCurrentConversation
                ? "text-blue-600 font-medium"
                : "text-gray-700"
            }`}
            title={conversation.title}
          >
            {conversation.title}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onDelete(e, conversation.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
            title="대화 삭제"
          >
            <Trash2 size={12} />
          </button>
        </a>
      </div>
    </li>
  );
}

// 대화 목록 영역 컴포넌트 - 드롭 가능한 영역
function ConversationsArea({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`mt-2 max-w-full overflow-hidden min-h-[100px] ${
        isOver
          ? "bg-gray-50 border border-dashed border-gray-300 rounded-lg"
          : ""
      }`}
    >
      {children || (
        <div className="h-[100px] flex items-center justify-center text-gray-400 text-sm">
          대화를 여기로 드래그하세요
        </div>
      )}
    </div>
  );
}

// 폴더 관련 타입 정의
interface ConversationForFolder {
  id: string;
  title: string;
  preview?: string;
  created_at?: string;
  updated_at?: string;
}

interface ConversationFolder {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  conversations: ConversationForFolder[];
}

// 드래그 오버레이 컴포넌트
const DragOverlayContent = ({
  type,
  id,
  conversations,
}: {
  type: string;
  id: string;
  conversations: Conversation[];
}) => {
  if (type === "conversation") {
    const conversation = conversations.find((c) => c.id === id);
    if (!conversation) return null;

    return (
      <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-3 w-64 flex items-center">
        <span className="text-sm font-medium text-gray-700 truncate">
          {conversation.title}
        </span>
      </div>
    );
  }

  return null;
};

const ConversationSidebar = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}: ConversationSidebarProps) => {
  const router = useRouter();
  const [folders, setFolders] = useState<ConversationFolder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showFolders, setShowFolders] = useState(true);
  const [showConversations, setShowConversations] = useState(true);
  const newFolderInputRef = useRef<HTMLInputElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedType, setDraggedType] = useState<"conversation" | null>(null);
  const [conversationsState, setConversationsState] =
    useState<Conversation[]>(conversations);

  // 대화 목록 변경 시 상태 업데이트
  useEffect(() => {
    // "new" ID를 가진 임시 대화만 목록에서 제외 (실제 서버에서 생성된 대화는 포함)
    setConversationsState(conversations.filter((conv) => conv.id !== "new"));
  }, [conversations]);

  // 센서 설정 (드래그 감지)
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // 클릭 시 드래그 시작을 방지하기 위한 지연 설정
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      // 터치 디바이스에서 드래그 시작을 위한 지연 설정
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  // 폴더 목록 로드
  const loadFolders = async () => {
    try {
      console.log("폴더 목록 로드 시작...");
      setIsLoading(true);
      const response = await folderApi.getFolders();

      // API 응답 구조에 맞게 데이터 추출
      if (response.status === "success" && response.data) {
        console.log(
          "폴더 데이터 로드 성공:",
          response.data.length,
          "개의 폴더"
        );

        // 현재 대화 상태 불러오기 (최신)
        const currentConversations = [...conversationsState];

        // 폴더별 대화 목록 채우기
        const folderData = response.data.map((folder) => {
          // 현재 상태의 대화 목록 사용
          const folderConversations = currentConversations
            .filter((conv) => conv.folder_id === folder.id)
            .map((conv) => ({
              id: conv.id,
              title: conv.title,
              preview: conv.preview,
            }));

          console.log(
            `폴더 ${folder.name}(${folder.id})에 ${folderConversations.length}개의 대화 할당됨`
          );
          return {
            ...folder,
            conversations: folderConversations,
          };
        });

        setFolders(folderData);
      } else {
        console.error("폴더 데이터를 불러오지 못했습니다:", response.message);
      }
    } catch (error) {
      console.error("폴더 목록 로드 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드 및 대화 목록 변경 시 폴더 데이터 갱신
  useEffect(() => {
    setConversationsState(conversations);
    // conversations 변경 시 즉시 현재 메모리에 있는 대화 데이터로 폴더 상태 업데이트
    if (folders.length > 0) {
      updateFoldersWithCurrentConversations();
    } else {
      // 초기 로드 시에만 서버에서 폴더 데이터 가져오기
      loadFolders();
    }
  }, [conversations]);

  // 대화 데이터로 폴더 상태 업데이트 (서버 호출 없이 메모리 내 동기화)
  const updateFoldersWithCurrentConversations = () => {
    setFolders((prevFolders) =>
      prevFolders.map((folder) => {
        // 현재 폴더에 속한 대화 목록 필터링
        const folderConversations = conversations
          .filter((conv) => conv.folder_id === folder.id)
          .map((conv) => ({
            id: conv.id,
            title: conv.title,
            preview: conv.preview,
          }));

        return {
          ...folder,
          conversations: folderConversations,
        };
      })
    );
  };

  // 폴더 생성 모드 시작
  const startCreatingFolder = () => {
    setIsCreatingFolder(true);
    setNewFolderName("");
    setTimeout(() => {
      newFolderInputRef.current?.focus();
    }, 0);
  };

  // 폴더 생성 완료
  const createFolder = async () => {
    if (newFolderName.trim()) {
      try {
        setIsLoading(true);

        // 폴더 생성 전 UI 작업 중지
        setIsCreatingFolder(false);

        // 폴더 API 호출
        const response = await folderApi.createFolder(newFolderName);
        console.log("폴더 생성 응답:", response);

        if (response.status === "success" && response.data) {
          // 성공 시 폴더 목록에 직접 추가
          const newFolder = response.data;
          setFolders((prev) => [
            ...prev,
            {
              ...newFolder,
              conversations: [],
            },
          ]);
        } else {
          // API가 성공하지 않았을 경우 전체 목록 다시 로드
          await loadFolders();
        }

        // 폴더 이름 초기화
        setNewFolderName("");
      } catch (error) {
        console.error("폴더 생성 오류:", error);
        // 오류 발생 시 폴더 목록 다시 로드
        await loadFolders();
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsCreatingFolder(false);
    }
  };

  // 대화 삭제 핸들러
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // 대화 선택 이벤트 전파 방지
    if (window.confirm("이 대화를 삭제하시겠습니까?")) {
      onDeleteConversation(id);
    }
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push("/auth");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  // 대화 내역을 시간에 따라 그룹화하는 함수
  const groupConversationsByTime = (
    conversations: Conversation[]
  ): GroupedConversations => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const previous7Days = new Date(today);
    previous7Days.setDate(previous7Days.getDate() - 7);
    const previous30Days = new Date(today);
    previous30Days.setDate(previous30Days.getDate() - 30);

    const grouped: GroupedConversations = {
      today: [],
      yesterday: [],
      previous7Days: [],
      previous30Days: [],
      older: [],
    };

    conversations.forEach((conversation) => {
      const conversationDate = new Date(conversation.lastUpdated);

      if (conversationDate >= today) {
        grouped.today.push(conversation);
      } else if (conversationDate >= yesterday) {
        grouped.yesterday.push(conversation);
      } else if (conversationDate >= previous7Days) {
        grouped.previous7Days.push(conversation);
      } else if (conversationDate >= previous30Days) {
        grouped.previous30Days.push(conversation);
      } else {
        grouped.older.push(conversation);
      }
    });

    return grouped;
  };

  // 폴더에 없는 대화만 필터링하여, conversationsState에서 가져오도록 수정
  const groupedConversations = groupConversationsByTime(
    conversationsState.filter((c) => !c.folder_id)
  );

  // 드래그 시작 처리 핸들러
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    // 드래그되는 항목 타입 설정 (id 형식에 따라 타입 구분)
    if (typeof active.id === "string") {
      setDraggedType("conversation");
      // 드래그 시작 시 body에 overflow hidden 추가하여 스크롤바 방지
      if (typeof document !== "undefined") {
        document.body.style.overflow = "hidden";
        document.body.style.overscrollBehavior = "none";
      }
    }
  };

  // 드래그 중 처리 핸들러
  const handleDragOver = (event: DragOverEvent) => {
    // 필요시 추가 기능 구현
  };

  // 드래그 종료 처리 핸들러
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    // 드래그 종료 시 body 스타일 복원
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
      document.body.style.overscrollBehavior = "";
    }

    if (!active || !over) {
      setActiveId(null);
      setDraggedType(null);
      return;
    }

    const conversationId = active.id as string;
    const overId = over.id as string;

    // UI 즉시 업데이트를 위해 현재 대화 객체 찾기
    const draggedConversation = conversationsState.find(
      (c) => c.id === conversationId
    );

    if (!draggedConversation) {
      setActiveId(null);
      setDraggedType(null);
      return;
    }

    // 드래그 시작 및 종료 영역이 같으면 아무 작업 안함
    const originalFolderId = draggedConversation.folder_id;

    // 폴더 영역으로 드롭된 경우
    if (overId.startsWith("folder-")) {
      const targetFolderId = overId.replace("folder-", "");

      // 같은 폴더로 드롭된 경우 무시
      if (originalFolderId === targetFolderId) {
        console.log("같은 폴더로 드롭되어 작업을 무시합니다.");
        setActiveId(null);
        setDraggedType(null);
        return;
      }

      try {
        console.log(
          `대화 ${conversationId}를 폴더 ${targetFolderId}로 이동 시도...`
        );

        // 1. API 호출로 서버 상태 업데이트
        const response = await conversationApi.updateConversation(
          conversationId,
          { folder_id: targetFolderId }
        );

        console.log(`서버 응답:`, response);

        if (response.status === "success") {
          console.log(
            `서버 업데이트 성공: 대화 ${conversationId}를 폴더 ${targetFolderId}로 이동`
          );

          // 2. UI 상태 업데이트
          // 2-1. 대화 상태 업데이트
          setConversationsState((prev) =>
            prev.map((conv) =>
              conv.id === conversationId
                ? { ...conv, folder_id: targetFolderId }
                : conv
            )
          );

          // 2-2. 원래 폴더에서 대화 제거 (있는 경우)
          if (originalFolderId) {
            setFolders((prevFolders) =>
              prevFolders.map((folder) => {
                if (folder.id === originalFolderId) {
                  return {
                    ...folder,
                    conversations: folder.conversations.filter(
                      (c) => c.id !== conversationId
                    ),
                  };
                }
                return folder;
              })
            );
          }

          // 2-3. 대상 폴더에 대화 추가
          setFolders((prevFolders) =>
            prevFolders.map((folder) => {
              if (folder.id === targetFolderId) {
                return {
                  ...folder,
                  conversations: [
                    ...folder.conversations.filter(
                      (c) => c.id !== conversationId
                    ),
                    {
                      id: draggedConversation.id,
                      title: draggedConversation.title,
                      preview: draggedConversation.preview,
                    },
                  ],
                };
              }
              return folder;
            })
          );
        } else {
          console.error("대화 이동 API 호출 실패:", response.message);
          // 실패 시 원래 상태로 복원
          await loadFolders();
        }
      } catch (error) {
        console.error("대화를 폴더에 할당하는 중 오류 발생:", error);
        // 오류 발생 시 폴더 목록 다시 로드
        await loadFolders();
      }
    }
    // conversations 영역으로 드롭된 경우 (폴더에서 빼내기)
    else if (overId === "conversations-area") {
      // 원래 폴더가 없는 경우 무시
      if (!originalFolderId) {
        console.log("이미 폴더 밖에 있는 대화입니다.");
        setActiveId(null);
        setDraggedType(null);
        return;
      }

      try {
        console.log(`대화 ${conversationId}를 폴더 밖으로 이동 시도...`);

        // 1. API 호출로 서버 상태 업데이트
        const response = await conversationApi.updateConversation(
          conversationId,
          { folder_id: null }
        );

        console.log(`서버 응답:`, response);

        if (response.status === "success") {
          console.log(
            `서버 업데이트 성공: 대화 ${conversationId}를 폴더 밖으로 이동`
          );

          // 2-1. 원래 폴더에서 대화 제거 (먼저 실행)
          setFolders((prevFolders) => {
            console.log(`폴더에서 대화 ${conversationId} 제거 시작`);
            const updatedFolders = prevFolders.map((folder) => {
              if (folder.id === originalFolderId) {
                console.log(
                  `폴더 ${folder.id}에서 대화 ${conversationId} 제거`
                );
                return {
                  ...folder,
                  conversations: folder.conversations.filter(
                    (c) => c.id !== conversationId
                  ),
                };
              }
              return folder;
            });
            console.log("폴더 상태 업데이트:", updatedFolders);
            return updatedFolders;
          });

          // 2-2. 대화 상태 업데이트 (폴더 ID 제거)
          setConversationsState((prev) => {
            const updated = prev.map((conv) =>
              conv.id === conversationId
                ? { ...conv, folder_id: undefined }
                : conv
            );
            console.log("대화 상태 업데이트:", updated);
            return updated;
          });

          // 로그를 통해 상태 확인
          console.log("폴더에서 대화 제거 완료");
        } else {
          console.error("대화 이동 API 호출 실패:", response.message);
          // 실패 시 원래 상태로 복원
          await loadFolders();
        }
      } catch (error) {
        console.error("대화를 폴더에서 제거하는 중 오류 발생:", error);
        // 오류 발생 시 폴더 목록 다시 로드
        await loadFolders();
      }
    }

    setActiveId(null);
    setDraggedType(null);
  };

  // 드래그 취소 처리 핸들러
  const handleDragCancel = () => {
    setActiveId(null);
    setDraggedType(null);
    // 드래그 종료 시 body 스타일 복원
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
      document.body.style.overscrollBehavior = "";
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="h-full flex flex-col bg-white w-80">
        {/* 사이드바 내용 */}
        <div className="flex-1 overflow-auto">
          <aside className="p-2">
            {/* 폴더 섹션 헤더 */}
            <div className="z-20 text-xs font-semibold select-none overflow-clip">
              <h2
                id="folders-heading"
                className="flex h-[26px] w-full items-center gap-1 text-xs text-gray-800 cursor-pointer"
                onClick={() => setShowFolders(!showFolders)}
              >
                <span>
                  {showFolders ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </span>
                <span>프로젝트</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startCreatingFolder();
                  }}
                  className="ml-auto p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                  title="프로젝트 추가"
                >
                  <Plus size={14} />
                </button>
              </h2>
            </div>

            {/* 폴더 목록 */}
            {showFolders && (
              <FolderList
                folders={folders}
                currentConversationId={currentConversationId || null}
                onSelectConversation={onSelectConversation}
                onRenameFolder={(folderId, newName) => {
                  folderApi
                    .updateFolder(folderId, newName)
                    .then(() => loadFolders())
                    .catch((error) =>
                      console.error("폴더 이름 변경 오류:", error)
                    );
                }}
                onDeleteFolder={(folderId) => {
                  // 삭제 전 UI에서 미리 제거
                  setFolders((prevFolders) =>
                    prevFolders.filter((folder) => folder.id !== folderId)
                  );

                  // API 호출
                  folderApi
                    .deleteFolder(folderId)
                    .then(() => {
                      console.log(`폴더 ${folderId} 삭제 완료`);
                      // 이미 UI에서 제거했으므로 loadFolders는 호출하지 않음
                    })
                    .catch((error) => {
                      console.error("폴더 삭제 오류:", error);
                      // 오류 발생 시 다시 폴더 목록 로드
                      loadFolders();
                    });
                }}
                onCreateFolder={startCreatingFolder}
                onDeleteConversation={onDeleteConversation}
                activeId={activeId}
              />
            )}

            {/* 폴더 생성 UI */}
            {isCreatingFolder && (
              <div className="px-3 py-2 flex items-center">
                <input
                  ref={newFolderInputRef}
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") createFolder();
                    if (e.key === "Escape") setIsCreatingFolder(false);
                  }}
                  className="flex-1 px-2 py-1.5 border border-gray-400 rounded text-sm bg-white text-gray-900 placeholder-gray-500 font-medium shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="프로젝트 이름"
                  autoFocus
                />
                <button
                  onClick={createFolder}
                  className="ml-2 p-1 text-blue-600 hover:text-blue-800"
                  disabled={isLoading}
                >
                  <Plus size={16} />
                </button>
              </div>
            )}

            {/* 시간별 그룹화된 대화 목록 헤더 */}
            <div className="z-20 text-xs font-semibold select-none overflow-clip ps-2 pt-3">
              <h2
                id="conversations-heading"
                className="flex h-[26px] w-full items-center gap-1 text-xs text-gray-800 cursor-pointer"
                onClick={() => setShowConversations(!showConversations)}
              >
                <span>
                  {showConversations ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </span>
                <span>대화 내역</span>
              </h2>
            </div>

            {/* 시간별 그룹화된 대화 목록 */}
            {showConversations && (
              <ConversationsArea id="conversations-area">
                {Object.entries(groupedConversations).map(([group, convos]) => {
                  if (convos.length === 0) return null;

                  return (
                    <div
                      key={group}
                      className="relative mt-5 first:mt-0 last:mb-5"
                    >
                      <div className="bg-white sticky top-0 z-20">
                        <span className="flex h-9 items-center">
                          <h3 className="px-4 text-xs font-semibold text-ellipsis overflow-hidden break-all pt-3 pb-2 text-gray-800">
                            {groupTitles[group as TimeGroup]}
                          </h3>
                        </span>
                      </div>

                      <ol className="px-2">
                        {convos.map((conversation: Conversation) => (
                          <ConversationItem
                            key={conversation.id}
                            conversation={conversation}
                            isActive={activeId === conversation.id}
                            isCurrentConversation={
                              currentConversationId === conversation.id
                            }
                            onSelect={onSelectConversation}
                            onDelete={handleDelete}
                          />
                        ))}
                      </ol>
                    </div>
                  );
                })}
              </ConversationsArea>
            )}
          </aside>
        </div>

        {/* 작업 버튼 영역 */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={onNewConversation}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            <Plus size={16} />
            <span>새 대화</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full mt-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* DragOverlay 추가 */}
      <DragOverlay>
        {activeId && draggedType === "conversation" && (
          <DragOverlayContent
            type={draggedType}
            id={activeId}
            conversations={conversationsState}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default ConversationSidebar;
