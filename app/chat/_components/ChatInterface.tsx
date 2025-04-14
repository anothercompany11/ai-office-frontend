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
  isNewChat?: boolean; // 새 대화 여부
}

const ChatInterface = ({
  conversationId,
  onUpdateConversation,
  onAssignToFolder,
  isNewChat = false,
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
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState("");
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
      // "new" 대화인 경우 API 호출하지 않음
      if (id === "new" || isNewChat) {
        setMessages([
          {
            role: MessageRole.ASSISTANT,
            content: "안녕하세요! 무엇을 도와드릴까요?",
          },
        ]);
        setNewTitle("새 대화");
        setCurrentFolderId(null);
        setIsLoading(false);
        return;
      }

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
    // "new" 대화인 경우 폴더 목록 로드하지 않음
    if (conversationId !== "new" && !isNewChat) {
      loadFolders();
    }
  }, [conversationId, isNewChat]);

  // 대화 ID가 변경될 때마다 메시지 로드
  useEffect(() => {
    if (conversationId) {
      loadConversationMessages(conversationId);
    }
  }, [conversationId, isNewChat]);

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

        // "new" 대화인 경우 서버 API 호출 건너뛰기
        if (conversationId === "new" || isNewChat) {
          onUpdateConversation(conversationId, { title: newTitle });
          setEditingConversationTitle(false);
          setIsLoading(false);
          return;
        }

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
    setCurrentAssistantMessage(""); // 어시스턴트 응답 초기화

    try {
      // 스트리밍 API 호출
      const stream = await conversationApi.sendStreamingMessage(
        content,
        conversationId
      );

      if (!stream) {
        throw new Error("스트리밍 응답을 받을 수 없습니다.");
      }

      let responseConversationId: string | null = null;
      let fullContent = "";

      // 스트림 처리를 위한 reader 설정
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      // 첫 청크에서 content 값이 있을 수 있도록 약간 지연
      setCurrentAssistantMessage(" ");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // 청크 디코딩
        const chunk = decoder.decode(value, { stream: true });

        // SSE 형식 처리 (data: {...} 형식의 라인들)
        const lines = chunk
          .split("\n\n")
          .filter((line) => line.trim().startsWith("data:"));

        for (const line of lines) {
          const dataContent = line.replace("data: ", "").trim();

          // 스트림 종료 신호 확인
          if (dataContent === "[DONE]") {
            continue;
          }

          try {
            const parsedData = JSON.parse(dataContent);

            // 오류 메시지 처리
            if (parsedData.error) {
              throw new Error(parsedData.error);
            }

            // 첫 번째 청크가 conversation_id인 경우 (새 대화)
            if (parsedData.conversation_id && !responseConversationId) {
              responseConversationId = parsedData.conversation_id;
              continue;
            }

            // 일반 텍스트 청크 처리
            if (parsedData.content) {
              fullContent += parsedData.content;
              setCurrentAssistantMessage(fullContent);
            }
          } catch (error) {
            console.error("스트림 데이터 파싱 오류:", error);
          }
        }
      }

      // 새 대화인 경우 ID 처리
      let currentConversationId = conversationId;
      if (
        (!conversationId || conversationId === "new") &&
        responseConversationId
      ) {
        currentConversationId = responseConversationId;

        // 부모 컴포넌트에 새 대화 ID 알림 (새 대화 생성 시)
        const title =
          content.length > 30 ? `${content.substring(0, 27)}...` : content;

        if (typeof onUpdateConversation === "function") {
          // 대화 목록에 즉시 추가되도록 필요한 정보 전달
          onUpdateConversation(conversationId, {
            id: responseConversationId,
            title: title,
            preview: content,
            lastUpdated: new Date(),
          });
        }

        // 새 ID로 폴더 목록 로드
        loadFolders();
      }

      // 완성된 응답 메시지 추가
      setMessages((prev) => [
        ...prev,
        {
          role: MessageRole.ASSISTANT,
          content: fullContent,
          created_at: new Date().toISOString(),
        },
      ]);

      // 제목과 미리보기 업데이트 처리
      if (messages.length <= 1 && content.length > 0) {
        // 첫 메시지인 경우
        const title =
          content.length > 30 ? `${content.substring(0, 27)}...` : content;

        try {
          // "new" 대화가 아닌 경우에만 제목 업데이트 API 호출 (이미 위에서 새 대화 생성 시 처리됨)
          if (conversationId !== "new" && !isNewChat) {
            await conversationApi.updateConversation(
              currentConversationId,
              title
            );
          }

          // 새 대화가 아닌 경우 로컬 상태 업데이트
          if (conversationId !== "new") {
            onUpdateConversation(currentConversationId, {
              title,
              preview: content,
              lastUpdated: new Date(),
            });
          }

          setNewTitle(title);
        } catch (err) {
          console.error("대화 제목 자동 업데이트 실패:", err);
        }
      } else {
        // 기존 대화의 미리보기 업데이트
        onUpdateConversation(currentConversationId, {
          preview: content,
          lastUpdated: new Date(),
        });
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
      setCurrentAssistantMessage(""); // 스트리밍 완료 후 초기화
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
            <ChatMessage
              role={MessageRole.ASSISTANT}
              content={currentAssistantMessage}
              isStreaming={true}
            />
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
