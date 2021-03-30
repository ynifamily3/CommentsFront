export interface INaver {
  access_token: string;
  expires_in: number;
  state: string;
  token_type: string;
}

export type AuthState =
  | { authMethod: null; authValue: null }
  | { authMethod: "naver"; authValue: INaver };
