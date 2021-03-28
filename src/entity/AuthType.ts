export interface INaver {
  access_token: string;
  expires_in: number;
  state: string;
  token_type: string;
}

export type AuthType = null | INaver;
