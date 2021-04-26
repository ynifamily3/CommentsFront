import { useEffect, useReducer, useState } from "react";
import "normalize.css";
import GlobalStyle from "./GlobalStyles";
import CommentList from "./components/CommentList";
import NaverLogin from "./components/NaverLogin";
import { AuthState, INaver, ITwitter } from "./entity/AuthType";
import axios from "axios";
import { INaverProfileResult } from "./entity/NaverProfile";
import styled from "styled-components";
import TwitterLogin from "./components/TwitterLogin";
import useSendHeight from "./hooks/useSendHeight";
import Branding from "./components/Branding";

const LoginList = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1em;
`;

const splitted = window.location.pathname.split("/");
const isValid =
  splitted.length === 3 && splitted[1].length > 0 && splitted[2].length > 0;

interface UserInfo {
  auth: AuthState;
  userId: string;
  nickname: string;
  profile: string;
}

interface UpdateUserInfoAction {
  type: "UPDATE_USER_INFO";
  payload: UserInfo;
}

type Action = UpdateUserInfoAction;

const initialState: UserInfo = {
  auth: { authMethod: null, authValue: null },
  userId: "",
  nickname: "",
  profile: "https://via.placeholder.com/150",
};

function reducer(state: UserInfo, action: Action): UserInfo {
  switch (action.type) {
    case "UPDATE_USER_INFO":
      return {
        ...action.payload,
      };
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { auth, userId, nickname, profile } = state;
  // const [auth, setAuth] = useState<AuthState>({
  //   authMethod: null,
  //   authValue: null,
  // });
  // const [userId, setUserId] = useState<string>(""); // 고유 유저 ID (서비스 제공자마다 다름)
  // const [nickname, setNickname] = useState<string>("");
  // const [profile, setProfile] = useState<string>(
  //   "https://via.placeholder.com/150"
  // );
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
  }, []);

  // 초기 렌더링 시 높이 지정
  useSendHeight([userId, auth, nickname, profile]);
  return (
    <>
      <GlobalStyle />
      {!isValid && <Branding />}
      {isValid && (
        <>
          <LoginList>
            <NaverLogin />
            <TwitterLogin />
          </LoginList>
          <CommentList
            consumerID={splitted[1]}
            sequenceID={splitted[2]}
            userId={userId}
            auth={auth}
            nickname={nickname}
            profile={profile}
          />
        </>
      )}
    </>
  );
}

export default App;
