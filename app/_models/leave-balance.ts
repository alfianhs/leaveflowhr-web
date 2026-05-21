import { User } from "./user";

export interface LeaveBalance {
    id: string;
    userId: string;
    user: User | null;
    year: number;
    entitledDays: number;
    usedDays: number;
    pendingDays: number;
    remainingDays: number;
    createdAt: string;
    updatedAt: string;
}