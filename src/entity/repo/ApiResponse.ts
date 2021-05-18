export enum ApiStatus {
  IDLE = "IDLE",
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}

export interface ApiResponseMessage {
  message?: unknown;
}

export interface ApiResponse<T> extends ApiResponseMessage {
  status: ApiStatus;
  result: T | null;
}
