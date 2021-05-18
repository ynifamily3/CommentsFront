// 성공 & 실패 타입을 따로 정의
import { ApiStatus } from "../repo/ApiResponse";

export interface SuccessState<T> {
  status: ApiStatus.SUCCESS;
  data: T;
}
export interface PendingState<T> {
  status: ApiStatus.PENDING;
  data: T | null;
}

// idle , error
export interface NoneState {
  status: ApiStatus.FAILURE | ApiStatus.IDLE;
  data: null;
}

export type CombinedStatus<T> = SuccessState<T> | PendingState<T> | NoneState;
