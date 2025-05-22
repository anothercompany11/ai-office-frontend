"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { couponSchema, CouponFormValues } from "@/hooks/use-coupon";
import useCoupon from "@/hooks/use-coupon";
import CustomInput from "./custom-input";
import { Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CouponFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function CouponForm({ onSuccess, onClose }: CouponFormProps) {
  const { submitCoupon, isSubmitting, error, success, clearError, clearSuccess } = useCoupon();
  
  // React Hook Form 설정
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      coupon_code: "",
    },
  });

  // 폼 제출 핸들러
  const onSubmit = async (data: CouponFormValues) => {
    const result = await submitCoupon(data.coupon_code);
    
    if (result) {
      // 성공 시 폼 초기화
      reset();
      
      // 성공 콜백 호출
      onSuccess?.();
    }
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <div className="flex flex-col">
            <label 
              htmlFor="coupon_code" 
              className="text-body-2 text-label-strong mb-1"
            >
              암호
            </label>
            <CustomInput
              id="coupon_code"
              type="text"
              placeholder="암호를 입력하세요"
              {...register("coupon_code")}
              disabled={isSubmitting}
              error={!!errors.coupon_code}
              icon={<Ticket className="size-5" />}
              onChange={() => {
                // 사용자가 입력할 때 이전 에러/성공 메시지 초기화
                if (error) clearError();
                if (success) clearSuccess();
              }}
            />
          </div>
          
          {/* 유효성 검사 에러 메시지 */}
          {errors.coupon_code && (
            <p className="text-red-500 text-sm">{errors.coupon_code.message}</p>
          )}
          
          {/* API 에러 메시지 */}
          {error && !errors.coupon_code && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          
          {/* 성공 메시지 */}
          {success && (
            <p className="text-primary text-body-2">{success}</p>
          )}
        </div>

        <div className="flex gap-2 w-full text-[14px] justify-end font-bold">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            size={"lg"}
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="secondary"
            size={"lg"}
          >
            {isSubmitting ? "충전 중" : "충전하기"}
          </Button>
        </div>
      </form>
    </div>
  );
} 