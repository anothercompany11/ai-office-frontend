import { useDraggable, useDroppable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { FolderClosed, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import RenameFolderModal from "./rename-folder-modal";
import TwoButtonModal from "./two-button-modal";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/app/context/SidebarContext";
import { useGetCurrentDevice } from "@/hooks/use-get-current-device";

// 폴더 내부 대화 타입
interface Conversation {
  id: string;
  title: string;
  preview?: string;
  created_at?: string;
  updated_at?: string;
}

// 폴더 타입 정의
export interface ConversationFolder {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  conversations: Conversation[];
  instruction?: string;
}

interface FolderItemProps {
  folder: ConversationFolder;
  isExpanded: boolean;
  toggleFolder: (folderId: string) => void;
  onSelectConversation: (conversationId: string) => void;
  currentConversationId: string | null;
  onRenameFolder: (folderId: string, newName: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onDeleteConversation?: (id: string) => void;
  activeId?: string | null;
  isHovered?: boolean;
  folderPrefix?: string;
}

// 폴더 내부 대화 항목 컴포넌트 - 드래그 가능하게 수정
function FolderConversationItem({
  conversation,
  isCurrentConversation,
  isActive,
  onSelect,
  onDelete,
}: {
  conversation: Conversation;
  isCurrentConversation: boolean;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (e: React.MouseEvent | null, id: string) => void;
}) {
  const router = useRouter();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { setIsSidebarVisible } = useSidebar();
  const isMobile = useGetCurrentDevice() !== "web";
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: conversation.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
        position: "relative" as const,
        boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
        background: "white",
        width: "calc(100% - 8px)",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        padding: "4px 8px",
        margin: "0 4px",
      }
    : undefined;

  const handleSelectConversation = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) {
      return;
    }
    e.stopPropagation();
    onSelect(conversation.id);
    router.push(`/chat/${conversation.id}`);

    // 모바일 환경에서 사이드바 닫기
    if (isMobile) {
      setIsSidebarVisible(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex items-center justify-between px-2 text-body-s rounded-lg cursor-pointer hover:bg-[#EEEFF1] group ${
        isPopoverOpen ? "bg-[#EEEFF1]" : ""
      }`}
      onClick={handleSelectConversation}
    >
      <span className="py-3 truncate">{conversation.title}</span>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <button
            className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 text-label-alternative ${
              isPopoverOpen ? "opacity-100" : ""
            }`}
            aria-label="대화 메뉴"
          >
            <MoreHorizontal size={18} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="absolute w-[140px] p-2 space-y-3 border border-line bg-white rounded-lg top-[-25px] left-[-10px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPopoverOpen(false);
              setIsDeleteModalOpen(true);
            }}
            className="flex items-center justify-between w-full rounded-lg p-2 hover:bg-[#F9FAFA]"
          >
            <span className="text-body-s text-status-error">삭제하기</span>
            <Trash2 size={18} className="text-status-error" />
          </button>
        </PopoverContent>
      </Popover>

      {/* 삭제 확인 모달 */}
      <TwoButtonModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="정말 삭제하시나요?"
        confirmButtonText="삭제하기"
        onConfirm={() => {
          onDelete(null, conversation.id);
          setIsDeleteModalOpen(false);
        }}
      />
    </div>
  );
}

