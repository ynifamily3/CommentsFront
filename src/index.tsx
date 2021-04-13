import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import AxiosConfigure from "./repo/_axios";
import dotenv from "dotenv";
import firebase from "firebase/app";

dotenv.config();

const firebaseConfig = {
  apiKey: "AIzaSyAAP1QQDn0qKTVodYmiSb7-nCWoLXsYihY",
  authDomain: "roco-17948.firebaseapp.com",
  projectId: "roco-17948",
  storageBucket: "roco-17948.appspot.com",
  messagingSenderId: "731455134402",
  appId: "1:731455134402:web:2da23e1a8bd7adfda5395b",
  measurementId: "G-23P8DCE0XY",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

AxiosConfigure();

ReactDOM.render(<App />, document.getElementById("root"));
