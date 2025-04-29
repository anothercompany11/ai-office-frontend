export interface User {
  code_id: string;
  code: string;
  is_valid: boolean;
  is_expired: boolean;
  created_at: Date;
  expires_at?: Date;
  is_limit_reached: boolean; // 요청 초과 여부
  prompt_count: number; // 요청 시도 횟수
  prompt_limit: number; // 최대 시도 가능 횟수
}

export interface LoginRequest {
  code: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  csrf_token?: string;
}

export interface RefreshTokenRequest {
  csrf_token: string;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

export interface UserTokenData {
  code: string;
  code_id: string;
}
