import axios from "axios";
import produce from "immer";
import React, { Dispatch, FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  CommentActionTypes,
  WriteCommentFailureAction,
  WriteCommentSuccessAction,
  WRITE_COMMENT,
  WRITE_COMMENT_FAILURE,
  WRITE_COMMENT_SUCCESS,
} from "../action/CommentAction";
import { ApiResult, ApiResultWithCount } from "../entity/ApiResult";
import { Comment } from "../entity/Comment";
import { PostCommentApiPayload } from "../entity/CommentList";
import { BasicProps } from "../entity/UserInfo";
import { useReducerWithThunk } from "../hooks/useReducerWithThunk";
import { CButton } from "../stories/CButton";
import TwitterLogin from "./TwitterLogin";
import KakaoLogin from "./KakaoLogin";

const Form = styled.div`
  position: relative;
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
  /* cursor: text; */
  /* border: 1px solid rgba(15, 20, 25, 0.25); */
  /* border-radius: 3px; */
  margin-bottom: 0.5em;
  width: 100%;
  max-width: 600px;
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
  border: 1px solid rgba(15, 20, 25, 0.25);
  border-radius: 3px;
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
  padding-left: 0.5em;
  line-height: 24px;
  size: 20px;
  font-weight: inherit;
  color: #0f1419;
  outline: none;
  :empty::before {
    content: attr(placeholder);
    display: block; /* For Firefox */
    color: #5b7083;
  }
`;

const ContentInput = styled(Input)`
  padding: 0.5em;
  overflow-wrap: break-word;
  word-break: break-all;
`;

const Bottom = styled.div`
  padding-top: 12px;
  padding-bottom: 12px;
  display: flex;
  gap: 0.5em;
`;

const Attachment = styled.div`
  display: flex;
  align-items: center;
`;

const UploadStatus = styled.div`
  overflow-wrap: break-word;
  word-break: break-all;
`;
const LoginList = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5em;
  flex: 1;
