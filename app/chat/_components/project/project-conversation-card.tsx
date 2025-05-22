"use client";

import { FolderDetail } from "@/app/api/dto/folder";

interface ProjectConversationCardProps {
  conversation: FolderDetail["conversations"][0];
  onSelect: (id: string) => void;
}

export default function ProjectConversationCard({
  conversation,
  onSelect,
}: ProjectConversationCardProps) {
  return (
    <div
      className="p-4 rounded-lg border border-line hover:bg-background-alternative transition-colors cursor-pointer"
      onClick={() => onSelect(conversation.id)}
    >
      <p className="text-body-l text-label-strong truncate">
        {conversation.title || "제목 없음"}
      </p>
      <p className="text-body-s text-label-assistive mt-1">
        {new Date(conversation.updated_at).toLocaleDateString("ko-KR")}
      </p>
      <p className="text-xs text-gray-500 mt-2 truncate">
        {conversation.preview}
      </p>
    </div>
  );
}
