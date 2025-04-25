import { useDraggable, useDroppable } from "@dnd-kit/core";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  FolderClosed,
  FolderIcon,
  FolderOpen,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
        boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
        background: "white",
        width: "calc(100% - 8px)",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        padding: "4px 8px",
        margin: "0 4px",
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex items-center justify-between px-2 py-3 text-body-s rounded-lg cursor-pointer hover:bg-[#eeeff1] group `}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(conversation.id);
      }}
    >
      <span className="truncate">{conversation.title}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(e, conversation.id);
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
        title="대화 삭제"
      >
        <Trash2 size={12} />
      </button>
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
}: FolderItemProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(folder.name);
  const [showMenu, setShowMenu] = useState(false);
  const renameInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 폴더를 드롭 영역으로 설정
  const { setNodeRef, isOver } = useDroppable({
    id: `folder-${folder.id}`,
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

  const handleDeleteFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("이 프로젝트를 삭제하시겠습니까?")) {
      onDeleteFolder(folder.id);
    }
    setShowMenu(false);
  };

  const handleStartRenaming = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenaming(true);
    setShowMenu(false);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  // 대화 삭제 핸들러
  const handleDeleteConversation = (
    e: React.MouseEvent,
    conversationId: string,
  ) => {
    e.stopPropagation();
    if (window.confirm("이 대화를 삭제하시겠습니까?")) {
      onDeleteConversation?.(conversationId);
    }
  };

  return (
    <div className="mb-2">
      <div
        ref={setNodeRef}
        className={`flex items-center px-[13.5px] py-3 cursor-pointer rounded-lg hover:bg-[#F9FAFA] group ${
          isOver
            ? "bg-background-natural border border-dashed border-gray-400"
            : ""
        }`}
        onClick={() => toggleFolder(folder.id)}
      >
        <div className="flex items-center gap-[9px] flex-grow overflow-hidden">
          <FolderClosed size={16} className="text-gray-500" />

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
                className="w-full px-1 py-0.5 text-sm border border-gray-300 rounded"
                autoFocus
              />
              <div className="flex mt-1 space-x-1">
                <button
                  onClick={handleRename}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => {
                    setNewName(folder.name);
                    setIsRenaming(false);
                  }}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : (
            <span className=" text-body-s text-label-strong truncate">
              {folder.name}
              {folder.is_default && (
                <span className="ml-1 text-xs text-gray-500">(기본)</span>
              )}
            </span>
          )}
        </div>
        {!isRenaming && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              title="폴더 메뉴"
              aria-label="폴더 메뉴"
            >
              <MoreHorizontal size={18} className="text-label-alternative" />
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                  className="absolute space-y-3 right-0 top-full w-[140px] bg-white shadow-lg rounded-md p-2 z-10 border border-gray-200"
                  onClick={(e) => e.stopPropagation()}
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isExpanded &&
          folder.conversations &&
          folder.conversations.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
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
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}
