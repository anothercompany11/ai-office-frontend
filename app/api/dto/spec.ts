// 이 대화에서 정해야 하는 것 하나
export interface ChecklistItem {
  key: string;
  label: string;
  done: boolean;
}

// 대화가 결과물을 만들 수 있는 상태까지 얼마나 왔는지
export interface SpecCoverage {
  conversation_id: string;
  /**
   * 이 대화에서 정해야 하는 것들. 개수와 내용은 대화마다 다르고 보통 4~7개다.
   * 하려는 일이 아직 안 읽힌 대화에서는 빈 배열이다.
   */
  items: ChecklistItem[];
  filled: number;
  /** 전체 항목 수. 대화마다 다르다. 0 이면 아직 체크리스트가 없다 */
  total: number;
  /** 모든 항목이 채워져 결과물을 만들 준비가 됐는지 */
  ready: boolean;
  /** 아직 덜 채워진 것 중 다음에 다루면 좋을 내용. 모두 채워졌으면 빈 문자열 */
  missing_hint: string;
  /** 결과물을 만드는 버튼에 그대로 쓸 문구 */
  deliverable_label: string;
  /** 내려받을 파일 이름. null 이면 파일 없이 화면에서 읽는 결과물이다 */
  file_name: string | null;
  /** 체크리스트 판본. 올라가면 항목이 통째로 교체된 것이다. 0 이면 체크리스트가 없다 */
  revision: number;
}

// 생성된 결과물
export interface ProjectSpec {
  id: string;
  conversation_id: string;
  /** 수정할 때마다 1씩 올라간다 */
  version: number;
  title: string | null;
  /** 마크다운 본문 전체. 첫 줄이 제목이다 */
  content: string;
  /** 내려받을 때 쓸 파일 이름. null 이면 파일로 내려받는 결과물이 아니다 */
  filename: string | null;
  /** 내려받은 파일을 어디에 어떻게 넘기는지 알려주는 안내문 */
  handoff_guide: string | null;
  created_at: string;
}