`;

interface State {
  apiStatus: "IDLE" | "PENDING" | "FULFILLED" | "REJECTED";
  cancelToken: number; // cancel Token
  nickname: string;
  image: string;
  content: string;
}
type Reducer<T, P> = (state: T, action: P) => T;

const postComment = (payload: PostCommentApiPayload) => async (
  dispatch: Dispatch<CommentActionTypes>
) => {
  const {
    consumerID,
    sequenceID,
    image,
    content,
    state: { auth, nickname, profile, userId },
  } = payload;
  const currentToken = Math.random();
  dispatch({
    type: WRITE_COMMENT,
    payload: { token: currentToken },
  });
  try {
    let headers: Record<string, string> = {};
    if (auth.authMethod !== null) {
      const authValue = auth.authValue;
      headers["Authorization"] = authValue.authorization;
    }
    const { data } = await axios.post<ApiResultWithCount<Comment[]>>(
      `/comment/${consumerID}/${sequenceID}?skip=${0}&limit=${1}&authType=${
        auth.authMethod
      }`,
      {
        date: new Date().toISOString(),
        writer: {
          id: `${auth.authMethod}-${userId}`,
          nickname,
          profilePhoto: profile,
        },
        content: {
          textData: content,
          imageData: image,
        },
      },
      { headers }
    );
    const action: WriteCommentSuccessAction = {
      type: WRITE_COMMENT_SUCCESS,
      payload: { token: currentToken },
    };
    const failAction: WriteCommentFailureAction = {
      type: WRITE_COMMENT_FAILURE,
      payload: { token: currentToken, data: "?????? ?????? ??????" },
    };
    if (data.status === "FAILURE") {
      dispatch(failAction);
    } else {
      dispatch(action);
    }
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
        return state; // ?????????. ?????? ?????? ????????? ??????
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
  image: "",
  content: "",
};

type CommentWriteFormProps = BasicProps & {
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommentWriteForm: FC<CommentWriteFormProps> = ({
  consumerID,
  sequenceID,
  state: { auth, nickname: fNick, profile: fProf, userId },
  setRefetch,
}) => {
  const [, setNickname] = useState(fNick);
  const [image, setImage] = useState(fProf);

  const input = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const nicknameInput = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducerWithThunk(reducer, initialState);
  // ?????? ????????? action?????? ???????????? ?????? ????????????.
  const [attachedImage, setAttachedImage] = useState<File | null>(null);
  const [fileUploadStatus, setFileUploadStatus] = useState<
    "IDLE" | "PENDING" | "FULFILLED" | "REJECTED"
  >("IDLE");
  const [s3URL, setS3URL] = useState<string | null>(null);

  // ?????? ?????????
  useEffect(() => {
    if (!attachedImage) return;
    async function up(imageFile: File) {
      const formData = new FormData();
      formData.append("file", imageFile);
      const { data } = await axios.post<ApiResult<string>>("/file", formData);
      if (data.status === "SUCCESS") {
        return data.result;
      } else {
        throw new Error("Failure Uploading");
      }
    }
    // ????????? ?????? ??????
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

  // ????????? ??????????????? ?????? ??? ??????
  useEffect(() => {
    if (nicknameInput.current) nicknameInput.current.textContent = fNick;
  }, [fNick]);

  // ????????? ??????????????? ?????? ??? ??????
  useEffect(() => {
    setImage(fProf);
  }, [fProf]);

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
        sequenceID,
        state: { auth, nickname, profile: image, userId },
        image: s3URL,
        content,
      });
      dispatch(actionCreat);
    }
  };
  useEffect(() => {
    if (state.apiStatus === "FULFILLED") {
      // ????????? ?????? ????????? ??????
      setRefetch((r) => !r);

      // ????????? ?????????
      if (input.current) input.current.textContent = "";
      setFileUploadStatus("IDLE");
      setAttachedImage(null);
      setS3URL(null);
    }
  }, [state.apiStatus, setRefetch]);

  // ?????? ??????
  useEffect(() => {
    if (state.apiStatus === "REJECTED") {
      alert("???????????? ????????? ????????? ???????????? ???????????????.");
    }
  }, [state.apiStatus]);
  return (
    <>
      <Form>
        <ProfilePhotoBox>
          <ProfilePhoto src={image}></ProfilePhoto>
        </ProfilePhotoBox>
        <RowC>
          <RowC>
            <Row>
              <Nick>
                <Input
                  contentEditable={false}
                  placeholder={"?????????"}
                  ref={nicknameInput}
                />
              </Nick>
            </Row>
            <ContentDraft onClick={handleFocus}>
              <ContentInput
                contentEditable={state.apiStatus !== "PENDING"}
                placeholder={"?????? ??????"}
                ref={input}
              />
            </ContentDraft>
          </RowC>
          <Bottom>
            <Attachment>
              <button
                className="btn-image"
                style={{ background: "rgb(15,20,25)" }}
                disabled={
                  !auth.authMethod ||
                  fileUploadStatus === "PENDING" ||
                  state.apiStatus === "PENDING"
                    ? true
                    : false
                }
                onClick={() => {
                  if (fileInput.current) {
                    fileInput.current.click();
                  }
                }}
              >
                <i className="xi-2x xi-image"></i>
              </button>
              <input
                ref={fileInput}
                type="file"
                id="input-file"
                accept="image/*"
                disabled={!auth.authMethod || fileUploadStatus === "PENDING"}
                style={{ display: "none" }}
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    if (files[0].size < 1000000 * 25) {
                      setFileUploadStatus("PENDING");
                      setAttachedImage(files[0]);
                    } else {
                      alert("?????? ?????? ?????? ??????: 25MB ???????????????.");
                    }
                  }
                }}
              />
            </Attachment>
            <LoginList>
              <TwitterLogin />
              <KakaoLogin />
            </LoginList>
            <CButton
              onClick={handleRegister}
              disabled={
                !auth.authMethod ||
                fileUploadStatus === "PENDING" ||
                state.apiStatus === "PENDING"
              }
              label="??????"
            />
          </Bottom>
          <Bottom>
            <UploadStatus>
              {fileUploadStatus === "PENDING" &&
                `${attachedImage?.name} ????????? ???...`}
              {fileUploadStatus === "FULFILLED" &&
                `${attachedImage?.name} ????????? ??????!`}
              {fileUploadStatus === "REJECTED" &&
                `${attachedImage?.name} ????????? ??????`}
            </UploadStatus>
          </Bottom>
        </RowC>
      </Form>
    </>
  );
};

export default CommentWriteForm;
