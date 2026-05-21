import { getLeaveBalanceByYear } from "@/app/_services";
import { useQuery } from "@tanstack/react-query";

export function useLeaveBalance(year: number) {
    return useQuery({
        queryKey: ["leave-balance", year],
        queryFn: () => getLeaveBalanceByYear(year),
    });
}