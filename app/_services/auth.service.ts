import api, { removeAuthToken } from "@/lib/api";
import type { ApiResponse, User } from "@/app/_models";
import axios from "axios";
import { LoginPayload, LoginResponse } from "../_models/auth";

// Login user
export async function login(payload: LoginPayload): Promise<ApiResponse<LoginResponse>> {
  const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", {
    email: payload.email,
    password: payload.password,
  });

  return response.data;
}

// Logout user
export async function logout(): Promise<void> {
  removeAuthToken();
}

// Get current user profile
export async function getMe(): Promise<ApiResponse<User>> {
  const response = await api.get<ApiResponse<User>>("/auth/me");
  
  return response.data;
}
