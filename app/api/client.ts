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

// CSRF 토큰 관리
export const CSRFTokenService = {
  // 토큰 저장
  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("csrf_token", token);
    }
  },

  // 토큰 가져오기
  getToken(): string | null {
    return typeof window !== "undefined"
      ? localStorage.getItem("csrf_token")
      : null;
  },

  // 토큰 삭제
  removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("csrf_token");
    }
  },
};

// API 요청 헤더 생성
export const createHeaders = (
  needsAuth: boolean = true,
  contentType: boolean = true,
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

// 토큰 갱신 함수
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: ApiResponse<any> | PromiseLike<ApiResponse<any>>) => void;
  reject: (reason?: any) => void;
  config: RequestInit & { url: string };
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(apiRequest(prom.config.url, prom.config));
    }
  });

  failedQueue = [];
};

export const refreshToken = async (): Promise<boolean> => {
  try {
    console.log('여기로 들어옴 33')
    const csrfToken = CSRFTokenService.getToken();
    console.log('여기로 들어옴 44', csrfToken);
    if (!csrfToken) {
      console.log('여기로 들어옴 55');
      return false;
    }
    console.log('여기로 들어옴 66');
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ csrf_token: csrfToken }),
      credentials: "include", // 쿠키 포함
    });

    console.log('여기로 들어옴 77');
    const responseData = await response.json();
    console.log('여기로 들어옴 88', responseData);
    if (responseData.status === "success" && responseData.data?.access_token) {
      console.log('여기로 들어옴 99');
      TokenService.setToken(responseData.data.access_token);
      console.log('여기로 들어옴 100');
      // 새 CSRF 토큰이 있으면 저장
      if (responseData.data.csrf_token) {
        CSRFTokenService.setToken(responseData.data.csrf_token);
        console.log('여기로 들어옴 101');
      }

      return true;
    }
    console.log('여기로 들어옴 102');
    return false;
  } catch (error) {
    console.error("토큰 갱신 오류:", error);
    return false;
  }
};

// API 요청 기본 함수
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  try {
    // 쿠키 전송을 위한 credentials 추가
    options.credentials = "include";

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const responseData = await response.json();

    // 401 에러 처리
    if (
      responseData.status === "error" &&
      (responseData.code === "401" || response.status === 401)
    ) {
      // 이미 토큰 갱신 중이면 큐에 넣기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (value: ApiResponse<T> | PromiseLike<ApiResponse<T>>) => {
              resolve(value as ApiResponse<T>);
            },
            reject,
            config: { ...options, url: endpoint },
          });
        });
      }

      isRefreshing = true;

      // 토큰 갱신 시도
      const refreshed = await refreshToken();
      isRefreshing = false;

      if (refreshed) {
        // 갱신 성공하면 이전 요청들 처리
        processQueue();

        // 헤더에 새 토큰 설정
        if (options.headers && typeof options.headers === "object") {
          const newHeaders = { ...options.headers } as Record<string, string>;
          newHeaders["Authorization"] = `Bearer ${TokenService.getToken()}`;
          options.headers = newHeaders;
        }

        // 요청 재시도
        return apiRequest(endpoint, options);
      } else {
        // 갱신 실패 시 큐에 있는 요청들 모두 에러로 처리
        processQueue(new Error("토큰 갱신 실패"));

        // 로그인 페이지로 이동
        if (typeof window !== "undefined") {
          // 모든 토큰 제거
          TokenService.removeToken();
          CSRFTokenService.removeToken();

          // 로그인 페이지로 리다이렉트 (현재 경로가 로그인 페이지가 아닌 경우)
          if (
            !window.location.pathname.includes("/auth") &&
            !window.location.pathname.includes("/login")
          ) {
            window.location.href = "/auth";
          }
        }

        return {
          status: "error",
          code: "401",
          message: "인증이 만료되었습니다. 다시 로그인해주세요.",
          errors: [
            {
              code: "UNAUTHORIZED",
              message: "인증이 만료되었습니다. 다시 로그인해주세요.",
            },
          ],
        };
      }
    }

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
  needsAuth: boolean = true,
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: "GET",
    headers: createHeaders(needsAuth),
    credentials: "include", // 쿠키 포함
  });
}

export async function post<T = any, U = any>(
  endpoint: string,
  body?: U,
  needsAuth: boolean = true,
  additionalHeaders: HeadersInit = {},
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
  needsAuth: boolean = true,
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: "PUT",
    headers: createHeaders(needsAuth),
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include", // 쿠키 포함
  });
}

export async function del<T = any>(
  endpoint: string,
  needsAuth: boolean = true,
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: "DELETE",
    headers: createHeaders(needsAuth),
    credentials: "include", // 쿠키 포함
  });
}

// 스트리밍 요청 함수 (토큰 갱신 지원)
export async function streamRequest<T = any>(
  endpoint: string,
  body?: T,
  needsAuth: boolean = true,
): Promise<ReadableStream<Uint8Array> | null> {
  const makeRequest = async (): Promise<Response> => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: createHeaders(needsAuth),
      body: body ? JSON.stringify(body) : undefined,
      credentials: "include",
    });
  };

  try {
    let response = await makeRequest();

    // 401 에러 처리 및 토큰 갱신
    if (response.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed) {
        // 토큰 갱신 성공 시 재요청
        response = await makeRequest();
      } else {
        // 토큰 갱신 실패 시 로그아웃 처리
        if (typeof window !== "undefined") {
          TokenService.removeToken();
          CSRFTokenService.removeToken();
          
          if (
            !window.location.pathname.includes("/auth") &&
            !window.location.pathname.includes("/login")
          ) {
            window.location.href = "/auth";
          }
        }
        return null;
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP 오류! 상태: ${response.status}`);
    }

    return response.body;
  } catch (error) {
    console.error(`스트리밍 요청 오류 (${endpoint}):`, error);
    return null;
  }
}
