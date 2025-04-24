import {
  Conversation,
  GroupedConversations,
} from "@/app/chat/_components/types";

export const useGroupedConversations = (conversations: Conversation[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const previous7Days = new Date(today);
  previous7Days.setDate(previous7Days.getDate() - 7);
  const previous30Days = new Date(today);
  previous30Days.setDate(previous30Days.getDate() - 30);

  const grouped: GroupedConversations = {
    today: [],
    yesterday: [],
    previous7Days: [],
    previous30Days: [],
    older: [],
  };

  conversations.forEach((c) => {
    const d = new Date(c.lastUpdated || "");
    if (d >= today) grouped.today.push(c);
    else if (d >= yesterday) grouped.yesterday.push(c);
    else if (d >= previous7Days) grouped.previous7Days.push(c);
    else if (d >= previous30Days) grouped.previous30Days.push(c);
    else grouped.older.push(c);
  });

  return grouped;
};
