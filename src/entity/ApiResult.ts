export interface ApiResult<T> {
  status: "SUCCESS" | "FAILURE";
  result: T;
  message: null | string;
}

export interface ApiResultWithCount<T> extends ApiResult<T> {
  count: number;
}
