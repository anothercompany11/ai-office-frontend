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

  // 현재 대화 ID 설정 (로컬 스토리지에도 저장)
  const setCurrentConversationWithStorage = useCallback((id: string | null) => {
    setCurrentConversationId(id);
    if (id) {
      localStorage.setItem("currentConversationId", id);
    } else {
      localStorage.removeItem("currentConversationId");
    }
  }, []);

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

        // 로컬 스토리지에서 저장된 대화 ID 확인
        const savedId = localStorage.getItem("currentConversationId");

        // "new" 대화 상태인 경우 로컬 상태만 업데이트 (서버에 요청 안 보냄)
        if (savedId === "new") {
          const newConversation: Conversation = {
            id: "new",
            title: "새 대화",
            preview: "",
            lastUpdated: new Date(),
          };
          setConversations([...formattedConversations]);
          // 빈 대화창 상태만 유지하고 대화 목록에는 추가하지 않음
          setCurrentConversationWithStorage("new");
        } else {
          setConversations(formattedConversations);

          // 저장된 ID가 있고 서버에 해당 대화가 존재하면 사용
          if (
            savedId &&
            savedId !== "new" &&
            formattedConversations.some((conv) => conv.id === savedId)
          ) {
            setCurrentConversationWithStorage(savedId);
          } else if (
            formattedConversations.length > 0 &&
            !currentConversationId
          ) {
            setCurrentConversationWithStorage(formattedConversations[0].id);
          }
        }
      }
    } catch (error) {
      console.error("대화 목록을 불러오는 중 오류 발생:", error);
    } finally {
      setIsLoadingConversations(false);
    }
  }, [currentConversationId, setCurrentConversationWithStorage]);

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
    // 임시 ID 생성 (실제 ID는 첫 메시지 전송 시 서버에서 받음)
    const tempId = "new";

    // 대화 목록에는 추가하지 않고 UI 상태만 변경
    setCurrentConversationWithStorage(tempId);
  };

  // 대화 선택
  const handleSelectConversation = (id: string) => {
    setCurrentConversationWithStorage(id);
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
            setCurrentConversationWithStorage(remainingConversations[0].id);
          } else {
            setCurrentConversationWithStorage(null);
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
      if (
        data.id &&
        id !== data.id &&
        !conversations.some((conv) => conv.id === data.id)
      ) {
        const newConversation: Conversation = {
          id: data.id,
          title: data.title || "새 대화",
          preview: data.preview || "",
          lastUpdated: data.lastUpdated || new Date(),
          folder_id: data.folder_id,
        };

        // "new" 상태였던 대화를 실제 ID로 대체
        if (id === "new" && currentConversationId === "new") {
          console.log("새 대화 생성 완료:", data.id);
          // 대화 목록에 새 대화 추가하고 현재 선택된 대화를 업데이트
          setConversations((prev) => [newConversation, ...prev]);
          setCurrentConversationWithStorage(data.id);
        } else {
          // 일반적인 경우 (새로운 대화)
          setConversations((prev) => [newConversation, ...prev]);
          setCurrentConversationWithStorage(data.id);
        }

        return;
      }

      // 기존 대화 업데이트 (ID는 "new"가 아닌 경우)
      if (id !== "new") {
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
      }
    },
    [conversations, setCurrentConversationWithStorage, currentConversationId]
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
      <div className="w-80 min-w-80 border-r border-gray-200">
        <ConversationSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
        />
      </div>

      <div className="flex-1">
        {currentConversationId ? (
          <ChatInterface
            key={currentConversationId}
            conversationId={currentConversationId}
            onUpdateConversation={updateConversation}
            onAssignToFolder={assignConversationToFolder}
            isNewChat={currentConversationId === "new"}
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
