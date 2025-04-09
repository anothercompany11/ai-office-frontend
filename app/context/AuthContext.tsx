"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { authApi } from "../api/auth";
import { AuthState, User } from "../api/dto/auth";

// 인증 컨텍스트 타입 정의
interface AuthContextType extends AuthState {
  login: (code: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

// 인증 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserInfo = async () => {
    try {
      setIsLoading(true);
      if (authApi.isLoggedIn()) {
        try {
          // API에서 사용자 정보 가져오기 시도
          const userResponse = await authApi.getUserInfo();
          if (userResponse.status === "success" && userResponse.data) {
            setUser(userResponse.data);
          } else {
            // API 응답이 실패하면 토큰을 제거하고 로그인 페이지로 이동
            await authApi.logout();
            setUser(null);
          }
        } catch (error) {
          console.error("사용자 정보 가져오기 실패:", error);
          // 에러 발생 시 토큰을 제거하고 로그인 페이지로 이동
          await authApi.logout();
          setUser(null);
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

  useEffect(() => {
    loadUserInfo();
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
