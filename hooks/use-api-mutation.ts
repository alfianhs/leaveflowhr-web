"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

type MutationConfig<TPayload, TResult> = {
  mutationFn: (payload: TPayload) => Promise<TResult>;
  invalidateKeys?: string[][];
  onSuccess?: (data: TResult) => void;
  onError?: (error: unknown) => void;
};

export function useApiMutation<
  TPayload,
  TResult
>({
  mutationFn,
  invalidateKeys = [],
  onSuccess,
  onError,
}: MutationConfig<TPayload, TResult>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,

    onSuccess: async (data) => {
      await Promise.all(
        invalidateKeys.map((key) =>
          queryClient.invalidateQueries({
            queryKey: key,
          })
        )
      );

      onSuccess?.(data);
    },

    onError,
  });
}