import { Conversation } from "@/app/api/dto";
import ConversationItem from "./conversation-item";
import { GroupedConversations } from "../types";

/** 날짜 구간 문자열 */
export type TimeGroup =
  | "today"
  | "yesterday"
  | "previous7Days"
  | "previous30Days"
  | "older";

/** "지난 대화" 섹션 헤더 텍스트 */
export const groupTitles: Record<TimeGroup, string> = {
  today: "오늘",
  yesterday: "어제",
  previous7Days: "이전 7일",
  previous30Days: "이전 30일",
  older: "이전 기록",
};

interface Props {
  groups: GroupedConversations; // useGroupedConversations 결과
  currentConversationId: string | null; // 현재 열린 대화
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  activeId?: string | null;
  conversationPrefix?: string;
}

export default function ChatGroupList({
  groups,
  onSelect,
  onDelete,
  activeId,
  conversationPrefix = "conversation-",
}: Props) {
  return (
    <div id="conversations-area" className="pb-4">
      {(Object.entries(groups) as [TimeGroup, Conversation[]][]).map(
        ([key, list]) =>
          list.length ? (
            <section
              key={key}
              className="mt-5 first:mt-0 last:mb-5 text-body-s"
            >
              <h3 className="pb-1 text-caption">{groupTitles[key]}</h3>

              <ol>
                {list.map((c) => (
                  <ConversationItem
                    key={c.id}
                    conversation={c}
                    onSelect={onSelect}
                    onDelete={(e) => {
                      onDelete(c.id);
                    }}
                    conversationPrefix={conversationPrefix}
                    isActive={activeId === `${conversationPrefix}${c.id}`}
                  />
                ))}
              </ol>
            </section>
          ) : null,
      )}
    </div>
  );
}
