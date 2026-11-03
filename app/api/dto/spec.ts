// 기획 완성도 체크리스트의 항목 하나
export interface ChecklistItem {
  key: string;
  label: string;
  done: boolean;
}

// 기획 대화가 얼마나 채워졌는지
export interface SpecCoverage {
  conversation_id: string;
  items: ChecklistItem[];
  filled: number;
  total: number;
  /** 7개 항목이 모두 채워져 명세를 만들 준비가 됐는지 */
  ready: boolean;
  /** 아직 덜 채워진 것 중 다음에 다루면 좋을 내용. 모두 채워졌으면 빈 문자열 */
  missing_hint: string;
}

// 생성된 구현 명세
export interface ProjectSpec {
  id: string;
  conversation_id: string;
  /** 수정할 때마다 1씩 올라간다 */
  version: number;
  title: string | null;
  /** 마크다운 본문 전체 */
  content: string;
  /** 내려받을 때 쓸 파일 이름 (AGENTS.md) */
  filename: string;
  /** 학생에게 보여줄 전달 방법 안내문 */
  handoff_guide: string;
  created_at: string;
}
