export interface ApiResult<T> {
  status: "SUCCESS" | "FAILURE";
  result: T;
}

export interface ApiResultWithCount<T> extends ApiResult<T> {
  count: number;
}
