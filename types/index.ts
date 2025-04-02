// 채팅 메시지 관련 타입

export enum MessageRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

export interface ChatMessage {
  role: MessageRole;
  content: string;
  id?: string;
  timestamp?: string;
}

export interface Conversation {
  id: number;
  preview: string;
  lastUpdated: Date;
}
