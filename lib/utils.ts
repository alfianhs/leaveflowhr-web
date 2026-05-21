import { ROLES, User } from '@/app/_models';
import { clsx, type ClassValue } from 'clsx'
import { format } from 'date-fns/format';
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to format datetime to jakarta
export function formatDateTimeToJakarta(utcDateString: string) {
  const date = new Date(utcDateString + "Z");
  return date.toLocaleString("en-GB", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).replace(",", "");
}

// Utility function to format date range
export function formatDateRange(startDate?: Date, endDate?: Date) {
  if (!startDate || !endDate) return "—";
  const startFormatted = format(startDate, "d MMM yyyy");
  const endFormatted = format(endDate, "d MMM yyyy");
  if (startFormatted === endFormatted) return startFormatted;
  return `${startFormatted} – ${endFormatted}`;
};

// Utility function to get user initials
export function getUserInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Utility function to check if user has approval permissions
export function canApprove(user: User | null): boolean {
  if (!user) return false;
  return user.role.key === ROLES.MANAGER || user.role.key === ROLES.HR;
}

// Utility function to get status badge styles
export function getStatusBadgeStyles(status: string) {
  switch (status) {
    case "Approved":
      return "bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/20";
    case "Pending":
      return "bg-yellow-600/20 text-yellow-400 border-yellow-600/30 hover:bg-yellow-600/20";
    case "Rejected":
      return "bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/20";
    case "Cancelled":
      return "bg-gray-600/20 text-gray-400 border-gray-600/30 hover:bg-gray-600/20";
    default:
      return "";
  }
};

// Utility function to get leave type badge styles
export function getLeaveTypeBadgeStyles(type: string) {
  switch (type) {
    case "Annual":
      return "bg-blue-600/20 text-blue-400 border-blue-600/30 hover:bg-blue-600/20";
    case "Sick":
      return "bg-yellow-900 text-yellow-200";
    default:
      return "";
  }
};
