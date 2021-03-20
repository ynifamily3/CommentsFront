import React, { Dispatch, FC, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { Comment } from "../entity/Comment";
import { ApiResultWithCount } from "../entity/ApiResult";
import { produce } from "immer";
import {
  CommentActionTypes,
  FetchCommentListSuccessAction,
  FETCH_COMMENT_LIST,
  FETCH_COMMENT_LIST_FAILURE,
  FETCH_COMMENT_LIST_SUCCESS,
  CHANGE_SKIP_LIMIT,
} from "../action/CommentAction";
import { useReducerWithThunk } from "../hooks/useReducerWithThunk";

const CList = styled.div``;

interface CommentListProps {
  consumerID: string;
  sequenceID: string;
}

interface CommentListApiPayload {
  consumerID: string;
  sequenceID: string;
  skip: number;
  limit: number;
}

const getCommentList = ({
  consumerID,
  sequenceID,
  skip,
  limit,
}: CommentListApiPayload) => async (dispatch: Dispatch<CommentActionTypes>) => {
  const currentToken = Math.random();
  dispatch({
    type: FETCH_COMMENT_LIST,
    payload: { token: currentToken },
  });
  try {
    const { data } = await axios.get<ApiResultWithCount<Comment[]>>(
      `/comment/${consumerID}/${sequenceID}?skip=${skip}&limit=${limit}`
    );
    const action: FetchCommentListSuccessAction = {
      type: FETCH_COMMENT_LIST_SUCCESS,
      payload: { data, token: currentToken },
    };
    dispatch(action);
  } catch (e) {
    dispatch({
      type: FETCH_COMMENT_LIST_FAILURE,
      payload: { data: e, token: currentToken },
    });
  }
};

interface State {
  apiStatus: "PENDING" | "FULFILLED" | "REJECTED";
  count: number;
  comments: Comment[];
  skip: number;
  limit: number;
  cancelToken: number; // cancel Token
}

type Reducer<T, P> = (state: T, action: P) => T;

const reducer: Reducer<State, CommentActionTypes> = (state, action) => {
  switch (action.type) {
    case FETCH_COMMENT_LIST:
      return produce(state, (draft) => {
        draft.apiStatus = "PENDING";
        draft.cancelToken = action.payload.token;
      });
    case FETCH_COMMENT_LIST_SUCCESS:
      if (state.cancelToken !== action.payload.token) {
        console.log("취소취소!!!!!!!");
        return state; // 취소됨. 기존 상태 그대로 반환
      }
      return produce(state, (draft) => {
        draft.count = action.payload.data.count;
        draft.apiStatus = "FULFILLED";
        draft.comments = action.payload.data.result;
      });
    case FETCH_COMMENT_LIST_FAILURE:
      if (state.cancelToken !== action.payload.token) {
        console.log("취소취소!!!!!!!2");
        return state; // 취소됨. 기존 상태 그대로 반환
      }
      return produce(state, (draft) => {
        draft.count = 0;
        draft.apiStatus = "REJECTED";
        draft.comments = [];
      });
    case CHANGE_SKIP_LIMIT:
      return produce(state, (draft) => {
        draft.skip = action.payload.skip;
        draft.limit = action.payload.limit;
      });
    default:
      return state;
  }
};

const initialState: State = {
  apiStatus: "PENDING",
  count: 0,
  comments: [],
  skip: 0,
  limit: 50,
  cancelToken: 0,
};

const CommentList: FC<CommentListProps> = ({ consumerID, sequenceID }) => {
  const [state, dispatch] = useReducerWithThunk(reducer, initialState);
  const { skip, limit, apiStatus, comments, count } = state;
  // get...
  useEffect(() => {
    const actionCreat = getCommentList({ consumerID, sequenceID, skip, limit });
    dispatch(actionCreat);
    // dispatch 미취급
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consumerID, limit, sequenceID, skip]);
  return (
    <>
      <div>
        {apiStatus === "PENDING" && `불러오는 중...`}
        {apiStatus === "FULFILLED" &&
          `Service ID: ${consumerID} / ${sequenceID} (총: ${count}개의 댓글)`}
        {apiStatus === "REJECTED" && `무언가 잘못됨!`}
      </div>
      <button
        onClick={() => {
          dispatch({
            type: CHANGE_SKIP_LIMIT,
            payload: { limit: 50, skip: state.skip + 1 },
          });
        }}
      >
        {state.skip + 2}페이지로
      </button>
      <CList>
        {comments.map((comment) => {
          return (
            <div key={comment.id}>
              {comment.date} / {comment.content.textData}
              <img src={comment.content.imageData} alt={"댓글 이미지"} />
            </div>
          );
        })}
        {/* <CommentArticle />
        <CommentArticle />
        <CommentArticle /> */}
      </CList>
    </>
  );
};

export default CommentList;
