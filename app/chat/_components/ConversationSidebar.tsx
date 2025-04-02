"use client";

import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";

interface ConversationSidebarProps {
  conversations: { id: number; preview: string; lastUpdated: Date }[];
  currentConversationId?: number;
  onSelectConversation: (id: number) => void;
}

const ConversationSidebar = ({
  conversations,
  currentConversationId,
  onSelectConversation,
}: ConversationSidebarProps) => {
  const router = useRouter();

  const handleLogout = () => {
    authApi.logout();
    router.push("/login");
  };

  return (
    <div className="w-64 h-screen bg-gray-100 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">대화 내역</h2>
      </div>

      <div className="flex-grow overflow-y-auto">
        {conversations.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <button
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`w-full text-left p-4 hover:bg-gray-200 ${
                    currentConversationId === conversation.id
                      ? "bg-gray-200"
                      : ""
                  }`}
                >
                  <p className="truncate text-sm">{conversation.preview}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(conversation.lastUpdated).toLocaleDateString()}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-sm text-gray-500">대화 내역이 없습니다.</div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => router.push("/chat")}
          className="w-full mb-2 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none"
        >
          새 대화
        </button>
        <button
          onClick={handleLogout}
          className="w-full text-black border border-black py-2 px-4 rounded-md hover:bg-gray-100 focus:outline-none"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default ConversationSidebar;
