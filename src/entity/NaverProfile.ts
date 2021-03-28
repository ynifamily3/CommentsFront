export interface INaverProfileResult {
  resultcode: string;
  response: {
    id: string;
    email: string;
    nickname: string | null;
    profile_image: string | null;
  };
}
