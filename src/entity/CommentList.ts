import { BasicProps } from "./UserInfo";

export interface CommentListApiPayload {
  consumerID: string;
  sequenceID: string;
  skip: number;
  limit: number;
}

export type PostCommentApiPayload = BasicProps & {
  image: string | null;
  content: string;
};
