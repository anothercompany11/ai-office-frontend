import {
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { useConversations } from "@/app/context/ConversationContext";

// 컴포넌트 ID 접두사 정의
const FOLDER_PREFIX = "folder-";
const CONVERSATION_PREFIX = "conversation-";

export function useDnDSensors() {
  return useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
  );
}

export function useDragHighlight() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredFolderId, setHoveredFolderId] = useState<string | null>(null);
  const { assignToFolder } = useConversations();

  // 드래그 시작
  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
    document.body.style.overflow = "hidden";
  };

  // 드래그 중 (폴더 위에 호버)
  const onDragOver = ({ active, over }: DragOverEvent) => {
    // 대화가 폴더 위에 드래그되고 있는지 확인
    if (
      over && 
      typeof over.id === 'string' &&
      over.id.startsWith(FOLDER_PREFIX) &&
      typeof active.id === 'string' &&
      active.id.startsWith(CONVERSATION_PREFIX)
    ) {
      const folderId = over.id.replace(FOLDER_PREFIX, '');
      setHoveredFolderId(folderId);
    } else {
      setHoveredFolderId(null);
    }
  };

  // 드래그 종료
  const onDragEnd = async ({ active, over }: DragEndEvent) => {
    document.body.style.overflow = "";
    setActiveId(null);
    setHoveredFolderId(null);

    // 드래그 앤 드롭 처리
    if (
      over && 
      typeof over.id === 'string' &&
      over.id.startsWith(FOLDER_PREFIX) &&
      typeof active.id === 'string' &&
      active.id.startsWith(CONVERSATION_PREFIX)
    ) {
      const folderId = over.id.replace(FOLDER_PREFIX, '');
      const conversationId = active.id.replace(CONVERSATION_PREFIX, '');
      
      // 대화를 폴더에 할당
      try {
        await assignToFolder(conversationId, folderId);
        console.log(`대화 ${conversationId}를 폴더 ${folderId}에 할당했습니다.`);
      } catch (error) {
        console.error('대화 폴더 할당 실패:', error);
      }
    }
  };

  return { 
    activeId, 
    hoveredFolderId, 
    onDragStart, 
    onDragOver, 
    onDragEnd,
    FOLDER_PREFIX,
    CONVERSATION_PREFIX
  };
}
