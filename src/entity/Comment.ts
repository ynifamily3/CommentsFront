export interface CommentContent {
  textData: string;
  imageData: string;
}
export interface CommentWriter {
  id: string;
  nickname: string;
  profilePhoto: string;
}
export interface Comment {
  id: string;
  consumerID: string;
  sequenceID: string;
  cntReply: number;
  recommend: number;
  notRecommend: number;
  date: Date;
  content: CommentContent;
  writer: CommentWriter;
}
