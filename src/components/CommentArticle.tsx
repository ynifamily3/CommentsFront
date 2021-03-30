import React, { FC, useLayoutEffect, useState } from "react";
import styled from "styled-components";
import { Comment } from "../entity/Comment";
import Button from "./atom/Button";

interface CommentArticleProps {
  comment: Comment;
}
const Article = styled.article`
  display: flex;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
  border-bottom: 1px solid rgb(235, 238, 240);
  padding-top: 12px;
  padding-left: 12px;
  padding-right: 12px;
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
  border-radius: 16px;
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
  border-radius: 8px;
  :hover {
    background-color: rgb(15, 20, 25, 0.1);
  }
  margin-bottom: 1em;
`;

const CommentArticle: FC<CommentArticleProps> = (props) => {
  const { comment } = props;
  const [showImg, setShowImg] = useState(false);
  const currentDate = new Date();
  const registeredDate = new Date(comment.date);
  const yyyy = "" + registeredDate.getFullYear();
  const mm = ("" + (registeredDate.getMonth() + 1)).padStart(2, "0");
  const dd = ("" + registeredDate.getDate()).padStart(2, "0");
  const hour = registeredDate.getHours();
  const isMorning = hour < 12;
  const diffSeconds = Math.floor((+currentDate - +registeredDate) / 1000);
  let diffString = `${diffSeconds}초 전`;
  if (diffSeconds > 604800) {
    diffString = `${yyyy}/${mm}/${dd} ${isMorning ? "오전" : "오후"} ${
      !isMorning && hour === 12 ? hour : hour % 12
    }시`;
  } else if (diffSeconds > 86400) {
    diffString = `${Math.floor(diffSeconds / 86400)}일 전`;
  } else if (diffSeconds > 3600) {
    diffString = `${Math.floor(diffSeconds / 3600)}시간 전`;
  } else if (diffSeconds > 60) {
    diffString = `${Math.floor(diffSeconds / 60)}분 전`;
  } else {
    diffString = `방금 전`;
  }
  const handleShowImg = () => {
    setShowImg(true);
  };
  useLayoutEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paramsGet = urlParams.get("origin");
    if (!paramsGet) return;
    const origin = window.decodeURIComponent(paramsGet);
    window.parent.postMessage(
      { height: window.document.body.scrollHeight },
      origin
    );
  }, [showImg]);
  return (
    <Article>
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
              <ShowImgButton onClick={handleShowImg}>이미지 보기</ShowImgButton>
            )}
            {showImg && (
              <ImgContent>
                <img src={comment.content.imageData} alt="이미지" />
              </ImgContent>
            )}
          </>
        )}
      </RowC>
    </Article>
  );
};

export default CommentArticle;
