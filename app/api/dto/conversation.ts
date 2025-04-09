import { MessageRole } from "@/types";

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  created_at: string;
  updated_at: string;
  folder_id?: string;
  messages?: Message[];
}

export interface ClientConversation {
  id: string;
  title: string;
  preview: string;
  lastUpdated: Date;
  folder_id?: string;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  created_at: string;
  updated_at: string;
  conversation_id: string;
}

export interface ClientMessage {
  id?: string;
  role: MessageRole;
  content: string;
  created_at?: string;
}

export interface CreateConversationRequest {
  title: string;
  folder_id?: string;
}

export interface UpdateConversationRequest {
  title?: string;
  folder_id?: string | null;
}

export interface SendMessageRequest {
  message: string;
  conversation_id?: string;
}

export interface MessageResponse {
  conversation_id: string;
  message: Message;
}

export interface ServerResponse<T> {
  status: string;
  code: string;
  message: string;
  data: T;
  meta: any;
  errors: any;
}
