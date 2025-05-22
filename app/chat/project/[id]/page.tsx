'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useConversations from "@/hooks/use-conversation";
import ChatHeader from "../../_components/chat-header/chat-header";

interface Props {
  isSidebarVisible: boolean;
  setIsSidebarVisible: (visible: boolean) => void;
}

export default function ProjectPage({ isSidebarVisible, setIsSidebarVisible }: Props) {
  const params = useParams();
  const { conversations } = useConversations();
  const [currentFolder, setCurrentFolder] = useState<any>(null);

  useEffect(() => {
    if (conversations && params.id) {
      const folder = conversations.find((f) => f.id === params.id);
      setCurrentFolder(folder);
    }
  }, [conversations, params.id]);

  return (
    <div className="relative h-full flex flex-col">
      <ChatHeader 
        isSidebarVisible={isSidebarVisible}
        setIsSidebarVisible={setIsSidebarVisible}
      />
      
      <div className="flex-1 overflow-y-auto pt-[72px] tab:pt-0 px-4 tab:px-8">
        <div className="py-6">
          <h1 className="text-title-l font-bold text-label-strong">
            {currentFolder?.name || '프로젝트'}
          </h1>
          
          <div className="mt-4">
            {currentFolder?.conversations?.length ? (
              <div className="space-y-4">
                {currentFolder.conversations.map((conv: any) => (
                  <div 
                    key={conv.id}
                    className="p-4 rounded-lg border border-line hover:bg-background-alternative transition-colors"
                  >
                    <p className="text-body-l text-label-strong truncate">
                      {conv.title || '제목 없음'}
                    </p>
                    <p className="text-body-s text-label-assistive mt-1">
                      {new Date(conv.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body-l text-label-assistive">
                아직 대화가 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
