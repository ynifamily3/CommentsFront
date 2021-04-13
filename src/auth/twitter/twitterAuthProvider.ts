import firebase from "firebase/app";
import "firebase/auth";

// 트위터 로그인 관련
var twitterAuthProvider = new firebase.auth.TwitterAuthProvider();

export { twitterAuthProvider };
