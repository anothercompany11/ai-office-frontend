import {
  API_BASE_URL,
  ApiResponse,
  createHeaders,
  get,
  post,
} from "./client";
import { ProjectSpec, SpecCoverage } from "./dto/spec";

export const specApi = {
  /** 결과물 준비 상태 조회. 채팅 응답이 끝난 뒤 호출하면 최신 상태를 받는다 */
  async getCoverage(
    conversationId: string,
  ): Promise<ApiResponse<SpecCoverage>> {
    return get<SpecCoverage>(`/specs/coverage/${conversationId}`);
  },

  /**
   * 결과물 생성.
   * 같은 대화로 다시 호출하면 이전 결과물과 그 뒤 대화를 반영한 새 버전을 만든다.
   * 대화 전체를 읽고 문서를 쓰므로 수십 초가 걸린다.
   */
  async generate(conversationId: string): Promise<ApiResponse<ProjectSpec>> {
    return post<ProjectSpec>(`/specs/${conversationId}`);
  },

  /** 가장 최근 결과물 조회. 없으면 404 */
  async getLatest(
    conversationId: string,
  ): Promise<ApiResponse<ProjectSpec>> {
    return get<ProjectSpec>(`/specs/${conversationId}`);
  },

  /**
   * 결과물을 파일로 내려받는다.
   *
   * 서버가 인증 헤더를 요구하므로 링크를 그대로 열 수 없다.
   * 본문을 받아 와 Blob 으로 만든 뒤 임시 링크로 다운로드를 발생시킨다.
   *
   * 파일로 내려받는 결과물이 아니면 서버가 404 를 준다 — 그때는 다운로드 버튼을
   * 그리지 않는다(`filename` 이 null).
   */
  async download(conversationId: string, filename: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/specs/${conversationId}/download`,
      {
        method: "GET",
        headers: createHeaders(true, false),
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error(`결과물을 내려받지 못했습니다. (${response.status})`);
    }

    const text = await response.text();
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  },
};
