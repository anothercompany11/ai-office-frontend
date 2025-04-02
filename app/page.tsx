"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>AI Office</CardTitle>
          <CardDescription>학생을 위한 AI 챗봇 서비스</CardDescription>
        </CardHeader>
        <div className="p-6 space-y-4">
          <Link href="/chat" className="block">
            <Button className="w-full">AI 챗봇</Button>
          </Link>
          <Link href="/assignments" className="block">
            <Button className="w-full" variant="outline">
              과제 관리
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
