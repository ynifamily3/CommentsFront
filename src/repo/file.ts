import axios, { CancelToken } from "axios";
import { ApiResult } from "../entity/ApiResult";
import { uploadFilePayload } from "../entity/repo/file";
import { handleAxiosExceptionCatch } from "./_axios";

export async function uploadFile(
  payload: uploadFilePayload,
  cancelToken: CancelToken
) {
  try {
    const { authMethod, authorization, imageFile } = payload;
    const formData = new FormData();
    formData.append("authMethod", authMethod);
    formData.append("file", imageFile);
    const { data } = await axios.post<ApiResult<string>>("/file/v2", formData, {
      headers: { Authorization: authorization },
      cancelToken,
    });
    return data;
  } catch (thrown) {
    return handleAxiosExceptionCatch(thrown);
  }
}
