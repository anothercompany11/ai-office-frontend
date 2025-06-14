"use client";
import { useDraggable } from "@dnd-kit/core";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Conversation } from "../types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import TwoButtonModal from "./two-button-modal";

interface Props {
  conversation: Conversation;
  onSelect: (id: string) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
  conversationPrefix?: string;
  isActive?: boolean;
}

export default function ConversationItem({
  conversation,
  onSelect,
  onDelete,
  conversationPrefix = "conversation-",
  isActive = false,
}: Props) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${conversationPrefix}${conversation.id}`,
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
        className={`group rounded-lg hover:bg-[#eeeff1] ${
          isPopoverOpen ? "bg-[#eeeff1]" : ""
        } ${isActive ? "bg-[#eeeff1] border-2 border-primary" : ""}`}
      >
        <div
          className="flex items-center justify-between px-2 cursor-pointer"
          onClick={() => onSelect(conversation.id)}
        >
          <span
            className={`grow overflow-hidden whitespace-nowrap text-body-s text-label-strong py-3`}
            title={conversation.title}
          >
            {conversation.title}
          </span>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <button
                className={`opacity-0 group-hover:opacity-100 transition-opacity p-2 text-label-alternative ${
                  isPopoverOpen ? "opacity-100" : ""
                }`}
                aria-label="대화 메뉴"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <MoreHorizontal size={18} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="absolute w-[140px] p-2 space-y-3 border border-line bg-white rounded-lg top-[-29px] left-[-10px]">
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
        </div>
      </div>
      <TwoButtonModal
        confirmButtonText="삭제하기"
        description={`삭제된 내용은 다시 복구할 수 없으며\n모든 대화 내용이 영구적으로 삭제됩니다.`}
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          onDelete({} as React.MouseEvent, conversation.id);
          setIsDeleteModalOpen(false);
        }}
        title="정말 삭제하시나요?"
      />
    </li>
  );
}
