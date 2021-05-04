function TwitterLogin() {
  const handleClick = () => {
    window.open(
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_TWITTER_LOGIN_PAGE_PRODUCTION
        : process.env.REACT_APP_TWITTER_LOGIN_PAGE_DEVELOPMENT,
      "_blank",
      "width=500,height=600"
    );
  };
  return (
    <button
      className="btn-social-login"
      style={{ background: "#55ACEE" }}
      onClick={handleClick}
      title="트위터 로그인"
    >
      <i className="xi-2x xi-twitter"></i>
    </button>
  );
}

export default TwitterLogin;
