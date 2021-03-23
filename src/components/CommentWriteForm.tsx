import axios from "axios";
import produce from "immer";
import React, { Dispatch, FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  CommentActionTypes,
  WriteCommentSuccessAction,
  WRITE_COMMENT,
  WRITE_COMMENT_FAILURE,
  WRITE_COMMENT_SUCCESS,
} from "../action/CommentAction";
import { ApiResult, ApiResultWithCount } from "../entity/ApiResult";
import { Comment } from "../entity/Comment";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useReducerWithThunk } from "../hooks/useReducerWithThunk";
import Button from "./atom/Button";

const Form = styled.div`
  display: flex;
  padding-left: 12px;
  padding-right: 12px;
  margin-top: 12px;
`;

const ProfilePhotoBox = styled.div``;
const ProfilePhoto = styled.div<{ src: string }>`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background-image: url(${({ src }) => src});
  background-size: cover;
  margin-right: 12px;
`;

const Nick = styled.div`
  font-weight: 700;
  size: 15px;
  line-height: 20px;
  color: #0f1419;
  width: 100%;
  cursor: text;
`;

const RowC = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const ContentDraft = styled.div`
  overflow-wrap: break-word;
  word-break: break-all;
  color: rgb(15, 20, 25);
  line-height: 20px;
  font-weight: 400;
  padding-bottom: 12px;
  width: 100%;
  min-height: 50px;
  cursor: text;
`;

const Input = styled.div`
  line-height: 24px;
  size: 20px;
  font-weight: inherit;
  color: #0f1419;
  outline: none;
  overflow-wrap: break-word;
  word-break: break-all;
  :empty::before {
    content: attr(placeholder);
    display: block; /* For Firefox */
    color: #5b7083;
  }
`;

const Bottom = styled.div`
  border-top: 1px solid rgb(235, 238, 240);
  padding-top: 12px;
  padding-bottom: 12px;
  display: flex;
`;

const Attachment = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const UploadButton = styled.label`
  background-color: #ff6600;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
  :hover {
    background-color: #ff5f5f;
  }
  :disabled {
    opacity: 0.5;
  }
`;

const UploadStatus = styled.div`
  margin-left: 1em;
  overflow-wrap: break-word;
  word-break: break-all;
`;

interface State {
  apiStatus: "IDLE" | "PENDING" | "FULFILLED" | "REJECTED";
  cancelToken: number; // cancel Token
  nickname: string;
  image: string;
  content: string;
}
type Reducer<T, P> = (state: T, action: P) => T;

interface PostCommentApiPayload {
  consumerID: string;
  sequenceID: string;
  nickname: string;
  image: string | null;
  content: string;
  uuid: string;
}

const postComment = ({
  uuid,
  consumerID,
  sequenceID,
  nickname,
  image,
  content,
}: PostCommentApiPayload) => async (dispatch: Dispatch<CommentActionTypes>) => {
  const currentToken = Math.random();
  dispatch({
    type: WRITE_COMMENT,
    payload: { token: currentToken },
  });
  try {
    const { data } = await axios.post<ApiResultWithCount<Comment[]>>(
      `/comment/${consumerID}/${sequenceID}?skip=${0}&limit=${1}`,
      {
        date: new Date().toISOString(),
        writer: {
          id: uuid,
          nickname,
          profilePhoto: "https://via.placeholder.com/150",
        },
        content: {
          textData: content,
          imageData: image,
        },
      }
    );
    console.log(data);
    const action: WriteCommentSuccessAction = {
      type: WRITE_COMMENT_SUCCESS,
      payload: { token: currentToken },
    };
    dispatch(action);
  } catch (e) {
    dispatch({
      type: WRITE_COMMENT_FAILURE,
      payload: { data: e, token: currentToken },
    });
  }
};

const reducer: Reducer<State, CommentActionTypes> = (state, action) => {
  switch (action.type) {
    case WRITE_COMMENT:
      return produce(state, (draft) => {
        draft.apiStatus = "PENDING";
        draft.cancelToken = action.payload.token;
      });
    case WRITE_COMMENT_SUCCESS:
      if (state.cancelToken !== action.payload.token) {
        return state;
      }
      return produce(state, (draft) => {
        draft.apiStatus = "FULFILLED";
      });
    case WRITE_COMMENT_FAILURE:
      if (state.cancelToken !== action.payload.token) {
        return state; // 취소됨. 기존 상태 그대로 반환
      }
      return produce(state, (draft) => {
        draft.apiStatus = "REJECTED";
      });
    default:
      return state;
  }
};

const initialState: State = {
  apiStatus: "IDLE",
  cancelToken: 0,
  nickname: "",
  image: "https://via.placeholder.com/150",
  content: "",
};

