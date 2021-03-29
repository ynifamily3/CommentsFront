import { useEffect, useState } from "react";
import "normalize.css";
import GlobalStyle from "./GlobalStyles";
import CommentList from "./components/CommentList";
import NaverLogin from "./components/NaverLogin";
import { AuthType, INaver } from "./entity/AuthType";
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
  const [authMethod, setAuthMethod] = useState<null | string>(null);
  const [authValue, setAuthValue] = useState<AuthType>(null);
  const [nickname, setNickname] = useState<string>(""); // 자기자신은 로컬스토리지와 동기가 안 되어서 본인용 state 주입
  const [profile, setProfile] = useState<string>(""); // 자기자신은 로컬스토리지와 동기가 안 되어서 본인용 state 주입
  // localStorage 변경 (로그인 등..) 감시
  useEffect(() => {
    const handler = () => {
      const authM = JSON.parse(
        localStorage.getItem("comments-api-auth-type") as string
      );
      switch (authM) {
        case "naver":
          try {
            const info = JSON.parse(
              localStorage.getItem("comments-api-naver-auth") as string
            ) as INaver;
            axios
              .get<INaverProfileResult>("/auth/naver/profile", {
                headers: { Authorization: info.access_token },
              })
              .then(({ data }) => {
                // 닉네임과 프로필사진 기본설정
                const nick = JSON.stringify(
                  data.response.nickname ? data.response.nickname : ""
                );
                const prof = JSON.stringify(
                  data.response.profile_image ? data.response.profile_image : ""
                );
                localStorage.setItem("comments-api-nickname", nick);
                localStorage.setItem("comments-api-profile-photo", prof);
                setAuthMethod(authM);
                setAuthValue(info);
                setNickname(
                  data.response.nickname ? data.response.nickname : ""
                );
                setProfile(
                  data.response.profile_image ? data.response.profile_image : ""
                );
              })
              .catch((error) => {
                // 닉네임과 프로필사진 초기화
                console.log(error);
                localStorage.removeItem("comments-api-nickname");
                localStorage.removeItem("comments-api-profile-photo");
                setNickname("");
                setProfile("");
                setAuthMethod(null);
                setAuthValue(null);
              });
          } catch (e) {
            localStorage.removeItem("comments-api-auth-type");
            localStorage.removeItem("comments-api-naver-auth");
            setNickname("");
            setProfile("");
            console.log("로컬스토리지 값 에러");
          }
          break;
        default:
          break;
      }
      // 새로운 닉네임과 프로필사진 받아오기
    };
    window.addEventListener("storage", handler);
    handler(); // 처음 한 번은 실행
    return () => {
      window.removeEventListener("storage", handler);
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
            authMethod={authMethod}
            authValue={authValue}
            nickname={nickname}
            profile={profile}
          />
        </>
      )}
    </>
  );
}

export default App;
