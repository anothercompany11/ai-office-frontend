// API base 설정
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// 응답 데이터 형식
export interface ApiResponse<T = any> {
  status: "success" | "error" | "fail";
  code: string;
  message: string;
  data?: T;
  meta?: any;
  errors?: Array<{
    code: string;
    message: string;
    details?: Record<string, any>;
  }>;
}

// 액세스 토큰 관리
export const TokenService = {
  // 토큰 저장
  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
    }
  },

  // 토큰 삭제
  removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
  },

  // 토큰 가져오기
  getToken(): string | null {
    return typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;
  },

  // 로그인 상태 확인
  isLoggedIn(): boolean {
    return !!this.getToken();
  },
};

// API 요청 헤더 생성
export const createHeaders = (
  needsAuth: boolean = true,
  contentType: boolean = true
): HeadersInit => {
  const headers: HeadersInit = {};

  if (contentType) {
    headers["Content-Type"] = "application/json";
  }

  if (needsAuth) {
    const token = TokenService.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// API 요청 기본 함수
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const responseData = await response.json();

    // 서버 응답 로깅 (디버깅용)
    console.log(`API 응답 (${endpoint}):`, responseData);

    // 서버 응답 구조 확인
    if (responseData.status === "success") {
      return {
        status: "success",
        code: responseData.code,
        message: responseData.message,
        data: responseData.data,
        meta: responseData.meta,
        errors: responseData.errors,
      };
    } else {
      return {
        status: "error",
        code: responseData.code || "500",
        message: responseData.message || "요청 실패",
        data: responseData.data,
        meta: responseData.meta,
        errors: responseData.errors,
      };
    }
  } catch (error) {
    console.error(`API 요청 오류 (${endpoint}):`, error);
    return {
      status: "error",
      code: "500",
      message: "API 요청 중 오류가 발생했습니다.",
      errors: [
        {
          code: "500",
          message: "API 요청 중 오류가 발생했습니다.",
        },
      ],
    };
  }
}

export async function get<T = any>(
  endpoint: string,
  needsAuth: boolean = true
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: "GET",
    headers: createHeaders(needsAuth),
  });
}

export async function post<T = any, U = any>(
  endpoint: string,
  body?: U,
  needsAuth: boolean = true,
  additionalHeaders: HeadersInit = {}
): Promise<ApiResponse<T>> {
  const headers = {
    ...createHeaders(needsAuth),
    ...additionalHeaders,
  };

  return apiRequest<T>(endpoint, {
    method: "POST",
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include", // 쿠키 포함
  });
}

export async function put<T = any, U = any>(
  endpoint: string,
  body?: U,
  needsAuth: boolean = true
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: "PUT",
    headers: createHeaders(needsAuth),
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function del<T = any>(
  endpoint: string,
  needsAuth: boolean = true
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: "DELETE",
    headers: createHeaders(needsAuth),
  });
}
