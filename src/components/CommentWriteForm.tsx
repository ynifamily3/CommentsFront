import React, { FC, useEffect, useRef } from "react";
import styled from "styled-components";
import { BasicProps } from "../entity/UserInfo";
import { CButton } from "../stories/CButton";
import TwitterLogin from "./TwitterLogin";
import KakaoLogin from "./KakaoLogin";
import { postComment } from "../repo/comment";
import { useApi } from "../hooks/useApi";
import { ApiStatus } from "../entity/repo/ApiResponse";

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

type CommentWriteFormProps = BasicProps & {
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommentWriteForm: FC<CommentWriteFormProps> = ({
  consumerID,
  sequenceID,
  state: { auth, nickname, profile },
  setRefetch,
}) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const contentInput = useRef<HTMLDivElement>(null);
  const { call, data, status } = useApi(postComment);
  const handleRegiester = () => {
    const { authMethod, authValue } = auth;
    if (authMethod && authValue) {
      const { authorization } = authValue;
      call({
        consumerID,
        sequenceID,
        authMethod,
        authorization,
        content: contentInput.current!.textContent!,
        image: null,
      });
    } else {
      alert("AuthValue 누락됨.");
    }
  };

  useEffect(() => {
    if (status === ApiStatus.SUCCESS && data?.result === true) {
      setRefetch((r) => !r);
      console.log(data);
    }
  }, [status, setRefetch, data]);

  return (
    <>
      <Form>
        <ProfilePhotoBox>
          <ProfilePhoto src={profile}></ProfilePhoto>
        </ProfilePhotoBox>
        <RowC>
          <RowC>
            <Row>
              <Nick style={{ color: nickname ? "inherit" : "gray" }}>
                {nickname ? nickname : "닉네임"}
              </Nick>
            </Row>
            <ContentDraft>
              <ContentInput
                contentEditable={true}
                placeholder={"댓글 작성"}
                ref={contentInput}
              />
            </ContentDraft>
          </RowC>
          <Bottom>
            <Attachment>
              <button
                className="btn-image"
                style={{ background: "rgb(15,20,25)" }}
                disabled={false}
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
                disabled={false}
                style={{ display: "none" }}
                onChange={(e) => {}}
              />
            </Attachment>
            <LoginList>
              <TwitterLogin />
              <KakaoLogin />
            </LoginList>
            <CButton disabled={false} label="등록" onClick={handleRegiester} />
          </Bottom>
          <Bottom>
            <UploadStatus>파일 업로드 현황판.</UploadStatus>
          </Bottom>
        </RowC>
      </Form>
    </>
  );
};

export default CommentWriteForm;
