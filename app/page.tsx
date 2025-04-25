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

  return null;
}
