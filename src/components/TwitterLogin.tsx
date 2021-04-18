function TwitterLogin() {
  const handleClick = () => {
    window.open(
      process.env.NODE_ENV === "production"
        ? "https://auth.roco.moe/auth/twitter"
        : "http://localhost:8081/auth/twitter",
      "_blank",
      "width=500,height=600"
    );
  };
  return (
    <div style={{ width: 200 }}>
      <a href="/" onClick={(e) => e.preventDefault()}>
        <img
          width="100%"
          onClick={handleClick}
          src="/twitter_button.png"
          title="트위터로 로그인"
          alt="트위터로 로그인"
        />
      </a>
    </div>
  );
}

export default TwitterLogin;
