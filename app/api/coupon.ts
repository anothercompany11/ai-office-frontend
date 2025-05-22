import { ApiResponse, post } from "./client";
import { CouponCodeRequest, CouponCodeResponse } from "./dto/coupon";

// 코인 충전 쿠폰 요청
export const couponApi = {
  async getCouponCode(coupon_code: string): Promise<ApiResponse<CouponCodeResponse>> {
    const response = await post<CouponCodeResponse, CouponCodeRequest>("/codes/coupon", { coupon_code });
    return response;
  },
};