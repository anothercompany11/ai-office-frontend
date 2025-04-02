"use client";

import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthCheckProps {
  children: React.ReactNode;
}

const AuthCheck = ({ children }: AuthCheckProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    if (typeof window !== "undefined") {
      const isLoggedIn = authApi.isLoggedIn();

      if (!isLoggedIn) {
        router.push("/login");
      } else {
        setIsChecking(false);
      }
    }
  }, [router]);

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
