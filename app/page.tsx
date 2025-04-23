"use client";

import { authApi } from "@/app/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 로그인 상태 확인
    const isLoggedIn = authApi.isLoggedIn();

    // 로그인 상태에 따라 리다이렉트
    if (isLoggedIn) {
      router.push("/chat");
    } else {
      router.push("/auth");
    }
  }, [router]);

  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold font-hakgyo-ansim">
            AI Office
          </CardTitle>
          <CardDescription>
            학생을 위한 AI 챗봇 및 과제 관리 서비스
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <Link href="/chat" className="block">
            <Button className="w-full h-12 text-lg font-hakgyo-ansim">
              AI 챗봇
            </Button>
          </Link>
          <div className="block">
            <Button className="w-full h-12 text-lg" variant="outline" disabled>
              과제 관리 (준비 중)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
