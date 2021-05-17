export interface GetCommentsPayload {
  consumerID: string;
  sequenceID: string;
  skip: number;
  limit: number;
}

export interface PostCommentPayload {
  authMethod: string;
  authorization: string;
  consumerID: string;
  sequenceID: string;
  image: string | null;
  content: string;
}

export interface DeleteCommentPayload {
  authMethod: string;
  authorization: string;
  id: string;
}
