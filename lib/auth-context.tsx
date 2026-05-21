"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useRouter, usePathname } from "next/navigation";

import type { User } from "@/app/_models";

import { logout as logoutService } from "@/app/_services";

import { useQueryClient } from "@tanstack/react-query";

import { useMe } from "@/hooks/use-auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_PATHS = ["/login"];

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  /**
   * Prevent hydration mismatch
   */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    data: userResponse,
    isLoading,
    refetch,
  } = useMe();

  const user = userResponse?.data || null;

  /**
   * Redirect logic
   */
  useEffect(() => {
    if (!mounted || isLoading) return;

    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    // Not authenticated
    if (!user && !isPublicPath) {
      router.replace("/login");
      return;
    }

    // Already authenticated
    if (user && isPublicPath) {
      router.replace("/");
      return;
    }
  }, [mounted, user, isLoading, pathname, router]);

  const logout = async () => {
    try {
      await logoutService();
    } finally {
      queryClient.removeQueries({
        queryKey: ["me"],
      });

      router.replace("/login");
    }
  };

  const refreshUser = async () => {
    await refetch();
  };

  /**
   * Prevent hydration mismatch
   */
  if (!mounted) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}