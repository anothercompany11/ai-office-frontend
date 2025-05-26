"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { authApi } from "../api/auth";
import { refreshToken } from "../api/client";
import { AuthState, User } from "../api/dto/auth";

// 인증 컨텍스트 타입 정의
interface AuthContextType extends AuthState {
  login: (code: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  incrementPromptCount: (user: User) => void;
  updateUserPromptInfo: (promptLimit: number, promptCount: number) => void;
}

// 인증 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 요청 횟수 증가 핸들러
  const incrementPromptCount = () => {
    setUser((prev) =>
      prev ? { ...prev, prompt_count: prev.prompt_count + 1 } : prev,
    );
  };

  // 프롬프트 정보 업데이트 핸들러
  const updateUserPromptInfo = (promptLimit: number, promptCount: number) => {
    setUser((prev) => 
      prev ? { ...prev, prompt_limit: promptLimit, prompt_count: promptCount } : prev
    );
  };

  const loadUserInfo = async () => {
    try {
      setIsLoading(true);
      const token = authApi.getAccessToken();

      if (token) {
        try {
          // API에서 사용자 정보 가져오기 시도
          const userResponse = await authApi.getUserInfo();

          if (userResponse.status === "success" && userResponse.data) {
            setUser(userResponse.data);
          } else if (
            userResponse.status === "error" &&
            userResponse.code === "401"
          ) {
            // 401 오류 발생 시 토큰 갱신 시도
            const refreshed = await refreshSession();
            if (!refreshed) {
              // 갱신 실패 시 로그아웃
              await authApi.logout();
              setUser(null);
            } else {
              // 갱신 성공 시 다시 사용자 정보 로드
              const retryResponse = await authApi.getUserInfo();
              if (retryResponse.status === "success" && retryResponse.data) {
                setUser(retryResponse.data);
              } else {
                await authApi.logout();
                setUser(null);
              }
            }
          } else {
            // API 응답이 실패하면 토큰을 제거하고 로그인 페이지로 이동
            await authApi.logout();
            setUser(null);
          }
        } catch (error) {
          console.error("사용자 정보 가져오기 실패:", error);
          // 에러 발생 시 토큰 갱신 시도
          const refreshed = await refreshSession();
          if (!refreshed) {
            // 갱신 실패 시 로그아웃
            await authApi.logout();
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("사용자 정보 로딩 오류:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 토큰 갱신 함수
  const refreshSession = async (): Promise<boolean> => {
    try {
      const result = await refreshToken();
      if (result) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("토큰 갱신 중 오류 발생:", error);
      return false;
    }
  };

  useEffect(() => {
    loadUserInfo();

    // 401 에러 감지를 위한 이벤트 리스너
    const handleUnauthorized = () => {
      refreshSession().then((success) => {
        if (!success) {
          authApi.logout();
          setUser(null);
          window.location.href = "/auth";
        }
      });
    };

    window.addEventListener("unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, []);

  const login = async (code: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authApi.login(code);
      if (response.status === "success") {
        await loadUserInfo();
        return true;
      }
      return false;
    } catch (error) {
      console.error("로그인 오류:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authApi.logout();
      setUser(null);
    } catch (error) {
      console.error("로그아웃 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isLoggedIn = authApi.isLoggedIn();

  const value = {
    user,
    isLoading,
    isLoggedIn,
    login,
    logout,
    refreshSession,
    incrementPromptCount,
    updateUserPromptInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// AuthContext 사용을 위한 훅
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
