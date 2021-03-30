import { useEffect, useState } from "react";
import "normalize.css";
import GlobalStyle from "./GlobalStyles";
import CommentList from "./components/CommentList";
import NaverLogin from "./components/NaverLogin";
import { AuthState } from "./entity/AuthType";
import axios from "axios";
import { INaverProfileResult } from "./entity/NaverProfile";
import styled from "styled-components";

const splitted = window.location.pathname.split("/");
const isValid =
  splitted.length === 3 && splitted[1].length > 0 && splitted[2].length > 0;
const LoginList = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1em;
`;

function App() {
  const [auth, setAuth] = useState<AuthState>({
    authMethod: null,
    authValue: null,
  });
  const [userId, setUserId] = useState<string>(""); // 고유 유저 ID (서비스 제공자마다 다름)
  const [nickname, setNickname] = useState<string>("");
  const [profile, setProfile] = useState<string>(
    "https://via.placeholder.com/150"
  );
  // receive message
  useEffect(() => {
    function receiveMessage(event: MessageEvent<AuthState>) {
      if (event.origin !== window.origin) {
        console.warn(event.origin, "!==", window.origin);
        console.log(event.data);
        return;
      }
      // 닉네임, 프로필사진 설정
      if (event.data.authMethod) {
        const { authMethod, authValue } = event.data;
        switch (authMethod) {
          case "naver":
            axios
              .get<INaverProfileResult>("/auth/naver/profile", {
                headers: { Authorization: authValue.access_token },
              })
              .then(({ data }) => {
                // Auth 값 설정
                setAuth(event.data);
                if (data.response.id) {
                  setUserId(data.response.id);
                }
                if (data.response.nickname) {
                  setNickname(data.response.nickname);
                }
                if (data.response.profile_image) {
                  setProfile(data.response.profile_image);
                }
                // 팝업 창 닫히도록 설정
                (event.source as Window).close();
              });
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
  return (
    <>
      <GlobalStyle />
      {isValid && (
        <>
          <LoginList>
            <NaverLogin />
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
