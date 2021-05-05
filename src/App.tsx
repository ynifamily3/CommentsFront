import { useReducer } from "react";
import "normalize.css";
import GlobalStyle from "./GlobalStyles";
import CommentList from "./components/CommentList";
import useSendHeight from "./hooks/useSendHeight";
import Branding from "./components/Branding";
import useSocialAuth from "./hooks/useSocialAuth";
import { UserInfo, UAction, BasicProps } from "./entity/UserInfo";

const splitted = window.location.pathname.split("/");
const isValid =
  splitted.length === 3 && splitted[1].length > 0 && splitted[2].length > 0;

const initialState: UserInfo = {
  auth: { authMethod: null, authValue: null },
  userId: "",
  nickname: "",
  profile: "https://via.placeholder.com/150",
};

function reducer(state: UserInfo, action: UAction): UserInfo {
  switch (action.type) {
    case "UPDATE_USER_INFO":
      return {
        ...action.payload,
      };
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { auth, userId, nickname, profile } = state;
  const combined: BasicProps = {
    state,
    consumerID: splitted[1],
    sequenceID: splitted[2],
  };

  useSocialAuth(dispatch);

  // 초기 렌더링 시 높이 지정
  useSendHeight([userId, auth, nickname, profile]);

  return (
    <>
      <GlobalStyle />
      {!isValid ? <Branding /> : <CommentList {...combined} />}
    </>
  );
}

export default App;
