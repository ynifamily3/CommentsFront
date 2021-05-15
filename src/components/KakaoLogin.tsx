function KakaoLogin() {
  const handleClick = () => {
    window.open(
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_KAKAO_LOGIN_PAGE_PRODUCTION
        : process.env.REACT_APP_KAKAO_LOGIN_PAGE_DEVELOPMENT,
      "_blank",
      "width=500,height=600"
    );
  };
  return (
    <button
      className="btn-social-login kakao"
      style={{ background: "#FEE500", color: "#000000" }}
      onClick={handleClick}
      title="카카오 로그인"
    >
      <i className="xi-2x xi-kakaotalk"></i>
    </button>
  );
}

export default KakaoLogin;
