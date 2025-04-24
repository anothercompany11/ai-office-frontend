// 대화 타입 정의
export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp?: string;
  preview?: string;
  lastUpdated?: Date;
  folderId?: string;
  folder_id?: string; // API와의 호환성을 위한 속성
}

export interface Folder {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export type TimeGroup =
  | "today"
  | "yesterday"
  | "previous7Days"
  | "previous30Days"
  | "older";

export interface GroupedConversations {
  today: Conversation[];
  yesterday: Conversation[];
  previous7Days: Conversation[];
  previous30Days: Conversation[];
  older: Conversation[];
}
