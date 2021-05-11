import { useEffect } from "react";
import { AuthState, ITwitter } from "../entity/AuthType";
import { UpdateUserInfoAction } from "../entity/UserInfo";
import { useLocalStorage } from "./useLocalStorage";

function applyLogin(
  authState: AuthState,
  dispatch: React.Dispatch<UpdateUserInfoAction>
) {
  // 닉네임, 프로필사진 설정
  const { authMethod, authValue } = authState;
  if (authMethod) {
    switch (authMethod) {
      case "twitter":
        const { displayName, id, photo, authorization } = authValue as ITwitter;
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
        break;
      default:
        break;
    }
  }
}

function useSocialAuth(dispatch: React.Dispatch<UpdateUserInfoAction>) {
  // const [savedAuth, setSavedAuth] = useLocalStorage<AuthState>(
  //   "roco-moe-comments-auth",
  //   {
  //     authMethod: null,
  //     authValue: null,
  //   }
  // );

  // 로컬스토리지에 인증 관련 정보가 있는 경우 이것을 사용함.
  // if (savedAuth && savedAuth.authMethod && savedAuth.authValue) {
  //   applyLogin(savedAuth, dispatch);
  // }
  // 소셜 로그인 수행 후 팝업이 메시지를 보냄
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
      (event.source as Window).close();
      // 로그인 처리
      applyLogin(event.data, dispatch);
      // 로컬스토리지에 저장
      // setSavedAuth(event.data);
    }

    window.addEventListener("message", receiveMessage, false);
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, [dispatch]);
}

export default useSocialAuth;
