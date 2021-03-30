import { FC, useLayoutEffect } from "react";

declare global {
  interface Window {
    naver_id_login: any;
  }
}

const callbackURL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_NAVER_CALLBACK_URL_PRODUCTION
    : process.env.REACT_APP_NAVER_CALLBACK_URL_DEVELOPMENT;

const NaverLogin: FC = () => {
  useLayoutEffect(() => {
    if (!process.env.REACT_APP_NAVER_CLIENT_ID) {
      alert("네아로 - Client ID가 없습니다.");
      return;
    }
    var naver_id_login = new window.naver_id_login(
      process.env.REACT_APP_NAVER_CLIENT_ID,
      callbackURL
    );
    naver_id_login.setButton("green", 3, 40);
    naver_id_login.setDomain(
      process.env.NODE_ENV === "production"
        ? "https://roco.moe"
        : "http://localhost:3000"
    );
    naver_id_login.setPopup();
    naver_id_login.init_naver_id_login();
  }, []);
  return (
    <>
      <div id="naver_id_login">네이버 아이디로 로그인</div>
    </>
  );
};

export default NaverLogin;
