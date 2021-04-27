import axios from "axios";
import { useEffect } from "react";
import { AuthState, INaver, ITwitter } from "../entity/AuthType";
import { INaverProfileResult } from "../entity/NaverProfile";
import { UpdateUserInfoAction } from "../entity/UserInfo";

function useSocialAuth(dispatch: React.Dispatch<UpdateUserInfoAction>) {
  // 소셜 인증 처리
  useEffect(() => {
    function receiveMessage(event: MessageEvent<AuthState>) {
      // 허용 리스트
      const allowedOrigin = [
        "http://localhost:3000",
        "http://localhost:8081",
        "https://auth.roco.moe",
      ];
      if (!allowedOrigin.includes(event.origin)) {
        return;
      }
      // 닉네임, 프로필사진 설정
      if (event.data.authMethod) {
        const { authMethod, authValue } = event.data;
        switch (authMethod) {
          case "naver":
            axios
              .get<INaverProfileResult>("/auth/naver/profile", {
                headers: { Authorization: (authValue as INaver).access_token },
              })
              .then(({ data }) => {
                dispatch({
                  type: "UPDATE_USER_INFO",
                  payload: {
                    auth: event.data,
                    userId: data.response.id,
                    nickname: data.response.nickname ?? "",
                    profile:
                      data.response.profile_image ??
                      "https://via.placeholder.com/150",
                  },
                });
              })
              .catch((error) => {
                console.log("Err: ", error);
                alert(
                  "프로필정보를 얻어올 수 없었습니다. (직접 닉네임을 설정해 주세요)"
                );
              })
              .finally(() => {
                // 팝업 창 닫히도록 설정
                (event.source as Window).close();
              });
            break;
          case "twitter":
            const {
              displayName,
              id,
              photo,
              authorization,
            } = authValue as ITwitter;
            dispatch({
              type: "UPDATE_USER_INFO",
              payload: {
                auth: {
                  authMethod: "twitter",
                  authValue: { displayName, id, photo, authorization },
                },
                userId: id,
                nickname: displayName ?? "",
                profile: photo ?? "https://via.placeholder.com/150",
              },
            });
            (event.source as Window).close();
            break;
          default:
            break;
        }
      }
    }
    window.addEventListener("message", receiveMessage, false);
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, [dispatch]);
}

export default useSocialAuth;