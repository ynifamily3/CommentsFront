import React, { Dispatch, FC, useEffect } from "react";
import styled from "styled-components";
import CommentArticle from "./CommentArticle";
import axios from "axios";
import { Comment } from "../entity/Comment";
import { ApiResultWithCount } from "../entity/ApiResult";
import { produce } from "immer";
import {
  CommentActionTypes,
  FetchCommentListSuccessAction,
  FETCH_COMMENT_LIST,
  FETCH_COMMENT_LIST_SUCCESS,
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
  const { data } = await axios.get<ApiResultWithCount<Comment[]>>(
    `/comment/${consumerID}/${sequenceID}?skip=${skip}&limit=${limit}`
  );
  const action: FetchCommentListSuccessAction = {
    type: FETCH_COMMENT_LIST_SUCCESS,
    payload: data,
  };
  dispatch(action);
};

interface State {
  apiStatus: "PENDING" | "FULFILLED" | "REJECTED";
  count: number;
  comments: Comment[];
  skip: number;
  limit: number;
}

type Reducer<T, P> = (state: T, action: P) => T;

const reducer: Reducer<State, CommentActionTypes> = (state, action) => {
  switch (action.type) {
    case FETCH_COMMENT_LIST_SUCCESS:
      return produce(state, (draft) => {
        draft.count = action.payload.count;
        draft.apiStatus = "FULFILLED";
        draft.comments = action.payload.result;
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
};

const CommentList: FC<CommentListProps> = ({ consumerID, sequenceID }) => {
  const [state, dispatch] = useReducerWithThunk(reducer, initialState);
  const { skip, limit, apiStatus, comments, count } = state;
  // get...
  useEffect(() => {
    // let token = true;
    console.log("Hello!");
    const actionCreat = getCommentList({ consumerID, sequenceID, skip, limit });

    dispatch(actionCreat);
    return () => {
      // token = false;
    };
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
