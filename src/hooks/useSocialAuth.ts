import { useEffect } from "react";
import { AuthState, ITwitter, IKakao } from "../entity/AuthType";
import { UpdateUserInfoAction } from "../entity/UserInfo";
import { sendMessageTo3rdService } from "../util/postMessage";
import { useSavedAuth } from "./useSavedAuth";

function applyLogin(
  authState: AuthState,
  dispatch: React.Dispatch<UpdateUserInfoAction>
) {
  // 닉네임, 프로필사진 설정
  const { authMethod, authValue } = authState;
  if (authMethod) {
    switch (authMethod) {
      case "twitter":
        {
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
        }
        break;
      case "kakao":
        {
          const { displayName, id, photo, authorization } = authValue as IKakao;
          dispatch({
            type: "UPDATE_USER_INFO",
            payload: {
              auth: {
                authMethod: "kakao",
                authValue: { displayName, id, photo, authorization },
              },
              userId: id,
              nickname: displayName ?? "",
              profile: photo ?? "https://via.placeholder.com/150",
            },
          });
        }
        break;
      default:
        break;
    }
  }
}

function useSocialAuth(dispatch: React.Dispatch<UpdateUserInfoAction>) {
  const { auth, status } = useSavedAuth();

  useEffect(() => {
    if (status === "RESOLVED") {
      if (auth && auth.authMethod && auth.authValue) applyLogin(auth, dispatch);
    }
  }, [auth, status, dispatch]);

  useEffect(() => {
    function receiveMessage(event: MessageEvent<AuthState>) {
      // 허용 리스트
      const allowedOrigin = [
        "http://localhost:3000",
        "http://localhost:8081",
        "http://roco.moe",
        "https://auth.roco.moe",
      ];
      if (!allowedOrigin.includes(event.origin)) {
        return;
      }
      (event.source as Window).close();
      // 로그인 처리
      applyLogin(event.data, dispatch);
      // 로컬스토리지에 저장 (3rd cookie 비활성된 경우 catch문에 걸립니다.)
      try {
        window.localStorage.setItem(
          "comments-service-roco-auth",
          JSON.stringify(event.data)
        );
      } catch (e) {
      } finally {
        // 3rd 로컬스토리지에 저장 (명령 내리기)
        sendMessageTo3rdService({
          auth: event.data,
        });
      }
    }

    window.addEventListener("message", receiveMessage, false);
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, [dispatch]);
}

export default useSocialAuth;
