import firebase from "firebase/app";
import "firebase/auth";

// firebase 로 로그인 한 유저의 id Token을 가져옵니다.
async function getIdToken() {
  try {
    const idToken = await firebase.auth().currentUser?.getIdToken(true);
    if (idToken) return idToken;
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export { getIdToken };
