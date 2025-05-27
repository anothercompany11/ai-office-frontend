// 쿠폰 코드 요청 req
export interface CouponCodeRequest {
  coupon_code: string;
}

// 쿠폰 코드 요청 res
export interface CouponCodeResponse {
  coupon_code: string;
  prompt_limit: number;
  prompt_count: number;
}
