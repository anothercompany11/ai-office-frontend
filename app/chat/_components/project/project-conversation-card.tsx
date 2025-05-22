"use client";

import { FolderDetail } from "@/app/api/dto/folder";
import { MessageSquare } from "lucide-react";

interface ProjectConversationCardProps {
  conversation: FolderDetail["conversations"][0];
  onSelect: (id: string) => void;
}

export default function ProjectConversationCard({
  conversation,
  onSelect,
}: ProjectConversationCardProps) {
  return (
    <button className="p-4 border-b border-line flex gap-3 items-center" onClick={() => onSelect(conversation.id)}>
      <MessageSquare size={24} className="text-label-alternative" />
      <div className="flex flex-col gap-1">
        <p className="text-body-m text-label-strong truncate">
          {conversation.title || "제목 없음"}
        </p>
        <p className="text-body-s text-label-assistive mt-1">
          {new Date(conversation.updated_at).toLocaleDateString("ko-KR")}
        </p>
      </div>
    </button>
  );
}
