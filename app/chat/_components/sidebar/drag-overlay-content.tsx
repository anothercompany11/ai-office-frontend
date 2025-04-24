"use client";

import { Conversation } from "../types";

export default function DragOverlayContent({
  id,
  conversations,
}: {
  id: string;
  conversations: Conversation[];
}) {
  const c = conversations.find((v) => v.id === id);
  if (!c) return null;

  return (
    <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-3 w-64 flex items-center">
      <span className="text-sm font-medium text-gray-700 truncate">
        {c.title}
      </span>
    </div>
  );
}
