import React, {
  Dispatch,
  FC,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
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
import CommentArticle from "./CommentArticle";
import CommentWriteForm from "./CommentWriteForm";
import "./atom/Spinner.scss";
import { ReactComponent as CloseIcon } from "./atom/close.svg";
import Button from "./atom/Button";
import { AuthState } from "../entity/AuthType";

const CList = styled.div``;
const Divider = styled.div`
  border-top-color: rgb(235, 238, 240);
  border-top-width: 1px;
  border-top-style: solid;
  height: 12px;
  background-color: rgb(247, 249, 250);
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgb(235, 238, 240);
`;

const Loading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1em;
`;

export interface CommentListProps {
  consumerID: string;
  sequenceID: string;
  userId: string;
  auth: AuthState;
  nickname: string;
  profile: string;
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
        return state; // 취소됨. 기존 상태 그대로 반환
      }
      return produce(state, (draft) => {
        draft.count = action.payload.data.count;
        draft.apiStatus = "FULFILLED";
        draft.comments = action.payload.data.result;
      });
    case FETCH_COMMENT_LIST_FAILURE:
      if (state.cancelToken !== action.payload.token) {
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

const CommentList: FC<CommentListProps> = (props) => {
  const { consumerID, sequenceID, auth, nickname, profile, userId } = props;
  const [refetch, setRefetch] = useState(false);
  const [state, dispatch] = useReducerWithThunk(reducer, initialState);
  const { skip, limit, comments, apiStatus } = state;
  // get...
  useEffect(() => {
    const actionCreat = getCommentList({ consumerID, sequenceID, skip, limit });
    dispatch(actionCreat);
    // dispatch 미취급
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consumerID, limit, sequenceID, skip, refetch]);

  useLayoutEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paramsGet = urlParams.get("origin");
    if (!paramsGet) return;
    const origin = window.decodeURIComponent(paramsGet);
    window.parent.postMessage(
      { height: window.document.body.scrollHeight },
      origin
    );
  }, [state]);

  return (
    <>
      <CommentWriteForm
        setRefetch={setRefetch}
        consumerID={consumerID}
        sequenceID={sequenceID}
        userId={userId}
        auth={auth}
        nickname={nickname}
        profile={profile}
      />
      <Divider />
      <CList>
        {apiStatus === "PENDING" && (
          <Loading>
            <div className="loader" />
            <div>로드 중...</div>
          </Loading>
        )}
        {apiStatus === "REJECTED" && (
          <Loading style={{ padding: "1em" }}>
            <CloseIcon />{" "}
            <div
              style={{
                marginTop: "1em",
                marginBottom: "1em",
                color: "#5b7083",
              }}
            >
              일시적인 오류로 댓글을 불러오지 못했습니다.
            </div>
            <Button
              onClick={(e) => {
                setRefetch((r) => !r);
              }}
            >
              재시도
            </Button>
          </Loading>
        )}
        {apiStatus === "FULFILLED" && comments.length === 0 && (
          <Loading>
            <div style={{ color: "#5b7083" }}>
              첫 번째 댓글의 주인공이 되세요!
            </div>
          </Loading>
        )}
        {comments.map((comment) => {
          return <CommentArticle key={comment.id} comment={comment} />;
        })}
      </CList>
    </>
  );
};

export default CommentList;
