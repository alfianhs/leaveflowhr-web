// Generic Base API Response Model
export interface ApiResponse<T> {
  status: number;
  message: string;
  validation: Record<string, string[]>;
  data: T;
  meta: ApiMeta | null;
}

export interface ApiMeta {
  page?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
}

// Error response type
export interface ApiError {
  status: number;
  message: string;
  validation: Record<string, string[]>;
  data: null;
  meta: null;
}

// Generic enum response
export interface EnumResponse<T> {
  key: number;
  value: T;
}
