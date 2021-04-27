import { AuthState } from "./AuthType";

export interface CommentListProps {
  consumerID: string;
  sequenceID: string;
  userId: string;
  auth: AuthState;
  nickname: string;
  profile: string;
}

export interface CommentListApiPayload {
  consumerID: string;
  sequenceID: string;
  skip: number;
  limit: number;
}
