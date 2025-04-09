import { ApiResponse, del, get, post, put } from "./client";
import {
  Conversation,
  CreateConversationRequest,
  MessageResponse,
  SendMessageRequest,
  UpdateConversationRequest,
} from "./dto/conversation";

// 대화 API 모듈
export const conversationApi = {
  // 대화 목록 조회
  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    try {
      return await get<Conversation[]>("/conversations");
    } catch (error) {
      console.error("대화 목록 조회 오류:", error);
      return {
        status: "error",
        code: "GET_CONVERSATIONS_ERROR",
        message: "대화 목록을 불러오는데 실패했습니다.",
        data: [],
      };
    }
  },

  // 특정 대화 조회
  async getConversation(id: string): Promise<ApiResponse<Conversation>> {
    try {
      return await get<Conversation>(`/conversations/${id}`);
    } catch (error) {
      console.error("대화 조회 오류:", error);
      throw error;
    }
  },

  // 대화 생성
  async createConversation(
    title: string = "새 대화",
    folderId?: string
  ): Promise<ApiResponse<Conversation>> {
    try {
      const request: CreateConversationRequest = { title };
      if (folderId) {
        request.folder_id = folderId;
      }

      return await post<Conversation, CreateConversationRequest>(
        "/conversations",
        request
      );
    } catch (error) {
      console.error("대화 생성 오류:", error);
      throw error;
    }
  },

  // 대화 정보 업데이트
  async updateConversation(
    id: string,
    titleOrData: string | UpdateConversationRequest
  ): Promise<ApiResponse<Conversation>> {
    try {
      let updateData: UpdateConversationRequest;

      if (typeof titleOrData === "string") {
        updateData = { title: titleOrData };
      } else {
        updateData = titleOrData;
      }

      return await put<Conversation, UpdateConversationRequest>(
        `/conversations/${id}`,
        updateData
      );
    } catch (error) {
      console.error("대화 업데이트 오류:", error);
      throw error;
    }
  },

  // 대화 삭제
  async deleteConversation(id: string): Promise<ApiResponse<void>> {
    try {
      return await del(`/conversations/${id}`);
    } catch (error) {
      console.error("대화 삭제 오류:", error);
      throw error;
    }
  },

  // 메시지 전송
  async sendMessage(
    content: string,
    conversationId?: string
  ): Promise<ApiResponse<MessageResponse>> {
    try {
      const request: SendMessageRequest = {
        message: content,
        conversation_id: conversationId,
      };

      return await post<MessageResponse, SendMessageRequest>("/chat", request);
    } catch (error) {
      console.error("메시지 전송 오류:", error);
      return {
        status: "error",
        code: "SEND_MESSAGE_ERROR",
        message: "메시지 전송 중 오류가 발생했습니다.",
      };
    }
  },
};
