export interface ITwitter {
  id: string;
  displayName: string | null;
  photo: string | null;
  authorization: string;
}

export interface IKakao {
  id: string;
  displayName: string | null;
  photo: string | null;
  authorization: string;
}

export type AuthState =
  | { authMethod: null; authValue: null }
  | { authMethod: "twitter"; authValue: ITwitter }
  | { authMethod: "kakao"; authValue: IKakao };
