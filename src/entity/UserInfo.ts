import { AuthState } from "./AuthType";

export interface UserInfo {
  auth: AuthState;
  userId: string;
  nickname: string;
  profile: string;
}

export interface UpdateUserInfoAction {
  type: "UPDATE_USER_INFO";
  payload: UserInfo;
}

export type UAction = UpdateUserInfoAction;
