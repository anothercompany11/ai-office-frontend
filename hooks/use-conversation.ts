"use client";

import { useCallback, useState } from "react";
import { conversationApi } from "@/app/api";
import { Conversation } from "@/app/chat/_components/types";

/**
 * 채팅 리스트와 관련된 모든 상태·행동 관리 훅
 */
export default function useConversations() {
  /* ────────── state ────────── */
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [pendingFirstMsg, setPendingFirstMsg] = useState<string | null>(null);

  /* ────────── utils ────────── */
  const syncCurrentIdWithStorage = useCallback((id: string | null) => {
    setCurrentId(id);
    id
      ? localStorage.setItem("currentConversationId", id)
      : localStorage.removeItem("currentConversationId");
  }, []);

  /* ────────── actions ────────── */
  /** 1. 사이드바의 '+' 버튼 -> 빈 채팅 화면 렌더링 트리거 */
  const startBlankConversation = () => {
    setPendingFirstMsg(null);
    syncCurrentIdWithStorage(null); // currentId를 null로 해서 EmptyChatScreen 렌더링
  };

  /** 2. 빈 채팅 화면에서 대화 시작 */
  const createNewConversation = (firstMsg: string) => {
    // 메시지가 비어있는지 확인
    if (!firstMsg || !firstMsg.trim()) return;
    
    // 대화 시작 상태로 설정
    setCurrentId("new");
    // 전체 메시지를 저장
    setPendingFirstMsg(firstMsg.trim());
  };

  /** 3. 목록 불러오기 */
  const loadConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true);
      const res = await conversationApi.getConversations();
      if (res.status !== "success" || !Array.isArray(res.data)) return;

      const formatted = res.data.map<Conversation>((c) => ({
        ...c,
        title: c.title || "새 대화",
        preview: c.preview || "",
        lastUpdated: new Date(c.updated_at),
      }));

      setConversations(formatted);
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  /** 4. 스트리밍 종료 후 'new' → 실제 ID 확정 */
  const finalizeNewConversation = useCallback(
    (realId: string) => syncCurrentIdWithStorage(realId),
    [syncCurrentIdWithStorage],
  );

  /** 5. 대화 정보 업데이트(제목·미리보기 등) */
  const updateConversation = useCallback(
    (id: string, data: Partial<Conversation>) => {
      setConversations((prev) => {
        /* 새 ID가 아직 목록에 없으면 prepend */
        if (data.id && !prev.some((c) => c.id === data.id)) {
          const newConv: Conversation = {
            id: data.id,
            title: data.title || "새 대화",
            preview: data.preview || "",
            lastUpdated: data.lastUpdated || new Date(),
            folder_id: data.folder_id,
          };
          return [newConv, ...prev];
        }

        /* 기존 항목 업데이트 */
        return prev.map((c) =>
          c.id === id
            ? { ...c, ...data, lastUpdated: data.lastUpdated || new Date() }
            : c,
        );
      });

      /* ⚠️ 여기서는 currentId를 바꾸지 않는다!
         실제 ID 전환은 finalizeNewConversation에서만 수행 */
    },
    [],
  );

  /** 6. 대화 삭제 */
  const deleteConversation = useCallback(
    async (id: string) => {
      const res = await conversationApi.deleteConversation(id);
      if (res.status !== "success") return;

      setConversations((prev) => prev.filter((c) => c.id !== id));

      if (currentId === id) syncCurrentIdWithStorage(null);
    },
    [currentId, syncCurrentIdWithStorage],
  );

  /** 7. 폴더 할당 */
  const assignToFolder = async (
    conversationId: string,
    folderId: string | null,
  ) => {
    const res = await conversationApi.updateConversation(conversationId, {
      folder_id: folderId,
    });
    if (res.status !== "success") return;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, folder_id: folderId ?? undefined }
          : c,
      ),
    );
  };

  return {
    /* state */
    conversations,
    isLoadingConversations,
    currentId,
    pendingFirstMsg,

    /* actions */
    loadConversations,
    startBlankConversation,
    createNewConversation,
    updateConversation,
    deleteConversation,
    assignToFolder,
    selectConversation: syncCurrentIdWithStorage,
    clearPendingFirstMsg: () => setPendingFirstMsg(null),
    finalizeNewConversation,
  };
}
