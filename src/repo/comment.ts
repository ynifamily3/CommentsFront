import axios, { CancelToken } from "axios";
import { ApiResult, ApiResultWithCount } from "../entity/ApiResult";

function handleCatch(thrown: any) {
  if (axios.isCancel(thrown)) {
    console.warn("Request canceled", thrown.message);
  } else {
    console.error(thrown.message);
  }
  return null;
}

export interface GetCommentsPayload {
  consumerID: string;
  sequenceID: string;
  skip: number;
  limit: number;
}

export async function getComments(
  payload: GetCommentsPayload,
  cancelToken: CancelToken
) {
  try {
    const { sequenceID, consumerID, skip, limit } = payload;
    const { data } = await axios.get<ApiResultWithCount<Comment[]>>(
      `/comment/${consumerID}/${sequenceID}?skip=${skip}&limit=${limit}`,
      { cancelToken }
    );
    return data;
  } catch (thrown) {
    return handleCatch(thrown);
  }
}

export interface PostCommentPayload {
  authMethod: string;
  authorization: string;
  consumerID: string;
  sequenceID: string;
  image: string | null;
  content: string;
}

export async function postComment(
  payload: PostCommentPayload,
  cancelToken: CancelToken
) {
  try {
    const {
      authMethod,
      authorization,
      sequenceID,
      consumerID,
      image,
      content,
    } = payload;
    const { data } = await axios.post<ApiResult<boolean>>(
      `/comment/${consumerID}/${sequenceID}/v2?authType=${authMethod}`,
      {
        textData: content,
        imageData: image,
      },
      { headers: { Authorization: authorization } }
    );
    return data;
  } catch (thrown) {
    return handleCatch(thrown);
  }
}
