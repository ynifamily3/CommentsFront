export interface CommentContent {
  textData: string;
  imageData: string;
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
}
