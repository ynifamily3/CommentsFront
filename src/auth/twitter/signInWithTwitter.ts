import firebase from "firebase/app";
import { ITwitter } from "../../entity/AuthType";
import { getIdToken } from "../idToken";
import { twitterAuthProvider } from "./twitterAuthProvider";

async function signInWithTwitter(): Promise<ITwitter | null> {
  try {
    const result = await firebase.auth().signInWithPopup(twitterAuthProvider);
    const idToken = await getIdToken();
    const { user } = result;
    if (user && idToken) {
      const { uid, displayName, photoURL } = user;
      return { uid, displayName, photoURL, idToken };
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export { signInWithTwitter };
