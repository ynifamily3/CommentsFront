import { signInWithTwitter } from "../auth/twitter/signInWithTwitter";
import { ITwitter } from "../entity/AuthType";

function TwitterLogin({
  callback,
}: {
  callback: (userInfo: ITwitter | null) => void;
}) {
  const handleTwitterButton = async () => {
    const info = await signInWithTwitter();
    callback(info);
  };
  const hd = () => {
    window.open("/handle_twitter.html", "_blank", "width=500,height=600");
  };
  return (
    <div style={{ width: 200 }}>
      <button onClick={hd}>열기</button>
      <a href="/" onClick={(e) => e.preventDefault()}>
        <img
          width="100%"
          onClick={handleTwitterButton}
          src="/twitter_button.png"
          title="트위터로 로그인"
          alt="트위터로 로그인"
        />
      </a>
    </div>
  );
}

export default TwitterLogin;
