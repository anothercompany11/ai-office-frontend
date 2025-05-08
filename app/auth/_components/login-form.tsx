import { authApi } from "@/app/api";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  code: z
    .string()
    .length(8, "인증 코드는 8자리여야 합니다.")
    .regex(
      /^[A-Za-z0-9]{8}$/,
      "인증 코드는 영문자와 숫자로만 구성되어야 합니다.",
    ),
});

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 400));
      setError(null);

      // 로그인 시도 전에 기존 토큰 제거
      await authApi.logout();

      const result = await authApi.login(data.code);

      if (result.status === "success" && result.data?.access_token) {
        // 토큰 저장 후 잠시 대기
        await new Promise((resolve) => setTimeout(resolve, 100));

        // 토큰이 제대로 저장되었는지 확인
        const storedToken = authApi.getAccessToken();

        if (storedToken) {
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2 w-full"
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="hidden">인증 코드</FormLabel>
              <FormControl>
                <Input
                  maxLength={8}
                  placeholder="인증 코드를 입력하세요"
                  className=""
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
              {error && (
                <p className="text-status-error text-subtitle-s">{error}</p>
              )}
            </FormItem>
          )}
        />
        <Button loading={isLoading} type="submit" disabled={isLoading}>
          입장하기
        </Button>
      </form>
    </Form>
  );
};
export default LoginForm;
