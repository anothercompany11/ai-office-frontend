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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  code: z
    .string()
    .length(8, "인증 코드는 8자리여야 합니다.")
    .regex(
      /^[A-Za-z0-9]{8}$/,
      "인증 코드는 영문자와 숫자로만 구성되어야 합니다."
    ),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // 로그인 시도 전에 기존 토큰 제거
      await authApi.logout();

      const result = await authApi.login(data.code);
      console.log("로그인 결과:", result);

      if (result.status === "success" && result.data?.access_token) {
        // 토큰 저장 후 잠시 대기
        await new Promise((resolve) => setTimeout(resolve, 100));

        // 토큰이 제대로 저장되었는지 확인
        const storedToken = authApi.getAccessToken();
        console.log("저장된 토큰:", storedToken);

        if (storedToken) {
          console.log("토큰 저장 완료, /chat으로 이동합니다");
          window.location.href = "/chat";
        } else {
          setError("토큰 저장에 실패했습니다.");
        }
      } else {
        setError(result.message || "로그인에 실패했습니다.");
      }
    } catch (err: any) {
      console.error("로그인 오류:", err);
      setError(err.message || "인증 코드가 유효하지 않습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">로그인</CardTitle>
          <CardDescription>인증 코드를 입력하여 로그인하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>인증 코드</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="인증 코드를 입력하세요"
                        className="h-12 text-white"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button
                type="submit"
                className="w-full h-12"
                disabled={isLoading}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
