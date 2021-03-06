import axios from "axios";
import React, { FC, useState } from "react";
import styled from "styled-components";
import { AuthState } from "../entity/AuthType";
import { Comment, ArticleState } from "../entity/Comment";
import useSendHeight from "../hooks/useSendHeight";
import { CButton } from "../stories/CButton";
import Button from "./atom/Button";

interface CommentArticleProps {
  comment: Comment;
  auth: AuthState;
  state: ArticleState;
}
const Article = styled.article<{ articleState: ArticleState }>`
  display: flex;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
  border-bottom: 1px solid rgb(235, 238, 240);
  padding-top: 12px;
  padding-left: 12px;
  padding-right: 12px;
  padding-bottom: 12px;
  opacity: ${(props) => (props.articleState !== "done" ? 0.5 : 1)};
  transition: 0.3s;
  :hover {
    background-color: rgb(245, 245, 245);
    cursor: pointer;
  }
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
  overflow-wrap: anywhere;
  word-break: break-all;
  max-width: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NickSide = styled.div`
  font-weight: 400;
  color: #5b7083;
  margin-left: 4px;
  size: 15px;
  line-height: 20px;
  min-width: 60px;
  flex: 1;
`;

const RowC = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Content = styled.div`
  overflow-wrap: anywhere;
  word-break: break-all;
  color: rgb(15, 20, 25);
  line-height: 20px;
  font-weight: 400;
  padding-bottom: 12px;
`;

const ImgContent = styled.div`
  border-radius: 3px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(196, 207, 214);
  overflow: hidden;
  margin-bottom: 12px;
  width: 100%;
  max-width: 300px;
  & > img {
    width: 100%;
    height: 100%;
    max-width: 780px;
  }
  cursor: pointer;
`;

const ShowImgButton = styled(Button)`
  width: 100%;
  max-width: 300px;
  background-color: inherit;
  color: rgb(15, 20, 25);
  border: 1px solid rgb(15, 20, 25);
  border-radius: 3px;
  :hover {
    background-color: rgb(15, 20, 25, 0.1);
  }
  margin-bottom: 1em;
`;

const CommentArticle: FC<CommentArticleProps> = (props) => {
  const { comment, auth, state } = props;
  const [articleState, setArticleState] = useState(state);
  const [showImg, setShowImg] = useState(false);
  const currentDate = new Date();
  const registeredDate = new Date(comment.date);
  const yyyy = "" + registeredDate.getFullYear();
  const mm = ("" + (registeredDate.getMonth() + 1)).padStart(2, "0");
  const dd = ("" + registeredDate.getDate()).padStart(2, "0");
  const hour = registeredDate.getHours();
  const isMorning = hour < 12;
  const diffSeconds = Math.floor((+currentDate - +registeredDate) / 1000);
  let diffString = `${diffSeconds}??? ???`;
  if (diffSeconds > 604800) {
    diffString = `${yyyy}/${mm}/${dd} ${isMorning ? "??????" : "??????"} ${
      !isMorning && hour === 12 ? hour : hour % 12
    }???`;
  } else if (diffSeconds > 86400) {
    diffString = `${Math.floor(diffSeconds / 86400)}??? ???`;
  } else if (diffSeconds > 3600) {
    diffString = `${Math.floor(diffSeconds / 3600)}?????? ???`;
  } else if (diffSeconds > 60) {
    diffString = `${Math.floor(diffSeconds / 60)}??? ???`;
  } else {
    diffString = `?????? ???`;
  }
  const handleShowImg = () => {
    setShowImg(true);
  };
  const [imageLoaded, setImageLoaded] = useState(false);

  useSendHeight([imageLoaded]);

  const handleImageLoaded = () => {
    setImageLoaded(true);
  };
  const [deleted, setDeleted] = useState(false);
  const handleDelete = () => {
    if (!window.confirm("????????? ??????????????????????")) return;
    setArticleState("deleting");
    let headers: Record<string, string> = {};
    if (auth.authMethod !== null) {
      const authValue = auth.authValue;
      headers["Authorization"] = authValue.authorization;
    }
    axios
      .delete(
        `/comment/${comment.consumerID}/${comment.sequenceID}/${comment.id}?authType=${auth.authMethod}`,
        { headers }
      )
      .then((d) => {
        setDeleted(true);
      })
      .catch((x) => {
        console.log("err", x);
        alert("????????? ?????????????????????.");
        setArticleState("done");
      });
  };

  return (
    <>
      {!deleted && (
        <Article articleState={articleState}>
          <ProfilePhotoBox>
            <ProfilePhoto src={comment.writer.profilePhoto}></ProfilePhoto>
          </ProfilePhotoBox>
          <RowC>
            <Row>
              <Nick>{comment.writer.nickname}</Nick>
              <NickSide>{diffString}</NickSide>
            </Row>
            <Content>{comment.content.textData}</Content>
            {comment.content.imageData && (
              <>
                {!showImg && (
                  <ShowImgButton onClick={handleShowImg}>
                    ????????? ??????
                  </ShowImgButton>
                )}
                {showImg && (
                  <ImgContent>
                    <img
                      src={comment.content.imageData}
                      alt="?????????"
                      onLoad={handleImageLoaded}
                    />
                  </ImgContent>
                )}
              </>
            )}
          </RowC>
          <Row style={{ width: 150, justifyContent: "flex-end" }}>
            {articleState === "done" &&
              auth.authMethod + "-" + auth.authValue?.id ===
                comment.writer.id && (
                <CButton
                  onClick={handleDelete}
                  label="??????"
                  backgroundColor={"#ffead1"}
                />
              )}
          </Row>
        </Article>
      )}
    </>
  );
};

export default CommentArticle;
