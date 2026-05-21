import { getMe, login } from "@/app/_services";
import { getAuthToken, setAuthToken } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useApiMutation } from "./use-api-mutation";
import { toast } from "sonner";

export function useLogin() {
    return useApiMutation({
        mutationFn: login,
        invalidateKeys: [["me"]],
        onSuccess: (data) => {
          setAuthToken(data.data.accessToken, false);
          toast.success("Login successful");
        }
    })
}

export function useMe() {
  const token = getAuthToken();

  return useQuery({
    queryKey: ["me"],
    queryFn: () => getMe(),
    enabled: !!token,
    retry: false,
  });
}