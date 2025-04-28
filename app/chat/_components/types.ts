// 대화 타입 정의
export interface Conversation {
  id: string;
  title: string;
  preview?: string;
  created_at?: string;
  updated_at?: string;
  folder_id?: string;

  lastUpdated?: Date;
  lastMessage?: string;
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
