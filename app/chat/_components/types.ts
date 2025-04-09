// 드래그 아이템 타입
export enum DragItemType {
  CONVERSATION = "conversation",
  FOLDER = "folder",
  FOLDER_TARGET = "folder_target",
}

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

// 채팅 폴더 타입 정의
export interface ChatFolder {
  id: string;
  name: string;
  isDefault: boolean;
  conversations: Conversation[];
}
