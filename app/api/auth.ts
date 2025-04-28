import {
  ApiResponse,
  CSRFTokenService,
  get,
  post,
  TokenService,
} from "./client";
import {
  LoginRequest,
  RefreshTokenRequest,
  TokenResponse,
  User,
  UserTokenData,
} from "./dto/auth";

// 인증 API 모듈
export const authApi = {
  // 로그인
  async login(code: string): Promise<ApiResponse<TokenResponse>> {
    try {
      const response = await post<TokenResponse, LoginRequest>(
        "/auth/login",
        { code },
        false,
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
      // 백엔드에 로그아웃 요청
      const response = await post<boolean, void>("/auth/logout");

      // 로컬 토큰 삭제
      TokenService.removeToken();
      CSRFTokenService.removeToken();

      // 로그아웃 결과 반환
      return response;
    } catch (error) {
      console.error("로그아웃 오류:", error);

      // 오류가 발생해도 로컬 토큰은 삭제
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
        refreshRequest,
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
    try {
      return await get<User>("/auth/user");
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error);

      // 401 오류 발생 시 이벤트 발생
      if (error instanceof Response && error.status === 401) {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("unauthorized"));
        }
      }

      return {
        status: "error",
        code: "USER_INFO_ERROR",
        message: "사용자 정보를 가져오는 중 오류가 발생했습니다.",
      };
    }
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
          .join(""),
      );

      return JSON.parse(jsonPayload) as UserTokenData;
    } catch (e) {
      console.error("토큰 디코딩 오류:", e);
      return null;
    }
  },

  // 로그인 상태 확인
  isLoggedIn(): boolean {
    const token = TokenService.getToken();
    console.log("authApi.isLoggedIn - 토큰 존재 여부:", !!token); // 디버깅용 로그
    return !!token;
  },

  // Access 토큰 가져오기
  getAccessToken(): string | null {
    return TokenService.getToken();
  },

  // CSRF 토큰 가져오기
  getCSRFToken(): string | null {
    return CSRFTokenService.getToken();
  },
};
