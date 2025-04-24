"use client";
import { useDraggable } from "@dnd-kit/core";
import { Trash2 } from "lucide-react";
import { Conversation } from "../types";

interface Props {
  conversation: Conversation;
  isActive: boolean;
  isCurrent: boolean;
  onSelect: (id: string) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

export default function ConversationItem({
  conversation,
  isActive,
  isCurrent,
  onSelect,
  onDelete,
}: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: conversation.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px,${transform.y}px,0)`,
        zIndex: 999,
        position: "relative" as const,
        width: "calc(100% - 4px)",
        margin: "0 2px",
        boxShadow: "0 5px 10px rgba(0,0,0,.1)",
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
        className={`group rounded-lg h-9 text-sm hover:bg-gray-50 ${
          isActive ? "opacity-50" : ""
        }`}
      >
        <a
          className="flex items-center gap-2 p-2 cursor-pointer"
          onClick={() => onSelect(conversation.id)}
        >
          <span
            className={`grow overflow-hidden whitespace-nowrap ${
              isCurrent ? "text-blue-600 font-medium" : "text-gray-700"
            }`}
            title={conversation.title}
          >
            {conversation.title}
          </span>
          <button
            onClick={(e) => onDelete(e, conversation.id)}
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
