export interface INaver {
  access_token: string;
  expires_in: number;
  state: string;
  token_type: string;
}

export interface ITwitter {
  uid: string;
  idToken: string;
  displayName: string | null;
  photoURL: string | null;
}

export type AuthState =
  | { authMethod: null; authValue: null }
  | { authMethod: "naver"; authValue: INaver }
  | { authMethod: "twitter"; authValue: ITwitter };
