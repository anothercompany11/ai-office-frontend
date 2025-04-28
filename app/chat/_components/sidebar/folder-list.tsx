import { useState } from "react";
import FolderItem from "./folder-item";
import { FolderPlusIcon } from "lucide-react";

// 폴더 관련 타입 정의
interface Conversation {
  id: string;
  title: string;
  preview?: string;
  created_at?: string;
  updated_at?: string;
}

interface ConversationFolder {
  id: string;
  name: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  conversations: Conversation[];
}

interface FolderListProps {
  folders: ConversationFolder[];
  currentConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onRenameFolder: (folderId: string, newName: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onCreateFolder: () => void;
  onDeleteConversation?: (id: string) => void;
  activeId?: string | null;
}

export default function FolderList({
  folders,
  currentConversationId,
  onSelectConversation,
  onRenameFolder,
  onDeleteFolder,
  onCreateFolder,
  onDeleteConversation,
  activeId,
}: FolderListProps) {
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >(folders.reduce((acc, folder) => ({ ...acc, [folder.id]: true }), {}));

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  // 폴더 섹션 애니메이션 변수
  const folderSectionVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.3, ease: "easeInOut" },
        opacity: { duration: 0.3, ease: "easeInOut" },
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.3, ease: "easeInOut" },
        opacity: { duration: 0.2, ease: "easeInOut" },
      },
    },
  };

  return (
    <ul aria-labelledby="folders-heading" className="flex flex-col">
      {folders.length === 0 ? (
        <button
          onClick={onCreateFolder}
          className="py-2 tab:py-3 px-2 items-center flex gap-2 text-body-s"
        >
          <FolderPlusIcon size={18} />
          <span>새 폴더</span>
        </button>
      ) : (
        folders.map((folder) => (
          <FolderItem
            key={folder.id}
            folder={folder}
            isExpanded={!!expandedFolders[folder.id]}
            toggleFolder={toggleFolder}
            onSelectConversation={onSelectConversation}
            currentConversationId={currentConversationId}
            onRenameFolder={onRenameFolder}
            onDeleteFolder={onDeleteFolder}
            onDeleteConversation={onDeleteConversation}
            activeId={activeId}
          />
        ))
      )}
    </ul>
  );
}
