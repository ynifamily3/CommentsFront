import { ITwitter } from "../entity/AuthType";

function TwitterLogin() {
  const hd = () => {
    window.open(
      "http://localhost:8081/auth/twitter",
      "_blank",
      "width=500,height=600"
    );
  };
  return (
    <div style={{ width: 200 }}>
      <a href="/" onClick={(e) => e.preventDefault()}>
        <img
          width="100%"
          onClick={hd}
          src="/twitter_button.png"
          title="트위터로 로그인"
          alt="트위터로 로그인"
        />
      </a>
    </div>
  );
}

export default TwitterLogin;
