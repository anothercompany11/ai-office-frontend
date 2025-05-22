"use client";

import { conversationApi } from "@/app/api/conversation";
import { ClientConversation, ClientMessage } from "@/app/api/dto/conversation";
import { MessageRole } from "@/types";
import { useEffect, useRef, useState } from "react";
import ChatInput from "./chat-input";
import ChatMessage from "./chat-message";
import { User } from "@/app/api/dto";

interface ChatInterfaceProps {
  conversationId: string;
  onUpdateConversation: (id: string, data: Partial<ClientConversation>) => void;
  isNewChat?: boolean; // 새 대화 여부
  initialMessage?: string | null;
  onInitialHandled?: () => void;
  finalizeNewConversation: (realId: string) => void;
  user: User;
  projectId?: string; // 프로젝트 ID
}

const ChatInterface = ({
  conversationId,
  onUpdateConversation,
  isNewChat = false,
  initialMessage,
  onInitialHandled,
  finalizeNewConversation,
  user,
  projectId,
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ClientMessage[]>(() => []);
  const [isLoading, setIsLoading] = useState(false);
  const [editingConversationTitle, setEditingConversationTitle] =
    useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [showFolderOptions, setShowFolderOptions] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const folderMenuRef = useRef<HTMLDivElement>(null);

  const sentInitial = useRef(false); //  전송했는지 여부

  /* 메세지 리스트가 있으면 메세지 전송 */
  useEffect(() => {
    if (initialMessage && isNewChat && !sentInitial.current) {
      sentInitial.current = true;
      handleSendMessage(initialMessage);
      onInitialHandled?.(); // 버퍼 비우기
    }
  }, [initialMessage, isNewChat]);

  // 메시지 불러오기
  const loadConversationMessages = async (id: string) => {
    try {
      // "new" 대화인 경우 API 호출하지 않음
      if (id === "new" || isNewChat) {
        setNewTitle("새 대화");
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
          newTitle,
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

  // 메시지 전송 처리
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    /* 1. 사용자 메시지 즉시 UI에 추가 */
    const userMessage: ClientMessage = {
      role: MessageRole.USER,
      content,
      id: "user-" + Date.now(),
      created_at: new Date().toISOString(),
    };

    /* 2. 로딩용 어시스턴트 말풍선 바로 push */
    const loadingMsg: ClientMessage = {
      id: "loading-" + Date.now(),
      role: MessageRole.ASSISTANT,
      content: "",
      streaming: true,
    };
    setMessages((prev) => [...prev, userMessage, loadingMsg]);
    setIsLoading(true);

    try {
      /* 3. 스트리밍 호출 */
      const stream = await conversationApi.sendStreamingMessage(
        content,
        conversationId,
        projectId // 프로젝트 ID(폴더 ID) 전달
      );
      if (!stream) throw new Error("스트리밍 응답을 받을 수 없습니다.");

      let realId: string | null = null;
      let full = "";

      const reader = stream.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk
          .split("\n\n")
          .filter((l) => l.trim().startsWith("data:"));

        for (const l of lines) {
          const data = l.replace("data: ", "").trim();
          if (data === "[DONE]") continue;

          const parsed = JSON.parse(data);
          if (parsed.error) {
            console.error(parsed, parsed.err);
            const PROMPT_COUNT_ERR = "채팅 허용 횟수를 초과했습니다.";
            if (parsed.error === PROMPT_COUNT_ERR) return;
            throw new Error(parsed.error);
          }

          if (parsed.conversation_id && !realId) {
            realId = parsed.conversation_id;
            continue;
          }

          if (parsed.content) {
            full += parsed.content;

            /* 3-1. 로딩 말풍선 내용 실시간 업데이트 */
            setMessages((prev) =>
              prev.map((m) =>
                m.id === loadingMsg.id ? { ...m, content: full } : m,
              ),
            );
          }
        }
      }

      /* 4. 로딩 말풍선 확정 → streaming 플래그 제거 */
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingMsg.id
            ? {
                ...m,
                content: full,
                streaming: false,
                created_at: new Date().toISOString(),
              }
            : m,
        ),
      );

      /* 5. 새 대화인 경우: 스트림이 끝난 뒤 단 한 번 ID 전환 */
      let finalId = conversationId;
      if ((conversationId === "new" || !conversationId) && realId) {
        finalId = realId;

        const title =
          content.length > 30 ? `${content.slice(0, 27)}…` : content;

        onUpdateConversation("new", {
          id: realId,
          title,
          preview: content,
          lastUpdated: new Date(),
        });

        /* 상위 훅에 알려서 currentId 교체 → 컴포넌트 재사용 */
        finalizeNewConversation?.(realId);
      }

      /* 6. 미리보기·타이틀 업데이트 */
      onUpdateConversation(finalId, {
        preview: content,
        lastUpdated: new Date(),
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: MessageRole.ASSISTANT,
          content: "죄송합니다. 메시지 처리 중 오류가 발생했습니다.",
        },
      ]);
    } finally {
      setIsLoading(false);
      // 폴더 관련 상태 주석처리
      // setCurrentAssistantMessage("");
    }
  };

  return (
    <main className="relative h-[calc(100vh-67px)] overflow-hidden transition-all duration-350 mx-auto flex flex-col">
      {/* 채팅 메시지 영역 - 스크롤 가능 영역 */}
      <div
        ref={chatContainerRef}
        className="flex overflow-y-auto tab:px-8 web:px-0 px-4 h-full flex-col"
      >
        <div className="max-w-[680px] w-full mx-auto">
          <div
            aria-hidden="true"
            data-edge="true"
            className="pointer-events-none h-px w-px"
          ></div>
          <div className="flex flex-col gap-6">
            {messages.map((message, idx) => (
              <ChatMessage
                key={message.id || idx}
                role={message.role}
                content={message.content}
                timestamp={message.created_at}
                streaming={message.streaming}
              />
            ))}
          </div>
          <div
            aria-hidden="true"
            data-edge="true"
            className="pointer-events-none h-px w-px"
          ></div>
        </div>
      </div>

      {/* 채팅 입력 영역 - 고정 위치 */}
      <div className="w-full sticky max-w-[680px] px-4 web:px-0 bg-line-alternative mx-auto mt-5 bottom-0 z-10">
        <div className="tab:pb-10 tab:px-0 web:pb-20 mx-auto">
          <ChatInput
            user={user}
            onSend={handleSendMessage}
            disabled={isLoading}
          />
        </div>
      </div>
    </main>
  );
};

export default ChatInterface;