export default function FolderItem({
  folder,
  isExpanded,
  toggleFolder,
  onSelectConversation,
  currentConversationId,
  onRenameFolder,
  onDeleteFolder,
  onDeleteConversation,
  activeId,
  isHovered = false,
  folderPrefix = "folder-",
}: FolderItemProps) {
  const router = useRouter();
  const [isRenaming, setIsRenaming] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false); // 이름 변경 모달 노출 여부
  const [showDeleteModal, setShowDeleteModal] = useState(false); // 삭제 모달 노출 여부
  const [newName, setNewName] = useState(folder.name);
  const [showMenu, setShowMenu] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const renameInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { setIsSidebarVisible } = useSidebar();
  const isMobile = useGetCurrentDevice() !== "web";

  // 폴더를 드롭 영역으로 설정
  const { setNodeRef, isOver } = useDroppable({
    id: `${folderPrefix}${folder.id}`,
  });

  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
    }
  }, [isRenaming]);

  // 외부 클릭시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showMenu &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleRename = () => {
    if (newName.trim() !== "") {
      onRenameFolder(folder.id, newName);
    } else {
      setNewName(folder.name);
    }
    setIsRenaming(false);
  };

  // 폴더 삭제 핸들러
  const handleDeleteFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    setShowDeleteModal(true);
  };

  const handleStartRenaming = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowRenameModal(true);
    setShowMenu(false);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  // 대화 삭제 핸들러
  const handleDeleteConversation = (
    e: React.MouseEvent | null,
    conversationId: string,
  ) => {
    e?.stopPropagation();
    onDeleteConversation?.(conversationId);
  };

  // 폴더 클릭 핸들러
  const handleFolderClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFolder(folder.id);

    // 모바일 환경에서 사이드바 닫기
    if (isMobile) {
      setIsSidebarVisible(false);
    }
  };

  // 폴더 이름 클릭 핸들러
  const handleFolderNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/chat/project/${folder.id}`);

    // 모바일 환경에서 사이드바 닫기
    if (isMobile) {
      setIsSidebarVisible(false);
    }
  };

  return (
    <div>
      <div
        ref={setNodeRef}
        className={`flex items-center px-[13.5px] cursor-pointer rounded-lg hover:bg-[#F9FAFA] group ${
          isPopoverOpen ? "bg-[#F9FAFA]" : ""
        } ${
          isOver || isHovered
            ? "bg-background-alternative border border-dashed border-gray-400"
            : ""
        }`}
        onClick={handleFolderClick}
      >
        <div className="flex items-center gap-[9px] flex-grow overflow-hidden py-3">
          <FolderClosed size={16} />

          {isRenaming ? (
            <div
              className="flex-grow px-1 "
              onClick={(e) => e.stopPropagation()}
            >
              <input
                ref={renameInputRef}
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                  if (e.key === "Escape") {
                    setNewName(folder.name);
                    setIsRenaming(false);
                  }
                }}
                onBlur={handleRename}
                className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ) : (
            <span
              className="text-body-s truncate flex-grow"
              onClick={handleFolderNameClick}
            >
              {folder.name}
            </span>
          )}
        </div>
        {!isRenaming && (
          <div className="relative" ref={menuRef}>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  onClick={toggleMenu}
                  className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 ${
                    isPopoverOpen ? "opacity-100" : ""
                  }`}
                  aria-label="폴더 메뉴"
                >
                  <MoreHorizontal
                    size={18}
                    className="text-label-alternative"
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent className="absolute w-[140px] p-2 space-y-3 border border-line bg-white rounded-lg top-[-25px] left-[-10px]">
                <button
                  onClick={handleStartRenaming}
                  className="flex items-center justify-between w-full rounded-lg p-2 hover:bg-[#F9FAFA]"
                >
                  <span className="text-body-s text-label-strong">
                    이름 변경하기
                  </span>
                  <Pencil size={14} />
                </button>
                {!folder.is_default && (
                  <button
                    onClick={handleDeleteFolder}
                    className="flex items-center justify-between w-full rounded-lg p-2 hover:bg-[#F9FAFA]"
                  >
                    <span className="text-body-s text-status-error">
                      삭제하기
                    </span>
                    <Trash2 size={18} className="text-status-error" />
                  </button>
                )}
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        {isExpanded &&
          folder.conversations &&
          folder.conversations.length > 0 && (
            <ul className="space-y-1 ml-8">
              {folder.conversations.map((conversation: Conversation) => (
                <li key={conversation.id}>
                  <FolderConversationItem
                    conversation={conversation}
                    isCurrentConversation={
                      currentConversationId === conversation.id
                    }
                    isActive={activeId === conversation.id}
                    onSelect={onSelectConversation}
                    onDelete={(e) =>
                      handleDeleteConversation(e, conversation.id)
                    }
                  />
                </li>
              ))}
            </ul>
          )}
      </motion.div>
      {/* ───────── 이름 변경 모달 ───────── */}
      <RenameFolderModal
        isOpen={showRenameModal}
        defaultName={folder.name}
        onClose={() => setShowRenameModal(false)}
        onConfirm={(newName) => {
          onRenameFolder(folder.id, newName);
          setShowRenameModal(false);
        }}
      />

      {/* ───────── 삭제 확인 모달 ───────── */}
      <TwoButtonModal
        confirmButtonText="삭제하기"
        description={`삭제된 내용은 다시 복구할 수 없으며\n모든 대화 내용이 영구적으로 삭제됩니다.`}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="정말 삭제하시나요?"
        onConfirm={() => {
          onDeleteFolder(folder.id);
          setShowDeleteModal(false);
        }}
      />
    </div>
  );
}
