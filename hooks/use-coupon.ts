"use client";

import { useState } from "react";
import { z } from "zod";
import { couponApi } from "@/app/api/coupon";
import { useAuth } from "@/app/context/AuthContext";

// 쿠폰 코드 유효성 검사를 위한 zod 스키마
export const couponSchema = z.object({
  coupon_code: z
    .string()
    .min(1, "쿠폰 코드를 입력해주세요.")
    .max(50, "쿠폰 코드는 50자 이내로 입력해주세요."),
});

// 쿠폰 관련 타입 정의
export type CouponFormValues = z.infer<typeof couponSchema>;

/**
 * 쿠폰 코드 사용 훅
 */
export default function useCoupon() {
  const { user, updateUserPromptInfo } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * 쿠폰 코드 제출 및 검증
   * @param couponCode 쿠폰 코드
   */
  const submitCoupon = async (couponCode: string) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      // 쿠폰 코드 유효성 검사
      const validationResult = couponSchema.safeParse({
        coupon_code: couponCode,
      });

      if (!validationResult.success) {
        const errorMessage = "쿠폰 코드 적용에 실패했습니다.";
        setError(errorMessage);
        return false;
      }

      // 쿠폰 API 호출
      const response = await couponApi.getCouponCode(couponCode);

      if (response.status === "success" && response.data) {
        // 사용자 정보 업데이트
        if (
          response.data.prompt_limit !== undefined &&
          response.data.prompt_count !== undefined
        ) {
          // 충전된 코인 개수 계산 (이전 값이 없는 경우 0으로 가정)
          const prevLimit = user?.prompt_limit || 0;
          const addedCoins = response.data.prompt_limit - prevLimit;

          // 성공 메시지 설정
          setSuccess(`${addedCoins}개의 코인이 충전되었습니다.`);

          // 사용자 정보 업데이트
          updateUserPromptInfo(
            response.data.prompt_limit,
            response.data.prompt_count,
          );
        } else {
          setSuccess("쿠폰이 성공적으로 적용되었습니다.");
        }

        return true;
      } else {
        setError(response.message || "쿠폰 코드 적용에 실패했습니다.");
        return false;
      }
    } catch (err) {
      console.error("쿠폰 적용 중 오류 발생:", err);
      setError("쿠폰 적용 중 오류가 발생했습니다. 다시 시도해주세요.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 에러 메시지 초기화
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * 성공 메시지 초기화
   */
  const clearSuccess = () => {
    setSuccess(null);
  };

  return {
    submitCoupon,
    isSubmitting,
    error,
    success,
    clearError,
    clearSuccess,
    user,
  };
}
