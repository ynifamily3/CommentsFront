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
