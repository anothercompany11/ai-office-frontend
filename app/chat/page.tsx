"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { conversationApi } from "../api/conversation";
import { ClientConversation } from "../api/dto/conversation";
import { useAuth } from "../context/AuthContext";
import ChatInterface from "./_components/ChatInterface";
import ConversationSidebar from "./_components/ConversationSidebar";

// 대화 항목 인터페이스 정의는 DTO로 이동
type Conversation = ClientConversation;

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // 대화 목록 로드
  const loadConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true);
      const response = await conversationApi.getConversations();

      if (response.status === "success" && Array.isArray(response.data)) {
        const formattedConversations = response.data.map((conv) => ({
          id: conv.id,
          title: conv.title || "새 대화",
          preview: conv.preview || "",
          lastUpdated: new Date(conv.updated_at),
          folder_id: conv.folder_id,
        }));

        setConversations(formattedConversations);

        // 대화가 있으면 첫 번째 대화 선택
        if (formattedConversations.length > 0 && !currentConversationId) {
          setCurrentConversationId(formattedConversations[0].id);
        }
      }
    } catch (error) {
      console.error("대화 목록을 불러오는 중 오류 발생:", error);
    } finally {
      setIsLoadingConversations(false);
    }
  }, [currentConversationId]);

  // 로그인 상태 체크 및 대화 목록 로드
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
      return;
    }

    if (user) {
      loadConversations();
    }
  }, [user, isLoading, router, loadConversations]);

  // 새 대화 생성
  const handleNewConversation = async () => {
    try {
      const response = await conversationApi.createConversation("새 대화");

      if (response.status === "success" && response.data) {
        const formattedConversation: Conversation = {
          id: response.data.id,
          title: response.data.title || "새 대화",
          preview: "",
          lastUpdated: new Date(response.data.created_at),
          folder_id: response.data.folder_id,
        };

        setConversations((prev) => [formattedConversation, ...prev]);
        setCurrentConversationId(formattedConversation.id);
      }
    } catch (error) {
      console.error("새 대화를 생성하는 중 오류 발생:", error);
    }
  };

  // 대화 선택
  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  // 대화 삭제
  const handleDeleteConversation = async (id: string) => {
    try {
      const response = await conversationApi.deleteConversation(id);

      if (response.status === "success") {
        setConversations((prev) => prev.filter((conv) => conv.id !== id));

        // 현재 대화가 삭제되었으면 첫 번째 대화로 전환
        if (currentConversationId === id) {
          const remainingConversations = conversations.filter(
            (conv) => conv.id !== id
          );
          if (remainingConversations.length > 0) {
            setCurrentConversationId(remainingConversations[0].id);
          } else {
            setCurrentConversationId(null);
          }
        }
      }
    } catch (error) {
      console.error("대화를 삭제하는 중 오류 발생:", error);
    }
  };

  // 대화 정보 업데이트 (제목, 미리보기)
  const updateConversation = useCallback(
    (id: string, data: Partial<Conversation>) => {
      // 새 대화 ID가 기존에 없는 경우 (새로운 대화 생성)
      if (data.id && !conversations.some((conv) => conv.id === id)) {
        const newConversation: Conversation = {
          id,
          title: data.title || "새 대화",
          preview: data.preview || "",
          lastUpdated: data.lastUpdated || new Date(),
          folder_id: data.folder_id,
        };

        setConversations((prev) => [newConversation, ...prev]);
        setCurrentConversationId(id);
        return;
      }

      // 기존 대화 업데이트
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === id
            ? {
                ...conv,
                ...data,
                lastUpdated: data.lastUpdated || new Date(), // 항상 업데이트 시간 갱신
              }
            : conv
        )
      );
    },
    [conversations]
  );

  // 대화를 폴더에 할당
  const assignConversationToFolder = async (
    conversationId: string,
    folderId: string | null
  ) => {
    try {
      // 폴더 ID가 null이면 폴더에서 제거하는 것을 의미
      const response = await conversationApi.updateConversation(
        conversationId,
        {
          folder_id: folderId,
        }
      );

      if (response.status === "success") {
        // 대화 목록 상태 업데이트
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  folder_id: folderId || undefined,
                  lastUpdated: new Date(),
                }
              : conv
          )
        );
      }
    } catch (error) {
      console.error("대화를 폴더에 할당하는 중 오류 발생:", error);
    }
  };

  // 로딩 중이면 로딩 표시
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      <div className="flex-1">
        {currentConversationId ? (
          <ChatInterface
            conversationId={currentConversationId}
            onUpdateConversation={updateConversation}
            onAssignToFolder={assignConversationToFolder}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">대화가 없습니다</h2>
              <p className="text-gray-500 mb-6">
                새 대화를 시작하거나 왼쪽 메뉴에서 대화를 선택하세요.
              </p>
              <button
                onClick={handleNewConversation}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
              >
                새 대화 시작하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
