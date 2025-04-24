"use client";

import { useCallback, useState } from "react";
import { conversationApi } from "@/app/api";
import { ClientConversation } from "@/app/api/dto";

export type Conversation = ClientConversation;

/**
 * 채팅 리스트와 관련된 모든 상태·행동 관리 훅
 */
export default function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [currentId, setCurrentId] = useState<string | null>(null);

  /* 유틸 */
  const syncCurrentIdWithStorage = useCallback((id: string | null) => {
    setCurrentId(id);
    id
      ? localStorage.setItem("currentConversationId", id)
      : localStorage.removeItem("currentConversationId");
  }, []);

  /* ────────── READ ────────── */
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

      const savedId = localStorage.getItem("currentConversationId");
      setConversations(formatted);

      /** 로컬에 저장된 ID 우선, 없으면 첫 번째 대화 */
      if (
        savedId &&
        savedId !== "new" &&
        formatted.some((c) => c.id === savedId)
      ) {
        syncCurrentIdWithStorage(savedId);
      } else if (formatted.length > 0 && !currentId) {
        syncCurrentIdWithStorage(formatted[0].id);
      }
    } finally {
      setIsLoadingConversations(false);
    }
  }, [currentId, syncCurrentIdWithStorage]);

  /* ────────── CREATE ────────── */
  const createNewConversation = () => syncCurrentIdWithStorage("new");

  /* ────────── UPDATE ────────── */
  const updateConversation = useCallback(
    (id: string, data: Partial<Conversation>) => {
      setConversations((prev) => {
        // 새로 받은 실제 ID가 기존에 없다면 prepend
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

        // 기존 대화 업데이트
        return prev.map((c) =>
          c.id === id
            ? {
                ...c,
                ...data,
                lastUpdated: data.lastUpdated || new Date(),
              }
            : c,
        );
      });

      // "new" → 실제 ID로 전환
      if (id === "new" && data.id) syncCurrentIdWithStorage(data.id);
    },
    [syncCurrentIdWithStorage],
  );

  /* ────────── DELETE ────────── */
  const deleteConversation = useCallback(
    async (id: string) => {
      const res = await conversationApi.deleteConversation(id);
      if (res.status !== "success") return;

      setConversations((prev) => prev.filter((c) => c.id !== id));

      if (currentId === id) {
        const next = conversations.find((c) => c.id !== id);
        syncCurrentIdWithStorage(next?.id ?? null);
      }
    },
    [currentId, conversations, syncCurrentIdWithStorage],
  );

  /* ────────── FOLDER ────────── */
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

    /* actions */
    loadConversations,
    createNewConversation,
    updateConversation,
    deleteConversation,
    assignToFolder,
    selectConversation: syncCurrentIdWithStorage,
  };
}
