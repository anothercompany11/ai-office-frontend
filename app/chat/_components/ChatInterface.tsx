"use client";

import { conversationApi } from "@/app/api/conversation";
import { ClientConversation, ClientMessage } from "@/app/api/dto/conversation";
import { folderApi } from "@/app/api/folder";
import { MessageRole } from "@/types";
import { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

// 폴더 타입 정의
interface Folder {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

interface ChatInterfaceProps {
  conversationId: string;
  onUpdateConversation: (id: string, data: Partial<ClientConversation>) => void;
  onAssignToFolder: (
    conversationId: string,
    folderId: string | null
  ) => Promise<void>;
}

const ChatInterface = ({
  conversationId,
  onUpdateConversation,
  onAssignToFolder,
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ClientMessage[]>([
    {
      role: MessageRole.ASSISTANT,
      content: "안녕하세요! 무엇을 도와드릴까요?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingConversationTitle, setEditingConversationTitle] =
    useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showFolderOptions, setShowFolderOptions] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const folderMenuRef = useRef<HTMLDivElement>(null);

  // 폴더 목록 불러오기
  const loadFolders = async () => {
    try {
      const response = await folderApi.getFolders();
      if (response.status === "success" && Array.isArray(response.data)) {
        setFolders(response.data);
      }
    } catch (error) {
      console.error("폴더 목록 로드 오류:", error);
    }
  };

  // 메시지 불러오기
  const loadConversationMessages = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await conversationApi.getConversation(id);

      // API 응답이 성공했고 데이터가 있는 경우
      if (response.status === "success" && response.data) {
        const conversation = response.data;

        if (conversation.messages && conversation.messages.length > 0) {
          // 메시지 형식 변환하여 설정
          const formattedMessages = conversation.messages.map((msg) => ({
            id: msg.id,
            role:
              msg.role === "user" ? MessageRole.USER : MessageRole.ASSISTANT,
            content: msg.content,
            created_at: msg.created_at,
          }));

          setMessages(formattedMessages);

          // 대화의 제목과 폴더 ID 설정
          setNewTitle(conversation.title || "새 대화");
          setCurrentFolderId(conversation.folder_id || null);

          // 부모 컴포넌트에 대화 정보 업데이트
          if (conversation.title && conversation.title.trim() !== "") {
            onUpdateConversation(id, {
              title: conversation.title,
              folder_id: conversation.folder_id,
              preview: conversation.preview,
              lastUpdated: new Date(conversation.updated_at),
            });
          }
        } else {
          // 메시지가 없는 경우 기본 인사 메시지 표시
          setMessages([
            {
              role: MessageRole.ASSISTANT,
              content: "안녕하세요! 무엇을 도와드릴까요?",
            },
          ]);
        }
      } else {
        // API 응답이 실패한 경우 기본 인사 메시지 표시
        setMessages([
          {
            role: MessageRole.ASSISTANT,
            content: "안녕하세요! 무엇을 도와드릴까요?",
          },
        ]);
      }
    } catch (error) {
      console.error("대화 불러오기 오류:", error);
      // 오류 발생 시 기본 인사 메시지만 표시
      setMessages([
        {
          role: MessageRole.ASSISTANT,
          content: "안녕하세요! 무엇을 도와드릴까요?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadFolders();
  }, []);

  // 대화 ID가 변경될 때마다 메시지 로드
  useEffect(() => {
    if (conversationId) {
      loadConversationMessages(conversationId);
    }
  }, [conversationId]);

  // 메시지 목록이 변경될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 타이틀 편집 상태일 때 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        editingConversationTitle &&
        titleInputRef.current &&
        !titleInputRef.current.contains(e.target as Node)
      ) {
        saveConversationTitle();
      }

      // 폴더 옵션 메뉴 외부 클릭 감지
      if (
        showFolderOptions &&
        folderMenuRef.current &&
        !folderMenuRef.current.contains(e.target as Node)
      ) {
        setShowFolderOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingConversationTitle, newTitle, showFolderOptions]);

  // 대화 제목 편집 모드 시작
  const startEditingTitle = () => {
    setEditingConversationTitle(true);
    // 다음 렌더링 후 입력란에 포커스
    setTimeout(() => {
      titleInputRef.current?.focus();
    }, 0);
  };

  // 대화 제목 저장
  const saveConversationTitle = async () => {
    if (newTitle.trim()) {
      try {
        setIsLoading(true);
        const response = await conversationApi.updateConversation(
          conversationId,
          newTitle
        );

        if (response.status === "success") {
          // 부모 컴포넌트에 제목 정보 업데이트
          onUpdateConversation(conversationId, { title: newTitle });
          setEditingConversationTitle(false);
        } else {
          console.error("대화 제목 수정 실패:", response.message);
        }
      } catch (error) {
        console.error("대화 제목 수정 오류:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setEditingConversationTitle(false);
    }
  };

  // 폴더 옵션 토글
  const toggleFolderOptions = () => {
    setShowFolderOptions(!showFolderOptions);
  };

  // 폴더에 대화 할당
  const assignToFolder = async (folderId: string | null) => {
    try {
      setIsLoading(true);

      // 폴더 할당/제거 API 호출
      await onAssignToFolder(conversationId, folderId);

      // 현재 폴더 ID 상태 업데이트
      setCurrentFolderId(folderId);

      // 폴더 옵션 메뉴 닫기
      setShowFolderOptions(false);
    } catch (error) {
      console.error("대화를 폴더에 할당하는 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 메시지 전송 처리
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // 사용자 메시지 추가
    const userMessage: ClientMessage = {
      role: MessageRole.USER,
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // API 호출 - 대화 ID 전달
      const response = await conversationApi.sendMessage(
        content,
        conversationId
      );

      // 응답 메시지 처리 및 추가
      if (response.status === "success" && response.data) {
        const assistantMessage = response.data.message;
        const responseConversationId = response.data.conversation_id;

        // 대화 ID가 없거나 새로운 대화인 경우, 서버에서 반환된 ID를 사용
        let currentConversationId = conversationId;
        if (!conversationId || conversationId === "new") {
          currentConversationId = responseConversationId;

          // 부모 컴포넌트에 새 대화 ID 알림 (page.tsx에서 처리해야 함)
          if (typeof onUpdateConversation === "function") {
            onUpdateConversation(responseConversationId, {
              id: responseConversationId,
              title:
                content.length > 30
                  ? `${content.substring(0, 27)}...`
                  : content,
              preview: content,
              lastUpdated: new Date(),
            });
          }
        }

        setMessages((prev) => [
          ...prev,
          {
            role: MessageRole.ASSISTANT,
            content: assistantMessage.content,
            id: assistantMessage.id,
            created_at: assistantMessage.created_at,
          },
        ]);

        // 첫 메시지인 경우, 대화 제목 업데이트
        if (messages.length <= 1 && content.length > 0) {
          const title =
            content.length > 30 ? `${content.substring(0, 27)}...` : content;

          try {
            // 새 대화 ID로 제목 업데이트
            await conversationApi.updateConversation(
              currentConversationId,
              title
            );
            onUpdateConversation(currentConversationId, {
              title,
              preview: content,
              lastUpdated: new Date(),
            });
            setNewTitle(title);
          } catch (err) {
            console.error("대화 제목 자동 업데이트 실패:", err);
          }
        } else {
          // 미리보기 업데이트 (기존 대화인 경우)
          onUpdateConversation(currentConversationId, {
            preview: content,
            lastUpdated: new Date(),
          });
        }
      } else {
        console.warn("응답 형식이 예상과 다릅니다:", response);
        // 기본 오류 메시지 대신 가능한 경우 응답 내용 사용
        const errorContent =
          response.message ||
          "죄송합니다. 응답을 처리하는 중 오류가 발생했습니다.";

        setMessages((prev) => [
          ...prev,
          {
            role: MessageRole.ASSISTANT,
            content: errorContent,
          },
        ]);
      }
    } catch (error) {
      console.error("메시지 전송 오류:", error);

      // 오류 메시지 표시
      setMessages((prev) => [
        ...prev,
        {
          role: MessageRole.ASSISTANT,
          content: "죄송합니다. 메시지 처리 중 오류가 발생했습니다.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 현재 폴더 찾기
  const currentFolder = folders.find((folder) => folder.id === currentFolderId);

  return (
    <main className="relative h-full w-full flex-1 flex flex-col overflow-hidden">
      {/* 상단 헤더 */}
      <div className="sticky top-0 z-20 flex items-center justify-between h-12 px-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button className="py-1.5 px-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
            AI 오피스
          </button>
        </div>
        <div className="flex items-center gap-2">
          {/* 프로필/아바타 */}
          <button className="h-8 w-8 rounded-full hover:bg-gray-100">
            <div className="flex items-center justify-center bg-blue-300 text-white h-full w-full rounded-full">
              <span className="text-xs">AI</span>
            </div>
          </button>
        </div>
      </div>

      {/* 채팅 메시지 영역 - 스크롤 가능 영역 */}
      <div
        ref={chatContainerRef}
        className="flex h-full flex-col overflow-y-auto [scrollbar-gutter:stable]"
      >
        <div
          aria-hidden="true"
          data-edge="true"
          className="pointer-events-none h-px w-px"
        ></div>
        <div className="mt-1.5 flex flex-col text-sm md:pb-9">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id || index}
              role={message.role}
              content={message.content}
              timestamp={message.created_at}
            />
          ))}

          {isLoading && (
            <article className="w-full text-token-text-primary" dir="auto">
              <h5 className="sr-only">AI is typing:</h5>
              <div className="text-base my-auto mx-auto py-5 px-6">
                <div className="mx-auto flex flex-1 text-base gap-4 md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] group/turn-messages">
                  <div className="group/conversation-turn relative flex w-full min-w-0 flex-col">
                    <div className="relative flex-col gap-1 md:gap-3">
                      <div className="flex max-w-full flex-col grow">
                        <div className="min-h-8 text-message relative flex w-full flex-col gap-2 text-start break-words whitespace-normal [.text-message+&]:mt-5">
                          <div className="flex w-full flex-col gap-1 empty:hidden first:pt-[3px]">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )}
        </div>
        <div
          aria-hidden="true"
          data-edge="true"
          className="pointer-events-none h-px w-px"
        ></div>
      </div>

      {/* 채팅 입력 영역 - 고정 위치 */}
      <div className="w-full sticky bottom-0 bg-white z-10">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>

        {/* 하단 정보 */}
        <div className="text-gray-600 w-full border-t border-gray-100 flex min-h-8 items-center justify-center p-2 text-center text-xs">
          <div>AI는 실수를 할 수 있습니다. 중요한 정보를 확인하세요.</div>
        </div>
      </div>
    </main>
  );
};

export default ChatInterface;
