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
  const [pendingFirstMsg, setPendingFirstMsg] = useState<string | null>(null);

  /* 새 대화 + 첫 메시지 저장 */
  // const createNewConversation = (first?: string) => {
  //   if (first) setPendingFirstMsg(first);
  //   syncCurrentIdWithStorage("new");
  // };

  /* 유틸 */
  const syncCurrentIdWithStorage = useCallback((id: string | null) => {
    setCurrentId(id);
    id
      ? localStorage.setItem("currentConversationId", id)
      : localStorage.removeItem("currentConversationId");
  }, []);

  /* ---------- 1. 사이드바용: 빈 방 시작 ---------- */
  const startBlankConversation = () => {
    setPendingFirstMsg(null); // 버퍼 비우기
    syncCurrentIdWithStorage("new"); // ChatInterface가 'new' 모드로
  };

  /* ---------- 2. EmptyChatScreen용: 방 생성 + 첫 질문 ---------- */
  const createNewConversation = async (firstMsg: string, folderId?: string) => {
    console.log("hhh");
    setIsLoadingConversations(true);
    try {
      /* 서버에 방 생성 */
      const res = await conversationApi.createConversation("새 대화", folderId);
      if (res.status !== "success" || !res.data?.id) throw new Error("fail");

      const newConv: Conversation = {
        id: res.data.id,
        title: res.data.title || "새 대화",
        preview: "",
        lastUpdated: new Date(),
        folder_id: folderId,
      };

      /* 목록 prepend & 선택 */
      setConversations((prev) => [newConv, ...prev]);
      syncCurrentIdWithStorage(newConv.id);

      /* ChatInterface로 첫 질문 넘기기 */
      setPendingFirstMsg(firstMsg);
    } finally {
      setIsLoadingConversations(false);
    }
  };

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

      console.log("저장된 id", savedId);

      /** 로컬에 저장된 ID 우선, 없으면 첫 번째 대화 */
      // if (
      //   savedId &&
      //   savedId !== "new" &&
      //   formatted.some((c) => c.id === savedId)
      // ) {
      //   syncCurrentIdWithStorage(savedId);
      // } else if (formatted.length > 0 && !currentId) {
      //   syncCurrentIdWithStorage(formatted[0].id);
      // }
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
    startBlankConversation,
    createNewConversation,
    updateConversation,
    deleteConversation,
    assignToFolder,
    selectConversation: syncCurrentIdWithStorage,
    pendingFirstMsg, // ChatScreenContainer 로 노출
    clearPendingFirstMsg: () => setPendingFirstMsg(null),
  };
}
