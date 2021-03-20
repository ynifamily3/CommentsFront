import { ApiResultWithCount } from "../entity/ApiResult";
import { Comment } from "../entity/Comment";

export const FETCH_COMMENT_LIST = "FETCH_COMMENT_LIST";
export const FETCH_COMMENT_LIST_SUCCESS = "FETCH_COMMENT_LIST_SUCCESS";
export const FETCH_COMMENT_LIST_FAILURE = "FETCH_COMMENT_LIST_FAILURE";
export const CHANGE_SKIP_LIMIT = "CHANGE_SKIP_LIMIT";
export interface FetchCommentListAction {
  type: typeof FETCH_COMMENT_LIST;
  payload: {
    token: number;
  };
}
export interface FetchCommentListSuccessAction {
  type: typeof FETCH_COMMENT_LIST_SUCCESS;
  payload: { data: ApiResultWithCount<Comment[]>; token: number };
}

export interface FetchCommentListFailureAction {
  type: typeof FETCH_COMMENT_LIST_FAILURE;
  payload: { data: unknown; token: number };
}

export interface ChangeSkipLimit {
  type: typeof CHANGE_SKIP_LIMIT;
  payload: {
    skip: number;
    limit: number;
  };
}

export type CommentActionTypes =
  | FetchCommentListAction
  | FetchCommentListSuccessAction
  | FetchCommentListFailureAction
  | ChangeSkipLimit;
