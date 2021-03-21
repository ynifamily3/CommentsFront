import React, { FC } from "react";
import styled from "styled-components";
import { Comment } from "../entity/Comment";

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
`;

const NickSide = styled.div`
  font-weight: 400;
  color: #5b7083;
  margin-left: 4px;
  size: 15px;
  line-height: 20px;
`;

const RowC = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Content = styled.div`
  overflow-wrap: break-word;
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
  & > img {
    width: 100%;
    height: 100%;
    max-width: 780px;
  }
`;

const CommentArticle: FC<CommentArticleProps> = (props) => {
  const { comment } = props;
  return (
    <Article>
      <ProfilePhotoBox>
        <ProfilePhoto src={comment.writer.profilePhoto}></ProfilePhoto>
      </ProfilePhotoBox>
      <RowC>
        <Row>
          <Nick>{comment.writer.nickname}</Nick>
          <NickSide>3분 전</NickSide>
        </Row>
        <Content>{comment.content.textData}</Content>
        {comment.content.imageData && (
          <ImgContent>
            <img src={comment.content.imageData} alt="이미지" />
          </ImgContent>
        )}
      </RowC>
    </Article>
  );
};

export default CommentArticle;
