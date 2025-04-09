import { ApiResponse, get, post, TokenService } from "./client";
import {
  LoginRequest,
  RefreshTokenRequest,
  TokenResponse,
  User,
  UserTokenData,
} from "./dto/auth";

// CSRF 토큰 관리
const CSRFTokenService = {
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

// 인증 API 모듈
export const authApi = {
  // 로그인
  async login(code: string): Promise<ApiResponse<TokenResponse>> {
    try {
      const response = await post<TokenResponse, LoginRequest>(
        "/auth/login",
        { code },
        false
      );

      if (response.status === "success" && response.data?.access_token) {
        // 토큰 저장
        TokenService.setToken(response.data.access_token);

        // CSRF 토큰이 있으면 저장
        if (response.data.csrf_token) {
          CSRFTokenService.setToken(response.data.csrf_token);
        }
      }

      return response;
    } catch (error) {
      console.error("로그인 오류:", error);
      return {
        status: "error",
        code: "LOGIN_ERROR",
        message: "로그인 중 오류가 발생했습니다.",
      };
    }
  },

  // 로그아웃
  async logout(): Promise<ApiResponse<boolean>> {
    try {
      const response = await post("/auth/logout");

      // 로컬 저장소에서 토큰 제거
      TokenService.removeToken();
      CSRFTokenService.removeToken();

      return response;
    } catch (error) {
      console.error("로그아웃 오류:", error);
      // 에러가 발생해도 로컬의 토큰은 제거
      TokenService.removeToken();
      CSRFTokenService.removeToken();
      return {
        status: "error",
        code: "LOGOUT_ERROR",
        message: "로그아웃 중 오류가 발생했습니다.",
      };
    }
  },

  // 토큰 갱신
  async refreshToken(): Promise<ApiResponse<TokenResponse>> {
    try {
      const csrfToken = CSRFTokenService.getToken();

      if (!csrfToken) {
        return {
          status: "error",
          code: "CSRF_TOKEN_MISSING",
          message: "CSRF 토큰이 없습니다. 다시 로그인하세요.",
        };
      }

      const refreshRequest: RefreshTokenRequest = { csrf_token: csrfToken };
      const response = await post<TokenResponse, RefreshTokenRequest>(
        "/auth/refresh-token",
        refreshRequest
      );

      if (response.status === "success" && response.data?.access_token) {
        // 새 인증 토큰 저장
        TokenService.setToken(response.data.access_token);

        // 새 CSRF 토큰이 있으면 갱신
        if (response.data.csrf_token) {
          CSRFTokenService.setToken(response.data.csrf_token);
        }
      }

      return response;
    } catch (error) {
      console.error("토큰 갱신 오류:", error);
      return {
        status: "error",
        code: "REFRESH_TOKEN_ERROR",
        message: "토큰 갱신 중 오류가 발생했습니다.",
      };
    }
  },

  // 사용자 정보 가져오기
  async getUserInfo(): Promise<ApiResponse<User>> {
    return get<User>("/auth/user");
  },

  // 토큰에서 사용자 정보 추출
  getUserDataFromToken(): UserTokenData | null {
    const token = TokenService.getToken();
    if (!token) return null;

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return JSON.parse(jsonPayload) as UserTokenData;
    } catch (e) {
      console.error("토큰 디코딩 오류:", e);
      return null;
    }
  },

  // 로그인 상태 확인
  isLoggedIn(): boolean {
    return TokenService.isLoggedIn();
  },

  // Access 토큰 가져오기
  getAccessToken(): string | null {
    return TokenService.getToken();
  },
};
