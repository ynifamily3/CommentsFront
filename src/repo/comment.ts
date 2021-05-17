import axios, { CancelToken } from "axios";
import { ApiResult, ApiResultWithCount } from "../entity/ApiResult";
import {
  DeleteCommentPayload,
  GetCommentsPayload,
  PostCommentPayload,
} from "../entity/repo/comment";
import { handleAxiosExceptionCatch } from "./_axios";

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
    return handleAxiosExceptionCatch(thrown);
  }
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
      `/comment/${consumerID}/${sequenceID}/v2`,
      {
        authMethod,
        textData: content,
        imageData: image,
      },
      { headers: { Authorization: authorization }, cancelToken }
    );
    return data;
  } catch (thrown) {
    return handleAxiosExceptionCatch(thrown);
  }
}

export async function deleteComment(
  payload: DeleteCommentPayload,
  cancelToken: CancelToken
) {
  try {
    const { authMethod, authorization, id } = payload;
    const { data } = await axios.delete<ApiResult<boolean>>(
      `/comment/${id}?authMethod=${authMethod}`,
      {
        headers: { Authorization: authorization },
        cancelToken,
      }
    );
    return data;
  } catch (thrown) {
    return handleAxiosExceptionCatch(thrown);
  }
}
