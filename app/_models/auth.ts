import { User } from "./user";

// Login credentials
export interface LoginPayload {
  email: string;
  password: string;
}

// Login response
export interface LoginResponse {
  accessToken: string;
  expiredAt: string;
  user: User;
}