import { cn } from "@/app/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { ChevronDown, ChevronRight, Folder, MoreVertical } from "lucide-react";
import React, { RefObject } from "react";
import { ChatFolder, DragItemType } from "./types";

interface DroppableFolderProps {
  folder: ChatFolder;
  isExpanded: boolean;
  isSelected: boolean;
  onToggle: (folderId: string) => void;
  onSelect: (folderId: string) => void;
  menuOpen?: boolean;
  onMenuClick?: (e: React.MouseEvent) => void;
  isEditing?: boolean;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
  inputRef?: RefObject<HTMLInputElement>;
  initialEditValue?: string;
}

export function DroppableFolder({
  folder,
  isExpanded,
  isSelected,
  onToggle,
  onSelect,
  menuOpen,
  onMenuClick,
  isEditing = false,
  onSaveEdit,
  onCancelEdit,
  inputRef,
  initialEditValue = "",
}: DroppableFolderProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: `folder-${folder.id}`,
    data: {
      type: DragItemType.FOLDER_TARGET,
      id: folder.id,
      accepts: [DragItemType.CONVERSATION, DragItemType.FOLDER],
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(folder.id);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(folder.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSaveEdit) {
      onSaveEdit();
    } else if (e.key === "Escape" && onCancelEdit) {
      onCancelEdit();
    }
  };

  // 메뉴 버튼 클릭 핸들러
  const handleMenuButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onMenuClick) {
      onMenuClick(e);
    }
  };

  if (isEditing) {
    return (
      <div className="w-full p-2">
        <div className="flex items-center">
          <input
            ref={inputRef}
            type="text"
            defaultValue={initialEditValue}
            className="flex-1 text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            onKeyDown={handleKeyDown}
          />
          <button
            className="ml-2 text-xs text-blue-600 hover:text-blue-800"
            onClick={onSaveEdit}
          >
            저장
          </button>
          <button
            className="ml-1 text-xs text-gray-600 hover:text-gray-800"
            onClick={onCancelEdit}
          >
            취소
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "group w-full text-left rounded-lg active:opacity-90 h-9 flex items-center gap-2.5 p-2",
        isSelected ? "bg-gray-200" : "hover:bg-gray-100",
        isOver ? "bg-blue-50" : ""
      )}
      onClick={handleClick}
      data-folder-id={folder.id}
    >
      <button
        onClick={handleToggle}
        className="flex h-6 w-6 items-center justify-center text-gray-600 flex-shrink-0 hover:bg-gray-200 rounded"
      >
        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>

      <div className="flex h-6 w-6 items-center justify-center text-gray-600 flex-shrink-0">
        <Folder size={18} />
      </div>

      <div className="grow overflow-hidden text-sm text-ellipsis whitespace-nowrap font-medium">
        {folder.name}
      </div>

      {onMenuClick && (
        <button
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          onClick={handleMenuButtonClick}
          aria-label="폴더 메뉴"
          type="button"
        >
          <MoreVertical size={14} />
        </button>
      )}
    </div>
  );
}
