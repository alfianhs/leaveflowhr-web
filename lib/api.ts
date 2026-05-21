import axios from "axios";
import Cookies from "js-cookie";
import { ApiException } from "./error-utils";

export const TOKEN_KEY = "leaveflow_token";

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add auth token from cookie
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        Cookies.remove(TOKEN_KEY);

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }

      return Promise.reject(
        new ApiException(error.response?.data)
      );
    }

    return Promise.reject(error);
  }
);

export default api;

// Helper to set token in cookie
export function setAuthToken(token: string, rememberMe: boolean = false) {
  Cookies.set(TOKEN_KEY, token, {
    expires: rememberMe ? 7 : 1, // 7 days if remember me, else 1 day
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
}

// Helper to remove token
export function removeAuthToken() {
  Cookies.remove(TOKEN_KEY);
}

// Helper to get token
export function getAuthToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}
