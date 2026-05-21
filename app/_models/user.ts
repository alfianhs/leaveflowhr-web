// User Role Types
export interface UserRole {
  key: number;
  value: "Employee" | "Manager" | "HR";
}

// User Model from /api/auth/me
export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  managerId: string | null;
  manager: User | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// Role constants
export const ROLES = {
  EMPLOYEE: 1,
  MANAGER: 2,
  HR: 3,
} as const;
