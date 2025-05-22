'use client'

import { createContext, useContext, ReactNode } from 'react';
import useConversationsHook from '@/hooks/use-conversation';
import { Conversation } from '@/app/chat/_components/types';

// 컨텍스트 타입 정의
interface ConversationContextType {
  conversations: Conversation[];
  isLoadingConversations: boolean;
  currentId: string | null;
  pendingFirstMsg: string | null;
  loadConversations: () => Promise<void>;
  startBlankConversation: () => void;
  createNewConversation: (firstMsg: string) => void;
  updateConversation: (id: string, data: Partial<Conversation>) => void;
  deleteConversation: (id: string) => Promise<void>;
  assignToFolder: (conversationId: string, folderId: string | null) => Promise<void>;
  selectConversation: (id: string | null) => void;
  clearPendingFirstMsg: () => void;
  finalizeNewConversation: (realId: string) => void;
}

// Context 생성
const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

// Provider 컴포넌트
export function ConversationProvider({ children }: { children: ReactNode }) {
  const conversationState = useConversationsHook();
  
  return (
    <ConversationContext.Provider value={conversationState}>
      {children}
    </ConversationContext.Provider>
  );
}

// 커스텀 훅
export function useConversations() {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversations must be used within a ConversationProvider');
  }
  return context;
} 