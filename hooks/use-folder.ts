import { useCallback, useEffect, useState } from "react";
import { folderApi } from "@/app/api";
import { ConversationFolder } from "@/app/chat/_components/sidebar/folder-item";
import { Conversation, Folder } from "@/app/chat/_components/types";

export default function useFolders(conversations: Conversation[]) {
  const [folders, setFolders] = useState<ConversationFolder[]>([]);

  const refresh = useCallback(async () => {
    const res = await folderApi.getFolders();
    if (res.status !== "success" || !res.data) return;
    setFolders(
      res.data.map((f: Folder) => ({
        ...f,
        conversations: conversations.filter((c) => c.folder_id === f.id),
      })),
    );
  }, [conversations]);

  useEffect(() => void refresh(), [refresh]);

  const create = (name: string) => folderApi.createFolder(name).then(refresh);
  const rename = (id: string, name: string) =>
    folderApi.updateFolder(id, name).then(refresh);
  const remove = (id: string) =>
    folderApi
      .deleteFolder(id)
      .then(() => setFolders((f) => f.filter((x) => x.id !== id)));

  return { folders, create, rename, remove, refresh };
}