const CommentWriteForm: FC<{
  uuid: string;
  consumerID: string;
  sequenceID: string;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ uuid, consumerID, sequenceID, setRefetch }) => {
  const [nickname, setNickname] = useLocalStorage("nickname", "");
  const input = useRef<HTMLDivElement>(null);
  const nicknameInput = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducerWithThunk(reducer, initialState);
  // 파일 첨부는 action으로 관리하지 않을 것입니다.
  const [attachedImage, setAttachedImage] = useState<File | null>(null);
  const [fileUploadStatus, setFileUploadStatus] = useState<
    "IDLE" | "PENDING" | "FULFILLED" | "REJECTED"
  >("IDLE");
  const [s3URL, setS3URL] = useState<string | null>(null);

  // 파일 업로드
  useEffect(() => {
    if (!attachedImage) return;
    async function up(imageFile: File) {
      const formData = new FormData();
      formData.append("file", imageFile);
      const { data } = await axios.post<ApiResult<string>>("/file", formData);
      if (data.status === "SUCCESS") {
        // setS3URL(data.result);
        return data.result;
      } else {
        throw new Error("Failure Uploading");
      }
    }
    // 업로드 진행 처리
    if (fileUploadStatus === "PENDING") {
      // S3 Upload
      up(attachedImage)
        .then((data) => {
          setFileUploadStatus("FULFILLED");
          setS3URL(data);
        })
        .catch((e) => {
          setFileUploadStatus("REJECTED");
        });
    }
  }, [fileUploadStatus, attachedImage]);

  useEffect(() => {
    if (nicknameInput.current) nicknameInput.current.textContent = nickname;
  }, [nickname]);
  const handleFocus = () => {
    input.current?.focus();
  };
  const handleRegister = () => {
    const nickname = nicknameInput.current?.textContent;
    const content = input.current?.textContent;
    if (nickname && content) {
      setNickname(nickname);
      const actionCreat = postComment({
        consumerID,
        content,
        image: s3URL,
        nickname,
        sequenceID,
        uuid,
      });
      dispatch(actionCreat);
    }
  };
  useEffect(() => {
    if (state.apiStatus === "FULFILLED") {
      // 리스트 갱신 시그널 보냄
      setRefetch((r) => !r);

      // 입력폼 초기화
      if (input.current) input.current.textContent = "";
      setFileUploadStatus("IDLE");
      setAttachedImage(null);
      setS3URL(null);
    }
  }, [state.apiStatus, setRefetch]);
  // 에러 처리
  useEffect(() => {
    if (state.apiStatus === "REJECTED") {
      alert("일시적인 오류로 댓글을 등록하지 못했습니다.");
    }
  }, [state.apiStatus]);
  return (
    <Form>
      <ProfilePhotoBox>
        <ProfilePhoto src="https://via.placeholder.com/150"></ProfilePhoto>
      </ProfilePhotoBox>
      <RowC>
        <RowC>
          <Row>
            <Nick>
              <Input
                contentEditable={true}
                placeholder={"닉네임"}
                ref={nicknameInput}
              />
            </Nick>
          </Row>
          <ContentDraft onClick={handleFocus}>
            <Input
              contentEditable={state.apiStatus !== "PENDING"}
              placeholder={"댓글 작성"}
              ref={input}
            />
          </ContentDraft>
        </RowC>
        <Bottom>
          <Attachment>
            <UploadButton
              className="input-file-button"
              htmlFor="input-file"
              style={
                fileUploadStatus === "PENDING" || state.apiStatus === "PENDING"
                  ? { opacity: 0.5 }
                  : { opacity: 1 }
              }
            >
              사진 첨부
            </UploadButton>
            <UploadStatus>
              {fileUploadStatus === "PENDING" &&
                `${attachedImage?.name} 업로드 중...`}
              {fileUploadStatus === "FULFILLED" &&
                `${attachedImage?.name} 업로드 완료!`}
              {fileUploadStatus === "REJECTED" &&
                `${attachedImage?.name} 업로드 실패`}
            </UploadStatus>
            <input
              type="file"
              id="input-file"
              accept="image/*"
              disabled={fileUploadStatus === "PENDING"}
              style={{ flex: 1, display: "none" }}
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  if (files[0].size < 1000000 * 25) {
                    setFileUploadStatus("PENDING");
                    setAttachedImage(files[0]);
                    console.log(files[0]);
                  } else {
                    alert("파일 첨부 가능 용량: 25MB 이하입니다.");
                  }
                }
              }}
            />
          </Attachment>
          <Button
            onClick={handleRegister}
            disabled={
              fileUploadStatus === "PENDING" || state.apiStatus === "PENDING"
            }
          >
            등록
          </Button>
        </Bottom>
      </RowC>
    </Form>
  );
};

export default CommentWriteForm;
