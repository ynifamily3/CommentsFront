function TwitterLogin() {
  const loginURL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_TWITTER_LOGIN_PAGE_PRODUCTION
      : process.env.REACT_APP_TWITTER_LOGIN_PAGE_DEVELOPMENT;
  const handleTwitterButton = () => {
    window.open(loginURL, "_blank");
  };
  return (
    <div>
      <button onClick={handleTwitterButton}>
        <img
          src="https://cdn.cms-twdigitalassets.com/content/dam/developer-twitter/auth-docs/sign-in-with-twitter-gray.png.twimg.2560.png"
          title="트위터로 로그인"
          alt="트위터로 로그인"
        />
      </button>
    </div>
  );
}

export default TwitterLogin;
