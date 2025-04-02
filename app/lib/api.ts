// API 클라이언트 함수

// 인증 관련 API
export const authApi = {
  login: async (code: string) => {
    // 실제 구현에서는 백엔드 API 호출
    console.log("로그인 API 호출:", code);

    // 임시 구현: 로컬 스토리지에 저장
    localStorage.setItem("auth_token", `token_${code}`);
    return { success: true };
  },

  logout: () => {
    localStorage.removeItem("auth_token");
  },

  isLoggedIn: () => {
    return !!localStorage.getItem("auth_token");
  },
};

// 대화 관련 API
export const conversationApi = {
  sendMessageStream: (
    message: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: any) => void
  ) => {
    // 실제 구현에서는 SSE 또는 WebSocket 연결
    console.log("메시지 전송:", message);

    // 임시 구현: 더미 응답 생성
    const responses = [
      "안녕하세요! ",
      "어떤 ",
      "도움이 ",
      "필요하신가요? ",
      "질문이나 ",
      "문의사항이 ",
      "있으시면 ",
      "말씀해 주세요.",
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < responses.length) {
        onChunk(responses[index]);
        index++;
      } else {
        clearInterval(interval);
        onComplete();
      }
    }, 300);

    // 스트림 중단 핸들러 반환
    return () => clearInterval(interval);
  },
};
