import type { ApiError } from "@/app/_models";

export class ApiException extends Error {
  status: number;
  validation?: Record<string, string[]>;

  constructor(error: ApiError) {
    super(error.message);

    this.name = "ApiException";
    this.status = error.status;
    this.validation = error.validation ?? {};
  }
}

export function getFieldError(
  error: unknown,
  field: string
) {
  if (
    error instanceof ApiException
  ) {
    return error.validation?.[field]?.[0];
  }

  return undefined;
}