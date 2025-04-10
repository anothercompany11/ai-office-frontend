"use client";

import { authApi } from "@/app/api";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthCheckProps {
  children: React.ReactNode;
}

const AuthCheck = ({ children }: AuthCheckProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const { refreshSession } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      // 클라이언트 사이드에서만 실행
      if (typeof window !== "undefined") {
        const isLoggedIn = authApi.isLoggedIn();
        console.log("AuthCheck - isLoggedIn:", isLoggedIn); // 디버깅용 로그

        if (!isLoggedIn) {
          console.log("AuthCheck - 로그인되지 않음, /auth로 이동"); // 디버깅용 로그
          router.push("/auth");
        } else {
          // 토큰이 있더라도 유효한지 확인
          try {
            const userResponse = await authApi.getUserInfo();
            console.log("AuthCheck - getUserInfo 응답:", userResponse); // 디버깅용 로그

            if (
              userResponse.status === "error" &&
              userResponse.code === "401"
            ) {
              // 401 오류 발생 시 토큰 갱신 시도
              const refreshed = await refreshSession();
              if (!refreshed) {
                // 갱신 실패 시 로그인 페이지로 이동
                await authApi.logout();
                router.push("/auth");
                return;
              }
            }
            // 인증이 유효하면 계속 진행
            setIsChecking(false);
          } catch (error) {
            console.error("AuthCheck - 인증 확인 중 오류 발생:", error); // 디버깅용 로그
            // 토큰 갱신 시도
            const refreshed = await refreshSession();
            if (!refreshed) {
              // 갱신 실패 시 로그인 페이지로 이동
              await authApi.logout();
              router.push("/auth");
              return;
            }
            setIsChecking(false);
          }
        }
      }
    };

    checkAuth();

    // 401 에러 이벤트 처리
    const handleUnauthorized = async () => {
      console.log("AuthCheck - 401 에러 이벤트 발생"); // 디버깅용 로그
      const refreshed = await refreshSession();
      if (!refreshed) {
        await authApi.logout();
        router.push("/auth");
      }
    };

    window.addEventListener("unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, [router, refreshSession]);

  if (isChecking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthCheck;
