"use client";
import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

export default function ConversationsArea({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
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
